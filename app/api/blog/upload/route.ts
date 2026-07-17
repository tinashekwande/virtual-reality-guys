// app/api/blog/upload/route.ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth"

// POST — upload file for blog article (admin only, multipart/form-data)
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const ext = file.name.split(".").pop()
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    // Upload to 'gallery' storage bucket
    const { error: uploadError } = await admin.storage
      .from("gallery")
      .upload(fileName, bytes, { contentType: file.type, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = admin.storage.from("gallery").getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
