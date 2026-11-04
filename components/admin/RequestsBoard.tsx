"use client"

import { useMemo, useState } from "react"
import { MapPin, Gamepad2, FileText, Clock, GripVertical } from "lucide-react"
import type { FormRequest, RequestStatus } from "@/types"
import { calculateLeadScore } from "@/lib/ai/lead-scoring"
import { extractTimeFromText } from "@/lib/time-utils"
import { PIPELINE_STAGES, stageForStatus, extractRequestSuburb, extractBookedGame, extractEventDate, type PipelineStage } from "@/lib/requests/parse"
import { cn } from "@/lib/utils"

interface RequestsBoardProps {
  requests: FormRequest[]
  onOpen: (r: FormRequest) => void
  onStatusChange: (id: string, status: RequestStatus) => void
  onDraftQuote: (r: FormRequest) => void
}

export function RequestsBoard({ requests, onOpen, onStatusChange, onDraftQuote }: RequestsBoardProps) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<PipelineStage | null>(null)

  const byStage = useMemo(() => {
    const map: Record<PipelineStage, FormRequest[]> = { new: [], in_progress: [], confirmed: [], completed: [], lost: [] }
    for (const r of requests) map[stageForStatus(r.status)].push(r)
    return map
  }, [requests])

  const handleDrop = (stage: (typeof PIPELINE_STAGES)[number]) => {
    setOverStage(null)
    const id = dragId
    setDragId(null)
    if (!id) return
    const r = requests.find((x) => x.id === id)
    if (!r || stageForStatus(r.status) === stage.key) return
    onStatusChange(id, stage.canonicalStatus as RequestStatus)
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {PIPELINE_STAGES.map((stage) => {
        const items = byStage[stage.key]
        const isOver = overStage === stage.key
        return (
          <div
            key={stage.key}
            onDragOver={(e) => { e.preventDefault(); setOverStage(stage.key) }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) setOverStage(null) }}
            onDrop={() => handleDrop(stage)}
            className={cn(
              "flex-shrink-0 w-[min(82vw,280px)] rounded-2xl border bg-muted/20 flex flex-col max-h-[72vh]",
              isOver ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border sticky top-0">
              <span className={cn("h-2 w-2 rounded-full", stage.dot)} />
              <span className="text-xs font-semibold text-foreground">{stage.label}</span>
              <span className="ml-auto text-[11px] text-muted-foreground bg-card border border-border rounded-full px-1.5">{items.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {items.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-6">Drop cards here</p>
              ) : (
                items.map((r) => {
                  const score = calculateLeadScore(r)
                  const suburb = extractRequestSuburb(r)
                  const game = extractBookedGame(r.message)
                  const date = extractEventDate(r.message)
                  const time = extractTimeFromText(r.message)
                  const high = score.priority.includes("HIGH")
                  const med = score.priority.includes("MEDIUM")
                  return (
                    <div
                      key={r.id}
                      draggable
                      onDragStart={() => setDragId(r.id)}
                      onDragEnd={() => { setDragId(null); setOverStage(null) }}
                      onClick={() => onOpen(r)}
                      className={cn(
                        "group bg-card border border-border rounded-xl p-2.5 cursor-pointer hover:border-primary/40 transition-colors",
                        dragId === r.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 flex-shrink-0 group-hover:text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground text-xs truncate">{r.name}</p>
                            <span
                              className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded-full font-bold border flex-shrink-0",
                                high ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : med ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              )}
                            >
                              {score.score}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{r.email}</p>

                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                            <span className="text-[9px] uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-medium">{r.form_type}</span>
                            {game && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded px-1 py-0.5 font-bold">
                                <Gamepad2 className="w-2.5 h-2.5" /><span className="truncate max-w-[70px]">{game}</span>
                              </span>
                            )}
                            {suburb && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-cyan-300">
                                <MapPin className="w-2.5 h-2.5" /><span className="truncate max-w-[70px]">{suburb}</span>
                              </span>
                            )}
                          </div>

                          {(date || time) && (
                            <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                              {date && <span className="text-amber-400 font-medium">{date}</span>}
                              {time && <span className="flex items-center gap-0.5 text-cyan-400 font-mono"><Clock className="w-2.5 h-2.5" />{time}</span>}
                            </div>
                          )}

                          <button
                            onClick={(e) => { e.stopPropagation(); onDraftQuote(r) }}
                            className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg py-1 hover:bg-primary/10 transition-colors"
                          >
                            <FileText className="h-3 w-3" /> Draft quote
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
