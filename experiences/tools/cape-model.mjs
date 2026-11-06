// Terrain and land cover model for the Cape Town flyover.
// Coastlines come from Natural Earth (public domain). Heights are MODELLED from known peaks and ranges
// (positions and heights of the main mountains), not survey data, so treat them as a good likeness, not a map.
import { makeSimplex, fbm, ridged, clamp01, smoothstep, lerp, mixc, hex } from './noise.mjs'

const KX = 92.3, KY = 110.9 // km per degree of longitude / latitude around 34°S
const n1 = makeSimplex(71), n2 = makeSimplex(72), n3 = makeSimplex(73)

// ---------- features (lat, lon) ----------
const MESAS = [
  { c: [-33.9575, 18.4060], len: 1.75, wid: 0.72, ang: 15, h: 1060, p: 7 }, // Table Mountain (front table)
  { c: [-33.9800, 18.4080], len: 1.3, wid: 1.7, ang: 80, h: 720, p: 2.2, soft: true }, // Back Table (gentler, lower)
]
const CONES = [
  { c: [-33.9530, 18.4310], r: 1.15, h: 1000, k: 1.5 }, // Devil's Peak
  { c: [-33.9351, 18.3890], r: 0.55, h: 669, k: 1.4 }, // Lion's Head
  { c: [-34.0550, 18.3850], r: 2.0, h: 928, k: 1.6 }, // Constantiaberg
  { c: [-34.2250, 18.4300], r: 1.5, h: 678, k: 1.6 }, // Swartkop
  { c: [-34.0300, 18.3300], r: 1.4, h: 650, k: 1.5 }, // Karbonkelberg
  { c: [-34.0350, 18.8750], r: 2.0, h: 1137, k: 1.6 }, // Helderberg
  { c: [-33.8650, 18.9250], r: 2.4, h: 1390, k: 1.6 }, // Simonsberg
  { c: [-33.7350, 18.9450], r: 2.6, h: 650, k: 2.2 }, // Paarl Mountain
  { c: [-33.8750, 18.6000], r: 4.0, h: 410, k: 2.4 }, // Tygerberg
  { c: [-33.5850, 18.8200], r: 3.0, h: 600, k: 2.0 }, // Paardeberg
  { c: [-33.6400, 18.8700], r: 2.5, h: 500, k: 2.0 }, // Perdeberg
  { c: [-33.9200, 19.1700], r: 3.2, h: 1500, k: 1.6 }, // Franschhoek peaks
  { c: [-34.1600, 19.0500], r: 3.0, h: 1100, k: 1.8 }, // Groenland
  { c: [-33.6000, 19.1000], r: 4.0, h: 1300, k: 1.8 }, // Limietberg
  { c: [-34.3550, 18.4970], r: 0.6, h: 240, k: 1.4 }, // Cape Point
]
const RIDGES = [
  { pts: [[-33.928, 18.390], [-33.917, 18.398]], w: 0.5, h: 350 }, // Signal Hill
  { pts: [[-33.958, 18.393], [-33.985, 18.378], [-34.012, 18.370]], w: 0.65, h: 760 }, // Twelve Apostles
  { pts: [[-34.030, 18.400], [-34.045, 18.395]], w: 0.8, h: 600 }, // Vlakkenberg
  { pts: [[-34.075, 18.363], [-34.102, 18.380]], w: 0.8, h: 590 }, // Chapman's Peak
  { pts: [[-34.085, 18.415], [-34.110, 18.445]], w: 1.1, h: 520 }, // Silvermine
  { pts: [[-34.140, 18.415], [-34.200, 18.410], [-34.260, 18.440], [-34.330, 18.470], [-34.352, 18.490]], w: 1.0, h: 380 }, // southern Peninsula
  { pts: [[-33.830, 18.620], [-33.780, 18.600]], w: 2.0, h: 300 }, // Durbanville hills
  { pts: [[-34.115, 18.895], [-34.070, 18.970], [-34.020, 19.030], [-33.960, 19.080]], w: 2.2, h: 1400 }, // Hottentots Holland
  { pts: [[-33.975, 18.980], [-33.940, 19.050]], w: 1.8, h: 1450 }, // Jonkershoek
  { pts: [[-33.900, 19.070], [-33.800, 19.085], [-33.700, 19.100], [-33.550, 19.120]], w: 2.6, h: 1450 }, // Drakenstein
  { pts: [[-34.330, 18.880], [-34.270, 18.950], [-34.220, 19.020]], w: 2.2, h: 1000 }, // Kogelberg
]
// regional ranges (for the zoomed-out region map), widths in km
const RANGES = [
  { pts: [[-32.0, 19.0], [-32.35, 19.15], [-32.7, 19.25]], w: 9, h: 1500 }, // Cederberg
  { pts: [[-33.0, 19.0], [-33.2, 19.15], [-33.4, 19.5], [-33.3, 19.85]], w: 7, h: 1600 }, // Winterhoek, Hex River
  { pts: [[-33.85, 19.9], [-33.9, 20.8], [-33.95, 21.6]], w: 5, h: 1300 }, // Langeberg
  { pts: [[-33.35, 21.5], [-33.35, 22.3], [-33.42, 23.0]], w: 6, h: 1800 }, // Swartberg
  { pts: [[-33.92, 22.0], [-33.86, 22.8], [-33.8, 23.4], [-33.9, 24.3]], w: 5, h: 1200 }, // Outeniqua, Tsitsikamma
  { pts: [[-34.15, 18.85], [-34.0, 19.0], [-33.8, 19.1], [-33.6, 19.15]], w: 5, h: 1400 }, // Boland
  { pts: [[-33.65, 19.3], [-33.75, 19.45]], w: 5, h: 1200 }, // Du Toit's
  { pts: [[-34.3, 19.3], [-34.2, 19.6], [-34.05, 19.9]], w: 4, h: 900 }, // Overberg hills
  { pts: [[-33.6, 23.6], [-33.55, 24.5], [-33.5, 25.3]], w: 6, h: 1300 }, // Baviaanskloof / Kouga
]

