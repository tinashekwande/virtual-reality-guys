import * as THREE from 'three'
import { createXrApp } from '../shared/xr-app.js'
import { Panel } from '../shared/panel.js'
import { createAudio } from '../shared/audio.js'
import { createNarration } from '../shared/narration.js'
import { buildScene, placeFor, posOf, SPEC, OVERVIEW, SCALE_VIEW } from './scene.js'
import { STOPS, QUIZ, DAYNIGHT, MOMENTS, INNER, OUTER } from './content.js'
import { buildRingDive } from './ring-dive.js'
import { buildCape } from './cape.js'
import { buildDayNight, latLonDir } from './daynight.js'
import { buildNeptuneView } from './neptune-view.js'
import { buildSunRuler, buildSpotCompare, buildBeltHologram, GRS_LAT, GRS_LON } from './moments.js'
import { saveSession, loadTeacher, saveTeacher } from './results-store.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

const app = createXrApp()
const { scene, rig } = app
document.getElementById('enter').appendChild(app.vrButton)

// ---- loading screen ----
const manager = new THREE.LoadingManager()
const loadingEl = document.getElementById('loading')
manager.onProgress = (_url, loaded, total) => {
  if (loadingEl) loadingEl.querySelector('span').textContent = `${Math.round((loaded / total) * 100)}%`
}
manager.onLoad = () => loadingEl && loadingEl.classList.add('done')

const world = buildScene(app, manager)
const mainScene = app.scene
app.onFrame((dt, t) => { if (app.activeScene === mainScene) world.update(dt, t) })

// close-up scenes, built on first use
let dive = null
app.onFrame((dt, t) => { if (dive && app.activeScene === dive.scene) dive.update(dt, t, rig) })
let cape = null
const getCape = () => (cape ||= buildCape({ earthMap: world.earthMap, skyTex: world.skyTexture, renderer: app.renderer }))
let altShown = 0
app.onFrame((dt, t) => {
  if (!cape || app.activeScene !== cape.scene) return
  cape.update(rig, app.camera, dt, t)
  if (cape.mode === 'down' && t - altShown > 0.4) { altShown = t; drawDescent() }
})
let dayNight = null
let neptuneView = null
app.onFrame((dt, t) => { if (neptuneView && app.activeScene === neptuneView.scene) neptuneView.update(dt, t, rig) })

// ---- sound + narration ----
const audio = createAudio()
const narration = createNarration(new URL('../audio/solar-system/', location.href).href)
app.onGesture(() => audio.unlock())

const HOME = { position: new THREE.Vector3(-34, 0, 0), yaw: -Math.PI / 2 }

// ---- the floating panel ----
const panel = new Panel({ width: 1.35 })
const PANEL_POS = { pos: new THREE.Vector3(0.95, 1.25, -1.6), rotY: -0.38 }
function panelAt(pos, rotY) {
  panel.mesh.position.copy(pos)
  panel.mesh.rotation.y = rotY
}
panelAt(PANEL_POS.pos, PANEL_POS.rotY)
app.addPanel(panel)
const LOGO = 'VR GUYS'
const LOGO_SPOT = [{ id: 'logo', x: 800, y: 14, w: 210, h: 80 }] // hold here for teacher mode

// ---- the planet picker (from Beyond the Void): jump to any planet, in any order, and change the view ----
const picker = new Panel({ width: 0.95, name: 'picker' })
picker.mesh.position.set(-1.0, 1.1, -1.45)
picker.mesh.rotation.y = 0.45
app.addPanel(picker)
const view = { bloom: true, labels: true, speed: 1 }
const SPEEDS = [1, 5, 25, 0]
function drawPicker() {
  const go = (id, label) => ({ id: 'go:' + id, label, primary: currentId() === id })
  picker.show({
    title: 'Go to',
    accent: '#a78bfa',
    rows: [
      [go('sun', 'Sun'), go('mercury', 'Mercury'), go('venus', 'Venus'), go('earth', 'Earth')],
      [go('mars', 'Mars'), go('belt', 'Belt'), go('jupiter', 'Jupiter'), go('saturn', 'Saturn')],
      [go('uranus', 'Uranus'), go('neptune', 'Neptune'), { id: 'view:scale', label: MOMENTS.scale.button, size: 34 }],
      [
        { id: 'view:tour', label: 'Guided tour', size: 32 },
        { id: 'view:bloom', label: view.bloom ? 'Bloom: on' : 'Bloom: off', size: 32 },
        { id: 'view:labels', label: view.labels ? 'Labels: on' : 'Labels: off', size: 32 },
        { id: 'view:speed', label: view.speed ? `Spin: ${view.speed}x` : 'Spin: paused', size: 32 },
      ],
    ],
  })
}
// only offered out in space, when you are not flying somewhere (not during the quiz, so scores stay fair)
let pickerKey = ''
app.onFrame(() => {
  const show = app.activeScene === mainScene && ['intro', 'stop', 'result'].includes(state.screen) && !app.isMoving()
  const key = show ? currentId() + state.screen : ''
  if (key === pickerKey) return
  pickerKey = key
  if (show) drawPicker()
  else picker.hide()
})

