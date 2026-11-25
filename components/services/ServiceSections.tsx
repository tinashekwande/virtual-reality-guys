import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Star, ArrowRight, Gamepad2, Images, CalendarCheck, Truck, PartyPopper, PackageCheck, Camera, Users, Clock, Trophy, ShieldCheck, GraduationCap } from "lucide-react"
import ScrollReveal from "@/components/motion/ScrollReveal"
import { CyberButton } from "@/components/ui/cyber-button"
import { gamesData } from "@/lib/gamesData"
import { realReviews, GOOGLE_REVIEWS_URL, type RealGoogleReview } from "@/lib/reviews"
import { getEventPhotos } from "@/lib/event-photos"
import ServiceGameCard, { type ServiceGame } from "./ServiceGameCard"

/* -------------------------------------------------------------------------- */
/* Highlights strip                                                           */
/* -------------------------------------------------------------------------- */

const HIGHLIGHT_ICONS = {
  games: Gamepad2,
  users: Users,
  clock: Clock,
  star: Star,
  trophy: Trophy,
  shield: ShieldCheck,
  school: GraduationCap,
} satisfies Record<string, LucideIcon>

export interface Highlight {
  icon: keyof typeof HIGHLIGHT_ICONS
  value: string
  label: string
}

/** Compact stat strip shown right under the hero. */
export function ServiceHighlights({ items }: { items: Highlight[] }) {
  return (
    <section className="border-t border-border/30 bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it) => {
            const Icon = HIGHLIGHT_ICONS[it.icon]
            return (
            <div key={it.label} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-tight text-foreground">{it.value}</p>
                <p className="text-xs text-muted-foreground leading-snug">{it.label}</p>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Featured games → catalogue                                                 */
/* -------------------------------------------------------------------------- */

function pickGames(ids: string[]): ServiceGame[] {
  return ids
    .map((id) => gamesData.find((g) => g.id === id))
    .filter((g): g is (typeof gamesData)[number] => Boolean(g))
    .map((g) => ({
      id: g.id,
      title: g.title,
      image: g.image,
      shortDesc: g.shortDesc,
      category: g.category,
      suitability: g.suitability,
      playerMode: g.playerMode,
      youtubeId: g.youtubeId,
    }))
}

export function ServiceGames({
  eyebrow = "Inside the headset",
  title,
  subtitle,
  gameIds,
  catalogueCategory,
  catalogueLabel = "Browse the full games catalogue",
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  gameIds: string[]
  /** Pre-select this category when opening the catalogue (e.g. "Educational & Learning Experiences"). */
  catalogueCategory?: string
  catalogueLabel?: string
}) {
  const games = pickGames(gameIds)
  const catalogueHref = catalogueCategory
    ? `/vr-games-catalogue?category=${encodeURIComponent(catalogueCategory)}`
    : "/vr-games-catalogue"

  return (
    <section className="py-20 border-t border-border/30 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2">
              <Gamepad2 className="h-3.5 w-3.5" /> {eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">{title}</h2>
            {subtitle && <p className="text-muted-foreground leading-relaxed">{subtitle}</p>}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((g, i) => (
            <ScrollReveal key={g.id} variant="fade-up" delay={(i % 4) * 90} className="h-full">
              <ServiceGameCard game={g} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CyberButton href={catalogueHref} size="lg" variant="primary">
            {catalogueLabel} ({gamesData.length}+ titles)
          </CyberButton>
          <CyberButton href="#booking" size="lg" variant="secondary">
            Book these for your event
          </CyberButton>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Real event photos                                                          */
/* -------------------------------------------------------------------------- */

function PhotoTile({
  photo,
  className = "",
  sizes,
  priority = false,
}: {
  photo: Awaited<ReturnType<typeof getEventPhotos>>[number]
  className?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/30 group ${className}`}>
      {photo.type === "video" ? (
        <video
          src={photo.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
          aria-label={photo.caption || "Virtual Reality Guys event video"}
        />
      ) : (
        <Image
          src={photo.url}
          alt={photo.caption ? `Virtual Reality Guys event — ${photo.caption}` : "Guests enjoying a Virtual Reality Guys event"}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      {photo.caption && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
          <Camera className="h-3 w-3 text-primary" /> {photo.caption}
        </span>
      )}
    </div>
  )
}

/**
 * A three-photo collage of real events, designed for the right-hand column of
 * the service pages' two-column "details" section.
 */
export async function EventPhotoCollage({ categories, includeVideo = false }: { categories: string[]; includeVideo?: boolean }) {
  const photos = await getEventPhotos(categories, 3, { includeVideo })
  const [a, b, c] = photos
  return (
    <ScrollReveal variant="fade-left">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {a && <PhotoTile photo={a} className="col-span-2 aspect-[16/10]" sizes="(min-width: 1024px) 45vw, 100vw" />}
          {b && <PhotoTile photo={b} className="aspect-square" sizes="(min-width: 1024px) 22vw, 50vw" />}
          {c && <PhotoTile photo={c} className="aspect-square" sizes="(min-width: 1024px) 22vw, 50vw" />}
        </div>
        <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <Images className="h-4 w-4" /> See more photos from real events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </ScrollReveal>
  )
}

/** Full-width photo grid section ("Real events, real reactions"). */
export async function EventPhotoStrip({
  categories,
  title = "Real events. Real reactions.",
  subtitle = "A few moments from parties, schools and events we've brought VR to across Cape Town.",
  includeVideo = false,
}: {
  categories: string[]
  title?: string
  subtitle?: string
  includeVideo?: boolean
}) {
  const photos = await getEventPhotos(categories, 6, { includeVideo })
  return (
    <section className="py-20 border-t border-border/30 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0">
              <Images className="h-4 w-4" /> Full gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <ScrollReveal key={p.url} variant="zoom-in" delay={(i % 3) * 80}>
              <PhotoTile photo={p} className="aspect-[4/3]" sizes="(min-width: 1024px) 33vw, 50vw" priority={false} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* How the event unfolds                                                      */
/* -------------------------------------------------------------------------- */

export interface JourneyStep {
  title: string
  text: string
  icon?: LucideIcon
}

const DEFAULT_STEPS: JourneyStep[] = [
  { icon: CalendarCheck, title: "Pick your date & package", text: "Tell us about your event and group size. We confirm availability and send a quote — a 50% deposit locks in your date." },
  { icon: Truck, title: "We arrive & set up", text: "Our crew arrives 30–45 minutes early with headsets, a spectator screen and safety boundaries all calibrated." },
  { icon: PartyPopper, title: "Everyone plays", text: "Trained supervisors guide every player, run tournaments and keep the energy high — you just enjoy it." },
  { icon: PackageCheck, title: "We pack up", text: "When the fun is over we sanitise, pack everything away and leave your venue exactly as we found it." },
]

export function ServiceJourney({ title = "How your VR event unfolds", steps = DEFAULT_STEPS }: { title?: string; steps?: JourneyStep[] }) {
  return (
    <section className="py-20 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">{title}</h2>
        </ScrollReveal>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon || DEFAULT_STEPS[i % DEFAULT_STEPS.length].icon!
            return (
              <ScrollReveal key={s.title} variant="fade-up" delay={i * 100} className="h-full">
                <li className="relative h-full rounded-2xl border border-border/50 bg-secondary/30 p-6">
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    Step {i + 1}
                  </span>
                  <Icon className="h-8 w-8 text-primary mb-4 mt-2" />
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </li>
              </ScrollReveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Real Google reviews                                                        */
/* -------------------------------------------------------------------------- */

function pickReviews(prefer: RealGoogleReview["category"][], count = 3): RealGoogleReview[] {
  // Most detailed reviews first within each preferred category
  const byDetail = [...realReviews].sort((a, b) => b.text.length - a.text.length)
  const out: RealGoogleReview[] = []
  for (const cat of prefer) {
    for (const r of byDetail) if (out.length < count && r.category === cat && !out.includes(r)) out.push(r)
  }
  for (const r of byDetail) if (out.length < count && !out.includes(r)) out.push(r)
  return out
}

export function ServiceReviews({
  prefer,
  title = "What our clients say",
}: {
  prefer: RealGoogleReview["category"][]
  title?: string
}) {
  const reviews = pickReviews(prefer)
  return (
    <section className="py-20 border-t border-border/30 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">{title}</h2>
            <p className="text-muted-foreground text-sm">Real 5-star reviews from our Google Business Profile</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ScrollReveal key={r.id} variant="fade-up" delay={i * 100} className="h-full">
              <figure className="h-full flex flex-col rounded-2xl border border-border/50 bg-secondary/30 p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
                <blockquote className="text-sm text-muted-foreground leading-relaxed line-clamp-6 flex-grow">“{r.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${r.avatarBg} flex items-center justify-center text-sm font-bold text-white`}>
                    {r.avatarInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{r.author}</p>
                    <p className="text-[11px] text-primary truncate">{r.highlightBadge}</p>
                  </div>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Read all our reviews on Google <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
