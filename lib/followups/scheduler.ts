import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Automatic follow-up scheduling.
 *
 * Creates rows in the `follow_ups` table at the right moments so nothing slips
 * through the cracks: chasing quotes, deposit reminders, event-prep confirmations
 * and post-event review requests. Rows are created with a sensible default draft;
 * the daily Claude task (or the admin) writes/sends the real message and marks
 * them sent via the existing update_follow_up flow.
 */

export type FollowUpStage =
  | 'quote_followup'
  | 'deposit_reminder'
  | 'event_prep'
  | 'payment_balance'
  | 'review_request'

interface FollowUpSeed {
  stage: FollowUpStage
  scheduled_for: string // ISO
  message_draft: string
  reason: string
}

const SA_OFFSET = '+02:00' // South Africa Standard Time (no DST)

/** Returns an ISO timestamp for `dateStr` (YYYY-MM-DD) at the given local hour, or null if unparseable. */
function atLocalHour(dateStr: string | null | undefined, hour: number): string | null {
  if (!dateStr) return null
  const m = String(dateStr).match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const hh = String(hour).padStart(2, '0')
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T${hh}:00:00${SA_OFFSET}`)
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

function daysFromNow(days: number, hour = 9): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  // 09:00 SAST == 07:00 UTC
  d.setUTCHours(hour - 2, 0, 0, 0)
  return d.toISOString()
}

function shiftDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString()
}

const isFuture = (iso: string) => new Date(iso).getTime() > Date.now()

const money = (n: number | null | undefined) => `R${Number(n || 0).toLocaleString('en-ZA')}`

/** Short default drafts; the real personalised message is written at send time. */
function defaultDraft(stage: FollowUpStage, ctx: { name: string; date?: string | null; doc?: string | null; outstanding?: number | null }): string {
  const name = (ctx.name || '').split(/\s+/)[0] || 'there'
  const date = ctx.date || 'your event'
  switch (stage) {
    case 'quote_followup':
      return `Hi ${name}, just following up on the quote we sent${ctx.doc ? ` (${ctx.doc})` : ''}. Do you have any questions, or would you like us to hold ${date} for you? — Virtual Reality Guys`
    case 'deposit_reminder':
      return `Hi ${name}, to secure ${date} a 50% deposit is needed. Banking: FNB, Panashe Majinga, 63124445502, branch 250655, ref ${ctx.doc || name}. Send proof of payment once done — thanks!`
    case 'event_prep':
      return `Hi ${name}, your VR event on ${date} is almost here! Please confirm the venue address and start time. We arrive 30–45 min early to set up (need ~2x2m clear space per headset + a power outlet).`
    case 'payment_balance':
      return `Hi ${name}, a reminder that the outstanding balance${ctx.outstanding ? ` of ${money(ctx.outstanding)}` : ''} for ${date} is due on/before the day. FNB 63124445502, ref ${ctx.doc || name}. Thank you!`
    case 'review_request':
      return `Hi ${name}, thank you for having Virtual Reality Guys! We'd love a quick Google review if you enjoyed it — it really helps our small Cape Town team. 🙏`
  }
}

/** Insert follow-up rows, skipping any pending row that already exists for the same key+stage. */
async function insertFollowUps(
  seeds: FollowUpSeed[],
  common: { client_name: string; client_email?: string | null; client_phone?: string | null; invoice_id?: string | null; request_id?: string | null; channel?: 'email' | 'whatsapp' | 'sms' }
): Promise<number> {
  if (!seeds.length) return 0
  const admin = createAdminClient()

  // Find already-pending stages for this invoice/request to avoid duplicates
  let existingQ = admin.from('follow_ups').select('stage').eq('status', 'pending')
  if (common.invoice_id) existingQ = existingQ.eq('invoice_id', common.invoice_id)
  else if (common.request_id) existingQ = existingQ.eq('request_id', common.request_id)
  const { data: existing } = await existingQ
  const have = new Set((existing || []).map((r: any) => r.stage))

  const rows = seeds
    .filter((s) => !have.has(s.stage))
    .map((s) => ({
      client_name: common.client_name,
      client_email: common.client_email || null,
      client_phone: common.client_phone || null,
      invoice_id: common.invoice_id || null,
      request_id: common.request_id || null,
      stage: s.stage,
      scheduled_for: s.scheduled_for,
      status: 'pending',
      channel: common.channel || 'email',
      message_draft: s.message_draft,
      generated_reason: s.reason,
    }))

  if (!rows.length) return 0
  const { error } = await admin.from('follow_ups').insert(rows)
  if (error) {
    console.error('[followups] insert failed:', error.message)
    return 0
  }
  return rows.length
}

