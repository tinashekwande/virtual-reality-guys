import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Real event photos (and videos) from the admin Gallery, used to bring the
 * public service pages to life. Server-only.
 */

export interface EventPhoto {
  url: string
  type: 'image' | 'video'
  caption: string | null
  category: string | null
}

/** Gallery category names as created in the admin portal. */
export const GALLERY = {
  kids: 'Kids party / home hiring',
  public: 'Open market VR experience',
  personal: 'Personal experience',
  schools: 'Schools',
} as const

const FALLBACK: EventPhoto[] = [
  { url: '/images/vr-party.jpg', type: 'image', caption: null, category: null },
  { url: '/images/vr-corporate.jpg', type: 'image', caption: null, category: null },
  { url: '/images/vr-hero.jpg', type: 'image', caption: null, category: null },
  { url: '/images/vr-school.jpg', type: 'image', caption: null, category: null },
]

/**
 * Returns up to `limit` photos, taking categories in the order given (so the
 * first category is the most relevant), newest first within each category.
 * Falls back to the site's stock images if the gallery can't be reached.
 */
export async function getEventPhotos(
  categories: string[],
  limit = 6,
  opts: { includeVideo?: boolean } = {}
): Promise<EventPhoto[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Supabase not configured')
    const { data, error } = await createAdminClient()
      .from('media')
      .select('file_url, type, title, categories(name)')
      .order('created_at', { ascending: false })
    if (error) throw error

    const rows: EventPhoto[] = (data || [])
      .map((m: any) => ({
        url: m.file_url as string,
        type: (m.type === 'video' ? 'video' : 'image') as EventPhoto['type'],
        caption: (m.title || '').trim() || null,
        category: (Array.isArray(m.categories) ? m.categories[0]?.name : m.categories?.name) ?? null,
      }))
      .filter((m) => m.url && (opts.includeVideo || m.type === 'image'))

    const picked: EventPhoto[] = []
    for (const cat of categories) {
      for (const m of rows) {
        if (picked.length >= limit) break
        if (m.category === cat && !picked.includes(m)) picked.push(m)
      }
    }
    // Top up from any category if the preferred ones are short
    for (const m of rows) {
      if (picked.length >= limit) break
      if (!picked.includes(m) && m.type === 'image') picked.push(m)
    }
    return picked.length ? picked : FALLBACK.slice(0, limit)
  } catch {
    return FALLBACK.slice(0, limit)
  }
}
