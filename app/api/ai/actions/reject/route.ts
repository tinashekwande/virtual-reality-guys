import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { action_id, reason } = body

    if (!action_id) {
      return NextResponse.json({ error: 'Action ID is required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const adminName = user?.email?.split('@')[0] || 'Admin'

    const { data, error } = await admin
      .from('ai_actions')
      .update({
        status: 'rejected',
        approved_by: adminName,
        error: reason || 'Rejected by administrator',
      })
      .eq('id', action_id)
      .select()
      .single()

    if (error) throw error

    // Log rejection in Audit Log
    await admin.from('ai_audit_logs').insert([
      {
        action_id,
        action_name: data.action_type,
        category: 'operations',
        actor: adminName,
        target_record: data.title,
        details: { rejection_reason: reason || 'Rejected' },
        status: 'warning',
      },
    ])

    return NextResponse.json({ success: true, action: data })
  } catch (err: any) {
    console.error('[API /api/ai/actions/reject] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to reject action' },
      { status: 500 }
    )
  }
}
