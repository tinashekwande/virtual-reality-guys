'use client'

import { QUICK_REPLIES, EVENT_TYPES } from './chatbot-types'
import type { BookingStep } from './chatbot-types'

export default function QuickReplies({
  onSelect,
  mode = 'default',
}: {
  onSelect: (reply: string) => void
  mode?: 'default' | 'event_type'
}) {
  const items = mode === 'event_type' ? [...EVENT_TYPES] : [...QUICK_REPLIES]

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 animate-[chatbot-fade-in_0.3s_ease-out]">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/[0.08] px-3.5 py-1.5 text-xs font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-sm hover:shadow-cyan-500/10 active:scale-95"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
