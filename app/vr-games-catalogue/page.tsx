import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VRCatalogueClient from "@/components/VRCatalogueClient"

export const metadata: Metadata = {
  title: 'VR Games & Experiences Catalogue | Virtual Reality Guys',
  description: 'Explore our immersive virtual reality games catalogue! Grouped by category, including horror, combat, sports, racing, shooting, and educational experiences.',
  alternates: {
    canonical: '/vr-games-catalogue',
  },
  openGraph: {
    title: 'VR Games & Experiences Catalogue | Virtual Reality Guys',
    description: 'Browse the ultimate virtual reality entertainment library perfect for birthday parties, schools, corporate events, and festivals in Cape Town.',
    url: 'https://virtualrealityguyz.co.za/vr-games-catalogue',
    images: [{ url: '/images/vr-hero.jpg', alt: 'VR Games Catalogue Hub' }],
  }
}

export default function VRCataloguePage() {
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
        "name": "VR Games Catalogue",
        "item": "https://virtualrealityguyz.co.za/vr-games-catalogue"
      }
    ]
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "VR Games Categories",
    "description": "Categories of virtual reality games and immersive experiences available in our catalog.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Horror & Suspense Games"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Action & Combat Games"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Sports & Racing Simulations"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Shooter & Archery Challenges"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Educational & Exploration Experiences"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What VR games are available for events in Cape Town?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a diverse library of VR games across multiple genres including rhythm games (Beat Saber), height simulators (Richie's Plank Experience), cooperative challenges (Keep Talking and Nobody Explodes), shooters (Space Pirate Trainer, Superhot), sports, horror, and educational experiences."
        }
      },
      {
        "@type": "Question",
        "name": "Can we choose specific games for our party or event?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can select preferred titles from our catalogue beforehand or let our experienced VR coordinators curate a playlist tailored to your guests' ages, group size, and event theme."
        }
      },
      {
        "@type": "Question",
        "name": "Are the VR games suitable for beginners and kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Most of our games have easy-to-learn controls and various difficulty levels suitable for ages 8 and up. Our dedicated VR hosts guide every player through the controls and safety guidelines."
        }
      },
      {
        "@type": "Question",
        "name": "Can spectators watch while someone is playing in VR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We connect our Meta Quest headsets to external TV screens or displays so all party guests and spectators can watch the live gameplay action in real time."
        }
      },
      {
        "@type": "Question",
        "name": "Do we need high-speed internet for the VR games?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All our games and experiences are pre-installed and run locally on standalone Meta Quest headsets. We bring everything needed, requiring only standard indoor electrical power."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="print:m-0 print:p-0">
        <VRCatalogueClient />

        {/* FAQ Section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-tech uppercase tracking-tight text-white mb-4">
              VR Games <span className="text-primary">FAQ</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Everything you need to know about our game selection, hardware setups, and event curation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-card/40 border border-border/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                What VR games are available for events in Cape Town?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We offer a diverse library of VR games across multiple genres including rhythm games (Beat Saber), height simulators (Richie&apos;s Plank Experience), cooperative challenges (Keep Talking and Nobody Explodes), shooters (Space Pirate Trainer, Superhot), sports, horror, and educational experiences.
              </p>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Can we choose specific games for our party or event?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! You can select preferred titles from our catalogue beforehand or let our experienced VR coordinators curate a playlist tailored to your guests&apos; ages, group size, and event theme.
              </p>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Are the VR games suitable for beginners and kids?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely. Most of our games have easy-to-learn controls and various difficulty levels suitable for ages 8 and up. Our dedicated VR hosts guide every player through the controls and safety guidelines.
              </p>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Can spectators watch while someone is playing in VR?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! We connect our Meta Quest headsets to external TV screens or displays so all party guests and spectators can watch the live gameplay action in real time.
              </p>
            </div>

            <div className="bg-card/40 border border-border/60 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Do we need high-speed internet for the VR games?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No. All our games and experiences are pre-installed and run locally on standalone Meta Quest headsets. We bring everything needed, requiring only standard indoor electrical power.
              </p>
            </div>
          </div>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
