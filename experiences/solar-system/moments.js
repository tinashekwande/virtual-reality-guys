import * as THREE from 'three'
import { glowTexture } from './scene.js'
import { latLonDir } from './daynight.js'
import { EarthShader, EarthCloudsShader, AtmosphereHaloShader } from './planet-shaders.js'

// The "wow" moments in the main scene:
//  - 109 Earths in a row across the face of the Sun (sizes as you see them: true angular sizes from where you stand)
//  - Earth drawn to scale beside Jupiter's Great Red Spot
//  - a hologram at the asteroid belt grouping the rocky inner planets and the giant outer planets

// Great Red Spot centre on the Jupiter photo map (measured from textures/solar/real/jupiter.jpg: u = 0.249, v = 0.645)
export const GRS_LAT = -26
export const GRS_LON = -90.4
const EARTH_KM = 12742
const JUPITER_KM = 142984

export function textSprite(text, { color = '#e8f1ff', height = 0.3, bg = 'rgba(6,12,28,0.72)', bold = true } = {}) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 160
  const ctx = c.getContext('2d')
  ctx.font = `${bold ? 'bold ' : ''}64px "Trebuchet MS", system-ui, sans-serif`
  const w = Math.min(1004, ctx.measureText(text).width + 64)
  if (bg) {
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.roundRect((1024 - w) / 2, 22, w, 116, 58)
    ctx.fill()
  }
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 512, 82, 960)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }))
  s.scale.set(height * 6.4, height, 1)
  s.renderOrder = 12
  return s
}

function ringTexture(dashed, color = 'rgba(255,255,255,0.95)') {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.strokeStyle = color
  ctx.lineWidth = 9
  if (dashed) ctx.setLineDash([20, 12])
  ctx.beginPath()
  ctx.arc(128, 128, 116, 0, Math.PI * 2)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ---------------- 109 Earths across the Sun ----------------
export function buildSunRuler(scene, { earthMap, sunPos, sunR }) {
  const N = 109
  const geo = new THREE.SphereGeometry(1, 12, 8) // each Earth is only a few pixels wide: keep them light
  // bright, unlit Earths (toneMapped off) so they read as blue planets against the glare of the Sun
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ map: earthMap, color: new THREE.Color(1.5, 1.7, 2.1), toneMapped: false }), N)
  mesh.frustumCulled = false
  mesh.visible = false
  mesh.renderOrder = 5
  scene.add(mesh)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3()
  const spins = Array.from({ length: N }, () => Math.random() * Math.PI * 2)
  let slots = [], d = 0, shown = 0, t = 0, active = false
  const label = textSprite('About 109 Earths across', { color: '#fde68a', height: 1.2 })
  label.visible = false
  scene.add(label)
  function place(n) {
    for (let i = 0; i < N; i++) {
      // each Earth pops in with a little bounce
      const k = Math.min(1, Math.max(0, n - i))
      const pop = k <= 0 ? 0 : k >= 1 ? 1 : 1 + Math.sin(k * Math.PI) * 0.35
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), spins[i] + t * 0.3)
      m.compose(slots[i], q, sc.setScalar(Math.max(1e-4, (d / 2) * pop * 0.94)))
      mesh.setMatrixAt(i, m)
    }
    mesh.instanceMatrix.needsUpdate = true
  }
  return {
    /** Lay the row out across the Sun as seen from eye, then count them in over `seconds`. */
    show(eye, seconds = 4) {
      const u = eye.clone().sub(sunPos)
      const D = u.length()
      u.normalize()
      const dp = D - sunR - 0.8 // just in front of the Sun's face
      const half = dp * Math.tan(Math.asin(sunR / D)) // half the Sun's width, as you see it, at that distance
      d = (2 * half) / N
      const side = new THREE.Vector3().crossVectors(u, new THREE.Vector3(0, 1, 0)).normalize()
      const centre = eye.clone().addScaledVector(u, -dp)
      slots = Array.from({ length: N }, (_, i) => centre.clone().addScaledVector(side, -half + d * (i + 0.5)))
      label.position.copy(centre).add(new THREE.Vector3(0, half * 0.32, 0))
      label.scale.set(half * 0.9, half * 0.9 / 6.4, 1)
      label.visible = false
      this.seconds = seconds
      shown = 0
      t = 0
      active = true
      mesh.visible = true
      place(0)
    },
    hide() { active = false; mesh.visible = false; label.visible = false },
    /** returns how many Earths are showing */
    update(dt) {
      if (!active) return 0
      t += dt
      const before = Math.floor(shown)
      shown = Math.min(N, shown + (N / this.seconds) * dt)
      place(shown)
      if (shown >= N) label.visible = true
      return { count: Math.floor(shown), added: Math.floor(shown) - before }
    },
    get active() { return active },
    get count() { return Math.floor(shown) },
  }
}

