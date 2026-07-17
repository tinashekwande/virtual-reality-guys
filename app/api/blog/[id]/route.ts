// app/api/blog/[id]/route.ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth"

// GET — fetch single blog post by ID (admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PUT — update blog post (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params

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
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "An article with this slug already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — delete blog post (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const admin = createAdminClient()
  const { error } = await admin
    .from("blog_posts")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