// bloom: soft glow around bright things on a flat screen (post-processing). Headsets cannot run
// post-processing, so there the same button turns up the Sun's glow and the stars instead.
const composer = new EffectComposer(app.renderer)
const renderPass = new RenderPass(scene, app.camera)
composer.addPass(renderPass)
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.68, 0.38, 0.97))
composer.addPass(new OutputPass())
window.addEventListener('resize', () => composer.setSize(window.innerWidth, window.innerHeight))
function applyView() {
  app.setRender(view.bloom ? (sc, cam) => {
    renderPass.scene = sc
    renderPass.camera = cam
    // the planet shaders already give display colours, so skip the extra tone mapping at the end
    const tm = app.renderer.toneMapping
    app.renderer.toneMapping = THREE.NoToneMapping
    composer.render()
    app.renderer.toneMapping = tm
  } : null)
  world.sunGlow.material.opacity = view.bloom ? 0.75 : 0.45
  if (world.starUniforms) world.starUniforms.uVRBoost.value = view.bloom && app.renderer.xr.isPresenting ? 1.35 : 1
  for (const l of world.labels) l.visible = view.labels
  world.setTimeScale(view.speed)
}
app.renderer.xr.addEventListener('sessionstart', applyView)
app.renderer.xr.addEventListener('sessionend', applyView)

// ---- state ----
const teacher = loadTeacher()
const state = {
  travel: 'fly', screen: 'intro', stop: 0, quiz: 0, score: 0, answered: null, discovered: new Set(),
  learner: null, session: null, answers: {}, moment: null, scaleBack: null,
}
const currentId = () => (state.screen === 'stop' ? STOPS[state.stop].id : null)
const stopIndex = (id) => STOPS.findIndex((x) => x.id === id)

// ---- tapping planets ----
for (const s of STOPS) {
  const mesh = s.id === 'sun' ? world.sun : world.bodies[s.id]
  app.addTarget(mesh, 'planet:' + s.id, () => currentId() === s.id)
}

// glowing ring when you point at the planet
const ringTex = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.strokeStyle = 'rgba(120,230,255,0.9)'
  ctx.lineWidth = 6
  ctx.shadowColor = 'rgba(80,220,255,1)'
  ctx.shadowBlur = 14
  ctx.beginPath()
  ctx.arc(128, 128, 110, 0, Math.PI * 2)
  ctx.stroke()
  return new THREE.CanvasTexture(c)
})()
const highlight = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
highlight.visible = false
scene.add(highlight)
let hovered = null
app.onHoverTarget((id) => {
  hovered = id ? id.slice(7) : null
  highlight.visible = !!hovered && !state.discovered.has(hovered)
  if (hovered) {
    const s = SPEC[hovered]
    highlight.position.copy(posOf(hovered))
    highlight.userData.size = s.r * 2.6
  }
})
app.onFrame((dt, t) => {
  if (highlight.visible) highlight.scale.setScalar(highlight.userData.size * (1 + 0.04 * Math.sin(t * 5)))
})

// sparkle burst
const burst = (() => {
  const n = 90
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  const dotTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.3, 'rgba(190,240,255,0.8)')
    g.addColorStop(1, 'rgba(120,200,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  const mat = new THREE.PointsMaterial({ map: dotTex, color: 0xffffff, size: 0.3, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const pts = new THREE.Points(geo, mat)
  pts.visible = false
  pts.frustumCulled = false
  scene.add(pts)
  const vel = Array.from({ length: n }, () => new THREE.Vector3())
  let life = 0
  app.onFrame((dt) => {
    if (!pts.visible) return
    life += dt
    const p = geo.attributes.position
    for (let i = 0; i < n; i++) {
      p.setXYZ(i, p.getX(i) + vel[i].x * dt, p.getY(i) + vel[i].y * dt, p.getZ(i) + vel[i].z * dt)
      vel[i].multiplyScalar(Math.pow(0.4, dt))
    }
    p.needsUpdate = true
    mat.opacity = Math.max(0, 1 - life / 1.6)
    if (life > 1.6) pts.visible = false
  })
  return (at, scale, size = 0.1 * scale) => {
    const p = geo.attributes.position
    for (let i = 0; i < n; i++) {
      p.setXYZ(i, at.x, at.y, at.z)
      vel[i].randomDirection().multiplyScalar((1 + Math.random() * 3) * scale)
    }
    mat.size = size
    life = 0
    pts.visible = true
  }
})()

// Cape Town pin on Earth
const CAPE_TOWN = { lat: -33.92, lon: 18.42 }
const capePin = (() => {
  const r = SPEC.earth.r
  const dir = latLonDir(CAPE_TOWN.lat, CAPE_TOWN.lon)
  const g = new THREE.Group()
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff4d6d, toneMapped: false }))
  dot.position.copy(dir).multiplyScalar(r * 1.005)
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 8), new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.8, toneMapped: false }))
  beam.position.copy(dir).multiplyScalar(r + 0.4)
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  const c = document.createElement('canvas')
  c.width = 768
  c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(10,16,32,0.85)'
  ctx.beginPath()
  ctx.roundRect(8, 16, 752, 96, 44)
  ctx.fill()
  ctx.font = 'bold 52px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillStyle = '#ffd1dc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Cape Town: you are here!', 384, 66, 720)
  const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true, toneMapped: false }))
  tag.scale.set(2.7, 0.45, 1)
  tag.position.copy(dir).multiplyScalar(r + 1.0)
  tag.renderOrder = 20
  g.add(dot, beam, tag)
  g.visible = false
  world.bodies.earth.add(g)
  g.userData.dir = dir
  return g
})()

