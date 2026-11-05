"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { Invoice, PaymentItem } from "@/types";

const money = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
const isUnverified = (p: PaymentItem) => /please verify/i.test(p.notes || "");

interface Props {
  invoices: Invoice[];
  payments: PaymentItem[];
  /** Cash received minus everything paid out, as the portal sees it */
  cashPosition: number;
  onChanged: () => void | Promise<void>;
}

/** Check every payment against the bank statement, fix the amounts, and compare the total with the real balance. */
export default function ReconcileTab({ invoices, payments, cashPosition, onChanged }: Props) {
  const [bank, setBank] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("vrg-bank-balance");
      if (v) setBank(v);
    } catch {}
  }, []);
  const saveBank = (v: string) => {
    setBank(v);
    try {
      window.localStorage.setItem("vrg-bank-balance", v);
    } catch {}
  };

  const clientOf = useMemo(() => {
    const m = new Map<string, Invoice>();
    invoices.forEach((i) => m.set(i.id, i));
    return m;
  }, [invoices]);

  const rows = useMemo(
    () => [...payments].sort((a, b) => Number(isUnverified(b)) - Number(isUnverified(a)) || b.paid_on.localeCompare(a.paid_on)),
    [payments]
  );
  const unverified = rows.filter(isUnverified);
  const unverifiedTotal = unverified.reduce((a, p) => a + Number(p.amount), 0);

  const bankNum = bank.trim() === "" ? null : Number(bank.replace(/[^\d.-]/g, ""));
  const diff = bankNum !== null && Number.isFinite(bankNum) ? bankNum - cashPosition : null;

  const call = async (id: string, init: RequestInit, okMsg: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/payments/${id}`, { ...init, headers: { "Content-Type": "application/json" } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save");
      toast.success(okMsg);
      await onChanged();
      setEditingId(null);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  const confirm = (p: PaymentItem) =>
    call(p.id, { method: "PUT", body: JSON.stringify({ notes: `Confirmed against bank statement on ${new Date().toISOString().slice(0, 10)}` }) }, "Marked as confirmed");

  const saveEdit = (p: PaymentItem) =>
    call(
      p.id,
      {
        method: "PUT",
        body: JSON.stringify({
          amount: editAmount,
          paid_on: editDate,
          notes: `Corrected and confirmed against bank statement on ${new Date().toISOString().slice(0, 10)}`,
        }),
      },
      "Payment corrected"
    );

  const remove = (p: PaymentItem) => {
    if (!window.confirm("Remove this payment? Use this if the money was never received.")) return;
    call(p.id, { method: "DELETE" }, "Payment removed");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-card/70 rounded-xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Portal says you should have</p>
          <p className="font-mono font-bold text-lg text-foreground">{money(cashPosition)}</p>
          <p className="text-[10px] text-muted-foreground">money received minus everything paid out</p>
        </div>
        <div className="bg-card/70 rounded-xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Actual bank balance</p>
          <Input
            inputMode="decimal"
            value={bank}
            onChange={(e) => saveBank(e.target.value)}
            placeholder="Type what your account shows"
            className="mt-1 h-8 text-xs"
          />
          <p className="text-[10px] text-muted-foreground mt-1">Saved on this device only.</p>
        </div>
        <div className={`rounded-xl border p-4 ${diff === null ? "bg-card/70 border-border" : Math.abs(diff) < 0.5 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Difference</p>
          {diff === null ? (
            <p className="text-muted-foreground pt-1">Enter your bank balance to compare.</p>
          ) : Math.abs(diff) < 0.5 ? (
            <p className="font-mono font-bold text-lg text-emerald-400">Matches</p>
          ) : (
            <>
              <p className="font-mono font-bold text-lg text-amber-400">{diff > 0 ? "+" : "-"}{money(Math.abs(diff))}</p>
              <p className="text-[10px] text-muted-foreground">
                {diff > 0 ? "Bank has more than the portal expects: a payment or income is missing or too low." : "Bank has less than the portal expects: a payment is overstated, or an expense isn't logged."}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between text-xs">
          <p className="font-semibold">
            Payments to check against your bank statement
            {unverified.length > 0 && <span className="ml-2 text-amber-400">{unverified.length} unchecked ({money(unverifiedTotal)})</span>}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Client</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No payments recorded yet.</td></tr>
              )}
              {rows.map((p) => {
                const inv = clientOf.get(p.invoice_id);
                const unchecked = isUnverified(p);
                const editing = editingId === p.id;
                return (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5 px-4 font-mono">
                      {editing ? <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="h-8 text-xs w-36" /> : p.paid_on}
                    </td>
                    <td className="py-2.5 px-4">{inv?.client_name || "Unknown"}<span className="text-muted-foreground"> · {p.method}</span></td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      {editing ? <Input inputMode="decimal" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-8 text-xs w-28 ml-auto text-right" /> : money(Number(p.amount))}
                    </td>
                    <td className="py-2.5 px-4">
                      {unchecked ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border bg-amber-500/10 text-amber-400 border-amber-500/30" title={p.notes || ""}>Estimated · check</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/30" title={p.notes || ""}>Recorded</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex justify-end gap-1.5">
                        {editing ? (
                          <>
                            <Button size="sm" className="h-7 text-[11px]" disabled={busyId === p.id} onClick={() => saveEdit(p)}><Check className="h-3 w-3 mr-1" />Save</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setEditingId(null)}><X className="h-3 w-3" /></Button>
                          </>
                        ) : (
                          <>
                            {unchecked && (
                              <Button size="sm" variant="outline" className="h-7 text-[11px]" disabled={busyId === p.id} onClick={() => confirm(p)}>
                                <Check className="h-3 w-3 mr-1" />Correct
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => { setEditingId(p.id); setEditAmount(String(p.amount)); setEditDate(p.paid_on); }}>
                              <Pencil className="h-3 w-3 mr-1" />Edit
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] text-rose-400" disabled={busyId === p.id} onClick={() => remove(p)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
