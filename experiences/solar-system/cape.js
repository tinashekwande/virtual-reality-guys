import * as THREE from 'three'

// Flying down from space to Cape Town. Everything here is measured in kilometres, in a local frame centred on
// the Cape Peninsula (x = east, y = up, z = south). The whole world group is re-scaled every frame so that the
// ground always sits a sensible distance from you, which keeps the picture sharp from 9 000 km up to 15 km.

const R = 6371
const DEG = Math.PI / 180
const G0 = { lat: -33.96, lon: 18.4 }
const CAPE = { lon0: 17.8, lon1: 19.4, lat0: -34.45, lat1: -33.5 }
const REGION = { lon0: 12, lon1: 26, lat0: -36, lat1: -28 }
const PEN = { lon0: 18.30, lon1: 18.56, lat0: -34.20, lat1: -33.88 } // fine detail around Table Mountain
const EXAG = 1.5 // mountains drawn 1.5x taller so they read well from high up
const TEX = new URL('../textures/cape/', location.href).href

function dirOf(lat, lon) {
  const th = (90 - lat) * DEG, ph = ((lon + 180) / 360) * Math.PI * 2
  return new THREE.Vector3(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th))
}
const U0 = dirOf(G0.lat, G0.lon)
const E0 = dirOf(G0.lat, G0.lon + 0.01).sub(dirOf(G0.lat, G0.lon - 0.01)).normalize()
const N0 = new THREE.Vector3().crossVectors(U0, E0).normalize() // points north
/** Local position (km) of a place at height hKm above sea level. */
export function local(lat, lon, hKm = 0) {
  const p = dirOf(lat, lon).multiplyScalar(R + hKm).sub(U0.clone().multiplyScalar(R))
  return new THREE.Vector3(p.dot(E0), p.dot(U0), -p.dot(N0))
}

// the path: from far out in space, curving down to hover 7 km above the Atlantic, west of Table Mountain
const A0 = 9000, A1 = 7
const TH0 = 0.62, TH1 = Math.asin(19 / (R + A1))
const ease = (t) => t * t * t * (t * (6 * t - 15) + 10)
function pathAt(s) {
  const e = ease(Math.min(1, Math.max(0, s)))
  const a = Math.exp(Math.log(A0) * (1 - e) + Math.log(A1) * e)
  const th = Math.exp(Math.log(TH0) * (1 - e) + Math.log(TH1) * e)
  return { a, H: new THREE.Vector3(-(R + a) * Math.sin(th), -R + (R + a) * Math.cos(th), 0) }
}

const SUN_DIR = new THREE.Vector3(-0.41, 0.574, -0.709).normalize() // afternoon sun from the north-north-west, lighting the slopes you look at

/**
 * A curved patch of ground. uvB: the bounds its texture covers (defaults to its own). hole: bounds where a finer
 * patch takes over (made see-through and tucked slightly under).
 */
