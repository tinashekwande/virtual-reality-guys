import * as THREE from 'three'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

// Building blocks for the animals: streamlined bodies made by spinning a profile, thin fins, vertex colours
// painted from the body position, and a shader that makes them swim (side-to-side or up-and-down),
// and lets a shyshark curl up into a ring.

/** Spun body along +x (nose at +x). profile: [[t, r]] with t from tail (0) to nose (1). */
export function body(L, profile, { sy = 1, sz = 1, segs = 40, radial = 18 } = {}) {
  const pts = []
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    let r = profile[0][1]
    for (let k = 1; k < profile.length; k++) {
      if (t <= profile[k][0]) {
        const [t0, r0] = profile[k - 1], [t1, r1] = profile[k]
        const u = (t - t0) / (t1 - t0)
        r = r0 + (r1 - r0) * (u * u * (3 - 2 * u))
        break
      }
    }
    pts.push(new THREE.Vector2(Math.max(r * L, 0.0005), t * L - L / 2))
  }
  let g = new THREE.LatheGeometry(pts, radial)
  g.rotateZ(-Math.PI / 2)
  g.scale(1, sy, sz)
  g.deleteAttribute('uv')
  g = mergeVertices(g)
  g.computeVertexNormals()
  return g
}

/** A flat fin from a 2D outline (x along the body, y outwards), placed and turned. */
export function fin(outline, { at = [0, 0, 0], rot = [0, 0, 0], thick = 0.004 } = {}) {
  const sh = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)))
  let g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false, curveSegments: 6 })
  g.translate(0, 0, -thick / 2)
  g.rotateX(rot[0]); g.rotateY(rot[1]); g.rotateZ(rot[2])
  g.translate(...at)
  g.deleteAttribute('uv')
  return g
}

/** Merge parts and paint vertex colours with fn(x, y, z) -> [r, g, b] (0..1). */
export function paint(parts, fn) {
  const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false)
  const pos = g.attributes.position
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) col.set(fn(pos.getX(i), pos.getY(i), pos.getZ(i)), i * 3)
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}

/**
 * Swimming material. Uniforms (per animal): uPhase (advance it to swim), uAmp (how much the tail swings,
 * as a share of body length), uK (how many waves along the body), uAxis (0 = side to side like a fish,
 * 1 = up and down like a seal), uCurl (0..1, curl into a ring like a scared shyshark).
 */
export function swimMaterial(L, opts = {}) {
  const u = {
    uPhase: { value: 0 }, uAmp: { value: opts.amp ?? 0.06 }, uK: { value: opts.k ?? 3.0 }, uAxis: { value: opts.axis ?? 0 },
    uL: { value: L }, uCurl: { value: 0 },
  }
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: opts.roughness ?? 0.55, metalness: 0, ...(opts.mat || {}) })
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uPhase; uniform float uAmp; uniform float uK; uniform float uAxis; uniform float uL; uniform float uCurl;
        ${opts.instanced ? 'attribute float aPhase;' : ''}
        vec3 bendIt(vec3 p, inout vec3 n) {
          float s = clamp((p.x + uL * 0.5) / uL, 0.0, 1.0); // 0 tail .. 1 nose
          float w = pow(1.0 - s, 1.5);
          float ph = uPhase ${opts.instanced ? '+ aPhase' : ''};
          float off = sin(ph - s * uK) * uAmp * w * uL;
          if (uAxis < 0.5) p.z += off; else p.y += off;
          if (uCurl > 0.001) {
            float R = uL / (6.2832 * 0.9 * uCurl);
            float a = (uL * 0.5 - p.x) / R;
            vec3 N = vec3(sin(a), 0.0, cos(a));
            vec3 P = vec3(uL * 0.5 - R * sin(a), 0.0, R - R * cos(a));
            p = P + vec3(0.0, p.y, 0.0) + N * p.z;
            float c = cos(a), sn = sin(a);
            n = vec3(n.x * c + n.z * sn, n.y, -n.x * sn + n.z * c);
          }
          return p;
        }`)
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvec3 bentN = objectNormal;\nvec3 bentP = bendIt(position, bentN);\nobjectNormal = bentN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = bentP;')
  }
  mat.customProgramCacheKey = () => 'swim' + (opts.instanced ? 'I' : '')
  mat.userData.u = u
  return mat
}

// ---------- tiny colour helpers ----------
export const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
export const sstep = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t) }
export function n3(x, y, z) { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s) }
export function vnoise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = x - xi, yf = y - yi, zf = z - zi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf)
  const L = (a, b, t) => a + (b - a) * t
  return L(L(L(n3(xi, yi, zi), n3(xi + 1, yi, zi), u), L(n3(xi, yi + 1, zi), n3(xi + 1, yi + 1, zi), u), v),
    L(L(n3(xi, yi, zi + 1), n3(xi + 1, yi, zi + 1), u), L(n3(xi, yi + 1, zi + 1), n3(xi + 1, yi + 1, zi + 1), u), v), w)
}
