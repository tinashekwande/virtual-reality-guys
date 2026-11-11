import * as THREE from 'three'

// Deep space from the "Beyond the Void" prototype: the Milky Way with its dust lanes and coloured nebulae,
// tens of thousands of twinkling stars in true star colours, and bright "hero" stars with diffraction spikes.
// The nebula shader is heavy, so it is painted once into a texture at start-up (cheap to draw on a headset).
// Shaders: Beyond the Void (Schools Experiences), adapted.

const NEBULA_FRAG = /* glsl */ `
        uniform float uTime;
        uniform float uNebulaIntensity;
        uniform float uMilkyWay;
        uniform float uVRBoost;
        uniform vec3 uGalPole;
        uniform vec3 uGalCenter;
        varying vec2 vUv;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        vec3 hash3(vec3 p) {
          p = vec3(
            dot(p, vec3(127.1, 311.7, 74.7)),
            dot(p, vec3(269.5, 183.3, 246.1)),
            dot(p, vec3(113.5, 271.9, 124.6))
          );
          return fract(sin(p) * 43758.5453123);
        }

        float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
                mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
                mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = p * 2.04 + vec3(0.13, -0.17, 0.21);
            a *= 0.5;
          }
          return v * 1.032;
        }

        vec3 srgb(float r, float g, float b) {
          return pow(max(vec3(r, g, b), vec3(0.0)), vec3(2.2));
        }

        // Anti-aliased 3D cellular star-cloud micro-granulation ("diamond dust" inside the Milky Way)
        float starDustGrain(vec3 dir, float scale, float timePhase, float aaFade) {
          if (aaFade <= 0.01) return 0.0;
          vec3 p = dir * scale;
          vec3 i = floor(p);
          vec3 f = fract(p) - 0.5;
          vec3 rnd = hash3(i);
          vec3 offset = (rnd - 0.5) * 0.55;
          float d2 = dot(f - offset, f - offset);
          float spark = exp(-d2 * 28.0) * smoothstep(0.56, 0.99, rnd.x);
          float tw = 0.65 + 0.35 * sin(uTime * (1.2 + rnd.y * 2.8) + rnd.z * 6.2831 + timePhase);
          return spark * tw * aaFade;
        }

        void main() {
          // equirectangular, matching the UVs of THREE.SphereGeometry
          float phi = vUv.x * 6.28318530718, theta = (1.0 - vUv.y) * 3.14159265359;
          vec3 dir = vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
          float t = uTime * 0.012;

          // ---- Galactic coordinate frame (shared with the star distribution in JS) ----
          vec3 N = normalize(uGalPole);
          vec3 C = normalize(uGalCenter);
          vec3 E = cross(N, C);
          float lat = asin(clamp(dot(dir, N), -1.0, 1.0));
          float lon = atan(dot(dir, E), dot(dir, C));

          // Multi-scale domain-warped 3D cosmic gas turbulence (slowly breathing & curling)
          vec3 warpVec = vec3(
            fbm(dir * 2.5 + vec3(t * 0.7, -t * 0.4, 0.0)) - 0.5,
            fbm(dir * 2.5 + vec3(4.2, t * 0.6, -t * 0.5)) - 0.5,
            fbm(dir * 2.5 + vec3(-3.1, 2.7, t * 0.7)) - 0.5
          );
          vec3 wDir = normalize(dir + warpVec * 0.22);

          float nMacro  = fbm(wDir * 2.6 + vec3(0.0, t * 0.3, 0.0));
          float nMid    = fbm(wDir * 6.0 - vec3(t * 0.4, 0.0, t * 0.3));
          float nFine   = fbm(wDir * 14.5 + warpVec * 1.3 + vec3(t * 0.5));
          float nDetail = fbm(dir * 28.0 + warpVec * 2.0);

          // ---- 1. Milky Way Band & Galactic Core Envelope (Ref 1, 2, 3, 4) ----
          float bulgeLon = exp(-pow((lon + 0.08) / 0.52, 2.0));
          float streamLon = exp(-pow((lon - 0.45) / 1.15, 2.0));
          float bandWidth = 0.105 + 0.065 * bulgeLon + 0.045 * (nMacro - 0.5);
          float meander = (nMacro - 0.5) * 0.085 + sin(lon * 2.0 + 0.3) * 0.028;
          float latShifted = lat + meander;

          float innerCore = exp(-pow(latShifted / (bandWidth * 0.58), 2.0));
          float mainBand  = exp(-pow(latShifted / bandWidth, 2.0));
          float outerHalo = exp(-pow(latShifted / (bandWidth * 2.15), 2.0));
          float wideWings = exp(-pow(lat / 0.36, 2.0));

          // ---- 2. Organic Feathery Dark Interstellar Dust Lanes ("Great Rift" - Ref 2 & Ref 3) ----
          // Uses multi-octave FBM product (zero isoline ring artifacts!)
          float dCloud1 = fbm(wDir * 4.8 + vec3(1.9, -1.1, 0.6));
          float dCloud2 = fbm(wDir * 11.5 - vec3(0.7, 2.3, -1.4));
          float dWisps  = fbm(dir * 24.0 + warpVec * 2.4);
          float riftSpine = exp(-pow((latShifted - 0.008 + (nMid - 0.5) * 0.065) / (0.055 + 0.035 * bulgeLon), 2.0));
          float dustRaw = dCloud1 * 0.52 + dCloud2 * 0.33 + dWisps * 0.15;
          float dustRift = smoothstep(0.44, 0.72, dustRaw) * riftSpine;
          float darkPockets = smoothstep(0.56, 0.80, dCloud2 * 0.65 + dWisps * 0.35) * mainBand * 0.65;
          float totalDust = clamp(dustRift * 0.92 + darkPockets * 0.48, 0.0, 0.94);

          // Living internal H-II ionization pulse inside star-forming clouds
          float ionPulse = 0.90 + 0.10 * sin(uTime * 1.15 + nMacro * 8.0 + lon * 3.0);

          // High-contrast clumpy resolved star-cloud structure
          float clumpRaw = nMid * 0.48 + nFine * 0.36 + nDetail * 0.16;
          float starClumps = smoothstep(0.34, 0.82, clumpRaw) * (0.65 + 0.55 * nDetail);

          // ---- 3. Saturated Cosmic Color Regions (Blended via mix() so colors stay pure & vibrant!) ----
          // Base cool sapphire-cobalt & cerulean Milky Way star clouds (Ref 1, Ref 2 outer, Ref 3, Ref 4)
          vec3 colDeepSapphire = srgb(0.04, 0.11, 0.28);
          vec3 colCobaltBlue   = srgb(0.11, 0.26, 0.58);
          vec3 colCyanBright   = srgb(0.24, 0.54, 0.86);
          vec3 colSilveryBlue  = srgb(0.48, 0.66, 0.94);

          vec3 coolCloudCol = mix(colDeepSapphire, colCobaltBlue, smoothstep(0.15, 0.60, starClumps));
          coolCloudCol = mix(coolCloudCol, colCyanBright, smoothstep(0.45, 0.85, starClumps) * (0.55 + 0.45 * bulgeLon));
          coolCloudCol = mix(coolCloudCol, colSilveryBlue, pow(starClumps, 2.0) * innerCore * (0.5 + 0.5 * streamLon));

          // Reference 1 Right/Wing: Royal Amethyst & Violet-Magenta Emission Nebula
          vec3 colDeepAmethyst = srgb(0.16, 0.05, 0.26);
          vec3 colRoseMagenta  = srgb(0.46, 0.15, 0.48);
          vec3 colLilacGlow    = srgb(0.58, 0.32, 0.68);
          vec3 violetCloudCol  = mix(colDeepAmethyst, colRoseMagenta, smoothstep(0.25, 0.78, nFine));
          violetCloudCol = mix(violetCloudCol, colLilacGlow, pow(starClumps, 2.2) * 0.5);

          float violetRegion = smoothstep(-0.15, 0.65, sin(lon - 0.28) + (nMacro - 0.5) * 0.55)
                             * smoothstep(0.32, 0.82, fbm(wDir * 3.4 + vec3(2.1, -1.2, 0.7)));

          // Blend between Sapphire-Cyan clouds and Royal Violet-Magenta wisps (Ref 1)
          vec3 cloudHue = mix(coolCloudCol, violetCloudCol, violetRegion * 0.78 * uNebulaIntensity);

          // Reference 2 Center: Fiery Golden-Amber & Burnt-Orange Galactic Core Knots
          // Replaces (mixes into) the inner core around the dark Great Rift so orange & blue never muddy!
          vec3 colBurntOrange = srgb(0.58, 0.20, 0.04);
          vec3 colGoldenAmber = srgb(0.88, 0.48, 0.12);
          vec3 colWarmCream   = srgb(0.98, 0.78, 0.42);
          vec3 goldCoreCol = mix(colBurntOrange, colGoldenAmber, smoothstep(0.25, 0.72, nFine));
          goldCoreCol = mix(goldCoreCol, colWarmCream, pow(starClumps, 2.2) * innerCore * 0.85);

          float goldCoreWeight = clamp(bulgeLon * (innerCore * 0.95 + mainBand * 0.35) * smoothstep(0.28, 0.75, nMid * 0.6 + nFine * 0.4) * 1.25, 0.0, 0.92);
          cloudHue = mix(cloudHue, goldCoreCol * ionPulse, goldCoreWeight);

          // Spatial envelope of the galactic band + wispy outer nebula filaments (leaves rich dark void outside!)
          float wispEnvelope = smoothstep(0.40, 0.85, fbm(wDir * 3.0 + vec3(1.2, 0.8, -1.5))) * wideWings * 0.48 * uNebulaIntensity;
          float bandEnvelope = (mainBand * (0.38 + 0.92 * starClumps) + outerHalo * starClumps * 0.42) * uMilkyWay;
          float totalEnvelope = clamp(bandEnvelope + wispEnvelope, 0.0, 1.0) * (1.0 - totalDust * 0.90);

          vec3 nebulaAndGalaxy = cloudHue * totalEnvelope;

          // ---- 4. Resolved "Diamond Dust" Star-Cloud Micro-Granulation (Ref 2, 3, 4) ----
          float fw = length(fwidth(dir));
          float aa1 = clamp(1.0 - fw * 95.0, 0.0, 1.0);
          float aa2 = clamp(1.0 - fw * 175.0, 0.0, 1.0);
          float dustDensity = clamp(mainBand * 1.1 + outerHalo * 0.35, 0.0, 1.0) * (1.0 - totalDust * 0.88);
          float microStars1 = starDustGrain(dir, 150.0, 0.0, aa1);
          float microStars2 = starDustGrain(dir, 280.0, 2.1, aa2);
          vec3 grainTint = mix(srgb(0.62, 0.78, 1.0), srgb(1.0, 0.82, 0.52), goldCoreWeight);
          vec3 diamondDust = grainTint * (microStars1 * 0.45 + microStars2 * 0.35) * dustDensity * uMilkyWay;

          // ---- 5. Deep High-Contrast Cosmic Void Base (Ref 1 & Ref 4) ----
          vec3 colVoid = srgb(0.010, 0.015, 0.036);

          vec3 finalSky = colVoid + min((nebulaAndGalaxy + diamondDust) * uVRBoost, vec3(0.38));
          gl_FragColor = vec4(finalSky, 1.0);
          #include <colorspace_fragment>
        }
`

    const StarFieldShader = {
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute vec3 aTwinkle; // x = phase, y = speed, z = amplitude
        uniform float uTime;
        uniform float uPixelScale;
        uniform float uVRBoost;
        varying vec3 vColor;
        varying float vPointSize;
        varying float vTwinkle;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;

          // Multi-harmonic per-star scintillation + slow spatial cluster wavefront ripple
          vec3 dir = normalize(position);
          float clusterWave = sin(dot(dir, vec3(11.0, 7.5, 13.0)) - uTime * 1.45)
                            * cos(dot(dir, vec3(-8.5, 14.0, 5.5)) + uTime * 1.10);
          float w1 = sin(uTime * aTwinkle.y + aTwinkle.x);
          float w2 = sin(uTime * aTwinkle.y * 2.23 + aTwinkle.x * 1.71);
          float w3 = cos(uTime * aTwinkle.y * 0.57 - aTwinkle.x * 0.93);
          float s = w1 * 0.50 + w2 * 0.32 + w3 * 0.18 + clusterWave * 0.16;

          float tw = max(0.30, 1.0 + aTwinkle.z * s);
          vTwinkle = tw;

          // Chromatic scintillation: subtle spectral temperature shimmer as the star twinkles
          vec3 chromaShift = mix(
            vec3(0.82, 0.92, 1.14),
            vec3(1.14, 0.94, 0.78),
            0.5 + 0.5 * sin(uTime * aTwinkle.y * 1.4 + aTwinkle.x * 2.7)
          );
          vColor = aColor * mix(vec3(1.0), chromaShift, aTwinkle.z * 0.60) * tw * uVRBoost;

          float px = max(1.6, aSize * uPixelScale * (1.0 + aTwinkle.z * s * 0.22));
          vPointSize = px;
          gl_PointSize = px;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vPointSize;
        varying float vTwinkle;
        void main() {
          vec2 p = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(p, p);
          if (r2 > 1.0) discard;

          // Screen-pixel distance from star center for razor-sharp, non-bloated pinpoints
          float halfPx = max(0.8, vPointSize * 0.5);
          vec2 px = p * halfPx;
          float distPx = length(px);
          float edgeFade = 1.0 - smoothstep(0.55, 1.0, sqrt(r2));

          // Tight pinpoint core (~1.0px FWHM) so dense star clusters never merge into white blobs
          float core = exp(-distPx * distPx * 2.15);
          float haloWeight = smoothstep(2.4, 5.5, vPointSize);
          float innerHalo = exp(-distPx * 1.55) * 0.14 * haloWeight;

          // Medium-bright jewel cluster stars (vPointSize > 4.2px) get delicate 45-degree micro-spikes
          float jewelFactor = smoothstep(4.2, 7.0, vPointSize);
          float spikes = 0.0;
          if (jewelFactor > 0.01) {
            vec2 q = vec2(0.7071 * (px.x - px.y), 0.7071 * (px.x + px.y));
            spikes = (exp(-abs(q.y) * 1.85) * exp(-abs(q.x) * 0.55)
                   +  exp(-abs(q.x) * 1.85) * exp(-abs(q.y) * 0.55)) * jewelFactor * 0.35;
          }

          float profile = core + (innerHalo + spikes) * edgeFade;
          vec3 col = vColor * profile;
          col += vec3(0.95, 0.97, 1.0) * (core * core) * haloWeight * 0.35 * vTwinkle;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    };

    const HeroStarShader = {
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute vec3 aTwinkle;
        attribute float aAngle;
        uniform float uTime;
        uniform float uPixelScale;
        uniform float uVRBoost;
        varying vec3 vColor;
        varying float vAngle;
        varying float vPulse;
        varying float vPointSize;
        varying float vTime;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float s = sin(uTime * aTwinkle.y + aTwinkle.x) * 0.58
                  + sin(uTime * aTwinkle.y * 2.13 + aTwinkle.x * 1.9) * 0.28
                  + cos(uTime * aTwinkle.y * 0.65 - aTwinkle.x) * 0.14;
          vPulse = 1.0 + aTwinkle.z * s;
          vColor = aColor * uVRBoost;
          vAngle = aAngle;
          vTime = uTime + aTwinkle.x;
          float px = aSize * uPixelScale * (0.94 + 0.08 * vPulse);
          vPointSize = px;
          gl_PointSize = px;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAngle;
        varying float vPulse;
        varying float vPointSize;
        varying float vTime;
        void main() {
          vec2 p = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(p, p);
          if (r2 > 1.0) discard;

          float r = sqrt(r2);
          float halfPx = max(12.0, vPointSize * 0.5);
          vec2 px = p * halfPx;
          float distPx = length(px);

          // Rotate into primary spike frame (default ~45 deg diagonal X-spikes matching Ref 1)
          float ca = cos(vAngle), sa = sin(vAngle);
          vec2 q = vec2(ca * px.x - sa * px.y, sa * px.x + ca * px.y);
          // Secondary 45-deg offset frame (+ spikes)
          vec2 q2 = vec2(0.7071 * (q.x - q.y), 0.7071 * (q.x + q.y));

          float edgeFade = 1.0 - smoothstep(0.45, 1.0, r);
          float reach = 1.0 / (halfPx * (0.42 / vPulse));

          // Long, needle-sharp ~1.15px diagonal X-diffraction spikes (Ref 1)
          float mainSpikes = exp(-abs(q.y) * 1.25) * exp(-abs(q.x) * reach * 0.78)
                           + exp(-abs(q.x) * 1.25) * exp(-abs(q.y) * reach * 0.86) * 0.94;
          float subSpikes  = (exp(-abs(q2.y) * 1.55) * exp(-abs(q2.x) * reach * 1.95)
                           +  exp(-abs(q2.x) * 1.55) * exp(-abs(q2.y) * reach * 1.95)) * 0.32;

          // Subtle optical diffraction shimmer along spike arms
          vec3 spikeChroma = vec3(
            1.0 + 0.14 * sin(distPx * 0.28 - vTime * 2.2),
            1.0 + 0.06 * cos(distPx * 0.24 - vTime * 1.8),
            1.0 - 0.12 * sin(distPx * 0.28 - vTime * 2.2)
          );

          // Incandescent core + warm/cool circular halo (Ref 1)
          float core = exp(-distPx * distPx * 0.32) * 2.20;
          float innerCorona = exp(-distPx * 0.42) * 0.34;
          float outerHalo   = exp(-r * 5.2) * 0.11 * edgeFade;

          vec3 col = vColor * (innerCorona + outerHalo) * vPulse;
          col += vColor * spikeChroma * (mainSpikes + subSpikes) * edgeFade * 1.45 * vPulse;
          col += vec3(1.0, 0.98, 0.94) * (core + mainSpikes * exp(-distPx * 0.22) * 0.85) * vPulse;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    };

const galPole = new THREE.Vector3(0.52, 0.85, 0.0).normalize()
const c0 = new THREE.Vector3(0, 0, -1)
const e0 = new THREE.Vector3().crossVectors(galPole, c0).normalize()
const galCenter = c0.clone().multiplyScalar(Math.cos(0.16)).addScaledVector(e0, Math.sin(0.16)).normalize()
const galEast = new THREE.Vector3().crossVectors(galPole, galCenter).normalize()

/** Paint the Milky Way and nebulae into an equirectangular texture (for the sky sphere, and other scenes). */
export function bakeNebula(renderer, width = 4096) {
  const rt = new THREE.WebGLRenderTarget(width, width / 2, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter })
  rt.texture.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uNebulaIntensity: { value: 1 }, uMilkyWay: { value: 1 }, uVRBoost: { value: 1 }, uGalPole: { value: galPole }, uGalCenter: { value: galCenter } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: NEBULA_FRAG,
    depthTest: false, depthWrite: false,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
  quad.frustumCulled = false
  const sc = new THREE.Scene()
  sc.add(quad)
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const prevTarget = renderer.getRenderTarget(), prevXR = renderer.xr.enabled, prevTone = renderer.toneMapping
  renderer.xr.enabled = false
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setRenderTarget(rt)
  renderer.render(sc, cam)
  renderer.setRenderTarget(prevTarget)
  renderer.xr.enabled = prevXR
  renderer.toneMapping = prevTone
  mat.dispose()
  quad.geometry.dispose()
  return rt.texture
}

/** Stars: a dense field concentrated along the Milky Way, star clusters, and bright spiked hero stars. */
export function buildStars(R = 900, { scale = 0.45 } = {}) {
  const group = new THREE.Group()
  const gauss = () => { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) }
  const fromGalactic = (lat, lon, out) => { const cl = Math.cos(lat); return out.copy(galCenter).multiplyScalar(cl * Math.cos(lon)).addScaledVector(galEast, cl * Math.sin(lon)).addScaledVector(galPole, Math.sin(lat)) }
  const uniformDir = (out) => { const z = 2 * Math.random() - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - z * z); return out.set(s * Math.cos(th), s * Math.sin(th), z) }
  const sampleDir = (bandBias, out, avoidRift = false) => {
    if (Math.random() < bandBias) {
      let lon, lat
      if (Math.random() < 0.42) { lon = -0.1 + gauss() * 0.62; lat = gauss() * 0.16 - Math.sin(lon * 2.0 + 0.4) * 0.035 }
      else { lon = (Math.random() * 2 - 1) * Math.PI; lat = gauss() * 0.115 - Math.sin(lon * 2.0 + 0.4) * 0.035 }
      if (avoidRift && Math.abs(lat - 0.01) < 0.032 && Math.random() < 0.65) lat += (lat >= 0 ? 1 : -1) * (0.035 + Math.abs(gauss()) * 0.05)
      return fromGalactic(lat, lon, out)
    }
    return uniformDir(out)
  }
  const palette = [
    [0.26, new THREE.Color(0.68, 0.84, 1.0)], [0.26, new THREE.Color(1, 1, 1)], [0.16, new THREE.Color(1.0, 0.94, 0.82)],
    [0.12, new THREE.Color(1.0, 0.8, 0.48)], [0.08, new THREE.Color(1.0, 0.56, 0.3)], [0.07, new THREE.Color(0.38, 0.72, 1.0)], [0.05, new THREE.Color(0.84, 0.64, 1.0)],
  ]
  const pickColor = () => { let r = Math.random(); for (const [w, c] of palette) if ((r -= w) <= 0) return c; return palette[1][1] }

  // fewer stars than the desktop prototype, to keep the headset at full frame rate
  const brightCount = Math.round(11500 * scale), faintCount = Math.round(49000 * scale), clusterCount = 24, perCluster = Math.round(175 * Math.max(0.6, scale))
  const total = brightCount + faintCount + clusterCount * perCluster
  const pos = new Float32Array(total * 3), col = new Float32Array(total * 3), size = new Float32Array(total), twk = new Float32Array(total * 3)
  const d = new THREE.Vector3()
  let idx = 0
  const pushStar = (dir, c, bright, px, amp, speed = 1) => {
    pos.set([dir.x * R, dir.y * R, dir.z * R], idx * 3)
    col.set([c.r * bright, c.g * bright, c.b * bright], idx * 3)
    size[idx] = px
    // a slower, gentler twinkle than the prototype
    twk.set([Math.random() * Math.PI * 2, (0.3 + Math.random() * 1.0) * speed, amp], idx * 3)
    idx++
  }
  for (let i = 0; i < brightCount; i++) {
    sampleDir(0.38, d, true)
    const m = Math.pow(Math.random(), 4.0), jewel = m > 0.62
    pushStar(d, pickColor(), 0.16 + m * 0.76, jewel ? 4.0 + (m - 0.62) * 6.5 : 1.8 + m * 2.8, 0.18 + Math.random() * 0.38, jewel ? 0.85 : 1.15)
  }
  for (let i = 0; i < faintCount; i++) {
    sampleDir(0.58, d, true)
    const m = Math.pow(Math.random(), 2.5)
    pushStar(d, pickColor(), 0.06 + m * 0.25, 1.5 + m * 0.92, Math.random() < 0.65 ? 0.14 + Math.random() * 0.34 : 0.06, 1.25)
  }
  const cd = new THREE.Vector3()
  for (let k = 0; k < clusterCount; k++) {
    if (k < 8) fromGalactic((Math.random() - 0.5) * 0.26, (k / 8 - 0.5) * 1.2, cd)
    else sampleDir(0.84, cd, true)
    const spread = 0.024 + Math.random() * 0.045
    const tints = [palette[0][1], palette[1][1], palette[3][1], palette[5][1], palette[6][1]]
    for (let j = 0; j < perCluster; j++) {
      d.set(cd.x + gauss() * spread, cd.y + gauss() * spread, cd.z + gauss() * spread).normalize()
      const m = Math.pow(Math.random(), 3.6)
      pushStar(d, Math.random() < 0.68 ? tints[k % tints.length] : pickColor(), 0.075 + m * 0.58, 1.55 + m * 3.4, 0.16 + Math.random() * 0.34, 1.1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aTwinkle', new THREE.BufferAttribute(twk, 3))
  const uniforms = { uTime: { value: 0 }, uPixelScale: { value: 1 }, uVRBoost: { value: 1 } }
  const starMat = new THREE.ShaderMaterial({ uniforms, vertexShader: StarFieldShader.vertexShader, fragmentShader: StarFieldShader.fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const stars = new THREE.Points(g, starMat)
  stars.frustumCulled = false
  stars.renderOrder = -9
  group.add(stars)

  // hero stars with X-shaped diffraction spikes
  const heroes = [
    { lat: -0.065, lon: -0.29, size: 86, bright: 1.15, color: new THREE.Color(1.0, 0.9, 0.7), angle: 0.785 },
    { lat: 0.075, lon: 0.26, size: 82, bright: 1.1, color: new THREE.Color(0.92, 0.95, 1.0), angle: 0.785 },
    { lat: -0.145, lon: 0.08, size: 54, bright: 0.85, color: new THREE.Color(0.75, 0.88, 1.0), angle: 0.76 },
    { lat: 0.155, lon: -0.16, size: 52, bright: 0.82, color: new THREE.Color(1.0, 0.84, 0.58), angle: 0.8 },
    { lat: 0.18, lon: 0.42, size: 50, bright: 0.78, color: new THREE.Color(0.9, 0.76, 1.0), angle: 0.77 },
    { lat: -0.175, lon: -0.46, size: 54, bright: 0.84, color: new THREE.Color(0.68, 0.86, 1.0), angle: 0.81 },
  ]
  const heroPalette = [new THREE.Color(1.0, 0.9, 0.68), new THREE.Color(0.95, 0.97, 1.0), new THREE.Color(0.62, 0.84, 1.0), new THREE.Color(0.45, 0.76, 1.0), new THREE.Color(1.0, 0.74, 0.45), new THREE.Color(0.88, 0.72, 1.0)]
  const HN = heroes.length + 26
  const hPos = new Float32Array(HN * 3), hCol = new Float32Array(HN * 3), hSize = new Float32Array(HN), hTwk = new Float32Array(HN * 3), hAng = new Float32Array(HN)
  const placed = []
  for (let i = 0; i < HN; i++) {
    let c, b, sz, ang
    if (i < heroes.length) { const h = heroes[i]; fromGalactic(h.lat, h.lon, d); c = h.color; b = h.bright; sz = h.size; ang = h.angle }
    else {
      for (let a = 0; a < 25; a++) { sampleDir(0.45, d, false); if (!placed.some((p) => d.dot(p) > 0.955)) break }
      c = heroPalette[Math.floor(Math.random() * heroPalette.length)]
      const m = Math.pow(Math.random(), 1.8)
      b = 0.48 + m * 0.44; sz = 32 + m * 36; ang = Math.PI * 0.25 + (Math.random() - 0.5) * 0.14
    }
    placed.push(d.clone())
    hPos.set([d.x * R * 0.98, d.y * R * 0.98, d.z * R * 0.98], i * 3)
    hCol.set([c.r * b, c.g * b, c.b * b], i * 3)
    hSize[i] = sz
    hTwk.set([Math.random() * Math.PI * 2, 0.3 + Math.random() * 0.7, 0.14 + Math.random() * 0.18], i * 3)
    hAng[i] = ang
  }
  const hg = new THREE.BufferGeometry()
  hg.setAttribute('position', new THREE.BufferAttribute(hPos, 3))
  hg.setAttribute('aColor', new THREE.BufferAttribute(hCol, 3))
  hg.setAttribute('aSize', new THREE.BufferAttribute(hSize, 1))
  hg.setAttribute('aTwinkle', new THREE.BufferAttribute(hTwk, 3))
  hg.setAttribute('aAngle', new THREE.BufferAttribute(hAng, 1))
  const heroMat = new THREE.ShaderMaterial({ uniforms, vertexShader: HeroStarShader.vertexShader, fragmentShader: HeroStarShader.fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const hero = new THREE.Points(hg, heroMat)
  hero.frustumCulled = false
  hero.renderOrder = -8
  group.add(hero)
  return { group, uniforms }
}