// urban areas (lon, lat polygons)
const URBAN = [
  [[18.395, -33.905], [18.430, -33.905], [18.455, -33.925], [18.445, -33.940], [18.410, -33.935], [18.395, -33.920]], // City Bowl
  [[18.372, -33.912], [18.396, -33.905], [18.386, -33.950], [18.372, -33.972], [18.362, -33.960]], // Atlantic seaboard
  [[18.455, -33.930], [18.500, -33.930], [18.500, -34.060], [18.462, -34.080], [18.440, -34.030], [18.447, -33.970]], // southern suburbs
  [[18.500, -33.880], [18.720, -33.830], [18.780, -33.920], [18.730, -34.080], [18.620, -34.080], [18.480, -34.100], [18.500, -33.950]], // Cape Flats
  [[18.470, -33.890], [18.500, -33.750], [18.560, -33.760], [18.570, -33.860], [18.520, -33.900]], // Milnerton, Table View
  [[18.570, -33.860], [18.660, -33.830], [18.680, -33.900], [18.600, -33.920]], // Bellville
  [[18.800, -34.030], [18.870, -34.060], [18.860, -34.120], [18.800, -34.100]], // Somerset West, Strand
  [[18.410, -34.125], [18.445, -34.130], [18.442, -34.200], [18.428, -34.200]], // Fish Hoek, Simon's Town
  [[18.840, -33.920], [18.890, -33.920], [18.890, -33.955], [18.840, -33.955]], // Stellenbosch
  [[18.940, -33.700], [18.985, -33.700], [18.985, -33.780], [18.945, -33.780]], // Paarl
  [[18.470, -33.550], [18.510, -33.550], [18.510, -33.590], [18.470, -33.590]], // Atlantis
  [[18.345, -34.030], [18.370, -34.030], [18.370, -34.055], [18.345, -34.055]], // Hout Bay
]
const DENSE = [[[18.55, -33.98], [18.72, -33.98], [18.72, -34.07], [18.55, -34.07]]] // Mitchells Plain, Khayelitsha

function inPoly(lon, lat, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
function segKm(lat, lon, a, b) {
  const ax = a[1] * KX, ay = a[0] * KY, bx = b[1] * KX, by = b[0] * KY, px = lon * KX, py = lat * KY
  const dx = bx - ax, dy = by - ay
  const t = clamp01(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1))
  const ex = px - ax - t * dx, ey = py - ay - t * dy
  return Math.sqrt(ex * ex + ey * ey)
}
function lineKm(lat, lon, pts) {
  let d = 1e9
  for (let i = 0; i + 1 < pts.length; i++) d = Math.min(d, segKm(lat, lon, pts[i], pts[i + 1]))
  return d
}