/** Turn a planet (around its own axis) so a spot on it faces you; it stops spinning until reset. */
const turns = {}
function turnToFace(id, localDir, then) {
  const body = world.bodies[id]
  const center = posOf(id)
  const toViewer = new THREE.Vector3(-1, 0, 0)
  const saved = body.rotation.y
  let best = 0, bestDot = -2
  for (let a = 0; a < 360; a += 2) {
    body.rotation.y = (a * Math.PI) / 180
    body.updateMatrixWorld(true)
    const w = localDir.clone().applyMatrix4(body.matrixWorld).sub(center).normalize()
    const d = w.dot(toViewer)
    if (d > bestDot) { bestDot = d; best = body.rotation.y }
  }
  body.rotation.y = saved
  const delta = ((best - (saved % (Math.PI * 2))) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI
  turns[id] = { from: saved, to: saved + delta, t: 0, then }
  const sp = world.spinnerOf(id)
  if (sp) { sp.saved = sp.saved ?? sp.speed; sp.speed = 0; sp.boost = 0 }
}
app.onFrame((dt) => {
  for (const [id, tr] of Object.entries(turns)) {
    tr.t = Math.min(1, tr.t + dt / 1.8)
    const k = tr.t < 0.5 ? 2 * tr.t ** 2 : 1 - (-2 * tr.t + 2) ** 2 / 2
    world.bodies[id].rotation.y = tr.from + (tr.to - tr.from) * k
    if (tr.t >= 1) { delete turns[id]; if (tr.then) tr.then() }
  }
})
function resetTurn(id) {
  delete turns[id]
  const sp = world.spinnerOf(id)
  if (sp && sp.saved !== undefined) { sp.speed = sp.saved; delete sp.saved }
}
function turnEarthToCapeTown() {
  turnToFace('earth', capePin.userData.dir.clone().multiplyScalar(SPEC.earth.r), () => (capePin.visible = true))
}
function resetEarth() {
  capePin.visible = false
  resetTurn('earth')
}

// ---- wow moments in the main scene ----
const sunRuler = buildSunRuler(scene, { earthMap: world.earthMap, sunPos: world.sunPos, sunR: SPEC.sun.r })
const spot = buildSpotCompare(scene, { earthUniforms: world.bodies.earth.material.uniforms, sunPos: world.sunPos })
const planetMaps = Object.fromEntries([...INNER, ...OUTER].map((id) => [id, id === 'earth' ? world.earthMap : world.bodies[id].material.uniforms.uMap.value]))
const hologram = buildBeltHologram(rig, planetMaps)
let rulerShownAt = -1
app.onFrame((dt) => {
  if (sunRuler.active) {
    const r = sunRuler.update(dt)
    if (r.added && r.count % 3 === 0) audio.sfx.tick(r.count / 109)
    if (r.count !== rulerShownAt && state.moment === 'sunSize') {
      rulerShownAt = r.count
      if (r.count === 109) audio.sfx.swell(3.5)
      if (r.count % 4 === 0 || r.count === 109) drawStop()
    }
  }
  spot.update(dt)
  hologram.update(dt)
})
const INNER_TINT = Object.fromEntries([...INNER.map((id) => [id, '#fdba74']), ...OUTER.map((id) => [id, '#67e8f9'])])
function clearMoments() {
  sunRuler.hide()
  spot.hide()
  hologram.hide()
  world.tintLabels(null)
  resetTurn('jupiter')
  state.moment = null
}

// you glide in close, until the Sun fills your view, then 109 Earths appear in a line across its face
const SUN_CLOSE = { position: new THREE.Vector3(-SPEC.sun.r * 1.42, 0, 0), yaw: -Math.PI / 2 }
function showSunSize() {
  state.moment = 'sunSize'
  rulerShownAt = -1
  sunRuler.hide()
  narration.stop()
  audio.sfx.whoosh()
  drawStop()
  app.teleport(SUN_CLOSE, () => {
    const eye = rig.position.clone().add(new THREE.Vector3(0, app.isPresenting() ? 1.6 : app.camera.position.y, 0))
    sunRuler.show(eye, 4.5)
    narration.play('sun-size')
  })
}
function showSpot() {
  state.moment = 'spot'
  drawStop()
  audio.sfx.noise('rumble', 9)
  turnToFace('jupiter', latLonDir(GRS_LAT, GRS_LON).multiplyScalar(SPEC.jupiter.r), () => {
    if (state.moment !== 'spot') return
    spot.show(world.bodies.jupiter, SPEC.jupiter.r, app.camera.getWorldPosition(new THREE.Vector3()))
    audio.sfx.sparkle()
    narration.play('jupiter-spot')
  })
}

function discover(id, point) {
  if (state.discovered.has(id)) return
  state.discovered.add(id)
  highlight.visible = false
  audio.sfx.sparkle()
  burst(point || posOf(id), Math.max(1, SPEC[id].r * 0.4))
  if (id === 'earth') turnEarthToCapeTown()
  else world.boost(id, 2.5)
  drawStop()
  narration.play('secret-' + id)
}

// ---- flow ----
/**
 * Travel to a place. In "fly" mode you rise up until the whole solar system is spread out below you,
 * hover while the next planet is marked, then glide in. "Jump" mode is a quick fade for anyone who
 * feels unwell with movement. Very short hops always fade.
 */
function travelTo(place, destId, destName, then) {
  narration.stop()
  const far = place.position.distanceTo(rig.position) > 12
  if (state.travel === 'fly' && far) {
    world.markDestination(destId)
    world.arrangeMoons(destId, 8.6)
    panel.show({
      title: `Next stop: ${destName}`,
      body: 'Hold on, explorer! We are flying up to see the whole solar system.',
      buttons: [{ id: 'skip', label: 'Skip the flight' }],
      accent: '#fde68a',
    })
    audio.sfx.cruise(8.6)
    app.fly(place, OVERVIEW, {
      out: 3.2,
      hold: 1.8,
      in: 3.6,
      onVia: () =>
        panel.show({
          title: 'The whole solar system!',
          body: [`Look down: there is the Sun and all the planets going around it.`, `The glowing ring shows ${destName}, our next stop.`],
          buttons: [{ id: 'skip', label: 'Skip the flight' }],
          accent: '#fde68a',
        }),
      then: () => {
        world.markDestination(null)
        then()
      },
    })
  } else {
    audio.sfx.whoosh()
    app.teleport(place, then)
  }
}

function soundButton() {
  return { id: 'sound', label: audio.enabled ? 'Sound: on' : 'Sound: off' }
}

// ---- inside Saturn's rings ----
function enterRingDive() {
  if (!dive) dive = buildRingDive({ saturnMap: world.saturnMap, ringTex: world.satRingTex, skyTex: world.skyTexture })
  state.screen = 'ringdive'
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(dive.scene)
    app.placeNow(dive.start)
    panel.show({
      title: "Inside Saturn's rings!",
      body: [
        'The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house.',
        'That giant ball beside you is Saturn. Look all around you!',
      ],
      footer: 'The rings are huge but very thin: often only about 10 metres thick.',
      buttons: [{ id: 'leavedive', label: 'Back to Saturn', primary: true }],
      accent: '#fde68a',
    })
    narration.play('ringdive')
  })
}
function leaveRingDive() {
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(mainScene)
    app.placeNow(placeFor('saturn'))
    state.screen = 'stop'
    drawStop()
  })
}

