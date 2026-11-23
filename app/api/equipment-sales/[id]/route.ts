import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { deleteEquipmentSale } from '@/lib/accounts/equipment-sales'

interface Props {
  params: Promise<{ id: string }>
}

// DELETE — remove a sale entered by mistake (admin only)
export async function DELETE(_request: Request, { params }: Props) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const result = await deleteEquipmentSale(createAdminClient(), id)
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 })
  return NextResponse.json({ success: true })
}
