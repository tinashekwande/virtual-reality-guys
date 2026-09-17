export interface NewLeadNotificationParams {
  name: string
  email: string
  phone?: string | null
  suburb?: string | null
  eventDate?: string | null
  formType: string
  message: string
  source: 'Website Form' | 'AI Chatbot'
  requestId?: string | null
}

/**
 * Format phone number for WhatsApp direct link
 */
function getWhatsAppLink(phone?: string | null): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!cleaned) return null
  let num = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned
  if (num.startsWith('0')) {
    num = '27' + num.substring(1)
  }
  return `https://wa.me/${num}`
}

/**
 * Format form type for user display
 */
function formatFormType(type: string): string {
  switch (type.toLowerCase()) {
    case 'birthday':
      return '🎂 Birthday Party'
    case 'corporate':
      return '💼 Corporate Event / Team Building'
    case 'school':
      return '🎓 School VR Demonstration'
    case 'rental':
    case 'rentals':
      return '🕶️ VR Equipment Rental'
    case 'chatbot_booking':
      return '🤖 AI Chatbot Booking'
    case 'contact':
      return '📩 General Contact Enquiry'
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

export function generateLeadEmailHtml(params: NewLeadNotificationParams): string {
  const { name, email, phone, suburb, eventDate, formType, message, source } = params
  const whatsappUrl = getWhatsAppLink(phone)
  const friendlyFormType = formatFormType(formType)
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/requests`
    : 'https://virtualrealityguyz.co.za/admin/requests'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New VR Guys Booking Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border-bottom: 2px solid #06b6d4;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: 9999px; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
                      ${source === 'AI Chatbot' ? '🤖 AI CHATBOT BOOKING' : '⚡ NEW WEBSITE REQUEST'}
                    </span>
                    <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      New Booking Enquiry Received
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                      Virtual Reality Guys — Cape Town Mobile VR
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Key Lead Details -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #334155;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Client Name</span>
                    <strong style="font-size: 16px; color: #ffffff;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #334155;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Event Type</span>
                    <strong style="font-size: 15px; color: #38bdf8;">${friendlyFormType}</strong>
                  </td>
                </tr>
                ${eventDate ? `
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #334155;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Requested Event Date</span>
                    <strong style="font-size: 15px; color: #facc15;">📅 ${eventDate}</strong>
                  </td>
                </tr>
                ` : ''}
                ${suburb ? `
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #334155;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Location / Suburb</span>
                    <strong style="font-size: 15px; color: #a78bfa;">📍 ${suburb}</strong>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #334155;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Email Address</span>
                    <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none; font-size: 14px; font-weight: 600;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 16px 20px;">
                    <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Phone / WhatsApp</span>
                    <div style="font-size: 14px;">
                      <a href="tel:${phone}" style="color: #ffffff; text-decoration: none; font-weight: 600; margin-right: 12px;">📞 ${phone}</a>
                      ${whatsappUrl ? `
                        <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 3px 10px; background-color: #22c55e; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700;">
                          💬 Open WhatsApp
                        </a>
                      ` : ''}
                    </div>
                  </td>
                </tr>
                ` : ''}
              </table>

              <!-- Customer Message / Inquiry Details -->
              <div style="background-color: #090d16; border-radius: 12px; padding: 20px; border: 1px solid #1e293b; margin-bottom: 28px;">
                <span style="font-size: 11px; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
                  Customer Message & Booking Details
                </span>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Quick Action Call to Action -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${adminUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                      Open Lead in Admin Portal 🚀
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                This automated alert was dispatched to <strong>virtualrealityguyz@gmail.com</strong> & <strong>ttynashy5@gmail.com</strong>
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Virtual Reality Guys • Cape Town, South Africa • <a href="https://virtualrealityguyz.co.za" style="color: #64748b; text-decoration: underline;">virtualrealityguyz.co.za</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function generateLeadEmailText(params: NewLeadNotificationParams): string {
  const { name, email, phone, suburb, eventDate, formType, message, source } = params
  const friendlyFormType = formatFormType(formType)

  return `
===================================================
🎮 NEW BOOKING ENQUIRY - VIRTUAL REALITY GUYS
===================================================
Source: ${source}
Client Name: ${name}
Event Type: ${friendlyFormType}
${eventDate ? `Requested Date: ${eventDate}\n` : ''}${suburb ? `Location / Suburb: ${suburb}\n` : ''}Email: ${email}
${phone ? `Phone / WhatsApp: ${phone}\n` : ''}
---------------------------------------------------
CUSTOMER MESSAGE & DETAILS:
---------------------------------------------------
${message}

---------------------------------------------------
Manage and generate quote in Admin Portal:
https://virtualrealityguyz.co.za/admin/requests
===================================================
`
}
