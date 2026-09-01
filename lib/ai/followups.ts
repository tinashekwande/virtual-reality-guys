import { Invoice, FormRequest } from '@/types'
import { generateAiContent } from './client'
import { getMasterSystemInstruction } from './context'

export type CommunicationTemplate =
  | 'quote_delivery'
  | 'deposit_request'
  | 'booking_confirmation'
  | 'day_before_reminder'
  | 'payment_reminder'
  | 'quote_followup'
  | 'thank_you_review'

export interface GeneratedMessage {
  subject: string
  body_text: string
  whatsapp_url?: string
  recipient_phone?: string
  recipient_email?: string
}

/**
 * Generates personalized customer messages for Email and WhatsApp.
 */
export async function generateCustomerMessage(
  template: CommunicationTemplate,
  recipient: {
    name: string
    email?: string
    phone?: string
    event_date?: string
    package_name?: string
    amount_zar?: number
    outstanding_zar?: number
    doc_number?: string
  }
): Promise<GeneratedMessage> {
  const name = recipient.name || 'Valued Customer'
  const dateStr = recipient.event_date || 'your upcoming date'
  const pkg = recipient.package_name || 'Standard VR Package'
  const total = recipient.amount_zar ? `R${recipient.amount_zar.toLocaleString()}` : 'R899'
  const outstanding = recipient.outstanding_zar ? `R${recipient.outstanding_zar.toLocaleString()}` : total
  const docNum = recipient.doc_number || 'VRG-Q-2026'

  let subject = 'Virtual Reality Guys Update'
  let body = ''

  switch (template) {
    case 'quote_delivery':
      subject = `VR Experience Quotation (${docNum}) — Virtual Reality Guys`
      body = `Hi ${name} 👋\n\nThank you for considering Virtual Reality Guys! We are excited to present your customized quotation for ${dateStr}.\n\n📋 **Quote Summary:**\n- Package: ${pkg}\n- Total Investment: ${total} (Incl. 15% VAT)\n- Includes: VR Headsets, dedicated supervisors, and 60+ games.\n\nTo secure your booking date, a 50% deposit is required. Please let us know if you have any questions or if you would like us to confirm this date for you!\n\nBest regards,\n**Virtual Reality Guys Team**\n📞 +27 71 780 0323\n🌐 www.virtualrealityguyz.co.za`
      break

    case 'deposit_request':
      subject = `50% Deposit to Secure Booking (${docNum}) — Virtual Reality Guys`
      body = `Hi ${name} 👋\n\nWe have your VR booking scheduled for ${dateStr}! 🚀\n\nTo lock in your date on our calendar and reserve the VR headsets, please arrange the 50% deposit (${outstanding}).\n\n💳 **Banking Details:**\n- Bank: First National Bank (FNB)\n- Account Holder: Panashe Majinga\n- Account Number: 63124445502\n- Branch Code: 250655\n- Reference: ${docNum} / ${name}\n\nPlease share the proof of payment once processed. Thank you!`
      break

    case 'booking_confirmation':
      subject = `Booking Confirmed! 🎮 Virtual Reality Guys Event on ${dateStr}`
      body = `Hi ${name} 🎉\n\nGreat news! Your mobile VR booking for **${dateStr}** is officially confirmed! Our team will arrive 30-45 minutes before start time to set up the equipment and calibrate the safety boundaries.\n\n📍 We look forward to delivering an unforgettable immersive experience!\n\nSee you soon,\n**Virtual Reality Guys**`
      break

    case 'day_before_reminder':
      subject = `Reminder: Your VR Experience is Tomorrow! 🕶️`
      body = `Hi ${name} 👋\n\nJust a friendly reminder that your Virtual Reality Guys event is tomorrow (${dateStr})! 🎮\n\n⚡ **Quick Checklist for Setup:**\n- ~2m x 2m clear indoor/shaded space per headset\n- Standard 220V wall power outlet\n\nOur team is all prepped and ready. Feel free to WhatsApp or call us at +27 71 780 0323 if you need anything before tomorrow!`
      break

    case 'payment_reminder':
      subject = `Payment Reminder: Outstanding Balance for ${dateStr} (${docNum})`
      body = `Hi ${name} 👋\n\nWe hope you are looking forward to your upcoming event! This is a friendly reminder regarding the outstanding balance of **${outstanding}** for invoice #${docNum}.\n\n💳 **FNB Account Details:**\n- Account: 63124445502\n- Branch: 250655\n- Reference: ${docNum}\n\nPlease send us the POP at your earliest convenience. Thank you!`
      break

    case 'quote_followup':
      subject = `Following up on your VR Guys Quote (${docNum})`
      body = `Hi ${name} 👋\n\nJust checking in to see if you had any questions regarding the VR experience quote we sent for ${dateStr}?\n\nWe still have your requested date available, but dates fill up quickly. Please let us know if you'd like us to hold the slot for you!\n\nWarm regards,\n**Virtual Reality Guys**`
      break

    case 'thank_you_review':
      subject = `Thank you from Virtual Reality Guys! ⭐ Leave us a quick review`
      body = `Hi ${name} 👋\n\nThank you so much for having Virtual Reality Guys at your event! We hope everyone had an incredible time in virtual reality.\n\nIf you enjoyed the experience, could you take 30 seconds to leave us a review? It means the world to our local Cape Town team!\n\n⭐ Review link: https://g.page/r/virtualrealityguys/review\n\nThank you again and see you at the next event!`
      break
  }

  // Format WhatsApp URL if phone is present
  let whatsappUrl: string | undefined = undefined
  if (recipient.phone) {
    const cleanPhone = recipient.phone.replace(/[^0-9]/g, '')
    const saPhone = cleanPhone.startsWith('0') ? `27${cleanPhone.slice(1)}` : cleanPhone
    whatsappUrl = `https://wa.me/${saPhone}?text=${encodeURIComponent(body)}`
  }

  return {
    subject,
    body_text: body,
    whatsapp_url: whatsappUrl,
    recipient_phone: recipient.phone,
    recipient_email: recipient.email,
  }
}
