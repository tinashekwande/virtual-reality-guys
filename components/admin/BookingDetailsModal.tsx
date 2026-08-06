"use client";

import React, { useState } from "react";
import {
  Calendar, Clock, User, Mail, Phone, MapPin, DollarSign, AlertTriangle,
  CheckCircle2, XCircle, FileText, Edit3, Trash2, ArrowRight, Shield, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import Link from "next/link";

export interface PlannerEvent {
  id: string;
  source: "invoice" | "request";
  title: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  date: string; // YYYY-MM-DD
  time?: string;
  event_type: string;
  status: string;
  total_amount?: number;
  notes_or_message?: string;
  items?: any[];
  raw_data: any;
  has_conflict?: boolean;
}

interface BookingDetailsModalProps {
  event: PlannerEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingDetailsModal({ event, isOpen, onClose, onUpdate }: BookingDetailsModalProps) {
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!event) return null;

  const isInvoice = event.source === "invoice";

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      if (isInvoice) {
        const res = await fetch(`/api/invoices/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...event.raw_data, status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update status.");
      } else {
        const res = await fetch(`/api/requests/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update status.");
      }

      toast.success(`Booking status updated to ${newStatus}! 🎉`);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) {
      toast.error("Please pick a new date.");
      return;
    }

    setUpdating(true);
    try {
      if (isInvoice) {
        const res = await fetch(`/api/invoices/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...event.raw_data, event_date: rescheduleDate }),
        });
        if (!res.ok) throw new Error("Failed to reschedule.");
      } else {
        // Append updated event date in message if request
        const currentMsg = event.raw_data.message || "";
        const updatedMsg = `[Rescheduled Event Date: ${rescheduleDate}]\n${currentMsg}`;
        const res = await fetch(`/api/requests/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: updatedMsg }),
        });
        if (!res.ok) throw new Error("Failed to reschedule.");
      }

      toast.success(`Booking rescheduled to ${rescheduleDate}! 📅`);
      setIsRescheduling(false);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Reschedule failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking record?")) return;
    setUpdating(true);
    try {
      const endpoint = isInvoice ? `/api/invoices/${event.id}` : `/api/requests/${event.id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      toast.success("Booking record deleted.");
      onClose();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-[#040817] border-cyan-900/50 text-slate-100 p-6 space-y-6">
        <SheetHeader className="border-b border-cyan-900/40 pb-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {isInvoice ? (event.raw_data.type === "quote" ? "Official Quote" : "Tax Invoice") : "Customer Request"}
            </span>

            <span className="text-xs font-mono text-slate-400">
              ID: {event.id.slice(0, 8)}
            </span>
          </div>

          <SheetTitle className="text-xl font-bold font-tech text-white pt-2">
            {event.title}
          </SheetTitle>
        </SheetHeader>

        {/* Schedule Conflict Warning */}
        {event.has_conflict && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-amber-400">Schedule Conflict Detected</p>
              <p className="text-amber-200/80">
                Another VR booking is scheduled on this same date ({event.date}). Please review logistics and equipment allocation.
              </p>
            </div>
          </div>
        )}

        {/* Date & Time Highlights */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-cyan-900/40">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Event Date</p>
            <p className="text-sm font-bold font-tech text-white flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-cyan-400" />
              {event.date}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Package / Type</p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5 capitalize">
              <Tag className="h-4 w-4 text-cyan-400" />
              {event.event_type}
            </p>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-cyan-900/40 space-y-3">
          <h4 className="text-xs font-bold font-tech uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <User className="h-4 w-4" /> Customer Contact Information
          </h4>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-sm font-bold text-white">{event.client_name}</p>
            {event.client_email && (
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <a href={`mailto:${event.client_email}`} className="hover:underline text-cyan-300">
                  {event.client_email}
                </a>
              </p>
            )}
            {event.client_phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <a href={`tel:${event.client_phone}`} className="hover:underline text-cyan-300">
                  {event.client_phone}
                </a>
              </p>
            )}
            {event.client_address && (
              <p className="flex items-start gap-2 pt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{event.client_address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Status Switcher Card */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-cyan-900/40 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-tech uppercase tracking-wider text-cyan-400">
              Booking Status
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              {event.status}
            </span>
          </div>

          <div className="flex gap-2">
            <Select value={event.status} onValueChange={handleStatusChange} disabled={updating}>
              <SelectTrigger className="w-full bg-slate-950 border-cyan-900/60 text-xs rounded-xl">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                {isInvoice ? (
                  <>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent to Client</SelectItem>
                    <SelectItem value="paid">Accepted / Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="new">New Request</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reschedule Drawer Section */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-cyan-900/40 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-tech uppercase tracking-wider text-cyan-400">
              Reschedule Event Date
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRescheduling(!isRescheduling)}
              className="text-xs border-cyan-900/50 hover:bg-cyan-950 text-cyan-300 rounded-xl"
            >
              {isRescheduling ? "Cancel" : "Reschedule Date"}
            </Button>
          </div>

          {isRescheduling && (
            <div className="space-y-3 pt-2">
              <label className="text-[11px] text-slate-400 block">Select New Event Date:</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="bg-slate-950 border-cyan-900/60 text-xs rounded-xl"
                />
                <Button
                  onClick={handleReschedule}
                  disabled={updating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl px-4"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notes or Line Items */}
        {event.notes_or_message && (
          <div className="bg-slate-900/40 p-4 rounded-xl border border-cyan-900/30 text-xs space-y-1">
            <p className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
              Notes / Message:
            </p>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {event.notes_or_message}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-3">
          {isInvoice ? (
            <Link href="/admin/quotes-invoices">
              <Button variant="outline" size="sm" className="border-cyan-900/50 text-cyan-300 text-xs rounded-xl">
                <FileText className="h-4 w-4 mr-1.5" />
                View Full Quote / Invoice
              </Button>
            </Link>
          ) : (
            <Link href="/admin/requests">
              <Button variant="outline" size="sm" className="border-cyan-900/50 text-cyan-300 text-xs rounded-xl">
                <FileText className="h-4 w-4 mr-1.5" />
                View Customer Requests
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={updating}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs rounded-xl"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete Record
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