// ---- down to Cape Town ----
const fmtKm = (a) => (a >= 100 ? Math.round(a / 10) * 10 : Math.round(a)).toLocaleString('en-ZA')
function drawDescent() {
  const a = cape.altitude()
  panel.show({
    title: 'Flying down to Cape Town',
    body: [`Height above the ground: ${fmtKm(a)} km`, a > 400 ? 'Look down: that is Africa below you!' : a > 60 ? 'Find the tip of Africa: that is the Cape.' : 'Almost there... look ahead for Table Mountain.'],
    buttons: [{ id: 'capeskip', label: 'Skip ahead' }],
    accent: '#60a5fa',
  })
}
async function enterCape() {
  const c = getCape()
  state.screen = 'cape'
  narration.stop()
  panel.show({ title: 'Getting ready...', body: 'Loading the map of the Cape.', accent: '#60a5fa' })
  await c.load()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(c.scene)
    app.placeNow(c.start)
    world.setPadGlass(true)
    app.camera.far = 400000
    app.camera.updateProjectionMatrix()
    c.descend(() => {
      panel.show({
        title: 'Cape Town from 7 km up!',
        body: [
          "Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet.",
          'To the right is False Bay, and far behind are the mountains of the Winelands.',
        ],
        footer: 'See the cloud spilling over Table Mountain? Capetonians call it the tablecloth.',
        buttons: [{ id: 'leavecape', label: 'Back to space', primary: true }],
        accent: '#60a5fa',
      })
      narration.play('cape')
    })
    drawDescent()
    audio.sfx.cruise(24)
  })
}
function leaveCape() {
  narration.stop()
  panel.show({ title: 'Back to space!', body: 'Hold on, we are flying up.', accent: '#60a5fa' })
  audio.sfx.cruise(13)
  cape.ascend(() => {
    app.blink(() => {
      app.setScene(mainScene)
      world.setPadGlass(false)
      app.camera.far = 2000
      app.camera.updateProjectionMatrix()
      app.placeNow(placeFor('earth'))
      cape.reset()
      state.screen = 'stop'
      drawStop()
    })
  })
}

