"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Orbit,
  HeartPulse,
  Atom,
  Globe2,
  Landmark,
  Cpu,
  Compass,
  CheckCircle2,
  Sparkles,
  Code2,
  ArrowRight,
  ExternalLink,
  Layers,
  Filter,
} from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import type { EnquiryMode } from "@/components/SchoolVrEnquiryForm"

export type AvailabilityLabel =
  | "Available Experience"
  | "Proposed Experience"
  | "Custom Development Enquiry"

export interface CatalogueItem {
  title: string
  status: AvailabilityLabel
  grades: string
  curriculumFocus: string
  description: string
  whatLearnersExplore: string[]
  catalogueHref?: string
  subjectName: string
}

export interface SubjectCategory {
  id: string
  name: string
  shortName: string
  tagline: string
  capsAreas: string
  iconName: "orbit" | "biology" | "physics" | "geography" | "history" | "engineering" | "math"
  image: string
  imageAlt: string
  items: CatalogueItem[]
}

export function triggerSchoolEnquiry(
  mode: EnquiryMode,
  options?: { topic?: string; subject?: string }
) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent("select-school-enquiry-mode", {
      detail: {
        mode,
        topic: options?.topic,
        subject: options?.subject,
      },
    })
  )
  const targetHash = mode === "custom" ? "#propose-custom-vr" : "#book-school-demo"
  if (window.history?.replaceState) {
    window.history.replaceState(null, "", targetHash)
  }
  const el = document.getElementById("enquiry-section")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

interface SchoolEnquiryJumpButtonProps {
  mode: EnquiryMode
  topic?: string
  subject?: string
  variant?: "primary" | "secondary" | "outline" | "inline"
  size?: "sm" | "default" | "lg"
  children: React.ReactNode
  className?: string
}

