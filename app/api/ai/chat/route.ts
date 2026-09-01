import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { answerBusinessQuery } from '@/lib/ai/engine'

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { message, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = await answerBusinessQuery(message, history || [])
    return NextResponse.json(response)
  } catch (err: any) {
    console.error('[API /api/ai/chat] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to process AI chat query' },
      { status: 500 }
    )
  }
}
