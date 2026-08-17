// app/blog/[slug]/page.tsx
import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BlogSidebar from "@/components/blog/BlogSidebar"
import ShareButtons from "@/components/blog/ShareButtons"
import BlogCard from "@/components/blog/BlogCard"
import { getPostBySlug, getSidebarData, slugify } from "@/lib/blog"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft, ChevronRight, BookOpen, Quote, Sparkles } from "lucide-react"
import { marked } from "marked"
import { createAdminClient } from "@/lib/supabase/admin"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// 1. Generate SEO Metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "Article Not Found" }
  }

  const title = post.seo_title || `${post.title} | Virtual Reality Guys`
  const description = post.seo_description || post.excerpt
  const url = `https://www.virtualrealityguyz.co.za/blog/${post.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: [
        {
          url: post.featured_image || "https://www.virtualrealityguyz.co.za/images/logo.png",
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.featured_image || "https://www.virtualrealityguyz.co.za/images/logo.png"],
    },
  }
}

// Compile headings for Table of Contents
function extractHeadings(content: string) {
  const regex = /^(##|###)\s+(.*)$/gm
  const headings = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length // 2 for h2, 3 for h3
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/<[^>]*>/g, "") // strip HTML inside markdown if any
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    headings.push({ level, text, id })
  }
  return headings
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Setup Custom Renderer for Marked to inject IDs in headings
  const renderer = new marked.Renderer();
  (renderer as any).heading = function (arg1: any, arg2?: any, arg3?: any) {
    let text = ""
    let depth = 2
    if (typeof arg1 === "object") {
      text = arg1.text || ""
      depth = arg1.depth || 2
    } else {
      text = arg1
      depth = arg2
    }
    const id = text
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    return `<h${depth} id="${id}">${text}</h${depth}>`
  }

  // Set compile options
  const compiledContent = await marked(post.content, { renderer })

  // Extract headings for Table of Contents
  const headings = extractHeadings(post.content)

  // Fetch sidebar metadata & related posts
  const admin = createAdminClient()
  const nowStr = new Date().toISOString()

  const [sidebarData, { data: relatedData }] = await Promise.all([
    getSidebarData(),
    admin
      .from("blog_posts")
      .select("*")
      .eq("category", post.category)
      .eq("status", "published")
      .lte("published_at", nowStr)
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(3),
  ])

  const relatedPosts = (relatedData || []) as any[]

  // Structured Data (JSON-LD)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.virtualrealityguyz.co.za/blog/${post.slug}`,
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image || "https://www.virtualrealityguyz.co.za/images/logo.png",
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Virtual Reality Guys",
      "url": "https://www.virtualrealityguyz.co.za",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Virtual Reality Guys",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.virtualrealityguyz.co.za/images/logo.png",
      },
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.virtualrealityguyz.co.za",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.virtualrealityguyz.co.za/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.virtualrealityguyz.co.za/blog/${post.slug}`,
      },
    ],
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const categorySlug = slugify(post.category)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href={`/blog/category/${categorySlug}`} className="hover:text-primary transition-colors">
            {post.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to all articles
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Article (8 columns) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary border border-primary/20">
                <Link href={`/blog/category/${categorySlug}`} className="hover:underline">
                  {post.category}
                </Link>
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-tech font-bold leading-tight text-foreground">
                {post.title}
              </h1>
              
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground border-b border-border/50 pb-6">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {publishedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {post.reading_time} min read
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary border border-border">
              <Image
                src={post.featured_image || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200"}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>

            {/* Table of Contents (if >= 2 headings) */}
            {headings.length >= 2 && (
              <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-3">
                <h2 className="font-tech text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Table of Contents
                </h2>
                <ul className="space-y-1.5 text-sm">
                  {headings.map((h, i) => (
                    <li
                      key={i}
                      style={{ paddingLeft: `${(h.level - 2) * 1.25}rem` }}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-start gap-1"
                    >
                      <span className="text-primary mt-1 select-none">•</span>
                      <a href={`#${h.id}`} className="hover:underline leading-relaxed">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content */}
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: compiledContent }}
            />

            {/* Social Share widget */}
            <ShareButtons title={post.title} slug={post.slug} />

            {/* Strong Call to Action */}
            <div className="relative overflow-hidden bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_60%)] pointer-events-none" />
              <div className="max-w-md mx-auto space-y-3 relative z-10">
                <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
                <h3 className="font-tech text-xl font-bold text-foreground">
                  Ready to bring Virtual Reality to your next event?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We supply premium mobile VR packages, gaming catalogues, and complete event coordination in Cape Town and surrounding areas.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-secondary border border-border text-foreground hover:border-primary/30 transition-all cursor-pointer"
                >
                  Contact Us
                </Link>
                <Link
                  href="/vr-games-catalogue"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-transparent text-primary hover:underline transition-all cursor-pointer"
                >
                  View Packages &rarr;
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-border/50">
                <h3 className="font-tech text-lg font-bold text-foreground flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary rotate-180" />
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedPosts.map(p => (
                    <div key={p.slug} className="flex flex-col bg-card border border-border hover:border-primary/20 rounded-xl overflow-hidden group transition-all duration-300">
                      <Link href={`/blog/${p.slug}`} className="relative aspect-video w-full block overflow-hidden bg-secondary">
                        <Image
                          src={p.featured_image || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=300"}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 250px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="text-sm font-semibold leading-snug text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-3">
                          {new Date(p.published_at).toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

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
