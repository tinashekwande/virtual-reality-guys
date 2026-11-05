// Generates the Solar System textures as JPGs (run: node tools/gen-textures.mjs).
// Everything is procedural except Earth's coastlines, which come from Natural Earth (public domain) via world-atlas.
import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature } from 'topojson-client'
import { makeSimplex, fbm, ridged, craters, clamp01, smoothstep, lerp, mixc, hex, ramp, mulberry32 } from './noise.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '..', 'public', 'textures', 'solar')
const TMP = join(here, '.tmp')
mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })
const only = process.argv.slice(2)
const DEG = Math.PI / 180

// ---- output ----
function save(name, w, h, data, channels = 3, quality = 3) {
  const header = Buffer.from(`${channels === 3 ? 'P6' : 'P5'}\n${w} ${h}\n255\n`)
  const tmp = join(TMP, name + (channels === 3 ? '.ppm' : '.pgm'))
  writeFileSync(tmp, Buffer.concat([header, Buffer.from(data.buffer)]))
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tmp, '-q:v', String(quality), join(OUT, name + '.jpg')])
  rmSync(tmp)
}

/** Run fn for every pixel of an equirectangular map. fn gets sphere point (three.js SphereGeometry layout) + lat/lon in degrees. */
function each(w, h, fn) {
  for (let y = 0; y < h; y++) {
    const theta = ((y + 0.5) / h) * Math.PI
    const st = Math.sin(theta), ct = Math.cos(theta)
    const lat = 90 - (theta / DEG)
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w
      const phi = u * 2 * Math.PI
      fn(x, y, -Math.cos(phi) * st, ct, Math.sin(phi) * st, lat, -180 + u * 360)
    }
  }
}
function rgbBuf(w, h) { return new Uint8Array(w * h * 3) }
function put(buf, i, c) { buf[i * 3] = c[0] < 0 ? 0 : c[0] > 255 ? 255 : c[0]; buf[i * 3 + 1] = c[1] < 0 ? 0 : c[1] > 255 ? 255 : c[1]; buf[i * 3 + 2] = c[2] < 0 ? 0 : c[2] > 255 ? 255 : c[2] }

// separable box blur with horizontal wrap (used for coastlines and soft masks)
function blur(src, w, h, r, passes = 2) {
  let a = Float32Array.from(src), b = new Float32Array(w * h)
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += a[y * w + ((k + w) % w)]
      for (let x = 0; x < w; x++) {
        b[y * w + x] = s / (2 * r + 1)
        s += a[y * w + ((x + r + 1) % w)] - a[y * w + ((x - r + w) % w)]
      }
    }
    for (let x = 0; x < w; x++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += b[Math.min(h - 1, Math.max(0, k)) * w + x]
      for (let y = 0; y < h; y++) {
        a[y * w + x] = s / (2 * r + 1)
        s += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]
      }
    }
  }
  return a
}

const jobs = {}

