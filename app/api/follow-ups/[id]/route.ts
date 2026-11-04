import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props { params: Promise<{ id: string }> }

// PATCH — update a follow-up's status (sent / replied / cancelled) or reschedule
export async function PATCH(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const patch: Record<string, any> = { updated_at: new Date().toISOString() }
  if (['pending', 'sent', 'cancelled', 'replied'].includes(body.status)) patch.status = body.status
  if (typeof body.scheduled_for === 'string') patch.scheduled_for = body.scheduled_for
  if (typeof body.message_draft === 'string') patch.message_draft = body.message_draft

  const { data, error } = await createAdminClient().from('follow_ups').update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
