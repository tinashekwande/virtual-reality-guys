"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText, Plus, Search, Filter, Download, Trash2, Edit3, Eye, DollarSign,
  Receipt, ArrowUpRight, Copy, CheckCircle2, Clock, XCircle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice, InvoiceType, InvoiceStatus, InvoiceItem } from "@/types";
import InvoiceForm from "@/components/admin/InvoiceForm";
import DocumentPreview from "@/components/admin/DocumentPreview";
import { toast } from "sonner";

function QuotesInvoicesContent() {
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [viewMode, setViewMode] = useState<"list" | "create" | "edit" | "preview">("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Partial<Invoice> | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) {
        setInvoices([]);
        return;
      }
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn("Invoices fetch notice:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Detect query params for creating invoice/quote directly from a customer request
  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam === "invoice" || createParam === "quote") {
      const name = searchParams.get("name") || "";
      const email = searchParams.get("email") || "";
      const phone = searchParams.get("phone") || "";
      const date = searchParams.get("date") || "";
      const address = searchParams.get("address") || "";
      const notes = searchParams.get("notes") || "";
      const packageType = searchParams.get("package") || "";

      let initialItems: InvoiceItem[] = [
        {
          id: "1",
          description: "Standard VR Package (4 Headsets, 3 Hours, 2 Staff)",
          quantity: 1,
          unit_price: 799,
          total: 799,
        },
      ];

      if (packageType.toLowerCase().includes("birthday")) {
        initialItems = [
          { id: "1", description: "Birthday VR Party Package (4 Headsets, 2 Hours)", quantity: 1, unit_price: 699, total: 699 }
        ];
      } else if (packageType.toLowerCase().includes("corporate")) {
        initialItems = [
          { id: "1", description: "Corporate Event VR Package (6 Headsets, 4 Hours)", quantity: 1, unit_price: 1499, total: 1499 }
        ];
      } else if (packageType.toLowerCase().includes("school")) {
        initialItems = [
          { id: "1", description: "School / Educational VR Experience", quantity: 1, unit_price: 899, total: 899 }
        ];
      } else if (packageType.toLowerCase().includes("festival")) {
        initialItems = [
          { id: "1", description: "Festival / Community VR Activation", quantity: 1, unit_price: 1299, total: 1299 }
        ];
      }

      setSelectedInvoice({
        type: createParam as InvoiceType,
        status: "draft",
        doc_number: `VR-${createParam === "invoice" ? "INV" : "Q"}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        client_name: name,
        client_email: email,
        client_phone: phone,
        client_address: address,
        event_date: date,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: date || new Date().toISOString().split("T")[0],
        notes: notes ? `Client Request Notes:\n${notes}` : "50% deposit required upon booking confirmation.\nAll equipment cleaned and medical-grade sanitized between sessions.\nSetup begins 45 minutes prior to event start time.",
        items: initialItems,
        subtotal: initialItems[0].total,
        total: initialItems[0].total,
        discount: 0,
        transport_fee: 0,
      });

      setViewMode("create");
    }
  }, [searchParams]);

  const handleCreateNew = (type: InvoiceType) => {
    setSelectedInvoice({
      type,
      status: "draft",
      doc_number: `VR-${type === "invoice" ? "INV" : "Q"}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      issue_date: new Date().toISOString().split("T")[0],
    });
    setViewMode("create");
  };

  const handleEdit = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setViewMode("edit");
  };

  const handlePreview = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setViewMode("preview");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Document deleted.");
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  const handleConvertQuoteToInvoice = async (inv: Invoice) => {
    try {
      const newDocNumber = `VR-INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newInvoiceData = {
        ...inv,
        id: undefined,
        type: "invoice" as InvoiceType,
        doc_number: newDocNumber,
        status: "draft" as InvoiceStatus,
        issue_date: new Date().toISOString().split("T")[0],
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoiceData),
      });

      if (!res.ok) throw new Error("Failed to convert quote.");
      toast.success("Converted Quote to Invoice! 📄");
      fetchInvoices();
    } catch (err: any) {
      toast.error(err.message || "Conversion failed.");
    }
  };

  const handleFormSave = (savedDoc?: Partial<Invoice>) => {
    fetchInvoices();
  };

  const handleCloseForm = () => {
    setViewMode("list");
    setSelectedInvoice(null);
    fetchInvoices();
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.doc_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || inv.type === typeFilter;
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate metrics
  const totalQuotesCount = invoices.filter((i) => i.type === "quote").length;
  const totalInvoicesCount = invoices.filter((i) => i.type === "invoice").length;
  const totalPaidRevenue = invoices
    .filter((i) => i.type === "invoice" && i.status === "paid")
    .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  if (viewMode === "create" || viewMode === "edit") {
    return (
      <InvoiceForm
        initialData={selectedInvoice || undefined}
        onSave={handleFormSave}
        onCancel={handleCloseForm}
      />
    );
  }

  if (viewMode === "preview" && selectedInvoice) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setViewMode("list");
            setSelectedInvoice(null);
          }}
          className="border-border rounded-xl"
        >
          ← Back to All Documents
        </Button>
        <DocumentPreview invoice={selectedInvoice} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-tech">Quotes & Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Generate, track, and export luxury PDF quotes & tax invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleCreateNew("quote")}
            className="border-primary/40 hover:bg-primary/10 text-primary font-semibold rounded-xl"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            + New Quote
          </Button>

          <Button
            onClick={() => handleCreateNew("invoice")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            + New Invoice
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Quotes</p>
            <p className="text-2xl font-bold font-tech text-foreground">{totalQuotesCount}</p>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Invoices</p>
            <p className="text-2xl font-bold font-tech text-foreground">{totalInvoicesCount}</p>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Revenue (Paid)</p>
            <p className="text-2xl font-bold font-tech text-emerald-400">
              R {totalPaidRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client, doc #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border bg-secondary/50 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 rounded-xl border-border bg-secondary text-xs">
              <SelectValue placeholder="Filter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quote">Quotes Only</SelectItem>
              <SelectItem value="invoice">Invoices Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl border-border bg-secondary text-xs">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid / Accepted</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchInvoices}
            title="Refresh list"
            className="rounded-xl border border-border"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table of Documents */}
      <div className="bg-card/70 rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm">Loading documents...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold">No documents found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Create your first Quote or Invoice to generate high-definition PDFs with your FNB bank details.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button size="sm" onClick={() => handleCreateNew("quote")}>
                + Create Quote
              </Button>
              <Button size="sm" onClick={() => handleCreateNew("invoice")}>
                + Create Invoice
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-xs font-tech text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-6">Doc #</th>
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Issue Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total Amount</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredInvoices.map((inv) => {
                  const isQuote = inv.type === "quote";
                  return (
                    <tr key={inv.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-white">
                        {inv.doc_number}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-foreground">{inv.client_name}</p>
                        {inv.client_email && (
                          <p className="text-xs text-muted-foreground">{inv.client_email}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border ${
                            isQuote
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          }`}
                        >
                          {isQuote ? "Quote" : "Invoice"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-muted-foreground">
                        {inv.issue_date}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                            inv.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : inv.status === "sent"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : inv.status === "cancelled"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="h-3 w-3" />}
                          {inv.status === "sent" && <Clock className="h-3 w-3" />}
                          {inv.status === "cancelled" && <XCircle className="h-3 w-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-tech font-bold text-primary">
                        R {Number(inv.total || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreview(inv)}
                            title="Preview & Export PDF"
                            className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(inv)}
                            title="Edit document"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>

                          {isQuote && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleConvertQuoteToInvoice(inv)}
                              title="Convert Quote to Invoice"
                              className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(inv.id)}
                            title="Delete document"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuotesInvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading invoices & quotes...</div>}>
      <QuotesInvoicesContent />
    </Suspense>
  );
}
