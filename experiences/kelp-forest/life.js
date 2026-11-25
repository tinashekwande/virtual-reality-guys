import * as THREE from 'three'
import { body, fin, paint, swimMaterial, lerp3, sstep, vnoise3 } from './bodies.js'
import { floorY, withCaustics, reefiness as reefinessAt } from './ocean.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
const mergeTwo = (a, b) => mergeGeometries([a, b], false)

// The animals of the Great African Seaforest.

const V = (x, y, z) => new THREE.Vector3(x, y, z)

// ======================= Cape fur seal =======================
function sealGeometry() {
  const L = 1.7
  const b = body(L, [[0, 0.02], [0.08, 0.08], [0.25, 0.16], [0.5, 0.2], [0.68, 0.18], [0.8, 0.13], [0.88, 0.115], [0.95, 0.075], [1, 0.02]], { sy: 0.92 })
  const flipF = [[0, 0], [-0.08, 0.05], [-0.28, 0.12], [-0.42, 0.13], [-0.36, 0.06], [-0.1, -0.01]]
  const parts = [
    b,
    fin(flipF, { at: [0.25, -0.12, 0.17], rot: [-0.5, 0.25, -0.35], thick: 0.02 }),
    fin(flipF, { at: [0.25, -0.12, -0.17], rot: [0.5, -0.25, -0.35], thick: 0.02 }),
    fin([[0, 0], [-0.12, 0.08], [-0.3, 0.12], [-0.3, 0.02], [-0.1, -0.01]], { at: [-0.72, 0.0, 0.05], rot: [-0.2, 0, 0], thick: 0.015 }),
    fin([[0, 0], [-0.12, -0.08], [-0.3, -0.12], [-0.3, -0.02], [-0.1, 0.01]], { at: [-0.72, 0.0, -0.05], rot: [0.2, 0, 0], thick: 0.015 }),
  ]
  const top = [0.2, 0.15, 0.11], belly = [0.42, 0.34, 0.25], face = [0.3, 0.24, 0.17]
  return paint(parts, (x, y, z) => {
    let c = lerp3(belly, top, sstep(-0.12, 0.08, y))
    c = lerp3(c, face, sstep(0.55, 0.75, x) * 0.6)
    // eyes and nose
    if (x > 0.66 && x < 0.72 && Math.abs(Math.abs(z) - 0.075) < 0.025 && y > 0.0 && y < 0.06) c = [0.02, 0.02, 0.02]
    if (x > 0.83) c = lerp3(c, [0.05, 0.04, 0.03], 0.7)
    const n = vnoise3(x * 8, y * 8, z * 8)
    return lerp3(c, [c[0] * 0.75, c[1] * 0.75, c[2] * 0.75], n * 0.5)
  })
}

