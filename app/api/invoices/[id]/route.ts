import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
}

function normalizeInvoice(inv: any) {
  if (!inv) return inv
  if (typeof inv.notes === 'string' && inv.notes.includes('[STATUS:')) {
    const match = inv.notes.match(/\[STATUS:([a-zA-Z0-9_]+)\]/)
    if (match && match[1]) {
      // Only let [STATUS:...] override if the database status is 'sent' (used as a fallback placeholder for pending/deposit_paid)
      // If the database status is explicitly 'paid', 'cancelled', or 'draft', trust the real database status!
      if (inv.status === 'sent') {
        inv.status = match[1]
      }
      inv.notes = inv.notes.replace(/\[STATUS:[a-zA-Z0-9_]+\]/g, '').trim()
    }
  }
  return inv
}

// GET single invoice/quote by ID
export async function GET(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(normalizeInvoice(data))
}

// PUT update invoice/quote
export async function PUT(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const admin = createAdminClient()

  // Build partial update payload dynamically so undefined fields are not overwritten
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (body.type !== undefined) updatePayload.type = body.type
  if (body.doc_number !== undefined) updatePayload.doc_number = body.doc_number
  if (body.client_name !== undefined) updatePayload.client_name = body.client_name
  if (body.client_email !== undefined) updatePayload.client_email = body.client_email
  if (body.client_phone !== undefined) updatePayload.client_phone = body.client_phone
  if (body.client_address !== undefined) updatePayload.client_address = body.client_address
  if (body.event_date !== undefined) updatePayload.event_date = body.event_date
  if (body.issue_date !== undefined) updatePayload.issue_date = body.issue_date
  if (body.due_date !== undefined) updatePayload.due_date = body.due_date
  if (body.status !== undefined) updatePayload.status = body.status
  if (body.items !== undefined) updatePayload.items = body.items
  if (body.subtotal !== undefined) updatePayload.subtotal = body.subtotal
  if (body.discount !== undefined) updatePayload.discount = body.discount
  if (body.transport_fee !== undefined) updatePayload.transport_fee = body.transport_fee
  if (body.total !== undefined) updatePayload.total = body.total
  if (body.deposit_percentage !== undefined) updatePayload.deposit_percentage = Number(body.deposit_percentage)

  // Clean stale [STATUS:...] tag from notes when status or notes is updated
  let currentNotes = body.notes
  if (currentNotes === undefined && body.status !== undefined) {
    const { data: currentInv } = await admin.from('invoices').select('notes').eq('id', id).single()
    if (currentInv?.notes && currentInv.notes.includes('[STATUS:')) {
      currentNotes = currentInv.notes
    }
  }

  if (currentNotes !== undefined) {
    updatePayload.notes = (currentNotes || '').replace(/\[STATUS:[^\]]+\]/g, '').trim()
  }

  let { data, error } = await admin
    .from('invoices')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  // Fallback 1: if deposit_percentage column has not been added to DB yet
  if (error && error.message?.includes('deposit_percentage')) {
    delete updatePayload.deposit_percentage
    const retry = await admin
      .from('invoices')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  // Fallback 2: if Postgres check constraint (invoices_status_check) has not been updated for deposit_paid / pending
  if (error && (error.message?.includes('invoices_status_check') || error.message?.includes('check constraint'))) {
    const originalStatus = updatePayload.status
    updatePayload.status = originalStatus === 'draft' ? 'draft' : 'sent'

    const cleanNotes = (updatePayload.notes || '').replace(/\[STATUS:[^\]]+\]/g, '').trim()
    updatePayload.notes = `${cleanNotes} [STATUS:${originalStatus}]`.trim()

    const retry = await admin
      .from('invoices')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(normalizeInvoice(data))
}

// DELETE invoice/quote
export async function DELETE(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { error } = await admin.from('invoices').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
