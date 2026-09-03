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

export interface CustomerMessageRecipient {
  name: string
  email?: string
  phone?: string
  event_date?: string
  package_name?: string
  amount_zar?: number
  outstanding_zar?: number
  doc_number?: string
  customer_message?: string
  event_type?: string
  missing_fields?: string[]
  player_count?: number
  location?: string
}

export interface GeneratedMessage {
  subject: string
  body_text: string
  whatsapp_url?: string
  recipient_phone?: string
  recipient_email?: string
}

/**
 * Generates uniquely tailored, intelligent customer messages for Email and WhatsApp
 * powered by Gemini AI, taking into account the lead's exact message, missing details,
 * and event context.
 */
export async function generateCustomerMessage(
  template: CommunicationTemplate,
  recipient: CustomerMessageRecipient
): Promise<GeneratedMessage> {
  const name = recipient.name || 'Valued Customer'
  const dateStr = recipient.event_date || 'your upcoming date'
  const pkg = recipient.package_name || 'Standard VR Package'
  const total = recipient.amount_zar ? `R${recipient.amount_zar.toLocaleString()}` : 'R899'
  const outstanding = recipient.outstanding_zar ? `R${recipient.outstanding_zar.toLocaleString()}` : total
  const docNum = recipient.doc_number || 'VRG-Q-2026'
  const rawMsg = recipient.customer_message?.trim() || ''
  const missing = recipient.missing_fields && recipient.missing_fields.length > 0 ? recipient.missing_fields : []

  // Default subject line mappings
  const subjectMap: Record<CommunicationTemplate, string> = {
    quote_delivery: `VR Experience Quotation (${docNum}) — Virtual Reality Guys`,
    deposit_request: `50% Deposit to Secure Booking (${docNum}) — Virtual Reality Guys`,
    booking_confirmation: `Booking Confirmed! 🎮 Virtual Reality Guys Event on ${dateStr}`,
    day_before_reminder: `Reminder: Your VR Experience is Tomorrow! 🕶️`,
    payment_reminder: `Payment Reminder: Outstanding Balance for ${dateStr} (${docNum})`,
    quote_followup: `Following up on your VR Guys Quote (${docNum})`,
    thank_you_review: `Thank you from Virtual Reality Guys! ⭐ Leave us a quick review`,
  }

  let subject = subjectMap[template] || 'Virtual Reality Guys Update'
  let body = ''

  // Attempt dynamic generation using Gemini
  try {
    const sysInstruction = await getMasterSystemInstruction()
    const prompt = `You are the lead event coordinator at Virtual Reality Guys in Cape Town.
Write a warm, engaging, highly intelligent, and uniquely personalized WhatsApp and Email communication to this client.

COMMUNICATION GOAL / TEMPLATE: ${template.replace(/_/g, ' ').toUpperCase()}

CLIENT & EVENT DETAILS:
- Client Name: ${name}
- Client Phone: ${recipient.phone || 'Not provided'}
- Client Email: ${recipient.email || 'Not provided'}
- Event Date: ${dateStr}
- Event Type: ${recipient.event_type || 'VR Event'}
- Location: ${recipient.location || 'Cape Town'}
- Recommended Package: ${pkg} (${total} Incl. 15% VAT)
- Outstanding Balance: ${outstanding}
- Quotation / Document Number: ${docNum}
- Customer's Original Enquiry: "${rawMsg || 'Inquiry about VR entertainment'}"
- Missing Information Required from Client: ${missing.length > 0 ? missing.join(', ') : 'None'}

BANKING DETAILS (FNB) IF RELEVANT (for deposit or payment reminders):
- Bank: First National Bank (FNB)
- Account Holder: Panashe Majinga
- Account Number: 63124445502
- Branch Code: 250655
- Reference: ${docNum} / ${name}

REQUIREMENTS:
1. Genuinely address what the client said in their enquiry. Acknowledge their event type, guest count, and specifics.
2. If there are missing details (like specific venue address, exact date/start time, player count/ages), politely and clearly list them as bullet points or numbered questions so we can finalize everything.
3. If giving a quote, state the package name (${pkg}) and price (${total} Incl. 15% VAT), and explain why it fits their group.
4. Keep the tone warm, modern, exciting, and professional (great for South African WhatsApp and email). Use tasteful emojis (🎮, 🕶️, 🚀, 👋).
5. Do NOT include markdown code blocks. Just provide the ready-to-send message text directly.
6. End with:
Best regards,
Virtual Reality Guys Team
📞 +27 71 780 0323
🌐 www.virtualrealityguyz.co.za`

    const aiText = await generateAiContent(prompt, {
      systemInstruction: sysInstruction,
      temperature: 0.3,
    })

    if (aiText && aiText.trim().length > 30) {
      body = aiText.trim()
    }
  } catch (err) {
    console.warn('[Followups Engine] AI message generation fallback:', err)
  }

  // Robust fallback if Gemini is unreachable
  if (!body) {
    const missingSection = missing.length > 0
      ? `\n\nTo make sure everything runs smoothly, could you please let us know:\n${missing.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
      : ''

    switch (template) {
      case 'quote_delivery':
        body = `Hi ${name} 👋\n\nThank you for reaching out to Virtual Reality Guys! We are excited to bring our mobile VR experience to your event.\n\n📋 **Customized Quotation:**\n- Package: ${pkg}\n- Total Investment: ${total} (Incl. 15% VAT)\n- Includes: VR Headsets, dedicated supervisors, and 60+ games.${missingSection}\n\nTo secure your booking date on our calendar, a 50% deposit is required. Please let us know if this looks good to you!\n\nBest regards,\n**Virtual Reality Guys Team**\n📞 +27 71 780 0323\n🌐 www.virtualrealityguyz.co.za`
        break

      case 'deposit_request':
        body = `Hi ${name} 👋\n\nWe have your VR booking scheduled for ${dateStr}! 🚀\n\nTo lock in your date on our calendar and reserve the VR headsets, please arrange the 50% deposit (${outstanding}).\n\n💳 **Banking Details:**\n- Bank: First National Bank (FNB)\n- Account Holder: Panashe Majinga\n- Account Number: 63124445502\n- Branch Code: 250655\n- Reference: ${docNum} / ${name}${missingSection}\n\nPlease share the proof of payment once processed. Thank you!`
        break

      case 'booking_confirmation':
        body = `Hi ${name} 🎉\n\nGreat news! Your mobile VR booking for **${dateStr}** is officially confirmed! Our team will arrive 30-45 minutes before start time to set up the equipment and calibrate the safety boundaries.\n\n📍 We look forward to delivering an unforgettable immersive experience!\n\nSee you soon,\n**Virtual Reality Guys Team**\n📞 +27 71 780 0323`
        break

      case 'day_before_reminder':
        body = `Hi ${name} 👋\n\nJust a friendly reminder that your Virtual Reality Guys event is tomorrow (${dateStr})! 🎮\n\n⚡ **Quick Setup Checklist:**\n- ~2m x 2m clear indoor/shaded space per headset\n- Standard 220V wall power outlet\n\nOur team is prepped and ready. Feel free to WhatsApp or call us at +27 71 780 0323 if you need anything before tomorrow!`
        break

      case 'payment_reminder':
        body = `Hi ${name} 👋\n\nWe hope you are looking forward to your upcoming event! This is a friendly reminder regarding the outstanding balance of **${outstanding}** for invoice #${docNum}.\n\n💳 **FNB Account Details:**\n- Account: 63124445502\n- Branch: 250655\n- Reference: ${docNum}\n\nPlease send us the POP at your earliest convenience. Thank you!`
        break

      case 'quote_followup':
        body = `Hi ${name} 👋\n\nJust checking in to see if you had any questions regarding the VR experience quote we sent for ${dateStr}?\n\nWe still have your requested date available, but calendar slots fill up quickly. Please let us know if you'd like us to hold the slot for you!${missingSection}\n\nWarm regards,\n**Virtual Reality Guys Team**\n📞 +27 71 780 0323`
        break

      case 'thank_you_review':
        body = `Hi ${name} 👋\n\nThank you so much for having Virtual Reality Guys at your event! We hope everyone had an incredible time in virtual reality.\n\nIf you enjoyed the experience, could you take 30 seconds to leave us a review? It means the world to our local Cape Town team!\n\n⭐ Review link: https://g.page/r/virtualrealityguys/review\n\nThank you again and see you at the next event!`
        break
    }
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
