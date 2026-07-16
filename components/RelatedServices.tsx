import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RelatedService {
  href: string
  title: string
  description: string
}

interface RelatedServicesProps {
  services: RelatedService[]
}

export default function RelatedServices({ services }: RelatedServicesProps) {
  if (!services || services.length === 0) return null

  return (
    <section className="py-16 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">
          Explore More <span className="text-primary">VR Experiences</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="bg-secondary/30 border border-border/50 p-6 rounded-xl hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  {service.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
