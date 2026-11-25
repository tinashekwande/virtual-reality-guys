import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { isMissingSchemaError, resolveInvoiceStatus, syncInvoiceStatus } from '@/lib/accounts/server'
import { summarisePayments } from '@/lib/accounts/calc'
import type { Invoice, PaymentItem } from '@/types'

const METHODS = ['EFT', 'Cash', 'Card', 'Other']

// GET — list payments, optionally for one invoice (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const invoiceId = new URL(request.url).searchParams.get('invoice_id')
  const admin = createAdminClient()
  let query = admin.from('payments').select('*').order('paid_on', { ascending: false })
  if (invoiceId) query = query.eq('invoice_id', invoiceId)

  const { data, error } = await query
  if (error) {
    // Table not created yet: behave as "no payments" so the rest of Accounts keeps working
    if (isMissingSchemaError(error.message)) return NextResponse.json([])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}

// POST — record a payment received against an invoice (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const amount = Number(body.amount)
    if (!body.invoice_id) return NextResponse.json({ error: 'invoice_id is required' }, { status: 400 })
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Enter an amount greater than zero.' }, { status: 400 })
    }
    const method = METHODS.includes(body.method) ? body.method : 'EFT'
    const paidOn = /^\d{4}-\d{2}-\d{2}/.test(body.paid_on || '') ? String(body.paid_on).slice(0, 10) : new Date().toISOString().split('T')[0]

    const admin = createAdminClient()
    const { data: rawInv } = await admin.from('invoices').select('*').eq('id', body.invoice_id).single()
    if (!rawInv) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
    const inv = resolveInvoiceStatus(rawInv) as Invoice
    if (inv.type === 'quote') return NextResponse.json({ error: 'Payments can only be recorded on invoices. Convert the quote to an invoice first.' }, { status: 400 })
    if (inv.status === 'cancelled') return NextResponse.json({ error: 'This invoice is cancelled.' }, { status: 400 })

    // Guard against typos that would overpay the invoice by a lot
    const { data: existing } = await admin.from('payments').select('*').eq('invoice_id', inv.id)
    const before = summarisePayments(inv, (existing || []) as PaymentItem[])
    if (amount > before.balance + 0.005 && !body.allow_overpay) {
      return NextResponse.json(
        { error: `That is more than the balance due (R${before.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}).` },
        { status: 400 }
      )
    }

    const { data, error } = await admin
      .from('payments')
      .insert([
        {
          invoice_id: inv.id,
          amount,
          paid_on: paidOn,
          method,
          reference: body.reference?.toString().trim() || null,
          received_by: body.received_by?.toString().trim() || null,
          notes: body.notes?.toString().trim() || null,
        },
      ])
      .select()
      .single()

    if (error) {
      if (isMissingSchemaError(error.message)) {
        return NextResponse.json({ error: 'Payments are not set up yet: run supabase/accounts_v2.sql in Supabase first.' }, { status: 503 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const newStatus = await syncInvoiceStatus(admin, inv.id)
    return NextResponse.json({ payment: data, invoice_status: newStatus || inv.status }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record payment' }, { status: 500 })
  }
}
