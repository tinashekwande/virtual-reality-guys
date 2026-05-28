import type { Message, BookingData, BookingStep } from './chatbot-types'
import { GoogleGenAI } from '@google/genai'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function createMessage(role: 'bot' | 'user', content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, 500)
}

// ---------------------------------------------------------------------------
// FAQ Pattern Matching
// ---------------------------------------------------------------------------

interface PatternResponse {
  patterns: RegExp[]
  response: string
}

const FAQ_RESPONSES: PatternResponse[] = [
  {
    patterns: [
      /\bpric/i, /\bcost/i, /\bhow much/i, /\brate/i,
      /\bfee/i, /\bcharge/i, /\bbudget/i, /\bafford/i,
    ],
    response:
      'Pricing depends on the type of event, location, duration, and setup requirements. We can provide a custom quotation based on your needs. Would you like to request a quote?',
  },
  {
    patterns: [
      /\bwhat is vr\b/i, /\bwhat's vr\b/i, /\bexplain vr\b/i,
      /\bvirtual reality\b.*\bwhat\b/i, /\bdefine vr\b/i,
    ],
    response:
      'Virtual Reality (VR) is an immersive digital experience that allows users to interact with virtual environments using VR headsets and motion tracking technology. It\'s like stepping into another world! \uD83C\uDF10',
  },
  {
    patterns: [/\bschool/i, /\beducat/i, /\blearn/i, /\bstudent/i, /\bteacher/i, /\bclassroom/i],
    response:
      'We provide immersive VR demonstrations and educational experiences for schools and learning institutions. Our school demos are a huge hit with students! \uD83C\uDF93 Would you like to book a school VR demo?',
  },
  {
    patterns: [
      /\bcorporat/i, /\bteam.?build/i, /\bcompany/i,
      /\boffice/i, /\bstaff/i, /\bbusiness/i,
    ],
    response:
      'We offer VR experiences for activations, expos, team building, and corporate entertainment. It\'s a great way to bring your team together! \uD83C\uDFE2 Want to learn more or book a corporate event?',
  },
  {
    patterns: [/\brental/i, /\brent/i, /\bhire/i, /\bloan/i],
    response:
      'We offer VR equipment rentals for events and occasions. You can rent our full VR setup with equipment and support. Would you like to get a rental quote?',
  },
  {
    patterns: [/\bbirthday/i, /\bparty/i, /\bcelebrat/i, /\bkids/i, /\bchild/i],
    response:
      'VR birthday parties are an unforgettable experience! We bring the VR setup directly to your venue. Kids and adults alike love it! \uD83C\uDF82 Would you like to book a VR party?',
  },
  {
    patterns: [/\bexpo/i, /\bactivation/i, /\bbrand/i, /\bfestival/i, /\bexhibit/i],
    response:
      'We provide VR experiences for expos, brand activations, and festivals. Our immersive setups create memorable brand experiences that attendees love! \u2728 Want to discuss an activation?',
  },
  {
    patterns: [/\blocation/i, /\bwhere/i, /\bcape.?town/i, /\barea/i, /\btravel/i],
    response:
      'We\'re based in Cape Town, South Africa, and we bring the VR experience directly to your venue! We\'re mobile, so we can set up anywhere in the Cape Town area. \uD83D\uDCCD',
  },
  {
    patterns: [
      /\bcontact/i, /\bphone/i, /\bcall/i, /\bemail/i,
      /\breach/i, /\bwhatsapp/i, /\bnumber/i,
    ],
    response:
      'You can reach us at:\n\uD83D\uDCDE +27 71 780 0323\n\u2709\uFE0F virtualrealityguyz@gmail.com\n\uD83D\uDCCD Cape Town, South Africa\n\nOr just tell me what you need and I\'ll help you get started!',
  },
  {
    patterns: [
      /\bhello/i, /\bhi\b/i, /\bhey/i,
      /\bgood\s*(morning|afternoon|evening|day)/i, /\bhowzit/i,
    ],
    response:
      'Hey there! \uD83D\uDC4B Great to have you here. How can I help you today? Feel free to ask about our VR experiences or use the quick options below!',
  },
  {
    patterns: [/\bthank/i, /\bthanks/i, /\bappreciate/i, /\bcheers/i],
    response:
      'You\'re welcome! \uD83D\uDE0A If you have any more questions or want to book an experience, I\'m right here. Have an amazing day!',
  },
  {
    patterns: [/\bhelp/i, /\bsupport/i, /\bassist/i, /\bquestion/i],
    response:
      'I\'m here to help! You can ask me about:\n\u2022 Our VR experiences and services\n\u2022 Booking an event\n\u2022 Pricing and quotes\n\u2022 School demos\n\u2022 Corporate events\n\u2022 Equipment rentals\n\nWhat would you like to know more about?',
  },
]

