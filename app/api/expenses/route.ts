import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

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

    const insertPayload = {
      event_id: body.event_id || null,
      invoice_id: body.invoice_id || null,
      title: body.title || 'General Expense',
      category: body.category || 'Other',
      amount: body.amount !== undefined ? Number(body.amount) : 0,
      date: body.date || new Date().toISOString().split('T')[0],
      notes: body.notes || '',
    }

    const { data, error } = await admin
      .from('expenses')
      .insert([insertPayload])
      .select()
      .single()

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
