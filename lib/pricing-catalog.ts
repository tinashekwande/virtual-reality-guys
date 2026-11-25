import { createAdminClient } from '@/lib/supabase/admin'
import { PRICING_CATEGORIES, type PricingItem } from '@/lib/pricing-catalog-shared'

export { PRICING_CATEGORIES, PRICE_UNITS, type PricingItem } from '@/lib/pricing-catalog-shared'

/** Columns an admin may write. Anything else in a request body is ignored. */
const EDITABLE = [
  'category', 'name', 'price', 'price_unit', 'min_price', 'duration_hours', 'headsets',
  'staff', 'max_players', 'includes', 'notes', 'active', 'sort_order',
] as const

export function sanitizePricingInput(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const key of EDITABLE) {
    if (!(key in body)) continue
    const v = body[key]
    out[key] = v === '' ? null : v
  }
  return out
}

export async function listPricing(): Promise<PricingItem[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('pricing_items')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data || []) as PricingItem[]
}

function money(n: number | null) {
  if (n === null || n === undefined) return null
  return `R${Number(n).toLocaleString('en-ZA', { maximumFractionDigits: 2 })}`
}

/** One readable line per item, used by Claude and the AI assistant. */
export function describePricingItem(i: PricingItem) {
  const price =
    i.price_unit === 'quote' ? 'quoted individually'
    : i.price_unit === 'rule' ? null
    : `${money(i.price)} ${i.price_unit}`
  const facts = [
    price,
    i.min_price ? `minimum ${money(i.min_price)}` : null,
    i.duration_hours ? `${i.duration_hours}h` : null,
    i.headsets ? `${i.headsets} headsets` : null,
    i.staff ? `${i.staff} staff` : null,
    i.max_players ? `up to ${i.max_players} players` : null,
  ].filter(Boolean).join(', ')
  return [
    `${i.name}${facts ? `: ${facts}` : ''}`,
    i.includes ? `includes ${i.includes}` : null,
    i.notes ? `note: ${i.notes}` : null,
  ].filter(Boolean).join(' | ')
}

/**
 * Pricing grouped by event type. Active rows are the baseline for client
 * emails and quotes; inactive rows are drafts and must not be quoted.
 */
export async function getPricingBaseline() {
  const items = await listPricing()
  const group = (rows: PricingItem[]) => {
    const out: Record<string, string[]> = {}
    for (const c of PRICING_CATEGORIES) {
      const lines = rows.filter(r => r.category === c.id).map(describePricingItem)
      if (lines.length) out[c.label] = lines
    }
    return out
  }
  return {
    rule: 'This pricing table is the baseline for every client email and quote. It overrides any prices in the knowledge base text. Never quote draft items; if an event type has no active pricing, say it will be quoted individually and ask the owner.',
    active: group(items.filter(i => i.active)),
    drafts_not_for_clients: group(items.filter(i => !i.active)),
  }
}
