import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Check,
  ArrowRight,
  Shield,
  Sparkles,
  BookOpen,
  GraduationCap,
  Code2,
  Layers,
  Compass,
  Users,
  Monitor,
  Microscope,
  Orbit,
  HeartPulse,
  Cpu,
  Globe2,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  School,
  FileCheck2,
  Clock,
  MapPin,
  HelpCircle,
} from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SchoolVrEnquiryForm from "@/components/SchoolVrEnquiryForm"
import SchoolExperienceCatalogue, {
  SchoolEnquiryJumpButton,
} from "@/components/SchoolExperienceCatalogue"

export const metadata: Metadata = {
  title: "School VR Experiences & Custom Educational VR Development | South Africa",
  description:
    "Discover immersive educational VR experiences and custom curriculum-informed VR development for South African schools. Book a school VR demonstration or propose a custom learning experience.",
  keywords: [
    "educational VR experiences for schools",
    "VR for schools in South Africa",
    "educational virtual reality South Africa",
    "school VR experiences",
    "virtual reality in education",
    "educational VR Cape Town",
    "curriculum-aligned VR experiences",
    "custom educational VR development",
    "VR learning experiences",
    "CAPS curriculum VR",
    "immersive learning in schools",
    "school VR demonstrations",
  ],
  alternates: {
    canonical: "/school-vr-demonstrations",
  },
  openGraph: {
    title: "School VR Experiences & Custom Educational VR Development | Virtual Reality Guys",
    description:
      "We develop and deliver immersive virtual reality learning experiences informed by the South African curriculum. Explore available school VR experiences or propose a custom educational topic.",
    url: "https://virtualrealityguyz.co.za/school-vr-demonstrations",
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: "/images/vr-school.jpg",
        width: 1200,
        height: 630,
        alt: "Learners exploring immersive educational virtual reality experiences at school",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School VR Experiences & Custom Educational VR Development | Virtual Reality Guys",
    description:
      "Take learning beyond the textbook with curriculum-informed educational VR experiences and custom VR development for South African schools.",
    images: ["/images/vr-school.jpg"],
  },
}

