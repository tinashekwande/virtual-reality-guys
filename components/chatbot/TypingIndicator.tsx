'use client'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/10 bg-black/40">
        <img
          src="/images/logo.png"
          alt="Virtual Reality Guyz Logo"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 border border-white/[0.08]">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_infinite]" />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-[chatbot-bounce_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  )
}
