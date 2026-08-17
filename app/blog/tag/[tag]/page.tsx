// app/blog/tag/[tag]/page.tsx
import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BlogCard from "@/components/blog/BlogCard"
import BlogSidebar from "@/components/blog/BlogSidebar"
import { getPublishedPosts, getSidebarData, slugify } from "@/lib/blog"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Tag, SearchX } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    tag: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

async function resolveTagName(tagSlug: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("blog_posts")
    .select("tags")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())

  if (!data) return null

  const allTags = new Set<string>()
  data.forEach((p: any) => p.tags?.forEach((t: string) => allTags.add(t.trim())))
  for (const t of allTags) {
    if (slugify(t) === tagSlug) {
      return t
    }
  }
  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params
  const tagName = await resolveTagName(tagSlug)

  if (!tagName) return { title: "Tag Not Found" }

  return {
    title: `Articles tagged #${tagName} | Virtual Reality Guys`,
    description: `Read all articles and guides tagged with #${tagName}. Virtual Reality gaming experiences and information in Cape Town.`,
    alternates: {
      canonical: `/blog/tag/${tagSlug}`,
    },
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TagArchivePage({ params, searchParams }: PageProps) {
  const { tag: tagSlug } = await params
  const search = await searchParams
  const page = parseInt(search.page || "1", 10)

  const tagName = await resolveTagName(tagSlug)
  if (!tagName) {
    notFound()
  }

  const limit = 6
  const offset = (page - 1) * limit

  // Fetch articles and sidebar metadata
  const [{ posts, totalCount }, sidebarData] = await Promise.all([
    getPublishedPosts({ tagSlug, limit, offset }),
    getSidebarData()
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-border overflow-hidden bg-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            <Tag className="h-3.5 w-3.5" /> Tag Archive
          </span>
          <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground">
            #{tagName}
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            Browse all posts tagged with <strong className="text-foreground">#{tagName}</strong>.
          </p>
          <div className="pt-2">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Article List Area (8 columns) */}
          <div className="lg:col-span-8 space-y-10">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border border-dashed rounded-xl">
                <SearchX className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-tech text-lg font-bold text-foreground mb-2">No Articles for Tag</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                  We don't have any published blog posts containing the tag #{tagName} yet.
                </p>
                <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  View All Articles
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border/60 pt-6">
                    <span className="text-xs text-muted-foreground">
                      Page {page} of {totalPages} ({totalCount} total posts)
                    </span>
                    <div className="flex items-center gap-3">
                      {hasPrev ? (
                        <Link
                          href={`/blog/tag/${tagSlug}?page=${page - 1}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-secondary border border-border text-foreground hover:border-primary/30 transition-all"
                        >
                          <ArrowLeft className="h-4 w-4" /> Prev
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/30 text-muted-foreground cursor-not-allowed">
                          <ArrowLeft className="h-4 w-4" /> Prev
                        </span>
                      )}

                      {hasNext ? (
                        <Link
                          href={`/blog/tag/${tagSlug}?page=${page + 1}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-secondary border border-border text-foreground hover:border-primary/30 transition-all"
                        >
                          Next <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/30 text-muted-foreground cursor-not-allowed">
                          Next <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4">
            <BlogSidebar
              categories={sidebarData.categories}
              recentPosts={sidebarData.recentPosts}
              tags={sidebarData.tags}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