// ---------------- Earth beside the Great Red Spot ----------------
export function buildSpotCompare(scene, { earthUniforms: u, sunPos }) {
  const group = new THREE.Group()
  group.visible = false
  scene.add(group)
  // the same realistic Earth as at the Earth stop: day side, city lights, clouds and the blue glow of its air
  const sunDir = { value: new THREE.Vector3(1, 0, 0) }
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.ShaderMaterial({
    uniforms: { uHasNormal: { value: 1 }, uDayTex: u.uDayTex, uNightTex: u.uNightTex, uSpecTex: u.uSpecTex, uNormalMap: u.uNormalMap, uCloudTex: u.uCloudTex, uSunDir: sunDir },
    vertexShader: EarthShader.vertexShader, fragmentShader: EarthShader.fragmentShader,
  }))
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.009, 48, 32), new THREE.ShaderMaterial({ uniforms: { uCloudTex: u.uCloudTex, uSunDir: sunDir }, vertexShader: EarthCloudsShader.vertexShader, fragmentShader: EarthCloudsShader.fragmentShader, transparent: true, depthWrite: false })))
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.032, 48, 32), new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color('#429eff') }, uSunDir: sunDir }, vertexShader: AtmosphereHaloShader.vertexShader, fragmentShader: AtmosphereHaloShader.fragmentShader, transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })))
  const earthRing = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTexture(true, 'rgba(147,197,253,0.95)'), transparent: true, depthWrite: false, toneMapped: false }))
  const spotRing = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTexture(false, 'rgba(255,190,140,0.9)'), transparent: true, depthWrite: false, toneMapped: false }))
  const earthLabel = textSprite('Earth, same scale', { color: '#bfdbfe' })
  const spotLabel = textSprite('Great Red Spot', { color: '#fecaca' })
  group.add(earth, earthRing, spotRing, earthLabel, spotLabel)
  let t = 0
  return {
    /** Jupiter must already be turned so the spot faces eye. */
    show(jupiter, jupiterR, eye) {
      jupiter.updateMatrixWorld(true)
      const centre = jupiter.getWorldPosition(new THREE.Vector3())
      const spot = latLonDir(GRS_LAT, GRS_LON).applyQuaternion(jupiter.getWorldQuaternion(new THREE.Quaternion())).multiplyScalar(jupiterR).add(centre)
      const toEye = eye.clone().sub(spot).normalize()
      const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), toEye).normalize().negate() // to your right
      const rE = jupiterR * (EARTH_KM / JUPITER_KM)
      // Earth floats just in front of Jupiter, beside the spot; its size is corrected for being a bit closer to you
      const pos = spot.clone().addScaledVector(side, jupiterR * 0.3).addScaledVector(toEye, jupiterR * 0.16)
      const k = eye.distanceTo(pos) / eye.distanceTo(spot)
      earth.position.copy(pos)
      sunDir.value.copy(sunPos).sub(pos).normalize()
      earth.scale.setScalar(rE * k)
      earth.rotation.y = 2.4 // Africa towards you
      earthRing.position.copy(pos)
      earthRing.scale.setScalar(rE * k * 2.5)
      earthLabel.position.copy(pos).add(new THREE.Vector3(0, -rE * 2.1, 0))
      earthLabel.scale.set(rE * 4.2, rE * 4.2 / 6.4, 1)
      // ring around the storm, a little in front of the cloud tops
      spotRing.position.copy(spot).addScaledVector(toEye, 0.4)
      spotRing.scale.set(jupiterR * 0.32, jupiterR * 0.21, 1)
      spotLabel.position.copy(spot).addScaledVector(toEye, 0.4).add(new THREE.Vector3(0, jupiterR * 0.2, 0))
      spotLabel.scale.set(rE * 4.2, rE * 4.2 / 6.4, 1)
      group.visible = true
      t = 0
    },
    hide() { group.visible = false },
    update(dt) {
      if (!group.visible) return
      t += dt
      earth.rotation.y += dt * 0.15
      const a = Math.min(1, t / 0.8)
      earthRing.material.opacity = a * (0.7 + 0.3 * Math.sin(t * 3))
      spotRing.material.opacity = a * 0.9
    },
    get visible() { return group.visible },
  }
}

