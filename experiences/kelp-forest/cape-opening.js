import * as THREE from 'three'

// The opening: hovering in a helicopter off Mouille Point, looking at Table Mountain, Lion's Head, the stadium
// and the Waterfront, then flying down the Atlantic seaboard and diving into the sea off Sea Point.
// Units are metres; x = east, y = up, z = south; the origin is Mouille Point.
// Ground data comes from tools/gen-cape-close.mjs (close-up) and tools/gen-textures.mjs (wider Cape).

const TEX = new URL('../textures/', location.href).href
const SUN = new THREE.Vector3(-0.26, 0.788, -0.558).normalize() // matches the shadows baked into the ground
const O = { lon: 18.405, lat: -33.9 }
const MX = 92300, MZ = 110900
const toX = (lon) => (lon - O.lon) * MX
const toZ = (lat) => -(lat - O.lat) * MZ

// sky and haze, shared by every material in this scene (linear colours)
const SKY_GLSL = /* glsl */ `
  uniform vec3 uSunDir;
  vec3 skyColor(vec3 d) {
    float h = max(d.y, 0.0);
    vec3 zenith = vec3(0.09, 0.25, 0.62), horizon = vec3(0.52, 0.67, 0.84);
    vec3 c = mix(horizon, zenith, pow(h, 0.55));
    float s = max(dot(d, uSunDir), 0.0);
    c += vec3(1.0, 0.85, 0.6) * (pow(s, 8.0) * 0.25 + pow(s, 64.0) * 0.5);
    if (d.y < 0.0) c = mix(horizon, horizon * 0.8, min(1.0, -d.y * 4.0));
    return c;
  }
  vec3 haze(vec3 col, vec3 wpos) {
    vec3 v = wpos - cameraPosition;
    float d = length(v);
    vec3 dir = v / d;
    // thicker near sea level, thinner looking up
    float dens = 0.00005 * exp(-max(min(wpos.y, cameraPosition.y), 0.0) / 900.0);
    float f = 1.0 - exp(-d * dens);
    return mix(col, skyColor(vec3(dir.x, max(dir.y, 0.02), dir.z)) * 0.95, f);
  }
`
const uSunDir = { value: SUN }

/** Adds aerial haze to a built-in material. */
function hazy(material, key, extra = {}) {
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uSunDir = uSunDir
    Object.assign(sh.uniforms, extra.uniforms || {})
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHW;' + (extra.vDecl || ''))
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n{ vec4 hw = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\n hw = instanceMatrix * hw;\n#endif\n vHW = (modelMatrix * hw).xyz; }' + (extra.vMain || ''))
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHW;\n' + SKY_GLSL + (extra.fDecl || ''))
      .replace('#include <map_fragment>', '#include <map_fragment>\n' + (extra.fMap || ''))
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + (extra.fNormal || ''))
      .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb = haze(gl_FragColor.rgb, vHW);\n#include <tonemapping_fragment>')
  }
  material.customProgramCacheKey = () => 'cape-' + key
  return material
}

