// Builds the data for the helicopter view over Green Point, Sea Point and the City Bowl (kelp-forest opening).
//  - coastline: City of Cape Town boundary from Who's On First (Municipal Demarcation Board geometry), tools/data
//  - heights: MODELLED from the main peaks (tools/cape-model.mjs), not survey data
//  - streets, lots and buildings: procedural, laid out on the City Bowl / Sea Point street direction
// Outputs public/textures/cape-close/: color.jpg, normal.jpg (object space), h.bin (mesh heights),
// shore.jpg (signed distance to the coast) and buildings.bin.
import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeSimplex, fbm, ridged, clamp01, smoothstep, lerp, mixc, hex } from './noise.mjs'
import { capeHeight } from './cape-model.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '..', 'public', 'textures', 'cape-close')
const TMP = join(here, '.tmp')
mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })

// ---- frame: metres, x east, z south, origin at Mouille Point ----
export const B = { lon0: 18.33, lon1: 18.52, lat0: -34.0, lat1: -33.86 }
const O = { lon: 18.405, lat: -33.9 }
const MX = 92300, MZ = 110900
const X0 = (B.lon0 - O.lon) * MX, X1 = (B.lon1 - O.lon) * MX
const Z0 = -(B.lat1 - O.lat) * MZ, Z1 = -(B.lat0 - O.lat) * MZ
const lonOf = (x) => O.lon + x / MX, latOf = (z) => O.lat - z / MZ

function save(name, w, h, data, channels = 3, quality = 3) {
  const header = Buffer.from(`${channels === 3 ? 'P6' : 'P5'}\n${w} ${h}\n255\n`)
  const tmp = join(TMP, name + (channels === 3 ? '.ppm' : '.pgm'))
  writeFileSync(tmp, Buffer.concat([header, Buffer.from(data.buffer, data.byteOffset, data.byteLength)]))
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tmp, '-q:v', String(quality), join(OUT, name + '.jpg')])
  rmSync(tmp)
}
const n1 = makeSimplex(301), n2 = makeSimplex(302), n3 = makeSimplex(303)
function hash2(x, y) { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295 }

// ---- analysis grid ----
const AW = 2048, AH = Math.round((AW * (Z1 - Z0)) / (X1 - X0))
const PX = (X1 - X0) / AW // metres per analysis pixel
const ax = (i) => X0 + (i + 0.5) * PX, az = (j) => Z0 + (j + 0.5) * PX
console.log('analysis grid', AW, AH, PX.toFixed(2), 'm/px')

// land mask (2x2 supersampled scanline fill of the coastline polygons)
const geo = JSON.parse(readFileSync(join(here, 'data', 'cape-coast.geojson'), 'utf8'))
const edges = []
for (const poly of geo.geometry.coordinates) for (const ring of poly) for (let k = 0; k + 1 < ring.length; k++) {
  const a = ring[k], b = ring[k + 1]
  edges.push([(a[0] - O.lon) * MX, -(a[1] - O.lat) * MZ, (b[0] - O.lon) * MX, -(b[1] - O.lat) * MZ])
}
const land = new Float32Array(AW * AH)
for (let j = 0; j < AH; j++) for (const sub of [0.25, 0.75]) {
  const z = Z0 + (j + sub) * PX
  const xs = []
  for (const [xa, za, xb, zb] of edges) if ((za > z) !== (zb > z)) xs.push(xa + ((z - za) / (zb - za)) * (xb - xa))
  xs.sort((a, b) => a - b)
  for (let k = 0; k + 1 < xs.length; k += 2) {
    for (const sx of [0.25, 0.75]) {
      const i0 = Math.max(0, Math.ceil((xs[k] - X0) / PX - sx)), i1 = Math.min(AW - 1, Math.floor((xs[k + 1] - X0) / PX - sx))
      for (let i = i0; i <= i1; i++) land[j * AW + i] += 0.25
    }
  }
}
const isLand = (i) => land[i] >= 0.5

