import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, getConfiguredEmailProvider } from '@/lib/email/sender'

/**
 * Marketing & client-communications service.
 *
 * Shared by the admin portal API routes (/api/marketing/*) and the Claude MCP
 * connector (/api/mcp), so both always behave identically.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://virtualrealityguyz.co.za').replace(/\/$/, '')

export type Actor = string // e.g. 'Admin', 'Claude (MCP)'

const normEmail = (e?: string | null) => (e || '').trim().toLowerCase()
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const nowIso = () => new Date().toISOString()

function unwrap<T>(res: { data: T | null; error: any }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`)
  return res.data as T
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------
export async function logAudit(
  actor: Actor,
  action_name: string,
  category: string,
  target_record: string | null,
  details: Record<string, any> = {},
  status: 'success' | 'failed' = 'success'
) {
  try {
    await createAdminClient().from('ai_audit_logs').insert({
      action_name,
      category,
      actor,
      target_record,
      details,
      status,
    })
  } catch (err) {
    console.error('[audit] failed to write audit log', err)
  }
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------
export interface ContactInput {
  email: string
  name?: string | null
  phone?: string | null
  suburb?: string | null
  tags?: string[]
  source?: string
  consent_basis?: 'opt_in' | 'existing_customer' | 'other'
  notes?: string | null
}

export async function listContacts(opts: {
  status?: string
  tag?: string
  search?: string
  limit?: number
  offset?: number
} = {}) {
  const admin = createAdminClient()
  const limit = Math.min(opts.limit || 100, 1000)
  const offset = opts.offset || 0
  let q = admin
    .from('marketing_contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status)
  if (opts.tag) q = q.contains('tags', [opts.tag])
  if (opts.search) {
    const s = `%${opts.search.replace(/[%,()]/g, ' ').trim()}%`
    q = q.or(`email.ilike.${s},name.ilike.${s},phone.ilike.${s}`)
  }
  const { data, error, count } = await q
  if (error) throw new Error(`List contacts: ${error.message}`)
  return { contacts: data || [], total: count ?? (data?.length || 0) }
}

/**
 * Adds or updates contacts by email. Never re-subscribes someone who
 * unsubscribed — their status is preserved.
 */
export async function upsertContacts(inputs: ContactInput[], actor: Actor) {
  const admin = createAdminClient()
  const valid = new Map<string, ContactInput>()
  const invalid: string[] = []
  for (const c of inputs) {
    const email = normEmail(c.email)
    if (!isEmail(email)) {
      invalid.push(c.email)
      continue
    }
    valid.set(email, { ...c, email })
  }
  if (valid.size === 0) return { created: 0, updated: 0, invalid }

  const emails = [...valid.keys()]
  const existing = unwrap(
    await admin.from('marketing_contacts').select('id, email, tags').in('email', emails),
    'Lookup contacts'
  ) as { id: string; email: string; tags: string[] }[]
  const existingMap = new Map(existing.map((e) => [e.email, e]))

  const toInsert: any[] = []
  let updated = 0
  for (const [email, c] of valid) {
    const prev = existingMap.get(email)
    if (prev) {
      const patch: Record<string, any> = { updated_at: nowIso() }
      if (c.name) patch.name = c.name
      if (c.phone) patch.phone = c.phone
      if (c.suburb) patch.suburb = c.suburb
      if (c.notes) patch.notes = c.notes
      if (c.tags?.length) patch.tags = [...new Set([...(prev.tags || []), ...c.tags])]
      unwrap(await admin.from('marketing_contacts').update(patch).eq('id', prev.id).select('id'), 'Update contact')
      updated++
    } else {
      toInsert.push({
        email,
        name: c.name || null,
        phone: c.phone || null,
        suburb: c.suburb || null,
        tags: c.tags || [],
        source: c.source || 'manual',
        consent_basis: c.consent_basis || 'existing_customer',
        notes: c.notes || null,
      })
    }
  }
  if (toInsert.length) {
    unwrap(await admin.from('marketing_contacts').insert(toInsert).select('id'), 'Insert contacts')
  }
  await logAudit(actor, 'upsert_marketing_contacts', 'marketing', `${toInsert.length} new / ${updated} updated contacts`, {
    created: toInsert.length,
    updated,
    invalid,
  })
  return { created: toInsert.length, updated, invalid }
}