async function bin(url, Type) {
  const r = await fetch(url)
  return new Type(await r.arrayBuffer())
}
function texture(url, srgb = true) {
  const t = new THREE.TextureLoader().load(url)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

// ---------------------------------------------------------------- ground
async function buildGround(group, renderer) {
  const meta = await (await fetch(TEX + 'cape-close/meta.json')).json()
  const [GW, GH] = meta.grid
  const hq = await bin(TEX + 'cape-close/h.bin', Int16Array)
  const pos = new Float32Array(GW * GH * 3), uv = new Float32Array(GW * GH * 2)
  for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) {
    const i = gy * GW + gx
    pos[i * 3] = meta.x0 + (gx / (GW - 1)) * (meta.x1 - meta.x0)
    pos[i * 3 + 1] = hq[i] * meta.heightScale
    pos[i * 3 + 2] = meta.z0 + (gy / (GH - 1)) * (meta.z1 - meta.z0)
    uv[i * 2] = gx / (GW - 1)
    uv[i * 2 + 1] = 1 - gy / (GH - 1)
  }
  const idx = new Uint32Array((GW - 1) * (GH - 1) * 6)
  let n = 0
  for (let gy = 0; gy < GH - 1; gy++) for (let gx = 0; gx < GW - 1; gx++) {
    const a = gy * GW + gx, b = a + 1, c = a + GW, d = c + 1
    idx.set([a, c, b, b, c, d], n)
    n += 6
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setIndex(new THREE.BufferAttribute(idx, 1))
  g.computeVertexNormals()
  const mat = hazy(new THREE.MeshStandardMaterial({
    map: texture(TEX + 'cape-close/color.jpg'),
    normalMap: texture(TEX + 'cape-close/normal.jpg', false),
    normalMapType: THREE.ObjectSpaceNormalMap,
    roughness: 0.95, metalness: 0,
  }), 'ground', {
    // fine detail so the ground still has texture when you are low over it
    fDecl: `float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(gh(i), gh(i+vec2(1,0)), f.x), mix(gh(i+vec2(0,1)), gh(i+vec2(1,1)), f.x), f.y); }`,
    fMap: `{ float dd = length(vHW - cameraPosition); float k = 1.0 - smoothstep(300.0, 1500.0, dd);
      float nn = gn(vHW.xz * 0.35) * 0.5 + gn(vHW.xz * 1.3) * 0.3 + gn(vHW.xz * 5.0) * 0.2;
      diffuseColor.rgb *= mix(1.0, 0.75 + 0.5 * nn, k); }`,
  })
  const ground = new THREE.Mesh(g, mat)
  group.add(ground)

  // heights for placing things (bilinear in the mesh grid)
  const heightAt = (x, z) => {
    const fx = Math.min(GW - 1.001, Math.max(0, ((x - meta.x0) / (meta.x1 - meta.x0)) * (GW - 1)))
    const fz = Math.min(GH - 1.001, Math.max(0, ((z - meta.z0) / (meta.z1 - meta.z0)) * (GH - 1)))
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * GW + i
    const h = (a) => hq[a] * meta.heightScale
    return (h(k) * (1 - u) + h(k + 1) * u) * (1 - v) + (h(k + GW) * (1 - u) + h(k + GW + 1) * u) * v
  }

  // the wider Cape (Robben Island, Table Bay, the Cape Flats and the Hottentots Holland on the horizon)
  {
    const C = { lon0: 17.8, lon1: 19.4, lat0: -34.45, lat1: -33.5 }
    const FW = 321, FH = 241
    const fh = await bin(TEX + 'cape/detail_h.bin', Int16Array)
    const p2 = new Float32Array(FW * FH * 3), uv2 = new Float32Array(FW * FH * 2)
    for (let gy = 0; gy < FH; gy++) for (let gx = 0; gx < FW; gx++) {
      const i = gy * FW + gx
      const u = gx / (FW - 1), v = 1 - gy / (FH - 1)
      const x = toX(C.lon0 + u * (C.lon1 - C.lon0)), z = toZ(C.lat0 + v * (C.lat1 - C.lat0))
      const h = fh[i] > 0 ? fh[i] + 6 : -40
      const curve = (x * x + z * z) / (2 * 6371000) // the Earth curving away
      p2.set([x, h - curve, z], i * 3)
      uv2.set([u, v], i * 2)
    }
    const g2 = new THREE.PlaneGeometry(1, 1, FW - 1, FH - 1)
    g2.setAttribute('position', new THREE.BufferAttribute(p2, 3))
    g2.setAttribute('uv', new THREE.BufferAttribute(uv2, 2))
    g2.computeVertexNormals()
    const hole = new THREE.Vector4(meta.x0 + 150, meta.z0 + 150, meta.x1 - 150, meta.z1 - 150)
    const m2 = hazy(new THREE.MeshStandardMaterial({ map: texture(TEX + 'cape/detail.jpg'), roughness: 1 }), 'far', {
      uniforms: { uHole: { value: hole } },
      fDecl: 'uniform vec4 uHole;',
      fMap: 'if (vHW.x > uHole.x && vHW.x < uHole.z && vHW.z > uHole.y && vHW.z < uHole.w) discard;',
    })
    const far = new THREE.Mesh(g2, m2)
    far.position.y = -2
    group.add(far)
  }
  return { meta, heightAt }
}

// ---------------------------------------------------------------- sea
function buildSea(group, meta) {
  const shore = texture(TEX + 'cape-close/shore.jpg', false)
  shore.minFilter = THREE.LinearFilter
  const uTime = { value: 0 }
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime, uShore: { value: shore }, uB: { value: new THREE.Vector4(meta.x0, meta.z0, meta.x1, meta.z1) }, uSunDir },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform sampler2D uShore; uniform vec4 uB; varying vec3 vW;
      ${SKY_GLSL}
      float hsh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hsh(i), hsh(i+vec2(1,0)), f.x), mix(hsh(i+vec2(0,1)), hsh(i+vec2(1,1)), f.x), f.y); }
      // slope of the sea surface: a spectrum of wind waves from the south-west, faded out where they would shimmer
      vec2 ng(vec2 p){ float e = 0.2; return vec2(vn(p + vec2(e, 0.0)) - vn(p - vec2(e, 0.0)), vn(p + vec2(0.0, e)) - vn(p - vec2(0.0, e))) / (2.0 * e); }
      // slope of the sea surface: layers of wind-blown chop from the south-east, stretched across the wind,
      // each layer fading out with distance before it can shimmer
      vec2 waves(vec2 p, float dist) {
        vec2 g = vec2(0.0);
        float wl = 90.0, s = 0.16;
        mat2 R = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 7; i++) {
          vec2 q = R * p / wl;
          q.x *= 0.45;
          float fade = 1.0 - smoothstep(wl * 10.0, wl * 45.0, dist);
          vec2 d = ng(q + vec2(uTime * 0.9 / sqrt(wl), float(i) * 7.3));
          d.x *= 0.45;
          g += (d * R) * s * fade;
          wl *= 0.52; s *= 0.85;
          R = R * mat2(0.94, -0.34, 0.34, 0.94);
        }
        return g;
      }
      void main(){
        vec3 v = vW - cameraPosition; float dist = length(v); vec3 vd = v / dist;
        // how far from the coast (metres; negative is land)
        float sd = 400.0;
        vec2 suv = (vW.xz - uB.xy) / (uB.zw - uB.xy);
        if (suv.x > 0.0 && suv.x < 1.0 && suv.y > 0.0 && suv.y < 1.0) sd = (texture2D(uShore, vec2(suv.x, 1.0 - suv.y)).r * 255.0 - 128.0) * 6.0;
        if (sd < -1.0) discard;
        vec2 g = waves(vW.xz, dist);
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 r = reflect(vd, n); r.y = abs(r.y);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(-vd, n), 0.0), 5.0);
        vec3 deep = vec3(0.008, 0.05, 0.11), mid = vec3(0.015, 0.1, 0.15), shallow = vec3(0.05, 0.28, 0.3);
        vec3 body = mix(mid, deep, smoothstep(150.0, 1500.0, sd));
        body = mix(shallow, body, smoothstep(0.0, 120.0, sd + vn(vW.xz * 0.02) * 60.0));
        body *= 0.85 + 0.3 * max(dot(n, uSunDir), 0.0);
        vec3 col = mix(body, skyColor(r) * 0.9, fres);
        col += vec3(1.0, 0.93, 0.8) * pow(max(dot(r, uSunDir), 0.0), 400.0) * 3.0; // sun glitter
        // white water: surf along the shore and the odd whitecap
        float surf = (1.0 - smoothstep(4.0, 40.0, sd)) * smoothstep(0.35, 0.75, vn(vW.xz * 0.12 + vec2(uTime * 0.3, 0.0)) * 0.6 + 0.5 * (0.5 + 0.5 * sin(sd * 0.25 - uTime * 1.2)));
        float cap = 0.5 * smoothstep(0.9, 0.95, vn(vW.xz * 0.03 + uTime * 0.03)) * smoothstep(0.55, 0.8, vn(vW.xz * 0.25 - uTime * 0.2)) * (1.0 - smoothstep(600.0, 3000.0, dist));
        col = mix(col, vec3(0.85, 0.88, 0.88), clamp(surf * 0.85 + cap * 0.6, 0.0, 1.0));
        col = haze(col, vW);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000, 1, 1), mat)
  sea.rotation.x = -Math.PI / 2
  group.add(sea)
  return { uTime }
}

