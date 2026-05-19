import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  description?: string
  highlight?: boolean
}

export function StatCard({ label, value, icon: Icon, description, highlight }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-6 flex items-start gap-4",
      highlight && "border-primary/40 bg-primary/5"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
        highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm font-medium mt-1">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  )
}
