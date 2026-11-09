/**
 * Client-facing email templates (sent TO the customer), as opposed to
 * lib/email/templates.ts which notifies the business owners about a new lead.
 */

const BRAND = {
  name: 'Virtual Reality Guys',
  phone: '+27 71 780 0323',
  email: 'bookings@virtualrealityguyz.co.za',
  site: 'https://virtualrealityguyz.co.za',
  accent: '#06b6d4',
  dark: '#0b0f19',
}

function firstName(name?: string | null) {
  return (name || '').trim().split(/\s+/)[0] || 'there'
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

/** Wraps body HTML in a branded, email-client-safe shell. */
export function brandedEmailShell(opts: { heading: string; bodyHtml: string; preheader?: string }): string {
  const { heading, bodyHtml, preheader } = opts
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
      <tr><td style="background:${BRAND.dark};padding:24px 28px">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:0.3px">🎮 ${BRAND.name}</p>
        <p style="margin:4px 0 0;color:${BRAND.accent};font-size:12px">Mobile VR experiences · Cape Town</p>
      </td></tr>
      <tr><td style="padding:28px">
        <h1 style="margin:0 0 16px;font-size:20px;color:#111827">${escapeHtml(heading)}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:20px 28px;background:#f9fafb;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6">
          <strong style="color:#111827">${BRAND.name}</strong><br>
          📞 <a href="https://wa.me/27717800323" style="color:${BRAND.accent};text-decoration:none">${BRAND.phone}</a> (call / WhatsApp)<br>
          ✉️ <a href="mailto:${BRAND.email}" style="color:${BRAND.accent};text-decoration:none">${BRAND.email}</a><br>
          🌐 <a href="${BRAND.site}" style="color:${BRAND.accent};text-decoration:none">virtualrealityguyz.co.za</a>
        </p>
      </td></tr>
    </table>
    <p style="max-width:560px;margin:16px auto 0;font-size:11px;color:#9ca3af;text-align:center">
      You're receiving this because you contacted ${BRAND.name}. This is a confirmation of your enquiry.
    </p>
  </td></tr>
</table>
</body></html>`
}

export interface AcknowledgementParams {
  name: string
  formType?: string | null
  eventDate?: string | null
  bookedGame?: string | null
}

function eventTypeLabel(type?: string | null): string {
  switch ((type || '').toLowerCase()) {
    case 'birthday': return 'birthday party'
    case 'corporate': return 'corporate event'
    case 'school': return 'school VR session'
    case 'rental':
    case 'rentals': return 'VR equipment rental'
    case 'festival': return 'festival / activation'
    case 'game_booking': return 'VR game booking'
    case 'chatbot_booking': return 'VR booking'
    default: return 'VR experience'
  }
}

/**
 * The automatic "we've got your enquiry" reply sent the moment someone submits
 * the website form or books through the chatbot.
 */
export function buildAcknowledgementEmail(params: AcknowledgementParams): { subject: string; html: string; text: string } {
  const fname = firstName(params.name)
  const what = eventTypeLabel(params.formType)
  const dateLine = params.eventDate ? ` for <strong>${escapeHtml(params.eventDate)}</strong>` : ''
  const gameLine = params.bookedGame ? ` (${escapeHtml(params.bookedGame)})` : ''

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#374151">Hi ${escapeHtml(fname)} 👋</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#374151">
      Thanks so much for reaching out to Virtual Reality Guys about your <strong>${what}</strong>${gameLine}${dateLine}!
      We've received your enquiry and a member of our team will get back to you shortly, usually within a few hours during business hours.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#374151">
      In the meantime, if your event is coming up soon or you'd like to chat straight away, the quickest way to reach us is on WhatsApp:
    </p>
    <p style="margin:0 0 20px">
      <a href="https://wa.me/27717800323" style="display:inline-block;background:${BRAND.accent};color:#04121a;font-weight:bold;font-size:15px;text-decoration:none;padding:12px 22px;border-radius:10px">💬 WhatsApp us</a>
    </p>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#374151"><strong>What happens next?</strong></p>
    <ul style="margin:0 0 14px;padding-left:20px;font-size:14px;line-height:1.7;color:#374151">
      <li>We'll confirm your date is available and recommend the best package for your group.</li>
      <li>We'll send you a quote — a 50% deposit secures your booking.</li>
      <li>On the day, we arrive 30–45 minutes early to set everything up. You just enjoy it!</li>
    </ul>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#374151">Talk soon,<br><strong>The Virtual Reality Guys team</strong></p>`

  const text = `Hi ${fname},

Thanks so much for reaching out to Virtual Reality Guys about your ${what}${params.eventDate ? ` for ${params.eventDate}` : ''}! We've received your enquiry and a member of our team will get back to you shortly — usually within a few hours during business hours.

Need us sooner? WhatsApp or call ${BRAND.phone}.

What happens next:
1. We'll confirm your date is available and recommend the best package for your group.
2. We'll send you a quote — a 50% deposit secures your booking.
3. On the day, we arrive 30-45 minutes early to set up. You just enjoy it!

Talk soon,
The Virtual Reality Guys team
${BRAND.phone} (call / WhatsApp)
${BRAND.site}`

  return {
    subject: `We've got your enquiry, ${fname}! 🎮 — Virtual Reality Guys`,
    html: brandedEmailShell({
      heading: 'Thanks for getting in touch! 🎮',
      bodyHtml,
      preheader: "We've received your enquiry — here's what happens next.",
    }),
    text,
  }
}
