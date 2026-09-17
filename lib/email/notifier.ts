import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import {
  generateLeadEmailHtml,
  generateLeadEmailText,
  NewLeadNotificationParams,
} from './templates'

export const NOTIFICATION_RECIPIENTS = [
  'virtualrealityguyz@gmail.com',
  'ttynashy5@gmail.com',
]

// In-memory cache to prevent duplicate notifications within 30 seconds (e.g. client + server chatbot dispatch)
const recentDispatches = new Map<string, number>()

/**
 * Sends notification emails to the designated business email addresses
 * whenever a new lead, form submission, or chatbot booking occurs.
 *
 * Supports Resend (primary) or Nodemailer/Gmail SMTP (fallback).
 */
export async function sendNewLeadNotification(params: NewLeadNotificationParams): Promise<{
  success: boolean
  provider?: 'resend' | 'smtp' | 'none'
  error?: string
}> {
  const dedupKey = `${(params.email || '').toLowerCase().trim()}_${(params.name || '').toLowerCase().trim()}`
  const now = Date.now()
  const lastSent = recentDispatches.get(dedupKey)
  if (lastSent && now - lastSent < 30000) {
    console.log(`[Email Notifier] Skipping duplicate notification for ${dedupKey} (already dispatched ${Math.round((now - lastSent) / 1000)}s ago)`)
    return { success: true }
  }
  recentDispatches.set(dedupKey, now)

  // Clean old entries
  if (recentDispatches.size > 100) {
    for (const [k, time] of recentDispatches.entries()) {
      if (now - time > 60000) recentDispatches.delete(k)
    }
  }

  const recipients = NOTIFICATION_RECIPIENTS
  const subject = `🎮 New VR Booking Enquiry: ${params.name} (${params.source})`
  const html = generateLeadEmailHtml(params)
  const text = generateLeadEmailText(params)

  // 1. Try Resend if API key is provided
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey)
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Virtual Reality Guys <onboarding@resend.dev>'

      // Attempt batch delivery first
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: recipients,
        replyTo: params.email,
        subject,
        html,
        text,
      })

      if (error) {
        // If Resend is in free testing mode with onboarding@resend.dev, it only permits sending to the account owner
        if (error.message?.includes('only send testing emails') || (error as any).statusCode === 403) {
          console.warn('[Email Notifier] Notice: Resend is using onboarding@resend.dev. Delivering individually to authorized account...')
          let sentAny = false
          for (const recipient of recipients) {
            const singleRes = await resend.emails.send({
              from: fromEmail,
              to: recipient,
              replyTo: params.email,
              subject,
              html,
              text,
            })
            if (!singleRes.error) {
              console.log(`[Email Notifier] Delivered to ${recipient} (ID: ${singleRes.data?.id})`)
              sentAny = true
            }
          }
          if (sentAny) {
            return { success: true, provider: 'resend' }
          }
        }
        console.error('[Email Notifier] Resend delivery error:', error)
        // Fall through to SMTP if available
      } else {
        console.log(`[Email Notifier] Email delivered via Resend to ${recipients.join(', ')} (ID: ${data?.id})`)
        return { success: true, provider: 'resend' }
      }
    } catch (err: any) {
      console.error('[Email Notifier] Resend exception:', err?.message || err)
    }
  }

  // 2. Try Nodemailer SMTP (Gmail or custom SMTP)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'virtualrealityguyz@gmail.com'
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD

  if (smtpPass) {
    try {
      const host = process.env.SMTP_HOST || 'smtp.gmail.com'
      const port = Number(process.env.SMTP_PORT) || 465
      const secure = port === 465

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const info = await transporter.sendMail({
        from: `"Virtual Reality Guys Notifications" <${smtpUser}>`,
        to: recipients.join(', '),
        replyTo: params.email,
        subject,
        html,
        text,
      })

      console.log(`[Email Notifier] Email delivered via SMTP to ${recipients.join(', ')} (MessageId: ${info.messageId})`)
      return { success: true, provider: 'smtp' }
    } catch (err: any) {
      console.error('[Email Notifier] SMTP delivery exception:', err?.message || err)
      return { success: false, provider: 'smtp', error: err?.message || 'SMTP failed' }
    }
  }

  // 3. Neither email provider configured yet
  console.warn(
    `[Email Notifier] ⚠️ No email service credentials configured! New enquiry from "${params.name}" (${params.email}) logged. To enable automated email delivery to ${recipients.join(', ')}, add RESEND_API_KEY or GMAIL_APP_PASSWORD to your .env.local file.`
  )
  return {
    success: false,
    provider: 'none',
    error: 'No email credentials (RESEND_API_KEY or GMAIL_APP_PASSWORD) configured.',
  }
}
