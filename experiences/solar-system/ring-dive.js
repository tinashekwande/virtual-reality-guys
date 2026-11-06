import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { SIMPLEX, glowTexture, sunShadows } from './scene.js'

// Inside Saturn's rings: you drift a few metres above the ring plane, among tumbling chunks of ice and rock
// from pebble size to house size, with Saturn filling the sky and the rings stretching to the horizon.
// Near things are real size (metres); faraway things (Saturn, the ring sheet) live in a scaled-down
// background that follows you (1 unit there = 100 m), drawn first so the chunks always sit in front of it.

const SUN_DIR = new THREE.Vector3(0.62, 0.22, 0.75).normalize()
const PLANE_Y = -8 // ring mid-plane, metres below your feet
const BOX = new THREE.Vector3(280, 22, 280) // chunk field that wraps around you
const SPEED = 3.2 // metres per second, gentle

export function buildRingDive({ saturnMap, ringTex, skyTex }) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x7d7364, 0.0085)

  // ---- light ----
  const sun = new THREE.DirectionalLight(0xfff3e2, 3.4)
  sun.position.copy(SUN_DIR).multiplyScalar(100)
  scene.add(sun)
  const saturnShine = new THREE.DirectionalLight(0xe6c89a, 0.7) // warm light reflected off Saturn
  saturnShine.position.set(-0.2, 0.1, -1).multiplyScalar(100)
  scene.add(saturnShine)
  scene.add(new THREE.AmbientLight(0x9aa6b8, 0.3))

  // ---- faraway background (follows you; 1 unit = 100 m) ----
  const bg = new THREE.Group()
  scene.add(bg)
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1900, 48, 24), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false, color: 0xbbbbbb }))
  sky.renderOrder = -10
  scene.add(sky)
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture([255, 250, 235], [255, 200, 120], 0.25), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false }))
  sunGlow.position.copy(SUN_DIR).multiplyScalar(1700)
  sunGlow.scale.setScalar(150)
  scene.add(sunGlow)

  // Saturn: about 1.7x its own radius away -> fills a third of the sky on your left
  const SAT = new THREE.Vector3(180, 0, -1000)
  const SR = 580
  const satRingIn = 720, satRingOut = 1340
  const satMat = new THREE.MeshStandardMaterial({ map: saturnMap, roughness: 1, metalness: 0, fog: false })
  const saturn = new THREE.Mesh(new THREE.SphereGeometry(SR, 128, 80), satMat)
  saturn.position.copy(SAT)
  saturn.rotation.z = 0.05
  saturn.renderOrder = -6
  bg.add(saturn)
  // the ring sheet out to the horizon (faded near you, where the real chunks take over)
  const sheetGeo = new THREE.RingGeometry(satRingIn, satRingOut, 512, 8)
  const sp = sheetGeo.attributes.position, suv = sheetGeo.attributes.uv
  for (let i = 0; i < sp.count; i++) suv.setXY(i, (Math.hypot(sp.getX(i), sp.getY(i)) - satRingIn) / (satRingOut - satRingIn), 0.5)
  const sheetMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: ringTex }, uSun: { value: SUN_DIR }, uSat: { value: SAT }, uR: { value: SR } },
    vertexShader: `varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = (wp.xyz - (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `${SIMPLEX}
      uniform sampler2D map; uniform vec3 uSun; uniform vec3 uSat; uniform float uR; varying vec2 vUv; varying vec3 vP;
      void main(){
        vec4 c = texture2D(map, vec2(vUv.x, 0.5));
        // planet shadow across the rings
        vec3 P = vP + uSat; // position relative to you, in km
        vec3 oc = P - uSat; float b = dot(oc, uSun); float disc = b * b - (dot(oc, oc) - uR * uR);
        float shadow = (disc > 0.0 && b < 0.0) ? 0.1 : 1.0;
        float grain = 0.8 + 0.25 * snoise(vec3(P.xz * 0.35, 0.0)) + 0.15 * snoise(vec3(P.xz * 1.7, 3.0));
        float d = length(P.xz);
        float nearFade = mix(0.55, 1.0, smoothstep(0.3, 3.0, d)); // a bright ring floor below the chunks // hand over to the real chunks close to you
        vec3 col = c.rgb * shadow * grain * 1.15;
        gl_FragColor = vec4(col, c.a * nearFade);
        #include <colorspace_fragment>
      }`,
    transparent: false, blending: THREE.CustomBlending, side: THREE.DoubleSide, depthWrite: false, fog: false,
  })
  const sheet = new THREE.Mesh(sheetGeo, sheetMat)
  sheet.rotation.x = -Math.PI / 2
  sheet.position.set(SAT.x, (PLANE_Y - 1.6) / 100, SAT.z)
  sheet.renderOrder = -5
  bg.add(sheet)
  const sunFar = new THREE.Vector3()
  sunShadows(satMat, sunFar, [], { mesh: sheet, inner: satRingIn, outer: satRingOut, texture: ringTex })
  satMat.userData.shadowSunR = 1

  // ---- the chunks (GPU-wrapped so the field is endless, tumbling in the shader) ----
  // Two sets: a few hundred big, detailed boulders and a few thousand simpler small chunks, to stay light on the headset.
  const uOffset = { value: new THREE.Vector3() }
  const uTime = { value: 0 }
  const uBox = { value: BOX }
  function rockGeometry(detail, seed) {
    let g = new THREE.IcosahedronGeometry(1, detail)
    g.deleteAttribute('normal')
    g.deleteAttribute('uv')
    g = mergeVertices(g)
    const gp = g.attributes.position
    for (let i = 0; i < gp.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(gp, i)
      const k = 1 + 0.24 * Math.sin(v.x * 4.1 + seed) * Math.cos(v.y * 3.7 + seed * 2) + 0.12 * Math.sin(v.z * 8.3 + seed * 3) + 0.05 * Math.sin(v.x * 17 + v.y * 13)
      v.multiplyScalar(k)
      gp.setXYZ(i, v.x * 1.15, v.y * 0.85, v.z)
    }
    g.computeVertexNormals()
    return g
  }
  function field(geo, count, sizeOf, keySuffix) {
    const base = new Float32Array(count * 3), spin = new Float32Array(count * 4)
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0.0 })
    const mesh = new THREE.InstancedMesh(geo, mat, count)
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), zero = new THREE.Vector3()
    const col = new THREE.Color()
    let n = 0
    while (n < count) {
      const x = (Math.random() - 0.5) * BOX.x, z = (Math.random() - 0.5) * BOX.z
      const y = PLANE_Y + (Math.random() + Math.random() + Math.random() - 1.5) * (BOX.y / 3) // denser near the mid-plane
      const s = sizeOf()
      if (Math.abs(z) < 3.5 + s && Math.abs(y - 1) < 3 + s) continue // keep a clear lane for you
      base.set([x, y, z], n * 3)
      const ax = new THREE.Vector3().randomDirection()
      spin.set([ax.x, ax.y, ax.z, (0.04 + Math.random() * 0.25) / Math.sqrt(s + 0.2)], n * 4)
      e.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)
      q.setFromEuler(e)
      sc.set(s, s * (0.7 + Math.random() * 0.3), s * (0.8 + Math.random() * 0.4))
      m4.compose(zero, q, sc)
      mesh.setMatrixAt(n, m4)
      const ice = Math.random()
      col.setRGB(0.97, 0.95 - 0.04 * ice, 0.9 - 0.07 * ice) // icy white with a little dust
      if (Math.random() < 0.15) col.multiplyScalar(0.55) // darker, dirtier rock
      mesh.setColorAt(n, col)
      n++
    }
    geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3))
    geo.setAttribute('aSpin', new THREE.InstancedBufferAttribute(spin, 4))
    mesh.frustumCulled = false
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uOffset = uOffset
      shader.uniforms.uTime = uTime
      shader.uniforms.uBox = uBox
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
          attribute vec3 aBase; attribute vec4 aSpin; uniform vec3 uOffset; uniform float uTime; uniform vec3 uBox; varying vec3 vObjP;
          vec3 rotAxis(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }`)
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = rotAxis(objectNormal, aSpin.xyz, uTime * aSpin.w);')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = position + aBase * 0.37;\ntransformed = rotAxis(transformed, aSpin.xyz, uTime * aSpin.w);')
        .replace('#include <project_vertex>', `
          vec3 wrapPos = aBase;
          wrapPos.xz = mod(aBase.xz - uOffset.xz + uBox.xz * 0.5, uBox.xz) - uBox.xz * 0.5;
          vec4 mvPosition = vec4(transformed, 1.0);
          mvPosition = instanceMatrix * mvPosition;
          mvPosition.xyz += wrapPos;
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;`)
      // dirty, frosty surface variation
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying vec3 vObjP;\n${SIMPLEX}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          float grime = snoise(vObjP * 2.7) * 0.5 + snoise(vObjP * 7.9) * 0.25;
          diffuseColor.rgb *= 0.78 + 0.3 * grime;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), smoothstep(0.55, 0.9, snoise(vObjP * 5.3 + 11.0)) * 0.35);`)
    }
    mat.customProgramCacheKey = () => 'ringchunks' + keySuffix
    scene.add(mesh)
    return mesh
  }
  field(rockGeometry(3, 1.7), 260, () => 0.7 + 2.4 * Math.pow(Math.random(), 3), 'big')
  field(rockGeometry(1, 4.2), 2800, () => 0.05 + 0.65 * Math.pow(Math.random(), 2.5), 'small')

  // ---- glittering ice dust ----
  const D = 6000
  const dpos = new Float32Array(D * 3)
  for (let i = 0; i < D; i++) dpos.set([(Math.random() - 0.5) * 120, PLANE_Y + (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 120], i * 3)
  const dg = new THREE.BufferGeometry()
  dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uOffset, uTime },
    vertexShader: `uniform vec3 uOffset; uniform float uTime; varying float vA;
      void main(){
        vec3 p = position; p.xz = mod(p.xz - uOffset.xz + 60.0, 120.0) - 60.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float d = -mv.z;
        vA = (0.5 + 0.5 * sin(uTime * 3.0 + position.x * 13.0)) * smoothstep(60.0, 8.0, d);
        gl_PointSize = clamp(60.0 / d, 1.0, 4.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * vA * smoothstep(0.5, 0.0, d), 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
  const dust = new THREE.Points(dg, dustMat)
  dust.frustumCulled = false
  scene.add(dust)

  return {
    scene,
    start: { position: new THREE.Vector3(0, 0, 0), yaw: -Math.PI / 2 },
    update(dt, t, rig) {
      uTime.value = t
      uOffset.value.x += SPEED * dt
      // background follows you so it stays infinitely far
      bg.position.copy(rig.position).add(new THREE.Vector3(0, 1.6, 0))
      sky.position.copy(rig.position)
      sunGlow.position.copy(SUN_DIR).multiplyScalar(1700).add(rig.position)
      sunFar.copy(SUN_DIR).multiplyScalar(1e6).add(bg.position)
      bg.updateMatrixWorld(true)
      satMat.userData.updateShadows?.()
    },
  }
}
