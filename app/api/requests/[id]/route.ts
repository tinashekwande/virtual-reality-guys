import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

function normalizeRequestStatus(status: string): string {
  const s = status.toLowerCase().trim()
  switch (s) {
    case 'new':
    case 'new_request':
      return 'new'
    case 'in_progress':
    case 'pending_confirmation':
    case 'pending':
    case 'sent':
    case 'deposit_paid':
    case 'scheduled':
      return 'in_progress'
    case 'archived':
    case 'confirmed':
    case 'booking_confirmed':
    case 'paid':
      return 'archived'
    case 'completed':
    case 'event_completed':
      return 'completed'
    case 'cancelled':
    case 'draft':
      return 'archived'
    default:
      return s
  }
}

async function handleUpdate(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const rawStatus = body.status

  if (!rawStatus) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // First try updating with the raw status (if database schema supports extended statuses)
  let { data, error } = await admin
    .from('form_requests')
    .update({ status: rawStatus })
    .eq('id', id)
    .select()
    .single()

  // If Postgres rejected with check constraint, fallback to normalized canonical status ('new', 'in_progress', 'completed', 'archived')
  if (error) {
    const normalized = normalizeRequestStatus(rawStatus)
    if (normalized !== rawStatus) {
      const retry = await admin
        .from('form_requests')
        .update({ status: normalized })
        .eq('id', id)
        .select()
        .single()

      if (!retry.error) {
        data = retry.data
        error = null
      }
    }
  }

  if (error) {
    console.error('[Update Request Status Error]:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

// Support both PUT and PATCH
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, context)
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, context)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()
  const { error } = await admin.from('form_requests').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
