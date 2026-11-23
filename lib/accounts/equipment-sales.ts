import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaError } from '@/lib/accounts/server'

export const SALE_METHODS = ['EFT', 'Cash', 'Card', 'Other'] as const

export interface SaleInput {
  title?: string
  sale_price?: number | string
  sold_on?: string
  buyer?: string | null
  method?: string
  equipment_id?: string | null
  asset_expense_id?: string | null
  original_cost?: number | string | null
  notes?: string | null
}

const ymd = (v?: string) => (/^\d{4}-\d{2}-\d{2}/.test(v || '') ? String(v).slice(0, 10) : new Date().toISOString().split('T')[0])

/**
 * Record an equipment sale. Shared by the Accounts page API and the MCP/AI tools so both behave the same:
 * - stops depreciation on the linked purchase expense (disposed_on = sale date)
 * - retires the linked fleet item, with a note saying when and for how much it was sold
 */
export async function recordEquipmentSale(admin: SupabaseClient, body: SaleInput): Promise<{ sale?: any; error?: string; status?: number }> {
  const price = Number(body.sale_price)
  if (!Number.isFinite(price) || price <= 0) return { error: 'Enter a sale price greater than zero.', status: 400 }

  const soldOn = ymd(body.sold_on)
  const method = (SALE_METHODS as readonly string[]).includes(body.method || '') ? body.method! : 'EFT'
  const cost = body.original_cost === null || body.original_cost === undefined || body.original_cost === '' ? null : Number(body.original_cost)
  if (cost !== null && (!Number.isFinite(cost) || cost < 0)) return { error: 'Original cost must be zero or more.', status: 400 }

  let equipment: any = null
  if (body.equipment_id) {
    const { data } = await admin.from('equipment').select('*').eq('id', body.equipment_id).single()
    if (!data) return { error: 'That equipment item was not found.', status: 404 }
    equipment = data
  }
  if (body.asset_expense_id) {
    const { data } = await admin.from('expenses').select('id').eq('id', body.asset_expense_id).single()
    if (!data) return { error: 'That purchase expense was not found.', status: 404 }
  }

  const title = (body.title || '').toString().trim() || (equipment ? `Sold: ${equipment.name}` : '')
  if (!title) return { error: 'Say what was sold, e.g. "Meta Quest 2 headset".', status: 400 }

  const { data: sale, error } = await admin
    .from('equipment_sales')
    .insert([
      {
        title,
        sale_price: price,
        sold_on: soldOn,
        buyer: body.buyer?.toString().trim() || null,
        method,
        equipment_id: body.equipment_id || null,
        asset_expense_id: body.asset_expense_id || null,
        // A purchase record gives the cost already, so only keep a typed cost when there is none
        original_cost: body.asset_expense_id ? null : cost,
        notes: body.notes?.toString().trim() || null,
      },
    ])
    .select()
    .single()

  if (error) {
    if (isMissingSchemaError(error.message)) {
      return { error: 'Equipment sales are not set up yet: run supabase/equipment_sales.sql in Supabase first.', status: 503 }
    }
    return { error: error.message, status: 500 }
  }

  if (body.asset_expense_id) {
    await admin.from('expenses').update({ disposed_on: soldOn, updated_at: new Date().toISOString() }).eq('id', body.asset_expense_id)
  }
  if (equipment) {
    const note = `Sold ${soldOn} for R${price.toLocaleString('en-ZA')}${sale.buyer ? ` to ${sale.buyer}` : ''}.`
    await admin
      .from('equipment')
      .update({ status: 'retired', notes: [equipment.notes, note].filter(Boolean).join(' '), updated_at: new Date().toISOString() })
      .eq('id', equipment.id)
  }

  return { sale }
}

/** Undo a sale entered by mistake: the purchase starts depreciating again. The fleet item is left retired (change it on Equipment if needed). */
export async function deleteEquipmentSale(admin: SupabaseClient, id: string): Promise<{ error?: string; status?: number }> {
  const { data: existing } = await admin.from('equipment_sales').select('*').eq('id', id).single()
  if (!existing) return { error: 'Sale not found.', status: 404 }
  const { error } = await admin.from('equipment_sales').delete().eq('id', id)
  if (error) return { error: error.message, status: 500 }
  if (existing.asset_expense_id) {
    await admin.from('expenses').update({ disposed_on: null, updated_at: new Date().toISOString() }).eq('id', existing.asset_expense_id)
  }
  return {}
}
