import { createAdminClient } from "@/lib/supabase/admin";
import type { Media, Category, TeamMember } from "@/types";
import Image, { getImageProps } from "next/image";
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
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import HeroParallax from "@/components/motion/HeroParallax";
import ScrollReveal from "@/components/motion/ScrollReveal";
import MotionButton from "@/components/motion/MotionButton";
import TiltCard from "@/components/motion/TiltCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { WHATSAPP_URL, GOOGLE_REVIEWS_URL, PHONE_DISPLAY, PHONE_TEL, HERO_PHOTO_URL } from "@/lib/contact";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VR Cape Town From R999 | Mobile Gaming Delivered To Your Venue',
  description: 'Cape Town\'s mobile VR entertainment specialists. We deliver headsets, spectator screens & trained supervisors to your party, school, or corporate event. Party packages from R999. Book now!',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Virtual Reality Guys | Mobile VR Gaming Cape Town From R999',
    description: 'Premium mobile VR gaming delivered to your venue in Cape Town. Parties, schools, corporate events & festivals. 100+ games, trained supervisors.',
    url: 'https://virtualrealityguyz.co.za',
    images: [{ url: '/images/hero-party-desktop.jpg', width: 1672, height: 941, alt: 'Kids playing VR at a birthday party in Cape Town' }],
  }
}

export const revalidate = 60;

const PROOF_QUOTES = [
  {
    text: "The kids had an absolute blast. My son and his friends are still talking about it!",
    author: "Francois Du Plessis",
    context: "Son's 9th birthday",
  },
  {
    text: "Friendly and professional service. On time, and went the extra mile for the kids.",
    author: "Leon Botha",
    context: "Birthday party",
  },
  {
    text: "Our kids loved it! Definitely a MUST for schools.",
    author: "Carine Malan",
    context: "School event",
  },
];

const FACTS = [
  { value: "5.0★", label: "Google rating" },
  { value: "100+", label: "VR games & experiences" },
  { value: "20", label: "Players per package, max" },
  { value: "24h", label: "Reply to every enquiry" },
];

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

const HERO_DESKTOP_PHOTO = "/images/hero-party-desktop.jpg";
const heroImageCommon = {
  alt: "Kids playing VR at a birthday party in Cape Town",
  fill: true,
  sizes: "100vw",
  quality: 95,
  priority: true,
};
const heroDesktopSrcSet = getImageProps({ ...heroImageCommon, src: HERO_DESKTOP_PHOTO }).props.srcSet;
const { props: heroMobileProps } = getImageProps({ ...heroImageCommon, src: HERO_PHOTO_URL });