/**
 * Schedule follow-ups appropriate to a quote/invoice based on its type, status
 * and event date. Safe to call repeatedly (idempotent on pending stages).
 */
export async function scheduleFollowUpsForInvoice(invoice: any): Promise<number> {
  if (!invoice) return 0
  const status = invoice.status as string
  const type = invoice.type as string
  const eventIso9 = atLocalHour(invoice.event_date, 9)
  const paidish = status === 'paid'
  const depositPaid = status === 'deposit_paid' || paidish
  const outstanding = depositPaid
    ? Number(invoice.total || 0) * (1 - (Number(invoice.deposit_percentage || 50) / 100))
    : Number(invoice.total || 0)

  const ctx = { name: invoice.client_name, date: invoice.event_date, doc: invoice.doc_number, outstanding }
  const seeds: FollowUpSeed[] = []

  // Chase an unaccepted quote
  if (type === 'quote' && !['cancelled', 'paid', 'deposit_paid'].includes(status)) {
    seeds.push({ stage: 'quote_followup', scheduled_for: daysFromNow(3), message_draft: defaultDraft('quote_followup', ctx), reason: 'Quote sent — chase after 3 days if no response' })
  }

  // Deposit reminder until the deposit is in
  if (!depositPaid && status !== 'cancelled') {
    seeds.push({ stage: 'deposit_reminder', scheduled_for: daysFromNow(1), message_draft: defaultDraft('deposit_reminder', ctx), reason: 'Deposit not yet received' })
  }

  // Event-date based reminders (only if the date is in the future)
  if (eventIso9 && status !== 'cancelled') {
    const prep = shiftDays(eventIso9, -2)
    if (isFuture(prep)) seeds.push({ stage: 'event_prep', scheduled_for: prep, message_draft: defaultDraft('event_prep', ctx), reason: 'Confirm venue & details 2 days before event' })

    if (!paidish) {
      const balance = shiftDays(eventIso9, -1)
      if (isFuture(balance)) seeds.push({ stage: 'payment_balance', scheduled_for: balance, message_draft: defaultDraft('payment_balance', ctx), reason: 'Balance due on/before event day' })
    }

    const review = shiftDays(atLocalHour(invoice.event_date, 10)!, 1)
    if (isFuture(review)) seeds.push({ stage: 'review_request', scheduled_for: review, message_draft: defaultDraft('review_request', ctx), reason: 'Ask for a Google review the day after' })
  }

  return insertFollowUps(seeds, {
    client_name: invoice.client_name,
    client_email: invoice.client_email,
    client_phone: invoice.client_phone,
    invoice_id: invoice.id,
    channel: invoice.client_email ? 'email' : invoice.client_phone ? 'whatsapp' : 'email',
  })
}

/**
 * When an invoice's status advances, cancel follow-ups that no longer apply and
 * add any newly-relevant ones.
 */
export async function reconcileFollowUpsForInvoice(invoice: any): Promise<void> {
  if (!invoice?.id) return
  const admin = createAdminClient()
  const status = invoice.status as string

  const cancelStages = async (stages: FollowUpStage[]) => {
    if (!stages.length) return
    await admin
      .from('follow_ups')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('invoice_id', invoice.id)
      .eq('status', 'pending')
      .in('stage', stages)
  }

  if (status === 'cancelled') {
    await cancelStages(['quote_followup', 'deposit_reminder', 'event_prep', 'payment_balance', 'review_request'])
    return
  }
  if (status === 'deposit_paid') await cancelStages(['quote_followup', 'deposit_reminder'])
  if (status === 'paid') await cancelStages(['quote_followup', 'deposit_reminder', 'payment_balance'])

  // Add any now-relevant follow-ups (e.g. event reminders once a date is set)
  await scheduleFollowUpsForInvoice(invoice)
}

/**
 * When a website request comes in, schedule a single "chase if still unquoted"
 * follow-up so enquiries can't be forgotten.
 */
export async function scheduleRequestFollowUp(request: { id: string; name: string; email?: string | null; phone?: string | null }): Promise<number> {
  return insertFollowUps(
    [{
      stage: 'quote_followup',
      scheduled_for: daysFromNow(2),
      message_draft: `Hi ${(request.name || '').split(/\s+/)[0] || 'there'}, following up on your enquiry with Virtual Reality Guys — we'd love to help with your event. Do you have a date and rough guest count in mind? — The VR Guys team`,
      reason: 'Website enquiry — follow up if not yet quoted',
    }],
    {
      client_name: request.name,
      client_email: request.email,
      client_phone: request.phone,
      request_id: request.id,
      channel: request.email ? 'email' : 'whatsapp',
    }
  )
}
