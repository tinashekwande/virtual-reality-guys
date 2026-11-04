import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewLeadNotification } from '@/lib/email/notifier'
import { sendEmail, getConfiguredEmailProvider } from '@/lib/email/sender'
import { buildAcknowledgementEmail } from '@/lib/email/client-templates'
import { scheduleRequestFollowUp } from '@/lib/followups/scheduler'

/**
 * Fire-and-forget: send the client an instant acknowledgement and record it
 * against their request so it shows in the portal's communication log.
 */
async function sendClientAcknowledgement(params: {
  name: string
  email: string
  formType: string
  eventDate?: string | null
  bookedGame?: string | null
  requestId?: string | null
}) {
  if (!getConfiguredEmailProvider()) return // no provider configured — skip silently
  const ack = buildAcknowledgementEmail({
    name: params.name,
    formType: params.formType,
    eventDate: params.eventDate,
    bookedGame: params.bookedGame,
  })
  const res = await sendEmail({ to: params.email, subject: ack.subject, html: ack.html, text: ack.text })
  try {
    await createAdminClient().from('client_communications').insert({
      request_id: params.requestId || null,
      client_name: params.name,
      client_email: params.email.trim().toLowerCase(),
      direction: 'outbound',
      channel: 'email',
      subject: ack.subject,
      body: ack.text,
      status: res.success ? 'sent' : 'failed',
      external_id: res.id || null,
      sent_by: 'System (auto-reply)',
    })
  } catch (err) {
    console.error('[forms/submit] Failed to log acknowledgement:', err)
  }
}

// Public endpoint — receives form submissions from the website
export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, suburb, message, event_date, event_time, form_type = 'contact', game_title, game_id } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Prepend metadata headers (game, event date, event time & suburb) so they are preserved across all views
  const metaHeaders: string[] = []
  if (game_title) metaHeaders.push(`[Booked Game: ${game_title}${game_id ? ` (ID: ${game_id})` : ''}]`)
  if (event_date) metaHeaders.push(`[Event Date: ${event_date}]`)
  if (event_time) metaHeaders.push(`[Event Time: ${event_time}]`)
  if (suburb) metaHeaders.push(`[Suburb: ${suburb}]`)

  const formattedMessage = metaHeaders.length > 0
    ? `${metaHeaders.join(' ')}\n\n${message}`
    : message

  const admin = createAdminClient()

  // Build insert payload
  const insertPayload: Record<string, any> = {
    name,
    email,
    phone: phone || null,
    message: formattedMessage,
    form_type,
    status: 'new',
  }
  if (suburb) {
    insertPayload.suburb = suburb
  }

  let { data, error } = await admin
    .from('form_requests')
    .insert(insertPayload)
    .select()
    .single()

  // Graceful fallback if database schema does not have the 'suburb' column yet
  if (error && (error.message?.includes('suburb') || error.code === '42703')) {
    delete insertPayload.suburb
    const retry = await admin
      .from('form_requests')
      .insert(insertPayload)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Trigger automated email notification to business owners
  sendNewLeadNotification({
    name,
    email,
    phone: phone || null,
    suburb: suburb || null,
    eventDate: event_date || null,
    eventTime: event_time || null,
    formType: form_type,
    bookedGame: game_title || null,
    message,
    source: form_type === 'game_booking' ? 'Game Page Booking' : form_type === 'chatbot_booking' ? 'AI Chatbot' : 'Website Form',
    requestId: data?.id || null,
  }).catch((err) => {
    console.error('[forms/submit] Email notification error:', err)
  })

  // Instant acknowledgement to the client (does not block the response)
  sendClientAcknowledgement({
    name,
    email,
    formType: form_type,
    eventDate: event_date || null,
    bookedGame: game_title || null,
    requestId: data?.id || null,
  }).catch((err) => {
    console.error('[forms/submit] Client acknowledgement error:', err)
  })

  // Schedule a follow-up so this enquiry can't be forgotten if not quoted
  if (data?.id) {
    scheduleRequestFollowUp({ id: data.id, name, email, phone: phone || null }).catch((err) => {
      console.error('[forms/submit] Follow-up scheduling error:', err)
    })
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
