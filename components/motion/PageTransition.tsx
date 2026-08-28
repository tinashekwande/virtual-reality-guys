"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Skip transition on first render (initial page load / SSR hydration)
    // so Google sees opacity:1 immediately
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Only animate on client-side navigation
    setMounted(false);
    const timeout = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px) scale(1)" : "translateY(8px) scale(0.995)",
      }}
    >
      {children}
    </div>
  );
}
