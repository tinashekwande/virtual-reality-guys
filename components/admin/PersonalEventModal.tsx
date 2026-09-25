"use client";

import React, { useState, useEffect } from "react";
import {
  X, Calendar, Clock, MapPin, AlignLeft, Palette, Save, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonalCalendarEvent, PERSONAL_EVENT_COLORS } from "@/types/personal-calendar";
import { toast } from "sonner";

interface PersonalEventModalProps {
  isOpen: boolean;
  event?: PersonalCalendarEvent | null;
  defaultDate?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  start_time: "",
  end_time: "",
  location: "",
  color: "#8b5cf6",
  is_all_day: true,
};

export default function PersonalEventModal({
  isOpen,
  event,
  defaultDate,
  onClose,
  onSuccess,
}: PersonalEventModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setForm({
          title: event.title || "",
          description: event.description || "",
          date: event.date || "",
          start_time: event.start_time || "",
          end_time: event.end_time || "",
          location: event.location || "",
          color: event.color || "#8b5cf6",
          is_all_day: event.is_all_day ?? true,
        });
      } else {
        setForm({ ...EMPTY_FORM, date: defaultDate || new Date().toISOString().split("T")[0] });
      }
    }
  }, [isOpen, event, defaultDate]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.date) { toast.error("Date is required"); return; }

    setSaving(true);
    try {
      const payload = {
        ...(event ? { id: event.id } : {}),
        title: form.title.trim(),
        description: form.description.trim() || null,
        date: form.date,
        start_time: form.is_all_day ? null : form.start_time || null,
        end_time: form.is_all_day ? null : form.end_time || null,
        location: form.location.trim() || null,
        color: form.color,
        is_all_day: form.is_all_day,
        source: "manual",
      };

      const method = event ? "PUT" : "POST";
      const res = await fetch("/api/personal-calendar", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save event");
      }

      toast.success(event ? "Event updated!" : "Personal event created!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/personal-calendar?id=${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Event deleted");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-card border border-border/80 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/20"
              style={{ backgroundColor: form.color }}
            />
            <div>
              <h2 className="text-base font-bold font-tech text-white">
                {event ? "Edit Personal Event" : "New Personal Event"}
              </h2>
              <p className="text-xs text-muted-foreground">Personal calendar — visible only to you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Title *</label>
            <Input
              placeholder="e.g. Doctor Appointment, Family Lunch, Holiday..."
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="rounded-xl border-border bg-secondary/40"
            />
          </div>

          {/* Date + All Day */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Date *
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="rounded-xl border-border bg-secondary/40 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Day?</label>
              <div className="flex items-center h-10 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("is_all_day", !form.is_all_day)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_all_day ? "bg-violet-500" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_all_day ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">{form.is_all_day ? "All day" : "Timed"}</span>
              </div>
            </div>
          </div>

          {/* Time Range (only if not all-day) */}
          {!form.is_all_day && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Start Time
                </label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => handleChange("start_time", e.target.value)}
                  className="rounded-xl border-border bg-secondary/40 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> End Time
                </label>
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => handleChange("end_time", e.target.value)}
                  className="rounded-xl border-border bg-secondary/40 text-sm"
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Location (optional)
            </label>
            <Input
              placeholder="e.g. Cape Town, home, gym..."
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="rounded-xl border-border bg-secondary/40"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <AlignLeft className="h-3.5 w-3.5" /> Notes (optional)
            </label>
            <textarea
              placeholder="Any additional notes..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Palette className="h-3.5 w-3.5" /> Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PERSONAL_EVENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => handleChange("color", c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c.value ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          {event ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {deleting ? "Deleting..." : "Delete Event"}
            </Button>
          ) : <div />}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl border-border text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl font-semibold bg-violet-600 hover:bg-violet-700 text-white text-xs shadow-lg shadow-violet-500/20"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saving ? "Saving..." : event ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
