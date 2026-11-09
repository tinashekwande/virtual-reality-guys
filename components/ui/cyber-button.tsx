"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Site-wide call-to-action button. Previously rendered an animated WebGL
 * "electric glow"; now a calm, static, solid style so CTAs read clearly
 * without competing with photos and content. API kept the same so existing
 * call sites don't change.
 */
export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "whatsapp"
  size?: "sm" | "default" | "lg" | "xl" | "full"
  href?: string
  target?: string
  rel?: string
  className?: string
  /** Classes for the outer <a>/<button>, e.g. "w-full" when the button should stretch */
  wrapperClassName?: string
  /** Kept for backwards compatibility; no longer has a visual effect */
  glowIntensity?: "normal" | "high"
}

const sizeClasses = {
  sm: "h-9 px-4 text-xs rounded-lg min-w-[120px]",
  default: "h-11 px-5 text-sm rounded-xl min-w-[140px]",
  lg: "h-14 sm:h-16 px-8 text-base sm:text-lg rounded-xl min-w-[200px]",
  xl: "h-16 sm:h-20 px-10 text-lg sm:text-xl rounded-xl min-w-[240px]",
  full: "w-full h-14 px-6 text-base rounded-xl",
}

const variantClasses = {
  primary: "bg-primary text-[#040817] hover:bg-primary/90",
  secondary: "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
  whatsapp: "border border-[#25D366]/50 bg-[#25D366]/10 text-white hover:bg-[#25D366]/20",
}

const ringClasses = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-white/60",
  whatsapp: "focus-visible:ring-[#25D366]",
}

export function CyberButton({
  children,
  variant = "primary",
  size = "default",
  href,
  target,
  rel,
  className,
  wrapperClassName,
  glowIntensity: _glowIntensity,
  disabled,
  onClick,
  ...props
}: CyberButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 font-semibold tracking-wide select-none no-underline",
    "transition-colors duration-150 active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    sizeClasses[size],
    variantClasses[variant],
    ringClasses[variant],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    wrapperClassName,
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type || "button"}
      disabled={disabled}
      onClick={onClick}
      className={cn(classes, "cursor-pointer")}
      {...props}
    >
      {children}
    </button>
  )
}

export default CyberButton
