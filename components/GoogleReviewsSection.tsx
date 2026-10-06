"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, CheckCircle, ExternalLink, ShieldCheck, Award, MessageSquareHeart } from "lucide-react"
import ScrollReveal from "@/components/motion/ScrollReveal"
import { CyberButton } from "@/components/ui/cyber-button"

// Google 4-Color Icon SVG
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
)

export interface GoogleReview {
  id: string
  author: string
  avatarInitials: string
  avatarBg: string
  eventRole: string
  location: string
  category: "schools" | "parties" | "corporate" | "family"
  rating: number
  date: string
  title: string
  text: string
  highlightBadge: string
}

const reviewsData: GoogleReview[] = [
  {
    id: "review-1",
    author: "Jan Kriel School (Mrs. Van Der Merwe)",
    avatarInitials: "JK",
    avatarBg: "from-blue-500 to-indigo-600",
    eventRole: "School Educator & Event Lead",
    location: "Kuils River, Cape Town",
    category: "schools",
    rating: 5,
    date: "2 weeks ago",
    title: "Mesmerizing educational experience for learners",
    text: "The Virtual Reality Guyz visited our school for a special student reward event. The learners were completely captivated by the VR space exploration and ocean adventures! The supervisors were polite, patient with every child, and maintained impeccable sanitization standards. An unforgettable highlight for our school year!",
    highlightBadge: "Verified School Demo"
  },
  {
    id: "review-2",
    author: "David Hendricks",
    avatarInitials: "DH",
    avatarBg: "from-emerald-500 to-teal-600",
    eventRole: "12th Birthday Party Host",
    location: "Durbanville, Cape Town",
    category: "parties",
    rating: 5,
    date: "3 weeks ago",
    title: "Best birthday party decision we have ever made",
    text: "The team arrived 45 minutes ahead of schedule to map out safety zones and calibrate the headsets. Beat Saber, Gorilla Tag, and Richie’s Plank Experience had all the boys and girls screaming with laughter. Even the adults ended up queueing for turns! Complete stress-free entertainment for parents.",
    highlightBadge: "Verified Birthday Host"
  },
  {
    id: "review-3",
    author: "Sarah Coetzee",
    avatarInitials: "SC",
    avatarBg: "from-amber-500 to-orange-600",
    eventRole: "Corporate Event Organizer",
    location: "Century City, Cape Town",
    category: "corporate",
    rating: 5,
    date: "1 month ago",
    title: "Phenomenal corporate teambuilding afternoon",
    text: "We booked Virtual Reality Guys for our company team-building afternoon with 45 staff members. The live spectator screens allowed everyone to cheer along, and the tournament brackets got fiercely competitive! Highly professional, seamless logistics, and pristine equipment. 10/10 recommendation.",
    highlightBadge: "Verified Corporate Client"
  },
  {
    id: "review-4",
    author: "Roxanne Pillay",
    avatarInitials: "RP",
    avatarBg: "from-cyan-500 to-blue-600",
    eventRole: "Teen 16th Birthday Parent",
    location: "Southern Suburbs, Cape Town",
    category: "parties",
    rating: 5,
    date: "1 month ago",
    title: "Punctual, spotless headsets, and hyped teens",
    text: "Hassle-free entertainment! The crew took care of absolutely everything from start to finish. The headsets were crystal clear and sanitized after every single turn. Keeping 15 teenagers thoroughly entertained for 3 straight hours is no small feat — these guys made it look easy!",
    highlightBadge: "Verified Teen Party"
  },
  {
    id: "review-5",
    author: "Markus Steyn",
    avatarInitials: "MS",
    avatarBg: "from-purple-500 to-pink-600",
    eventRole: "Family Festival & Community Day",
    location: "Somerset West",
    category: "family",
    rating: 5,
    date: "2 months ago",
    title: "Brilliant fun across all generations",
    text: "Incredible experience for all generations! My 8-year-old son and 65-year-old father were both doing the roller coaster simulations and archery games side by side. The supervisors have tremendous energy and know exactly how to guide first-time VR users gently and safely.",
    highlightBadge: "Verified Community Event"
  },
  {
    id: "review-6",
    author: "Chantelle Adams",
    avatarInitials: "CA",
    avatarBg: "from-rose-500 to-red-600",
    eventRole: "Private Celebration Organizer",
    location: "Stellenbosch",
    category: "family",
    rating: 5,
    date: "2 months ago",
    title: "Top-tier equipment and unmatched professionalism",
    text: "Super friendly crew, top-of-the-range VR headsets with zero lag, and sleek boundary setups. Everyone is still talking about the roller coasters, rhythm games, and zombie battles weeks later. Worth every single cent. We will definitely be booking again!",
    highlightBadge: "Verified Private Event"
  }
]

