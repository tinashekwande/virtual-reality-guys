"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/confirm-provider";
import { equipmentSalesTotals, todayStr, valueSale } from "@/lib/accounts/calc";
import type { EquipmentSale, ExpenseItem, PaymentMethod } from "@/types";
import type { EquipmentItem } from "@/types/ai";

const rand = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const NONE = "__none__";

const BASIS_LABEL: Record<string, string> = {
  "purchase record": "Cost less wear, from the purchase record",
  "original cost": "Original cost you entered",
  "already expensed": "Bought as a running cost, so already counted",
  unknown: "Cost unknown: the whole price counts as profit",
};

interface Props {
  sales: EquipmentSale[];
  expenses: ExpenseItem[];
  equipment: EquipmentItem[];
  onChanged: () => void;
}

export default function EquipmentSalesTab({ sales, expenses, equipment, onChanged }: Props) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [soldOn, setSoldOn] = useState(todayStr());
  const [buyer, setBuyer] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("EFT");
  const [equipmentId, setEquipmentId] = useState(NONE);
  const [purchaseId, setPurchaseId] = useState(NONE);
  const [originalCost, setOriginalCost] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totals = useMemo(() => equipmentSalesTotals(sales, expenses), [sales, expenses]);
  const activeEquipment = useMemo(() => equipment.filter((e) => e.status !== "retired"), [equipment]);
  // Purchases that could be the item being sold: equipment bought to keep that has not been sold already
  const purchases = useMemo(
    () => expenses.filter((e) => e.kind === "asset" && !e.disposed_on).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [expenses]
  );

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setPrice("");
    setSoldOn(todayStr());
    setBuyer("");
    setMethod("EFT");
    setEquipmentId(NONE);
    setPurchaseId(NONE);
    setOriginalCost("");
    setNotes("");
  }, [open]);

  // Live preview of the profit or loss before saving
  const preview = useMemo(() => {
    if (!price || Number(price) <= 0) return null;
    return valueSale(
      {
        id: "preview",
        title,
        sale_price: Number(price),
        sold_on: soldOn,
        method,
        asset_expense_id: purchaseId === NONE ? null : purchaseId,
        original_cost: purchaseId === NONE && originalCost !== "" ? Number(originalCost) : null,
      },
      expenses
    );
  }, [price, soldOn, purchaseId, originalCost, title, method, expenses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) return toast.error("Enter what it sold for.");
    if (!title.trim() && equipmentId === NONE) return toast.error("Say what was sold, or pick the item from the fleet.");
    setSaving(true);
    try {
      const res = await fetch("/api/equipment-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          sale_price: Number(price),
          sold_on: soldOn,
          buyer: buyer.trim() || null,
          method,
          equipment_id: equipmentId === NONE ? null : equipmentId,
          asset_expense_id: purchaseId === NONE ? null : purchaseId,
          original_cost: purchaseId === NONE && originalCost !== "" ? Number(originalCost) : null,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not record the sale.");
      toast.success("Sale recorded.");
      setOpen(false);
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not record the sale.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: EquipmentSale) => {
    const ok = await confirm({
      title: "Remove this sale?",
      description: `${s.title} (${rand(Number(s.sale_price))} on ${s.sold_on}) will be removed. If it was linked to a purchase, that item starts counting wear again. A retired fleet item stays retired: change it on the Equipment page if needed.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setDeletingId(s.id);
    try {
      const res = await fetch(`/api/equipment-sales/${s.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not remove the sale.");
      toast.success("Sale removed.");
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not remove the sale.");
    } finally {
      setDeletingId(null);
    }
  };

  const equipmentName = (id?: string | null) => equipment.find((e) => e.id === id)?.name;
  const purchaseLabel = (e: ExpenseItem) => `${e.title}: ${rand(Number(e.amount))} (${e.date})`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/70 p-4 rounded-2xl border border-emerald-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cash from sales</p>
          <p className="text-2xl font-bold font-sans tabular-nums text-emerald-400 pt-1">{rand(totals.cash)}</p>
          <p className="text-[10px] text-muted-foreground">Kept apart from booking revenue</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-purple-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Profit / loss on sales</p>
          <p className={`text-2xl font-bold font-sans tabular-nums pt-1 ${totals.gain >= 0 ? "text-purple-400" : "text-rose-400"}`}>{rand(totals.gain)}</p>
          <p className="text-[10px] text-muted-foreground">Sale price minus what it was still worth. Included in net profit.</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Items sold</p>
            <p className="text-2xl font-bold font-sans tabular-nums pt-1">{totals.count}</p>
          </div>
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground text-xs">
            <Plus className="h-4 w-4 mr-1" /> Record sale
          </Button>
        </div>
      </div>

      <div className="bg-card/70 rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Item</th>
              <th className="text-right p-3">Sold for</th>
              <th className="text-right p-3">Still worth</th>
              <th className="text-right p-3">Profit / loss</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No equipment sold yet. Use Record sale when you sell a headset or other gear.
                </td>
              </tr>
            )}
            {sales.map((s) => {
              const v = valueSale(s, expenses);
              return (
                <tr key={s.id} className="border-b border-border/50 align-top">
                  <td className="p-3 tabular-nums whitespace-nowrap">{s.sold_on}</td>
                  <td className="p-3">
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {[s.buyer && `Buyer: ${s.buyer}`, s.method, equipmentName(s.equipment_id) && `Fleet: ${equipmentName(s.equipment_id)}`].filter(Boolean).join(" · ")}
                    </p>
                    {v.basis === "unknown" && (
                      <p className="text-[10px] text-amber-400 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="h-3 w-3" /> Cost unknown: link the purchase or remove and re-enter with its original cost
                      </p>
                    )}
                    {s.notes && <p className="text-[10px] text-muted-foreground pt-0.5">{s.notes}</p>}
                  </td>
                  <td className="p-3 text-right tabular-nums text-emerald-400">{rand(Number(s.sale_price))}</td>
                  <td className="p-3 text-right tabular-nums" title={BASIS_LABEL[v.basis]}>{rand(v.bookValue)}</td>
                  <td className={`p-3 text-right tabular-nums font-semibold ${v.gain >= 0 ? "text-purple-400" : "text-rose-400"}`}>{rand(v.gain)}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" disabled={deletingId === s.id} onClick={() => handleDelete(s)} title="Remove (entered by mistake)">
                      <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Tag className="h-4 w-4" /> Record equipment sale</DialogTitle>
            <DialogDescription>Money from selling gear, kept separate from booking revenue so event income stays accurate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Fleet item sold (it will be marked retired)</label>
              <Select value={equipmentId} onValueChange={setEquipmentId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Not in the fleet list / not sure</SelectItem>
                  {activeEquipment.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}{e.serial_number ? ` (${e.serial_number})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">What was sold</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={equipmentId !== NONE ? "Leave blank to use the fleet item's name" : "e.g. Meta Quest 2 headset"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Sold for (R)</label>
                <Input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Date sold</label>
                <Input type="date" value={soldOn} onChange={(e) => setSoldOn(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Buyer</label>
                <Input value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Paid by</label>
                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["EFT", "Cash", "Card", "Other"] as PaymentMethod[]).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">When it was bought (purchase expense)</label>
              <Select value={purchaseId} onValueChange={setPurchaseId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Not on record (bought before the portal)</SelectItem>
                  {purchases.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{purchaseLabel(e)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {purchaseId === NONE && (
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">What it originally cost (R), if you know</label>
                <Input type="number" min={0} step="0.01" value={originalCost} onChange={(e) => setOriginalCost(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Leave blank if unknown" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Notes</label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            {preview && (
              <div className="rounded-xl border border-border p-3 text-xs space-y-0.5">
                <p>Still worth on the books: <span className="tabular-nums font-semibold">{rand(preview.bookValue)}</span></p>
                <p>
                  {preview.gain >= 0 ? "Profit" : "Loss"} on this sale:{" "}
                  <span className={`tabular-nums font-semibold ${preview.gain >= 0 ? "text-purple-400" : "text-rose-400"}`}>{rand(Math.abs(preview.gain))}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">{BASIS_LABEL[preview.basis]}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">{saving ? "Saving..." : "Record sale"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
