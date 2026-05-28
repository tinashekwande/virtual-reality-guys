'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from 'react'
import { MessageCircle, X, Volume2, VolumeX } from 'lucide-react'
import type { Message, BookingStep, BookingData } from './chatbot-types'
import {
  createMessage,
  sanitizeInput,
  getFAQResponse,
  isBookingIntent,
  handleQuickReply,
  getBookingQuestion,
  getNextBookingStep,
  getBookingField,
  validateBookingInput,
  FALLBACK_RESPONSE,
} from './chatbot-logic'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import QuickReplies from './QuickReplies'
import BookingFlow from './BookingFlow'

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'vrguyz-chat-session'
const TYPING_DELAY = 800
const WELCOME_TEXT =
  'Hi 👋 Welcome to Virtual Reality Guyz! How can we help you today?'

// ─── Session Persistence ──────────────────────────────────────────────────────
interface PersistedSession {
  messages: Message[]
  bookingStep: BookingStep
  bookingData: Partial<BookingData>
}

function loadSession(): PersistedSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedSession
  } catch {
    return null
  }
}

function saveSession(session: PersistedSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // quota exceeded — silently ignore
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [bookingStep, setBookingStep] = useState<BookingStep>('idle')
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({})
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [hasOpened, setHasOpened] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ── Hydrate from sessionStorage ───────────────────────────────────────────
  useEffect(() => {
    const saved = loadSession()
    if (saved && saved.messages.length > 0) {
      setMessages(saved.messages)
      setBookingStep(saved.bookingStep)
      setBookingData(saved.bookingData)
      setShowQuickReplies(false)
      setHasOpened(true)
    }
  }, [])

  // ── Persist to sessionStorage ─────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      saveSession({ messages, bookingStep, bookingData })
    }
  }, [messages, bookingStep, bookingData])

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // ── Sound ─────────────────────────────────────────────────────────────────
  const playNotification = useCallback(() => {
    if (isMuted) return
    try {
      if (!audioRef.current) {
        // Create a short beep using Web Audio API
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 880
        gain.gain.value = 0.1
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      }
    } catch {
      // Audio not available
    }
  }, [isMuted])

  // ── Add bot message with typing delay ─────────────────────────────────────
  const addBotMessage = useCallback(
    (content: string) => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [...prev, createMessage('bot', content)])
        playNotification()
      }, TYPING_DELAY)
    },
    [playNotification],
  )

  // ── Open chat ─────────────────────────────────────────────────────────────
  const openChat = useCallback(() => {
    setIsOpen(true)
    if (!hasOpened) {
      setHasOpened(true)
      // Add welcome message after a short delay
      setTimeout(() => {
        setMessages([createMessage('bot', WELCOME_TEXT)])
      }, 300)
    }
  }, [hasOpened])

  // ── Submit booking to API ─────────────────────────────────────────────────
  const submitBooking = useCallback(async (data: BookingData) => {
    try {
      await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `[Chatbot Booking]\nEvent Type: ${data.eventType}\nDate: ${data.eventDate}\nLocation: ${data.location}\nAttendees: ${data.attendees}`,
          form_type: 'chatbot_booking',
        }),
      })
    } catch (err) {
      console.error('[chatbot] Failed to submit booking:', err)
    }
  }, [])

  // ── Handle booking step answer ────────────────────────────────────────────
  const handleBookingAnswer = useCallback(
    (input: string) => {
      const clean = sanitizeInput(input)
      const error = validateBookingInput(bookingStep, clean)
      if (error) {
        addBotMessage(error)
        return
      }

      const field = getBookingField(bookingStep)
      const newData = field ? { ...bookingData, [field]: clean } : bookingData
      const nextStep = getNextBookingStep(bookingStep)

      setBookingData(newData)
      setBookingStep(nextStep)

      const question = getBookingQuestion(nextStep, newData)
      addBotMessage(question)

      if (nextStep === 'complete') {
        submitBooking(newData as BookingData)
        // Reset after showing confirmation
        setTimeout(() => {
          setBookingStep('idle')
          setBookingData({})
          setShowQuickReplies(true)
        }, 2000)
      }
    },
    [bookingStep, bookingData, addBotMessage, submitBooking],
  )

  // ── Send user message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string) => {
      const clean = sanitizeInput(text)
      if (!clean) return

      setMessages((prev) => [...prev, createMessage('user', clean)])
      setShowQuickReplies(false)

      // In booking flow — treat as booking answer
      if (bookingStep !== 'idle' && bookingStep !== 'complete') {
        handleBookingAnswer(clean)
        return
      }

      // Check for booking intent
      if (isBookingIntent(clean)) {
        const step: BookingStep = 'ask_name'
        setBookingStep(step)
        addBotMessage(getBookingQuestion(step, {}))
        return
      }

      // FAQ matching
      const faqAnswer = getFAQResponse(clean)
      addBotMessage(faqAnswer ?? FALLBACK_RESPONSE)
    },
    [bookingStep, handleBookingAnswer, addBotMessage],
  )

  // ── Handle quick reply ────────────────────────────────────────────────────
  const handleQuickReplyClick = useCallback(
    (reply: string) => {
      setMessages((prev) => [...prev, createMessage('user', reply)])
      setShowQuickReplies(false)

      const result = handleQuickReply(reply)
      if (result.triggerBooking) {
        const step: BookingStep = 'ask_name'
        setBookingStep(step)
        addBotMessage(getBookingQuestion(step, {}))
      } else {
        addBotMessage(result.response)
      }
    },
    [addBotMessage],
  )

  // ── Handle event type selection (booking) ─────────────────────────────────
  const handleEventTypeSelect = useCallback(
    (type: string) => {
      setMessages((prev) => [...prev, createMessage('user', type)])
      const newData = { ...bookingData, eventType: type }
      const nextStep = getNextBookingStep(bookingStep)
      setBookingData(newData)
      setBookingStep(nextStep)
      addBotMessage(getBookingQuestion(nextStep, newData))
    },
    [bookingData, bookingStep, addBotMessage],
  )

  // ── Input placeholder ─────────────────────────────────────────────────────
  const inputPlaceholder = useMemo(() => {
    if (bookingStep === 'ask_event_type') return 'Select an event type above...'
    if (bookingStep === 'ask_name') return 'Enter your name...'
    if (bookingStep === 'ask_date') return 'e.g. 15 June 2025'
    if (bookingStep === 'ask_location') return 'Enter event location...'
    if (bookingStep === 'ask_attendees') return 'Number of attendees...'
    if (bookingStep === 'ask_phone') return 'e.g. +27 71 780 0323'
    if (bookingStep === 'ask_email') return 'e.g. name@example.com'
    return 'Type a message...'
  }, [bookingStep])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── FAB Button ── */}
      {!isOpen && (
        <button
          onClick={openChat}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95 animate-[chatbot-pulse-glow_2s_ease-in-out_infinite] md:bottom-8 md:right-8 md:h-16 md:w-16"
        >
          <MessageCircle size={24} className="md:hidden" />
          <MessageCircle size={28} className="hidden md:block" />
        </button>
      )}

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end md:inset-auto md:bottom-8 md:right-8"
          role="dialog"
          aria-label="Customer support chat"
        >
          {/* Mobile backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative flex h-full w-full flex-col overflow-hidden border border-white/[0.1] bg-black/90 backdrop-blur-xl animate-[chatbot-slide-up_0.3s_ease-out] md:h-[550px] md:w-[400px] md:rounded-2xl md:shadow-2xl md:shadow-cyan-500/10">
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5h-13A6.5 6.5 0 0 0 12 18.5Z" />
                    <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Virtual Reality Guyz
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-gray-400">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Unmute notifications' : 'Mute notifications'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain py-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isTyping && <TypingIndicator />}

              {/* Quick replies — shown after welcome */}
              {showQuickReplies &&
                messages.length > 0 &&
                !isTyping &&
                bookingStep === 'idle' && (
                  <QuickReplies
                    mode="default"
                    onSelect={handleQuickReplyClick}
                  />
                )}

              {/* Booking: event type selector */}
              {bookingStep === 'ask_event_type' && !isTyping && (
                <BookingFlow
                  step={bookingStep}
                  onSelect={handleEventTypeSelect}
                />
              )}
            </div>

            {/* ── Input ── */}
            <ChatInput
              onSend={sendMessage}
              disabled={isTyping || bookingStep === 'ask_event_type'}
              placeholder={inputPlaceholder}
            />
          </div>
        </div>
      )}
    </>
  )
}
