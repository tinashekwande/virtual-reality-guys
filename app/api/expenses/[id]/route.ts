import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
}

// PUT update expense
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
  if (body.category !== undefined) updatePayload.category = body.category
  if (body.amount !== undefined) updatePayload.amount = Number(body.amount)
  if (body.date !== undefined) updatePayload.date = body.date
  if (body.notes !== undefined) updatePayload.notes = body.notes
  if (body.event_id !== undefined) updatePayload.event_id = body.event_id
  if (body.invoice_id !== undefined) updatePayload.invoice_id = body.invoice_id

  const { data, error } = await admin
    .from('expenses')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Recalculate event expenses if linked to an event
  if (data?.event_id) {
    const { data: allEventExp } = await admin
      .from('expenses')
      .select('amount')
      .eq('event_id', data.event_id)
    
    const updatedSum = (allEventExp || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    await admin
      .from('events')
      .update({ total_expenses: updatedSum, updated_at: new Date().toISOString() })
      .eq('id', data.event_id)
  }

  return NextResponse.json(data)
}

// DELETE expense
export async function DELETE(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  // Get expense details prior to deletion to recalculate event total if needed
  const { data: existing } = await admin.from('expenses').select('event_id').eq('id', id).single()

  const { error } = await admin.from('expenses').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (existing?.event_id) {
    const { data: allEventExp } = await admin
      .from('expenses')
      .select('amount')
      .eq('event_id', existing.event_id)
    
    const updatedSum = (allEventExp || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    await admin
      .from('events')
      .update({ total_expenses: updatedSum, updated_at: new Date().toISOString() })
      .eq('id', existing.event_id)
  }

  return NextResponse.json({ success: true })
}
