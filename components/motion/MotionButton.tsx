"use client";

import React, { useRef, useState } from "react";

interface MotionButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // 0 to 0.4
}

export default function MotionButton({
  children,
  className = "",
  magneticStrength = 0.25,
}: MotionButtonProps) {
  const btnRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) {
      return;
    }

    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * magneticStrength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * magneticStrength;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${
          isHovered ? 1.03 : 1
        })`,
      }}
    >
      {children}
    </div>
  );
}
