"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon, Clock, DollarSign, AlertTriangle,
  Plus, Search, RefreshCw, Zap, Download, User2, Layers,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import BookingPlannerCalendar from "@/components/admin/BookingPlannerCalendar";
import BookingDetailsModal, { PlannerEvent } from "@/components/admin/BookingDetailsModal";
import NewBookingModal from "@/components/admin/NewBookingModal";
import PersonalEventModal from "@/components/admin/PersonalEventModal";
import CalendarImportModal from "@/components/admin/CalendarImportModal";
import { Invoice, FormRequest } from "@/types";
import {
  PersonalCalendarEvent, CalendarMode, CalendarSubscription
} from "@/types/personal-calendar";
import { toast } from "sonner";

function extractDateFromMessage(message: string | undefined, fallbackDate: string): string {
  if (!message) return fallbackDate;
  const isoMatch = message.match(/\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  const dmyMatch = message.match(/\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](20\d{2})\b/);
  if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  const MONTHS: Record<string, string> = {
    jan: "01", january: "01", feb: "02", february: "02", mar: "03", march: "03",
    apr: "04", april: "04", may: "05", jun: "06", june: "06", jul: "07", july: "07",
    aug: "08", august: "08", sep: "09", september: "09", oct: "10", october: "10",
    nov: "11", november: "11", dec: "12", december: "12",
  };
  const dayMonthYearMatch = message.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(20\d{2})\b/i);
  if (dayMonthYearMatch) {
    const day = dayMonthYearMatch[1].padStart(2, "0");
    const mStr = dayMonthYearMatch[2].toLowerCase();
    const year = dayMonthYearMatch[3];
    const month = MONTHS[mStr] || MONTHS[mStr.substring(0, 3)];
    if (month) return `${year}-${month}-${day}`;
  }
  const monthDayYearMatch = message.match(/\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(20\d{2})\b/i);
  if (monthDayYearMatch) {
    const mStr = monthDayYearMatch[1].toLowerCase();
    const day = monthDayYearMatch[2].padStart(2, "0");
    const year = monthDayYearMatch[3];
    const month = MONTHS[mStr] || MONTHS[mStr.substring(0, 3)];
    if (month) return `${year}-${month}-${day}`;
  }
  return fallbackDate;
}