export const FALLBACK_RESPONSE =
  'I\'d be happy to help! Could you tell me a little more about what you\'re looking for? You can also use the quick actions to explore our services.'

export function getFAQResponse(text: string): string | null {
  for (const faq of FAQ_RESPONSES) {
    if (faq.patterns.some((p) => p.test(text))) return faq.response
  }
  return null
}

// ---------------------------------------------------------------------------
// Booking Intent Detection
// ---------------------------------------------------------------------------

export function isBookingIntent(text: string): boolean {
  return [
    /\bbook/i, /\breserv/i, /\bschedul/i, /\barrang/i,
    /\bquote/i, /\brequest.*quote/i,
  ].some((p) => p.test(text))
}

// ---------------------------------------------------------------------------
// Booking State Machine
// ---------------------------------------------------------------------------

const BOOKING_STEPS: BookingStep[] = [
  'idle',
  'ask_name',
  'ask_event_type',
  'ask_date',
  'ask_location',
  'ask_attendees',
  'ask_phone',
  'ask_email',
  'complete',
]

export function getNextBookingStep(current: BookingStep): BookingStep {
  const idx = BOOKING_STEPS.indexOf(current)
  return BOOKING_STEPS[Math.min(idx + 1, BOOKING_STEPS.length - 1)]
}

export function getBookingField(step: BookingStep): keyof BookingData | null {
  const map: Partial<Record<BookingStep, keyof BookingData>> = {
    ask_name: 'name',
    ask_event_type: 'eventType',
    ask_date: 'eventDate',
    ask_location: 'location',
    ask_attendees: 'attendees',
    ask_phone: 'phone',
    ask_email: 'email',
  }
  return map[step] ?? null
}

export function getBookingQuestion(
  step: BookingStep,
  data: Partial<BookingData>,
): string {
  switch (step) {
    case 'ask_name':
      return 'I\'d love to help you with that! Let\'s start \u2014 what\'s your name?'
    case 'ask_event_type':
      return `Nice to meet you, ${data.name}! \uD83C\uDF89 What type of event are you planning?`
    case 'ask_date':
      return 'When is your event? (e.g., 15 June 2025)'
    case 'ask_location':
      return 'Where will the event be held? \uD83D\uDCCD'
    case 'ask_attendees':
      return 'How many attendees are you expecting?'
    case 'ask_phone':
      return 'What\'s the best phone number to reach you? \uD83D\uDCDE'
    case 'ask_email':
      return 'And lastly, what\'s your email address? \u2709\uFE0F'
    case 'complete':
      return getBookingConfirmation(data as BookingData)
    default:
      return ''
  }
}

