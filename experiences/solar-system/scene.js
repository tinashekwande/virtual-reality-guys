import * as THREE from 'three'

// Builds the Solar System: realistic textures (generated at build time, see tools/gen-textures.mjs),
// glowing atmospheres, an animated Sun, moons, an asteroid belt, stars and the Milky Way.
// Sizes and distances are chosen to look good in VR, not to scale.

export const EYE = 1.6
const TEX = new URL('../textures/solar/', import.meta.url).href

export const SPEC = {
  sun: { r: 12, x: 0 },
  mercury: { a: 25, r: 1.2, x: 34, spin: 0.06, tilt: 0.03, atmo: null },
  venus: { a: -35, r: 2.2, x: 52, spin: -0.03, tilt: 0.05, atmo: [1.0, 0.85, 0.55, 0.9] },
  earth: { a: 15, r: 2.4, x: 72, spin: 0.12, tilt: 0.41, atmo: [0.35, 0.6, 1.0, 1.2] },
  mars: { a: -20, r: 1.6, x: 90, spin: 0.12, tilt: 0.44, atmo: [1.0, 0.55, 0.35, 0.5] },
  jupiter: { a: 35, r: 7, x: 150, spin: 0.25, tilt: 0.05, atmo: [1.0, 0.85, 0.7, 0.5] },
  saturn: { a: -25, r: 5.6, x: 195, spin: 0.22, tilt: 0.47, atmo: [1.0, 0.9, 0.7, 0.45] },
  uranus: { a: 30, r: 3.4, x: 232, spin: 0.15, tilt: 1.7, atmo: [0.6, 0.95, 1.0, 0.8] },
  neptune: { a: -15, r: 3.3, x: 262, spin: 0.16, tilt: 0.49, atmo: [0.45, 0.6, 1.0, 0.9] },
}

/** Where a body sits: x = distance from the Sun, a = angle around its orbit (degrees). */
export function posOf(id) {
  const s = SPEC[id]
  const a = ((s.a || 0) * Math.PI) / 180
  return new THREE.Vector3(Math.cos(a) * s.x, EYE, Math.sin(a) * s.x)
}

/** High viewpoint above and behind the Sun where the whole solar system is spread out ahead of you. */
export const OVERVIEW = new THREE.Vector3(-150, 62, 0)

/** Where to stand for a stop: on the Sun side, looking at the planet. */
export function placeFor(id) {
  const s = SPEC[id]
  const dist = s.r * (id === 'sun' ? 2.4 : 3.2) + 4
  const p = posOf(id)
  // always look along +x at the planet, so the view never has to turn between stops
  return { position: new THREE.Vector3(p.x - dist, 0, p.z), yaw: -Math.PI / 2 }
}