// ======================= EARTH =======================
jobs.earth = () => {
  const W = 2048, H = 1024
  const topo = JSON.parse(readFileSync(join(here, '..', 'node_modules', 'world-atlas', 'land-50m.json'), 'utf8'))
  const land = feature(topo, topo.objects.land)
  // even-odd scanline fill of every ring
  const rings = []
  for (const f of land.features ?? [land]) {
    const g = f.geometry
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
    for (const poly of polys) for (const ring of poly) rings.push(ring)
  }
  // Each ring toggles the pixels it encloses (XOR), so holes come out right. Rings that cross the date line are
  // unwrapped to continuous longitudes and rings that circle a pole (Antarctica) are closed through the pole.
  const bits = new Uint8Array(W * H)
  for (const raw of rings) {
    const ring = []
    let off = 0
    for (let i = 0; i < raw.length; i++) {
      let [lo, la] = raw[i]
      if (i > 0) {
        const prev = raw[i - 1][0] + off
        while (lo + off - prev > 180) off -= 360
        while (lo + off - prev < -180) off += 360
      }
      ring.push([lo + off, la])
    }
    const drift = ring[ring.length - 1][0] - ring[0][0]
    if (Math.abs(drift) > 180) {
      let meanLat = 0
      for (const [, la] of ring) meanLat += la
      const pole = meanLat < 0 ? -90 : 90
      ring.push([ring[ring.length - 1][0], pole], [ring[0][0], pole])
    }
    let minLat = 90, maxLat = -90
    for (const [, la] of ring) { if (la < minLat) minLat = la; if (la > maxLat) maxLat = la }
    const y0 = Math.max(0, Math.floor(((90 - maxLat) / 180) * H) - 1), y1 = Math.min(H - 1, Math.ceil(((90 - minLat) / 180) * H) + 1)
    for (let y = y0; y <= y1; y++) {
      const lat = 90 - ((y + 0.5) / H) * 180
      const xs = []
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [x1, la1] = ring[j], [x2, la2] = ring[i]
        if ((la1 > lat) !== (la2 > lat)) xs.push(x1 + ((lat - la1) / (la2 - la1)) * (x2 - x1))
      }
      xs.sort((a, b) => a - b)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const a = Math.round(((xs[k] + 180) / 360) * W), b = Math.round(((xs[k + 1] + 180) / 360) * W) - 1
        for (let x = a; x <= b; x++) bits[y * W + (((x % W) + W) % W)] ^= 1
      }
    }
  }
  const mask = Float32Array.from(bits)
  const soft = blur(mask, W, H, 1, 1)
  const coast = blur(mask, W, H, 10, 3) // >0 near land, used for shallow seas and coastal cities

  const n = makeSimplex(11), n2 = makeSimplex(23), n3 = makeSimplex(37)
  const ranges = [
    { w: 4, h: 1, pts: [[68, 37], [73, 35.5], [78, 33], [82, 30.5], [86, 28.2], [90, 28], [95, 28.5]] }, // Himalaya
    { w: 7, h: 0.75, pts: [[80, 34], [88, 33], [96, 32]] }, // Tibetan plateau
    { w: 3, h: 0.9, pts: [[-78, 8], [-77.5, 0], [-76, -10], [-70, -17], [-68.5, -24], [-70, -32], [-71.5, -42], [-73, -50]] }, // Andes
    { w: 4, h: 0.65, pts: [[-150, 63], [-135, 60], [-125, 55], [-118, 50], [-113, 45], [-108, 40], [-106, 35], [-105, 30]] }, // Rockies
    { w: 1.6, h: 0.75, pts: [[6, 45], [10, 46.5], [14, 47]] }, // Alps
    { w: 1.6, pts: [[40, 43], [47, 42]] }, // Caucasus
    { w: 2.2, pts: [[45, 35], [50, 32], [55, 28.5]] }, // Zagros
    { w: 2, pts: [[-8, 31], [-2, 33], [4, 35.5]] }, // Atlas
    { w: 4, pts: [[37, 12], [39, 8], [38, 4]] }, // Ethiopian highlands
    { w: 2.5, pts: [[36, 0], [35, -6], [34, -11]] }, // East African highlands
    { w: 2, pts: [[27, -31], [29.3, -29.3], [31, -26]] }, // Drakensberg
    { w: 1.6, pts: [[19, -33.8], [21, -33.5], [24, -33.2]] }, // Cape Fold mountains (home!)
    { w: 2.5, pts: [[146, -38], [150, -32], [148, -24], [145, -16]] }, // Great Dividing Range
    { w: 1.8, pts: [[59, 51], [60, 58], [62, 66]] }, // Urals
    { w: 2.5, pts: [[7, 60], [12, 63], [16, 67], [20, 69]] }, // Scandinavia
    { w: 2.2, pts: [[-85, 34], [-79, 38], [-75, 41.5], [-71, 44.5]] }, // Appalachians
    { w: 3, pts: [[70, 39], [76, 41], [82, 43], [88, 44]] }, // Tian Shan / Pamir
  ]
  const deserts = [
    [-15, 35, 15, 32], [35, 58, 14, 32], [68, 75, 23, 30], [90, 115, 38, 47], [77, 90, 36.5, 41.5],
    [118, 142, -31, -19], [12, 25, -28, -17], [-117, -103, 26, 37], [-72, -68, -27, -18], [50, 63, 26, 36],
    [53, 66, 38, 45], [-68, -63, -50, -38],
  ]
  function rangeBoost(lon, lat) {
    let best = 0
    const cl = Math.cos(lat * DEG)
    for (const r of ranges) {
      for (let i = 0; i + 1 < r.pts.length; i++) {
        const [ax, ay] = r.pts[i], [bx, by] = r.pts[i + 1]
        const dx = (bx - ax) * cl, dy = by - ay
        const px = (lon - ax) * cl, py = lat - ay
        const t = clamp01((px * dx + py * dy) / (dx * dx + dy * dy || 1))
        const ex = px - t * dx, ey = py - t * dy
        const d2 = (ex * ex + ey * ey) / (r.w * r.w)
        if (d2 < 9) best = Math.max(best, Math.exp(-d2) * (r.h ?? 0.45))
      }
    }
    return best
  }
  function desertness(lon, lat, wob) {
    let d = 0
    for (const [x0, x1, y0, y1] of deserts) {
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2
      const e = ((lon - cx) / rx) ** 2 + ((lat - cy) / ry) ** 2 + wob
      d = Math.max(d, 1 - smoothstep(0.35, 1.45, e))
    }
    return d
  }

  const col = rgbBuf(W, H), night = new Uint8Array(W * H), rough = new Uint8Array(W * H), bump = new Uint8Array(W * H), cloud = new Uint8Array(W * H)
  const C = {
    deep: hex(0x06204f), mid: hex(0x0d3f86), shallow: hex(0x1d6fa3), reef: hex(0x3a9cb5),
    rain: hex(0x1f4a1f), forest: hex(0x2f5d2a), temperate: hex(0x587a3a), savanna: hex(0x9a8c55), dry: hex(0xb79e6c),
    desert: hex(0xd2b07a), desert2: hex(0xc08a55), tundra: hex(0x7b7458), boreal: hex(0x2d4a2e), rock: hex(0x7a6a58), snow: hex(0xf2f5f8), ice: hex(0xe8eef4),
  }
  each(W, H, (x, y, px, py, pz, lat, lon) => {
    const i = y * W + x
    const m = soft[i]
    const alat0 = Math.abs(lat)
    const detail = fbm(n, px * 18, py * 18, pz * 18, 4)
    const alat = Math.abs(lat + (fbm(n2, px * 3 + 7, py * 3, pz * 3, 4) - 0.5) * 16)
    // ---- ocean ----
    const cst = coast[i]
    let ocean = mixc(C.deep, C.mid, smoothstep(0.0, 0.3, cst) * 0.6 + fbm(n3, px * 4, py * 4, pz * 4, 4) * 0.35)
    ocean = mixc(ocean, C.shallow, smoothstep(0.42, 0.78, cst) * 0.75)
    ocean = mixc(ocean, C.reef, smoothstep(0.7, 0.95, cst) * (alat < 30 ? 0.45 : 0.15))
    // sea ice
    const seaIce = lat > 0 ? smoothstep(74, 82, lat + (fbm(n2, px * 8, py * 8, pz * 8) - 0.5) * 8) : smoothstep(64, 70, -lat + (fbm(n2, px * 8, py * 8, pz * 8) - 0.5) * 6)
    ocean = mixc(ocean, C.ice, seaIce * 0.9)

    // ---- land ----
    const wob = (fbm(n2, px * 4, py * 4, pz * 4) - 0.5) * 1.6 + (fbm(n3, px * 14, py * 14, pz * 14) - 0.5) * 0.5
    const des = desertness(lon, lat, wob)
    const rb = rangeBoost(lon, lat)
    const elev = clamp01(0.12 + 0.25 * fbm(n3, px * 3, py * 3, pz * 3) * smoothstep(0.3, 0.9, cst) + rb * (0.4 + 0.5 * ridged(n, px * 14, py * 14, pz * 14, 4)))
    // biome by latitude
    let land
    if (alat < 10) land = mixc(C.rain, C.forest, detail)
    else if (alat < 20) land = mixc(C.forest, C.savanna, smoothstep(10, 20, alat) * 0.8 + (detail - 0.5) * 0.4)
    else if (alat < 32) land = mixc(C.savanna, C.temperate, smoothstep(20, 32, alat))
    else if (alat < 50) land = mixc(C.temperate, C.forest, smoothstep(38, 50, alat) * 0.6 + (detail - 0.5) * 0.3)
    else if (alat < 64) land = mixc(C.boreal, C.forest, detail * 0.4)
    else land = mixc(C.boreal, C.tundra, smoothstep(62, 70, alat))
    land = mixc(land, mixc(C.dry, C.savanna, detail), clamp01(des * 1.6) * 0.6)
    land = mixc(land, mixc(mixc(C.desert, C.desert2, fbm(n2, px * 10, py * 10, pz * 10)), C.dry, ridged(n3, px * 30, py * 30, pz * 30, 3) * 0.35), smoothstep(0.3, 0.95, des + (detail - 0.5) * 0.7))
    land = mixc(land, C.rock, smoothstep(0.42, 0.8, elev) * 0.85)
    const snowLine = 0.86 - smoothstep(35, 70, alat0) * 0.18
    land = mixc(land, C.snow, smoothstep(snowLine, snowLine + 0.08, elev))
    // ice sheets: Antarctica and Greenland
    const greenland = smoothstep(-78, -70, lon) * (1 - smoothstep(-14, -9, lon)) * smoothstep(59, 63, lat) * smoothstep(0.35, 0.6, cst)
    const iceSheet = Math.max(smoothstep(-62, -66, lat), greenland, smoothstep(79, 83, lat) * 0.8)
    land = mixc(land, C.ice, iceSheet)
    land = mixc(land, mixc(land, [0, 0, 0], 0.25), (detail - 0.5) * 0.6) // fine variation

    put(col, i, mixc(ocean, land, m))
    rough[i] = Math.round(lerp(lerp(95, 210, seaIce), lerp(235, 205, iceSheet), m))
    bump[i] = Math.round(255 * clamp01(elev * m * (1 - iceSheet * 0.7)))

    // ---- city lights ----
    if (m > 0.5 && iceSheet < 0.2 && alat0 < 64) {
      const cluster = fbm(n3, px * 7, py * 7, pz * 7, 3)
      const speck = fbm(n, px * 90, py * 90, pz * 90, 2)
      const pop = smoothstep(0.45, 0.75, cluster) * (1 - smoothstep(0.3, 0.8, des)) * (1 - smoothstep(0.55, 0.8, elev)) *
        (0.35 + 0.65 * smoothstep(0.35, 0.8, 1 - cst + 0.6)) * (alat0 < 10 ? 0.4 : alat0 > 55 ? 0.5 : 1)
      night[i] = Math.round(255 * clamp01(Math.pow(clamp01((speck - 0.45) * 3.2), 2) * pop * 1.6))
    }

    // ---- clouds ----
    const wx = px + 0.35 * (fbm(n2, px * 2 + 5, py * 2, pz * 2, 3) - 0.5), wy = py + 0.35 * (fbm(n2, px * 2, py * 2 + 9, pz * 2, 3) - 0.5), wz = pz + 0.35 * (fbm(n2, px * 2, py * 2, pz * 2 + 3, 3) - 0.5)
    let c = 0.6 * fbm(n3, wx * 2.2, wy * 4, wz * 2.2, 6) + 0.4 * fbm(n, wx * 6, wy * 10, wz * 6, 4)
    c += alat < 8 ? 0.08 : alat < 30 ? -0.07 * smoothstep(10, 22, alat) : alat < 68 ? 0.07 * smoothstep(35, 50, alat) : 0.02
    cloud[i] = Math.round(255 * Math.pow(smoothstep(0.47, 0.76, c), 1.35))
  })
  save('earth', W, H, col, 3, 2)
  save('earth_night', W, H, night, 1, 4)
  save('earth_rough', W / 2, H / 2, downsample(rough, W, H), 1, 5)
  save('earth_bump', W, H, bump, 1, 4)
  save('earth_clouds', W, H, cloud, 1, 3)
}
function downsample(a, w, h) {
  const o = new Uint8Array((w / 2) * (h / 2))
  for (let y = 0; y < h / 2; y++) for (let x = 0; x < w / 2; x++) o[y * (w / 2) + x] = (a[2 * y * w + 2 * x] + a[2 * y * w + 2 * x + 1] + a[(2 * y + 1) * w + 2 * x] + a[(2 * y + 1) * w + 2 * x + 1]) >> 2
  return o
}

