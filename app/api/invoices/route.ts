import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

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
    return NextResponse.json(data || [])
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

    const { data, error } = await admin
      .from('invoices')
      .insert([
        {
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
          notes: body.notes || '',
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create document' }, { status: 500 })
  }
}
