import * as THREE from 'three'
import { VRButton } from 'three/addons/webxr/VRButton.js'

/**
 * Shared app shell for every VR Guys school experience:
 *  - renderer + WebXR session (Quest browser) with a flat-screen preview fallback (mouse / touch look)
 *  - a "rig" the player stands in; moving between places is a fade-to-black blink (never smooth motion)
 *  - pointer interaction with floating panels from controllers, hands (pinch) or mouse
 */
export function createXrApp({ canvasParent = document.body } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  renderer.xr.setReferenceSpaceType('local-floor')
  renderer.xr.setFoveation(1)
  canvasParent.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 2000)
  const rig = new THREE.Group()
  rig.add(camera)
  scene.add(rig)
  let activeScene = scene
  camera.position.set(0, 1.6, 0) // flat-screen eye height; replaced by the headset pose in VR

  // --- comfort fade (a black shell around the head) ---
  const fadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false })
  const fade = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), fadeMat)
  fade.renderOrder = 1000
  fade.frustumCulled = false
  camera.add(fade)

  // --- comfort vignette: darkens the edges of your view while you are moving ---
  const vignetteMat = new THREE.ShaderMaterial({
    uniforms: { uStrength: { value: 0 } },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uStrength; varying vec3 vP;
      void main(){
        float a = acos(clamp(dot(normalize(vP), vec3(0.0, 0.0, -1.0)), -1.0, 1.0)); // angle from straight ahead
        float inner = mix(1.6, 0.42, uStrength);
        float k = smoothstep(inner, inner + 0.35, a);
        gl_FragColor = vec4(0.0, 0.02, 0.06, k * min(1.0, uStrength * 1.6));
      }`,
    side: THREE.BackSide, transparent: true, depthTest: false, depthWrite: false,
  })
  const vignette = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16), vignetteMat)
  vignette.renderOrder = 999
  vignette.frustumCulled = false
  camera.add(vignette)

  // --- flat-screen look controls (drag / touch) ---
  let yaw = 0
  let pitch = 0
  let dragging = false
  let moved = 0
  let last = { x: 0, y: 0 }
  const dom = renderer.domElement
  dom.style.touchAction = 'none'
  dom.addEventListener('pointerdown', (e) => {
    dragging = true
    moved = 0
    last = { x: e.clientX, y: e.clientY }
  })
  window.addEventListener('pointerup', () => (dragging = false))
  window.addEventListener('pointermove', (e) => {
    if (!dragging || renderer.xr.isPresenting) return
    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    moved += Math.abs(dx) + Math.abs(dy)
    last = { x: e.clientX, y: e.clientY }
    yaw -= dx * 0.004
    pitch = Math.max(-1.2, Math.min(1.2, pitch - dy * 0.004))
    camera.rotation.set(pitch, yaw, 0, 'YXZ')
  })

  const gestureListeners = [] // first user action unlocks audio in the browser
  // --- pointer interaction with panels ---
  const raycaster = new THREE.Raycaster()
  const panels = []
  const targets = [] // 3D objects you can point at and select (e.g. planets)
  const listeners = []
  const hoverListeners = []
  let hoveredTarget = null
  const tmpMat = new THREE.Matrix4()
  const controllers = []

  function pick(origin, direction) {
    raycaster.set(origin, direction)
    let best = null
    for (const p of panels) {
      if (!p.mesh.visible || !p.buttons.length) continue
      const hit = raycaster.intersectObject(p.mesh, false)[0]
      if (hit && hit.uv && (!best || hit.distance < best.distance)) {
        best = { panel: p, id: p.hit(hit.uv), distance: hit.distance, point: hit.point }
      }
    }
    for (const t of targets) {
      if (!t.enabled()) continue
      const hit = raycaster.intersectObject(t.mesh, false)[0]
      if (hit && (!best || hit.distance < best.distance)) best = { target: t, id: t.id, distance: hit.distance, point: hit.point }
    }
    return best
  }

  function updateHover(origin, direction) {
    const r = pick(origin, direction)
    for (const p of panels) p.setHover(r && r.panel === p ? r.id : null)
    const t = r && r.target ? r.target.id : null
    if (t !== hoveredTarget) {
      hoveredTarget = t
      for (const l of hoverListeners) l(t)
    }
    return r
  }

  function press(origin, direction) {
    const r = pick(origin, direction)
    for (const g of gestureListeners) g()
    if (r && r.id) {
      for (const l of listeners) l(r.id, r.panel || null, r.point)
      return true
    }
    return false
  }

  for (let i = 0; i < 2; i++) {
    const c = renderer.xr.getController(i)
    const ray = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -3)]),
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.8 }),
    )
    ray.name = 'ray'
    c.add(ray)
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.012), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    c.add(dot)
    c.addEventListener('selectstart', () => {
      tmpMat.identity().extractRotation(c.matrixWorld)
      const dir = new THREE.Vector3(0, 0, -1).applyMatrix4(tmpMat)
      const org = new THREE.Vector3().setFromMatrixPosition(c.matrixWorld)
      press(org, dir)
    })
    c.addEventListener('connected', (e) => {
      c.visible = !!e.data
    })
    rig.add(c)
    controllers.push(c)
  }

  // mouse / touch on a flat screen
  const ndc = new THREE.Vector2()
  function screenRay(e) {
    const r = dom.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    return raycaster.ray
  }
  dom.addEventListener('pointermove', (e) => {
    if (renderer.xr.isPresenting) return
    const ray = screenRay(e)
    updateHover(ray.origin.clone(), ray.direction.clone())
  })
  dom.addEventListener('click', (e) => {
    if (renderer.xr.isPresenting || moved > 6) return
    const ray = screenRay(e)
    press(ray.origin.clone(), ray.direction.clone())
  })

  // --- moving the player between places ---
  let fading = null
  /** Blink to a new stand point: fade out, move, fade in. place = { position: Vector3, yaw: number } */
  function teleport(place, then) {
    if (fading) return
    fading = { t: 0, phase: 'out', place, then }
  }
  function placeNow(place) {
    rig.position.copy(place.position)
    lastPos.copy(place.position)
    rig.rotation.set(0, place.yaw || 0, 0)
    if (!renderer.xr.isPresenting) {
      yaw = 0
      pitch = 0
      camera.rotation.set(0, 0, 0)
    }
  }

  // --- smooth flights: rise out to a viewpoint, hover, then glide in (no turning, gentle speed changes) ---
  let flight = null
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  /**
   * Fly the player from where they are to `place`, via `via` (a high viewpoint).
   * opts: { out = 3.2, hold = 1.8, in = 3.6, onVia(), then() }
   */
  function fly(place, via, opts = {}) {
    if (fading || flight) return
    const A = rig.position.clone()
    const B = place.position.clone()
    const up = opts.lift ?? Math.max(20, (via.y - A.y) * 0.5) // lift: how far the path bulges (small underwater)
    const legOut = new THREE.CubicBezierCurve3(A, A.clone().add(new THREE.Vector3(-0.15 * up, up, 0)), via.clone().add(new THREE.Vector3(0.2 * up, -0.25 * up, 0)), via.clone())
    const legIn = new THREE.CubicBezierCurve3(via.clone(), via.clone().add(new THREE.Vector3(0.35 * up, 0, 0)), B.clone().add(new THREE.Vector3(-0.35 * up, 0.55 * up, 0)), B)
    flight = { place, legOut, legIn, t: 0, out: opts.out ?? 3.2, hold: opts.hold ?? 1.8, in: opts.in ?? 3.6, onVia: opts.onVia, then: opts.then, viaDone: false }
    rig.rotation.set(0, place.yaw || 0, 0)
  }
  function skipFlight() {
    if (!flight) return
    const f = flight
    flight = null
    teleport(f.place, () => { if (!f.viaDone && f.onVia) f.onVia(); if (f.then) f.then() })
  }
  const lastPos = new THREE.Vector3()
  let speed = 0

  const onFrame = []
  const clock = new THREE.Clock()
  let customRender = null
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.1)
    const t = clock.elapsedTime
    if (fading) {
      fading.t += dt
      if (fading.phase === 'out') {
        fadeMat.opacity = Math.min(1, fading.t / 0.35)
        if (fading.t >= 0.35) {
          placeNow(fading.place)
          if (fading.then) fading.then()
          fading.phase = 'in'
          fading.t = 0
        }
      } else {
        fadeMat.opacity = Math.max(0, 1 - fading.t / 0.45)
        if (fading.t >= 0.45) {
          fadeMat.opacity = 0
          fading = null
        }
      }
    }
    if (flight) {
      const f = flight
      f.t += dt
      if (f.t < f.out) rig.position.copy(f.legOut.getPoint(ease(f.t / f.out)))
      else if (f.t < f.out + f.hold) {
        rig.position.copy(f.legOut.getPoint(1))
        if (!f.viaDone) { f.viaDone = true; if (f.onVia) f.onVia() }
      } else if (f.t < f.out + f.hold + f.in) rig.position.copy(f.legIn.getPoint(ease((f.t - f.out - f.hold) / f.in)))
      else {
        rig.position.copy(f.place.position)
        flight = null
        if (f.then) f.then()
      }
    }
    // vignette follows how fast you are moving
    const v = dt > 0 ? rig.position.distanceTo(lastPos) / dt : 0
    lastPos.copy(rig.position)
    speed += (Math.min(v, 200) - speed) * Math.min(1, dt * 6)
    vignetteMat.uniforms.uStrength.value = Math.min(0.85, speed / 45)
    vignette.visible = vignetteMat.uniforms.uStrength.value > 0.01

    // hover from each controller ray
    if (renderer.xr.isPresenting) {
      for (const c of controllers) {
        if (!c.visible) continue
        tmpMat.identity().extractRotation(c.matrixWorld)
        const dir = new THREE.Vector3(0, 0, -1).applyMatrix4(tmpMat)
        const org = new THREE.Vector3().setFromMatrixPosition(c.matrixWorld)
        const r = updateHover(org, dir)
        const ray = c.getObjectByName('ray')
        if (ray) ray.scale.z = r ? Math.max(0.1, r.distance / 3) : 1
      }
    }
    for (const f of onFrame) f(dt, t)
    // flat screen can use a custom renderer (e.g. bloom post-processing); headsets always render directly
    if (customRender && !renderer.xr.isPresenting) customRender(activeScene, camera)
    else renderer.render(activeScene, camera)
  })

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  const vrButton = VRButton.createButton(renderer, { optionalFeatures: ['hand-tracking'] })

  return {
    THREE,
    renderer,
    scene,
    camera,
    rig,
    vrButton,
    isPresenting: () => renderer.xr.isPresenting,
    /** Render the flat-screen view yourself (fn(scene, camera)), or null for the default. */
    setRender(fn) { customRender = fn },
    addPanel(panel, parent = rig) {
      panels.push(panel)
      parent.add(panel.mesh)
    },
    onPress(fn) {
      listeners.push(fn)
    },
    onHoverTarget(fn) {
      hoverListeners.push(fn)
    },
    onGesture(fn) {
      gestureListeners.push(fn)
      dom.addEventListener('pointerdown', fn)
      vrButton.addEventListener('click', fn)
    },
    /** Make a mesh selectable. id is passed to onPress listeners. enabled() decides when it reacts. */
    addTarget(mesh, id, enabled = () => true) {
      targets.push({ mesh, id, enabled })
    },
    onFrame(fn) {
      onFrame.push(fn)
    },
    teleport,
    placeNow,
    /** Fade to black, run fn (e.g. swap scenes), fade back in. */
    blink(fn) {
      teleport({ position: rig.position.clone(), yaw: rig.rotation.y }, fn)
    },
    /** Move the player (and everything attached to them) into another scene. */
    setScene(s) {
      s.add(rig)
      activeScene = s
    },
    get activeScene() { return activeScene },
    fly,
    skipFlight,
    isMoving: () => !!flight || !!fading,
  }
}
