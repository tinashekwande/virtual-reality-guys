// app/api/blog/route.ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth"

// GET — list all blog posts (admin gets all, public gets published)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isAdminRequest = searchParams.get("admin") === "true"

  const admin = createAdminClient()

  let query = admin.from("blog_posts").select("*")

  if (isAdminRequest) {
    const { error: authError } = await requireAdmin()
    if (authError) return authError
    query = query.order("created_at", { ascending: false })
  } else {
    const nowStr = new Date().toISOString()
    query = query
      .eq("status", "published")
      .lte("published_at", nowStr)
      .order("published_at", { ascending: false })
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST — create blog post (admin only)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      category,
      tags,
      reading_time,
      author,
      status,
      seo_title,
      seo_description,
      published_at,
    } = body

    // Validation
    if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 })
    if (!slug?.trim()) return NextResponse.json({ error: "Slug required" }, { status: 400 })
    if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 })
    if (!category?.trim()) return NextResponse.json({ error: "Category required" }, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("blog_posts")
      .insert({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        content: content.trim(),
        excerpt: excerpt?.trim() || "",
        featured_image: featured_image?.trim() || null,
        category: category.trim(),
        tags: Array.isArray(tags) ? tags : [],
        reading_time: parseInt(reading_time, 10) || 5,
        author: author?.trim() || "Virtual Reality Guys",
        status: status || "draft",
        seo_title: seo_title?.trim() || null,
        seo_description: seo_description?.trim() || null,
        published_at: published_at ? new Date(published_at).toISOString() : new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "An article with this slug already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
