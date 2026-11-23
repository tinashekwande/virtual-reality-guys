import type { EquipmentSale, EventItem, ExpenseItem, Invoice, PaymentItem } from '@/types'

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

  // Quotes, cancelled and draft invoices are not owed (a draft has not been sent to the client yet)
  if (inv.type === 'quote' || inv.status === 'cancelled' || inv.status === 'draft') {
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

export interface InvoiceMoneyTotals {
  /** Money actually received against invoices (from the payments log) */
  received: number
  /** Still owed on sent / pending / deposit-paid invoices */
  outstanding: number
  /** Part of `outstanding` that is past its due date */
  overdue: number
  /** Invoices with money still owed */
  unpaidCount: number
}

/**
 * One source of truth for invoice money. Every screen and AI tool should use this
 * instead of adding up invoice totals by status.
 */
export function invoiceMoneyTotals(invoices: Invoice[], payments: PaymentItem[], today = todayStr()): InvoiceMoneyTotals {
  let received = 0
  let outstanding = 0
  let overdue = 0
  let unpaidCount = 0
  for (const inv of invoices) {
    if (inv.type === 'quote') continue
    const s = summarisePayments(inv, payments, today)
    received += s.received
    outstanding += s.balance
    if (s.overdue) overdue += s.balance
    if (s.balance > 0.005) unpaidCount += 1
  }
  return { received: round2(received), outstanding: round2(outstanding), overdue: round2(overdue), unpaidCount }
}

// ---------------------------------------------------------------- ledger

export interface LedgerRow {
  id: string
  kind: 'invoice' | 'event'
  title: string
  date: string
  category: string
  status: string
  revenue: number
  expenses: number
  netProfit: number
  margin: number
  balance: number
  overdue: boolean
  raw: any
}

/**
 * Per-booking revenue, costs and profit. Invoice revenue is money received (payments log);
 * standalone events use their recorded revenue. Costs are running costs plus depreciation.
 */
export function buildLedger(
  invoices: Invoice[],
  events: EventItem[],
  expenses: ExpenseItem[],
  payments: PaymentItem[],
  today = todayStr()
): LedgerRow[] {
  const rows: LedgerRow[] = []

  for (const inv of invoices) {
    const pay = summarisePayments(inv, payments, today)
    let rev = 0
    if (inv.type === 'quote') rev = 0
    else if (payments.length > 0) rev = pay.received
    else if (inv.status === 'paid') rev = num(inv.total) // payments log not set up yet
    else if (inv.status === 'deposit_paid') rev = round2((num(inv.total) * num(inv.deposit_percentage ?? 50)) / 100)

    const expSum = totalExpenses(expenses.filter((e) => e.invoice_id === inv.id), today).costs
    const net = round2(rev - expSum)
    rows.push({
      id: inv.id,
      kind: 'invoice',
      title: `${inv.type === 'quote' ? 'Quote' : 'Invoice'}: ${inv.client_name}`,
      date: inv.event_date || inv.issue_date || inv.created_at?.split('T')[0] || '',
      category: inv.items?.[0]?.description || 'Client Booking',
      status: inv.status,
      revenue: rev,
      expenses: expSum,
      netProfit: net,
      margin: rev > 0 ? (net / rev) * 100 : 0,
      balance: pay.balance,
      overdue: pay.overdue,
      raw: inv,
    })
  }

  for (const evt of events) {
    const rev = num(evt.total_revenue)
    const linked = expenses.filter((e) => e.event_id === evt.id)
    const expSum = linked.length > 0 ? totalExpenses(linked, today).costs : num(evt.total_expenses)
    const net = round2(rev - expSum)
    rows.push({
      id: evt.id,
      kind: 'event',
      title: evt.title || 'Standalone Event',
      date: evt.event_date || evt.created_at?.split('T')[0] || '',
      category: evt.event_type || 'Corporate Activation',
      status: evt.status || 'scheduled',
      revenue: rev,
      expenses: expSum,
      netProfit: net,
      margin: rev > 0 ? (net / rev) * 100 : 0,
      balance: 0,
      overdue: false,
      raw: evt,
    })
  }

  return rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Costs not tied to any booking (overheads). */
export function generalExpenses(expenses: ExpenseItem[], today = todayStr()): number {
  return totalExpenses(expenses.filter((e) => !e.event_id && !e.invoice_id), today).costs
}

/**
 * Overhead costs (not tied to a booking) that fall inside a period [from, to] (YYYY-MM-DD, inclusive).
 * Running costs count by their date; equipment counts only the depreciation that accrued inside the period.
 * Pass nulls for all time.
 */
export function overheadCostsInPeriod(expenses: ExpenseItem[], from: string | null, to: string | null, today = todayStr()): number {
  const general = expenses.filter((e) => !e.event_id && !e.invoice_id)
  if (!from && !to) return totalExpenses(general, today).costs
  const start = from || '0000-01-01'
  const end = to && to < today ? to : today
  let running = 0
  let dep = 0
  for (const e of general) {
    if (isAsset(e)) {
      if (start > end) continue
      dep += depreciationToDate(e, end) - depreciationToDate(e, start)
    } else {
      const d = (e.date || '').split('T')[0]
      if (d && d >= start && (!to || d <= to)) running += num(e.amount)
    }
  }
  return round2(running + dep)
}

export interface OverallTotals {
  /** Booking revenue (payments received + standalone event takings). Excludes equipment sales. */
  revenue: number
  expenses: number
  netProfit: number
  profitMargin: number
  outstanding: number
  overdue: number
  unpaidCount: number
  /** Everything paid out, equipment at full price */
  cashOut: number
  /** Cash received from selling equipment */
  equipmentSalesCash: number
  /** Sale price minus book value of equipment sold (included in netProfit) */
  equipmentSalesGain: number
}

/** All-time headline numbers, computed exactly the way the Accounts page computes them. */
export function overallTotals(
  invoices: Invoice[],
  events: EventItem[],
  expenses: ExpenseItem[],
  payments: PaymentItem[],
  today = todayStr(),
  sales: EquipmentSale[] = []
): OverallTotals {
  const ledger = buildLedger(invoices, events, expenses, payments, today)
  const revenue = round2(ledger.reduce((a, r) => a + r.revenue, 0))
  const exp = round2(ledger.reduce((a, r) => a + r.expenses, 0) + generalExpenses(expenses, today))
  const saleTotals = equipmentSalesTotals(sales, expenses)
  const netProfit = round2(revenue - exp + saleTotals.gain)
  const money = invoiceMoneyTotals(invoices, payments, today)
  return {
    revenue,
    expenses: exp,
    netProfit,
    profitMargin: revenue > 0 ? Number(((netProfit / revenue) * 100).toFixed(1)) : 0,
    outstanding: money.outstanding,
    overdue: money.overdue,
    unpaidCount: money.unpaidCount,
    cashOut: totalExpenses(expenses, today).cashOut,
    equipmentSalesCash: saleTotals.cash,
    equipmentSalesGain: saleTotals.gain,
  }
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
  const disposed = (e.disposed_on || '').split('T')[0]
  const end = disposed && disposed < today ? disposed : today
  const elapsed = Math.min(life, monthsBetween(e.date, end))
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

// ---------------------------------------------------------------- equipment sales

export interface SaleValuation {
  /** What the item was still worth on the books when it was sold */
  bookValue: number
  /** sale price minus book value: a profit (or a loss when negative) */
  gain: number
  /** Where the book value came from */
  basis: 'purchase record' | 'original cost' | 'already expensed' | 'unknown'
}

/**
 * Book value of a sold item and the profit or loss on the sale.
 * - Linked to an equipment purchase (asset): cost minus depreciation up to the sale date.
 * - Linked to a running-cost purchase: it was already counted as a cost in full, so book value is 0.
 * - Not linked, original cost entered: that cost (it was never counted as a cost).
 * - Nothing known: book value 0, so the whole sale price counts as profit. Flag it in the UI.
 */
export function valueSale(sale: EquipmentSale, expenses: ExpenseItem[]): SaleValuation {
  const price = num(sale.sale_price)
  const purchase = sale.asset_expense_id ? expenses.find((e) => e.id === sale.asset_expense_id) : undefined
  if (purchase) {
    if (!isAsset(purchase)) return { bookValue: 0, gain: round2(price), basis: 'already expensed' }
    const soldOn = (sale.sold_on || '').split('T')[0]
    const book = round2(Math.max(0, num(purchase.amount) - depreciationToDate({ ...purchase, disposed_on: soldOn }, soldOn)))
    return { bookValue: book, gain: round2(price - book), basis: 'purchase record' }
  }
  if (sale.original_cost !== null && sale.original_cost !== undefined && sale.original_cost !== ('' as any)) {
    const cost = num(sale.original_cost)
    return { bookValue: round2(cost), gain: round2(price - cost), basis: 'original cost' }
  }
  return { bookValue: 0, gain: round2(price), basis: 'unknown' }
}

/** Cash received and profit/loss from equipment sales, optionally inside [from, to] (YYYY-MM-DD, inclusive). */
export function equipmentSalesTotals(
  sales: EquipmentSale[],
  expenses: ExpenseItem[],
  from: string | null = null,
  to: string | null = null
): { cash: number; gain: number; count: number } {
  let cash = 0
  let gain = 0
  let count = 0
  for (const s of sales) {
    const d = (s.sold_on || '').split('T')[0]
    if (from && d < from) continue
    if (to && d > to) continue
    cash += num(s.sale_price)
    gain += valueSale(s, expenses).gain
    count += 1
  }
  return { cash: round2(cash), gain: round2(gain), count }
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
  /** Cash received from selling equipment */
  equipmentSales: number
  /** Profit (or loss) on equipment sold; included in net */
  equipmentSaleGain: number
}

const monthKey = (d: string) => d.split('T')[0].slice(0, 7)

function addMonths(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Month-by-month cash received, costs and profit. Cash is measured by when payments were received, not when invoices were issued. */
export function monthlyRollup(payments: PaymentItem[], expenses: ExpenseItem[], today = todayStr(), sales: EquipmentSale[] = []): MonthRow[] {
  const rows = new Map<string, MonthRow>()
  const get = (k: string) => {
    let r = rows.get(k)
    if (!r) {
      r = { month: k, received: 0, runningCosts: 0, depreciation: 0, net: 0, assetPurchases: 0, paymentsCount: 0, equipmentSales: 0, equipmentSaleGain: 0 }
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
      // Sold equipment stops depreciating: no wear is charged from the month it was sold
      // (the sale's profit/loss already settles the rest), so totals agree with the all-time figures
      const soldKey = e.disposed_on ? monthKey(e.disposed_on) : null
      for (let i = 0; i < life; i++) {
        const mk = addMonths(k, i)
        if (mk > nowKey) break
        if (soldKey && mk >= soldKey && soldKey > k) break
        get(mk).depreciation += monthly
      }
    } else {
      get(k).runningCosts += num(e.amount)
    }
  }

  for (const s of sales) {
    if (!s.sold_on) continue
    const r = get(monthKey(s.sold_on))
    r.equipmentSales += num(s.sale_price)
    r.equipmentSaleGain += valueSale(s, expenses).gain
  }

  return [...rows.values()]
    .map((r) => {
      const received = round2(r.received)
      const runningCosts = round2(r.runningCosts)
      const depreciation = round2(r.depreciation)
      const equipmentSaleGain = round2(r.equipmentSaleGain)
      return {
        ...r,
        received,
        runningCosts,
        depreciation,
        assetPurchases: round2(r.assetPurchases),
        equipmentSales: round2(r.equipmentSales),
        equipmentSaleGain,
        net: round2(received - runningCosts - depreciation + equipmentSaleGain),
      }
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
