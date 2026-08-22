import { NextRequest, NextResponse } from 'next/server'
import {
  createMessage,
  sanitizeInput,
  getFAQResponse,
  getAIResponse,
  isBookingIntent,
  getBookingQuestion,
  getNextBookingStep,
  validateBookingInput,
  getBookingField,
  sendWhatsAppNotification,
  sendEmailNotification,
  trackAnalytics,
  FALLBACK_RESPONSE,
} from '@/components/chatbot/chatbot-logic'
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  Message,
  BookingData,
  BookingStep,
} from '@/components/chatbot/chatbot-types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages = [],
      bookingStep = 'idle',
      bookingData = {},
      userInput = '',
    } = body as {
      messages: Message[]
      bookingStep: BookingStep
      bookingData: Partial<BookingData>
      userInput: string
    }

    const clean = sanitizeInput(userInput)

    // --- Active Booking Flow ---
    if (bookingStep !== 'idle' && bookingStep !== 'complete') {
      // Check if user is asking a general question during booking (e.g. ends with ? or question words)
      const isQuestion = /[?]$/.test(clean) || /^(what|how|why|can|where|is|do|does|who|are)\b/i.test(clean)
      const validationError = validateBookingInput(bookingStep, clean)

      if (isQuestion || (validationError && clean.split(' ').length > 3)) {
        // User asked a question mid-booking — use Gemini to answer thoughtfully, then prompt for booking step
        const aiAnswer = await getAIResponse(messages)
        const currentQuestion = getBookingQuestion(bookingStep, bookingData)
        const combinedReply = `${aiAnswer}\n\n📍 *To continue your booking request:* ${currentQuestion}`

        return NextResponse.json({
          reply: createMessage('bot', combinedReply),
          bookingStep,
          bookingData,
        })
      }

      if (validationError) {
        return NextResponse.json({
          reply: createMessage('bot', validationError),
          bookingStep,
          bookingData,
        })
      }

      const field = getBookingField(bookingStep)
      const updatedData = field
        ? { ...bookingData, [field]: clean }
        : bookingData
      const nextStep = getNextBookingStep(bookingStep)
      const question = getBookingQuestion(nextStep, updatedData)

      // If booking is complete, persist to Supabase
      if (nextStep === 'complete') {
        await persistBooking(updatedData as BookingData)
        await trackAnalytics('booking_completed', updatedData)
      }

      return NextResponse.json({
        reply: createMessage('bot', question),
        bookingStep: nextStep,
        bookingData: updatedData,
      })
    }

    // --- Detect explicit booking intent ---
    if (isBookingIntent(clean)) {
      const nextStep: BookingStep = 'ask_name'
      const question = getBookingQuestion(nextStep, {})
      await trackAnalytics('booking_started')
      return NextResponse.json({
        reply: createMessage('bot', question),
        bookingStep: nextStep,
        bookingData: {},
      })
    }

    // --- Conversational Turn: Call Gemini AI Model ---
    const aiResponse = await getAIResponse(messages)
    return NextResponse.json({
      reply: createMessage('bot', aiResponse),
      bookingStep: 'idle',
      bookingData,
    })
  } catch (error) {
    console.error('[chat] Error:', error)
    return NextResponse.json(
      {
        reply: createMessage(
          'bot',
          'Sorry, something went wrong. Please try again or contact us directly at +27 71 780 0323.',
        ),
        bookingStep: 'idle',
        bookingData: {},
      },
      { status: 500 },
    )
  }
}

async function persistBooking(data: BookingData) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('form_requests').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: `[Chatbot Booking]\nEvent Type: ${data.eventType}\nDate: ${data.eventDate}\nLocation: ${data.location}\nAttendees: ${data.attendees}`,
      form_type: 'chatbot_booking',
      status: 'new',
    })
    if (error) console.error('[chat] Supabase insert error:', error)

    // Fire-and-forget notifications
    sendWhatsAppNotification(data).catch(() => {})
    sendEmailNotification(data).catch(() => {})
  } catch (err) {
    console.error('[chat] persistBooking error:', err)
  }
}