// ---------------- inner and outer planets hologram (at the asteroid belt) ----------------
export function buildBeltHologram(parent, maps) {
  const g = new THREE.Group()
  g.position.set(0, 2.02, -2.75)
  g.visible = false
  parent.add(g)
  const base = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 0.012), new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.5, toneMapped: false }))
  base.position.set(-0.1, 0, -0.01)
  g.add(base)
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffc35a, toneMapped: false }))
  sun.position.x = -1.55
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture([255, 200, 120], [255, 100, 20], 0.4), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }))
  sunGlow.scale.setScalar(0.6)
  sun.add(sunGlow)
  g.add(sun)
  const layout = [
    ['mercury', -1.24, 0.04], ['venus', -1.06, 0.065], ['earth', -0.86, 0.068], ['mars', -0.68, 0.05],
    ['jupiter', -0.06, 0.17], ['saturn', 0.42, 0.14], ['uranus', 0.84, 0.095], ['neptune', 1.17, 0.093],
  ]
  const planets = {}
  for (const [id, x, r] of layout) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), new THREE.MeshBasicMaterial({ map: maps[id], color: 0xffffff }))
    m.position.x = x
    m.rotation.z = id === 'uranus' ? 1.7 : 0.2
    if (id === 'saturn') {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.3, r * 2.1, 48), new THREE.MeshBasicMaterial({ color: 0xd9c09a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }))
      ring.rotation.x = -Math.PI / 2 + 0.45
      m.add(ring)
    }
    g.add(m)
    planets[id] = m
  }
  // the belt: a band of little rocks between Mars and Jupiter
  {
    const n = 160
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) { pos[i * 3] = -0.52 + Math.random() * 0.26; pos[i * 3 + 1] = (Math.random() - 0.5) * 0.09; pos[i * 3 + 2] = (Math.random() - 0.5) * 0.09 }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xc9b49a, size: 0.012, toneMapped: false })))
  }
  // brackets and names
  const bracket = (x0, x1, y, color) => {
    const pts = [new THREE.Vector3(x0, y - 0.05, 0), new THREE.Vector3(x0, y, 0), new THREE.Vector3(x1, y, 0), new THREE.Vector3(x1, y - 0.05, 0)]
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, toneMapped: false }))
    g.add(l)
    return l
  }
  const innerBr = bracket(-1.32, -0.6, 0.15, 0xfdba74)
  const outerBr = bracket(-0.26, 1.29, 0.27, 0x67e8f9)
  const gasBr = bracket(-0.24, 0.62, 0.21, 0xfcd34d)
  const iceBr = bracket(0.72, 1.28, 0.21, 0x93c5fd)
  const L = (text, x, y, color, h) => { const s = textSprite(text, { color, height: h }); s.position.set(x, y, 0); g.add(s); return s }
  const innerL = L('Rocky inner planets', -0.96, 0.25, '#fdba74', 0.13)
  const outerL = L('Giant outer planets', 0.52, 0.38, '#67e8f9', 0.13)
  const gasL = L('Gas giants', 0.19, 0.28, '#fcd34d', 0.1)
  const iceL = L('Ice giants', 1.0, 0.28, '#93c5fd', 0.1)
  const beltL = L('Asteroid belt', -0.39, -0.15, '#d6c2a6', 0.1)
  const sunL = L('Sun', -1.55, -0.21, '#fde68a', 0.1)
  const note = L('Not to scale', 1.05, -0.2, '#8fa6c9', 0.08)
  note.material.opacity = 0.8
  let t = 0
  const inner = ['mercury', 'venus', 'earth', 'mars'], outer = ['jupiter', 'saturn', 'uranus', 'neptune']
  const glow = (ids, k) => { for (const id of ids) planets[id].scale.setScalar(1 + 0.25 * k) }
  return {
    group: g,
    show() { g.visible = true; t = 0 },
    hide() { g.visible = false },
    get visible() { return g.visible },
    update(dt) {
      if (!g.visible) return
      t += dt
      for (const id in planets) planets[id].rotation.y += dt * 0.4
      // first the rocky planets light up, then the giants, then both stay marked
      const pulse = (a, b) => (t > a && t < b ? 0.5 + 0.5 * Math.sin((t - a) * 5) : 0)
      glow(inner, pulse(1, 6))
      glow(outer, pulse(6, 11))
      const a1 = Math.min(1, Math.max(0, t - 0.6)), a2 = Math.min(1, Math.max(0, t - 5.6)), a3 = Math.min(1, Math.max(0, t - 8))
      innerBr.material.opacity = innerL.material.opacity = a1
      outerBr.material.opacity = outerL.material.opacity = a2
      gasBr.material.opacity = iceBr.material.opacity = gasL.material.opacity = iceL.material.opacity = a3
      beltL.material.opacity = sunL.material.opacity = Math.min(1, t)
    },
  }
}