// signed distance to the coast in metres (two-pass chamfer): + out to sea, - inland
function chamfer(inside) {
  const D = new Float32Array(AW * AH).fill(1e9)
  for (let i = 0; i < AW * AH; i++) if (inside(i)) D[i] = 0
  const a = PX, b = PX * Math.SQRT2
  for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) {
    const k = j * AW + i
    let d = D[k]
    if (i > 0) d = Math.min(d, D[k - 1] + a)
    if (j > 0) { d = Math.min(d, D[k - AW] + a); if (i > 0) d = Math.min(d, D[k - AW - 1] + b); if (i < AW - 1) d = Math.min(d, D[k - AW + 1] + b) }
    D[k] = d
  }
  for (let j = AH - 1; j >= 0; j--) for (let i = AW - 1; i >= 0; i--) {
    const k = j * AW + i
    let d = D[k]
    if (i < AW - 1) d = Math.min(d, D[k + 1] + a)
    if (j < AH - 1) { d = Math.min(d, D[k + AW] + a); if (i < AW - 1) d = Math.min(d, D[k + AW + 1] + b); if (i > 0) d = Math.min(d, D[k + AW - 1] + b) }
    D[k] = d
  }
  return D
}
const seaDist = chamfer(isLand) // distance from land (0 on land)
const landDist = chamfer((i) => !isLand(i)) // distance from sea (0 at sea)
const sdist = (i) => (isLand(i) ? -landDist[i] : seaDist[i])

// ---- heights ----
const H = new Float32Array(AW * AH)
for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) {
  const k = j * AW + i
  const lat = latOf(az(j)), lon = lonOf(ax(i))
  if (!isLand(k)) { H[k] = -(4 + Math.min(40, seaDist[k] * 0.035)); continue }
  let h = capeHeight(lat, lon, 1, clamp01(landDist[k] / 4500), true)
  // the shore itself is low: promenades, rocks and beaches, a few metres above the sea
  h = 2 + (h - 2) * (0.3 + 0.7 * smoothstep(0, 140, landDist[k]))
  H[k] = h
}
const hAt = (x, z) => {
  const fx = Math.min(AW - 1.001, Math.max(0, (x - X0) / PX - 0.5)), fz = Math.min(AH - 1.001, Math.max(0, (z - Z0) / PX - 0.5))
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * AW + i
  return lerp(lerp(H[k], H[k + 1], u), lerp(H[k + AW], H[k + AW + 1], u), v)
}
const bilin = (A, x, z) => {
  const fx = Math.min(AW - 1.001, Math.max(0, (x - X0) / PX - 0.5)), fz = Math.min(AH - 1.001, Math.max(0, (z - Z0) / PX - 0.5))
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * AW + i
  return lerp(lerp(A[k], A[k + 1], u), lerp(A[k + AW], A[k + AW + 1], u), v)
}

// ---- sun shadows and hollows, baked in ----
export const SUN = (() => { const az = (335 * Math.PI) / 180, el = (52 * Math.PI) / 180; return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)] })()
const shadow = new Float32Array(AW * AH)
{
  const hl = Math.hypot(SUN[0], SUN[2]), sx = SUN[0] / hl, sz = SUN[2] / hl, rise = (SUN[1] / hl) * PX
  for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) {
    const k = j * AW + i
    if (H[k] < 0) { shadow[k] = 1; continue }
    let lit = 1, y = H[k] + 1.5
    for (let s = 1; s < 260; s++) {
      y += rise
      if (y > 1150) break
      const ii = Math.round(i + sx * s), jj = Math.round(j + sz * s)
      if (ii < 0 || jj < 0 || ii >= AW || jj >= AH) break
      const d = H[jj * AW + ii] - y
      if (d > 0) { lit = Math.max(0, 1 - d / 12); if (lit === 0) break }
    }
    shadow[k] = lit
  }
}
function boxBlur(A, r) {
  const T = new Float32Array(A.length), R = new Float32Array(A.length)
  for (let j = 0; j < AH; j++) { let s = 0, n = 0; for (let i = -r; i < AW + r; i++) { if (i + r < AW) { s += A[j * AW + Math.min(AW - 1, i + r)]; n++ } if (i - r - 1 >= 0) { s -= A[j * AW + i - r - 1]; n-- } if (i >= 0 && i < AW) T[j * AW + i] = s / Math.max(1, n) } }
  for (let i = 0; i < AW; i++) { let s = 0, n = 0; for (let j = -r; j < AH + r; j++) { if (j + r < AH) { s += T[Math.min(AH - 1, j + r) * AW + i]; n++ } if (j - r - 1 >= 0) { s -= T[(j - r - 1) * AW + i]; n-- } if (j >= 0 && j < AH) R[j * AW + i] = s / Math.max(1, n) } }
  return R
}
const shadowS = boxBlur(shadow, 1)
const Hb = boxBlur(H, 7)
const ao = new Float32Array(AW * AH)
for (let k = 0; k < AW * AH; k++) ao[k] = clamp01(1 - Math.max(0, Hb[k] - H[k]) / 70) * 0.6 + 0.4 * clamp01(1 + (H[k] - Hb[k]) / 140)

