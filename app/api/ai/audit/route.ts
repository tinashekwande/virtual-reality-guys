import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const admin = createAdminClient()
    let query = admin.from('ai_audit_logs').select('*').order('created_at', { ascending: false }).limit(limit)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ logs: data || [] })
  } catch (err: any) {
    console.error('[API /api/ai/audit] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch AI audit logs' }, { status: 500 })
  }
}
