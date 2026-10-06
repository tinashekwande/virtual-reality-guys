import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import fs from 'node:fs/promises'
import path from 'node:path'
import { RentalAgreementRecord } from '@/types'

const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'data', 'rental_agreements.json')

async function ensureLocalFile(): Promise<RentalAgreementRecord[]> {
  try {
    await fs.mkdir(path.dirname(LOCAL_STORAGE_PATH), { recursive: true })
    const data = await fs.readFile(LOCAL_STORAGE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveLocalFile(records: RentalAgreementRecord[]) {
  try {
    await fs.mkdir(path.dirname(LOCAL_STORAGE_PATH), { recursive: true })
    await fs.writeFile(LOCAL_STORAGE_PATH, JSON.stringify(records, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Failed to write local rental agreements file:', err)
  }
}

// GET — get specific agreement
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('rental_agreements')
      .select('*')
      .or(`id.eq.${id},agreement_number.eq.${id}`)
      .single()

    if (!error && data) {
      return NextResponse.json(data)
    }

    const localRecords = await ensureLocalFile()
    const found = localRecords.find((r) => r.id === id || r.agreement_number === id)
    if (found) return NextResponse.json(found)

    return NextResponse.json({ error: 'Rental agreement not found' }, { status: 404 })
  } catch {
    const localRecords = await ensureLocalFile()
    const found = localRecords.find((r) => r.id === id || r.agreement_number === id)
    if (found) return NextResponse.json(found)
    return NextResponse.json({ error: 'Rental agreement not found' }, { status: 404 })
  }
}

// PUT — update agreement
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()

  try {
    const admin = createAdminClient()
    const updatePayload = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await admin
      .from('rental_agreements')
      .update(updatePayload)
      .or(`id.eq.${id},agreement_number.eq.${id}`)
      .select()
      .single()

    const localRecords = await ensureLocalFile()
    const idx = localRecords.findIndex((r) => r.id === id || r.agreement_number === id)
    if (idx >= 0) {
      localRecords[idx] = { ...localRecords[idx], ...updatePayload }
      await saveLocalFile(localRecords)
    }

    if (!error && data) {
      return NextResponse.json(data)
    }

    if (idx >= 0) {
      return NextResponse.json(localRecords[idx])
    }

    return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — delete agreement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    const admin = createAdminClient()
    await admin
      .from('rental_agreements')
      .delete()
      .or(`id.eq.${id},agreement_number.eq.${id}`)

    const localRecords = await ensureLocalFile()
    const filtered = localRecords.filter((r) => r.id !== id && r.agreement_number !== id)
    await saveLocalFile(filtered)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 })
  }
}