// ---- city layout ----
// Streets in the City Bowl, Green Point and Sea Point run roughly NE-SW and NW-SE.
const ANG = (40 * Math.PI) / 180, CA = Math.cos(ANG), SA = Math.sin(ANG)
const toUV = (x, z) => [x * SA - z * CA, x * CA + z * SA] // u along the NE-SW streets, v across them
const fromUV = (u, v) => [u * SA + v * CA, -u * CA + v * SA]
const BU = 118, BV = 72, STREET = 11
const LH = [(18.389 - O.lon) * MX, -(-33.9351 - O.lat) * MZ]
const SH = [[(18.39 - O.lon) * MX, -(-33.928 - O.lat) * MZ], [(18.398 - O.lon) * MX, -(-33.917 - O.lat) * MZ]]
function segDist(px, pz, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1]
  const t = clamp01(((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz))
  return Math.hypot(px - a[0] - t * dx, pz - a[1] - t * dz)
}
const inBox = (lon, lat, lo0, lo1, la0, la1) => lon >= lo0 && lon <= lo1 && lat >= la0 && lat <= la1
export const STADIUM = { x: (18.4111 - O.lon) * MX, z: -(-33.9035 - O.lat) * MZ, a: 140, b: 118, ang: 0.45 }
function zoneAt(x, z, h, slope, ld) {
  const lon = lonOf(x), lat = latOf(z)
  if (ld <= 0) return 'sea'
  // Green Point Park, the golf course and the stadium precinct
  const sx = x - STADIUM.x, sz = z - STADIUM.z
  if (Math.hypot(sx, sz) < 190) return 'stadium'
  if (inBox(lon, lat, 18.4015, 18.4175, -33.9065, -33.9008) && ld > 140) return 'park'
  if (inBox(lon, lat, 18.424, 18.47, -33.92, -33.895)) return 'port'
  if (inBox(lon, lat, 18.413, 18.424, -33.9095, -33.899)) return 'waterfront'
  if (ld < 22 + 10 * fbm(n2, x * 0.01, z * 0.01, 3, 2)) return lat < -33.935 && lon < 18.385 ? 'beach' : 'shore'
  // the mountain reserve: Lion's Head, Signal Hill, Table Mountain and Devil's Peak
  const wob = 25 * (fbm(n1, x * 0.004, z * 0.004, 7, 3) - 0.5)
  const nearLH = Math.hypot(x - LH[0], z - LH[1]), nearSH = segDist(x, z, SH[0], SH[1])
  if ((nearLH < 1500 || nearSH < 700) && h > 95 + wob) return 'wild'
  let lim = 165 + wob
  if (lon > 18.405 && lat < -33.925) lim = 225 + wob // Tamboerskloof, Gardens, Oranjezicht climb higher
  if (lon < 18.39 && lat < -33.93) lim = 120 + wob // Clifton, Camps Bay below the Twelve Apostles
  if (h > lim || slope > 0.75) return 'wild'
  if (inBox(lon, lat, 18.413, 18.434, -33.929, -33.912)) return 'cbd'
  if (lat < -33.925 && lon < 18.386) return 'clifton'
  if (ld < 320 && lat > -33.935 && lon < 18.415) return 'seafront'
  return 'suburb'
}
const URBAN = new Set(['cbd', 'clifton', 'seafront', 'suburb', 'waterfront', 'port'])
// one lot = one building. Lots are laid out along the street blocks.
function lotAt(x, z) {
  const [u, v] = toUV(x, z)
  const bi = Math.floor(u / BU), bj = Math.floor(v / BV)
  const lu = u - bi * BU, lv = v - bj * BV
  const street = lu < STREET || lv < STREET
  const hb = hash2(bi + 1000, bj + 2000)
  const lotW = 16 + Math.floor(hb * 4) * 7 // 16..37 m
  const iu = Math.floor((lu - STREET) / lotW), iv = lv - STREET < (BV - STREET) / 2 ? 0 : 1
  const lh = hash2(bi * 31 + iu, bj * 17 + iv)
  const cu = bi * BU + STREET + (iu + 0.5) * lotW, cv = bj * BV + STREET + (iv + 0.5) * ((BV - STREET) / 2)
  const du = Math.abs(lu - STREET - (iu + 0.5) * lotW), dv = Math.abs(lv - STREET - (iv + 0.5) * ((BV - STREET) / 2))
  const fu = lotW / 2 - 2.5 - lh * 3, fv = (BV - STREET) / 4 - 2 - hash2(bi + iu, bj * 3 + iv) * 3
  const lastLot = STREET + (iu + 1) * lotW > BU
  return { street, lh, cu, cv, inFoot: !street && !lastLot && du < fu && dv < fv, fu, fv, lotW, edge: Math.min(Math.abs(du - fu), Math.abs(dv - fv)) }
}

