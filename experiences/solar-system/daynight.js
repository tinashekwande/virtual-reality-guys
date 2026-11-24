import * as THREE from 'three'
import { EarthShader, EarthCloudsShader, AtmosphereHaloShader } from './planet-shaders.js'
import { glowTexture } from './scene.js'

// "How do days and years work?": a small lesson scene opened from the Earth stop.
//  1. Day and night: Earth spins on its tilted axis with the Sun lighting one side. A pin on Cape Town moves from
//     day into night; one spin is 24 hours (the clock is Cape Town's sun time).
//  2. One year: we zoom out (Earth shrinks, the Sun slides in) and Earth travels once around the Sun, about 365 days,
//     with its axis always tilted the same way. In December the southern half leans towards the Sun: summer in
//     Cape Town. In June it leans away: winter.
// You stand still the whole time (comfortable in VR); the things around you move.
// Not to scale: Earth's path is drawn much smaller, and nearly round, as it really is.

const TILT = THREE.MathUtils.degToRad(23.4) // Earth's axis tilt (NASA)
const CAPE_TOWN = { lat: -33.92, lon: 18.42 }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
const SOLSTICE_DEC = 354 // 21 December, counting 1 January as day 0
const DAY_SPIN_SECONDS = 14 // one 24-hour spin
const YEAR_SECONDS = 22 // one trip around the Sun
const ZOOM_SECONDS = 3.2

// layout (you stand at the origin looking along +x; +z is to your right)
const SUN_DIR = new THREE.Vector3(-0.12, 0, -1).normalize() // from Earth towards the Sun: off to your left, so you see day and night side by side
const E_DAY = new THREE.Vector3(3.3, 1.45, -0.6) // Earth, big, in front of you
const R_DAY = 0.8
const S_YEAR = new THREE.Vector3(4.4, 1.0, -0.75) // the Sun in the year view
const ORBIT_R = 1.45
const R_YEAR = 0.2
const SUN_R_YEAR = 0.36

/** Unit direction on a three.js sphere for a latitude/longitude (same mapping as the textures). */
export function latLonDir(lat, lon) {
  const phi = ((lon + 180) / 360) * Math.PI * 2, theta = ((90 - lat) / 180) * Math.PI
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta))
}

function textSprite(text, { color = '#e8f1ff', size = 0.5, bg = 'rgba(6,12,28,0.78)' } = {}) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 160
  const ctx = c.getContext('2d')
  ctx.font = 'bold 64px "Trebuchet MS", system-ui, sans-serif'
  const w = Math.min(1000, ctx.measureText(text).width + 70)
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect((1024 - w) / 2, 22, w, 116, 58)
  ctx.fill()
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 512, 82, 960)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }))
  s.scale.set(size * 6.4, size, 1)
  return s
}

