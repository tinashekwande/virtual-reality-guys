import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight, Shield, Award, Users, Headset, MapPin, Gamepad2, Clock, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BookingForm from "@/components/BookingForm"

export const metadata: Metadata = {
  title: 'VR Experiences Cape Town | Immersive Virtual Reality | Virtual Reality Guys',
  description: 'Discover immersive VR experiences in Cape Town. From action-packed gaming to educational adventures, we bring premium virtual reality directly to your venue. Book today!',
  alternates: {
    canonical: '/vr-experience-cape-town',
  },
  openGraph: {
    title: 'VR Experiences Cape Town | Immersive Virtual Reality | Virtual Reality Guys',
    description: 'Discover immersive VR experiences in Cape Town. From action-packed gaming to educational adventures, we bring premium virtual reality directly to your venue. Book today!',
    url: 'https://www.virtualrealityguyz.co.za/vr-experience-cape-town',
    images: [{ url: '/images/vr-hero.jpg', alt: 'VR Experiences Cape Town' }],
  }
}

export default function VrExperienceCapeTownPage() {
  const serviceAreas = [
    "Kraaifontein", "Brackenfell", "Durbanville", "Bellville", 
    "Kuils River", "Joostenberg Vlakte", "Pinehurst", "Buh-Rein Estate",
    "Somerset West", "City Bowl", "Southern Suburbs"
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Virtual Reality Experience",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Virtual Reality Guys",
      "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
      "telephone": "+27717800323",
      "email": "virtualrealityguyz@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA"
      }
    },
    "areaServed": serviceAreas.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "description": "Discover immersive VR experiences in Cape Town. We bring premium virtual reality using Meta Quest equipment directly to your venue for an unforgettable event.",
    "offers": {
      "@type": "Offer",
      "price": "399",
      "priceCurrency": "ZAR",
      "description": "Packages starting from R399"
    }
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
        "name": "VR Experiences Cape Town",
        "item": "https://www.virtualrealityguyz.co.za/vr-experience-cape-town"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What happens during a VR experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "During a VR experience, our team sets up the virtual reality equipment at your venue. We map out safe play zones, provide a safety briefing, and guide players through putting on the headsets. Once inside, players can choose from a variety of immersive worlds, games, and scenarios, while our facilitators manage the equipment and ensure everyone has a great time."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a VR session last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our typical VR experience packages range from 2 to 4 hours. This provides ample time for guests to try different games, take turns, and fully immerse themselves without feeling rushed."
        }
      },
      {
        "@type": "Question",
        "name": "Is VR safe for children?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our VR experiences are suitable and safe for children aged 8 and older. We carefully select age-appropriate content and our trained supervisors ensure kids play safely within their designated physical boundaries."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need previous VR experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not at all! The vast majority of our guests are trying VR for the very first time. Our friendly facilitators provide step-by-step instructions and start beginners off with gentle, intuitive experiences."
        }
      },
      {
        "@type": "Question",
        "name": "How many people can play at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This depends on the package you select. We can set up multiple headsets for simultaneous play, allowing guests to join multiplayer sessions or play solo games side-by-side. For large groups, we rotate players seamlessly."
        }
      },
      {
        "@type": "Question",
        "name": "Where can we have the VR experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are a mobile service, so we bring the VR experience to you! We operate across Cape Town, including Kraaifontein, Durbanville, Bellville, Somerset West, and beyond. We can set up in homes, offices, schools, or community halls, provided there is enough clear indoor space (about 2.5m x 2.5m per headset)."
        }
      },
      {
        "@type": "Question",
        "name": "What equipment do you use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use premium Meta Quest VR headsets. These offer high-resolution displays, precise hand-tracking, and a wire-free experience for maximum immersion and freedom of movement."
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
            alt="VR Experiences in Cape Town"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-block">
            Mobile Virtual Reality Entertainment
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            VR Experiences in <span className="text-primary">Cape Town</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover immersive VR experiences brought directly to your venue. From action-packed gaming to educational adventures, step into the future of entertainment.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="#booking">Book Your Experience</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/vr-games-catalogue">View Games</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What is a VR Experience? */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">
                What Is a VR Experience?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A VR (Virtual Reality) experience completely transforms your surroundings. By putting on our state-of-the-art Meta Quest headsets, you are instantly transported to breathtaking digital worlds. You don't just watch the action on a screen; you are completely inside it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Using intuitive hand controllers and full 360-degree vision, you can interact with the environment, solve puzzles, compete in sports, or battle alongside friends. Our mobile service means you can enjoy these premium, 2 to 4-hour experiences in the comfort of your own home, office, or hired venue. Suitable for group sizes large and small, and appropriate for ages 8 and up.
              </p>
              
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Interactive Meta Quest equipment</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>2 to 4-hour flexible event durations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Safe and suitable for ages 8+</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/40 border border-border p-8 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xl font-bold">Cape Town Service Areas</h3>
              <p className="text-sm text-muted-foreground">We deliver the experience to your location. Free delivery is included for:</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Kraaifontein</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Brackenfell</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Durbanville</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Bellville</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Kuils River</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Buh-Rein Estate</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-4 border-t border-border/40">
                We also travel to Somerset West, the City Bowl, Southern Suburbs, and the rest of Cape Town (a small travel fee may apply depending on distance). Packages starting from R399.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of VR Experiences We Offer */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold">Types of VR Experiences We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From heart-pounding action to cooperative team building, we curate a wide selection of game categories to suit any event type and guest preference.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            
            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Gamepad2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Action & Horror</h3>
              <p className="text-muted-foreground text-sm mb-4">Adrenaline-fueled shooters, zombie survival, and thrilling horror experiences for teenagers and adults looking for excitement.</p>
              <Link href="/vr-games-catalogue" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Games <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Adventure & Educational</h3>
              <p className="text-muted-foreground text-sm mb-4">Explore the depths of the ocean, travel to outer space, or walk with dinosaurs. Perfect for schools and curious minds.</p>
              <Link href="/vr-games-catalogue" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Games <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-secondary/20 border border-border/60 p-8 rounded-2xl hover:border-primary/40 transition-colors group">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Sports & Multiplayer</h3>
              <p className="text-muted-foreground text-sm mb-4">Compete against friends in virtual tennis, boxing, mini-golf, and cooperative rhythm games. Great for team building and parties.</p>
              <Link href="/vr-team-building" className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-birthday-parties">VR Birthday Parties <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/mobile-vr-hire">Mobile VR Hire <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How Our VR Experience Works */}
      <section className="py-20 bg-background/50 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Our VR Experience Works</h2>
            <p className="text-muted-foreground">Booking a mobile VR experience in Cape Town is simple and stress-free. We handle everything so you can focus on enjoying the event.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Book Your Date</h3>
              <p className="text-muted-foreground text-sm">
                Fill out our contact form or give us a call. Let us know your location, group size, and preferred date to secure your spot.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. We Deliver & Setup</h3>
              <p className="text-muted-foreground text-sm">
                Our team arrives at your venue, maps out the safe digital play areas, and sets up the Meta Quest headsets and display screens.
              </p>
            </div>

            <div className="bg-secondary/40 border border-border/50 p-8 rounded-2xl relative overflow-hidden text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headset className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Immersion Time</h3>
              <p className="text-muted-foreground text-sm">
                Our friendly supervisors guide players through the games, ensuring everyone gets a turn and has a spectacular experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-y border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What happens during a VR experience?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                During a VR experience, our team sets up the virtual reality equipment at your venue. We map out safe play zones, provide a safety briefing, and guide players through putting on the headsets. Once inside, players can choose from a variety of immersive worlds, games, and scenarios, while our facilitators manage the equipment and ensure everyone has a great time.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How long does a VR session last?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our typical VR experience packages range from 2 to 4 hours. This provides ample time for guests to try different games, take turns, and fully immerse themselves without feeling rushed.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is VR safe for children?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Yes, our VR experiences are suitable and safe for children aged 8 and older. We carefully select age-appropriate content and our trained supervisors ensure kids play safely within their designated physical boundaries.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Do I need previous VR experience?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Not at all! The vast majority of our guests are trying VR for the very first time. Our friendly facilitators provide step-by-step instructions and start beginners off with gentle, intuitive experiences.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How many people can play at once?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                This depends on the package you select. We can set up multiple headsets for simultaneous play, allowing guests to join multiplayer sessions or play solo games side-by-side. For large groups, we rotate players seamlessly.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Where can we have the VR experience?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We are a mobile service, so we bring the VR experience to you! We operate across Cape Town, including Kraaifontein, Durbanville, Bellville, Somerset West, and beyond. We can set up in homes, offices, schools, or community halls, provided there is enough clear indoor space (about 2.5m x 2.5m per headset).
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What equipment do you use?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We use premium Meta Quest VR headsets. These offer high-resolution displays, precise hand-tracking, and a wire-free experience for maximum immersion and freedom of movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form container */}
      <section id="booking" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Book Your VR Experience</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ready to dive into the world of virtual reality? Fill out the form below with your event details, and we'll get back to you with a customized quote and availability. Let's make your next event unforgettable!
            </p>
            <div className="space-y-3 font-semibold text-sm">
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Responsive local support within Cape Town</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Tailored packages to suit your event size</span>
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
