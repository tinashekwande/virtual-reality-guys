import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Star, ArrowRight, Shield, Award, Sparkles, Trophy, Cake } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Birthday Party Activities Cape Town | Gaming Event Entertainment',
  description: 'Host an epic virtual reality birthday party in Cape Town. Unforgettable VR gaming activities for kids, teens, and adults delivered directly to your venue.',
  alternates: {
    canonical: '/birthday-party-activities',
  },
  openGraph: {
    title: 'VR Birthday Party Activities Cape Town | Gaming Event Entertainment',
    description: 'Throw the ultimate VR birthday party! We set up premium multiplayer VR gear, screens, and custom challenges for birthdays of all ages in Cape Town.',
    url: 'https://www.virtualrealityguyz.co.za/birthday-party-activities',
    images: [{ url: '/images/vr-party.jpg', alt: 'VR Birthday Party Activities Cape Town' }],
  }
}

export default function BirthdayActivitiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "VR Birthday Party Entertainment Activities",
    "serviceType": "Amusement & Entertainment",
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
      "name": "Cape Town and surrounding Western Cape suburbs"
    },
    "description": "Premium virtual reality birthday party packages brought to your location in Cape Town. Interactive multi-game stations, leaderboards, and expert supervision for kids, teens, and adults."
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What ages are VR birthday parties suitable for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our VR parties are incredibly popular across all age ranges! For children, we recommend ages 8 and up. We also run highly engaging VR birthday setups for teenagers, milestone 21st, 30th, and 40th adult birthdays."
        }
      },
      {
        "@type": "Question",
        "name": "Where can the birthday party take place?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are fully mobile and can set up inside your living room, double garage, patio, garden, office space, or hired clubhouse anywhere in Cape Town."
        }
      },
      {
        "@type": "Question",
        "name": "Are there multiplayer options?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our Standard and Premium packages feature cooperative multiplayer games where friends can explore, fight, and play together inside the same virtual environments."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-party.jpg"
            alt="VR Birthday Party Activities Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Epic Birthday Party Activities in Cape Town
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Birthday Party <span className="text-primary">Activities</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Host the most talked-about birthday party of the year! From multiplayer team challenges to high-energy rhythm face-offs, we bring next-generation gaming entertainment straight to you.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Your Party</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kids-parties">Explore Kids Parties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Propositions */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Cake className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Suitable for All Ages</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tailored lists for children (8+), teenagers, and adults. Game catalogs adapted dynamically to fit your specific group of guests.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Trophy className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Multiplayer Face-offs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect and team up with friends inside cooperative fantasy worlds, or slash your way to top leaderboard scores in competitive tournaments.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden group">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Turn-Key Entertainment</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No stress, no mess! We manage delivery, setup, tech checks, sanitation wipes, safety instruction, game supervision, and cleanup.
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
                Next-Gen Private Parties Delivered to Your Door
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Are you looking for unique birthday party activities in Cape Town that stand out from the ordinary? Bring a high-tech gaming arcade to your home! Virtual Reality Guys handles all the work. Our professional, friendly supervisors set up dynamic safety perimeters, guide users of all technical backgrounds, and ensure everyone remains safe and highly entertained.
              </p>
              
              <ul className="space-y-3 font-semibold text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>30+ premium game library (Beat Saber, Superhot, Job Simulator)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Spectator screens letting non-headset viewers join in the fun</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Strict sanitation wiping with medical-grade wipes between users</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/30 p-8 border border-border rounded-3xl space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground italic leading-relaxed">
                "We booked Virtual Reality Guys for my daughter's 16th birthday party and it was fantastic! The kids spent hours in multiplayer mode and the team handled the setup and guidance seamlessly. Highly recommend for any parents looking for unique birthday activities."
              </p>
              <div>
                <p className="font-bold text-foreground">Tracey L.</p>
                <p className="text-xs text-muted-foreground">Parent, Claremont Cape Town</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Birthday Party FAQs</h2>
          <div className="space-y-6">
            
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What ages are VR birthday parties suitable for?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our VR parties are incredibly popular across all age ranges! For children, we recommend ages 8 and up. We also run highly engaging VR birthday setups for teenagers, milestone 21st, 30th, and 40th adult birthdays.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Where can the birthday party take place?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We are fully mobile and can set up inside your living room, double garage, patio, garden, office space, or hired clubhouse anywhere in Cape Town.
              </p>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Are there multiplayer options?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, our Standard and Premium packages feature cooperative multiplayer games where friends can explore, fight, and play together inside the same virtual environments.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure Your VR Birthday Party Today</h2>
            <p className="text-muted-foreground leading-relaxed">
              Plan ahead to secure your preferred date and package options! Contact us today with your event date and estimated player numbers to secure your booking.
            </p>
            <div className="space-y-4 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local support within Western Cape</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Packages starting from just R999</span>
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
