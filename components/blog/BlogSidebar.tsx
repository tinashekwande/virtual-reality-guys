// components/blog/BlogSidebar.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, FolderOpen, Tag, ArrowRight } from "lucide-react"

interface SidebarCategory {
  name: string
  count: number
  slug: string
}

interface SidebarRecentPost {
  title: string
  slug: string
  published_at: string
  featured_image: string | null
}

interface BlogSidebarProps {
  categories: SidebarCategory[]
  recentPosts: SidebarRecentPost[]
  tags: string[]
  currentSearch?: string
}

export default function BlogSidebar({
  categories,
  recentPosts,
  tags,
  currentSearch = "",
}: BlogSidebarProps) {
  const router = useRouter()
  const [searchVal, setSearchVal] = useState(currentSearch)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchVal.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchVal.trim())}`)
    } else {
      router.push("/blog")
    }
  }

  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      {/* Search Widget */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-tech text-sm font-bold uppercase tracking-wider mb-4 text-foreground flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          Search Articles
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Type and press Enter…"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-background border border-border focus:border-primary/50 rounded-lg py-2.5 pl-4 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-tech text-sm font-bold uppercase tracking-wider mb-4 text-foreground flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          Categories
        </h3>
        <nav className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">No categories available.</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/blog/category/${cat.slug}`}
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1 group"
              >
                <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {cat.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground border border-border font-medium">
                  {cat.count}
                </span>
              </Link>
            ))
          )}
        </nav>
      </div>

      {/* Recent Posts Widget */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-tech text-sm font-bold uppercase tracking-wider mb-4 text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Recent Posts
        </h3>
        <div className="space-y-4">
          {recentPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent posts.</p>
          ) : (
            recentPosts.map((post) => {
              const formattedDate = new Date(post.published_at).toLocaleDateString("en-ZA", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              return (
                <div key={post.slug} className="flex gap-3 group">
                  <Link href={`/blog/${post.slug}`} className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-secondary border border-border">
                    <Image
                      src={post.featured_image || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=200"}
                      alt={post.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold leading-snug line-clamp-2 text-muted-foreground group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-1">{formattedDate}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Tags Widget */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-tech text-sm font-bold uppercase tracking-wider mb-4 text-foreground flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-xs text-muted-foreground">No tags available.</p>
          ) : (
            tags.map((tag) => {
              // slugify tag name for URL
              const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
              return (
                <Link
                  key={tag}
                  href={`/blog/tag/${tagSlug}`}
                  className="text-xs px-2.5 py-1 rounded bg-secondary/40 text-muted-foreground border border-border hover:border-primary/30 hover:text-primary hover:bg-secondary transition-all"
                >
                  #{tag}
                </Link>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
