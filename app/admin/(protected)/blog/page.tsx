// app/admin/(protected)/blog/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Search, Calendar, Clock, BookOpen, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { BLOG_CATEGORIES, slugify } from "@/lib/blog"

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  status: 'draft' | 'published'
  published_at: string
  created_at: string
}

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/blog?admin=true")
      if (res.ok) {
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        await loadPosts()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteId(null)
    }
  }

  // Filter posts based on search, category, and status
  const filtered = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
    
    // Determine exact status
    const isPublished = post.status === 'published'
    const isFuture = new Date(post.published_at) > new Date()
    let postStatus = 'draft'
    if (isPublished) {
      postStatus = isFuture ? 'scheduled' : 'published'
    }

    const matchesStatus = statusFilter === 'all' || postStatus === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get status badge styling
  function getStatusBadge(post: BlogPost) {
    const isPublished = post.status === 'published'
    const isFuture = new Date(post.published_at) > new Date()

    if (!isPublished) {
      return (
        <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted" variant="outline">
          Draft
        </Badge>
      )
    }

    if (isFuture) {
      return (
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/10" variant="outline">
          Scheduled
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/10" variant="outline">
        Published
      </Badge>
    )
  }

  const deleteTarget = posts.find(p => p.id === deleteId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading articles…
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Blog Posts Manager</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, schedule, and delete articles ({posts.length} articles total)
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />New Article
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-card/50 p-4 border border-border rounded-xl">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-background border border-border rounded-lg text-sm px-3 py-1.5 outline-none focus:border-primary/50 text-foreground cursor-pointer h-9"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-background border border-border rounded-lg text-sm px-3 py-1.5 outline-none focus:border-primary/50 text-foreground cursor-pointer h-9"
          >
            <option value="all">All Categories</option>
            {BLOG_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid / Table list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Publication Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No articles found matching filters
                  </td>
                </tr>
              ) : (
                filtered.map(post => {
                  const pubDate = new Date(post.published_at).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  const isPublished = post.status === 'published'
                  const isFuture = new Date(post.published_at) > new Date()

                  return (
                    <tr key={post.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors max-w-sm sm:max-w-md truncate">
                          {post.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>/{post.slug}</span>
                          {isPublished && !isFuture && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-0.5"
                              title="View published article"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                        {post.category}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(post)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {pubDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Link href={`/admin/blog/edit/${post.id}`} title="Edit article">
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setDeleteId(post.id)}
                            title="Delete article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this article?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently delete the post and cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
