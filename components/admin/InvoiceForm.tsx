"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Eye, FileText, Calendar, User, DollarSign, ArrowLeft, Sparkles, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice, InvoiceItem, InvoiceType, InvoiceStatus } from "@/types";
import DocumentPreview from "@/components/admin/DocumentPreview";
import { exportToPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  onSave?: (data: Partial<Invoice>) => void;
  onCancel?: () => void;
}

const PRESET_PACKAGES = [
  { description: "Starter VR Package (2 Headsets, 2 Hours)", price: 399 },
  { description: "Standard VR Package (4 Headsets, 3 Hours, 2 Staff)", price: 799 },
  { description: "Premium VR Package (6 Headsets, 4 Hours, 3 Staff)", price: 1199 },
  { description: "Additional VR Headset (Per Hour)", price: 150 },
  { description: "Additional Event Hour", price: 250 },
  { description: "Travel / Transport Fee (Outside Kraaifontein area)", price: 200 },
];

export default function InvoiceForm({ initialData, onSave, onCancel }: InvoiceFormProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState<InvoiceType>(initialData?.type || "quote");
  const [docNumber, setDocNumber] = useState<string>(
    initialData?.doc_number || `VR-${initialData?.type === "invoice" ? "INV" : "Q"}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [clientName, setClientName] = useState<string>(initialData?.client_name || "");
  const [clientEmail, setClientEmail] = useState<string>(initialData?.client_email || "");
  const [clientPhone, setClientPhone] = useState<string>(initialData?.client_phone || "");
  const [clientAddress, setClientAddress] = useState<string>(initialData?.client_address || "");
  const [eventDate, setEventDate] = useState<string>(initialData?.event_date || "");
  const [issueDate, setIssueDate] = useState<string>(initialData?.issue_date || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState<string>(initialData?.due_date || "");
  const [status, setStatus] = useState<InvoiceStatus>(initialData?.status || "draft");

  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          {
            id: "1",
            description: "Standard VR Package (4 Headsets, 3 Hours, 2 Staff)",
            quantity: 1,
            unit_price: 799,
            total: 799,
          },
        ]
  );

  const [discount, setDiscount] = useState<number>(initialData?.discount || 0);
  const [transportFee, setTransportFee] = useState<number>(initialData?.transport_fee || 0);
  const [notes, setNotes] = useState<string>(
    initialData?.notes ||
      "50% deposit required upon booking confirmation.\nAll equipment cleaned and medical-grade sanitized between sessions.\nSetup begins 45 minutes prior to event start time."
  );

  // Update doc number prefix when type changes if unchanged
  useEffect(() => {
    if (!initialData?.doc_number) {
      const prefix = type === "invoice" ? "INV" : "Q";
      setDocNumber(`VR-${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [type, initialData]);

  // Recalculate totals
  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const grandTotal = Math.max(0, subtotal + Number(transportFee) - Number(discount));

  const handleAddItem = (preset?: { description: string; price: number }) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: preset ? preset.description : "",
      quantity: 1,
      unit_price: preset ? preset.price : 0,
      total: preset ? preset.price : 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            const qty = Number(field === "quantity" ? value : item.quantity) || 0;
            const price = Number(field === "unit_price" ? value : item.unit_price) || 0;
            updated.total = qty * price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const currentInvoiceData: Partial<Invoice> = {
    ...initialData,
    type,
    doc_number: docNumber,
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone,
    client_address: clientAddress,
    event_date: eventDate,
    issue_date: issueDate,
    due_date: dueDate,
    status,
    items,
    subtotal,
    discount: Number(discount),
    transport_fee: Number(transportFee),
    total: grandTotal,
    notes,
  };

  const handleDirectDownloadPDF = async () => {
    if (!clientName.trim()) {
      toast.error("Please enter a client name first.");
      return;
    }
    try {
      toast.loading("Generating PDF...", { id: "pdf-direct-toast" });
      setActiveTab("preview");
      setTimeout(async () => {
        const previewRefId = `pdf-document-preview-${docNumber || "draft"}`;
        const filename = `${type === "quote" ? "Quote" : "Invoice"}_${docNumber || "draft"}_${clientName}`;
        await exportToPDF(previewRefId, filename);
        toast.success("PDF Downloaded successfully! 📄", { id: "pdf-direct-toast" });
      }, 250);
    } catch (err: any) {
      toast.error(`PDF export error: ${err.message}`, { id: "pdf-direct-toast" });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Please enter a client name.");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one line item.");
      return;
    }

    setSaving(true);

    try {
      const method = initialData?.id ? "PUT" : "POST";
      const url = initialData?.id ? `/api/invoices/${initialData.id}` : "/api/invoices";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentInvoiceData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save document.");
      }

      const savedData = await res.json();
      toast.success(`${type === "quote" ? "Quote" : "Invoice"} saved to database! 🎉`);

      if (onSave) {
        onSave(savedData || currentInvoiceData);
      }
    } catch (err: any) {
      console.warn("Database save notice:", err);
      toast.warning(`Database notice: ${err.message || "Failed to save to database"}. Don't worry! You can still download the PDF below.`, { duration: 8000 });
      if (onSave) {
        onSave(currentInvoiceData);
      }
    } finally {
      setSaving(false);
      setActiveTab("preview");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="text-xl font-bold font-tech">
              {initialData?.id ? `Edit ${type === "quote" ? "Quote" : "Invoice"}` : `Create New ${type === "quote" ? "Quote" : "Invoice"}`}
            </h2>
            <p className="text-xs text-muted-foreground">Fill in details or download high-definition PDF</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-secondary/80 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "edit"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Edit Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Live Preview
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDirectDownloadPDF}
            className="border-primary/40 text-primary hover:bg-primary/10 font-semibold flex items-center gap-2 rounded-xl"
          >
            <Download className="h-4 w-4" />
            Download PDF Now
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 rounded-xl"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save & Preview"}
          </Button>
        </div>
      </div>

      <div className={activeTab === "preview" ? "block" : "hidden"}>
        <DocumentPreview invoice={currentInvoiceData} />
      </div>

      <div className={activeTab === "edit" ? "block" : "hidden"}>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Columns (2) — Main Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Type & Reference */}
            <div className="bg-card/70 rounded-2xl p-6 border border-border space-y-4">
              <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary flex items-center gap-2">
                <FileText className="h-4 w-4" /> Document Configuration
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Document Type</label>
                  <Select value={type} onValueChange={(val: InvoiceType) => setType(val)}>
                    <SelectTrigger className="rounded-xl border-border bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="invoice">Tax Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Doc Number</label>
                  <Input
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="rounded-xl border-border bg-secondary/50 font-mono"
                    placeholder="e.g. VR-INV-2026-001"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Status</label>
                  <Select value={status} onValueChange={(val: InvoiceStatus) => setStatus(val)}>
                    <SelectTrigger className="rounded-xl border-border bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent to Client</SelectItem>
                      <SelectItem value="paid">Accepted / Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-card/70 rounded-2xl p-6 border border-border space-y-4">
              <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary flex items-center gap-2">
                <User className="h-4 w-4" /> Client & Event Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Client Name / Organization *</label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Mitchell / Cape Town High"
                    className="rounded-xl border-border bg-secondary/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="rounded-xl border-border bg-secondary/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone Number</label>
                  <Input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+27 71 234 5678"
                    className="rounded-xl border-border bg-secondary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Event Venue / Address</label>
                  <Input
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="e.g. 14 Constantia Main Rd, Constantia, Cape Town"
                    className="rounded-xl border-border bg-secondary/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Event Date</label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="rounded-xl border-border bg-secondary/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Issue Date</label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="rounded-xl border-border bg-secondary/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{type === "quote" ? "Valid Until" : "Due Date"}</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-xl border-border bg-secondary/50"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Editor */}
            <div className="bg-card/70 rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Line Items & Services
                </h3>

                {/* Preset quick add dropdown */}
                <Select onValueChange={(val) => {
                  const preset = PRESET_PACKAGES.find(p => p.description === val);
                  if (preset) handleAddItem(preset);
                }}>
                  <SelectTrigger className="w-56 h-8 text-xs rounded-xl border-border bg-secondary">
                    <SelectValue placeholder="+ Quick Add VR Package" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_PACKAGES.map((p, idx) => (
                      <SelectItem key={idx} value={p.description} className="text-xs">
                        {p.description} (R{p.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line Items Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-tech">
                <div className="col-span-6">Item Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3 text-right">Price (Incl. 15% VAT)</div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 sm:gap-3 items-center p-3 bg-secondary/40 rounded-xl border border-border/60">
                    <div className="col-span-12 sm:col-span-6">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item / VR Package Description"
                        className="rounded-lg border-border bg-background text-sm sm:text-xs"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                        placeholder="Qty"
                        className="rounded-lg border-border bg-background text-sm sm:text-xs text-center"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(item.id, "unit_price", e.target.value)}
                        placeholder="Price (R)"
                        className="rounded-lg border-border bg-background text-sm sm:text-xs text-right font-mono"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem()}
                className="w-full rounded-xl border-dashed border-border hover:border-primary/50 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Blank Line Item
              </Button>
            </div>

            {/* Terms & Notes */}
            <div className="bg-card/70 rounded-2xl p-6 border border-border space-y-2">
              <label className="text-xs font-bold font-tech uppercase tracking-wider text-primary block">
                Terms & Additional Notes
              </label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, deposit requirements, or setup details..."
                className="rounded-xl border-border bg-secondary/50 text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column (1) — Summary & Calculation Card */}
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border space-y-6 sticky top-24">
              <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary border-b border-border pb-3">
                Financial Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal (Incl. VAT):</span>
                  <span className="font-semibold text-foreground text-sm font-mono">
                    R {subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Transport / Travel Fee (R)</label>
                  <Input
                    type="number"
                    min="0"
                    value={transportFee}
                    onChange={(e) => setTransportFee(Number(e.target.value))}
                    className="rounded-xl border-border bg-secondary/50 text-right font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Discount (R)</label>
                  <Input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="rounded-xl border-border bg-secondary/50 text-right font-mono text-xs text-emerald-400"
                  />
                </div>

                <div className="border-t border-border/60 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Net (Excl. 15% VAT):</span>
                    <span className="font-mono">
                      R {(grandTotal - (grandTotal * 15) / 115).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-cyan-400 font-medium">
                    <span>VAT (15% Included):</span>
                    <span className="font-mono">
                      R {((grandTotal * 15) / 115).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-bold text-sm font-tech">Total (Incl. VAT):</span>
                  <span className="text-xl font-bold font-tech text-primary">
                    R {grandTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* FNB Banking Details Notice */}
              <div className="bg-secondary/60 p-4 rounded-xl border border-amber-500/20 space-y-2 text-[11px]">
                <p className="font-bold text-amber-400 uppercase tracking-wider font-tech flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> FNB Banking Included
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Your PDF export will automatically include your exact FNB bank account details (Panashe Majinga, Acc: 631244445502).
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-5 shadow-lg shadow-primary/20"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : `Save ${type === "quote" ? "Quote" : "Invoice"}`}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  className="w-full rounded-xl py-5 border-border"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Luxury PDF
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
