import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { listPricing, sanitizePricingInput } from '@/lib/pricing-catalog'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    return NextResponse.json({ items: await listPricing() })
  } catch (err: any) {
    console.error('[API GET /api/pricing] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to load pricing' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = sanitizePricingInput(await req.json())
    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }
    const admin = createAdminClient()
    const { data, error } = await admin.from('pricing_items').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('[API POST /api/pricing] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to add price' }, { status: 500 })
  }
}