/** Height of the dry interior plateau (Karoo, Great Escarpment), with ragged edges. */
export function plateauBase(lat, lon) {
  const X = lon * KX, Y = lat * KY
  const wl = lon + 2.2 * (fbm(n2, X * 0.012, Y * 0.012, 11, 4) - 0.5), wt = lat + 1.6 * (fbm(n2, X * 0.012 + 5, Y * 0.012, 13, 4) - 0.5)
  const karoo = smoothstep(19.4, 20.4, wl) * smoothstep(-33.75, -32.9, wt)
  return karoo * 750 + smoothstep(-32.6, -32.1, wt) * smoothstep(19.6, 20.6, wl) * 600
}

/** Islands too small for the world coastline data. */
export function extraLand(lat, lon) {
  const d = ((lon - 18.366) / 0.017) ** 2 + ((lat + 33.806) / 0.0155) ** 2 // Robben Island
  return d < 1 ? 1 : 0
}

/** Height in metres at a point, given how much of it is land (0..1) and how far inland it is (0..1). */
/** detail: extra close-up sculpting (cliff gullies, buttresses, crags) for the low helicopter view. */
export function capeHeight(lat, lon, land, inland, detail = false) {
  if (land <= 0) return 0
  const X = lon * KX, Y = lat * KY
  let h = 0, mount = 0, mesa = 0
  for (const m of MESAS) {
    const dx = (lon - m.c[1]) * KX, dy = (lat - m.c[0]) * KY
    const a = (m.ang * Math.PI) / 180
    const u = dx * Math.cos(a) + dy * Math.sin(a), v = -dx * Math.sin(a) + dy * Math.cos(a)
    let r = Math.pow(Math.pow(Math.abs(u) / m.len, m.p) + Math.pow(Math.abs(v) / m.wid, m.p), 1 / m.p)
    if (detail && !m.soft) {
      // a ragged rim: buttresses and gorges (like Platteklip) cut into the cliffs, and a wavy edge
      const ang = Math.atan2(v / m.wid, u / m.len)
      r += 0.07 * (fbm(n2, Math.cos(ang) * 4 + 3, Math.sin(ang) * 4, 5, 4) - 0.5)
      r += 0.09 * Math.pow(Math.abs(Math.sin(ang * 13 + 3 * fbm(n3, Math.cos(ang) * 2, Math.sin(ang) * 2, 9, 3))), 14)
      const top = m.h * (0.985 + 0.03 * fbm(n2, X * 2, Y * 2, 0, 3)) * (1 - smoothstep(0.985, 1.0, r))
      // sheer cliffs from the rim down to the top of the slopes, then steep, gullied fynbos slopes
      const cliffBase = m.h * 0.7
      const cliff = r < 1.12 ? cliffBase + (m.h - cliffBase) * smoothstep(1.12, 0.99, r) * (0.92 + 0.08 * ridged(n1, X * 8, Y * 8, 2, 3)) : 0
      const gully = ridged(n1, Math.cos(ang) * 18, Math.sin(ang) * 18 + r * 2.5, 4, 4)
      const slope = cliffBase * Math.exp(-Math.max(0, r - 1.08) * 2.2) * (0.92 + 0.12 * gully) * smoothstep(0.9, 1.1, r)
      h = Math.max(h, top, cliff, slope)
    } else {
      const top = m.h * (1 - (m.soft ? smoothstep(0.6, 1.5, r) : smoothstep(0.93, 1.22, r))) * (0.985 + 0.03 * fbm(n2, X * 2, Y * 2, 0, 3))
      const apron = m.h * 0.62 * Math.exp(-Math.max(0, r - 1) * 2.4) * smoothstep(0.9, 1.15, r)
      h = Math.max(h, top, apron)
    }
    mesa = Math.max(mesa, 1 - smoothstep(0.95, 1.3, r))
  }
  const wob = 1 + 0.45 * (fbm(n3, X * 0.35, Y * 0.35, 17, 3) - 0.5)
  for (const c of CONES) {
    const d = (Math.hypot((lon - c.c[1]) * KX, (lat - c.c[0]) * KY) / c.r) * wob
    if (d < 6) {
      let ch = c.h * Math.exp(-Math.pow(d, c.k))
      if (detail) {
        // rocky summit domes (Lion's Head's granite-and-sandstone top) and gullied flanks
        ch += c.h * 0.12 * smoothstep(0.42, 0.18, d) * (0.8 + 0.2 * ridged(n1, X * 6, Y * 6, 6, 3))
        ch *= 0.9 + 0.14 * ridged(n3, Math.atan2(lat - c.c[0], lon - c.c[1]) * 7, d * 3, 8, 4)
      }
      h = Math.max(h, ch)
    }
  }
  for (const r of RIDGES) {
    const d = (lineKm(lat, lon, r.pts) / r.w) * wob
    if (d >= 6) continue
    if (r.w >= 1.8) {
      // big ranges: a broad massif cut by valleys and gorges
      const body = smoothstep(1.9, 0.25, d)
      const folds = ridged(n1, X * 0.32, Y * 0.32, 3, 4)
      h = Math.max(h, r.h * body * (0.3 + 0.75 * folds * folds))
    } else h = Math.max(h, r.h * Math.exp(-d * d) * (0.65 + 0.45 * ridged(n1, X * 0.5, Y * 0.5, 3, 4)))
  }
  for (const r of RANGES) {
    const d = (lineKm(lat, lon, r.pts) / r.w) * (1 + 0.9 * (fbm(n3, X * 0.05, Y * 0.05, 19, 3) - 0.5))
    if (d < 5) {
      const folds = ridged(n1, X * 0.1, Y * 0.1, 5, 5)
      h = Math.max(h, r.h * smoothstep(2.2, 0.3, d) * (0.2 + 0.85 * folds * folds))
    }
  }
  mount = smoothstep(220, 700, h)
  // crags and gullies on the mountains
  h *= 1 + mount * (1 - mesa) * 0.18 * (ridged(n3, X * 1.4, Y * 1.4, 1, 4) - 0.5) // flat summit stays flat
  if (detail) h += smoothstep(120, 500, h) * (1 - mesa) * 28 * (ridged(n2, X * 5, Y * 5, 12, 4) - 0.5) // crags and boulders
  // rolling lowlands: Cape Flats almost flat, higher inland and in the Karoo
  const flats = Math.exp(-(((lon - 18.62) / 0.16) ** 2 + ((lat + 34.0) / 0.1) ** 2))
  const plateau = plateauBase(lat, lon)
  const rolling = (25 + 160 * fbm(n2, X * 0.06, Y * 0.06, 9, 5) * smoothstep(0.0, 0.6, inland)) * (1 - 0.85 * flats) + plateau
  h = Math.max(h, rolling) + 18 * fbm(n1, X * 0.8, Y * 0.8, 2, 3)
  return Math.max(2, h) * smoothstep(0.0, 0.5, land)
}

