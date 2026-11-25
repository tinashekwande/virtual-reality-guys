import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { summarisePayments } from '@/lib/accounts/calc'
import type { Invoice, PaymentItem } from '@/types'

export const dynamic = 'force-dynamic'

/** Date string (YYYY-MM-DD) in South Africa time, offset by `addDays`. */
function saDate(addDays = 0): string {
  const now = new Date(Date.now() + addDays * 86400000)
  // SAST is UTC+2, no DST
  const sast = new Date(now.getTime() + 2 * 3600000)
  return sast.toISOString().split('T')[0]
}

// GET — everything the team needs for today & tomorrow, in one call
export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const admin = createAdminClient()
  const today = saDate(0)
  const tomorrow = saDate(1)
  const dayAfter = saDate(2)
  const dates = [today, tomorrow]

  const [invoicesRes, eventsRes, personalRes, requestsRes, unpaidRes, followUpsRes] = await Promise.all([
    admin.from('invoices').select('id, doc_number, client_name, client_phone, client_address, event_date, event_time, status, total, deposit_percentage, notes').in('event_date', dates).neq('status', 'cancelled'),
    admin.from('events').select('id, title, event_date, event_time, location, status, description').in('event_date', dates).neq('status', 'cancelled'),
    admin.from('personal_calendar_events').select('id, title, date, start_time, end_time, location, is_all_day').in('date', dates),
    admin.from('form_requests').select('id, name, email, phone, suburb, message, form_type, status, created_at').in('status', ['new', 'new_request']).order('created_at', { ascending: false }),
    admin.from('invoices').select('id, type, doc_number, client_name, client_phone, event_date, due_date, status, total, deposit_percentage').eq('type', 'invoice').in('status', ['sent', 'pending', 'deposit_paid']).order('event_date', { ascending: true }),
    admin.from('follow_ups').select('id, client_name, client_email, client_phone, stage, scheduled_for, channel, message_draft, invoice_id, request_id').eq('status', 'pending').lt('scheduled_for', `${dayAfter}T00:00:00Z`).order('scheduled_for', { ascending: true }).limit(50),
  ])

  const invoices = invoicesRes.data || []
  const events = eventsRes.data || []
  const personal = personalRes.data || []

  const bookingsFor = (d: string) => ({
    date: d,
    invoices: invoices.filter((i: any) => i.event_date === d),
    events: events.filter((e: any) => e.event_date === d),
    personal: personal.filter((p: any) => p.date === d),
  })

  // Money still owed, measured against the payments log (same numbers as Accounts)
  const unpaidRows = (unpaidRes.data || []) as Invoice[]
  const { data: unpaidPayments } = unpaidRows.length
    ? await admin.from('payments').select('invoice_id, amount').in('invoice_id', unpaidRows.map((i) => i.id))
    : { data: [] as PaymentItem[] }
  const unpaid = unpaidRows
    .map((i) => ({ ...i, balance: summarisePayments(i, (unpaidPayments || []) as PaymentItem[], today).balance }))
    .filter((i) => i.balance > 0.005)
  const depositsOutstanding = Math.round(unpaid.reduce((acc, i) => acc + i.balance, 0) * 100) / 100

  return NextResponse.json({
    today,
    tomorrow,
    bookings: { today: bookingsFor(today), tomorrow: bookingsFor(tomorrow) },
    new_requests: requestsRes.data || [],
    unpaid_invoices: { items: unpaid, outstanding_zar: depositsOutstanding },
    follow_ups_due: followUpsRes.data || [],
  })
}
