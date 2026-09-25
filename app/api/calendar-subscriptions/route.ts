import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

// GET — list all calendar subscriptions
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("calendar_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[calendar-subscriptions GET]", error.message);
      return NextResponse.json([]);
    }
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — add a new calendar subscription
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.url || !body.name) {
      return NextResponse.json({ error: "name and url are required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("calendar_subscriptions")
      .insert([{
        name: body.name,
        type: body.type || "ics_url",
        url: body.url,
        color: body.color || "#8b5cf6",
        is_active: true,
        event_count: 0,
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a subscription and all its events
export async function DELETE(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const admin = createAdminClient();
    // Delete associated personal events first
    await admin
      .from("personal_calendar_events")
      .delete()
      .eq("subscription_id", id);

    const { error } = await admin
      .from("calendar_subscriptions")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