export function buildScene(app, manager) {
  const { scene, renderer, rig, camera } = app
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const loader = new THREE.TextureLoader(manager)
  const tex = (name, color = true) => {
    const t = loader.load(TEX + name + '.jpg')
    if (color) t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    return t
  }
  const updaters = []
  const sunPos = new THREE.Vector3(0, EYE, 0)

  // ---------------- sky ----------------
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(950, 64, 32),
    new THREE.MeshBasicMaterial({ map: tex('sky'), side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false, color: 0xdddddd }),
  )
  sky.renderOrder = -10
  scene.add(sky)
  updaters.push(() => sky.position.copy(rig.position)) // sky follows you, so it feels infinitely far

  // twinkling stars of different colours and sizes
  {
    const n = 3500
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), phase = new Float32Array(n)
    const palette = [[0.75, 0.82, 1], [1, 1, 1], [1, 0.95, 0.85], [1, 0.82, 0.62], [1, 0.7, 0.55]]
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(900)
      pos.set([v.x, v.y, v.z], i * 3)
      const c = palette[Math.floor(Math.random() * palette.length)]
      col.set(c, i * 3)
      size[i] = Math.random() < 0.04 ? 3.2 + Math.random() * 2 : 1.2 + Math.random() * 1.6
      phase[i] = Math.random() * 100
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    g.setAttribute('size', new THREE.BufferAttribute(size, 1))
    g.setAttribute('phase', new THREE.BufferAttribute(phase, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `attribute float size; attribute float phase; attribute vec3 color; varying vec3 vC; varying float vA; uniform float uTime;
        void main(){ vC = color; vA = 0.7 + 0.3 * sin(uTime * (1.5 + fract(phase) * 2.5) + phase);
          gl_PointSize = size; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec3 vC; varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.0, length(d)); gl_FragColor = vec4(vC * vA, a); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(g, mat)
    stars.frustumCulled = false
    scene.add(stars)
    updaters.push((dt, t) => { mat.uniforms.uTime.value = t; stars.position.copy(rig.position) })
  }

  // shooting stars every few seconds
  {
    const pool = []
    for (let i = 0; i < 3; i++) {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array([1, 1, 1, 1, 0.6, 0.8, 1, 0]), 4))
      const line = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
      line.visible = false
      line.frustumCulled = false
      scene.add(line)
      pool.push({ line, t: 0, life: 0, a: new THREE.Vector3(), b: new THREE.Vector3() })
    }
    let next = 3
    updaters.push((dt) => {
      next -= dt
      if (next <= 0) {
        next = 4 + Math.random() * 7
        const s = pool.find((p) => !p.line.visible)
        if (s) {
          // spawn roughly in front of the player, high up
          const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()))
          const dir = fwd.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.35 + Math.random() * 0.5, (Math.random() - 0.5) * 1.6)).normalize()
          s.a.copy(dir).multiplyScalar(400).add(rig.position)
          s.b.set(Math.random() - 0.5, -0.4 - Math.random() * 0.4, Math.random() - 0.5).normalize().multiplyScalar(160)
          s.t = 0
          s.life = 0.9 + Math.random() * 0.6
          s.line.visible = true
        }
      }
      for (const s of pool) {
        if (!s.line.visible) continue
        s.t += dt
        const k = s.t / s.life
        if (k >= 1) { s.line.visible = false; continue }
        const head = s.a.clone().addScaledVector(s.b, k)
        const tail = s.a.clone().addScaledVector(s.b, Math.max(0, k - 0.25))
        const p = s.line.geometry.attributes.position
        p.setXYZ(0, head.x, head.y, head.z)
        p.setXYZ(1, tail.x, tail.y, tail.z)
        p.needsUpdate = true
        s.line.material.opacity = Math.sin(k * Math.PI)
      }
    })
  }

  // ---------------- lighting ----------------
  scene.add(new THREE.AmbientLight(0x8090b0, 0.16))
  const sunLight = new THREE.PointLight(0xfff4e0, 3.2, 0, 0)
  sunLight.position.copy(sunPos)
  scene.add(sunLight)

  // ---------------- the Sun ----------------
  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `${SIMPLEX}
      uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 p = normalize(vP);
        float n = snoise(p * 3.0 + vec3(uTime * 0.03, 0.0, uTime * 0.02)) * 0.5
                + snoise(p * 9.0 - vec3(0.0, uTime * 0.06, 0.0)) * 0.3
                + snoise(p * 24.0 + vec3(uTime * 0.1)) * 0.2;
        float spots = smoothstep(0.8, 0.9, snoise(p * 5.0 + vec3(0.0, uTime * 0.01, 0.0)));
        vec3 col = mix(vec3(1.0, 0.42, 0.06), vec3(1.0, 0.86, 0.45), 0.55 + 0.45 * n);
        col = mix(col, vec3(0.6, 0.2, 0.03), spots * 0.45);
        float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        col *= 0.55 + 0.6 * pow(mu, 0.45);
        col = mix(vec3(1.0, 0.35, 0.05), col, smoothstep(0.0, 0.35, mu));
        gl_FragColor = vec4(col * 1.25, 1.0);
      }`,
    toneMapped: false,
  })
  const sun = new THREE.Mesh(new THREE.SphereGeometry(SPEC.sun.r, 96, 64), sunMat)
  sun.position.copy(sunPos)
  scene.add(sun)
  const glowA = sprite(glowTexture([255, 210, 120], [255, 120, 20]), 62, sunPos)
  const glowB = sprite(glowTexture([255, 170, 80], [255, 90, 10], 0.35), 120, sunPos)
  const rays = sprite(raysTexture(), 90, sunPos)
  scene.add(glowA, glowB, rays)
  updaters.push((dt, t) => {
    sunMat.uniforms.uTime.value = t
    sun.rotation.y += dt * 0.01
    const pulse = 1 + 0.03 * Math.sin(t * 0.8) + 0.015 * Math.sin(t * 2.3)
    glowA.scale.setScalar(62 * pulse)
    glowB.scale.setScalar(120 * (2 - pulse))
    rays.material.rotation += dt * 0.01
  })

  // ---------------- planets ----------------
  const bodies = {}
  const tilts = {}
  const labels = []
  const spinners = []
  function planet(id, material) {
    const s = SPEC[id]
    const tiltGroup = new THREE.Group()
    tiltGroup.position.copy(posOf(id))
    tiltGroup.rotation.z = s.tilt * 0.8
    tiltGroup.rotation.x = s.tilt * 0.6
    scene.add(tiltGroup)
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(s.r, 96, 64), material)
    mesh.name = id
    tiltGroup.add(mesh)
    if (s.atmo) tiltGroup.add(atmosphere(s.r, s.atmo, sunPos))
    bodies[id] = mesh
    tilts[id] = tiltGroup
    spinners.push({ mesh, speed: s.spin, boost: 0 })
    const lab = label(id, s)
    labels.push(lab)
    scene.add(lab)
    return mesh
  }
  const std = (name, opts = {}) => new THREE.MeshStandardMaterial({ map: tex(name), roughness: 1, metalness: 0, ...opts })

  planet('mercury', std('mercury', { bumpMap: tex('mercury_bump', false), bumpScale: 3 }))
  planet('venus', std('venus'))
  // Earth: city lights only on the night side, shiny oceans, moving clouds
  const earthMat = std('earth', {
    bumpMap: tex('earth_bump', false), bumpScale: 2.5, roughnessMap: tex('earth_rough', false),
    emissive: 0xffc47a, emissiveMap: tex('earth_night'), emissiveIntensity: 1.8,
  })
  nightSideOnly(earthMat, sunPos)
  const earth = planet('earth', earthMat)
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(SPEC.earth.r * 1.012, 96, 64),
    new THREE.MeshStandardMaterial({ color: 0xffffff, alphaMap: tex('earth_clouds', false), transparent: true, depthWrite: false, roughness: 1 }),
  )
  tilts.earth.add(clouds)
  spinners.push({ mesh: clouds, speed: 0.16, boost: 0 })
  planet('mars', std('mars', { bumpMap: tex('mars_bump', false), bumpScale: 3 }))
  planet('jupiter', std('jupiter'))
  planet('saturn', std('saturn'))
  planet('uranus', std('uranus'))
  planet('neptune', std('neptune'))

  // Saturn's rings (with the planet's shadow falling across them) and Uranus's faint rings
  tilts.saturn.add(rings(SPEC.saturn.r * 1.24, SPEC.saturn.r * 2.3, saturnRingTexture(), bodies.saturn, sunPos, 1))
  tilts.uranus.add(rings(SPEC.uranus.r * 1.6, SPEC.uranus.r * 2.0, faintRingTexture(), bodies.uranus, sunPos, 0.5))

  // ---------------- moons ----------------
  const moonsOf = {}
  const moonMat = (name, bump) => std(name, bump ? { bumpMap: tex(name + '_bump', false), bumpScale: 2 } : {})
  addMoon('earth', moonMat('moon', true), 0.6, 6.2, 0.05, 0.25, null, 1.2)
  addMoon('mars', moonMat('rockmoon'), 0.22, 3.0, 0.14, 0.1, [1, 0.75, 0.85])
  addMoon('mars', moonMat('rockmoon'), 0.15, 4.6, 0.09, -0.2, [1, 0.8, 0.9])
  addMoon('jupiter', moonMat('io'), 0.55, 10.5, 0.12, 0.05)
  addMoon('jupiter', moonMat('europa'), 0.48, 13, 0.09, 0.12)
  addMoon('jupiter', moonMat('ganymede'), 0.8, 16.5, 0.07, -0.08)
  addMoon('jupiter', moonMat('callisto'), 0.72, 18.5, 0.05, 0.15)
  addMoon('saturn', moonMat('titan'), 0.7, 14, 0.06, 0.35, null, 2.4)
  addMoon('neptune', moonMat('triton'), 0.45, 7.5, -0.08, 0.3)
  function addMoon(parent, mat, r, dist, speed, incline, squash, startAngle = Math.random() * 6.28) {
    const pivot = new THREE.Group()
    ;(moonsOf[parent] ||= []).push(pivot)
    speed = -Math.abs(speed) // all moons drift away from the viewer first after arranging
    pivot.position.copy(tilts[parent].position)
    pivot.rotation.z = incline
    pivot.rotation.y = startAngle
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), mat)
    if (squash) m.scale.set(...squash)
    m.position.set(0, 0, -dist)
    pivot.add(m)
    scene.add(pivot)
    spinners.push({ mesh: pivot, speed, boost: 0 })
  }

  // ---------------- asteroid belt between Mars and Jupiter ----------------
  {
    const geo = new THREE.IcosahedronGeometry(1, 1)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const k = 0.75 + Math.random() * 0.45
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.8, p.getZ(i) * k)
    }
    geo.computeVertexNormals()
    const count = 1100
    const belt = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0x8c8074, roughness: 1, flatShading: true }), count)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const rad = 99 + Math.random() * 12 + (Math.random() - 0.5) * 3
      v.set(Math.cos(a) * rad, (Math.random() - 0.5) * 3 * (0.5 + Math.random()), Math.sin(a) * rad)
      e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
      q.setFromEuler(e)
      const s = 0.06 + Math.pow(Math.random(), 3) * 0.55
      sc.set(s, s, s)
      m.compose(v, q, sc)
      belt.setMatrixAt(i, m)
      belt.setColorAt(i, new THREE.Color().setHSL(0.07 + Math.random() * 0.04, 0.15 + Math.random() * 0.15, 0.3 + Math.random() * 0.25))
    }
    const beltGroup = new THREE.Group()
    beltGroup.position.copy(sunPos)
    beltGroup.add(belt)
    scene.add(beltGroup)
    updaters.push((dt) => (beltGroup.rotation.y += dt * 0.004))
  }

  // faint orbit lines (brighter when you are high above the system)
  const orbitMats = []
  for (const [id, s] of Object.entries(SPEC)) {
    if (id === 'sun') continue
    const pts = []
    for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * s.x, 0, Math.sin(a) * s.x)) }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x7fb4ff, transparent: true, opacity: 0.12, depthWrite: false }))
    orbitMats.push(line.material)
    line.position.copy(sunPos)
    scene.add(line)
  }

  // ---------------- your observation platform ----------------
  {
    const pad = new THREE.Group()
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.05, 0.06, 72), new THREE.MeshStandardMaterial({ color: 0x182235, metalness: 0.7, roughness: 0.35, emissive: 0x0a1424, emissiveMap: gridTexture(), emissiveIntensity: 3 }))
    base.position.y = -0.035
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.018, 12, 96), new THREE.MeshBasicMaterial({ color: 0x22d3ee, toneMapped: false }))
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.0
    const glow = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), new THREE.MeshBasicMaterial({ map: glowTexture([60, 200, 255], [0, 80, 160], 0.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.45 }))
    glow.rotation.x = -Math.PI / 2
    glow.position.y = -0.09
    pad.add(base, rim, glow)
    rig.add(pad)
    updaters.push((dt, t) => (rim.material.color.setHSL(0.52, 0.85, 0.5 + 0.08 * Math.sin(t * 1.6))))
  }

  // ---------------- destination marker (seen from the overview) ----------------
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTexture(), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  marker.renderOrder = 15
  marker.visible = false
  scene.add(marker)
  let markerSize = 1

  // labels and orbits stay readable from far away
  const tmp = new THREE.Vector3()
  updaters.push((dt, t) => {
    const head = camera.getWorldPosition(tmp)
    for (const l of labels) {
      const d = l.position.distanceTo(head)
      const k = Math.min(5, Math.max(1, d / 45))
      l.scale.set(l.userData.w * k, (l.userData.w / 4) * k, 1)
    }
    const high = Math.min(1, Math.max(0, (rig.position.y - 5) / 60))
    for (const m of orbitMats) m.opacity = 0.12 + 0.3 * high
    if (marker.visible) {
      const d = marker.position.distanceTo(head)
      marker.scale.setScalar(Math.max(markerSize, d * 0.06) * (1 + 0.12 * Math.sin(t * 4)))
    }
  })

  // ---------------- animation ----------------
  updaters.push((dt) => {
    for (const s of spinners) {
      s.mesh.rotation.y += (s.speed + s.boost) * dt
      s.boost *= Math.pow(0.35, dt)
    }
  })

  return {
    bodies, tilts, sun, sunPos,
    /** Show a pulsing ring around the planet you are flying to (null to hide). */
    markDestination(id) {
      if (!id) { marker.visible = false; return }
      const s = SPEC[id]
      marker.position.copy(posOf(id))
      markerSize = s.r * 3
      marker.visible = true
    },
    update(dt, t) { for (const u of updaters) u(dt, t) },
    /** Make a planet spin faster for a moment (when a child taps it). */
    /** Put a planet's moons beside/behind it so they don't block the view when you arrive. */
    arrangeMoons(id, leadSeconds = 0) {
      const list = moonsOf[id] || []
      list.forEach((p, k) => {
        const sp = spinners.find((x) => x.mesh === p)
        // start ahead of the target spot so the moon drifts into it as you arrive
        p.rotation.y = -0.45 - (k * 2.2) / Math.max(1, list.length) + Math.abs(sp ? sp.speed : 0) * leadSeconds
      })
    },
    boost(id, amount = 2.5) { const s = spinners.find((x) => x.mesh === bodies[id]); if (s) s.boost = amount },
    spinnerOf(id) { return spinners.find((x) => x.mesh === bodies[id]) },
  }
}

// ======================= helpers =======================

function sprite(texture, size, pos) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }))
  s.scale.setScalar(size)
  s.position.copy(pos)
  return s
}

export function glowTexture(inner, outer, falloff = 0.4) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, `rgba(${inner},0.95)`)
  g.addColorStop(falloff * 0.5, `rgba(${inner},0.5)`)
  g.addColorStop(falloff, `rgba(${outer},0.2)`)
  g.addColorStop(1, `rgba(${outer},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function markerTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.strokeStyle = 'rgba(255,230,120,0.95)'
  ctx.shadowColor = 'rgba(255,200,60,1)'
  ctx.shadowBlur = 16
  ctx.lineWidth = 7
  ctx.setLineDash([26, 14])
  ctx.beginPath()
  ctx.arc(128, 128, 104, 0, Math.PI * 2)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function raysTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  ctx.translate(256, 256)
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2
    const len = 120 + Math.random() * 130
    const w = 2 + Math.random() * 7
    ctx.save()
    ctx.rotate(a)
    const g = ctx.createLinearGradient(0, 0, len, 0)
    g.addColorStop(0, 'rgba(255,200,120,0.18)')
    g.addColorStop(1, 'rgba(255,140,40,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(60, -w)
    ctx.lineTo(len, 0)
    ctx.lineTo(60, w)
    ctx.fill()
    ctx.restore()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function gridTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = 'rgba(34,211,238,0.55)'
  ctx.lineWidth = 2
  for (let r = 40; r < 256; r += 44) { ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke() }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(256 + Math.cos(a) * 40, 256 + Math.sin(a) * 40); ctx.lineTo(256 + Math.cos(a) * 250, 256 + Math.sin(a) * 250); ctx.stroke() }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function label(id, s) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const ctx = c.getContext('2d')
  ctx.font = 'bold 64px "Trebuchet MS", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.9)'
  ctx.shadowBlur = 12
  ctx.fillStyle = 'rgba(220,240,255,0.92)'
  ctx.fillText(id[0].toUpperCase() + id.slice(1), 256, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }))
  const w = Math.max(2.4, s.r * 1.1)
  spr.scale.set(w, w / 4, 1)
  spr.userData.w = w
  spr.position.copy(posOf(id)).add(new THREE.Vector3(0, s.r * (id === 'saturn' ? 1.5 : 1.25) + 0.6, 0))
  return spr
}

