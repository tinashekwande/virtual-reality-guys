import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { syncInvoiceStatus } from '@/lib/accounts/server'

const METHODS = ['EFT', 'Cash', 'Card', 'Other']

interface Props {
  params: Promise<{ id: string }>
}

// DELETE — remove a payment that was entered by mistake; invoice status follows the remaining payments
export async function DELETE(_request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()

  const { data: existing } = await admin.from('payments').select('invoice_id').eq('id', id).single()
  if (!existing) return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })

  const { error } = await admin.from('payments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const newStatus = await syncInvoiceStatus(admin, existing.invoice_id)
  return NextResponse.json({ success: true, invoice_status: newStatus })
}

// PUT — correct or confirm a payment (amount, date, method, reference, notes); invoice status follows
export async function PUT(request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()
  const body = await request.json().catch(() => ({}))

  const { data: existing } = await admin.from('payments').select('*').eq('id', id).single()
  if (!existing) return NextResponse.json({ error: 'Payment not found.' }, { status: 404 })

  const update: Record<string, unknown> = {}
  if (body.amount !== undefined) {
    const amount = Number(body.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Enter an amount greater than zero.' }, { status: 400 })
    }
    update.amount = amount
  }
  if (body.paid_on !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(String(body.paid_on))) {
      return NextResponse.json({ error: 'Enter a valid date.' }, { status: 400 })
    }
    update.paid_on = String(body.paid_on).slice(0, 10)
  }
  if (body.method !== undefined) update.method = METHODS.includes(body.method) ? body.method : 'EFT'
  if (body.reference !== undefined) update.reference = body.reference?.toString().trim() || null
  if (body.notes !== undefined) update.notes = body.notes?.toString().trim() || null
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })

  const { data, error } = await admin.from('payments').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const newStatus = await syncInvoiceStatus(admin, existing.invoice_id)
  return NextResponse.json({ payment: data, invoice_status: newStatus })
}
