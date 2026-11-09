import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

// The underwater world: green-blue Cape water, sunlight shafts, the rippling surface seen from below
// (with its bright "Snell's window"), a rocky seafloor with dancing light (caustics) and drifting marine snow.

export const WATER = new THREE.Color(0x1a6470) // cold Atlantic kelp-forest water: blue-green
export const FOG_DENSITY = 0.046 // you can see about 15-25 m, like a good day on the Atlantic seaboard

// Underwater, the water you look through is bright cyan towards the surface and deep blue-green below.
// Three.js fog is one flat colour, so we change it to depend on which way you are looking.
THREE.ShaderChunk.fog_pars_vertex = '#ifdef USE_FOG\n varying float vFogDepth;\n varying vec3 vFogView;\n#endif'
THREE.ShaderChunk.fog_vertex = '#ifdef USE_FOG\n vFogDepth = - mvPosition.z;\n vFogView = mvPosition.xyz;\n#endif'
THREE.ShaderChunk.fog_pars_fragment = `#ifdef USE_FOG
  uniform vec3 fogColor; varying float vFogDepth; varying vec3 vFogView;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
#endif`
export const WATER_GRADIENT = `
  vec3 waterTint(vec3 base, float y) {
    vec3 c = mix(base * 0.42, base, smoothstep(-0.75, -0.05, y));
    return mix(c, base * 1.6 + vec3(0.03, 0.07, 0.08), smoothstep(0.0, 0.85, y));
  }`
THREE.ShaderChunk.fog_fragment = `#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  vec3 fogDirW = normalize( transpose( mat3( viewMatrix ) ) * vFogView );
  float fy = fogDirW.y;
  vec3 fc = mix( fogColor * 0.42, fogColor, smoothstep( -0.75, -0.05, fy ) );
  fc = mix( fc, fogColor * 1.6 + vec3( 0.03, 0.07, 0.08 ), smoothstep( 0.0, 0.85, fy ) );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fc, fogFactor );
#endif`
export const SUN_DIR = new THREE.Vector3(0.25, 1, 0.18).normalize()

// ---------- seafloor shape ----------
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
function fbm(x, y, o = 5) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); n += a; a *= 0.5; f *= 2 } return s / n }
/** How rocky the bottom is here (0 = sand, 1 = reef). */
export function reefiness(x, z) {
  const sandChannel = Math.exp(-Math.pow((z - 10 * Math.sin(x * 0.05)) / 6, 2)) * 0.8 // a sandy gully winding through the forest
  const reefZone = Math.exp(-Math.pow((x - 97) / 24, 2)) * Math.exp(-Math.pow(z / 16, 2)) * 1.1 // the rocky reef you visit
  return Math.min(1, Math.max(0, fbm(x * 0.06 + 3, z * 0.06, 4) * 1.6 - 0.35 - sandChannel * (1 - reefZone) + reefZone + (x > 126 && x < 150 ? -0.6 : 0)))
}
/** Height of the seafloor (metres; the surface is y = 0). */
export function floorY(x, z) {
  const base = -11.5 - 2.5 * fbm(x * 0.012, z * 0.012, 3) + Math.max(0, -x) * 0.12 // shallower towards the shore (x < 0)
  const r = reefiness(x, z)
  const rocks = Math.pow(fbm(x * 0.18, z * 0.18, 5), 2) * 4.5 * r
  return Math.min(-1.5, base + rocks + 1.2 * r)
}

const CAUSTICS = `
  float caustic(vec2 p, float t) {
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      p += vec2(sin(p.y * 1.7 + t * 0.7 + fi), cos(p.x * 1.4 - t * 0.6 + fi * 1.3)) * 0.42;
      c += abs(sin(p.x * 2.1) * sin(p.y * 2.1));
    }
    return pow(clamp(1.0 - c / 3.0, 0.0, 1.0), 5.0);
  }`

/** Adds moving sunlight patterns (caustics) to a standard material, stronger in shallower water. */
const NOISE3 = `
  float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }`