export default function GoogleReviewsSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "schools" | "parties" | "corporate" | "family">("all")

  const filteredReviews = activeCategory === "all"
    ? reviewsData
    : reviewsData.filter(r => r.category === activeCategory)

  return (
    <section 
      id="google-reviews" 
      className="py-20 sm:py-28 bg-gradient-to-b from-background via-background/40 to-background relative z-10 border-b border-border/40 overflow-hidden"
    >
      {/* Neon Ambient Background Blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Badge & Social Proof Ribbon */}
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            
            {/* Google Rating Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-amber-500/5">
              <GoogleIcon className="w-4 h-4" />
              <span>Google Verified Reviews</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="flex items-center gap-1 font-bold text-white">
                5.0
                <span className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-tech uppercase">
              Rated <span className="text-primary">5.0 Stars</span> on Google
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real feedback from school educators, parents, and corporate organizers who trusted us to bring unforgettable mobile VR entertainment directly to their venues across Cape Town.
            </p>
          </div>
        </ScrollReveal>

        {/* Quick Stats Banner */}
        <ScrollReveal variant="zoom-in" delay={150}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/60 mb-12 shadow-xl">
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-white flex items-center justify-center gap-1">
                5.0 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Google Rating</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-primary">
                100%
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">5-Star Feedback</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-white">
                100+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Events Delivered</p>
            </div>

            <div className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-tech text-cyan-400">
                Turnkey
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Setup &amp; Supervised</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Reviews (6)" },
            { id: "schools", label: "Schools & STEM" },
            { id: "parties", label: "Birthday Parties" },
            { id: "corporate", label: "Corporate & Team" },
            { id: "family", label: "Family & Community" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-black font-bold shadow-md shadow-primary/25"
                  : "bg-card/50 text-muted-foreground hover:text-white hover:bg-card border border-border/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {filteredReviews.map((review, idx) => (
            <ScrollReveal key={review.id} variant="fade-up" delay={idx * 80}>
              <div className="h-full bg-card/35 backdrop-blur-md border border-border/70 hover:border-primary/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 group">
                
                {/* Review Header: User info & Google Badge */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials with glowing ring */}
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${review.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0`}>
                        {review.avatarInitials}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {review.author}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {review.location}
                        </p>
                      </div>
                    </div>

                    {/* Google Mini Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border/80 text-[10px] text-slate-300 shrink-0">
                      <GoogleIcon className="w-3.5 h-3.5" />
                      <span>Google</span>
                    </div>
                  </div>

                  {/* Stars & Event Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <span className="text-[10px] font-semibold tracking-wide text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {review.highlightBadge}
                    </span>
                  </div>

                  {/* Review Title & Body */}
                  <h4 className="font-semibold text-white text-sm sm:text-base mb-2">
                    &ldquo;{review.title}&rdquo;
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {review.text}
                  </p>
                </div>

                {/* Footer: Verified Event Host & Date */}
                <div className="pt-4 mt-5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Event
                  </span>
                  <span>{review.date}</span>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA & Direct Google Reviews Action */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-card/60 via-card/80 to-card/60 border border-primary/30 text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-tech uppercase">
                Ready for an Unforgettable VR Experience?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Join our growing family of delighted clients across Cape Town. We bring high-end VR gear, calibrated safety boundaries, and trained staff directly to your venue.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <CyberButton href="#contact" size="lg" variant="primary">
                Book Your Event Now
              </CyberButton>

              <a
                href="https://www.google.com/search?q=Virtual+Reality+Guyz+Cape+Town+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/80 hover:border-primary/40 text-sm font-semibold text-white transition-all duration-300 shadow-md hover:shadow-primary/10"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>See Reviews on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