// ---- days and years (from the Earth stop) ----
const pad2 = (n) => String(n).padStart(2, '0')
function drawClock(ctx, box) {
  const i = dayNight.info()
  const yearPart = ['year', 'yearDone'].includes(dayNight.phase)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.beginPath()
  ctx.roundRect(box.x, box.y, box.w, box.h, 26)
  ctx.fill()
  const cy = box.y + box.h / 2
  ctx.textBaseline = 'middle'
  if (!yearPart) {
    // sun or moon icon, then Cape Town's time
    const ix = box.x + 70
    if (i.lit) {
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath(); ctx.arc(ix, cy, 30, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 6
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * 40, cy + Math.sin(a) * 40); ctx.lineTo(ix + Math.cos(a) * 52, cy + Math.sin(a) * 52); ctx.stroke() }
    } else {
      ctx.fillStyle = '#c7d2fe'
      ctx.beginPath(); ctx.arc(ix, cy, 32, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#0b1530'
      ctx.beginPath(); ctx.arc(ix + 16, cy - 10, 28, 0, Math.PI * 2); ctx.fill()
    }
    const h = Math.floor(i.hour), m = Math.floor((i.hour % 1) * 60 / 15) * 15
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 54px "Trebuchet MS", system-ui, sans-serif'
    ctx.fillText(`Cape Town ${pad2(h)}:${pad2(m)}`, box.x + 140, cy - 18)
    ctx.font = 'bold 34px "Trebuchet MS", system-ui, sans-serif'
    ctx.fillStyle = i.lit ? '#fde68a' : '#a5b4fc'
    ctx.fillText(i.lit ? 'Day: facing the Sun' : 'Night: facing away from the Sun', box.x + 140, cy + 30)
    // a bar showing how much of the 24-hour spin is done
    const bx = box.x + box.w - 190, bw = 160
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(bx, cy - 8, bw, 16)
    ctx.fillStyle = '#60a5fa'; ctx.fillRect(bx, cy - 8, bw * Math.min(1, i.spinT), 16)
    ctx.font = '26px "Trebuchet MS", system-ui, sans-serif'; ctx.fillStyle = '#cfe3ff'
    ctx.fillText(`${Math.round(Math.min(1, i.spinT) * 24)} of 24 hours`, bx, cy + 32)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 50px "Trebuchet MS", system-ui, sans-serif'
    ctx.fillText(`Day ${i.daysPassed} of 365`, box.x + 30, cy - 20)
    ctx.font = 'bold 36px "Trebuchet MS", system-ui, sans-serif'
    ctx.fillStyle = { summer: '#fca5a5', autumn: '#fdba74', winter: '#93c5fd', spring: '#86efac' }[i.season]
    ctx.fillText(`${i.date}: ${i.season} in Cape Town`, box.x + 30, cy + 32)
    const bx = box.x + box.w - 190, bw = 160
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(bx, cy - 8, bw, 16)
    ctx.fillStyle = '#34d399'; ctx.fillRect(bx, cy - 8, (bw * i.daysPassed) / 365, 16)
  }
}
function drawDayNight() {
  const ph = dayNight.phase
  const part = ['zoom', 'year', 'yearDone'].includes(ph) ? DAYNIGHT.year : DAYNIGHT.day
  const buttons = ph === 'dayDone' ? [{ id: 'dn:back', label: 'Back to Earth' }, { id: 'dn:year', label: 'Next: one year', primary: true }]
    : ph === 'yearDone' ? [{ id: 'dn:again', label: 'Watch again' }, { id: 'dn:back', label: 'Back to Earth', primary: true }]
      : [{ id: 'dn:back', label: 'Back to Earth' }]
  panel.show({ title: part.title, body: part.text, footer: part.footer, extra: { h: 130, draw: drawClock }, buttons, accent: '#60a5fa' })
}
let dnDrawn = 0
app.onFrame((dt, t) => {
  if (!dayNight || app.activeScene !== dayNight.scene) return
  dayNight.update(dt)
  if (t - dnDrawn > 0.25) { dnDrawn = t; drawDayNight() }
})
function enterDayNight() {
  if (!dayNight) {
    const u = world.bodies.earth.material.uniforms
    dayNight = buildDayNight({ earthUniforms: u, skyTex: world.skyTexture, sunMaterial: world.sun.material })
    dayNight.on((e) => {
      if (e === 'sunrise') audio.sfx.dawn(true)
      if (e === 'sunset') audio.sfx.dawn(false)
      if (e === 'dayDone' || e === 'yearDone') { audio.sfx.correct(); drawDayNight() }
      if (e === 'yearStart') { narration.play('daynight-year'); audio.sfx.sweep(4) }
    })
  }
  state.screen = 'daynight'
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(dayNight.scene)
    app.placeNow(dayNight.start)
    panelAt(new THREE.Vector3(1.0, 1.22, -1.5), -0.52)
    dayNight.begin()
    drawDayNight()
    narration.play('daynight-day')
  })
}
function leaveDayNight() {
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(mainScene)
    panelAt(PANEL_POS.pos, PANEL_POS.rotY)
    app.placeNow(placeFor('earth'))
    state.screen = 'stop'
    drawStop()
  })
}

// ---- the Sun from Neptune ----
function drawSunCompare(ctx, box) {
  const cy = box.y + box.h / 2 - 12
  const cols = [box.x + box.w * 0.25, box.x + box.w * 0.75]
  const R = 58
  // from Earth: a big bright disc
  const g = ctx.createRadialGradient(cols[0], cy, 0, cols[0], cy, R * 1.6)
  g.addColorStop(0, 'rgba(255,250,220,1)'); g.addColorStop(0.6, 'rgba(255,210,110,1)'); g.addColorStop(0.62, 'rgba(255,170,60,0.35)'); g.addColorStop(1, 'rgba(255,140,40,0)')
  ctx.fillStyle = g
  ctx.beginPath(); ctx.arc(cols[0], cy, R * 1.6, 0, Math.PI * 2); ctx.fill()
  // from Neptune: 30 times narrower, much dimmer
  ctx.strokeStyle = 'rgba(255,235,170,0.6)'; ctx.setLineDash([10, 8]); ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(cols[1], cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])
  ctx.fillStyle = 'rgba(255,245,215,0.95)'
  ctx.beginPath(); ctx.arc(cols[1], cy, Math.max(2.2, R / 30), 0, Math.PI * 2); ctx.fill()
  ctx.font = 'bold 30px "Trebuchet MS", system-ui, sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  ctx.fillStyle = '#fde68a'; ctx.fillText('From Earth', cols[0], cy + R + 16)
  ctx.fillStyle = '#c7d2fe'; ctx.fillText('From Neptune', cols[1], cy + R + 16)
  ctx.textAlign = 'left'
}
function enterNeptuneView() {
  if (!neptuneView) neptuneView = buildNeptuneView({ neptuneMap: world.bodies.neptune.material.uniforms.uMap.value, skyTex: world.skyTexture })
  state.screen = 'neptune'
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(neptuneView.scene)
    app.placeNow(neptuneView.start)
    panel.show({
      title: MOMENTS.neptuneSun.title,
      body: MOMENTS.neptuneSun.text,
      footer: MOMENTS.neptuneSun.footer,
      extra: { h: 200, draw: drawSunCompare },
      buttons: [{ id: 'leaveneptune', label: 'Back to Neptune', primary: true }],
      accent: '#818cf8',
    })
    audio.sfx.noise('wind', 16)
    narration.play('neptune-sun')
  })
}
function leaveNeptuneView() {
  narration.stop()
  audio.sfx.whoosh()
  app.blink(() => {
    app.setScene(mainScene)
    app.placeNow(placeFor('neptune'))
    state.screen = 'stop'
    drawStop()
  })
}

