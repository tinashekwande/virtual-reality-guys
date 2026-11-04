import { jsPDF } from 'jspdf'
import type { Invoice, InvoiceItem } from '@/types'

/**
 * Server-side invoice/quote PDF generator.
 *
 * Uses jsPDF vector primitives (text/lines/rects) — NOT html2canvas — so it runs
 * reliably in Node / serverless with no browser or Chromium, and never produces
 * the 0-byte/corrupt files the client-side screenshot approach sometimes did.
 */

const BANK = {
  institution: 'First National Bank (FNB)',
  type: 'Current / Cheque Account',
  account: '63124445502',
  branch: 'Brackenfell',
  code: '250655',
  holder: 'Panashe Majinga',
}

// Colours (RGB)
const INK = [15, 23, 42] as const // slate-900
const MUTED = [100, 116, 139] as const // slate-500
const ACCENT = [8, 145, 178] as const // cyan-700
const AMBER = [180, 83, 9] as const // amber-700
const LINE = [203, 213, 225] as const // slate-300
const PANEL = [247, 249, 252] as const

const money = (n: number | string | null | undefined) =>
  `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function invoicePdfFilename(invoice: Partial<Invoice>): string {
  const kind = invoice.type === 'quote' ? 'Quote' : 'Invoice'
  const doc = (invoice.doc_number || 'draft').replace(/[^\w.-]+/g, '-')
  const client = (invoice.client_name || 'Client').replace(/[^\w.-]+/g, '-')
  return `${kind}_${doc}_${client}.pdf`
}

export function renderInvoicePdf(invoice: Partial<Invoice>): Uint8Array {
  const isQuote = invoice.type === 'quote'
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 40
  const right = W - M
  let y = M

  const setColor = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2])
  const setDraw = (c: readonly number[]) => doc.setDrawColor(c[0], c[1], c[2])
  const setFill = (c: readonly number[]) => doc.setFillColor(c[0], c[1], c[2])

  const ensureSpace = (needed: number) => {
    if (y + needed > H - M) {
      doc.addPage()
      y = M
    }
  }

  // ---- Header ----------------------------------------------------------
  // Logo mark
  setFill(INK)
  doc.roundedRect(M, y, 34, 34, 6, 6, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text('VR', M + 17, y + 22, { align: 'center' })

  doc.setFontSize(18)
  setColor(INK)
  doc.text('Virtual Reality ', M + 44, y + 15)
  const vw = doc.getTextWidth('Virtual Reality ')
  setColor(ACCENT)
  doc.text('Guys', M + 44 + vw, y + 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setColor(MUTED)
  doc.text('MOBILE VR GAMING & PREMIUM EVENT ENTERTAINMENT', M + 44, y + 27)

  // Right: document type + meta
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  setColor(ACCENT)
  doc.text(isQuote ? 'QUOTE' : 'TAX INVOICE', right, y + 14, { align: 'right' })
  const statusLabel = invoice.status === 'paid' ? 'PAID' : invoice.status === 'deposit_paid' ? 'DEPOSIT PAID' : ''
  let my = y + 30
  const metaLine = (label: string, value: string, valueColor: readonly number[] = INK) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setColor(valueColor)
    doc.text(value, right, my, { align: 'right' })
    const vw = doc.getTextWidth(value)
    doc.setFont('helvetica', 'normal')
    setColor(MUTED)
    doc.text(label, right - vw - 6, my, { align: 'right' })
    my += 13
  }
  metaLine('Doc No:', invoice.doc_number || '—')
  metaLine('Issue Date:', invoice.issue_date || new Date().toISOString().split('T')[0])
  if (invoice.due_date) metaLine(isQuote ? 'Valid Until:' : 'Due Date:', invoice.due_date)
  if (statusLabel) {
    my += 2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setColor(invoice.status === 'paid' ? [21, 128, 61] : AMBER)
    doc.text(statusLabel, right, my, { align: 'right' })
    doc.setFont('helvetica', 'normal')
  }

  // contact lines under logo (kept to the left so they never collide with the meta block)
  setColor(MUTED)
  doc.setFontSize(8.5)
  doc.text('Cape Town, Western Cape   ·   +27 71 780 0323 (call / WhatsApp)', M, y + 46)
  doc.text('virtualrealityguyz@gmail.com   ·   www.virtualrealityguyz.co.za', M, y + 58)

  y += 76
  setDraw(ACCENT)
  doc.setLineWidth(1)
  doc.line(M, y, right, y)
  y += 18

  // ---- Billed To + Event boxes ----------------------------------------
  const colW = (right - M - 16) / 2
  const boxH = 86
  const drawPanel = (x: number, w: number, h: number) => {
    setFill(PANEL)
    setDraw(LINE)
    doc.setLineWidth(0.6)
    doc.roundedRect(x, y, w, h, 6, 6, 'FD')
  }
  drawPanel(M, colW, boxH)
  drawPanel(M + colW + 16, colW, boxH)

  const pad = 12
  // Billed To
  let bx = M + pad
  let by = y + pad + 4
  doc.setFontSize(8)
  setColor(ACCENT)
  doc.setFont('helvetica', 'bold')
  doc.text('BILLED TO / CLIENT', bx, by)
  by += 15
  doc.setFontSize(11)
  setColor(INK)
  doc.text(invoice.client_name || 'Client Name', bx, by)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor([51, 65, 85])
  by += 14
  if (invoice.client_email) { doc.text(invoice.client_email, bx, by); by += 12 }
  if (invoice.client_phone) { doc.text(invoice.client_phone, bx, by); by += 12 }
  if (invoice.client_address) { doc.text(doc.splitTextToSize(invoice.client_address, colW - pad * 2), bx, by); }

  // Event details
  let ex = M + colW + 16 + pad
  let ey = y + pad + 4
  doc.setFontSize(8)
  setColor(ACCENT)
  doc.setFont('helvetica', 'bold')
  doc.text('EVENT DETAILS', ex, ey)
  ey += 15
  doc.setFontSize(9.5)
  setColor(INK)
  doc.setFont('helvetica', 'normal')
  doc.text(`Date of Event:  ${invoice.event_date || 'To be confirmed'}`, ex, ey); ey += 13
  if (invoice.event_time) { doc.text(`Time / Slot:  ${invoice.event_time}`, ex, ey); ey += 13 }
  doc.setFontSize(8)
  setColor(MUTED)
  doc.text(doc.splitTextToSize('Includes full mobile VR setup, calibrated safety zoning, sanitisation, and trained on-site supervisors.', colW - pad * 2), ex, ey)

  y += boxH + 20

  // ---- Items table -----------------------------------------------------
  const cols = { desc: M, qty: M + 300, unit: M + 360, amt: right }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setColor(ACCENT)
  doc.text('ITEM DESCRIPTION', cols.desc, y)
  doc.text('QTY', cols.qty, y, { align: 'center' })
  doc.text('UNIT PRICE', cols.unit, y, { align: 'right' })
  doc.text('AMOUNT', cols.amt, y, { align: 'right' })
  y += 6
  setDraw(LINE)
  doc.setLineWidth(0.6)
  doc.line(M, y, right, y)
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const items: InvoiceItem[] = (invoice.items as InvoiceItem[]) || []
  if (items.length === 0) {
    setColor(MUTED)
    doc.text('No line items.', M, y)
    y += 16
  } else {
    for (const it of items) {
      const descLines = doc.splitTextToSize(it.description || 'VR Package / Experience', 290) as string[]
      const rowH = Math.max(descLines.length * 12, 14) + 8
      ensureSpace(rowH + 4)
      setColor(INK)
      doc.text(descLines, cols.desc, y)
      doc.text(String(it.quantity ?? 1), cols.qty, y, { align: 'center' })
      setColor([51, 65, 85])
      doc.text(money(it.unit_price), cols.unit, y, { align: 'right' })
      doc.setFont('helvetica', 'bold')
      setColor(INK)
      doc.text(money(it.total), cols.amt, y, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      y += rowH
      setDraw([226, 232, 240])
      doc.setLineWidth(0.4)
      doc.line(M, y - 6, right, y - 6)
    }
  }

  // ---- Totals ----------------------------------------------------------
  const total = Number(invoice.total || 0)
  const vat = (total * 15) / 115
  const net = total - vat
  const depPct = Number(invoice.deposit_percentage || 0)
  const deposit = (total * depPct) / 100
  const balance = total - deposit

  const boxW = 250
  const bxL = right - boxW
  let ty = y + 10
  ensureSpace(150)

  const totalRow = (label: string, value: string, opts: { bold?: boolean; color?: readonly number[]; size?: number } = {}) => {
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal')
    doc.setFontSize(opts.size || 9)
    setColor(opts.color || [51, 65, 85])
    doc.text(label, bxL, ty)
    setColor(opts.color || INK)
    doc.text(value, right, ty, { align: 'right' })
    ty += opts.size ? opts.size + 6 : 15
  }

  // VAT note on the left
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setColor(ACCENT)
  doc.text('All pricing includes 15% VAT', M, y + 10)
  doc.setFont('helvetica', 'normal')
  setColor(MUTED)
  doc.setFontSize(8)
  doc.text('Standard South African VAT rate: 15%', M, y + 22)

  totalRow('Subtotal (Incl. VAT):', money(invoice.subtotal))
  if (Number(invoice.transport_fee) > 0) totalRow('Transport / Setup Fee:', money(invoice.transport_fee), { color: ACCENT })
  if (Number(invoice.discount) > 0) totalRow('Discount:', `- ${money(invoice.discount)}`, { color: [21, 128, 61] })
  setDraw(LINE); doc.setLineWidth(0.5); doc.line(bxL, ty - 6, right, ty - 6)
  totalRow('Net Amount (Excl. VAT):', money(net), { color: MUTED })
  totalRow('VAT (15% Included):', money(vat), { color: ACCENT })
  setDraw(ACCENT); doc.setLineWidth(1); doc.line(bxL, ty - 4, right, ty - 4); ty += 4
  totalRow('TOTAL AMOUNT:', money(total), { bold: true, color: ACCENT, size: 12 })

  if (depPct > 0) {
    ty += 2
    setDraw(AMBER); doc.setLineWidth(0.6); doc.line(bxL, ty - 8, right, ty - 8)
    totalRow(`Deposit (${depPct}%${invoice.status === 'deposit_paid' ? ', received' : ''}):`, money(deposit), { bold: true, color: AMBER })
    totalRow(invoice.status === 'deposit_paid' ? 'Balance (due on event day):' : 'Remaining Balance:', money(balance), { color: [51, 65, 85] })
  }

  y = ty + 14

  // ---- Banking details -------------------------------------------------
  ensureSpace(120)
  const bankH = depPct > 0 ? 112 : 84
  setFill(PANEL); setDraw(AMBER); doc.setLineWidth(0.8)
  doc.roundedRect(M, y, right - M, bankH, 6, 6, 'FD')
  let ky = y + 18
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setColor(AMBER)
  doc.text('PAYMENT & BANKING DETAILS', M + 14, ky)
  ky += 16
  doc.setFontSize(8.5)
  const bankCol = (x: number, label: string, value: string, valColor: readonly number[] = INK) => {
    doc.setFont('helvetica', 'normal'); setColor(MUTED); doc.setFontSize(7.5)
    doc.text(label.toUpperCase(), x, ky)
    doc.setFont('helvetica', 'bold'); setColor(valColor); doc.setFontSize(9.5)
    doc.text(value, x, ky + 13)
  }
  const c1 = M + 14, c2 = M + 200, c3 = M + 360
  bankCol(c1, 'Institution', BANK.institution)
  bankCol(c2, 'Account Type', BANK.type)
  bankCol(c3, 'Account Number', BANK.account, AMBER)
  ky += 34
  bankCol(c1, 'Account Holder', BANK.holder)
  bankCol(c2, 'Branch', BANK.branch)
  bankCol(c3, 'Branch Code', BANK.code, AMBER)

  if (depPct > 0) {
    ky += 30
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setColor([120, 72, 20])
    const policy = `Deposit policy: A ${depPct}% deposit (${money(deposit)}) secures the date and reserves equipment. Balance of ${money(balance)} is payable on or before the event date. Reference: ${invoice.doc_number || invoice.client_name || ''}.`
    doc.text(doc.splitTextToSize(policy, right - M - 28), M + 14, ky)
  }
  y += bankH + 16

  // ---- Notes -----------------------------------------------------------
  const notes = (invoice.notes || '').replace(/\[(STATUS|TIME|REQUEST):[^\]]*\]/g, '').trim()
  if (notes) {
    const noteLines = doc.splitTextToSize(notes, right - M - 28) as string[]
    const nh = noteLines.length * 11 + 34
    ensureSpace(nh)
    setFill(PANEL); setDraw(LINE); doc.setLineWidth(0.6)
    doc.roundedRect(M, y, right - M, nh, 6, 6, 'FD')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); setColor(ACCENT)
    doc.text('TERMS & ADDITIONAL NOTES', M + 14, y + 16)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setColor([51, 65, 85])
    doc.text(noteLines, M + 14, y + 30)
    y += nh + 16
  }

  // ---- Footer on every page -------------------------------------------
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    setDraw(LINE); doc.setLineWidth(0.5); doc.line(M, H - 34, right, H - 34)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setColor(MUTED)
    doc.text('Thank you for choosing Virtual Reality Guys for your event!', M, H - 22)
    setColor(ACCENT)
    doc.text('Turn-Key Mobile VR Entertainment', right, H - 22, { align: 'right' })
    if (pageCount > 1) {
      setColor(MUTED)
      doc.text(`Page ${p} of ${pageCount}`, W / 2, H - 22, { align: 'center' })
    }
  }

  return new Uint8Array(doc.output('arraybuffer'))
}
