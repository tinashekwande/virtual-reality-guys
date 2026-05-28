'use client'

import { useMemo } from 'react'
import type { Message } from './chatbot-types'

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatMessage({ message }: { message: Message }) {
  const isBot = message.role === 'bot'
  const time = useMemo(() => formatTime(message.timestamp), [message.timestamp])

  return (
    <div
      className={`flex items-start gap-3 px-4 py-1.5 animate-[chatbot-fade-in_0.3s_ease-out] ${
        isBot ? '' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isBot
            ? 'overflow-hidden border border-white/10 bg-black/40'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
        }`}
      >
        {isBot ? (
          <img
            src="/images/logo.png"
            alt="Virtual Reality Guyz Logo"
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className="flex max-w-[75%] flex-col gap-1">
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isBot
              ? 'rounded-tl-sm bg-white/[0.06] text-gray-200 border border-white/[0.08] border-l-cyan-500/40 border-l-2'
              : 'rounded-tr-sm bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
          }`}
        >
          {message.content}
        </div>
        <span
          className={`text-[10px] text-gray-500 ${
            isBot ? 'ml-1' : 'mr-1 text-right'
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
