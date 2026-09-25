import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

// GET — list personal calendar events, optional ?month=YYYY-MM filter
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // e.g. "2026-09"

  try {
    const admin = createAdminClient();
    let query = admin
      .from("personal_calendar_events")
      .select("*")
      .order("date", { ascending: true });

    if (month) {
      query = query.gte("date", `${month}-01`).lt("date", `${month}-31`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("[personal-calendar GET]", error.message);
      return NextResponse.json([]);
    }
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — create a new personal calendar event
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const admin = createAdminClient();

    const payload = {
      title: body.title || "Personal Event",
      description: body.description || null,
      date: body.date,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      location: body.location || null,
      color: body.color || "#8b5cf6",
      is_all_day: body.is_all_day ?? true,
      source: body.source || "manual",
      external_uid: body.external_uid || null,
      subscription_id: body.subscription_id || null,
    };

    const { data, error } = await admin
      .from("personal_calendar_events")
      .insert([payload])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update an existing personal calendar event
export async function PUT(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("personal_calendar_events")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — delete a personal calendar event
export async function DELETE(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("personal_calendar_events")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
