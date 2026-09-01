"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, X, Bot, User, ArrowRight, Loader2, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  text: string
  suggested_actions?: Array<{ label: string; action: string; link?: string }>
}

const QUICK_PROMPTS = [
  "What bookings do I have this week?",
  "Which invoices are unpaid or overdue?",
  "Do we have any equipment conflicts?",
  "How much revenue have we generated this month?",
  "Show me highest-value leads",
]

export function PersistentAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I am **VR Guys AI** — your business operations manager. Ask me anything about upcoming bookings, fleet capacity, invoices, customer histories, or revenue forecasts.",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim()
    if (!query || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: query,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.text })),
        }),
      })

      if (!res.ok) throw new Error("Failed to get response")
      const data = await res.json()

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.text || "I processed your request.",
        suggested_actions: data.suggested_actions,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      console.error("[PersistentAiAssistant] Error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I could not retrieve live data at the moment. Please ensure the server is online.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-primary/40 cursor-pointer"
          title="Open VR Guys AI Assistant"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">VR Guys AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
        </button>
      )}

      {/* Slide-over Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-card border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl ${
            isExpanded
              ? "w-[92vw] sm:w-[650px] h-[85vh]"
              : "w-[92vw] sm:w-[420px] h-[550px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-card via-card/90 to-primary/10 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  VR Guys AI Assistant
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                    Live OS
                  </span>
                </h3>
                <p className="text-[11px] text-muted-foreground">Connected to Business Database</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-secondary/20 border-b border-border/40 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-primary/20 hover:text-primary text-muted-foreground whitespace-nowrap transition-colors border border-border/40 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                      : "bg-secondary/40 border border-border/50 text-foreground rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {msg.text}

                  {/* Suggested Action Buttons */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex flex-wrap gap-1.5">
                      {msg.suggested_actions.map((act, i) =>
                        act.link ? (
                          <Link
                            key={i}
                            href={act.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors"
                          >
                            {act.label} <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <button
                            key={i}
                            onClick={() => handleSend(act.label)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors"
                          >
                            {act.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-md bg-secondary text-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Thinking & querying business database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 bg-card border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask VR Guys AI about bookings, revenue, fleet..."
              className="flex-1 bg-secondary/40 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="h-8 px-3 text-xs bg-primary hover:bg-primary/90"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
