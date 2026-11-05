import * as THREE from 'three'
import { createXrApp } from '../shared/xr-app.js'
import { Panel } from '../shared/panel.js'
import { surface, glowTexture, ringTexture } from './textures.js'
import { STOPS, QUIZ } from './content.js'

const app = createXrApp()
const { scene, rig } = app
document.getElementById('enter').appendChild(app.vrButton)

// ---- lighting: the Sun lights everything ----
scene.add(new THREE.AmbientLight(0x6a7aa8, 0.55))
const sunLight = new THREE.PointLight(0xffffff, 4.5, 0, 0)
scene.add(sunLight)

// ---- stars ----
{
  const n = 2500
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(700)
    pos.set([v.x, v.y, v.z], i * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false })))
}

// ---- bodies (sizes and gaps are chosen to look good, not to scale) ----
const EYE = 1.6
const SPEC = {
  sun: { r: 12, x: 0, tex: 'sun' },
  mercury: { r: 1.2, x: 34, tex: 'mercury', spin: 0.1 },
  venus: { r: 2.2, x: 52, tex: 'venus', spin: -0.05 },
  earth: { r: 2.4, x: 72, tex: 'earth', spin: 0.25 },
  mars: { r: 1.6, x: 92, tex: 'mars', spin: 0.22 },
  jupiter: { r: 7, x: 125, tex: 'jupiter', spin: 0.4 },
  saturn: { r: 5.6, x: 165, tex: 'saturn', spin: 0.35 },
  uranus: { r: 3.4, x: 200, tex: 'uranus', spin: 0.2 },
  neptune: { r: 3.3, x: 230, tex: 'neptune', spin: 0.22 },
}
const bodies = {}
const spinners = []
for (const [id, s] of Object.entries(SPEC)) {
  const geo = new THREE.SphereGeometry(s.r, 64, 40)
  const mat =
    id === 'sun'
      ? new THREE.MeshBasicMaterial({ map: surface(s.tex) })
      : new THREE.MeshStandardMaterial({ map: surface(s.tex), roughness: 1, metalness: 0 })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(s.x, EYE, 0)
  scene.add(mesh)
  bodies[id] = mesh
  if (s.spin) spinners.push([mesh, s.spin])
}
// Sun glow
{
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
  glow.scale.set(60, 60, 1)
  glow.position.set(0, EYE, 0)
  scene.add(glow)
  sunLight.position.set(0, EYE, 0)
}
// Earth clouds + Moon
{
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(SPEC.earth.r * 1.015, 48, 32),
    new THREE.MeshStandardMaterial({ map: surface('clouds'), transparent: true, depthWrite: false, roughness: 1 }),
  )
  clouds.position.copy(bodies.earth.position)
  scene.add(clouds)
  spinners.push([clouds, 0.32])
  const moonPivot = new THREE.Group()
  moonPivot.position.copy(bodies.earth.position)
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 20), new THREE.MeshStandardMaterial({ map: surface('moon'), roughness: 1 }))
  moon.position.set(0, 0.6, -6.2)
  moonPivot.add(moon)
  scene.add(moonPivot)
  spinners.push([moonPivot, 0.08])
}
// Saturn rings (UVs remapped so the strip texture runs from inner to outer edge)
{
  const inner = SPEC.saturn.r * 1.3
  const outer = SPEC.saturn.r * 2.3
  const geo = new THREE.RingGeometry(inner, outer, 128, 1)
  const p = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < p.count; i++) {
    const rad = Math.hypot(p.getX(i), p.getY(i))
    uv.setXY(i, (rad - inner) / (outer - inner), 0.5)
  }
  const ring = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ map: ringTexture(), transparent: true, side: THREE.DoubleSide, roughness: 1, depthWrite: false }),
  )
  ring.rotation.x = -Math.PI / 2
  // tilt the ring plane toward the viewer (we look along +x, so tilt about z)
  const pivot = new THREE.Group()
  pivot.position.copy(bodies.saturn.position)
  pivot.rotation.z = 0.5
  pivot.add(ring)
  scene.add(pivot)
}
bodies.uranus.rotation.x = 1.6 // tipped on its side

app.onFrame((dt) => {
  for (const [m, s] of spinners) m.rotation.y += s * dt * 0.5
})

// ---- where the player stands for each stop (on the Sun side, looking at the planet) ----
function placeFor(id) {
  const s = SPEC[id]
  const dist = s.r * (id === 'sun' ? 2.4 : 3.2) + 4
  return { position: new THREE.Vector3(s.x - dist, 0, 0), yaw: -Math.PI / 2 }
}
const HOME = { position: new THREE.Vector3(-26, 0, 0), yaw: -Math.PI / 2 }

