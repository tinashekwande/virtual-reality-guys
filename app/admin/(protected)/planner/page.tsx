"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon, Clock, DollarSign, UserCheck, AlertTriangle,
  Plus, Search, Filter, RefreshCw, FileText, CheckCircle2, ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import BookingPlannerCalendar from "@/components/admin/BookingPlannerCalendar";
import BookingDetailsModal, { PlannerEvent } from "@/components/admin/BookingDetailsModal";
import NewBookingModal from "@/components/admin/NewBookingModal";
import { Invoice, FormRequest } from "@/types";
import { toast } from "sonner";

function extractDateFromMessage(message: string | undefined, fallbackDate: string): string {
  if (!message) return fallbackDate;

  // 1. ISO format (2026-08-22 or 2026/08/22)
  const isoMatch = message.match(/\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. SA / UK format (22/08/2026 or 22-08-2026)
  const dmyMatch = message.match(/\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](20\d{2})\b/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  // 3. Text format e.g. "22 August 2026", "22nd August 2026", "August 22, 2026"
  const MONTHS: Record<string, string> = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12",
  };

  // e.g. "22nd August 2026"
  const dayMonthYearMatch = message.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(20\d{2})\b/i);
  if (dayMonthYearMatch) {
    const day = dayMonthYearMatch[1].padStart(2, "0");
    const mStr = dayMonthYearMatch[2].toLowerCase();
    const year = dayMonthYearMatch[3];
    const month = MONTHS[mStr] || MONTHS[mStr.substring(0, 3)];
    if (month) return `${year}-${month}-${day}`;
  }

  // e.g. "August 22, 2026"
  const monthDayYearMatch = message.match(/\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(20\d{2})\b/i);
  if (monthDayYearMatch) {
    const mStr = monthDayYearMatch[1].toLowerCase();
    const day = monthDayYearMatch[2].padStart(2, "0");
    const year = monthDayYearMatch[3];
    const month = MONTHS[mStr] || MONTHS[mStr.substring(0, 3)];
    if (month) return `${year}-${month}-${day}`;
  }

  // 4. Line match e.g. "Date: 22/08/2026" or "Event date: 2026-08-22"
  const lineMatch = message.match(/(?:date|event date|booking date|requested date)[\s:=]+([^\n,\.]+)/i);
  if (lineMatch) {
    const parsed = new Date(lineMatch[1]);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
  }

  return fallbackDate;
}

