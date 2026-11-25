import * as THREE from 'three'
import { SIMPLEX, glowTexture } from './scene.js'

// A comet crossing the inner solar system: a small dark nucleus, a glowing coma, a straight blue ion tail
// pointing exactly away from the Sun and a broader, curved, yellow-white dust tail, plus streaming dust grains.

const TRACK = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-260, 120, -320),
  new THREE.Vector3(-90, 55, -150),
  new THREE.Vector3(20, 26, -62),
  new THREE.Vector3(70, 22, -20),
  new THREE.Vector3(140, 42, 60),
  new THREE.Vector3(260, 90, 210),
  new THREE.Vector3(420, 150, 380),
])
const CROSSING_SECONDS = 600 // one pass takes about 10 minutes, so it is in the sky for most of the tour

function tailGeometry(length, r0, r1, bend, segs = 64, radial = 28) {
  const pos = [], uv = [], idx = []
  for (let i = 0; i <= segs; i++) {
    const v = i / segs
    const r = r0 + (r1 - r0) * Math.pow(v, 0.8)
    const y = v * length
    const x = bend * v * v * length
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      pos.push(x + Math.cos(a) * r, y, Math.sin(a) * r)
      uv.push(j / radial, v)
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1
    idx.push(a, b, a + 1, b, b + 1, a + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function tailMaterial(color, { streak = 10, flow = 0.25, power = 1.6, strength = 1 }) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(...color) }, uTime: { value: 0 }, uStrength: { value: strength } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `${SIMPLEX}
      uniform vec3 uColor; uniform float uTime; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float v = vUv.y;
        float along = pow(1.0 - v, ${power.toFixed(2)}) * smoothstep(0.0, 0.03, v);
        float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.4);
        float a = vUv.x * 6.2832;
        float n = snoise(vec3(cos(a) * ${streak.toFixed(1)}, sin(a) * ${streak.toFixed(1)}, v * 4.0 - uTime * ${flow.toFixed(3)}));
        float streaks = 0.55 + 0.45 * n;
        gl_FragColor = vec4(uColor * along * core * streaks * uStrength, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  })
}

export function buildComet(scene, sunPos) {
  const root = new THREE.Group()
  scene.add(root)

  // nucleus: a dark lumpy potato of ice and dust
  const ng = new THREE.IcosahedronGeometry(0.22, 3)
  const np = ng.attributes.position
  for (let i = 0; i < np.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(np, i)
    const k = 1 + 0.25 * Math.sin(v.x * 9) * Math.cos(v.y * 7) + 0.15 * Math.sin(v.z * 13)
    v.multiplyScalar(k)
    v.x *= 1.5
    np.setXYZ(i, v.x, v.y, v.z)
  }
  ng.computeVertexNormals()
  const nucleus = new THREE.Mesh(ng, new THREE.MeshStandardMaterial({ color: 0x3a3530, roughness: 1 }))
  root.add(nucleus)

  // coma: glowing cloud of gas around the nucleus
  const coma = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture([210, 255, 235], [80, 200, 170], 0.45), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }))
  coma.scale.setScalar(5)
  root.add(coma)
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture([255, 255, 255], [180, 240, 255], 0.25), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }))
  core.scale.setScalar(1.4)
  root.add(core)

  // tails
  const ionMat = tailMaterial([0.35, 0.6, 1.25], { streak: 14, flow: 0.9, power: 1.2, strength: 1.1 })
  const ion = new THREE.Mesh(tailGeometry(55, 0.12, 1.4, 0), ionMat)
  const dustMat = tailMaterial([1.15, 0.98, 0.78], { streak: 6, flow: 0.18, power: 1.9, strength: 0.85 })
  const dust = new THREE.Mesh(tailGeometry(38, 0.35, 7, 0.32), dustMat)
  ion.frustumCulled = dust.frustumCulled = false
  root.add(ion, dust)

  // dust grains streaming away
  const N = 500
  const gpos = new Float32Array(N * 3)
  const gvel = Array.from({ length: N }, () => new THREE.Vector3())
  const gage = new Float32Array(N).map(() => Math.random() * 6)
  const gg = new THREE.BufferGeometry()
  gg.setAttribute('position', new THREE.BufferAttribute(gpos, 3))
  const grains = new THREE.Points(gg, new THREE.PointsMaterial({ map: glowTexture([255, 245, 220], [255, 200, 150], 0.3), size: 0.35, color: 0xfff0d8, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  grains.frustumCulled = false
  scene.add(grains)

  const anti = new THREE.Vector3(), vel = new THREE.Vector3(), side = new THREE.Vector3(), q = new THREE.Quaternion(), m = new THREE.Matrix4()
  const UP = new THREE.Vector3(0, 1, 0)
  const prev = new THREE.Vector3()
  let first = true
  let u = 0.35

  return {
    root,
    update(dt, t) {
      // Kepler's second law: a comet speeds up as it swings close to the Sun and slows down far away
      // (speed ~ 1 / sqrt(distance) here); a whole pass still takes about CROSSING_SECONDS
      const here = TRACK.getPointAt(u)
      const k = THREE.MathUtils.clamp(Math.sqrt(70 / Math.max(1, here.distanceTo(sunPos))), 0.45, 2.2)
      u = (u + (Math.min(dt, 0.1) * k) / CROSSING_SECONDS) % 1
      const p = TRACK.getPointAt(u)
      root.position.copy(p)
      if (first) { prev.copy(p); first = false }
      vel.copy(p).sub(prev)
      if (vel.lengthSq() < 1e-8) vel.copy(TRACK.getTangentAt(u))
      vel.normalize()
      prev.copy(p)
      // brighter and longer near the Sun
      const dSun = p.distanceTo(sunPos)
      const f = THREE.MathUtils.clamp(90 / dSun, 0.35, 1.5)
      anti.copy(p).sub(sunPos).normalize()
      // ion tail: straight away from the Sun
      q.setFromUnitVectors(UP, anti)
      ion.quaternion.copy(q)
      ion.scale.setScalar(f)
      // dust tail: away from the Sun but curving back along the path
      side.copy(vel).multiplyScalar(-1).addScaledVector(anti, -vel.clone().multiplyScalar(-1).dot(anti)).normalize()
      const z = new THREE.Vector3().crossVectors(side, anti).normalize()
      m.makeBasis(side, anti, z)
      dust.quaternion.setFromRotationMatrix(m)
      dust.scale.setScalar(f)
      ionMat.uniforms.uTime.value = t
      dustMat.uniforms.uTime.value = t
      ionMat.uniforms.uStrength.value = 1.1 * f
      dustMat.uniforms.uStrength.value = 0.85 * f
      coma.scale.setScalar(4 + 3 * f + 0.3 * Math.sin(t * 2.1))
      nucleus.rotation.y += dt * 0.3
      nucleus.rotation.x += dt * 0.11
      // grains
      for (let i = 0; i < N; i++) {
        gage[i] += dt
        if (gage[i] > 6) {
          gage[i] = 0
          gpos[i * 3] = p.x; gpos[i * 3 + 1] = p.y; gpos[i * 3 + 2] = p.z
          gvel[i].copy(anti).multiplyScalar(2 + Math.random() * 5 * f).add(new THREE.Vector3().randomDirection().multiplyScalar(0.8)).addScaledVector(vel, -1.5 * Math.random())
        } else {
          gpos[i * 3] += gvel[i].x * dt; gpos[i * 3 + 1] += gvel[i].y * dt; gpos[i * 3 + 2] += gvel[i].z * dt
        }
      }
      gg.attributes.position.needsUpdate = true
      grains.material.opacity = 0.75 * f
    },
  }
}