export async function updateContact(id: string, patch: Record<string, any>, actor: Actor) {
  const allowed = ['name', 'phone', 'suburb', 'tags', 'status', 'notes', 'consent_basis', 'email']
  const clean: Record<string, any> = { updated_at: nowIso() }
  for (const k of allowed) if (patch[k] !== undefined) clean[k] = patch[k]
  if (clean.email) clean.email = normEmail(clean.email)
  if (clean.status === 'unsubscribed') clean.unsubscribed_at = nowIso()
  const data = unwrap(
    await createAdminClient().from('marketing_contacts').update(clean).eq('id', id).select().single(),
    'Update contact'
  )
  await logAudit(actor, 'update_marketing_contact', 'marketing', (data as any).email, clean)
  return data
}

export async function deleteContact(id: string, actor: Actor) {
  unwrap(await createAdminClient().from('marketing_contacts').delete().eq('id', id).select('id'), 'Delete contact')
  await logAudit(actor, 'delete_marketing_contact', 'marketing', id)
  return { deleted: true }
}

export async function unsubscribeByToken(token: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('marketing_contacts')
    .update({ status: 'unsubscribed', unsubscribed_at: nowIso(), updated_at: nowIso() })
    .eq('unsubscribe_token', token)
    .select('id, email')
    .maybeSingle()
  if (data) {
    await admin
      .from('email_campaign_recipients')
      .update({ status: 'unsubscribed' })
      .eq('contact_id', data.id)
      .eq('status', 'pending')
    await logAudit('Contact (self-service)', 'unsubscribe', 'marketing', data.email)
  }
  return data
}

export async function unsubscribeByEmail(email: string, actor: Actor) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('marketing_contacts')
    .update({ status: 'unsubscribed', unsubscribed_at: nowIso(), updated_at: nowIso() })
    .eq('email', normEmail(email))
    .select('id, email')
    .maybeSingle()
  if (data) {
    await admin
      .from('email_campaign_recipients')
      .update({ status: 'unsubscribed' })
      .eq('contact_id', data.id)
      .eq('status', 'pending')
  }
  await logAudit(actor, 'unsubscribe', 'marketing', normEmail(email), { found: !!data })
  return { unsubscribed: !!data, email: normEmail(email) }
}

/**
 * Imports everyone who has contacted us (website requests) or booked with us
 * (quotes / invoices) as marketing contacts, tagged by their enquiry type.
 * Existing contacts keep their status — unsubscribed people stay unsubscribed.
 */
export async function syncContactsFromClients(actor: Actor) {
  const admin = createAdminClient()
  const [{ data: requests }, { data: invoices }] = await Promise.all([
    admin.from('form_requests').select('name, email, phone, suburb, form_type'),
    admin.from('invoices').select('client_name, client_email, client_phone, status'),
  ])
  const inputs: ContactInput[] = []
  for (const r of requests || []) {
    if (!r.email) continue
    inputs.push({
      email: r.email,
      name: r.name,
      phone: r.phone,
      suburb: r.suburb,
      tags: ['website-enquiry', r.form_type].filter(Boolean) as string[],
      source: 'website_request',
      consent_basis: 'existing_customer',
    })
  }
  for (const i of invoices || []) {
    if (!i.client_email) continue
    const paid = i.status === 'paid' || i.status === 'deposit_paid'
    inputs.push({
      email: i.client_email,
      name: i.client_name,
      phone: i.client_phone,
      tags: [paid ? 'past-client' : 'quoted'],
      source: 'past_client',
      consent_basis: 'existing_customer',
    })
  }
  const result = await upsertContacts(inputs, actor)
  return { ...result, scanned: inputs.length }
}

// ---------------------------------------------------------------------------
// Email campaigns
// ---------------------------------------------------------------------------
const CAMPAIGN_FIELDS = [
  'name', 'subject', 'preview_text', 'body_html', 'body_text', 'audience_tags', 'status',
  'scheduled_for', 'send_method', 'replies_count', 'bookings_count', 'revenue_attributed',
  'cost', 'goal', 'notes',
]

function pick(obj: Record<string, any>, keys: string[]) {
  const out: Record<string, any> = {}
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k]
  return out
}

export async function listCampaigns(opts: { status?: string; limit?: number } = {}) {
  let q = createAdminClient()
    .from('email_campaigns')
    .select('id, name, subject, status, send_method, audience_tags, recipients_count, sent_count, failed_count, replies_count, bookings_count, revenue_attributed, cost, scheduled_for, started_at, completed_at, created_by, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(Math.min(opts.limit || 50, 200))
  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status)
  return unwrap(await q, 'List campaigns')
}

