import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { generateEventPlan } from '@/lib/ai/event-planner'
import { getBookingByIdTool } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, type } = body

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 })
    }

    const found = await getBookingByIdTool({ id, type: type === 'event' ? 'event' : 'invoice' })
    if (!found) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    const record = found.type === 'event' ? (found as any).event : (found as any).invoice
    const plan = await generateEventPlan(record, found.type === 'invoice')

    return NextResponse.json(plan)
  } catch (err: any) {
    console.error('[API /api/ai/plan-event] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate event plan' },
      { status: 500 }
    )
  }
}
