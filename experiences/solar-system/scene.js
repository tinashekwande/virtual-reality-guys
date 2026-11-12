import * as THREE from 'three'
import { buildComet } from './comet.js'
import { bakeNebula, buildStars } from './deep-space.js'
import { EarthShader, EarthCloudsShader, AtmosphereHaloShader, PlanetPBRShader } from './planet-shaders.js'

// Builds the Solar System: realistic textures (generated at build time, see tools/gen-textures.mjs),
// glowing atmospheres, an animated Sun, moons, an asteroid belt, stars and the Milky Way.
// Sizes and distances are chosen to look good in VR, not to scale.

export const EYE = 1.6
const TEX = new URL('../textures/solar/', location.href).href

export const SPEC = {
  sun: { r: 12, x: 0 },
  // spin: radians per second. Real rotation rates relative to each other (Earth's day = 150 s here), so
  // Jupiter and Saturn turn fastest, Mercury and Venus barely move, and Venus and Uranus turn backwards.
  // Mercury and Venus get a little extra so children can still see they turn.
  mercury: { a: 25, r: 1.2, x: 34, spin: 0.003, tilt: 0.03, atmo: null },
  venus: { a: -35, r: 2.2, x: 52, spin: -0.002, tilt: 0.05, atmo: [1.0, 0.85, 0.55, 0.9] },
  earth: { a: 15, r: 2.4, x: 72, spin: 0.042, tilt: 0.41, atmo: [0.35, 0.6, 1.0, 1.2] },
  mars: { a: -20, r: 1.6, x: 90, spin: 0.041, tilt: 0.44, atmo: [1.0, 0.55, 0.35, 0.5] },
  jupiter: { a: 35, r: 7, x: 150, spin: 0.101, tilt: 0.05, atmo: [1.0, 0.85, 0.7, 0.5] },
  saturn: { a: -25, r: 5.6, x: 195, spin: 0.094, tilt: 0.47, atmo: [1.0, 0.9, 0.7, 0.45] },
  uranus: { a: 30, r: 3.4, x: 232, spin: -0.058, tilt: 1.7, atmo: [0.6, 0.95, 1.0, 0.8] },
  neptune: { a: -15, r: 3.3, x: 262, spin: 0.063, tilt: 0.49, atmo: [0.45, 0.6, 1.0, 0.9] },
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
  const dist = id === 'sun' ? s.r * 2.4 + 4 : s.r * 2.05 + 1.8 // close in: the planet fills a big part of your view
  const p = posOf(id)
  // always look along +x at the planet, so the view never has to turn between stops
  return { position: new THREE.Vector3(p.x - dist, 0, p.z), yaw: -Math.PI / 2 }
}

