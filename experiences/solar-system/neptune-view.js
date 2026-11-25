import * as THREE from 'three'
import { PlanetPBRShader } from './planet-shaders.js'

// "Look back at the Sun" from Neptune. Neptune is about 30 times farther from the Sun than Earth (NASA), so the Sun
// looks about 30 times narrower: about 1/30 of the half a degree it covers in our sky. That is a point, like a very
// bright star, and sunlight there is about 900 times dimmer. Its true size from Neptune is far smaller than a pixel,
// so it is drawn as a bright point with glare; the panel shows the size comparison with the Sun seen from Earth.

const SUN_DIST = 420
const SUN_DIR = new THREE.Vector3(1, 0.12, -0.38).normalize() // ahead, a little left and up

function ringTexture(dashed) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.strokeStyle = 'rgba(255,235,170,0.95)'
  ctx.lineWidth = dashed ? 10 : 12
  if (dashed) ctx.setLineDash([22, 14])
  ctx.beginPath()
  ctx.arc(128, 128, 110, 0, Math.PI * 2)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function starTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.07, 'rgba(255,252,240,1)')
  g.addColorStop(0.2, 'rgba(255,235,190,0.3)')
  g.addColorStop(1, 'rgba(255,200,120,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  // thin glare spikes, like a bright star
  ctx.globalCompositeOperation = 'lighter'
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const lg = ctx.createLinearGradient(128 - dx * 128, 128 - dy * 128, 128 + dx * 128, 128 + dy * 128)
    lg.addColorStop(0, 'rgba(255,240,210,0)')
    lg.addColorStop(0.5, 'rgba(255,240,210,0.8)')
    lg.addColorStop(1, 'rgba(255,240,210,0)')
    ctx.fillStyle = lg
    if (dx) ctx.fillRect(0, 126, 256, 4)
    else ctx.fillRect(126, 0, 4, 256)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function label(text, color) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 128
  const ctx = c.getContext('2d')
  ctx.font = 'bold 60px "Trebuchet MS", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.9)'
  ctx.shadowBlur = 10
  ctx.fillStyle = color
  ctx.fillText(text, 512, 64, 1000)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }))
}

export function buildNeptuneView({ neptuneMap, skyTex }) {
  const scene = new THREE.Scene()
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, toneMapped: false, color: 0xb8c4dc }))
  sky.renderOrder = -10
  scene.add(sky)

  const center = new THREE.Vector3(0, 1.6, 0)
  const sunPos = center.clone().addScaledVector(SUN_DIR, SUN_DIST)

  // Neptune, huge, below and to the right, lit by the faraway Sun
  const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(9, 96, 64),
    new THREE.ShaderMaterial({
      uniforms: { uMap: { value: neptuneMap }, uSunPos: { value: sunPos }, uBumpScale: { value: 1.1 }, uTint: { value: new THREE.Color('#5d8cf0') }, uLimbColor: { value: new THREE.Color('#3d78ff') }, uLimbStrength: { value: 0.3 } },
      vertexShader: PlanetPBRShader.vertexShader, fragmentShader: PlanetPBRShader.fragmentShader,
    }),
  )
  neptune.position.set(9, -6.5, 9)
  neptune.rotation.z = 0.5
  scene.add(neptune)

  // the Sun: its true size from Neptune is far smaller than a pixel, so it shows as a bright point with glare
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }))
  sun.position.copy(sunPos)
  const STAR_DEG = 2.4 // size of the glare sprite (the bright core is a few pixels)
  sun.scale.setScalar(2 * SUN_DIST * Math.tan(THREE.MathUtils.degToRad(STAR_DEG / 2)))
  scene.add(sun)
  // a pulsing ring so you can find it
  const finder = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTexture(false), transparent: true, depthWrite: false, toneMapped: false, opacity: 0.6, blending: THREE.AdditiveBlending }))
  finder.position.copy(sunPos)
  scene.add(finder)
  const finderSize = 2 * SUN_DIST * Math.tan(THREE.MathUtils.degToRad(4))
  const sunLabel = label('The Sun', '#fde68a')
  sunLabel.position.copy(sunPos).add(new THREE.Vector3(0, finderSize * 0.85, 0))
  sunLabel.scale.set(finderSize * 2.4, finderSize * 0.3, 1)
  scene.add(sunLabel)
  const hint = label('It looks like a very bright star', '#e8f1ff')
  hint.position.copy(sunPos).add(new THREE.Vector3(0, -finderSize * 0.85, 0))
  hint.scale.set(finderSize * 2.6, finderSize * 0.32, 1)
  scene.add(hint)

  return {
    scene,
    start: { position: new THREE.Vector3(0, 0, 0), yaw: -Math.PI / 2 },
    update(dt, t, rig) {
      sky.position.copy(rig.position)
      neptune.rotation.y += dt * 0.02
      finder.scale.setScalar(finderSize * (1 + 0.08 * Math.sin(t * 3)))
    },
  }
}
