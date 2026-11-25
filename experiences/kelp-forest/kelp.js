import * as THREE from 'three'
import { floorY, reefiness, SUN_DIR } from './ocean.js'

// Sea bamboo (Ecklonia maxima): a long hollow stalk (stipe) anchored to the rock by a holdfast, with a
// gas-filled bulb at the top that floats a crown of long strap-like fronds near the surface.
// Split-fan kelp (Laminaria pallida) grows lower down as an understorey.
// All the swaying happens on the graphics card, so a whole forest costs very little.

const SWAY = `
  vec2 sway(float yN, float ph, float t) {
    float k = pow(yN, 1.35);
    return vec2(sin(t * 0.55 + ph + yN * 1.6) * 0.85 + sin(t * 1.3 + ph * 2.1) * 0.15,
                cos(t * 0.42 + ph * 1.3 + yN) * 0.6) * k + vec2(0.6, 0.0) * k; // gentle swell plus a current
  }`

/** Sunlight shining through thin kelp blades (strongest when you look towards the Sun through them). */
export const uSunView = { value: new THREE.Vector3(0, 1, 0) }
const TRANSLUCENT = `
  float back = pow(max(dot(normalize(-vViewPosition), uSunView), 0.0), 2.5);
  float side = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), 2.0);
  totalEmissiveRadiance += diffuseColor.rgb * vec3(1.35, 1.3, 0.55) * (back * 1.7 + side * 0.25 + 0.18);`
function addSway(material, uTime, key, mode) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.uniforms.uSunView = uSunView
    if (mode === 'frond') shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uSunView;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>' + TRANSLUCENT)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nattribute vec4 aPlant; uniform float uTime;\n${SWAY}`)
      .replace('#include <project_vertex>', mode === 'stipe' ? `
        vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);
        mvPosition.xz += sway(clamp(position.y, 0.0, 1.0), aPlant.x, uTime) * aPlant.y;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;` : mode === 'top' ? `
        vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);
        mvPosition.xz += sway(1.0, aPlant.x, uTime) * aPlant.y;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;` : `
        // fronds: ripple along their length, then ride along with the top of the plant
        vec3 q = transformed;
        float L = clamp(position.y, 0.0, 1.0);
        q.x += sin(uTime * 1.4 + aPlant.x * 3.0 + L * 5.0) * 0.12 * L;
        q.z += sin(uTime * 1.1 + aPlant.x * 2.0 + L * 3.5) * 0.22 * L - 0.35 * L * L;
        vec4 mvPosition = instanceMatrix * vec4(q, 1.0);
        mvPosition.xz += sway(1.0, aPlant.x, uTime) * aPlant.y;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`)
  }
  material.customProgramCacheKey = () => 'kelp-' + key
  return material
}

function frondTexture() {
  // Sea bamboo fronds: long golden-olive straps fringed with smaller blades, thin enough to glow in sunlight.
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 1024
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 128, 1024)
  const blade = (x, y, w, h, ang, a) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(ang)
    const g = ctx.createLinearGradient(0, 0, 0, -h)
    g.addColorStop(0, `rgba(118,96,38,${a})`)
    g.addColorStop(0.5, `rgba(168,140,58,${a})`)
    g.addColorStop(1, `rgba(150,128,50,${a * 0.7})`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(-w * 0.3, 0)
    ctx.bezierCurveTo(-w, -h * 0.3, -w * 0.8, -h * 0.8, 0, -h)
    ctx.bezierCurveTo(w * 0.8, -h * 0.8, w, -h * 0.3, w * 0.3, 0)
    ctx.fill()
    ctx.restore()
  }
  // central strap
  for (let y = 0; y < 1024; y += 2) {
    const t = y / 1023
    const w = 7 + 9 * Math.sin(Math.min(1, t * 1.2) * Math.PI * 0.5) * (1 - Math.pow(t, 5))
    ctx.fillStyle = `rgba(${130 + 30 * Math.sin(y * 0.05)},${104 + 20 * Math.sin(y * 0.05)},42,1)`
    ctx.fillRect(64 - w, 1023 - y, w * 2, 2)
  }
  // fringe of smaller blades along both edges
  for (let y = 980; y > 60; y -= 26 + Math.random() * 18) {
    const t = 1 - y / 1023
    const len = 70 + 90 * Math.sin(Math.min(1, t * 1.4) * Math.PI * 0.5) * (1 - t * 0.5)
    for (const sgn of [-1, 1]) blade(64 + sgn * 10, y, 11 + Math.random() * 6, len * (0.7 + Math.random() * 0.5), sgn * (0.45 + Math.random() * 0.35), 0.92)
  }
  // veins, wear and little holes
  const id = ctx.getImageData(0, 0, 128, 1024)
  for (let i = 0; i < id.data.length; i += 4) {
    if (id.data[i + 3] === 0) continue
    const n = Math.random()
    id.data[i] *= 0.88 + 0.2 * n
    id.data[i + 1] *= 0.88 + 0.2 * n
    if (Math.random() < 0.0025) id.data[i + 3] = 0
  }
  ctx.putImageData(id, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}
function fanTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.translate(128, 250)
  for (let i = 0; i < 9; i++) {
    const a = -0.9 + (i / 8) * 1.8
    ctx.save()
    ctx.rotate(a)
    const g = ctx.createLinearGradient(0, 0, 0, -230)
    g.addColorStop(0, 'rgba(110,90,40,1)')
    g.addColorStop(1, 'rgba(150,125,55,0.8)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(-6, 0)
    ctx.quadraticCurveTo(-16, -120, -4, -230)
    ctx.lineTo(4, -230)
    ctx.quadraticCurveTo(16, -120, 6, 0)
    ctx.fill()
    ctx.restore()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** clear: list of {x, z, r} spots to keep open (where you stop to look around). */
export function buildKelp(scene, uTime, clear) {
  const plants = []
  const free = (x, z, pad) => clear.every((c) => (x - c.x) ** 2 + (z - c.z) ** 2 > (c.r + pad) ** 2)
  let tries = 0
  while (plants.length < 460 && tries++ < 50000) {
    const x = -6 + Math.random() * 170, z = (Math.random() - 0.5) * 80
    if (reefiness(x, z) < 0.18 || !free(x, z, 0)) continue
    if (x > 120 && x < 150 && Math.abs(z) < 14) continue // open sandy area where the big shark cruises
    if (Math.abs(z) < 2.2 && x > -4 && x < 150) continue // a clear lane for you to glide along
    plants.push({ x, z, y: floorY(x, z), ph: Math.random() * 6.28, amp: 0.6 + Math.random() * 0.6 })
  }

  const N = plants.length
  const plantAttr = new Float32Array(N * 4)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3()

  // stalks
  const stipeGeo = new THREE.CylinderGeometry(0.05, 0.035, 1, 7, 24, true) // hollow tube, widening towards the bulb
  stipeGeo.translate(0, 0.5, 0)
  const stipeMat = addSway(new THREE.MeshStandardMaterial({ color: 0x7d6634, roughness: 0.5, metalness: 0, emissive: 0x1c1606 }), uTime, 'stipe', 'stipe')
  const stipes = new THREE.InstancedMesh(stipeGeo, stipeMat, N)
  // bulbs
  const bulbGeo = new THREE.SphereGeometry(0.11, 14, 10)
  bulbGeo.scale(1, 1.6, 1)
  const bulbMat = addSway(new THREE.MeshStandardMaterial({ color: 0x8a7035, roughness: 0.35, emissive: 0x1c1606 }), uTime, 'bulb', 'top')
  const bulbs = new THREE.InstancedMesh(bulbGeo, bulbMat, N)
  // holdfasts (the root-like grip on the rock)
  const holdGeo = new THREE.IcosahedronGeometry(0.22, 1)
  holdGeo.scale(1.3, 0.6, 1.3)
  const holds = new THREE.InstancedMesh(holdGeo, new THREE.MeshStandardMaterial({ color: 0x4a3d1d, roughness: 0.9 }), N)

  const FR = 16
  const frondGeo = new THREE.PlaneGeometry(0.42, 1, 1, 10)
  frondGeo.translate(0, 0.5, 0)
  const frondMat = addSway(new THREE.MeshStandardMaterial({ map: frondTexture(), transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.55, color: 0xd8d0a0 }), uTime, 'frond', 'frond')
  const fronds = new THREE.InstancedMesh(frondGeo, frondMat, N * FR)
  const frondAttr = new Float32Array(N * FR * 4)

  plants.forEach((p, i) => {
    const L = -p.y - 0.7 - Math.random() * 1.2 // reaches up to just below the surface
    plantAttr.set([p.ph, p.amp, L, 0], i * 4)
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6.28)
    m.compose(v.set(p.x, p.y, p.z), q, s.set(1, L, 1))
    stipes.setMatrixAt(i, m)
    m.compose(v.set(p.x, p.y + L, p.z), q, s.set(1, 1, 1))
    bulbs.setMatrixAt(i, m)
    m.compose(v.set(p.x, p.y + 0.05, p.z), q, s.set(1, 1, 1))
    holds.setMatrixAt(i, m)
    for (let f = 0; f < FR; f++) {
      // fronds stream away with the current (+x) in a loose, untidy bunch, most of them drooping
      const a = Math.PI / 2 + (Math.random() - 0.5) * 3.4 + (Math.random() < 0.25 ? Math.PI : 0)
      const len = 1.4 + Math.random() * 2.4
      const droop = -0.35 + Math.random() * 1.25 // radians below horizontal (negative = lifting up)
      const qf = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, a, 0))
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2 + droop))
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 2.4))
      m.compose(v.set(p.x, p.y + L + 0.08, p.z), qf, s.set(1, len, 1))
      fronds.setMatrixAt(i * FR + f, m)
      frondAttr.set([p.ph + f * 0.4, p.amp, L, 0], (i * FR + f) * 4)
    }
  })
  stipeGeo.setAttribute('aPlant', new THREE.InstancedBufferAttribute(plantAttr, 4))
  bulbGeo.setAttribute('aPlant', new THREE.InstancedBufferAttribute(plantAttr, 4))
  frondGeo.setAttribute('aPlant', new THREE.InstancedBufferAttribute(frondAttr, 4))
  for (const im of [stipes, bulbs, holds, fronds]) { im.frustumCulled = false; scene.add(im) }

  // split-fan kelp understorey
  const U = 520
  const ug = new THREE.PlaneGeometry(0.9, 0.9, 1, 4)
  ug.translate(0, 0.45, 0)
  const uAttr = new Float32Array(U * 4)
  const fanMat = new THREE.MeshStandardMaterial({ map: fanTexture(), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, roughness: 0.7 })
  fanMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.uniforms.uSunView = uSunView
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uSunView;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>' + TRANSLUCENT)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aPlant; uniform float uTime;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat yy = clamp(position.y / 0.9, 0.0, 1.0);\ntransformed.x += sin(uTime * 0.9 + aPlant.x) * 0.18 * yy * yy;\ntransformed.z += cos(uTime * 0.7 + aPlant.x) * 0.12 * yy * yy;')
  }
  fanMat.customProgramCacheKey = () => 'kelp-fan'
  const fans = new THREE.InstancedMesh(ug, fanMat, U)
  let n = 0
  tries = 0
  while (n < U && tries++ < 20000) {
    const x = -6 + Math.random() * 170, z = (Math.random() - 0.5) * 80
    if (reefiness(x, z) < 0.3 || !free(x, z, -1.5)) continue
    const sc = 0.8 + Math.random() * 1.4
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6.28)
    m.compose(v.set(x, floorY(x, z), z), q, s.set(sc, sc * (1 + Math.random()), sc))
    fans.setMatrixAt(n, m)
    uAttr.set([Math.random() * 6.28, 1, 0, 0], n * 4)
    n++
  }
  fans.count = n
  ug.setAttribute('aPlant', new THREE.InstancedBufferAttribute(uAttr, 4))
  fans.frustumCulled = false
  scene.add(fans)

  // keep the Sun's direction (as seen from your eyes) up to date for the glowing blades
  return {
    plants,
    update(camera) { uSunView.value.copy(SUN_DIR).transformDirection(camera.matrixWorldInverse) },
  }
}