// ---- colour ----
const C = {
  fynbos: hex(0x47533a), fynbos2: hex(0x5e6448), fynbosDk: hex(0x323d2b), rock: hex(0x77726a), rockWarm: hex(0x84766a), cliff: hex(0x8e877b),
  grass: hex(0x5f7a3c), grassDk: hex(0x4d6634), sand: hex(0xe6dcc4), rockShore: hex(0x4c4840), road: hex(0x55575a), road2: hex(0x6a6a68),
  pave: hex(0x9d9a92), concrete: hex(0xa9a7a0), tree: hex(0x3d5230), pool: hex(0x4fb0c8), garden: hex(0x6d7a4c),
}
const ROOFS = [0x9c5a3e, 0x8a8a88, 0x4c5054, 0xd6d2ca, 0xb2b0aa, 0x7a5c48, 0x5d6066, 0xc4b8a4].map(hex)
const CW = 4096, CH = Math.round((CW * AH) / AW), CPX = (X1 - X0) / CW
console.log('colour', CW, CH, CPX.toFixed(2), 'm/px')
const col = new Uint8Array(CW * CH * 3)
for (let j = 0; j < CH; j++) {
  const z = Z0 + (j + 0.5) * CPX
  for (let i = 0; i < CW; i++) {
    const x = X0 + (i + 0.5) * CPX
    const h = hAt(x, z)
    const ld = bilin(landDist, x, z)
    let c
    if (h < 0 || ld <= 0) {
      c = mixc(hex(0x2a5a62), hex(0x183a4a), clamp01(bilin(seaDist, x, z) / 120)) // seabed tint; the water shader covers it
    } else {
      const hx = (hAt(x + 6, z) - hAt(x - 6, z)) / 12, hz = (hAt(x, z + 6) - hAt(x, z - 6)) / 12
      const slope = Math.hypot(hx, hz)
      const zone = zoneAt(x, z, h, slope, ld)
      const d1 = fbm(n1, x * 0.012, z * 0.012, 1, 4), d2 = fbm(n2, x * 0.06, z * 0.06, 2, 3), d3 = fbm(n3, x * 0.25, z * 0.25, 3, 2)
      // natural ground: fynbos, with grey sandstone on steep faces and bare cliffs
      let g = mixc(C.fynbos, C.fynbos2, d1)
      g = mixc(g, C.fynbosDk, smoothstep(0.55, 0.75, d2) * 0.7)
      g = mixc(g, mixc(C.rock, C.rockWarm, d1), Math.min(1, smoothstep(0.75, 1.2, slope) * 0.85 + smoothstep(0.62, 0.8, d2) * 0.35 * smoothstep(250, 600, h)))
      g = mixc(g, C.cliff, smoothstep(1.3, 2.2, slope) * 0.85)
      g = mixc(g, mixc(g, [30, 34, 26], 0.5), smoothstep(0.62, 0.8, d3) * (1 - smoothstep(0.6, 1.0, slope)) * 0.6) // bushes
      if (zone === 'park' || zone === 'stadium') {
        c = mixc(C.grass, C.grassDk, d2)
        c = mixc(c, mixc(C.grass, [150, 160, 90], 0.3), (Math.sin(toUV(x, z)[0] * 0.25) * 0.5 + 0.5) * 0.15) // mowing stripes
        if (d3 > 0.68) c = mixc(c, C.tree, 0.85)
        if (zone === 'stadium') c = mixc(c, C.pave, smoothstep(140, 170, Math.hypot(x - STADIUM.x, z - STADIUM.z)) * 0.8)
      } else if (zone === 'beach') c = mixc(C.sand, [210, 200, 175], d3)
      else if (zone === 'shore') {
        // rocky shore at the water, then the promenade lawn and path
        c = ld < 9 ? mixc(C.rockShore, [90, 84, 72], d3) : ld < 14 ? C.pave : mixc(C.grass, C.grassDk, d2)
      } else if (URBAN.has(zone)) {
        const L = lotAt(x, z)
        if (zone === 'port') c = hash2(Math.floor(x / 140), Math.floor(z / 90)) < 0.35 && L.inFoot ? mixc(ROOFS[1], ROOFS[4], L.lh) : mixc(C.concrete, C.pave, d2)
        else if (L.street) c = mixc(C.road, C.road2, d3 * 0.5)
        else if (zone === 'port-unused') c = L.inFoot && L.lh < 0.5 ? mixc(ROOFS[1], ROOFS[4], L.lh * 2) : mixc(C.concrete, C.pave, d2)
        else if (L.inFoot) {
          c = ROOFS[Math.floor(L.lh * ROOFS.length)]
          c = mixc(c, mixc(c, [0, 0, 0], 0.35), smoothstep(1.2, 0, L.edge) * 0.6) // roof edges
          if (zone === 'cbd' || zone === 'seafront') c = mixc(c, ROOFS[4], 0.5)
        } else {
          c = zone === 'cbd' || zone === 'waterfront' ? mixc(C.pave, C.concrete, d3) : mixc(C.garden, C.pave, d3 * 0.6)
          if (zone !== 'cbd' && d3 > 0.62) c = mixc(c, C.tree, 0.8)
          if (zone !== 'cbd' && hash2(Math.floor(x / 9), Math.floor(z / 9)) > 0.985) c = C.pool
          // shadow cast by the building next door (sun from the north)
          if (L.edge < 3) c = mixc(c, [0, 0, 0], 0.25)
        }
      } else c = g
      // dark rocks and white surf where the sea meets the shore
      c = mixc(c, mixc(C.rockShore, g, 0.2), smoothstep(4, 0, ld) * (zone === 'beach' ? 0 : 0.7))
    }
    const k = (j * CW + i) * 3
    const sh = h < 0 ? 1 : bilin(shadowS, x, z), oc = h < 0 ? 1 : bilin(ao, x, z)
    const lightK = (0.45 + 0.55 * sh) * (0.6 + 0.4 * oc)
    col[k] = Math.min(255, c[0] * lightK)
    col[k + 1] = Math.min(255, c[1] * lightK)
    col[k + 2] = Math.min(255, c[2] * lightK)
  }
  if (j % 500 === 0) console.log('colour row', j)
}
save('color', CW, CH, col, 3, 3)

