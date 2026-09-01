import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { generateDailyBriefing } from '@/lib/ai/engine'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const briefing = await generateDailyBriefing()
    return NextResponse.json(briefing)
  } catch (err: any) {
    console.error('[API /api/ai/briefing] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate AI briefing' },
      { status: 500 }
    )
  }
}
