import type { ExpenseItem, Invoice, PaymentItem } from '@/types'

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
const num = (v: unknown) => Number(v) || 0

export const todayStr = () => new Date().toISOString().split('T')[0]

// ---------------------------------------------------------------- payments

export type PaymentState = 'unpaid' | 'deposit_paid' | 'paid' | 'overpaid' | 'n/a'

export interface PaymentSummary {
  total: number
  received: number
  balance: number
  depositRequired: number
  depositMet: boolean
  state: PaymentState
  /** Past its due date with money still owed */
  overdue: boolean
}

/** How much has been received against an invoice, what is still owed, and whether it is overdue. */
export function summarisePayments(inv: Invoice, payments: PaymentItem[], today = todayStr()): PaymentSummary {
  const total = num(inv.total)
  const received = round2(payments.filter((p) => p.invoice_id === inv.id).reduce((a, p) => a + num(p.amount), 0))
  const depositRequired = round2((total * num(inv.deposit_percentage ?? 50)) / 100)

  if (inv.type === 'quote' || inv.status === 'cancelled') {
    return { total, received, balance: 0, depositRequired, depositMet: false, state: 'n/a', overdue: false }
  }

  const balance = round2(Math.max(0, total - received))
  let state: PaymentState = 'unpaid'
  if (received > total + 0.005) state = 'overpaid'
  else if (balance <= 0.005 && total > 0) state = 'paid'
  else if (received + 0.005 >= depositRequired && received > 0) state = 'deposit_paid'

  const due = inv.due_date ? inv.due_date.split('T')[0] : ''
  const overdue = balance > 0.005 && !!due && due < today

  return { total, received, balance, depositRequired, depositMet: received + 0.005 >= depositRequired && received > 0, state, overdue }
}

/** The invoice status that matches the money actually received. */
export function statusFromPayments(inv: Invoice, summary: PaymentSummary): Invoice['status'] | null {
  if (inv.type === 'quote' || inv.status === 'cancelled' || inv.status === 'draft') return null
  if (summary.state === 'paid' || summary.state === 'overpaid') return 'paid'
  if (summary.state === 'deposit_paid') return 'deposit_paid'
  // Nothing (or less than the deposit) received: keep it as sent/pending rather than moving it backwards
  return inv.status === 'paid' || inv.status === 'deposit_paid' ? 'sent' : null
}

// ---------------------------------------------------------------- assets

/** Months between two YYYY-MM-DD dates (fractional). */
export function monthsBetween(from: string, to: string): number {
  const a = new Date(from.split('T')[0])
  const b = new Date(to.split('T')[0])
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0
  return Math.max(0, (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 30.4375))
}

export const isAsset = (e: ExpenseItem) => e.kind === 'asset'
export const DEFAULT_ASSET_LIFE_MONTHS = 36

/** Portion of an asset's cost that counts as a cost up to `today` (straight line over its useful life). */
export function depreciationToDate(e: ExpenseItem, today = todayStr()): number {
  if (!isAsset(e)) return 0
  const life = num(e.useful_life_months) || DEFAULT_ASSET_LIFE_MONTHS
  const elapsed = Math.min(life, monthsBetween(e.date, today))
  return round2((num(e.amount) * elapsed) / life)
}

export interface ExpenseTotals {
  /** Everything paid out, including equipment bought */
  cashOut: number
  /** Normal running costs (excludes assets) */
  running: number
  /** Equipment bought to keep */
  assetPurchases: number
  /** Share of asset purchases treated as a cost so far */
  depreciation: number
  /** running + depreciation: what profit should be measured against */
  costs: number
}

export function totalExpenses(expenses: ExpenseItem[], today = todayStr()): ExpenseTotals {
  let running = 0
  let assetPurchases = 0
  let depreciation = 0
  for (const e of expenses) {
    if (isAsset(e)) {
      assetPurchases += num(e.amount)
      depreciation += depreciationToDate(e, today)
    } else {
      running += num(e.amount)
    }
  }
  return {
    cashOut: round2(running + assetPurchases),
    running: round2(running),
    assetPurchases: round2(assetPurchases),
    depreciation: round2(depreciation),
    costs: round2(running + depreciation),
  }
}

