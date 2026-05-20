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

import MobileNav from "@/components/MobileNav";
import GallerySection from "@/components/GallerySection";
import BookingForm from "@/components/BookingForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    "image": "https://www.virtualrealityguys.co.za/images/logo.png",
    "@id": "https://www.virtualrealityguys.co.za/#organization",
    "url": "https://www.virtualrealityguys.co.za",
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
          "price": "999",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Standard Package",
            "description": "4 VR headsets, professional setup, 2 trained supervisors, 60+ game selection, multiplayer tournaments."
          },
          "price": "1999",
          "priceCurrency": "ZAR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Package",
            "description": "6 VR headsets, professional setup, 3 trained supervisors, 100+ game selection, custom tournament brackets, photo & video package."
          },
          "price": "2999",
          "priceCurrency": "ZAR"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-0">
              <div className="relative h-16 w-16 sm:h-18 sm:w-18">
                <Image
                  src="/images/logo.png"
                  alt="Virtual Reality Guyz logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">
                Virtual Reality <span className="text-primary">Guys</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/#experiences"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Experiences
              </Link>
              <Link
                href="/#packages"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Packages
              </Link>
              <Link
                href="/#gallery"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/#contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="hidden md:block">
              <Button asChild size="lg">
                <Link href="#contact">
                  Book Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <MobileNav />
          </div>
        </div>


      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vr-hero.jpg"
            alt="VR Gaming Experience"
            fill
            className="object-cover opacity-40"
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="#contact">
                  Book Your Experience <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="#packages">View Packages</Link>
              </Button>
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
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                  <div className="text-4xl font-bold text-primary">20+</div>
                  <div className="text-muted-foreground">Events Completed</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">20+</div>
                  <div className="text-muted-foreground">Happy Guests</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <Headset className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Schools</h3>
                  <p className="text-sm text-muted-foreground">
                    Educational and fun VR experiences for students of all ages
                  </p>
                </div>
                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <PartyPopper className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Birthday Parties</h3>
                  <p className="text-sm text-muted-foreground">
                    Make their special day absolutely unforgettable
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Corporate Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Team building and entertainment for the workplace
                  </p>
                </div>
                <div className="bg-secondary rounded-2xl p-6 border border-border">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Festivals</h3>
                  <p className="text-sm text-muted-foreground">
                    High-traffic entertainment for large gatherings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="experiences" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section id="packages" className="py-24 sm:py-32 bg-card">
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
              price="999"
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
              price="1999"
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
              price="2999"
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

          <p className="text-center text-muted-foreground mt-12">
            Need a custom package for your event?{" "}
            <Link href="#contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            for a personalized quote.
          </p>
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
      <section className="py-24 sm:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4">
              Testimonials
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The kids absolutely loved it! The setup was professional and the staff made sure everyone had a great time. Best birthday party entertainment ever!"
              author="Sarah M."
              role="Parent"
            />
            <TestimonialCard
              quote="We hired Virtual Reality Guys for our company retreat and it was a huge hit. Great team building activity that got everyone laughing and competing."
              author="Michael T."
              role="HR Director"
            />
            <TestimonialCard
              quote="Our school carnival was taken to the next level with the VR experience. Students were lined up all day and couldn&apos;t stop talking about it!"
              author="Jennifer L."
              role="School Administrator"
            />
          </div>
        </div>
      </section>

      {/* Team Section — dynamic from DB */}
      {team.length > 0 && (
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
      )}

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

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 bg-card">
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

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Headset className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">
                  Virtual Reality <span className="text-primary">Guys</span>
                </span>
              </Link>
              <p className="text-muted-foreground max-w-md">
                Bringing unforgettable VR gaming experiences to events across
                the region. Schools, parties, corporate events, and more.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#experiences" className="hover:text-foreground">
                    Experiences
                  </Link>
                </li>
                <li>
                  <Link href="#packages" className="hover:text-foreground">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="#gallery" className="hover:text-foreground">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>+27 71 780 0323</li>
                <li>virtualrealityguyz@gmail.com</li>
                <li>Cape Town CPT</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Virtual Reality Guys. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
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
    <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-colors group">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
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
    <div
      className={`rounded-2xl p-8 border ${
        featured
          ? "bg-primary text-primary-foreground border-primary scale-105"
          : "bg-secondary border-border"
      } relative`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full">
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
      <Button
        asChild
        variant={featured ? "secondary" : "default"}
        className="w-full"
        size="lg"
      >
        <Link href="#contact">Get Started</Link>
      </Button>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-secondary rounded-2xl p-8 border border-border">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-foreground mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
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
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold relative">
        {number}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
