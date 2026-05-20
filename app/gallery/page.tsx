import { createAdminClient } from "@/lib/supabase/admin";
import type { Media, Category } from "@/types";
import GalleryPageClient from "./GalleryPageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