function patchGeometry(b, GW, GH, heights, baseKm, edge = 0.06, uvB = b, hole = null) {
  const pos = new Float32Array(GW * GH * 3), uv = new Float32Array(GW * GH * 2), col = new Float32Array(GW * GH * 4)
  for (let gy = 0; gy < GH; gy++) {
    const v = 1 - gy / (GH - 1)
    const lat = b.lat0 + v * (b.lat1 - b.lat0)
    for (let gx = 0; gx < GW; gx++) {
      const u = gx / (GW - 1)
      const lon = b.lon0 + u * (b.lon1 - b.lon0)
      const i = gy * GW + gx
      let h = baseKm
      if (heights) { const m = heights[i]; h += m > 0 ? (m * EXAG) / 1000 : 0 }
      let fade = Math.min(1, Math.min(u, 1 - u, v, 1 - v) / edge)
      fade = fade * fade * (3 - 2 * fade)
      if (hole) {
        const hu = (lon - hole.lon0) / (hole.lon1 - hole.lon0), hv = (lat - hole.lat0) / (hole.lat1 - hole.lat0)
        const inside = Math.min(hu, 1 - hu, hv, 1 - hv)
        if (inside > 0) { fade *= 1 - Math.min(1, Math.max(0, inside - 0.02) / 0.06); h -= 0.04 * Math.min(1, inside / 0.06) }
      }
      const p = local(lat, lon, h)
      pos.set([p.x, p.y, p.z], i * 3)
      uv.set([(lon - uvB.lon0) / (uvB.lon1 - uvB.lon0), (lat - uvB.lat0) / (uvB.lat1 - uvB.lat0)], i * 2)
      col.set([1, 1, 1, fade], i * 4)
    }
  }
  const idx = []
  for (let gy = 0; gy < GH - 1; gy++) for (let gx = 0; gx < GW - 1; gx++) {
    const a = gy * GW + gx, b2 = a + 1, c = a + GW, d = c + 1
    idx.push(a, c, b2, b2, c, d)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setAttribute('color', new THREE.BufferAttribute(col, 4))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function labelSprite(text, sub) {
  const c = document.createElement('canvas')
  c.width = 640
  c.height = sub ? 176 : 112
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(8,14,28,0.72)'
  ctx.beginPath()
  ctx.roundRect(6, 6, 628, c.height - 12, 36)
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 56px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText(text, 320, sub ? 66 : 58, 600)
  if (sub) { ctx.fillStyle = '#9fd8ff'; ctx.font = '38px "Trebuchet MS", system-ui, sans-serif'; ctx.fillText(sub, 320, 130, 600) }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false }))
  s.renderOrder = 30
  s.userData.aspect = c.width / c.height
  return s
}

function cloudPuffTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  for (let i = 0; i < 26; i++) {
    const x = 64 + (Math.random() - 0.5) * 60, y = 64 + (Math.random() - 0.5) * 40, r = 14 + Math.random() * 26
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.5)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
  }
  return new THREE.CanvasTexture(c)
}

