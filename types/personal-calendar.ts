export interface PersonalCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;          // YYYY-MM-DD
  start_time?: string;   // HH:MM
  end_time?: string;     // HH:MM
  location?: string;
  color: string;         // hex color
  is_all_day: boolean;
  source: "manual" | "ics_import" | "google" | "apple" | "outlook" | "other";
  external_uid?: string;
  subscription_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CalendarSubscription {
  id: string;
  name: string;
  type: "ics_url" | "google_feed" | "apple_feed" | "outlook_feed";
  url: string;
  color: string;
  is_active: boolean;
  last_synced_at?: string;
  event_count: number;
  created_at?: string;
}

export type CalendarMode = "business" | "personal" | "overlay";

export const PERSONAL_EVENT_COLORS = [
  { label: "Violet",    value: "#8b5cf6" },
  { label: "Pink",      value: "#ec4899" },
  { label: "Rose",      value: "#f43f5e" },
  { label: "Orange",    value: "#f97316" },
  { label: "Yellow",    value: "#eab308" },
  { label: "Teal",      value: "#14b8a6" },
  { label: "Sky",       value: "#0ea5e9" },
  { label: "Indigo",    value: "#6366f1" },
  { label: "Lime",      value: "#84cc16" },
  { label: "Slate",     value: "#64748b" },
];
