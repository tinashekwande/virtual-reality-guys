"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Sparkles, AlertCircle, CheckCircle2, DollarSign } from "lucide-react"
import type { RevenueForecastResult } from "@/lib/ai/forecasting"

export function AiRevenueForecast() {
  const [forecast, setForecast] = useState<RevenueForecastResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch("/api/ai/forecast")
        if (res.ok) {
          const data = await res.json()
          setForecast(data)
        }
      } catch (err) {
        console.error("[AiRevenueForecast] Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchForecast()
  }, [])

  if (loading || !forecast) return null

  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              {forecast.month_name} {forecast.year} Revenue Intelligence
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                AI Forecast
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">Statistical breakdown separating secured vs predicted pipeline</p>
          </div>
        </div>
      </div>

      {/* 3 Explicit Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Confirmed Revenue */}
        <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Secured / Confirmed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400">
            R{forecast.confirmed_revenue_zar.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">Paid invoices & deposits in FNB</p>
        </div>

        {/* 2. Pending Opportunities */}
        <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Pending Pipeline</span>
            <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <p className="text-lg font-bold text-yellow-400">
            R{forecast.pending_pipeline_zar.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">Active unconfirmed quotes & sent invoices</p>
        </div>

        {/* 3. AI Projected Additional */}
        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium">AI Projected Month Total</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-lg font-bold text-cyan-400">
            ~R{forecast.projected_total_zar.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">Confidence: {forecast.confidence_score_pct}% (Statistical estimate)</p>
        </div>
      </div>

      {/* Rationale Breakdown */}
      <div className="p-3 rounded-xl bg-secondary/20 border border-border/40 text-[11px] space-y-1.5">
        <p className="font-semibold text-foreground flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-primary" /> Key Demand Drivers & Insights:
        </p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          {forecast.key_drivers.map((driver, i) => (
            <li key={i}>{driver}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
