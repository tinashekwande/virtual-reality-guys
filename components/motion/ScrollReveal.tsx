"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "clip-reveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  duration?: number; // ms
  delay?: number; // ms
  threshold?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  variant = "fade-up",
  duration = 700,
  delay = 0,
  threshold = 0.15,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, once]);

  // Variant transform styles
  const getInitialStyle = (): React.CSSProperties => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: "none",
        clipPath: variant === "clip-reveal" ? "inset(0% 0% 0% 0% round 1rem)" : undefined,
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      };
    }

    switch (variant) {
      case "fade-up":
        return {
          opacity: 0,
          transform: "translateY(28px)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      case "fade-down":
        return {
          opacity: 0,
          transform: "translateY(-28px)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      case "fade-left":
        return {
          opacity: 0,
          transform: "translateX(28px)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      case "fade-right":
        return {
          opacity: 0,
          transform: "translateX(-28px)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      case "zoom-in":
        return {
          opacity: 0,
          transform: "scale(0.94)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      case "clip-reveal":
        return {
          opacity: 0.2,
          clipPath: "inset(8% 8% 8% 8% round 1rem)",
          transform: "scale(1.03)",
          transition: `all ${duration + 200}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
      default:
        return {
          opacity: 0,
          transform: "translateY(24px)",
          transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        };
    }
  };

  return (
    <div ref={ref} className={className} style={getInitialStyle()}>
      {children}
    </div>
  );
}