export function buildScene(app, manager) {
  const { scene, renderer, rig, camera } = app
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const loader = new THREE.TextureLoader(manager)
  // photographic planet maps (see textures/solar/real/CREDITS.md)
  const real = (name, color = true) => tex('real/' + name, color)
  const tex = (name, color = true) => {
    const t = loader.load(TEX + name + '.jpg')
    if (color) t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    return t
  }
  const updaters = []
  let timeScale = 1 // how fast planets spin and moons orbit (0 = paused)
  const sunPos = new THREE.Vector3(0, EYE, 0)

  let starUniforms = null
  // ---------------- sky: the Milky Way, nebulae and stars ----------------
  // (painted once at start-up from the Beyond the Void sky shader, then shown on a big sphere around you)
  const skyTex = bakeNebula(renderer, 4096)
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(950, 64, 32),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false }),
  )
  sky.renderOrder = -10
  scene.add(sky)
  updaters.push(() => sky.position.copy(rig.position)) // sky follows you, so it feels infinitely far

  // twinkling stars in true star colours, clustered along the Milky Way, and bright stars with spikes
  {
    const { group, uniforms } = buildStars(900, { scale: 0.45 })
    starUniforms = uniforms
    scene.add(group)
    updaters.push((dt, t) => {
      uniforms.uTime.value = t
      uniforms.uPixelScale.value = renderer.xr.isPresenting ? 1.3 : 1
      group.position.copy(rig.position)
    })
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
  scene.add(new THREE.AmbientLight(0x8090b0, 0.05)) // night sides almost black, as in space
  const sunLight = new THREE.PointLight(0xfff4e0, 3.2, 0, 0)
  sunLight.position.copy(sunPos)
  scene.add(sunLight)

  // ---------------- the Sun ----------------
  // Deep red-orange plasma with bright yellow-white veins, darker cooler patches and a fiery rim.
  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `${SIMPLEX}
      uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 p = normalize(vP);
        float t = uTime;
        // swirl the surface (domain warping) so the plasma looks like it is flowing
        vec3 q = p * 2.0 + vec3(0.0, t * 0.012, 0.0);
        vec3 w = vec3(snoise(q + vec3(1.7, 9.2, 0.0)), snoise(q + vec3(8.3, 2.8, 4.1)), snoise(q + vec3(3.1, 5.7, 7.3)));
        vec3 pw = p * 2.6 + w * 0.6 + vec3(t * 0.01, -t * 0.008, t * 0.006);
        float base = 0.5 + 0.5 * (0.6 * snoise(pw) + 0.3 * snoise(pw * 2.3 + 4.0) + 0.1 * snoise(pw * 5.3 - 2.0));
        // bright plasma veins (ridged noise)
        float r1 = 1.0 - abs(snoise(pw * 1.5 + vec3(t * 0.02)));
        float r2 = 1.0 - abs(snoise(pw * 3.4 - vec3(t * 0.03)));
        float r3 = 1.0 - abs(snoise(pw * 8.0 + vec3(0.0, t * 0.05, 0.0)));
        float veinMask = smoothstep(0.15, 0.7, 0.5 + 0.5 * snoise(p * 1.3 + w * 0.45 + vec3(t * 0.003)));
        float veins = clamp((pow(r1, 7.0) * 1.0 + pow(r2, 9.0) * 0.6 + pow(r3, 12.0) * 0.3) * (0.3 + 0.9 * veinMask), 0.0, 1.0);
        // darker, cooler patches
        float spots = smoothstep(0.25, 0.7, snoise(p * 1.6 + w * 0.3 + vec3(4.0, t * 0.004, 1.0))) * (1.0 - veins);
        vec3 deep = vec3(0.42, 0.04, 0.0);
        vec3 red = vec3(0.92, 0.18, 0.01);
        vec3 orange = vec3(1.0, 0.45, 0.03);
        vec3 yellow = vec3(1.0, 0.82, 0.22);
        vec3 white = vec3(1.0, 0.97, 0.78);
        vec3 col = mix(deep, red, smoothstep(0.0, 0.5, base));
        col = mix(col, orange, smoothstep(0.5, 0.9, base) * (0.5 + 0.5 * veinMask));
        col = mix(col, yellow, veins);
        col = mix(col, white, pow(veins, 2.5) * 0.5);
        col = mix(col, vec3(0.3, 0.03, 0.0), spots * 0.55);
        // fine boiling texture
        col *= 0.82 + 0.3 * (0.5 + 0.5 * snoise(p * 34.0 + vec3(t * 0.08)));
        // fiery rim
        float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(1.0 - mu, 2.2);
        col = mix(col, vec3(1.0, 0.55, 0.1), rim * 0.55);
        col += vec3(1.0, 0.4, 0.05) * pow(1.0 - mu, 6.0) * 0.6;
        gl_FragColor = vec4(col * 1.3, 1.0);
      }`,
    toneMapped: false,
  })
  const sun = new THREE.Mesh(new THREE.SphereGeometry(SPEC.sun.r, 128, 96), sunMat)
  sun.position.copy(sunPos)
  scene.add(sun)

  // flames licking off the edge: a camera-facing disc drawn around the Sun's outline
  const flameMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uDisc: { value: SPEC.sun.r }, uHalf: { value: SPEC.sun.r * 2.2 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `${SIMPLEX}
      uniform float uTime; uniform float uDisc; uniform float uHalf; varying vec2 vUv;
      void main(){
        vec2 d = (vUv - 0.5) * 2.0 * uHalf;
        float r = length(d) / uDisc;          // 1.0 = edge of the Sun
        if (r < 0.97) discard;
        vec2 dir = d / max(length(d), 1e-4);
        float t = uTime;
        float n1 = 0.5 + 0.5 * snoise(vec3(dir * 3.0, t * 0.12));
        float n2 = 0.5 + 0.5 * snoise(vec3(dir * 11.0, t * 0.35));
        float big = max(0.0, snoise(vec3(dir * 1.4, t * 0.04 + 7.0)));
        float h = 0.035 + 0.09 * pow(n1, 2.0) + 0.04 * n2 + 0.3 * pow(big, 3.0);   // flame height around the rim
        float x = (r - 1.0) / h;
        // flickering tongues: noise that streams outwards
        float tongue = 0.55 + 0.45 * snoise(vec3(dir * 18.0, (r - t * 0.08) * 6.0));
        float flame = exp(-max(x, 0.0) * 2.2) * tongue * smoothstep(0.97, 1.0, r);
        float haze = exp(-(r - 1.0) * 3.5) * 0.35;
        vec3 col = mix(vec3(1.0, 0.85, 0.45), vec3(1.0, 0.28, 0.02), clamp(x, 0.0, 1.0)) * flame * 1.4
                 + vec3(1.0, 0.35, 0.05) * haze;
        gl_FragColor = vec4(col, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })
  const flames = new THREE.Mesh(new THREE.PlaneGeometry(SPEC.sun.r * 4.4, SPEC.sun.r * 4.4), flameMat)
  flames.position.copy(sunPos)
  scene.add(flames)
  const glow = sprite(glowTexture([255, 150, 60], [255, 70, 0], 0.35), 130, sunPos)
  glow.material.opacity = 0.75
  scene.add(glow)
  const camPos = new THREE.Vector3()
  updaters.push((dt, t) => {
    sunMat.uniforms.uTime.value = t
    flameMat.uniforms.uTime.value = t
    sun.rotation.y += dt * 0.0017 // the Sun turns once in about 25 days: 25 x slower than Earth
    camera.getWorldPosition(camPos)
    flames.lookAt(camPos)
    // size of the Sun's outline on the flame disc, seen from where you are
    const D = Math.max(camPos.distanceTo(sunPos), SPEC.sun.r * 1.05)
    flameMat.uniforms.uDisc.value = (SPEC.sun.r * D) / Math.sqrt(D * D - SPEC.sun.r * SPEC.sun.r)
    glow.scale.setScalar(130 * (1 + 0.025 * Math.sin(t * 0.7)))
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
    bodies[id] = mesh
    tilts[id] = tiltGroup
    spinners.push({ mesh, speed: s.spin, boost: 0 })
    const lab = label(id, s)
    labels.push(lab)
    scene.add(lab)
    return mesh
  }
  const std = (name, opts = {}) => new THREE.MeshStandardMaterial({ map: tex(name), roughness: 1, metalness: 0, ...opts })

  // Planets exactly as in Beyond the Void: the photo maps with the prototype's own shaders and settings
  // (relief from the photo, pitch-black night side, coloured edge glow), lit by our Sun.
  const sunUniform = { value: sunPos }
  const wrap = (t) => { t.wrapS = THREE.RepeatWrapping; return t }
  const pbr = (name, o = {}) => new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: wrap(real(name)) }, uSunPos: sunUniform, uBumpScale: { value: o.bumpScale ?? 2.0 },
      uTint: { value: new THREE.Color(o.tint || '#ffffff') }, uLimbColor: { value: new THREE.Color(o.limbColor || '#000000') }, uLimbStrength: { value: o.limbStrength ?? 0 },
    },
    vertexShader: PlanetPBRShader.vertexShader, fragmentShader: PlanetPBRShader.fragmentShader,
  })
  planet('mercury', pbr('mercury', { bumpScale: 2.8, tint: '#d8cfc8' }))
  planet('venus', pbr('venus', { bumpScale: 1.4, tint: '#ffdfa8', limbColor: '#ffbe66', limbStrength: 0.42 }))
  // Earth: day map, city lights on the night side, shiny oceans, normal-mapped relief, clouds that cast shadows
  const earthSunDir = { value: new THREE.Vector3(1, 0, 0) }
  const earthDay = wrap(real('earth_day')), earthClouds = wrap(real('earth_clouds_trans', false))
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uDayTex: { value: earthDay }, uNightTex: { value: wrap(real('earth_lights')) }, uSpecTex: { value: wrap(real('earth_spec', false)) },
      uNormalMap: { value: wrap(real('earth_normal', false)) }, uCloudTex: { value: earthClouds }, uHasNormal: { value: 1 }, uSunDir: earthSunDir,
    },
    vertexShader: EarthShader.vertexShader, fragmentShader: EarthShader.fragmentShader,
  })
  const earth = planet('earth', earthMat)
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(SPEC.earth.r * 1.009, 96, 64),
    new THREE.ShaderMaterial({ uniforms: { uCloudTex: { value: earthClouds }, uSunDir: earthSunDir }, vertexShader: EarthCloudsShader.vertexShader, fragmentShader: EarthCloudsShader.fragmentShader, transparent: true, depthWrite: false }),
  )
  earth.add(clouds) // the clouds turn with the Earth, so their shadows stay underneath them
  earth.add(new THREE.Mesh(
    new THREE.SphereGeometry(SPEC.earth.r * 1.032, 64, 48),
    new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color('#429eff') }, uSunDir: earthSunDir }, vertexShader: AtmosphereHaloShader.vertexShader, fragmentShader: AtmosphereHaloShader.fragmentShader, transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  ))
  const earthWP = new THREE.Vector3()
  updaters.push(() => earthSunDir.value.copy(sunPos).sub(earth.getWorldPosition(earthWP)).normalize())
  planet('mars', pbr('mars', { bumpScale: 3.2, tint: '#ff9d6e', limbColor: '#e87846', limbStrength: 0.35 }))
  planet('jupiter', pbr('jupiter', { bumpScale: 1.9, tint: '#f5dfc6', limbColor: '#d4b48c', limbStrength: 0.25 }))
  // (the prototype's Saturn shader blends in a rocky Mars map; the plain banded Saturn photo looks more real)
  planet('saturn', pbr('saturn', { bumpScale: 1.0, tint: '#fff4e2', limbColor: '#d9b98a', limbStrength: 0.25 }))
  planet('uranus', pbr('uranus', { bumpScale: 0.8, tint: '#a8ecff', limbColor: '#6ad8ff', limbStrength: 0.35 }))
  planet('neptune', pbr('neptune', { bumpScale: 1.1, tint: '#6e9eff', limbColor: '#3d78ff', limbStrength: 0.38 }))

  // Saturn's rings (with the planet's shadow falling across them) and Uranus's faint rings
  const satRingTex = saturnRingTexture()
  const satRing = saturnRings(SPEC.saturn.r * 1.24, SPEC.saturn.r * 2.3, bodies.saturn, sunPos)
  tilts.saturn.add(satRing)
  tilts.uranus.add(rings(SPEC.uranus.r * 1.6, SPEC.uranus.r * 2.0, faintRingTexture(), bodies.uranus, sunPos, 0.5))

  // ---------------- moons ----------------
  const moonsOf = {}
  const moonMeshes = {}
  const moonMat = (name, bump) => std(name, bump ? { bumpMap: tex(name + '_bump', false), bumpScale: 2 } : {})
  addMoon('earth', pbr('moon', { bumpScale: 3.4, tint: '#e0dcd5' }), 0.6, 9.5, 0.02, 0.25, null, 1.2) // the real Moon; it always shows us the same face
  addMoon('mars', moonMat('rockmoon'), 0.22, 3.0, 0.06, 0.1, [1, 0.75, 0.85])
  addMoon('mars', moonMat('rockmoon'), 0.15, 4.6, 0.035, -0.2, [1, 0.8, 0.9])
  addMoon('jupiter', moonMat('io'), 0.55, 11, 0.05, 0.05)
  addMoon('jupiter', moonMat('europa'), 0.48, 14, 0.035, 0.12)
  addMoon('jupiter', moonMat('ganymede'), 0.8, 20, 0.025, -0.08)
  addMoon('jupiter', moonMat('callisto'), 0.72, 24, 0.016, 0.15)
  addMoon('saturn', moonMat('titan'), 0.7, 19, 0.02, 0.35, null, 2.4)
  addMoon('neptune', moonMat('triton'), 0.45, 11, -0.03, 0.3)
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
    ;(moonMeshes[parent] ||= []).push({ obj: m, r })
    return m
  }

  // ---------------- shadows ----------------
  const shadowMats = []
  for (const id of ['earth', 'mars', 'jupiter', 'saturn', 'neptune']) {
    const moons = moonMeshes[id] || []
    const planetMesh = bodies[id]
    const ring = id === 'saturn' ? { mesh: satRing, inner: SPEC.saturn.r * 1.24, outer: SPEC.saturn.r * 2.3, texture: satRingTex } : null
    if (planetMesh.material.isMeshStandardMaterial) {
      sunShadows(planetMesh.material, sunPos, moons, ring)
      shadowMats.push(planetMesh.material)
    }
    for (const m of moons) {
      if (!m.obj.material.isMeshStandardMaterial) continue
      sunShadows(m.obj.material, sunPos, [{ obj: planetMesh, r: SPEC[id].r }, ...moons.filter((x) => x !== m)])
      shadowMats.push(m.obj.material)
    }
  }
  updaters.push(() => { for (const m of shadowMats) m.userData.updateShadows() })

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
    updaters.push((dt) => (beltGroup.rotation.y += dt * 0.002 * timeScale))
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
  let padRef = null
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
    padRef = { pad, base, rim, glow }
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

  // ---------------- a comet crossing the inner solar system ----------------
  const comet = buildComet(scene, sunPos)
  updaters.push((dt, t) => comet.update(dt, t))

  // ---------------- animation ----------------
  updaters.push((dt) => {
    for (const s of spinners) {
      s.mesh.rotation.y += (s.speed * timeScale + s.boost) * dt
      s.boost *= Math.pow(0.35, dt)
    }
  })

  return {
    bodies, tilts, sun, sunPos, moonsOf, comet, satRingTex, skyTexture: skyTex, earthMap: earthDay, saturnMap: bodies.saturn.material.uniforms.uMap.value, labels, orbitLines: orbitMats, sunGlow: glow, starUniforms,
    /** See-through platform, for looking down at the Earth. */
    setPadGlass(on) {
      const { base, rim, glow } = padRef
      base.material.transparent = on
      base.material.opacity = on ? 0.18 : 1
      base.material.depthWrite = !on
      base.material.needsUpdate = true
      glow.visible = !on
      rim.scale.setScalar(on ? 0.6 : 1)
      rim.material.transparent = on
      rim.material.opacity = on ? 0.5 : 1
    },
    /** Show a pulsing ring around the planet you are flying to (null to hide). */
    markDestination(id) {
      if (!id) { marker.visible = false; return }
      const s = SPEC[id]
      marker.position.copy(posOf(id))
      markerSize = s.r * 3
      marker.visible = true
    },
    update(dt, t) { for (const u of updaters) u(dt, t) },
    setTimeScale(k) { timeScale = k },
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
/** Add a shader patch to a built-in material; several patches can be stacked. */
export function addPatch(material, key, fn) {
  const prev = material.onBeforeCompile
  const keys = (material.userData.patchKeys ||= [])
  keys.push(key)
  material.onBeforeCompile = (shader, renderer) => {
    prev.call(material, shader, renderer)
    fn(shader)
  }
  material.customProgramCacheKey = () => keys.join('+')
}

/**
 * Real shadows from the Sun: moons darken planets (eclipses), planets darken their moons, and Saturn's rings
 * throw their banded shadow on Saturn. Done with maths in the shader (sphere and ring occluders), with a soft edge.
 */
export function sunShadows(material, sunPos, occluders, ring) {
  const occ = Array.from({ length: 4 }, () => new THREE.Vector4())
  const u = {
    uShSun: { value: sunPos }, uShSunR: { value: 1.6 }, uOcc: { value: occ }, uOccN: { value: 0 },
    uRingOn: { value: ring ? 1 : 0 }, uRingC: { value: new THREE.Vector3() }, uRingN: { value: new THREE.Vector3(0, 1, 0) },
    uRingIn: { value: ring ? ring.inner : 0 }, uRingOut: { value: ring ? ring.outer : 0 }, uRingTex: { value: ring ? ring.texture : null },
  }
  const tmp = new THREE.Vector3(), sc = new THREE.Vector3()
  material.userData.updateShadows = () => {
    let n = 0
    for (const o of occluders) {
      if (n >= 4) break
      o.obj.getWorldPosition(tmp)
      o.obj.getWorldScale(sc)
      occ[n++].set(tmp.x, tmp.y, tmp.z, o.r * Math.max(sc.x, sc.y, sc.z))
    }
    u.uOccN.value = n
    if (ring) {
      ring.mesh.getWorldPosition(u.uRingC.value)
      u.uRingN.value.set(0, 0, 1).transformDirection(ring.mesh.matrixWorld)
    }
  }
  addPatch(material, 'shadow' + (ring ? 'R' : ''), (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vShWP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvShWP = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vShWP; uniform vec3 uShSun; uniform float uShSunR; uniform vec4 uOcc[4]; uniform int uOccN;
        uniform float uRingOn; uniform vec3 uRingC; uniform vec3 uRingN; uniform float uRingIn; uniform float uRingOut; uniform sampler2D uRingTex;
        float vrgShadow(vec3 P) {
          vec3 toS = uShSun - P; float dS = length(toS); vec3 L = toS / dS;
          float as = uShSunR / dS;
          float vis = 1.0;
          for (int i = 0; i < 4; i++) {
            if (i >= uOccN) break;
            vec3 toC = uOcc[i].xyz - P; float dC = length(toC);
            if (dot(toC, L) <= 0.0 || dC > dS || dC < uOcc[i].w * 1.001) continue;
            float ao = asin(min(uOcc[i].w / dC, 1.0));
            float sep = acos(clamp(dot(toC / dC, L), -1.0, 1.0));
            float full = 1.0 - min(1.0, (ao * ao) / (as * as));
            vis *= mix(full, 1.0, smoothstep(abs(ao - as), ao + as, sep));
          }
          if (uRingOn > 0.5) {
            float den = dot(L, uRingN);
            if (abs(den) > 1e-4) {
              float t = dot(uRingC - P, uRingN) / den;
              if (t > 0.0) {
                float rr = length(P + L * t - uRingC);
                if (rr > uRingIn && rr < uRingOut) vis *= 1.0 - 0.85 * texture2D(uRingTex, vec2((rr - uRingIn) / (uRingOut - uRingIn), 0.5)).a;
              }
            }
          }
          return vis;
        }`)
      .replace('#include <lights_fragment_end>', `float vrgSh = vrgShadow(vShWP);
        reflectedLight.directDiffuse *= vrgSh;
        reflectedLight.directSpecular *= vrgSh;
        #include <lights_fragment_end>`)
  })
}

