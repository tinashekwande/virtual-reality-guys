import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { COMPANY_KNOWLEDGE_BASE } from '@/components/chatbot/knowledge-base'
import { getAiBusinessContext } from '@/lib/ai/context'
import { detectAllConflicts } from '@/lib/ai/conflict-detector'
import {
  getBookingsTool,
  getCustomerHistoryTool,
  getEquipmentStatusTool,
  getRevenueSummaryTool,
  getTeamMembersTool,
  getUnpaidInvoicesTool,
} from '@/lib/ai/tools'
import * as marketing from '@/lib/marketing/service'
import { getConfiguredEmailProvider } from '@/lib/email/sender'
import { scheduleFollowUpsForInvoice, reconcileFollowUpsForInvoice } from '@/lib/followups/scheduler'
import { renderInvoicePdf, invoicePdfFilename } from '@/lib/pdf/invoice-pdf'

/**
 * Virtual Reality Guys — Admin Portal MCP server.
 *
 * Lets Claude (claude.ai, Claude Desktop, Claude Code…) operate the admin
 * portal: review requests, manage bookings, quotes/invoices, accounts,
 * equipment, follow-ups and run the Marketing section. Every write is recorded
 * in the AI Audit Log with the actor "Claude (MCP)".
 */

export const MCP_ACTOR = 'Claude (MCP)'

const INSTRUCTIONS = `You are connected to the Virtual Reality Guys (VR Guyz) admin portal — a mobile VR entertainment business in Cape Town, South Africa. Currency is ZAR (R). All prices include 15% VAT.

Before writing to any client, call get_business_knowledge for packages, pricing, payment terms, coverage areas and tone.

REPLYING TO A NEW REQUEST
1. list_requests (status "new") → get_request for full details, past history, previous emails and the availability check for the requested date.
2. Draft a warm, professional reply: thank them by first name, recommend the best-fit package for their group size/event, confirm date availability (never promise a date that has a clash), mention the 50% deposit to secure the date, and invite them to confirm. Sign off as "The Virtual Reality Guys team" with phone/WhatsApp +27 71 780 0323.
3. Send it with the connected Gmail tools (send_message to the client's address; use reply instead if the client already emailed you and a thread exists). Put formatted HTML in htmlBody and a plain-text version in body.
4. Immediately call log_client_email with the returned Gmail message id so it appears in the portal, and set the request status (usually "in_progress" or "pending_confirmation").
Optionally create a quote with create_quote_or_invoice, then call get_invoice_pdf to get a shareable PDF link and include it in the email.

QUOTES & INVOICES: create_quote_or_invoice makes a draft (totals and the document number are computed for you); update_invoice edits it or advances its status (e.g. deposit_paid, paid); get_invoice_pdf renders a branded PDF and returns a download link valid ~14 days. Ask the owner before changing amounts on an invoice that was already sent.

EMAIL MARKETING
1. sync_contacts_from_clients / add_marketing_contacts to build the audience. Only email contacts with status "subscribed".
2. create_email_campaign (HTML body; use {{first_name}} for personalisation; an unsubscribe link is added automatically, or place {{unsubscribe_url}} yourself).
3. prepare_campaign_recipients to build the recipient list.
4. Send — either:
   a) via Gmail: get_campaign_send_batch → send each email individually with Gmail send_message (to = [to], subject, htmlBody = html, body = text), never putting several recipients on one email → record_campaign_sends with each recipient_id, status and the returned Gmail message id. Repeat until remaining is 0. Personal Gmail accounts are limited to roughly 500 recipients per day, so keep batches modest; or
   b) via the portal's own email provider: send_campaign_batch_via_portal (if get_business_overview shows a provider configured).
5. Later, update_email_campaign with replies_count, bookings_count and revenue_attributed. Record campaign costs with create_expense (category "Marketing / Ads").
Never email someone who unsubscribed. If someone asks to stop receiving emails, call unsubscribe_contact.

ADS: Track every paid/social campaign with create_ad_campaign and keep spend, impressions, clicks, leads and bookings up to date with update_ad_campaign.

Ask the user before cancelling bookings, changing amounts on invoices that were already sent, or sending marketing to more than 50 people in one go.`

type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean }

function ok(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
}

function fail(err: unknown): ToolResult {
  const message = err instanceof Error ? err.message : String(err)
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true }
}

/** Wraps a handler so any thrown error becomes a readable tool error. */
function run<A>(fn: (args: A) => Promise<unknown>) {
  return async (args: A): Promise<ToolResult> => {
    try {
      return ok(await fn(args))
    } catch (err) {
      return fail(err)
    }
  }
}

