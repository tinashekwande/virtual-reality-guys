import { createAdminClient } from "@/lib/supabase/admin";
import type { Media, Category, TeamMember } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Headset,
  Users,
  Shield,
  Sparkles,
  Calendar,
  Truck,
  Gamepad2,
  Star,

  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Check,
  Clock,
  PartyPopper,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import BookingForm from "@/components/BookingForm";
import HeroParallax from "@/components/motion/HeroParallax";
import ScrollReveal from "@/components/motion/ScrollReveal";
import MotionButton from "@/components/motion/MotionButton";
import TiltCard from "@/components/motion/TiltCard";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile VR Gaming Experiences for Events in Cape Town',
  description: 'Bring the future of gaming to your event! Virtual Reality Guys delivers immersive mobile VR experiences for schools, parties, corporate events, and festivals across Cape Town. From R399.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Virtual Reality Guys | Mobile VR Gaming Cape Town',
    description: 'Premium mobile VR gaming experiences delivered to your venue in Cape Town. Schools, parties, corporate events & festivals. Book today!',
    url: 'https://www.virtualrealityguyz.co.za',
    images: [{ url: '/images/logo.png', alt: 'Virtual Reality Guys Logo' }],
  }
}

export const revalidate = 60;

async function fetchPublicData() {
  try {
    const admin = createAdminClient();
    const [{ data: media }, { data: categories }, { data: team }] = await Promise.all([
      admin.from("media").select("*, categories(id, name)").order("created_at", { ascending: false }),
      admin.from("categories").select("*").order("name"),
      admin.from("team_members").select("*").order("sort_order").order("created_at"),
    ]);
    return {
      media: (media ?? []) as Media[],
      categories: (categories ?? []) as Category[],
      team: (team ?? []) as TeamMember[],
    };
  } catch {
    return { media: [], categories: [], team: [] };
  }
}

