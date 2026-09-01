"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, RefreshCw, Filter, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { AiAuditLog } from "@/types/ai"

export default function AiAuditLogsPage() {
  const [logs, setLogs] = useState<AiAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/ai/audit?category=${category}&limit=100`)
      if (!res.ok) throw new Error("Failed to load audit logs")
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (err: any) {
      console.error("[AiAuditLogsPage] Error:", err)
      toast.error("Could not load audit trail")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [category])

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      l.action_name.toLowerCase().includes(q) ||
      (l.target_record && l.target_record.toLowerCase().includes(q)) ||
      l.actor.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            AI Action Audit Log & Accountability Trail
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Complete immutable ledger of all AI-initiated suggestions, approvals, and executed business tasks
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchLogs} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by action or target record..."
            className="w-full bg-secondary/40 border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {["all", "operations", "sales", "finance", "booking"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-muted-foreground">Loading audit log records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-xs text-muted-foreground">No audit logs found.</div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-secondary/20 transition-colors flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5">
                    {log.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : log.status === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-foreground text-xs">{log.action_name}</p>
                      <Badge variant="outline" className="text-[10px] bg-secondary border-border/70">
                        {log.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">by {log.actor}</span>
                    </div>
                    {log.target_record && (
                      <p className="text-xs text-primary font-medium mt-0.5 truncate">{log.target_record}</p>
                    )}
                    {log.details && (
                      <p className="text-[11px] text-muted-foreground mt-1 font-mono bg-secondary/30 p-2 rounded-lg truncate">
                        {JSON.stringify(log.details)}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {new Date(log.created_at).toLocaleString("en-ZA", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