function unwrap<T>(res: { data: T | null; error: any }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`)
  return res.data as T
}

const today = () => new Date().toISOString().split('T')[0]
const addDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString().split('T')[0]
const clean = (s: string) => s.replace(/[%,()]/g, ' ').trim()

const READ = { readOnlyHint: true, openWorldHint: false } as const
const WRITE = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const

const REQUEST_STATUSES = [
  'new', 'new_request', 'in_progress', 'pending_confirmation', 'pending', 'deposit_paid', 'scheduled',
  'archived', 'confirmed', 'booking_confirmed', 'completed', 'event_completed', 'cancelled',
] as const
const INVOICE_STATUSES = ['draft', 'pending', 'deposit_paid', 'sent', 'paid', 'cancelled'] as const
const EXPENSE_CATEGORIES = [
  'Staff Wages', 'Transport / Fuel', 'Venue Fee', 'Equipment / Maintenance', 'Marketing / Ads', 'Food & Refreshments', 'Other',
] as const
const AD_PLATFORMS = [
  'meta', 'instagram', 'facebook', 'google', 'tiktok', 'youtube', 'linkedin', 'whatsapp', 'print', 'radio', 'influencer', 'other',
] as const

const lineItem = z.object({
  description: z.string(),
  quantity: z.number().positive().default(1),
  unit_price: z.number().nonnegative().describe('Price per unit in ZAR, VAT inclusive'),
})

function computeTotals(items: { description: string; quantity: number; unit_price: number }[], discount = 0, transport = 0) {
  const lines = items.map((it, i) => ({
    id: `item-${Date.now()}-${i}`,
    description: it.description,
    quantity: it.quantity,
    unit_price: it.unit_price,
    total: Number((it.quantity * it.unit_price).toFixed(2)),
  }))
  const subtotal = lines.reduce((a, l) => a + l.total, 0)
  const total = Math.max(subtotal - discount + transport, 0)
  return { items: lines, subtotal: Number(subtotal.toFixed(2)), total: Number(total.toFixed(2)) }
}

async function nextDocNumber(type: 'quote' | 'invoice') {
  const prefix = `VR-${type === 'invoice' ? 'INV' : 'Q'}-${new Date().getFullYear()}-`
  const { data } = await createAdminClient().from('invoices').select('doc_number').like('doc_number', `${prefix}%`)
  const max = (data || []).reduce((m: number, r: any) => {
    const n = parseInt(String(r.doc_number).slice(prefix.length), 10)
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}

export function createPortalMcpServer() {
  const server = new McpServer(
    { name: 'vr-guys-admin-portal', version: '1.0.0', title: 'Virtual Reality Guys Admin Portal' },
    { instructions: INSTRUCTIONS }
  )
  const actor = MCP_ACTOR

  // =========================================================================
  // Overview & knowledge
  // =========================================================================
  server.registerTool(
    'get_business_overview',
    {
      title: 'Business overview',
      description: 'Snapshot of the business right now: new requests, upcoming bookings (next 14 days), unpaid invoices, follow-ups due, and marketing totals. A good first call.',
      inputSchema: {},
      annotations: READ,
    },
    run(async () => {
      const admin = createAdminClient()
      const [newReq, upcoming, unpaid, followUps, report] = await Promise.all([
        admin.from('form_requests').select('id, name, email, form_type, created_at, status').in('status', ['new', 'new_request']).order('created_at', { ascending: false }).limit(25),
        getBookingsTool({ date_from: today(), date_to: addDays(14), limit: 50 }),
        getUnpaidInvoicesTool({}),
        admin.from('follow_ups').select('id, client_name, stage, scheduled_for, channel').eq('status', 'pending').lte('scheduled_for', new Date(Date.now() + 86400000).toISOString()).order('scheduled_for').limit(25),
        marketing.getMarketingReport().catch(() => null),
      ])
      return {
        today: today(),
        new_requests: { count: newReq.data?.length || 0, items: newReq.data || [] },
        upcoming_bookings_next_14_days: {
          invoices: upcoming.invoices.filter((i) => i.status !== 'cancelled').map((i) => ({ id: i.id, doc_number: i.doc_number, client: i.client_name, date: i.event_date, status: i.status, total: i.total })),
          events: upcoming.events.map((e) => ({ id: e.id, title: e.title, date: e.event_date, status: e.status, location: e.location })),
        },
        unpaid_invoices: { count: unpaid.count, total_outstanding_zar: unpaid.total_outstanding_zar },
        follow_ups_due: followUps.data || [],
        marketing: report,
        portal_email_provider: getConfiguredEmailProvider() || 'none (send via Gmail)',
      }
    })
  )

  server.registerTool(
    'get_business_knowledge',
    {
      title: 'Business knowledge & pricing',
      description: 'Company facts for writing to clients: packages and prices, deposit and banking details, areas covered, venue requirements, safety, games, plus the portal\'s business settings.',
      inputSchema: {},
      annotations: READ,
    },
    run(async () => {
      const settings = await getAiBusinessContext().catch(() => null)
      return {
        knowledge_base: COMPANY_KNOWLEDGE_BASE.trim(),
        portal_settings: settings?.business_context ?? null,
        email_signature: 'The Virtual Reality Guys team\n+27 71 780 0323 (call / WhatsApp)\nvirtualrealityguyz@gmail.com\nhttps://virtualrealityguyz.co.za',
      }
    })
  )

  server.registerTool(
    'list_team',
    { title: 'List team members', description: 'Staff / team members shown on the website.', inputSchema: {}, annotations: READ },
    run(async () => getTeamMembersTool())
  )

  // =========================================================================
  // Requests (website leads)
  // =========================================================================
  server.registerTool(
    'list_requests',
    {
      title: 'List requests',
      description: 'Website / chatbot enquiries and booking requests, newest first.',
      inputSchema: {
        status: z.string().optional().describe(`Filter by status, e.g. "new". One of: ${REQUEST_STATUSES.join(', ')}, or "all"`),
        form_type: z.string().optional().describe('e.g. birthday, corporate, school, rental, contact, chatbot_booking, game_booking'),
        search: z.string().optional().describe('Match on name, email or phone'),
        limit: z.number().int().min(1).max(200).default(30),
      },
      annotations: READ,
    },
    run(async ({ status, form_type, search, limit }) => {
      let q = createAdminClient().from('form_requests').select('*').order('created_at', { ascending: false }).limit(limit)
      if (status && status !== 'all') q = q.eq('status', status)
      if (form_type) q = q.eq('form_type', form_type)
      if (search) {
        const s = `%${clean(search)}%`
        q = q.or(`name.ilike.${s},email.ilike.${s},phone.ilike.${s}`)
      }
      const data = unwrap(await q, 'List requests') as any[]
      return { count: data.length, requests: data }
    })
  )

  server.registerTool(
    'get_request',
    {
      title: 'Get request details',
      description: 'Full details for one request, plus the client\'s history (past requests & invoices), every email already exchanged, pending follow-ups, and — when a date is given or found — booking clashes/availability for that date.',
      inputSchema: {
        id: z.string().uuid(),
        event_date: z.string().optional().describe('YYYY-MM-DD to check availability for, if not stored on the request'),
      },
      annotations: READ,
    },
    run(async ({ id, event_date }) => {
      const admin = createAdminClient()
      const request = unwrap(await admin.from('form_requests').select('*').eq('id', id).single(), 'Get request') as any
      const date = event_date || request.event_date || (request.message?.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] ?? null)
      const [history, comms, followUps, conflicts, sameDay] = await Promise.all([
        request.email ? getCustomerHistoryTool({ query: request.email }) : null,
        marketing.listCommunications({ request_id: id }),
        admin.from('follow_ups').select('*').eq('request_id', id),
        date ? detectAllConflicts(date).catch(() => []) : Promise.resolve([]),
        date ? getBookingsTool({ date_from: date, date_to: date }) : Promise.resolve(null),
      ])
      return {
        request,
        availability: date
          ? {
              date,
              bookings_that_day: sameDay
                ? [
                    ...sameDay.invoices.filter((i) => i.status !== 'cancelled').map((i) => ({ type: 'invoice', client: i.client_name, status: i.status, notes: i.notes })),
                    ...sameDay.events.map((e) => ({ type: 'event', title: e.title, status: e.status, location: e.location })),
                  ]
                : [],
              conflicts,
            }
          : 'No event date found on the request — ask the client or pass event_date.',
        client_history: history
          ? {
              total_bookings: history.total_bookings,
              total_spent_zar: history.total_spent_zar,
              is_repeat_customer: history.is_repeat_customer,
              past_invoices: history.invoices.map((i) => ({ id: i.id, doc_number: i.doc_number, type: i.type, status: i.status, total: i.total, event_date: i.event_date })),
              other_requests: history.requests.filter((r) => r.id !== id).map((r) => ({ id: r.id, form_type: r.form_type, status: r.status, created_at: r.created_at })),
            }
          : null,
        communications: comms,
        follow_ups: followUps.data || [],
      }
    })
  )

  server.registerTool(
    'update_request',
    {
      title: 'Update request',
      description: 'Change a request\'s status or correct its contact details.',
      inputSchema: {
        id: z.string().uuid(),
        status: z.enum(REQUEST_STATUSES).optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
        suburb: z.string().optional(),
      },
      annotations: WRITE,
    },
    run(async ({ id, ...patch }) => {
      const upd = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined))
      if (!Object.keys(upd).length) throw new Error('Nothing to update')
      const data = unwrap(await createAdminClient().from('form_requests').update(upd).eq('id', id).select().single(), 'Update request') as any
      await marketing.logAudit(actor, 'update_request', 'customer', `Request ${data.name}`, upd)
      return data
    })
  )

  server.registerTool(
    'log_client_email',
    {
      title: 'Log a client email',
      description: 'Record an email sent to (or received from) a client so it shows in the portal. Call this right after sending through Gmail. Can also update the linked request\'s status in the same step.',
      inputSchema: {
        client_email: z.string().email(),
        client_name: z.string().optional(),
        subject: z.string(),
        body: z.string().describe('The full email text that was sent'),
        request_id: z.string().uuid().optional(),
        invoice_id: z.string().uuid().optional(),
        gmail_message_id: z.string().optional(),
        direction: z.enum(['outbound', 'inbound']).default('outbound'),
        status: z.enum(['sent', 'draft', 'failed', 'received']).default('sent'),
        set_request_status: z.enum(REQUEST_STATUSES).optional().describe('Also move the linked request to this status'),
      },
      annotations: WRITE,
    },
    run(async (a) => {
      const comm = await marketing.logCommunication(
        {
          request_id: a.request_id,
          invoice_id: a.invoice_id,
          client_email: a.client_email,
          client_name: a.client_name,
          subject: a.subject,
          body: a.body,
          external_id: a.gmail_message_id,
          direction: a.direction,
          status: a.status,
          channel: 'email',
        },
        actor
      )
      let request = null
      if (a.request_id && a.set_request_status) {
        request = unwrap(
          await createAdminClient().from('form_requests').update({ status: a.set_request_status }).eq('id', a.request_id).select('id, name, status').single(),
          'Update request status'
        )
      }
      return { logged: comm, request }
    })
  )

  server.registerTool(
    'list_client_communications',
    {
      title: 'List client emails',
      description: 'Email/WhatsApp log for a request or a client email address (or everything recent).',
      inputSchema: {
        request_id: z.string().uuid().optional(),
        email: z.string().optional(),
        limit: z.number().int().min(1).max(500).default(50),
      },
      annotations: READ,
    },
    run(async (a) => marketing.listCommunications(a))
  )

  server.registerTool(
    'get_customer_history',
    {
      title: 'Customer history',
      description: 'Everything about a client by name, email or phone: invoices, requests, total spent, repeat customer.',
      inputSchema: { query: z.string().min(2) },
      annotations: READ,
    },
    run(async ({ query }) => getCustomerHistoryTool({ query: clean(query) }))
  )

  // =========================================================================
  // Bookings & calendar
  // =========================================================================
  server.registerTool(
    'list_bookings',
    {
      title: 'List bookings',
      description: 'Bookings in a date range: quotes/invoices with an event date, standalone events, and personal calendar entries.',
      inputSchema: {
        date_from: z.string().optional().describe('YYYY-MM-DD (default today)'),
        date_to: z.string().optional().describe('YYYY-MM-DD (default +30 days)'),
        status: z.string().optional(),
      },
      annotations: READ,
    },
    run(async ({ date_from, date_to, status }) => {
      const from = date_from || today()
      const to = date_to || addDays(30)
      const [bookings, personal] = await Promise.all([
        getBookingsTool({ date_from: from, date_to: to, status, limit: 100 }),
        createAdminClient().from('personal_calendar_events').select('id, title, date, start_time, end_time, location, is_all_day').gte('date', from).lte('date', to).order('date'),
      ])
      return { ...bookings, personal_calendar: personal.data || [] }
    })
  )

  server.registerTool(
    'check_availability',
    {
      title: 'Check date availability',
      description: 'Checks a date for booking clashes, headset capacity and travel-time conflicts before you offer it to a client.',
      inputSchema: { date: z.string().describe('YYYY-MM-DD') },
      annotations: READ,
    },
    run(async ({ date }) => {
      const [conflicts, bookings, equipment] = await Promise.all([
        detectAllConflicts(date).catch(() => []),
        getBookingsTool({ date_from: date, date_to: date }),
        getEquipmentStatusTool(),
      ])
      const active = [
        ...bookings.invoices.filter((i) => i.status !== 'cancelled'),
        ...bookings.events.filter((e) => e.status !== 'cancelled'),
      ]
      return {
        date,
        bookings_that_day: active.length,
        details: bookings,
        conflicts,
        headsets_available_in_fleet: equipment.available_headsets,
        verdict: conflicts.length ? 'Has conflicts — check details before confirming.' : active.length ? 'Other bookings exist that day — check times.' : 'Free.',
      }
    })
  )

  server.registerTool(
    'create_event',
    {
      title: 'Create event',
      description: 'Add a standalone event to the Booking Planner (e.g. an activation not tied to an invoice).',
      inputSchema: {
        title: z.string(),
        event_date: z.string().describe('YYYY-MM-DD'),
        start_time: z.string().optional().describe('HH:MM'),
        end_time: z.string().optional().describe('HH:MM'),
        event_type: z.string().default('Corporate Activation'),
        location: z.string().optional(),
        description: z.string().optional(),
        total_revenue: z.number().optional(),
        status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
      },
      annotations: WRITE,
    },
    run(async (a) => {
      const time = a.start_time ? (a.end_time ? `${a.start_time} - ${a.end_time}` : a.start_time) : ''
      const row: Record<string, any> = {
        title: a.title,
        event_date: a.event_date,
        event_type: a.event_type,
        location: a.location || '',
        description: `${a.description || ''}${time ? ` [TIME:${time}]` : ''}`.trim(),
        total_revenue: a.total_revenue || 0,
        status: a.status,
        event_time: time,
        start_time: a.start_time || '',
        end_time: a.end_time || '',
      }
      const admin = createAdminClient()
      let res = await admin.from('events').insert(row).select().single()
      if (res.error && /event_time|start_time|end_time/.test(res.error.message)) {
        delete row.event_time; delete row.start_time; delete row.end_time
        res = await admin.from('events').insert(row).select().single()
      }
      const data = unwrap(res, 'Create event') as any
      await marketing.logAudit(actor, 'create_event', 'booking', data.title, { id: data.id, date: data.event_date })
      return data
    })
  )

  server.registerTool(
    'update_event',
    {
      title: 'Update event',
      description: 'Update a standalone event (status, date, location, revenue/expense totals, description).',
      inputSchema: {
        id: z.string().uuid(),
        title: z.string().optional(),
        event_date: z.string().optional(),
        location: z.string().optional(),
        description: z.string().optional(),
        total_revenue: z.number().optional(),
        total_expenses: z.number().optional(),
        status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
      },
      annotations: WRITE,
    },
    run(async ({ id, ...patch }) => {
      const upd = { ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), updated_at: new Date().toISOString() }
      const data = unwrap(await createAdminClient().from('events').update(upd).eq('id', id).select().single(), 'Update event') as any
      await marketing.logAudit(actor, 'update_event', 'booking', data.title, upd)
      return data
    })
  )

  // =========================================================================
  // Quotes & invoices
  // =========================================================================
  server.registerTool(
    'list_invoices',
    {
      title: 'List quotes & invoices',
      inputSchema: {
        type: z.enum(['quote', 'invoice', 'all']).default('all'),
        status: z.enum([...INVOICE_STATUSES, 'all']).default('all'),
        search: z.string().optional().describe('Client name, email, phone or doc number'),
        limit: z.number().int().min(1).max(200).default(30),
      },
      description: 'Quotes and invoices, newest first.',
      annotations: READ,
    },
    run(async ({ type, status, search, limit }) => {
      let q = createAdminClient().from('invoices').select('*').order('created_at', { ascending: false }).limit(limit)
      if (type !== 'all') q = q.eq('type', type)
      if (status !== 'all') q = q.eq('status', status)
      if (search) {
        const s = `%${clean(search)}%`
        q = q.or(`client_name.ilike.${s},client_email.ilike.${s},client_phone.ilike.${s},doc_number.ilike.${s}`)
      }
      const data = unwrap(await q, 'List invoices') as any[]
      return { count: data.length, invoices: data }
    })
  )

  server.registerTool(
    'get_invoice',
    { title: 'Get quote / invoice', description: 'One quote or invoice with line items.', inputSchema: { id: z.string().uuid() }, annotations: READ },
    run(async ({ id }) => unwrap(await createAdminClient().from('invoices').select('*').eq('id', id).single(), 'Get invoice'))
  )

  server.registerTool(
    'get_unpaid_invoices',
    { title: 'Unpaid invoices', description: 'Outstanding quotes/invoices and the total owed.', inputSchema: { overdue_only: z.boolean().default(false) }, annotations: READ },
    run(async (a) => getUnpaidInvoicesTool(a))
  )

  server.registerTool(
    'create_quote_or_invoice',
    {
      title: 'Create quote or invoice',
      description: 'Creates a quote (default) or invoice in the portal. Totals are calculated for you; a document number like VR-Q-2026-014 is assigned automatically. The admin can then open, download or send the PDF from Quotes & Invoices.',
      inputSchema: {
        type: z.enum(['quote', 'invoice']).default('quote'),
        client_name: z.string(),
        client_email: z.string().optional(),
        client_phone: z.string().optional(),
        client_address: z.string().optional().describe('Event venue / address'),
        event_date: z.string().optional().describe('YYYY-MM-DD'),
        event_time: z.string().optional().describe('e.g. 14:00 - 17:00'),
        items: z.array(lineItem).min(1),
        discount: z.number().nonnegative().default(0),
        transport_fee: z.number().nonnegative().default(0),
        deposit_percentage: z.number().min(0).max(100).default(50),
        due_date: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(INVOICE_STATUSES).default('draft'),
      },
      annotations: WRITE,
    },
    run(async (a) => {
      const totals = computeTotals(a.items, a.discount, a.transport_fee)
      const admin = createAdminClient()
      const row: Record<string, any> = {
        type: a.type,
        doc_number: await nextDocNumber(a.type),
        client_name: a.client_name,
        client_email: a.client_email || '',
        client_phone: a.client_phone || '',
        client_address: a.client_address || '',
        event_date: a.event_date || '',
        event_time: a.event_time || '',
        issue_date: today(),
        due_date: a.due_date || a.event_date || '',
        status: a.status,
        items: totals.items,
        subtotal: totals.subtotal,
        discount: a.discount,
        transport_fee: a.transport_fee,
        total: totals.total,
        deposit_percentage: a.deposit_percentage,
        notes: `${a.notes || ''}${a.event_time ? ` [TIME:${a.event_time}]` : ''}`.trim(),
      }
      let res = await admin.from('invoices').insert(row).select().single()
      if (res.error && res.error.message.includes('event_time')) {
        delete row.event_time
        res = await admin.from('invoices').insert(row).select().single()
      }
      const data = unwrap(res, 'Create invoice') as any
      await marketing.logAudit(actor, `create_${a.type}`, 'sales', `${data.doc_number} — ${data.client_name}`, { id: data.id, total: data.total })
      scheduleFollowUpsForInvoice(data).catch(() => {})
      return data
    })
  )

  server.registerTool(
    'update_invoice',
    {
      title: 'Update quote / invoice',
      description: 'Update status (e.g. deposit_paid, paid), client details, dates, notes, or replace line items (totals are recalculated).',
      inputSchema: {
        id: z.string().uuid(),
        status: z.enum(INVOICE_STATUSES).optional(),
        type: z.enum(['quote', 'invoice']).optional().describe('Convert a quote into an invoice'),
        client_name: z.string().optional(),
        client_email: z.string().optional(),
        client_phone: z.string().optional(),
        client_address: z.string().optional(),
        event_date: z.string().optional(),
        due_date: z.string().optional(),
        notes: z.string().optional(),
        items: z.array(lineItem).optional(),
        discount: z.number().nonnegative().optional(),
        transport_fee: z.number().nonnegative().optional(),
        deposit_percentage: z.number().min(0).max(100).optional(),
      },
      annotations: WRITE,
    },
    run(async ({ id, items, ...rest }) => {
      const admin = createAdminClient()
      const current = unwrap(await admin.from('invoices').select('*').eq('id', id).single(), 'Get invoice') as any
      const upd: Record<string, any> = { ...Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)), updated_at: new Date().toISOString() }
      if (items || rest.discount !== undefined || rest.transport_fee !== undefined) {
        const src = items || (current.items || []).map((i: any) => ({ description: i.description, quantity: Number(i.quantity), unit_price: Number(i.unit_price) }))
        const totals = computeTotals(src, rest.discount ?? Number(current.discount || 0), rest.transport_fee ?? Number(current.transport_fee || 0))
        Object.assign(upd, totals)
      }
      const data = unwrap(await admin.from('invoices').update(upd).eq('id', id).select().single(), 'Update invoice') as any
      await marketing.logAudit(actor, 'update_invoice', 'finance', `${data.doc_number} — ${data.client_name}`, { ...upd, items: items ? `${items.length} items` : undefined })
      reconcileFollowUpsForInvoice(data).catch(() => {})
      return data
    })
  )

  server.registerTool(
    'get_invoice_pdf',
    {
      title: 'Generate quote / invoice PDF',
      description:
        'Generates a branded PDF of a quote or invoice and returns a shareable download link (valid ~14 days). Use after creating or editing a document so you can attach the link in the email you draft to the client. The owner can also open and download it.',
      inputSchema: { id: z.string().uuid() },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    run(async ({ id }) => {
      const admin = createAdminClient()
      const invoice = unwrap(await admin.from('invoices').select('*').eq('id', id).single(), 'Get invoice') as any

      // Resolve embedded status/time tags before rendering
      if (typeof invoice.notes === 'string') {
        const sm = invoice.notes.match(/\[STATUS:([a-zA-Z0-9_]+)\]/)
        if (sm && invoice.status === 'sent') invoice.status = sm[1]
        const tm = invoice.notes.match(/\[TIME:([^\]]+)\]/)
        if (tm && !invoice.event_time) invoice.event_time = tm[1].trim()
        invoice.notes = invoice.notes.replace(/\[(STATUS|TIME|REQUEST):[^\]]*\]/g, '').trim()
      }

      const pdf = renderInvoicePdf(invoice)
      const filename = invoicePdfFilename(invoice)
      const path = `invoices/${(invoice.doc_number || invoice.id).replace(/[^\w.-]+/g, '-')}.pdf`

      const up = await admin.storage.from('documents').upload(path, pdf, { contentType: 'application/pdf', upsert: true })
      if (up.error) throw new Error(`Upload failed: ${up.error.message}`)
      const signed = await admin.storage.from('documents').createSignedUrl(path, 60 * 60 * 24 * 14, { download: filename })
      if (signed.error || !signed.data) throw new Error(`Link failed: ${signed.error?.message || 'no url'}`)

      await marketing.logAudit(actor, 'generate_invoice_pdf', 'sales', `${invoice.doc_number} — ${invoice.client_name}`, { id: invoice.id })
      return {
        doc_number: invoice.doc_number,
        type: invoice.type,
        filename,
        download_url: signed.data.signedUrl,
        expires_in_days: 14,
        note: 'Link is valid for ~14 days. Re-run this tool to refresh it.',
      }
    })
  )

  // =========================================================================
  // Accounts
  // =========================================================================
  server.registerTool(
    'get_financial_summary',
    { title: 'Financial summary', description: 'Revenue, pipeline, expenses, net profit and margin.', inputSchema: {}, annotations: READ },
    run(async () => getRevenueSummaryTool({ period: 'all' }))
  )

  server.registerTool(
    'list_expenses',
    {
      title: 'List expenses',
      inputSchema: {
        date_from: z.string().optional(),
        date_to: z.string().optional(),
        category: z.enum(EXPENSE_CATEGORIES).optional(),
        limit: z.number().int().min(1).max(500).default(100),
      },
      description: 'Business expenses, newest first.',
      annotations: READ,
    },
    run(async ({ date_from, date_to, category, limit }) => {
      let q = createAdminClient().from('expenses').select('*').order('date', { ascending: false }).limit(limit)
      if (date_from) q = q.gte('date', date_from)
      if (date_to) q = q.lte('date', date_to)
      if (category) q = q.eq('category', category)
      const data = unwrap(await q, 'List expenses') as any[]
      return { count: data.length, total_zar: data.reduce((a, e) => a + Number(e.amount || 0), 0), expenses: data }
    })
  )

  server.registerTool(
    'create_expense',
    {
      title: 'Record expense',
      description: 'Record a business expense (fuel, wages, ad spend, etc.), optionally linked to an event or invoice.',
      inputSchema: {
        title: z.string(),
        amount: z.number().nonnegative(),
        category: z.enum(EXPENSE_CATEGORIES).default('Other'),
        date: z.string().default(today()).describe('YYYY-MM-DD'),
        notes: z.string().optional(),
        event_id: z.string().uuid().optional(),
        invoice_id: z.string().uuid().optional(),
      },
      annotations: WRITE,
    },
    run(async (a) => {
      const data = unwrap(await createAdminClient().from('expenses').insert({ ...a, event_id: a.event_id || null, invoice_id: a.invoice_id || null }).select().single(), 'Create expense') as any
      await marketing.logAudit(actor, 'create_expense', 'finance', `${data.title} R${data.amount}`, { id: data.id, category: data.category })
      return data
    })
  )

  // =========================================================================
  // Equipment
  // =========================================================================
  server.registerTool(
    'get_equipment_status',
    { title: 'Equipment status', description: 'Fleet inventory, headset availability and open issue logs.', inputSchema: {}, annotations: READ },
    run(async () => getEquipmentStatusTool())
  )

  server.registerTool(
    'update_equipment',
    {
      title: 'Update equipment',
      description: 'Change an equipment item\'s status, battery health or notes.',
      inputSchema: {
        id: z.string().uuid(),
        status: z.enum(['available', 'assigned', 'maintenance', 'retired']).optional(),
        battery_health: z.number().int().min(0).max(100).optional(),
        notes: z.string().optional(),
      },
      annotations: WRITE,
    },
    run(async ({ id, ...patch }) => {
      const upd = { ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), updated_at: new Date().toISOString() }
      const data = unwrap(await createAdminClient().from('equipment').update(upd).eq('id', id).select().single(), 'Update equipment') as any
      await marketing.logAudit(actor, 'update_equipment', 'operations', data.name, upd)
      return data
    })
  )

  server.registerTool(
    'log_equipment_issue',
    {
      title: 'Log equipment issue',
      inputSchema: {
        equipment_id: z.string().uuid(),
        issue_type: z.string().describe('e.g. connectivity, strap_wear, charging, lens_scratch, battery_drain'),
        description: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
      },
      description: 'Log a fault or maintenance issue against an equipment item.',
      annotations: WRITE,
    },
    run(async (a) => {
      const data = unwrap(await createAdminClient().from('equipment_logs').insert({ ...a, logged_by: actor }).select().single(), 'Log issue') as any
      await marketing.logAudit(actor, 'log_equipment_issue', 'operations', a.equipment_id, { id: data.id, severity: a.severity })
      return data
    })
  )

  // =========================================================================
  // Rental agreements
  // =========================================================================
  server.registerTool(
    'list_rental_agreements',
    {
      title: 'List rental agreements',
      inputSchema: {
        status: z.enum(['draft', 'active', 'returned', 'completed', 'cancelled', 'all']).default('all'),
        search: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(30),
      },
      description: 'Equipment rental agreements (summary fields).',
      annotations: READ,
    },
    run(async ({ status, search, limit }) => {
      let q = createAdminClient()
        .from('rental_agreements')
        .select('id, agreement_number, renter_name, renter_email, renter_phone, company_name, start_date, end_date, total_amount, booking_deposit_paid, security_deposit, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (status !== 'all') q = q.eq('status', status)
      if (search) {
        const s = `%${clean(search)}%`
        q = q.or(`renter_name.ilike.${s},renter_email.ilike.${s},company_name.ilike.${s},agreement_number.ilike.${s}`)
      }
      return unwrap(await q, 'List rental agreements')
    })
  )

  server.registerTool(
    'get_rental_agreement',
    { title: 'Get rental agreement', description: 'Full rental agreement record.', inputSchema: { id: z.string().uuid() }, annotations: READ },
    run(async ({ id }) => unwrap(await createAdminClient().from('rental_agreements').select('*').eq('id', id).single(), 'Get rental agreement'))
  )

  server.registerTool(
    'update_rental_agreement_status',
    {
      title: 'Update rental agreement status',
      description: 'Mark a rental as active, returned, completed or cancelled, with optional return notes.',
      inputSchema: {
        id: z.string().uuid(),
        status: z.enum(['draft', 'active', 'returned', 'completed', 'cancelled']),
        return_notes: z.string().optional(),
      },
      annotations: WRITE,
    },
    run(async ({ id, status, return_notes }) => {
      const upd: Record<string, any> = { status, updated_at: new Date().toISOString() }
      if (return_notes) upd.return_notes = return_notes
      const data = unwrap(await createAdminClient().from('rental_agreements').update(upd).eq('id', id).select('id, agreement_number, renter_name, status').single(), 'Update rental agreement') as any
      await marketing.logAudit(actor, 'update_rental_agreement', 'operations', data.agreement_number, upd)
      return data
    })
  )

  // =========================================================================
  // Follow-ups
  // =========================================================================
  server.registerTool(
    'list_follow_ups',
    {
      title: 'List follow-ups',
      inputSchema: { status: z.enum(['pending', 'sent', 'cancelled', 'replied', 'all']).default('pending'), limit: z.number().int().min(1).max(200).default(50) },
      description: 'Scheduled client follow-ups (quote chasers, deposit reminders, review requests…).',
      annotations: READ,
    },
    run(async ({ status, limit }) => {
      let q = createAdminClient().from('follow_ups').select('*').order('scheduled_for', { ascending: true }).limit(limit)
      if (status !== 'all') q = q.eq('status', status)
      return unwrap(await q, 'List follow-ups')
    })
  )

  server.registerTool(
    'create_follow_up',
    {
      title: 'Schedule follow-up',
      inputSchema: {
        client_name: z.string(),
        client_email: z.string().optional(),
        client_phone: z.string().optional(),
        request_id: z.string().uuid().optional(),
        invoice_id: z.string().uuid().optional(),
        stage: z.enum(['quote_followup', 'deposit_reminder', 'event_prep', 'payment_balance', 'review_request']).default('quote_followup'),
        scheduled_for: z.string().describe('ISO date/time'),
        channel: z.enum(['email', 'whatsapp', 'sms']).default('email'),
        message_draft: z.string(),
        reason: z.string().optional(),
      },
      description: 'Schedule a follow-up message for a client.',
      annotations: WRITE,
    },
    run(async ({ reason, ...a }) => {
      const data = unwrap(
        await createAdminClient().from('follow_ups').insert({ ...a, request_id: a.request_id || null, invoice_id: a.invoice_id || null, generated_reason: reason || `Scheduled by ${actor}` }).select().single(),
        'Create follow-up'
      ) as any
      await marketing.logAudit(actor, 'create_follow_up', 'customer', a.client_name, { id: data.id, stage: a.stage })
      return data
    })
  )

  server.registerTool(
    'update_follow_up',
    {
      title: 'Update follow-up',
      inputSchema: {
        id: z.string().uuid(),
        status: z.enum(['pending', 'sent', 'cancelled', 'replied']).optional(),
        scheduled_for: z.string().optional(),
        message_draft: z.string().optional(),
      },
      description: 'Mark a follow-up as sent/replied/cancelled, reschedule it or change the message.',
      annotations: WRITE,
    },
    run(async ({ id, ...patch }) => {
      const upd = { ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), updated_at: new Date().toISOString() }
      const data = unwrap(await createAdminClient().from('follow_ups').update(upd).eq('id', id).select().single(), 'Update follow-up') as any
      await marketing.logAudit(actor, 'update_follow_up', 'customer', data.client_name, upd)
      return data
    })
  )

  server.registerTool(
    'list_audit_log',
    {
      title: 'Audit log',
      description: 'Recent actions recorded in the AI Audit Log (including everything done through this connector).',
      inputSchema: { limit: z.number().int().min(1).max(200).default(50), actor: z.string().optional() },
      annotations: READ,
    },
    run(async ({ limit, actor: who }) => {
      let q = createAdminClient().from('ai_audit_logs').select('*').order('created_at', { ascending: false }).limit(limit)
      if (who) q = q.eq('actor', who)
      return unwrap(await q, 'List audit log')
    })
  )

  // =========================================================================
  // Marketing — overview & contacts
  // =========================================================================
  server.registerTool(
    'get_marketing_report',
    { title: 'Marketing report', description: 'Audience size, email campaign results, ad spend/leads/ROAS by platform, and marketing expenses.', inputSchema: {}, annotations: READ },
    run(async () => marketing.getMarketingReport())
  )

  server.registerTool(
    'list_marketing_contacts',
    {
      title: 'List marketing contacts',
      inputSchema: {
        status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained', 'all']).default('all'),
        tag: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().int().min(1).max(1000).default(100),
        offset: z.number().int().min(0).default(0),
      },
      description: 'The email marketing audience.',
      annotations: READ,
    },
    run(async (a) => marketing.listContacts(a))
  )

  server.registerTool(
    'add_marketing_contacts',
    {
      title: 'Add marketing contacts',
      description: 'Add or update contacts by email (merges tags). People who unsubscribed stay unsubscribed.',
      inputSchema: {
        contacts: z
          .array(
            z.object({
              email: z.string(),
              name: z.string().optional(),
              phone: z.string().optional(),
              suburb: z.string().optional(),
              tags: z.array(z.string()).optional(),
              notes: z.string().optional(),
              consent_basis: z.enum(['opt_in', 'existing_customer', 'other']).optional().describe('opt_in = they asked for marketing; existing_customer = past client/enquirer'),
            })
          )
          .min(1)
          .max(1000),
        source: z.string().default('claude'),
      },
      annotations: WRITE,
    },
    run(async ({ contacts, source }) => marketing.upsertContacts(contacts.map((c) => ({ ...c, source })), actor))
  )

  server.registerTool(
    'update_marketing_contact',
    {
      title: 'Update marketing contact',
      inputSchema: {
        id: z.string().uuid(),
        name: z.string().optional(),
        phone: z.string().optional(),
        suburb: z.string().optional(),
        tags: z.array(z.string()).optional().describe('Replaces the tag list'),
        status: z.enum(['subscribed', 'unsubscribed', 'bounced', 'complained']).optional(),
        notes: z.string().optional(),
      },
      description: 'Edit a contact\'s details, tags or status.',
      annotations: WRITE,
    },
    run(async ({ id, ...patch }) => marketing.updateContact(id, patch, actor))
  )

  server.registerTool(
    'unsubscribe_contact',
    {
      title: 'Unsubscribe contact',
      description: 'Stop all marketing email to this address (use whenever someone asks to be removed).',
      inputSchema: { email: z.string() },
      annotations: WRITE,
    },
    run(async ({ email }) => marketing.unsubscribeByEmail(email, actor))
  )

  server.registerTool(
    'sync_contacts_from_clients',
    {
      title: 'Import contacts from clients',
      description: 'Adds everyone from website requests and quotes/invoices to the marketing audience, tagged by enquiry type (birthday, corporate, school…), "past-client" or "quoted".',
      inputSchema: {},
      annotations: WRITE,
    },
    run(async () => marketing.syncContactsFromClients(actor))
  )

  // =========================================================================
  // Marketing — email campaigns
  // =========================================================================
  server.registerTool(
    'list_email_campaigns',
    {
      title: 'List email campaigns',
      inputSchema: { status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'all']).default('all') },
      description: 'Email campaigns with send stats and results.',
      annotations: READ,
    },
    run(async (a) => marketing.listCampaigns(a))
  )

  server.registerTool(
    'get_email_campaign',
    {
      title: 'Get email campaign',
      inputSchema: { id: z.string().uuid(), include_recipients: z.boolean().default(false) },
      description: 'Full campaign content and (optionally) every recipient with their send status.',
      annotations: READ,
    },
    run(async ({ id, include_recipients }) => marketing.getCampaign(id, { includeRecipients: include_recipients }))
  )

  const campaignShape = {
    name: z.string().describe('Internal name, e.g. "December holiday parties promo"'),
    subject: z.string(),
    preview_text: z.string().optional(),
    body_html: z.string().describe('Email HTML. Use {{first_name}} to personalise. Unsubscribe footer is added automatically unless you include {{unsubscribe_url}}.'),
    body_text: z.string().optional().describe('Plain-text version'),
    audience_tags: z.array(z.string()).default([]).describe('Send to subscribed contacts with ANY of these tags; empty = all subscribed contacts'),
    send_method: z.enum(['gmail', 'portal']).default('gmail'),
    scheduled_for: z.string().optional(),
    goal: z.string().optional(),
    notes: z.string().optional(),
  }

  server.registerTool(
    'create_email_campaign',
    { title: 'Create email campaign', description: 'Create a draft email campaign in the Marketing section.', inputSchema: campaignShape, annotations: WRITE },
    run(async (a) => marketing.createCampaign(a, actor))
  )

  server.registerTool(
    'update_email_campaign',
    {
      title: 'Update email campaign',
      description: 'Edit content/audience, change status (pause, cancel), or record results: replies_count, bookings_count, revenue_attributed, cost.',
      inputSchema: {
        id: z.string().uuid(),
        ...Object.fromEntries(Object.entries(campaignShape).map(([k, v]) => [k, (v as z.ZodTypeAny).optional()])),
        status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled']).optional(),
        replies_count: z.number().int().min(0).optional(),
        bookings_count: z.number().int().min(0).optional(),
        revenue_attributed: z.number().min(0).optional(),
        cost: z.number().min(0).optional(),
      } as any,
      annotations: WRITE,
    },
    run(async ({ id, ...patch }: any) => marketing.updateCampaign(id, patch, actor))
  )

  server.registerTool(
    'prepare_campaign_recipients',
    {
      title: 'Build campaign recipient list',
      description: 'Adds every subscribed contact matching the campaign\'s audience tags as a pending recipient (safe to run again — no duplicates).',
      inputSchema: { campaign_id: z.string().uuid() },
      annotations: WRITE,
    },
    run(async ({ campaign_id }) => marketing.prepareCampaignRecipients(campaign_id, actor))
  )

  server.registerTool(
    'get_campaign_send_batch',
    {
      title: 'Get next emails to send',
      description: 'Returns the next pending recipients with their personalised subject, HTML and text ready to send through Gmail. After sending, call record_campaign_sends.',
      inputSchema: { campaign_id: z.string().uuid(), limit: z.number().int().min(1).max(100).default(20) },
      annotations: READ,
    },
    run(async ({ campaign_id, limit }) => marketing.getPendingRecipients(campaign_id, limit))
  )

  server.registerTool(
    'record_campaign_sends',
    {
      title: 'Record campaign sends',
      description: 'Record the outcome for each recipient you sent to (status + Gmail message id). Updates campaign stats and marks it "sent" when nobody is pending.',
      inputSchema: {
        campaign_id: z.string().uuid(),
        results: z
          .array(
            z.object({
              recipient_id: z.string().uuid(),
              status: z.enum(['sent', 'failed', 'skipped', 'bounced', 'replied']),
              external_id: z.string().optional().describe('Gmail message id'),
              error: z.string().optional(),
            })
          )
          .min(1)
          .max(200),
      },
      annotations: WRITE,
    },
    run(async ({ campaign_id, results }) => marketing.recordCampaignSends(campaign_id, results, actor))
  )

  server.registerTool(
    'send_campaign_batch_via_portal',
    {
      title: 'Send batch from portal',
      description: 'Sends the next batch directly from the portal\'s own email provider (Resend/SMTP) instead of Gmail, and records results. Only works if a provider is configured.',
      inputSchema: { campaign_id: z.string().uuid(), limit: z.number().int().min(1).max(100).default(50) },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    run(async ({ campaign_id, limit }) => marketing.sendCampaignBatchViaPortal(campaign_id, limit, actor))
  )

  // =========================================================================
  // Marketing — ads
  // =========================================================================
  const adShape = {
    name: z.string(),
    platform: z.enum(AD_PLATFORMS).default('meta'),
    objective: z.string().optional().describe('leads, traffic, awareness, bookings…'),
    status: z.enum(['planned', 'active', 'paused', 'completed', 'cancelled']).default('planned'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    budget: z.number().min(0).optional(),
    spend: z.number().min(0).optional(),
    impressions: z.number().int().min(0).optional(),
    clicks: z.number().int().min(0).optional(),
    leads: z.number().int().min(0).optional(),
    bookings: z.number().int().min(0).optional(),
    revenue_attributed: z.number().min(0).optional(),
    target_audience: z.string().optional(),
    ad_copy: z.string().optional(),
    creative_url: z.string().optional(),
    landing_url: z.string().optional(),
    notes: z.string().optional(),
  }

  server.registerTool(
    'list_ad_campaigns',
    {
      title: 'List ad campaigns',
      inputSchema: { status: z.string().optional(), platform: z.string().optional() },
      description: 'Paid & social ad campaigns with spend and results.',
      annotations: READ,
    },
    run(async (a) => marketing.listAds(a))
  )

  server.registerTool(
    'create_ad_campaign',
    { title: 'Create ad campaign', description: 'Track a new ad campaign (Meta, Google, TikTok, print, influencer…).', inputSchema: adShape, annotations: WRITE },
    run(async (a) => marketing.createAd(a, actor))
  )

  server.registerTool(
    'update_ad_campaign',
    {
      title: 'Update ad campaign',
      description: 'Update an ad campaign\'s status, copy or performance numbers (spend, impressions, clicks, leads, bookings, revenue).',
      inputSchema: { id: z.string().uuid(), ...Object.fromEntries(Object.entries(adShape).map(([k, v]) => [k, (v as z.ZodTypeAny).optional()])) } as any,
      annotations: WRITE,
    },
    run(async ({ id, ...patch }: any) => marketing.updateAd(id, patch, actor))
  )

  return server
}
