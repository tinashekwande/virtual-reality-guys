import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
}

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

// GET single event by ID
export async function GET(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(normalizeEvent(data))
}

// PUT update event
export async function PUT(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const admin = createAdminClient()

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (body.title !== undefined) updatePayload.title = body.title
  if (body.event_date !== undefined) updatePayload.event_date = body.event_date
  if (body.event_type !== undefined) updatePayload.event_type = body.event_type
  if (body.location !== undefined) updatePayload.location = body.location
  if (body.total_revenue !== undefined) updatePayload.total_revenue = Number(body.total_revenue)
  if (body.total_expenses !== undefined) updatePayload.total_expenses = Number(body.total_expenses)
  if (body.status !== undefined) updatePayload.status = body.status

  const rawTime = body.start_time ? (body.end_time ? `${body.start_time} - ${body.end_time}` : body.start_time) : (body.event_time || '')
  if (rawTime) {
    updatePayload.event_time = rawTime
    updatePayload.start_time = body.start_time || ''
    updatePayload.end_time = body.end_time || ''
  }

  let currentDesc = body.description
  if (currentDesc === undefined && rawTime) {
    const { data: currentEvt } = await admin.from('events').select('description').eq('id', id).single()
    currentDesc = currentEvt?.description || ''
  }

  if (currentDesc !== undefined || rawTime) {
    let cleanDesc = (currentDesc || '').replace(/\[TIME:[^\]]+\]/g, '').trim()
    if (rawTime) {
      cleanDesc = `${cleanDesc} [TIME:${rawTime.trim()}]`.trim()
    }
    updatePayload.description = cleanDesc
  }

  let { data, error } = await admin
    .from('events')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  // Fallback if event_time column not present
  if (error && (error.message?.includes('event_time') || error.message?.includes('start_time') || error.message?.includes('end_time'))) {
    delete updatePayload.event_time
    delete updatePayload.start_time
    delete updatePayload.end_time
    const retry = await admin
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeEvent(data))
}

// DELETE event
export async function DELETE(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { error } = await admin.from('events').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
