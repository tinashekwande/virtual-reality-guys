"use client"

import { useEffect, useState, useRef } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import type { TeamMember } from "@/types"

const EMPTY: Partial<TeamMember> = { name: "", role: "", bio: "", sort_order: 0 }

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch("/api/team").then(r => r.json()).then(d => setMembers(Array.isArray(d) ? d : []))
  useEffect(() => { load() }, [])

  function openCreate() { setEditing(null); setPreview(null); setOpen(true) }
  function openEdit(m: TeamMember) { setEditing(m); setPreview(m.image_url ?? null); setOpen(true) }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const file = fileRef.current?.files?.[0]
    if (file) formData.set("image", file)

    if (editing) {
      await fetch(`/api/team/${editing.id}`, { method: "PUT", body: formData })
    } else {
      await fetch("/api/team", { method: "POST", body: formData })
    }

    setSaving(false)
    setOpen(false)
    await load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await fetch(`/api/team/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    await load()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Team Members</h2>
          <p className="text-sm text-muted-foreground">{members.length} members</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Member</Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
          <p>No team members yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-secondary flex-shrink-0 overflow-hidden">
                  {m.image_url
                    ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">{m.name[0]}</div>
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{m.name}</p>
                  <p className="text-sm text-primary truncate">{m.role}</p>
                </div>
              </div>
              {m.bio && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{m.bio}</p>}
              <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => openEdit(m)} className="flex-1">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(m.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={v => { if (!v) setOpen(false) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Team Member" : "Add Team Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Photo</div>
                }
              </div>
              <div>
                <Label>Profile Photo</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setPreview(URL.createObjectURL(f))
                  }}
                  className="mt-1 w-full text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-secondary file:text-sm cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tm-name">Full Name *</Label>
                <Input id="tm-name" name="name" defaultValue={editing?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tm-role">Role *</Label>
                <Input id="tm-role" name="role" defaultValue={editing?.role} placeholder="e.g. VR Technician" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tm-bio">Short Bio</Label>
              <Textarea id="tm-bio" name="bio" rows={3} defaultValue={editing?.bio ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tm-order">Sort Order</Label>
              <Input id="tm-order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-24" />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove this team member?"
        description="This will permanently delete their profile and photo."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
