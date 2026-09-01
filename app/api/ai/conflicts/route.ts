import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { detectAllConflicts } from '@/lib/ai/conflict-detector'

export async function GET(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(req.url)
    const targetDate = searchParams.get('date') || undefined

    const conflicts = await detectAllConflicts(targetDate)
    return NextResponse.json({
      conflicts,
      count: conflicts.length,
    })
  } catch (err: any) {
    console.error('[API /api/ai/conflicts] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to scan conflicts' },
      { status: 500 }
    )
  }
}
