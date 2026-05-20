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
    url: 'https://virtualrealityguys.co.za/gallery',
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

  return (
    <GalleryPageClient media={media} categories={categories} />
  );
}