const C = {
  veld: hex(0x7c7d61), veld2: hex(0x8f8c6e), veldDark: hex(0x5d6248), sand: hex(0xb8b096), dune: hex(0xd3c9ad), beach: hex(0xe3d8bb),
  fynbos: hex(0x4f5640), fynbosDry: hex(0x666750), rock: hex(0x8a857a), cliff: hex(0xa7a196), gully: hex(0x3b4233),
  urban: hex(0x8d8a84), urbanDark: hex(0x77746e), urbanLight: hex(0xa29e94), leafy: hex(0x66704f), dense: hex(0x8b8278),
  wheat: hex(0xb7a67f), plough: hex(0x9a8768), green: hex(0x7c8354), vine: hex(0x6d774b), dam: hex(0x2f4a5a),
  karoo: hex(0x9c8a6f), karooDark: hex(0x6a5c4b), karooLight: hex(0xb3a184), namaqua: hex(0xb1a389), forest: hex(0x3e5735), grass: hex(0x7a7957),
  deep: hex(0x0a2a52), mid: hex(0x114479), shore: hex(0x1a6688), shallow: hex(0x2f8c9c),
}
function hash2(x, y) { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295 }
const ell = (lon, lat, clon, clat, rlon, rlat) => Math.exp(-(((lon - clon) / rlon) ** 2 + ((lat - clat) / rlat) ** 2))

