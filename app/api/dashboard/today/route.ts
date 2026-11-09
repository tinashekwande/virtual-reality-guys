import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

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
    admin.from('invoices').select('id, doc_number, client_name, client_phone, event_date, status, total, deposit_percentage').in('status', ['sent', 'pending', 'draft', 'deposit_paid']).order('event_date', { ascending: true }).limit(40),
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

  // Deposits due: unpaid invoices with a status that still owes money
  const unpaid = (unpaidRes.data || []).filter((i: any) => i.status !== 'paid')
  const depositsOutstanding = unpaid.reduce((acc: number, i: any) => {
    if (i.status === 'deposit_paid') {
      const pct = (Number(i.deposit_percentage) || 50) / 100
      return acc + Number(i.total || 0) * (1 - pct)
    }
    return acc + Number(i.total || 0)
  }, 0)

  return NextResponse.json({
    today,
    tomorrow,
    bookings: { today: bookingsFor(today), tomorrow: bookingsFor(tomorrow) },
    new_requests: requestsRes.data || [],
    unpaid_invoices: { items: unpaid, outstanding_zar: depositsOutstanding },
    follow_ups_due: followUpsRes.data || [],
  })
}
