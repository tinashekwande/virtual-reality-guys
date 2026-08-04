"use client";

import React, { useEffect, useState, useRef } from "react";

interface HeroParallaxProps {
  backgroundChildren: React.ReactNode;
  contentChildren: React.ReactNode;
  className?: string;
}

export default function HeroParallax({
  backgroundChildren,
  contentChildren,
  className = "",
}: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bgTransform, setBgTransform] = useState("translate3d(0px, 0px, 0px)");
  const [contentTransform, setContentTransform] = useState("translate3d(0px, 0px, 0px)");

  useEffect(() => {
    // Check reduced motion or small screen
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) {
      return;
    }

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const update = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const bgX = (currentX * -18).toFixed(2);
      const bgY = (currentY * -18 + scrollY * 0.2).toFixed(2);

      const contentX = (currentX * 10).toFixed(2);
      const contentY = (currentY * 10 - scrollY * 0.05).toFixed(2);

      setBgTransform(`translate3d(${bgX}px, ${bgY}px, 0px) scale(1.05)`);
      setContentTransform(`translate3d(${contentX}px, ${contentY}px, 0px)`);

      rafId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* 2.5D Layered Background */}
      <div
        className="absolute inset-0 z-0 will-change-transform transition-transform ease-out duration-75 pointer-events-none"
        style={{ transform: bgTransform }}
      >
        {backgroundChildren}
      </div>

      {/* 2.5D Responsive Content */}
      <div
        className="relative z-10 will-change-transform transition-transform ease-out duration-75"
        style={{ transform: contentTransform }}
      >
        {contentChildren}
      </div>
    </div>
  );
}
