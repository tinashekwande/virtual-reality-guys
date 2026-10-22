/**
 * lib/time-utils.ts
 * Robust utilities for parsing, formatting, and analyzing event times and calendar clashes.
 */

export interface ParsedTimeRange {
  startMinutes: number; // minutes from 00:00 (0 to 1439)
  endMinutes: number;   // minutes from 00:00 (0 to 1439)
  hasTime: boolean;
  isAllDay: boolean;
  displayTime: string;  // e.g. "14:00 – 17:00" or "All Day"
  startTimeStr: string; // e.g. "14:00"
  endTimeStr: string;   // e.g. "17:00"
}

/**
 * Extracts a time string from notes, messages, or description tags.
 * Supports [TIME: 14:00 - 17:00], [Event Time: 14:00], [Start Time: 14:00], etc.
 */
export function extractTimeFromText(text?: string): string | null {
  if (!text) return null;

  // 1. Tag format [TIME: ...] or [EVENT TIME: ...] or [START TIME: ...]
  const tagMatch = text.match(/\[(?:EVENT\s+)?TIME:\s*([^\]]+)\]/i);
  if (tagMatch && tagMatch[1]) {
    return tagMatch[1].trim();
  }

  const startTagMatch = text.match(/\[START\s+TIME:\s*([^\]]+)\]/i);
  const endTagMatch = text.match(/\[END\s+TIME:\s*([^\]]+)\]/i);
  if (startTagMatch && startTagMatch[1]) {
    const s = startTagMatch[1].trim();
    const e = endTagMatch ? endTagMatch[1].trim() : "";
    return e ? `${s} - ${e}` : s;
  }

  // 2. Inline time patterns like "Time: 14:00" or "Time: 2:00 PM - 5:00 PM"
  const inlineMatch = text.match(/(?:^|\n|\b)(?:event\s+)?time\s*[:\-]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?(?:\s*(?:-|to)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?)/i);
  if (inlineMatch && inlineMatch[1]) {
    return inlineMatch[1].trim();
  }

  return null;
}

/**
 * Estimates duration in minutes from package descriptions (e.g. "4 Headsets, 3 Hours").
 */
export function extractDurationMinutes(text?: string, defaultMinutes = 180): number {
  if (!text) return defaultMinutes;
  const match = text.match(/\b(\d+(?:\.\d+)?)\s*(?:hour|hr)s?\b/i);
  if (match && match[1]) {
    const hrs = parseFloat(match[1]);
    if (!isNaN(hrs) && hrs > 0) return Math.round(hrs * 60);
  }
  return defaultMinutes;
}

/**
 * Converts "HH:MM" or "H:MM AM/PM" to minutes from 00:00.
 */
export function parseClockToMinutes(clockStr: string): number | null {
  if (!clockStr) return null;
  const clean = clockStr.trim().toLowerCase();

  // Handle 12-hour AM/PM: e.g. "2:30 pm", "2pm", "10:00 am"
  const ampmMatch = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const mins = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPm = ampmMatch[3] === "pm";

    if (hours === 12) {
      hours = isPm ? 12 : 0;
    } else if (isPm) {
      hours += 12;
    }
    return hours * 60 + mins;
  }

  // Handle 24-hour: e.g. "14:30", "14:00", "09:15"
  const h24Match = clean.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (h24Match) {
    const hours = parseInt(h24Match[1], 10);
    const mins = h24Match[2] ? parseInt(h24Match[2], 10) : 0;
    if (hours >= 0 && hours <= 24 && mins >= 0 && mins < 60) {
      return hours * 60 + mins;
    }
  }

  return null;
}

/**
 * Formats numeric minutes into "HH:MM" 24-hour string.
 */
