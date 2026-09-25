import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

// POST — batch upsert ICS events into personal_calendar_events
// Body: { events: ICSEvent[], subscription_id?: string, source?: string, color?: string }
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { events, subscription_id, source = "ics_import", color = "#8b5cf6" } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 });
    }

    const admin = createAdminClient();

    const records = events.map((evt: any) => ({
      title: evt.title || "Imported Event",
      description: evt.description || null,
      date: evt.date,
      start_time: evt.start_time || null,
      end_time: evt.end_time || null,
      location: evt.location || null,
      color,
      is_all_day: evt.is_all_day ?? true,
      source,
      external_uid: evt.uid || null,
      subscription_id: subscription_id || null,
      updated_at: new Date().toISOString(),
    }));

    // Upsert using external_uid for de-duplication
    const { data, error } = await admin
      .from("personal_calendar_events")
      .upsert(records, {
        onConflict: "external_uid",
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.warn("[personal-calendar/import POST]", error.message);
      // Fallback: bulk insert without upsert if uid index doesn't exist yet
      const { data: insertData, error: insertError } = await admin
        .from("personal_calendar_events")
        .insert(records)
        .select();
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
      return NextResponse.json({ imported: insertData?.length || 0 });
    }

    return NextResponse.json({ imported: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