// ---------------------------------------------------------------- data quality

export interface ExpenseIssue {
  expenseId: string
  issue: string
}

/** Things worth a second look in how an expense was entered. */
export function expenseIssues(e: ExpenseItem): string[] {
  const issues: string[] = []
  const title = (e.title || '').trim()
  if (/^[\d\s.,R]+$/.test(title)) issues.push('Title is just a number')
  if (e.category === 'Staff Wages' && /transport|trasport|fuel|uber|indrive/i.test(title)) issues.push('Looks like transport, filed as wages')
  if (!e.event_id && !e.invoice_id && !e.is_overhead) issues.push('Not linked to a booking or marked as overhead')
  if (!e.receipt_path && num(e.amount) >= 500) issues.push('No receipt on a larger expense')
  return issues
}

// ---------------------------------------------------------------- monthly roll-up

export interface MonthRow {
  month: string // YYYY-MM
  received: number
  runningCosts: number
  depreciation: number
  net: number
  assetPurchases: number
  paymentsCount: number
}

const monthKey = (d: string) => d.split('T')[0].slice(0, 7)

function addMonths(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Month-by-month cash received, costs and profit. Cash is measured by when payments were received, not when invoices were issued. */
export function monthlyRollup(payments: PaymentItem[], expenses: ExpenseItem[], today = todayStr()): MonthRow[] {
  const rows = new Map<string, MonthRow>()
  const get = (k: string) => {
    let r = rows.get(k)
    if (!r) {
      r = { month: k, received: 0, runningCosts: 0, depreciation: 0, net: 0, assetPurchases: 0, paymentsCount: 0 }
      rows.set(k, r)
    }
    return r
  }
  const nowKey = monthKey(today)

  for (const p of payments) {
    if (!p.paid_on) continue
    const r = get(monthKey(p.paid_on))
    r.received += num(p.amount)
    r.paymentsCount += 1
  }

  for (const e of expenses) {
    if (!e.date) continue
    const k = monthKey(e.date)
    if (isAsset(e)) {
      get(k).assetPurchases += num(e.amount)
      const life = num(e.useful_life_months) || DEFAULT_ASSET_LIFE_MONTHS
      const monthly = num(e.amount) / life
      for (let i = 0; i < life; i++) {
        const mk = addMonths(k, i)
        if (mk > nowKey) break
        get(mk).depreciation += monthly
      }
    } else {
      get(k).runningCosts += num(e.amount)
    }
  }

  return [...rows.values()]
    .map((r) => {
      const received = round2(r.received)
      const runningCosts = round2(r.runningCosts)
      const depreciation = round2(r.depreciation)
      return { ...r, received, runningCosts, depreciation, assetPurchases: round2(r.assetPurchases), net: round2(received - runningCosts - depreciation) }
    })
    .sort((a, b) => (a.month < b.month ? 1 : -1))
}

// ---------------------------------------------------------------- staff payouts

export interface PayeeRow {
  payee: string
  paid: number
  owed: number
  count: number
}

/** Staff wages grouped by person. Rows without a payee fall back to the title (older entries named the person there). */
export function payeeTotals(expenses: ExpenseItem[]): PayeeRow[] {
  const map = new Map<string, PayeeRow>()
  for (const e of expenses) {
    if (e.category !== 'Staff Wages') continue
    const name = (e.payee || e.title || 'Unnamed').trim() || 'Unnamed'
    const key = name.toLowerCase()
    const row = map.get(key) || { payee: name, paid: 0, owed: 0, count: 0 }
    if ((e.payment_status || 'paid') === 'owed') row.owed += num(e.amount)
    else row.paid += num(e.amount)
    row.count += 1
    map.set(key, row)
  }
  return [...map.values()]
    .map((r) => ({ ...r, paid: round2(r.paid), owed: round2(r.owed) }))
    .sort((a, b) => b.owed - a.owed || b.paid - a.paid)
}

// ---------------------------------------------------------------- CSV

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const esc = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
}