export function minutesToClock(mins: number): string {
  const normalized = Math.max(0, Math.min(1439, mins));
  const h = Math.floor(normalized / 60).toString().padStart(2, "0");
  const m = (normalized % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Parses any time specification into a standard ParsedTimeRange.
 * Examples:
 * - "14:00" -> { startMinutes: 840, endMinutes: 1020, displayTime: "14:00 – 17:00", ... }
 * - "14:00 - 16:30" -> { startMinutes: 840, endMinutes: 990, displayTime: "14:00 – 16:30", ... }
 */
export function parseTimeRange(
  rawTime?: string | null,
  options: {
    durationMinutes?: number;
    isAllDay?: boolean;
    fallbackStartMinutes?: number;
  } = {}
): ParsedTimeRange {
  const { durationMinutes = 180, isAllDay = false, fallbackStartMinutes = 600 } = options;

  if (isAllDay || !rawTime || rawTime.trim().toLowerCase() === "all day" || rawTime.trim().toLowerCase() === "all-day") {
    return {
      startMinutes: 480, // 08:00
      endMinutes: 1200,  // 20:00
      hasTime: false,
      isAllDay: true,
      displayTime: "All Day",
      startTimeStr: "",
      endTimeStr: "",
    };
  }

  const clean = rawTime.trim();

  // Check if string contains a range separator (-, –, to)
  const rangeParts = clean.split(/\s*(?:–|-|\bto\b)\s*/i);

  if (rangeParts.length >= 2) {
    const startM = parseClockToMinutes(rangeParts[0]);
    const endM = parseClockToMinutes(rangeParts[1]);

    if (startM !== null) {
      let finalEndM = endM !== null && endM > startM ? endM : startM + durationMinutes;
      if (finalEndM > 1439) finalEndM = 1439;

      const startTimeStr = minutesToClock(startM);
      const endTimeStr = minutesToClock(finalEndM);

      return {
        startMinutes: startM,
        endMinutes: finalEndM,
        hasTime: true,
        isAllDay: false,
        displayTime: `${startTimeStr} – ${endTimeStr}`,
        startTimeStr,
        endTimeStr,
      };
    }
  }

  // Single time (e.g. start time "14:00")
  const startM = parseClockToMinutes(clean);
  if (startM !== null) {
    let finalEndM = startM + durationMinutes;
    if (finalEndM > 1439) finalEndM = 1439;

    const startTimeStr = minutesToClock(startM);
    const endTimeStr = minutesToClock(finalEndM);

    return {
      startMinutes: startM,
      endMinutes: finalEndM,
      hasTime: true,
      isAllDay: false,
      displayTime: `${startTimeStr} – ${endTimeStr}`,
      startTimeStr,
      endTimeStr,
    };
  }

  // Fallback
  return {
    startMinutes: fallbackStartMinutes,
    endMinutes: fallbackStartMinutes + durationMinutes,
    hasTime: false,
    isAllDay: false,
    displayTime: clean || "Time TBC",
    startTimeStr: "",
    endTimeStr: "",
  };
}

/**
 * Checks whether two time ranges overlap or have an insufficient travel buffer.
 */
export function evaluateClash(
  a: ParsedTimeRange,
  b: ParsedTimeRange,
  travelMinutesNeeded = 30,
  packBufferMinutes = 30
): {
  isDirectOverlap: boolean;
  isBufferClash: boolean;
  overlapMinutes: number;
  gapMinutes: number;
  requiredBufferMinutes: number;
} {
  // If either is all-day, they share the day
  if (a.isAllDay || b.isAllDay) {
    return {
      isDirectOverlap: true,
      isBufferClash: false,
      overlapMinutes: 480,
      gapMinutes: 0,
      requiredBufferMinutes: 0,
    };
  }

  // Check direct interval overlap: [startA, endA] and [startB, endB]
  const overlapStart = Math.max(a.startMinutes, b.startMinutes);
  const overlapEnd = Math.min(a.endMinutes, b.endMinutes);
  const isDirectOverlap = overlapStart < overlapEnd;
  const overlapMinutes = isDirectOverlap ? overlapEnd - overlapStart : 0;

  if (isDirectOverlap) {
    return {
      isDirectOverlap: true,
      isBufferClash: false,
      overlapMinutes,
      gapMinutes: 0,
      requiredBufferMinutes: travelMinutesNeeded + packBufferMinutes,
    };
  }

  // If no direct overlap, calculate gap between them
  let gapMinutes = 0;
  if (a.endMinutes <= b.startMinutes) {
    gapMinutes = b.startMinutes - a.endMinutes;
  } else {
    gapMinutes = a.startMinutes - b.endMinutes;
  }

  const requiredBufferMinutes = travelMinutesNeeded + packBufferMinutes;
  const isBufferClash = gapMinutes < requiredBufferMinutes;

  return {
    isDirectOverlap: false,
    isBufferClash,
    overlapMinutes: 0,
    gapMinutes,
    requiredBufferMinutes,
  };
}

/**
 * Normalizes phone numbers to comparable digits (last 9 digits, e.g. 71 123 4567).
 */
export function normalizePhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  // South African numbers: e.g. 0711234567 or 27711234567 -> last 9 digits '711234567'
  return digits.length >= 9 ? digits.slice(-9) : digits;
}

/**
 * Normalizes client name for fuzzy matching (lowercase, trimmed, strip extra spaces/titles).
 */
export function normalizeName(name?: string | null): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(mr|mrs|ms|dr|prof)\.?\s+/i, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes email address.
 */
export function normalizeEmail(email?: string | null): string {
  if (!email) return "";
  return email.toLowerCase().trim();
}

/**
 * Checks whether two bookings/records belong to the same person and event.
 * Used to merge requests and invoices into one unified booking, and prevent false conflict alarms.
 */
export function isSameClientBooking(
  a: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    date?: string;
    id?: string;
    raw_data?: any;
    raw?: any;
  },
  b: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    date?: string;
    id?: string;
    raw_data?: any;
    raw?: any;
  }
): boolean {
  if (!a || !b) return false;

  // If identical IDs, it's the exact same record
  if (a.id && b.id && a.id === b.id) return true;

  const aRaw = a.raw_data || a.raw || {};
  const bRaw = b.raw_data || b.raw || {};

  // Check explicit request reference (e.g. invoice has request_id or [REQUEST: id] in notes)
  const aReqId = aRaw.request_id || aRaw.notes?.match(/\[REQUEST:\s*([^\]]+)\]/i)?.[1];
  const bReqId = bRaw.request_id || bRaw.notes?.match(/\[REQUEST:\s*([^\]]+)\]/i)?.[1];

  if (aReqId && b.id && aReqId === b.id) return true;
  if (bReqId && a.id && bReqId === a.id) return true;

  // Date check: they must refer to the same event date (or missing/TBC on one side)
  const dateA = a.date || aRaw.event_date || aRaw.date;
  const dateB = b.date || bRaw.event_date || bRaw.date;
  if (dateA && dateB && dateA !== dateB) {
    return false;
  }

  // Check email match (strongest signal)
  const emailA = normalizeEmail(a.client_email || aRaw.client_email || aRaw.email);
  const emailB = normalizeEmail(b.client_email || bRaw.client_email || bRaw.email);
  if (emailA && emailB && emailA === emailB) {
    return true;
  }

  // Check phone match (strong signal: 9 matching digits)
  const phoneA = normalizePhone(a.client_phone || aRaw.client_phone || aRaw.phone);
  const phoneB = normalizePhone(b.client_phone || bRaw.client_phone || bRaw.phone);
  if (phoneA && phoneB && phoneA.length >= 7 && phoneA === phoneB) {
    return true;
  }

  // Check name match
  const nameA = normalizeName(a.client_name || aRaw.client_name || aRaw.name);
  const nameB = normalizeName(b.client_name || bRaw.client_name || bRaw.name);
  if (nameA && nameB && nameA.length >= 3) {
    // Exact name match
    if (nameA === nameB) return true;
    // One name contains the other (e.g. "John Smith" vs "John")
    if (nameA.includes(nameB) || nameB.includes(nameA)) {
      if (Math.min(nameA.length, nameB.length) >= 4) return true;
    }
  }

  return false;
}