// ======================= fish =======================
// Painted skins for Cape reef fish: a back-to-belly colour gradient, scales, a lateral line, the species'
// own markings and a glossy eye. The texture is projected from the side, so both sides match.
const FISH = {
  strepie: { back: [96, 102, 92], belly: [214, 214, 198], extra: 'stripes' }, // Sarpa salpa: silver with golden stripes
  hottentot: { back: [62, 68, 84], belly: [186, 176, 156], extra: 'bronze' }, // Hottentot seabream
  roman: { back: [178, 46, 30], belly: [236, 140, 104], extra: 'roman' }, // red roman
  galjoen: { back: [34, 36, 40], belly: [110, 106, 98], extra: 'bars' }, // galjoen, South Africa's national fish
}
function fishTexture(kind) {
  const f = FISH[kind]
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0, `rgb(${f.back})`)
  g.addColorStop(0.55, `rgb(${f.back.map((v, i) => Math.round((v + f.belly[i]) / 2))})`)
  g.addColorStop(1, `rgb(${f.belly})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 256)
  if (f.extra === 'stripes') {
    ctx.strokeStyle = 'rgba(232,190,70,0.85)'
    ctx.lineWidth = 6
    for (let y = 40; y < 200; y += 22) { ctx.beginPath(); ctx.moveTo(0, y + 6); ctx.bezierCurveTo(170, y - 6, 330, y - 4, 512, y + 10); ctx.stroke() }
  }
  if (f.extra === 'bronze') { ctx.fillStyle = 'rgba(170,130,70,0.25)'; ctx.fillRect(0, 60, 512, 90) }
  if (f.extra === 'roman') {
    ctx.fillStyle = 'rgba(250,245,240,0.9)'
    ctx.beginPath(); ctx.ellipse(250, 30, 34, 26, 0, 0, Math.PI * 2); ctx.fill() // pale saddle on the back
    ctx.strokeStyle = 'rgba(90,150,230,0.8)'
    ctx.lineWidth = 4
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(400, 110 + k * 14); ctx.lineTo(480, 104 + k * 12); ctx.stroke() } // blue lines on the face
  }
  if (f.extra === 'bars') {
    ctx.fillStyle = 'rgba(15,15,18,0.45)'
    for (let x = 90; x < 420; x += 55) ctx.fillRect(x, 0, 22, 200)
  }
  // scales: rows of small arcs
  ctx.strokeStyle = 'rgba(255,255,255,0.13)'
  ctx.lineWidth = 1.2
  for (let y = 8; y < 256; y += 9) for (let x = (y / 9) % 2 ? 0 : 7; x < 440; x += 14) { ctx.beginPath(); ctx.arc(x, y, 7, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke() }
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  for (let y = 12; y < 256; y += 9) for (let x = (y / 9) % 2 ? 4 : 11; x < 440; x += 14) { ctx.beginPath(); ctx.arc(x, y, 7, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke() }
  // lateral line and gill cover
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(30, 120); ctx.bezierCurveTo(200, 95, 330, 92, 410, 112); ctx.stroke()
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(470, 140, 80, 0.75 * Math.PI, 1.3 * Math.PI); ctx.stroke()
  // eye
  ctx.fillStyle = 'rgb(205,170,80)'; ctx.beginPath(); ctx.arc(452, 108, 13, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgb(8,8,10)'; ctx.beginPath(); ctx.arc(454, 108, 8, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(450, 104, 2.5, 0, Math.PI * 2); ctx.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}
function fishGeometry(L = 0.32, deep = 1.1) {
  const b = body(L, [[0, 0.015], [0.1, 0.045], [0.35, 0.16], [0.6, 0.18], [0.82, 0.13], [0.95, 0.06], [1, 0.015]], { sy: deep, sz: 0.4, segs: 22, radial: 14 })
  const parts = [
    b,
    fin([[0, 0], [-0.05, 0.055], [-0.085, 0.07], [-0.065, 0.005], [-0.085, -0.07], [-0.05, -0.055]].map(([x, y]) => [x * L / 0.32, y * L / 0.32]), { at: [-0.44 * L, 0, 0], thick: 0.003 }),
    fin([[0, 0], [0.03, 0.04], [0.09, 0.045], [0.16, 0.035], [0.19, 0]].map(([x, y]) => [x * L / 0.32, y * L / 0.32]), { at: [-0.16 * L, 0.15 * L * deep, 0], thick: 0.003 }),
    fin([[0, 0], [0.03, -0.025], [0.08, -0.02], [0.1, 0]].map(([x, y]) => [x * L / 0.32, y * L / 0.32]), { at: [-0.12 * L, -0.15 * L * deep, 0], thick: 0.003 }),
    fin([[0, 0], [-0.03, 0.02], [-0.07, 0.015], [-0.05, -0.01]].map(([x, y]) => [x * L / 0.32, y * L / 0.32]), { at: [0.22 * L, -0.02, 0.022 * L / 0.32], rot: [-0.6, 0, 0], thick: 0.002 }),
    fin([[0, 0], [-0.03, 0.02], [-0.07, 0.015], [-0.05, -0.01]].map(([x, y]) => [x * L / 0.32, y * L / 0.32]), { at: [0.22 * L, -0.02, -0.022 * L / 0.32], rot: [0.6, 0, 0], thick: 0.002 }),
  ]
  return paint(parts, () => [1, 1, 1], L)
}

// ======================= sharks =======================
function shysharkGeometry() {
  const L = 0.62
  const b = body(L, [[0, 0.01], [0.1, 0.03], [0.35, 0.07], [0.6, 0.1], [0.8, 0.1], [0.93, 0.08], [1, 0.03]], { sy: 0.75, sz: 1.1, segs: 30, radial: 14 })
  const parts = [
    b,
    fin([[0, 0], [-0.05, 0.04], [-0.07, 0.05], [-0.06, 0]], { at: [-0.04, 0.035, 0], thick: 0.004 }), // dorsal 1
    fin([[0, 0], [-0.04, 0.03], [-0.06, 0.035], [-0.05, 0]], { at: [-0.13, 0.025, 0], thick: 0.004 }), // dorsal 2
    fin([[0, 0], [-0.1, 0.02], [-0.18, 0.015], [-0.16, -0.035], [-0.05, -0.02]], { at: [-0.24, 0.005, 0], thick: 0.004 }), // tail
    fin([[0, 0], [-0.05, 0.06], [-0.09, 0.06], [-0.06, 0]], { at: [0.1, -0.02, 0.05], rot: [-1.3, 0, 0], thick: 0.004 }),
    fin([[0, 0], [-0.05, 0.06], [-0.09, 0.06], [-0.06, 0]], { at: [0.1, -0.02, -0.05], rot: [1.3, 0, 0], thick: 0.004 }),
  ]
  return paint(parts, (x, y, z) => {
    // puffadder shyshark: sandy gold with dark saddles and pale spots
    let c = lerp3([0.7, 0.64, 0.52], [0.48, 0.34, 0.17], sstep(-0.02, 0.02, y))
    const saddle = Math.abs(Math.sin((x + 0.31) * 26)) > 0.75 && y > 0.0
    if (saddle) c = lerp3(c, [0.3, 0.2, 0.12], 0.75)
    if (y > 0.01 && vnoise3(x * 60, y * 60, z * 60) > 0.78) c = [0.93, 0.88, 0.74]
    if (x > 0.24 && x < 0.27 && Math.abs(Math.abs(z) - 0.045) < 0.015 && y > 0.005) c = [0.85, 0.7, 0.2] // golden eye
    return c
  })
}
function pyjamaGeometry() {
  const L = 0.95
  const b = body(L, [[0, 0.01], [0.1, 0.03], [0.35, 0.07], [0.6, 0.095], [0.8, 0.095], [0.93, 0.075], [1, 0.03]], { sy: 0.8, sz: 1.05, segs: 30, radial: 14 })
  const parts = [
    b,
    fin([[0, 0], [-0.07, 0.06], [-0.1, 0.07], [-0.08, 0]], { at: [-0.06, 0.05, 0], thick: 0.005 }),
    fin([[0, 0], [-0.06, 0.05], [-0.09, 0.05], [-0.07, 0]], { at: [-0.2, 0.035, 0], thick: 0.005 }),
    fin([[0, 0], [-0.15, 0.03], [-0.27, 0.02], [-0.25, -0.05], [-0.08, -0.03]], { at: [-0.37, 0.005, 0], thick: 0.005 }),
  ]
  return paint(parts, (x, y, z) => {
    // pyjama shark: dark stripes running along a grey body
    let c = lerp3([0.7, 0.68, 0.64], [0.42, 0.4, 0.37], sstep(-0.03, 0.02, y))
    const stripe = Math.abs(Math.sin(Math.atan2(y, z) * 7)) > 0.82 && y > -0.02
    if (stripe) c = [0.12, 0.11, 0.1]
    return c
  })
}
function sevengillGeometry() {
  const L = 2.6
  const b = body(L, [[0, 0.008], [0.12, 0.03], [0.3, 0.06], [0.55, 0.085], [0.75, 0.09], [0.88, 0.075], [0.96, 0.05], [1, 0.02]], { sy: 0.85, sz: 1.15, segs: 44, radial: 18 })
  const parts = [
    b,
    fin([[0, 0], [-0.08, 0.16], [-0.16, 0.18], [-0.2, 0.15], [-0.18, 0]], { at: [-0.35, 0.14, 0], thick: 0.01 }), // single dorsal fin far back
    fin([[0, 0], [-0.3, 0.12], [-0.62, 0.2], [-0.6, 0.12], [-0.4, -0.04], [-0.2, -0.12], [-0.1, -0.03]], { at: [-1.0, 0.02, 0], thick: 0.01 }), // tail, long upper lobe
    fin([[0, 0], [-0.12, 0.2], [-0.24, 0.22], [-0.2, 0]], { at: [0.55, -0.12, 0.18], rot: [-1.35, 0, 0], thick: 0.01 }),
    fin([[0, 0], [-0.12, 0.2], [-0.24, 0.22], [-0.2, 0]], { at: [0.55, -0.12, -0.18], rot: [1.35, 0, 0], thick: 0.01 }),
    fin([[0, 0], [-0.08, 0.08], [-0.14, 0.08], [-0.12, 0]], { at: [-0.25, -0.14, 0.08], rot: [-1.5, 0, 0], thick: 0.008 }),
    fin([[0, 0], [-0.08, 0.08], [-0.14, 0.08], [-0.12, 0]], { at: [-0.25, -0.14, -0.08], rot: [1.5, 0, 0], thick: 0.008 }),
  ]
  return paint(parts, (x, y, z) => {
    let c = lerp3([0.62, 0.6, 0.56], [0.2, 0.19, 0.17], sstep(-0.08, 0.04, y))
    if (y > -0.05 && vnoise3(x * 22, y * 22, z * 22) > 0.8) c = [0.08, 0.08, 0.08] // small black spots
    // seven gill slits on each side
    const gx = (x - 0.62) / 0.26
    if (gx > 0 && gx < 1 && Math.abs(z) > 0.12 && Math.abs(y) < 0.11 && Math.abs(Math.sin(gx * Math.PI * 7)) > 0.86) c = [0.15, 0.13, 0.12]
    if (x > 1.12 && x < 1.17 && Math.abs(Math.abs(z) - 0.13) < 0.03 && y > 0.02 && y < 0.07) c = [0.02, 0.02, 0.02]
    return c
  })
}

// ======================= octopus =======================
function octopusMaterial() {
  const u = { uTime: { value: 0 }, uFlash: { value: 0 }, uCurl: { value: 0 } }
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec3 aArm; // x: arm angle, y: position along the arm (0 base .. 1 tip), z: 1 for arms
        uniform float uTime; uniform float uCurl; varying vec3 vObj;
        vec3 armSide(float ang){ return vec3(-sin(ang), 0.0, cos(ang)); }`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        if (aArm.z > 0.5) objectNormal = normalize(armSide(aArm.x) * position.x + vec3(0.0, 1.0, 0.0) * position.y);`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vObj = position;
        if (aArm.z > 0.5) {
          float s = aArm.y, ang = aArm.x;
          float Lr = 0.85;
          float k = (1.2 + 1.4 * sin(uTime * 0.7 + ang * 2.0) + uCurl * 4.0); // curvature: arms curl and uncurl
          float l = s * Lr;
          float a0 = -0.35;
          float h = (sin(a0 + k * l) - sin(a0)) / k;
          float v = (-cos(a0 + k * l) + cos(a0)) / k;
          vec3 dir = vec3(cos(ang), 0.0, sin(ang));
          vec3 side = vec3(-sin(ang), 0.0, cos(ang));
          float wave = sin(uTime * 1.6 + ang * 3.0 - s * 5.0) * 0.06 * s;
          vec3 center = dir * (0.1 + h) + vec3(0.0, -0.06 + v * 0.6, 0.0) + side * wave;
          float r = mix(0.035, 0.006, s);
          transformed = center + side * position.x * r + vec3(0.0, 1.0, 0.0) * position.y * r;
        }`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform float uFlash; varying vec3 vObj;
        float hh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float nn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hh(i), hh(i+vec3(1,0,0)), f.x), mix(hh(i+vec3(0,1,0)), hh(i+vec3(1,1,0)), f.x), f.y),
                     mix(mix(hh(i+vec3(0,0,1)), hh(i+vec3(1,0,1)), f.x), mix(hh(i+vec3(0,1,1)), hh(i+vec3(1,1,1)), f.x), f.y), f.z); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        // mottled skin that can change colour: camouflage browns, flashing to pale and back to red
        float m = nn(vObj * 22.0) * 0.6 + nn(vObj * 60.0) * 0.4;
        vec3 camo = mix(vec3(0.34, 0.12, 0.06), vec3(0.56, 0.27, 0.13), m);
        vec3 red = mix(vec3(0.45, 0.07, 0.04), vec3(0.72, 0.2, 0.11), m);
        vec3 pale = mix(vec3(0.85, 0.82, 0.76), vec3(0.6, 0.5, 0.45), m);
        vec3 col = mix(camo, red, smoothstep(0.0, 0.5, uFlash));
        col = mix(col, pale, smoothstep(0.5, 1.0, uFlash) * (0.6 + 0.4 * sin(uTime * 9.0)));
        diffuseColor.rgb = col;`)
  }
  mat.customProgramCacheKey = () => 'octopus'
  mat.userData.u = u
  return mat
}
function octopusGeometry() {
  const parts = []
  // mantle (the "head") behind the eyes
  const mantle = new THREE.SphereGeometry(0.16, 24, 18)
  mantle.scale(1.4, 1.0, 1.0)
  mantle.translate(-0.12, 0.13, 0)
  mantle.rotateZ(0.5)
  const head = new THREE.SphereGeometry(0.1, 18, 14)
  head.translate(0.02, 0.0, 0)
  for (const g of [mantle, head]) { g.deleteAttribute('uv'); g.setAttribute('aArm', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)) }
  parts.push(mantle.toNonIndexed(), head.toNonIndexed())
  // eight arms: tubes whose shape is computed in the shader
  const SEG = 24, RAD = 8
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2 + 0.2
    const pos = [], arm = [], idx = []
    for (let i = 0; i <= SEG; i++) for (let j = 0; j <= RAD; j++) {
      const th = (j / RAD) * Math.PI * 2
      pos.push(Math.cos(th), Math.sin(th), 0)
      arm.push(ang, i / SEG, 1)
    }
    for (let i = 0; i < SEG; i++) for (let j = 0; j < RAD; j++) {
      const p = i * (RAD + 1) + j, q = p + RAD + 1
      idx.push(p, q, p + 1, q, q + 1, p + 1)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aArm', new THREE.Float32BufferAttribute(arm, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    parts.push(g.toNonIndexed())
  }
  const merged = new THREE.BufferGeometry()
  const total = parts.reduce((n, p) => n + p.attributes.position.count, 0)
  const P = new Float32Array(total * 3), N = new Float32Array(total * 3), A = new Float32Array(total * 3)
  let o = 0
  for (const p of parts) {
    if (!p.attributes.normal) p.computeVertexNormals()
    P.set(p.attributes.position.array, o * 3)
    N.set(p.attributes.normal.array, o * 3)
    A.set(p.attributes.aArm.array, o * 3)
    o += p.attributes.position.count
  }
  merged.setAttribute('position', new THREE.BufferAttribute(P, 3))
  merged.setAttribute('normal', new THREE.BufferAttribute(N, 3))
  merged.setAttribute('aArm', new THREE.BufferAttribute(A, 3))
  return merged
}

// ======================= reef life =======================
function urchinGeometry() {
  const parts = [new THREE.SphereGeometry(0.05, 10, 8)]
  for (let i = 0; i < 46; i++) {
    const d = new THREE.Vector3().randomDirection()
    if (d.y < -0.3) continue
    const c = new THREE.ConeGeometry(0.004, 0.07, 4)
    c.translate(0, 0.085, 0)
    c.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d))
    parts.push(c)
  }
  for (const p of parts) p.deleteAttribute('uv')
  return paint(parts, () => [0.2, 0.08, 0.22])
}
function anemoneGeometry() {
  const parts = [new THREE.CylinderGeometry(0.035, 0.05, 0.08, 12)]
  parts[0].translate(0, 0.04, 0)
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2, r = 0.02 + (i % 2) * 0.012
    const c = new THREE.ConeGeometry(0.005, 0.06, 4)
    c.translate(0, 0.03, 0)
    c.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.cos(a) * 0.8, 0, -Math.sin(a) * 0.8)))
    c.translate(Math.sin(a) * r, 0.08, Math.cos(a) * r)
    parts.push(c)
  }
  for (const p of parts) p.deleteAttribute('uv')
  return paint(parts, (x, y) => (y > 0.075 ? [1, 1, 1] : [0.75, 0.75, 0.75]))
}
function starGeometry() {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2, r = i % 2 ? 0.035 : 0.11
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r))
  }
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: 0.012, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.01, bevelSegments: 2 })
  g.rotateX(-Math.PI / 2)
  g.deleteAttribute('uv')
  return paint([g], () => [1, 1, 1])
}
function blob(r, lumps) {
  const g = new THREE.IcosahedronGeometry(r, 2)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i)
    v.multiplyScalar(1 + lumps * Math.sin(v.x * 40) * Math.cos(v.z * 37) + lumps * 0.5 * Math.sin(v.y * 53))
    p.setXYZ(i, v.x, Math.max(v.y, -r * 0.2), v.z)
  }
  g.deleteAttribute('uv')
  return paint([g], () => [1, 1, 1])
}

function scatter(scene, geo, mat, count, around, spread, place) {
  const im = new THREE.InstancedMesh(geo, mat, count)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * spread
    const x = around.x + Math.cos(ang) * rr, z = around.z + Math.sin(ang) * rr
    const r = place(i)
    v.set(x, floorY(x, z) + (r.lift || 0), z)
    q.setFromEuler(new THREE.Euler(r.tilt ? (Math.random() - 0.5) * r.tilt : 0, Math.random() * 6.28, r.tilt ? (Math.random() - 0.5) * r.tilt : 0))
    s.setScalar(r.scale)
    m.compose(v, q, s)
    im.setMatrixAt(i, m)
    if (r.color) im.setColorAt(i, r.color)
  }
  scene.add(im)
  return im
}

// ======================= build everything =======================
export function buildLife(scene, at, uTime) {
  const animals = { updaters: [], targets: {} }
  const U = animals.updaters

  // ---- fish schools ----
  const fishGeo = fishGeometry()
  function school(center, count, radius, speed, kind = 'hottentot') {
    const mat = swimMaterial(0.32, { amp: 0.12, k: 4, instanced: true, roughness: 0.35, mat: { map: fishTexture(kind), metalness: 0.25 } })
    const phases = new Float32Array(count).map(() => Math.random() * 6.28)
    const g = fishGeo.clone()
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    const im = new THREE.InstancedMesh(g, mat, count)
    im.frustumCulled = false
    scene.add(im)
    const offs = Array.from({ length: count }, () => V((Math.random() - 0.5) * radius * 2, (Math.random() - 0.5) * radius * 0.8, (Math.random() - 0.5) * radius * 2))
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), d = new THREE.Vector3(), one = V(1, 1, 1)
    const X = V(1, 0, 0)
    U.push((dt, t) => {
      mat.userData.u.uPhase.value = t * 9
      for (let i = 0; i < count; i++) {
        const o = offs[i]
        const a = t * speed + i * 0.013
        // the school wheels around in a big lazy loop; each fish keeps its place in the school
        const cx = center.x + Math.cos(a * 0.35) * 5, cz = center.z + Math.sin(a * 0.35) * 5, cy = center.y + Math.sin(a * 0.5) * 0.8
        p.set(cx + o.x + Math.sin(t * 0.8 + i) * 0.2, cy + o.y, cz + o.z + Math.cos(t * 0.7 + i) * 0.2)
        d.set(-Math.sin(a * 0.35), Math.cos(a * 0.5) * 0.08, Math.cos(a * 0.35)).normalize()
        q.setFromUnitVectors(X, d)
        m.compose(p, q, one)
        im.setMatrixAt(i, m)
      }
      im.instanceMatrix.needsUpdate = true
    })
    return im
  }
  school(V(at.forest.x + 7, -5, 3), 70, 2.2, 0.5, 'strepie')
  school(V(at.reef.x + 10, floorY(at.reef.x + 10, 0) + 2.6, -6), 60, 1.6, -0.45, 'hottentot')
  school(V(at.surface.x + 9, -3, -4), 50, 2, 0.4, 'strepie')

  // single bigger reef fish cruising between the rocks: red romans and galjoen
  const loners = []
  const romanGeo = fishGeometry(0.42, 1.2), galGeo = fishGeometry(0.5, 1.35)
  for (let i = 0; i < 8; i++) {
    const kind = i < 5 ? 'roman' : 'galjoen'
    const mat = swimMaterial(kind === 'roman' ? 0.42 : 0.5, { amp: 0.1, k: 3.5, roughness: 0.35, mat: { map: fishTexture(kind), metalness: 0.2 } })
    const mesh = new THREE.Mesh(kind === 'roman' ? romanGeo : galGeo, mat)
    scene.add(mesh)
    const cx = at.reef.x + 2 + Math.random() * 28, cz = (Math.random() - 0.5) * 10
    const pts = []
    for (let k = 0; k < 5; k++) {
      const x = cx + (Math.random() - 0.5) * 7, z = cz + (Math.random() - 0.5) * 7
      pts.push(V(x, floorY(x, z) + 0.6 + Math.random() * 1.2, z))
    }
    loners.push({ mesh, mat, path: new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5), u: Math.random(), speed: 0.35 + Math.random() * 0.25 })
  }
  {
    const m = new THREE.Matrix4(), up = V(0, 1, 0)
    U.push((dt, t) => {
      for (const f of loners) {
        f.u = (f.u + (f.speed * dt) / f.path.getLength()) % 1
        f.mesh.position.copy(f.path.getPointAt(f.u))
        const d = f.path.getTangentAt(f.u)
        const side = new THREE.Vector3().crossVectors(up, d).normalize()
        m.makeBasis(d, new THREE.Vector3().crossVectors(d, side).normalize(), side.negate())
        f.mesh.quaternion.setFromRotationMatrix(m)
        f.mat.userData.u.uPhase.value = t * 6 + f.speed
      }
    })
  }

  // ---- Cape fur seals ----
  const sealGeo = sealGeometry()
  const seals = []
  for (let i = 0; i < 4; i++) {
    const mat = swimMaterial(1.7, { amp: 0.05, k: 2.2, axis: 1, roughness: 0.45 })
    const mesh = new THREE.Mesh(sealGeo, mat)
    scene.add(mesh)
    const c = at.seals
    const pts = []
    const n = 7
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i * 0.7
      const r = 4 + Math.random() * 3
      pts.push(V(c.x + 6 + Math.cos(a) * r, -2.5 - Math.random() * 5, Math.sin(a) * r * 1.2))
    }
    const path = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
    seals.push({ mesh, mat, path, u: Math.random(), speed: 2.4 + Math.random() * 0.8, roll: 0, spin: 0 })
  }
  {
    const fwd = new THREE.Vector3(), q = new THREE.Quaternion(), X = V(1, 0, 0), up = V(0, 1, 0), m = new THREE.Matrix4()
    U.push((dt, t) => {
      for (const s of seals) {
        const len = s.path.getLength()
        s.u = (s.u + (s.speed * dt) / len) % 1
        s.mesh.position.copy(s.path.getPointAt(s.u))
        fwd.copy(s.path.getTangentAt(s.u))
        const ahead = s.path.getTangentAt((s.u + 0.02) % 1)
        const turn = new THREE.Vector3().crossVectors(fwd, ahead).y // bank into turns
        const side = new THREE.Vector3().crossVectors(up, fwd).normalize()
        const upv = new THREE.Vector3().crossVectors(fwd, side).normalize()
        m.makeBasis(fwd, upv, side.negate())
        q.setFromRotationMatrix(m)
        s.spin = Math.max(0, s.spin - dt)
        const roll = turn * 6 + (s.spin > 0 ? (1 - s.spin / 1.2) * Math.PI * 2 : 0) // barrel roll when tapped
        s.mesh.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(X, roll))
        s.mat.userData.u.uPhase.value = t * 3.2 + s.speed
      }
    })
  }
  animals.seals = seals
  animals.targets.seals = seals.map((s) => s.mesh)

  // ---- rocky reef life ----
  const reef = V(at.reef.x + 4.2, 0, 0)
  const lit = (c) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, ...c })
  const urchins = scatter(scene, urchinGeometry(), lit({ roughness: 0.5 }), 55, reef, 4, () => ({ scale: 1.3 + Math.random() * 0.6, lift: 0.04 }))
  const anemoneColors = [0xb8495e, 0xc77a8c, 0x7aa36e, 0xd9d2c0, 0xb85a3e]
  scatter(scene, anemoneGeometry(), lit({ emissive: 0x16080a }), 45, reef, 4.5, () => ({ scale: 1.4 + Math.random() * 1.4, color: new THREE.Color(anemoneColors[Math.floor(Math.random() * 5)]) }))
  const starColors = [0xc0602c, 0xa83a30, 0x6e4a7a, 0xc0903a, 0x4a6a96]
  scatter(scene, starGeometry(), lit({}), 18, reef, 4.5, () => ({ scale: 1.1 + Math.random() * 0.8, lift: 0.01, tilt: 0.3, color: new THREE.Color(starColors[Math.floor(Math.random() * 5)]) }))
  scatter(scene, blob(0.1, 0.12), lit({ roughness: 0.95 }), 30, reef, 5, () => ({ scale: 0.6 + Math.random() * 1.3, color: new THREE.Color([0x9a6a3a, 0xa8924a, 0x7a4a52, 0x6a5a7a, 0x8a806a][Math.floor(Math.random() * 5)]) }))
  const abalone = scatter(scene, blob(0.07, 0.02), lit({ roughness: 0.6 }), 20, reef, 3, () => ({ scale: 1.3 + Math.random() * 0.6, lift: -0.01, color: new THREE.Color(0x5f6a4a) }))
  abalone.scale.set(1, 0.6, 1)
  animals.targets.urchins = [urchins]

  // seaweed turf: little bushy red, brown and green algae covering the reef
  {
    const tex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 128
      const ctx = c.getContext('2d')
      const branch = (x, y, ang, len, w, d) => {
        if (d > 4 || len < 4) return
        const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len
        ctx.lineWidth = w
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke()
        branch(x2, y2, ang - 0.4 - Math.random() * 0.3, len * 0.72, w * 0.7, d + 1)
        branch(x2, y2, ang + 0.4 + Math.random() * 0.3, len * 0.72, w * 0.7, d + 1)
      }
      ctx.strokeStyle = 'white'
      ctx.lineCap = 'round'
      for (let i = 0; i < 6; i++) branch(40 + Math.random() * 48, 128, (Math.random() - 0.5) * 0.6, 30 + Math.random() * 16, 4, 0)
      return new THREE.CanvasTexture(c)
    })()
    const geo = new THREE.PlaneGeometry(0.3, 0.3)
    geo.translate(0, 0.15, 0)
    const g2 = geo.clone().rotateY(Math.PI / 2)
    const tuft = mergeTwo(geo, g2)
    // light the little bushes as if they were round, not flat cards seen edge-on
    const nrm = tuft.attributes.normal
    for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, 0, 1, 0)
    // a reversed copy so both sides are front faces with the same upward normal (no dark back faces)
    const back = tuft.clone()
    const idx = back.index.array
    for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t }
    const tuftBoth = mergeTwo(tuft, back)
    const mat = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.4, roughness: 0.85, emissive: 0x1a1810 })
    const cols = [0x8a2e2e, 0x6e4a2a, 0x7a7a2c, 0x9a5a3a, 0x5a6a2e, 0xa04050]
    const N = 3600
    const im = new THREE.InstancedMesh(tuftBoth, mat, N)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), v = new THREE.Vector3()
    let n = 0, tries = 0
    while (n < N && tries++ < 40000) {
      const x = at.reef.x - 6 + Math.random() * 60, z = (Math.random() - 0.5) * 26
      if (reefinessAt(x, z) < 0.35) continue
      v.set(x, floorY(x, z) - 0.02, z)
      q.setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.4, Math.random() * 6.28, (Math.random() - 0.5) * 0.4))
      sc.set(0.5 + Math.random() * 0.9, 0.35 + Math.random() * 0.7, 0.5 + Math.random() * 0.9)
      m.compose(v, q, sc)
      im.setMatrixAt(n, m)
      im.setColorAt(n, new THREE.Color(cols[Math.floor(Math.random() * cols.length)]).multiplyScalar(0.8 + Math.random() * 0.5))
      n++
    }
    im.count = n
    scene.add(im)
  }

  // ---- octopus in its den ----
  const octo = new THREE.Group()
  const ox = at.octopus.x + 2.8, oz = 0.3
  octo.position.set(ox, floorY(ox, oz) + 0.3, oz)
  octo.rotation.y = Math.PI * 0.9 // looking towards you
  octo.scale.setScalar(1.7)
  const octoMat = octopusMaterial()
  const octoMesh = new THREE.Mesh(octopusGeometry(), octoMat)
  octoMesh.frustumCulled = false
  octo.add(octoMesh)
  for (const s of [1, -1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshStandardMaterial({ color: 0xe8d8a0, roughness: 0.3 }))
    eye.position.set(0.09, 0.06, s * 0.065)
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.004, 0.03), new THREE.MeshBasicMaterial({ color: 0x050505 }))
    pupil.position.set(0.11, 0.065, s * 0.07)
    octo.add(eye, pupil)
  }
  // a den of rocks around it, with shells it has collected
  const denMat = withCaustics(new THREE.MeshStandardMaterial({ color: 0x2c2a24, roughness: 0.95 }), uTime, 'den', true)
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI * 0.45 + (i / 5) * Math.PI * 0.9 // the den opens towards you
    const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 + Math.random() * 0.3, 2), denMat)
    r.position.set(ox + 0.9 + Math.cos(a) * 1.0, floorY(ox, oz) + 0.25, oz + Math.sin(a) * 1.0)
    r.scale.set(1, 0.7, 1)
    scene.add(r)
  }
  scene.add(octo)
  const octoState = { flash: 0 }
  U.push((dt, t) => {
    octoMat.userData.u.uTime.value = t
    octoState.flash = Math.max(0, octoState.flash - dt * 0.25)
    const f = octoState.flash
    octoMat.userData.u.uFlash.value = f > 0 ? Math.min(1, Math.sin(Math.min(1, (4 - f * 4) / 4) * Math.PI) * 1.1) : 0
    octoMat.userData.u.uCurl.value = f > 0.6 ? 1 : f * 0.5
    octo.position.y = floorY(ox, oz) + 0.3 + Math.sin(t * 0.9) * 0.03 // breathing
  })
  animals.octopus = { flash() { octoState.flash = 1 } }
  animals.targets.octopus = [octoMesh]

  // ---- shysharks and a pyjama shark resting on the reef ----
  const shyGeo = shysharkGeometry()
  const shys = []
  const sx = at.shysharks.x + 3.4
  for (const [dx, dz, ry] of [[0, 0.5, 2.6], [0.9, -0.7, 3.6], [-0.4, -1.1, 2.0]]) {
    const mat = swimMaterial(0.62, { amp: 0.02, k: 2 })
    const m = new THREE.Mesh(shyGeo, mat)
    m.position.set(sx + dx, floorY(sx + dx, dz) + 0.05, dz)
    m.rotation.y = ry
    m.scale.setScalar(1.7)
    scene.add(m)
    shys.push({ mesh: m, mat, curl: 0, target: 0, timer: 0 })
  }
  const pj = new THREE.Mesh(pyjamaGeometry(), swimMaterial(0.95, { amp: 0.015, k: 2 }))
  pj.position.set(sx + 1.8, floorY(sx + 1.8, 1.4) + 0.08, 1.4)
  pj.scale.setScalar(1.3)
  pj.rotation.y = 2.2
  scene.add(pj)
  U.push((dt, t) => {
    for (const s of shys) {
      s.timer = Math.max(0, s.timer - dt)
      s.target = s.timer > 0 ? 1 : 0
      s.curl += (s.target - s.curl) * Math.min(1, dt * 1.8)
      s.mat.userData.u.uCurl.value = s.curl
      s.mat.userData.u.uPhase.value = t * 1.2 // slow breathing ripple
    }
    pj.material.userData.u.uPhase.value = t
  })
  animals.shysharks = { scare() { for (const s of shys) s.timer = 6 } }
  animals.targets.shysharks = shys.map((s) => s.mesh)

  // ---- broadnose sevengill sharks cruising over the sand ----
  const sevenGeo = sevengillGeometry()
  const sevens = []
  for (let i = 0; i < 2; i++) {
    const mat = swimMaterial(2.6, { amp: 0.07, k: 3.2, roughness: 0.5 })
    const mesh = new THREE.Mesh(sevenGeo, mat)
    scene.add(mesh)
    const c = at.sevengill
    const pts = []
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + i * Math.PI
      pts.push(V(c.x + 7 + Math.cos(a) * (3.5 + i * 2), floorY(c.x + 7, 0) + 1.4 + Math.sin(a * 2) * 0.4 + i * 0.9, Math.sin(a) * (3 + i * 1.5)))
    }
    sevens.push({ mesh, mat, path: new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5), u: i * 0.5, speed: 1.2 })
  }
  {
    const m = new THREE.Matrix4(), up = V(0, 1, 0)
    U.push((dt, t) => {
      for (const s of sevens) {
        s.u = (s.u + (s.speed * dt) / s.path.getLength()) % 1
        s.mesh.position.copy(s.path.getPointAt(s.u))
        const f = s.path.getTangentAt(s.u)
        const side = new THREE.Vector3().crossVectors(up, f).normalize()
        const u2 = new THREE.Vector3().crossVectors(f, side).normalize()
        m.makeBasis(f, u2, side.negate())
        s.mesh.quaternion.setFromRotationMatrix(m)
        s.mat.userData.u.uPhase.value = t * 2.2
      }
    })
  }
  animals.sevengill = { slow() { for (const s of sevens) s.speed = 0.6; setTimeout(() => sevens.forEach((s) => (s.speed = 1.2)), 6000) } }
  animals.targets.sevengill = sevens.map((s) => s.mesh)

  animals.update = (dt, t) => { for (const u of U) u(dt, t) }
  return animals
}