const FAQ_ITEMS = [
  {
    question: "1. What educational VR experiences are available for schools?",
    answer:
      "We offer an established catalogue of over 25 immersive educational VR experiences covering Space and Astronomy (such as Titans of Space PLUS, Cosmic XR, Mission: ISS, and Apollo 11 VR), Human Biology and Life Sciences (Human Anatomy VR, Cellverse, Inside COVID-19), Natural Sciences and Chemistry (10K Science, Virtual Lab Chemistry, Hallo Einstein), Geography and Ecosystems (Google Earth VR, National Geographic Explore VR, Ecosphere, Ocean Acidification VR), and History and Heritage (Anne Frank House VR, Great Pyramid VR, Colosseum VR). Beyond our existing library, schools can also propose new topics for custom VR development evaluation.",
  },
  {
    question: "2. Are your VR experiences aligned with the South African CAPS curriculum?",
    answer:
      "Our educational VR selection and custom development direction are curriculum-informed and designed around relevant South African learning objectives across CAPS, IEB, and international curricula (such as Cambridge). While individual experiences are not formally certified by the Department of Basic Education or mapped to every single Annual Teaching Plan (ATP) by default, we work with teachers and Heads of Department to select or design experiences that directly support grade-specific syllabus topics in Natural Sciences, Life Sciences, Physical Sciences, Social Sciences (History and Geography), Technology, and Mathematics.",
  },
  {
    question: "3. Can our school request a custom VR experience?",
    answer:
      "Yes. One of our core differentiators is that schools are not restricted to choosing from a fixed catalogue. Teachers, HODs, and school leaders can propose specific topics, abstract concepts, or South African curriculum areas they believe would benefit from an interactive 3D environment. Our development team evaluates each proposal for educational value, curriculum relevance, technical feasibility, and scope before discussing a potential custom development project.",
  },
  {
    question: "4. Do you develop VR experiences specifically for educational purposes?",
    answer:
      "Yes. Virtual Reality Guys has VR development capabilities dedicated to designing and building immersive educational environments. Our focus is on transforming complex, abstract, or hard-to-visualise concepts—such as internal biological systems, industrial water treatment processes, electrical circuits, spatial geometry, or South African heritage sites—into interactive 3D learning experiences.",
  },
  {
    question: "5. What happens after we submit an experience idea?",
    answer:
      "When your school submits a custom VR concept, our team follows a structured five-step evaluation: (1) we review the proposed educational topic and target grade; (2) we examine its curriculum relevance and learning objectives; (3) we assess whether 3D immersion genuinely improves understanding compared to conventional media; (4) we evaluate the technical and 3D development requirements; and (5) we arrange a consultation with your school to discuss feasibility, potential timelines, specifications, and quotation options. Submitting an idea is an obligation-free starting point, and not every proposed concept is automatically developed.",
  },
  {
    question: "6. Can VR experiences be tailored to a particular grade?",
    answer:
      "Yes. For school demonstrations using our existing catalogue, we curate experiences and facilitator guidance to match the cognitive level of your learners—from Intermediate Phase (Grades 4–6) and Senior Phase (Grades 7–9) through to FET Phase (Grades 10–12). When developing custom VR experiences, visual complexity, terminology, interactivity, and assessment prompts can be designed around specific grade requirements.",
  },
  {
    question: "7. Which subjects can be taught using VR?",
    answer:
      "Immersive VR is particularly effective for subjects requiring spatial understanding, microscopic or macroscopic visualisation, or virtual field exploration. Key learning areas include Space and Astronomy, Human Biology and Life Sciences, Natural Sciences (Physics and Chemistry), Geography and Earth Sciences, History and Heritage, Engineering and Technology, and Mathematics (3D Geometry and Spatial Reasoning).",
  },
  {
    question: "8. Can you bring VR equipment to our school?",
    answer:
      "Yes. We provide complete mobile school VR delivery across Cape Town and surrounding Western Cape regions. We bring standalone VR headsets, spectator screens (where required), safety boundary equipment, and trained facilitators directly to your classroom, science lab, library, or school hall. We only require an indoor venue space and access to standard electrical power for our display equipment.",
  },
  {
    question: "9. How many learners can participate?",
    answer:
      "We structure sessions around your class or grade size. For focused classroom lessons, we typically run 4 to 8 VR headsets in structured rotations so a class of 25 to 35 learners can participate within a standard period or double period while peers observe or complete companion activities. For full-grade immersive learning days, STEM expos, or science weeks, we schedule multi-class rotations throughout the school day.",
  },
  {
    question: "10. How long does a typical VR learning session take?",
    answer:
      "Individual headset immersion blocks typically last between 8 and 15 minutes per learner rotation to maximise focus, prevent visual fatigue, and leave time for teacher framing and post-experience discussion. Complete school bookings are commonly scheduled for 2 hours, 3 hours, 4 hours, or a full school day depending on how many classes or grades are participating.",
  },
  {
    question: "11. Is VR suitable for younger learners?",
    answer:
      "We generally recommend headset-based VR experiences for learners aged 8 and older (approximately Grade 3 upwards). For younger primary school learners, we keep individual headset rotations brief (8–10 minutes), use stationary or comfortable seated modes, adjust headset straps and lens spacing carefully, and select gentle, non-violent educational content under constant facilitator supervision.",
  },
  {
    question: "12. Can teachers use VR as part of classroom instruction?",
    answer:
      "Absolutely. Immersive VR works best when it complements the teacher rather than replacing classroom instruction. We coordinate with educators ahead of the session so the VR experience reinforces what is currently being taught. Where supported by the setup, we also connect headsets to a spectator screen or classroom display so teachers can point out structures and guide discussion in real time.",
  },
  {
    question: "13. Do you offer demonstrations before committing to a programme?",
    answer:
      "Yes. Schools are welcome to enquire about an introductory demonstration for principals, Heads of Department, SGB members, or teaching staff, or to book a single-day classroom demonstration before planning a broader term programme or custom development discussion.",
  },
  {
    question: "14. Do you serve schools outside Cape Town?",
    answer:
      "Our mobile VR delivery team directly serves schools across Greater Cape Town, the Southern and Northern Suburbs, Atlantic Seaboard, West Coast, Somerset West, Stellenbosch, Paarl, and the broader Western Cape. For schools elsewhere in South Africa—particularly those interested in custom educational VR development or larger multi-day educational programmes—please contact us to discuss regional deployment or software delivery options.",
  },
  {
    question: "15. How much does a school VR programme cost?",
    answer:
      "Pricing depends on whether your school is booking an on-site demonstration using existing experiences or exploring a custom VR development project. On-site school VR sessions are quoted based on the number of headsets, session duration, learner numbers, and school location. Custom VR development projects are scoped and quoted separately after evaluating technical complexity and educational specifications. Submit an enquiry below and we will prepare a clear, tailored proposal for your school.",
  },
]

