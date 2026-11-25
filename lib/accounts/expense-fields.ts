import { DEFAULT_ASSET_LIFE_MONTHS } from '@/lib/accounts/calc'

const EXTRA_KEYS = ['kind', 'useful_life_months', 'receipt_path', 'is_overhead', 'payee', 'payment_status', 'paid_on']

/** Remove the accounts-v2 fields (used when the database has not been upgraded yet). */
export function withoutExtras<T extends Record<string, any>>(payload: T): T {
  const copy: Record<string, any> = { ...payload }
  EXTRA_KEYS.forEach((k) => delete copy[k])
  return copy as T
}

/**
 * Validate and normalise the new expense fields from a request body.
 * `partial` = update request: only include fields that were sent.
 */
export function buildExpenseExtras(body: Record<string, any>, partial = false): { fields: Record<string, any>; error?: string } {
  const f: Record<string, any> = {}
  const has = (k: string) => body[k] !== undefined

  if (!partial || has('kind')) {
    const kind = body.kind === 'asset' ? 'asset' : 'running'
    f.kind = kind
    if (kind === 'asset') {
      const life = Number(body.useful_life_months) || DEFAULT_ASSET_LIFE_MONTHS
      if (life < 1 || life > 240) return { fields: f, error: 'Useful life must be between 1 and 240 months.' }
      f.useful_life_months = Math.round(life)
    } else {
      f.useful_life_months = null
    }
  }
  if (!partial || has('receipt_path')) f.receipt_path = body.receipt_path || null
  if (!partial || has('is_overhead')) f.is_overhead = !!body.is_overhead
  if (!partial || has('payee')) f.payee = body.payee ? String(body.payee).trim() || null : null
  if (!partial || has('payment_status')) f.payment_status = body.payment_status === 'owed' ? 'owed' : 'paid'
  if (!partial || has('paid_on')) f.paid_on = body.paid_on || null
  if (f.payment_status === 'owed') f.paid_on = null
  return { fields: f }
}