export default async function Home() {
  const { media, categories, team } = await fetchPublicData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Virtual Reality Guys",
    "image": "https://www.virtualrealityguyz.co.za/images/logo.png",
    "@id": "https://www.virtualrealityguyz.co.za/#organization",
    "url": "https://www.virtualrealityguyz.co.za",
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
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "22:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "VR Mobile Gaming Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Starter Package",
            "description": "2 VR headsets, professional setup, trained supervisor, 30+ game selection. Perfect for small parties."
          },
          "price": "399",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Standard Package",
            "description": "4 VR headsets, professional setup, 2 trained supervisors, 60+ game selection, multiplayer tournaments."
          },
          "price": "799",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Package",
            "description": "6 VR headsets, professional setup, 3 trained supervisors, 100+ game selection, custom tournament brackets, photo & video package."
          },
          "price": "1199",
          "priceCurrency": "ZAR"
        }
      ]
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
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is mobile VR gaming?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We bring premium virtual reality headsets, games, and professional supervisors directly to your venue, home, or office in Cape Town. We handle set up, safety boundary mapping, and guiding the players."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a VR experience cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our mobile packages start from just R399 for the Starter package. Standard is R799 and Premium is R1199. Custom packages are available for large events."
        }
      },
      {
        "@type": "Question",
        "name": "What areas in Cape Town do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve all suburbs across Greater Cape Town including the City Bowl, Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Somerset West, Stellenbosch, and the Helderberg."
        }
      },
      {
        "@type": "Question",
        "name": "Is VR safe for children?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We recommend VR for ages 8 and up. We use built-in virtual boundaries to prevent collisions, supervise all sessions, and curate kid-friendly, non-violent games."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book a VR experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply fill out our booking form, call us at +27 71 780 0323, or WhatsApp us. We will confirm your requested date, venue spacing, and package within 24 hours."
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <HeroParallax
          className="w-full min-h-screen flex items-center justify-center"
          backgroundChildren={
            <>
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/vr-hero.jpg"
                  alt="Mobile VR Gaming Experience Cape Town"
                  fill
                  className="object-cover opacity-40 scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
              </div>

              {/* Animated Lines */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
                <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse delay-300" />
                <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse delay-700" />
              </div>
            </>
          }
          contentChildren={
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
              <ScrollReveal variant="zoom-in" duration={900}>
                <div className="space-y-8">
                  <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-balance">
                    Bring the{" "}
                    <span className="text-primary">Future of Gaming</span>
                    <br />
                    to Your Event
                  </h1>
                  <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
                    Immersive virtual reality experiences delivered directly to your
                    school, party, corporate event, or festival. We bring the
                    adventure to you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <MotionButton>
                      <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link href="#contact">
                          Book Your Experience <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </MotionButton>
                    <MotionButton>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6"
                      >
                        <Link href="/vr-games-catalogue">View Catalogue</Link>
                      </Button>
                    </MotionButton>
                  </div>
                  <div className="flex flex-wrap justify-center gap-8 pt-8 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>Professional Setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>All Ages Welcome</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>We Come to You</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          }
        />

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-background/30 backdrop-blur-md border-y border-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fade-right">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-primary font-semibold tracking-wide uppercase">
                    About Us
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-balance">
                    Mobile VR Gaming That Comes to You
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Virtual Reality Guys is your premier mobile VR entertainment
                  service. We bring cutting-edge virtual reality experiences
                  directly to your location, transforming any event into an
                  unforgettable adventure.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether it&apos;s a birthday party, school event, corporate
                  team-building, or community festival, we handle everything from
                  setup to supervision so you can focus on having fun.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">Premium</div>
                    <div className="text-muted-foreground">Equipment</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">Professional</div>
                    <div className="text-muted-foreground">Service</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-left" delay={200}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="bg-secondary rounded-2xl p-6 border border-border hover:border-primary/40 transition-colors">
                      <Headset className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Schools</h3>
                      <p className="text-sm text-muted-foreground">
                        Educational and fun VR experiences for students of all ages
                      </p>
                    </div>
                  </TiltCard>
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="bg-secondary rounded-2xl p-6 border border-border hover:border-primary/40 transition-colors">
                      <PartyPopper className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Birthday Parties</h3>
                      <p className="text-sm text-muted-foreground">
                        Make their special day absolutely unforgettable
                      </p>
                    </div>
                  </TiltCard>
                </div>
                <div className="space-y-4 mt-8">
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="bg-secondary rounded-2xl p-6 border border-border hover:border-primary/40 transition-colors">
                      <Users className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Corporate Events</h3>
                      <p className="text-sm text-muted-foreground">
                        Team building and entertainment for the workplace
                      </p>
                    </div>
                  </TiltCard>
                  <TiltCard maxTilt={6} scale={1.02}>
                    <div className="bg-secondary rounded-2xl p-6 border border-border hover:border-primary/40 transition-colors">
                      <Sparkles className="h-10 w-10 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Festivals</h3>
                      <p className="text-sm text-muted-foreground">
                        High-traffic entertainment for large gatherings
                      </p>
                    </div>
                  </TiltCard>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-team-building">Team Building</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/kids-parties">Kids Parties</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/corporate-events">Corporate Events</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/mobile-vr-hire">Mobile VR Hire</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/school-vr-demonstrations">School Demos</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-birthday-parties">Birthday Parties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="experiences" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-primary font-semibold tracking-wide uppercase mb-4">
                Our Experiences
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
                What Makes Our VR Experience Special
              </h2>
              <p className="text-lg text-muted-foreground">
                We provide premium equipment, professional supervision, and a
                wide variety of games suitable for all ages and skill levels.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Headset className="h-8 w-8" />}
              title="Premium VR Headsets"
              description="Latest generation VR equipment with crystal-clear displays and precise motion tracking for the most immersive experience."
            />
            <FeatureCard
              icon={<Gamepad2 className="h-8 w-8" />}
              title="Multiplayer & Solo Games"
              description="Choose from competitive multiplayer battles, cooperative adventures, or individual experiences tailored to your group."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Safe & Supervised"
              description="Our trained staff ensures everyone has a safe, comfortable experience with proper hygiene protocols between sessions."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="All Age Groups"
              description="Games and experiences suitable for children, teens, and adults. Everyone can join in on the fun."
            />
            <FeatureCard
              icon={<Truck className="h-8 w-8" />}
              title="We Come to You"
              description="No need to travel. We bring all equipment, set everything up, and pack it all away when we&apos;re done."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="100+ Game Library"
              description="Access to over 100 VR titles including action, adventure, sports, rhythm games, and educational experiences."
            />
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 sm:py-32 bg-background/30 backdrop-blur-md border-y border-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4">
              Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Choose Your VR Package
            </h2>
            <p className="text-lg text-muted-foreground">
              Flexible packages designed to fit any event size and budget. All
              packages include setup, supervision, and cleanup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="399"
              duration="2 hours"
              players="Up to 10 players"
              features={[
                "2 VR headsets",
                "Professional setup",
                "Trained supervisor",
                "30+ game selection",
                "Suitable for small parties",
              ]}
            />
            <PricingCard
              title="Standard"
              price="799"
              duration="3 hours"
              players="Up to 20 players"
              featured
              features={[
                "4 VR headsets",
                "Professional setup",
                "2 trained supervisors",
                "60+ game selection",
                "Multiplayer tournaments",
                "Photo opportunities",
              ]}
            />
            <PricingCard
              title="Premium"
              price="1199"
              duration="4 hours"
              players="Up to 40 players"
              features={[
                "6 VR headsets",
                "Professional setup",
                "3 trained supervisors",
                "100+ game selection",
                "Custom tournament brackets",
                "Photo & video package",
                "Priority booking",
              ]}
            />
          </div>

          <div className="text-center text-muted-foreground mt-12 space-y-4 max-w-2xl mx-auto">
            <p>
              Need a custom package for your event?{" "}
              <Link href="#contact" className="text-primary hover:underline">
                Contact us
              </Link>{" "}
              for a personalized quote.
            </p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed border-t border-border/20 pt-4">
              <strong>*Transport & Delivery Note:</strong> Delivery and travel are 100% free for events in Kraaifontein and surrounding local areas including Brackenfell, Durbanville, Bellville, Kuils River, Joostenberg Vlakte, Pinehurst, and Buh-Rein Estate. For all other areas across Greater Cape Town and the Western Cape, a reasonable transport fee will apply.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4">
              Gallery
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              See the Fun in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Real moments from real events. See how our VR experiences bring
              joy to people of all ages.
            </p>
          </div>

          <GallerySection media={media} categories={categories} preview={true} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-background/30 backdrop-blur-md border-y border-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4">
              Testimonials
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              What Our Customers Say
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-xl text-muted-foreground text-center max-w-2xl">
              See what our amazing customers have to say about our mobile VR gaming experiences.
            </p>
            <Button asChild size="lg" className="text-lg">
              <a href="#" target="_blank" rel="noopener noreferrer">
                See our reviews on Google
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section — dynamic from DB */}
      {/* {team.length > 0 && (
        <section id="team" className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-primary font-semibold tracking-wide uppercase mb-4">Our Team</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Meet the VR Guys</h2>
              <p className="text-lg text-muted-foreground">The passionate crew behind every epic VR experience.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map(member => (
                <div key={member.id} className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/40 transition-colors">
                  <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-4 overflow-hidden">
                    {member.image_url
                      ? <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary">{member.name[0]}</div>
                    }
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  {member.bio && <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* How It Works Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Three Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Getting the ultimate VR experience for your event is easier than
              you think.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-primary to-primary opacity-30" />

            <StepCard
              number="1"
              title="Book a Session"
              description="Fill out our contact form or give us a call. Tell us about your event and choose a package that fits your needs."
              icon={<Calendar className="h-6 w-6" />}
            />
            <StepCard
              number="2"
              title="We Arrive & Set Up"
              description="On the day of your event, our team arrives early to set up all equipment and ensure everything is ready to go."
              icon={<Truck className="h-6 w-6" />}
            />
            <StepCard
              number="3"
              title="Enjoy the Experience"
              description="Your guests dive into amazing VR worlds while our staff manages everything. Pure fun, zero hassle."
              icon={<Gamepad2 className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background/50 border-y border-border/30 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What is mobile VR gaming?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We bring premium virtual reality headsets, games, and professional supervisors directly to your venue, home, or office in Cape Town. We handle set up, safety boundary mapping, and guiding the players.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How much does a VR experience cost?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Our mobile packages start from just R399 for the Starter package. Standard is R799 and Premium is R1199. Custom packages are available for large events.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">What areas in Cape Town do you serve?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                We serve all suburbs across Greater Cape Town including the City Bowl, Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Somerset West, Stellenbosch, and the Helderberg.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">Is VR safe for children?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Absolutely! We recommend VR for ages 8 and up. We use built-in virtual boundaries to prevent collisions, supervise all sessions, and curate kid-friendly, non-violent games.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How do I book a VR experience?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Simply fill out our booking form, call us at +27 71 780 0323, or WhatsApp us. We will confirm your requested date, venue spacing, and package within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Serve Section */}
      <section className="py-20 border-t border-border/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl font-bold">Where We Serve in Cape Town</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We deliver premium mobile VR experiences across the Greater Cape Town area and beyond.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {["City Bowl", "Sea Point", "Camps Bay", "Green Point", "Hout Bay", "Claremont", "Rondebosch", "Constantia", "Bellville", "Durbanville", "Century City", "Milnerton", "Bloubergstrand", "Somerset West", "Stellenbosch"].map(area => (
              <div key={area} className="bg-secondary/30 px-4 py-3 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground">
                {area}
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/virtual-reality-cape-town">View All Service Areas</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/virtual-reality-somerset-west">Somerset West & Helderberg</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 bg-background/30 backdrop-blur-md border-t border-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary font-semibold tracking-wide uppercase">
                  Book Now
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-balance">
                  Ready to Level Up Your Event?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form and we&apos;ll get back to you within 24
                  hours to discuss your VR experience.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call us</p>
                    <p className="font-semibold">+27 71 780 0323</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email us</p>
                    <p className="font-semibold">virtualrealityguyz@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service area</p>
                    <p className="font-semibold">Cape Town CPT</p>
                  </div>
                </div>
              </div>
            </div>

            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <TiltCard maxTilt={6} scale={1.02} className="h-full">
      <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-colors group h-full">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </TiltCard>
  );
}

function PricingCard({
  title,
  price,
  duration,
  players,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  duration: string;
  players: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <TiltCard maxTilt={featured ? 8 : 6} scale={featured ? 1.03 : 1.02} className="h-full">
      <div
        className={`rounded-2xl p-8 border ${
          featured
            ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
            : "bg-secondary border-border"
        } relative h-full flex flex-col justify-between`}
      >
        <div>
          {featured && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full animate-pulse">
              Most Popular
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">R {price}</span>
            <span className={featured ? "text-primary-foreground/70" : "text-muted-foreground"}>
              /event
            </span>
          </div>
          <div className={`flex items-center gap-2 mb-2 ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className={`flex items-center gap-2 mb-6 ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            <Users className="h-4 w-4" />
            <span>{players}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check
                  className={`h-5 w-5 ${
                    featured ? "text-primary-foreground" : "text-primary"
                  }`}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <MotionButton className="w-full">
          <Button
            asChild
            variant={featured ? "secondary" : "default"}
            className="w-full"
            size="lg"
          >
            <Link href="#contact">Get Started</Link>
          </Button>
        </MotionButton>
      </div>
    </TiltCard>
  );
}


function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <TiltCard maxTilt={6} scale={1.02} glow={false}>
      <div className="text-center p-6 bg-card/20 rounded-2xl border border-border/40 hover:border-primary/40 transition-all group">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative group-hover:scale-110 transition-transform">
          {number}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </TiltCard>
  );
}
