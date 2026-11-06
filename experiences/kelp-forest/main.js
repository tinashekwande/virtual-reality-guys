import * as THREE from 'three'
import { createXrApp } from '../shared/xr-app.js'
import { Panel } from '../shared/panel.js'
import { createAudio } from '../shared/audio.js'
import { createNarration } from '../shared/narration.js'
import { buildOcean, floorY } from './ocean.js'
import { buildKelp } from './kelp.js'
import { buildLife } from './life.js'
import { STOPS, QUIZ } from './content.js'
import { buildCapeOpening, leaveCapeOpening } from './cape-opening.js'

const app = createXrApp()
const { scene, rig } = app
document.getElementById('enter').appendChild(app.vrButton)

// ---- where you stop at each place ----
function placeFor(s) {
  const y = s.floor ? floorY(s.x + 4, 0) + 0.35 : -s.depth
  return { position: new THREE.Vector3(s.x, y, 0), yaw: -Math.PI / 2 }
}
const at = Object.fromEntries(STOPS.map((s) => [s.id, { x: s.x, y: placeFor(s).position.y, z: 0 }]))

// ---- the world ----
const clear = STOPS.flatMap((s) => [{ x: s.x, z: 0, r: 3.5 }, { x: s.x + 5, z: 0, r: s.floor ? 3.5 : 2.5 }])
const ocean = buildOcean(app, clear)
const kelp = buildKelp(scene, ocean.uTime, clear)
const life = buildLife(scene, at, ocean.uTime)
app.onFrame((dt, t) => {
  if (app.activeScene !== scene) return
  ocean.update(dt, t); life.update(dt, t); kelp.update(app.camera)
})

// ---- the opening: a helicopter over Cape Town ----
const opening = buildCapeOpening(app)
app.onFrame((dt, t) => { if (app.activeScene === opening.scene) opening.update(dt, t) })
function goUnderwater() {
  app.setScene(scene)
  leaveCapeOpening(app)
}

// ---- sound ----
const audio = createAudio({ theme: 'ocean' })
const narration = createNarration(new URL('../audio/kelp-forest/', location.href).href)
app.onGesture(() => audio.unlock())

// ---- panel ----
const panel = new Panel({ width: 1.35 })
panel.mesh.position.set(0.95, 1.25, -1.6)
panel.mesh.rotation.y = -0.38
app.addPanel(panel)

const state = { travel: 'glide', screen: 'intro', stop: 0, quiz: 0, score: 0, answered: null, discovered: new Set() }
const START = { position: new THREE.Vector3(-8, -1.9, 0), yaw: -Math.PI / 2 }

// tap an animal to discover its secret
const current = () => (state.screen === 'stop' ? STOPS[state.stop] : null)
for (const s of STOPS) {
  for (const mesh of life.targets[s.target] || []) app.addTarget(mesh, 'animal:' + s.id, () => current()?.id === s.id)
}

