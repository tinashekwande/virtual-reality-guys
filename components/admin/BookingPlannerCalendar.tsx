"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Tag,
  AlertTriangle, Plus, Eye, CheckCircle2, User, Sparkles, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlannerEvent } from "@/components/admin/BookingDetailsModal";

interface BookingPlannerCalendarProps {
  events: PlannerEvent[];
  onSelectEvent: (event: PlannerEvent) => void;
  onSelectDate: (dateStr: string) => void;
}

export type ViewMode = "month" | "week" | "day" | "agenda";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingPlannerCalendar({
  events,
  onSelectEvent,
  onSelectDate,
}: BookingPlannerCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === "month") next.setMonth(next.getMonth() - 1);
    else if (viewMode === "week") next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === "month") next.setMonth(next.getMonth() + 1);
    else if (viewMode === "week") next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("en-ZA", { month: "long", year: "numeric" });

  // Map events by date (YYYY-MM-DD)
  const eventsByDate: Record<string, PlannerEvent[]> = {};
  events.forEach((evt) => {
    if (!evt.date) return;
    const cleanDate = evt.date.split("T")[0];
    if (!eventsByDate[cleanDate]) eventsByDate[cleanDate] = [];
    eventsByDate[cleanDate].push(evt);
  });

  // Helper to format date string
  const formatDateKey = (dayNum: number) => {
    const m = (month + 1).toString().padStart(2, "0");
    const d = dayNum.toString().padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border">
        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-xl border border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 px-3 text-xs font-semibold rounded-lg"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-lg font-bold font-tech text-foreground tracking-tight">
            {monthName}
          </h2>

          <input
            type="date"
            value={currentDate.toISOString().split("T")[0]}
            onChange={(e) => e.target.value && setCurrentDate(new Date(e.target.value))}
            className="bg-secondary/60 border border-border text-xs rounded-xl px-2.5 py-1 text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* View Mode Switcher & Add Booking */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-secondary/80 p-1 rounded-xl border border-border">
            {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            onClick={() => onSelectDate(todayStr)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> + New Booking
          </Button>
        </div>
      </div>

      {/* VIEW MODE: MONTH */}
      {viewMode === "month" && (
        <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border overflow-hidden shadow-2xl">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-border bg-secondary/30 text-center text-xs font-tech text-muted-foreground py-3 uppercase tracking-wider">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-border/60 bg-background/40">
            {/* Blank offset days */}
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[120px] bg-secondary/10 p-2 opacity-30" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateKey = formatDateKey(dayNum);
              const dayEvents = eventsByDate[dateKey] || [];
              const isToday = dateKey === todayStr;
              const hasConflict = dayEvents.length > 1;

              return (
                <div
                  key={dateKey}
                  onClick={() => onSelectDate(dateKey)}
                  className={`min-h-[120px] p-2 transition-all group relative cursor-pointer hover:bg-secondary/30 ${
                    isToday ? "bg-cyan-500/5 ring-1 ring-inset ring-cyan-500/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        isToday
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasConflict && (
                      <span
                        title="Conflict: Multiple bookings on this date"
                        className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/30"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Events list inside date cell */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt);
                        }}
                        className={`p-1.5 rounded-lg text-[11px] font-medium border transition-all truncate hover:scale-[1.02] shadow-sm flex items-center justify-between gap-1 ${
                          evt.source === "invoice"
                            ? evt.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        <span className="truncate">{evt.client_name || evt.title}</span>
                        <span className="text-[9px] font-mono opacity-80 uppercase">{evt.event_type}</span>
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-muted-foreground font-semibold pl-1">
                        +{dayEvents.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE: AGENDA / LIST */}
      {viewMode === "agenda" && (
        <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary border-b border-border pb-3">
            Chronological Upcoming Booking Agenda
          </h3>

          {events.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <CalendarIcon className="h-10 w-10 mx-auto opacity-40 text-primary" />
              <p className="text-sm font-bold">No bookings scheduled yet</p>
              <p className="text-xs">Click "+ New Booking" to create your first event.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {events
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors rounded-xl px-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex flex-col items-center justify-center font-mono flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          {new Date(evt.date).toLocaleString("en-ZA", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-cyan-400">
                          {evt.date.split("-")[2] || "01"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground text-sm">{evt.client_name || evt.title}</h4>
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full border ${
                              evt.status === "paid" || evt.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            }`}
                          >
                            {evt.status}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>📦 Package: {evt.event_type}</span>
                          {evt.client_address && <span>📍 {evt.client_address}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      {evt.total_amount && evt.total_amount > 0 ? (
                        <span className="font-tech font-bold text-sm text-cyan-400">
                          R {evt.total_amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                        </span>
                      ) : null}
                      <Button variant="ghost" size="sm" className="text-xs rounded-xl">
                        View Details →
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE: WEEK OR DAY */}
      {(viewMode === "week" || viewMode === "day") && (
        <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-border p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="text-sm font-bold font-tech uppercase tracking-wider text-primary">
              {viewMode === "week" ? "7-Day Event Schedule" : `Events on ${currentDate.toISOString().split("T")[0]}`}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">{monthName}</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter((evt) => {
                if (viewMode === "day") {
                  return evt.date === currentDate.toISOString().split("T")[0];
                }
                return true; // Simple week subset view
              })
              .map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="bg-secondary/40 p-4 rounded-2xl border border-border/80 hover:border-cyan-500/50 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold font-tech text-cyan-400">📅 {evt.date}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {evt.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{evt.client_name || evt.title}</h4>
                    <p className="text-xs text-muted-foreground">Type: {evt.event_type}</p>
                  </div>

                  {evt.client_address && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      {evt.client_address}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