export async function getCampaign(id: string, opts: { includeRecipients?: boolean } = {}) {
  const admin = createAdminClient()
  const campaign = unwrap(await admin.from('email_campaigns').select('*').eq('id', id).single(), 'Get campaign')
  let recipients: any[] | undefined
  if (opts.includeRecipients) {
    recipients = unwrap(
      await admin
        .from('email_campaign_recipients')
        .select('id, email, name, status, sent_at, error, external_id')
        .eq('campaign_id', id)
        .order('created_at', { ascending: true })
        .limit(2000),
      'Get recipients'
    ) as any[]
  }
  return { campaign, recipients }
}

export async function createCampaign(input: Record<string, any>, actor: Actor) {
  if (!input.name || !input.subject) throw new Error('Campaign name and subject are required')
  const row: Record<string, any> = { ...pick(input, CAMPAIGN_FIELDS), created_by: actor }
  if (row.status && !['draft', 'scheduled'].includes(row.status)) row.status = 'draft'
  const data = unwrap(await createAdminClient().from('email_campaigns').insert(row).select().single(), 'Create campaign')
  await logAudit(actor, 'create_email_campaign', 'marketing', (data as any).name, { id: (data as any).id })
  return data
}

export async function updateCampaign(id: string, patch: Record<string, any>, actor: Actor) {
  const clean = { ...pick(patch, CAMPAIGN_FIELDS), updated_at: nowIso() }
  const data = unwrap(
    await createAdminClient().from('email_campaigns').update(clean).eq('id', id).select().single(),
    'Update campaign'
  )
  await logAudit(actor, 'update_email_campaign', 'marketing', (data as any).name, clean)
  return data
}

export async function deleteCampaign(id: string, actor: Actor) {
  unwrap(await createAdminClient().from('email_campaigns').delete().eq('id', id).select('id'), 'Delete campaign')
  await logAudit(actor, 'delete_email_campaign', 'marketing', id)
  return { deleted: true }
}

/** Builds (or tops up) the recipient list from subscribed contacts matching the audience tags. */
export async function prepareCampaignRecipients(campaignId: string, actor: Actor) {
  const admin = createAdminClient()
  const campaign = unwrap(
    await admin.from('email_campaigns').select('id, name, audience_tags, status').eq('id', campaignId).single(),
    'Get campaign'
  ) as any
  if (['sent', 'cancelled'].includes(campaign.status)) {
    throw new Error(`Campaign is ${campaign.status}; create a new campaign instead.`)
  }

  let q = admin.from('marketing_contacts').select('id, email, name').eq('status', 'subscribed').limit(5000)
  if (campaign.audience_tags?.length) q = q.overlaps('tags', campaign.audience_tags)
  const contacts = unwrap(await q, 'Load audience') as any[]

  if (contacts.length) {
    const rows = contacts.map((c) => ({ campaign_id: campaignId, contact_id: c.id, email: c.email, name: c.name }))
    unwrap(
      await admin
        .from('email_campaign_recipients')
        .upsert(rows, { onConflict: 'campaign_id,email', ignoreDuplicates: true })
        .select('id'),
      'Add recipients'
    )
  }
  const stats = await refreshCampaignStats(campaignId)
  await logAudit(actor, 'prepare_campaign_recipients', 'marketing', campaign.name, { audience: contacts.length, ...stats })
  return { audience_size: contacts.length, ...stats }
}

