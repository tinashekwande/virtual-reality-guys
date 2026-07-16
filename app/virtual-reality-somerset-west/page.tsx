import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Users, Headset, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Virtual Reality Somerset West | Mobile VR Gaming Helderberg',
  description: 'Premium mobile VR gaming in Somerset West, Strand, Gordon\'s Bay & Helderberg. Parties, corporate events, and school demos delivered to your venue.',
  alternates: {
    canonical: '/virtual-reality-somerset-west',
  },
  openGraph: {
    title: 'Virtual Reality Somerset West | Mobile VR Gaming Helderberg',
    description: 'Immersive mobile virtual reality setups delivered directly to your venue in Somerset West, Strand, and the wider Helderberg region.',
    url: 'https://www.virtualrealityguyz.co.za/virtual-reality-somerset-west',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Virtual Reality Somerset West' }],
  }
}

export default function VirtualRealitySomersetWestPage() {
  const localAreas = [
    "Somerset West CBD", "Bridgewater", "Firgrove", "Heritage Park",
    "Strand", "Gordon's Bay", "Sir Lowry's Pass", "Stellenbosch",
    "Franschhoek", "Paarl"
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Virtual Reality Guys",
    "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
    "telephone": "+27717800323",
    "email": "virtualrealityguyz@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Somerset West",
      "addressRegion": "Western Cape",
      "addressCountry": "ZA"
    },
    "areaServed": localAreas.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "description": "Premium mobile virtual reality setup and supervisors for parties, corporate team buildings, and school events, serving Somerset West, Strand, Gordon's Bay, and the Helderberg region."
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Virtual Reality Somerset West",
        "item": "https://www.virtualrealityguyz.co.za/virtual-reality-somerset-west"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you charge extra travel fees for Somerset West and the Helderberg?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Somerset West, Strand, Gordon's Bay, and Stellenbosch fall within our primary local service circle. There are no additional travel surcharges to bring our mobile VR setups to these suburbs."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly can you set up and pack down the equipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our team arrives roughly 45 to 60 minutes before the scheduled start time to set up, test, and calibrate the virtual safety walls. Pack-down takes about 30 minutes. None of this setup/cleanup time cuts into your paid event hours."
        }
      },
      {
        "@type": "Question",
        "name": "What venues work best in Somerset West?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We can set up in double garages, living rooms, covered outdoor patios, community halls, restaurants, or office boardrooms. The main requirement is flat floor space (about 2.5m x 2.5m per active player headset) and access to a standard electrical wall plug."
        }
      },
      {
        "@type": "Question",
        "name": "Do you serve Stellenbosch and Winelands areas too?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we regularly service Stellenbosch, Franschhoek, and Paarl. We deliver mobile team buildings, kids' birthday setups, and school demonstrations across the entire Winelands region."
        }
      },
      {
        "@type": "Question",
        "name": "What is included in the mobile VR package?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All packages include delivery, full hardware setup (VR headsets, spectator screens, sanitation masks), professional friendly supervisors to teach players and manage safety, and access to our game library of over 100+ titles."
        }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-hero.jpg"
            alt="Virtual Reality Gaming Somerset West Helderberg"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Premium VR Entertainment in the Helderberg
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Somerset <span className="text-primary">West VR</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bring next-gen virtual reality gaming directly to your Somerset West event! We deliver and manage complete mobile VR stations for corporate functions, birthdays, and school events.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book in Somerset West</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/virtual-reality-cape-town">All Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Helderberg Coverage</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full delivery support across Somerset West, Strand, Gordon's Bay, and surrounding Winelands areas with zero delay.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">All Event Types</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tailored setups for private kids' birthday parties, corporate year-end team buildings, and school demonstration days.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Same Premium Service</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Standard package rates, expert coordination, trained supervisors, and over 100+ titles with zero local travel surcharges.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                The Best Local VR Setup in Somerset West & Winelands
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For residents and businesses in the Helderberg region, coordinating high-quality event entertainment can often mean paying high transport fees from central Cape Town. Virtual Reality Guys treats Somerset West, Strand, and Stellenbosch as our primary service areas, meaning you get prompt, local booking coordination without travel markups.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mobile virtual reality stations turn any local garage, hall, or office into a premium multi-headset gaming lounge. We customize setups for all Helderberg neighborhoods:
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                {localAreas.map(area => (
                  <div key={area} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary/30 p-8 border border-border rounded-3xl space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground italic leading-relaxed">
                "We booked the Premium package for my son's birthday party at our home in Somerset West. Having the virtual safety walls mapped out gave us absolute peace of mind, and the supervisors kept all the kids entertained and safe the entire afternoon. Outstanding local service with zero travel hassle!"
              </p>
              <div>
                <p className="font-bold text-foreground">Linda V.</p>
                <p className="text-xs text-muted-foreground">Parent, Somerset West</p>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Link href="/virtual-reality-cape-town" className="text-xs px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">All Service Areas</Link>
            <Link href="/vr-gaming-near-me" className="text-xs px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">VR Gaming Near Me</Link>
            <Link href="/kids-parties" className="text-xs px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Kids Parties</Link>
            <Link href="/corporate-events" className="text-xs px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all">Corporate Events</Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you charge extra travel fees for Somerset West and the Helderberg?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                No, Somerset West, Strand, Gordon's Bay, and Stellenbosch fall within our primary local service circle. There are no additional travel surcharges to bring our mobile VR setups to these suburbs.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How quickly can you set up and pack down the equipment?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our team arrives roughly 45 to 60 minutes before the scheduled start time to set up, test, and calibrate the virtual safety walls. Pack-down takes about 30 minutes. None of this setup/cleanup time cuts into your paid event hours.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What venues work best in Somerset West?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We can set up in double garages, living rooms, covered outdoor patios, community halls, restaurants, or office boardrooms. The main requirement is flat floor space (about 2.5m x 2.5m per active player headset) and access to a standard electrical wall plug.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you serve Stellenbosch and Winelands areas too?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, we regularly service Stellenbosch, Franschhoek, and Paarl. We deliver mobile team buildings, kids' birthday setups, and school demonstrations across the entire Winelands region.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What is included in the mobile VR package?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                All packages include delivery, full hardware setup (VR headsets, spectator screens, sanitation masks), professional friendly supervisors to teach players and manage safety, and access to our game library of over 100+ titles.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Book Somerset West VR Entertainment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We travel to all locations across the Helderberg and Winelands. Contact our event coordinator to secure your date today.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Local support based right in the Helderberg</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>No local delivery surcharges</span>
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
