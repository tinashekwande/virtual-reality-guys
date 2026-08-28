"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, Calendar, Plus, Search,
  Download, Filter, ArrowUpRight, ArrowDownRight, PieChart, BarChart3,
  Receipt, Flag, Edit, Trash2, CheckCircle2, AlertCircle, Save, X, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EventItem, ExpenseItem, ExpenseCategory, Invoice } from "@/types";

export default function AccountingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"all" | "this_month" | "last_month" | "quarter" | "year">("all");
  const [entryFilter, setEntryFilter] = useState<"all" | "invoices" | "events">("all");

  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("Staff Wages");
  const [expenseAmount, setExpenseAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseTargetId, setExpenseTargetId] = useState<string>("general");
  const [expenseNotes, setExpenseNotes] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Fetch all financial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, evtRes, expRes] = await Promise.all([
        fetch("/api/invoices").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/events").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/expenses").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);

      setInvoices(Array.isArray(invRes) ? invRes : []);
      setEvents(Array.isArray(evtRes) ? evtRes : []);
      setExpenses(Array.isArray(expRes) ? expRes : []);
    } catch (err: any) {
      toast.error("Failed to load accounting data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combine Invoices and Standalone Events into a Unified Financial Ledger
  const ledgerItems = useMemo(() => {
    const items: Array<{
      id: string;
      kind: "invoice" | "event";
      title: string;
      date: string;
      category: string;
      status: string;
      revenue: number;
      expenses: number;
      netProfit: number;
      margin: number;
      raw: any;
    }> = [];

    // 1. Process Client Invoices
    invoices.forEach((inv) => {
      // Calculate revenue based on status
      let rev = 0;
      if (inv.status === "paid") {
        rev = Number(inv.total) || 0;
      } else if (inv.status === "deposit_paid") {
        const pct = (inv.deposit_percentage || 50) / 100;
        rev = (Number(inv.total) || 0) * pct;
      } else if (inv.status === "pending" || inv.status === "sent") {
        rev = Number(inv.total) || 0;
      }

      // Find expenses linked to this invoice
      const linkedExpenses = expenses.filter((e) => e.invoice_id === inv.id);
      const expSum = linkedExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const net = rev - expSum;
      const margin = rev > 0 ? (net / rev) * 100 : 0;

      items.push({
        id: inv.id,
        kind: "invoice",
        title: `${inv.type === "quote" ? "Quote" : "Invoice"}: ${inv.client_name}`,
        date: inv.event_date || inv.issue_date || inv.created_at?.split("T")[0] || "",
        category: inv.items?.[0]?.description || "Client Booking",
        status: inv.status,
        revenue: rev,
        expenses: expSum,
        netProfit: net,
        margin,
        raw: inv,
      });
    });

    // 2. Process Standalone Events
    events.forEach((evt) => {
      const rev = Number(evt.total_revenue) || 0;
      // Linked expenses or direct total_expenses
      const linkedExpenses = expenses.filter((e) => e.event_id === evt.id);
      const expSum = linkedExpenses.length > 0
        ? linkedExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
        : Number(evt.total_expenses) || 0;

      const net = rev - expSum;
      const margin = rev > 0 ? (net / rev) * 100 : 0;

      items.push({
        id: evt.id,
        kind: "event",
        title: evt.title || "Standalone Event",
        date: evt.event_date || evt.created_at?.split("T")[0] || "",
        category: evt.event_type || "Corporate Activation",
        status: evt.status || "scheduled",
        revenue: rev,
        expenses: expSum,
        netProfit: net,
        margin,
        raw: evt,
      });
    });

    // Sort by Date Descending
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, events, expenses]);

  // Apply Date Range & Search Filters
  const filteredLedger = useMemo(() => {
    const now = new Date();
    return ledgerItems.filter((item) => {
      // Entry Filter
      if (entryFilter === "invoices" && item.kind !== "invoice") return false;
      if (entryFilter === "events" && item.kind !== "event") return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory) return false;
      }

      // Date Range Filter
      if (dateRange !== "all" && item.date) {
        const itemDate = new Date(item.date);
        if (dateRange === "this_month") {
          if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear()) return false;
        } else if (dateRange === "last_month") {
          const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          if (itemDate.getMonth() !== lastM.getMonth() || itemDate.getFullYear() !== lastM.getFullYear()) return false;
        } else if (dateRange === "quarter") {
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          if (itemDate < threeMonthsAgo) return false;
        } else if (dateRange === "year") {
          if (itemDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    });
  }, [ledgerItems, entryFilter, searchQuery, dateRange]);

  // General Overhead Expenses (unlinked)
  const generalExpenses = useMemo(() => {
    return expenses.filter((e) => !e.event_id && !e.invoice_id);
  }, [expenses]);

  const totalGeneralExpenses = useMemo(() => {
    return generalExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [generalExpenses]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalRevenue = filteredLedger.reduce((acc, item) => acc + item.revenue, 0);
    const ledgerExpensesTotal = filteredLedger.reduce((acc, item) => acc + item.expenses, 0);
    const totalExpenses = ledgerExpensesTotal + (dateRange === "all" ? totalGeneralExpenses : 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
    };
  }, [filteredLedger, totalGeneralExpenses, dateRange]);

  // Expense Categories Breakdown
  const expenseByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      cats[cat] = (cats[cat] || 0) + (Number(e.amount) || 0);
    });
    return cats;
  }, [expenses]);

  // Handle Create Expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) {
      toast.error("Please provide an expense title and valid amount.");
      return;
    }

    setSubmittingExpense(true);
    try {
      const payload: any = {
        title: expenseTitle,
        category: expenseCategory,
        amount: Number(expenseAmount),
        date: expenseDate,
        notes: expenseNotes,
      };

      if (expenseTargetId !== "general") {
        if (expenseTargetId.startsWith("event:")) {
          payload.event_id = expenseTargetId.replace("event:", "");
        } else if (expenseTargetId.startsWith("inv:")) {
          payload.invoice_id = expenseTargetId.replace("inv:", "");
        }
      }

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to log expense.");
      }

      toast.success(`Expense "R${expenseAmount}" logged successfully! 💰`);
      setIsExpenseModalOpen(false);
      setExpenseTitle("");
      setExpenseAmount("");
      setExpenseNotes("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to log expense.");
    } finally {
      setSubmittingExpense(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ["ID", "Kind", "Title/Name", "Date", "Category/Type", "Status", "Revenue (ZAR)", "Expenses (ZAR)", "Net Profit (ZAR)", "Margin (%)"];
    const rows = filteredLedger.map((item) => [
      item.id,
      item.kind,
      `"${item.title.replace(/"/g, '""')}"`,
      item.date,
      `"${item.category.replace(/"/g, '""')}"`,
      item.status,
      item.revenue.toFixed(2),
      item.expenses.toFixed(2),
      item.netProfit.toFixed(2),
      item.margin.toFixed(1),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `VR_Guys_Financial_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Financial ledger exported to CSV! 📊");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-tech text-foreground flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" /> Accounts & Financial Management
          </h2>
          <p className="text-xs text-muted-foreground pt-1">
            General accounting, event revenue tracking, expense management, and net profitability performance insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Log Expense
          </Button>

          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-border text-xs rounded-xl hover:bg-secondary"
          >
            <Download className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-400 pt-1">
                R {kpis.totalRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-400/80 pt-2 flex items-center gap-1 font-mono">
            <ArrowUpRight className="h-3 w-3" /> Gross sales from events & invoices
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-rose-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold font-mono text-rose-400 pt-1">
                R {kpis.totalExpenses.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-rose-400/80 pt-2 flex items-center gap-1 font-mono">
            <ArrowDownRight className="h-3 w-3" /> Operational & event costs incurred
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-purple-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Net Profit</p>
              <h3 className={`text-2xl font-bold font-mono pt-1 ${kpis.netProfit >= 0 ? "text-purple-400" : "text-rose-400"}`}>
                R {kpis.netProfit.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/30">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-purple-400/80 pt-2 flex items-center gap-1 font-mono">
            <Sparkles className="h-3 w-3 text-purple-400" /> Revenue minus all expenses
          </p>
        </div>

        {/* Profit Margin */}
        <div className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Profit Margin</p>
              <h3 className="text-2xl font-bold font-mono text-cyan-400 pt-1">
                {kpis.profitMargin.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <PieChart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-cyan-400/80 pt-2 flex items-center gap-1 font-mono">
            <BarChart3 className="h-3 w-3" /> Net margin efficiency ratio
          </p>
        </div>
      </div>

      {/* Expense Category Distribution Cards */}
      <div className="bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-border space-y-4">
        <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary flex items-center gap-2">
          <PieChart className="h-4 w-4" /> Operational Expense Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {["Staff Wages", "Transport / Fuel", "Venue Fee", "Equipment / Maintenance", "Marketing / Ads", "Food & Refreshments", "Other"].map((cat) => {
            const val = expenseByCategory[cat] || 0;
            return (
              <div key={cat} className="bg-secondary/40 p-3 rounded-xl border border-border/50 text-center space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold truncate" title={cat}>{cat}</p>
                <p className="text-xs font-bold font-mono text-foreground">
                  R {val.toLocaleString("en-ZA")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger Filter Controls */}
      <div className="bg-card/70 backdrop-blur-md p-4 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title, client, category..."
              className="pl-9 text-xs rounded-xl bg-background/50 border-border"
            />
          </div>

          <Select value={entryFilter} onValueChange={(val: any) => setEntryFilter(val)}>
            <SelectTrigger className="w-[150px] text-xs rounded-xl bg-background/50 border-border">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="invoices">Client Invoices</SelectItem>
              <SelectItem value="events">Standalone Events</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={(val: any) => setDateRange(val)}>
            <SelectTrigger className="w-[150px] text-xs rounded-xl bg-background/50 border-border">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Showing <span className="text-foreground font-bold">{filteredLedger.length}</span> financial entries
        </div>
      </div>

      {/* Consolidated Financial Ledger Table */}
      <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground font-tech uppercase tracking-wider text-[10px] border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Event / Booking Entry</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Revenue (R)</th>
                <th className="py-3.5 px-4 text-right">Expenses (R)</th>
                <th className="py-3.5 px-4 text-right">Net Profit (R)</th>
                <th className="py-3.5 px-4 text-right">Margin (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mb-2" />
                    <p className="text-xs">Loading financial ledger...</p>
                  </td>
                </tr>
              ) : filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto opacity-40 mb-2" />
                    <p className="text-sm font-bold">No financial records found</p>
                    <p className="text-xs">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => (
                  <tr key={`${item.kind}-${item.id}`} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg text-xs ${
                          item.kind === "event"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                        }`}>
                          {item.kind === "event" ? <Flag className="h-3.5 w-3.5" /> : <Receipt className="h-3.5 w-3.5" />}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{item.kind === "event" ? "Standalone Event" : "Client Booking"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {item.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "paid" || item.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : item.status === "deposit_paid"
                            ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
                            : item.status === "scheduled"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      R {item.revenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400">
                      R {item.expenses.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                      item.netProfit >= 0 ? "text-purple-400" : "text-rose-400"
                    }`}>
                      R {item.netProfit.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-400">
                      {item.margin.toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Expense Dialog Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#040817] border-cyan-900/50 text-slate-100 p-6 space-y-5">
          <DialogHeader className="border-b border-cyan-900/40 pb-4 text-left">
            <DialogTitle className="text-lg font-bold font-tech text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-rose-400" />
              Log Financial Expense
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Expense Title *</label>
              <Input
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="e.g. Technician Staff Wages / Fuel for Setup"
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Category *</label>
                <Select value={expenseCategory} onValueChange={(val: any) => setExpenseCategory(val)}>
                  <SelectTrigger className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff Wages">Staff Wages</SelectItem>
                    <SelectItem value="Transport / Fuel">Transport / Fuel</SelectItem>
                    <SelectItem value="Venue Fee">Venue Fee</SelectItem>
                    <SelectItem value="Equipment / Maintenance">Equipment / Maintenance</SelectItem>
                    <SelectItem value="Marketing / Ads">Marketing / Ads</SelectItem>
                    <SelectItem value="Food & Refreshments">Food & Refreshments</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Amount (R) *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 450.00"
                  className="bg-slate-950 border-rose-900/60 text-rose-400 font-bold font-mono text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Expense Date *</label>
                <Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Link to Event / Booking</label>
                <Select value={expenseTargetId} onValueChange={setExpenseTargetId}>
                  <SelectTrigger className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl">
                    <SelectValue placeholder="General Operational Overhead" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    <SelectItem value="general">General Overhead (Unlinked)</SelectItem>
                    {events.map((evt) => (
                      <SelectItem key={evt.id} value={`event:${evt.id}`}>
                        Event: {evt.title}
                      </SelectItem>
                    ))}
                    {invoices.map((inv) => (
                      <SelectItem key={inv.id} value={`inv:${inv.id}`}>
                        Booking: {inv.client_name} ({inv.doc_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Notes / Receipt Ref</label>
              <Textarea
                rows={2}
                value={expenseNotes}
                onChange={(e) => setExpenseNotes(e.target.value)}
                placeholder="Receipt details, petrol slip number, or invoice notes..."
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-cyan-900/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpenseModalOpen(false)}
                className="border-cyan-900/50 text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingExpense}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-600/20"
              >
                <Save className="h-4 w-4 mr-1.5" />
                {submittingExpense ? "Logging..." : "Log Expense"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
