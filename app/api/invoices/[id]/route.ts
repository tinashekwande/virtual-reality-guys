import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

interface Props {
  params: Promise<{ id: string }>
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
  return NextResponse.json(data)
}

// PUT update invoice/quote
export async function PUT(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  const admin = createAdminClient()

  const updatePayload: any = {
    type: body.type,
    doc_number: body.doc_number,
    client_name: body.client_name,
    client_email: body.client_email,
    client_phone: body.client_phone,
    client_address: body.client_address,
    event_date: body.event_date,
    issue_date: body.issue_date,
    due_date: body.due_date,
    status: body.status,
    items: body.items,
    subtotal: body.subtotal,
    discount: body.discount,
    transport_fee: body.transport_fee,
    total: body.total,
    deposit_percentage: body.deposit_percentage !== undefined ? Number(body.deposit_percentage) : 0,
    notes: body.notes,
    updated_at: new Date().toISOString(),
  }

  let { data, error } = await admin
    .from('invoices')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  // Fallback if deposit_percentage column has not been added to DB yet
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
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
