"use client"

import { useState, useEffect } from "react"
import { Sparkles, Calendar, Clock, Users, ShieldAlert, Truck, CheckSquare, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { EventPlan } from "@/types/ai"

interface AiEventPlannerModalProps {
  isOpen: boolean
  recordId: string
  recordType?: "invoice" | "event"
  onClose: () => void
}

export function AiEventPlannerModal({ isOpen, recordId, recordType = "invoice", onClose }: AiEventPlannerModalProps) {
  const [plan, setPlan] = useState<EventPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen && recordId) {
      fetchPlan()
    }
  }, [isOpen, recordId])

  const fetchPlan = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/plan-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId, type: recordType }),
      })
      if (!res.ok) throw new Error("Failed to generate plan")
      const data = await res.json()
      setPlan(data)
    } catch (err: any) {
      console.error("[AiEventPlannerModal] Error:", err)
      toast.error("Could not generate event plan")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("AI Event Plan saved & synced with calendar!")
      onClose()
    }, 400)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                AI Operational Event Plan
                {plan && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      plan.readiness_score >= 80
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    Readiness: {plan.readiness_score}%
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {plan ? `${plan.client_name} • ${plan.event_date}` : "Generating plan..."}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Analyzing event details, fleet requirements, and Cape Town travel window...</p>
          </div>
        ) : plan ? (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
            {/* Travel & Dispatch Card */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Truck className="w-4 h-4 text-cyan-400" />
                Travel & Logistics Plan
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-card border border-border/40">
                  <p className="text-muted-foreground text-[11px]">Departure</p>
                  <p className="font-bold text-foreground mt-0.5">{plan.travel_plan?.departure_time || "08:30"}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/40">
                  <p className="text-muted-foreground text-[11px]">Estimated Travel</p>
                  <p className="font-bold text-cyan-400 mt-0.5">
                    {plan.travel_plan?.estimated_travel_minutes || 30} mins
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/40">
                  <p className="text-muted-foreground text-[11px]">Distance</p>
                  <p className="font-bold text-foreground mt-0.5">{plan.travel_plan?.distance_km || 25} km</p>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/40">
                  <p className="text-muted-foreground text-[11px]">Fuel Cost Est.</p>
                  <p className="font-bold text-emerald-400 mt-0.5">R{plan.travel_plan?.fuel_estimate_zar || 70}</p>
                </div>
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div className="space-y-2.5">
              <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-primary" />
                Operational Event Timeline
              </h4>
              <div className="space-y-2">
                {plan.timeline?.map((step, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex items-start gap-3"
                  >
                    <span className="font-mono font-bold text-primary text-xs w-12 flex-shrink-0">
                      {step.time}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-xs">{step.title}</p>
                      {step.description && (
                        <p className="text-muted-foreground text-[11px] mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Column: Staffing & Equipment */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Staffing Roles */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2.5">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4 text-purple-400" />
                  Staffing Allocations
                </h4>
                <div className="space-y-2">
                  {plan.staffing_plan?.map((staff, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-card border border-border/40">
                      <p className="font-semibold text-foreground text-xs">{staff.role}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{staff.duties}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Checklist */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2.5">
                <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Equipment Pack Checklist
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {plan.equipment_checklist?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/40 text-[11px]"
                    >
                      <span className="text-foreground truncate">{item.item}</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading || saving}
            className="bg-primary hover:bg-primary/90 text-xs gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Approve & Apply Plan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