// ---------------------------------------------------------------- sky and clouds
function buildSky(group) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uSunDir },
    vertexShader: `varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
    fragmentShader: `varying vec3 vD; ${SKY_GLSL}
      void main(){ vec3 d = normalize(vD); vec3 c = skyColor(d);
        c += vec3(1.0, 0.95, 0.85) * smoothstep(0.9996, 0.9999, dot(d, uSunDir)) * 20.0;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 16), mat)
  sky.frustumCulled = false
  sky.renderOrder = -10
  sky.onBeforeRender = (r, s, cam) => sky.position.copy(cam.getWorldPosition(new THREE.Vector3()))
  group.add(sky)
}
function cloudTexture(seed) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 70
    const x = 128 + Math.cos(a) * r * 1.3, y = 140 + Math.sin(a) * r * 0.55 - rnd() * 20
    const rad = 26 + rnd() * 40
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad)
    const shade = Math.round(255 - Math.max(0, y - 120) * 0.9) // greyer underneath
    g.addColorStop(0, `rgba(${shade},${shade},${Math.min(255, shade + 6)},0.32)`)
    g.addColorStop(1, `rgba(${shade},${shade},${shade},0)`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
function buildClouds(group) {
  const texs = [1, 7, 13, 29].map(cloudTexture)
  const clouds = []
  const add = (x, y, z, w, h, opacity, drift) => {
    const m = new THREE.SpriteMaterial({ map: texs[clouds.length % texs.length], transparent: true, depthWrite: false, opacity, fog: false })
    const s = new THREE.Sprite(m)
    s.position.set(x, y, z)
    s.scale.set(w, h, 1)
    group.add(s)
    clouds.push({ s, x0: x, drift })
  }
  // the "tablecloth": cloud pouring over the top of Table Mountain
  const tm = { x: toX(18.406), z: toZ(-33.9575) }
  const ax = Math.cos(0.26), az = -Math.sin(0.26) // along the front of the table (about 15 degrees)
  for (let i = 0; i < 34; i++) {
    const t = (i / 33 - 0.5) * 3400
    const spill = Math.random()
    add(tm.x + ax * t + (Math.random() - 0.5) * 150, 1090 + Math.random() * 90 - spill * 120, tm.z + az * t + 250 - spill * 260, 600 + Math.random() * 500, 260 + Math.random() * 160, 0.85, 4)
  }
  // fair-weather clouds over the land and far out to sea
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, r = 9000 + Math.random() * 30000
    add(Math.cos(a) * r, 1600 + Math.random() * 1400, Math.sin(a) * r, 2500 + Math.random() * 3500, 900 + Math.random() * 900, 0.75, 8)
  }
  return (t) => { for (const c of clouds) c.s.position.x = c.x0 + Math.sin(t * 0.02 + c.x0) * c.drift * 10 }
}

