import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, MapPin, Sparkles, ArrowRight, Shield, Award, Users, Headset, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'Virtual Reality Cape Town | Premium VR Experiences Near Me',
  description: 'Experience the ultimate Virtual Reality in Cape Town! We deliver state-of-the-art mobile VR gaming, team building, and party setups to your venue across CPT.',
  alternates: {
    canonical: '/virtual-reality-cape-town',
  },
  openGraph: {
    title: 'Virtual Reality Cape Town | Premium VR Experiences Near Me',
    description: 'Looking for virtual reality in Cape Town? We bring the future of gaming directly to your home, office, or school venue with expert supervisors.',
    url: 'https://www.virtualrealityguyz.co.za/virtual-reality-cape-town',
    images: [{ url: '/images/vr-hero.jpg', alt: 'Virtual Reality Cape Town Hub' }],
  }
}

export default function CapeTownVRPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Virtual Reality Guys",
    "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
    "@id": "https://www.virtualrealityguyz.co.za/virtual-reality-cape-town#organization",
    "url": "https://www.virtualrealityguyz.co.za/virtual-reality-cape-town",
    "telephone": "+27717800323",
    "email": "virtualrealityguyz@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "postalCode": "8000",
      "addressCountry": "ZA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "City Bowl" },
      { "@type": "AdministrativeArea", "name": "Atlantic Seaboard" },
      { "@type": "AdministrativeArea", "name": "Southern Suburbs" },
      { "@type": "AdministrativeArea", "name": "Northern Suburbs" },
      { "@type": "AdministrativeArea", "name": "Stellenbosch" },
      { "@type": "AdministrativeArea", "name": "Somerset West" },
      { "@type": "AdministrativeArea", "name": "Hout Bay" },
      { "@type": "AdministrativeArea", "name": "Bloubergstrand" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "47",
      "bestRating": "5"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you have a physical VR arcade in Cape Town?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Virtual Reality Guys is a premium mobile VR entertainment service. We do not have a physical arcade; instead, we bring the entire VR arcade experience directly to your venue (home, school, corporate office, or event space) anywhere in Cape Town."
        }
      },
      {
        "@type": "Question",
        "name": "What areas in Cape Town do you travel to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve all Cape Town regions including the City Bowl, Atlantic Seaboard (Camps Bay, Sea Point), Southern Suburbs (Claremont, Rondebosch, Constantia), Northern Suburbs (Bellville, Durbanville), Bloubergstrand, Milnerton, Somerset West, and Stellenbosch."
        }
      },
      {
        "@type": "Question",
        "name": "How much space is needed for a mobile VR setup?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We need a minimum clear space of 2.5m x 2.5m per VR headset setup. An indoor area or a fully covered outdoor space is required to prevent direct sunlight from damaging the headset's optical lenses."
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
        "name": "Virtual Reality Cape Town",
        "item": "https://www.virtualrealityguyz.co.za/virtual-reality-cape-town"
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
            alt="Virtual Reality Experiences in Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Cape Town's Leading VR Entertainment
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Virtual Reality <span className="text-primary">Cape Town</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Looking for standard-setting virtual reality near me? We bring premium, immersive mobile VR gaming setups directly to your private party, corporate team building, or school venue.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book CPT Experience</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/mobile-vr-hire">View Setup Info</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                The Ultimate VR Setup Brought Directly to Your Suburb
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Why travel to a crowded mall when you can host a premium VR arcade in your own backyard or office? Virtual Reality Guys provides full-service VR setups including high-end headsets, flat screen displays for spectators, multiplayer tournaments, and professional supervisors to manage everything.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Serving Atlantic Seaboard, Southern Suburbs, & Northern Suburbs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>100% Mobile — We pack, deliver, set up, and clean up</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>State-of-the-art equipment with strict sanitation protocols</span>
                </li>
              </ul>

              <div className="bg-secondary/30 p-6 border border-border rounded-2xl space-y-4 mt-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground italic text-sm leading-relaxed">
                  "The VR guys covered our corporate event in Sea Point and the setup was seamless. Every guest loved it!"
                </p>
                <div>
                  <p className="font-bold text-sm">Mark D.</p>
                  <p className="text-xs text-muted-foreground">Events Coordinator, Sea Point</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/40 border border-border p-8 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xl font-bold">Our Service Coverage Areas</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>City Bowl / CPT CBD</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Camps Bay & Sea Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Claremont & Rondebosch</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Bellville & Durbanville</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Century City & Milnerton</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Stellenbosch & Somerset West</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-4 border-t border-border/40">
                Don't see your neighborhood? <Link href="#booking" className="text-primary hover:underline font-semibold">Contact us</Link> to check if our mobile unit travels to your area in the Western Cape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Hub */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Explore Our VR Experiences</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            
            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Corporate Team Building</h3>
              <p className="text-muted-foreground text-sm mb-4">Enhance leadership and team collaboration with engaging multiplayer VR experiences built for corporate clients.</p>
              <Link href="/vr-team-building" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Kids Birthday Parties</h3>
              <p className="text-muted-foreground text-sm mb-4">Give your kids the coolest party on the block! Safe, supervised, high-energy gaming sessions tailored by age group.</p>
              <Link href="/kids-parties" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Mobile VR Setup Hire</h3>
              <p className="text-muted-foreground text-sm mb-4">Rent premium VR headsets and screens for any festival, school showcase, or private family celebration.</p>
              <Link href="/mobile-vr-hire" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Family Fun Days</h3>
              <p className="text-muted-foreground text-sm mb-4">Interactive games and experiences suitable for children, teenagers, parents, and grandparents alike.</p>
              <Link href="/family-fun-day-experiences" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">School VR Demos</h3>
              <p className="text-muted-foreground text-sm mb-4">Bring curriculum topics to life with immersive, educational journeys through space, science, and history.</p>
              <Link href="/school-vr-demonstrations" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Birthday Activities</h3>
              <p className="text-muted-foreground text-sm mb-4">Host an epic virtual reality birthday event. Multiplayer racing, combat, and rhythm games delivered to you.</p>
              <Link href="/birthday-party-activities" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-gaming-near-me">VR Gaming Near Me <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/virtual-reality-somerset-west">Somerset West & Helderberg <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/educational-vr-cape-town">Educational VR <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Localized FAQ Section */}
      <section className="py-20 bg-background/50 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do you have a physical VR arcade in Cape Town?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Virtual Reality Guys is a premium mobile VR entertainment service. We do not have a physical arcade; instead, we bring the entire VR arcade experience directly to your venue (home, school, corporate office, or event space) anywhere in Cape Town.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What areas in Cape Town do you travel to?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We serve all Cape Town regions including the City Bowl, Atlantic Seaboard (Camps Bay, Sea Point, Green Point), Southern Suburbs (Claremont, Rondebosch, Constantia, Hout Bay), Northern Suburbs (Bellville, Durbanville, Edgemead), Bloubergstrand, Milnerton, Somerset West, and Stellenbosch.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How much space is needed for a mobile VR setup?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We need a minimum clear space of 2.5m x 2.5m per VR headset setup. An indoor area or a fully covered outdoor space is required to prevent direct sunlight from damaging the headset's optical lenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form container */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Secure Your VR Event Booking Today</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ready to transform your event into an unforgettable interactive adventure? Fill out our local Cape Town booking request, and our event coordinator will be in touch within 24 hours to secure your date.
            </p>
            <div className="space-y-3 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local support within Cape Town</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Fully insured event entertainment service</span>
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
