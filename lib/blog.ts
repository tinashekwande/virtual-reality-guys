// lib/blog.ts
import { createAdminClient } from "@/lib/supabase/admin"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  category: string
  tags: string[]
  reading_time: number
  author: string
  status: 'draft' | 'published'
  seo_title: string | null
  seo_description: string | null
  published_at: string
  created_at: string
  updated_at: string
}

// Preset list of categories
export const BLOG_CATEGORIES = [
  "Birthday Parties",
  "Schools",
  "Corporate Events",
  "VR Technology",
  "Event Ideas",
  "Tips & Guides"
]

// Slugify utility
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

// Un-slugify categories
export function getCategoryBySlug(slug: string): string | null {
  const match = BLOG_CATEGORIES.find(c => slugify(c) === slug)
  return match || null
}

// Fetch helper that returns sidebar data: categories with count, recent posts, and tags cloud
export async function getSidebarData() {
  const admin = createAdminClient()
  const nowStr = new Date().toISOString()

  // Fetch all published posts to calculate counts and tags dynamically
  const { data: posts, error } = await admin
    .from("blog_posts")
    .select("title, slug, category, tags, published_at, featured_image")
    .eq("status", "published")
    .lte("published_at", nowStr)
    .order("published_at", { ascending: false })

  if (error || !posts) {
    return { categories: [], recentPosts: [], tags: [] }
  }

  // Calculate category counts
  const categoryCounts: Record<string, number> = {}
  BLOG_CATEGORIES.forEach(c => { categoryCounts[c] = 0 })
  posts.forEach(p => {
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++
    } else {
      categoryCounts[p.category] = 1
    }
  })

  const categories = BLOG_CATEGORIES.map(c => ({
    name: c,
    slug: slugify(c),
    count: categoryCounts[c] || 0
  })).filter(c => c.count > 0) // only show categories with articles

  // Recent posts (top 5)
  const recentPosts = posts.slice(0, 5).map(p => ({
    title: p.title,
    slug: p.slug,
    published_at: p.published_at,
    featured_image: p.featured_image
  }))

  // Extract unique tags and compute frequencies
  const tagCounts: Record<string, number> = {}
  posts.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        const trimmed = t.trim()
        if (trimmed) {
          tagCounts[trimmed] = (tagCounts[trimmed] || 0) + 1
        }
      })
    }
  })

  // Sort tags by frequency and get top 15
  const sortedTags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 15)

  return {
    categories,
    recentPosts,
    tags: sortedTags
  }
}

// Main fetch function for published posts list
export async function getPublishedPosts({
  categorySlug,
  tagSlug,
  searchQuery,
  limit = 6,
  offset = 0
}: {
  categorySlug?: string
  tagSlug?: string
  searchQuery?: string
  limit?: number
  offset?: number
} = {}) {
  const admin = createAdminClient()
  const nowStr = new Date().toISOString()

  let query = admin
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", nowStr)
    .order("published_at", { ascending: false })

  // 1. Category Filter
  if (categorySlug) {
    const categoryName = getCategoryBySlug(categorySlug)
    if (categoryName) {
      query = query.eq("category", categoryName)
    } else {
      // Return empty results if category slug is unknown
      return { posts: [], totalCount: 0 }
    }
  }

  // 2. Tag Filter
  if (tagSlug) {
    // We need to resolve the original tag name by finding it in our seeded data
    // Fetch tags from all published posts
    const { data: postsTags } = await admin
      .from("blog_posts")
      .select("tags")
      .eq("status", "published")
      .lte("published_at", nowStr)

    let originalTag = ""
    if (postsTags) {
      const allTags = new Set<string>()
      postsTags.forEach((p: any) => p.tags?.forEach((t: string) => allTags.add(t.trim())))
      for (const t of allTags) {
        if (slugify(t) === tagSlug) {
          originalTag = t
          break
        }
      }
    }

    if (originalTag) {
      query = query.contains("tags", [originalTag])
    } else {
      return { posts: [], totalCount: 0 }
    }
  }

  // 3. Search Query (PostgREST or client-side check, or standard ILIKE search)
  // Note: supabase client lets us query using standard or filters
  if (searchQuery) {
    const cleanSearch = searchQuery.trim()
    query = query.or(`title.ilike.%${cleanSearch}%,content.ilike.%${cleanSearch}%,excerpt.ilike.%${cleanSearch}%`)
  }

  // 4. Pagination
  const { data, count, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching published posts:", error.message)
    return { posts: [], totalCount: 0 }
  }

  return {
    posts: (data || []) as BlogPost[],
    totalCount: count || 0
  }
}

// Fetch single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const admin = createAdminClient()
  const nowStr = new Date().toISOString()

  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", nowStr)
    .single()

  if (error || !data) {
    return null
  }

  return data as BlogPost
}
