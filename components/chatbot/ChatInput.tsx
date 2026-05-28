'use client'

import { useState, useCallback, type KeyboardEvent } from 'react'
import { SendHorizontal } from 'lucide-react'

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [value, setValue] = useState('')

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }, [value, disabled, onSend])

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    },
    [submit],
  )

  return (
    <div className="flex items-center gap-2 border-t border-white/[0.08] bg-black/40 px-3 py-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Chat message input"
        className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  )
}