// ---- object-space normals (x east, y up, z south) ----
{
  const nrm = new Uint8Array(AW * AH * 3)
  for (let j = 0; j < AH; j++) for (let i = 0; i < AW; i++) {
    const k = j * AW + i
    const hx = (H[j * AW + Math.min(AW - 1, i + 1)] - H[j * AW + Math.max(0, i - 1)]) / (2 * PX)
    const hz = (H[Math.min(AH - 1, j + 1) * AW + i] - H[Math.max(0, j - 1) * AW + i]) / (2 * PX)
    const l = Math.hypot(hx, 1, hz)
    nrm[k * 3] = ((-hx / l) * 0.5 + 0.5) * 255
    nrm[k * 3 + 1] = ((1 / l) * 0.5 + 0.5) * 255
    nrm[k * 3 + 2] = ((-hz / l) * 0.5 + 0.5) * 255
  }
  save('normal', AW, AH, nrm, 3, 2)
}

// ---- shore distance: 128 at the coast, +1 per 6 m out to sea, -1 per 6 m inland ----
{
  const SW = 1024, SH2 = Math.round((SW * AH) / AW)
  const s = new Uint8Array(SW * SH2)
  for (let j = 0; j < SH2; j++) for (let i = 0; i < SW; i++) {
    const x = X0 + ((i + 0.5) / SW) * (X1 - X0), z = Z0 + ((j + 0.5) / SH2) * (Z1 - Z0)
    const d = bilin(seaDist, x, z) - bilin(landDist, x, z)
    s[j * SW + i] = Math.max(0, Math.min(255, Math.round(128 + d / 6)))
  }
  save('shore', SW, SH2, s, 1, 2)
}