export function withCaustics(material, uTime, key, crust = false) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCW;' + (crust === 'floor' ? '\nattribute float aReef; varying float vReef;' : ''))
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        ${crust === 'floor' ? 'vReef = aReef;' : ''}
        vec4 cw = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          cw = instanceMatrix * cw;
        #endif
        vCW = (modelMatrix * cw).xyz;`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vCW; uniform float uTime;\n${crust === 'floor' ? 'varying float vReef;' : ''}\n${CAUSTICS}\n${NOISE3}`)
      .replace('#include <normal_fragment_maps>', crust ? `#include <normal_fragment_maps>
        {
          // bumpy, encrusted surface: perturb the normal with a noise height field
          float H = vn3(vCW * 5.0) * 0.6 + vn3(vCW * 14.0) * 0.3 + vn3(vCW * 37.0) * 0.1;
          vec3 dpdx = dFdx(-vViewPosition), dpdy = dFdy(-vViewPosition);
          float dhx = dFdx(H), dhy = dFdy(H);
          vec3 r1 = cross(dpdy, normal), r2 = cross(normal, dpdx);
          float det = dot(dpdx, r1);
          vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
          float k = ${crust === 'floor' ? 'vReef * 0.06 + 0.012' : '0.07'};
          normal = normalize(abs(det) * normal - grad * k);
        }` : '#include <normal_fragment_maps>')
      .replace('#include <emissivemap_fragment>', crust ? `#include <emissivemap_fragment>
        {
          // rock crusted with yellow-green algae turf, pink coralline algae, sponges and dark crevices
          vec3 base = diffuseColor.rgb;
          vec3 c = base;
          float n1 = vn3(vCW * 1.7) * 0.6 + vn3(vCW * 5.3) * 0.4;
          float fine = vn3(vCW * 23.0);
          c *= 0.5 + 0.8 * n1;
          float turf = smoothstep(0.35, 0.6, vn3(vCW * 2.1 + 3.0)) * smoothstep(-0.2, 0.6, normal.y);
          c = mix(c, mix(vec3(0.2, 0.22, 0.09), vec3(0.38, 0.36, 0.14), fine), turf * 0.8);
          c = mix(c, vec3(0.55, 0.32, 0.38), smoothstep(0.55, 0.7, vn3(vCW * 2.6 + 11.0)) * 0.65);
          c = mix(c, vec3(0.6, 0.38, 0.16), smoothstep(0.82, 0.88, vn3(vCW * 3.4 + 5.0)) * 0.5);
          c *= (0.65 + 0.5 * fine) * mix(0.45, 1.0, smoothstep(0.25, 0.55, vn3(vCW * 0.9 + 2.0)));
          diffuseColor.rgb = ${crust === 'floor' ? 'mix(base, c, smoothstep(0.15, 0.6, vReef))' : 'c'};
        }` : '#include <emissivemap_fragment>')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float cs = caustic(vCW.xz * 0.55 + vCW.y * 0.2, uTime) + 0.6 * caustic(vCW.xz * 1.3 + 7.0, uTime * 1.3);
        float depthK = exp(vCW.y * 0.09); // fainter deeper down
        totalEmissiveRadiance += vec3(0.5, 0.8, 0.7) * cs * 0.32 * depthK * max(normal.y, 0.0);`)
  }
  material.customProgramCacheKey = () => 'caustics-' + key
  return material
}

export function buildOcean(app, clear = []) {
  const { scene, renderer, rig, camera } = app
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  scene.background = WATER.clone().multiplyScalar(0.85)
  scene.fog = new THREE.FogExp2(WATER.getHex(), FOG_DENSITY)
  const uTime = { value: 0 }
  const updaters = []

  // ---- light ----
  const sun = new THREE.DirectionalLight(0xd8f4ea, 2.4)
  sun.position.copy(SUN_DIR).multiplyScalar(50)
  scene.add(sun)
  scene.add(new THREE.HemisphereLight(0x9fe2e8, 0x14262a, 0.8))

  // ---- water all around you: brighter above, darker below ----
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(300, 32, 16),
    new THREE.ShaderMaterial({
      uniforms: { uWater: { value: WATER } },
      vertexShader: `varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uWater; varying vec3 vD; ${WATER_GRADIENT}
      void main(){ float y = normalize(vD).y;
        vec3 c = waterTint(uWater, y); // exactly the colour of the fog in that direction
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    }),
  )
  dome.renderOrder = -10
  scene.add(dome)

  // ---- the surface seen from below ----
  const surfMat = new THREE.ShaderMaterial({
    uniforms: { uTime, uWater: { value: WATER }, uDens: { value: FOG_DENSITY } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform float uTime; uniform vec3 uWater; uniform float uDens; varying vec3 vW;
      ${WATER_GRADIENT}
      float wave(vec2 p){ return sin(dot(p, vec2(0.83, 0.56)) * 0.9 + uTime * 1.1) * 0.5 + sin(dot(p, vec2(-0.31, 0.95)) * 1.37 - uTime * 0.8) * 0.4 + sin(dot(p, vec2(0.97, -0.24)) * 2.31 + uTime * 1.7) * 0.25 + sin(dot(p, vec2(-0.66, -0.75)) * 3.73 - uTime * 2.1) * 0.15 + sin(dot(p, vec2(0.12, -0.99)) * 5.9 + uTime * 2.6) * 0.07; }
      void main(){
        vec3 d = vW - cameraPosition; float dist = length(d); d /= dist;
        vec2 p = vW.xz;
        vec2 g = vec2(wave(p + vec2(0.05, 0.0)) - wave(p - vec2(0.05, 0.0)), wave(p + vec2(0.0, 0.05)) - wave(p - vec2(0.0, 0.05))) * 4.0;
        float up = clamp(d.y + dot(g, d.xz) * 0.12, 0.0, 1.0);
        // Snell's window: looking steeply up you see the bright sky; at a shallow angle the surface acts like a mirror
        float window = smoothstep(0.62, 0.86, up) * (0.75 + 0.25 * sin(wave(p * 0.6) * 2.0));
        float ripple = 0.5 + 0.5 * sin(wave(p * 2.3) * 2.5 + wave(p * 5.1));
        vec3 sky = mix(vec3(0.35, 0.62, 0.68), vec3(0.66, 0.86, 0.86), ripple) * 0.75;
        vec3 mirror = uWater * mix(0.7, 1.05, ripple);
        vec3 col = mix(mirror, sky, window);
        col += vec3(1.0, 0.98, 0.9) * pow(max(up, 0.0), 60.0) * 0.9 * ripple; // the Sun wobbling through the waves
        float fogF = 1.0 - exp(-pow(dist * uDens * 0.7, 2.0));
        gl_FragColor = vec4(mix(col, waterTint(uWater, d.y), fogF), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    side: THREE.DoubleSide, fog: false, depthWrite: false,
  })
  const surface = new THREE.Mesh(new THREE.PlaneGeometry(600, 600, 1, 1), surfMat)
  surface.renderOrder = -5 // nothing is above the surface, so it never needs to hide anything
  surface.rotation.x = Math.PI / 2
  scene.add(surface)

  // ---- seafloor ----
  const W = 360, D = 180, SX = 320, SZ = 160
  const floorGeo = new THREE.PlaneGeometry(W, D, SX, SZ)
  floorGeo.rotateX(-Math.PI / 2)
  floorGeo.translate(70, 0, 0)
  const fp = floorGeo.attributes.position
  const colors = new Float32Array(fp.count * 3)
  const sand = new THREE.Color(0x938a6e), sand2 = new THREE.Color(0x7d765e), rock = new THREE.Color(0x353b35), turf = new THREE.Color(0x4a5532), pink = new THREE.Color(0x8e5562)
  const c = new THREE.Color()
  for (let i = 0; i < fp.count; i++) {
    const x = fp.getX(i), z = fp.getZ(i)
    fp.setY(i, floorY(x, z))
    const r = reefiness(x, z)
    c.copy(sand).lerp(sand2, fbm(x * 0.3, z * 0.3, 3))
    const rc = rock.clone().lerp(turf, fbm(x * 0.5 + 9, z * 0.5, 3)).lerp(pink, Math.max(0, fbm(x * 0.9, z * 0.9 + 4, 3) - 0.55) * 1.8)
    c.lerp(rc, Math.min(1, r * 1.6))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  floorGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const reefAttr = new Float32Array(fp.count)
  for (let i = 0; i < fp.count; i++) reefAttr[i] = Math.min(1, reefiness(fp.getX(i), fp.getZ(i)) * 1.8)
  floorGeo.setAttribute('aReef', new THREE.BufferAttribute(reefAttr, 1))
  floorGeo.computeVertexNormals()
  const floorMat = withCaustics(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }), uTime, 'floor', 'floor')
  scene.add(new THREE.Mesh(floorGeo, floorMat))

  // ---- boulders on the reef ----
  {
    let g = new THREE.IcosahedronGeometry(1, 3)
    g.deleteAttribute('normal')
    g.deleteAttribute('uv')
    g = mergeVertices(g)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i)
      v.multiplyScalar(1 + 0.25 * Math.sin(v.x * 3.1) * Math.cos(v.z * 2.7) + 0.12 * Math.sin(v.y * 7) + 0.05 * Math.sin(v.x * 13 + v.z * 11))
      p.setXYZ(i, v.x * 1.2, v.y * 0.75, v.z)
    }
    g.computeVertexNormals()
    const N = 260
    const mat = withCaustics(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: false }), uTime, 'rock', true)
    const rocks = new THREE.InstancedMesh(g, mat, N)
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), v = new THREE.Vector3()
    let n = 0, tries = 0
    while (n < N && tries++ < 20000) {
      const x = -10 + Math.random() * 180, z = (Math.random() - 0.5) * 90
      if (reefiness(x, z) < 0.35) continue
      const size = 0.4 + Math.pow(Math.random(), 2.5) * 2.4
      if (clear.some((c) => (x - c.x) ** 2 + (z - c.z) ** 2 < (c.r + size) ** 2)) continue // keep your view open
      v.set(x, floorY(x, z) + size * 0.25, z)
      e.set((Math.random() - 0.5) * 0.4, Math.random() * 6, (Math.random() - 0.5) * 0.4)
      q.setFromEuler(e)
      s.set(size, size * (0.6 + Math.random() * 0.5), size * (0.8 + Math.random() * 0.4))
      m.compose(v, q, s)
      rocks.setMatrixAt(n, m)
      rocks.setColorAt(n, new THREE.Color().setHSL(0.2 + Math.random() * 0.15, 0.12, 0.13 + Math.random() * 0.08))
      n++
    }
    rocks.count = n
    scene.add(rocks)
  }

  // ---- shafts of sunlight ----
  {
    const tex = (() => {
      const cv = document.createElement('canvas')
      cv.width = 64
      cv.height = 256
      const ctx = cv.getContext('2d')
      const g = ctx.createLinearGradient(0, 0, 0, 256)
      g.addColorStop(0, 'rgba(255,255,255,0.9)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 256)
      const id = ctx.getImageData(0, 0, 64, 256)
      const streak = Array.from({ length: 64 }, () => 0.55 + Math.random() * 0.45)
      for (let y = 0; y < 256; y++) for (let x = 0; x < 64; x++) {
        const k = Math.sin((x / 63) * Math.PI)
        id.data[(y * 64 + x) * 4 + 3] *= k * k * streak[x] // fine streaks inside each shaft, like dust in sunlight
      }
      ctx.putImageData(id, 0, 0)
      return new THREE.CanvasTexture(cv)
    })()
    const shafts = []
    const geo = new THREE.PlaneGeometry(1, 1)
    geo.translate(0, -0.5, 0)
    for (let i = 0; i < 52; i++) {
      const mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xd6fff4, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })
      const s = new THREE.Mesh(geo, mat)
      s.userData = { ox: (Math.random() - 0.5) * 50, oz: (Math.random() - 0.5) * 50, w: 0.3 + Math.pow(Math.random(), 2) * 3.2, len: 18 + Math.random() * 16, ph: Math.random() * 10 }
      s.scale.set(s.userData.w, s.userData.len, 1)
      scene.add(s)
      shafts.push(s)
    }
    const head = new THREE.Vector3(), n = new THREE.Vector3(), r = new THREE.Vector3(), mtx = new THREE.Matrix4()
    updaters.push((dt, t) => {
      camera.getWorldPosition(head)
      for (const s of shafts) {
        const u = s.userData
        // fixed in the water, but tiled every 50 m so there are always some around you
        s.position.set(u.ox + 50 * Math.round((head.x - u.ox) / 50), 0, u.oz + 50 * Math.round((head.z - u.oz) / 50))
        // hang from the surface, leaning towards the Sun, and turn to face you around that line
        n.copy(head).sub(s.position).addScaledVector(SUN_DIR, -n.copy(head).sub(s.position).dot(SUN_DIR)).normalize()
        r.crossVectors(SUN_DIR, n).normalize()
        mtx.makeBasis(r, SUN_DIR, n)
        s.quaternion.setFromRotationMatrix(mtx)
        // shafts are brightest near the surface and when you look towards the light
        const look = Math.max(0, n.dot(SUN_DIR) * -1 + 0.4)
        s.material.opacity = (0.045 + 0.09 * (0.5 + 0.5 * Math.sin(t * 0.6 + u.ph)) * (0.5 + 0.5 * Math.sin(t * 1.7 + u.ph * 2))) * (0.7 + look)
      }
    })
  }

  // ---- the Sun's glow seen through the surface ----
  {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(255,255,240,1)')
    g.addColorStop(0.12, 'rgba(230,255,240,0.75)')
    g.addColorStop(0.4, 'rgba(150,230,220,0.22)')
    g.addColorStop(1, 'rgba(100,200,200,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true, opacity: 0.9 }))
    glow.scale.setScalar(26)
    scene.add(glow)
    updaters.push((dt, t) => {
      glow.position.copy(rig.position).addScaledVector(SUN_DIR, 30)
      glow.position.y = -0.3
      glow.material.opacity = 0.75 + 0.15 * Math.sin(t * 1.3) * Math.sin(t * 0.7)
    })
  }

  // ---- bubbles: your breath rising past you now and then ----
  {
    const N = 60
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    ctx.strokeStyle = 'rgba(230,255,255,0.9)'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.arc(32, 32, 24, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.beginPath(); ctx.arc(24, 22, 6, 0, Math.PI * 2); ctx.fill()
    const mat = new THREE.PointsMaterial({ map: new THREE.CanvasTexture(c), size: 0.035, transparent: true, depthWrite: false, opacity: 0.85 })
    const bubbles = new THREE.Points(g, mat)
    bubbles.frustumCulled = false
    scene.add(bubbles)
    let next = 3, alive = 0
    updaters.push((dt, t) => {
      next -= dt
      if (next < 0) {
        next = 6 + Math.random() * 6
        const base = rig.position.clone().add(new THREE.Vector3(0.25, 1.2, 0.35))
        for (let i = 0; i < N; i++) {
          pos.set([base.x + (Math.random() - 0.5) * 0.15, base.y - Math.random() * 0.4, base.z + (Math.random() - 0.5) * 0.15], i * 3)
          vel[i] = 0.5 + Math.random() * 0.6
        }
        alive = 7
      }
      if (alive <= 0) { bubbles.visible = false; return }
      alive -= dt
      bubbles.visible = true
      for (let i = 0; i < N; i++) {
        pos[i * 3] += Math.sin(t * 6 + i) * 0.004
        pos[i * 3 + 1] += vel[i] * dt
      }
      g.attributes.position.needsUpdate = true
    })
  }

  // ---- marine snow (tiny drifting particles that show the water is moving) ----
  {
    const N = 3500
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) pos.set([(Math.random() - 0.5) * 40, -Math.random() * 14, (Math.random() - 0.5) * 40], i * 3)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime, uHead: { value: new THREE.Vector3() } },
      vertexShader: `uniform float uTime; uniform vec3 uHead; varying float vA;
        void main(){
          vec3 p = position;
          p.x += uTime * 0.12 + sin(uTime * 0.3 + position.z) * 0.3;
          p.y += sin(uTime * 0.25 + position.x * 0.7) * 0.4;
          p.xz = mod(p.xz - uHead.xz + 20.0, 40.0) - 20.0 + uHead.xz;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float d = -mv.z;
          vA = smoothstep(18.0, 2.0, d) * 0.55;
          gl_PointSize = clamp(28.0 / d, 1.0, 3.5);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.85, 0.95, 0.9) * vA * smoothstep(0.5, 0.0, d), 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const snow = new THREE.Points(g, mat)
    snow.frustumCulled = false
    scene.add(snow)
    updaters.push(() => camera.getWorldPosition(mat.uniforms.uHead.value))
  }

  // ---- your dive pod: a ring of light at your feet ----
  {
    const pod = new THREE.Group()
    const glass = new THREE.Mesh(new THREE.CircleGeometry(1.1, 64), new THREE.MeshStandardMaterial({ color: 0x9fe8e0, transparent: true, opacity: 0.12, roughness: 0.2, depthWrite: false }))
    glass.rotation.x = -Math.PI / 2
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.018, 10, 96), new THREE.MeshBasicMaterial({ color: 0x5eead4, toneMapped: false, fog: false }))
    rim.rotation.x = Math.PI / 2
    pod.add(glass, rim)
    rig.add(pod)
    updaters.push((dt, t) => rim.material.color.setHSL(0.47, 0.75, 0.55 + 0.08 * Math.sin(t * 1.4)))
  }

  updaters.push((dt, t) => {
    uTime.value = t
    dome.position.copy(rig.position)
  })

  return {
    uTime,
    update(dt, t) { for (const u of updaters) u(dt, t) },
  }
}
