import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Sparkles, Cpu, HardDrive, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Mobile VR Hire Cape Town | Rent Virtual Reality Gear',
  description: 'Premium mobile VR hire for events in Cape Town. Rent top-tier virtual reality setups with professional supervisors, screens, and games. We deliver!',
  alternates: {
    canonical: '/mobile-vr-hire',
  },
  openGraph: {
    title: 'Mobile VR Hire Cape Town | Rent Virtual Reality Gear',
    description: 'Looking to hire mobile VR setups in Cape Town? We deliver, set up, and supervise premium VR experiences for corporate functions, birthdays, and festivals.',
    url: 'https://virtualrealityguyz.co.za/mobile-vr-hire',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Mobile VR Hire Cape Town' }],
  }
}

export default function MobileVRHirePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mobile VR Setup Hire",
    "serviceType": "Equipment Rental & Event Entertainment",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "image": "https://virtualrealityguyz.co.za/images/logo.png",
      "telephone": "+27717800323",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA"
      }
    },
    "areaServed": {
      "@type": "Place",
      "name": "Cape Town and surrounding Western Cape regions"
    },
    "description": "Premium mobile virtual reality headset hire and event entertainment setups. We handle delivery, technical staging, spectator screen integration, and supervisor facilitation."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What equipment is included in the VR hire?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every hire includes latest-generation VR headsets, high-resolution spectator monitor displays, physical safety stands, sanitizing equipment, and trained supervisors to handle logistics, training, and gameplay facilitation."
        }
      },
      {
        "@type": "Question",
        "name": "What are the spacing and electrical requirements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We need a flat, clear space of 2.5m x 2.5m per VR station. Standard power supply (220V plugs) is needed for spectator displays and headset charging units. Setups must be indoors or under a solid weatherproof tent."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer clean equipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, hygiene is a key priority. We utilize special sweat-proof face inserts on all headsets and sanitise them thoroughly with professional anti-bacterial wipes after every user."
        }
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Mobile VR Hire",
        "item": "https://virtualrealityguyz.co.za/mobile-vr-hire"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-hero.jpg"
            alt="Mobile VR Hire Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Premium Virtual Reality Equipment Rental
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Mobile VR <span className="text-primary">Hire</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your event venue instantly! Hire premium, state-of-the-art virtual reality setups complete with screens, safety stands, trained supervisors, and 100+ games.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Your Setup Hire</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/virtual-reality-cape-town">Explore Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Specifications Grid */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Physical and Technical Specifications</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <HardDrive className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Space Requirements</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We require a minimum flat, clear area of 2.5m x 2.5m per active VR headset station to ensure player safety. High ceilings and a smooth floor are preferred.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Electrical Requirements</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Standard 220V domestic wall plugs are required nearby to power secondary spectator displays and specialized multi-battery fast chargers.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Cpu className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Weather & Lighting</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Setups must be indoors or under a fully covered, solid weatherproof marquee. Strong direct sunlight can permanently burn headset lenses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                100% Mobile Staging: We Handle the Entire Staging Process
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Hiring interactive technology can be a logistical headache. Virtual Reality Guys makes it seamless. Our mobile unit handles the delivery, physical zone demarcations, headset configurations, hardware checks, sanitary wipes, gameplay instruction, queue flow, and packing everything away.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Latest generation high-refresh VR headsets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>High-resolution secondary monitors showing spectator views</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Fully sanitised sweating-proof leather-insert guards</span>
                </li>
              </ul>
            </div>



          </div>
          
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/corporate-events">Corporate Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-team-building">VR Team Building <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Mobile VR Hire FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What equipment is included in the VR hire?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Every hire includes latest-generation VR headsets, high-resolution spectator monitor displays, physical safety stands, sanitizing equipment, and trained supervisors to handle logistics, training, and gameplay facilitation.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What are the spacing and electrical requirements?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We need a flat, clear space of 2.5m x 2.5m per VR station. Standard power supply (220V plugs) is needed for spectator displays and headset charging units. Setups must be indoors or under a solid weatherproof tent.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you offer clean equipment?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, hygiene is a key priority. We utilize special sweat-proof face inserts on all headsets and sanitise them thoroughly with professional anti-bacterial wipes after every user.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Request a Setup Hire Quotation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Organizing a public event, market, or private party? Get in touch with details of your venue, power layout, and player numbers, and we will prepare a tailored mobile VR hire quotation.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local support within Western Cape</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Scalable setups from 2 up to 10 VR headset stations</span>
              </p>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
