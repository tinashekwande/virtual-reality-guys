import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import GamePageClient from "@/components/GamePageClient"
import { gamesData, type Game } from "@/lib/gamesData"

interface GamePageProps {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return gamesData.map((game) => ({
    id: game.id,
  }))
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { id } = await params
  const game = gamesData.find((g) => g.id === id)

  if (!game) {
    return {
      title: "Game Not Found | VR Games Cape Town",
      description: "The requested VR game experience could not be found.",
    }
  }

  const title = `${game.title} VR Experience Cape Town | Book for Events & Parties`
  const description = `${game.shortDesc} Available on Meta Quest 3 for birthday parties, school events, and corporate team building in Cape Town from R899.`
  const imageUrl = game.image.startsWith("http")
    ? game.image
    : `https://virtualrealityguyz.co.za${game.image}`

  return {
    title,
    description,
    alternates: {
      canonical: `/vr-games-catalogue/${game.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://virtualrealityguyz.co.za/vr-games-catalogue/${game.id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${game.title} VR Experience Cape Town`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { id } = await params
  const game = gamesData.find((g) => g.id === id)

  if (!game) {
    notFound()
  }

  // Related games (prefer same category first, or matching tags, excluding self)
  const relatedGames = gamesData
    .filter(
      (g) =>
        g.id !== game.id &&
        (g.category === game.category ||
          g.tags.some((t) => game.tags.includes(t)))
    )
    .slice(0, 4)

  // More featured games (from other categories)
  const relatedIds = new Set(relatedGames.map((g) => g.id))
  const moreGames = gamesData
    .filter((g) => g.id !== game.id && !relatedIds.has(g.id))
    .slice(0, 4)

  const imageUrl = game.image.startsWith("http")
    ? game.image
    : `https://virtualrealityguyz.co.za${game.image}`

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://virtualrealityguyz.co.za",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "VR Games Catalogue",
        item: "https://virtualrealityguyz.co.za/vr-games-catalogue",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.title,
        item: `https://virtualrealityguyz.co.za/vr-games-catalogue/${game.id}`,
      },
    ],
  }

  const videoGameJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.longDesc,
    image: imageUrl,
    genre: game.category,
    playMode: game.playerMode || "SinglePlayer, MultiPlayer",
    gamePlatform: ["Meta Quest 2", "Meta Quest 3", "Meta Quest Pro"],
    author: {
      "@type": "Organization",
      name: game.developer || "Meta VR Studios",
    },
    publisher: {
      "@type": "Organization",
      name: game.publisher || game.developer || "Independent VR Studio",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "140",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "899.00",
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      description: "Mobile VR party setup brought to your venue in Cape Town with Meta Quest 3 headsets, TV casting, and supervision.",
      seller: {
        "@type": "LocalBusiness",
        name: "Virtual Reality Guys",
        telephone: "+27 71 780 0323",
        url: "https://virtualrealityguyz.co.za",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />
      <Header />
      <GamePageClient
        game={game}
        relatedGames={relatedGames}
        moreGames={moreGames}
      />
      <Footer />
    </>
  )
}
