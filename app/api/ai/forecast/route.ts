import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { calculateRevenueForecast } from '@/lib/ai/forecasting'

export async function GET() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const forecast = await calculateRevenueForecast()
    return NextResponse.json(forecast)
  } catch (err: any) {
    console.error('[API /api/ai/forecast] Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to calculate revenue forecast' },
      { status: 500 }
    )
  }
}
