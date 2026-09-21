"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "sm" | "default" | "lg" | "xl" | "full"
  href?: string
  target?: string
  rel?: string
  className?: string
  glowIntensity?: "normal" | "high"
}

export function CyberButton({
  children,
  variant = "primary",
  size = "default",
  href,
  target,
  rel,
  className,
  glowIntensity = "normal",
  disabled,
  onClick,
  ...props
}: CyberButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  // WebGL animation references
  const animStateRef = useRef({
    arcs: 2.4,
    arcsTarget: 2.4,
    flash: 0,
    crawl: 0,
    lastTime: 0,
    animId: 0,
    isVisible: true,
  })

  // Size styling maps
  const sizeClasses = {
    sm: "h-9 px-4 text-xs font-semibold tracking-wider rounded-xl min-w-[120px]",
    default: "h-11 sm:h-12 px-6 text-sm font-semibold tracking-wider rounded-2xl min-w-[150px]",
    lg: "h-14 sm:h-16 px-8 text-base sm:text-lg font-bold tracking-wider rounded-2xl min-w-[200px]",
    xl: "h-16 sm:h-20 px-10 text-lg sm:text-xl font-bold tracking-wider rounded-2xl min-w-[240px]",
    full: "w-full h-14 px-6 text-base font-bold tracking-wider rounded-2xl",
  }

  // WebGL Shader Setup
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isPrimary = variant === "primary"

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      })
    } catch {
      setWebglSupported(false)
      return
    }

    if (!gl) {
      setWebglSupported(false)
      return
    }

    setWebglSupported(true)

    // Vertex shader
    const vsSource = `
      attribute vec2 p;
      void main(){
        gl_Position = vec4(p, 0.0, 1.0);
      }
    `

    // Fragment shader tuned to Virtual Reality Guys' neon cyan (#00d2ff) and deep VR blue (#040817)
    const fsSource = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_arcs;
      uniform float u_flash;
      uniform float u_is_primary;

      float hash(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for(int i = 0; i < 4; i++){
          v += a * noise(p);
          p = p * 2.05 + vec2(9.7, 3.1);
          a *= 0.5;
        }
        return v;
      }

      float sdRBox(vec2 p, vec2 b, float r){
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }

      void main(){
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
        float ar = u_res.x / u_res.y;
        
        // Half-size with margin for electric plasma arcs
        float margin = clamp(0.12, 0.06, 0.16);
        vec2 hs = vec2(ar * 0.5 - margin, 0.5 - margin);
        float radius = clamp(0.12, 0.04, hs.y * 0.85);
        float d = sdRBox(p, hs, radius);
        float t = u_time;
        float hover = clamp(u_arcs / 6.0, 0.0, 1.0);

        // Deep VR navy base plate (#040817 -> #060d24)
        vec3 bgDeep = vec3(0.016, 0.031, 0.09);
        float plate = 1.0 - smoothstep(-0.006, 0.006, d);
        
        // Procedural micro-texture on plate
        vec3 plateCol = bgDeep + vec3(0.008, 0.02, 0.04) * fbm(p * 8.0);
        
        // Inner edge glow (cyan #00d2ff or secondary cyan-blue)
        vec3 glowCol = (u_is_primary > 0.5) ? vec3(0.0, 0.82, 1.0) : vec3(0.0, 0.45, 0.8);
        plateCol += glowCol * 0.35 * exp(d * 12.0) * (0.25 + hover * 0.65);
        
        vec3 col = plateCol * plate;

        // Electric plasma arcs crawling along the perimeter
        float a = atan(p.y, p.x);
        vec3 arcCol = vec3(0.0);
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          float w = clamp(u_arcs - fi, 0.0, 1.0);
          float n1 = fbm(vec2(a * 2.4 + fi * 11.3, t * (1.6 + fi * 0.27) + fi * 53.1));
          float off = (n1 - 0.5) * (0.09 + u_flash * 0.08);
          float seg = 0.3 + 0.7 * smoothstep(0.35, 0.75, noise(vec2(a * 1.8 + fi * 7.7, t * (0.9 + fi * 0.13) + fi * 19.0)));
          float g = 0.0038 / (abs(d + off) + 0.005);
          
          vec3 arcColorBase = (u_is_primary > 0.5) ? vec3(0.0, 0.82, 1.0) : vec3(0.0, 0.55, 0.85);
          vec3 arcCore = vec3(0.7, 0.95, 1.0);
          arcCol += (arcColorBase * g + arcCore * g * g * 0.5) * w * seg;
        }

        // Outer glow mask
        float outerMask = 1.0 - smoothstep(0.03, 0.16, d);
        col += arcCol * (0.7 + 0.5 * hover) * outerMask;

        // Click flash shockwave
        float ring = 0.006 / (abs(d) + 0.006);
        col += vec3(0.75, 0.95, 1.0) * ring * u_flash * 1.4 * outerMask;
        col += glowCol * u_flash * 0.25 * outerMask;

        // Seamless alpha transparency
        float arcSum = length(arcCol);
        float alpha = clamp(plate * 0.96 + arcSum * 1.25 + u_flash * 0.5, 0.0, 1.0);
        
        gl_FragColor = vec4(col, alpha);
      }
    `

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type)
      if (!shader) return null
      glCtx.shaderSource(shader, source)
      glCtx.compileShader(shader)
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn("Shader compile error:", glCtx.getShaderInfoLog(shader))
        glCtx.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) {
      setWebglSupported(false)
      return
    }

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program))
      setWebglSupported(false)
      return
    }

    gl.useProgram(program)

    // Full screen triangle
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const locP = gl.getAttribLocation(program, "p")
    gl.enableVertexAttribArray(locP)
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, "u_res")
    const uTime = gl.getUniformLocation(program, "u_time")
    const uArcs = gl.getUniformLocation(program, "u_arcs")
    const uFlash = gl.getUniformLocation(program, "u_flash")
    const uIsPrimary = gl.getUniformLocation(program, "u_is_primary")

    const resize = () => {
      if (!canvas || !container || !gl) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(container.clientWidth * dpr)
      const h = Math.round(container.clientHeight * dpr)
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    // Intersection Observer to stop rendering when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        animStateRef.current.isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    animStateRef.current.lastTime = performance.now()

    const render = (now: number) => {
      const state = animStateRef.current
      if (!gl || !canvas) return

      if (state.isVisible) {
        const dt = Math.min(0.05, (now - state.lastTime) / 1000)
        state.lastTime = now

        state.arcs += (state.arcsTarget - state.arcs) * Math.min(1, dt * 6)
        state.flash *= Math.exp(-4.2 * dt)
        state.crawl += dt * (0.65 + (state.arcs / 6) * 1.25 + state.flash * 2.2)

        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uTime, reducedMotion ? 2.5 : state.crawl)
        gl.uniform1f(uArcs, state.arcs)
        gl.uniform1f(uFlash, state.flash)
        gl.uniform1f(uIsPrimary, isPrimary ? 1.0 : 0.0)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      } else {
        state.lastTime = now
      }

      state.animId = requestAnimationFrame(render)
    }

    animStateRef.current.animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animStateRef.current.animId)
      resizeObserver.disconnect()
      observer.disconnect()
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    }
  }, [variant])

  // Interactive state events
  const handleMouseEnter = () => {
    setIsHovered(true)
    animStateRef.current.arcsTarget = 5.8
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    animStateRef.current.arcsTarget = 2.4
  }

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    animStateRef.current.flash = 1.0
    if (onClick) {
      onClick(e)
    }
  }

  const dropShadowStyle =
    variant === "primary"
      ? isHovered
        ? "drop-shadow(0 0 20px rgba(0, 210, 255, 0.6)) drop-shadow(0 0 40px rgba(0, 210, 255, 0.25))"
        : "drop-shadow(0 0 14px rgba(0, 210, 255, 0.35))"
      : isHovered
      ? "drop-shadow(0 0 16px rgba(0, 162, 232, 0.45))"
      : "drop-shadow(0 0 8px rgba(0, 162, 232, 0.2))"

  const textShadowStyle =
    variant === "primary"
      ? "0 0 12px rgba(0, 210, 255, 0.75), 0 1px 4px rgba(0, 0, 0, 0.9)"
      : "0 0 8px rgba(0, 162, 232, 0.5), 0 1px 4px rgba(0, 0, 0, 0.9)"

  // Common interactive button content
  const buttonContent = (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative inline-flex items-center justify-center select-none overflow-visible group cursor-pointer transition-all duration-200 ease-out",
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      style={{
        transform: isPressed
          ? "translateY(1px) scale(0.98)"
          : isHovered
          ? "translateY(-2px) scale(1.01)"
          : "translateY(0) scale(1)",
      }}
    >
      {/* WebGL Canvas Background */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none transition-[filter] duration-300 rounded-[inherit]"
          style={{
            filter: dropShadowStyle,
          }}
        />
      ) : (
        /* CSS Glowing Cyber Fallback */
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-[inherit] transition-all duration-300 pointer-events-none",
            variant === "primary"
              ? "bg-gradient-to-br from-[#06112e] via-[#040817] to-[#08173d] border-2 border-primary/70 shadow-[0_0_20px_rgba(0,210,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] group-hover:border-primary"
              : "bg-gradient-to-br from-[#081430] via-[#040817] to-[#060e24] border border-border/80 shadow-[0_0_12px_rgba(0,162,232,0.2)] group-hover:shadow-[0_0_20px_rgba(0,162,232,0.4)] group-hover:border-accent"
          )}
        />
      )}

      {/* Button Text & Icon Content with Brand Glowing Typography */}
      <span
        className={cn(
          "relative z-10 pointer-events-none inline-flex items-center justify-center gap-2.5 font-bold transition-all duration-200",
          variant === "primary" ? "text-[#e0f7f8] group-hover:text-white" : "text-slate-100 group-hover:text-white"
        )}
        style={{
          textShadow: textShadowStyle,
        }}
      >
        {children}
      </span>
    </div>
  )

  // Render as Next.js Link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className="inline-block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
      >
        {buttonContent}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button
      type={props.type || "button"}
      disabled={disabled}
      onClick={handleClick}
      className="inline-block bg-transparent p-0 border-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl cursor-pointer"
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export default CyberButton
