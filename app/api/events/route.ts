import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

function normalizeEvent(evt: any) {
  if (!evt) return evt
  if (typeof evt.description === 'string' && evt.description.includes('[TIME:')) {
    const timeMatch = evt.description.match(/\[TIME:([^\]]+)\]/)
    if (timeMatch && timeMatch[1]) {
      evt.event_time = timeMatch[1].trim()
      const parts = evt.event_time.split(/\s*(?:–|-|\bto\b)\s*/i)
      if (parts[0]) evt.start_time = parts[0].trim()
      if (parts[1]) evt.end_time = parts[1].trim()
    }
  }
  return evt
}

// GET — list all standalone events (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    const admin = createAdminClient()
    let query = admin.from('events').select('*').order('event_date', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) {
      // Table might not exist yet if migration pending
      console.warn('[events GET] Supabase error:', error.message)
      return NextResponse.json([])
    }
    const normalized = Array.isArray(data) ? data.map(normalizeEvent) : []
    return NextResponse.json(normalized)
  } catch (err: any) {
    return NextResponse.json([], { status: 200 })
  }
}

// POST — create a new standalone event (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const admin = createAdminClient()

    const rawTime = body.start_time ? (body.end_time ? `${body.start_time} - ${body.end_time}` : body.start_time) : (body.event_time || '')
    const timeTag = rawTime ? ` [TIME:${rawTime.trim()}]` : ''
    const cleanDesc = (body.description || '').replace(/\[TIME:[^\]]+\]/g, '').trim()

    const insertPayload: any = {
      title: body.title || 'Special VR Event',
      event_date: body.event_date || new Date().toISOString().split('T')[0],
      event_time: rawTime,
      start_time: body.start_time || '',
      end_time: body.end_time || '',
      event_type: body.event_type || 'Corporate Activation',
      location: body.location || '',
      description: `${cleanDesc}${timeTag}`.trim(),
      total_revenue: body.total_revenue !== undefined ? Number(body.total_revenue) : 0,
      total_expenses: body.total_expenses !== undefined ? Number(body.total_expenses) : 0,
      status: body.status || 'scheduled',
    }

    let { data, error } = await admin
      .from('events')
      .insert([insertPayload])
      .select()
      .single()

    // Fallback if event_time / start_time columns do not exist in table
    if (error && (error.message?.includes('event_time') || error.message?.includes('start_time') || error.message?.includes('end_time'))) {
      delete insertPayload.event_time
      delete insertPayload.start_time
      delete insertPayload.end_time
      const retry = await admin
        .from('events')
        .insert([insertPayload])
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(normalizeEvent(data), { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: 500 })
  }
}
