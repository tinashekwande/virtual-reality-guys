import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { generateCustomerMessage, CommunicationTemplate } from '@/lib/ai/followups'

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await req.json()
    const { template, recipient } = body

    if (!template || !recipient) {
      return NextResponse.json({ error: 'Template and recipient details are required' }, { status: 400 })
    }

    const message = await generateCustomerMessage(template as CommunicationTemplate, recipient)
    return NextResponse.json(message)
  } catch (err: any) {
    console.error('[API /api/ai/message] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate customer message' },
      { status: 500 }
    )
  }
}