export function SchoolEnquiryJumpButton({
  mode,
  topic,
  subject,
  variant = "primary",
  size = "default",
  children,
  className = "",
}: SchoolEnquiryJumpButtonProps) {
  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={() => triggerSchoolEnquiry(mode, { topic, subject })}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all cursor-pointer ${className}`}
      >
        {children}
      </button>
    )
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => triggerSchoolEnquiry(mode, { topic, subject })}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent hover:underline transition-colors cursor-pointer text-left ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <CyberButton
      type="button"
      variant={variant === "secondary" ? "secondary" : "primary"}
      size={size}
      onClick={() => triggerSchoolEnquiry(mode, { topic, subject })}
      className={className}
    >
      {children}
    </CyberButton>
  )
}

const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    id: "space-astronomy",
    name: "Space and Astronomy",
    shortName: "Space & Astronomy",
    tagline: "Explore planets, moons, stars, galaxies and the solar system at true three-dimensional scale.",
    capsAreas: "CAPS Natural Sciences (Planet Earth & Beyond, Grades 4–9) • Physical Sciences & Geography",
    iconName: "orbit",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Immersive 3D solar system and planetary astronomy VR environment for learners",
    items: [
      {
        title: "Journey through the Solar System (Built In-House)",
        status: "Available Experience",
        grades: "Grades 4–7",
        curriculumFocus: "Sun, 8 Planets, Moons, Asteroid Belt & Descent to Cape Town",
        description:
          "Our in-house narrated WebXR experience where learners fly past the Sun, all eight planets, their moons, and the asteroid belt, dive through Saturn's rings, descend from orbit to Cape Town, and complete a 5-question interactive quiz.",
        whatLearnersExplore: [
          "Interactive tap-to-discover planet facts, Saturn ring dive, and whole-solar-system fly-throughs",
          "Descent from space onto the Cape Peninsula followed by a built-in 5-question curriculum quiz",
        ],
        catalogueHref: "/experiences/solar-system/index.html",
        subjectName: "Space & Astronomy",
      },
      {
        title: "Cosmic XR & Titans of Space PLUS",
        status: "Available Experience",
        grades: "Grades 4–12",
        curriculumFocus: "Solar System Scale, Planetary Orbits & Stellar Evolution",
        description:
          "Learners step inside an interactive three-dimensional model of our solar system to compare planet volumes, inspect moons, and observe orbital paths in real time.",
        whatLearnersExplore: [
          "Relative scale of terrestrial planets, gas giants, and supergiant stars",
          "Orbital mechanics, gravity wells, and moon phases in 3D space",
        ],
        catalogueHref: "/vr-games-catalogue/titans-of-space",
        subjectName: "Space & Astronomy",
      },
      {
        title: "Mission: ISS & Apollo 11 VR",
        status: "Available Experience",
        grades: "Grades 6–12",
        curriculumFocus: "Space Exploration, Zero-Gravity Physics & Orbital Living",
        description:
          "Experience astronaut operations aboard the International Space Station or retrace the historic 1969 lunar landing from launch to moonwalk.",
        whatLearnersExplore: [
          "Zero-gravity locomotion, EVA spacewalks, and robotic spacecraft docking",
          "Historical Apollo telemetry, spacecraft engineering, and lunar surface geology",
        ],
        catalogueHref: "/vr-games-catalogue/mission-iss",
        subjectName: "Space & Astronomy",
      },
      {
        title: "Earth–Moon–Sun Seasonality & Southern Sky Simulator",
        status: "Proposed Experience",
        grades: "Grades 4–9 (Intermediate & Senior Phase)",
        curriculumFocus: "Earth's Tilt, Seasons, Eclipses & Southern Hemisphere Astronomy",
        description:
          "A curriculum-informed concept designed to help South African learners manipulate Earth's 23.5° axial tilt, test day/night length across seasons, and view constellations from the Southern Hemisphere.",
        whatLearnersExplore: [
          "Interactive slider controlling Earth's orbit to see why summer and winter occur",
          "Solar and lunar eclipse alignment from both orbital and Southern African ground perspectives",
        ],
        subjectName: "Space & Astronomy",
      },
    ],
  },
  {
    id: "human-biology",
    name: "Human Biology and Life Sciences",
    shortName: "Human Biology & Life Sciences",
    tagline: "Explore the human body, organs, cells, biological systems and living organisms from the inside.",
    capsAreas: "CAPS Natural Sciences (Life & Living, Grades 4–9) • FET Life Sciences (Grades 10–12)",
    iconName: "biology",
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=900&q=80",
    imageAlt: "3D human anatomy, cellular biology and circulatory system virtual reality visual",
    items: [
      {
        title: "Human Anatomy VR",
        status: "Available Experience",
        grades: "Grades 7–12",
        curriculumFocus: "Skeletal, Muscular, Cardiovascular & Organ Systems",
        description:
          "Inspect a layered 3D anatomical model of the human body. Learners can isolate skeletal structures, peel back muscle layers, and examine organs from any angle without flat-diagram distortion.",
        whatLearnersExplore: [
          "3D spatial relationships between the heart, lungs, digestive organs, and skeleton",
          "Layer-by-layer anatomical inspection for Senior and FET Life Sciences",
        ],
        catalogueHref: "/vr-games-catalogue/human-anatomy-vr",
        subjectName: "Human Biology & Life Sciences",
      },
      {
        title: "Cellverse & Inside COVID-19",
        status: "Available Experience",
        grades: "Grades 8–12",
        curriculumFocus: "Cellular Structure, Organelles, DNA Translation & Immune Response",
        description:
          "Shrink to a microscopic scale to enter a living human cell, identify organelles such as mitochondria and ribosomes, and observe how viruses interact with respiratory cells.",
        whatLearnersExplore: [
          "Navigating inside cell membranes to locate nuclei, endoplasmic reticulum, and mitochondria",
          "Visualising molecular processes and white blood cell immune defence",
        ],
        catalogueHref: "/vr-games-catalogue/cellverse",
        subjectName: "Human Biology & Life Sciences",
      },
      {
        title: "Interactive Human Circulatory, Digestive & Nervous System Journeys",
        status: "Custom Development Enquiry",
        grades: "Grades 9–12 (Senior & FET Phase)",
        curriculumFocus: "Pulmonary/Systemic Circulation, Nutrient Absorption & Reflex Arcs",
        description:
          "Schools can propose dedicated modules tracing oxygenated blood through heart valves, following enzymatic digestion through the alimentary canal, or visualising synaptic transmission along a reflex arc.",
        whatLearnersExplore: [
          "Step-by-step journeys through the four chambers of the human heart and alveoli gas exchange",
          "Interactive villas, peristalsis, and neural impulse propagation tailored to classroom objectives",
        ],
        subjectName: "Human Biology & Life Sciences",
      },
    ],
  },
  {
    id: "natural-sciences-physics",
    name: "Natural Sciences and Physics",
    shortName: "Natural Sciences & Physics",
    tagline: "Visualise scientific phenomena, forces, energy, electricity and abstract laboratory concepts safely.",
    capsAreas: "CAPS Natural Sciences (Energy & Change, Matter & Materials, Grades 4–9) • Physical Sciences (Grades 10–12)",
    iconName: "physics",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Virtual science laboratory for chemistry titrations and physics experiments in VR",
    items: [
      {
        title: "10K Science & Virtual Lab Chemistry",
        status: "Available Experience",
        grades: "Grades 7–12",
        curriculumFocus: "Chemical Reactions, Titrations, Periodic Elements & Lab Safety",
        description:
          "Conduct virtual chemistry and biology experiments in a hazard-free 3D laboratory—ideal for schools wanting to supplement physical lab equipment or practice chemical procedures safely.",
        whatLearnersExplore: [
          "Handling virtual glassware, pipettes, Bunsen burners, and periodic reagents",
          "Observing molecular bonding and reaction outcomes without consumable waste or risk",
        ],
        catalogueHref: "/vr-games-catalogue/virtual-lab-chem",
        subjectName: "Natural Sciences & Physics",
      },
      {
        title: "Hallo Einstein (Relativity & Mechanics Study)",
        status: "Available Experience",
        grades: "Grades 8–12",
        curriculumFocus: "Motion, Velocity, Gravity & Theoretical Physics Foundations",
        description:
          "Step into Albert Einstein's study to experiment with velocity blocks, time dilation concepts, and foundational physics puzzles.",
        whatLearnersExplore: [
          "Interactive thought experiments illustrating frame of reference, speed of light, and gravity",
          "Hands-on physics problem-solving in a guided historical environment",
        ],
        catalogueHref: "/vr-games-catalogue/hallo-einstein",
        subjectName: "Natural Sciences & Physics",
      },
      {
        title: "Interactive Electric Circuits, Electromagnetism & Energy Transfer Lab",
        status: "Proposed Experience",
        grades: "Grades 6–12",
        curriculumFocus: "Series & Parallel Circuits, Ohm's Law, Magnetic Fields & Power Generation",
        description:
          "A proposed interactive physics environment where learners build series and parallel circuits, visualise electron flow and voltage drops in 3D, and inspect magnetic flux lines around solenoids and generators.",
        whatLearnersExplore: [
          "Seeing current, resistance, and voltage changes dynamically as components are connected",
          "Three-dimensional magnetic field lines and electromagnetic induction inside a dynamo",
        ],
        subjectName: "Natural Sciences & Physics",
      },
    ],
  },
  {
    id: "geography-earth-sciences",
    name: "Geography and Earth Sciences",
    shortName: "Geography & Earth Sciences",
    tagline: "Explore landscapes, geological structures, ecosystems, weather systems and the natural environment.",
    capsAreas: "CAPS Social Sciences: Geography (Grades 4–9) • FET Geography & Earth Sciences (Grades 10–12)",
    iconName: "geography",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Immersive geological formations, mountain topography and ecosystems in educational VR",
    items: [
      {
        title: "Dive into the Great African Seaforest — Cape Town Kelp Forest (Built In-House)",
        status: "Available Experience",
        grades: "Grades 4–7",
        curriculumFocus: "South African Marine Ecosystems, Food Webs & Biodiversity",
        description:
          "Our in-house narrated WebXR experience opening with a helicopter flight over Cape Town before diving into the Great African Seaforest to explore sea bamboo, Cape fur seals, reefs, an octopus, shysharks, and a sevengill shark.",
        whatLearnersExplore: [
          "Indigenous Cape Town kelp forest biodiversity, predator-prey relationships, and marine habitats",
          "Interactive discovery points with voice narration and a 5-question comprehension quiz",
        ],
        catalogueHref: "/experiences/kelp-forest/index.html",
        subjectName: "Geography & Earth Sciences",
      },
      {
        title: "Google Earth VR & National Geographic Explore VR",
        status: "Available Experience",
        grades: "Grades 4–12",
        curriculumFocus: "Topography, Geomorphology, Glaciology & Global Landforms",
        description:
          "Fly over mountain ranges, river basins, fault lines, and coastlines worldwide—including Table Mountain, the Drakensberg escarpment, and Antarctica—to study landforms at true relief scale.",
        whatLearnersExplore: [
          "Inspecting river valleys, meanders, drainage basins, and coastal erosion in 3D terrain",
          "Experiencing polar ice shelves and high-altitude environments first-hand",
        ],
        catalogueHref: "/vr-games-catalogue/google-earth-vr",
        subjectName: "Geography & Earth Sciences",
      },
      {
        title: "Ecosphere, The Blue & Ocean Acidification VR",
        status: "Available Experience",
        grades: "Grades 5–12",
        curriculumFocus: "Marine Ecosystems, Coral Reefs, Climate Change & Biodiversity",
        description:
          "Dive into marine ecosystems and terrestrial biomes to observe food webs, coral reef chemistry under rising carbon levels, and wildlife conservation work.",
        whatLearnersExplore: [
          "How ocean pH changes affect calcifying organisms and coral reef biodiversity",
          "Field conservation across African savannas, rainforests, and deep-ocean habitats",
        ],
        catalogueHref: "/vr-games-catalogue/ocean-acidification",
        subjectName: "Geography & Earth Sciences",
      },
      {
        title: "South African Biomes, Water Cycle & Geological Formations",
        status: "Custom Development Enquiry",
        grades: "Grades 4–12",
        curriculumFocus: "Fynbos & Karoo Biomes, Catchment Management, Weathering & Plate Tectonics",
        description:
          "Schools can propose tailored South African geography environments—such as an interactive water cycle and catchment simulation, cross-sections of geological strata, or virtual field trips through indigenous biomes.",
        whatLearnersExplore: [
          "Following precipitation, runoff, infiltration, and transpiration across a South African river basin",
          "Examining rock strata, folding, faulting, and indigenous ecosystem adaptations",
        ],
        subjectName: "Geography & Earth Sciences",
      },
    ],
  },
  {
    id: "history-heritage",
    name: "History and Heritage",
    shortName: "History & Heritage",
    tagline: "Experience historical environments, important events, South African heritage and ancient civilisations.",
    capsAreas: "CAPS Social Sciences: History (Grades 4–9) • FET History (Grades 10–12)",
    iconName: "history",
    image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Historical heritage reconstruction and archaeological exploration in virtual reality",
    items: [
      {
        title: "Anne Frank House VR",
        status: "Available Experience",
        grades: "Grades 8–12",
        curriculumFocus: "World War II, Human Rights, Historical Empathy & Primary Sources",
        description:
          "Walk through the historically reconstructed Secret Annex in Amsterdam where Anne Frank and her family hid during World War II, accompanied by archival diary excerpts.",
        whatLearnersExplore: [
          "Spatial awareness of life in hiding and historical context for Grade 9 & FET History",
          "Connecting primary historical texts with a 1:1 reconstructed environment",
        ],
        catalogueHref: "/vr-games-catalogue/anne-frank-vr",
        subjectName: "History & Heritage",
      },
      {
        title: "Great Pyramid VR, Nefertiti Tomb & Colosseum VR",
        status: "Available Experience",
        grades: "Grades 5–11",
        curriculumFocus: "Ancient Egypt, Classical Civilisations, Archaeology & Architecture",
        description:
          "Enter laser-scanned Egyptian tombs, navigate the internal chambers of the Great Pyramid of Giza, or stand on the floor of the Roman Colosseum.",
        whatLearnersExplore: [
          "Ancient Egyptian beliefs, tomb hieroglyphics, and pyramid engineering (Grade 5 CAPS link)",
          "Classical architecture, archaeological preservation, and ancient social structures",
        ],
        catalogueHref: "/vr-games-catalogue/great-pyramid",
        subjectName: "History & Heritage",
      },
      {
        title: "Mapungubwe & South African Heritage Reconstructions",
        status: "Proposed Experience",
        grades: "Grades 5–12",
        curriculumFocus: "Kingdom of Mapungubwe, Early Southern African Societies & Local Heritage",
        description:
          "We are eager to collaborate with South African educators to develop immersive historical environments centred on local curriculum milestones—such as the Kingdom of Mapungubwe, Great Zimbabwe trade routes, or key moments in South African history.",
        whatLearnersExplore: [
          "Exploring spatial reconstructions of Mapungubwe Hill, gold artefacts, and Indian Ocean trade links",
          "Experiencing South African historical sites that learners may not be able to visit in person",
        ],
        subjectName: "History & Heritage",
      },
    ],
  },
  {
    id: "engineering-technology",
    name: "Engineering and Technology",
    shortName: "Engineering & Technology",
    tagline: "Explore machinery, industrial systems, construction, infrastructure and engineering concepts.",
    capsAreas: "CAPS Natural Sciences & Technology (Grades 4–6) • Senior Phase Technology (Grades 7–9) • EGD / Civil & Electrical Technology",
    iconName: "engineering",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Engineering systems, water treatment infrastructure and industrial technology VR simulation",
    items: [
      {
        title: "Shuttle Commander & Sky Overview 360",
        status: "Available Experience",
        grades: "Grades 7–12",
        curriculumFocus: "Aerospace Engineering, Flight Instrumentation & Satellite Telemetry",
        description:
          "Inspect orbital satellite networks, cockpit instrumentation, and robotic deployment mechanisms used to service the Hubble Space Telescope.",
        whatLearnersExplore: [
          "Aerospace control surfaces, telemetry displays, and mechanical payload deployment",
          "Earth observation satellite orbits and global infrastructure mapping",
        ],
        catalogueHref: "/vr-games-catalogue/shuttle-commander",
        subjectName: "Engineering & Technology",
      },
      {
        title: "Virtual Water Treatment & Purification Plant Walkthrough",
        status: "Proposed Experience",
        grades: "Grades 6–12",
        curriculumFocus: "Water Purification Processes, Municipal Infrastructure & Environmental Engineering",
        description:
          "A proposed immersive walkthrough taking learners inside a full-scale water treatment works—from raw water intake and flocculation to sand filtration, chlorination, and quality testing.",
        whatLearnersExplore: [
          "Stepping inside sedimentation tanks and filter beds that are unsafe or inaccessible on physical tours",
          "Understanding how mechanical, chemical, and biological stages produce clean drinking water",
        ],
        subjectName: "Engineering & Technology",
      },
      {
        title: "Power Station, Renewable Energy & Mechanical Systems Simulator",
        status: "Custom Development Enquiry",
        grades: "Grades 7–12",
        curriculumFocus: "Thermal/Hydro/Solar Power Generation, Hydraulics, Gears & Structural Loads",
        description:
          "Schools and technical educators can propose interactive engineering modules—such as tracing energy conversion inside a power station turbine, testing hydraulic linkages, or inspecting structural trusses.",
        whatLearnersExplore: [
          "Cutaway 3D views of boilers, turbines, alternators, and step-up transformers",
          "Hands-on manipulation of mechanical advantage, pulleys, gears, and pneumatic systems",
        ],
        subjectName: "Engineering & Technology",
      },
    ],
  },
  {
    id: "mathematics-spatial",
    name: "Mathematics and Spatial Learning",
    shortName: "Mathematics & Spatial Learning",
    tagline: "Explore geometry, mathematical relationships, spatial reasoning and abstract concepts through interactive 3D environments.",
    capsAreas: "CAPS Mathematics (Space & Shape / Geometry, Measurement & Functions, Grades 4–12)",
    iconName: "math",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
    imageAlt: "3D geometry, polyhedra and spatial mathematics learning environment in virtual reality",
    items: [
      {
        title: "Curious Alice (Spatial Scale, Proportions & Logic Puzzles)",
        status: "Available Experience",
        grades: "Grades 4–9",
        curriculumFocus: "Spatial Orientation, Scale Proportions & Deductive Problem-Solving",
        description:
          "An interactive puzzle environment that challenges learners to reason about relative scale, spatial perspective, and logical sequences.",
        whatLearnersExplore: [
          "Experiencing dramatic scale transformations and perspective puzzles in 3D space",
          "Developing spatial reasoning and pattern recognition through interactive tasks",
        ],
        catalogueHref: "/vr-games-catalogue/curious-alice",
        subjectName: "Mathematics & Spatial Learning",
      },
      {
        title: "3D Euclidean Geometry, Polyhedra & Cross-Section Lab",
        status: "Proposed Experience",
        grades: "Grades 7–12",
        curriculumFocus: "3D Solids, Surface Area, Volume, Planes & Trigonometric Angles in 3D",
        description:
          "Many learners struggle to interpret three-dimensional geometry problems drawn on a flat chalkboard. This proposed environment lets learners hold, slice, unfold nets, and measure angles inside 3D solids.",
        whatLearnersExplore: [
          "Unfolding 3D prisms, pyramids, and cylinders into 2D surface-area nets in mid-air",
          "Visualising angles of elevation, depression, and 3D trigonometric triangles from inside the figure",
        ],
        subjectName: "Mathematics & Spatial Learning",
      },
      {
        title: "Interactive Coordinate Planes, Vectors & Graph Transformations",
        status: "Custom Development Enquiry",
        grades: "Grades 9–12",
        curriculumFocus: "3D Cartesian Coordinates, Functions, Parabolic Trajectories & Vectors",
        description:
          "Mathematics departments can propose custom spatial environments where learners walk across a 3D Cartesian grid, adjust function parameters in real time, and observe how equations shape 3D surfaces.",
        whatLearnersExplore: [
          "Manipulating gradients, intercepts, and turning points on life-size interactive graphs",
          "Observing vector addition and projectile trajectories in three dimensions",
        ],
        subjectName: "Mathematics & Spatial Learning",
      },
    ],
  },
]

function CategoryIcon({ name, className = "h-5 w-5" }: { name: SubjectCategory["iconName"]; className?: string }) {
  switch (name) {
    case "orbit":
      return <Orbit className={className} />
    case "biology":
      return <HeartPulse className={className} />
    case "physics":
      return <Atom className={className} />
    case "geography":
      return <Globe2 className={className} />
    case "history":
      return <Landmark className={className} />
    case "engineering":
      return <Cpu className={className} />
    case "math":
      return <Compass className={className} />
  }
}

function StatusBadge({ status }: { status: AvailabilityLabel }) {
  if (status === "Available Experience") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        Available Experience
      </span>
    )
  }
  if (status === "Proposed Experience") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        Proposed Experience
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
      <Code2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
      Custom Development Enquiry
    </span>
  )
}

export default function SchoolExperienceCatalogue() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "custom">("all")

  const visibleCategories = SUBJECT_CATEGORIES.filter(
    (cat) => selectedSubject === "all" || cat.id === selectedSubject
  )

  return (
    <div className="space-y-10">
      {/* Availability Transparency Legend */}
      <div className="rounded-2xl bg-secondary/40 border border-border p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Catalogue Transparency & Availability Guide
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We clearly distinguish between immersive experiences that are <strong className="text-foreground">already available</strong> for school demonstrations today and <strong className="text-foreground">proposed or custom development concepts</strong> that our development team can evaluate and build in collaboration with your school.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <StatusBadge status="Available Experience" />
            <StatusBadge status="Proposed Experience" />
            <StatusBadge status="Custom Development Enquiry" />
          </div>
        </div>
      </div>

      {/* Interactive Subject & Status Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>Filter by Educational Subject:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "all", label: "All Items" },
                { id: "available", label: "Available Now" },
                { id: "custom", label: "Proposed & Custom Concepts" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  statusFilter === tab.id
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-card/60 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              selectedSubject === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-card/70 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            All 7 Subject Areas
          </button>
          {SUBJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedSubject(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedSubject === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-card/70 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              <CategoryIcon name={cat.iconName} className="h-3.5 w-3.5" />
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subject Categories List */}
      <div className="space-y-12">
        {visibleCategories.map((category) => {
          const filteredItems = category.items.filter((item) => {
            if (statusFilter === "available") return item.status === "Available Experience"
            if (statusFilter === "custom") return item.status !== "Available Experience"
            return true
          })

          if (filteredItems.length === 0) return null

          return (
            <div
              key={category.id}
              id={`subject-${category.id}`}
              className="rounded-3xl bg-card/70 border border-border/80 overflow-hidden shadow-xl"
            >
              {/* Category Header Banner */}
              <div className="grid lg:grid-cols-12 border-b border-border/70">
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-center space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary">
                      <CategoryIcon name={category.iconName} className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                      {category.capsAreas}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
                    {category.tagline}
                  </p>
                </div>

                <div className="lg:col-span-4 relative min-h-[180px] lg:min-h-full bg-secondary overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-card/95 via-card/40 to-transparent" />
                </div>
              </div>

              {/* Experience Cards Grid */}
              <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isAvailable = item.status === "Available Experience"
                  return (
                    <div
                      key={item.title}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                        isAvailable
                          ? "bg-secondary/35 border-border hover:border-emerald-500/40"
                          : "bg-secondary/20 border-primary/25 hover:border-primary/50"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <StatusBadge status={item.status} />
                          <span className="text-[11px] font-semibold text-muted-foreground bg-background/70 px-2.5 py-1 rounded-md border border-border/60">
                            {item.grades}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-foreground leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs font-semibold text-primary mt-1">
                            Focus: {item.curriculumFocus}
                          </p>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
                            What Learners Can Explore:
                          </p>
                          <ul className="space-y-1.5">
                            {item.whatLearnersExplore.map((point, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed"
                              >
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                        {isAvailable ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                triggerSchoolEnquiry("demo", {
                                  subject: item.subjectName,
                                })
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer transition-colors"
                            >
                              <span>Enquire for School Demo</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                            {item.catalogueHref && (
                              <Link
                                href={item.catalogueHref}
                                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                              >
                                <span>View Experience</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              triggerSchoolEnquiry("custom", {
                                subject: item.subjectName,
                                topic: item.title,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent cursor-pointer transition-colors"
                          >
                            <span>Propose or Enquire About Developing This</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