function getBookingConfirmation(d: BookingData): string {
  return [
    `Thank you, ${d.name}! Here's a summary of your request:`,
    '',
    `\uD83D\uDCCB Event Type: ${d.eventType}`,
    `\uD83D\uDCC5 Date: ${d.eventDate}`,
    `\uD83D\uDCCD Location: ${d.location}`,
    `\uD83D\uDC65 Attendees: ${d.attendees}`,
    `\uD83D\uDCDE Phone: ${d.phone}`,
    `\u2709\uFE0F Email: ${d.email}`,
    '',
    'A member of the Virtual Reality Guyz team will contact you shortly. We can\'t wait to make your event unforgettable! \uD83C\uDFAE\u2728',
  ].join('\n')
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateBookingInput(
  step: BookingStep,
  value: string,
): string | null {
  const v = value.trim()
  if (!v) return 'Please provide a valid response.'

  switch (step) {
    case 'ask_name':
      if (v.length < 2) return 'Please enter your full name.'
      break
    case 'ask_email': {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return 'Please enter a valid email address (e.g. name@example.com).'
      break
    }
    case 'ask_phone': {
      if (!/^[\d\s+\-()]{7,20}$/.test(v))
        return 'Please enter a valid phone number.'
      break
    }
    case 'ask_attendees': {
      if (!/^\d+/.test(v)) return 'Please enter a number.'
      break
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Quick Reply Handler
// ---------------------------------------------------------------------------

export function handleQuickReply(
  reply: string,
): { response: string; triggerBooking: boolean } {
  switch (reply) {
    case 'Book an Event':
    case 'Request a Quote':
      return { response: '', triggerBooking: true }
    case 'School VR Demo':
      return {
        response:
          'We provide immersive VR demonstrations and educational experiences for schools and learning institutions. Our school demos are a huge hit with students! \uD83C\uDF93 Would you like to book a school VR demo?',
        triggerBooking: false,
      }
    case 'Corporate Events':
      return {
        response:
          'We offer VR experiences for activations, expos, team building, and corporate entertainment. It\'s a great way to bring your team together! \uD83C\uDFE2 Want to learn more or book a corporate event?',
        triggerBooking: false,
      }
    case 'VR Rentals':
      return {
        response:
          'We offer VR equipment rentals for events and occasions. You can rent our full VR setup with equipment and support. Would you like to get a rental quote?',
        triggerBooking: false,
      }
    case 'Contact Support':
      return {
        response:
          'You can reach us at:\n\uD83D\uDCDE +27 71 780 0323\n\u2709\uFE0F virtualrealityguyz@gmail.com\n\uD83D\uDCCD Cape Town, South Africa\n\nOr just tell me what you need and I\'ll help!',
        triggerBooking: false,
      }
    default:
      return { response: FALLBACK_RESPONSE, triggerBooking: false }
  }
}

// ---------------------------------------------------------------------------
// AI Integration Placeholder
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTION = `You are a professional, friendly, and enthusiastic customer support chatbot for Virtual Reality Guyz, a virtual reality experiences and technology company.

About Virtual Reality Guyz:
- Website: https://www.virtualrealityguyz.co.za
- Location: Cape Town, South Africa. We are fully mobile and bring the entire VR setup directly to the client's venue (we serve Cape Town and surrounding areas).
- Contact details:
  - Phone: +27 71 780 0323
  - Email: virtualrealityguyz@gmail.com
- Services offered:
  - VR Gaming Experiences
  - School VR Demonstrations
  - Educational VR Experiences
  - Corporate Activations & Events
  - Team Building Activities
  - Birthday Parties
  - VR rentals (equipment and on-site support)
  - Expo & Brand Activations
  - Immersive Technology Experiences

Behavioral Guidelines:
1. Tone: Enthusiastic about VR, friendly, professional, futuristic, and helpful. Keep responses concise and engaging (aim for 2-3 sentences max).
2. Lead Generation & Bookings: Always guide users toward booking or requesting a quote. Instruct them that they can start a booking at any time by typing "book" or clicking the "Book an Event" or "Request a Quote" quick action buttons in the chat.
3. Pricing: Always state that pricing depends on the event duration, location, and specific setup requirements, and that we provide customized quotes. Offer to help them request a quote by booking in the chat.
4. Accuracy: Do not promise services, hardware, or locations we do not offer. Be honest and clear.`

export async function getAIResponse(messages: Message[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Graceful fallback to keyword matching when API key is not configured
    const last = [...messages].reverse().find((m) => m.role === 'user')
    if (!last) return FALLBACK_RESPONSE
    return getFAQResponse(last.content) ?? FALLBACK_RESPONSE
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    // Map chat history to Gemini expected roles: 'user' or 'model'
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    })

    return response.text ?? FALLBACK_RESPONSE
  } catch (error) {
    console.error('Gemini API Error:', error)
    // Graceful fallback to keyword matching on network or API failures
    const last = [...messages].reverse().find((m) => m.role === 'user')
    if (!last) return FALLBACK_RESPONSE
    return getFAQResponse(last.content) ?? FALLBACK_RESPONSE
  }
}

// ---------------------------------------------------------------------------
// Notification Placeholders
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function sendWhatsAppNotification(_data: BookingData) {
  // TODO: integrate WhatsApp Business API
}

export async function sendEmailNotification(_data: BookingData) {
  // TODO: integrate email service (Resend / SendGrid / Nodemailer)
}

export async function trackAnalytics(_event: string, _meta?: Record<string, unknown>) {
  // TODO: integrate analytics (Mixpanel / PostHog / GA)
}
/* eslint-enable @typescript-eslint/no-unused-vars */