// ---------------------------------------------------------------- city
const WALLS = [0xe8e4dc, 0xcfc3ad, 0xbdb5a8, 0xa89e8c, 0xeeece6, 0x9a958c, 0xd6c8b0, 0x8c867c]
async function buildCity(group, meta) {
  const data = await bin(TEX + 'cape-close/buildings.bin', Float32Array)
  const N = data.length / 7
  const box = new THREE.BoxGeometry(1, 1, 1)
  box.translate(0, 0.5, 0)
  const mat = hazy(new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0 }), 'city', {
    vDecl: 'varying vec3 vBox; varying vec3 vSize; varying vec3 vObjN; varying float vSeed;',
    vMain: `
      vSize = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
      vBox = position * vSize; vObjN = normal; vSeed = fract(instanceMatrix[3].x * 0.137 + instanceMatrix[3].z * 0.071);`,
    fDecl: 'varying vec3 vBox; varying vec3 vSize; varying vec3 vObjN; varying float vSeed;',
    fMap: `
      if (vObjN.y > 0.5) {
        // roofs: grey concrete on tall buildings, tiles and sheeting on houses
        vec3 roofs[4]; roofs[0] = vec3(0.32, 0.12, 0.07); roofs[1] = vec3(0.25, 0.25, 0.24); roofs[2] = vec3(0.07, 0.08, 0.09); roofs[3] = vec3(0.55, 0.54, 0.5);
        diffuseColor.rgb = vSize.y > 14.0 ? vec3(0.42, 0.41, 0.39) : roofs[int(vSeed * 3.99)];
      } else {
        float s = abs(vObjN.x) > 0.5 ? vBox.z : vBox.x;
        float fl = fract(vBox.y / 3.1), col = fract(s / (vSize.y > 14.0 ? 2.6 : 4.0));
        float win = step(0.3, fl) * step(fl, 0.82) * step(0.18, col) * step(col, 0.82) * step(1.5, vBox.y) * step(vBox.y, vSize.y - 1.0);
        float band = step(0.86, fl) * step(14.0, vSize.y) * 0.25; // floor slabs and balconies
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.8, band);
        float near = 1.0 - smoothstep(600.0, 2500.0, length(vHW - cameraPosition)); // far away, windows blend into the wall
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05, 0.07, 0.09), win * 0.8 * near);
        diffuseColor.rgb *= mix(1.0, 0.8, 1.0 - near);
        diffuseColor.rgb *= 0.7 + 0.3 * smoothstep(0.0, 6.0, vBox.y); // darker at street level
      }`,
  })
  const im = new THREE.InstancedMesh(box, mat, N)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2 - meta.angle)
  const p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color()
  for (let i = 0; i < N; i++) {
    const o = i * 7
    p.set(data[o], data[o + 1], data[o + 2])
    s.set(data[o + 3], data[o + 4], data[o + 5])
    m.compose(p, q, s)
    im.setMatrixAt(i, m)
    im.setColorAt(i, c.setHex(WALLS[data[o + 6] | 0]))
  }
  im.renderOrder = -2 // drawn before the ground, so where depth is ambiguous far away the ground wins
  group.add(im)
}