/** Glowing rim of air, brighter on the day side. */
function atmosphere(r, [cr, cg, cb, strength], sunPos) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(cr, cg, cb) }, uSun: { value: sunPos }, uStrength: { value: strength } },
    vertexShader: `varying vec3 vWN; varying vec3 vWP;
      void main(){ vWN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform vec3 uColor; uniform vec3 uSun; uniform float uStrength; varying vec3 vWN; varying vec3 vWP;
      void main(){
        vec3 v = normalize(cameraPosition - vWP);
        float rim = 1.0 - max(dot(v, normalize(vWN)), 0.0);
        float f = pow(rim, 3.0);
        float lit = smoothstep(-0.35, 0.45, dot(normalize(vWN), normalize(uSun - vWP)));
        gl_FragColor = vec4(uColor * f * lit * uStrength, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })
  return new THREE.Mesh(new THREE.SphereGeometry(r * 1.035, 64, 40), mat)
}

/** Earth's city lights should only glow on the night side. */
function nightSideOnly(material, sunPos) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSun = { value: sunPos }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWN2; varying vec3 vWP2;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWN2 = normalize(mat3(modelMatrix) * objectNormal); vWP2 = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWN2; varying vec3 vWP2; uniform vec3 uSun;')
      .replace(
        '#include <emissivemap_fragment>',
        `#ifdef USE_EMISSIVEMAP
          vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
          float nightF = smoothstep(0.12, -0.22, dot(normalize(vWN2), normalize(uSun - vWP2)));
          totalEmissiveRadiance *= emissiveColor.rgb * nightF;
        #endif`,
      )
  }
}

