import { createAdminClient } from "@/lib/supabase/admin";
import type { Media, Category } from "@/types";
import GalleryPageClient from "./GalleryPageClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Event Gallery',
  description: 'See the fun in action! Browse photos and videos from our mobile VR gaming events, corporate team buildings, school functions, and birthday parties in Cape Town.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Event Gallery | Virtual Reality Guys',
    description: 'Browse actual event photos and video captures from our virtual reality mobile entertainment events in Cape Town.',
    url: 'https://virtualrealityguyz.co.za/gallery',
  }
}

async function fetchGalleryData() {
  try {
    const admin = createAdminClient();
    const [{ data: media }, { data: categories }] = await Promise.all([
      admin.from("media").select("*, categories(id, name)").order("created_at", { ascending: false }),
      admin.from("categories").select("*").order("name"),
    ]);
    return {
      media: (media ?? []) as Media[],
      categories: (categories ?? []) as Category[],
    };
  } catch {
    return { media: [], categories: [] };
  }
}

export default async function GalleryPage() {
  const { media, categories } = await fetchGalleryData();

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
        "name": "Event Gallery",
        "item": "https://virtualrealityguyz.co.za/gallery"
      }
    ]
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Virtual Reality Guys Event Gallery",
    "description": "Photos and videos from mobile VR events, birthday parties, and corporate team building functions in Cape Town.",
    "url": "https://virtualrealityguyz.co.za/gallery"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <GalleryPageClient media={media} categories={categories} />
    </>
  );
}
