import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

function normalizeInvoice(inv: any) {
  if (!inv) return inv
  if (typeof inv.notes === 'string' && inv.notes.includes('[STATUS:')) {
    const match = inv.notes.match(/\[STATUS:([a-zA-Z0-9_]+)\]/)
    if (match && match[1]) {
      inv.status = match[1]
      inv.notes = inv.notes.replace(/\[STATUS:[a-zA-Z0-9_]+\]/g, '').trim()
    }
  }
  return inv
}

// GET — list invoices & quotes (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  try {
    const admin = createAdminClient()
    let query = admin.from('invoices').select('*').order('created_at', { ascending: false })

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const normalized = Array.isArray(data) ? data.map(normalizeInvoice) : []
    return NextResponse.json(normalized)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch invoices' }, { status: 500 })
  }
}

// POST — create new quote/invoice (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const admin = createAdminClient()

    const insertPayload: any = {
      type: body.type || 'quote',
      doc_number: body.doc_number,
      client_name: body.client_name,
      client_email: body.client_email || '',
      client_phone: body.client_phone || '',
      client_address: body.client_address || '',
      event_date: body.event_date || '',
      issue_date: body.issue_date || new Date().toISOString().split('T')[0],
      due_date: body.due_date || '',
      status: body.status || 'draft',
      items: body.items || [],
      subtotal: body.subtotal || 0,
      discount: body.discount || 0,
      transport_fee: body.transport_fee || 0,
      total: body.total || 0,
      deposit_percentage: body.deposit_percentage !== undefined ? Number(body.deposit_percentage) : 0,
      notes: body.notes || '',
    }

    let { data, error } = await admin
      .from('invoices')
      .insert([insertPayload])
      .select()
      .single()

    // Fallback 1: if deposit_percentage column has not been added to DB yet
    if (error && error.message?.includes('deposit_percentage')) {
      delete insertPayload.deposit_percentage
      const retry = await admin
        .from('invoices')
        .insert([insertPayload])
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    // Fallback 2: if status constraint in Supabase table rejects new status (deposit_paid / pending)
    if (error && (error.message?.includes('invoices_status_check') || error.message?.includes('check constraint'))) {
      const originalStatus = insertPayload.status
      insertPayload.status = originalStatus === 'draft' ? 'draft' : 'sent'
      const cleanNotes = (insertPayload.notes || '').replace(/\[STATUS:[^\]]+\]/g, '').trim()
      insertPayload.notes = `${cleanNotes} [STATUS:${originalStatus}]`.trim()

      const retry = await admin
        .from('invoices')
        .insert([insertPayload])
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(normalizeInvoice(data), { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create document' }, { status: 500 })
  }
}