// ======================= ROCKY WORLDS =======================
function rocky(name, W, H, { seed, base, light, dark, craterScales, craterDensity = 0.55, extra, bumpGain = 1 }) {
  const n = makeSimplex(seed), n2 = makeSimplex(seed + 5)
  const col = rgbBuf(W, H), bump = new Uint8Array(W * H)
  each(W, H, (x, y, px, py, pz, lat, lon) => {
    const i = y * W + x
    let hgt = 0
    for (const [s, a] of craterScales) hgt += a * craters(px, py, pz, s, seed + s, craterDensity)
    hgt += 0.25 * (fbm(n, px * 6, py * 6, pz * 6, 5) - 0.5)
    const alb = fbm(n2, px * 2.5, py * 2.5, pz * 2.5, 5)
    let c = ramp([[0, dark], [0.5, base], [1, light]], clamp01(alb + hgt * 0.32))
    const fine = fbm(n, px * 40, py * 40, pz * 40, 2)
    c = mixc(c, mixc(c, [0, 0, 0], 0.3), (0.5 - fine) * 0.5)
    if (extra) { const r = extra(px, py, pz, lat, lon, c, hgt); if (r) { c = r.c ?? c; if (r.h !== undefined) hgt = r.h } }
    put(col, i, c)
    bump[i] = Math.round(255 * clamp01(0.5 + hgt * 0.35 * bumpGain))
  })
  save(name, W, H, col, 3, 3)
  save(name + '_bump', W, H, bump, 1, 4)
}