// ---- real distances ----
let layoutAnim = null
app.onFrame((dt) => {
  if (!layoutAnim) return
  const a = layoutAnim
  a.t = Math.min(1, a.t + dt / a.seconds)
  const e = a.t < 0.5 ? 4 * a.t ** 3 : 1 - (-2 * a.t + 2) ** 3 / 2
  world.setLayout(a.from + (a.to - a.from) * e)
  if (a.t >= 1) { layoutAnim = null; a.then && a.then() }
})
function showScale() {
  const back = state.screen === 'stop' ? { stop: state.stop } : { screen: state.screen }
  clearMoments()
  resetEarth()
  state.scaleBack = back
  state.screen = 'scale'
  narration.stop()
  audio.sfx.whoosh()
  app.teleport(SCALE_VIEW, () => {
    panelAt(new THREE.Vector3(0.95, 1.85, -1.55), -0.38) // up high, so the planets below stay in view
    panel.show({ title: MOMENTS.scale.title, body: ['Watch the planets move out to their real distances from the Sun...'], accent: '#a78bfa' })
    setTimeout(() => {
      if (state.screen !== 'scale') return
      audio.sfx.sweep(7, true)
      narration.play('scale')
      layoutAnim = {
        from: 0, to: 1, t: 0, seconds: 7,
        then: () => panel.show({ title: MOMENTS.scale.title, body: MOMENTS.scale.text, footer: MOMENTS.scale.footer, buttons: [{ id: 'scaleback', label: 'Put them back', primary: true }], accent: '#a78bfa' }),
      }
    }, 900)
  })
}
function hideScale() {
  narration.stop()
  audio.sfx.sweep(4, false)
  panel.show({ title: 'Back to the tour', body: 'Moving the planets back close together...', accent: '#a78bfa' })
  layoutAnim = {
    from: 1, to: 0, t: 0, seconds: 4,
    then: () => {
      const b = state.scaleBack || { screen: 'intro' }
      state.scaleBack = null
      panelAt(PANEL_POS.pos, PANEL_POS.rotY)
      if (b.stop !== undefined) return showStop(b.stop)
      state.screen = 'travel'
      app.teleport(HOME, () => (b.screen === 'result' ? showResult(true) : showIntro()))
    },
  }
}

// ---- learner number, teacher mode ----
function showIntro() {
  state.screen = 'intro'
  panel.show({
    title: 'Journey through the Solar System',
    body: [
      'Welcome, space explorer! We will visit the Sun, the asteroid belt and all 8 planets.',
      'Point at a button and squeeze the trigger (or pinch your fingers) to choose it.',
    ],
    footer: 'Sizes and distances are made to fit, not to scale. Feeling dizzy when flying? Choose "Travel: jump".',
    buttons: [
      { id: 'start', label: 'Start', primary: true },
      soundButton(),
      { id: 'travel', label: state.travel === 'fly' ? 'Travel: fly' : 'Travel: jump' },
    ],
    logo: LOGO,
    hidden: LOGO_SPOT,
    accent: '#22d3ee',
  })
  narration.play('intro')
}

function showLearner() {
  state.screen = 'learner'
  narration.stop()
  const rows = []
  for (let r = 0; r < 5; r++) rows.push(Array.from({ length: 8 }, (_, k) => { const n = r * 8 + k + 1; return { id: 'learner:' + n, label: String(n) } }))
  rows.push([{ id: 'learner:0', label: 'No number', size: 36 }])
  panel.show({ title: 'Who is flying? Pick your number', rows, rowsTop: 136, rowGap: 14, logo: LOGO, hidden: LOGO_SPOT, accent: '#22d3ee' })
}

function startTour() {
  state.session = { startedAt: performance.now(), start: teacher.on ? teacher.start : 'sun' }
  state.discovered.clear()
  state.answers = {}
  if (teacher.on && teacher.start === 'quiz') return showQuiz(0)
  showStop(teacher.on ? Math.max(0, stopIndex(teacher.start)) : 0)
}

function beginSession() {
  if (teacher.askNumber) return showLearner()
  state.learner = null
  startTour()
}

function showTeacher() {
  state.screen = 'teacher'
  narration.stop()
  const opt = (id, label) => ({ id: 'tstart:' + id, label, primary: teacher.start === id, size: 34 })
  panel.show({
    title: 'Teacher mode',
    accent: '#f472b6',
    rowsTop: 130,
    rowGap: 16,
    rows: [
      [opt('sun', 'Sun'), opt('mercury', 'Mercury'), opt('venus', 'Venus'), opt('earth', 'Earth')],
      [opt('mars', 'Mars'), opt('belt', 'Belt'), opt('jupiter', 'Jupiter'), opt('saturn', 'Saturn')],
      [opt('uranus', 'Uranus'), opt('neptune', 'Neptune'), opt('quiz', 'Quiz only')],
      [
        { id: 'tmode', label: teacher.on ? 'Teacher mode: on' : 'Teacher mode: off', size: 32 },
        { id: 'tnumbers', label: teacher.askNumber ? 'Learner numbers: on' : 'Learner numbers: off', size: 32 },
      ],
      [{ id: 'tclose', label: 'Close' }, { id: 'tgo', label: 'Start now', primary: true }],
    ],
  })
}

