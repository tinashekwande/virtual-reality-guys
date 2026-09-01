"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Image as ImageIcon, FolderOpen, Users, ClipboardList, Upload, Plus, UserPlus, Inbox, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/admin/stat-card"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { AiCommandCenter } from "@/components/admin/ai/AiCommandCenter"
import { AiRevenueForecast } from "@/components/admin/ai/AiRevenueForecast"
import type { DashboardStats } from "@/types"

const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  archived: "bg-muted text-muted-foreground",
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      const r = await fetch("/api/dashboard")
      const d = await r.json()
      setStats(d)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()

    const handleRefresh = () => {
      loadStats()
    }
    window.addEventListener("new-requests-received", handleRefresh)

    return () => {
      window.removeEventListener("new-requests-received", handleRefresh)
    }
  }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/media/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        await loadStats()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">Loading dashboard…</div>
  )

  return (
    <div className="space-y-8 max-w-6xl">
      {/* 🤖 VR Guys AI Command Center */}
      <AiCommandCenter />

      {/* 📈 Revenue Forecasting & Financial Intelligence */}
      <AiRevenueForecast />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Media Files" value={stats?.totalMedia ?? 0} icon={ImageIcon} />
        <StatCard label="Categories" value={stats?.totalCategories ?? 0} icon={FolderOpen} />
        <StatCard label="Team Members" value={stats?.totalTeamMembers ?? 0} icon={Users} />
        <StatCard
          label="New Requests"
          value={stats?.newRequests ?? 0}
          icon={ClipboardList}
          description={`${stats?.totalRequests ?? 0} total submissions`}
          highlight={(stats?.newRequests ?? 0) > 0}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/admin/gallery"><Upload className="h-4 w-4 mr-2" />Upload Media</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/categories"><Plus className="h-4 w-4 mr-2" />Add Category</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/team"><UserPlus className="h-4 w-4 mr-2" />Add Team Member</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/equipment"><ShieldCheck className="h-4 w-4 mr-2" />Manage Equipment</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/requests"><Inbox className="h-4 w-4 mr-2" />View Requests</Link>
          </Button>
        </div>
      </div>

      {/* Two-column: Recent Media + Recent Requests */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Media */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent Uploads</h2>
            <Link href="/admin/gallery" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {stats?.recentMedia?.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">No media uploaded yet</p>
            ) : stats?.recentMedia?.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3 group">
                <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                  {m.type === 'image'
                    ? <img src={m.file_url} alt={m.title ?? ''} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">▶</div>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{m.title || 'Untitled'}</p>
                  <p className="text-xs text-muted-foreground">{(m as any).categories?.name ?? 'No category'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${m.type === 'video' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {m.type}
                  </span>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent Requests</h2>
            <Link href="/admin/requests" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {stats?.recentRequests?.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">No submissions yet</p>
            ) : stats?.recentRequests?.map(r => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status] ?? ''}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this media?"
        description="This will permanently delete the file from storage. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

