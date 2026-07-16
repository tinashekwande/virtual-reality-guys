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
    url: 'https://www.virtualrealityguyz.co.za/vr-games-catalogue',
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
        "item": "https://www.virtualrealityguyz.co.za"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "VR Games Catalogue",
        "item": "https://www.virtualrealityguyz.co.za/vr-games-catalogue"
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
      <Header />
      <main className="print:m-0 print:p-0">
        <VRCatalogueClient />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
