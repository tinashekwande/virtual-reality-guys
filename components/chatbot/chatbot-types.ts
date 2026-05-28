export type MessageRole = 'bot' | 'user'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface BookingData {
  name: string
  eventType: string
  eventDate: string
  location: string
  attendees: string
  phone: string
  email: string
}

export type BookingStep =
  | 'idle'
  | 'ask_name'
  | 'ask_event_type'
  | 'ask_date'
  | 'ask_location'
  | 'ask_attendees'
  | 'ask_phone'
  | 'ask_email'
  | 'complete'

export interface ChatSession {
  messages: Message[]
  bookingStep: BookingStep
  bookingData: Partial<BookingData>
}

export const QUICK_REPLIES = [
  'Book an Event',
  'Request a Quote',
  'School VR Demo',
  'Corporate Events',
  'VR Rentals',
  'Contact Support',
] as const

export type QuickReply = (typeof QUICK_REPLIES)[number]

export const EVENT_TYPES = [
  'Birthday Party',
  'Corporate Event',
  'School Demo',
  'Team Building',
  'Expo / Activation',
  'VR Rental',
  'Other',
] as const

export type EventType = (typeof EVENT_TYPES)[number]
