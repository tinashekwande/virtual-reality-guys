"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { payeeTotals, todayStr } from "@/lib/accounts/calc";
import type { ExpenseItem, Invoice } from "@/types";

const rand = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface Props {
  expenses: ExpenseItem[];
  invoices: Invoice[];
  onChanged: () => void;
  onAdd: () => void;
  onEdit: (e: ExpenseItem) => void;
}

export default function PayoutsTab({ expenses, invoices, onChanged, onAdd, onEdit }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("all");

  const wages = useMemo(() => expenses.filter((e) => e.category === "Staff Wages"), [expenses]);
  const people = useMemo(() => payeeTotals(expenses), [expenses]);
  const totalOwed = people.reduce((a, p) => a + p.owed, 0);
  const totalPaid = people.reduce((a, p) => a + p.paid, 0);

  const nameOf = (e: ExpenseItem) => (e.payee || e.title || "Unnamed").trim();
  const rows = useMemo(
    () =>
      wages
        .filter((e) => selected === "all" || nameOf(e).toLowerCase() === selected.toLowerCase())
        .sort((a, b) => ((a.payment_status === "owed" ? 0 : 1) - (b.payment_status === "owed" ? 0 : 1)) || (a.date < b.date ? 1 : -1)),
    [wages, selected]
  );

  const markPaid = async (e: ExpenseItem) => {
    setBusyId(e.id);
    try {
      const res = await fetch(`/api/expenses/${e.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "paid", paid_on: todayStr(), payee: e.payee || e.title }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not update.");
      toast.success(`${nameOf(e)} marked as paid.`);
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not update.");
    } finally {
      setBusyId(null);
    }
  };

  const bookingLabel = (e: ExpenseItem) => {
    const inv = invoices.find((i) => i.id === e.invoice_id);
    return inv ? `${inv.client_name} (${inv.doc_number})` : e.event_id ? "Event" : "-";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/70 p-4 rounded-2xl border border-amber-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Still owed to team</p>
          <p className="text-2xl font-bold font-sans tabular-nums text-amber-400 pt-1">{rand(totalOwed)}</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-emerald-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Paid out so far</p>
          <p className="text-2xl font-bold font-sans tabular-nums text-emerald-400 pt-1">{rand(totalPaid)}</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-border flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Team members paid</p>
            <p className="text-2xl font-bold font-sans tabular-nums pt-1">{people.length}</p>
          </div>
          <Button onClick={onAdd} className="bg-primary text-primary-foreground text-xs">Add payout</Button>
        </div>
      </div>

      {/* Per person */}
      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2 text-sm font-bold font-tech text-primary uppercase tracking-wider">
          <Users className="h-4 w-4" /> By person
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Person</th>
              <th className="py-3 px-4 text-right">Jobs</th>
              <th className="py-3 px-4 text-right">Paid</th>
              <th className="py-3 px-4 text-right">Owed</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {people.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No staff payouts yet. Use "Add payout".</td></tr>
            ) : (
              people.map((p) => (
                <tr key={p.payee} className={selected.toLowerCase() === p.payee.toLowerCase() ? "bg-secondary/40" : ""}>
                  <td className="py-3 px-4 font-semibold">{p.payee}</td>
                  <td className="py-3 px-4 text-right font-sans tabular-nums">{p.count}</td>
                  <td className="py-3 px-4 text-right font-sans tabular-nums text-emerald-400">{rand(p.paid)}</td>
                  <td className={`py-3 px-4 text-right font-sans tabular-nums ${p.owed > 0 ? "text-amber-400 font-bold" : "text-muted-foreground"}`}>{rand(p.owed)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-[11px] text-primary hover:underline"
                      onClick={() => setSelected(selected.toLowerCase() === p.payee.toLowerCase() ? "all" : p.payee)}
                    >
                      {selected.toLowerCase() === p.payee.toLowerCase() ? "Show all" : "Show jobs"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Individual payouts */}
      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border text-sm font-bold font-tech text-primary uppercase tracking-wider">
          Payouts {selected !== "all" ? `· ${selected}` : ""}
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Person</th>
              <th className="py-3 px-4">Booking</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nothing to show.</td></tr>
            ) : (
              rows.map((e) => {
                const owed = e.payment_status === "owed";
                return (
                  <tr key={e.id} className="hover:bg-secondary/30">
                    <td className="py-3 px-4 font-sans tabular-nums">{e.date}</td>
                    <td className="py-3 px-4 font-semibold cursor-pointer hover:text-primary" onClick={() => onEdit(e)}>{nameOf(e)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{bookingLabel(e)}</td>
                    <td className="py-3 px-4 text-right font-sans tabular-nums font-bold">{rand(Number(e.amount))}</td>
                    <td className="py-3 px-4">
                      {owed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-amber-500/10 text-amber-400 border-amber-500/30">
                          <Clock className="h-3 w-3" /> Owed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Paid{e.paid_on ? ` ${e.paid_on}` : ""}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {owed && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" disabled={busyId === e.id} onClick={() => markPaid(e)}>
                          Mark paid
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