export default function BookingPlannerPage() {
  // ── Business calendar state ──
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // ── Calendar mode ──
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("business");

  // ── Personal calendar state ──
  const [personalEvents, setPersonalEvents] = useState<PersonalCalendarEvent[]>([]);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [selectedPersonalEvent, setSelectedPersonalEvent] = useState<PersonalCalendarEvent | null>(null);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [personalDefaultDate, setPersonalDefaultDate] = useState<string>("");

  // ── Import modal ──
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<CalendarSubscription[]>([]);

  // ── Fetch business events ──
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

      if (Array.isArray(invoicesRes)) {
        invoicesRes.forEach((inv: Invoice) => {
          const date = inv.event_date || inv.issue_date || inv.created_at.split("T")[0];
          dateCounts[date] = (dateCounts[date] || 0) + 1;
          formattedEvents.push({
            id: inv.id, source: "invoice",
            title: `${inv.type === "quote" ? "Quote" : "Invoice"}: ${inv.client_name}`,
            client_name: inv.client_name, client_email: inv.client_email,
            client_phone: inv.client_phone, client_address: inv.client_address,
            date, event_type: inv.type, status: inv.status,
            total_amount: Number(inv.total) || 0,
            deposit_percentage: inv.deposit_percentage,
            notes_or_message: inv.notes, items: inv.items, raw_data: inv,
          });
        });
      }

      if (Array.isArray(requestsRes)) {
        requestsRes.forEach((req: FormRequest) => {
          const fallbackDate = req.created_at.split("T")[0];
          const date = extractDateFromMessage(req.message, fallbackDate);
          const suburb = req.suburb || (req.message.match(/\[Suburb:\s*([^\]]+)\]/i) || req.message.match(/(?:suburb|location|area|venue)\s*[:\-]\s*([A-Za-z\s]+?)(?:[,\.\n]|$)/i))?.[1]?.trim();
          dateCounts[date] = (dateCounts[date] || 0) + 1;
          formattedEvents.push({
            id: req.id, source: "request",
            title: `Booking Request: ${req.name}`,
            client_name: req.name, client_email: req.email,
            client_phone: req.phone, client_address: suburb || undefined,
            date, event_type: req.form_type || "VR Experience",
            status: req.status, notes_or_message: req.message, raw_data: req,
          });
        });
      }

      if (Array.isArray(eventsRes)) {
        eventsRes.forEach((evt: any) => {
          const date = evt.event_date || evt.created_at?.split("T")[0] || "";
          dateCounts[date] = (dateCounts[date] || 0) + 1;
          formattedEvents.push({
            id: evt.id, source: "event",
            title: evt.title || "Standalone Event",
            client_name: evt.title || "Standalone Event",
            client_address: evt.location, date,
            event_type: evt.event_type || "Corporate Activation",
            status: evt.status || "scheduled",
            total_amount: Number(evt.total_revenue) || 0,
            total_expenses: Number(evt.total_expenses) || 0,
            notes_or_message: evt.description, raw_data: evt,
          });
        });
      }

      formattedEvents.forEach((evt) => {
        if ((dateCounts[evt.date] || 0) > 1) evt.has_conflict = true;
      });

      setEvents(formattedEvents);
    } catch (err: any) {
      toast.error("Failed to load planner calendar events.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch personal events ──
  const fetchPersonalEvents = useCallback(async () => {
    setPersonalLoading(true);
    try {
      const res = await fetch("/api/personal-calendar");
      if (res.ok) {
        const data = await res.json();
        setPersonalEvents(Array.isArray(data) ? data : []);
      }
    } catch {
      // Table may not exist yet - silently handle
    } finally {
      setPersonalLoading(false);
    }
  }, []);

  // ── Fetch subscriptions ──
  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar-subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(Array.isArray(data) ? data : []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchPlannerData();
    fetchPersonalEvents();
    fetchSubscriptions();
  }, [fetchPlannerData, fetchPersonalEvents, fetchSubscriptions]);

  const handleOpenNewModal = (dateStr?: string) => {
    if (calendarMode === "personal") {
      setPersonalDefaultDate(dateStr || new Date().toISOString().split("T")[0]);
      setSelectedPersonalEvent(null);
      setIsPersonalModalOpen(true);
    } else {
      setSelectedDate(dateStr || new Date().toISOString().split("T")[0]);
      setIsNewModalOpen(true);
    }
  };

  const handleOpenDetails = (event: PlannerEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleOpenPersonalEvent = (event: PersonalCalendarEvent) => {
    setSelectedPersonalEvent(event);
    setIsPersonalModalOpen(true);
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      (evt.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (evt.client_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (evt.client_address && evt.client_address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true
      : statusFilter === "new" ? evt.status === "new" || evt.status === "new_request"
      : statusFilter === "in_progress" ? evt.status === "in_progress" || evt.status === "pending_confirmation" || evt.status === "pending" || evt.status === "sent"
      : statusFilter === "archived" ? evt.status === "archived" || evt.status === "booking_confirmed" || evt.status === "confirmed" || evt.status === "paid"
      : statusFilter === "completed" ? evt.status === "completed" || evt.status === "event_completed"
      : evt.status === statusFilter;

    const matchesType =
      typeFilter === "all" ? true
      : evt.event_type.toLowerCase().includes(typeFilter.toLowerCase()) ||
        (evt.title?.toLowerCase() || "").includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  // ── Metrics ──
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysBookingsCount = events.filter((e) => e.date === todayStr).length;
  const upcomingEventsCount = events.filter((e) => e.date >= todayStr).length;
  const pendingRequestsCount = events.filter((e) => e.status === "new" || e.status === "draft").length;
  const currentMonthPrefix = todayStr.substring(0, 7);
  const monthlyRevenue = events
    .filter((e) => e.date.startsWith(currentMonthPrefix) && (e.status === "paid" || e.status === "completed" || e.status === "deposit_paid"))
    .reduce((acc, curr) => {
      if (curr.status === "paid" || curr.status === "completed") return acc + (curr.total_amount || 0);
      if (curr.status === "deposit_paid") {
        const pct = curr.deposit_percentage !== undefined && Number(curr.deposit_percentage) > 0 ? Number(curr.deposit_percentage) : 50;
        return acc + (((curr.total_amount || 0) * pct) / 100);
      }
      return acc;
    }, 0);

  // Overlay conflict count
  const personalDates = new Set(personalEvents.map((e) => e.date));
  const overlayConflictCount = events.filter((e) => personalDates.has(e.date)).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-tech">Booking Planner Calendar</h1>
          <p className="text-sm text-muted-foreground">
            At-a-glance event schedule, conflict detection, and real-time booking management
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Calendar Mode Toggle */}
          <div className="flex bg-secondary/80 p-1 rounded-xl border border-border">
            <button
              onClick={() => setCalendarMode("business")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calendarMode === "business" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Building2 className="h-3.5 w-3.5" /> Business
            </button>
            <button
              onClick={() => setCalendarMode("personal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calendarMode === "personal" ? "bg-violet-600 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <User2 className="h-3.5 w-3.5" /> Personal
            </button>
            <button
              onClick={() => setCalendarMode("overlay")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calendarMode === "overlay" ? "bg-amber-600 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Layers className="h-3.5 w-3.5" /> Overlay
            </button>
          </div>

          <Button
            variant="outline"
            onClick={() => { fetchPlannerData(); fetchPersonalEvents(); }}
            title="Refresh calendar"
            className="border-border rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Import button (always visible) */}
          <Button
            variant="outline"
            onClick={() => { fetchSubscriptions(); setIsImportModalOpen(true); }}
            className="border-violet-500/40 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 rounded-xl"
          >
            <Download className="h-4 w-4 mr-1.5" /> Import Calendar
          </Button>

          {/* Primary action — context-aware */}
          {calendarMode === "personal" ? (
            <Button
              onClick={() => { setSelectedPersonalEvent(null); setPersonalDefaultDate(new Date().toISOString().split("T")[0]); setIsPersonalModalOpen(true); }}
              className="rounded-xl font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Personal Event
            </Button>
          ) : (
            <Button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4 mr-1.5" /> New Booking
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Mode Info Banner */}
      {calendarMode === "personal" && (
        <div className="flex items-center gap-3 p-3.5 bg-violet-500/10 border border-violet-500/30 rounded-2xl text-sm text-violet-300">
          <User2 className="h-5 w-5 flex-shrink-0 text-violet-400" />
          <div>
            <span className="font-semibold">Personal Calendar Mode</span> — Showing your personal schedule. Business bookings are hidden.
            {personalEvents.length > 0 && (
              <span className="text-violet-400/80 ml-2">{personalEvents.length} personal events loaded.</span>
            )}
          </div>
        </div>
      )}

      {calendarMode === "overlay" && (
        <div className="flex items-center gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-sm text-amber-300">
          <Layers className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <div>
            <span className="font-semibold">Overlay Mode</span> — Business bookings (cyan/green) and personal events (colored) are shown together.
            {overlayConflictCount > 0 && (
              <span className="text-amber-400 ml-2 font-bold flex items-center gap-1 inline-flex">
                <Zap className="h-3.5 w-3.5" /> {overlayConflictCount} date conflict{overlayConflictCount > 1 ? "s" : ""} detected between business and personal events.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Top Metrics Cards (business mode / overlay only) */}
      {calendarMode !== "personal" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => setStatusFilter("all")} className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Today's Bookings</p>
              <p className="text-2xl font-bold font-tech text-foreground">{todaysBookingsCount}</p>
            </div>
          </div>

          <div onClick={() => setStatusFilter("all")} className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Upcoming Events</p>
              <p className="text-2xl font-bold font-tech text-foreground">{upcomingEventsCount}</p>
            </div>
          </div>

          <div onClick={() => setStatusFilter("new")} className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 cursor-pointer hover:border-amber-500/50 transition-all">
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
      )}

      {/* Personal Calendar Metrics */}
      {calendarMode === "personal" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-violet-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <User2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Personal Events</p>
              <p className="text-2xl font-bold font-tech text-violet-400">{personalEvents.length}</p>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-violet-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Upcoming Personal</p>
              <p className="text-2xl font-bold font-tech text-violet-400">
                {personalEvents.filter((e) => e.date >= todayStr).length}
              </p>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-violet-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Subscriptions</p>
              <p className="text-2xl font-bold font-tech text-violet-400">{subscriptions.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters (business and overlay modes only) */}
      {calendarMode !== "personal" && (
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
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setTypeFilter("all"); }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Layout Grid (Calendar + Upcoming Sidebar) */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Calendar View (3 Cols) */}
        <div className="lg:col-span-3">
          <BookingPlannerCalendar
            events={filteredEvents}
            onSelectEvent={handleOpenDetails}
            onSelectDate={handleOpenNewModal}
            personalEvents={personalEvents}
            calendarMode={calendarMode}
            onSelectPersonalEvent={handleOpenPersonalEvent}
          />
        </div>

        {/* Upcoming Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Business upcoming events */}
          {calendarMode !== "personal" && (
            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border space-y-4">
              <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary border-b border-border pb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Upcoming Business
              </h3>
              {events.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">No upcoming events scheduled.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
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
          )}

          {/* Personal upcoming events */}
          {(calendarMode === "personal" || calendarMode === "overlay") && (
            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-violet-500/20 space-y-4">
              <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-violet-400 border-b border-border pb-3 flex items-center gap-2">
                <User2 className="h-4 w-4" /> Upcoming Personal
              </h3>
              {personalEvents.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-muted-foreground">No personal events yet.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedPersonalEvent(null); setPersonalDefaultDate(new Date().toISOString().split("T")[0]); setIsPersonalModalOpen(true); }}
                    className="text-xs text-violet-400 hover:bg-violet-500/10"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {personalEvents
                    .filter((e) => e.date >= todayStr)
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, 6)
                    .map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => handleOpenPersonalEvent(evt)}
                        className="p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 hover:brightness-110"
                        style={{ backgroundColor: `${evt.color}10`, borderColor: `${evt.color}30` }}
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold font-mono" style={{ color: evt.color }}>📅 {evt.date}</span>
                          {evt.is_all_day ? (
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${evt.color}20`, color: evt.color }}>All Day</span>
                          ) : evt.start_time && (
                            <span className="text-[9px] font-bold" style={{ color: evt.color }}>{evt.start_time}</span>
                          )}
                        </div>
                        <p className="font-bold text-xs text-white truncate">{evt.title}</p>
                        {evt.location && <p className="text-[10px] text-slate-400">📍 {evt.location}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Overlay conflict summary */}
          {calendarMode === "overlay" && overlayConflictCount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4" /> Schedule Conflicts
              </h3>
              <p className="text-xs text-amber-300/80">
                {overlayConflictCount} date{overlayConflictCount > 1 ? "s" : ""} where your personal plans overlap with business bookings. Review in Overlay mode to reschedule personal events if needed.
              </p>
              <div className="space-y-1.5">
                {personalEvents
                  .filter((e) => events.some((b) => b.date === e.date))
                  .slice(0, 4)
                  .map((e) => (
                    <div key={e.id} className="text-[11px] text-amber-300 flex items-center gap-2">
                      <Zap className="h-3 w-3 flex-shrink-0" />
                      <span className="font-mono">{e.date}</span>
                      <span className="truncate">{e.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BookingDetailsModal
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedEvent(null); }}
        onUpdate={fetchPlannerData}
      />

      <NewBookingModal
        isOpen={isNewModalOpen}
        selectedDate={selectedDate}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchPlannerData}
      />

      <PersonalEventModal
        isOpen={isPersonalModalOpen}
        event={selectedPersonalEvent}
        defaultDate={personalDefaultDate}
        onClose={() => { setIsPersonalModalOpen(false); setSelectedPersonalEvent(null); }}
        onSuccess={fetchPersonalEvents}
      />

      <CalendarImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchPersonalEvents}
        subscriptions={subscriptions}
        onSubscriptionsChange={fetchSubscriptions}
      />
    </div>
  );
}