export function buildDayNight({ earthUniforms, skyTex, sunMaterial }) {
  const scene = new THREE.Scene()
  const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 48, 24), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, toneMapped: false }))
  sky.renderOrder = -10
  scene.add(sky)

  // ---- Earth on its tilted axis ----
  const north = new THREE.Vector3(0, Math.cos(TILT), 0).addScaledVector(SUN_DIR.clone().negate().setY(0).normalize(), Math.sin(TILT)).normalize()
  const holder = new THREE.Group() // position + size
  const axis = new THREE.Group() // tilt
  axis.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), north)
  holder.add(axis)
  scene.add(holder)
  const sunDir = { value: SUN_DIR.clone() }
  const earthMat = new THREE.ShaderMaterial({
    uniforms: { uHasNormal: { value: 1 }, uDayTex: earthUniforms.uDayTex, uNightTex: earthUniforms.uNightTex, uSpecTex: earthUniforms.uSpecTex, uNormalMap: earthUniforms.uNormalMap, uCloudTex: earthUniforms.uCloudTex, uSunDir: sunDir },
    vertexShader: EarthShader.vertexShader, fragmentShader: EarthShader.fragmentShader,
  })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), earthMat)
  axis.add(earth)
  earth.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.009, 72, 48),
    new THREE.ShaderMaterial({ uniforms: { uCloudTex: earthUniforms.uCloudTex, uSunDir: sunDir }, vertexShader: EarthCloudsShader.vertexShader, fragmentShader: EarthCloudsShader.fragmentShader, transparent: true, depthWrite: false }),
  ))
  axis.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.032, 64, 48),
    new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color('#429eff') }, uSunDir: sunDir }, vertexShader: AtmosphereHaloShader.vertexShader, fragmentShader: AtmosphereHaloShader.fragmentShader, transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  ))
  // the axis: a thin rod through the poles
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.7, 8), new THREE.MeshBasicMaterial({ color: 0xe8f1ff, transparent: true, opacity: 0.85, toneMapped: false }))
  axis.add(rod)
  const nLabel = textSprite('North Pole', { size: 0.16 })
  nLabel.position.set(0, 1.5, 0)
  const sLabel = textSprite('South Pole', { size: 0.16 })
  sLabel.position.set(0, -1.5, 0)
  axis.add(nLabel, sLabel)
  const axisLabel = textSprite('Axis: tilted 23.4°', { size: 0.17, color: '#bfe3ff' })
  scene.add(axisLabel)

  // Cape Town pin
  const capeDir = latLonDir(CAPE_TOWN.lat, CAPE_TOWN.lon)
  const pin = new THREE.Group()
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff4d6d, toneMapped: false }))
  dot.position.copy(capeDir).multiplyScalar(1.01)
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8), new THREE.MeshBasicMaterial({ color: 0xff8fa3, toneMapped: false }))
  beam.position.copy(capeDir).multiplyScalar(1.14)
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), capeDir)
  pin.add(dot, beam)
  earth.add(pin)

  // ---- the Sun ----
  const sunGroup = new THREE.Group()
  // the same animated plasma Sun as in space (its own copy, with its own clock)
  const sunMat = sunMaterial.clone()
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), sunMat)
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture([255, 225, 160], [255, 170, 70], 0.35), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }))
  sunGlow.scale.setScalar(5.5)
  sunGroup.add(sunBall, sunGlow)
  const sunLabel = textSprite('The Sun', { size: 0.5, color: '#fde68a' })
  sunLabel.position.set(0, 2.2, 0)
  sunGroup.add(sunLabel)
  scene.add(sunGroup)
  const S_DAY = E_DAY.clone().addScaledVector(SUN_DIR, 40)
  const lightHint = textSprite('Sunlight comes from this side', { size: 0.2, color: '#fde68a' })
  lightHint.position.copy(E_DAY).addScaledVector(SUN_DIR, 1.05).add(new THREE.Vector3(0, 1.05, 0))
  scene.add(lightHint)

  // ---- the year view: Earth's path, months and seasons ----
  const yearGroup = new THREE.Group()
  yearGroup.position.copy(S_YEAR)
  scene.add(yearGroup)
  {
    const pts = []
    for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R)) }
    yearGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x7fb4ff, transparent: true, opacity: 0.55 })))
  }
  const radial = (day) => {
    const phi = phi0 + ((day - SOLSTICE_DEC) / 365.25) * Math.PI * 2
    return new THREE.Vector3(Math.cos(phi), 0, -Math.sin(phi))
  }
  const r0 = SUN_DIR.clone().negate().setY(0).normalize() // where Earth is in December (sun-to-Earth direction)
  const phi0 = Math.atan2(-r0.z, r0.x)
  const marks = [
    [SOLSTICE_DEC, 'December: summer in Cape Town', '#fca5a5', 0.24],
    [171, 'June: winter in Cape Town', '#93c5fd', 0.24],
    [79, 'March', '#cbd5e1', 0.17],
    [265, 'September', '#cbd5e1', 0.17],
  ].map(([day, text, color, size]) => {
    const s = textSprite(text, { color, size })
    // the big season labels float above the path; March and September sit just below it, clear of the Sun
    s.position.copy(radial(day)).multiplyScalar(ORBIT_R + (size > 0.2 ? 0.2 : 0.3)).add(new THREE.Vector3(0, size > 0.2 ? 0.5 : -0.3, 0))
    yearGroup.add(s)
    return s
  })
  yearGroup.visible = false

  // ---- state ----
  let phase = 'idle' // 'day' | 'dayDone' | 'zoom' | 'year' | 'yearDone'
  let spin = 0 // Earth's spin angle
  let tPhase = 0
  let day = SOLSTICE_DEC
  let daysPassed = 0
  let wasLit = null
  const listeners = []
  const emit = (e) => listeners.forEach((f) => f(e))
  const tmp = new THREE.Vector3(), q = new THREE.Quaternion()

  // the spin angle that puts Cape Town at 05:00 (just before sunrise), so you watch the Sun come up
  function hourAt(angle) {
    earth.rotation.y = angle
    holder.updateMatrixWorld(true)
    const p = capeDir.clone().applyQuaternion(earth.getWorldQuaternion(q)).normalize()
    const sp = sunDir.value.clone().addScaledVector(north, -sunDir.value.dot(north))
    const pp = p.clone().addScaledVector(north, -p.dot(north))
    const ang = Math.atan2(north.dot(new THREE.Vector3().crossVectors(sp, pp)), sp.dot(pp))
    return { hour: (12 + THREE.MathUtils.radToDeg(ang) / 15 + 24) % 24, lit: p.dot(sunDir.value) > 0 }
  }
  function startAngle() {
    let best = 0, bestErr = 99
    for (let a = 0; a < Math.PI * 2; a += 0.005) {
      const h = hourAt(a).hour
      const err = Math.abs(h - 5)
      if (err < bestErr) { bestErr = err; best = a }
    }
    return best
  }

  function layout(k) {
    // k: 0 = big Earth (day view), 1 = year view
    const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2
    const ePos = E_DAY.clone().lerp(S_YEAR.clone().addScaledVector(r0, ORBIT_R), e)
    holder.position.copy(ePos)
    holder.scale.setScalar(THREE.MathUtils.lerp(R_DAY, R_YEAR, e))
    sunGroup.position.copy(S_DAY).lerp(S_YEAR, e)
    sunBall.scale.setScalar(THREE.MathUtils.lerp(1.6, SUN_R_YEAR, e))
    sunGlow.scale.setScalar(THREE.MathUtils.lerp(9, 1.2, e))
    sunLabel.position.set(0, THREE.MathUtils.lerp(2.4, 0.6, e), 0)
    sunLabel.scale.set(THREE.MathUtils.lerp(0.5, 0.2, e) * 6.4, THREE.MathUtils.lerp(0.5, 0.2, e), 1)
    nLabel.visible = sLabel.visible = e < 0.3
    axisLabel.visible = e < 0.3
    lightHint.visible = e < 0.15
    rod.scale.y = THREE.MathUtils.lerp(1, 1.4, e)
  }

  function placeEarthOnOrbit() {
    holder.position.copy(S_YEAR).addScaledVector(radial(day), ORBIT_R)
  }

  let clock = 0
  function update(dt) {
    clock += dt
    sunMat.uniforms.uTime.value = clock
    tPhase += dt
    if (phase === 'day') {
      spin += ((Math.PI * 2) / DAY_SPIN_SECONDS) * dt
      if (tPhase >= DAY_SPIN_SECONDS) { phase = 'dayDone'; emit('dayDone') }
    } else if (phase === 'zoom') {
      layout(Math.min(1, tPhase / ZOOM_SECONDS))
      if (tPhase >= ZOOM_SECONDS) { phase = 'year'; tPhase = 0; yearGroup.visible = true; emit('yearStart') }
    } else if (phase === 'year') {
      const k = Math.min(1, tPhase / YEAR_SECONDS)
      daysPassed = Math.round(k * 365)
      day = SOLSTICE_DEC + k * 365.25
      placeEarthOnOrbit()
      spin += dt * 9 // shows it still spinning (really it spins 365 times on the way)
      if (k >= 1) { phase = 'yearDone'; emit('yearDone') }
    }
    earth.rotation.y = spin
    sunDir.value.copy(sunGroup.position).sub(holder.position).normalize()
    // the axis label sits beside the North Pole
    axisLabel.position.copy(holder.position).addScaledVector(north, holder.scale.x * 1.75).add(new THREE.Vector3(0, 0.05, 0.55))
    if (phase === 'day' || phase === 'dayDone') {
      const lit = hourAt(spin).lit
      if (wasLit !== null && lit !== wasLit) emit(lit ? 'sunrise' : 'sunset')
      wasLit = lit
    }
  }

  return {
    scene,
    start: { position: new THREE.Vector3(0, 0, 0), yaw: -Math.PI / 2 },
    on(fn) { listeners.push(fn) },
    /** Begin (or restart) the day-and-night part. */
    begin() {
      layout(0)
      yearGroup.visible = false
      sunDir.value.copy(SUN_DIR)
      spin = startAngle()
      wasLit = null
      tPhase = 0
      day = SOLSTICE_DEC
      daysPassed = 0
      phase = 'day'
    },
    /** Zoom out and travel once around the Sun. */
    startYear() {
      if (phase === 'zoom' || phase === 'year') return
      tPhase = 0
      day = SOLSTICE_DEC
      daysPassed = 0
      phase = 'zoom'
    },
    get phase() { return phase },
    /** What the clock and calendar show right now. */
    info() {
      const { hour, lit } = hourAt(spin)
      const d = Math.floor(((day % 365) + 365) % 365)
      let m = 11
      while (m > 0 && MONTH_START[m] > d) m--
      const season = [11, 0, 1].includes(m) ? 'summer' : m <= 4 ? 'autumn' : m <= 7 ? 'winter' : 'spring'
      return { hour, lit, date: `${d - MONTH_START[m] + 1} ${MONTHS[m]}`, month: MONTHS[m], season, daysPassed, spinT: phase === 'day' ? tPhase / DAY_SPIN_SECONDS : 1 }
    },
    update,
    /** for testing: jump to a moment (part 'day' 0..1 or 'year' 0..1) */
    setProgress(part, k) {
      if (part === 'day') { this.begin(); tPhase = k * DAY_SPIN_SECONDS; spin += k * Math.PI * 2 } else { layout(1); yearGroup.visible = true; phase = 'year'; tPhase = k * YEAR_SECONDS }
      update(0)
    },
  }
}
