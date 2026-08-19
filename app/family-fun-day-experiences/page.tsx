import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Sparkles, Smile, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Family Fun Day Activities Cape Town | VR Event Entertainment',
  description: 'Add an amazing futuristic experience to your family fun day in Cape Town! State-of-the-art mobile virtual reality games suitable for kids, teens, and adults.',
  alternates: {
    canonical: '/family-fun-day-experiences',
  },
  openGraph: {
    title: 'Family Fun Day Activities Cape Town | VR Event Entertainment',
    description: 'Looking for ultimate family fun activities in Cape Town? We deliver fully supervised mobile VR setups perfect for community days and multi-generational events.',
    url: 'https://www.virtualrealityguyz.co.za/family-fun-day-experiences',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Family Fun Day Activities Cape Town' }],
  }
}

export default function FamilyFunDayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "VR Family Fun Day Experiences",
    "serviceType": "Family Amusement & Event Entertainment",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
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
    "description": "Supervised virtual reality mobile stations brought directly to family fun days, community festivals, markets, and country clubs in Cape Town. Safe and fun for all generations."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can toddlers or very young children play?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For safety and optical development, we recommend our VR experiences for children aged 8 and up. However, we have extremely simple, stationary experiences (like viewing ocean reefs) that younger kids can enjoy with parent and supervisor guidance."
        }
      },
      {
        "@type": "Question",
        "name": "Is VR suitable for older adults/grandparents?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! VR is highly intuitive. We have simple, beautiful travel, history, and physical movement games (like bowling or golf) that are extremely easy for seniors and grandparents to play, making it a truly multi-generational event."
        }
      },
      {
        "@type": "Question",
        "name": "How many stations can you set up at a community event?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We can scale our stations dynamically from a 2-headset setup for small family picnics, up to a large 6-to-8 headset setup with dedicated queue supervisors for major community festivals."
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
        "item": "https://www.virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Family Fun Day Experiences",
        "item": "https://www.virtualrealityguyz.co.za/family-fun-day-experiences"
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
            alt="Family Fun Day Activities Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Multi-Generational Family Fun Activities
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Family Fun Day <span className="text-primary">Experiences</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bring the generations together with next-level entertainment! We set up fully-supervised mobile VR gaming stations that guarantee laughter and excitement for kids, teens, parents, and grandparents alike.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Your Event</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/mobile-vr-hire">View Hire Details</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Interactive Family Fun Activities Perfect for Any Venue
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Smile className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Fun for All Generations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Intuitive controls and simple movement rules mean kids (8+), parents, and grandparents can play together. Great for family bonding!
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">High Throughput</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For busy community festivals, we run fast, high-impact gaming rounds to maximize throughput, keeping line waits short and players happy.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Futuristic Visual Pull</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sleek VR headsets and high-res spectator screens act as a major crowd-puller at neighborhood markets, school fairs, and sports clubs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                100% Mobile, Supervised, and Sanitized Event Support
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Hosting a community picnic, church fair, or neighborhood sports day? Virtual Reality Guys provides a complete turn-key package. Our trained, friendly event supervisors manage queue flows, ensure physical boundaries are safe, teach basic movement, and wipe headsets down after each turn. Zero stress for event organizers!
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>30+ game library (Beat Saber, safe archery, sports, travel)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Spectator monitors showcasing real-time player action for viewers</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Strict sanitation wiping with medical wipes between rounds</span>
                </li>
              </ul>
            </div>



          </div>
          
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/corporate-events">Corporate Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/kids-parties">Kids Parties <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Family Entertainment FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Can toddlers or very young children play?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                For safety and optical development, we recommend our VR experiences for children aged 8 and up. However, we have extremely simple, stationary experiences (like viewing ocean reefs) that younger kids can enjoy with parent and supervisor guidance.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is VR suitable for older adults/grandparents?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes! VR is highly intuitive. We have simple, beautiful travel, history, and physical movement games (like bowling or golf) that are extremely easy for seniors and grandparents to play, making it a truly multi-generational event.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How many stations can you set up at a community event?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We can scale our stations dynamically from a 2-headset setup for small family picnics, up to a large 6-to-8 headset setup with dedicated queue supervisors for major community festivals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure Your Family Fun Day Setup</h2>
            <p className="text-muted-foreground leading-relaxed">
              Organizing a community day, church fair, or family gathering? Contact us today to discuss space availability and secure a customized mobile VR package.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Fully insured public-liability event setups</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Interactive leaderboard options to boost competition</span>
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
