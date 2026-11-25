import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizePricingInput } from '@/lib/pricing-catalog'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Ctx) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const body = sanitizePricingInput(await req.json())
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('pricing_items')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API PATCH /api/pricing/[id]] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to update price' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const admin = createAdminClient()
    const { error } = await admin.from('pricing_items').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[API DELETE /api/pricing/[id]] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete price' }, { status: 500 })
  }
}
