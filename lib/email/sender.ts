import { Resend } from 'resend'
import nodemailer from 'nodemailer'

/**
 * Generic one-to-one email sender used by marketing campaigns that are sent
 * from the portal itself (rather than by Claude through Gmail).
 *
 * Uses Resend when RESEND_API_KEY is set, otherwise SMTP (e.g. Gmail with an
 * app password via SMTP_USER / SMTP_PASS or GMAIL_USER / GMAIL_APP_PASSWORD).
 */
export interface OutgoingEmail {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  headers?: Record<string, string>
}

export type EmailProvider = 'resend' | 'smtp'

export function getConfiguredEmailProvider(): EmailProvider | null {
  if (process.env.RESEND_API_KEY) return 'resend'
  if (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD) return 'smtp'
  return null
}

let cachedTransport: ReturnType<typeof nodemailer.createTransport> | null = null

function getSmtpTransport() {
  if (cachedTransport) return cachedTransport
  const port = Number(process.env.SMTP_PORT) || 465
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER || process.env.GMAIL_USER || 'virtualrealityguyz@gmail.com',
      pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD,
    },
  })
  return cachedTransport
}

export async function sendEmail(
  email: OutgoingEmail
): Promise<{ success: boolean; provider?: EmailProvider; id?: string; error?: string }> {
  const provider = getConfiguredEmailProvider()
  if (!provider) {
    return { success: false, error: 'No email provider configured (set RESEND_API_KEY or SMTP_PASS / GMAIL_APP_PASSWORD).' }
  }

  try {
    if (provider === 'resend') {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: process.env.MARKETING_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Virtual Reality Guys <bookings@virtualrealityguyz.co.za>',
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo: email.replyTo,
        headers: email.headers,
      })
      if (error) return { success: false, provider, error: error.message }
      return { success: true, provider, id: data?.id }
    }

    const user = process.env.SMTP_USER || process.env.GMAIL_USER || 'virtualrealityguyz@gmail.com'
    const info = await getSmtpTransport().sendMail({
      from: process.env.MARKETING_FROM_EMAIL || `"Virtual Reality Guys" <${user}>`,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: email.replyTo,
      headers: email.headers,
    })
    return { success: true, provider, id: info.messageId }
  } catch (err: any) {
    return { success: false, provider, error: err?.message || 'Email send failed' }
  }
}
