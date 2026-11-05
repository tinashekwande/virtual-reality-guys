import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { buildExpenseExtras, withoutExtras } from '@/lib/accounts/expense-fields'

// GET — list expenses (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')
  const invoiceId = searchParams.get('invoice_id')
  const category = searchParams.get('category')

  try {
    const admin = createAdminClient()
    let query = admin.from('expenses').select('*').order('date', { ascending: false })

    if (eventId) query = query.eq('event_id', eventId)
    if (invoiceId) query = query.eq('invoice_id', invoiceId)
    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) {
      console.warn('[expenses GET] Supabase error:', error.message)
      return NextResponse.json([])
    }
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json([], { status: 200 })
  }
}

// POST — log new expense (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const admin = createAdminClient()

    const title = (body.title || '').toString().trim()
    if (!title) return NextResponse.json({ error: 'Give the expense a title (what was it for?).' }, { status: 400 })
    if (/^[\d\s.,R]+$/.test(title)) {
      return NextResponse.json({ error: 'The title looks like just a number. Say what it was for, e.g. "Batteries" or "Fuel to Durbanville".' }, { status: 400 })
    }
    if (!(Number(body.amount) > 0)) return NextResponse.json({ error: 'Enter an amount greater than zero.' }, { status: 400 })

    const insertPayload = {
      event_id: body.event_id || null,
      invoice_id: body.invoice_id || null,
      title,
      category: body.category || 'Other',
      amount: body.amount !== undefined ? Number(body.amount) : 0,
      date: body.date || new Date().toISOString().split('T')[0],
      notes: body.notes || '',
    }

    const extras = buildExpenseExtras(body)
    if (extras.error) return NextResponse.json({ error: extras.error }, { status: 400 })

    let { data, error } = await admin
      .from('expenses')
      .insert([{ ...insertPayload, ...extras.fields }])
      .select()
      .single()

    // Database not upgraded yet (supabase/accounts_v2.sql): save without the new fields
    if (error && /column|schema cache/i.test(error.message)) {
      const retry = await admin.from('expenses').insert([withoutExtras(insertPayload)]).select().single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If linked to an event, update total_expenses on that event automatically
    if (insertPayload.event_id && insertPayload.amount > 0) {
      const { data: allEventExp } = await admin
        .from('expenses')
        .select('amount')
        .eq('event_id', insertPayload.event_id)
      
      const updatedSum = (allEventExp || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
      await admin
        .from('events')
        .update({ total_expenses: updatedSum, updated_at: new Date().toISOString() })
        .eq('id', insertPayload.event_id)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to log expense' }, { status: 500 })
  }
}
