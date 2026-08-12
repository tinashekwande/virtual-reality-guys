"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Download, Printer, Shield, Building2, CreditCard, Hash, MapPin, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types";
import { exportToPDF, printPDFDocument } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface DocumentPreviewProps {
  invoice: Partial<Invoice>;
  onClose?: () => void;
}

export default function DocumentPreview({ invoice, onClose }: DocumentPreviewProps) {
  const isQuote = invoice.type === "quote";
  const previewRefId = `pdf-document-preview-${invoice.doc_number || "draft"}`;

  const handleExportPDF = async () => {
    try {
      toast.loading("Generating high-definition PDF...", { id: "pdf-toast" });
      const filename = `${invoice.type === "quote" ? "Quote" : "Invoice"}_${invoice.doc_number || "draft"}_${invoice.client_name || "Client"}`;
      await exportToPDF(previewRefId, filename);
      toast.success("PDF exported successfully! 📄", { id: "pdf-toast" });
    } catch (err: any) {
      toast.error(`Failed to export PDF: ${err.message}`, { id: "pdf-toast" });
    }
  };

  const handlePrint = () => {
    printPDFDocument(previewRefId);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border/80 print:hidden">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
              isQuote
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            }`}
          >
            {isQuote ? "Official Quote" : "Tax Invoice"}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {invoice.doc_number || "DRAFT-000"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-border hover:bg-secondary flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print / Save Window
          </Button>

          <Button
            size="sm"
            onClick={handleExportPDF}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 font-semibold shadow-lg shadow-primary/20"
          >
            <Download className="h-4 w-4" />
            Download PDF File
          </Button>
        </div>
      </div>

      {/* Printable Luxury Document Container */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          id={previewRefId}
          className="w-full min-w-[320px] bg-[#040817] text-slate-100 p-6 sm:p-12 rounded-3xl border border-cyan-900/40 shadow-2xl space-y-8 sm:space-y-10 relative overflow-hidden font-sans print:p-0 print:border-none print:shadow-none print:bg-white print:text-black"
        >
 

        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-cyan-900/40 pb-8 print:border-slate-300">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Virtual Reality Guys Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-tech tracking-tight text-white print:text-black">
                  Virtual Reality <span className="text-cyan-400 print:text-cyan-700">Guys</span>
                </h1>
                <p className="text-xs text-cyan-300/80 font-medium tracking-wide uppercase print:text-slate-600">
                  Mobile VR Gaming & Premium Event Entertainment
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-1 print:text-slate-700">
              <p>📍 Cape Town & Surrounds, Western Cape</p>
              <p>📞 +27 71 780 0323 | ✉️ virtualrealityguyz@gmail.com</p>
              <p>🌐 www.virtualrealityguyz.co.za</p>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto space-y-2">
            <div className="inline-block px-4 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-tech uppercase tracking-widest text-lg font-bold print:bg-slate-100 print:text-slate-900 print:border-slate-300">
              {isQuote ? "QUOTE" : "INVOICE"}
            </div>
            <div className="space-y-1 text-xs text-slate-300 print:text-slate-800">
              <p>
                <span className="text-slate-500 print:text-slate-600">Doc No:</span>{" "}
                <strong className="text-white font-mono text-sm print:text-black">{invoice.doc_number || "VR-INV-001"}</strong>
              </p>
              <p>
                <span className="text-slate-500 print:text-slate-600">Issue Date:</span>{" "}
                <strong className="text-slate-200 print:text-black">{invoice.issue_date || new Date().toISOString().split("T")[0]}</strong>
              </p>
              {invoice.due_date && (
                <p>
                  <span className="text-slate-500 print:text-slate-600">{isQuote ? "Valid Until:" : "Due Date:"}</span>{" "}
                  <strong className="text-cyan-400 print:text-cyan-800">{invoice.due_date}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Client & Event Info Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-cyan-900/40 space-y-2 print:bg-slate-50 print:border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 print:text-slate-600">
              Billed To / Client Details
            </p>
            <h3 className="text-lg font-bold text-white print:text-black">
              {invoice.client_name || "Client Name"}
            </h3>
            {invoice.client_email && (
              <p className="text-xs text-slate-300 print:text-slate-800">📧 {invoice.client_email}</p>
            )}
            {invoice.client_phone && (
              <p className="text-xs text-slate-300 print:text-slate-800">📞 {invoice.client_phone}</p>
            )}
            {invoice.client_address && (
              <p className="text-xs text-slate-300 print:text-slate-800">📍 {invoice.client_address}</p>
            )}
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-cyan-900/40 space-y-2 print:bg-slate-50 print:border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 print:text-slate-600">
              Event Details
            </p>
            {invoice.event_date ? (
              <p className="text-sm font-semibold text-white print:text-black">
                📅 Date of Event: <span className="text-cyan-300 print:text-cyan-800">{invoice.event_date}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400 print:text-slate-600">Event date to be confirmed</p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed pt-1 print:text-slate-700">
              Includes full mobile VR setup, calibrated safety zoning, clean medical sanitization, and trained on-site supervisors.
            </p>
          </div>
        </div>

        {/* 3. Itemized Table */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyan-800/50 text-cyan-300 text-xs uppercase font-tech tracking-wider print:border-slate-300 print:text-slate-800">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-900/30 text-sm print:divide-slate-200">
                {(invoice.items && invoice.items.length > 0) ? (
                  invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-900/30 print:hover:bg-transparent">
                      <td className="py-4 px-4 font-medium text-slate-200 print:text-black">
                        {item.description || "VR Package / Experience"}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-300 print:text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-300 print:text-slate-800">
                        R {Number(item.unit_price || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-white print:text-black">
                        R {Number(item.total || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500 text-xs">
                      No line items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary Card */}
          <div className="flex flex-col sm:flex-row justify-end pt-4">
            <div className="w-full sm:w-80 bg-slate-900/80 p-5 rounded-2xl border border-cyan-900/50 space-y-3 print:bg-slate-100 print:border-slate-300">
              <div className="flex justify-between text-xs text-slate-300 print:text-slate-800">
                <span>Subtotal:</span>
                <span className="font-semibold text-white print:text-black">
                  R {Number(invoice.subtotal || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {Number(invoice.transport_fee) > 0 && (
                <div className="flex justify-between text-xs text-slate-300 print:text-slate-800">
                  <span>Transport / Setup Fee:</span>
                  <span className="font-semibold text-cyan-400 print:text-cyan-800">
                    R {Number(invoice.transport_fee).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-xs text-emerald-400 print:text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    - R {Number(invoice.discount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="border-t border-cyan-800/60 pt-3 flex justify-between items-center print:border-slate-300">
                <span className="font-bold text-sm text-white print:text-black uppercase tracking-wider font-tech">
                  Total Due:
                </span>
                <span className="text-xl font-bold font-tech text-cyan-400 print:text-cyan-900">
                  R {Number(invoice.total || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. EXACT PAYMENT & BANKING DETAILS BOX (As Requested) */}
        <div className="bg-slate-950/90 rounded-2xl p-6 border border-amber-500/30 space-y-4 shadow-xl print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3 print:border-slate-300">
            <Building2 className="h-5 w-5 text-amber-400 print:text-amber-700" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-tech print:text-amber-800">
              PAYMENT & BANKING DETAILS
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Account Holder
              </p>
              <p className="font-bold text-white text-sm print:text-black">
                Panashe Majinga
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Financial Institution
              </p>
              <p className="font-bold text-white text-sm print:text-black">
                First National Bank (FNB)
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Account Type
              </p>
              <p className="font-bold text-white text-sm print:text-black">
                Current / Cheque Account
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Account Number
              </p>
              <p className="font-bold font-mono text-amber-400 text-base tracking-widest print:text-amber-800">
                631244445502
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Branch Name
              </p>
              <p className="font-bold text-white text-sm print:text-black">
                Brackenfell
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider print:text-slate-600">
                Branch Code (6-Digit)
              </p>
              <p className="font-bold font-mono text-amber-400 text-base tracking-widest print:text-amber-800">
                250655
              </p>
            </div>
          </div>
        </div>

        {/* 5. Terms & Additional Notes */}
        {invoice.notes && (
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-900/30 text-xs text-slate-300 space-y-2 print:bg-slate-50 print:border-slate-200 print:text-slate-800">
            <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] font-tech print:text-slate-700">
              Terms & Additional Notes
            </h4>
            <p className="whitespace-pre-line leading-relaxed text-slate-300 print:text-slate-700">{invoice.notes}</p>
          </div>
        )}

        {/* 6. Footer Signature */}
        <div className="pt-6 border-t border-cyan-900/30 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-xs text-slate-400 gap-4 print:border-slate-300 print:text-slate-600">
          <p>Thank you for choosing Virtual Reality Guys for your event!</p>
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold print:text-cyan-800">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 print:text-cyan-700" />
            <span>Turn-Key Mobile VR Entertainment</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
