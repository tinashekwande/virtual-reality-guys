"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, Banknote, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-provider";
import { summarisePayments, todayStr } from "@/lib/accounts/calc";
import type { Invoice, PaymentItem, PaymentMethod } from "@/types";

const rand = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  invoice: Invoice | null;
  payments: PaymentItem[];
  open: boolean;
  onClose: () => void;
  /** Called after a payment is added or removed so the parent can reload */
  onChanged: () => void;
}

export default function PaymentsDialog({ invoice, payments, open, onClose, onChanged }: Props) {
  const confirm = useConfirm();
  const [amount, setAmount] = useState<number | "">("");
  const [paidOn, setPaidOn] = useState(todayStr());
  const [method, setMethod] = useState<PaymentMethod>("EFT");
  const [reference, setReference] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const mine = useMemo(() => (invoice ? payments.filter((p) => p.invoice_id === invoice.id) : []), [invoice, payments]);
  const summary = useMemo(() => (invoice ? summarisePayments(invoice, mine) : null), [invoice, mine]);

  // Suggest the next sensible amount: the rest of the deposit first, otherwise the full balance
  useEffect(() => {
    if (!open || !summary) return;
    const toDeposit = Math.max(0, summary.depositRequired - summary.received);
    setAmount(toDeposit > 0.005 ? Number(toDeposit.toFixed(2)) : Number(summary.balance.toFixed(2)) || "");
    setPaidOn(todayStr());
    setMethod("EFT");
    setReference("");
    setNotes("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoice?.id, mine.length]);

  if (!invoice || !summary) return null;

  const canAdd = invoice.type === "invoice" && invoice.status !== "cancelled";

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter the amount received.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoice.id,
          amount: Number(amount),
          paid_on: paidOn,
          method,
          reference,
          received_by: receivedBy,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not record the payment.");
      toast.success(`Payment of ${rand(Number(amount))} recorded.`);
      setReference("");
      setNotes("");
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not record the payment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: PaymentItem) => {
    const ok = await confirm({
      title: "Remove this payment?",
      description: `${rand(Number(p.amount))} on ${p.paid_on} will be removed and the invoice status will update to match. Only do this if it was entered by mistake.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setDeletingId(p.id);
    try {
      const res = await fetch(`/api/payments/${p.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not remove the payment.");
      toast.success("Payment removed.");
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not remove the payment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-tech">
            <Banknote className="h-5 w-5 text-primary" /> Payments: {invoice.client_name}
          </DialogTitle>
          <DialogDescription>
            {invoice.doc_number} · Total {rand(summary.total)}
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Received</p>
            <p className="font-mono font-bold text-emerald-400 text-sm">{rand(summary.received)}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance due</p>
            <p className={`font-mono font-bold text-sm ${summary.balance > 0 ? "text-amber-400" : "text-emerald-400"}`}>{rand(summary.balance)}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deposit ({invoice.deposit_percentage ?? 50}%)</p>
            <p className={`font-mono font-bold text-sm ${summary.depositMet ? "text-emerald-400" : "text-foreground"}`}>
              {rand(summary.depositRequired)} {summary.depositMet ? "✓" : ""}
            </p>
          </div>
        </div>

        {summary.overdue && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Overdue: {rand(summary.balance)} was due on {invoice.due_date?.split("T")[0]}.
          </div>
        )}

        {/* History */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment history</p>
          {mine.length === 0 ? (
            <p className="text-xs text-muted-foreground rounded-xl border border-dashed border-border p-4 text-center">
              No payments recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-border/60 rounded-xl border border-border">
              {mine
                .slice()
                .sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1))
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-emerald-400">{rand(Number(p.amount))}</p>
                      <p className="text-muted-foreground truncate">
                        {p.paid_on} · {p.method}
                        {p.reference ? ` · ref ${p.reference}` : ""}
                        {p.received_by ? ` · received by ${p.received_by}` : ""}
                      </p>
                      {p.notes && <p className="text-[10px] text-muted-foreground/80 truncate">{p.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p.id}
                      title="Remove (entered by mistake)"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Add payment */}
        {canAdd ? (
          <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-border p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Record a payment received</p>
            <div className="flex flex-wrap gap-2">
              {summary.depositRequired - summary.received > 0.005 && (
                <Button type="button" size="sm" variant="outline" className="text-[11px] h-7"
                  onClick={() => setAmount(Number((summary.depositRequired - summary.received).toFixed(2)))}>
                  Deposit {rand(summary.depositRequired - summary.received)}
                </Button>
              )}
              {summary.balance > 0.005 && (
                <Button type="button" size="sm" variant="outline" className="text-[11px] h-7"
                  onClick={() => setAmount(Number(summary.balance.toFixed(2)))}>
                  Full balance {rand(summary.balance)}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Amount (R)</label>
                <Input type="number" step="0.01" min="0" value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Date received</label>
                <Input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Method</label>
                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["EFT", "Cash", "Card", "Other"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Received by (who got the money)</label>
                <Input placeholder="e.g. Panashe" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Bank reference</label>
              <Input placeholder="Reference on the EFT, if any" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Notes</label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground font-semibold">
              <Plus className="h-4 w-4 mr-1.5" /> {saving ? "Saving..." : "Record payment"}
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            {invoice.type === "quote" ? "This is a quote. Convert it to an invoice to record payments." : "This invoice is cancelled."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
