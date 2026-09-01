"use client"

import { useState, useEffect } from "react"
import { Bot, Save, Sparkles, Sliders, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { AiBusinessSettings } from "@/types/ai"

export default function AiSettingsPage() {
  const [settings, setSettings] = useState<AiBusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/ai/settings")
      if (!res.ok) throw new Error("Failed to load settings")
      const data = await res.json()
      setSettings(data)
    } catch (err: any) {
      console.error("[AiSettingsPage] Error:", err)
      toast.error("Could not load AI settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch("/api/ai/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("Failed to save settings")
      toast.success("VR Guys AI Business OS settings updated!")
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground text-xs">Loading AI settings...</div>
  }

  if (!settings) return null

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-primary" />
            AI Business Settings & Autonomous Policies
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure Gemini AI reasoning models, automation triggers, approval gates, and company memory
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary text-xs gap-1.5">
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* 1. AI Model Selection */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Engine Provider & Model
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "Recommended • Ultra-fast multi-modal reasoning" },
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", desc: "High throughput • Next-gen speed" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Stable production baseline" },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setSettings({ ...settings, model: m.id })}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                settings.model === m.id
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-border/60 bg-secondary/20 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-foreground">{m.name}</p>
                {settings.model === m.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Automation Toggles */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Autonomous Subsystems (Level 1 & 2)
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {[
            { key: "auto_draft_quotes", label: "Automatic Quote Drafting", desc: "Draft quotes from inbound enquiries" },
            { key: "auto_conflict_detection", label: "AI Calendar Conflict Engine", desc: "Scan travel & fleet shortages in real time" },
            { key: "auto_daily_briefing", label: "AI Daily Business Briefing", desc: "Generate morning briefing and action items" },
            { key: "auto_followups", label: "Customer Follow-up Automation", desc: "Schedule 24h/3d quote follow-up checks" },
            { key: "auto_payment_reminders", label: "Payment & Deposit Reminders", desc: "Flag unpaid invoices and draft reminders" },
            { key: "auto_event_planning", label: "Automatic Event Operational Plans", desc: "Generate timeline and equipment lists" },
          ].map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={(settings.automation_toggles as any)[item.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    automation_toggles: {
                      ...settings.automation_toggles,
                      [item.key]: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-primary cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Human Approval Gates */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Approval Gates (Level 2 Action Rules)
        </h3>
        <div className="space-y-2 text-xs">
          {[
            { key: "require_quote_approval", label: "Require human approval before sending Quotes to clients" },
            { key: "require_email_approval", label: "Require human review before sending outbound customer Emails" },
            { key: "require_whatsapp_approval", label: "Require human verification before launching WhatsApp messages" },
            { key: "require_discount_approval", label: "Require explicit admin approval for custom discounts" },
          ].map((rule) => (
            <label
              key={rule.key}
              className="p-3 rounded-xl bg-secondary/20 border border-border/40 flex items-center justify-between gap-3 cursor-pointer hover:bg-secondary/40 transition-colors"
            >
              <span className="text-foreground">{rule.label}</span>
              <input
                type="checkbox"
                checked={(settings.approval_rules as any)[rule.key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    approval_rules: {
                      ...settings.approval_rules,
                      [rule.key]: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-primary cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