// Cape Town Stadium: a white, woven, saddle-shaped bowl with a glass roof ring
function buildStadium(group, meta, heightAt) {
  const S = meta.stadium
  const g = new THREE.Group()
  const prof = [[0.98, 0], [1.03, 8], [1.06, 20], [1.05, 32], [1.0, 42], [0.93, 47], [0.78, 49], [0.6, 46]]
  const lathe = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 96)
  lathe.scale(S.a, 1, S.b)
  // the rim rises and falls like a saddle
  const pa = lathe.attributes.position
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i) / S.a, z = pa.getZ(i) / S.b
    pa.setY(i, pa.getY(i) * (1 + 0.1 * (x * x - z * z)))
  }
  lathe.computeVertexNormals()
  const skin = hazy(new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.45, metalness: 0.1, side: THREE.DoubleSide }), 'stadium', {
    fMap: `{ float a = atan(vHW.z, vHW.x); float w = abs(sin(vHW.y * 0.9 + a * 160.0)) ; diffuseColor.rgb *= 0.86 + 0.14 * smoothstep(0.2, 0.9, w); }`,
  })
  g.add(new THREE.Mesh(lathe, skin))
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(105, 68), hazy(new THREE.MeshStandardMaterial({ color: 0x4f8a34, roughness: 0.9 }), 'pitch'))
  pitch.rotation.x = -Math.PI / 2
  pitch.position.y = 3
  g.add(pitch)
  const stands = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.45, 40, 64, 1, true).scale(S.a, 1, S.b).translate(0, 22, 0), hazy(new THREE.MeshStandardMaterial({ color: 0x6b6f78, roughness: 0.8, side: THREE.BackSide }), 'stands'))
  g.add(stands)
  g.position.set(S.x, heightAt(S.x, S.z) - 1, S.z)
  g.rotation.y = S.ang
  group.add(g)
}
// Green Point lighthouse, red and white
function buildLandmarks(group, heightAt) {
  const lx = toX(18.4002), lz = toZ(-33.9008)
  const c = document.createElement('canvas')
  c.width = 64; c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#f4f2ee'; ctx.fillRect(0, 0, 64, 256)
  ctx.fillStyle = '#b8231d'
  for (let k = -4; k < 8; k++) { ctx.beginPath(); ctx.moveTo(0, k * 48); ctx.lineTo(64, k * 48 + 40); ctx.lineTo(64, k * 48 + 64); ctx.lineTo(0, k * 48 + 24); ctx.fill() }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const tower = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 5).translate(0, 9, 0), hazy(new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }), 'light'))
  tower.position.set(lx, heightAt(lx, lz), lz)
  group.add(tower)
  // container cranes and ships in Table Bay
  const crane = hazy(new THREE.MeshStandardMaterial({ color: 0xb03a22, roughness: 0.6 }), 'crane')
  for (let k = 0; k < 6; k++) {
    const x = toX(18.437 + k * 0.0022), z = toZ(-33.9105 + k * 0.0012)
    const cr = new THREE.Group()
    cr.add(new THREE.Mesh(new THREE.BoxGeometry(3, 45, 3).translate(-10, 22, 0), crane), new THREE.Mesh(new THREE.BoxGeometry(3, 45, 3).translate(10, 22, 0), crane), new THREE.Mesh(new THREE.BoxGeometry(4, 4, 90).translate(0, 46, -20), crane))
    cr.position.set(x, heightAt(x, z), z)
    cr.rotation.y = 0.7
    group.add(cr)
  }
  const hull = hazy(new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.6 }), 'hull')
  const deck = hazy(new THREE.MeshStandardMaterial({ color: 0xe8e6e0, roughness: 0.6 }), 'deck')
  const ships = [[18.44, -33.875, 0.4], [18.47, -33.885, 1.2], [18.415, -33.865, 2.0], [18.375, -33.87, 0.9]]
  for (const [lon, lat, a] of ships) {
    const s = new THREE.Group()
    s.add(new THREE.Mesh(new THREE.BoxGeometry(28, 10, 180).translate(0, 2, 0), hull), new THREE.Mesh(new THREE.BoxGeometry(22, 14, 16).translate(0, 14, -70), deck))
    s.position.set(toX(lon), 0, toZ(lat))
    s.rotation.y = a
    group.add(s)
  }
}