jobs.mercury = () => rocky('mercury', 2048, 1024, {
  seed: 101, base: hex(0x8f8a84), light: hex(0xc4bdb3), dark: hex(0x5a5652),
  craterScales: [[3, 0.9], [7, 0.6], [16, 0.35], [36, 0.2]], craterDensity: 0.7,
})

jobs.moon = () => {
  const nM = makeSimplex(909)
  rocky('moon', 1024, 512, {
    seed: 202, base: hex(0x9c9c9a), light: hex(0xd4d4d0), dark: hex(0x6e6e6c),
    craterScales: [[4, 0.8], [10, 0.5], [24, 0.3]], craterDensity: 0.6,
    extra: (px, py, pz, lat, lon, c, h) => {
      const mare = smoothstep(0.5, 0.64, fbm(nM, px * 1.6, py * 1.6, pz * 1.6, 4) + px * 0.05)
      return { c: mixc(c, hex(0x5e5f62), mare * 0.75), h: lerp(h, h * 0.3, mare) }
    },
  })
}

jobs.mars = () => {
  const nA = makeSimplex(303), nC = makeSimplex(304)
  rocky('mars', 2048, 1024, {
    seed: 305, base: hex(0xb2603a), light: hex(0xd8915e), dark: hex(0x6e3322),
    craterScales: [[4, 0.5], [10, 0.3], [24, 0.15]], craterDensity: 0.45,
    extra: (px, py, pz, lat, lon, c, h) => {
      // dark albedo regions
      const darkR = smoothstep(0.5, 0.75, fbm(nA, px * 1.3, py * 1.3, pz * 1.3, 6))
      c = mixc(c, hex(0x6a3424), darkR * 0.55)
      // Valles Marineris canyon
      if (lon > -100 && lon < -30) {
        const d = Math.abs(lat + 8 + 3 * Math.sin(lon * 0.08)) / (1.2 + 1.5 * fbm(nC, px * 8, py * 8, pz * 8))
        const canyon = Math.exp(-d * d) * smoothstep(-100, -88, lon) * (1 - smoothstep(-42, -30, lon))
        c = mixc(c, hex(0x5b2a1c), canyon * 0.75)
        h -= canyon * 1.6
      }
      // Olympus Mons
      const dl = (lon + 134) * Math.cos(18 * DEG), dt = lat - 18
      const r = Math.sqrt(dl * dl + dt * dt) / 9
      if (r < 1.3) {
        h += Math.max(0, 1 - r) * 1.8 - (r < 0.12 ? 0.8 : 0)
        c = mixc(c, hex(0xc77c4c), Math.max(0, 1 - r) * 0.4)
      }
      // polar caps
      const capN = smoothstep(77, 83, lat + (fbm(nC, px * 6, py * 6, pz * 6) - 0.5) * 6)
      const capS = smoothstep(80, 86, -lat + (fbm(nC, px * 6, py * 6, pz * 6) - 0.5) * 6)
      c = mixc(c, hex(0xf2ece6), Math.max(capN, capS))
      return { c, h }
    },
  })
}