// sparkle burst
const burst = (() => {
  const n = 70
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  const mat = new THREE.PointsMaterial({ color: 0xd9fff6, size: 0.06, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
  const pts = new THREE.Points(geo, mat)
  pts.visible = false
  pts.frustumCulled = false
  scene.add(pts)
  const vel = Array.from({ length: n }, () => new THREE.Vector3())
  let life2 = 0
  app.onFrame((dt) => {
    if (!pts.visible) return
    life2 += dt
    const p = geo.attributes.position
    for (let i = 0; i < n; i++) {
      p.setXYZ(i, p.getX(i) + vel[i].x * dt, p.getY(i) + (vel[i].y + 0.6) * dt, p.getZ(i) + vel[i].z * dt)
      vel[i].multiplyScalar(Math.pow(0.3, dt))
    }
    p.needsUpdate = true
    mat.opacity = Math.max(0, 1 - life2 / 1.8)
    if (life2 > 1.8) pts.visible = false
  })
  return (at2) => {
    const p = geo.attributes.position
    for (let i = 0; i < n; i++) { p.setXYZ(i, at2.x, at2.y, at2.z); vel[i].randomDirection().multiplyScalar(0.5 + Math.random() * 1.5) }
    life2 = 0
    pts.visible = true
  }
})()

function discover(id, point) {
  if (state.discovered.has(id)) return
  state.discovered.add(id)
  audio.sfx.sparkle()
  if (point) burst(point)
  if (id === 'seals') { audio.sfx.seal(); audio.sfx.bubbles(); life.seals.forEach((s, i) => setTimeout(() => (s.spin = 1.2), i * 300)) }
  if (id === 'octopus') life.octopus.flash()
  if (id === 'shysharks') life.shysharks.scare()
  if (id === 'sevengill') life.sevengill.slow()
  drawStop()
  narration.play('secret-' + id)
}

// ---- travel: a slow glide (or a quick fade for anyone who prefers it) ----
function travelTo(place, then) {
  narration.stop()
  const far = place.position.distanceTo(rig.position) > 4
  if (state.travel === 'glide' && far) {
    const via = rig.position.clone().lerp(place.position, 0.5).add(new THREE.Vector3(0, 1.4, 0))
    audio.sfx.cruise(5.2)
    app.fly(place, via, { out: 2.4, hold: 0.1, in: 2.7, lift: 1.2, then })
  } else {
    audio.sfx.whoosh()
    app.teleport(place, then)
  }
}

function soundButton() { return { id: 'sound', label: audio.enabled ? 'Sound: on' : 'Sound: off' } }
function showIntro() {
  state.screen = 'intro'
  panel.show({
    title: 'Dive into the Great African Seaforest',
    body: ['You are in a helicopter above Cape Town! Can you find Table Mountain, Lion\'s Head and the stadium?', 'Then choose "Dive in!" to fly down the coast and splash into a kelp forest.'],
    footer: 'Feeling dizzy while gliding? Choose "Travel: jump".',
    buttons: [{ id: 'start', label: 'Dive in!', primary: true }, soundButton(), { id: 'travel', label: state.travel === 'glide' ? 'Travel: glide' : 'Travel: jump' }],
    accent: '#2dd4bf',
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
    footer: found ? `Secret: ${s.secret}` : `Point at ${s.targetName} and squeeze to discover a secret!`,
    footerColor: found ? s.accent : '#8fa6c9',
    buttons: [...(i > 0 ? [{ id: 'back', label: 'Back' }] : []), { id: 'next', label: i === STOPS.length - 1 ? 'Take the quiz' : 'Swim on', primary: true }],
    accent: s.accent,
  })
}
function showStop(i) {
  state.screen = 'travel'
  travelTo(placeFor(STOPS[i]), () => {
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
  const draw = () => panel.show({
    title: `Question ${i + 1} of ${QUIZ.length}`,
    body: item.q,
    stack: true,
    accent: '#a78bfa',
    buttons: item.options.map((o, k) => ({ id: 'ans' + k, label: o, state: state.answered !== null ? (k === item.answer ? 'right' : k === state.answered ? 'wrong' : undefined) : undefined })),
  })
  state.redraw = draw
  if (i === 0) state.score = 0
  draw()
  narration.play(i === 0 ? 'quiz' : 'q' + (i + 1))
}
function showResult() {
  state.screen = 'result'
  const pct = state.score / QUIZ.length
  const key = pct === 1 ? 'result-perfect' : pct >= 0.6 ? 'result-good' : 'result-try'
  const msg = pct === 1 ? 'Perfect! You are a real ocean expert!' : pct >= 0.6 ? 'Great job, ocean explorer!' : 'Good try! Dive again to learn even more.'
  panel.show({
    title: `You got ${state.score} out of ${QUIZ.length}!`,
    body: [msg, `You discovered ${state.discovered.size} of ${STOPS.length} secrets on the way.`],
    buttons: [{ id: 'again', label: 'Dive again', primary: true }],
    accent: '#34d399',
  })
  audio.sfx.fanfare()
  narration.play(key)
}

app.onPress((id, _p, point) => {
  if (id.startsWith('animal:')) return discover(id.slice(7), point)
  audio.sfx.click()
  if (id === 'skip') return app.skipFlight()
  if (app.isMoving()) return
  if (id === 'sound') { audio.setEnabled(!audio.enabled); narration.setEnabled(audio.enabled); return showIntro() }
  if (id === 'travel') { state.travel = state.travel === 'glide' ? 'jump' : 'glide'; return showIntro() }
  if (state.screen === 'intro' && id === 'start') return dive()
  if (state.screen === 'stop') {
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
  if (state.screen === 'result' && id === 'again') { state.discovered.clear(); return showStop(0) }
})

// fly down the coast and splash into the sea (or, for "jump", fade straight in)
function dive() {
  state.screen = 'dive'
  narration.stop()
  panel.hide()
  const land = () => {
    goUnderwater()
    app.placeNow(START)
    audio.sfx.bubbles()
    opening.clearSplash()
    showStop(0)
  }
  if (state.travel === 'glide') {
    audio.sfx.cruise(32)
    opening.fly(() => { audio.sfx.whoosh(); land() })
  } else app.teleport(START, () => { goUnderwater(); app.placeNow(START); showStop(0) })
}

const q = new URLSearchParams(location.search)
opening.ready.then(() => document.getElementById('loading')?.classList.add('done'))
if (q.has('stop')) {
  goUnderwater()
  app.placeNow(START)
  showStop(Math.max(0, Math.min(STOPS.length - 1, Number(q.get('stop')) || 0)))
} else {
  opening.enter()
  showIntro()
}
window.__vrg = { showStop, showQuiz, showResult, discover, state, app, panel, life, placeFor, opening, dive }