// ---------------------------------------------------------------- labels
const PLACES = [
  ['Table Mountain', 18.403, -33.9625, 1150],
  ["Lion's Head", 18.389, -33.9351, 720],
  ['Signal Hill', 18.394, -33.9225, 400],
  ["Devil's Peak", 18.431, -33.953, 1050],
  ['Cape Town Stadium', 18.4111, -33.9035, 90],
  ['V&A Waterfront', 18.42, -33.904, 70],
  ['Sea Point', 18.384, -33.917, 90],
  ['Robben Island', 18.366, -33.806, 120],
  ['Kelp forest: we dive here!', 18.3726, -33.9258, 60],
]
function label(text) {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 112
  const ctx = c.getContext('2d')
  ctx.font = 'bold 52px system-ui, sans-serif'
  const w = Math.min(500, ctx.measureText(text).width + 56)
  ctx.fillStyle = 'rgba(8,20,32,0.72)'
  ctx.beginPath(); ctx.roundRect((512 - w) / 2, 8, w, 80, 40); ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 50, 460)
  ctx.beginPath(); ctx.moveTo(244, 88); ctx.lineTo(268, 88); ctx.lineTo(256, 108); ctx.fillStyle = 'rgba(8,20,32,0.72)'; ctx.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }))
  s.center.set(0.5, 0)
  s.renderOrder = 50
  return s
}

// ---------------------------------------------------------------- the opening scene
export const HOVER = { position: new THREE.Vector3(-461, 380, -1774), yaw: Math.PI - 0.12 }
// the flight: along Mouille Point and Sea Point, then down to the kelp off Bantry Bay
const FLIGHT = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-461, 380, -1774), new THREE.Vector3(-820, 340, -820), new THREE.Vector3(-1700, 230, 700),
  new THREE.Vector3(-2550, 110, 2000), new THREE.Vector3(-2900, 25, 2650), new THREE.Vector3(-2990, -2, 2860),
], false, 'catmullrom', 0.5)
const FLIGHT_TIME = 34

