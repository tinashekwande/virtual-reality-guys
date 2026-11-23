import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { isMissingSchemaError } from '@/lib/accounts/server'
import { recordEquipmentSale } from '@/lib/accounts/equipment-sales'

// GET — list equipment sales, newest first (admin only)
export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { data, error } = await createAdminClient().from('equipment_sales').select('*').order('sold_on', { ascending: false })
  if (error) {
    // Table not created yet: behave as "no sales" so the rest of Accounts keeps working
    if (isMissingSchemaError(error.message)) return NextResponse.json([])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}

// POST — record equipment sold (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const result = await recordEquipmentSale(createAdminClient(), body)
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 })
    return NextResponse.json(result.sale, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record sale' }, { status: 500 })
  }
}