// ======================= CLOUDY / GAS WORLDS =======================
jobs.venus = () => {
  const W = 1024, H = 512, n = makeSimplex(404), n2 = makeSimplex(405)
  const col = rgbBuf(W, H)
  each(W, H, (x, y, px, py, pz, lat) => {
    const wx = px + 0.5 * (fbm(n2, px * 2, py * 2, pz * 2, 3) - 0.5)
    const v = fbm(n, wx * 2.2, py * 7 + Math.sin(lat * DEG * 3) * 0.5, pz * 2.2, 6)
    put(col, y * W + x, ramp([[0, hex(0xa86f2f)], [0.45, hex(0xd9a95c)], [0.7, hex(0xf0d49a)], [1, hex(0xfbeccd)]], v))
  })
  save('venus', W, H, col, 3, 3)
}

function gas(name, W, H, { seed, bands, turb = 0.6, stretch = 14, spots = [], streaks = 0 }) {
  const n = makeSimplex(seed), n2 = makeSimplex(seed + 1), n3 = makeSimplex(seed + 2)
  const col = rgbBuf(W, H)
  each(W, H, (x, y, px, py, pz, lat, lon) => {
    const w = (fbm(n2, px * 3, py * 9, pz * 3, 4) - 0.5) * turb * 10 + (fbm(n3, px * 10, py * 30, pz * 10, 3) - 0.5) * turb * 3
    let c = ramp(bands, lat + w)
    const s = fbm(n, px * 4, py * stretch, pz * 4, 5)
    c = mixc(c, mixc(c, [255, 255, 255], 0.5), (s - 0.5) * 0.5)
    c = mixc(c, mixc(c, [0, 0, 0], 0.5), (0.5 - s) * 0.35)
    for (const sp of spots) {
      const dl = ((((lon - sp.lon + 540) % 360) - 180)) * Math.cos(sp.lat * DEG), dt = lat - sp.lat
      const r = Math.sqrt((dl / sp.rx) ** 2 + (dt / sp.ry) ** 2)
      if (r < 1.4) {
        const swirl = fbm(n3, dl * 0.3 + r * 2, dt * 0.3, r, 3)
        const inner = mixc(sp.color, sp.core ?? sp.color, smoothstep(0.7, 0, r))
        c = mixc(c, mixc(inner, [255, 255, 255], (swirl - 0.5) * 0.4), smoothstep(1.1, 0.85, r))
        if (sp.halo) c = mixc(c, sp.halo, Math.max(0, 1 - Math.abs(r - 1.15) / 0.18) * 0.7)
      }
    }
    if (streaks) {
      const st = smoothstep(0.78, 0.92, fbm(n, px * 2, py * 22, pz * 2, 3))
      c = mixc(c, [245, 250, 255], st * streaks)
    }
    put(col, y * W + x, c)
  })
  save(name, W, H, col, 3, 2)
}