export default function BookingPlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const fetchPlannerData = useCallback(async () => {
    setLoading(true);
    try {
      const [invoicesRes, requestsRes, eventsRes] = await Promise.all([
        fetch("/api/invoices").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/requests").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/events").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);

      const formattedEvents: PlannerEvent[] = [];
      const dateCounts: Record<string, number> = {};

      // 1. Map Invoices & Quotes
      if (Array.isArray(invoicesRes)) {
        invoicesRes.forEach((inv: Invoice) => {
          const date = inv.event_date || inv.issue_date || inv.created_at.split("T")[0];
          dateCounts[date] = (dateCounts[date] || 0) + 1;

          formattedEvents.push({
            id: inv.id,
            source: "invoice",
            title: `${inv.type === "quote" ? "Quote" : "Invoice"}: ${inv.client_name}`,
            client_name: inv.client_name,
            client_email: inv.client_email,
            client_phone: inv.client_phone,
            client_address: inv.client_address,
            date,
            event_type: inv.type,
            status: inv.status,
            total_amount: Number(inv.total) || 0,
            deposit_percentage: inv.deposit_percentage,
            notes_or_message: inv.notes,
            items: inv.items,
            raw_data: inv,
          });
        });
      }

      // 2. Map Form Requests & Chatbot Agent Bookings
      if (Array.isArray(requestsRes)) {
        requestsRes.forEach((req: FormRequest) => {
          // Parse event date intelligently from customer/agent booking message or fallback to created_at
          const fallbackDate = req.created_at.split("T")[0];
          const date = extractDateFromMessage(req.message, fallbackDate);

          dateCounts[date] = (dateCounts[date] || 0) + 1;

          formattedEvents.push({
            id: req.id,
            source: "request",
            title: `Booking Request: ${req.name}`,
            client_name: req.name,
            client_email: req.email,
            client_phone: req.phone,
            date,
            event_type: req.form_type || "VR Experience",
            status: req.status,
            notes_or_message: req.message,
            raw_data: req,
          });
        });
      }

      // 3. Map Standalone Events
      if (Array.isArray(eventsRes)) {
        eventsRes.forEach((evt: any) => {
          const date = evt.event_date || evt.created_at?.split("T")[0] || "";
          dateCounts[date] = (dateCounts[date] || 0) + 1;

          formattedEvents.push({
            id: evt.id,
            source: "event",
            title: evt.title || "Standalone Event",
            client_name: evt.title || "Standalone Event",
            client_address: evt.location,
            date,
            event_type: evt.event_type || "Corporate Activation",
            status: evt.status || "scheduled",
            total_amount: Number(evt.total_revenue) || 0,
            total_expenses: Number(evt.total_expenses) || 0,
            notes_or_message: evt.description,
            raw_data: evt,
          });
        });
      }

      // Flag conflicts where multiple events share the exact same date
      formattedEvents.forEach((evt) => {
        if ((dateCounts[evt.date] || 0) > 1) {
          evt.has_conflict = true;
        }
      });

      setEvents(formattedEvents);
    } catch (err: any) {
      toast.error("Failed to load planner calendar events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlannerData();
  }, [fetchPlannerData]);

  const handleOpenNewModal = (dateStr?: string) => {
    setSelectedDate(dateStr || new Date().toISOString().split("T")[0]);
    setIsNewModalOpen(true);
  };

  const handleOpenDetails = (event: PlannerEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  // Filter events based on active filters
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      (evt.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (evt.client_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (evt.client_address && evt.client_address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "new"
        ? evt.status === "new" || evt.status === "new_request"
        : statusFilter === "in_progress"
        ? evt.status === "in_progress" || evt.status === "pending_confirmation" || evt.status === "pending" || evt.status === "sent"
        : statusFilter === "archived"
        ? evt.status === "archived" || evt.status === "booking_confirmed" || evt.status === "confirmed" || evt.status === "paid"
        : statusFilter === "completed"
        ? evt.status === "completed" || evt.status === "event_completed"
        : evt.status === statusFilter;

    const matchesType =
      typeFilter === "all"
        ? true
        : evt.event_type.toLowerCase().includes(typeFilter.toLowerCase()) ||
          (evt.title?.toLowerCase() || "").includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate Summary Metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysBookingsCount = events.filter((e) => e.date === todayStr).length;
  const upcomingEventsCount = events.filter((e) => e.date >= todayStr).length;
  const pendingRequestsCount = events.filter((e) => e.status === "new" || e.status === "draft").length;

  const currentMonthPrefix = todayStr.substring(0, 7);
  const monthlyRevenue = events
    .filter((e) => e.date.startsWith(currentMonthPrefix) && (e.status === "paid" || e.status === "completed" || e.status === "deposit_paid"))
    .reduce((acc, curr) => {
      if (curr.status === "paid" || curr.status === "completed") {
        return acc + (curr.total_amount || 0);
      }
      if (curr.status === "deposit_paid") {
        const pct = curr.deposit_percentage !== undefined && Number(curr.deposit_percentage) > 0 ? Number(curr.deposit_percentage) : 50;
        return acc + (((curr.total_amount || 0) * pct) / 100);
      }
      return acc;
    }, 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-tech">Booking Planner Calendar</h1>
          <p className="text-sm text-muted-foreground">
            At-a-glance event schedule, conflict detection, and real-time booking management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchPlannerData}
            title="Refresh calendar"
            className="border-border rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setIsNewModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => setStatusFilter("all")}
          className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Today's Bookings</p>
            <p className="text-2xl font-bold font-tech text-foreground">{todaysBookingsCount}</p>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("all")}
          className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Upcoming Events</p>
            <p className="text-2xl font-bold font-tech text-foreground">{upcomingEventsCount}</p>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("new")}
          className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-amber-500/50 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Pending Requests</p>
            <p className="text-2xl font-bold font-tech text-amber-400">{pendingRequestsCount}</p>
          </div>
        </div>

        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">This Month Revenue</p>
            <p className="text-2xl font-bold font-tech text-emerald-400">
              R {monthlyRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client, location, event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border bg-secondary/50 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 rounded-xl border-border bg-secondary text-xs">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New Request</SelectItem>
              <SelectItem value="in_progress">Pending Confirmation</SelectItem>
              <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
              <SelectItem value="archived">Booking Confirmed / Paid</SelectItem>
              <SelectItem value="completed">Event Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 rounded-xl border-border bg-secondary text-xs">
              <SelectValue placeholder="Package Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quote">Quotes</SelectItem>
              <SelectItem value="invoice">Invoices</SelectItem>
              <SelectItem value="birthday">Birthday Party</SelectItem>
              <SelectItem value="school">School Event</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Layout Grid (Calendar + Upcoming Sidebar) */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Calendar View (3 Cols) */}
        <div className="lg:col-span-3">
          <BookingPlannerCalendar
            events={filteredEvents}
            onSelectEvent={handleOpenDetails}
            onSelectDate={handleOpenNewModal}
          />
        </div>

        {/* Upcoming Bookings Sidebar (1 Col) */}
        <div className="space-y-6">
          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border space-y-4">
            <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary border-b border-border pb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Upcoming Events
            </h3>

            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {events
                  .filter((e) => e.date >= todayStr)
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .slice(0, 6)
                  .map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => handleOpenDetails(evt)}
                      className="p-3 bg-secondary/40 rounded-xl border border-border/60 hover:border-cyan-500/50 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-cyan-400 font-mono">📅 {evt.date}</span>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {evt.status}
                        </span>
                      </div>

                      <p className="font-bold text-xs text-white truncate">{evt.client_name || evt.title}</p>
                      <p className="text-[10px] text-slate-400 capitalize">Type: {evt.event_type}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingDetailsModal
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedEvent(null);
        }}
        onUpdate={fetchPlannerData}
      />

      <NewBookingModal
        isOpen={isNewModalOpen}
        selectedDate={selectedDate}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchPlannerData}
      />
    </div>
  );
}
