import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { executeApprovedActionTool } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const { user, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { action_id } = body

    if (!action_id) {
      return NextResponse.json({ error: 'Action ID is required' }, { status: 400 })
    }

    const adminName = user?.email?.split('@')[0] || 'Admin'
    const result = await executeApprovedActionTool(action_id, adminName)

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[API /api/ai/actions/approve] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to approve and execute action' },
      { status: 500 }
    )
  }
}
