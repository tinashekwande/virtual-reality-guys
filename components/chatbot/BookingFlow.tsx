'use client'

import type { BookingStep } from './chatbot-types'
import QuickReplies from './QuickReplies'

/**
 * Renders special UI for certain booking steps.
 * Currently only shows event-type quick-reply buttons.
 * For all other steps the user types in the main ChatInput.
 */
export default function BookingFlow({
  step,
  onSelect,
}: {
  step: BookingStep
  onSelect: (value: string) => void
}) {
  if (step === 'ask_event_type') {
    return <QuickReplies mode="event_type" onSelect={onSelect} />
  }
  return null
}