// ---- mesh heights ----
const GW = 641, GH = Math.round(((GW - 1) * AH) / AW) + 1
{
  const data = new Int16Array(GW * GH)
  for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
    const x = X0 + (gx / (GW - 1)) * (X1 - X0), z = Z0 + (gy / (GH - 1)) * (Z1 - Z0)
    data[gy * GW + gx] = Math.round(hAt(x, z) * 4) // quarter metres
  }
  writeFileSync(join(OUT, 'h.bin'), Buffer.from(data.buffer))
}

// ---- buildings ----
// Every lot in a built-up zone gets a building; small houses far from the flight path stay painted on the ground.
const PATH = [[-461, -1774], [-1500, 300], [-2700, 2200], [-2950, 2780]]
const nearPath = (x, z) => Math.min(...PATH.slice(1).map((p, k) => segDist(x, z, PATH[k], p)))
const out = []
{
  const [u0, u1, v0, v1] = (() => { const cs = [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]].map(([x, z]) => toUV(x, z)); return [Math.min(...cs.map((c) => c[0])), Math.max(...cs.map((c) => c[0])), Math.min(...cs.map((c) => c[1])), Math.max(...cs.map((c) => c[1]))] })()
  for (let bi = Math.floor(u0 / BU); bi <= Math.ceil(u1 / BU); bi++) for (let bj = Math.floor(v0 / BV); bj <= Math.ceil(v1 / BV); bj++) {
    const hb = hash2(bi + 1000, bj + 2000)
    const lotW = 16 + Math.floor(hb * 4) * 7
    for (let iu = 0; STREET + (iu + 1) * lotW <= BU; iu++) for (let iv = 0; iv < 2; iv++) {
      const cu = bi * BU + STREET + (iu + 0.5) * lotW, cv = bj * BV + STREET + (iv + 0.5) * ((BV - STREET) / 2)
      const [x, z] = fromUV(cu, cv)
      if (x < X0 + 50 || x > X1 - 50 || z < Z0 + 50 || z > Z1 - 50) continue
      const L = lotAt(x, z)
      const h0 = hAt(x, z)
      if (h0 <= 1) continue
      const ld = bilin(landDist, x, z)
      const slope = Math.hypot(hAt(x + 6, z) - hAt(x - 6, z), hAt(x, z + 6) - hAt(x, z - 6)) / 12
      const zone = zoneAt(x, z, h0, slope, ld)
      if (!URBAN.has(zone)) continue
      const r = L.lh, r2 = hash2(bi * 7 + iu, bj * 13 + iv + 5)
      let ht
      if (zone === 'cbd') ht = 18 + r2 * r2 * 95 + (r > 0.97 ? 40 : 0)
      else if (zone === 'seafront') ht = 14 + r2 * 46
      else if (zone === 'waterfront') ht = 10 + r2 * 22
      else if (zone === 'port') { if (r > 0.5) continue; ht = 8 + r2 * 14 }
      else if (zone === 'clifton') ht = 7 + r2 * 16
      else ht = r2 < 0.12 ? 14 + r2 * 60 : 5 + r2 * 5
      if (ht < 13 && (nearPath(x, z) > 3800 || r < 0.35)) continue // gaps for gardens and trees
      const fu = L.fu * (zone === 'cbd' || zone === 'seafront' ? 1.1 : 1), fv = L.fv
      // sit on the lowest corner so nothing floats on a slope
      let base = h0
      for (const [du, dv] of [[-fu, -fv], [fu, -fv], [-fu, fv], [fu, fv]]) { const [px, pz] = fromUV(cu + du, cv + dv); base = Math.min(base, hAt(px, pz)) }
      out.push(x, base - 1.5, z, fu * 2, ht + (h0 - base) + 1.5, fv * 2, Math.floor(hash2(bi + iu * 3, bj + iv * 7) * 8))
    }
  }
}
console.log('buildings', out.length / 7)
writeFileSync(join(OUT, 'buildings.bin'), Buffer.from(new Float32Array(out).buffer))
writeFileSync(join(OUT, 'meta.json'), JSON.stringify({ x0: X0, x1: X1, z0: Z0, z1: Z1, grid: [GW, GH], heightScale: 0.25, angle: ANG, sun: SUN, stadium: STADIUM, origin: O, mPerDeg: [MX, MZ] }, null, 1))
