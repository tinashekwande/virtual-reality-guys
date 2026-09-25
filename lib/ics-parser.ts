/**
 * Lightweight, zero-dependency iCalendar (.ics) parser.
 * Parses VEVENT blocks and returns typed event objects.
 * Compatible with Google Calendar, Apple Calendar, Outlook, and any RFC 5545 source.
 */

export interface ICSEvent {
  uid: string;
  title: string;
  description?: string;
  date: string;          // YYYY-MM-DD (start date)
  start_time?: string;   // HH:MM (undefined = all-day)
  end_time?: string;     // HH:MM
  location?: string;
  is_all_day: boolean;
}

function parseICSDate(val: string): { date: string; time?: string; isAllDay: boolean } {
  // All-day: DTSTART;VALUE=DATE:20260901 or DTSTART:20260901
  if (/^\d{8}$/.test(val)) {
    const y = val.slice(0, 4);
    const m = val.slice(4, 6);
    const d = val.slice(6, 8);
    return { date: `${y}-${m}-${d}`, isAllDay: true };
  }

  // Date-time: 20260901T143000Z or 20260901T143000
  const dtMatch = val.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (dtMatch) {
    const date = `${dtMatch[1]}-${dtMatch[2]}-${dtMatch[3]}`;
    const time = `${dtMatch[4]}:${dtMatch[5]}`;
    return { date, time, isAllDay: false };
  }

  // Fallback: try native Date parse
  const fallback = new Date(val);
  if (!isNaN(fallback.getTime())) {
    const date = fallback.toISOString().split("T")[0];
    return { date, isAllDay: true };
  }

  return { date: new Date().toISOString().split("T")[0], isAllDay: true };
}

function unfold(ics: string): string {
  // RFC 5545: line folding — CRLF followed by whitespace is a continuation
  return ics.replace(/\r?\n[ \t]/g, "");
}

function extractValue(lines: string[], key: string): string | undefined {
  // Match "KEY:" or "KEY;PARAM=...:value"
  const prefix = key.toUpperCase();
  const line = lines.find((l) => {
    const upper = l.toUpperCase();
    return upper.startsWith(prefix + ":") || upper.startsWith(prefix + ";");
  });
  if (!line) return undefined;
  const colonIdx = line.indexOf(":");
  return colonIdx >= 0 ? line.slice(colonIdx + 1).trim() : undefined;
}

function extractValueWithParam(lines: string[], key: string): { value: string; params: string } | undefined {
  const prefix = key.toUpperCase();
  const line = lines.find((l) => l.toUpperCase().startsWith(prefix));
  if (!line) return undefined;
  const colonIdx = line.indexOf(":");
  if (colonIdx < 0) return undefined;
  const params = line.slice(key.length, colonIdx);
  const value = line.slice(colonIdx + 1).trim();
  return { value, params };
}

function unescape(val: string): string {
  return val
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

export function parseICS(icsContent: string): ICSEvent[] {
  const unfolded = unfold(icsContent);
  const lines = unfolded.split(/\r?\n/);

  const events: ICSEvent[] = [];
  let inEvent = false;
  let eventLines: string[] = [];

  for (const line of lines) {
    const upper = line.trim().toUpperCase();
    if (upper === "BEGIN:VEVENT") {
      inEvent = true;
      eventLines = [];
      continue;
    }
    if (upper === "END:VEVENT") {
      inEvent = false;

      // Parse the collected event lines
      const uid = extractValue(eventLines, "UID") || crypto.randomUUID?.() || `import-${Date.now()}-${Math.random()}`;
      const summary = unescape(extractValue(eventLines, "SUMMARY") || "Imported Event");
      const desc = extractValue(eventLines, "DESCRIPTION");
      const loc = extractValue(eventLines, "LOCATION");

      const dtStartLine = extractValueWithParam(eventLines, "DTSTART");
      const dtEndLine = extractValueWithParam(eventLines, "DTEND");

      if (!dtStartLine) {
        eventLines = [];
        continue;
      }

      const isAllDayByParam = dtStartLine.params.toUpperCase().includes("VALUE=DATE");
      const parsed = parseICSDate(dtStartLine.value);
      const isAllDay = isAllDayByParam || parsed.isAllDay;

      let endTime: string | undefined;
      if (dtEndLine) {
        const parsedEnd = parseICSDate(dtEndLine.value);
        endTime = parsedEnd.time;
      }

      events.push({
        uid,
        title: summary,
        description: desc ? unescape(desc) : undefined,
        date: parsed.date,
        start_time: isAllDay ? undefined : parsed.time,
        end_time: isAllDay ? undefined : endTime,
        location: loc ? unescape(loc) : undefined,
        is_all_day: isAllDay,
      });

      eventLines = [];
      continue;
    }

    if (inEvent) {
      eventLines.push(line.trim());
    }
  }

  return events;
}