const TEACHER_PROPOSAL_EXAMPLES = [
  {
    quote: "We want learners to explore the inside of a cell.",
    subject: "Human Biology & Life Sciences",
    grades: "Grades 8–10 (CAPS Life & Living / Life Sciences)",
    context: "Compare plant and animal cell organelles, trace ATP production in mitochondria, and observe membrane transport in 3D.",
  },
  {
    quote: "Can learners experience how a power station works?",
    subject: "Engineering & Technology",
    grades: "Grades 6–11 (Natural Sciences & Technology)",
    context: "Follow energy conversion from coal, hydro, or solar input through turbines, generators, and national grid transformers.",
  },
  {
    quote: "We want to teach the history of Mapungubwe through an immersive environment.",
    subject: "History & Heritage",
    grades: "Grades 5–10 (CAPS Social Sciences: History)",
    context: "Walk through a respectful 3D historical reconstruction of Mapungubwe Hill, sacred leadership spaces, and Indian Ocean trade artefacts.",
  },
  {
    quote: "Can we demonstrate the water cycle in VR?",
    subject: "Geography & Earth Sciences",
    grades: "Grades 4–9 (CAPS Planet Earth & Beyond / Geography)",
    context: "Follow evaporation, condensation, relief rainfall, catchment runoff, and groundwater infiltration across a South African landscape.",
  },
  {
    quote: "Can learners explore the human nervous system?",
    subject: "Human Biology & Life Sciences",
    grades: "Grades 11–12 (FET Life Sciences)",
    context: "Visualise the brain, spinal cord, motor and sensory neurons, synaptic cleft neurotransmitters, and a complete reflex arc in action.",
  },
  {
    quote: "Can we take learners inside a virtual water treatment plant?",
    subject: "Engineering & Technology",
    grades: "Grades 6–9 (Natural Sciences & Technology)",
    context: "Step through screening, flocculation, sedimentation, sand filtration, and chlorination without the safety hazards of an industrial site visit.",
  },
]

