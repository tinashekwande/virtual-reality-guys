import * as THREE from 'three'
import { createXrApp } from '../shared/xr-app.js'
import { Panel } from '../shared/panel.js'
import { createAudio } from '../shared/audio.js'
import { createNarration } from '../shared/narration.js'
import { buildScene, placeFor, posOf, SPEC, EYE, OVERVIEW } from './scene.js'
import { STOPS, QUIZ } from './content.js'
import { buildRingDive } from './ring-dive.js'
import { buildCape } from './cape.js'

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
const getCape = () => (cape ||= buildCape({ earthMap: world.bodies.earth.material.map, skyTex: world.skyTexture, renderer: app.renderer }))
let altShown = 0
app.onFrame((dt, t) => {
  if (!cape || app.activeScene !== cape.scene) return
  cape.update(rig, app.camera, dt, t)
  if (cape.mode === 'down' && t - altShown > 0.4) { altShown = t; drawDescent() }
})

// ---- sound + narration ----
const audio = createAudio()
const narration = createNarration(new URL('../audio/solar-system/', location.href).href)
app.onGesture(() => audio.unlock())

const HOME = { position: new THREE.Vector3(-34, 0, 0), yaw: -Math.PI / 2 }

// ---- the floating panel ----
const panel = new Panel({ width: 1.35 })
panel.mesh.position.set(0.95, 1.25, -1.6)
panel.mesh.rotation.y = -0.38
app.addPanel(panel)

