"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Mail,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  PhoneCall,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { AiDailyBriefing } from "@/types/ai"

interface AiCommandCenterProps {
  onOpenAssistant?: (initialPrompt?: string) => void
  onOpenMessageModal?: (template: string, record: any) => void
}

export function AiCommandCenter({ onOpenAssistant, onOpenMessageModal }: AiCommandCenterProps) {
  const [briefing, setBriefing] = useState<AiDailyBriefing | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dayPlannerOpen, setDayPlannerOpen] = useState(false)
  const [weekPlannerOpen, setWeekPlannerOpen] = useState(false)

  const fetchBriefing = async () => {
    try {
      setRefreshing(true)
      const res = await fetch("/api/ai/briefing")
      if (!res.ok) throw new Error("Failed to fetch briefing")
      const data = await res.json()
      setBriefing(data)
    } catch (err: any) {
      console.error("[AiCommandCenter] Error:", err)
      toast.error("Could not load latest AI briefing")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
  }, [])

  if (loading) {
    return (
      <div className="bg-card/60 border border-primary/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20" />
          <div className="h-6 w-48 bg-primary/20 rounded" />
        </div>
        <div className="h-4 w-full max-w-md bg-secondary/50 rounded mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-secondary/40 border border-border/40" />
          ))}
        </div>
      </div>
    )
  }

  if (!briefing) return null

  return (
    <div className="space-y-6">
      {/* Main Command Center Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/10 border border-primary/30 p-6 shadow-2xl shadow-primary/5">
        {/* Futuristic glowing grid accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                VR Guys Business OS • AI Command Center
              </span>
              <span className="text-xs text-muted-foreground">{briefing.date}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {briefing.greeting}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{briefing.summary}</p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchBriefing}
              disabled={refreshing}
              className="border-primary/30 hover:bg-primary/10 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Intelligence
            </Button>
            <Button
              size="sm"
              onClick={() => setDayPlannerOpen(true)}
              className="bg-primary/90 hover:bg-primary text-primary-foreground text-xs shadow-md shadow-primary/20"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              🤖 Prepare My Day
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setWeekPlannerOpen(true)}
              className="text-xs border border-border"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Prepare My Week
            </Button>
          </div>
        </div>

        {/* Live Operational Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-border/50">
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Today&apos;s Events</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{briefing.stats.events_today}</p>
          </div>
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Week&apos;s Events</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{briefing.stats.events_this_week}</p>
          </div>
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Pending Quotes</p>
            <p className="text-xl font-bold text-yellow-400 mt-0.5">{briefing.stats.pending_quotes}</p>
          </div>
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Outstanding ZAR</p>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">
              R{briefing.stats.outstanding_amount.toLocaleString()}
            </p>
          </div>
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Fleet Shortages</p>
            <p className={`text-xl font-bold mt-0.5 ${briefing.stats.equipment_shortages > 0 ? "text-rose-400" : "text-green-400"}`}>
              {briefing.stats.equipment_shortages > 0 ? `${briefing.stats.equipment_shortages} Alert` : "0 (Clear)"}
            </p>
          </div>
          <div className="bg-secondary/30 border border-border/40 p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">Follow-ups Due</p>
            <p className="text-xl font-bold text-primary mt-0.5">{briefing.stats.followups_due}</p>
          </div>
        </div>
      </div>

      {/* 4 Intelligent Operational Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Attention Required */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Attention Required
              </h2>
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                {briefing.attention_required.length} Pending
              </Badge>
            </div>
            <div className="space-y-2.5">
              {briefing.attention_required.length === 0 ? (
                <div className="p-4 rounded-xl bg-secondary/20 text-xs text-muted-foreground text-center">
                  ✨ All schedules and fleet capacities are clear. No operational conflicts detected.
                </div>
              ) : (
                briefing.attention_required.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 hover:border-amber-500/30 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-primary hover:text-primary/90 flex-shrink-0">
                      <Link href={item.action_link}>
                        {item.action_label} <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. Opportunities */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                High-Value Opportunities
              </h2>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {briefing.opportunities.length} Leads
              </Badge>
            </div>
            <div className="space-y-2.5">
              {briefing.opportunities.length === 0 ? (
                <div className="p-4 rounded-xl bg-secondary/20 text-xs text-muted-foreground text-center">
                  No unquoted enquiries pending. Great job staying up to date!
                </div>
              ) : (
                briefing.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 hover:border-emerald-500/30 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{opp.title}</p>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                          ~R{opp.estimated_value_zar.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{opp.description}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-emerald-400 hover:text-emerald-300 flex-shrink-0">
                      <Link href={opp.action_link}>
                        {opp.action_label} <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. Financial Intelligence */}
        <div className="bg-card border border-border/70 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Financial Intelligence
            </h2>
            <Link href="/admin/accounting" className="text-xs text-cyan-400 hover:underline">
              View Ledger
            </Link>
          </div>
          <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Month-over-Month Velocity</span>
              <span className="text-xs font-bold text-emerald-400">+{briefing.financial_intelligence.growth_rate}%</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {briefing.financial_intelligence.growth_description}
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Projected Month-End Revenue:</span>
              <span className="font-bold text-cyan-400">
                R{briefing.financial_intelligence.projected_revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Follow-ups Due */}
        <div className="bg-card border border-border/70 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
              <Mail className="w-4 h-4 text-primary" />
              Customer Follow-ups
            </h2>
            <Link href="/admin/quotes-invoices" className="text-xs text-primary hover:underline">
              All Quotes
            </Link>
          </div>
          <div className="space-y-2.5">
            {briefing.follow_ups_due.length === 0 ? (
              <div className="p-4 rounded-xl bg-secondary/20 text-xs text-muted-foreground text-center">
                ✨ No pending quotes awaiting follow-up today.
              </div>
            ) : (
              briefing.follow_ups_due.slice(0, 3).map((fup) => (
                <div
                  key={fup.id}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{fup.client_name}</p>
                    <p className="text-[11px] text-muted-foreground">Pending response • {fup.channel}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 px-2.5 text-xs">
                    <Link href={fup.action_link}>{fup.action_label}</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Prepare My Day Modal */}
      {dayPlannerOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">AI Daily Schedule & Readiness</h3>
                  <p className="text-xs text-muted-foreground">{briefing.date}</p>
                </div>
              </div>
              <button
                onClick={() => setDayPlannerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Top Daily Priorities
                </p>
                <ul className="text-xs space-y-1.5 text-foreground/90 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Confirm Quest 3 battery charging status on 8-bay dock before departure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Send 50% deposit payment reminders for upcoming weekend bookings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Review new inbound customer enquiries in Requests pipeline.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Operational Schedule
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">08:00</span>
                    <span className="text-foreground">Equipment Check & Sanitation at HQ</span>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">09:15</span>
                    <span className="text-foreground">Arrive at client venue & map 2m x 2m Guardian boundaries</span>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-xs flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">10:00</span>
                    <span className="text-foreground">VR Experience begins (Multiplayer & rhythm games)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={() => setDayPlannerOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prepare My Week Modal */}
      {weekPlannerOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">AI 7-Day Operational Forecast</h3>
                  <p className="text-xs text-muted-foreground">Fleet & Staffing Capacity</p>
                </div>
              </div>
              <button
                onClick={() => setWeekPlannerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-center">
                  <p className="text-muted-foreground">Bookings</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{briefing.stats.events_this_week}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-center">
                  <p className="text-muted-foreground">Fleet Status</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">8 Available</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-center">
                  <p className="text-muted-foreground">Pipeline</p>
                  <p className="text-base font-bold text-cyan-400 mt-0.5">
                    R{briefing.financial_intelligence.projected_revenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                The week ahead shows high demand for weekend mobile birthday party packages across Cape Town Northern Suburbs. Fleet capacity is healthy.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={() => setWeekPlannerOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
