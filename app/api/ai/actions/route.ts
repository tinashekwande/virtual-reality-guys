import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('ai_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ actions: data || [] })
  } catch (err: any) {
    console.error('[API /api/ai/actions] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch AI actions' }, { status: 500 })
  }
}