jobs.jupiter = () => gas('jupiter', 2048, 1024, {
  seed: 505, turb: 0.55, stretch: 18,
  bands: [
    [-90, hex(0x8f8a86)], [-52, hex(0xa69a8a)], [-44, hex(0xcdb79a)], [-38, hex(0xb38a68)], [-32, hex(0xe6d6bc)], [-26, hex(0xe9dcc6)],
    [-21, hex(0xb5774f)], [-14, hex(0x9c5f3e)], [-8, hex(0xd9b48e)], [-3, hex(0xeedfc5)], [3, hex(0xe8cfa4)], [8, hex(0xc99a6c)],
    [12, hex(0x95593a)], [18, hex(0xa96c47)], [21, hex(0xe9dbc3)], [26, hex(0xb98a64)], [31, hex(0xdfcdb2)], [38, hex(0xc8ac8c)],
    [46, hex(0xa89884)], [90, hex(0x8b8783)],
  ],
  spots: [
    { lat: -22, lon: 30, rx: 12, ry: 6, color: hex(0xc0603b), core: hex(0xd98a5e), halo: hex(0xf1e4cf) },
    { lat: -33, lon: 75, rx: 3, ry: 2, color: hex(0xf6efe4) },
    { lat: -33, lon: 110, rx: 2.5, ry: 1.8, color: hex(0xf6efe4) },
    { lat: -33, lon: -40, rx: 2.8, ry: 1.9, color: hex(0xf3ebdf) },
  ],
})

