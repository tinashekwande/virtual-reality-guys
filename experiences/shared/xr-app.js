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
  camera.position.set(0, 1.6, 0) // flat-screen eye height; replaced by the headset pose in VR

  // --- comfort fade (a black shell around the head) ---
  const fadeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false })
  const fade = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), fadeMat)
  fade.renderOrder = 1000
  fade.frustumCulled = false
  camera.add(fade)

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

  // --- pointer interaction with panels ---
  const raycaster = new THREE.Raycaster()
  const panels = []
  const listeners = []
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
    return best
  }

  function updateHover(origin, direction) {
    const r = pick(origin, direction)
    for (const p of panels) p.setHover(r && r.panel === p ? r.id : null)
    return r
  }

  function press(origin, direction) {
    const r = pick(origin, direction)
    if (r && r.id) {
      for (const l of listeners) l(r.id, r.panel)
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
    rig.rotation.set(0, place.yaw || 0, 0)
    if (!renderer.xr.isPresenting) {
      yaw = 0
      pitch = 0
      camera.rotation.set(0, 0, 0)
    }
  }

  const onFrame = []
  const clock = new THREE.Clock()
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
    renderer.render(scene, camera)
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
    addPanel(panel, parent = rig) {
      panels.push(panel)
      parent.add(panel.mesh)
    },
    onPress(fn) {
      listeners.push(fn)
    },
    onFrame(fn) {
      onFrame.push(fn)
    },
    teleport,
    placeNow,
  }
}