export function buildCape({ earthMap, skyTex, renderer }) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0xb7c8dc, 0)
  const world = new THREE.Group()
  scene.add(world)
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  const loader = new THREE.TextureLoader()
  const loadTex = (name, color = true) => new Promise((res) => loader.load(TEX + name, (t) => { if (color) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; res(t) }, undefined, () => res(null)))

  // ---- light ----
  const sun = new THREE.DirectionalLight(0xfff4e6, 3.0)
  sun.position.copy(SUN_DIR).multiplyScalar(100)
  scene.add(sun)
  scene.add(new THREE.HemisphereLight(0xa8c8ff, 0x5e5444, 0.55))

  // ---- sky: black space far up, deep blue and hazy horizon lower down ----
  const skyMat = new THREE.ShaderMaterial({
    uniforms: { uStars: { value: skyTex }, uAlt: { value: A0 }, uSun: { value: SUN_DIR }, uDip: { value: 0 } },
    vertexShader: `varying vec3 vDir; varying vec2 vUv; void main(){ vDir = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D uStars; uniform float uAlt; uniform vec3 uSun; uniform float uDip; varying vec3 vDir; varying vec2 vUv;
      void main(){
        vec3 d = normalize(vDir);
        float el = asin(clamp(d.y, -1.0, 1.0)) + uDip; // height above the true horizon
        float air = 1.0 - smoothstep(25.0, 110.0, uAlt);
        vec3 zen = mix(vec3(0.015, 0.04, 0.14), vec3(0.12, 0.3, 0.66), smoothstep(40.0, 4.0, uAlt));
        vec3 hor = vec3(0.68, 0.8, 0.93);
        vec3 sky = mix(zen, hor, exp(-max(el, 0.0) * 5.0));
        float s = max(dot(d, uSun), 0.0);
        sky += vec3(1.0, 0.92, 0.75) * (pow(s, 12.0) * 0.18);
        vec3 stars = texture2D(uStars, vUv).rgb * 0.85;
        vec3 col = mix(stars, sky, air);
        // the thin blue line of the atmosphere seen edge-on from space
        col += vec3(0.3, 0.55, 1.0) * exp(-abs(el) * 45.0) * (1.0 - air) * 0.7;
        col += vec3(1.0, 0.96, 0.85) * pow(s, 900.0) * 3.0; // the Sun's disc
        gl_FragColor = vec4(col, 1.0);
      }`,
    side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: true,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1800, 64, 32), skyMat)
  sky.renderOrder = -10
  scene.add(sky)

  // ---- the whole Earth (seen from far away and beyond the detailed patches) ----
  const globeMat = new THREE.MeshStandardMaterial({ map: earthMap, roughness: 0.75, metalness: 0 })
  const globe = new THREE.Mesh(new THREE.SphereGeometry(R - 5, 192, 110), globeMat)
  const rot = new THREE.Matrix4().set(E0.x, E0.y, E0.z, 0, U0.x, U0.y, U0.z, 0, -N0.x, -N0.y, -N0.z, 0, 0, 0, 0, 1)
  globe.quaternion.setFromRotationMatrix(rot)
  globe.position.set(0, -R, 0)
  world.add(globe)
  // glowing air around the planet's edge (only from space)
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { uSun: { value: SUN_DIR }, uOn: { value: 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vWN; void main(){ vN = normalize(normalMatrix * normal); vWN = normalize(mat3(modelMatrix) * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uSun; uniform float uOn; varying vec3 vN; varying vec3 vV; varying vec3 vWN;
      void main(){ float rim = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0); float lit = smoothstep(-0.3, 0.4, dot(normalize(vWN), uSun));
        gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * pow(rim, 4.0) * 1.6 * lit * uOn, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  })
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R + 70, 128, 64), atmoMat)
  atmo.position.set(0, -R, 0)
  world.add(atmo)

  // ---- detailed patches, loaded when needed ----
  const labels = []
  const puffs = []
  let ready = null
  function load() {
    if (ready) return ready
    ready = (async () => {
      const [regionMap, regionN, detailMap, detailN, detailRough, detailAlpha, hBuf, penBuf] = await Promise.all([
        loadTex('region.jpg'), loadTex('region_n.jpg', false), loadTex('detail.jpg'), loadTex('detail_n.jpg', false), loadTex('detail_rough.jpg', false), loadTex('detail_a.jpg', false),
        fetch(TEX + 'detail_h.bin').then((r) => r.arrayBuffer()),
        fetch(TEX + 'pen_h.bin').then((r) => r.arrayBuffer()),
      ])
      const region = new THREE.Mesh(
        patchGeometry(REGION, 180, 104, null, -0.3, 0.16),
        new THREE.MeshStandardMaterial({ map: regionMap, normalMap: regionN, normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.8, metalness: 0, vertexColors: true, transparent: true }),
      )
      region.renderOrder = 1
      world.add(region)
      const heights = new Int16Array(hBuf)
      const detailMat = new THREE.MeshStandardMaterial({ map: detailMap, normalMap: detailN, roughnessMap: detailRough, alphaMap: detailAlpha, roughness: 1, metalness: 0, vertexColors: true, transparent: true })
      const detail = new THREE.Mesh(patchGeometry(CAPE, 321, 241, heights, 0, 0.05, CAPE, PEN), detailMat)
      detail.renderOrder = 2
      world.add(detail)
      // finer ground around Table Mountain so its flat top and cliffs come out properly
      const pen = new THREE.Mesh(patchGeometry(PEN, 241, 321, new Int16Array(penBuf), 0, 0.08, CAPE), detailMat)
      pen.renderOrder = 3
      world.add(pen)

      // place names
      const place = (text, sub, lat, lon, hKm) => {
        const s = labelSprite(text, sub)
        s.position.copy(local(lat, lon, hKm))
        world.add(s)
        labels.push(s)
      }
      place('Table Mountain', '1 085 m high', -33.9575, 18.405, 1.085 * EXAG + 0.9)
      place("Lion's Head", null, -33.9351, 18.389, 0.67 * EXAG + 0.6)
      place('Cape Town', 'city centre', -33.922, 18.423, 0.9)
      place('Robben Island', null, -33.806, 18.366, 0.6)
      place('Cape Point', null, -34.357, 18.497, 0.9)
      place('False Bay', null, -34.2, 18.65, 0.5)
      place('Stellenbosch', null, -33.935, 18.86, 0.9)
      place('Table Bay', null, -33.87, 18.43, 0.4)
      place('Atlantic Ocean', null, -34.05, 18.15, 0.4)

      // the "tablecloth": cloud pouring over the top of Table Mountain
      const pt = cloudPuffTexture()
      for (let i = 0; i < 34; i++) {
        const t = i / 33
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: pt, transparent: true, depthWrite: false, opacity: 0, fog: true }))
        s.userData = { t, phase: Math.random(), size: 0.6 + Math.random() * 0.5 }
        s.renderOrder = 10 // after the ground patches, which are see-through at their edges
        world.add(s)
        puffs.push(s)
      }
    })()
    return ready
  }

  let mode = 'idle'
  let s = 0
  let onDone = null
  const head = new THREE.Vector3()
  const tmp = new THREE.Vector3()

  function frame(rig, camera, dt, t) {
    if (mode === 'down') { s = Math.min(1, s + dt / 24); if (s >= 1) { mode = 'hover'; const f = onDone; onDone = null; f && f() } }
    else if (mode === 'up') { s = Math.max(0, s - dt / 13); if (s <= 0) { mode = 'idle'; const f = onDone; onDone = null; f && f() } }
    const { a, H } = pathAt(s)
    const k = 200 / a
    head.copy(rig.position).add(new THREE.Vector3(0, 1.6, 0))
    world.scale.setScalar(k)
    world.position.copy(head).addScaledVector(H, -k)
    sky.position.copy(rig.position)
    // haze thickens as you get lower
    const dens = 0.0085 * Math.pow(Math.min(1, 30 / a), 0.9)
    scene.fog.density = dens / k
    skyMat.uniforms.uAlt.value = a
    skyMat.uniforms.uDip.value = Math.acos(R / (R + a))
    atmoMat.uniforms.uOn.value = THREE.MathUtils.smoothstep(a, 60, 160)
    // place names keep a readable size and only show close in
    const showLabels = 1 - THREE.MathUtils.smoothstep(a, 60, 140)
    camera.getWorldPosition(tmp)
    for (const l of labels) {
      l.visible = showLabels > 0.02
      l.material.opacity = showLabels
      const d = l.getWorldPosition(new THREE.Vector3()).distanceTo(tmp)
      const w = (d * 0.16) / k
      l.scale.set(w, w / l.userData.aspect, 1)
    }
    // tablecloth puffs drift north over the edge and sink down the face
    const A = [-33.9545, 18.392], B = [-33.9575, 18.42]
    for (const p of puffs) {
      const ph = (p.userData.phase + t * 0.035) % 1
      const lat = A[0] + (B[0] - A[0]) * p.userData.t + 0.006 - ph * 0.012
      const lon = A[1] + (B[1] - A[1]) * p.userData.t
      const h = (1.06 * EXAG + 0.22 - Math.max(0, ph - 0.45) * 1.2) // over the top, then pouring down the front
      p.position.copy(local(lat, lon, h))
      p.scale.setScalar(p.userData.size)
      p.material.opacity = Math.sin(ph * Math.PI) * 0.9 * showLabels
    }
  }

  return {
    scene,
    start: { position: new THREE.Vector3(0, 0, 0), yaw: -Math.PI / 2 },
    load,
    altitude: () => pathAt(s).a,
    descend(then) { s = 0; mode = 'down'; onDone = then },
    ascend(then) { mode = 'up'; onDone = then },
    reset() { s = 0; mode = 'idle' },
    skip() { if (mode === 'down') s = 0.999 },
    /** for testing: jump to a point along the descent (0 = space, 1 = 15 km up) */
    setProgress(v) { s = v },
    get mode() { return mode },
    update: frame,
  }
}