jobs.saturn = () => gas('saturn', 2048, 1024, {
  seed: 606, turb: 0.25, stretch: 26,
  bands: [
    [-90, hex(0x9b8b6c)], [-60, hex(0xb6a27c)], [-40, hex(0xd7c296)], [-25, hex(0xe3cf9f)], [-12, hex(0xd9bf8a)], [-4, hex(0xefdcae)],
    [4, hex(0xeed9a8)], [12, hex(0xd2b580)], [22, hex(0xe0c896)], [32, hex(0xcdb282)], [45, hex(0xc4ab7e)], [62, hex(0xa9967a)], [90, hex(0x8a8a90)],
  ],
})

jobs.uranus = () => gas('uranus', 1024, 512, {
  seed: 707, turb: 0.15, stretch: 10,
  bands: [[-90, hex(0xb7e6ea)], [-40, hex(0x9fd8de)], [-10, hex(0x93d0d8)], [10, hex(0x96d2da)], [40, hex(0xa3dbe0)], [90, hex(0xc4eef0)]],
})

jobs.neptune = () => gas('neptune', 2048, 1024, {
  seed: 808, turb: 0.35, stretch: 16, streaks: 0.55,
  bands: [[-90, hex(0x2b4fa8)], [-55, hex(0x3a64c4)], [-30, hex(0x3058bd)], [-10, hex(0x4573d6)], [10, hex(0x3d6bd0)], [35, hex(0x3560c6)], [90, hex(0x2c50aa)]],
  spots: [{ lat: -22, lon: -20, rx: 9, ry: 5, color: hex(0x172f7a), core: hex(0x10225e), halo: hex(0xd8e4ff) }],
})