// ---- tapping planets ----
const state = { travel: 'fly', screen: 'intro', stop: 0, quiz: 0, score: 0, answered: null, discovered: new Set() }
const currentId = () => (state.screen === 'stop' ? STOPS[state.stop].id : null)
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
  const u = (CAPE_TOWN.lon + 180) / 360, phi = u * Math.PI * 2, theta = ((90 - CAPE_TOWN.lat) / 180) * Math.PI
  const dir = new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta))
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
let earthTurn = null
function turnEarthToCapeTown() {
  const earth = world.bodies.earth
  const center = posOf('earth')
  const toViewer = new THREE.Vector3(-1, 0, 0)
  // find the spin angle that puts Cape Town facing us
  const saved = earth.rotation.y
  let best = 0, bestDot = -2
  for (let a = 0; a < 360; a += 2) {
    earth.rotation.y = (a * Math.PI) / 180
    earth.updateMatrixWorld(true)
    const w = capePin.userData.dir.clone().applyMatrix4(earth.matrixWorld).sub(center).normalize()
    const d = w.dot(toViewer)
    if (d > bestDot) { bestDot = d; best = earth.rotation.y }
  }
  earth.rotation.y = saved
  let delta = ((best - (saved % (Math.PI * 2))) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI
  earthTurn = { from: saved, to: saved + delta, t: 0 }
  const sp = world.spinnerOf('earth')
  if (sp) { sp.saved = sp.saved ?? sp.speed; sp.speed = 0; sp.boost = 0 }
}
app.onFrame((dt) => {
  if (!earthTurn) return
  earthTurn.t = Math.min(1, earthTurn.t + dt / 1.8)
  const k = earthTurn.t < 0.5 ? 2 * earthTurn.t ** 2 : 1 - (-2 * earthTurn.t + 2) ** 2 / 2
  world.bodies.earth.rotation.y = earthTurn.from + (earthTurn.to - earthTurn.from) * k
  if (earthTurn.t >= 1) { earthTurn = null; capePin.visible = true }
})
function resetEarth() {
  capePin.visible = false
  earthTurn = null
  const sp = world.spinnerOf('earth')
  if (sp && sp.saved !== undefined) { sp.speed = sp.saved; delete sp.saved }
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
  if (!dive) dive = buildRingDive({ saturnMap: world.bodies.saturn.material.map, ringTex: world.satRingTex, skyTex: world.skyTexture })
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

function showIntro() {
  state.screen = 'intro'
  panel.show({
    title: 'Journey through the Solar System',
    body: [
      'Welcome, space explorer! We will visit the Sun and all 8 planets.',
      'Point at a button and squeeze the trigger (or pinch your fingers) to choose it.',
    ],
    footer: 'Sizes and distances are made to fit, not to scale. Feeling dizzy when flying? Choose "Travel: jump".',
    buttons: [
      { id: 'start', label: 'Start', primary: true },
      soundButton(),
      { id: 'travel', label: state.travel === 'fly' ? 'Travel: fly' : 'Travel: jump' },
    ],
    accent: '#22d3ee',
  })
  narration.play('intro')
}

function drawStop() {
  const i = state.stop
  const s = STOPS[i]
  const found = state.discovered.has(s.id)
  panel.show({
    title: `${i + 1}/${STOPS.length}  ${s.name}`,
    body: s.text,
    footer: found ? `Secret: ${s.secret}` : `Point at ${s.id === 'sun' ? 'the Sun' : s.name} and squeeze to discover a secret!`,
    footerColor: found ? s.accent : '#8fa6c9',
    buttons: [
      ...(i > 0 ? [{ id: 'back', label: 'Back' }] : []),
      ...(s.id === 'saturn' ? [{ id: 'ringdive', label: 'Dive into rings' }] : []),
      ...(s.id === 'earth' ? [{ id: 'cape', label: 'Fly to Cape Town' }] : []),
      { id: 'next', label: i === STOPS.length - 1 ? 'Take the quiz' : 'Next planet', primary: true },
    ],
    accent: s.accent,
  })
}

function showStop(i) {
  state.screen = 'travel'
  resetEarth()
  if (state.travel !== 'fly') world.arrangeMoons(STOPS[i].id, 0.8)
  travelTo(placeFor(STOPS[i].id), STOPS[i].id, STOPS[i].name, () => {
    if (STOPS[i].id === 'earth') getCape().load() // start loading the Cape map in the background
    state.screen = 'stop'
    state.stop = i
    drawStop()
    narration.play(STOPS[i].id)
  })
}

function showQuiz(i) {
  state.screen = 'quiz'
  state.quiz = i
  state.answered = null
  const item = QUIZ[i]
  const draw = () =>
    panel.show({
      title: `Question ${i + 1} of ${QUIZ.length}`,
      body: item.q,
      stack: true,
      accent: '#a78bfa',
      buttons: item.options.map((o, k) => ({
        id: 'ans' + k,
        label: o,
        state: state.answered !== null ? (k === item.answer ? 'right' : k === state.answered ? 'wrong' : undefined) : undefined,
      })),
    })
  state.redraw = draw
  if (i === 0) {
    state.score = 0
    state.screen = 'travel'
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

function showResult() {
  state.screen = 'result'
  const pct = state.score / QUIZ.length
  const key = pct === 1 ? 'result-perfect' : pct >= 0.6 ? 'result-good' : 'result-try'
  const msg = pct === 1 ? 'Perfect! You are a real space expert!' : pct >= 0.6 ? 'Great job, explorer!' : 'Good try! Fly the tour again to learn even more.'
  panel.show({
    title: `You got ${state.score} out of ${QUIZ.length}!`,
    body: [msg, `You discovered ${state.discovered.size} of ${STOPS.length} secrets on the way.`],
    buttons: [{ id: 'again', label: 'Fly again', primary: true }],
    accent: '#34d399',
  })
  audio.sfx.fanfare()
  burst(new THREE.Vector3(HOME.position.x + 1.6, 1.4, -0.9), 0.5, 0.04)
  narration.play(key)
}

app.onPress((id, _panel, point) => {
  if (id.startsWith('planet:')) return discover(id.slice(7), point)
  audio.sfx.click()
  if (id === 'skip') return app.skipFlight()
  if (app.isMoving()) return // ignore double presses while travelling
  if (id === 'travel') {
    state.travel = state.travel === 'fly' ? 'jump' : 'fly'
    return showIntro()
  }
  if (id === 'sound') {
    audio.setEnabled(!audio.enabled)
    narration.setEnabled(audio.enabled)
    return showIntro()
  }
  if (state.screen === 'intro' && id === 'start') return showStop(0)
  if (state.screen === 'ringdive' && id === 'leavedive') return leaveRingDive()
  if (state.screen === 'cape') {
    if (id === 'capeskip' && cape) { cape.skip(); return }
    if (id === 'leavecape' && cape && cape.mode === 'hover') return leaveCape()
    return
  }
  if (state.screen === 'stop') {
    if (id === 'ringdive') return enterRingDive()
    if (id === 'cape') return enterCape()
    if (id === 'next') return state.stop === STOPS.length - 1 ? showQuiz(0) : showStop(state.stop + 1)
    if (id === 'back') return showStop(state.stop - 1)
  }
  if (state.screen === 'quiz' && id.startsWith('ans') && state.answered === null) {
    const k = Number(id.slice(3))
    state.answered = k
    if (k === QUIZ[state.quiz].answer) { state.score++; audio.sfx.correct() } else audio.sfx.wrong()
    state.redraw()
    setTimeout(() => (state.quiz === QUIZ.length - 1 ? showResult() : showQuiz(state.quiz + 1)), 1500)
    return
  }
  if (state.screen === 'result' && id === 'again') {
    state.discovered.clear()
    return showStop(0)
  }
})

// start beside the Sun
app.placeNow(HOME)
showIntro()

// For teachers and testing: ?stop=4 jumps to a planet, ?quiz=1 jumps to the quiz
const q = new URLSearchParams(location.search)
if (q.has('stop')) showStop(Math.max(0, Math.min(STOPS.length - 1, Number(q.get('stop')) || 0)))
if (q.has('quiz')) showQuiz(0)
window.__vrg = { showStop, showQuiz, showResult, discover, state, world, capePin, app, panel, enterRingDive, leaveRingDive, enterCape, leaveCape, getCape }
