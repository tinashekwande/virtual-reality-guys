import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const admin = createAdminClient()
    const [{ data: equipment, error: eqErr }, { data: logs, error: logErr }] = await Promise.all([
      admin.from('equipment').select('*').order('name', { ascending: true }),
      admin.from('equipment_logs').select('*, equipment(name)').order('created_at', { ascending: false }).limit(20),
    ])

    if (eqErr) throw eqErr
    if (logErr) throw logErr

    return NextResponse.json({
      equipment: equipment || [],
      logs: logs || [],
    })
  } catch (err: any) {
    console.error('[API /api/equipment] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch equipment' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const admin = createAdminClient()

    const { data, error } = await admin.from('equipment').insert([body]).select().single()
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('[API POST /api/equipment] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create equipment item' }, { status: 500 })
  }
}