function drawStop() {
  const i = state.stop
  const s = STOPS[i]
  const found = state.discovered.has(s.id)
  const extras = []
  if (s.id === 'sun') extras.push({ id: 'm:sunsize', label: MOMENTS.sunSize.button })
  if (s.id === 'earth') extras.push({ id: 'daynight', label: 'How do days and years work?', size: 34 }, { id: 'cape', label: 'Fly to Cape Town', size: 34 })
  if (s.id === 'jupiter') extras.push({ id: 'm:spot', label: MOMENTS.spot.button })
  if (s.id === 'saturn') extras.push({ id: 'ringdive', label: 'Dive into the rings' })
  if (s.id === 'neptune') extras.push({ id: 'm:neptune', label: MOMENTS.neptuneSun.button })
  const nav = [
    ...(i > 0 ? [{ id: 'back', label: 'Back' }] : []),
    { id: 'next', label: i === STOPS.length - 1 ? 'Take the quiz' : 'Next stop', primary: true },
  ]
  let title = `${i + 1}/${STOPS.length}  ${s.name}`
  let body = s.text
  if (state.moment === 'sunSize') {
    title = MOMENTS.sunSize.title
    const n = sunRuler.count
    body = [...MOMENTS.sunSize.text]
    body.unshift(`Earths across the Sun: ${n}`)
  } else if (state.moment === 'spot') {
    title = MOMENTS.spot.title
    body = MOMENTS.spot.text
  }
  const footer = s.id === 'belt' ? (found ? `Secret: ${s.secret}` : 'The belt is mostly empty space: spacecraft fly through it safely. Point at Ceres and squeeze to discover a secret!')
    : found ? `Secret: ${s.secret}` : `Point at ${s.id === 'sun' ? 'the Sun' : s.name} and squeeze to discover a secret!`
  panel.show({
    title,
    body,
    footer,
    footerColor: found ? s.accent : '#8fa6c9',
    buttonRows: [extras, nav],
    accent: s.accent,
  })
}

function showStop(i) {
  state.screen = 'travel'
  clearMoments()
  resetEarth()
  if (state.travel !== 'fly') world.arrangeMoons(STOPS[i].id, 0.8)
  travelTo(placeFor(STOPS[i].id), STOPS[i].id, STOPS[i].name, () => {
    if (STOPS[i].id === 'earth') getCape().load() // start loading the Cape map in the background
    state.screen = 'stop'
    state.stop = i
    if (STOPS[i].id === 'belt') {
      hologram.show()
      world.tintLabels(INNER_TINT)
    }
    drawStop()
    narration.play(STOPS[i].id)
  })
}

// ---- quiz: 8 questions, answers in a new order each time, then a short "why" ----
function shuffled(n) {
  const a = Array.from({ length: n }, (_, k) => k)
  for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]] }
  return a
}
let quizToken = 0
function showQuiz(i) {
  state.screen = 'quiz'
  state.quiz = i
  state.answered = null
  const item = QUIZ[i]
  const order = shuffled(item.options.length)
  state.order = order
  const draw = () =>
    panel.show({
      title: `Question ${i + 1} of ${QUIZ.length}`,
      body: item.q,
      stack: true,
      accent: '#a78bfa',
      buttons: order.map((k, pos) => ({
        id: 'ans' + pos,
        label: item.options[k],
        state: state.answered !== null ? (k === item.answer ? 'right' : pos === state.answered ? 'wrong' : undefined) : undefined,
      })),
    })
  state.redraw = draw
  if (i === 0) {
    state.score = 0
    state.answers = {}
    state.screen = 'travel'
    clearMoments()
    resetEarth()
    travelTo(HOME, 'sun', 'Quiz time', () => {
      state.screen = 'quiz'
      draw()
      narration.play('quiz')
    })
  } else {
    draw()
    narration.play('q' + (i + 1))
  }
}
function showWhy(i) {
  state.screen = 'why'
  const item = QUIZ[i]
  const right = state.answers[item.key]
  panel.show({
    title: right ? 'Correct!' : 'Not quite',
    body: [item.q, `Answer: ${item.options[item.answer]}.`, item.why],
    buttons: [{ id: 'nextq', label: i === QUIZ.length - 1 ? 'See my score' : 'Next question', primary: true }],
    accent: right ? '#34d399' : '#f87171',
  })
  narration.play('why' + (i + 1))
}

const fmtDuration = (s) => `${Math.floor(s / 60)} min ${pad2(Math.round(s % 60))} s`
function showResult(again = false) {
  state.screen = 'result'
  const pct = state.score / QUIZ.length
  const key = pct === 1 ? 'result-perfect' : pct >= 0.6 ? 'result-good' : 'result-try'
  const msg = pct === 1 ? 'Perfect! You are a real space expert!' : pct >= 0.6 ? 'Great job, explorer!' : 'Good try! Fly the tour again to learn even more.'
  if (!again && state.session) {
    const seconds = (performance.now() - state.session.startedAt) / 1000
    state.lastSaved = saveSession({
      learner: state.learner, score: state.score, total: QUIZ.length, answers: { ...state.answers },
      secrets: state.discovered.size, secretsTotal: STOPS.length, seconds, start: state.session.start,
    })
    state.lastSeconds = seconds
    state.session = null
  }
  panel.show({
    title: `You got ${state.score} out of ${QUIZ.length}!`,
    body: [msg, `You discovered ${state.discovered.size} of ${STOPS.length} secrets on the way.`],
    footer: state.lastSaved ? `${state.learner ? `Learner ${state.learner}: ` : ''}saved for your teacher (time ${fmtDuration(state.lastSeconds)}).` : undefined,
    buttons: [{ id: 'nextlearner', label: 'Next learner', primary: true }, { id: 'again', label: 'Fly again' }],
    accent: '#34d399',
  })
  if (!again) {
    audio.sfx.fanfare()
    burst(new THREE.Vector3(HOME.position.x + 1.6, 1.4, -0.9), 0.5, 0.04)
    narration.play(key)
  }
}

app.onHold((id) => {
  if (id === 'logo' && ['intro', 'learner', 'result'].includes(state.screen)) { audio.sfx.sparkle(); showTeacher() }
})

