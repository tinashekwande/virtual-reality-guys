import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
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
  return NextResponse.json(data)
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
  if (body.description !== undefined) updatePayload.description = body.description
  if (body.total_revenue !== undefined) updatePayload.total_revenue = Number(body.total_revenue)
  if (body.total_expenses !== undefined) updatePayload.total_expenses = Number(body.total_expenses)
  if (body.status !== undefined) updatePayload.status = body.status

  const { data, error } = await admin
    .from('events')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
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
