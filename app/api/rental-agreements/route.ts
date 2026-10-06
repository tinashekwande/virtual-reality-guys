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

// GET — list rental agreements
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  try {
    const admin = createAdminClient()
    let { data, error } = await admin
      .from('rental_agreements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error && (error.message?.includes('Could not find the table') || error.code === 'PGRST205')) {
      const localRecords = await ensureLocalFile()
      let filtered = localRecords
      if (status && status !== 'all') {
        filtered = filtered.filter((r) => r.status === status)
      }
      if (search) {
        filtered = filtered.filter(
          (r) =>
            r.agreement_number.toLowerCase().includes(search) ||
            r.renter_name.toLowerCase().includes(search) ||
            (r.renter_email && r.renter_email.toLowerCase().includes(search)) ||
            (r.renter_phone && r.renter_phone.includes(search))
        )
      }
      return NextResponse.json(filtered)
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let records: RentalAgreementRecord[] = Array.isArray(data) ? data : []
    if (status && status !== 'all') {
      records = records.filter((r) => r.status === status)
    }
    if (search) {
      records = records.filter(
        (r) =>
          r.agreement_number.toLowerCase().includes(search) ||
          r.renter_name.toLowerCase().includes(search) ||
          (r.renter_email && r.renter_email.toLowerCase().includes(search)) ||
          (r.renter_phone && r.renter_phone.includes(search))
      )
    }

    return NextResponse.json(records)
  } catch {
    const localRecords = await ensureLocalFile()
    return NextResponse.json(localRecords)
  }
}

// POST — create or update rental agreement
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const admin = createAdminClient()

    const agreementNumber =
      body.agreement_number ||
      body.agreementNumber ||
      `VRG-RA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    const payload: Partial<RentalAgreementRecord> = {
      agreement_number: agreementNumber,
      renter_name: body.renter_name || body.renterName || 'Unnamed Client',
      renter_email: body.renter_email || body.renterEmail || '',
      renter_phone: body.renter_phone || body.renterPhone || '',
      renter_id_number: body.renter_id_number || body.renterId || '',
      renter_address: body.renter_address || body.renterAddress || '',
      is_company: Boolean(body.is_company ?? body.isCompany),
      company_name: body.company_name || body.companyName || '',
      company_reg: body.company_reg || body.companyReg || '',
      company_rep: body.company_rep || body.companyRep || '',
      company_position: body.company_position || body.companyPosition || '',
      start_date: body.start_date || body.startDate || '',
      start_time: body.start_time || body.startTime || '',
      end_date: body.end_date || body.endDate || '',
      end_time: body.end_time || body.endTime || '',
      delivery_address: body.delivery_address || body.deliveryAddress || '',
      purpose: body.purpose || 'birthday',
      purpose_other: body.purpose_other || body.purposeOther || '',
      rental_fee: Number(body.rental_fee ?? body.rentalFee ?? 0),
      delivery_fee: Number(body.delivery_fee ?? body.deliveryFee ?? 0),
      other_charges: Number(body.other_charges ?? body.otherCharges ?? 0),
      total_amount: Number(body.total_amount ?? body.totalAmount ?? 0),
      booking_deposit_paid: Number(body.booking_deposit_paid ?? body.bookingDepositPaid ?? 0),
      deposit_date_paid: body.deposit_date_paid || body.depositDatePaid || '',
      security_deposit: Number(body.security_deposit ?? body.securityDeposit ?? 0),
      status: body.status || 'draft',
      equipment_list: body.equipment_list || body.equipmentList || [],
      headset_serial_numbers: body.headset_serial_numbers || body.headsetSerialNumbers || '',
      replacement_values: body.replacement_values || body.replacementValues || [],
      late_return_charge: Number(body.late_return_charge ?? body.lateReturnCharge ?? 250),
      late_return_unit: body.late_return_unit || body.lateReturnUnit || 'hour',
      handover_notes: body.handover_notes || body.handoverNotes || '',
      return_notes: body.return_notes || body.returnNotes || '',
      full_agreement_data: body.full_agreement_data || body.agreementData || body,
      updated_at: new Date().toISOString(),
    }

    // Try Supabase first
    const { data, error } = await admin
      .from('rental_agreements')
      .upsert(payload, { onConflict: 'agreement_number' })
      .select()
      .single()

    if (!error && data) {
      // Also update local copy
      const localRecords = await ensureLocalFile()
      const existingIdx = localRecords.findIndex((r) => r.agreement_number === agreementNumber)
      if (existingIdx >= 0) {
        localRecords[existingIdx] = data
      } else {
        localRecords.unshift(data)
      }
      await saveLocalFile(localRecords)
      return NextResponse.json(data, { status: 201 })
    }

    // Fallback if table doesn't exist in Supabase yet
    if (error && (error.message?.includes('Could not find the table') || error.code === 'PGRST205')) {
      const localRecords = await ensureLocalFile()
      const existingIdx = localRecords.findIndex((r) => r.agreement_number === agreementNumber)
      const record: RentalAgreementRecord = {
        id: body.id || `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        created_at: body.created_at || new Date().toISOString(),
        ...(payload as any),
      }

      if (existingIdx >= 0) {
        localRecords[existingIdx] = record
      } else {
        localRecords.unshift(record)
      }
      await saveLocalFile(localRecords)
      return NextResponse.json(record, { status: 201 })
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save rental agreement' }, { status: 500 })
  }
}
