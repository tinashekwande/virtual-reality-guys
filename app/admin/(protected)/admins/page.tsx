"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, Plus, Trash2, Key, Calendar, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Badge } from "@/components/ui/badge"

interface AdminProfile {
  id: string
  email: string
  role: string
  created_at: string
}

interface CurrentUser {
  id: string
  email: string
}

export default function AdminsAdminPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      const res = await fetch("/api/admins")
      const data = await res.json()
      if (res.ok) {
        setAdmins(data.admins || [])
        setCurrentUser(data.currentUser || null)
      }
    } catch (err) {
      console.error("Error loading admins:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setAddOpen(false)
        setEmail("")
        setPassword("")
        setConfirm("")
        await load()
      } else {
        setError(data.error ?? "Failed to create account")
      }
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admins/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        await load()
      } else {
        const data = await res.json()
        alert(data.error ?? "Failed to delete admin account")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteId(null)
    }
  }

  const getInitials = (mail: string) => {
    return mail ? mail.charAt(0).toUpperCase() : "?"
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading admin accounts…
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Admin Accounts</h2>
          <p className="text-sm text-muted-foreground">
            {admins.length} administrator {admins.length === 1 ? "profile" : "profiles"} registered
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Administrator
        </Button>
      </div>

      {/* Grid of accounts */}
      <div className="grid md:grid-cols-2 gap-4">
        {admins.map(admin => {
          const isSelf = admin.id === currentUser?.id
          const initials = getInitials(admin.email)

          return (
            <div
              key={admin.id}
              className={`p-5 rounded-2xl bg-card border transition-all duration-300 relative group flex gap-4 ${
                isSelf ? "border-primary/40 ring-1 ring-primary/10" : "border-border hover:border-primary/30"
              }`}
            >
              {/* Left Badge */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                {initials}
              </div>

              {/* Account details */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs" title={admin.email}>
                    {admin.email}
                  </p>
                  {isSelf && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      You
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px]">
                    {admin.role}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>Added {formatDate(admin.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="truncate">ID: {admin.id}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Hide for self to prevent lockout) */}
              {!isSelf ? (
                <button
                  onClick={() => setDeleteId(admin.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 absolute top-4 right-4 cursor-pointer"
                  title="Remove Administrator"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              ) : (
                <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-secondary/80 border border-border px-2 py-0.5 rounded-md flex items-center gap-1 opacity-60">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Primary</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={addOpen} onOpenChange={v => {
        setAddOpen(v)
        if (!v) {
          setError("")
          setEmail("")
          setPassword("")
          setConfirm("")
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Administrator Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create a secondary administrator profile. The new user will be able to log in securely using these credentials and will have full management access.
            </p>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="tech@vrguys.co.za"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-confirm">Confirm Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="admin-confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Remove administrator privilege?"
        description="This will permanently delete this administrator login credential. They will instantly lose all access to the admin portal. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
