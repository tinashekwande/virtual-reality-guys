import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const admin = createAdminClient()

  const [
    { count: totalMedia },
    { count: totalCategories },
    { count: totalTeamMembers },
    { count: totalRequests },
    { count: newRequests },
    { data: recentMedia },
    { data: recentRequests },
  ] = await Promise.all([
    admin.from('media').select('*', { count: 'exact', head: true }),
    admin.from('categories').select('*', { count: 'exact', head: true }),
    admin.from('team_members').select('*', { count: 'exact', head: true }),
    admin.from('form_requests').select('*', { count: 'exact', head: true }),
    admin.from('form_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    admin.from('media').select('*, categories(name)').order('created_at', { ascending: false }).limit(5),
    admin.from('form_requests').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return NextResponse.json({
    totalMedia: totalMedia ?? 0,
    totalCategories: totalCategories ?? 0,
    totalTeamMembers: totalTeamMembers ?? 0,
    totalRequests: totalRequests ?? 0,
    newRequests: newRequests ?? 0,
    recentMedia: recentMedia ?? [],
    recentRequests: recentRequests ?? [],
  })
}
