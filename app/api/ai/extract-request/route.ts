import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { extractRequestDetails } from '@/lib/ai/request-extractor'
import { calculateLeadScore } from '@/lib/ai/lead-scoring'

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { message, name, email, phone } = body

    if (!message) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const extracted = await extractRequestDetails(message, name, email, phone)
    const leadScore = calculateLeadScore({ message, name, email, phone })

    return NextResponse.json({
      extracted,
      lead_score: leadScore,
    })
  } catch (err: any) {
    console.error('[API /api/ai/extract-request] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to extract request details' },
      { status: 500 }
    )
  }
}
