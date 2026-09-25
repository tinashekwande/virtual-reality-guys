"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  X, Upload, Link as LinkIcon, RefreshCw, Trash2, CheckCircle2,
  AlertCircle, FileText, Globe, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarSubscription, PERSONAL_EVENT_COLORS } from "@/types/personal-calendar";
import { parseICS } from "@/lib/ics-parser";
import { toast } from "sonner";

interface CalendarImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscriptions: CalendarSubscription[];
  onSubscriptionsChange: () => void;
}

type Tab = "upload" | "subscribe";

export default function CalendarImportModal({
  isOpen,
  onClose,
  onSuccess,
  subscriptions,
  onSubscriptionsChange,
}: CalendarImportModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upload");

  // Upload tab state
  const [parsedEvents, setParsedEvents] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importColor, setImportColor] = useState("#8b5cf6");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe tab state
  const [subName, setSubName] = useState("");
  const [subUrl, setSubUrl] = useState("");
  const [subColor, setSubColor] = useState("#8b5cf6");
  const [subType, setSubType] = useState<CalendarSubscription["type"]>("ics_url");
  const [subscribing, setSubscribing] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".ics") && !file.name.endsWith(".ical")) {
      toast.error("Please upload a valid .ics or .ical file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const events = parseICS(text);
      setParsedEvents(events);
      if (events.length === 0) toast.warning("No events found in this file");
      else toast.success(`Found ${events.length} events — review and confirm below`);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImportConfirm = async () => {
    if (parsedEvents.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/personal-calendar/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: parsedEvents, color: importColor, source: "ics_import" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      toast.success(`✓ Imported ${data.imported} events successfully!`);
      setParsedEvents([]);
      setFileName(null);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subName.trim() || !subUrl.trim()) {
      toast.error("Please enter a name and URL");
      return;
    }
    setSubscribing(true);
    try {
      // 1. Create the subscription record
      const createRes = await fetch("/api/calendar-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName.trim(), url: subUrl.trim(), type: subType, color: subColor }),
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.error || "Failed to create subscription");

      // 2. Immediately trigger a sync
      const syncRes = await fetch("/api/calendar-subscriptions/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: created.id }),
      });
      const syncData = await syncRes.json();

      if (syncRes.ok) {
        toast.success(`Subscribed! Synced ${syncData.synced} events from "${subName}"`);
      } else {
        toast.warning(`Subscribed, but sync had an issue: ${syncData.error}. You can sync manually.`);
      }

      setSubName(""); setSubUrl(""); setSubColor("#8b5cf6"); setSubType("ics_url");
      onSubscriptionsChange();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await fetch("/api/calendar-subscriptions/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Synced ${data.synced} events`);
      onSubscriptionsChange();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm("Delete this subscription and all its events?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/calendar-subscriptions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Subscription removed");
      onSubscriptionsChange();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-card border border-border/80 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-base font-bold font-tech text-white">📥 Import External Calendar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Upload an .ics file or subscribe to a live Google / Apple / Outlook feed</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-secondary/60 text-muted-foreground hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-4 border-b border-border flex-shrink-0">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === "upload" ? "bg-violet-600 text-white shadow" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
          >
            <Upload className="h-3.5 w-3.5" /> Upload .ics File
          </button>
          <button
            onClick={() => setActiveTab("subscribe")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === "subscribe" ? "bg-violet-600 text-white shadow" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
          >
            <Globe className="h-3.5 w-3.5" /> Live Feed / Subscribe
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* ── TAB: UPLOAD ── */}
          {activeTab === "upload" && (
            <div className="space-y-5">
              <div className="text-xs text-muted-foreground bg-secondary/30 rounded-xl p-3 border border-border">
                <strong className="text-foreground">How to export:</strong> Open Google Calendar → Settings → [Calendar name] → Export. In Apple Calendar: File → Export. In Outlook: File → Open & Export → Import/Export → Export to a file.
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-violet-500/50 rounded-2xl p-10 text-center cursor-pointer transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ics,.ical"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-violet-400 mb-3 transition-colors" />
                <p className="text-sm font-semibold text-foreground">Drop your .ics file here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>

              {fileName && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-xl p-3 border border-border">
                  <FileText className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  <span className="font-medium text-foreground">{fileName}</span>
                  <span className="ml-auto text-violet-400 font-semibold">{parsedEvents.length} events found</span>
                </div>
              )}

              {parsedEvents.length > 0 && (
                <div className="space-y-3">
                  {/* Color picker for import */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event Color:</span>
                    <div className="flex gap-2">
                      {PERSONAL_EVENT_COLORS.slice(0, 6).map((c) => (
                        <button
                          key={c.value}
                          title={c.label}
                          onClick={() => setImportColor(c.value)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${importColor === c.value ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preview list */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-border rounded-xl p-3 bg-secondary/20">
                    {parsedEvents.slice(0, 20).map((evt, i) => (
                      <div key={i} className="flex items-center justify-between text-xs gap-2 py-1 border-b border-border/30 last:border-0">
                        <span className="font-medium text-white truncate max-w-[60%]">{evt.title}</span>
                        <span className="text-muted-foreground font-mono flex-shrink-0">{evt.date}{!evt.is_all_day && evt.start_time ? ` ${evt.start_time}` : ""}</span>
                      </div>
                    ))}
                    {parsedEvents.length > 20 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">…and {parsedEvents.length - 20} more</p>
                    )}
                  </div>

                  <Button
                    onClick={handleImportConfirm}
                    disabled={importing}
                    className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                  >
                    {importing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing…</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4 mr-2" /> Import {parsedEvents.length} Events</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SUBSCRIBE ── */}
          {activeTab === "subscribe" && (
            <div className="space-y-5">
              <div className="text-xs text-muted-foreground bg-secondary/30 rounded-xl p-3 border border-border space-y-1">
                <p><strong className="text-foreground">Google Calendar:</strong> Settings → [Calendar] → Integrate → "Secret address in iCal format" → copy the link.</p>
                <p><strong className="text-foreground">Apple iCloud:</strong> Calendar → Right-click calendar → Copy link → paste below.</p>
                <p><strong className="text-foreground">Outlook:</strong> Calendar settings → Shared calendars → "Publish a calendar" → ICS link.</p>
              </div>

              {/* Add new subscription form */}
              <div className="bg-secondary/20 border border-border/60 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Add New Feed</p>

                <Input
                  placeholder="Subscription name (e.g. My Google Calendar)"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="rounded-xl border-border bg-secondary/40 text-sm"
                />
                <Input
                  placeholder="Paste ICS feed URL (webcal:// or https://...)"
                  value={subUrl}
                  onChange={(e) => setSubUrl(e.target.value)}
                  className="rounded-xl border-border bg-secondary/40 text-sm font-mono text-xs"
                />

                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Type</span>
                    <select
                      value={subType}
                      onChange={(e) => setSubType(e.target.value as any)}
                      className="block text-xs rounded-xl border border-border bg-secondary/60 px-2 py-1.5 text-foreground focus:outline-none"
                    >
                      <option value="ics_url">Generic ICS</option>
                      <option value="google_feed">Google Calendar</option>
                      <option value="apple_feed">Apple Calendar</option>
                      <option value="outlook_feed">Outlook</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Color</span>
                    <div className="flex gap-1.5 mt-1">
                      {PERSONAL_EVENT_COLORS.slice(0, 5).map((c) => (
                        <button
                          key={c.value}
                          title={c.label}
                          onClick={() => setSubColor(c.value)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${subColor === c.value ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={subscribing || !subName.trim() || !subUrl.trim()}
                  className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                >
                  {subscribing ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Subscribing & Syncing…</>
                  ) : (
                    <><LinkIcon className="h-4 w-4 mr-2" /> Subscribe & Sync Now</>
                  )}
                </Button>
              </div>

              {/* Existing subscriptions */}
              {subscriptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Subscriptions</p>
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-3 bg-secondary/30 border border-border/60 rounded-2xl p-3.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20" style={{ backgroundColor: sub.color }} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{sub.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {sub.event_count} events
                            {sub.last_synced_at && ` · Last synced ${new Date(sub.last_synced_at).toLocaleDateString("en-ZA")}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSync(sub.id)}
                          disabled={syncingId === sub.id}
                          className="h-7 rounded-lg text-xs text-muted-foreground hover:text-white"
                        >
                          {syncingId === sub.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSub(sub.id)}
                          disabled={deletingId === sub.id}
                          className="h-7 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {subscriptions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  <Globe className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No active subscriptions yet. Add a live feed above.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex justify-end flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-border text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
