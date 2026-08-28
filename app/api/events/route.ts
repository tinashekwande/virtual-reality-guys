import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

// GET — list all standalone events (admin only)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    const admin = createAdminClient()
    let query = admin.from('events').select('*').order('event_date', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) {
      // Table might not exist yet if migration pending
      console.warn('[events GET] Supabase error:', error.message)
      return NextResponse.json([])
    }
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json([], { status: 200 })
  }
}

// POST — create a new standalone event (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const admin = createAdminClient()

    const insertPayload = {
      title: body.title || 'Special VR Event',
      event_date: body.event_date || new Date().toISOString().split('T')[0],
      event_type: body.event_type || 'Corporate Activation',
      location: body.location || '',
      description: body.description || '',
      total_revenue: body.total_revenue !== undefined ? Number(body.total_revenue) : 0,
      total_expenses: body.total_expenses !== undefined ? Number(body.total_expenses) : 0,
      status: body.status || 'scheduled',
    }

    const { data, error } = await admin
      .from('events')
      .insert([insertPayload])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: 500 })
  }
}
