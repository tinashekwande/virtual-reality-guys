// VR headset & controller repair services.
// Prices are stored in USD (the source price list) and converted to ZAR at
// display time with USD_TO_ZAR. Update the rate here to re-price the whole page.

export const USD_TO_ZAR = 16.64

/** USD → ZAR, rounded to a retail price ending in 9 (e.g. R599). */
export function toZar(usd: number): number {
  return Math.max(9, Math.round((usd * USD_TO_ZAR) / 10) * 10 - 1)
}

export function formatZar(amount: number): string {
  return `R${amount.toLocaleString("en-ZA").replace(/ |,/g, " ")}`
}

export type RepairDevice =
  | "Quest 2"
  | "Quest 3"
  | "Quest 3S"
  | "Quest Pro"
  | "Quest 1"
  | "PSVR2"
  | "Valve Index"
  | "All headsets"

export type RepairVariant = { name: string; usd: number }

export type Repair = {
  id: string
  title: string
  device: RepairDevice
  kind: "Headset" | "Controller" | "Service"
  inStock: boolean
  variants: RepairVariant[]
  desc: string
}

const one = (usd: number): RepairVariant[] => [{ name: "Standard", usd }]

// Order matches the source "featured" order.
export const repairsData: Repair[] = [
  { id: "quest-2-controller-repair", title: "Quest 2 Controller Repair", device: "Quest 2", kind: "Controller", inStock: true,
    desc: "Fix drifting sticks, dead buttons, broken tracking rings and water damage on Quest 2 Touch controllers.",
    variants: [
      { name: "Joystick Repair", usd: 35.99 }, { name: "Grip Button / Trigger not working", usd: 39.99 },
      { name: "Motherboard Replacement", usd: 45.99 }, { name: "Ring Repair", usd: 45.99 },
      { name: "Other", usd: 49.99 }, { name: "Water Damage", usd: 55.99 }, { name: "Full Refurbishment", usd: 65.99 },
    ] },
  { id: "quest-3-controller-repair", title: "Quest 3 Controller Repair", device: "Quest 3", kind: "Controller", inStock: true,
    desc: "Repairs for Quest 3 Touch Plus controllers — stick drift, buttons, tracking, pairing and power faults.",
    variants: [
      { name: "Joystick Repair", usd: 39.99 }, { name: "Water Damage", usd: 45.99 },
      { name: "Motherboard Replacement", usd: 45.99 }, { name: "Grip Button / Trigger", usd: 45.99 },
      { name: "Buttons not working", usd: 45.99 }, { name: "Tracking issues", usd: 45.99 },
      { name: "Connectivity issues", usd: 45.99 }, { name: "Power up issues", usd: 45.99 }, { name: "Other", usd: 49.99 },
    ] },
  { id: "lens-refurbishment-quest-3", title: "Lens Refurbishment (Quest 3)", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Restores scratched or hazy Quest 3 lenses for a clearer picture.", variants: one(84.99) },
  { id: "priority-repair-service", title: "Priority Repair Service", device: "All headsets", kind: "Service", inStock: true,
    desc: "Add-on that moves your repair to the front of the queue. Priced per device.",
    variants: [
      { name: "Quest 2 Controller", usd: 29.99 }, { name: "Quest 3 Controller", usd: 29.99 },
      { name: "Quest 3S Controller", usd: 29.99 }, { name: "Quest 2", usd: 39.99 }, { name: "Quest 3", usd: 39.99 },
      { name: "Quest 3S", usd: 39.99 }, { name: "Quest Pro Controller", usd: 39.99 },
      { name: "Valve Index Controller", usd: 49.99 }, { name: "Quest Pro", usd: 99.99 },
    ] },
  { id: "quest-3-speaker-arm-repair", title: "Quest 3 Speaker Arm Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replaces a snapped or crackling Quest 3 speaker arm, with or without a new mounting ring.",
    variants: [{ name: "No Mounting Ring", usd: 149.99 }, { name: "OEM Ring", usd: 167.99 }, { name: "Metal Ring", usd: 183.99 }] },
  { id: "headset-cleaning", title: "Headset Cleaning", device: "All headsets", kind: "Service", inStock: true,
    desc: "A thorough clean of the lenses, facial interface and shell.",
    variants: ["Quest 1", "Quest 2", "Quest 3", "Quest Pro", "Rift"].map((name) => ({ name, usd: 19.99 })) },
  { id: "quest-3-charge-port-repair", title: "Quest 3 Charge Port Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "For a Quest 3 that won't charge or has a melted USB-C port.",
    variants: [{ name: "Charge Port Failure", usd: 183.99 }, { name: "Charge Port Melt", usd: 206.99 }] },
  { id: "quest-3-black-screen-repair", title: "Quest 3 Black Screen Repair (BSOD)", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Diagnosis and repair for a Quest 3 that powers on to a black screen.", variants: one(160.99) },
  { id: "quest-2-charge-port-repair", title: "Quest 2 Charge Port Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "For a Quest 2 that won't charge or has a melted USB-C port.",
    variants: [{ name: "Charge Port Failure", usd: 79.99 }, { name: "Charge Port Melt", usd: 84.99 }] },
  { id: "quest-2-black-screen-repair", title: "Quest 2 Black Screen Repair (BSOD)", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Diagnosis and repair for a Quest 2 stuck on a black screen.", variants: one(74.99) },
  { id: "quest-3-battery-replacement", title: "Quest 3 Battery Replacement Service", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "New battery for a Quest 3 that drains fast or won't hold a charge.", variants: one(172.99) },
  { id: "quest-3-fan-repair", title: "Quest 3 Fan Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Fixes a noisy, rattling or dead cooling fan on Quest 3.", variants: one(114.99) },
  { id: "quest-2-battery-replacement", title: "Quest 2 Battery Failure Replacement", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "New battery for a Quest 2 with poor battery life or charging faults.", variants: one(79.99) },
  { id: "quest-3-shell-frame", title: "Quest 3 Shell Frame", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replacement outer shell frame for a cracked or damaged Quest 3.", variants: one(59.99) },
  { id: "psvr2-joystick-repair-hall-effect", title: "PSVR 2 Joystick Repair - Upgraded Hall Effect", device: "PSVR2", kind: "Controller", inStock: true,
    desc: "Swaps worn PSVR2 Sense sticks for drift-resistant Hall effect joysticks.",
    variants: [{ name: "Right", usd: 64.99 }, { name: "Left", usd: 64.99 }, { name: "Both", usd: 94.99 }] },
  { id: "valve-index-joystick-repair", title: "Valve Index Joystick Repair", device: "Valve Index", kind: "Controller", inStock: true,
    desc: "Fixes stick drift on Valve Index (Knuckles) controllers.", variants: one(69.99) },
  { id: "quest-2-speaker-arm-repair", title: "Quest 2 Speaker Arm Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Replaces broken or silent Quest 2 speaker arms.",
    variants: [{ name: "One Speaker Arm", usd: 74.99 }, { name: "Both Speaker Arms", usd: 84.99 }] },
  { id: "quest-3s-bsod-repair", title: "Quest 3S BSOD Repair Service", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Diagnosis and repair for a Quest 3S stuck on a black screen.", variants: one(103.99) },
  { id: "tracking-camera-sensor-cable-l", title: "Tracking Camera Sensor Cable (L)", device: "Quest 3", kind: "Headset", inStock: false,
    desc: "Replaces the left tracking camera cable to restore lost tracking.", variants: one(29.99) },
  { id: "quest-3s-face-shield-repair", title: "Quest 3S Face Shield Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces a cracked or damaged Quest 3S face shield.", variants: one(68.99) },
  { id: "front-glass-panel-repair", title: "Front Glass Panel Center Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replaces cracked front glass on Quest 3 — centre or side panels.",
    variants: [{ name: "Center Glass", usd: 49.99 }, { name: "Side Glass", usd: 49.99 }] },
  { id: "quest-3s-speaker-arm-repair", title: "Quest 3S Speaker Arm Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces broken or silent Quest 3S speaker arms.",
    variants: [{ name: "Right", usd: 113.99 }, { name: "Left", usd: 113.99 }, { name: "Right & Left", usd: 137.99 }] },
  { id: "quest-3s-chargeport-repair", title: "Quest 3S Chargeport Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "For a Quest 3S that won't charge through its USB-C port.", variants: one(149.99) },
  { id: "quest-3-lcd-repair", title: "Quest 3 LCD Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replaces a dead, lined or burnt-in Quest 3 display.",
    variants: [{ name: "Left", usd: 183.99 }, { name: "Right", usd: 183.99 }, { name: "Both", usd: 229.99 }] },
  { id: "quest-3s-lcd-repair", title: "Quest 3S LCD Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces a faulty Quest 3S display.", variants: one(154.99) },
  { id: "quest-2-lcd-assembly", title: "Quest 2 LCD Assembly", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Full Quest 2 display assembly replacement.", variants: one(79.99) },
  { id: "quest-2-lcd-repair", title: "Quest 2 LCD Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Fixes a Quest 2 screen showing lines, dead spots or sun damage.", variants: one(79.99) },
  { id: "quest-2-head-strap-retainer", title: "Quest 2 Head Strap Retainer Replacement", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Replaces the broken clip that holds the Quest 2 strap in place.", variants: one(39.99) },
  { id: "quest-2-camera-repair", title: "Quest 2 Camera Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Fixes faulty Quest 2 tracking cameras and lost-tracking errors.", variants: one(69.99) },
  { id: "quest-2-microphone-repair", title: "Quest 2 Microphone Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Restores a Quest 2 microphone that others can't hear.", variants: one(54.99) },
  { id: "quest-3s-cooling-fan-repair", title: "Quest 3S Cooling Fan Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Fixes a noisy or dead Quest 3S cooling fan.", variants: one(75.99) },
  { id: "quest-3s-camera-repair-cable", title: "Quest 3S Camera Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Restores Quest 3S tracking by repairing the IR camera cable.", variants: one(103.99) },
  { id: "quest-2-fan-repair", title: "Quest 2 Fan Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Fixes a noisy, rattling or dead Quest 2 fan.", variants: one(65.99) },
  { id: "quest-3-speaker-mounting-ring", title: "Quest 3 Speaker Mounting Ring Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replaces the cracked ring that holds the Quest 3 speaker arm.",
    variants: [{ name: "OEM Ring", usd: 131.99 }, { name: "Metal Ring", usd: 137.99 }] },
  { id: "lens-refurbishment-quest-3s", title: "Lens Refurbishment (Quest 3S)", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Restores scratched or hazy Quest 3S lenses.", variants: one(29.99) },
  { id: "psvr2-cable-repair", title: "Playstation VR2 Cable Repair Service", device: "PSVR2", kind: "Headset", inStock: false,
    desc: "Repairs a damaged PSVR2 headset cable.", variants: one(150.0) },
  { id: "quest-3-depth-sensor-repair", title: "Quest 3 Camera Depth Sensor Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Fixes a faulty Quest 3 depth sensor affecting room scanning and mixed reality.", variants: one(160.0) },
  { id: "quest-2-motherboard-repair", title: "Quest 2 Motherboard Replacement/Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Motherboard repair or swap for a Quest 2 that won't boot.", variants: one(99.0) },
  { id: "quest-3s-bootloop", title: "Quest 3S Bootloop Resolution", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Fixes a Quest 3S that keeps restarting on the logo screen.", variants: one(103.99) },
  { id: "quest-3-volume-mic-repair", title: "Quest 3 Volume & Microphone Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Repairs Quest 3 volume buttons and microphone faults.", variants: one(109.99) },
  { id: "psvr2-sense-controller-repair", title: "PSVR2 Sense Controller Repair", device: "PSVR2", kind: "Controller", inStock: true,
    desc: "Repairs for PSVR2 Sense controllers — drift, buttons, triggers and charging.",
    variants: [
      { name: "Joystick Drift", usd: 64.99 }, { name: "Buttons & Triggers", usd: 79.99 },
      { name: "Charging", usd: 79.99 }, { name: "Other / Not Sure", usd: 79.99 },
    ] },
  { id: "quest-3s-microphone-repair", title: "Quest 3S Microphone Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Restores a Quest 3S microphone that isn't picking up your voice.", variants: one(49.99) },
  { id: "quest-3s-speaker-mounting-ring", title: "Quest 3S Speaker Arm Mounting Ring Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces cracked Quest 3S speaker arm mounting rings.",
    variants: [{ name: "Right", usd: 84.99 }, { name: "Left", usd: 84.99 }, { name: "Right & Left", usd: 149.99 }] },
  { id: "psvr2-headset-repair", title: "PSVR2 Headset Repair", device: "PSVR2", kind: "Headset", inStock: true,
    desc: "PSVR2 headset repairs — display, lenses, cameras, power, audio and headband.",
    variants: [
      "Display / Black Screen", "Lens Replacement", "Tracking Cameras",
      "Power / Won't Turn On", "Audio & Microphone", "Headband & Adjustment",
    ].map((name) => ({ name, usd: 119.99 })) },
  { id: "quest-3-motherboard-repair", title: "Quest 3 Motherboard Repair/Replacement", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Motherboard repair or swap for a Quest 3 that won't boot.",
    variants: [{ name: "128 GB", usd: 179.99 }, { name: "512 GB", usd: 239.99 }] },
  { id: "quest-pro-controller-repair", title: "Quest Pro Controller Repair", device: "Quest Pro", kind: "Controller", inStock: true,
    desc: "Repairs for Quest Pro controllers — drift, buttons, tracking and charging.",
    variants: [
      { name: "Joystick Drift", usd: 75.99 }, { name: "Buttons & Triggers", usd: 89.99 },
      { name: "Tracking", usd: 89.99 }, { name: "Charging", usd: 89.99 }, { name: "Other / Not Sure", usd: 89.99 },
    ] },
  { id: "quest-pro-repair-diagnostics", title: "Meta Quest Pro Repair and Diagnostics", device: "Quest Pro", kind: "Headset", inStock: true,
    desc: "Full diagnosis and repair for Meta Quest Pro headsets.", variants: one(479.99) },
  { id: "quest-3s-battery-repair", title: "Quest 3S Battery Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "New battery for a Quest 3S that drains fast or won't charge.", variants: one(109.99) },
  { id: "quest-3-audio-jack-repair", title: "Quest 3 Auxiliary/Audio Jack Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Fixes a Quest 3 headphone jack with no or crackling sound.", variants: one(99.99) },
  { id: "quest-3s-cracked-lens-repair", title: "Quest 3S Cracked & Shattered Lens Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces cracked or shattered Quest 3S lenses.",
    variants: [{ name: "Left", usd: 75.0 }, { name: "Right", usd: 75.0 }, { name: "Both", usd: 120.0 }] },
  { id: "lens-refurbishment-quest-2", title: "Lens Refurbishment (Quest 2)", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Restores scratched or hazy Quest 2 lenses.", variants: one(34.99) },
  { id: "quest-3s-shell-frame-repair", title: "Quest 3S Shell Frame Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replacement shell frame for a cracked Quest 3S.", variants: one(89.99) },
  { id: "quest-3-shell-frame-repair", title: "Quest 3 Shell Frame Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Shell frame repair for a cracked or damaged Quest 3.", variants: one(139.99) },
  { id: "quest-2-controller-ring-frame", title: "Quest 2 Controller Inner Ring Frame Repair", device: "Quest 2", kind: "Controller", inStock: true,
    desc: "Replaces the broken inner tracking ring frame on a Quest 2 controller.", variants: one(45.99) },
  { id: "quest-2-face-shield-proximity", title: "Quest 2 Face Shield With Proximity Sensor Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Replaces the Quest 2 face shield, including the proximity sensor.", variants: one(49.99) },
  { id: "quest-3s-volume-action-button", title: "Quest 3S Volume & Action Button Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Fixes stuck or unresponsive Quest 3S volume and action buttons.", variants: one(79.99) },
  { id: "quest-3s-face-plate-repair", title: "Quest 3S Face Plate Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces a cracked or scratched Quest 3S front face plate.", variants: one(49.99) },
  { id: "quest-3s-motherboard-repair", title: "Quest 3S Motherboard Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Motherboard repair or swap for a Quest 3S that won't boot.",
    variants: [{ name: "128 GB", usd: 124.99 }, { name: "256 GB", usd: 134.99 }] },
  { id: "quest-3-ipd-repair", title: "Quest 3 IPD (Inter-Pupillary Distance) Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Fixes a stuck or loose Quest 3 lens-spacing (IPD) adjuster.", variants: one(80.0) },
  { id: "quest-2-front-plate", title: "Quest 2 Front Plate Replacement", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Replaces a cracked or scuffed Quest 2 front plate.", variants: one(39.99) },
  { id: "quest-no-command-fix", title: "Software Resolution and Troubleshooting (Quest No Command Error Fix)", device: "Quest 2", kind: "Service", inStock: true,
    desc: "Software recovery for a Quest stuck on the \"No Command\" error.", variants: one(72.99) },
  { id: "quest-3s-camera-repair", title: "Quest 3S Camera Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Fixes faulty Quest 3S cameras and tracking errors.", variants: one(103.99) },
  { id: "quest-3-frame-replacement", title: "Quest 3 Frame Replacement", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Full frame replacement for a structurally damaged Quest 3.", variants: one(139.99) },
  { id: "quest-1-screen-repair", title: "Quest 1 Screen Repair", device: "Quest 1", kind: "Headset", inStock: true,
    desc: "Display repair for the original Oculus Quest.", variants: one(99.99) },
  { id: "quest-3s-security-bezel", title: "Quest 3S Security Bezel Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Replaces a damaged Quest 3S security bezel.", variants: one(49.99) },
  { id: "quest-3s-bluetooth-antenna", title: "Quest 3S Bluetooth Antenna Repair", device: "Quest 3S", kind: "Headset", inStock: true,
    desc: "Fixes Quest 3S Bluetooth and controller connection drop-outs.", variants: one(49.99) },
  { id: "quest-3-face-shield-repair", title: "Quest 3 Face Shield Repair", device: "Quest 3", kind: "Headset", inStock: true,
    desc: "Replaces a cracked or damaged Quest 3 face shield.", variants: one(137.94) },
  { id: "quest-2-bluetooth-repair", title: "Quest 2 Bluetooth Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Fixes Quest 2 Bluetooth pairing and controller connection drop-outs.", variants: one(49.99) },
  { id: "quest-2-head-strap-connection", title: "Quest 2 Head-strap Connection Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Repairs the broken point where the strap joins the Quest 2 headset.", variants: one(45.99) },
  { id: "quest-2-cracked-shell", title: "Quest 2 Cracked Shell Repair", device: "Quest 2", kind: "Headset", inStock: true,
    desc: "Repairs a cracked Quest 2 outer shell.", variants: one(99.0) },
]

export function fromPriceZar(r: Repair): number {
  return Math.min(...r.variants.map((v) => toZar(v.usd)))
}

export const repairDevices: RepairDevice[] = [
  "Quest 2", "Quest 3", "Quest 3S", "Quest Pro", "PSVR2", "Valve Index", "Quest 1", "All headsets",
]

// ---------------------------------------------------------------------------
// Device photos — openly licensed images from Wikimedia Commons, served from
// Wikimedia. Credits are shown on the page (required by CC BY / CC BY-SA).
// Quest Pro has no free photo on Commons, so those cards keep their icon.

export type RepairPhoto = {
  src: string
  alt: string
  author: string
  license: string
  licenseUrl?: string
  source: string
}

const thumb = (hashPath: string, file: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${hashPath}/${file}/500px-${file}`

const BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/"
const BY = "https://creativecommons.org/licenses/by/4.0/"

export const repairPhotos: Record<string, RepairPhoto> = {
  quest2: { src: thumb("f/f1", "Meta_quest_2_03.jpg"), alt: "Meta Quest 2 headset", author: "Wasiul Bahar", license: "CC BY-SA 4.0", licenseUrl: BY_SA, source: "https://commons.wikimedia.org/wiki/File:Meta_quest_2_03.jpg" },
  quest2Controller: { src: thumb("9/90", "Budget_Oculus_Touch_Controller_Picture.jpg"), alt: "Quest 2 Touch controllers", author: "AContributor2077", license: "CC BY-SA 4.0", licenseUrl: BY_SA, source: "https://commons.wikimedia.org/wiki/File:Budget_Oculus_Touch_Controller_Picture.jpg" },
  quest3: { src: thumb("8/85", "Meta_Quest_3_-_3.jpg"), alt: "Meta Quest 3 headset", author: "Kyu3a", license: "CC BY-SA 4.0", licenseUrl: BY_SA, source: "https://commons.wikimedia.org/wiki/File:Meta_Quest_3_-_3.jpg" },
  quest3Controller: { src: thumb("1/13", "Meta_Quest_3S_controllers.jpg"), alt: "Meta Quest Touch Plus controllers", author: "Jakub T. Jankiewicz", license: "CC BY-SA 4.0", licenseUrl: BY_SA, source: "https://commons.wikimedia.org/wiki/File:Meta_Quest_3S_controllers.jpg" },
  quest3s: { src: thumb("5/54", "Meta_Quest_3S_left_side.jpg"), alt: "Meta Quest 3S headset", author: "Jakub T. Jankiewicz", license: "CC BY-SA 4.0", licenseUrl: BY_SA, source: "https://commons.wikimedia.org/wiki/File:Meta_Quest_3S_left_side.jpg" },
  quest1: { src: thumb("e/ec", "Oculus_Quest.jpeg"), alt: "Original Oculus Quest headset", author: "Syced", license: "CC0 (public domain)", source: "https://commons.wikimedia.org/wiki/File:Oculus_Quest.jpeg" },
  psvr2: { src: thumb("1/16", "PlayStation_VR2.jpg"), alt: "PlayStation VR2 headset", author: "ArlindoPereira", license: "CC BY 4.0", licenseUrl: BY, source: "https://commons.wikimedia.org/wiki/File:PlayStation_VR2.jpg" },
  psvr2Controller: { src: thumb("7/7e", "PlayStation_VR2_Sense_Controllers.jpg"), alt: "PlayStation VR2 Sense controllers", author: "GeorgeM2011", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:PlayStation_VR2_Sense_Controllers.jpg" },
  valveIndex: { src: thumb("c/c5", "Air_Force_officer_using_Valve_Index.jpg"), alt: "Valve Index headset in use", author: "Airman 1st Class Robyn Hunsinger, U.S. Air Force", license: "Public domain", source: "https://commons.wikimedia.org/wiki/File:Air_Force_officer_using_Valve_Index.jpg" },
  questSet: { src: thumb("2/28", "Meta_Quest_3s_with_controllers.jpg"), alt: "Meta Quest headset with controllers", author: "Loafhouse", license: "CC BY 4.0", licenseUrl: BY, source: "https://commons.wikimedia.org/wiki/File:Meta_Quest_3s_with_controllers.jpg" },
}

export function photoFor(r: Repair): RepairPhoto | null {
  const c = r.kind === "Controller"
  switch (r.device) {
    case "Quest 2": return c ? repairPhotos.quest2Controller : repairPhotos.quest2
    case "Quest 3": return c ? repairPhotos.quest3Controller : repairPhotos.quest3
    case "Quest 3S": return c ? repairPhotos.quest3Controller : repairPhotos.quest3s
    case "Quest 1": return repairPhotos.quest1
    case "PSVR2": return c ? repairPhotos.psvr2Controller : repairPhotos.psvr2
    case "Valve Index": return repairPhotos.valveIndex
    case "All headsets": return repairPhotos.questSet
    default: return null // Quest Pro — no free photo available
  }
}
