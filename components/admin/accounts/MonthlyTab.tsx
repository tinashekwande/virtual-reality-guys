"use client";

import React, { useMemo } from "react";
import { Download, CalendarDays, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { monthlyRollup, summarisePayments, toCsv, totalExpenses, depreciationToDate, todayStr } from "@/lib/accounts/calc";
import type { ExpenseItem, Invoice, PaymentItem } from "@/types";

const rand = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function download(name: string, csv: string) {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const monthLabel = (k: string) => {
  const [y, m] = k.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
};

interface Props {
  invoices: Invoice[];
  payments: PaymentItem[];
  expenses: ExpenseItem[];
  onOpenPayments: (inv: Invoice) => void;
}

export default function MonthlyTab({ invoices, payments, expenses, onOpenPayments }: Props) {
  const today = todayStr();
  const months = useMemo(() => monthlyRollup(payments, expenses, today), [payments, expenses, today]);
  const totals = useMemo(() => totalExpenses(expenses, today), [expenses, today]);
  const received = payments.reduce((a, p) => a + Number(p.amount || 0), 0);

  const owing = useMemo(
    () =>
      invoices
        .filter((i) => i.type === "invoice" && i.status !== "cancelled")
        .map((inv) => ({ inv, s: summarisePayments(inv, payments, today) }))
        .filter((x) => x.s.balance > 0.005)
        .sort((a, b) => Number(b.s.overdue) - Number(a.s.overdue) || ((a.inv.due_date || "9999") < (b.inv.due_date || "9999") ? -1 : 1)),
    [invoices, payments, today]
  );
  const totalOwing = owing.reduce((a, x) => a + x.s.balance, 0);
  const overdueTotal = owing.filter((x) => x.s.overdue).reduce((a, x) => a + x.s.balance, 0);

  const invoiceLabel = (id: string) => {
    const i = invoices.find((x) => x.id === id);
    return i ? `${i.doc_number} ${i.client_name}` : id;
  };

  const exportMonthly = () => {
    download(
      `VR_Guys_Monthly_Summary_${today}.csv`,
      toCsv(
        ["Month", "Cash received", "Running costs", "Equipment cost spread (depreciation)", "Net profit", "Equipment bought (cash out)", "Payments received (count)"],
        months.map((m) => [m.month, m.received, m.runningCosts, m.depreciation, m.net, m.assetPurchases, m.paymentsCount])
      )
    );
    toast.success("Monthly summary exported.");
  };

  const exportPayments = () => {
    download(
      `VR_Guys_Payments_${today}.csv`,
      toCsv(
        ["Date received", "Invoice", "Amount", "Method", "Reference", "Received by", "Notes"],
        payments.slice().sort((a, b) => (a.paid_on < b.paid_on ? 1 : -1)).map((p) => [p.paid_on, invoiceLabel(p.invoice_id), p.amount, p.method, p.reference, p.received_by, p.notes])
      )
    );
    toast.success("Payments exported.");
  };

  const exportExpenses = () => {
    download(
      `VR_Guys_Expenses_${today}.csv`,
      toCsv(
        ["Date", "Title", "Category", "Type", "Amount", "Cost counted to date", "Paid to", "Payment status", "Booking", "Overhead", "Receipt attached", "Notes"],
        expenses.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).map((e) => [
          e.date, e.title, e.category, e.kind === "asset" ? "Equipment purchase" : "Running cost", e.amount,
          e.kind === "asset" ? depreciationToDate(e, today) : e.amount,
          e.payee || "", e.payment_status || "paid",
          e.invoice_id ? invoiceLabel(e.invoice_id) : e.event_id ? "Event" : "", e.is_overhead ? "Yes" : "",
          e.receipt_path ? "Yes" : "No", e.notes,
        ])
      )
    );
    toast.success("Expenses exported.");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card/70 p-4 rounded-2xl border border-emerald-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cash received (all time)</p>
          <p className="text-xl font-bold font-sans tabular-nums text-emerald-400 pt-1">{rand(received)}</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-amber-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Still owed to us</p>
          <p className="text-xl font-bold font-sans tabular-nums text-amber-400 pt-1">{rand(totalOwing)}</p>
          {overdueTotal > 0 && <p className="text-[10px] text-rose-400 pt-1">{rand(overdueTotal)} overdue</p>}
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-rose-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Costs (running + equipment used)</p>
          <p className="text-xl font-bold font-sans tabular-nums text-rose-400 pt-1">{rand(totals.costs)}</p>
        </div>
        <div className="bg-card/70 p-4 rounded-2xl border border-purple-500/30">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Profit</p>
          <p className={`text-xl font-bold font-sans tabular-nums pt-1 ${received - totals.costs >= 0 ? "text-purple-400" : "text-rose-400"}`}>{rand(received - totals.costs)}</p>
        </div>
      </div>

      {/* Month table */}
      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold font-tech text-primary uppercase tracking-wider">
            <CalendarDays className="h-4 w-4" /> Month by month
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-[11px] h-8" onClick={exportMonthly}><Download className="h-3.5 w-3.5 mr-1" /> Monthly summary</Button>
            <Button size="sm" variant="outline" className="text-[11px] h-8" onClick={exportPayments}><Download className="h-3.5 w-3.5 mr-1" /> Payments</Button>
            <Button size="sm" variant="outline" className="text-[11px] h-8" onClick={exportExpenses}><Download className="h-3.5 w-3.5 mr-1" /> Expenses</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Cash received</th>
                <th className="py-3 px-4 text-right">Running costs</th>
                <th className="py-3 px-4 text-right">Equipment used</th>
                <th className="py-3 px-4 text-right">Profit</th>
                <th className="py-3 px-4 text-right">Equipment bought</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {months.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No payments or expenses recorded yet.</td></tr>
              ) : (
                months.map((m) => (
                  <tr key={m.month} className="hover:bg-secondary/30">
                    <td className="py-3 px-4 font-semibold">{monthLabel(m.month)}</td>
                    <td className="py-3 px-4 text-right font-sans tabular-nums text-emerald-400">{rand(m.received)}</td>
                    <td className="py-3 px-4 text-right font-sans tabular-nums text-rose-400">{rand(m.runningCosts)}</td>
                    <td className="py-3 px-4 text-right font-sans tabular-nums text-rose-300">{rand(m.depreciation)}</td>
                    <td className={`py-3 px-4 text-right font-sans tabular-nums font-bold ${m.net >= 0 ? "text-purple-400" : "text-rose-400"}`}>{rand(m.net)}</td>
                    <td className="py-3 px-4 text-right font-sans tabular-nums text-muted-foreground">{m.assetPurchases > 0 ? rand(m.assetPurchases) : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-3 text-[10px] text-muted-foreground border-t border-border">
          Cash is counted in the month the payment was received. Equipment you bought to keep ({rand(totals.assetPurchases)} so far) is spread over its life instead of counted all at once.
        </p>
      </div>

      {/* Money owed */}
      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border text-sm font-bold font-tech text-primary uppercase tracking-wider">Money owed to us</div>
        <table className="w-full text-xs text-left">
          <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Due</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right">Received</th>
              <th className="py-3 px-4 text-right">Balance</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {owing.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nobody owes you anything right now.</td></tr>
            ) : (
              owing.map(({ inv, s }) => (
                <tr key={inv.id} className="hover:bg-secondary/30">
                  <td className="py-3 px-4"><p className="font-semibold">{inv.client_name}</p><p className="text-[10px] text-muted-foreground">{inv.doc_number}</p></td>
                  <td className="py-3 px-4 font-sans tabular-nums">
                    {inv.due_date ? inv.due_date.split("T")[0] : "-"}
                    {s.overdue && <span className="ml-2 inline-flex items-center gap-1 text-rose-400 font-bold"><AlertCircle className="h-3 w-3" />overdue</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-sans tabular-nums">{rand(s.total)}</td>
                  <td className="py-3 px-4 text-right font-sans tabular-nums text-emerald-400">{rand(s.received)}</td>
                  <td className="py-3 px-4 text-right font-sans tabular-nums font-bold text-amber-400">{rand(s.balance)}</td>
                  <td className="py-3 px-4 text-right"><Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => onOpenPayments(inv)}>Payments</Button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
