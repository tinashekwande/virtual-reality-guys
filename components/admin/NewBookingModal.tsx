"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar, User, Mail, Phone, MapPin, DollarSign, Save, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface NewBookingModalProps {
  isOpen: boolean;
  selectedDate: string; // YYYY-MM-DD
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_PACKAGES = [
  { description: "Starter VR Package (2 Headsets, 2 Hours)", price: 399 },
  { description: "Standard VR Package (4 Headsets, 3 Hours, 2 Staff)", price: 799 },
  { description: "Premium VR Package (6 Headsets, 4 Hours, 3 Staff)", price: 1199 },
  { description: "Corporate Event VR Package", price: 1499 },
  { description: "School / Educational VR Experience", price: 899 },
];

export default function NewBookingModal({ isOpen, selectedDate, onClose, onSuccess }: NewBookingModalProps) {
  const [docType, setDocType] = useState<"quote" | "invoice">("quote");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [eventDate, setEventDate] = useState(selectedDate || new Date().toISOString().split("T")[0]);
  const [packagePreset, setPackagePreset] = useState("Standard VR Package (4 Headsets, 3 Hours, 2 Staff)");
  const [price, setPrice] = useState(799);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDate) setEventDate(selectedDate);
  }, [selectedDate]);

  const handlePackageChange = (val: string) => {
    setPackagePreset(val);
    const found = PRESET_PACKAGES.find(p => p.description === val);
    if (found) setPrice(found.price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Please enter a client name.");
      return;
    }

    setSubmitting(true);
    try {
      const docNumber = `VR-${docType === "invoice" ? "INV" : "Q"}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newInvoice = {
        type: docType,
        doc_number: docNumber,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_address: clientAddress,
        event_date: eventDate,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: eventDate,
        status: "draft",
        items: [
          {
            id: Date.now().toString(),
            description: packagePreset,
            quantity: 1,
            unit_price: price,
            total: price,
          },
        ],
        subtotal: price,
        discount: 0,
        transport_fee: 0,
        total: price,
        notes: notes || "Mobile VR Setup & On-Site Technicians included.",
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking.");
      }

      toast.success(`${docType === "quote" ? "Quote" : "Invoice"} booking created for ${eventDate}! 🎉`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-[#040817] border-cyan-900/50 text-slate-100 p-6 space-y-6">
        <DialogHeader className="border-b border-cyan-900/40 pb-4 text-left">
          <DialogTitle className="text-xl font-bold font-tech text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            Create Booking on {eventDate}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Document Type</label>
              <Select value={docType} onValueChange={(val: any) => setDocType(val)}>
                <SelectTrigger className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">Quote Booking</SelectItem>
                  <SelectItem value="invoice">Tax Invoice Booking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Event Date *</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Customer / Organization Name *</label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. John Smith / Cape Town Tech"
              className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Email</label>
              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Phone Number</label>
              <Input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+27 71 123 4567"
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Event Location / Venue</label>
            <Input
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="e.g. Constantia, Cape Town"
              className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-slate-400 font-semibold mb-1 block">VR Package</label>
              <Select value={packagePreset} onValueChange={handlePackageChange}>
                <SelectTrigger className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_PACKAGES.map((p, idx) => (
                    <SelectItem key={idx} value={p.description}>
                      {p.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Price (R)</label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Event Notes</label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions or setup notes..."
              className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-cyan-900/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cyan-900/50 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl shadow-lg shadow-primary/20"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {submitting ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