export default function SchoolVRPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://virtualrealityguyz.co.za/school-vr-demonstrations#service",
    "name": "Educational VR Experiences & Custom VR Development for Schools",
    "serviceType": "Educational Virtual Reality Development and School Demonstrations",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "@id": "https://virtualrealityguyz.co.za/#organization",
      "url": "https://virtualrealityguyz.co.za",
      "image": "https://virtualrealityguyz.co.za/images/logo.png",
      "telephone": "+27717800323",
      "email": "virtualrealityguyz@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA",
      },
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Cape Town",
      },
      {
        "@type": "AdministrativeArea",
        "name": "Western Cape",
      },
      {
        "@type": "Country",
        "name": "South Africa",
      },
    ],
    "description":
      "Virtual Reality Guys develops and delivers immersive virtual reality learning experiences informed by the South African school curriculum. Schools can book supervised educational VR demonstrations or propose custom VR experiences for development evaluation.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Educational VR Capabilities for Schools",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "On-Site School VR Demonstrations & Immersive Learning Days",
            "description":
              "Supervised delivery of existing educational VR experiences across Space, Biology, Chemistry, Physics, Geography, and History for classrooms, STEM days, and school exhibitions.",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Curriculum-Informed Custom Educational VR Development",
            "description":
              "Collaborative evaluation, 3D design, and development of custom educational virtual reality experiences tailored to South African curriculum topics and school learning objectives.",
          },
        },
      ],
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question.replace(/^\d+\.\s*/, ""),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://virtualrealityguyz.co.za",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "School VR Experiences & Custom Development",
        "item": "https://virtualrealityguyz.co.za/school-vr-demonstrations",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden border-b border-border/40">
        {/* Background Atmospheric Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-school.jpg"
            alt="South African school learners exploring immersive educational virtual reality environments"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(0,210,255,0.14),transparent_55%)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-medium">
              School VR Experiences &amp; Custom Educational Development
            </span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Hero Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Immersive Education Technology • Existing &amp; Custom VR</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-balance">
                Transform the Way Learners Experience{" "}
                <span className="text-primary">Education.</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Discover immersive VR learning experiences developed to bring educational concepts to life. From exploring the human body and travelling through the solar system to experiencing South African history and scientific environments, we help schools take learning beyond the textbook.
              </p>

              {/* Proposition Highlight Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-card/80 border border-primary/25 backdrop-blur-sm space-y-2 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Our Educational Proposition
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  <strong>We develop and deliver immersive virtual reality learning experiences that bring education to life.</strong>{" "}
                  Schools are not restricted to selecting from a fixed catalogue—you can book our available educational experiences or propose new curriculum topics for our development team to evaluate and build.
                </p>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <CyberButton href="#experience-catalogue" size="lg" variant="primary">
                  Explore Educational VR <ArrowRight className="ml-2 h-5 w-5" />
                </CyberButton>
                <SchoolEnquiryJumpButton mode="custom" size="lg" variant="secondary">
                  Request a Custom VR Experience
                </SchoolEnquiryJumpButton>
              </div>

              {/* Capability Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>25+ Available Learning Titles</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2">
                  <Code2 className="h-4 w-4 text-primary shrink-0" />
                  <span>In-House VR Development Team</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2 col-span-2 sm:col-span-1">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <span>Curriculum-Informed Design</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Composition (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Classroom Image Card */}
              <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-card group">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/vr-school.jpg"
                    alt="Learners in school uniform exploring an interactive 3D educational VR environment with educator supervision"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="p-5 sm:p-6 relative z-10 -mt-12 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/90 border border-primary/30 text-[11px] font-bold text-primary uppercase tracking-wider">
                    <span>Beyond Mobile Entertainment</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Interactive 3D Environments Built for Understanding
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instead of passively memorising flat 2D diagrams, learners step inside spatial simulations of planetary orbits, biological systems, virtual science laboratories, and historical reconstructions.
                  </p>
                </div>
              </div>

              {/* Mini Visual Subject Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-card/80 border border-border/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/15 text-primary shrink-0">
                    <Orbit className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Planetary &amp; Atomic Scale</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Explore solar systems, orbital mechanics, and molecular bonds in 3D.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-card/80 border border-border/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/15 text-primary shrink-0">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Human Body &amp; Cells</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Inspect organs, blood vessels, and cellular organelles from within.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: MORE THAN VR DEMONSTRATIONS */}
      <section className="py-20 lg:py-24 bg-background/60 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Our Three Connected Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              More Than VR Demonstrations: <span className="text-primary">An Educational VR Partner</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Virtual Reality Guys provides far more than headset hire or mobile gaming entertainment. We combine an established library of educational VR simulations with in-house VR software development capabilities—giving South African schools three connected ways to bring immersive learning into the classroom.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pillar A */}
            <div className="rounded-3xl bg-card/80 border border-border/80 p-8 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                    1. Ready for Schools Now
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Existing Educational VR Experiences
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We have already curated and deployed immersive educational experiences covering core school subjects—including astronomy, human anatomy, cell biology, virtual chemistry labs, global geography, and historical sites.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Available immediately for classroom demonstrations and STEM days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Delivered with headsets, spectator displays, and trained facilitators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Structured around class periods and grade-appropriate learning goals</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-border/50">
                <SchoolEnquiryJumpButton mode="demo" variant="inline">
                  <span>Book a School Demonstration</span>
                  <ArrowRight className="h-4 w-4" />
                </SchoolEnquiryJumpButton>
              </div>
            </div>

            {/* Pillar B */}
            <div className="rounded-3xl bg-card/90 border-2 border-primary/40 p-8 flex flex-col justify-between space-y-6 shadow-[0_0_35px_rgba(0,210,255,0.1)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
                    2. In-House Development
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Curriculum-Informed VR Development
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We have developers capable of designing and building new VR experiences specifically for educational purposes. Our objective is to make complex, abstract, or difficult-to-visualise concepts easier to explore through interactive 3D technology.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Informed by South African curriculum requirements (CAPS, IEB &amp; international)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Designed around clear learning objectives and learner age groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Long-term ambition to build an extensive South African curriculum library</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-border/50">
                <a
                  href="#curriculum-section"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent hover:underline transition-colors"
                >
                  <span>Explore How We Align With Curriculum Goals</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Pillar C */}
            <div className="rounded-3xl bg-card/80 border border-border/80 p-8 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    3. Collaborative Co-Creation
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  School-Requested VR Experiences
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Schools are not restricted to a fixed catalogue. Teachers and schools can approach us with their own ideas, subjects, or specific learning challenges—helping shape which educational VR experiences get built next.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Propose topics that learners struggle to grasp from textbooks alone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Every request is evaluated for pedagogical value &amp; technical feasibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Collaborative relationship between educators and our VR developers</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-border/50">
                <SchoolEnquiryJumpButton mode="custom" variant="inline">
                  <span>Propose a Custom VR Experience</span>
                  <ArrowRight className="h-4 w-4" />
                </SchoolEnquiryJumpButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: EXPLORE WHAT LEARNERS CAN EXPERIENCE */}
      <section id="experience-catalogue" className="py-20 lg:py-28 border-b border-border/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Subject-by-Subject Educational Catalogue
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Explore What Learners Can <span className="text-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Browse our educational VR capabilities across seven core subject areas. Each category highlights <strong className="text-foreground">available experiences</strong> you can book for school demonstrations today alongside <strong className="text-foreground">proposed and custom development opportunities</strong> our team can evaluate with your educators.
            </p>
          </div>

          <SchoolExperienceCatalogue />

          <div className="rounded-2xl bg-card/80 border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                Looking for our full library of interactive and event VR titles?
              </p>
              <p className="text-xs text-muted-foreground">
                You can also browse our complete catalogue of 50+ VR experiences or read our in-depth educator guide to virtual reality in South African schools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/vr-games-catalogue"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary border border-border text-foreground hover:border-primary/40 transition-all"
              >
                <span>Browse Full VR Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/blog/educational-vr-experiences-for-schools"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
              >
                <span>Read Educator Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: BUILT AROUND THE SOUTH AFRICAN CURRICULUM */}
      <section
        id="curriculum-section"
        className="py-20 lg:py-28 bg-background/60 border-b border-border/40 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                South African Educational Context
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Built Around the <span className="text-primary">South African Curriculum</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Our educational VR development direction is directly informed by the South African school curriculum. Whether your school follows the national <strong className="text-foreground">CAPS (Curriculum and Assessment Policy Statement)</strong> framework, the <strong className="text-foreground">IEB (Independent Examinations Board)</strong> syllabus, or <strong className="text-foreground">international curricula (such as Cambridge or IB)</strong>, immersive learning is most effective when it serves specific classroom learning objectives.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our long-term ambition is to build a progressive, curriculum-informed library of VR learning experiences tailored to South African classrooms—respecting grade appropriateness, terminology, and the practical realities of school timetables.
              </p>

              {/* Curriculum Integrity Note */}
              <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4" />
                  Transparent Curriculum Positioning
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We describe our experiences as <strong className="text-foreground">curriculum-informed</strong> and <strong className="text-foreground">designed around relevant learning objectives</strong>. We do not claim formal Department of Basic Education certification or automatic alignment with every Annual Teaching Plan (ATP). Instead, we work directly with your educators to match existing simulations—or scope new custom builds—around your exact grade and syllabus requirements.
                </p>
              </div>
            </div>

            {/* CAPS & Curriculum Learning Areas Matrix */}
            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-card/80 border border-border/80 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Grades 4–9 (Intermediate &amp; Senior)
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Natural Sciences &amp; Technology
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Supports <em>Life &amp; Living</em> (cells, body systems, ecosystems), <em>Matter &amp; Materials</em> (atomic structure, chemical reactions), <em>Energy &amp; Change</em> (electric circuits, forces), and <em>Planet Earth &amp; Beyond</em> (solar system, lithosphere).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/80 border border-border/80 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Grades 10–12 (FET Phase)
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Life Sciences &amp; Physical Sciences
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Helps senior learners visualise 3D human anatomy, cardiovascular and nervous systems, molecular geometry, titrations, electromagnetism, and kinematics.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/80 border border-border/80 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Grades 4–12
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Social Sciences (History &amp; Geography)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Brings geomorphology, catchment management, global landforms, World War II history, ancient civilisations, and South African heritage sites into 3D perspective.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/80 border border-border/80 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Grades 4–12
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Mathematics, EGD &amp; Life Skills
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Supports spatial reasoning, 3D Euclidean geometry, polyhedra cross-sections, engineering systems, and experiential environmental awareness.
                </p>
              </div>
            </div>
          </div>

          {/* Textbook vs Immersive VR Real-World Examples */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                From Flat Diagrams to Spatial Understanding
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                How immersive VR helps learners grasp concepts that are difficult to demonstrate through textbooks or conventional classroom instruction alone:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                    <Orbit className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    Example 1: The Solar System
                  </h4>
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">In a Textbook:</strong>
                    A flat, non-scale diagram describes planetary order, making it hard for learners to grasp relative planet volumes or 3D orbital planes.
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-foreground/90">
                    <strong className="text-primary block mb-0.5">In Immersive VR:</strong>
                    Learners explore the planets in three dimensions, compare Earth beside Jupiter at true relative scale, and observe orbital motion around them.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    Example 2: The Human Heart
                  </h4>
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">In a Diagram:</strong>
                    A 2D cross-section shows chambers and valves on paper, often confusing learners about anterior/posterior orientation and blood flow paths.
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-foreground/90">
                    <strong className="text-primary block mb-0.5">In Immersive VR:</strong>
                    An immersive experience allows learners to rotate, isolate layers, and explore cardiac structures and valve mechanics from multiple perspectives.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    Example 3: Water Treatment Plant
                  </h4>
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">In a Classroom Lesson:</strong>
                    A flowchart lists coagulation, sedimentation, filtration, and chlorination, while physical excursions to municipal works face logistical barriers.
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-foreground/90">
                    <strong className="text-primary block mb-0.5">In Immersive VR:</strong>
                    A custom VR environment can take learners step-by-step through each stage of the treatment process inside a virtual purification plant.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: HAVE AN IDEA? LET'S BUILD IT. */}
      <section
        id="custom-development"
        className="py-20 lg:py-28 border-b border-border/40 relative overflow-hidden scroll-mt-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,210,255,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Have an Idea? Let&apos;s Build It.
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              What Would You Like Your Learners to <span className="text-primary">Experience?</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/90 font-medium leading-relaxed">
              &ldquo;Some of the most valuable educational VR experiences begin with a simple question from a teacher: What if learners could actually experience this?&rdquo;
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We want South African schools to know that they are not limited to a static catalogue. If there is a curriculum topic, scientific process, historical environment, or spatial concept your learners find difficult to visualise, you can propose it to our team.
            </p>
          </div>

          {/* 5-Step Assessment Framework */}
          <div className="rounded-3xl bg-card/85 border border-primary/30 p-6 sm:p-10 space-y-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  How Our Team Evaluates School-Proposed VR Ideas
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Every school proposal is carefully assessed before a development decision is made:
                </p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/25 px-3.5 py-1.5 rounded-full shrink-0">
                Collaborative Evaluation Process
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  step: "01",
                  title: "Understand the Topic",
                  desc: "We listen to your teachers to understand the exact educational topic, grade level, and classroom challenge.",
                },
                {
                  step: "02",
                  title: "Curriculum Relevance",
                  desc: "We explore how the concept connects to CAPS, IEB, or international curriculum learning objectives.",
                },
                {
                  step: "03",
                  title: "Pedagogical Value",
                  desc: "We assess whether 3D immersion and spatial interaction will genuinely improve the learning experience.",
                },
                {
                  step: "04",
                  title: "Technical Feasibility",
                  desc: "Our developers evaluate the 3D modelling, simulation logic, comfort, and hardware requirements.",
                },
                {
                  step: "05",
                  title: "Discuss Development",
                  desc: "We review our findings with your school and discuss scope, timelines, and options for developing the experience.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-5 rounded-2xl bg-secondary/40 border border-border/70 space-y-2.5"
                >
                  <span className="text-xs font-bold font-mono text-primary px-2 py-0.5 rounded bg-primary/15 border border-primary/30 inline-block">
                    Step {item.step}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Example Teacher Requests */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-foreground">
                  Examples of Requests Schools Can Propose
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Click any example below to pre-fill our custom VR proposal form, or submit your own original concept:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEACHER_PROPOSAL_EXAMPLES.map((ex) => (
                <div
                  key={ex.quote}
                  className="rounded-2xl bg-card/75 border border-border hover:border-primary/50 p-6 flex flex-col justify-between gap-4 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-primary uppercase tracking-wider">
                        {ex.subject}
                      </span>
                      <span className="text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {ex.grades}
                      </span>
                    </div>
                    <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      &ldquo;{ex.quote}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ex.context}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <SchoolEnquiryJumpButton
                      mode="custom"
                      subject={ex.subject}
                      topic={ex.quote.replace(/^"|"$/g, "")}
                      variant="inline"
                    >
                      <span>Propose This Concept</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </SchoolEnquiryJumpButton>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Topic Pills */}
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground mr-2">
                More topics schools can propose:
              </span>
              {[
                "Human Circulatory System",
                "Human Digestive System",
                "Realistic Solar System Exploration",
                "Interactive Electricity & Circuits",
                "Virtual Water Treatment Plant",
                "South African History & Heritage",
                "Ecosystems & Biodiversity",
                "Geological Formations & Plate Tectonics",
                "Interactive 3D Mathematics Environment",
                "Virtual Science Laboratory",
              ].map((pill) => (
                <span
                  key={pill}
                  className="text-xs px-3 py-1 rounded-full bg-background/80 border border-border text-muted-foreground"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <SchoolEnquiryJumpButton mode="custom" size="lg" variant="primary">
                Propose an Educational VR Experience <ArrowRight className="ml-2 h-5 w-5" />
              </SchoolEnquiryJumpButton>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION: HOW WE WORK WITH SCHOOLS */}
      <section className="py-20 lg:py-24 bg-background/60 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Clear 4-Stage School Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              How We Work With <span className="text-primary">Schools</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Whether your school is booking an on-site demonstration from our existing library or proposing a new curriculum concept, we follow a transparent four-step process.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: "1. Discover",
                title: "Identify the Learning Goal",
                description:
                  "The school identifies an educational topic, grade-level learning objective, or existing VR experience requirement.",
                badge: "Teacher / HOD Consultation",
              },
              {
                number: "2. Evaluate",
                title: "Assess Value & Feasibility",
                description:
                  "We assess the educational value, South African curriculum relevance, technical feasibility, and suitability of VR for your learners.",
                badge: "Pedagogical & Technical Review",
              },
              {
                number: "3. Develop or Select",
                title: "Match or Build Content",
                description:
                  "We select appropriate titles from our existing educational library or discuss the scope of a potential custom VR development project.",
                badge: "Catalogue Selection or Custom Scope",
              },
              {
                number: "4. Deliver",
                title: "Classroom or Event Deployment",
                description:
                  "We arrange the appropriate experience delivery—whether through a supervised school demonstration, STEM learning day, or agreed deployment model.",
                badge: "Supervised School Delivery",
              },
            ].map((stage) => (
              <div
                key={stage.number}
                className="rounded-2xl bg-card/80 border border-border/80 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 px-3 py-1 rounded-lg inline-block">
                    {stage.number}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{stage.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/50 text-[11px] font-semibold text-muted-foreground">
                  {stage.badge}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
            <strong>Please note:</strong> Custom educational VR development projects are evaluated individually and require separate technical specifications, development timelines, and quotations from standard mobile school demonstrations.
          </p>
        </div>
      </section>

      {/* 7. SECTION: VR LEARNING AT YOUR SCHOOL & 8. DESIGNED FOR DIFFERENT LEARNING ENVIRONMENTS */}
      <section className="py-20 lg:py-28 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* VR Learning at Your School */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                Mobile School VR Delivery
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                VR Learning at <span className="text-primary">Your School</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Schools do not need to purchase or maintain their own VR hardware to give learners access to immersive education. Our mobile team brings VR equipment and supervised educational experiences directly to your campus across Cape Town and the Western Cape.
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    title: "Educational Demonstrations",
                    desc: "Focused sessions introducing classes or teaching staff to subject-specific VR simulations.",
                  },
                  {
                    title: "Classroom Experiences",
                    desc: "Structured headset rotations integrated into Natural Sciences, Life Sciences, Geography, or History periods.",
                  },
                  {
                    title: "Science & Technology Days",
                    desc: "High-engagement STEM and STEAM workshop stations for science weeks and innovation days.",
                  },
                  {
                    title: "School Exhibitions & Open Days",
                    desc: "Showcase forward-thinking educational technology to prospective parents, learners, and school communities.",
                  },
                  {
                    title: "Immersive Learning Days",
                    desc: "Full-grade or multi-grade schedules rotating classes through curated educational modules across a school day.",
                  },
                  {
                    title: "Educational & Cultural Events",
                    desc: "Supervised VR stations tailored for school expos, heritage days, and academic enrichment programmes.",
                  },
                ].map((format) => (
                  <div
                    key={format.title}
                    className="p-4 rounded-xl bg-secondary/35 border border-border/70 space-y-1"
                  >
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{format.title}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                      {format.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Logistics & Supervision Card */}
            <div className="lg:col-span-6 rounded-3xl bg-card/85 border border-border p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Safe, Supervised &amp; Practical Classroom Logistics
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We handle the technical setup and learner coordination so teachers can focus on the educational conversation:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Trained Facilitator Supervision &amp; Spatial Boundaries
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Our facilitators configure virtual Guardian safety boundaries in your classroom, hall, or lab, adjust headset straps for each learner, and supervise every session from start to finish.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Structured Learner Rotations
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Sessions are organised into manageable 8–15 minute rotations so whole classes can participate efficiently while maintaining learner comfort and focus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Strict Hygiene &amp; Headset Sanitation
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Every headset facial interface and controller is wiped down with anti-bacterial sanitising wipes between learner rotations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. DESIGNED FOR DIFFERENT LEARNING ENVIRONMENTS */}
          <div className="pt-8 border-t border-border/40 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                Flexible Classroom Integration
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Designed for Different <span className="text-primary">Learning Environments</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Different subjects and age groups benefit from different instructional formats. Depending on the selected VR experience and your venue setup, sessions can be configured for:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: "Individual Learner Exploration",
                  desc: "Learners inspect 3D models, planets, or anatomical layers at their own pace inside a headset.",
                },
                {
                  title: "Teacher-Guided Demonstrations",
                  desc: "Educators frame the learning objective before immersion and guide learners toward key observations.",
                },
                {
                  title: "Small-Group Rotations",
                  desc: "Groups of learners rotate through VR stations while classmates complete worksheets or group discussions.",
                },
                {
                  title: "Classroom Projection & Shared Viewing",
                  desc: "Where supported by the experience, live headset views are cast to a spectator screen so the class can follow along.",
                },
                {
                  title: "Independent & Enrichment Stations",
                  desc: "Self-paced stations for science clubs, library technology corners, or FET revision workshops.",
                },
              ].map((env) => (
                <div
                  key={env.title}
                  className="p-5 rounded-2xl bg-card/75 border border-border/80 space-y-2"
                >
                  <Monitor className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">{env.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{env.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION: WHY VIRTUAL REALITY GUYS? */}
      <section className="py-20 lg:py-24 bg-background/60 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Why Partner With Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Why <span className="text-primary">Virtual Reality Guys?</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              We position ourselves as an education technology and content development partner—combining practical school delivery today with custom VR development for tomorrow&apos;s classrooms.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Educational VR Development Capabilities",
                desc: "We have developers capable of designing and building bespoke 3D VR learning environments—not just renting out gaming headsets.",
              },
              {
                title: "South African Educational Context",
                desc: "Based in Cape Town, we understand South African classrooms, school schedules, and the need for locally relevant educational content.",
              },
              {
                title: "Curriculum-Informed Design",
                desc: "Our experiences and custom proposals are evaluated around CAPS, IEB, and international learning objectives and grade suitability.",
              },
              {
                title: "Schools Can Propose New Experiences",
                desc: "Teachers can suggest difficult-to-teach topics, helping shape which educational VR experiences our team develops next.",
              },
              {
                title: "Existing Educational Content Library",
                desc: "Over 25 curated educational simulations across astronomy, anatomy, chemistry, history, and geography ready for immediate school demos.",
              },
              {
                title: "Supervised School-Focused Delivery",
                desc: "End-to-end mobile setup, safety boundary management, sanitation between rotations, and experienced facilitators.",
              },
              {
                title: "Customisation Potential",
                desc: "From tailoring session rotations for a single grade to scoping a custom interactive simulation around a specific syllabus challenge.",
              },
              {
                title: "Long-Term Commitment to Education",
                desc: "We are progressively building a comprehensive library of immersive learning experiences for South African schools.",
              },
            ].map((reason) => (
              <div
                key={reason.title}
                className="p-6 rounded-2xl bg-card/80 border border-border/80 space-y-2.5 hover:border-primary/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">{reason.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. LEAD GENERATION & ENQUIRIES SECTION */}
      <section
        id="enquiry-section"
        className="py-20 lg:py-28 border-b border-border/40 scroll-mt-20"
      >
        <div id="book-school-demo" className="scroll-mt-24" />
        <div id="propose-custom-vr" className="scroll-mt-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
                School Demonstrations &amp; Custom Proposals
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Start a Conversation With Our <span className="text-primary">Education Team</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Select between our two dedicated school enquiry pathways in the form:
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-card/80 border border-border space-y-1.5">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <School className="h-4 w-4 text-primary" />
                    <span>Pathway 1: School Demonstration Enquiry</span>
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Bring our existing educational VR experiences and supervised mobile setups to your school for a classroom lesson, STEM day, or staff demonstration.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-card/80 border border-primary/30 space-y-1.5">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span>Pathway 2: Custom VR Development Enquiry</span>
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Propose a curriculum topic or learning challenge that does not yet exist. Our development team will evaluate its educational value and technical feasibility.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 space-y-3 text-xs text-muted-foreground">
                <p className="font-bold text-foreground uppercase tracking-wider">
                  Direct School Coordination Contact
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>Cape Town &amp; Western Cape (National enquiries welcome for custom VR)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>We respond to all school and educator enquiries within 24 hours.</span>
                </p>
                <p className="pt-1">
                  Prefer phone or email? Call/WhatsApp{" "}
                  <a href="tel:+27717800323" className="text-primary font-semibold hover:underline">
                    +27 71 780 0323
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:virtualrealityguyz@gmail.com"
                    className="text-primary font-semibold hover:underline"
                  >
                    virtualrealityguyz@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Right Column Dual-Mode Form */}
            <div className="lg:col-span-7">
              <SchoolVrEnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* 11. SECTION: FREQUENTLY ASKED QUESTIONS (15 QUESTIONS) */}
      <section id="faq" className="py-20 lg:py-28 bg-background/60 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Educator &amp; School Management FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently Asked Questions About <span className="text-primary">School VR</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Detailed answers for principals, Heads of Department, teachers, and school governing bodies exploring educational VR demonstrations or custom curriculum development.
            </p>
          </div>

          <div className="grid gap-5">
            {FAQ_ITEMS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl bg-card/80 border border-border/80 p-6 sm:p-7 space-y-2.5 hover:border-primary/30 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA SECTION */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.14),transparent_65%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-card/90 border-2 border-primary/35 p-8 sm:p-12 lg:p-16 text-center space-y-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              <span>Partner With Virtual Reality Guys</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              Let&apos;s Bring Your <span className="text-primary">Curriculum to Life.</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you want to introduce your learners to existing immersive educational experiences or explore the development of something entirely new, we&apos;d love to hear from your school.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <SchoolEnquiryJumpButton mode="demo" size="lg" variant="primary">
                Request a School Demonstration <ArrowRight className="ml-2 h-5 w-5" />
              </SchoolEnquiryJumpButton>
              <SchoolEnquiryJumpButton mode="custom" size="lg" variant="secondary">
                Propose a Custom VR Experience
              </SchoolEnquiryJumpButton>
            </div>

            {/* Contextual Internal Links */}
            <div className="pt-8 border-t border-border/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Explore Related Resources:</span>
              <Link
                href="/blog/educational-vr-experiences-for-schools"
                className="text-primary hover:underline font-medium"
              >
                Article: Educational VR Experiences for Schools &rarr;
              </Link>
              <Link
                href="/educational-vr-cape-town"
                className="hover:text-primary transition-colors"
              >
                Educational VR Cape Town
              </Link>
              <Link
                href="/vr-games-catalogue"
                className="hover:text-primary transition-colors"
              >
                Full VR Experiences Catalogue
              </Link>
              <Link
                href="/mobile-vr-hire"
                className="hover:text-primary transition-colors"
              >
                Mobile VR Equipment Setup
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                General Bookings &amp; Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
