"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  FileSignature,
  Printer,
  Download,
  RotateCcw,
  Sparkles,
  UserCheck,
  Package,
  Layers,
  Edit3,
  Eye,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  Plus,
  Trash2,
  ListPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import RentalAgreementDocument, {
  RentalAgreementData,
} from "@/components/admin/RentalAgreementDocument"
import { exportToPDF, printPDFDocument } from "@/lib/pdf-generator"
import type { Invoice, FormRequest } from "@/types"

const DEFAULT_BLANK_AGREEMENT: RentalAgreementData = {
  companyName: "Virtual Reality Guyz (Pty) Ltd",
  website: "virtualrealityguyz.co.za",
  email: "virtualrealityguyz@gmail.com",
  phone: "+27 71 780 0323",
  businessAddress: "Cape Town, Western Cape, South Africa",
  regNumber: "2024/VRG/ZA",
  vatNumber: "",

  renterName: "",
  renterId: "",
  renterPhone: "",
  renterEmail: "",
  renterAddress: "",
  isCompany: false,
  companyReg: "",
  companyRep: "",
  companyPosition: "",

  agreementNumber: `VRG-RA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
  startDate: new Date().toISOString().split("T")[0],
  startTime: "10:00",
  endDate: new Date().toISOString().split("T")[0],
  endTime: "14:00",
  deliveryAddress: "",
  purpose: "birthday",
  purposeOther: "",

  rentalFee: "1299",
  vatStatus: "na",
  deliveryFee: "0",
  otherCharges: "0",
  totalAmount: "1299",
  bookingDepositPaid: "650",
  depositDatePaid: new Date().toISOString().split("T")[0],
  balanceDue: "before",
  balanceDueOther: "",

  securityDeposit: "500",

  equipmentList: [
    {
      item: "VR Headset(s)",
      quantity: "4",
      serialNo: "Meta Quest 2/3 Units",
      handoverCondition: "Good / Tested",
      returnCondition: "",
    },
    {
      item: "Controller(s)",
      quantity: "8",
      serialNo: "Paired Touch Controllers",
      handoverCondition: "Good / Cleaned",
      returnCondition: "",
    },
    {
      item: "Head Strap(s)",
      quantity: "4",
      serialNo: "Elite Comfort Straps",
      handoverCondition: "Good / Intact",
      returnCondition: "",
    },
    {
      item: "Charging Cable(s)",
      quantity: "4",
      serialNo: "USB-C High Speed",
      handoverCondition: "Good",
      returnCondition: "",
    },
    {
      item: "Charging Plug(s)",
      quantity: "4",
      serialNo: "Fast Charge Adapters",
      handoverCondition: "Good",
      returnCondition: "",
    },
    {
      item: "Carrying Case(s)",
      quantity: "2",
      serialNo: "Hard Shell Protective",
      handoverCondition: "Good",
      returnCondition: "",
    },
    {
      item: "Battery / Power Bank(s)",
      quantity: "2",
      serialNo: "External Power Packs",
      handoverCondition: "Fully Charged",
      returnCondition: "",
    },
    {
      item: "Microfiber Lens Cloths",
      quantity: "2",
      serialNo: "Lens Safety Accessories",
      handoverCondition: "Clean",
      returnCondition: "",
    },
  ],
  headsetSerialNumbers: "VRG-Q3-01, VRG-Q3-02, VRG-Q2-03, VRG-Q2-04",

  replacementValues: [
    { equipment: "VR Headset", value: "R 9,500" },
    { equipment: "VR Controller", value: "R 1,800" },
    { equipment: "Head Strap", value: "R 850" },
    { equipment: "Charging Cable", value: "R 250" },
    { equipment: "Charging Plug", value: "R 350" },
    { equipment: "Carrying Case", value: "R 650" },
    { equipment: "Battery / Power Bank", value: "R 750" },
    { equipment: "Other Accessories", value: "At Cost" },
  ],

  lateReturnCharge: "250",
  lateReturnUnit: "hour",

  deliveryFeeConfirmed: "0.00",

  marketingConsent: true,
  marketingName: "",

  declarations: Array(11).fill(true),

  handoverItemsReleased: {
    "VR Headset(s)": true,
    "Controller(s)": true,
    "Head Strap(s)": true,
    "Charging Cable(s)": true,
    "Charging Plug(s)": true,
    "Carrying Case(s)": true,
    "Battery / Power Bank(s)": true,
    "Other Accessories": true,
  },
  handoverCondition: "good",
  handoverNotes: "All equipment inspected, sanitized with skin-safe disinfectant, and tested working prior to release.",
  photosTaken: true,
  idVerified: true,
  bookingDepositPaidCheck: true,
  securityDepositPaidCheck: true,
  balancePaidCheck: false,

  returnDate: "",
  returnTime: "",
  returnItemsReceived: {
    "VR Headset(s)": false,
    "Controller(s)": false,
    "Head Strap(s)": false,
    "Charging Cable(s)": false,
    "Charging Plug(s)": false,
    "Carrying Case(s)": false,
    "Battery / Power Bank(s)": false,
    "Other Accessories": false,
  },
  allEquipmentReturned: true,
  equipmentTested: true,
  damageFound: false,
  missingEquipment: false,
  lateReturn: false,
  returnNotes: "",

  depositReceived: "500",
  lessDamage: "0.00",
  lessMissing: "0.00",
  lessLate: "0.00",
  otherDeductions: "0.00",
  totalDeductions: "0.00",
  amountRefunded: "500",
  refundDate: "",
  refundMethod: "EFT / Cash",

  renterSignatureName: "",
  renterSignatureId: "",
  renterSignatureDate: new Date().toISOString().split("T")[0],
  repSignatureName: "Virtual Reality Guyz Operations",
  repSignaturePosition: "Authorised Representative",
  repSignatureDate: new Date().toISOString().split("T")[0],

  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  emergencyAltPhone: "",

  version: "1.0",
  effectiveDate: new Date().toISOString().split("T")[0],
  lastUpdated: new Date().toLocaleDateString("en-ZA"),
}

function RentalAgreementContent() {
  const searchParams = useSearchParams()
  const [agreement, setAgreement] = useState<RentalAgreementData>(DEFAULT_BLANK_AGREEMENT)
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview")
  const [isExporting, setIsExporting] = useState(false)

  // Invoices & requests for auto-filling
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [requests, setRequests] = useState<FormRequest[]>([])
  const [selectedSource, setSelectedSource] = useState<string>("none")

  // Load invoices and requests
  useEffect(() => {
    async function loadData() {
      try {
        const [invRes, reqRes] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/requests"),
        ])

        if (invRes.ok) {
          const invData = await invRes.json()
          setInvoices(Array.isArray(invData) ? invData : [])
        }
        if (reqRes.ok) {
          const reqData = await reqRes.json()
          setRequests(Array.isArray(reqData) ? reqData : [])
        }
      } catch (err) {
        console.warn("Could not load sources for autofill:", err)
      }
    }
    loadData()
  }, [])

  // Handle URL query params for instant fill
  useEffect(() => {
    const nameParam = searchParams.get("name")
    const phoneParam = searchParams.get("phone")
    const emailParam = searchParams.get("email")
    const dateParam = searchParams.get("date")
    const priceParam = searchParams.get("price")
    const addressParam = searchParams.get("address")

    if (nameParam || phoneParam || emailParam || dateParam) {
      setAgreement((prev) => ({
        ...prev,
        renterName: nameParam || prev.renterName,
        renterPhone: phoneParam || prev.renterPhone,
        renterEmail: emailParam || prev.renterEmail,
        startDate: dateParam || prev.startDate,
        endDate: dateParam || prev.endDate,
        deliveryAddress: addressParam || prev.deliveryAddress,
        rentalFee: priceParam || prev.rentalFee,
        totalAmount: priceParam || prev.totalAmount,
        bookingDepositPaid: priceParam ? String(Math.round(Number(priceParam) * 0.5)) : prev.bookingDepositPaid,
        renterSignatureName: nameParam || prev.renterSignatureName,
      }))
      toast.success("Loaded booking details into rental agreement!")
    }
  }, [searchParams])

  // Auto-fill from an invoice
  const handleSelectInvoice = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId)
    if (!inv) return

    const total = String(inv.total || 0)
    const deposit = String(Math.round(Number(inv.total || 0) * 0.5))

    setAgreement((prev) => ({
      ...prev,
      agreementNumber: `VRG-RA-${inv.doc_number || "INV"}`,
      renterName: inv.client_name || prev.renterName,
      renterEmail: inv.client_email || prev.renterEmail,
      renterPhone: inv.client_phone || prev.renterPhone,
      renterAddress: inv.client_address || prev.renterAddress,
      deliveryAddress: inv.client_address || prev.deliveryAddress,
      startDate: inv.event_date || prev.startDate,
      endDate: inv.event_date || prev.endDate,
      rentalFee: String(inv.subtotal || total),
      deliveryFee: String(inv.transport_fee || 0),
      totalAmount: total,
      bookingDepositPaid: deposit,
      renterSignatureName: inv.client_name || prev.renterSignatureName,
    }))
    toast.success(`Pre-filled from ${inv.type.toUpperCase()} #${inv.doc_number}`)
  }

  // Auto-fill from a request
  const handleSelectRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId)
    if (!req) return

    setAgreement((prev) => ({
      ...prev,
      renterName: req.name || prev.renterName,
      renterEmail: req.email || prev.renterEmail,
      renterPhone: req.phone || prev.renterPhone,
      deliveryAddress: req.suburb ? `${req.suburb}, Cape Town` : prev.deliveryAddress,
      renterSignatureName: req.name || prev.renterSignatureName,
    }))
    toast.success(`Pre-filled from lead: ${req.name}`)
  }

  // Equipment Package Presets
  const applyPreset = (preset: "starter" | "standard" | "premium" | "corporate" | "blank") => {
    if (preset === "blank") {
      setAgreement({
        ...DEFAULT_BLANK_AGREEMENT,
        renterName: "",
        renterId: "",
        renterPhone: "",
        renterEmail: "",
        renterAddress: "",
        deliveryAddress: "",
        rentalFee: "",
        totalAmount: "",
        bookingDepositPaid: "",
        securityDeposit: "",
        headsetSerialNumbers: "",
        equipmentList: DEFAULT_BLANK_AGREEMENT.equipmentList.map((e) => ({
          ...e,
          quantity: "",
          serialNo: "",
          returnCondition: "",
        })),
      })
      toast.info("Agreement reset to blank paper template.")
      return
    }

    if (preset === "starter") {
      setAgreement((prev) => ({
        ...prev,
        rentalFee: "899",
        totalAmount: "899",
        bookingDepositPaid: "450",
        securityDeposit: "500",
        equipmentList: [
          { item: "VR Headset(s)", quantity: "4", serialNo: "VRG-Q2-Starter Pack", handoverCondition: "Good / Tested", returnCondition: "" },
          { item: "Controller(s)", quantity: "8", serialNo: "Touch Controllers", handoverCondition: "Good", returnCondition: "" },
          { item: "Head Strap(s)", quantity: "4", serialNo: "Comfort Straps", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Cable(s)", quantity: "4", serialNo: "USB-C", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Plug(s)", quantity: "4", serialNo: "Wall Adapters", handoverCondition: "Good", returnCondition: "" },
          { item: "Carrying Case(s)", quantity: "2", serialNo: "Protective Cases", handoverCondition: "Good", returnCondition: "" },
          { item: "Battery / Power Bank(s)", quantity: "2", serialNo: "Power Packs", handoverCondition: "Charged", returnCondition: "" },
          { item: "Other Accessories", quantity: "1", serialNo: "Sanitizing Kit", handoverCondition: "Included", returnCondition: "" },
        ],
      }))
      toast.success("Applied Starter Pack preset (4 Headsets, R899)")
    } else if (preset === "standard") {
      setAgreement((prev) => ({
        ...prev,
        rentalFee: "1299",
        totalAmount: "1299",
        bookingDepositPaid: "650",
        securityDeposit: "500",
        equipmentList: [
          { item: "VR Headset(s)", quantity: "5", serialNo: "VRG-Q3/Q2 Hybrid Pack", handoverCondition: "Good / Tested", returnCondition: "" },
          { item: "Controller(s)", quantity: "10", serialNo: "Touch Controllers", handoverCondition: "Good", returnCondition: "" },
          { item: "Head Strap(s)", quantity: "5", serialNo: "Comfort Straps", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Cable(s)", quantity: "5", serialNo: "USB-C", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Plug(s)", quantity: "5", serialNo: "Wall Adapters", handoverCondition: "Good", returnCondition: "" },
          { item: "Carrying Case(s)", quantity: "3", serialNo: "Protective Cases", handoverCondition: "Good", returnCondition: "" },
          { item: "Battery / Power Bank(s)", quantity: "3", serialNo: "Power Packs", handoverCondition: "Charged", returnCondition: "" },
          { item: "Other Accessories", quantity: "1", serialNo: "Spectator Screen Cast", handoverCondition: "Included", returnCondition: "" },
        ],
      }))
      toast.success("Applied Standard Pack preset (5 Headsets, R1,299)")
    } else if (preset === "premium") {
      setAgreement((prev) => ({
        ...prev,
        rentalFee: "1499",
        totalAmount: "1499",
        bookingDepositPaid: "750",
        securityDeposit: "750",
        equipmentList: [
          { item: "VR Headset(s)", quantity: "6", serialNo: "VRG-Q3 Premium Pack", handoverCondition: "Pristine / Tested", returnCondition: "" },
          { item: "Controller(s)", quantity: "12", serialNo: "Touch Controllers", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Head Strap(s)", quantity: "6", serialNo: "Elite Battery Straps", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Charging Cable(s)", quantity: "6", serialNo: "USB-C Fast Cables", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Plug(s)", quantity: "6", serialNo: "Multi-Port Fast Charger", handoverCondition: "Good", returnCondition: "" },
          { item: "Carrying Case(s)", quantity: "3", serialNo: "Hard Flight Cases", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Battery / Power Bank(s)", quantity: "4", serialNo: "Extended Battery Packs", handoverCondition: "100% Charged", returnCondition: "" },
          { item: "Other Accessories", quantity: "2", serialNo: "Live Cast Hub + Stand", handoverCondition: "Tested", returnCondition: "" },
        ],
      }))
      toast.success("Applied Premium Pack preset (6 Headsets, R1,499)")
    } else if (preset === "corporate") {
      setAgreement((prev) => ({
        ...prev,
        rentalFee: "2499",
        totalAmount: "2499",
        bookingDepositPaid: "1250",
        securityDeposit: "1000",
        equipmentList: [
          { item: "VR Headset(s)", quantity: "8", serialNo: "VRG Fleet Corporate Fleet", handoverCondition: "Pristine / Tested", returnCondition: "" },
          { item: "Controller(s)", quantity: "16", serialNo: "Touch Controllers", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Head Strap(s)", quantity: "8", serialNo: "Elite Comfort Straps", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Charging Cable(s)", quantity: "8", serialNo: "USB-C Heavy Duty", handoverCondition: "Good", returnCondition: "" },
          { item: "Charging Plug(s)", quantity: "8", serialNo: "Charging Station Units", handoverCondition: "Good", returnCondition: "" },
          { item: "Carrying Case(s)", quantity: "4", serialNo: "Pelican Flight Cases", handoverCondition: "Pristine", returnCondition: "" },
          { item: "Battery / Power Bank(s)", quantity: "6", serialNo: "Power Banks", handoverCondition: "100% Charged", returnCondition: "" },
          { item: "Other Accessories", quantity: "2", serialNo: "Tournament Displays", handoverCondition: "Tested", returnCondition: "" },
        ],
      }))
      toast.success("Applied Corporate Event preset (8 Headsets, R2,499)")
    }
  }

  // Print Handlers
  const handlePrint = () => {
    // Dismiss and hide all toasts so they never print
    toast.dismiss()
    const liveToasts = document.querySelectorAll(
      "[data-sonner-toaster], [data-sonner-toast], .toaster, [role='status'], [role='alert']"
    )
    liveToasts.forEach((t) => ((t as HTMLElement).style.setProperty("display", "none", "important")))
    setTimeout(() => {
      window.print()
      setTimeout(() => {
        liveToasts.forEach((t) => ((t as HTMLElement).style.removeProperty("display")))
      }, 1000)
    }, 150)
  }

  const handleExportPDF = async () => {
    // Dismiss all toasts before starting export
    toast.dismiss()
    const liveToasts = document.querySelectorAll(
      "[data-sonner-toaster], [data-sonner-toast], .toaster, [role='status'], [role='alert']"
    )
    liveToasts.forEach((t) => ((t as HTMLElement).style.setProperty("display", "none", "important")))

    try {
      setIsExporting(true)
      const filename = `Rental_Agreement_${agreement.agreementNumber || "VRG"}_${agreement.renterName ? agreement.renterName.replace(/\s+/g, "_") : "Client"}`
      await exportToPDF("rental-agreement-document", filename)

      // Restore toast display and notify user of successful PDF file generation
      liveToasts.forEach((t) => ((t as HTMLElement).style.removeProperty("display")))
      toast.success("Rental Agreement PDF downloaded successfully! 📄")
    } catch (err: any) {
      console.warn("Export to PDF fallback invoked:", err)
      liveToasts.forEach((t) => ((t as HTMLElement).style.removeProperty("display")))
      toast.info("Opened print dialog to save multi-page PDF.")
    } finally {
      setIsExporting(false)
    }
  }

  // Toggle helpers for interactive document view
  const toggleDeclaration = (idx: number) => {
    setAgreement((prev) => {
      const copy = [...prev.declarations]
      copy[idx] = !copy[idx]
      return { ...prev, declarations: copy }
    })
  }

  const toggleHandoverItem = (key: string) => {
    setAgreement((prev) => ({
      ...prev,
      handoverItemsReleased: {
        ...prev.handoverItemsReleased,
        [key]: !prev.handoverItemsReleased[key],
      },
    }))
  }

  const toggleReturnItem = (key: string) => {
    setAgreement((prev) => ({
      ...prev,
      returnItemsReceived: {
        ...prev.returnItemsReceived,
        [key]: !prev.returnItemsReceived[key],
      },
    }))
  }

  const toggleCheck = (field: keyof RentalAgreementData, value: any) => {
    setAgreement((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Section 5: Equipment Rented management handlers
  const handleEquipmentChange = (
    index: number,
    field: "item" | "quantity" | "serialNo" | "handoverCondition" | "returnCondition",
    value: string
  ) => {
    setAgreement((prev) => {
      const nextList = [...prev.equipmentList]
      nextList[index] = { ...nextList[index], [field]: value }
      return { ...prev, equipmentList: nextList }
    })
  }

  const handleAddEquipmentRow = (custom?: {
    item?: string
    quantity?: string
    serialNo?: string
    handoverCondition?: string
    returnCondition?: string
  }) => {
    setAgreement((prev) => ({
      ...prev,
      equipmentList: [
        ...prev.equipmentList,
        {
          item: custom?.item || "New Equipment / Accessory",
          quantity: custom?.quantity || "1",
          serialNo: custom?.serialNo || "",
          handoverCondition: custom?.handoverCondition || "Good / Tested",
          returnCondition: custom?.returnCondition || "",
        },
      ],
    }))
    toast.success(`Added ${custom?.item || "equipment item"} to checklist`)
  }

  const handleRemoveEquipmentRow = (index: number) => {
    setAgreement((prev) => {
      if (prev.equipmentList.length <= 1) {
        toast.error("You must have at least one equipment item.")
        return prev
      }
      const itemRemoved = prev.equipmentList[index]?.item
      const nextList = prev.equipmentList.filter((_, i) => i !== index)
      toast.info(`Removed ${itemRemoved || "item"}`)
      return { ...prev, equipmentList: nextList }
    })
  }

  const handleResetEquipmentToDefault = () => {
    setAgreement((prev) => ({
      ...prev,
      equipmentList: DEFAULT_BLANK_AGREEMENT.equipmentList,
      headsetSerialNumbers: DEFAULT_BLANK_AGREEMENT.headsetSerialNumbers,
    }))
    toast.info("Reset equipment checklist to standard default items.")
  }

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* ADMIN CONTROL TOOLBAR */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-6 bg-card/80 backdrop-blur-md rounded-2xl border border-border/80 shadow-lg space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-tech">
                VR Equipment Rental Agreement
              </h1>
              <p className="text-xs text-muted-foreground">
                Official legal contract with handover checklist, return checklist, &amp; security deposit settlement.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-border hover:bg-secondary flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4 text-cyan-400" />
              <span>Print / Save PDF (A4)</span>
            </Button>

            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 font-semibold"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Generating PDF..." : "Download PDF"}</span>
            </Button>
          </div>
        </div>

        {/* Quick Toolbar: Autofill & Presets */}
        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Autofill Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-primary" /> Auto-fill From:
            </span>

            {invoices.length > 0 && (
              <Select onValueChange={handleSelectInvoice}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-secondary/50 border-border">
                  <SelectValue placeholder="Recent Invoices..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {invoices.slice(0, 10).map((inv) => (
                    <SelectItem key={inv.id} value={inv.id} className="text-xs">
                      #{inv.doc_number} - {inv.client_name} (R{inv.total})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {requests.length > 0 && (
              <Select onValueChange={handleSelectRequest}>
                <SelectTrigger className="w-[170px] h-8 text-xs bg-secondary/50 border-border">
                  <SelectValue placeholder="Recent Leads..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {requests.slice(0, 10).map((req) => (
                    <SelectItem key={req.id} value={req.id} className="text-xs">
                      {req.name} ({req.suburb || "Cape Town"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Package Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-cyan-400" /> Equipment Presets:
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2.5 bg-secondary/30 hover:bg-secondary border-border"
              onClick={() => applyPreset("starter")}
            >
              Starter (4)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2.5 bg-secondary/30 hover:bg-secondary border-border"
              onClick={() => applyPreset("standard")}
            >
              Standard (5)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2.5 bg-secondary/30 hover:bg-secondary border-border"
              onClick={() => applyPreset("premium")}
            >
              Premium (6)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] px-2.5 bg-secondary/30 hover:bg-secondary border-border"
              onClick={() => applyPreset("corporate")}
            >
              Corporate (8)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
              onClick={() => applyPreset("blank")}
              title="Reset to blank paper template"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Blank
            </Button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "preview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document View</span>
            </button>
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "edit"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Agreement Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODE: EDIT DATA FORM */}
      {/* ============================================================ */}
      {viewMode === "edit" && (
        <div className="p-6 bg-card rounded-2xl border border-border shadow-xl space-y-6 print:hidden">
          <div className="border-b border-border pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">Edit Rental Agreement Details</h2>
              <p className="text-xs text-muted-foreground">
                Update renter information, rental fees, and equipment quantities. Changes update the printable document live.
              </p>
            </div>
            <Button size="sm" onClick={() => setViewMode("preview")} className="bg-primary text-primary-foreground">
              Done &amp; Preview
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* 1. Renter Information */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> 1. Renter Details
              </h3>
              <div>
                <Label className="text-[11px]">Agreement Number</Label>
                <Input
                  value={agreement.agreementNumber}
                  onChange={(e) => setAgreement({ ...agreement, agreementNumber: e.target.value })}
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">Full Name / Company</Label>
                <Input
                  value={agreement.renterName}
                  onChange={(e) => setAgreement({ ...agreement, renterName: e.target.value })}
                  placeholder="e.g. David Hendricks"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">ID / Passport Number</Label>
                <Input
                  value={agreement.renterId}
                  onChange={(e) => setAgreement({ ...agreement, renterId: e.target.value })}
                  placeholder="e.g. 8501015024088"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">Telephone / WhatsApp</Label>
                <Input
                  value={agreement.renterPhone}
                  onChange={(e) => setAgreement({ ...agreement, renterPhone: e.target.value })}
                  placeholder="e.g. 071 780 0323"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">Email Address</Label>
                <Input
                  value={agreement.renterEmail}
                  onChange={(e) => setAgreement({ ...agreement, renterEmail: e.target.value })}
                  placeholder="e.g. client@example.com"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">Physical Address</Label>
                <Input
                  value={agreement.renterAddress}
                  onChange={(e) => setAgreement({ ...agreement, renterAddress: e.target.value })}
                  placeholder="e.g. 14 Protea Way, Durbanville"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isCompanyCheck"
                  checked={agreement.isCompany}
                  onChange={(e) => setAgreement({ ...agreement, isCompany: e.target.checked })}
                  className="rounded border-border text-primary"
                />
                <label htmlFor="isCompanyCheck" className="text-xs font-semibold cursor-pointer">
                  Is Corporate / Company Renter?
                </label>
              </div>
              {agreement.isCompany && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <Input
                    value={agreement.companyReg}
                    onChange={(e) => setAgreement({ ...agreement, companyReg: e.target.value })}
                    placeholder="Company Registration Number"
                    className="h-7 text-xs bg-background"
                  />
                  <Input
                    value={agreement.companyRep}
                    onChange={(e) => setAgreement({ ...agreement, companyRep: e.target.value })}
                    placeholder="Authorised Representative"
                    className="h-7 text-xs bg-background"
                  />
                  <Input
                    value={agreement.companyPosition}
                    onChange={(e) => setAgreement({ ...agreement, companyPosition: e.target.value })}
                    placeholder="Position / Title"
                    className="h-7 text-xs bg-background"
                  />
                </div>
              )}
            </div>

            {/* 2. Rental Dates & Purpose */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60">
              <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> 2. Dates &amp; Venue
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Start Date</Label>
                  <Input
                    type="date"
                    value={agreement.startDate}
                    onChange={(e) => setAgreement({ ...agreement, startDate: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Start Time</Label>
                  <Input
                    type="time"
                    value={agreement.startTime}
                    onChange={(e) => setAgreement({ ...agreement, startTime: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">End Date</Label>
                  <Input
                    type="date"
                    value={agreement.endDate}
                    onChange={(e) => setAgreement({ ...agreement, endDate: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Return Time</Label>
                  <Input
                    type="time"
                    value={agreement.endTime}
                    onChange={(e) => setAgreement({ ...agreement, endTime: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Delivery / Venue Address</Label>
                <Input
                  value={agreement.deliveryAddress}
                  onChange={(e) => setAgreement({ ...agreement, deliveryAddress: e.target.value })}
                  placeholder="Venue or Event Location"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div>
                <Label className="text-[11px]">Rental Purpose</Label>
                <Select
                  value={agreement.purpose}
                  onValueChange={(val: any) => setAgreement({ ...agreement, purpose: val })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="private">Private Use</SelectItem>
                    <SelectItem value="birthday">Birthday / Party</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="school">School / Educational Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px]">Special Event / Purpose Details</Label>
                <Input
                  value={agreement.purposeOther}
                  onChange={(e) => setAgreement({ ...agreement, purposeOther: e.target.value })}
                  placeholder="e.g. Indoor party, team building details"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>

            {/* 3. Fees & Financials */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60">
              <h3 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> 3. Fees &amp; Deposits
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Rental Fee (R)</Label>
                  <Input
                    value={agreement.rentalFee}
                    onChange={(e) => {
                      const fee = e.target.value
                      setAgreement({
                        ...agreement,
                        rentalFee: fee,
                        totalAmount: String(Number(fee || 0) + Number(agreement.deliveryFee || 0)),
                        bookingDepositPaid: String(Math.round(Number(fee || 0) * 0.5)),
                      })
                    }}
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Delivery Fee (R)</Label>
                  <Input
                    value={agreement.deliveryFee}
                    onChange={(e) => {
                      const dFee = e.target.value
                      setAgreement({
                        ...agreement,
                        deliveryFee: dFee,
                        totalAmount: String(Number(agreement.rentalFee || 0) + Number(dFee || 0)),
                      })
                    }}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Total Amount (R)</Label>
                  <Input
                    value={agreement.totalAmount}
                    onChange={(e) => setAgreement({ ...agreement, totalAmount: e.target.value })}
                    className="h-8 text-xs bg-background font-bold text-primary"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Booking Deposit Paid (R)</Label>
                  <Input
                    value={agreement.bookingDepositPaid}
                    onChange={(e) => setAgreement({ ...agreement, bookingDepositPaid: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px]">Security Deposit (R)</Label>
                  <Input
                    value={agreement.securityDeposit}
                    onChange={(e) =>
                      setAgreement({
                        ...agreement,
                        securityDeposit: e.target.value,
                        depositReceived: e.target.value,
                        amountRefunded: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Late Return Fee (R/hr)</Label>
                  <Input
                    value={agreement.lateReturnCharge}
                    onChange={(e) => setAgreement({ ...agreement, lateReturnCharge: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[11px]">Emergency Contact Name &amp; Phone</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={agreement.emergencyName}
                    onChange={(e) => setAgreement({ ...agreement, emergencyName: e.target.value })}
                    placeholder="Contact Name"
                    className="h-8 text-xs bg-background"
                  />
                  <Input
                    value={agreement.emergencyPhone}
                    onChange={(e) => setAgreement({ ...agreement, emergencyPhone: e.target.value })}
                    placeholder="Contact Number"
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. Section 5: Equipment Rented Checklist Editor */}
          {/* ============================================================ */}
          <div className="p-5 rounded-xl bg-secondary/20 border border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
              <div>
                <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> 4. Section 5: Equipment Rented Table
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Manage the items, quantities, serial/asset numbers, and handover/return conditions for Section 5. Changes update the agreement live.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddEquipmentRow()}
                  className="h-8 text-xs bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex items-center gap-1.5 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Equipment Item
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetEquipmentToDefault}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Standard Items
                </Button>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Add Accessory:
              </span>
              {[
                { item: "VR Headset(s)", quantity: "1", serialNo: "Meta Quest 3", handoverCondition: "Good / Tested", returnCondition: "" },
                { item: "Controller(s)", quantity: "2", serialNo: "Touch Controllers", handoverCondition: "Good / Cleaned", returnCondition: "" },
                { item: "Head Strap(s)", quantity: "1", serialNo: "Elite Strap", handoverCondition: "Good / Intact", returnCondition: "" },
                { item: "Charging Cable(s)", quantity: "1", serialNo: "USB-C High Speed", handoverCondition: "Good", returnCondition: "" },
                { item: "Charging Plug(s)", quantity: "1", serialNo: "Fast Adapter", handoverCondition: "Good", returnCondition: "" },
                { item: "Carrying Case(s)", quantity: "1", serialNo: "Hard Protective Case", handoverCondition: "Good", returnCondition: "" },
                { item: "Battery / Power Bank(s)", quantity: "1", serialNo: "Power Pack", handoverCondition: "Fully Charged", returnCondition: "" },
                { item: "Microfiber Lens Cloth", quantity: "1", serialNo: "Cleaning Kit", handoverCondition: "Clean", returnCondition: "" },
                { item: "VR Boundary Mat", quantity: "1", serialNo: "Anti-slip mat", handoverCondition: "Clean", returnCondition: "" },
                { item: "Chromecast / Casting Hub", quantity: "1", serialNo: "Spectator Screen Cast", handoverCondition: "Tested", returnCondition: "" },
              ].map((presetItem) => (
                <button
                  key={presetItem.item}
                  type="button"
                  onClick={() => handleAddEquipmentRow(presetItem)}
                  className="px-2.5 py-1 rounded-md bg-secondary/50 hover:bg-secondary border border-border/60 text-[11px] text-foreground transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{presetItem.item}</span>
                </button>
              ))}
            </div>

            {/* Equipment Table Editor */}
            <div className="overflow-x-auto rounded-lg border border-border/80 bg-background/50">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground border-b border-border/80 text-[11px]">
                    <th className="p-2.5 text-center font-semibold w-10">#</th>
                    <th className="p-2.5 text-left font-semibold min-w-[180px]">Item Name</th>
                    <th className="p-2.5 text-left font-semibold w-24">Quantity</th>
                    <th className="p-2.5 text-left font-semibold min-w-[180px]">Serial / Asset No.</th>
                    <th className="p-2.5 text-left font-semibold min-w-[160px]">Condition at Handover</th>
                    <th className="p-2.5 text-left font-semibold min-w-[160px]">Condition at Return</th>
                    <th className="p-2.5 text-center font-semibold w-14">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {agreement.equipmentList.map((eq, index) => (
                    <tr key={index} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-2 text-center text-muted-foreground font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="p-2">
                        <Input
                          value={eq.item}
                          onChange={(e) => handleEquipmentChange(index, "item", e.target.value)}
                          placeholder="e.g. VR Headset(s)"
                          className="h-8 text-xs bg-background"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={eq.quantity}
                          onChange={(e) => handleEquipmentChange(index, "quantity", e.target.value)}
                          placeholder="e.g. 4"
                          className="h-8 text-xs bg-background text-center font-bold"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={eq.serialNo}
                          onChange={(e) => handleEquipmentChange(index, "serialNo", e.target.value)}
                          placeholder="e.g. VRG-Q3-01 or Asset No."
                          className="h-8 text-xs bg-background"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={eq.handoverCondition}
                          onChange={(e) => handleEquipmentChange(index, "handoverCondition", e.target.value)}
                          placeholder="e.g. Good / Tested"
                          className="h-8 text-xs bg-background"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={eq.returnCondition}
                          onChange={(e) => handleEquipmentChange(index, "returnCondition", e.target.value)}
                          placeholder="e.g. Good / Undamaged"
                          className="h-8 text-xs bg-background"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEquipmentRow(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {agreement.equipmentList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground text-xs">
                        No equipment items added yet. Click &quot;Add Equipment Item&quot; above to add rows.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Headset Serial Numbers & Handover Notes */}
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  Headset Serial Numbers (Section 5 Note)
                </Label>
                <textarea
                  value={agreement.headsetSerialNumbers}
                  onChange={(e) => setAgreement({ ...agreement, headsetSerialNumbers: e.target.value })}
                  placeholder="e.g. VRG-Q3-01, VRG-Q3-02, VRG-Q2-03, VRG-Q2-04"
                  rows={3}
                  className="w-full text-xs rounded-md border border-border bg-background p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-muted-foreground">
                  Comma-separated serial numbers of all headsets assigned to this booking.
                </span>
              </div>

              {/* Handover Notes */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground">
                  Handover Notes &amp; Special Inspection Remarks
                </Label>
                <textarea
                  value={agreement.handoverNotes}
                  onChange={(e) => setAgreement({ ...agreement, handoverNotes: e.target.value })}
                  placeholder="Inspection notes recorded at handover..."
                  rows={3}
                  className="w-full text-xs rounded-md border border-border bg-background p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-muted-foreground">
                  Recorded in Section 35 Handover Checklist before equipment leaves VRG possession.
                </span>
              </div>
            </div>

            {/* Section 21 Replacement Values editor */}
            <div className="pt-3 border-t border-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Section 21 Replacement Schedule Values:
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Standard liability schedule for lost, stolen or unrepairable equipment
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {agreement.replacementValues.map((rv, rIndex) => (
                  <div key={rIndex} className="p-2 rounded bg-background/80 border border-border/60 space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium block truncate">
                      {rv.equipment}
                    </span>
                    <Input
                      value={rv.value}
                      onChange={(e) => {
                        const nextRV = [...agreement.replacementValues]
                        nextRV[rIndex] = { ...nextRV[rIndex], value: e.target.value }
                        setAgreement({ ...agreement, replacementValues: nextRV })
                      }}
                      className="h-7 text-xs bg-background font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW MODE: PRINTABLE LUXURY DOCUMENT CONTAINER */}
      {/* ============================================================ */}
      <div className="w-full overflow-x-auto pb-12">
        <RentalAgreementDocument
          data={agreement}
          onToggleDeclaration={toggleDeclaration}
          onToggleHandoverItem={toggleHandoverItem}
          onToggleReturnItem={toggleReturnItem}
          onToggleCheck={toggleCheck}
          interactive={true}
        />
      </div>
    </div>
  )
}

export default function RentalAgreementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          Loading VR Rental Agreement...
        </div>
      }
    >
      <RentalAgreementContent />
    </Suspense>
  )
}