// ---- the floating panel (always in the same spot relative to the player) ----
const panel = new Panel({ width: 1.35 })
panel.mesh.position.set(0.95, 1.25, -1.6)
panel.mesh.rotation.y = -0.38
app.addPanel(panel)

// ---- narration (uses the browser voice if there is one; the text is always on screen) ----
let voiceOn = true
function speak(text) {
  try {
    if (!voiceOn || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.95
    u.lang = 'en-ZA'
    window.speechSynthesis.speak(u)
  } catch {}
}

// ---- flow ----
const state = { screen: 'intro', stop: 0, quiz: 0, score: 0, answered: null }

function showIntro() {
  state.screen = 'intro'
  panel.show({
    title: 'Journey through the Solar System',
    body: [
      'Welcome, space explorer! We will visit the Sun and all 8 planets.',
      'Point at a button and squeeze the trigger (or pinch) to choose it.',
    ],
    footer: 'Sizes and distances here are for looking at, not to scale. Space is much, much bigger!',
    buttons: [{ id: 'start', label: 'Start the journey', primary: true }, { id: 'voice', label: voiceOn ? 'Voice: on' : 'Voice: off' }],
    accent: '#22d3ee',
  })
  speak('Welcome, space explorer! We will visit the Sun and all eight planets. Point at a button and squeeze the trigger to choose it.')
}

function showStop(i) {
  state.screen = 'stop'
  state.stop = i
  const s = STOPS[i]
  app.teleport(placeFor(s.id), () => {
    panel.show({
      title: `${i + 1}/${STOPS.length}  ${s.name}`,
      body: s.text,
      footer: s.fact,
      buttons: [
        ...(i > 0 ? [{ id: 'back', label: 'Back' }] : []),
        { id: 'next', label: i === STOPS.length - 1 ? 'Take the quiz' : 'Next planet', primary: true },
      ],
      accent: s.accent,
    })
    speak(s.text.join(' ') + ' ' + s.fact.replace('Fun fact:', 'Fun fact.'))
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
    app.teleport(HOME, () => {
      draw()
      speak(item.q)
    })
  } else {
    draw()
    speak(item.q)
  }
}

function showResult() {
  state.screen = 'result'
  const pct = state.score / QUIZ.length
  const msg = pct === 1 ? 'Perfect! You are a real space expert!' : pct >= 0.6 ? 'Great job, explorer!' : 'Good try! Fly the tour again to learn more.'
  panel.show({
    title: `You got ${state.score} out of ${QUIZ.length}!`,
    body: msg,
    buttons: [{ id: 'again', label: 'Fly again', primary: true }, { id: 'tour', label: 'Back to the planets' }],
    accent: '#34d399',
  })
  speak(`You got ${state.score} out of ${QUIZ.length}. ${msg}`)
}

app.onPress((id) => {
  if (id === 'voice') {
    voiceOn = !voiceOn
    if (!voiceOn) try { window.speechSynthesis.cancel() } catch {}
    return showIntro()
  }
  if (state.screen === 'intro' && id === 'start') return showStop(0)
  if (state.screen === 'stop') {
    if (id === 'next') return state.stop === STOPS.length - 1 ? showQuiz(0) : showStop(state.stop + 1)
    if (id === 'back') return showStop(state.stop - 1)
  }
  if (state.screen === 'quiz' && id.startsWith('ans') && state.answered === null) {
    const k = Number(id.slice(3))
    state.answered = k
    if (k === QUIZ[state.quiz].answer) state.score++
    state.redraw()
    setTimeout(() => (state.quiz === QUIZ.length - 1 ? showResult() : showQuiz(state.quiz + 1)), 1400)
    return
  }
  if (state.screen === 'result') {
    if (id === 'again') return showStop(0)
    if (id === 'tour') return showStop(0)
  }
})

// Start at the Sun with the intro
app.placeNow(HOME)
showIntro()

// Handy for teachers and testing: ?stop=4 jumps to a planet, ?quiz=1 jumps to the quiz
const q = new URLSearchParams(location.search)
if (q.has('stop')) showStop(Math.max(0, Math.min(STOPS.length - 1, Number(q.get('stop')) || 0)))
if (q.has('quiz')) showQuiz(0)
window.__vrg = { showStop, showQuiz, showResult, state }