function nightSideOnly(material, sunPos) {
  addPatch(material, 'night', (shader) => {
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
  })
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

/** Colour grading for the Earth photo, as in the prototype: deeper sapphire oceans, warm ochre deserts. */
function earthGrade(material) {
  addPatch(material, 'grade', (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      {
        vec3 c = diffuseColor.rgb;
        float ocean = smoothstep(0.0, 0.06, c.b - max(c.r, c.g * 0.9));
        float arid = clamp((c.r - c.b) * 1.8, 0.0, 1.0) * (1.0 - ocean);
        vec3 land = mix(c * vec3(0.95, 1.04, 0.88), c * vec3(1.06, 0.86, 0.68), arid * 0.78);
        diffuseColor.rgb = mix(land, c * vec3(0.68, 0.88, 1.18), ocean);
      }`)
  })
}

// Saturn's rings, after the prototype's ring shader: C, B and A rings made of hundreds of fine ringlets,
// the Cassini Division, the Encke and Keeler gaps and the thin F ring, with Saturn's shadow across them.
// ringProfile() is the same layout in JavaScript, used for the ring texture (shadows on Saturn, the ring dive).
function ringProfile(r) {
  const s1 = Math.sin(r * 190), s2 = Math.sin(r * 540 + 1.2), s3 = Math.sin(r * 1480 + 2.5)
  const thread = 0.5 + 0.22 * s1 + 0.15 * s2 + 0.09 * s3
  const fine = smooth(0.02, 0.98, thread)
  const warm = [0.72, 0.58, 0.45], mid = [0.56, 0.44, 0.34], dark = [0.38, 0.29, 0.22]
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
  if (r < 0.08) return [dark, smooth(0, 0.08, r) * 0.22 * fine]
  if (r < 0.28) { const cb = 0.5 + 0.5 * Math.sin(r * 120); return [mixc(dark, mid, cb), (0.18 + 0.38 * cb) * fine] }
  if (r < 0.64) {
    const bm = 0.65 + 0.35 * Math.sin(r * 75) * Math.cos(r * 160)
    return [mixc(mid, warm, fine * bm), (0.62 + 0.34 * fine) * bm * smooth(0.004, 0.011, Math.abs(r - 0.39)) * smooth(0.005, 0.013, Math.abs(r - 0.51))]
  }
  if (r < 0.72) return [dark, 0.03]
  if (r < 0.94) return [mixc(mid, warm.map((v) => v * 0.92), fine), (0.5 + 0.38 * fine) * smooth(0.005, 0.014, Math.abs(r - 0.85)) * smooth(0.002, 0.006, Math.abs(r - 0.92))]
  return [warm, Math.exp(-(((r - 0.975) * 95) ** 2)) * 0.65]
}
function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

function saturnRings(inner, outer, planetMesh, sunPos) {
  const geo = new THREE.RingGeometry(inner, outer, 256, 1)
  const planetPos = new THREE.Vector3()
  const mat = new THREE.ShaderMaterial({
    uniforms: { uSunPos: { value: sunPos }, uPlanetPos: { value: planetPos }, uPlanetRadius: { value: planetMesh.geometry.parameters.radius }, uInnerRadius: { value: inner }, uOuterRadius: { value: outer } },
    vertexShader: `varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
      void main(){ vLocalPos = position; vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPos = wp.xyz; vWN = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0)); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunPos; uniform vec3 uPlanetPos; uniform float uPlanetRadius; uniform float uInnerRadius; uniform float uOuterRadius;
      varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
      void main() {
        float r = clamp((length(vLocalPos.xy) - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
        // fine ringlets; each set fades out once it is finer than a pixel, so there is no shimmer
        float fw = max(fwidth(r), 1e-5);
        float s1 = sin(r * 190.0) * clamp(1.0 - 114.0 * fw, 0.0, 1.0);
        float s2 = sin(r * 540.0 + 1.2) * clamp(1.0 - 324.0 * fw, 0.0, 1.0);
        float s3 = sin(r * 1480.0 + 2.5) * clamp(1.0 - 888.0 * fw, 0.0, 1.0);
        float s4 = sin(r * 3600.0 + 0.7) * clamp(1.0 - 2160.0 * fw, 0.0, 1.0);
        float s5 = sin(r * 7200.0) * clamp(1.0 - 4320.0 * fw, 0.0, 1.0);
        float fineGaps = smoothstep(0.02, 0.98, 0.5 + 0.22 * s1 + 0.15 * s2 + 0.09 * s3 + 0.04 * s4 + 0.02 * s5);
        float env = 0.0;
        vec3 colWarm = vec3(0.72, 0.58, 0.45), colMid = vec3(0.56, 0.44, 0.34), colDark = vec3(0.38, 0.29, 0.22);
        vec3 ringColor = colMid;
        if (r < 0.08) { env = smoothstep(0.0, 0.08, r) * 0.22 * fineGaps; ringColor = colDark; }
        else if (r < 0.28) { float cB = 0.5 + 0.5 * sin(r * 120.0); env = (0.18 + 0.38 * cB) * fineGaps; ringColor = mix(colDark, colMid, cB); }
        else if (r < 0.64) {
          float bM = 0.65 + 0.35 * sin(r * 75.0) * cos(r * 160.0);
          env = (0.62 + 0.34 * fineGaps) * bM * smoothstep(0.004, 0.011, abs(r - 0.39)) * smoothstep(0.005, 0.013, abs(r - 0.51));
          ringColor = mix(colMid, colWarm, fineGaps * bM);
        } else if (r < 0.72) {
          float inner = smoothstep(0.64, 0.655, r) * smoothstep(0.72, 0.705, r);
          env = mix(0.45 * fineGaps, smoothstep(0.75, 0.95, sin(r * 450.0)) * 0.18, inner);
          ringColor = colDark;
        } else if (r < 0.94) {
          env = (0.5 + 0.38 * fineGaps) * smoothstep(0.005, 0.014, abs(r - 0.85)) * smoothstep(0.002, 0.006, abs(r - 0.92));
          ringColor = mix(colMid, colWarm * 0.92, fineGaps);
        } else { env = exp(-pow((r - 0.975) * 95.0, 2.0)) * 0.65 * (0.6 + 0.4 * s3); ringColor = colWarm; }
        if (env < 0.015) discard;
        // Saturn's shadow falling across the rings
        vec3 toSun = normalize(uSunPos - vWorldPos);
        vec3 toPlanet = uPlanetPos - vWorldPos;
        float proj = dot(toPlanet, toSun);
        float shadow = 1.0;
        if (proj > 0.0) shadow = mix(0.02, 1.0, smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.02, length(vWorldPos + toSun * proj - uPlanetPos)));
        // ice is brighter lit face-on, and glows a little when the Sun shines through from behind
        float lit = 0.75 + 0.45 * abs(dot(normalize(vWN), toSun));
        gl_FragColor = vec4(ringColor * shadow * lit * 1.35, clamp(env, 0.0, 0.92));
        #include <tonemapping_fragment>
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
export function saturnRingTexture() {
  // the same ring layout as the ring shader (see ringProfile), for shadows on Saturn and the ring dive
  return ringCanvas((t) => {
    const [c, a] = ringProfile(t)
    return [Math.pow(c[0], 1 / 2.2) * 255 * 1.15, Math.pow(c[1], 1 / 2.2) * 255 * 1.15, Math.pow(c[2], 1 / 2.2) * 255 * 1.15, Math.min(0.92, a)]
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
export const SIMPLEX = `
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