/** Colour of the ground. coast: 0 open sea .. 1 deep inland; nearShore: ~1 right at the shoreline. fine: detail scale. */
export function capeColor(lat, lon, land, h, slope, coast, nearShore, fine = 1) {
  const X = lon * KX, Y = lat * KY
  const det = fbm(n1, X * 1.6 * fine, Y * 1.6 * fine, 4, 4)
  const det2 = fbm(n3, X * 7 * fine, Y * 7 * fine, 6, 3)
  // ---- sea ----
  let sea = mixc(C.deep, C.mid, smoothstep(0.0, 0.35, coast))
  sea = mixc(sea, C.shore, smoothstep(0.3, 0.48, coast))
  const falseBay = ell(lon, lat, 18.6, -34.08, 0.25, 0.07)
  sea = mixc(sea, C.shallow, smoothstep(0.4, 0.5, coast) * (0.35 + 0.5 * falseBay))
  sea = mixc(sea, C.shallow, smoothstep(0.2, 0.9, nearShore) * 0.5) // fine shallows right at the shore
  sea = mixc(sea, mixc(sea, [255, 255, 255], 0.25), smoothstep(0.75, 0.98, nearShore) * 0.6) // surf line
  sea = mixc(sea, mixc(sea, [0, 0, 0], 0.12), (fbm(n2, X * 0.5, Y * 0.5, 7, 3) - 0.5) * 0.6)
  if (land <= 0.001) return sea

  // zone edges wobble with noise so nothing looks drawn with a ruler
  const wl = lon + 2.2 * (fbm(n2, X * 0.012, Y * 0.012, 11, 4) - 0.5), wt = lat + 1.6 * (fbm(n2, X * 0.012 + 5, Y * 0.012, 13, 4) - 0.5)
  const karoo = smoothstep(19.4, 20.4, wl) * smoothstep(-33.75, -32.9, wt)
  const namaqua = smoothstep(-32.5, -31.5, wt) * (1 - smoothstep(19.4, 20.4, wl))
  const garden = smoothstep(22.0, 22.8, wl) * (1 - smoothstep(-33.9, -33.6, wt)) * (1 - karoo)
  const east = smoothstep(24.0, 25.5, wl) * (1 - karoo)
  const flats = ell(wl, wt, 18.62, -34.0, 0.17, 0.08)
  const relief = h - plateauBase(lat, lon)
  const mount = smoothstep(220, 820, relief)

  // natural lowland vegetation: grey-green fynbos and renosterveld, sandier on the Cape Flats
  let g = mixc(C.veld, C.veld2, det)
  g = mixc(g, C.veldDark, smoothstep(0.55, 0.75, fbm(n2, X * 0.9 * fine, Y * 0.9 * fine, 2, 3)) * 0.6)
  g = mixc(g, mixc(C.sand, C.dune, det2), flats * 0.75)

  // farmland: Swartland wheat, Winelands vineyards, Overberg fields
  const ag = Math.max(
    smoothstep(-33.86, -33.76, wt) * smoothstep(18.48, 18.62, wl) * (1 - smoothstep(19.05, 19.2, wl)) * (1 - namaqua),
    smoothstep(18.7, 18.8, wl) * (1 - smoothstep(19.12, 19.22, wl)) * smoothstep(-34.06, -33.98, wt) * (1 - smoothstep(-33.62, -33.55, wt)),
    smoothstep(19.25, 19.5, wl) * (1 - smoothstep(-34.35, -34.15, wt)) * (1 - karoo),
    (1 - smoothstep(-33.3, -32.7, wt)) * smoothstep(18.35, 18.6, wl) * (1 - karoo) * (1 - smoothstep(19.4, 19.6, wl)) * 0.9,
  ) * (1 - mount) * (1 - flats * 0.8)
  if (ag > 0.02) {
    // irregular fields: nearest of jittered points (Voronoi), about 0.9 km across
    const fs = 0.9
    const vx = X / fs, vy = Y / fs
    const cx = Math.floor(vx), cy = Math.floor(vy)
    let d1 = 9, d2 = 9, id = 0, ang = 0
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const gx = cx + i, gy = cy + j
      const px = gx + hash2(gx, gy), py = gy + hash2(gx + 71, gy + 13)
      const d = (vx - px) ** 2 + (vy - py) ** 2
      if (d < d1) { d2 = d1; d1 = d; id = hash2(gx + 7, gy + 3); ang = hash2(gx + 5, gy + 11) * Math.PI }
      else if (d < d2) d2 = d
    }
    const vineZone = smoothstep(18.72, 18.82, wl) * (1 - smoothstep(-33.65, -33.58, wt))
    const shade = [C.wheat, mixc(C.wheat, C.plough, 0.3), mixc(C.wheat, [200, 186, 148], 0.4), mixc(C.wheat, C.plough, 0.6)]
    let fc = id < 0.08 + 0.4 * vineZone ? C.vine : id < 0.18 ? mixc(C.green, C.wheat, 0.35) : shade[Math.floor(((id - 0.18) / 0.82) * 4) % 4]
    const rowsDir = Math.cos(ang) * vx + Math.sin(ang) * vy
    fc = mixc(fc, mixc(fc, [0, 0, 0], 0.25), (Math.sin(rowsDir * (fc === C.vine ? 120 : 45)) * 0.5 + 0.5) * 0.1) // crop rows
    fc = mixc(fc, mixc(fc, [0, 0, 0], 0.2), smoothstep(0.04, 0.0, Math.sqrt(d2) - Math.sqrt(d1)) * 0.6) // field edges
    fc = mixc(fc, g, smoothstep(0.56, 0.72, fbm(n3, X * 0.12, Y * 0.12, 4, 3)) * 0.85) // natural veld between farms
    if (id > 0.996 && d1 < 0.08) fc = C.dam // the odd farm dam
    g = mixc(g, mixc(fc, g, 0.12), ag)
  }
  // dry interior and other regions
  let kc = mixc(C.karoo, C.karooLight, smoothstep(0.35, 0.7, fbm(n3, X * 0.03, Y * 0.03, 2, 5)))
  kc = mixc(kc, C.karooDark, smoothstep(0.55, 0.75, fbm(n1, X * 0.015, Y * 0.015, 8, 4)) * 0.5)
  kc = mixc(kc, C.karooDark, smoothstep(0.62, 0.82, ridged(n1, X * 0.18, Y * 0.18, 7, 4)) * 0.8) // dolerite koppies
  kc = mixc(kc, C.karooLight, smoothstep(0.92, 0.98, ridged(n2, X * 0.05, Y * 0.05, 3, 3)) * 0.6) // dry riverbeds
  g = mixc(g, kc, karoo)
  g = mixc(g, mixc(C.namaqua, C.karooLight, det), namaqua)
  g = mixc(g, mixc(C.forest, C.green, det * 0.5), garden * 0.8)
  g = mixc(g, mixc(C.grass, C.veld, det), east * 0.7)

  // mountains: fynbos, rock and pale sandstone cliffs
  let m = mixc(C.fynbos, C.fynbosDry, det)
  m = mixc(m, C.gully, smoothstep(0.4, 0.2, det2) * 0.5)
  m = mixc(m, C.rock, Math.min(1, smoothstep(700, 1100, h) * 0.55 + smoothstep(0.5, 0.95, slope) * 0.5))
  m = mixc(m, C.cliff, smoothstep(0.8, 1.2, slope) * 0.75)
  m = mixc(m, mixc(C.karooDark, C.rock, det), karoo * 0.6)
  g = mixc(g, m, mount)

  // towns and cities, with ragged edges, parks and busy streets
  const low = 1 - smoothstep(120, 260, h)
  if (low > 0) {
    const ulon = lon + 0.022 * (fbm(n2, X * 0.35, Y * 0.35, 21, 4) - 0.5), ulat = lat + 0.018 * (fbm(n2, X * 0.35, Y * 0.35, 23, 4) - 0.5)
    let u = 0
    for (let k = 0; k < URBAN.length; k++) if (inPoly(ulon, ulat, URBAN[k])) { u = 1; break }
    if (u && fbm(n3, X * 0.4, Y * 0.4, 41, 3) > 0.68) u = 0 // open spaces, wetlands and reserves inside the city
    if (u) {
      const bx = Math.floor(X / 0.12), by = Math.floor(Y / 0.1)
      const blk = hash2(bx, by)
      let uc = blk < 0.4 ? C.urban : blk < 0.65 ? C.urbanDark : C.urbanLight
      const leafy = inPoly(ulon, ulat, URBAN[2]) ? 0.5 : 0.15
      uc = mixc(uc, C.leafy, leafy * smoothstep(0.35, 0.7, det2))
      uc = mixc(uc, C.leafy, smoothstep(0.7, 0.8, fbm(n3, X * 0.8, Y * 0.8, 31, 3)) * 0.8) // parks
      for (const d of DENSE) if (inPoly(ulon, ulat, d)) uc = mixc(uc, C.dense, 0.55)
      const street = Math.min((X / 0.12) % 1, (Y / 0.1) % 1)
      uc = mixc(uc, C.urbanDark, smoothstep(0.1, 0.0, street) * 0.25)
      g = mixc(g, uc, low * 0.92)
    }
  }
  // beaches right at the shore
  g = mixc(g, C.beach, smoothstep(0.55, 0.9, nearShore) * (1 - smoothstep(8, 35, h)))
  g = mixc(g, mixc(g, [0, 0, 0], 0.25), (0.5 - det2) * 0.3)
  return mixc(sea, g, smoothstep(0.0, 0.5, land))
}
