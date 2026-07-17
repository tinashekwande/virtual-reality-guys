// app/admin/(protected)/blog/edit/[id]/page.tsx
"use client"

import { useState, useRef, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Sparkles, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BLOG_CATEGORIES, slugify } from "@/lib/blog"
import MarkdownEditor from "@/components/blog/MarkdownEditor"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditBlogPostPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState(BLOG_CATEGORIES[0])
  const [excerpt, setExcerpt] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [tags, setTags] = useState("")
  const [content, setContent] = useState("")
  const [readingTime, setReadingTime] = useState(5)
  const [author, setAuthor] = useState("Virtual Reality Guys")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [publishedAt, setPublishedAt] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch post details on load
  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/${id}`)
        if (res.ok) {
          const post = await res.json()
          setTitle(post.title)
          setSlug(post.slug)
          setCategory(post.category)
          setExcerpt(post.excerpt)
          setFeaturedImage(post.featured_image || "")
          setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "")
          setContent(post.content)
          setReadingTime(post.reading_time)
          setAuthor(post.author)
          setStatus(post.status)
          
          // Format ISO date to YYYY-MM-DDTHH:MM for datetime-local input
          const localDate = new Date(post.published_at)
          const offsetMs = localDate.getTimezoneOffset() * 60000
          const tzDate = new Date(localDate.getTime() - offsetMs)
          setPublishedAt(tzDate.toISOString().slice(0, 16))

          setSeoTitle(post.seo_title || "")
          setSeoDescription(post.seo_description || "")
        } else {
          setError("Failed to load blog post details")
        }
      } catch (err) {
        console.error(err)
        setError("An error occurred loading post details")
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id])

  // Auto-generate slug from title
  function handleGenerateSlug() {
    if (title.trim()) {
      setSlug(slugify(title))
    }
  }

  // Auto-calculate reading time (1 min per 200 words)
  function handleContentChange(val: string) {
    setContent(val)
    const words = val.trim().split(/\s+/).filter(Boolean).length
    const mins = Math.max(1, Math.ceil(words / 200))
    setReadingTime(mins)
  }

  // Handle image upload for featured image
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setFeaturedImage(data.url)
      } else {
        const err = await res.json()
        alert(err.error || "Failed to upload image")
      }
    } catch (err) {
      console.error(err)
      alert("Error uploading image")
    } finally {
      setUploadingImage(false)
    }
  }

  // Submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) { setError("Title is required"); return }
    if (!slug.trim()) { setError("Slug is required"); return }
    if (!content.trim()) { setError("Content is required"); return }
    if (!category.trim()) { setError("Category is required"); return }

    setSaving(true)

    const parsedTags = tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      category,
      excerpt: excerpt.trim() || title,
      featured_image: featuredImage.trim() || null,
      tags: parsedTags,
      content,
      reading_time: readingTime,
      author,
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    }

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/admin/blog")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update blog post")
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading article details…
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/blog" className="hover:text-primary transition-colors">Blog</Link>
        <span>&rarr;</span>
        <span className="text-foreground">Edit Article</span>
      </div>

      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Edit Article</h2>
          <p className="text-sm text-muted-foreground">Modify and update your published or draft article</p>
        </div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to list
        </Link>
      </div>

      {/* Main form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            {/* Title field */}
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                placeholder="e.g. 10 Amazing VR Birthday Party Ideas in Cape Town"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content field */}
            <div className="space-y-2">
              <Label>Article Body (Markdown)</Label>
              <MarkdownEditor value={content} onChange={handleContentChange} />
            </div>

            {/* Excerpt field */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (2-3 lines description)</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief summary of the article that will show up on cards and search results…"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                Article Settings
              </h3>

              {/* Status select */}
              <div className="space-y-2">
                <Label htmlFor="status">Publish Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 outline-none focus:border-primary/50 text-foreground cursor-pointer"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Published / Scheduled</option>
                </select>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  If status is "Published" and the Publication Date is set in the future, the article will automatically be scheduled and remain hidden from the public until that date.
                </p>
              </div>

              {/* Published Date field */}
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Publication Date</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={e => setPublishedAt(e.target.value)}
                />
              </div>

              {/* Slug field */}
              <div className="space-y-2">
                <Label htmlFor="slug">SEO friendly URL (Slug)</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="e.g. 10-amazing-vr-birthday-party-ideas"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase())}
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug} title="Generate from Title">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Category select */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg text-sm px-3 py-2 outline-none focus:border-primary/50 text-foreground cursor-pointer"
                >
                  {BLOG_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tags field */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g. Virtual Reality, Cape Town, Kids"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>

              {/* Featured Image field */}
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <div className="space-y-2">
                  <Input
                    id="featuredImage"
                    placeholder="Paste url or upload below…"
                    value={featuredImage}
                    onChange={e => setFeaturedImage(e.target.value)}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs h-8"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    {uploadingImage ? "Uploading…" : "Upload Featured Image"}
                  </Button>
                </div>
              </div>

              {/* Reading time */}
              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min={1}
                  value={readingTime}
                  onChange={e => setReadingTime(parseInt(e.target.value, 10) || 1)}
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                />
              </div>
            </div>

            {/* Custom SEO Panel */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                Custom SEO Meta (Optional)
              </h3>

              {/* Custom SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Custom SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="Defaults to: Title | VR Guys"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                />
              </div>

              {/* Custom SEO Description */}
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Custom SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="Defaults to article excerpt description…"
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 justify-end border-t border-border/60 pt-6">
          <Button asChild variant="outline">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
