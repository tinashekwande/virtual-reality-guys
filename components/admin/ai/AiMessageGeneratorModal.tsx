"use client"

import { useState, useEffect } from "react"
import { Sparkles, MessageSquare, Mail, Copy, Check, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { GeneratedMessage } from "@/lib/ai/followups"

interface AiMessageGeneratorModalProps {
  isOpen: boolean
  initialTemplate?: string
  recipient: {
    name: string
    email?: string
    phone?: string
    event_date?: string
    package_name?: string
    amount_zar?: number
    outstanding_zar?: number
    doc_number?: string
  }
  onClose: () => void
}

const TEMPLATES = [
  { id: "quote_delivery", label: "Quote Delivery" },
  { id: "deposit_request", label: "50% Deposit Request" },
  { id: "booking_confirmation", label: "Booking Confirmation" },
  { id: "day_before_reminder", label: "Day-Before Reminder" },
  { id: "payment_reminder", label: "Balance Payment Reminder" },
  { id: "quote_followup", label: "Quote Follow-Up" },
  { id: "thank_you_review", label: "Thank You & Google Review" },
]

export function AiMessageGeneratorModal({
  isOpen,
  initialTemplate = "quote_delivery",
  recipient,
  onClose,
}: AiMessageGeneratorModalProps) {
  const [template, setTemplate] = useState(initialTemplate)
  const [message, setMessage] = useState<GeneratedMessage | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      generateMessage(template)
    }
  }, [isOpen, template])

  const generateMessage = async (tmpl: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: tmpl, recipient }),
      })
      if (!res.ok) throw new Error("Failed to generate message")
      const data = await res.json()
      setMessage(data)
    } catch (err: any) {
      console.error("[AiMessageGeneratorModal] Error:", err)
      toast.error("Could not generate message")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!message?.body_text) return
    navigator.clipboard.writeText(message.body_text)
    setCopied(true)
    toast.success("Message copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">AI Multi-Channel Communication</h3>
              <p className="text-xs text-muted-foreground">Recipient: {recipient.name} {recipient.phone ? `(${recipient.phone})` : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border/40">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                template === tmpl.id
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* Generated Message Preview */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Personalizing message with customer & event details...</span>
            </div>
          ) : message ? (
            <div className="space-y-3">
              {/* Subject */}
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase">Subject Line</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{message.subject}</p>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/60 whitespace-pre-wrap leading-relaxed text-foreground text-xs font-sans">
                {message.body_text}
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy to Clipboard"}
          </Button>

          <div className="flex items-center gap-2">
            {message?.recipient_email && (
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="text-xs gap-1.5"
              >
                <a
                  href={`mailto:${message.recipient_email}?subject=${encodeURIComponent(
                    message.subject
                  )}&body=${encodeURIComponent(message.body_text)}`}
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Open in Mail
                </a>
              </Button>
            )}

            {message?.whatsapp_url ? (
              <Button
                size="sm"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <a href={message.whatsapp_url} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send via WhatsApp
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            ) : (
              <span className="text-[11px] text-muted-foreground">Add phone number to send via WhatsApp</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
