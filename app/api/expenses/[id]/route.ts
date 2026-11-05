import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { buildExpenseExtras } from '@/lib/accounts/expense-fields'

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

  // Get prior record to detect if linked event changed
  const { data: existing } = await admin
    .from('expenses')
    .select('event_id')
    .eq('id', id)
    .single()

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (body.title !== undefined) updatePayload.title = body.title
  if (body.category !== undefined) updatePayload.category = body.category
  if (body.amount !== undefined) updatePayload.amount = Number(body.amount)
  if (body.date !== undefined) updatePayload.date = body.date
  if (body.notes !== undefined) updatePayload.notes = body.notes
  if (body.event_id !== undefined) updatePayload.event_id = body.event_id ? body.event_id : null
  if (body.invoice_id !== undefined) updatePayload.invoice_id = body.invoice_id ? body.invoice_id : null

  const extras = buildExpenseExtras(body, true)
  if (extras.error) return NextResponse.json({ error: extras.error }, { status: 400 })

  let { data, error } = await admin
    .from('expenses')
    .update({ ...updatePayload, ...extras.fields })
    .eq('id', id)
    .select()
    .single()

  // Database not upgraded yet (supabase/accounts_v2.sql): save without the new fields
  if (error && /column|schema cache/i.test(error.message)) {
    const retry = await admin.from('expenses').update(updatePayload).eq('id', id).select().single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Recalculate event expenses for newly linked/updated event
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

  // If the event link was removed or switched, recalculate the old event too
  if (existing?.event_id && existing.event_id !== data?.event_id) {
    const { data: oldEventExp } = await admin
      .from('expenses')
      .select('amount')
      .eq('event_id', existing.event_id)
    
    const oldSum = (oldEventExp || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    await admin
      .from('events')
      .update({ total_expenses: oldSum, updated_at: new Date().toISOString() })
      .eq('id', existing.event_id)
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
