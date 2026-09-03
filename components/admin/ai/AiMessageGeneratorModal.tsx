"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Sparkles, MessageSquare, Mail, Copy, Check, ExternalLink, Loader2, RotateCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { GeneratedMessage, CustomerMessageRecipient } from "@/lib/ai/followups"

interface AiMessageGeneratorModalProps {
  isOpen: boolean
  initialTemplate?: string
  recipient: CustomerMessageRecipient
  onClose: () => void
}

const TEMPLATES = [
  { id: "quote_delivery", label: "Quote Delivery" },
  { id: "deposit_request", label: "50% Deposit Request" },
  { id: "booking_confirmation", label: "Booking Confirmation" },
  { id: "day_before_reminder", label: "Day-Before Reminder" },
  { id: "payment_reminder", label: "Balance Reminder" },
  { id: "quote_followup", label: "Quote Follow-Up" },
  { id: "thank_you_review", label: "Thank You & Review" },
]

export function AiMessageGeneratorModal({
  isOpen,
  initialTemplate = "quote_delivery",
  recipient,
  onClose,
}: AiMessageGeneratorModalProps) {
  const [mounted, setMounted] = useState(false)
  const [template, setTemplate] = useState(initialTemplate)
  const [message, setMessage] = useState<GeneratedMessage | null>(null)
  const [editedBody, setEditedBody] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      const data: GeneratedMessage = await res.json()
      setMessage(data)
      setEditedBody(data.body_text || "")
    } catch (err: any) {
      console.error("[AiMessageGeneratorModal] Error:", err)
      toast.error("Could not generate message")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!editedBody) return
    navigator.clipboard.writeText(editedBody)
    setCopied(true)
    toast.success("Message copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  // Compute live WhatsApp URL based on edited message
  let liveWhatsAppUrl: string | undefined = undefined
  if (recipient.phone) {
    const cleanPhone = recipient.phone.replace(/[^0-9]/g, "")
    const saPhone = cleanPhone.startsWith("0") ? `27${cleanPhone.slice(1)}` : cleanPhone
    liveWhatsAppUrl = `https://wa.me/${saPhone}?text=${encodeURIComponent(editedBody || message?.body_text || "")}`
  }

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-card border border-primary/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/15 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-foreground">AI Tailored Customer Reply</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  Gemini Smart Context
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client: <span className="font-semibold text-foreground">{recipient.name}</span>
                {recipient.phone ? ` • ${recipient.phone}` : ""}
                {recipient.package_name ? ` • ${recipient.package_name}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Lead Context Pill */}
        {recipient.customer_message && (
          <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 text-[11px] text-muted-foreground flex items-start gap-2 flex-shrink-0">
            <span className="font-bold text-foreground flex-shrink-0">Enquiry:</span>
            <span className="truncate italic">&quot;{recipient.customer_message}&quot;</span>
          </div>
        )}

        {/* Missing Info Warning Pill */}
        {recipient.missing_fields && recipient.missing_fields.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Missing details requested by AI:</strong> {recipient.missing_fields.join(", ")}
            </span>
          </div>
        )}

        {/* Template Selector Pills */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border/40 flex-shrink-0">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                template === tmpl.id
                  ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                  : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* Generated Message Content / Editor */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Analyzing lead details & tailoring unique response...</span>
            </div>
          ) : message ? (
            <div className="space-y-3">
              {/* Subject */}
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Email Subject</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{message.subject}</p>
              </div>

              {/* Editable Message Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Message Content (Editable)
                  </label>
                  <button
                    onClick={() => generateMessage(template)}
                    disabled={loading}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    Regenerate AI variation
                  </button>
                </div>
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={9}
                  className="w-full bg-secondary/40 border border-border/60 rounded-xl p-3.5 text-xs text-foreground font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                  placeholder="Generated message..."
                />
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
            {recipient.email && (
              <Button size="sm" variant="secondary" asChild className="text-xs gap-1.5">
                <a
                  href={`mailto:${recipient.email}?subject=${encodeURIComponent(
                    message?.subject || "Virtual Reality Guys Quote"
                  )}&body=${encodeURIComponent(editedBody)}`}
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Open in Mail
                </a>
              </Button>
            )}

            {liveWhatsAppUrl ? (
              <Button
                size="sm"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <a href={liveWhatsAppUrl} target="_blank" rel="noopener noreferrer">
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

  return createPortal(modalContent, document.body)
}
