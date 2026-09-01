import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAiBusinessContext } from '@/lib/ai/context'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const settings = await getAiBusinessContext()
    return NextResponse.json(settings)
  } catch (err: any) {
    console.error('[API GET /api/ai/settings] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch AI settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const admin = createAdminClient()

    const { data: existing } = await admin.from('ai_settings').select('id').limit(1).single()

    let result
    if (existing?.id) {
      const { data, error } = await admin
        .from('ai_settings')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      result = data
    } else {
      const { data, error } = await admin.from('ai_settings').insert([body]).select().single()
      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[API POST /api/ai/settings] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to update AI settings' }, { status: 500 })
  }
}
