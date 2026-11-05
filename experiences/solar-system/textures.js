import * as THREE from 'three'

// Procedural planet surfaces: no downloaded images, so the app stays tiny and works offline.

function hash(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967295
}
function smooth(t) {
  return t * t * (3 - 2 * t)
}
function vnoise(x, y, seed, period) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)
  const wrap = (v) => ((v % period) + period) % period // wraps horizontally so the seam is invisible
  const a = hash(wrap(xi), yi, seed)
  const b = hash(wrap(xi + 1), yi, seed)
  const c = hash(wrap(xi), yi + 1, seed)
  const d = hash(wrap(xi + 1), yi + 1, seed)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}
function fbm(u, v, seed, base = 4, oct = 5) {
  let amp = 0.5
  let sum = 0
  let norm = 0
  let f = base
  for (let i = 0; i < oct; i++) {
    sum += amp * vnoise(u * f, v * f * 0.5, seed + i * 17, f)
    norm += amp
    amp *= 0.5
    f *= 2
  }
  return sum / norm
}
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const hex = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255]

function paint(width, height, fn) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)
  for (let y = 0; y < height; y++) {
    const v = y / height
    for (let x = 0; x < width; x++) {
      const u = x / width
      const [r, g, b, a = 255] = fn(u, v)
      const i = (y * width + x) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = a
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}

const W = 512
const H = 256

const painters = {
  sun: () =>
    paint(W, H, (u, v) => {
      const n = fbm(u, v, 3, 6, 5)
      const c = mix(hex(0xff8a1f), hex(0xffe38a), Math.pow(n, 1.6) * 1.4)
      return c
    }),
  mercury: () =>
    paint(W, H, (u, v) => {
      const n = fbm(u, v, 11, 8, 5)
      const crater = Math.pow(Math.abs(fbm(u, v, 29, 14, 3) - 0.5) * 2, 3)
      const c = mix(hex(0x6e6a66), hex(0xb9b2aa), n)
      return mix(c, hex(0x3a3836), crater * 0.6)
    }),
  venus: () =>
    paint(W, H, (u, v) => {
      const swirl = fbm(u + fbm(u, v, 5, 3, 3) * 0.25, v, 7, 3, 5)
      return mix(hex(0xc9953f), hex(0xf6dfa4), swirl)
    }),
  earth: () =>
    paint(W, H, (u, v) => {
      const land = fbm(u, v, 41, 3, 6)
      const lat = Math.abs(v - 0.5) * 2
      if (lat > 0.88) return hex(0xf3f8ff) // polar ice
      if (land > 0.52) {
        const h = (land - 0.52) * 4
        return mix(hex(0x2f8f3a), hex(0x9c7b45), Math.min(1, h + (1 - lat) * 0.0))
      }
      return mix(hex(0x0b3a8a), hex(0x1f6fd1), land * 1.6)
    }),
  clouds: () =>
    paint(W, H, (u, v) => {
      const n = fbm(u, v, 77, 4, 5)
      const a = Math.max(0, (n - 0.57) * 3.4)
      return [255, 255, 255, Math.min(255, a * 255)]
    }),
  mars: () =>
    paint(W, H, (u, v) => {
      const n = fbm(u, v, 61, 4, 6)
      const lat = Math.abs(v - 0.5) * 2
      if (lat > 0.93) return hex(0xf5ece6)
      return mix(hex(0x9a3d1e), hex(0xdb7a45), n)
    }),
  jupiter: () =>
    paint(W, H, (u, v) => {
      const warp = fbm(u, v, 9, 3, 4) * 0.06
      const band = fbm(0.2, v + warp, 15, 9, 3)
      let c = mix(hex(0xb3774a), hex(0xf0dcc0), band)
      // Great Red Spot
      const dx = (u - 0.62) / 0.07
      const dy = (v - 0.62) / 0.045
      const d = dx * dx + dy * dy
      if (d < 1) c = mix(c, hex(0xc0452b), 1 - d)
      return c
    }),
  saturn: () =>
    paint(W, H, (u, v) => {
      const band = fbm(0.4, v + fbm(u, v, 21, 3, 3) * 0.03, 19, 8, 3)
      return mix(hex(0xc9a66b), hex(0xf1e2b7), band)
    }),
  uranus: () =>
    paint(W, H, (u, v) => {
      const band = fbm(0.3, v, 33, 5, 2)
      return mix(hex(0x7fd6d9), hex(0xb4eff0), band)
    }),
  neptune: () =>
    paint(W, H, (u, v) => {
      const band = fbm(u, v, 47, 4, 4)
      let c = mix(hex(0x1c3fb0), hex(0x4f7cf0), band)
      const dx = (u - 0.3) / 0.06
      const dy = (v - 0.45) / 0.04
      const d = dx * dx + dy * dy
      if (d < 1) c = mix(c, hex(0x0d1f6b), (1 - d) * 0.8)
      return c
    }),
  moon: () =>
    paint(W, H, (u, v) => {
      const n = fbm(u, v, 83, 8, 5)
      const crater = Math.pow(Math.abs(fbm(u, v, 91, 16, 3) - 0.5) * 2, 3)
      return mix(mix(hex(0x8a8a8a), hex(0xd2d2d2), n), hex(0x4a4a4a), crater * 0.5)
    }),
}

const cache = new Map()
export function surface(name) {
  if (!cache.has(name)) cache.set(name, toTexture(painters[name]()))
  return cache.get(name)
}

/** Soft radial glow used around the Sun. */
export function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128)
  g.addColorStop(0, 'rgba(255, 220, 120, 0.9)')
  g.addColorStop(0.4, 'rgba(255, 150, 40, 0.35)')
  g.addColorStop(1, 'rgba(255, 120, 0, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

/** Saturn's rings: a radial strip of banded ice and rock. */
export function ringTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 4
  const ctx = c.getContext('2d')
  for (let x = 0; x < 512; x++) {
    const t = x / 512
    const gap = t > 0.62 && t < 0.68 ? 0.15 : 1
    const n = 0.55 + 0.45 * vnoise(t * 40, 0, 5, 1000)
    const a = Math.max(0, Math.min(1, n * gap)) * (t < 0.04 || t > 0.97 ? 0.4 : 1)
    ctx.fillStyle = `rgba(225, 205, 165, ${a})`
    ctx.fillRect(x, 0, 1, 4)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
