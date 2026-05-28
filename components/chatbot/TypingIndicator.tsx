'use client'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
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
          <path d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5h-13A6.5 6.5 0 0 0 12 18.5Z" />
          <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
        </svg>
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 border border-white/[0.08]">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_infinite]" />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  )
}
