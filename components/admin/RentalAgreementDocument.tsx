"use client"

import React from "react"
import { Check, ShieldCheck } from "lucide-react"

export interface RentalAgreementData {
  // Company Info
  companyName: string
  website: string
  email: string
  phone: string
  businessAddress: string
  regNumber?: string
  vatNumber?: string

  // 1. Renter Details
  renterName: string
  renterId: string
  renterPhone: string
  renterEmail: string
  renterAddress: string
  isCompany: boolean
  companyReg: string
  companyRep: string
  companyPosition: string

  // 2. Rental Details
  agreementNumber: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  deliveryAddress: string
  purpose: "private" | "birthday" | "corporate" | "school" | "other"
  purposeOther: string

  // 3. Rental Fees
  rentalFee: string
  vatStatus: "included" | "excluded" | "na"
  deliveryFee: string
  otherCharges: string
  totalAmount: string
  bookingDepositPaid: string
  depositDatePaid: string
  balanceDue: "before" | "collection" | "delivery" | "other"
  balanceDueOther: string

  // 4. Security Deposit
  securityDeposit: string

  // 5. Equipment Rented
  equipmentList: Array<{
    item: string
    quantity: string
    serialNo: string
    handoverCondition: string
    returnCondition: string
  }>
  headsetSerialNumbers: string

  // 15. Replacement Values
  replacementValues: Array<{
    equipment: string
    value: string
  }>

  // 17. Late Return
  lateReturnCharge: string
  lateReturnUnit: string

  // 20. Delivery Fee
  deliveryFeeConfirmed: string

  // 23. Marketing Consent
  marketingConsent: boolean | null
  marketingName: string

  // 34. Declarations (11 items)
  declarations: boolean[]

  // 35. Handover Checklist
  handoverItemsReleased: Record<string, boolean>
  handoverCondition: "good" | "minor_marks" | "existing_damage"
  handoverNotes: string
  photosTaken: boolean
  idVerified: boolean
  bookingDepositPaidCheck: boolean
  securityDepositPaidCheck: boolean
  balancePaidCheck: boolean

  // 36. Return Checklist
  returnDate: string
  returnTime: string
  returnItemsReceived: Record<string, boolean>
  allEquipmentReturned: boolean
  equipmentTested: boolean
  damageFound: boolean
  missingEquipment: boolean
  lateReturn: boolean
  returnNotes: string

  // 37. Security Deposit Settlement
  depositReceived: string
  lessDamage: string
  lessMissing: string
  lessLate: string
  otherDeductions: string
  totalDeductions: string
  amountRefunded: string
  refundDate: string
  refundMethod: string

  // 38. Signatures
  renterSignatureName: string
  renterSignatureId: string
  renterSignatureDate: string
  repSignatureName: string
  repSignaturePosition: string
  repSignatureDate: string

  // 39. Emergency Contact
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string
  emergencyAltPhone: string

  // Document Control
  version: string
  effectiveDate: string
  lastUpdated: string
}

interface RentalAgreementDocumentProps {
  data: RentalAgreementData
  onToggleDeclaration?: (index: number) => void
  onToggleHandoverItem?: (key: string) => void
  onToggleReturnItem?: (key: string) => void
  onToggleCheck?: (field: keyof RentalAgreementData, value: any) => void
  interactive?: boolean
}