function firstName(name?: string | null) {
  return (name || '').trim().split(/\s+/)[0] || 'there'
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export function unsubscribeUrl(token: string) {
  return `${SITE_URL}/api/marketing/unsubscribe?token=${token}`
}

/** Fills {{first_name}}, {{name}}, {{email}} and {{unsubscribe_url}} and guarantees an unsubscribe footer. */
export function personalise(
  campaign: { subject: string; body_html: string; body_text?: string | null },
  contact: { email: string; name?: string | null; unsubscribe_token?: string | null }
) {
  const unsub = contact.unsubscribe_token ? unsubscribeUrl(contact.unsubscribe_token) : `${SITE_URL}/contact`
  const vars: Record<string, string> = {
    first_name: firstName(contact.name),
    name: contact.name || 'there',
    email: contact.email,
    unsubscribe_url: unsub,
  }
  const fill = (t: string, html: boolean) =>
    t.replace(/\{\{\s*(first_name|name|email|unsubscribe_url)\s*\}\}/g, (_, k) => (html && k !== 'unsubscribe_url' ? escapeHtml(vars[k]) : vars[k]))

  let html = fill(campaign.body_html || '', true)
  if (!/unsubscribe/i.test(campaign.body_html || '')) {
    html += `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 12px"/><p style="font-size:12px;color:#6b7280;font-family:Arial,sans-serif">You're receiving this because you've been in touch with Virtual Reality Guys. <a href="${unsub}" style="color:#6b7280">Unsubscribe</a></p>`
  }
  let text = fill(campaign.body_text || '', false)
  if (text && !/unsubscribe/i.test(campaign.body_text || '')) text += `\n\n---\nUnsubscribe: ${unsub}`

  return { subject: fill(campaign.subject, false), html, text: text || undefined, unsubscribe_url: unsub }
}

/** Returns the next batch of not-yet-sent recipients with their personalised email ready to send. */
export async function getPendingRecipients(campaignId: string, limit = 25) {
  const admin = createAdminClient()
  const campaign = unwrap(await admin.from('email_campaigns').select('*').eq('id', campaignId).single(), 'Get campaign') as any
  const recipients = unwrap(
    await admin
      .from('email_campaign_recipients')
      .select('id, email, name, contact_id, marketing_contacts(unsubscribe_token, status)')
      .eq('campaign_id', campaignId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(Math.min(limit, 100)),
    'Get pending recipients'
  ) as any[]

  const { count: remaining } = await admin
    .from('email_campaign_recipients')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('status', 'pending')

  const ready: any[] = []
  const skipped: string[] = []
  for (const r of recipients) {
    const contact = Array.isArray(r.marketing_contacts) ? r.marketing_contacts[0] : r.marketing_contacts
    if (contact && contact.status !== 'subscribed') {
      skipped.push(r.id)
      continue
    }
    const email = personalise(campaign, { email: r.email, name: r.name, unsubscribe_token: contact?.unsubscribe_token })
    ready.push({ recipient_id: r.id, to: r.email, name: r.name, ...email })
  }
  if (skipped.length) {
    await admin.from('email_campaign_recipients').update({ status: 'skipped', error: 'Contact no longer subscribed' }).in('id', skipped)
  }
  return {
    campaign: { id: campaign.id, name: campaign.name, status: campaign.status },
    batch: ready,
    remaining_after_this_batch: Math.max((remaining || 0) - recipients.length, 0),
  }
}

export interface SendResult {
  recipient_id: string
  status: 'sent' | 'failed' | 'skipped' | 'bounced' | 'replied'
  external_id?: string
  error?: string
}

/** Records the outcome of sends (e.g. after Claude sent them through Gmail) and updates stats. */
export async function recordCampaignSends(campaignId: string, results: SendResult[], actor: Actor) {
  const admin = createAdminClient()
  const ts = nowIso()
  for (const r of results) {
    await admin
      .from('email_campaign_recipients')
      .update({
        status: r.status,
        external_id: r.external_id || null,
        error: r.error || null,
        sent_at: r.status === 'sent' ? ts : null,
      })
      .eq('id', r.recipient_id)
      .eq('campaign_id', campaignId)
  }
  const sentIds = results.filter((r) => r.status === 'sent').map((r) => r.recipient_id)
  if (sentIds.length) {
    const { data: rows } = await admin.from('email_campaign_recipients').select('contact_id').in('id', sentIds)
    const contactIds = (rows || []).map((r: any) => r.contact_id).filter(Boolean)
    if (contactIds.length) await admin.from('marketing_contacts').update({ last_emailed_at: ts }).in('id', contactIds)
  }

  const { data: camp } = await admin.from('email_campaigns').select('name, status, started_at').eq('id', campaignId).single()
  if (camp && !camp.started_at) await admin.from('email_campaigns').update({ started_at: ts, status: 'sending' }).eq('id', campaignId)
  else if (camp && ['draft', 'scheduled', 'paused'].includes(camp.status))
    await admin.from('email_campaigns').update({ status: 'sending' }).eq('id', campaignId)

  const stats = await refreshCampaignStats(campaignId)
  await logAudit(actor, 'record_campaign_sends', 'marketing', camp?.name || campaignId, {
    recorded: results.length,
    ...stats,
  })
  return stats
}

/** Recalculates counts; marks the campaign as sent when nothing is pending. */
export async function refreshCampaignStats(campaignId: string) {
  const admin = createAdminClient()
  const { data: rows } = await admin.from('email_campaign_recipients').select('status').eq('campaign_id', campaignId).limit(10000)
  const counts: Record<string, number> = {}
  for (const r of rows || []) counts[r.status] = (counts[r.status] || 0) + 1
  const total = rows?.length || 0
  const sent = (counts.sent || 0) + (counts.replied || 0)
  const failed = (counts.failed || 0) + (counts.bounced || 0)
  const pending = counts.pending || 0

  const patch: Record<string, any> = {
    recipients_count: total,
    sent_count: sent,
    failed_count: failed,
    updated_at: nowIso(),
  }
  const { data: camp } = await admin.from('email_campaigns').select('status').eq('id', campaignId).single()
  if (camp?.status === 'sending' && pending === 0 && total > 0) {
    patch.status = 'sent'
    patch.completed_at = nowIso()
  }
  await admin.from('email_campaigns').update(patch).eq('id', campaignId)
  return { recipients: total, sent, failed, pending, by_status: counts }
}

/** Sends a batch directly from the portal (Resend / SMTP). Alternative to sending via Gmail. */
export async function sendCampaignBatchViaPortal(campaignId: string, limit: number, actor: Actor) {
  const provider = getConfiguredEmailProvider()
  if (!provider) {
    throw new Error('The portal has no email provider configured. Send through Gmail instead, or set RESEND_API_KEY / SMTP credentials.')
  }
  const { batch, remaining_after_this_batch } = await getPendingRecipients(campaignId, limit)
  const results: SendResult[] = []
  for (const item of batch) {
    const res = await sendEmail({
      to: item.to,
      subject: item.subject,
      html: item.html,
      text: item.text,
      headers: {
        'List-Unsubscribe': `<${item.unsubscribe_url}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })
    results.push({
      recipient_id: item.recipient_id,
      status: res.success ? 'sent' : 'failed',
      external_id: res.id,
      error: res.error,
    })
  }
  const stats = await recordCampaignSends(campaignId, results, actor)
  return { provider, attempted: batch.length, remaining: remaining_after_this_batch, ...stats }
}

// ---------------------------------------------------------------------------
// Ad campaigns
// ---------------------------------------------------------------------------
const AD_FIELDS = [
  'name', 'platform', 'objective', 'status', 'start_date', 'end_date', 'budget', 'spend', 'impressions',
  'clicks', 'leads', 'bookings', 'revenue_attributed', 'target_audience', 'ad_copy', 'creative_url',
  'landing_url', 'notes',
]

export async function listAds(opts: { status?: string; platform?: string } = {}) {
  let q = createAdminClient().from('ad_campaigns').select('*').order('created_at', { ascending: false }).limit(200)
  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status)
  if (opts.platform && opts.platform !== 'all') q = q.eq('platform', opts.platform)
  return unwrap(await q, 'List ads')
}

export async function createAd(input: Record<string, any>, actor: Actor) {
  if (!input.name) throw new Error('Ad campaign name is required')
  const data = unwrap(
    await createAdminClient().from('ad_campaigns').insert({ ...pick(input, AD_FIELDS), created_by: actor }).select().single(),
    'Create ad campaign'
  )
  await logAudit(actor, 'create_ad_campaign', 'marketing', (data as any).name, { id: (data as any).id })
  return data
}

export async function updateAd(id: string, patch: Record<string, any>, actor: Actor) {
  const clean = { ...pick(patch, AD_FIELDS), updated_at: nowIso() }
  const data = unwrap(
    await createAdminClient().from('ad_campaigns').update(clean).eq('id', id).select().single(),
    'Update ad campaign'
  )
  await logAudit(actor, 'update_ad_campaign', 'marketing', (data as any).name, clean)
  return data
}

export async function deleteAd(id: string, actor: Actor) {
  unwrap(await createAdminClient().from('ad_campaigns').delete().eq('id', id).select('id'), 'Delete ad campaign')
  await logAudit(actor, 'delete_ad_campaign', 'marketing', id)
  return { deleted: true }
}

// ---------------------------------------------------------------------------
// Client communications (request replies etc.)
// ---------------------------------------------------------------------------
export interface CommunicationInput {
  request_id?: string | null
  invoice_id?: string | null
  client_name?: string | null
  client_email?: string | null
  direction?: 'outbound' | 'inbound'
  channel?: 'email' | 'whatsapp' | 'sms' | 'phone'
  subject?: string | null
  body?: string | null
  status?: 'draft' | 'sent' | 'failed' | 'received'
  external_id?: string | null
}

export async function logCommunication(input: CommunicationInput, actor: Actor) {
  const row = {
    request_id: input.request_id || null,
    invoice_id: input.invoice_id || null,
    client_name: input.client_name || null,
    client_email: normEmail(input.client_email) || null,
    direction: input.direction || 'outbound',
    channel: input.channel || 'email',
    subject: input.subject || null,
    body: input.body || null,
    status: input.status || 'sent',
    external_id: input.external_id || null,
    sent_by: actor,
  }
  const data = unwrap(await createAdminClient().from('client_communications').insert(row).select().single(), 'Log communication')
  await logAudit(actor, 'log_client_communication', 'customer', row.client_email || row.client_name, {
    id: (data as any).id,
    subject: row.subject,
    channel: row.channel,
    direction: row.direction,
    request_id: row.request_id,
  })
  return data
}

export async function listCommunications(opts: { request_id?: string; email?: string; limit?: number } = {}) {
  let q = createAdminClient()
    .from('client_communications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Math.min(opts.limit || 100, 500))
  if (opts.request_id) q = q.eq('request_id', opts.request_id)
  if (opts.email) q = q.eq('client_email', normEmail(opts.email))
  return unwrap(await q, 'List communications')
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
export async function getMarketingReport() {
  const admin = createAdminClient()
  const [contactsRes, campaigns, ads, adExpensesRes] = await Promise.all([
    admin.from('marketing_contacts').select('status'),
    admin.from('email_campaigns').select('status, sent_count, replies_count, bookings_count, revenue_attributed, cost'),
    admin.from('ad_campaigns').select('platform, status, spend, budget, impressions, clicks, leads, bookings, revenue_attributed'),
    admin.from('expenses').select('amount').eq('category', 'Marketing / Ads'),
  ])

  const contactCounts: Record<string, number> = {}
  for (const c of contactsRes.data || []) contactCounts[c.status] = (contactCounts[c.status] || 0) + 1

  const sum = (rows: any[] | null | undefined, k: string) => (rows || []).reduce((a, r) => a + Number(r[k] || 0), 0)
  const camp = campaigns.data || []
  const adRows = ads.data || []

  const byPlatform: Record<string, any> = {}
  for (const a of adRows) {
    const p = (byPlatform[a.platform] ||= { spend: 0, leads: 0, bookings: 0, revenue: 0, clicks: 0, impressions: 0, campaigns: 0 })
    p.spend += Number(a.spend || 0)
    p.leads += Number(a.leads || 0)
    p.bookings += Number(a.bookings || 0)
    p.revenue += Number(a.revenue_attributed || 0)
    p.clicks += Number(a.clicks || 0)
    p.impressions += Number(a.impressions || 0)
    p.campaigns += 1
  }

  const adSpend = sum(adRows, 'spend')
  const adRevenue = sum(adRows, 'revenue_attributed')
  const adLeads = sum(adRows, 'leads')
  const emailRevenue = sum(camp, 'revenue_attributed')
  const emailCost = sum(camp, 'cost')

  return {
    contacts: { total: (contactsRes.data || []).length, by_status: contactCounts },
    email: {
      campaigns: camp.length,
      sent_campaigns: camp.filter((c: any) => c.status === 'sent').length,
      emails_sent: sum(camp, 'sent_count'),
      replies: sum(camp, 'replies_count'),
      bookings: sum(camp, 'bookings_count'),
      revenue_attributed_zar: emailRevenue,
      cost_zar: emailCost,
    },
    ads: {
      campaigns: adRows.length,
      active: adRows.filter((a: any) => a.status === 'active').length,
      budget_zar: sum(adRows, 'budget'),
      spend_zar: adSpend,
      impressions: sum(adRows, 'impressions'),
      clicks: sum(adRows, 'clicks'),
      leads: adLeads,
      bookings: sum(adRows, 'bookings'),
      revenue_attributed_zar: adRevenue,
      cost_per_lead_zar: adLeads > 0 ? Number((adSpend / adLeads).toFixed(2)) : null,
      roas: adSpend > 0 ? Number((adRevenue / adSpend).toFixed(2)) : null,
      by_platform: byPlatform,
    },
    marketing_expenses_in_accounts_zar: sum(adExpensesRes.data, 'amount'),
  }
}
