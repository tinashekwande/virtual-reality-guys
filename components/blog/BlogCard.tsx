// components/blog/BlogCard.tsx
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  category: string
  tags: string[]
  reading_time: number
  published_at: string
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const publishedDate = new Date(post.published_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="flex flex-col h-full bg-card border border-border hover:border-primary/40 rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
      {/* Featured Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        <Image
          src={post.featured_image || "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=600"}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-background/90 text-primary border border-primary/20 backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Meta Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {publishedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.reading_time} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="font-tech text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {/* Footer Link */}
        <div className="pt-3 border-t border-border/50">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-foreground group/link transition-colors duration-200"
          >
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}
