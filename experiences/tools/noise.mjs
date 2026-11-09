// Deterministic 3D noise helpers for texture generation (run at build time in Node, not in the headset).

// ---- seeded PRNG ----
export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---- 3D simplex noise (Gustavson) ----
const grad3 = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1])
export function makeSimplex(seed = 1) {
  const rnd = mulberry32(seed)
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const t = p[i]; p[i] = p[j]; p[j] = t
  }
  const perm = new Uint8Array(512)
  const permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12 }
  const F3 = 1 / 3, G3 = 1 / 6
  return function noise3(xin, yin, zin) {
    let n0, n1, n2, n3
    const s = (xin + yin + zin) * F3
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s)
    const t = (i + j + k) * G3
    const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t)
    let i1, j1, k1, i2, j2, k2
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0 }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1 }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1 }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1 }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1 }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0 }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3
    const ii = i & 255, jj = j & 255, kk = k & 255
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
    if (t0 < 0) n0 = 0; else { const g = permMod12[ii+perm[jj+perm[kk]]]*3; t0 *= t0; n0 = t0*t0*(grad3[g]*x0+grad3[g+1]*y0+grad3[g+2]*z0) }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
    if (t1 < 0) n1 = 0; else { const g = permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]*3; t1 *= t1; n1 = t1*t1*(grad3[g]*x1+grad3[g+1]*y1+grad3[g+2]*z1) }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
    if (t2 < 0) n2 = 0; else { const g = permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]*3; t2 *= t2; n2 = t2*t2*(grad3[g]*x2+grad3[g+1]*y2+grad3[g+2]*z2) }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
    if (t3 < 0) n3 = 0; else { const g = permMod12[ii+1+perm[jj+1+perm[kk+1]]]*3; t3 *= t3; n3 = t3*t3*(grad3[g]*x3+grad3[g+1]*y3+grad3[g+2]*z3) }
    return 32 * (n0 + n1 + n2 + n3) // about -1..1
  }
}

/** Fractal noise, roughly 0..1 */
export function fbm(n, x, y, z, oct = 5, lac = 2, gain = 0.5) {
  let a = 0.5, f = 1, s = 0, norm = 0
  for (let i = 0; i < oct; i++) { s += a * n(x * f, y * f, z * f); norm += a; a *= gain; f *= lac }
  return 0.5 + 0.5 * (s / norm)
}
/** Ridged fractal noise, 0..1 with sharp crests (mountains, cracks) */
export function ridged(n, x, y, z, oct = 5) {
  let a = 0.5, f = 1, s = 0, norm = 0
  for (let i = 0; i < oct; i++) { const v = 1 - Math.abs(n(x * f, y * f, z * f)); s += a * v * v; norm += a; a *= 0.5; f *= 2 }
  return s / norm
}

// ---- craters (cellular) ----
function h3(x, y, z, s) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(s, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
/** Height offset from bowl-shaped craters with raised rims. density 0..1 = share of cells that get a crater */
export function craters(x, y, z, scale, seed, density = 0.6) {
  const px = x * scale, py = y * scale, pz = z * scale
  const cx = Math.floor(px), cy = Math.floor(py), cz = Math.floor(pz)
  let h = 0
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
    const gx = cx + i, gy = cy + j, gz = cz + k
    if (h3(gx, gy, gz, seed + 7) > density) continue
    const fx = gx + h3(gx, gy, gz, seed), fy = gy + h3(gx, gy, gz, seed + 1), fz = gz + h3(gx, gy, gz, seed + 2)
    const r = 0.18 + 0.32 * h3(gx, gy, gz, seed + 3)
    const dx = px - fx, dy = py - fy, dz = pz - fz
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / r
    if (d < 1) h += (d * d - 1) * 0.9 + 0.25 * Math.max(0, 1 - d * 3) // bowl with a little central peak
    else if (d < 1.45) { const t = (d - 1) / 0.45; h += 0.35 * (1 - t) * (1 - t) }
  }
  return h
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smoothstep = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t) }
export const lerp = (a, b, t) => a + (b - a) * t
export function mixc(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
export const hex = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255]
/** Sample a colour ramp: stops = [[pos, [r,g,b]], ...] */
export function ramp(stops, t) {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) return mixc(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]))
  }
  return stops[stops.length - 1][1]
}