function handlePress(id, _panel, point) {
  if (id.startsWith('planet:')) return discover(id.slice(7), point)
  if (id === 'logo') return // only a long press opens teacher mode
  audio.sfx.click()
  if (id === 'skip') return app.skipFlight()
  if (app.isMoving() || layoutAnim) return // ignore double presses while travelling
  if (id.startsWith('view:')) {
    const what = id.slice(5)
    if (what === 'tour') { clearMoments(); return showStop(0) }
    if (what === 'scale') return showScale()
    if (what === 'bloom') view.bloom = !view.bloom
    if (what === 'labels') view.labels = !view.labels
    if (what === 'speed') view.speed = SPEEDS[(SPEEDS.indexOf(view.speed) + 1) % SPEEDS.length]
    applyView()
    return drawPicker()
  }
  if (id.startsWith('go:')) {
    const i = stopIndex(id.slice(3))
    if (i >= 0 && !(state.screen === 'stop' && state.stop === i)) return showStop(i)
    return
  }
  if (id === 'travel') {
    state.travel = state.travel === 'fly' ? 'jump' : 'fly'
    return showIntro()
  }
  if (id === 'sound') {
    audio.setEnabled(!audio.enabled)
    narration.setEnabled(audio.enabled)
    return showIntro()
  }
  if (state.screen === 'intro' && id === 'start') return beginSession()
  if (state.screen === 'learner' && id.startsWith('learner:')) {
    const n = Number(id.slice(8))
    state.learner = n || null
    return startTour()
  }
  if (state.screen === 'teacher') {
    if (id.startsWith('tstart:')) teacher.start = id.slice(7)
    if (id === 'tmode') teacher.on = !teacher.on
    if (id === 'tnumbers') teacher.askNumber = !teacher.askNumber
    saveTeacher(teacher)
    if (id === 'tclose') return teacher.on ? (teacher.askNumber ? showLearner() : showIntro()) : showIntro()
    if (id === 'tgo') { teacher.on = true; saveTeacher(teacher); return beginSession() }
    return showTeacher()
  }
  if (state.screen === 'ringdive' && id === 'leavedive') return leaveRingDive()
  if (state.screen === 'neptune' && id === 'leaveneptune') return leaveNeptuneView()
  if (state.screen === 'daynight') {
    if (id === 'dn:back') return leaveDayNight()
    if (id === 'dn:year') { dayNight.startYear(); return drawDayNight() }
    if (id === 'dn:again') { dayNight.begin(); narration.play('daynight-day'); return drawDayNight() }
    return
  }
  if (state.screen === 'scale') {
    if (id === 'scaleback') return hideScale()
    return
  }
  if (state.screen === 'cape') {
    if (id === 'capeskip' && cape) { cape.skip(); return }
    if (id === 'leavecape' && cape && cape.mode === 'hover') return leaveCape()
    return
  }
  if (state.screen === 'stop') {
    if (id === 'ringdive') return enterRingDive()
    if (id === 'cape') return enterCape()
    if (id === 'daynight') return enterDayNight()
    if (id === 'm:sunsize') return showSunSize()
    if (id === 'm:spot') return showSpot()
    if (id === 'm:neptune') return enterNeptuneView()
    if (id === 'next') return state.stop === STOPS.length - 1 ? showQuiz(0) : showStop(state.stop + 1)
    if (id === 'back') return showStop(state.stop - 1)
  }
  if (state.screen === 'quiz' && id.startsWith('ans') && state.answered === null) {
    const pos = Number(id.slice(3))
    const item = QUIZ[state.quiz]
    const right = state.order[pos] === item.answer
    state.answered = pos
    state.answers[item.key] = right
    if (right) { state.score++; audio.sfx.correct() } else audio.sfx.wrong()
    state.redraw()
    const token = ++quizToken
    const i = state.quiz
    setTimeout(() => { if (token === quizToken && state.screen === 'quiz') showWhy(i) }, 1100)
    return
  }
  if (state.screen === 'why' && id === 'nextq') return state.quiz === QUIZ.length - 1 ? showResult() : showQuiz(state.quiz + 1)
  if (state.screen === 'result' && id === 'again') return startTour()
  if (state.screen === 'result' && id === 'nextlearner') {
    state.learner = null
    if (teacher.on) return beginSession()
    return teacher.askNumber ? showLearner() : showIntro()
  }
}
app.onPress(handlePress)

// start beside the Sun
app.placeNow(HOME)
applyView()
if (teacher.on) {
  // teacher mode skips the intro: straight to the learner numbers (or the first stop)
  teacher.askNumber ? showLearner() : showIntro()
} else showIntro()

// For teachers and testing: ?stop=4 jumps to a stop, ?quiz=1 to the quiz, ?teacher=1 opens teacher mode,
// ?daynight=1, ?neptune=1 and ?scale=1 open those moments.
const q = new URLSearchParams(location.search)
if (q.has('stop')) showStop(Math.max(0, Math.min(STOPS.length - 1, Number(q.get('stop')) || 0)))
if (q.has('quiz')) showQuiz(0)
if (q.has('teacher')) showTeacher()
if (q.has('daynight')) { state.stop = stopIndex('earth'); enterDayNight() }
if (q.has('neptune')) { state.stop = stopIndex('neptune'); enterNeptuneView() }
if (q.has('scale')) showScale()
window.__vrg = {
  picker, view, applyView, showStop, showQuiz, showResult, showWhy, discover, state, world, capePin, app, panel, enterRingDive, leaveRingDive, enterCape, leaveCape, getCape,
  press: (id) => handlePress(id, null, null), quiz: QUIZ,
  enterDayNight, leaveDayNight, getDayNight: () => dayNight, enterNeptuneView, leaveNeptuneView, showScale, hideScale, showSunSize, showSpot, showTeacher, showLearner, hologram, sunRuler, spot, teacher,
}