export default async function Home() {
  const { media, categories, team } = await fetchPublicData();
  // Party photos first: they sell the experience best
  const isParty = (m: Media) => /party|birthday/i.test(((m as any).categories?.name ?? "") + " " + (m.title ?? ""));
  const photos = media.filter((m) => m.type !== "video" && m.file_url !== HERO_PHOTO_URL);
  const recentPhotos = [...photos.filter(isParty), ...photos.filter((m) => !isParty(m))].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Virtual Reality Guys",
    "image": "https://virtualrealityguyz.co.za/images/logo.png",
    "@id": "https://virtualrealityguyz.co.za/#organization",
    "url": "https://virtualrealityguyz.co.za",
    "telephone": "+27717800323",
    "email": "virtualrealityguyz@gmail.com",
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "10",
      "bestRating": "5",
      "worstRating": "1"
    },
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
            "description": "4 VR headsets, 2 hours of VR gaming, professional setup & supervision, 30+ game selection. Suitable for up to 8 players."
          },
          "price": "999",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Standard Package",
            "description": "5 VR headsets, 3 hours of VR gaming, professional setup & supervision, 60+ game selection, multiplayer tournaments. Suitable for up to 12 players."
          },
          "price": "1499",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Package",
            "description": "6 VR headsets, 4 hours of VR gaming, professional setup & supervision, 100+ game selection, custom tournament brackets, photo & video package. Suitable for up to 20 players."
          },
          "price": "1999",
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
        "item": "https://virtualrealityguyz.co.za"
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
          "text": "Our party packages are Starter R999 (4 headsets, 2 hours, up to 8 players), Standard R1,499 (5 headsets, 3 hours, up to 12 players) and Premium R1,999 (6 headsets, 4 hours, up to 20 players). All include setup, trained supervisors and cleanup. Schools and corporate events are quoted separately."
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
          "text": "Yes. VR works best for ages 8 and up, and 6 to 7 year olds can join with a parent nearby and help from our supervisors. We use built-in virtual boundaries to prevent collisions, supervise every session, sanitise headsets between players, and choose kid-friendly, non-violent games."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book a VR experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fill out our booking form, call or WhatsApp us on +27 71 780 0323. We confirm your date, venue space and package within 24 hours, and a 50% deposit secures the booking."
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
      <Header transparentOnTop />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroParallax
          className="w-full min-h-screen flex items-center justify-center pt-20"
          backgroundChildren={
            <>
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                {/* Art direction: portrait party photo on phones, wide version from tablet up */}
                <picture>
                  <source media="(min-width: 768px)" srcSet={heroDesktopSrcSet} sizes="100vw" />
                  <img
                    {...heroMobileProps}
                    className="object-cover object-[center_35%] md:object-center opacity-60"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background" />
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
              <div className="space-y-7 sm:space-y-8">
                <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                  Mobile VR Gaming, <span className="text-primary">Delivered</span> to Your Event
                </h1>
                <p className="text-lg sm:text-2xl text-white/80 max-w-3xl mx-auto text-balance">
                  Birthday parties, schools and team building across Cape Town. We bring the
                  headsets, 100+ games and trained supervisors, then pack it all away.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <Link
                    href="#contact"
                    className="group inline-flex h-14 sm:h-16 w-full sm:w-auto sm:min-w-[220px] items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-base sm:text-lg font-semibold tracking-wide text-[#040817] transition-colors duration-150 hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Book Now <ArrowRight className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex h-14 sm:h-16 sm:min-w-[220px] items-center justify-center gap-2.5 rounded-xl border border-[#25D366]/50 bg-[#25D366]/10 px-8 text-base sm:text-lg font-semibold tracking-wide text-white transition-colors duration-150 hover:bg-[#25D366]/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp Us
                  </a>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-2 text-sm sm:text-base text-white/75">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Setup &amp; supervision included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Best for ages 8+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Reply within 24 hours</span>
                  </div>
                </div>
                <Link
                  href="/vr-games-catalogue"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Browse the 100+ game catalogue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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

      {/* Social proof strip */}
      <section aria-label="What customers say" className="relative z-10 border-y border-border/40 bg-secondary/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            {PROOF_QUOTES.map((q) => (
              <figure key={q.author} className="rounded-2xl border border-border/60 bg-background/60 p-5">
                <div className="flex items-center gap-1 text-amber-400 mb-3" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed">&ldquo;{q.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {q.author} · <span className="text-primary">{q.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {recentPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentPhotos.map((m) => (
                <div key={m.id} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40">
                  <Image
                    src={m.file_url}
                    alt={m.title ? `VR event in ${m.title.trim()}` : "Virtual Reality Guys event"}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Read all our Google reviews
            </a>
            <Link href="/gallery" className="text-primary hover:underline">
              See photos from recent events
            </Link>
          </div>
        </div>
      </section>

      {/* Why VR Guys (merged About + Experiences) */}
      <section id="about" className="py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <p className="text-primary font-semibold tracking-wide uppercase mb-4">
                Why VR Guys
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-balance">
                A Full VR Arcade That Comes to You
              </h2>
              <p className="text-lg text-muted-foreground">
                Birthday party, school day, team building or festival: we arrive 30 to 45 minutes
                early, set up safe play zones, run every session and pack everything away.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {FACTS.map((f) => (
              <div key={f.label} className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 text-center">
                <div className="text-2xl sm:text-4xl font-bold text-primary font-tech">{f.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{f.label}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={<Shield className="h-7 w-7" />}
              title="Safe & Supervised"
              description="Trained supervisors run every session. Guardian boundaries keep players clear of walls, and headsets are sanitised between every player."
            />
            <FeatureCard
              icon={<Gamepad2 className="h-7 w-7" />}
              title="Multiplayer & Solo Games"
              description="Beat Saber, boxing, rollercoasters, ocean and space explorations, plus head-to-head tournaments for competitive groups."
            />
            <FeatureCard
              icon={<Truck className="h-7 w-7" />}
              title="Zero Hassle for You"
              description="We bring headsets, charging and display screens. You just need about 2m × 2m per station, a plug point and some shade if outdoors."
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-12 pt-8 border-t border-border/30">
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-birthday-parties">Birthday Parties</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/kids-parties">Kids Parties</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/school-vr-demonstrations">School Demos</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/vr-team-building">Team Building</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/corporate-events">Corporate Events</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/mobile-vr-hire">Mobile VR Hire</Link>
            </Button>
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
              Prices include VAT, setup, trained supervisors and pack-up. No hidden extras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            <PricingCard
              title="Starter"
              bestFor="Small parties & get-togethers"
              price="999"
              duration="2 hours"
              players="Up to 8 players"
              features={[
                "2 hours of VR gaming",
                "4 VR headsets",
                "Suitable for up to 8 players",
                "1 trained supervisor",
                "30+ game selection",
              ]}
            />
            <PricingCard
              title="Standard"
              bestFor="Most birthday parties"
              price="1,499"
              duration="3 hours"
              players="Up to 12 players"
              featured
              features={[
                "3 hours of VR gaming",
                "5 VR headsets",
                "Suitable for up to 12 players",
                "2 trained supervisors",
                "60+ game selection",
                "Multiplayer tournaments",
              ]}
            />
            <PricingCard
              title="Premium"
              bestFor="Big celebrations & family days"
              price="1,999"
              duration="4 hours"
              players="Up to 20 players"
              features={[
                "4 hours of VR gaming",
                "6 VR headsets",
                "Suitable for up to 20 players",
                "2 trained supervisors",
                "100+ game selection",
                "Custom tournament brackets",
                "Photo & video package",
                "Priority booking",
              ]}
            />
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <span><strong className="text-foreground">50% deposit</strong> <span className="text-muted-foreground">secures your date, balance on the day</span></span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <span><strong className="text-foreground">Free transport</strong> <span className="text-muted-foreground">in Kraaifontein, Brackenfell, Durbanville, Bellville &amp; Kuils River</span></span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <span><strong className="text-foreground">Add-ons:</strong> <span className="text-muted-foreground">extra hour R350 · extra headset R150</span></span>
            </div>
          </div>

          <div className="text-center text-muted-foreground mt-8 space-y-3 max-w-2xl mx-auto">
            <p>
              <strong className="text-foreground">School or corporate event?</strong>{" "}
              These are quoted on attendees and hours.{" "}
              <Link href="/?type=school#contact" className="text-primary hover:underline">
                Request a school quote
              </Link>{" "}
              or{" "}
              <Link href="/?type=corporate#contact" className="text-primary hover:underline">
                a corporate quote
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              Transport elsewhere: about R200 for venues up to 25 km away, R350–R500 further out (e.g. Somerset West, Stellenbosch, Constantia, City Bowl, Fish Hoek). Tell us your suburb and we&apos;ll confirm.
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

          <GallerySection
            media={media.filter((m) => m.file_url !== HERO_PHOTO_URL && !recentPhotos.some((r) => r.id === m.id))}
            categories={categories}
            preview={true}
          />
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
              From first message to game time, we keep it simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-primary to-primary opacity-30" />

            <StepCard
              number="1"
              title="Check Your Date"
              description="Send the form or WhatsApp us with your date, suburb and group size. We confirm availability within 24 hours."
              icon={<Calendar className="h-6 w-6" />}
            />
            <StepCard
              number="2"
              title="Lock It In"
              description="Pay a 50% deposit to secure the date. On the day we arrive 30 to 45 minutes early to set up and map safe play zones."
              icon={<Truck className="h-6 w-6" />}
            />
            <StepCard
              number="3"
              title="Enjoy the Party"
              description="Your guests dive into VR while our supervisors run every turn. When it's over, we pack everything away."
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
                Our party packages are Starter R999 (4 headsets, 2 hours, up to 8 players), Standard R1,499 (5 headsets, 3 hours, up to 12 players) and Premium R1,999 (6 headsets, 4 hours, up to 20 players). All include setup, trained supervisors and cleanup. Schools and corporate events are quoted separately.
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
                Yes. VR works best for ages 8 and up, and 6 to 7 year olds can join with a parent nearby and help from our supervisors. We use built-in virtual boundaries to prevent collisions, supervise every session, sanitise headsets between players, and choose kid-friendly, non-violent games.
              </p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg text-foreground">How do I book a VR experience?</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Fill out our booking form, call or WhatsApp us on +27 71 780 0323. We confirm your date, venue space and package within 24 hours, and a 50% deposit secures the booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Serve Section */}
      <section className="py-14 border-t border-border/30 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">Where We Serve in Cape Town</h2>
          <p className="text-muted-foreground">
            City Bowl, Sea Point, Camps Bay, Green Point, Hout Bay, Claremont, Rondebosch,
            Constantia, Bellville, Durbanville, Century City, Milnerton, Bloubergstrand,
            Somerset West, Stellenbosch and everywhere in between.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/virtual-reality-cape-town">All Service Areas</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/virtual-reality-somerset-west">Somerset West &amp; Helderberg</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Google Customer Reviews Section */}
      <GoogleReviewsSection />

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 bg-background/30 backdrop-blur-md border-t border-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary font-semibold tracking-wide uppercase">
                  Book Now
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold text-balance">
                  Check Your Date
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tell us your date and suburb and we&apos;ll confirm availability
                  within 24 hours. A 50% deposit secures your booking.
                </p>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-4 rounded-2xl border border-[#25D366]/50 bg-[#25D366]/10 p-5 hover:bg-[#25D366]/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Prefer WhatsApp?</p>
                  <p className="text-sm text-muted-foreground">Message us your date and suburb for the fastest reply.</p>
                </div>
              </a>

              <div className="hidden lg:block space-y-6">
                <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call us</p>
                    <p className="font-semibold group-hover:text-primary transition-colors">{PHONE_DISPLAY}</p>
                  </div>
                </a>
                <a href="mailto:virtualrealityguyz@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email us</p>
                    <p className="font-semibold group-hover:text-primary transition-colors break-all">virtualrealityguyz@gmail.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service area</p>
                    <p className="font-semibold">All of Greater Cape Town</p>
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
  bestFor,
  price,
  duration,
  players,
  features,
  featured = false,
}: {
  title: string;
  bestFor: string;
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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-sm font-bold px-4 py-1 rounded-full shadow-lg">
              Most Popular
            </div>
          )}
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className={`text-sm mb-4 ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{bestFor}</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">R{price}</span>
            <span className={featured ? "text-primary-foreground/80" : "text-muted-foreground"}>
              {" "}incl. VAT
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
            variant="default"
            className={`w-full font-bold ${featured ? "bg-white text-black hover:bg-white/90" : ""}`}
            size="lg"
          >
            <Link href={`/?package=${title.toLowerCase()}#contact`}>Book {title}</Link>
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
