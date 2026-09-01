import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await req.json()
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('equipment')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[API PATCH /api/equipment/[id]] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to update equipment' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const admin = createAdminClient()

    const { error } = await admin.from('equipment').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[API DELETE /api/equipment/[id]] Error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete equipment' }, { status: 500 })
  }
}