function rings(inner, outer, texture, planetMesh, sunPos, brightness) {
  const geo = new THREE.RingGeometry(inner, outer, 192, 1)
  const p = geo.attributes.position, uv = geo.attributes.uv
  for (let i = 0; i < p.count; i++) uv.setXY(i, (Math.hypot(p.getX(i), p.getY(i)) - inner) / (outer - inner), 0.5)
  const planetPos = new THREE.Vector3()
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: texture }, uSun: { value: sunPos }, uPlanet: { value: planetPos }, uR: { value: planetMesh.geometry.parameters.radius }, uB: { value: brightness } },
    vertexShader: `varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
      void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0); vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * vec3(0.0,0.0,1.0)); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform sampler2D map; uniform vec3 uSun; uniform vec3 uPlanet; uniform float uR; uniform float uB; varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
      void main(){
        vec4 c = texture2D(map, vec2(vUv.x, 0.5));
        vec3 d = normalize(uSun - vWP);
        vec3 oc = vWP - uPlanet;
        float b = dot(oc, d);
        float disc = b * b - (dot(oc, oc) - uR * uR);
        float shadow = (disc > 0.0 && b < 0.0) ? 0.12 : 1.0;
        float lit = 0.45 + 0.55 * abs(dot(normalize(vWN), d));
        gl_FragColor = vec4(c.rgb * shadow * lit * uB, c.a);
        #include <colorspace_fragment>
      }`,
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI / 2
  mesh.onBeforeRender = () => planetMesh.getWorldPosition(planetPos)
  return mesh
}