export default function RentalAgreementDocument({
  data,
  onToggleDeclaration,
  onToggleHandoverItem,
  onToggleReturnItem,
  onToggleCheck,
  interactive = false,
}: RentalAgreementDocumentProps) {
  // Checkbox render helper
  const renderBox = (
    checked: boolean,
    onClick?: () => void,
    label?: string
  ) => {
    return (
      <span
        onClick={interactive && onClick ? onClick : undefined}
        className={`inline-flex items-center gap-1.5 ${interactive && onClick ? "cursor-pointer select-none hover:text-cyan-600" : ""}`}
      >
        <span
          className={`inline-flex items-center justify-center w-4 h-4 border rounded-[3px] text-[10px] font-bold ${
            checked
              ? "bg-slate-900 border-slate-900 text-white"
              : "border-slate-400 bg-white text-transparent"
          }`}
        >
          {checked ? "✓" : ""}
        </span>
        {label && <span className="text-slate-800 text-xs">{label}</span>}
      </span>
    )
  }

  // Underlined fillable line helper
  const renderField = (value: string | undefined, minWidth = "120px") => {
    return (
      <span
        style={{ minWidth }}
        className="inline-block border-b border-slate-400 px-1 font-semibold text-slate-900 min-h-[20px]"
      >
        {value || "\u00A0"}
      </span>
    )
  }

  return (
    <div
      id="rental-agreement-document"
      className="rental-agreement-document bg-white text-slate-900 font-sans p-6 sm:p-12 max-w-[900px] mx-auto shadow-xl border border-slate-200 text-xs sm:text-sm leading-relaxed print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full"
    >
      {/* ============================================================ */}
      {/* DOCUMENT HEADER */}
      {/* ============================================================ */}
      <div className="border-b-2 border-slate-900 pb-6 mb-8 agreement-avoid-break">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="VR Guys Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase font-tech">
                Virtual Reality Guyz
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">
                VR Equipment Rental Agreement
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <p>
              <strong>Website:</strong> {data.website}
            </p>
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>WhatsApp / Tel:</strong> {data.phone}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-700">
          <div>
            <strong>Agreement #:</strong> {renderField(data.agreementNumber, "140px")}
          </div>
          <div>
            <strong>Effective Date:</strong> {renderField(data.startDate, "100px")}
          </div>
          <div>
            <strong>Version:</strong> {data.version}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* IMPORTANT NOTICE TO THE RENTER */}
      {/* ============================================================ */}
      <div className="border border-amber-300 bg-amber-50/70 p-4 rounded-lg mb-8 agreement-avoid-break">
        <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Important Notice to the Renter
        </h2>
        <p className="font-bold text-slate-900 mb-2">
          PLEASE READ THIS AGREEMENT BEFORE SIGNING.
        </p>
        <p className="text-slate-700 mb-2">
          By signing this Agreement or accepting the equipment electronically,
          the Renter confirms that they understand and agree to the terms below.
        </p>
        <p className="text-slate-700 mb-1">
          In particular, the Renter&apos;s attention is drawn to the provisions relating to:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs ml-2">
          <li>responsibility for equipment while it is in the Renter&apos;s possession;</li>
          <li>loss, theft and damage;</li>
          <li>late returns;</li>
          <li>safe and indoor use;</li>
          <li>use by children and supervision;</li>
          <li>cancellation and deposits; and</li>
          <li>
            the Renter&apos;s obligation to pay reasonable repair or replacement costs
            where the Renter is responsible for damage or loss.
          </li>
        </ul>
        <p className="text-xs text-slate-600 mt-2 italic">
          Nothing in this Agreement excludes or limits any right or protection that
          cannot lawfully be excluded or limited under applicable South African law.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 1. PARTIES */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          1. Parties
        </h2>
        <p className="mb-3 text-slate-700">This Agreement is between:</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-slate-900 mb-2">1.1 Rental Company</h3>
            <p className="font-bold">{data.companyName}</p>
            <p className="text-xs text-slate-600">
              Hereafter referred to as &ldquo;VRG&rdquo;, &ldquo;Virtual Reality Guyz&rdquo;, or &ldquo;the Rental Company&rdquo;.
            </p>
            <div className="mt-2 text-xs text-slate-600 space-y-0.5">
              <p>Email: {data.email}</p>
              <p>Phone: {data.phone}</p>
              <p>Address: {data.businessAddress}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-slate-900 mb-2">1.2 Renter</h3>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-600">Full Name / Company:</span>{" "}
                {renderField(data.renterName, "180px")}
              </div>
              <div>
                <span className="text-slate-600">ID / Passport Number:</span>{" "}
                {renderField(data.renterId, "160px")}
              </div>
              <div>
                <span className="text-slate-600">Telephone / WhatsApp:</span>{" "}
                {renderField(data.renterPhone, "160px")}
              </div>
              <div>
                <span className="text-slate-600">Email Address:</span>{" "}
                {renderField(data.renterEmail, "180px")}
              </div>
              <div>
                <span className="text-slate-600">Physical Address:</span>{" "}
                {renderField(data.renterAddress, "200px")}
              </div>

              {data.isCompany && (
                <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-700">Company Details:</p>
                  <div>
                    <span className="text-slate-600">Company Reg:</span>{" "}
                    {renderField(data.companyReg, "140px")}
                  </div>
                  <div>
                    <span className="text-slate-600">Authorised Rep:</span>{" "}
                    {renderField(data.companyRep, "140px")}
                  </div>
                  <div>
                    <span className="text-slate-600">Position:</span>{" "}
                    {renderField(data.companyPosition, "140px")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RENTAL DETAILS */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          2. Rental Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs mb-4">
          <div>
            <span className="text-slate-600">Booking / Agreement Number:</span>{" "}
            {renderField(data.agreementNumber, "160px")}
          </div>
          <div>
            <span className="text-slate-600">Rental Start Date:</span>{" "}
            {renderField(data.startDate, "120px")}{" "}
            <span className="text-slate-600 ml-2">Time:</span>{" "}
            {renderField(data.startTime, "80px")}
          </div>
          <div>
            <span className="text-slate-600">Rental End Date:</span>{" "}
            {renderField(data.endDate, "120px")}{" "}
            <span className="text-slate-600 ml-2">Return Time:</span>{" "}
            {renderField(data.endTime, "80px")}
          </div>
          <div>
            <span className="text-slate-600">Collection / Delivery Address:</span>{" "}
            {renderField(data.deliveryAddress, "200px")}
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-700 block mb-1">
            Purpose of Rental:
          </span>
          <div className="flex flex-wrap gap-4 text-xs">
            {renderBox(
              data.purpose === "private",
              () => onToggleCheck?.("purpose", "private"),
              "Private use"
            )}
            {renderBox(
              data.purpose === "birthday",
              () => onToggleCheck?.("purpose", "birthday"),
              "Birthday / Party"
            )}
            {renderBox(
              data.purpose === "corporate",
              () => onToggleCheck?.("purpose", "corporate"),
              "Corporate event"
            )}
            {renderBox(
              data.purpose === "school",
              () => onToggleCheck?.("purpose", "school"),
              "School / Educational event"
            )}
            {renderBox(
              data.purpose === "other",
              () => onToggleCheck?.("purpose", "other"),
              `Other: ${data.purposeOther || "_____"}`
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RENTAL FEES */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          3. Rental Fees
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs">
            <h3 className="font-bold text-slate-900">3.1 Rental Fee Breakdown</h3>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Total Rental Fee:</span>
              <span className="font-bold">R {data.rentalFee || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span>VAT Status:</span>
              <div className="flex gap-2">
                {renderBox(data.vatStatus === "included", undefined, "Incl")}
                {renderBox(data.vatStatus === "excluded", undefined, "Excl")}
                {renderBox(data.vatStatus === "na", undefined, "N/A")}
              </div>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Delivery / Collection Fee:</span>
              <span className="font-bold">R {data.deliveryFee || "0.00"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Other Charges:</span>
              <span className="font-bold">R {data.otherCharges || "0.00"}</span>
            </div>
            <div className="flex justify-between py-1.5 font-extrabold text-sm text-slate-950 border-t border-slate-900">
              <span>TOTAL AMOUNT:</span>
              <span>R {data.totalAmount || "0.00"}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs">
            <h3 className="font-bold text-slate-900">3.2 Booking Deposit</h3>
            <p className="text-slate-600">
              Unless otherwise agreed in writing,{" "}
              <strong>50% of the agreed rental fee is required to secure the booking</strong>.
            </p>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Booking Deposit Paid:</span>
              <span className="font-bold">R {data.bookingDepositPaid || "0.00"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Date Paid:</span>
              <span>{data.depositDatePaid || "___________________"}</span>
            </div>
            <div className="pt-1">
              <span className="font-semibold block mb-1 text-slate-700">
                The remaining balance is due:
              </span>
              <div className="space-y-1">
                {renderBox(
                  data.balanceDue === "before",
                  undefined,
                  "Before equipment is released"
                )}
                <br />
                {renderBox(
                  data.balanceDue === "collection",
                  undefined,
                  "On collection"
                )}
                <br />
                {renderBox(
                  data.balanceDue === "delivery",
                  undefined,
                  "On delivery"
                )}
                <br />
                {renderBox(
                  data.balanceDue === "other",
                  undefined,
                  `Other: ${data.balanceDueOther || "_____"}`
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2 italic">
          A booking is not considered confirmed until the required booking deposit has been received and VRG has confirmed the booking.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 4. SECURITY DEPOSIT */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          4. Security Deposit
        </h2>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded mb-2 flex justify-between items-center text-xs">
          <span>Refundable Security Deposit Required:</span>
          <span className="text-sm font-extrabold text-slate-950">
            R {data.securityDeposit || "0.00"}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-2">
          The security deposit is separate from the rental fee and booking deposit. The security deposit may be applied toward reasonable amounts owing as a result of:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700 ml-2">
          <li>damage caused during the rental period;</li>
          <li>missing equipment or accessories;</li>
          <li>loss or theft;</li>
          <li>unauthorised use;</li>
          <li>excessive cleaning required because of misuse;</li>
          <li>late-return charges; or other amounts properly payable under this Agreement.</li>
        </ul>
        <p className="text-xs text-slate-600 mt-2">
          The Renter will be informed of any deduction from the security deposit. Any remaining balance will be refunded after the equipment has been returned, inspected, and all outstanding amounts determined. Where additional costs exceed the security deposit, the Renter remains responsible for the outstanding reasonable amount, subject to applicable law.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 5. EQUIPMENT RENTED */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          5. Equipment Rented
        </h2>
        <p className="text-xs text-slate-700 mb-2">
          The exact equipment supplied must be recorded at handover.
        </p>

        <div className="overflow-x-auto mb-3">
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 p-2 text-left">Item</th>
                <th className="border border-slate-300 p-2 text-center w-16">Quantity</th>
                <th className="border border-slate-300 p-2 text-left">Serial / Asset No.</th>
                <th className="border border-slate-300 p-2 text-left">Condition at Handover</th>
                <th className="border border-slate-300 p-2 text-left">Condition at Return</th>
              </tr>
            </thead>
            <tbody>
              {data.equipmentList.map((eq, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="border border-slate-300 p-2 font-medium">{eq.item}</td>
                  <td className="border border-slate-300 p-2 text-center font-bold">{eq.quantity || "____"}</td>
                  <td className="border border-slate-300 p-2">{eq.serialNo || "____________________"}</td>
                  <td className="border border-slate-300 p-2">{eq.handoverCondition || "____________________"}</td>
                  <td className="border border-slate-300 p-2">{eq.returnCondition || "____________________"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs bg-slate-50 p-2.5 border border-slate-200 rounded">
          <span className="font-semibold block mb-1">Headset Serial Numbers:</span>
          <p className="font-mono text-slate-800">
            {data.headsetSerialNumbers || "_____________________________________________________________________________________________"}
          </p>
        </div>
        <p className="text-xs text-slate-600 mt-2 italic">
          The Renter confirms that the equipment listed above has been received in the condition recorded at handover, subject to any defects specifically noted on this Agreement.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 6. INSPECTION AT HANDOVER & 7. RENTER'S RESPONSIBILITY */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8 agreement-avoid-break">
        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            6. Inspection at Handover
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-2">
            Before the equipment leaves VRG&apos;s possession:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
            <li>VRG may inspect and test the equipment.</li>
            <li>The condition of the equipment may be photographed or recorded.</li>
            <li>The serial numbers and/or asset numbers may be recorded.</li>
            <li>The Renter may inspect the equipment.</li>
            <li>Any visible damage or defect must be recorded before release.</li>
          </ol>
          <p className="text-xs text-slate-600 mt-2">
            If the Renter identifies a problem at handover, they must notify VRG before accepting. Once accepted and removed, the Renter becomes responsible subject to this Agreement.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            7. Renter&apos;s Responsibility
          </h2>
          <p className="text-xs text-slate-700 mb-2">
            The Renter is responsible for the equipment from handover until return and acceptance by VRG. The Renter must:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
            <li>keep the equipment secure; use it carefully and responsibly;</li>
            <li>prevent unauthorised persons from taking or using it;</li>
            <li>follow all instructions supplied by VRG;</li>
            <li>ensure users comply with safety requirements;</li>
            <li>protect equipment from water, excessive heat, dust & hazards;</li>
            <li>return all equipment and accessories;</li>
            <li>report damage or problems to VRG as soon as possible; and</li>
            <li>not attempt unauthorised repairs or modifications.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. PROHIBITED USE & 9. INDOOR-ONLY USE */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8 agreement-avoid-break">
        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            8. Prohibited Use
          </h2>
          <p className="text-xs text-slate-700 mb-2">The Renter must not:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
            <li>open or dismantle the headset or controllers;</li>
            <li>attempt to repair the equipment without VRG&apos;s approval;</li>
            <li>modify hardware or software, or install unauthorised software;</li>
            <li>remove serial numbers or asset labels;</li>
            <li>use the equipment for illegal activities;</li>
            <li>sub-rent, commercially hire, sell, pledge, or lend equipment;</li>
            <li>deliberately damage equipment or expose to liquids; or</li>
            <li>use equipment in an unsafe environment.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            9. Indoor-Only Use
          </h2>
          <p className="text-xs font-bold text-red-900 mb-2">
            Unless VRG has expressly authorised otherwise in writing, all rented VR equipment must be used indoors.
          </p>
          <p className="text-xs text-slate-700 mb-2">The equipment must NOT be used:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
            <li>outside or in rain/wet conditions;</li>
            <li>near swimming pools or on beaches;</li>
            <li>in areas containing excessive dust or sand;</li>
            <li>in direct sunlight where lenses/sensors can be permanently damaged;</li>
            <li>in extreme heat or areas with excessive moisture.</li>
          </ul>
          <p className="text-xs text-slate-600 mt-2">
            Outdoor use requires express written approval from VRG prior to rental.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 10. SAFE PLAYING ENVIRONMENT & 11. HEALTH AND SAFETY */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8 agreement-avoid-break">
        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            10. Safe Playing Environment
          </h2>
          <p className="text-xs text-slate-700 mb-1">
            Before using, the Renter must establish a safe play area that is:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
            <li>sufficiently large for intended VR activity;</li>
            <li>free from furniture, obstacles, glass and breakable objects;</li>
            <li>away from stairs, dangerous edges, pools and water;</li>
            <li>clear of cables and trip hazards; and</li>
            <li>suitable for the number of participants.</li>
          </ul>
          <p className="text-xs text-slate-600 mt-2">
            Users must remain within the designated boundary. The Renter is responsible for controlling the environment.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            11. Health and Safety
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-2">
            VR use may cause dizziness, nausea, disorientation, loss of balance, eye strain or discomfort in some users.
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700">
            <li>Users must immediately stop if experiencing significant discomfort.</li>
            <li>Equipment must NOT be used by anyone intoxicated or impaired.</li>
            <li>Users should follow all supplied safety guidelines.</li>
            <li>VRG strongly recommends appropriate breaks during extended sessions.</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 12. CHILDREN & MINORS, 13. DAMAGE, 14. LOSS OR THEFT */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8 agreement-avoid-break">
        <div>
          <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            12. Children &amp; Minors
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Where children use equipment: a responsible adult must actively supervise; ensure age-appropriateness; maintain safe boundaries; and halt activity if discomfort occurs. The Renter accepts responsibility for youth supervision.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            13. Damage
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Normal wear & tear is not treated as damage. Renter is responsible for repair/replacement resulting from negligence, misuse, impact, dropping, liquids, improper storage or failure to follow instructions. Pre-existing damage recorded at handover will not be charged.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
            14. Loss or Theft
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Renter must take reasonable precautions against theft or loss. If lost or stolen, notify VRG immediately. VRG may request a SAPS case number. Renter is responsible for reasonable replacement cost while in their possession.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 15. EQUIPMENT REPLACEMENT VALUES */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
          15. Equipment Replacement Values
        </h2>
        <p className="text-xs text-slate-700 mb-2">
          The following schedule may be used to determine replacement costs of individual items:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          {data.replacementValues.map((rv, i) => (
            <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="text-slate-600 block">{rv.equipment}:</span>
              <span className="font-bold text-slate-900">{rv.value || "R_____"}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 italic">
          Where an item is discontinued, VRG may use current replacement cost of an equivalent item. Does not prevent charging reasonable repair cost where appropriate.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 16-21. TECHNICAL, LATE RETURN, CANCELLATION, RESCHEDULING, DELIVERY */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8 agreement-avoid-break">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              16. Technical Problems
            </h2>
            <p className="text-xs text-slate-700">
              Stop use immediately if continued use could cause further damage. Contact VRG as soon as possible. Do not attempt repairs. Genuine equipment faults through no fault of Renter will be resolved reasonably subject to stock availability.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              17. Late Return
            </h2>
            <p className="text-xs text-slate-700">
              Must be returned at agreed date and time. Late return without prior approval incurs charges:{" "}
              <strong>Late Return Charge: R {data.lateReturnCharge || "_____"} per {data.lateReturnUnit || "hour"}</strong>.
              Additional costs resulting from impact on subsequent bookings may also apply.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              18. Cancellation
            </h2>
            <div className="text-xs text-slate-700 space-y-1">
              <p>• <strong>&gt; 7 days before:</strong> Cancellation or rescheduling may be requested.</p>
              <p>• <strong>3–7 days before:</strong> Rescheduling offered subject to availability; refund/charges depend on circumstances.</p>
              <p>• <strong>&lt; 72 hours before:</strong> Booking deposit retained for administrative/preparation costs.</p>
              <p>• <strong>No-show:</strong> Treated as cancelled; applicable charges retained.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              19. Rescheduling
            </h2>
            <p className="text-xs text-slate-700">
              Subject to equipment availability, acceptance of new date by VRG, and any applicable additional charges. Does not automatically guarantee availability.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              20. Delivery and Collection
            </h2>
            <p className="text-xs text-slate-700">
              Delivery Fee: <strong>R {data.deliveryFeeConfirmed || data.deliveryFee || "0.00"}</strong>. Authorised recipient must be present. Inaccurate address or unreasonable delays may incur waiting charges.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              21. Return Inspection
            </h2>
            <p className="text-xs text-slate-700">
              VRG will inspect, test, check serials/accessories, and photograph condition upon return. Where damage cannot be immediately identified, further inspection may be completed post-return.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 22-26. PRIVACY, MARKETING, LIABILITY, INDEMNITY, OWNERSHIP */}
      {/* ============================================================ */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8 agreement-avoid-break">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              22. Identification and Privacy
            </h2>
            <p className="text-xs text-slate-700">
              VRG collects identification only for legitimate rental administration, payments, and disputes. Original IDs will not be retained as security. Personal data handled under South African law including POPIA.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              23. Marketing and Photographs
            </h2>
            <p className="text-xs text-slate-700 mb-2">
              VRG will not automatically use photographs or recordings without permission.
            </p>
            <div className="space-y-1 text-xs mb-2">
              {renderBox(
                data.marketingConsent === true,
                () => onToggleCheck?.("marketingConsent", true),
                "I consent to VRG using promotional photos/videos in which I may be identifiable."
              )}
              <br />
              {renderBox(
                data.marketingConsent === false,
                () => onToggleCheck?.("marketingConsent", false),
                "I do not consent."
              )}
            </div>
            <div className="text-xs flex gap-4">
              <span>Name: {renderField(data.marketingName, "100px")}</span>
              <span>Signature: __________________</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              24. Liability &amp; 25. Indemnity
            </h2>
            <p className="text-xs text-slate-700 mb-1">
              VR activities involve inherent risks (loss of balance, collisions, dizziness, nausea). Renter is responsible for safe operation. VRG supplies functioning gear.
            </p>
            <p className="text-xs text-slate-700">
              To the extent permitted by SA law, Renter accepts responsibility for loss or damage arising from negligent, reckless, intentional or unauthorised use.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-950 border-b border-slate-300 pb-1 mb-1.5 uppercase tracking-wide">
              26. Ownership of Equipment
            </h2>
            <p className="text-xs text-slate-700">
              All equipment remains the property of Virtual Reality Guyz. Renter acquires only temporary right of use and no ownership rights.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 27-33. LEGAL CLAUSES SUMMARY */}
      {/* ============================================================ */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded mb-8 text-xs text-slate-700 space-y-1.5 agreement-avoid-break">
        <p>
          <strong>27. Failure to Return:</strong> If unreturned, VRG may take reasonable lawful steps to recover property and amounts owing.
        </p>
        <p>
          <strong>28. Default:</strong> Non-payment, intentional damage, refusal to return, or sub-renting constitutes breach of contract.
        </p>
        <p>
          <strong>29. Electronic Acceptance:</strong> Valid by handwritten signature, electronic signature, online booking system, or email confirmation.
        </p>
        <p>
          <strong>30. Changes:</strong> Must be in writing. Specific quotation terms prevail over general terms to extent of conflict.
        </p>
        <p>
          <strong>31. Dispute Resolution:</strong> Direct good-faith resolution first; statutory consumer rights preserved.
        </p>
        <p>
          <strong>32. Governing Law:</strong> Laws of the Republic of South Africa.
        </p>
        <p>
          <strong>33. Entire Agreement:</strong> Agreement, quotation, confirmation, and equipment schedule constitute entire contract.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 34. RENTER DECLARATION */}
      {/* ============================================================ */}
      <div className="mb-8 agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 uppercase tracking-wide">
          34. Renter Declaration
        </h2>
        <p className="text-xs text-slate-700 mb-2">
          By signing or electronically accepting this Agreement, I confirm that:
        </p>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            "I have provided accurate information.",
            "I have inspected the equipment or had a reasonable opportunity to inspect it.",
            "I understand that I am responsible for the equipment while in my possession.",
            "I understand the rules concerning damage, loss and theft.",
            "I understand that the equipment is for indoor use unless VRG provides written permission otherwise.",
            "I understand the safety requirements.",
            "I understand the cancellation and rescheduling terms.",
            "I understand the late-return provisions.",
            "I understand the payment and security-deposit arrangements.",
            "I agree to return all equipment and accessories at the agreed time.",
            "I have had the opportunity to ask questions about this Agreement before accepting it."
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {renderBox(
                data.declarations[idx] ?? true,
                () => onToggleDeclaration?.(idx)
              )}
              <span className="text-slate-800">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 35. HANDOVER CHECKLIST */}
      {/* ============================================================ */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          35. Handover Checklist
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs mb-3">
          <div>
            <span className="font-semibold block mb-1">Equipment Released:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "VR Headset(s)",
                "Controller(s)",
                "Head Strap(s)",
                "Charging Cable(s)",
                "Charging Plug(s)",
                "Carrying Case(s)",
                "Battery / Power Bank(s)",
                "Other Accessories"
              ].map((item, i) => (
                <div key={i}>
                  {renderBox(
                    data.handoverItemsReleased[item] ?? true,
                    () => onToggleHandoverItem?.(item),
                    item
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold block mb-1">Handover Condition:</span>
            <div className="space-y-1 mb-2">
              {renderBox(
                data.handoverCondition === "good",
                () => onToggleCheck?.("handoverCondition", "good"),
                "Good"
              )}
              <br />
              {renderBox(
                data.handoverCondition === "minor_marks",
                () => onToggleCheck?.("handoverCondition", "minor_marks"),
                "Minor existing marks noted"
              )}
              <br />
              {renderBox(
                data.handoverCondition === "existing_damage",
                () => onToggleCheck?.("handoverCondition", "existing_damage"),
                "Existing damage noted below"
              )}
            </div>

            <span className="font-semibold block mb-1">Verification Checks:</span>
            <div className="flex flex-wrap gap-3">
              {renderBox(data.photosTaken, () => onToggleCheck?.("photosTaken", !data.photosTaken), "Photos Taken")}
              {renderBox(data.idVerified, () => onToggleCheck?.("idVerified", !data.idVerified), "ID Verified")}
              {renderBox(data.bookingDepositPaidCheck, () => onToggleCheck?.("bookingDepositPaidCheck", !data.bookingDepositPaidCheck), "Deposit Paid")}
              {renderBox(data.securityDepositPaidCheck, () => onToggleCheck?.("securityDepositPaidCheck", !data.securityDepositPaidCheck), "Sec Deposit")}
              {renderBox(data.balancePaidCheck, () => onToggleCheck?.("balancePaidCheck", !data.balancePaidCheck), "Balance Paid")}
            </div>
          </div>
        </div>

        <div className="text-xs">
          <span className="font-semibold block mb-0.5">Handover Notes:</span>
          <p className="border-b border-slate-300 pb-1 text-slate-800">
            {data.handoverNotes || "All equipment sanitized, fully charged, tested working with latest firmware."}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 36. RETURN CHECKLIST */}
      {/* ============================================================ */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          36. Return Checklist
        </h2>
        <div className="flex flex-wrap gap-6 text-xs mb-3">
          <div>
            <span className="text-slate-600">Return Date:</span>{" "}
            {renderField(data.returnDate, "120px")}
          </div>
          <div>
            <span className="text-slate-600">Return Time:</span>{" "}
            {renderField(data.returnTime, "100px")}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs mb-3">
          <div>
            <span className="font-semibold block mb-1">Equipment Returned:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "VR Headset(s)",
                "Controller(s)",
                "Head Strap(s)",
                "Charging Cable(s)",
                "Charging Plug(s)",
                "Carrying Case(s)",
                "Battery / Power Bank(s)",
                "Other Accessories"
              ].map((item, i) => (
                <div key={i}>
                  {renderBox(
                    data.returnItemsReceived[item] ?? false,
                    () => onToggleReturnItem?.(item),
                    item
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold block mb-1">Return Inspection Status:</span>
            <div className="space-y-1">
              {renderBox(data.allEquipmentReturned, () => onToggleCheck?.("allEquipmentReturned", !data.allEquipmentReturned), "All Equipment Returned")}
              <br />
              {renderBox(data.equipmentTested, () => onToggleCheck?.("equipmentTested", !data.equipmentTested), "Equipment Tested Working")}
              <br />
              {renderBox(data.damageFound, () => onToggleCheck?.("damageFound", !data.damageFound), "Damage Found")}
              <br />
              {renderBox(data.missingEquipment, () => onToggleCheck?.("missingEquipment", !data.missingEquipment), "Missing Equipment")}
              <br />
              {renderBox(data.lateReturn, () => onToggleCheck?.("lateReturn", !data.lateReturn), "Late Return")}
            </div>
          </div>
        </div>

        <div className="text-xs">
          <span className="font-semibold block mb-0.5">Return Notes:</span>
          <p className="border-b border-slate-300 pb-1 text-slate-800">
            {data.returnNotes || "_____________________________________________________________________________________________"}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 37. SECURITY DEPOSIT SETTLEMENT */}
      {/* ============================================================ */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          37. Security Deposit Settlement
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
          <div>
            <span className="text-slate-600 block">Deposit Received:</span>
            <span className="font-bold">R {data.depositReceived || data.securityDeposit || "_____"}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Less Damage:</span>
            <span className="font-bold text-red-700">R {data.lessDamage || "0.00"}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Less Missing Gear:</span>
            <span className="font-bold text-red-700">R {data.lessMissing || "0.00"}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Less Late Charges:</span>
            <span className="font-bold text-red-700">R {data.lessLate || "0.00"}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Other Deductions:</span>
            <span className="font-bold text-red-700">R {data.otherDeductions || "0.00"}</span>
          </div>
          <div>
            <span className="text-slate-600 block">Total Deductions:</span>
            <span className="font-bold text-red-700">R {data.totalDeductions || "0.00"}</span>
          </div>
          <div className="bg-emerald-50 p-1.5 border border-emerald-300 rounded">
            <span className="text-emerald-900 block font-semibold">Amount Refunded:</span>
            <span className="font-extrabold text-emerald-700 text-sm">
              R {data.amountRefunded || data.securityDeposit || "_____"}
            </span>
          </div>
          <div>
            <span className="text-slate-600 block">Refund Date:</span>
            <span>{data.refundDate || "________________"}</span>
          </div>
        </div>
        <div className="text-xs">
          <span className="text-slate-600">Refund Method:</span>{" "}
          {renderField(data.refundMethod || "EFT / Cash", "160px")}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 38. SIGNATURES */}
      {/* ============================================================ */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-300 rounded agreement-avoid-break">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-4 uppercase tracking-wide">
          38. Signatures
        </h2>

        <div className="grid sm:grid-cols-2 gap-8 text-xs">
          {/* Renter Signature Block */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 uppercase">Renter</h3>
            <div>
              <span className="text-slate-600 block">Full Name:</span>
              <span className="font-semibold text-slate-900">{data.renterSignatureName || data.renterName || "_________________________________"}</span>
            </div>
            <div>
              <span className="text-slate-600 block">ID / Passport Number:</span>
              <span className="font-semibold text-slate-900">{data.renterSignatureId || data.renterId || "_________________________________"}</span>
            </div>
            <div className="pt-6 border-b border-slate-400">
              <span className="text-slate-400 italic block mb-1">Signature</span>
            </div>
            <div>
              <span className="text-slate-600">Date:</span>{" "}
              {renderField(data.renterSignatureDate || data.startDate, "120px")}
            </div>
          </div>

          {/* VRG Representative Signature Block */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 uppercase">
              Virtual Reality Guyz Representative
            </h3>
            <div>
              <span className="text-slate-600 block">Full Name:</span>
              <span className="font-semibold text-slate-900">{data.repSignatureName || "Virtual Reality Guyz Team"}</span>
            </div>
            <div>
              <span className="text-slate-600 block">Position:</span>
              <span className="font-semibold text-slate-900">{data.repSignaturePosition || "Operations & Event Lead"}</span>
            </div>
            <div className="pt-6 border-b border-slate-400">
              <span className="text-slate-400 italic block mb-1">Authorised Signature</span>
            </div>
            <div>
              <span className="text-slate-600">Date:</span>{" "}
              {renderField(data.repSignatureDate || data.startDate, "120px")}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 39. EMERGENCY / ALTERNATIVE CONTACT */}
      {/* ============================================================ */}
      <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded agreement-avoid-break text-xs">
        <h2 className="text-base font-bold text-slate-950 border-b border-slate-300 pb-1 mb-3 uppercase tracking-wide">
          39. Emergency / Alternative Contact
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-600">Name:</span>{" "}
            {renderField(data.emergencyName, "160px")}
          </div>
          <div>
            <span className="text-slate-600">Relationship to Renter:</span>{" "}
            {renderField(data.emergencyRelationship, "140px")}
          </div>
          <div>
            <span className="text-slate-600">Telephone:</span>{" "}
            {renderField(data.emergencyPhone, "160px")}
          </div>
          <div>
            <span className="text-slate-600">Alternative Telephone:</span>{" "}
            {renderField(data.emergencyAltPhone, "160px")}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DOCUMENT FOOTER & CONTROL */}
      {/* ============================================================ */}
      <div className="border-t-2 border-slate-900 pt-4 mt-8 text-xs text-slate-600 flex flex-wrap justify-between items-center agreement-avoid-break">
        <div>
          <p className="font-bold text-slate-900">Virtual Reality Guyz (Pty) Ltd</p>
          <p>Cape Town, Western Cape, South Africa • virtualrealityguyz.co.za</p>
          <p>WhatsApp/Tel: +27 71 780 0323 • Email: virtualrealityguyz@gmail.com</p>
        </div>
        <div className="text-right mt-2 sm:mt-0 text-[11px] text-slate-500">
          <p><strong>Agreement Version:</strong> {data.version}</p>
          <p><strong>Effective Date:</strong> {data.effectiveDate || "Immediate"}</p>
          <p><strong>Document ID:</strong> {data.agreementNumber || "VRG-RA-DRAFT"}</p>
        </div>
      </div>
    </div>
  )
}
