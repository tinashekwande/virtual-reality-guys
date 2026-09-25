import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { parseICS } from "@/lib/ics-parser";

// POST — fetch and sync a calendar subscription by ID
// Body: { id: string }
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });

    const admin = createAdminClient();

    // Fetch the subscription record
    const { data: sub, error: subError } = await admin
      .from("calendar_subscriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (subError || !sub) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Fetch the ICS feed
    let icsText: string;
    try {
      const res = await fetch(sub.url, {
        headers: { "Accept": "text/calendar, */*" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      icsText = await res.text();
    } catch (fetchErr: any) {
      return NextResponse.json(
        { error: `Could not fetch calendar feed: ${fetchErr.message}` },
        { status: 502 }
      );
    }

    // Parse ICS events
    const parsed = parseICS(icsText);
    if (parsed.length === 0) {
      return NextResponse.json({ synced: 0, message: "No events found in feed" });
    }

    const records = parsed.map((evt) => ({
      title: evt.title,
      description: evt.description || null,
      date: evt.date,
      start_time: evt.start_time || null,
      end_time: evt.end_time || null,
      location: evt.location || null,
      color: sub.color,
      is_all_day: evt.is_all_day,
      source: sub.type === "google_feed" ? "google"
            : sub.type === "apple_feed" ? "apple"
            : sub.type === "outlook_feed" ? "outlook"
            : "ics_import",
      external_uid: evt.uid,
      subscription_id: sub.id,
      updated_at: new Date().toISOString(),
    }));

    // Upsert using external_uid
    const { data: upserted, error: upsertError } = await admin
      .from("personal_calendar_events")
      .upsert(records, { onConflict: "external_uid", ignoreDuplicates: false })
      .select();

    const syncedCount = upserted?.length || records.length;

    // Update last_synced_at and event_count
    await admin
      .from("calendar_subscriptions")
      .update({
        last_synced_at: new Date().toISOString(),
        event_count: syncedCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({ synced: syncedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
