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
  Save,
  Database,
  Search,
  Clock,
  XCircle,
  RefreshCw,
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
import type { Invoice, FormRequest, RentalAgreementRecord, RentalAgreementStatus } from "@/types"

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
  const [viewMode, setViewMode] = useState<"preview" | "edit" | "records">("preview")
  const [isExporting, setIsExporting] = useState(false)

  // Database records state
  const [savedAgreements, setSavedAgreements] = useState<RentalAgreementRecord[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [agreementStatus, setAgreementStatus] = useState<RentalAgreementStatus>("draft")
  const [searchFilter, setSearchFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Invoices & requests for auto-filling
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [requests, setRequests] = useState<FormRequest[]>([])
  const [selectedSource, setSelectedSource] = useState<string>("none")

  // Fetch saved agreements from database
  const fetchSavedAgreements = async () => {
    try {
      const res = await fetch("/api/rental-agreements")
      if (res.ok) {
        const data = await res.json()
        setSavedAgreements(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.warn("Could not load saved rental agreements:", err)
    }
  }

  // Load invoices, requests, and saved agreements
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
    fetchSavedAgreements()
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

  // Database Agreement Actions
  const handleSaveAgreement = async () => {
    try {
      setIsSaving(true)
      const res = await fetch("/api/rental-agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreement_number: agreement.agreementNumber,
          renter_name: agreement.renterName || "Unnamed Client",
          renter_email: agreement.renterEmail,
          renter_phone: agreement.renterPhone,
          renter_id_number: agreement.renterId,
          renter_address: agreement.renterAddress,
          is_company: agreement.isCompany,
          company_name: agreement.companyName,
          company_reg: agreement.companyReg,
          company_rep: agreement.companyRep,
          company_position: agreement.companyPosition,
          start_date: agreement.startDate,
          start_time: agreement.startTime,
          end_date: agreement.endDate,
          end_time: agreement.endTime,
          delivery_address: agreement.deliveryAddress,
          purpose: agreement.purpose,
          purpose_other: agreement.purposeOther,
          rental_fee: Number(agreement.rentalFee || 0),
          delivery_fee: Number(agreement.deliveryFee || 0),
          other_charges: Number(agreement.otherCharges || 0),
          total_amount: Number(agreement.totalAmount || 0),
          booking_deposit_paid: Number(agreement.bookingDepositPaid || 0),
          deposit_date_paid: agreement.depositDatePaid,
          security_deposit: Number(agreement.securityDeposit || 0),
          status: agreementStatus,
          equipment_list: agreement.equipmentList,
          headset_serial_numbers: agreement.headsetSerialNumbers,
          replacement_values: agreement.replacementValues,
          late_return_charge: Number(agreement.lateReturnCharge || 250),
          late_return_unit: agreement.lateReturnUnit,
          handover_notes: agreement.handoverNotes,
          return_notes: agreement.returnNotes,
          full_agreement_data: agreement,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to save agreement")
      }

      toast.success(`Agreement ${agreement.agreementNumber} saved to database! 💾`)
      await fetchSavedAgreements()
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadAgreement = (rec: RentalAgreementRecord) => {
    if (rec.full_agreement_data && typeof rec.full_agreement_data === "object") {
      setAgreement({
        ...DEFAULT_BLANK_AGREEMENT,
        ...rec.full_agreement_data,
        agreementNumber: rec.agreement_number || rec.full_agreement_data.agreementNumber,
        renterName: rec.renter_name || rec.full_agreement_data.renterName,
      })
    } else {
      setAgreement((prev) => ({
        ...prev,
        agreementNumber: rec.agreement_number,
        renterName: rec.renter_name,
        renterEmail: rec.renter_email || "",
        renterPhone: rec.renter_phone || "",
        renterId: rec.renter_id_number || "",
        renterAddress: rec.renter_address || "",
        startDate: rec.start_date || prev.startDate,
        startTime: rec.start_time || prev.startTime,
        endDate: rec.end_date || prev.endDate,
        endTime: rec.end_time || prev.endTime,
        deliveryAddress: rec.delivery_address || "",
        rentalFee: String(rec.rental_fee || 0),
        deliveryFee: String(rec.delivery_fee || 0),
        totalAmount: String(rec.total_amount || 0),
        bookingDepositPaid: String(rec.booking_deposit_paid || 0),
        securityDeposit: String(rec.security_deposit || 0),
        equipmentList:
          Array.isArray(rec.equipment_list) && rec.equipment_list.length > 0
            ? rec.equipment_list
            : prev.equipmentList,
        headsetSerialNumbers: rec.headset_serial_numbers || "",
      }))
    }
    setAgreementStatus(rec.status || "draft")
    setViewMode("preview")
    toast.success(`Loaded agreement ${rec.agreement_number} (${rec.renter_name})`)
  }

  const handleDeleteAgreement = async (id: string, agreementNumber: string) => {
    if (!confirm(`Are you sure you want to delete agreement ${agreementNumber} from the database?`)) {
      return
    }

    try {
      const res = await fetch(`/api/rental-agreements/${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Failed to delete agreement")
      }
      toast.success(`Deleted agreement ${agreementNumber}`)
      setSavedAgreements((prev) => prev.filter((a) => a.id !== id && a.agreement_number !== agreementNumber))
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`)
    }
  }

  const handleNewAgreement = () => {
    setAgreement({
      ...DEFAULT_BLANK_AGREEMENT,
      agreementNumber: `VRG-RA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    })
    setAgreementStatus("draft")
    setViewMode("edit")
    toast.info("Started new rental agreement form.")
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

  // Filtered agreements and metrics for Records tab
  const filteredAgreements = savedAgreements.filter((item) => {
    const query = searchFilter.toLowerCase()
    const matchesSearch =
      !searchFilter ||
      (item.agreement_number && item.agreement_number.toLowerCase().includes(query)) ||
      (item.renter_name && item.renter_name.toLowerCase().includes(query)) ||
      (item.renter_email && item.renter_email.toLowerCase().includes(query)) ||
      (item.renter_phone && item.renter_phone.includes(query)) ||
      (item.company_name && item.company_name.toLowerCase().includes(query))

    const matchesStatus = statusFilter === "all" || (item.status || "draft") === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalAgreementsCount = savedAgreements.length
  const activeAgreementsCount = savedAgreements.filter((a) => a.status === "active").length
  const completedAgreementsCount = savedAgreements.filter(
    (a) => a.status === "completed" || a.status === "returned"
  ).length
  const totalAgreementsRevenue = savedAgreements.reduce(
    (acc, a) => acc + Number(a.total_amount || 0),
    0
  )

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
              size="sm"
              onClick={handleSaveAgreement}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 font-semibold"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save to DB"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNewAgreement}
              className="border-border hover:bg-secondary flex items-center gap-1.5"
              title="Start a fresh blank agreement"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span>New</span>
            </Button>

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

            {savedAgreements.length > 0 && (
              <Select
                onValueChange={(val) => {
                  const rec = savedAgreements.find((a) => a.id === val || a.agreement_number === val)
                  if (rec) handleLoadAgreement(rec)
                }}
              >
                <SelectTrigger className="w-[190px] h-8 text-xs bg-secondary/50 border-border text-emerald-400 font-medium">
                  <SelectValue placeholder={`Saved Records (${savedAgreements.length})...`} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {savedAgreements.map((rec) => (
                    <SelectItem key={rec.id} value={rec.id} className="text-xs">
                      #{rec.agreement_number} - {rec.renter_name} ({rec.status || "draft"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {invoices.length > 0 && (
              <Select onValueChange={handleSelectInvoice}>
                <SelectTrigger className="w-[170px] h-8 text-xs bg-secondary/50 border-border">
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
                <SelectTrigger className="w-[160px] h-8 text-xs bg-secondary/50 border-border">
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
              <span>Edit Agreement</span>
            </button>
            <button
              onClick={() => setViewMode("records")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "records"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Saved Records ({savedAgreements.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODE: EDIT DATA FORM */}
      {/* ============================================================ */}
      {viewMode === "edit" && (
        <div className="p-6 bg-card rounded-2xl border border-border shadow-xl space-y-6 print:hidden">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Edit Rental Agreement Details</h2>
              <p className="text-xs text-muted-foreground">
                Update renter information, rental fees, and equipment quantities. Changes update the printable document live.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSaveAgreement}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save to DB"}</span>
              </Button>
              <Button size="sm" onClick={() => setViewMode("preview")} className="bg-primary text-primary-foreground text-xs">
                Done &amp; Preview
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* 1. Renter Information */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> 1. Renter Details
              </h3>
              <div>
                <Label className="text-[11px] font-semibold text-emerald-400">Agreement Lifecycle Status</Label>
                <Select
                  value={agreementStatus}
                  onValueChange={(val: RentalAgreementStatus) => setAgreementStatus(val)}
                >
                  <SelectTrigger className="h-8 text-xs bg-background capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="draft" className="text-xs">Draft (Unsigned / Prep)</SelectItem>
                    <SelectItem value="active" className="text-xs">Active (Equipment Out / Rented)</SelectItem>
                    <SelectItem value="returned" className="text-xs">Returned (Awaiting Inspection)</SelectItem>
                    <SelectItem value="completed" className="text-xs">Completed (Deposit Settled)</SelectItem>
                    <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
      {/* VIEW MODE: SAVED RECORDS DATABASE MANAGER */}
      {/* ============================================================ */}
      {viewMode === "records" && (
        <div className="space-y-6 print:hidden">
          {/* Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Agreements</p>
                <p className="text-2xl font-bold font-tech text-foreground">{totalAgreementsCount}</p>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Rentals</p>
                <p className="text-2xl font-bold font-tech text-emerald-400">{activeAgreementsCount}</p>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Returned / Completed</p>
                <p className="text-2xl font-bold font-tech text-cyan-400">{completedAgreementsCount}</p>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Contracted Value</p>
                <p className="text-2xl font-bold font-tech text-amber-400">
                  R {totalAgreementsRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/60 p-4 rounded-2xl border border-border">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agreement #, renter, phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 rounded-xl border-border bg-secondary/50 text-xs h-9"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 rounded-xl border-border bg-secondary text-xs h-9">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                  <SelectItem value="active" className="text-xs">Active</SelectItem>
                  <SelectItem value="returned" className="text-xs">Returned</SelectItem>
                  <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                  <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={fetchSavedAgreements}
                title="Refresh database records"
                className="h-9 w-9 rounded-xl border border-border"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                onClick={handleNewAgreement}
                className="bg-primary text-primary-foreground font-semibold rounded-xl h-9 text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ New Agreement</span>
              </Button>
            </div>
          </div>

          {/* Saved Agreements Table */}
          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            {filteredAgreements.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileSignature className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
                <h3 className="text-base font-bold text-foreground">No rental agreements found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {searchFilter || statusFilter !== "all"
                    ? "No saved agreements match your active search or status filter."
                    : "Save your first rental agreement to store it permanently in the database and track equipment returns."}
                </p>
                <Button size="sm" onClick={handleNewAgreement} className="mt-2 text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Create New Agreement
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30 text-muted-foreground uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 font-semibold">Agreement #</th>
                      <th className="py-3 px-4 font-semibold">Renter / Client</th>
                      <th className="py-3 px-4 font-semibold">Rental Dates</th>
                      <th className="py-3 px-4 font-semibold">Equipment Summary</th>
                      <th className="py-3 px-4 font-semibold">Total Fee</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredAgreements.map((rec) => {
                      const statusColor =
                        rec.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : rec.status === "completed"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          : rec.status === "returned"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : rec.status === "cancelled"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"

                      const itemCount = Array.isArray(rec.equipment_list)
                        ? rec.equipment_list.filter((e) => e.quantity && e.quantity !== "____").length
                        : 0

                      return (
                        <tr key={rec.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-primary">
                            {rec.agreement_number}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-foreground">{rec.renter_name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {rec.renter_phone || rec.renter_email || (rec.is_company && rec.company_name) || "—"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-foreground">
                              {rec.start_date || "—"}
                              {rec.end_date && rec.end_date !== rec.start_date ? ` → ${rec.end_date}` : ""}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {rec.start_time || "10:00"} - {rec.end_time || "14:00"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-foreground flex items-center gap-1">
                              <Package className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{itemCount > 0 ? `${itemCount} item types` : "Standard items"}</span>
                            </div>
                            {rec.headset_serial_numbers && (
                              <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
                                {rec.headset_serial_numbers}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-foreground">
                              R {Number(rec.total_amount || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                            </div>
                            {rec.booking_deposit_paid ? (
                              <div className="text-[10px] text-emerald-400">
                                Dep: R{Number(rec.booking_deposit_paid || 0)}
                              </div>
                            ) : null}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusColor}`}
                            >
                              {rec.status || "draft"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLoadAgreement(rec)}
                                className="h-7 px-2.5 text-[11px] border-border hover:bg-secondary flex items-center gap-1"
                                title="View printable agreement"
                              >
                                <Eye className="w-3 h-3 text-cyan-400" />
                                <span>View</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  handleLoadAgreement(rec)
                                  setViewMode("edit")
                                }}
                                className="h-7 px-2.5 text-[11px] border-border hover:bg-secondary flex items-center gap-1"
                                title="Edit agreement details"
                              >
                                <Edit3 className="w-3 h-3 text-primary" />
                                <span>Edit</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteAgreement(rec.id, rec.agreement_number)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                title="Delete agreement record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW MODE: PRINTABLE LUXURY DOCUMENT CONTAINER */}
      {/* ============================================================ */}
      <div className={`w-full overflow-x-auto pb-12 ${viewMode === "records" ? "hidden print:block" : ""}`}>
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