// ======================= MOONS =======================
jobs.moons = () => {
  const S = [512, 256]
  rocky('io', ...S, {
    seed: 1001, base: hex(0xe0c35a), light: hex(0xf4e7a3), dark: hex(0xb3772d), craterScales: [[6, 0.15]], craterDensity: 0.2,
    extra: (px, py, pz, lat, lon, c) => {
      const v = craters(px, py, pz, 4, 77, 0.25)
      if (v < -0.5) return { c: mixc(c, hex(0x2a1a10), 0.8) }
      if (v > 0.05) return { c: mixc(c, hex(0xc4552d), 0.5) }
    },
  })
  const nE = makeSimplex(1201)
  rocky('europa', ...S, {
    seed: 1002, base: hex(0xd6c8b2), light: hex(0xf1e9dc), dark: hex(0xa8957c), craterScales: [[10, 0.05]], craterDensity: 0.1,
    extra: (px, py, pz, lat, lon, c) => ({ c: mixc(c, hex(0x8a5a3c), smoothstep(0.9, 0.98, ridged(nE, px * 4, py * 4, pz * 4, 3)) * 0.8) }),
  })
  rocky('ganymede', ...S, { seed: 1003, base: hex(0x8f8070), light: hex(0xc2b5a3), dark: hex(0x5d5247), craterScales: [[5, 0.4], [12, 0.25]], craterDensity: 0.45 })
  rocky('callisto', ...S, { seed: 1004, base: hex(0x5e5246), light: hex(0x9b8f80), dark: hex(0x3c342c), craterScales: [[6, 0.5], [14, 0.4], [30, 0.3]], craterDensity: 0.8 })
  rocky('titan', ...S, { seed: 1005, base: hex(0xcf9a4c), light: hex(0xe3b56a), dark: hex(0xb07a37), craterScales: [[4, 0.02]], craterDensity: 0.05 })
  rocky('triton', ...S, { seed: 1006, base: hex(0xd3bcb3), light: hex(0xefe2db), dark: hex(0x9e8a86), craterScales: [[8, 0.15]], craterDensity: 0.3 })
  rocky('rockmoon', ...S, { seed: 1007, base: hex(0x726a62), light: hex(0x9a9188), dark: hex(0x4a4540), craterScales: [[3, 0.8], [8, 0.5]], craterDensity: 0.7 })
}

// ======================= MILKY WAY SKY =======================
jobs.sky = () => {
  const W = 4096, H = 2048, n = makeSimplex(4242), n2 = makeSimplex(4343)
  const col = rgbBuf(W, H)
  const N = normalize([0.12, 0.86, 0.5])
  let core = normalize([0.95, 0.12, -0.28])
  const d = dot(core, N); core = normalize([core[0] - d * N[0], core[1] - d * N[1], core[2] - d * N[2]])
  const rnd = mulberry32(99)
  each(W, H, (x, y, px, py, pz) => {
    const b = Math.asin(px * N[0] + py * N[1] + pz * N[2])
    const ang = Math.acos(Math.max(-1, Math.min(1, px * core[0] + py * core[1] + pz * core[2])))
    const coreW = Math.exp(-((ang / 0.75) ** 2))
    const width = 0.17 + 0.14 * coreW + (fbm(n, px * 2, py * 2, pz * 2, 3) - 0.5) * 0.12
    let band = Math.exp(-((b / width) ** 2)) * (0.3 + 0.9 * coreW) + Math.exp(-((b / (width * 2.6)) ** 2)) * 0.12
    const cl = fbm(n, px * 5, py * 5, pz * 5, 6)
    band *= 0.45 + 0.9 * cl
    const dust = smoothstep(0.45, 0.75, fbm(n2, px * 4, py * 9, pz * 4, 5)) * Math.exp(-((b / (0.06 + 0.06 * coreW)) ** 2))
    band *= 1 - dust * 0.7
    let c = mixc(hex(0x8ea2e0), hex(0xffd8a8), coreW)
    c = [c[0] * band * 0.55, c[1] * band * 0.55, c[2] * band * 0.55]
    // faint nebula colour patches
    const neb = smoothstep(0.62, 0.8, fbm(n2, px * 2.2 + 3, py * 2.2, pz * 2.2, 4)) * 0.12
    c = [c[0] + 60 * neb, c[1] + 20 * neb, c[2] + 70 * neb]
    // dust of tiny stars
    if (rnd() < 0.004 + 0.02 * band) { const s = 40 + rnd() * 120; c = [c[0] + s, c[1] + s, c[2] + s * 1.05] }
    put(col, y * W + x, c)
  })
  save('sky', W, H, col, 3, 3)
}
function normalize(v) { const l = Math.hypot(...v); return v.map((a) => a / l) }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] }

for (const [k, fn] of Object.entries(jobs)) {
  if (only.length && !only.includes(k)) continue
  const t = Date.now()
  fn()
  console.log(k, ((Date.now() - t) / 1000).toFixed(1) + 's')
}
rmSync(TMP, { recursive: true, force: true })