function ringCanvas(fn) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 2
  const ctx = c.getContext('2d')
  for (let x = 0; x < 1024; x++) {
    const [r, g, b, a] = fn(x / 1024)
    ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${Math.max(0, Math.min(1, a))})`
    ctx.fillRect(x, 0, 1, 2)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
function saturnRingTexture() {
  const rnd = (i) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x) }
  return ringCanvas((t) => {
    let ringlets = 0
    for (let k = 1; k <= 6; k++) ringlets += Math.sin(t * (40 * k + rnd(k) * 30) + rnd(k + 9) * 6) / k
    ringlets = 0.5 + 0.18 * ringlets
    let a, col
    if (t < 0.22) { a = 0.25 + 0.1 * ringlets; col = [150, 135, 115] } // C ring (faint)
    else if (t < 0.6) { a = 0.85 + 0.15 * ringlets; col = [232, 214, 178] } // B ring (bright)
    else if (t < 0.68) { a = 0.08; col = [120, 110, 100] } // Cassini division
    else if (t < 0.93) { a = 0.65 + 0.15 * ringlets; col = [210, 195, 165] } // A ring
    else if (t < 0.945) { a = 0.1; col = [150, 140, 125] } // Encke gap
    else { a = 0.55 * (1 - (t - 0.945) / 0.055); col = [205, 190, 160] }
    const shade = 0.85 + 0.3 * (ringlets - 0.5)
    return [col[0] * shade, col[1] * shade, col[2] * shade, a]
  })
}
function faintRingTexture() {
  return ringCanvas((t) => {
    const bands = [0.1, 0.3, 0.45, 0.62, 0.8, 0.95]
    let a = 0
    for (const b of bands) a = Math.max(a, Math.exp(-(((t - b) / 0.012) ** 2)))
    return [170, 190, 200, a * 0.55]
  })
}

// Ashima/Gustavson 3D simplex noise (MIT) for the Sun's surface
const SIMPLEX = `
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`
