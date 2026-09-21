import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight, Shield, Cpu, HardDrive, Zap, Truck, Users, Headset, Clock, MapPin, Gamepad2, PartyPopper, GraduationCap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Mobile VR Hire Cape Town | Rent VR Equipment for Events',
  description: 'Hire premium mobile VR setups in Cape Town from R999. Includes headsets, spectator screens, trained supervisors, 100+ games, delivery, setup & cleanup. Book today!',
  alternates: {
    canonical: '/mobile-vr-hire',
  },
  openGraph: {
    title: 'Mobile VR Hire Cape Town | Rent VR Equipment for Events',
    description: 'Looking to hire mobile VR in Cape Town? We deliver full virtual reality setups with supervisors to your venue. Birthdays, corporate events, schools & festivals.',
    url: 'https://virtualrealityguyz.co.za/mobile-vr-hire',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Mobile VR Hire Cape Town' }],
  }
}

export default function MobileVRHirePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mobile VR Hire Cape Town",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "telephone": "+27717800323",
      "email": "virtualrealityguyz@gmail.com",
      "url": "https://virtualrealityguyz.co.za",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA"
      }
    },
    "description": "Full-service mobile VR equipment rental and event gaming services delivered directly to venues across Greater Cape Town. Headsets, TVs, safety gear, and supervision included.",
    "areaServed": "Cape Town, Western Cape, South Africa",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Mobile VR Hire Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Starter Package",
          "price": "999",
          "priceCurrency": "ZAR",
          "description": "4 VR headsets, 2 hours of VR gaming, up to 5 players"
        },
        {
          "@type": "Offer",
          "name": "Standard Package",
          "price": "1399",
          "priceCurrency": "ZAR",
          "description": "5 VR headsets, 3 hours of VR gaming, up to 10 players"
        },
        {
          "@type": "Offer",
          "name": "Premium Package",
          "price": "1599",
          "priceCurrency": "ZAR",
          "description": "6 VR headsets, 4 hours of VR gaming, up to 15 players"
        }
      ]
    }
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
          "text": "Every hire includes latest-generation Meta Quest VR headsets, high-resolution spectator monitor displays, physical safety stands, sanitizing equipment, and trained supervisors to handle logistics, training, and gameplay facilitation."
        }
      },
      {
        "@type": "Question",
        "name": "How much does mobile VR hire cost in Cape Town?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our mobile VR hire packages start from R999 for 4 headsets (Starter), R1,399 for 5 headsets (Standard), and R1,599 for 6 headsets (Premium). All packages include professional setup, trained supervisors, and cleanup."
        }
      },
      {
        "@type": "Question",
        "name": "What are the space and electrical requirements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We need a flat, clear space of 2.5m x 2.5m per VR station. Standard power supply (220V plugs) is needed for spectator displays and headset charging units. Setups must be indoors or under a solid weatherproof tent or marquee."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver and set up the VR equipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We handle everything. Our team arrives early, sets up all equipment, maps out safety boundaries, configures games, supervises every session, and packs everything away afterwards. You don't need to touch any equipment."
        }
      },
      {
        "@type": "Question",
        "name": "Is the VR equipment sanitised between users?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We use medical-grade antibacterial wipes and sweat-proof silicone face inserts on all headsets. Every headset is thoroughly sanitised between each user for hygiene and comfort."
        }
      },
      {
        "@type": "Question",
        "name": "What areas in Cape Town do you deliver to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver across the entire Greater Cape Town area including City Bowl, Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Helderberg, Somerset West, Stellenbosch, Paarl, and surrounding areas in the Western Cape."
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
            alt="Mobile VR Hire Cape Town - Virtual Reality Equipment Rental"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Fully Managed VR Equipment Rental in Cape Town
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Mobile VR <span className="text-primary">Hire</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Hire a complete virtual reality setup for your next event — headsets, spectator screens, trained supervisors, and 100+ games delivered directly to your venue in Cape Town. From just R999.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CyberButton href="#booking" size="lg" variant="primary">
              Get a Free Quote <ArrowRight className="ml-1.5 h-4 w-4" />
            </CyberButton>
            <CyberButton href="#packages" size="lg" variant="secondary">
              View Packages & Pricing
            </CyberButton>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free Delivery</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Full Setup & Cleanup</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Trained Supervisors</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 100+ Games</span>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">What's Included in Every VR Hire</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When you hire mobile VR from Virtual Reality Guys, you get far more than just headsets. Every package is a fully managed, turnkey entertainment solution.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Headset className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">Meta Quest VR Headsets</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Latest-generation standalone VR headsets with high-refresh displays and precise motion tracking. No external PCs or cables required.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Cpu className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">Spectator Displays</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                High-resolution monitors that mirror gameplay in real-time so all your guests can watch and cheer, not just the player wearing the headset.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">Trained Supervisors</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dedicated, friendly staff who guide players through games, manage session rotations, and ensure everyone stays safe and entertained.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Gamepad2 className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">100+ Game Library</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A curated selection of games across action, rhythm, sports, racing, horror, and educational experiences — tailored to your audience and event type.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">Sanitised Equipment</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Medical-grade antibacterial wipes and sweat-proof silicone face inserts are used between every single user. Hygiene is never compromised.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-6 rounded-2xl group">
              <Truck className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2">Delivery, Setup & Cleanup</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We arrive early, set up all equipment, map out safety boundaries, run the event, and pack everything away. You don't lift a finger.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">How Mobile VR Hire Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Booking a VR setup for your event is simple. Here's the process from enquiry to cleanup.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary font-bold text-xl">1</div>
              <h3 className="font-bold">Enquire</h3>
              <p className="text-sm text-muted-foreground">Tell us your event date, venue, estimated guest count, and what type of event you're hosting.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary font-bold text-xl">2</div>
              <h3 className="font-bold">Get Your Quote</h3>
              <p className="text-sm text-muted-foreground">We'll recommend the best package for your group size and send a detailed quotation within 24 hours.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary font-bold text-xl">3</div>
              <h3 className="font-bold">We Set Up</h3>
              <p className="text-sm text-muted-foreground">Our team arrives at your venue, sets up all equipment, maps safety zones, and configures games for your audience.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary font-bold text-xl">4</div>
              <h3 className="font-bold">Enjoy & We Cleanup</h3>
              <p className="text-sm text-muted-foreground">Your guests play, we supervise. When the event ends, we pack everything away. Zero hassle for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages & Pricing */}
      <section id="packages" className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">VR Hire Packages & Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Every package includes delivery, setup, supervision, and cleanup across Cape Town.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Starter */}
            <div className="rounded-2xl p-8 border bg-secondary/40 border-border/50 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R999</span>
                  <span className="text-muted-foreground">/event</span>
                </div>
                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> <span>2 hours of VR gaming</span>
                </div>
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> <span>Suitable for up to 5 players</span>
                </div>
                <ul className="space-y-2 mb-8 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 4 VR headsets</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Professional setup & supervision</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Spectator display</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 30+ game selection</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Delivery, setup & cleanup</li>
                </ul>
              </div>
              <Button asChild className="w-full">
                <Link href="#booking">Book Starter</Link>
              </Button>
            </div>

            {/* Standard — Most Popular */}
            <div className="rounded-2xl p-8 border-2 border-primary bg-secondary/40 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R1,399</span>
                  <span className="text-muted-foreground">/event</span>
                </div>
                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> <span>3 hours of VR gaming</span>
                </div>
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> <span>Suitable for up to 10 players</span>
                </div>
                <ul className="space-y-2 mb-8 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 5 VR headsets</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Professional setup & supervision</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Spectator displays</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 60+ game selection</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Multiplayer tournaments</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Delivery, setup & cleanup</li>
                </ul>
              </div>
              <Button asChild className="w-full">
                <Link href="#booking">Book Standard</Link>
              </Button>
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-8 border bg-secondary/40 border-border/50 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R1,599</span>
                  <span className="text-muted-foreground">/event</span>
                </div>
                <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> <span>4 hours of VR gaming</span>
                </div>
                <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> <span>Suitable for up to 15 players</span>
                </div>
                <ul className="space-y-2 mb-8 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 6 VR headsets</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Professional setup & supervision</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Spectator displays</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> 100+ game selection</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Custom tournament brackets</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Photo & video package</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary shrink-0" /> Delivery, setup & cleanup</li>
                </ul>
              </div>
              <Button asChild className="w-full">
                <Link href="#booking">Book Premium</Link>
              </Button>
            </div>

          </div>
          <p className="text-center text-sm text-muted-foreground">
            Need a custom setup for a larger event? <Link href="#booking" className="text-primary hover:underline">Contact us</Link> for tailored packages with 8-10+ headsets for festivals, expos, and corporate conferences.
          </p>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Venue & Technical Requirements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We can set up in almost any indoor space. Here's what we need from your venue to ensure a smooth experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl">
              <HardDrive className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Space Requirements</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A minimum flat, clear area of <strong>2.5m × 2.5m per VR station</strong>. This means 2 headsets need roughly 15m², and 6 headsets need about 40m². Living rooms, double garages, school halls, and community venues all work perfectly.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Electrical Requirements</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Standard <strong>220V domestic wall plugs</strong> nearby for spectator displays and multi-battery fast chargers. No generator or special wiring needed — regular household or venue power is sufficient.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl">
              <Cpu className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Weather & Lighting</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Setups must be <strong>indoors or under a fully covered marquee</strong>. Direct sunlight can damage VR lenses permanently. We recommend dimmed or ambient lighting for the best visual experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Who Hires Mobile VR */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Who Hires Mobile VR?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our mobile VR setups are perfect for any event where you want high-energy, interactive entertainment that keeps every guest engaged.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Link href="/vr-birthday-parties" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <PartyPopper className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Birthday Parties</h3>
              <p className="text-muted-foreground text-sm">Turn any birthday into an unforgettable gaming experience. Kids, teens, and adults love the immersive competition.</p>
            </Link>

            <Link href="/corporate-events" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Corporate Events</h3>
              <p className="text-muted-foreground text-sm">Year-end functions, product launches, and client entertainment. VR creates a memorable, talking-point experience.</p>
            </Link>

            <Link href="/vr-team-building" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <Sparkles className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Team Building</h3>
              <p className="text-muted-foreground text-sm">Multiplayer VR challenges that build camaraderie, break the ice, and give teams a shared experience they'll talk about for weeks.</p>
            </Link>

            <Link href="/educational-vr-cape-town" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <GraduationCap className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Schools & Education</h3>
              <p className="text-muted-foreground text-sm">Science days, open days, and curriculum-aligned VR lessons. Students explore the Solar System, human anatomy, and more.</p>
            </Link>

            <Link href="/family-fun-day-experiences" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <Headset className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Festivals & Fun Days</h3>
              <p className="text-muted-foreground text-sm">High-throughput setups for community events, church fairs, school carnivals, and public festivals with hundreds of attendees.</p>
            </Link>

            <Link href="/kids-parties" className="bg-secondary/40 border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group block">
              <Gamepad2 className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Kids Gaming Parties</h3>
              <p className="text-muted-foreground text-sm">Playdates, after-school events, and school holiday entertainment. Safe, supervised, and endlessly exciting for children aged 8+.</p>
            </Link>

          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Mobile VR Hire FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What equipment is included in the VR hire?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Every hire includes latest-generation Meta Quest VR headsets, high-resolution spectator monitor displays, physical safety stands, sanitizing equipment, and trained supervisors to handle logistics, training, and gameplay facilitation.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How much does mobile VR hire cost in Cape Town?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our mobile VR hire packages start from R999 for 4 headsets (Starter), R1,399 for 5 headsets (Standard), and R1,599 for 6 headsets (Premium). All packages include professional setup, trained supervisors, and cleanup. Custom packages are available for larger events.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What are the space and electrical requirements?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We need a flat, clear space of 2.5m × 2.5m per VR station. Standard power supply (220V plugs) is needed for spectator displays and headset charging units. Setups must be indoors or under a solid weatherproof tent or marquee.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you deliver and set up the VR equipment?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes! We handle everything from start to finish. Our team arrives early, sets up all equipment, maps out safety boundaries, configures games for your audience, supervises every session, and packs everything away afterwards. You don't need to touch any equipment.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is the VR equipment sanitised between users?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Absolutely. We use medical-grade antibacterial wipes and sweat-proof silicone face inserts on all headsets. Every headset is thoroughly sanitised between each user for hygiene and comfort.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What areas in Cape Town do you deliver to?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We deliver across the entire Greater Cape Town area including City Bowl, Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Helderberg, Somerset West, Stellenbosch, Paarl, and surrounding areas in the Western Cape.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Get a Free VR Hire Quote</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tell us about your event and we'll recommend the perfect VR hire package. We respond to all enquiries within 24 hours.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Free delivery across all Cape Town suburbs</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Quotes within 24 hours</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Scalable setups from 2 up to 10+ VR headset stations</span>
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>50% deposit secures your date</span>
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
