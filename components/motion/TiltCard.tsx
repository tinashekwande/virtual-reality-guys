"use client";

import React, { useState, useRef, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 6)
  scale?: number; // Hover scale multiplier (default 1.015)
  glow?: boolean; // Enable cursor light glow effect (default true)
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  scale = 1.015,
  glow = true,
  style = {},
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      // Skip 3D tilt on touch or reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = (((y - centerY) / centerY) * -maxTilt).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * maxTilt).toFixed(2);

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px) scale3d(${scale}, ${scale}, 1)`
      );

      if (glow) {
        const glowX = ((x / rect.width) * 100).toFixed(1);
        const glowY = ((y / rect.height) * 100).toFixed(1);
        setGlowPosition({ x: Number(glowX), y: Number(glowY), opacity: 0.15 });
      }
    },
    [maxTilt, scale, glow]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)");
    setGlowPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform ease-out ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transitionDuration: isHovered ? "100ms" : "500ms",
        transitionProperty: "transform",
        ...style,
      }}
    >
      {children}
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: glowPosition.opacity,
            background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(6, 182, 212, 0.35), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