const shellScale = new Map()
let shellCamera = null
/** Scale the camera-attached shells (fade, vignette) so they sit beyond the near plane. */
function setShells(k) {
  for (const c of shellCamera?.children || []) {
    if (!c.isMesh || c.userData.splash) continue
    if (!shellScale.has(c)) shellScale.set(c, c.scale.x)
    c.scale.setScalar(shellScale.get(c) * k)
  }
}
export function leaveCapeOpening(app) {
  setShells(1)
  app.camera.near = 0.05
  app.camera.far = 2000
  app.camera.updateProjectionMatrix()
}

export function buildCapeOpening(app) {
  shellCamera = app.camera
  const scene = new THREE.Scene()
  const group = new THREE.Group()
  scene.add(group)
  scene.add(new THREE.HemisphereLight(0xb4d0ee, 0x4a4a3c, 0.75))
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.1)
  sun.position.copy(SUN).multiplyScalar(1000)
  scene.add(sun)
  buildSky(group)
  const updateClouds = buildClouds(group)
  let sea = null
  const labels = new THREE.Group()
  scene.add(labels)
  const ready = (async () => {
    const { meta, heightAt } = await buildGround(group, app.renderer)
    sea = buildSea(group, meta)
    await buildCity(group, meta)
    buildStadium(group, meta, heightAt)
    buildLandmarks(group, heightAt)
    for (const [name, lon, lat, y] of PLACES) {
      const s = label(name)
      s.position.set(toX(lon), y, toZ(lat))
      labels.add(s)
    }
  })()

  // splash: the view fills with white water and bubbles as you hit the sea
  const splashMat = new THREE.MeshBasicMaterial({ color: 0xd8f4f2, side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false })
  const splash = new THREE.Mesh(new THREE.SphereGeometry(1.3, 16, 12), splashMat)
  splash.renderOrder = 998
  splash.userData.splash = true
  splash.frustumCulled = false
  app.camera.add(splash)

  let flight = null
  let splashFade = 0
  app.onFrame((dt) => {
    if (splashFade <= 0) return
    splashMat.opacity = Math.max(0, splashMat.opacity - dt / splashFade)
    if (splashMat.opacity === 0) splashFade = 0
  })
  const cam = new THREE.Vector3()
  function update(dt, t) {
    if (sea) sea.uTime.value = t
    updateClouds(t)
    app.camera.getWorldPosition(cam)
    for (const s of labels.children) {
      const d = s.position.distanceTo(cam)
      s.scale.set(d * 0.11, d * 0.024, 1)
    }
    if (flight) {
      flight.t += dt
      const k = Math.min(1, flight.t / FLIGHT_TIME)
      const e = k * k * (3 - 2 * k)
      const p = FLIGHT.getPointAt(e)
      app.rig.position.copy(p)
      // turn smoothly from facing Table Mountain to facing along the coast
      const yawTo = Math.PI - 0.5
      app.rig.rotation.y = HOVER.yaw + (yawTo - HOVER.yaw) * Math.min(1, k * 2.2) ** 2 * (3 - 2 * Math.min(1, k * 2.2))
      labels.visible = k < 0.4
      splashMat.opacity = Math.min(1, Math.max(0, (14 - p.y) / 14))
      if (k >= 1) { const f = flight; flight = null; f.then() }
    } else if (!app.isMoving()) {
      // a gentle hover
      app.rig.position.y = HOVER.position.y + Math.sin(t * 0.6) * 0.6
    }
  }
  return {
    scene,
    ready,
    update,
    enter() {
      app.setScene(scene)
      // Headsets may give a coarse depth buffer, and with a near plane of a few centimetres a city kilometres
      // away turns into a jumble (buildings poking through hills and the sea). Nothing in the helicopter is
      // closer than the menu, so push the near plane out to 1 m, and grow the comfort fade and vignette
      // (which sit just in front of your eyes) so they are not clipped away.
      app.camera.near = 1.0
      app.camera.far = 60000
      setShells(3)
      app.camera.updateProjectionMatrix()
      app.placeNow(HOVER)
      labels.visible = true
      splashMat.opacity = 0
    },
    fly(then) { flight = { t: 0, then } },
    /** testing: jump to part k (0..1) of the flight */
    seek(k) { flight = { t: k * FLIGHT_TIME, then: () => {} } },
    flying: () => !!flight,
    /** after the dive: let the white water clear */
    clearSplash(seconds = 1.6) { splashFade = seconds },
  }
}
