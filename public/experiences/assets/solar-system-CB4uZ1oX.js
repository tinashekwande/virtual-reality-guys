import"./modulepreload-polyfill-B5Qt9EMX.js";import{y as Ko,V as l,G as Te,I as Pa,M as I,d as Ue,j as ve,k as ge,i as fe,l as ke,c as xe,o as it,n as za,f as Pt,$ as Pe,Q as Ye,a as ne,b as zt,C as $,K as Ot,a0 as bt,U as Zo,a1 as Jo,t as Re,P as Da,N as Dt,a2 as po,a3 as ho,A as mo,W as vo,S as le,h as ye,B as qe,a4 as Vt,a5 as Gt,a6 as go,a7 as en,e as Ra,E as wo,r as jt,T as tn,p as an,g as Ce,a8 as on,a9 as Zt,R as nn,F as xo,D as wa,aa as rn,s as Ga,m as sn,H as ln,u as _e,ab as qt,ac as Wt,ad as cn,ae as un,af as dn,ag as fn,ah as pn,ai as hn,aj as mn,ak as vn,al as gn,am as wn,X as xn,an as bn,Y as yn,Z as Sn,_ as bo}from"./BufferGeometryUtils-BqHntSiP.js";import{a as Mn,S as be,I as yo,O as So,Q as Le,M as ze,s as ja,b as Tn,D as qa}from"./results-store-BlUfglbG.js";const la=new Ko([new l(-260,120,-320),new l(-90,55,-150),new l(20,26,-62),new l(70,22,-20),new l(140,42,60),new l(260,90,210),new l(420,150,380)]),Cn=600;function Ha(t,e,a,o,r=64,n=28){const s=[],i=[],u=[];for(let h=0;h<=r;h++){const p=h/r,w=e+(a-e)*Math.pow(p,.8),v=p*t,W=o*p*p*t;for(let _=0;_<=n;_++){const U=_/n*Math.PI*2;s.push(W+Math.cos(U)*w,v,Math.sin(U)*w),i.push(_/n,p)}}for(let h=0;h<r;h++)for(let p=0;p<n;p++){const w=h*(n+1)+p,v=w+n+1;u.push(w,v,w+1,v,v+1,w+1)}const f=new ke;return f.setAttribute("position",new Ot(s,3)),f.setAttribute("uv",new Ot(i,2)),f.setIndex(u),f.computeVertexNormals(),f}function $a(t,{streak:e=10,flow:a=.25,power:o=1.6,strength:r=1}){return new ne({uniforms:{uColor:{value:new $(...t)},uTime:{value:0},uStrength:{value:r}},vertexShader:`varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${St}
      uniform vec3 uColor; uniform float uTime; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float v = vUv.y;
        float along = pow(1.0 - v, ${o.toFixed(2)}) * smoothstep(0.0, 0.03, v);
        float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.4);
        float a = vUv.x * 6.2832;
        float n = snoise(vec3(cos(a) * ${e.toFixed(1)}, sin(a) * ${e.toFixed(1)}, v * 4.0 - uTime * ${a.toFixed(3)}));
        float streaks = 0.55 + 0.45 * n;
        gl_FragColor = vec4(uColor * along * core * streaks * uStrength, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:fe,side:zt,toneMapped:!1})}function Pn(t,e){const a=new Te;t.add(a);const o=new Pa(.22,3),r=o.attributes.position;for(let R=0;R<r.count;R++){const b=new l().fromBufferAttribute(r,R),oe=1+.25*Math.sin(b.x*9)*Math.cos(b.y*7)+.15*Math.sin(b.z*13);b.multiplyScalar(oe),b.x*=1.5,r.setXYZ(R,b.x,b.y,b.z)}o.computeVertexNormals();const n=new I(o,new Ue({color:3814704,roughness:1}));a.add(n);const s=new ve(new ge({map:je([210,255,235],[80,200,170],.45),blending:fe,transparent:!0,depthWrite:!1,toneMapped:!1}));s.scale.setScalar(5),a.add(s);const i=new ve(new ge({map:je([255,255,255],[180,240,255],.25),blending:fe,transparent:!0,depthWrite:!1,toneMapped:!1}));i.scale.setScalar(1.4),a.add(i);const u=$a([.35,.6,1.25],{streak:14,flow:.9,power:1.2,strength:1.1}),f=new I(Ha(55,.12,1.4,0),u),h=$a([1.15,.98,.78],{streak:6,flow:.18,power:1.9,strength:.85}),p=new I(Ha(38,.35,7,.32),h);f.frustumCulled=p.frustumCulled=!1,a.add(f,p);const w=500,v=new Float32Array(w*3),W=Array.from({length:w},()=>new l),_=new Float32Array(w).map(()=>Math.random()*6),U=new ke;U.setAttribute("position",new xe(v,3));const Y=new it(U,new za({map:je([255,245,220],[255,200,150],.3),size:.35,color:16773336,transparent:!0,opacity:.8,depthWrite:!1,blending:fe,toneMapped:!1}));Y.frustumCulled=!1,t.add(Y);const M=new l,z=new l,A=new l,N=new Ye,H=new Pt,K=new l(0,1,0),te=new l;let E=!0,C=.35;return{root:a,update(R,b){const oe=la.getPointAt(C),L=Pe.clamp(Math.sqrt(70/Math.max(1,oe.distanceTo(e))),.45,2.2);C=(C+Math.min(R,.1)*L/Cn)%1;const k=la.getPointAt(C);a.position.copy(k),E&&(te.copy(k),E=!1),z.copy(k).sub(te),z.lengthSq()<1e-8&&z.copy(la.getTangentAt(C)),z.normalize(),te.copy(k);const O=k.distanceTo(e),q=Pe.clamp(90/O,.35,1.5);M.copy(k).sub(e).normalize(),N.setFromUnitVectors(K,M),f.quaternion.copy(N),f.scale.setScalar(q),A.copy(z).multiplyScalar(-1).addScaledVector(M,-z.clone().multiplyScalar(-1).dot(M)).normalize();const re=new l().crossVectors(A,M).normalize();H.makeBasis(A,M,re),p.quaternion.setFromRotationMatrix(H),p.scale.setScalar(q),u.uniforms.uTime.value=b,h.uniforms.uTime.value=b,u.uniforms.uStrength.value=1.1*q,h.uniforms.uStrength.value=.85*q,s.scale.setScalar(4+3*q+.3*Math.sin(b*2.1)),n.rotation.y+=R*.3,n.rotation.x+=R*.11;for(let B=0;B<w;B++)_[B]+=R,_[B]>6?(_[B]=0,v[B*3]=k.x,v[B*3+1]=k.y,v[B*3+2]=k.z,W[B].copy(M).multiplyScalar(2+Math.random()*5*q).add(new l().randomDirection().multiplyScalar(.8)).addScaledVector(z,-1.5*Math.random())):(v[B*3]+=W[B].x*R,v[B*3+1]+=W[B].y*R,v[B*3+2]+=W[B].z*R);U.attributes.position.needsUpdate=!0,Y.material.opacity=.75*q}}}const zn=`
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
`,Qa={vertexShader:`
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
      `,fragmentShader:`
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
      `},Ya={vertexShader:`
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
      `,fragmentShader:`
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
      `},Jt=new l(.52,.85,0).normalize(),Mo=new l(0,0,-1),Dn=new l().crossVectors(Jt,Mo).normalize(),Na=Mo.clone().multiplyScalar(Math.cos(.16)).addScaledVector(Dn,Math.sin(.16)).normalize(),Rn=new l().crossVectors(Jt,Na).normalize();function Nn(t,e=4096){const a=new bt(e,e/2,{generateMipmaps:!0,minFilter:Jo,magFilter:Zo});a.texture.colorSpace=Re;const o=new ne({uniforms:{uTime:{value:0},uNebulaIntensity:{value:1},uMilkyWay:{value:1},uVRBoost:{value:1},uGalPole:{value:Jt},uGalCenter:{value:Na}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:zn,depthTest:!1,depthWrite:!1}),r=new I(new Da(2,2),o);r.frustumCulled=!1;const n=new Dt;n.add(r);const s=new po(-1,1,1,-1,0,1),i=t.getRenderTarget(),u=t.xr.enabled,f=t.toneMapping;return t.xr.enabled=!1,t.toneMapping=ho,t.setRenderTarget(a),t.render(n,s),t.setRenderTarget(i),t.xr.enabled=u,t.toneMapping=f,o.dispose(),r.geometry.dispose(),a.texture}function kn(t=900,{scale:e=.45}={}){const a=new Te,o=()=>{let D=0,T=0;for(;D===0;)D=Math.random();for(;T===0;)T=Math.random();return Math.sqrt(-2*Math.log(D))*Math.cos(2*Math.PI*T)},r=(D,T,Q)=>{const V=Math.cos(D);return Q.copy(Na).multiplyScalar(V*Math.cos(T)).addScaledVector(Rn,V*Math.sin(T)).addScaledVector(Jt,Math.sin(D))},n=D=>{const T=2*Math.random()-1,Q=Math.random()*Math.PI*2,V=Math.sqrt(1-T*T);return D.set(V*Math.cos(Q),V*Math.sin(Q),T)},s=(D,T,Q=!1)=>{if(Math.random()<D){let V,ie;return Math.random()<.42?(V=-.1+o()*.62,ie=o()*.16-Math.sin(V*2+.4)*.035):(V=(Math.random()*2-1)*Math.PI,ie=o()*.115-Math.sin(V*2+.4)*.035),Q&&Math.abs(ie-.01)<.032&&Math.random()<.65&&(ie+=(ie>=0?1:-1)*(.035+Math.abs(o())*.05)),r(ie,V,T)}return n(T)},i=[[.26,new $(.68,.84,1)],[.26,new $(1,1,1)],[.16,new $(1,.94,.82)],[.12,new $(1,.8,.48)],[.08,new $(1,.56,.3)],[.07,new $(.38,.72,1)],[.05,new $(.84,.64,1)]],u=()=>{let D=Math.random();for(const[T,Q]of i)if((D-=T)<=0)return Q;return i[1][1]},f=Math.round(11500*e),h=Math.round(49e3*e),p=24,w=Math.round(175*Math.max(.6,e)),v=f+h+p*w,W=new Float32Array(v*3),_=new Float32Array(v*3),U=new Float32Array(v),Y=new Float32Array(v*3),M=new l;let z=0;const A=(D,T,Q,V,ie,ae=1)=>{W.set([D.x*t,D.y*t,D.z*t],z*3),_.set([T.r*Q,T.g*Q,T.b*Q],z*3),U[z]=V,Y.set([Math.random()*Math.PI*2,(.3+Math.random()*1)*ae,ie],z*3),z++};for(let D=0;D<f;D++){s(.38,M,!0);const T=Math.pow(Math.random(),4),Q=T>.62;A(M,u(),.16+T*.76,Q?4+(T-.62)*6.5:1.8+T*2.8,.18+Math.random()*.38,Q?.85:1.15)}for(let D=0;D<h;D++){s(.58,M,!0);const T=Math.pow(Math.random(),2.5);A(M,u(),.06+T*.25,1.5+T*.92,Math.random()<.65?.14+Math.random()*.34:.06,1.25)}const N=new l;for(let D=0;D<p;D++){D<8?r((Math.random()-.5)*.26,(D/8-.5)*1.2,N):s(.84,N,!0);const T=.024+Math.random()*.045,Q=[i[0][1],i[1][1],i[3][1],i[5][1],i[6][1]];for(let V=0;V<w;V++){M.set(N.x+o()*T,N.y+o()*T,N.z+o()*T).normalize();const ie=Math.pow(Math.random(),3.6);A(M,Math.random()<.68?Q[D%Q.length]:u(),.075+ie*.58,1.55+ie*3.4,.16+Math.random()*.34,1.1)}}const H=new ke;H.setAttribute("position",new xe(W,3)),H.setAttribute("aColor",new xe(_,3)),H.setAttribute("aSize",new xe(U,1)),H.setAttribute("aTwinkle",new xe(Y,3));const K={uTime:{value:0},uPixelScale:{value:1},uVRBoost:{value:1}},te=new ne({uniforms:K,vertexShader:Qa.vertexShader,fragmentShader:Qa.fragmentShader,transparent:!0,depthWrite:!1,blending:fe,toneMapped:!1}),E=new it(H,te);E.frustumCulled=!1,E.renderOrder=-9,a.add(E);const C=[{lat:-.065,lon:-.29,size:86,bright:1.15,color:new $(1,.9,.7),angle:.785},{lat:.075,lon:.26,size:82,bright:1.1,color:new $(.92,.95,1),angle:.785},{lat:-.145,lon:.08,size:54,bright:.85,color:new $(.75,.88,1),angle:.76},{lat:.155,lon:-.16,size:52,bright:.82,color:new $(1,.84,.58),angle:.8},{lat:.18,lon:.42,size:50,bright:.78,color:new $(.9,.76,1),angle:.77},{lat:-.175,lon:-.46,size:54,bright:.84,color:new $(.68,.86,1),angle:.81}],R=[new $(1,.9,.68),new $(.95,.97,1),new $(.62,.84,1),new $(.45,.76,1),new $(1,.74,.45),new $(.88,.72,1)],b=C.length+26,oe=new Float32Array(b*3),L=new Float32Array(b*3),k=new Float32Array(b),O=new Float32Array(b*3),q=new Float32Array(b),re=[];for(let D=0;D<b;D++){let T,Q,V,ie;if(D<C.length){const ae=C[D];r(ae.lat,ae.lon,M),T=ae.color,Q=ae.bright,V=ae.size,ie=ae.angle}else{for(let Se=0;Se<25&&(s(.45,M,!1),!!re.some(F=>M.dot(F)>.955));Se++);T=R[Math.floor(Math.random()*R.length)];const ae=Math.pow(Math.random(),1.8);Q=.48+ae*.44,V=32+ae*36,ie=Math.PI*.25+(Math.random()-.5)*.14}re.push(M.clone()),oe.set([M.x*t*.98,M.y*t*.98,M.z*t*.98],D*3),L.set([T.r*Q,T.g*Q,T.b*Q],D*3),k[D]=V,O.set([Math.random()*Math.PI*2,.3+Math.random()*.7,.14+Math.random()*.18],D*3),q[D]=ie}const B=new ke;B.setAttribute("position",new xe(oe,3)),B.setAttribute("aColor",new xe(L,3)),B.setAttribute("aSize",new xe(k,1)),B.setAttribute("aTwinkle",new xe(O,3)),B.setAttribute("aAngle",new xe(q,1));const ce=new ne({uniforms:K,vertexShader:Ya.vertexShader,fragmentShader:Ya.fragmentShader,transparent:!0,depthWrite:!1,blending:fe,toneMapped:!1}),G=new it(B,ce);return G.frustumCulled=!1,G.renderOrder=-8,a.add(G),{group:a,uniforms:K}}const lt={uniforms:{uSunDir:{value:new l(1,0,0)}},vertexShader:`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);

      vec3 c = cross(vec3(0.0, 1.0, 0.0), normal);
      vec3 tangent = length(c) > 0.01 ? normalize(c) : vec3(1.0, 0.0, 0.0);
      vTangent = normalize(mat3(modelMatrix) * tangent);
      vBitangent = normalize(cross(vNormal, vTangent));

      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform sampler2D uDayTex;
    uniform sampler2D uNightTex;
    uniform sampler2D uSpecTex;
    uniform sampler2D uNormalMap;
    uniform sampler2D uCloudTex;
    uniform int uHasNormal;
    uniform vec3 uSunDir;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;

    void main() {
      vec3 geoNormal = normalize(vNormal);
      vec3 T = normalize(vTangent);
      vec3 B = normalize(vBitangent);
      mat3 tbn = mat3(T, B, geoNormal);

      float specMask = texture2D(uSpecTex, vUv).r;
      float isLand = clamp(1.0 - specMask, 0.0, 1.0);

      // High-relief 3D mountain normal mapping (Reference Image 1)
      vec3 normal = geoNormal;
      if (uHasNormal > 0) {
        vec3 normalSample = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
        // Finite-difference micro-relief from albedo & normal map for razor-sharp mountain ridges
        vec2 texel = vec2(1.0 / 2048.0, 1.0 / 1024.0);
        float hL = texture2D(uDayTex, vUv - vec2(texel.x, 0.0)).g;
        float hR = texture2D(uDayTex, vUv + vec2(texel.x, 0.0)).g;
        float hD = texture2D(uDayTex, vUv - vec2(0.0, texel.y)).g;
        float hU = texture2D(uDayTex, vUv + vec2(0.0, texel.y)).g;
        vec2 detailGrad = vec2(hL - hR, hD - hU) * 1.6 * isLand;

        normalSample.xy = normalSample.xy * (0.6 + 1.6 * isLand) + detailGrad;
        normal = normalize(tbn * normalSample);
      }

      vec3 sunDir = normalize(uSunDir);
      float geoNdotL = dot(geoNormal, sunDir);
      float NdotL = dot(normal, sunDir);

      // Smooth twilight terminator (Reference Images 1 & 5)
      float dayFactor = smoothstep(-0.14, 0.16, geoNdotL);
      float diffuse = max(0.0, NdotL);
      // Enhance grazing mountain shadow contrast near terminator
      float reliefContrast = mix(1.0, pow(clamp(NdotL / max(0.08, geoNdotL), 0.15, 1.65), 1.35), isLand * smoothstep(-0.05, 0.45, geoNdotL));

      vec3 rawDay = texture2D(uDayTex, vUv).rgb;

      // Rich continental color grading (warm ochre/terracotta deserts & deep sapphire oceans - Ref 1 & 5)
      float aridness = clamp((rawDay.r - rawDay.b) * 1.8, 0.0, 1.0) * isLand;
      vec3 warmContinent = rawDay * vec3(1.06, 0.86, 0.68);
      vec3 landGraded = mix(rawDay * vec3(0.95, 1.04, 0.88), warmContinent, aridness * 0.78);
      vec3 oceanGraded = rawDay * vec3(0.68, 0.88, 1.18);
      vec3 baseAlbedo = mix(oceanGraded, landGraded, isLand);

      // Real cloud drop-shadows cast onto continents and oceans (Reference Image 1)
      float cloudShadow = 0.0;
      vec2 sunTangent = vec2(dot(sunDir, T), dot(sunDir, B));
      vec4 shadowCloudSample = texture2D(uCloudTex, vUv - sunTangent * 0.0038);
      cloudShadow = smoothstep(0.42, 0.95, 1.0 - shadowCloudSample.r) * 0.45;

      // Dual-lobe Blinn-Phong ocean specular sun-glint (Reference Image 5)
      vec3 halfVector = normalize(sunDir + vViewDir);
      float NdotH = max(0.0, dot(mix(geoNormal, normal, 0.35), halfVector));
      float sunGlintCore = pow(NdotH, 260.0) * 1.1;
      float sunGlintHalo = pow(NdotH, 40.0) * 0.18;
      float specular = (sunGlintCore + sunGlintHalo) * smoothstep(0.55, 0.95, specMask) * (1.0 - cloudShadow * 0.8) * smoothstep(-0.02, 0.25, geoNdotL);

      // Subtle Rayleigh surface horizon scatter + golden sunset terminator
      float fresnel = 1.0 - max(0.0, dot(geoNormal, vViewDir));
      float limbScatter = pow(fresnel, 3.8) * smoothstep(-0.22, 0.45, geoNdotL);
      vec3 atmoSurface = vec3(0.22, 0.56, 0.98) * limbScatter * 0.68;

      float terminator = exp(-pow(geoNdotL * 5.5, 2.0)) * smoothstep(-0.2, 0.2, geoNdotL);
      vec3 twilightWarmth = vec3(0.95, 0.42, 0.14) * terminator * 0.28;

      vec3 litDay = baseAlbedo * diffuse * reliefContrast * (1.0 - cloudShadow) * 0.9;
      litDay += vec3(1.0, 0.95, 0.84) * specular;
      litDay += twilightWarmth * baseAlbedo;

      // Pitch-black night side with glittering golden city lights (Reference Image 5)
      vec3 nightSample = texture2D(uNightTex, vUv).rgb;
      vec3 nightLights = pow(nightSample, vec3(1.6)) * vec3(1.4, 1.05, 0.55) * 2.2 * (1.0 - cloudShadow * 0.7);
      vec3 nightSide = vec3(0.001, 0.0015, 0.003) + nightLights * smoothstep(0.08, -0.18, geoNdotL);

      vec3 finalColor = mix(nightSide, litDay, dayFactor) + atmoSurface;

      gl_FragColor = vec4(finalColor, 1.0);
          gl_FragColor.rgb = pow(max(gl_FragColor.rgb, vec3(0.0)), vec3(2.2)); // displayColor
          #include <colorspace_fragment>
    }
  `},ct={uniforms:{uSunDir:{value:new l(1,0,0)}},vertexShader:`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec3 c = cross(vec3(0.0, 1.0, 0.0), normal);
      vec3 tangent = length(c) > 0.01 ? normalize(c) : vec3(1.0, 0.0, 0.0);
      vTangent = normalize(mat3(modelMatrix) * tangent);
      vBitangent = normalize(cross(vNormal, vTangent));
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform sampler2D uCloudTex;
    uniform vec3 uSunDir;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;

    void main() {
      // earth_clouds_trans is a TRANSPARENCY map (white = clear sky) -> invert to cloud density
      float c = 1.0 - texture2D(uCloudTex, vUv).r;
      float opacity = smoothstep(0.42, 0.95, c) * 0.9;
      if (opacity < 0.01) discard;

      // Soft 3D cloud-top bump shading via finite differences
      vec2 stepUv = vec2(1.0 / 1024.0, 1.0 / 512.0);
      float cR = 1.0 - texture2D(uCloudTex, vUv + vec2(stepUv.x, 0.0)).r;
      float cU = 1.0 - texture2D(uCloudTex, vUv + vec2(0.0, stepUv.y)).r;
      vec3 cloudNormal = normalize(vNormal + vTangent * (c - cR) * 0.9 + vBitangent * (c - cU) * 0.9);

      vec3 sunDir = normalize(uSunDir);
      float geoNdotL = dot(normalize(vNormal), sunDir);
      float cloudNdotL = max(0.0, dot(cloudNormal, sunDir));

      float dayMask = smoothstep(-0.14, 0.18, geoNdotL);
      // Warm sunset tint on clouds near terminator
      float sunsetFactor = exp(-pow(geoNdotL * 5.0, 2.0));
      vec3 cloudTint = mix(vec3(0.96, 0.98, 1.0), vec3(1.0, 0.76, 0.58), sunsetFactor * 0.55);

      vec3 col = cloudTint * (cloudNdotL * 0.72 + 0.12) * dayMask;
      gl_FragColor = vec4(col, opacity * (0.15 + 0.85 * dayMask));
          gl_FragColor.rgb = pow(max(gl_FragColor.rgb, vec3(0.0)), vec3(2.2)); // displayColor
          #include <colorspace_fragment>
    }
  `},ut={uniforms:{uColor:{value:new $("#388aff")},uSunDir:{value:new l(1,0,0)}},vertexShader:`
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform vec3 uColor;
    uniform vec3 uSunDir;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      // Mesh uses THREE.BackSide, so inward normal facing camera is -vNormal
      vec3 outNormal = normalize(vNormal);
      float rim = clamp(dot(-outNormal, viewDir), 0.0, 1.0);

      // At outer edge of atmosphere sphere, rim == 0.0 -> strictly 0.0 alpha (NO hard ring!)
      float density = pow(rim, 2.1) * smoothstep(0.0, 0.38, rim) * exp(-rim * 3.2) * 3.6;

      float sunDot = dot(outNormal, normalize(uSunDir));
      float sunFacing = smoothstep(-0.28, 0.48, sunDot);

      vec3 col = mix(uColor * 0.65, uColor * 1.25, sunFacing);
      float alpha = clamp(density * sunFacing, 0.0, 1.0);

      gl_FragColor = vec4(col, alpha);
          gl_FragColor.rgb = pow(max(gl_FragColor.rgb, vec3(0.0)), vec3(2.2)); // displayColor
          #include <colorspace_fragment>
    }
  `};new l(0,0,0),new l(0,1,0);const Ht={uniforms:{uSunPos:{value:new l(0,0,0)},uTint:{value:new $("#ffffff")},uLimbColor:{value:new $("#000000")}},vertexShader:`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec3 c = cross(vec3(0.0, 1.0, 0.0), normal);
      vec3 tangent = length(c) > 0.01 ? normalize(c) : vec3(1.0, 0.0, 0.0);
      vTangent = normalize(mat3(modelMatrix) * tangent);
      vBitangent = normalize(cross(vNormal, vTangent));
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform sampler2D uMap;
    uniform vec3 uSunPos;
    uniform float uBumpScale;
    uniform vec3 uTint;
    uniform vec3 uLimbColor;
    uniform float uLimbStrength;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;

    void main() {
      vec3 geoNormal = normalize(vNormal);
      vec3 T = normalize(vTangent);
      vec3 B = normalize(vBitangent);

      // Finite-difference surface relief for crisp terminator craters/canyons/cloud-bands
      vec2 stepUv = vec2(1.0 / 1024.0, 1.0 / 512.0);
      float hL = texture2D(uMap, vUv - vec2(stepUv.x, 0.0)).r;
      float hR = texture2D(uMap, vUv + vec2(stepUv.x, 0.0)).r;
      float hD = texture2D(uMap, vUv - vec2(0.0, stepUv.y)).r;
      float hU = texture2D(uMap, vUv + vec2(0.0, stepUv.y)).r;

      vec3 normal = normalize(geoNormal + T * (hL - hR) * uBumpScale + B * (hD - hU) * uBumpScale);

      vec3 sunDir = normalize(uSunPos - vWorldPos);
      float geoNdotL = dot(geoNormal, sunDir);
      float NdotL = max(0.0, dot(normal, sunDir));

      float dayMask = smoothstep(-0.08, 0.14, geoNdotL);
      float diffuse = pow(NdotL, 0.92) * dayMask;

      vec3 albedo = texture2D(uMap, vUv).rgb * uTint;

      float fresnel = 1.0 - max(0.0, dot(geoNormal, vViewDir));
      vec3 limbGlow = uLimbColor * pow(fresnel, 3.4) * smoothstep(-0.15, 0.45, geoNdotL) * uLimbStrength;

      // Pitch-black shadow side matching Reference Images 2 & 5
      vec3 col = albedo * (diffuse * 1.08 + 0.0012) + limbGlow;
      gl_FragColor = vec4(col, 1.0);
          gl_FragColor.rgb = pow(max(gl_FragColor.rgb, vec3(0.0)), vec3(2.2)); // displayColor
          #include <colorspace_fragment>
    }
  `},xa=1.6,_n=new URL("../textures/solar/",location.href).href,Z={sun:{r:12,x:0},mercury:{a:25,r:1.2,x:34,spin:.003,tilt:.03,atmo:null},venus:{a:-35,r:2.2,x:52,spin:-.002,tilt:.05,atmo:[1,.85,.55,.9]},earth:{a:15,r:2.4,x:72,spin:.042,tilt:.41,atmo:[.35,.6,1,1.2]},mars:{a:-20,r:1.6,x:90,spin:.041,tilt:.44,atmo:[1,.55,.35,.5]},belt:{a:8,r:.9,x:105,spin:.11,tilt:.07,atmo:null,label:"Ceres"},jupiter:{a:35,r:7,x:150,spin:.101,tilt:.05,atmo:[1,.85,.7,.5]},saturn:{a:-25,r:5.6,x:195,spin:.094,tilt:.47,atmo:[1,.9,.7,.45]},uranus:{a:30,r:3.4,x:232,spin:-.058,tilt:1.7,atmo:[.6,.95,1,.8]},neptune:{a:-15,r:3.3,x:262,spin:.063,tilt:.49,atmo:[.45,.6,1,.9]}};function Xe(t){const e=Z[t],a=(e.a||0)*Math.PI/180;return new l(Math.cos(a)*e.x,xa,Math.sin(a)*e.x)}const An=new l(-150,62,0),Bn={position:new l(-62,34,0),yaw:-Math.PI/2},Bt={mercury:.387,venus:.723,earth:1,mars:1.524,belt:2.77,jupiter:5.2,saturn:9.58,uranus:19.2,neptune:30.07};function Rt(t){const e=Z[t],a=t==="sun"?e.r*2.4+4:t==="belt"?4.2:e.r*2.05+1.8,o=Xe(t);return{position:new l(o.x-a,0,o.z),yaw:-Math.PI/2}}function Fn(t,e){const{scene:a,renderer:o,rig:r,camera:n}=t;o.toneMapping=mo,o.toneMappingExposure=1.05;const s=new vo(e),i=(d,g=!0)=>u("real/"+d,g),u=(d,g=!0)=>{const y=s.load(_n+d+".jpg");return g&&(y.colorSpace=Re),y.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),y},f=[];let h=1;const p=new l(0,xa,0);let w=null;const v=Nn(o,4096),W=new I(new le(950,64,32),new ye({map:v,side:qe,depthWrite:!1,fog:!1,toneMapped:!1}));W.renderOrder=-10,a.add(W),f.push(()=>W.position.copy(r.position));{const{group:d,uniforms:g}=kn(900,{scale:.45});w=g,a.add(d),f.push((y,S)=>{g.uTime.value=S,g.uPixelScale.value=o.xr.isPresenting?1.3:1,d.position.copy(r.position)})}{const d=[];for(let y=0;y<3;y++){const S=new ke;S.setAttribute("position",new xe(new Float32Array(6),3)),S.setAttribute("color",new xe(new Float32Array([1,1,1,1,.6,.8,1,0]),4));const P=new Vt(S,new Gt({vertexColors:!0,transparent:!0,depthWrite:!1,blending:fe}));P.visible=!1,P.frustumCulled=!1,a.add(P),d.push({line:P,t:0,life:0,a:new l,b:new l})}let g=3;f.push(y=>{if(g-=y,g<=0){g=4+Math.random()*7;const S=d.find(P=>!P.line.visible);if(S){const J=new l(0,0,-1).applyQuaternion(n.getWorldQuaternion(new Ye)).clone().add(new l((Math.random()-.5)*1.6,.35+Math.random()*.5,(Math.random()-.5)*1.6)).normalize();S.a.copy(J).multiplyScalar(400).add(r.position),S.b.set(Math.random()-.5,-.4-Math.random()*.4,Math.random()-.5).normalize().multiplyScalar(160),S.t=0,S.life=.9+Math.random()*.6,S.line.visible=!0}}for(const S of d){if(!S.line.visible)continue;S.t+=y;const P=S.t/S.life;if(P>=1){S.line.visible=!1;continue}const J=S.a.clone().addScaledVector(S.b,P),we=S.a.clone().addScaledVector(S.b,Math.max(0,P-.25)),Fe=S.line.geometry.attributes.position;Fe.setXYZ(0,J.x,J.y,J.z),Fe.setXYZ(1,we.x,we.y,we.z),Fe.needsUpdate=!0,S.line.material.opacity=Math.sin(P*Math.PI)}})}a.add(new go(8425648,.05));const _=new en(16774368,3.2,0,0);_.position.copy(p),a.add(_);const U=new ne({uniforms:{uTime:{value:0}},vertexShader:`varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${St}
      uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 p = normalize(vP);
        float t = uTime;
        // swirl the surface (domain warping) so the plasma looks like it is flowing
        vec3 q = p * 2.0 + vec3(0.0, t * 0.012, 0.0);
        vec3 w = vec3(snoise(q + vec3(1.7, 9.2, 0.0)), snoise(q + vec3(8.3, 2.8, 4.1)), snoise(q + vec3(3.1, 5.7, 7.3)));
        vec3 pw = p * 2.6 + w * 0.6 + vec3(t * 0.01, -t * 0.008, t * 0.006);
        float base = 0.5 + 0.5 * (0.6 * snoise(pw) + 0.3 * snoise(pw * 2.3 + 4.0) + 0.1 * snoise(pw * 5.3 - 2.0));
        // bright plasma veins (ridged noise)
        float r1 = 1.0 - abs(snoise(pw * 1.5 + vec3(t * 0.02)));
        float r2 = 1.0 - abs(snoise(pw * 3.4 - vec3(t * 0.03)));
        float r3 = 1.0 - abs(snoise(pw * 8.0 + vec3(0.0, t * 0.05, 0.0)));
        float veinMask = smoothstep(0.15, 0.7, 0.5 + 0.5 * snoise(p * 1.3 + w * 0.45 + vec3(t * 0.003)));
        float veins = clamp((pow(r1, 7.0) * 1.0 + pow(r2, 9.0) * 0.6 + pow(r3, 12.0) * 0.3) * (0.3 + 0.9 * veinMask), 0.0, 1.0);
        // darker, cooler patches
        float spots = smoothstep(0.25, 0.7, snoise(p * 1.6 + w * 0.3 + vec3(4.0, t * 0.004, 1.0))) * (1.0 - veins);
        vec3 deep = vec3(0.42, 0.04, 0.0);
        vec3 red = vec3(0.92, 0.18, 0.01);
        vec3 orange = vec3(1.0, 0.45, 0.03);
        vec3 yellow = vec3(1.0, 0.82, 0.22);
        vec3 white = vec3(1.0, 0.97, 0.78);
        vec3 col = mix(deep, red, smoothstep(0.0, 0.5, base));
        col = mix(col, orange, smoothstep(0.5, 0.9, base) * (0.5 + 0.5 * veinMask));
        col = mix(col, yellow, veins);
        col = mix(col, white, pow(veins, 2.5) * 0.5);
        col = mix(col, vec3(0.3, 0.03, 0.0), spots * 0.55);
        // fine boiling texture
        col *= 0.82 + 0.3 * (0.5 + 0.5 * snoise(p * 34.0 + vec3(t * 0.08)));
        // fiery rim
        float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(1.0 - mu, 2.2);
        col = mix(col, vec3(1.0, 0.55, 0.1), rim * 0.55);
        col += vec3(1.0, 0.4, 0.05) * pow(1.0 - mu, 6.0) * 0.6;
        gl_FragColor = vec4(col * 1.3, 1.0);
      }`,toneMapped:!1}),Y=new I(new le(Z.sun.r,128,96),U);Y.position.copy(p),a.add(Y);const M=new ne({uniforms:{uTime:{value:0},uDisc:{value:Z.sun.r},uHalf:{value:Z.sun.r*2.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`${St}
      uniform float uTime; uniform float uDisc; uniform float uHalf; varying vec2 vUv;
      void main(){
        vec2 d = (vUv - 0.5) * 2.0 * uHalf;
        float r = length(d) / uDisc;          // 1.0 = edge of the Sun
        if (r < 0.97) discard;
        vec2 dir = d / max(length(d), 1e-4);
        float t = uTime;
        float n1 = 0.5 + 0.5 * snoise(vec3(dir * 3.0, t * 0.12));
        float n2 = 0.5 + 0.5 * snoise(vec3(dir * 11.0, t * 0.35));
        float big = max(0.0, snoise(vec3(dir * 1.4, t * 0.04 + 7.0)));
        float h = 0.035 + 0.09 * pow(n1, 2.0) + 0.04 * n2 + 0.3 * pow(big, 3.0);   // flame height around the rim
        float x = (r - 1.0) / h;
        // flickering tongues: noise that streams outwards
        float tongue = 0.55 + 0.45 * snoise(vec3(dir * 18.0, (r - t * 0.08) * 6.0));
        float flame = exp(-max(x, 0.0) * 2.2) * tongue * smoothstep(0.97, 1.0, r);
        float haze = exp(-(r - 1.0) * 3.5) * 0.35;
        vec3 col = mix(vec3(1.0, 0.85, 0.45), vec3(1.0, 0.28, 0.02), clamp(x, 0.0, 1.0)) * flame * 1.4
                 + vec3(1.0, 0.35, 0.05) * haze;
        gl_FragColor = vec4(col, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:fe,toneMapped:!1}),z=new I(new Da(Z.sun.r*4.4,Z.sun.r*4.4),M);z.position.copy(p),a.add(z);let A=Z.sun.r,N=1;const H=En(je([255,150,60],[255,70,0],.35),130,p);H.material.opacity=.75,a.add(H);const K=new l;f.push((d,g)=>{U.uniforms.uTime.value=g,M.uniforms.uTime.value=g,Y.rotation.y+=d*.0017,n.getWorldPosition(K),z.lookAt(K);const y=Math.max(K.distanceTo(p),A*1.05);M.uniforms.uDisc.value=A*y/Math.sqrt(y*y-A*A),M.uniforms.uHalf.value=A*2.2,H.scale.setScalar(130*N*(1+.025*Math.sin(g*.7)))});const te={},E={},C=[],R=[];function b(d,g){const y=Z[d],S=new Te;S.position.copy(Xe(d)),S.rotation.z=y.tilt*.8,S.rotation.x=y.tilt*.6,a.add(S);const P=new I(new le(y.r,d==="belt"?48:96,d==="belt"?32:64),g);P.name=d,S.add(P),te[d]=P,E[d]=S,R.push({mesh:P,speed:y.spin,boost:0});const J=Un(y.label||d,y,d);return C.push(J),a.add(J),P}const oe=(d,g={})=>new Ue({map:u(d),roughness:1,metalness:0,...g}),L={value:p},k=d=>(d.wrapS=on,d),O=(d,g={})=>new ne({uniforms:{uMap:{value:k(i(d))},uSunPos:L,uBumpScale:{value:g.bumpScale??2},uTint:{value:new $(g.tint||"#ffffff")},uLimbColor:{value:new $(g.limbColor||"#000000")},uLimbStrength:{value:g.limbStrength??0}},vertexShader:Ht.vertexShader,fragmentShader:Ht.fragmentShader});b("mercury",O("mercury",{bumpScale:2.8,tint:"#d8cfc8"})),b("venus",O("venus",{bumpScale:1.4,tint:"#ffdfa8",limbColor:"#ffbe66",limbStrength:.42}));const q={value:new l(1,0,0)},re=k(i("earth_day")),B=k(i("earth_clouds_trans",!1)),ce=new ne({uniforms:{uDayTex:{value:re},uNightTex:{value:k(i("earth_lights"))},uSpecTex:{value:k(i("earth_spec",!1))},uNormalMap:{value:k(i("earth_normal",!1))},uCloudTex:{value:B},uHasNormal:{value:1},uSunDir:q},vertexShader:lt.vertexShader,fragmentShader:lt.fragmentShader}),G=b("earth",ce),D=new I(new le(Z.earth.r*1.009,96,64),new ne({uniforms:{uCloudTex:{value:B},uSunDir:q},vertexShader:ct.vertexShader,fragmentShader:ct.fragmentShader,transparent:!0,depthWrite:!1}));G.add(D),G.add(new I(new le(Z.earth.r*1.032,64,48),new ne({uniforms:{uColor:{value:new $("#429eff")},uSunDir:q},vertexShader:ut.vertexShader,fragmentShader:ut.fragmentShader,transparent:!0,side:qe,blending:fe,depthWrite:!1})));const T=new l;f.push(()=>q.value.copy(p).sub(G.getWorldPosition(T)).normalize()),b("mars",O("mars",{bumpScale:3.2,tint:"#ff9d6e",limbColor:"#e87846",limbStrength:.35})),b("jupiter",O("jupiter",{bumpScale:1.9,tint:"#f5dfc6",limbColor:"#d4b48c",limbStrength:.25})),b("saturn",O("saturn",{bumpScale:1,tint:"#fff4e2",limbColor:"#d9b98a",limbStrength:.25})),b("uranus",O("uranus",{bumpScale:.8,tint:"#a8ecff",limbColor:"#6ad8ff",limbStrength:.35})),b("neptune",O("neptune",{bumpScale:1.1,tint:"#6e9eff",limbColor:"#3d78ff",limbStrength:.38})),b("belt",O("moon",{bumpScale:3.6,tint:"#a09a92"}));const Q=jn(),V=Gn(Z.saturn.r*1.24,Z.saturn.r*2.3,te.saturn,p);E.saturn.add(V);const ie=On(Z.uranus.r*1.6,Z.uranus.r*2,qn(),te.uranus,p,.5);E.uranus.add(ie);const ae={},Se={},F=(d,g)=>oe(d,{});x("earth",O("moon",{bumpScale:3.4,tint:"#e0dcd5"}),.6,9.5,.02,.25,null,1.2),x("mars",F("rockmoon"),.22,3,.06,.1,[1,.75,.85]),x("mars",F("rockmoon"),.15,4.6,.035,-.2,[1,.8,.9]),x("jupiter",F("io"),.55,11,.05,.05),x("jupiter",F("europa"),.48,14,.035,.12),x("jupiter",F("ganymede"),.8,20,.025,-.08),x("jupiter",F("callisto"),.72,24,.016,.15),x("saturn",F("titan"),.7,19,.02,.35,null,2.4),x("neptune",F("triton"),.45,11,-.03,.3);function x(d,g,y,S,P,J,we,Fe=Math.random()*6.28){const Ne=new Te;(ae[d]||(ae[d]=[])).push(Ne),P=-Math.abs(P),Ne.position.copy(E[d].position),Ne.rotation.z=J,Ne.rotation.y=Fe;const he=new I(new le(y,40,24),g);return we&&he.scale.set(...we),he.position.set(0,0,-S),Ne.add(he),a.add(Ne),R.push({mesh:Ne,speed:P,boost:0}),(Se[d]||(Se[d]=[])).push({obj:he,r:y}),he}const de=[];for(const d of["earth","mars","jupiter","saturn","neptune"]){const g=Se[d]||[],y=te[d],S=d==="saturn"?{mesh:V,inner:Z.saturn.r*1.24,outer:Z.saturn.r*2.3,texture:Q}:null;y.material.isMeshStandardMaterial&&(ba(y.material,p,g,S),de.push(y.material));for(const P of g)P.obj.material.isMeshStandardMaterial&&(ba(P.obj.material,p,[{obj:y,r:Z[d].r},...g.filter(J=>J!==P)]),de.push(P.obj.material))}f.push(()=>{for(const d of de)d.userData.updateShadows()});let se;{const d=new Pa(1,1),g=d.attributes.position;for(let he=0;he<g.count;he++){const Ee=.75+Math.random()*.45;g.setXYZ(he,g.getX(he)*Ee,g.getY(he)*Ee*.8,g.getZ(he)*Ee)}d.computeVertexNormals();const y=1100,S=new Ra(d,new Ue({color:9207924,roughness:1,flatShading:!0}),y),P=new Pt,J=new Ye,we=new wo,Fe=new l,Ne=new l;for(let he=0;he<y;he++){const Ee=Math.random()*Math.PI*2,Va=99+Math.random()*12+(Math.random()-.5)*3;Fe.set(Math.cos(Ee)*Va,(Math.random()-.5)*3*(.5+Math.random()),Math.sin(Ee)*Va),we.set(Math.random()*6,Math.random()*6,Math.random()*6),J.setFromEuler(we);const ia=.06+Math.pow(Math.random(),3)*.55;Ne.set(ia,ia,ia),P.compose(Fe,J,Ne),S.setMatrixAt(he,P),S.setColorAt(he,new $().setHSL(.07+Math.random()*.04,.15+Math.random()*.15,.3+Math.random()*.25))}se=new Te,se.position.copy(p),se.add(S),a.add(se),f.push(he=>se.rotation.y+=he*.002*h)}const me=[],He={};for(const[d,g]of Object.entries(Z)){if(d==="sun"||d==="belt")continue;const y=[];for(let P=0;P<=256;P++){const J=P/256*Math.PI*2;y.push(new l(Math.cos(J)*g.x,0,Math.sin(J)*g.x))}const S=new Vt(new ke().setFromPoints(y),new Gt({color:8369407,transparent:!0,opacity:.12,depthWrite:!1}));me.push(S.material),S.position.copy(p),a.add(S),He[d]=S}let gt=null;{const d=new Te,g=new I(new jt(1.2,1.05,.06,72),new Ue({color:1581621,metalness:.7,roughness:.35,emissive:660516,emissiveMap:Wn(),emissiveIntensity:3}));g.position.y=-.035;const y=new I(new tn(1.18,.018,12,96),new ye({color:2282478,toneMapped:!1}));y.rotation.x=Math.PI/2,y.position.y=0;const S=new I(new an(1.6,64),new ye({map:je([60,200,255],[0,80,160],.6),transparent:!0,depthWrite:!1,blending:fe,opacity:.45}));S.rotation.x=-Math.PI/2,S.position.y=-.09,d.add(g,y,S),r.add(d),gt={pad:d,base:g,rim:y,glow:S},f.push((P,J)=>y.material.color.setHSL(.52,.85,.5+.08*Math.sin(J*1.6)))}const We=new ve(new ge({map:Ln(),transparent:!0,depthWrite:!1,depthTest:!1,blending:fe,toneMapped:!1}));We.renderOrder=15,We.visible=!1,a.add(We);let Ia=1;const Xo=new l;f.push((d,g)=>{const y=n.getWorldPosition(Xo);for(const P of C){const J=P.position.distanceTo(y),we=Math.min(5,Math.max(1,J/45));P.scale.set(P.userData.w*we,P.userData.w/4*we,1)}const S=Math.min(1,Math.max(0,(r.position.y-5)/60));for(const P of me)P.opacity=.12+.3*S;if(We.visible){const P=We.position.distanceTo(y);We.scale.setScalar(Math.max(Ia,P*.06)*(1+.12*Math.sin(g*4)))}});const Oa=Pn(a,p);return f.push((d,g)=>Oa.update(d,g)),f.push(d=>{for(const g of R)g.mesh.rotation.y+=(g.speed*h+g.boost)*d,g.boost*=Math.pow(.35,d)}),{bodies:te,tilts:E,sun:Y,sunPos:p,moonsOf:ae,comet:Oa,satRingTex:Q,skyTexture:v,earthMap:re,saturnMap:te.saturn.material.uniforms.uMap.value,labels:C,orbitLines:me,sunGlow:H,starUniforms:w,setPadGlass(d){const{base:g,rim:y,glow:S}=gt;g.material.transparent=d,g.material.opacity=d?.18:1,g.material.depthWrite=!d,g.material.needsUpdate=!0,S.visible=!d,y.scale.setScalar(d?.6:1),y.material.transparent=d,y.material.opacity=d?.5:1},markDestination(d){if(!d){We.visible=!1;return}const g=Z[d];We.position.copy(Xe(d)),Ia=g.r*3,We.visible=!0},update(d,g){for(const y of f)y(d,g)},setLayout(d){const g=Z.neptune.x/Bt.neptune,y=1-.55*d;for(const P of Object.keys(Bt)){const J=Z[P],we=J.x+(Bt[P]*g-J.x)*d,Fe=J.a*Math.PI/180,Ne=new l(Math.cos(Fe)*we,xa,Math.sin(Fe)*we);E[P].position.copy(Ne),E[P].scale.setScalar(y);for(const Ee of ae[P]||[])Ee.position.copy(Ne),Ee.scale.setScalar(y);He[P]&&He[P].scale.setScalar(we/J.x);const he=C.find(Ee=>Ee.userData.id===P);he.position.copy(Ne).add(new l(0,J.r*y*(P==="saturn"?1.5:1.25)+.6,0)),["mercury","venus","mars","belt"].includes(P)&&(he.material.opacity=1-Math.min(1,Math.max(0,(d-.25)/.35)))}se.scale.setScalar(1+(Bt.belt*g/105-1)*d);const S=1-.86*d;A=Z.sun.r*S,N=1-.6*d,Y.scale.setScalar(S),z.scale.setScalar(S),V.material.uniforms.uPlanetRadius.value=Z.saturn.r*y,ie.material.uniforms.uR.value=Z.uranus.r*y},tintLabels(d){for(const g of C)g.material.color.set(d&&d[g.userData.id]||"#ffffff")},setTimeScale(d){h=d},arrangeMoons(d,g=0){const y=ae[d]||[];y.forEach((S,P)=>{const J=R.find(we=>we.mesh===S);S.rotation.y=-.45-P*2.2/Math.max(1,y.length)+Math.abs(J?J.speed:0)*g})},boost(d,g=2.5){const y=R.find(S=>S.mesh===te[d]);y&&(y.boost=g)},spinnerOf(d){return R.find(g=>g.mesh===te[d])}}}function En(t,e,a){const o=new ve(new ge({map:t,blending:fe,depthWrite:!1,transparent:!0,toneMapped:!1}));return o.scale.setScalar(e),o.position.copy(a),o}function je(t,e,a=.4){const o=document.createElement("canvas");o.width=o.height=256;const r=o.getContext("2d"),n=r.createRadialGradient(128,128,0,128,128,128);n.addColorStop(0,`rgba(${t},0.95)`),n.addColorStop(a*.5,`rgba(${t},0.5)`),n.addColorStop(a,`rgba(${e},0.2)`),n.addColorStop(1,`rgba(${e},0)`),r.fillStyle=n,r.fillRect(0,0,256,256);const s=new Ce(o);return s.colorSpace=Re,s}function Ln(){const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");e.strokeStyle="rgba(255,230,120,0.95)",e.shadowColor="rgba(255,200,60,1)",e.shadowBlur=16,e.lineWidth=7,e.setLineDash([26,14]),e.beginPath(),e.arc(128,128,104,0,Math.PI*2),e.stroke();const a=new Ce(t);return a.colorSpace=Re,a}function Wn(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");e.fillStyle="#000",e.fillRect(0,0,512,512),e.strokeStyle="rgba(34,211,238,0.55)",e.lineWidth=2;for(let o=40;o<256;o+=44)e.beginPath(),e.arc(256,256,o,0,Math.PI*2),e.stroke();for(let o=0;o<12;o++){const r=o/12*Math.PI*2;e.beginPath(),e.moveTo(256+Math.cos(r)*40,256+Math.sin(r)*40),e.lineTo(256+Math.cos(r)*250,256+Math.sin(r)*250),e.stroke()}const a=new Ce(t);return a.colorSpace=Re,a}function Un(t,e,a){const o=document.createElement("canvas");o.width=512,o.height=128;const r=o.getContext("2d");r.font='bold 64px "Trebuchet MS", system-ui, sans-serif',r.textAlign="center",r.textBaseline="middle",r.shadowColor="rgba(0,0,0,0.9)",r.shadowBlur=12,r.fillStyle="rgba(220,240,255,0.92)",r.fillText(t[0].toUpperCase()+t.slice(1),256,64);const n=new Ce(o);n.colorSpace=Re;const s=new ve(new ge({map:n,transparent:!0,depthWrite:!1,toneMapped:!1})),i=Math.max(2.4,e.r*1.1);return s.scale.set(i,i/4,1),s.userData.w=i,s.userData.id=a,s.position.copy(Xe(a)).add(new l(0,e.r*(a==="saturn"?1.5:1.25)+.6,0)),s}function In(t,e,a){var n;const o=t.onBeforeCompile,r=(n=t.userData).patchKeys||(n.patchKeys=[]);r.push(e),t.onBeforeCompile=(s,i)=>{o.call(t,s,i),a(s)},t.customProgramCacheKey=()=>r.join("+")}function ba(t,e,a,o){const r=Array.from({length:4},()=>new nn),n={uShSun:{value:e},uShSunR:{value:1.6},uOcc:{value:r},uOccN:{value:0},uRingOn:{value:o?1:0},uRingC:{value:new l},uRingN:{value:new l(0,1,0)},uRingIn:{value:o?o.inner:0},uRingOut:{value:o?o.outer:0},uRingTex:{value:o?o.texture:null}},s=new l,i=new l;t.userData.updateShadows=()=>{let u=0;for(const f of a){if(u>=4)break;f.obj.getWorldPosition(s),f.obj.getWorldScale(i),r[u++].set(s.x,s.y,s.z,f.r*Math.max(i.x,i.y,i.z))}n.uOccN.value=u,o&&(o.mesh.getWorldPosition(n.uRingC.value),n.uRingN.value.set(0,0,1).transformDirection(o.mesh.matrixWorld))},In(t,"shadow"+(o?"R":""),u=>{Object.assign(u.uniforms,n),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vShWP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vShWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vShWP; uniform vec3 uShSun; uniform float uShSunR; uniform vec4 uOcc[4]; uniform int uOccN;
        uniform float uRingOn; uniform vec3 uRingC; uniform vec3 uRingN; uniform float uRingIn; uniform float uRingOut; uniform sampler2D uRingTex;
        float vrgShadow(vec3 P) {
          vec3 toS = uShSun - P; float dS = length(toS); vec3 L = toS / dS;
          float as = uShSunR / dS;
          float vis = 1.0;
          for (int i = 0; i < 4; i++) {
            if (i >= uOccN) break;
            vec3 toC = uOcc[i].xyz - P; float dC = length(toC);
            if (dot(toC, L) <= 0.0 || dC > dS || dC < uOcc[i].w * 1.001) continue;
            float ao = asin(min(uOcc[i].w / dC, 1.0));
            float sep = acos(clamp(dot(toC / dC, L), -1.0, 1.0));
            float full = 1.0 - min(1.0, (ao * ao) / (as * as));
            vis *= mix(full, 1.0, smoothstep(abs(ao - as), ao + as, sep));
          }
          if (uRingOn > 0.5) {
            float den = dot(L, uRingN);
            if (abs(den) > 1e-4) {
              float t = dot(uRingC - P, uRingN) / den;
              if (t > 0.0) {
                float rr = length(P + L * t - uRingC);
                if (rr > uRingIn && rr < uRingOut) vis *= 1.0 - 0.85 * texture2D(uRingTex, vec2((rr - uRingIn) / (uRingOut - uRingIn), 0.5)).a;
              }
            }
          }
          return vis;
        }`).replace("#include <lights_fragment_end>",`float vrgSh = vrgShadow(vShWP);
        reflectedLight.directDiffuse *= vrgSh;
        reflectedLight.directSpecular *= vrgSh;
        #include <lights_fragment_end>`)})}function On(t,e,a,o,r,n){const s=new Zt(t,e,192,1),i=s.attributes.position,u=s.attributes.uv;for(let w=0;w<i.count;w++)u.setXY(w,(Math.hypot(i.getX(w),i.getY(w))-t)/(e-t),.5);const f=new l,h=new ne({uniforms:{map:{value:a},uSun:{value:r},uPlanet:{value:f},uR:{value:o.geometry.parameters.radius},uB:{value:n}},vertexShader:`varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
      void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0); vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * vec3(0.0,0.0,1.0)); gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`uniform sampler2D map; uniform vec3 uSun; uniform vec3 uPlanet; uniform float uR; uniform float uB; varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
      void main(){
        vec4 c = texture2D(map, vec2(vUv.x, 0.5));
        vec3 d = normalize(uSun - vWP);
        vec3 oc = vWP - uPlanet;
        float b = dot(oc, d);
        float disc = b * b - (dot(oc, oc) - uR * uR);
        float shadow = (disc > 0.0 && b < 0.0) ? 0.12 : 1.0;
        float lit = 0.45 + 0.55 * abs(dot(normalize(vWN), d));
        gl_FragColor = vec4(c.rgb * shadow * lit * uB, c.a);
        #include <colorspace_fragment>
      }`,transparent:!0,side:zt,depthWrite:!1}),p=new I(s,h);return p.rotation.x=-Math.PI/2,p.onBeforeRender=()=>o.getWorldPosition(f),p}function Vn(t){const e=Math.sin(t*190),a=Math.sin(t*540+1.2),o=Math.sin(t*1480+2.5),r=.5+.22*e+.15*a+.09*o,n=Je(.02,.98,r),s=[.72,.58,.45],i=[.56,.44,.34],u=[.38,.29,.22],f=(h,p,w)=>h.map((v,W)=>v+(p[W]-v)*w);if(t<.08)return[u,Je(0,.08,t)*.22*n];if(t<.28){const h=.5+.5*Math.sin(t*120);return[f(u,i,h),(.18+.38*h)*n]}if(t<.64){const h=.65+.35*Math.sin(t*75)*Math.cos(t*160);return[f(i,s,n*h),(.62+.34*n)*h*Je(.004,.011,Math.abs(t-.39))*Je(.005,.013,Math.abs(t-.51))]}return t<.72?[u,.03]:t<.94?[f(i,s.map(h=>h*.92),n),(.5+.38*n)*Je(.005,.014,Math.abs(t-.85))*Je(.002,.006,Math.abs(t-.92))]:[s,Math.exp(-(((t-.975)*95)**2))*.65]}function Je(t,e,a){const o=Math.min(1,Math.max(0,(a-t)/(e-t)));return o*o*(3-2*o)}function Gn(t,e,a,o){const r=new Zt(t,e,256,1),n=new l,s=new ne({uniforms:{uSunPos:{value:o},uPlanetPos:{value:n},uPlanetRadius:{value:a.geometry.parameters.radius},uInnerRadius:{value:t},uOuterRadius:{value:e}},vertexShader:`varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
      void main(){ vLocalPos = position; vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPos = wp.xyz; vWN = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0)); gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      uniform vec3 uSunPos; uniform vec3 uPlanetPos; uniform float uPlanetRadius; uniform float uInnerRadius; uniform float uOuterRadius;
      varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
      void main() {
        float r = clamp((length(vLocalPos.xy) - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
        // fine ringlets; each set fades out once it is finer than a pixel, so there is no shimmer
        float fw = max(fwidth(r), 1e-5);
        float s1 = sin(r * 190.0) * clamp(1.0 - 114.0 * fw, 0.0, 1.0);
        float s2 = sin(r * 540.0 + 1.2) * clamp(1.0 - 324.0 * fw, 0.0, 1.0);
        float s3 = sin(r * 1480.0 + 2.5) * clamp(1.0 - 888.0 * fw, 0.0, 1.0);
        float s4 = sin(r * 3600.0 + 0.7) * clamp(1.0 - 2160.0 * fw, 0.0, 1.0);
        float s5 = sin(r * 7200.0) * clamp(1.0 - 4320.0 * fw, 0.0, 1.0);
        float fineGaps = smoothstep(0.02, 0.98, 0.5 + 0.22 * s1 + 0.15 * s2 + 0.09 * s3 + 0.04 * s4 + 0.02 * s5);
        float env = 0.0;
        vec3 colWarm = vec3(0.72, 0.58, 0.45), colMid = vec3(0.56, 0.44, 0.34), colDark = vec3(0.38, 0.29, 0.22);
        vec3 ringColor = colMid;
        if (r < 0.08) { env = smoothstep(0.0, 0.08, r) * 0.22 * fineGaps; ringColor = colDark; }
        else if (r < 0.28) { float cB = 0.5 + 0.5 * sin(r * 120.0); env = (0.18 + 0.38 * cB) * fineGaps; ringColor = mix(colDark, colMid, cB); }
        else if (r < 0.64) {
          float bM = 0.65 + 0.35 * sin(r * 75.0) * cos(r * 160.0);
          env = (0.62 + 0.34 * fineGaps) * bM * smoothstep(0.004, 0.011, abs(r - 0.39)) * smoothstep(0.005, 0.013, abs(r - 0.51));
          ringColor = mix(colMid, colWarm, fineGaps * bM);
        } else if (r < 0.72) {
          float inner = smoothstep(0.64, 0.655, r) * smoothstep(0.72, 0.705, r);
          env = mix(0.45 * fineGaps, smoothstep(0.75, 0.95, sin(r * 450.0)) * 0.18, inner);
          ringColor = colDark;
        } else if (r < 0.94) {
          env = (0.5 + 0.38 * fineGaps) * smoothstep(0.005, 0.014, abs(r - 0.85)) * smoothstep(0.002, 0.006, abs(r - 0.92));
          ringColor = mix(colMid, colWarm * 0.92, fineGaps);
        } else { env = exp(-pow((r - 0.975) * 95.0, 2.0)) * 0.65 * (0.6 + 0.4 * s3); ringColor = colWarm; }
        if (env < 0.015) discard;
        // Saturn's shadow falling across the rings
        vec3 toSun = normalize(uSunPos - vWorldPos);
        vec3 toPlanet = uPlanetPos - vWorldPos;
        float proj = dot(toPlanet, toSun);
        float shadow = 1.0;
        if (proj > 0.0) shadow = mix(0.02, 1.0, smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.02, length(vWorldPos + toSun * proj - uPlanetPos)));
        // ice is brighter lit face-on, and glows a little when the Sun shines through from behind
        float lit = 0.75 + 0.45 * abs(dot(normalize(vWN), toSun));
        gl_FragColor = vec4(ringColor * shadow * lit * 1.35, clamp(env, 0.0, 0.92));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,transparent:!0,side:zt,depthWrite:!1}),i=new I(r,s);return i.rotation.x=-Math.PI/2,i.onBeforeRender=()=>a.getWorldPosition(n),i}function To(t){const e=document.createElement("canvas");e.width=1024,e.height=2;const a=e.getContext("2d");for(let r=0;r<1024;r++){const[n,s,i,u]=t(r/1024);a.fillStyle=`rgba(${n|0},${s|0},${i|0},${Math.max(0,Math.min(1,u))})`,a.fillRect(r,0,1,2)}const o=new Ce(e);return o.colorSpace=Re,o}function jn(){return To(t=>{const[e,a]=Vn(t);return[Math.pow(e[0],1/2.2)*255*1.15,Math.pow(e[1],1/2.2)*255*1.15,Math.pow(e[2],1/2.2)*255*1.15,Math.min(.92,a)]})}function qn(){return To(t=>{const e=[.1,.3,.45,.62,.8,.95];let a=0;for(const o of e)a=Math.max(a,Math.exp(-(((t-o)/.012)**2)));return[170,190,200,a*.55]})}const St=`
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`,wt=new l(.62,.22,.75).normalize(),ca=-8,Ft=new l(280,22,280),Hn=3.2;function $n({saturnMap:t,ringTex:e,skyTex:a}){const o=new Dt;o.fog=new xo(8221540,.0085);const r=new wa(16774114,3.4);r.position.copy(wt).multiplyScalar(100),o.add(r);const n=new wa(15124634,.7);n.position.set(-.2,.1,-1).multiplyScalar(100),o.add(n),o.add(new go(10135224,.3));const s=new Te;o.add(s);const i=new I(new le(1900,48,24),new ye({map:a,side:qe,depthWrite:!1,fog:!1,toneMapped:!1,color:12303291}));i.renderOrder=-10,o.add(i);const u=new ve(new ge({map:je([255,250,235],[255,200,120],.25),blending:fe,depthWrite:!1,fog:!1,toneMapped:!1}));u.position.copy(wt).multiplyScalar(1700),u.scale.setScalar(150),o.add(u);const f=new l(180,0,-1e3),h=580,p=720,w=1340,v=new Ue({map:t,roughness:1,metalness:0,fog:!1}),W=new I(new le(h,128,80),v);W.position.copy(f),W.rotation.z=.05,W.renderOrder=-6,s.add(W);const _=new Zt(p,w,512,8),U=_.attributes.position,Y=_.attributes.uv;for(let k=0;k<U.count;k++)Y.setXY(k,(Math.hypot(U.getX(k),U.getY(k))-p)/(w-p),.5);const M=new ne({uniforms:{map:{value:e},uSun:{value:wt},uSat:{value:f},uR:{value:h}},vertexShader:"varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = (wp.xyz - (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`${St}
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
      }`,transparent:!1,blending:rn,side:zt,depthWrite:!1,fog:!1}),z=new I(_,M);z.rotation.x=-Math.PI/2,z.position.set(f.x,(ca-1.6)/100,f.z),z.renderOrder=-5,s.add(z);const A=new l;ba(v,A,[],{mesh:z,inner:p,outer:w,texture:e}),v.userData.shadowSunR=1;const N={value:new l},H={value:0},K={value:Ft};function te(k,O){let q=new Pa(1,k);q.deleteAttribute("normal"),q.deleteAttribute("uv"),q=sn(q);const re=q.attributes.position;for(let B=0;B<re.count;B++){const ce=new l().fromBufferAttribute(re,B),G=1+.24*Math.sin(ce.x*4.1+O)*Math.cos(ce.y*3.7+O*2)+.12*Math.sin(ce.z*8.3+O*3)+.05*Math.sin(ce.x*17+ce.y*13);ce.multiplyScalar(G),re.setXYZ(B,ce.x*1.15,ce.y*.85,ce.z)}return q.computeVertexNormals(),q}function E(k,O,q,re){const B=new Float32Array(O*3),ce=new Float32Array(O*4),G=new Ue({color:16777215,roughness:.62,metalness:0}),D=new Ra(k,G,O),T=new Pt,Q=new Ye,V=new wo,ie=new l,ae=new l,Se=new $;let F=0;for(;F<O;){const x=(Math.random()-.5)*Ft.x,de=(Math.random()-.5)*Ft.z,se=ca+(Math.random()+Math.random()+Math.random()-1.5)*(Ft.y/3),me=q();if(Math.abs(de)<3.5+me&&Math.abs(se-1)<3+me)continue;B.set([x,se,de],F*3);const He=new l().randomDirection();ce.set([He.x,He.y,He.z,(.04+Math.random()*.25)/Math.sqrt(me+.2)],F*4),V.set(Math.random()*6,Math.random()*6,Math.random()*6),Q.setFromEuler(V),ie.set(me,me*(.7+Math.random()*.3),me*(.8+Math.random()*.4)),T.compose(ae,Q,ie),D.setMatrixAt(F,T);const gt=Math.random();Se.setRGB(.97,.95-.04*gt,.9-.07*gt),Math.random()<.15&&Se.multiplyScalar(.55),D.setColorAt(F,Se),F++}return k.setAttribute("aBase",new Ga(B,3)),k.setAttribute("aSpin",new Ga(ce,4)),D.frustumCulled=!1,G.onBeforeCompile=x=>{x.uniforms.uOffset=N,x.uniforms.uTime=H,x.uniforms.uBox=K,x.vertexShader=x.vertexShader.replace("#include <common>",`#include <common>
          attribute vec3 aBase; attribute vec4 aSpin; uniform vec3 uOffset; uniform float uTime; uniform vec3 uBox; varying vec3 vObjP;
          vec3 rotAxis(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }`).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
objectNormal = rotAxis(objectNormal, aSpin.xyz, uTime * aSpin.w);`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObjP = position + aBase * 0.37;
transformed = rotAxis(transformed, aSpin.xyz, uTime * aSpin.w);`).replace("#include <project_vertex>",`
          vec3 wrapPos = aBase;
          wrapPos.xz = mod(aBase.xz - uOffset.xz + uBox.xz * 0.5, uBox.xz) - uBox.xz * 0.5;
          vec4 mvPosition = vec4(transformed, 1.0);
          mvPosition = instanceMatrix * mvPosition;
          mvPosition.xyz += wrapPos;
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;`),x.fragmentShader=x.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vObjP;
${St}`).replace("#include <color_fragment>",`#include <color_fragment>
          float grime = snoise(vObjP * 2.7) * 0.5 + snoise(vObjP * 7.9) * 0.25;
          diffuseColor.rgb *= 0.78 + 0.3 * grime;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), smoothstep(0.55, 0.9, snoise(vObjP * 5.3 + 11.0)) * 0.35);`)},G.customProgramCacheKey=()=>"ringchunks"+re,o.add(D),D}E(te(3,1.7),260,()=>.7+2.4*Math.pow(Math.random(),3),"big"),E(te(1,4.2),2800,()=>.05+.65*Math.pow(Math.random(),2.5),"small");const C=6e3,R=new Float32Array(C*3);for(let k=0;k<C;k++)R.set([(Math.random()-.5)*120,ca+(Math.random()-.5)*18,(Math.random()-.5)*120],k*3);const b=new ke;b.setAttribute("position",new xe(R,3));const oe=new ne({uniforms:{uOffset:N,uTime:H},vertexShader:`uniform vec3 uOffset; uniform float uTime; varying float vA;
      void main(){
        vec3 p = position; p.xz = mod(p.xz - uOffset.xz + 60.0, 120.0) - 60.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float d = -mv.z;
        vA = (0.5 + 0.5 * sin(uTime * 3.0 + position.x * 13.0)) * smoothstep(60.0, 8.0, d);
        gl_PointSize = clamp(60.0 / d, 1.0, 4.0);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:"varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * vA * smoothstep(0.5, 0.0, d), 1.0); }",transparent:!0,depthWrite:!1,blending:fe}),L=new it(b,oe);return L.frustumCulled=!1,o.add(L),{scene:o,start:{position:new l(0,0,0),yaw:-Math.PI/2},update(k,O,q){var re,B;H.value=O,N.value.x+=Hn*k,s.position.copy(q.position).add(new l(0,1.6,0)),i.position.copy(q.position),u.position.copy(wt).multiplyScalar(1700).add(q.position),A.copy(wt).multiplyScalar(1e6).add(s.position),s.updateMatrixWorld(!0),(B=(re=v.userData).updateShadows)==null||B.call(re)}}}const Ae=6371,Qn=Math.PI/180,nt={lat:-33.96,lon:18.4},ua={lon0:17.8,lon1:19.4,lat0:-34.45,lat1:-33.5},Yn={lon0:12,lon1:26,lat0:-36,lat1:-28},Xa={lon0:18.3,lon1:18.56,lat0:-34.2,lat1:-33.88},Ut=1.5,da=new URL("../textures/cape/",location.href).href;function $t(t,e){const a=(90-t)*Qn,o=(e+180)/360*Math.PI*2;return new l(-Math.cos(o)*Math.sin(a),Math.cos(a),Math.sin(o)*Math.sin(a))}const rt=$t(nt.lat,nt.lon),yt=$t(nt.lat,nt.lon+.01).sub($t(nt.lat,nt.lon-.01)).normalize(),It=new l().crossVectors(rt,yt).normalize();function ya(t,e,a=0){const o=$t(t,e).multiplyScalar(Ae+a).sub(rt.clone().multiplyScalar(Ae));return new l(o.dot(yt),o.dot(rt),-o.dot(It))}const Co=9e3,Po=7,Xn=.62,Kn=Math.asin(19/(Ae+Po)),Zn=t=>t*t*t*(t*(6*t-15)+10);function Ka(t){const e=Zn(Math.min(1,Math.max(0,t))),a=Math.exp(Math.log(Co)*(1-e)+Math.log(Po)*e),o=Math.exp(Math.log(Xn)*(1-e)+Math.log(Kn)*e);return{a,H:new l(-(Ae+a)*Math.sin(o),-Ae+(Ae+a)*Math.cos(o),0)}}const fa=new l(-.41,.574,-.709).normalize();function pa(t,e,a,o,r,n=.06,s=t,i=null){const u=new Float32Array(e*a*3),f=new Float32Array(e*a*2),h=new Float32Array(e*a*4);for(let v=0;v<a;v++){const W=1-v/(a-1),_=t.lat0+W*(t.lat1-t.lat0);for(let U=0;U<e;U++){const Y=U/(e-1),M=t.lon0+Y*(t.lon1-t.lon0),z=v*e+U;let A=r;if(o){const K=o[z];A+=K>0?K*Ut/1e3:0}let N=Math.min(1,Math.min(Y,1-Y,W,1-W)/n);if(N=N*N*(3-2*N),i){const K=(M-i.lon0)/(i.lon1-i.lon0),te=(_-i.lat0)/(i.lat1-i.lat0),E=Math.min(K,1-K,te,1-te);E>0&&(N*=1-Math.min(1,Math.max(0,E-.02)/.06),A-=.04*Math.min(1,E/.06))}const H=ya(_,M,A);u.set([H.x,H.y,H.z],z*3),f.set([(M-s.lon0)/(s.lon1-s.lon0),(_-s.lat0)/(s.lat1-s.lat0)],z*2),h.set([1,1,1,N],z*4)}}const p=[];for(let v=0;v<a-1;v++)for(let W=0;W<e-1;W++){const _=v*e+W,U=_+1,Y=_+e,M=Y+1;p.push(_,Y,U,U,Y,M)}const w=new ke;return w.setAttribute("position",new xe(u,3)),w.setAttribute("uv",new xe(f,2)),w.setAttribute("color",new xe(h,4)),w.setIndex(p),w.computeVertexNormals(),w}function Jn(t,e){const a=document.createElement("canvas");a.width=640,a.height=e?176:112;const o=a.getContext("2d");o.fillStyle="rgba(8,14,28,0.72)",o.beginPath(),o.roundRect(6,6,628,a.height-12,36),o.fill(),o.textAlign="center",o.textBaseline="middle",o.fillStyle="#ffffff",o.font='bold 56px "Trebuchet MS", system-ui, sans-serif',o.fillText(t,320,e?66:58,600),e&&(o.fillStyle="#9fd8ff",o.font='38px "Trebuchet MS", system-ui, sans-serif',o.fillText(e,320,130,600));const r=new Ce(a);r.colorSpace=Re;const n=new ve(new ge({map:r,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}));return n.renderOrder=30,n.userData.aspect=a.width/a.height,n}function er(){const t=document.createElement("canvas");t.width=t.height=128;const e=t.getContext("2d");for(let a=0;a<26;a++){const o=64+(Math.random()-.5)*60,r=64+(Math.random()-.5)*40,n=14+Math.random()*26,s=e.createRadialGradient(o,r,0,o,r,n);s.addColorStop(0,"rgba(255,255,255,0.5)"),s.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=s,e.fillRect(0,0,128,128)}return new Ce(t)}function tr({earthMap:t,skyTex:e,renderer:a}){const o=new Dt;o.fog=new xo(12044508,0);const r=new Te;o.add(r);const n=Math.min(8,a.capabilities.getMaxAnisotropy()),s=new vo,i=(C,R=!0)=>new Promise(b=>s.load(da+C,oe=>{R&&(oe.colorSpace=Re),oe.anisotropy=n,b(oe)},void 0,()=>b(null))),u=new wa(16774374,3);u.position.copy(fa).multiplyScalar(100),o.add(u),o.add(new ln(11061503,6181956,.55));const f=new ne({uniforms:{uStars:{value:e},uAlt:{value:Co},uSun:{value:fa},uDip:{value:0}},vertexShader:"varying vec3 vDir; varying vec2 vUv; void main(){ vDir = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D uStars; uniform float uAlt; uniform vec3 uSun; uniform float uDip; varying vec3 vDir; varying vec2 vUv;
      void main(){
        vec3 d = normalize(vDir);
        float el = asin(clamp(d.y, -1.0, 1.0)) + uDip; // height above the true horizon
        float air = 1.0 - smoothstep(25.0, 110.0, uAlt);
        vec3 zen = mix(vec3(0.015, 0.04, 0.14), vec3(0.12, 0.3, 0.66), smoothstep(40.0, 4.0, uAlt));
        vec3 hor = vec3(0.68, 0.8, 0.93);
        vec3 sky = mix(zen, hor, exp(-max(el, 0.0) * 5.0));
        float s = max(dot(d, uSun), 0.0);
        sky += vec3(1.0, 0.92, 0.75) * (pow(s, 12.0) * 0.18);
        vec3 stars = texture2D(uStars, vUv).rgb * 0.85;
        vec3 col = mix(stars, sky, air);
        // the thin blue line of the atmosphere seen edge-on from space
        col += vec3(0.3, 0.55, 1.0) * exp(-abs(el) * 45.0) * (1.0 - air) * 0.7;
        col += vec3(1.0, 0.96, 0.85) * pow(s, 900.0) * 3.0; // the Sun's disc
        gl_FragColor = vec4(col, 1.0);
      }`,side:qe,depthWrite:!1,fog:!1,toneMapped:!0}),h=new I(new le(1800,64,32),f);h.renderOrder=-10,o.add(h);const p=new Ue({map:t,roughness:.75,metalness:0}),w=new I(new le(Ae-5,192,110),p),v=new Pt().set(yt.x,yt.y,yt.z,0,rt.x,rt.y,rt.z,0,-It.x,-It.y,-It.z,0,0,0,0,1);w.quaternion.setFromRotationMatrix(v),w.position.set(0,-Ae,0),r.add(w);const W=new ne({uniforms:{uSun:{value:fa},uOn:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; varying vec3 vWN; void main(){ vN = normalize(normalMatrix * normal); vWN = normalize(mat3(modelMatrix) * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uSun; uniform float uOn; varying vec3 vN; varying vec3 vV; varying vec3 vWN;
      void main(){ float rim = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0); float lit = smoothstep(-0.3, 0.4, dot(normalize(vWN), uSun));
        gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * pow(rim, 4.0) * 1.6 * lit * uOn, 1.0); }`,transparent:!0,depthWrite:!1,blending:fe,fog:!1}),_=new I(new le(Ae+70,128,64),W);_.position.set(0,-Ae,0),r.add(_);const U=[],Y=[];let M=null;function z(){return M||(M=(async()=>{const[C,R,b,oe,L,k,O,q]=await Promise.all([i("region.jpg"),i("region_n.jpg",!1),i("detail.jpg"),i("detail_n.jpg",!1),i("detail_rough.jpg",!1),i("detail_a.jpg",!1),fetch(da+"detail_h.bin").then(V=>V.arrayBuffer()),fetch(da+"pen_h.bin").then(V=>V.arrayBuffer())]),re=new I(pa(Yn,180,104,null,-.3,.16),new Ue({map:C,normalMap:R,normalScale:new _e(1.4,1.4),roughness:.8,metalness:0,vertexColors:!0,transparent:!0}));re.renderOrder=1,r.add(re);const B=new Int16Array(O),ce=new Ue({map:b,normalMap:oe,roughnessMap:L,alphaMap:k,roughness:1,metalness:0,vertexColors:!0,transparent:!0}),G=new I(pa(ua,321,241,B,0,.05,ua,Xa),ce);G.renderOrder=2,r.add(G);const D=new I(pa(Xa,241,321,new Int16Array(q),0,.08,ua),ce);D.renderOrder=3,r.add(D);const T=(V,ie,ae,Se,F)=>{const x=Jn(V,ie);x.position.copy(ya(ae,Se,F)),r.add(x),U.push(x)};T("Table Mountain","1 085 m high",-33.9575,18.405,1.085*Ut+.9),T("Lion's Head",null,-33.9351,18.389,.67*Ut+.6),T("Cape Town","city centre",-33.922,18.423,.9),T("Robben Island",null,-33.806,18.366,.6),T("Cape Point",null,-34.357,18.497,.9),T("False Bay",null,-34.2,18.65,.5),T("Stellenbosch",null,-33.935,18.86,.9),T("Table Bay",null,-33.87,18.43,.4),T("Atlantic Ocean",null,-34.05,18.15,.4);const Q=er();for(let V=0;V<34;V++){const ie=V/33,ae=new ve(new ge({map:Q,transparent:!0,depthWrite:!1,opacity:0,fog:!0}));ae.userData={t:ie,phase:Math.random(),size:.6+Math.random()*.5},ae.renderOrder=10,r.add(ae),Y.push(ae)}})(),M)}let A="idle",N=0,H=null;const K=new l,te=new l;function E(C,R,b,oe){if(A==="down"){if(N=Math.min(1,N+b/24),N>=1){A="hover";const G=H;H=null,G&&G()}}else if(A==="up"&&(N=Math.max(0,N-b/13),N<=0)){A="idle";const G=H;H=null,G&&G()}const{a:L,H:k}=Ka(N),O=200/L;K.copy(C.position).add(new l(0,1.6,0)),r.scale.setScalar(O),r.position.copy(K).addScaledVector(k,-O),h.position.copy(C.position);const q=.0085*Math.pow(Math.min(1,30/L),.9);o.fog.density=q/O,f.uniforms.uAlt.value=L,f.uniforms.uDip.value=Math.acos(Ae/(Ae+L)),W.uniforms.uOn.value=Pe.smoothstep(L,60,160);const re=1-Pe.smoothstep(L,60,140);R.getWorldPosition(te);for(const G of U){G.visible=re>.02,G.material.opacity=re;const T=G.getWorldPosition(new l).distanceTo(te)*.16/O;G.scale.set(T,T/G.userData.aspect,1)}const B=[-33.9545,18.392],ce=[-33.9575,18.42];for(const G of Y){const D=(G.userData.phase+oe*.035)%1,T=B[0]+(ce[0]-B[0])*G.userData.t+.006-D*.012,Q=B[1]+(ce[1]-B[1])*G.userData.t,V=1.06*Ut+.22-Math.max(0,D-.45)*1.2;G.position.copy(ya(T,Q,V)),G.scale.setScalar(G.userData.size),G.material.opacity=Math.sin(D*Math.PI)*.9*re}}return{scene:o,start:{position:new l(0,0,0),yaw:-Math.PI/2},load:z,altitude:()=>Ka(N).a,descend(C){N=0,A="down",H=C},ascend(C){A="up",H=C},reset(){N=0,A="idle"},skip(){A==="down"&&(N=.999)},setProgress(C){N=C},get mode(){return A},update:E}}const Za=Pe.degToRad(23.4),Ja={lat:-33.92,lon:18.42},eo=["January","February","March","April","May","June","July","August","September","October","November","December"],to=[0,31,59,90,120,151,181,212,243,273,304,334],et=354,Et=14,ao=22,oo=3.2,tt=new l(-.12,0,-1).normalize(),ha=new l(3.3,1.45,-.6),ar=.8,Lt=new l(4.4,1,-.75),xt=1.45,or=.2,nr=.36;function ea(t,e){const a=(e+180)/360*Math.PI*2,o=(90-t)/180*Math.PI;return new l(-Math.cos(a)*Math.sin(o),Math.cos(o),Math.sin(a)*Math.sin(o))}function at(t,{color:e="#e8f1ff",size:a=.5,bg:o="rgba(6,12,28,0.78)"}={}){const r=document.createElement("canvas");r.width=1024,r.height=160;const n=r.getContext("2d");n.font='bold 64px "Trebuchet MS", system-ui, sans-serif';const s=Math.min(1e3,n.measureText(t).width+70);n.fillStyle=o,n.beginPath(),n.roundRect((1024-s)/2,22,s,116,58),n.fill(),n.fillStyle=e,n.textAlign="center",n.textBaseline="middle",n.fillText(t,512,82,960);const i=new Ce(r);i.colorSpace=Re;const u=new ve(new ge({map:i,transparent:!0,depthWrite:!1,toneMapped:!1}));return u.scale.set(a*6.4,a,1),u}function rr({earthUniforms:t,skyTex:e,sunMaterial:a}){const o=new Dt,r=new I(new le(500,48,24),new ye({map:e,side:qe,depthWrite:!1,toneMapped:!1}));r.renderOrder=-10,o.add(r);const n=new l(0,Math.cos(Za),0).addScaledVector(tt.clone().negate().setY(0).normalize(),Math.sin(Za)).normalize(),s=new Te,i=new Te;i.quaternion.setFromUnitVectors(new l(0,1,0),n),s.add(i),o.add(s);const u={value:tt.clone()},f=new ne({uniforms:{uHasNormal:{value:1},uDayTex:t.uDayTex,uNightTex:t.uNightTex,uSpecTex:t.uSpecTex,uNormalMap:t.uNormalMap,uCloudTex:t.uCloudTex,uSunDir:u},vertexShader:lt.vertexShader,fragmentShader:lt.fragmentShader}),h=new I(new le(1,96,64),f);i.add(h),h.add(new I(new le(1.009,72,48),new ne({uniforms:{uCloudTex:t.uCloudTex,uSunDir:u},vertexShader:ct.vertexShader,fragmentShader:ct.fragmentShader,transparent:!0,depthWrite:!1}))),i.add(new I(new le(1.032,64,48),new ne({uniforms:{uColor:{value:new $("#429eff")},uSunDir:u},vertexShader:ut.vertexShader,fragmentShader:ut.fragmentShader,transparent:!0,side:qe,blending:fe,depthWrite:!1})));const p=new I(new jt(.012,.012,2.7,8),new ye({color:15266303,transparent:!0,opacity:.85,toneMapped:!1}));i.add(p);const w=at("North Pole",{size:.16});w.position.set(0,1.5,0);const v=at("South Pole",{size:.16});v.position.set(0,-1.5,0),i.add(w,v);const W=at("Axis: tilted 23.4°",{size:.17,color:"#bfe3ff"});o.add(W);const _=ea(Ja.lat,Ja.lon),U=new Te,Y=new I(new le(.035,16,12),new ye({color:16731501,toneMapped:!1}));Y.position.copy(_).multiplyScalar(1.01);const M=new I(new jt(.008,.008,.28,8),new ye({color:16748451,toneMapped:!1}));M.position.copy(_).multiplyScalar(1.14),M.quaternion.setFromUnitVectors(new l(0,1,0),_),U.add(Y,M),h.add(U);const z=new Te,A=a.clone(),N=new I(new le(1,64,48),A),H=new ve(new ge({map:je([255,225,160],[255,170,70],.35),blending:fe,depthWrite:!1,transparent:!0,toneMapped:!1}));H.scale.setScalar(5.5),z.add(N,H);const K=at("The Sun",{size:.5,color:"#fde68a"});K.position.set(0,2.2,0),z.add(K),o.add(z);const te=ha.clone().addScaledVector(tt,40),E=at("Sunlight comes from this side",{size:.2,color:"#fde68a"});E.position.copy(ha).addScaledVector(tt,1.05).add(new l(0,1.05,0)),o.add(E);const C=new Te;C.position.copy(Lt),o.add(C);{const F=[];for(let x=0;x<=128;x++){const de=x/128*Math.PI*2;F.push(new l(Math.cos(de)*xt,0,Math.sin(de)*xt))}C.add(new Vt(new ke().setFromPoints(F),new Gt({color:8369407,transparent:!0,opacity:.55})))}const R=F=>{const x=oe+(F-et)/365.25*Math.PI*2;return new l(Math.cos(x),0,-Math.sin(x))},b=tt.clone().negate().setY(0).normalize(),oe=Math.atan2(-b.z,b.x);[[et,"December: summer in Cape Town","#fca5a5",.24],[171,"June: winter in Cape Town","#93c5fd",.24],[79,"March","#cbd5e1",.17],[265,"September","#cbd5e1",.17]].map(([F,x,de,se])=>{const me=at(x,{color:de,size:se});return me.position.copy(R(F)).multiplyScalar(xt+(se>.2?.2:.3)).add(new l(0,se>.2?.5:-.3,0)),C.add(me),me}),C.visible=!1;let L="idle",k=0,O=0,q=et,re=0,B=null;const ce=[],G=F=>ce.forEach(x=>x(F));new l;const D=new Ye;function T(F){h.rotation.y=F,s.updateMatrixWorld(!0);const x=_.clone().applyQuaternion(h.getWorldQuaternion(D)).normalize(),de=u.value.clone().addScaledVector(n,-u.value.dot(n)),se=x.clone().addScaledVector(n,-x.dot(n)),me=Math.atan2(n.dot(new l().crossVectors(de,se)),de.dot(se));return{hour:(12+Pe.radToDeg(me)/15+24)%24,lit:x.dot(u.value)>0}}function Q(){let F=0,x=99;for(let de=0;de<Math.PI*2;de+=.005){const se=T(de).hour,me=Math.abs(se-5);me<x&&(x=me,F=de)}return F}function V(F){const x=F<.5?4*F**3:1-(-2*F+2)**3/2,de=ha.clone().lerp(Lt.clone().addScaledVector(b,xt),x);s.position.copy(de),s.scale.setScalar(Pe.lerp(ar,or,x)),z.position.copy(te).lerp(Lt,x),N.scale.setScalar(Pe.lerp(1.6,nr,x)),H.scale.setScalar(Pe.lerp(9,1.2,x)),K.position.set(0,Pe.lerp(2.4,.6,x),0),K.scale.set(Pe.lerp(.5,.2,x)*6.4,Pe.lerp(.5,.2,x),1),w.visible=v.visible=x<.3,W.visible=x<.3,E.visible=x<.15,p.scale.y=Pe.lerp(1,1.4,x)}function ie(){s.position.copy(Lt).addScaledVector(R(q),xt)}let ae=0;function Se(F){if(ae+=F,A.uniforms.uTime.value=ae,O+=F,L==="day")k+=Math.PI*2/Et*F,O>=Et&&(L="dayDone",G("dayDone"));else if(L==="zoom")V(Math.min(1,O/oo)),O>=oo&&(L="year",O=0,C.visible=!0,G("yearStart"));else if(L==="year"){const x=Math.min(1,O/ao);re=Math.round(x*365),q=et+x*365.25,ie(),k+=F*9,x>=1&&(L="yearDone",G("yearDone"))}if(h.rotation.y=k,u.value.copy(z.position).sub(s.position).normalize(),W.position.copy(s.position).addScaledVector(n,s.scale.x*1.75).add(new l(0,.05,.55)),L==="day"||L==="dayDone"){const x=T(k).lit;B!==null&&x!==B&&G(x?"sunrise":"sunset"),B=x}}return{scene:o,start:{position:new l(0,0,0),yaw:-Math.PI/2},on(F){ce.push(F)},begin(){V(0),C.visible=!1,u.value.copy(tt),k=Q(),B=null,O=0,q=et,re=0,L="day"},startYear(){L==="zoom"||L==="year"||(O=0,q=et,re=0,L="zoom")},get phase(){return L},info(){const{hour:F,lit:x}=T(k),de=Math.floor((q%365+365)%365);let se=11;for(;se>0&&to[se]>de;)se--;const me=[11,0,1].includes(se)?"summer":se<=4?"autumn":se<=7?"winter":"spring";return{hour:F,lit:x,date:`${de-to[se]+1} ${eo[se]}`,month:eo[se],season:me,daysPassed:re,spinT:L==="day"?O/Et:1}},update:Se,setProgress(F,x){F==="day"?(this.begin(),O=x*Et,k+=x*Math.PI*2):(V(1),C.visible=!0,L="year",O=x*ao),Se(0)}}}const ma=420,sr=new l(1,.12,-.38).normalize();function ir(t){const e=document.createElement("canvas");e.width=e.height=256;const a=e.getContext("2d");a.strokeStyle="rgba(255,235,170,0.95)",a.lineWidth=12,a.beginPath(),a.arc(128,128,110,0,Math.PI*2),a.stroke();const o=new Ce(e);return o.colorSpace=Re,o}function lr(){const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d"),a=e.createRadialGradient(128,128,0,128,128,128);a.addColorStop(0,"rgba(255,255,255,1)"),a.addColorStop(.07,"rgba(255,252,240,1)"),a.addColorStop(.2,"rgba(255,235,190,0.3)"),a.addColorStop(1,"rgba(255,200,120,0)"),e.fillStyle=a,e.fillRect(0,0,256,256),e.globalCompositeOperation="lighter";for(const[r,n]of[[1,0],[0,1]]){const s=e.createLinearGradient(128-r*128,128-n*128,128+r*128,128+n*128);s.addColorStop(0,"rgba(255,240,210,0)"),s.addColorStop(.5,"rgba(255,240,210,0.8)"),s.addColorStop(1,"rgba(255,240,210,0)"),e.fillStyle=s,r?e.fillRect(0,126,256,4):e.fillRect(126,0,4,256)}const o=new Ce(t);return o.colorSpace=Re,o}function no(t,e){const a=document.createElement("canvas");a.width=1024,a.height=128;const o=a.getContext("2d");o.font='bold 60px "Trebuchet MS", system-ui, sans-serif',o.textAlign="center",o.textBaseline="middle",o.shadowColor="rgba(0,0,0,0.9)",o.shadowBlur=10,o.fillStyle=e,o.fillText(t,512,64,1e3);const r=new Ce(a);return r.colorSpace=Re,new ve(new ge({map:r,transparent:!0,depthWrite:!1,toneMapped:!1}))}function cr({neptuneMap:t,skyTex:e}){const a=new Dt,o=new I(new le(900,48,24),new ye({map:e,side:qe,depthWrite:!1,toneMapped:!1,color:12109020}));o.renderOrder=-10,a.add(o);const n=new l(0,1.6,0).clone().addScaledVector(sr,ma),s=new I(new le(9,96,64),new ne({uniforms:{uMap:{value:t},uSunPos:{value:n},uBumpScale:{value:1.1},uTint:{value:new $("#5d8cf0")},uLimbColor:{value:new $("#3d78ff")},uLimbStrength:{value:.3}},vertexShader:Ht.vertexShader,fragmentShader:Ht.fragmentShader}));s.position.set(9,-6.5,9),s.rotation.z=.5,a.add(s);const i=new ve(new ge({map:lr(),blending:fe,depthWrite:!1,transparent:!0,toneMapped:!1}));i.position.copy(n),i.scale.setScalar(2*ma*Math.tan(Pe.degToRad(2.4/2))),a.add(i);const f=new ve(new ge({map:ir(),transparent:!0,depthWrite:!1,toneMapped:!1,opacity:.6,blending:fe}));f.position.copy(n),a.add(f);const h=2*ma*Math.tan(Pe.degToRad(4)),p=no("The Sun","#fde68a");p.position.copy(n).add(new l(0,h*.85,0)),p.scale.set(h*2.4,h*.3,1),a.add(p);const w=no("It looks like a very bright star","#e8f1ff");return w.position.copy(n).add(new l(0,-h*.85,0)),w.scale.set(h*2.6,h*.32,1),a.add(w),{scene:a,start:{position:new l(0,0,0),yaw:-Math.PI/2},update(v,W,_){o.position.copy(_.position),s.rotation.y+=v*.02,f.scale.setScalar(h*(1+.08*Math.sin(W*3)))}}}const zo=-26,Do=-90.4,ur=12742,dr=142984;function Qt(t,{color:e="#e8f1ff",height:a=.3,bg:o="rgba(6,12,28,0.72)",bold:r=!0}={}){const n=document.createElement("canvas");n.width=1024,n.height=160;const s=n.getContext("2d");s.font=`${r?"bold ":""}64px "Trebuchet MS", system-ui, sans-serif`;const i=Math.min(1004,s.measureText(t).width+64);o&&(s.fillStyle=o,s.beginPath(),s.roundRect((1024-i)/2,22,i,116,58),s.fill()),s.fillStyle=e,s.textAlign="center",s.textBaseline="middle",s.fillText(t,512,82,960);const u=new Ce(n);u.colorSpace=Re;const f=new ve(new ge({map:u,transparent:!0,depthWrite:!1,toneMapped:!1}));return f.scale.set(a*6.4,a,1),f.renderOrder=12,f}function ro(t,e="rgba(255,255,255,0.95)"){const a=document.createElement("canvas");a.width=a.height=256;const o=a.getContext("2d");o.strokeStyle=e,o.lineWidth=9,t&&o.setLineDash([20,12]),o.beginPath(),o.arc(128,128,116,0,Math.PI*2),o.stroke();const r=new Ce(a);return r.colorSpace=Re,r}function fr(t,{earthMap:e,sunPos:a,sunR:o}){const n=new le(1,12,8),s=new Ra(n,new ye({map:e,color:new $(1.5,1.7,2.1),toneMapped:!1}),109);s.frustumCulled=!1,s.visible=!1,s.renderOrder=5,t.add(s);const i=new Pt,u=new Ye;new l;const f=new l,h=Array.from({length:109},()=>Math.random()*Math.PI*2);let p=[],w=0,v=0,W=0,_=!1;const U=Qt("About 109 Earths across",{color:"#fde68a",height:1.2});U.visible=!1,t.add(U);function Y(M){for(let z=0;z<109;z++){const A=Math.min(1,Math.max(0,M-z)),N=A<=0?0:A>=1?1:1+Math.sin(A*Math.PI)*.35;u.setFromAxisAngle(new l(0,1,0),h[z]+W*.3),i.compose(p[z],u,f.setScalar(Math.max(1e-4,w/2*N*.94))),s.setMatrixAt(z,i)}s.instanceMatrix.needsUpdate=!0}return{show(M,z=4){const A=M.clone().sub(a),N=A.length();A.normalize();const H=N-o-.8,K=H*Math.tan(Math.asin(o/N));w=2*K/109;const te=new l().crossVectors(A,new l(0,1,0)).normalize(),E=M.clone().addScaledVector(A,-H);p=Array.from({length:109},(C,R)=>E.clone().addScaledVector(te,-K+w*(R+.5))),U.position.copy(E).add(new l(0,K*.32,0)),U.scale.set(K*.9,K*.9/6.4,1),U.visible=!1,this.seconds=z,v=0,W=0,_=!0,s.visible=!0,Y(0)},hide(){_=!1,s.visible=!1,U.visible=!1},update(M){if(!_)return 0;W+=M;const z=Math.floor(v);return v=Math.min(109,v+109/this.seconds*M),Y(v),v>=109&&(U.visible=!0),{count:Math.floor(v),added:Math.floor(v)-z}},get active(){return _},get count(){return Math.floor(v)}}}function pr(t,{earthUniforms:e,sunPos:a}){const o=new Te;o.visible=!1,t.add(o);const r={value:new l(1,0,0)},n=new I(new le(1,64,48),new ne({uniforms:{uHasNormal:{value:1},uDayTex:e.uDayTex,uNightTex:e.uNightTex,uSpecTex:e.uSpecTex,uNormalMap:e.uNormalMap,uCloudTex:e.uCloudTex,uSunDir:r},vertexShader:lt.vertexShader,fragmentShader:lt.fragmentShader}));n.add(new I(new le(1.009,48,32),new ne({uniforms:{uCloudTex:e.uCloudTex,uSunDir:r},vertexShader:ct.vertexShader,fragmentShader:ct.fragmentShader,transparent:!0,depthWrite:!1}))),n.add(new I(new le(1.032,48,32),new ne({uniforms:{uColor:{value:new $("#429eff")},uSunDir:r},vertexShader:ut.vertexShader,fragmentShader:ut.fragmentShader,transparent:!0,side:qe,blending:fe,depthWrite:!1})));const s=new ve(new ge({map:ro(!0,"rgba(147,197,253,0.95)"),transparent:!0,depthWrite:!1,toneMapped:!1})),i=new ve(new ge({map:ro(!1,"rgba(255,190,140,0.9)"),transparent:!0,depthWrite:!1,toneMapped:!1})),u=Qt("Earth, same scale",{color:"#bfdbfe"}),f=Qt("Great Red Spot",{color:"#fecaca"});o.add(n,s,i,u,f);let h=0;return{show(p,w,v){p.updateMatrixWorld(!0);const W=p.getWorldPosition(new l),_=ea(zo,Do).applyQuaternion(p.getWorldQuaternion(new Ye)).multiplyScalar(w).add(W),U=v.clone().sub(_).normalize(),Y=new l().crossVectors(new l(0,1,0),U).normalize().negate(),M=w*(ur/dr),z=_.clone().addScaledVector(Y,w*.3).addScaledVector(U,w*.16),A=v.distanceTo(z)/v.distanceTo(_);n.position.copy(z),r.value.copy(a).sub(z).normalize(),n.scale.setScalar(M*A),n.rotation.y=2.4,s.position.copy(z),s.scale.setScalar(M*A*2.5),u.position.copy(z).add(new l(0,-M*2.1,0)),u.scale.set(M*4.2,M*4.2/6.4,1),i.position.copy(_).addScaledVector(U,.4),i.scale.set(w*.32,w*.21,1),f.position.copy(_).addScaledVector(U,.4).add(new l(0,w*.2,0)),f.scale.set(M*4.2,M*4.2/6.4,1),o.visible=!0,h=0},hide(){o.visible=!1},update(p){if(!o.visible)return;h+=p,n.rotation.y+=p*.15;const w=Math.min(1,h/.8);s.material.opacity=w*(.7+.3*Math.sin(h*3)),i.material.opacity=w*.9},get visible(){return o.visible}}}function hr(t,e){const a=new Te;a.position.set(0,2.02,-2.75),a.visible=!1,t.add(a);const o=new I(new Da(3.1,.012),new ye({color:6809849,transparent:!0,opacity:.5,toneMapped:!1}));o.position.set(-.1,0,-.01),a.add(o);const r=new I(new le(.12,24,16),new ye({color:16761690,toneMapped:!1}));r.position.x=-1.55;const n=new ve(new ge({map:je([255,200,120],[255,100,20],.4),blending:fe,transparent:!0,depthWrite:!1,toneMapped:!1}));n.scale.setScalar(.6),r.add(n),a.add(r);const s=[["mercury",-1.24,.04],["venus",-1.06,.065],["earth",-.86,.068],["mars",-.68,.05],["jupiter",-.06,.17],["saturn",.42,.14],["uranus",.84,.095],["neptune",1.17,.093]],i={};for(const[E,C,R]of s){const b=new I(new le(R,32,20),new ye({map:e[E],color:16777215}));if(b.position.x=C,b.rotation.z=E==="uranus"?1.7:.2,E==="saturn"){const oe=new I(new Zt(R*1.3,R*2.1,48),new ye({color:14270618,side:zt,transparent:!0,opacity:.7}));oe.rotation.x=-Math.PI/2+.45,b.add(oe)}a.add(b),i[E]=b}{const C=new Float32Array(480);for(let b=0;b<160;b++)C[b*3]=-.52+Math.random()*.26,C[b*3+1]=(Math.random()-.5)*.09,C[b*3+2]=(Math.random()-.5)*.09;const R=new ke;R.setAttribute("position",new xe(C,3)),a.add(new it(R,new za({color:13218970,size:.012,toneMapped:!1})))}const u=(E,C,R,b)=>{const oe=[new l(E,R-.05,0),new l(E,R,0),new l(C,R,0),new l(C,R-.05,0)],L=new Vt(new ke().setFromPoints(oe),new Gt({color:b,transparent:!0,toneMapped:!1}));return a.add(L),L},f=u(-1.32,-.6,.15,16628340),h=u(-.26,1.29,.27,6809849),p=u(-.24,.62,.21,16569165),w=u(.72,1.28,.21,9684477),v=(E,C,R,b,oe)=>{const L=Qt(E,{color:b,height:oe});return L.position.set(C,R,0),a.add(L),L},W=v("Rocky inner planets",-.96,.25,"#fdba74",.13),_=v("Giant outer planets",.52,.38,"#67e8f9",.13),U=v("Gas giants",.19,.28,"#fcd34d",.1),Y=v("Ice giants",1,.28,"#93c5fd",.1),M=v("Asteroid belt",-.39,-.15,"#d6c2a6",.1),z=v("Sun",-1.55,-.21,"#fde68a",.1),A=v("Not to scale",1.05,-.2,"#8fa6c9",.08);A.material.opacity=.8;let N=0;const H=["mercury","venus","earth","mars"],K=["jupiter","saturn","uranus","neptune"],te=(E,C)=>{for(const R of E)i[R].scale.setScalar(1+.25*C)};return{group:a,show(){a.visible=!0,N=0},hide(){a.visible=!1},get visible(){return a.visible},update(E){if(!a.visible)return;N+=E;for(const L in i)i[L].rotation.y+=E*.4;const C=(L,k)=>N>L&&N<k?.5+.5*Math.sin((N-L)*5):0;te(H,C(1,6)),te(K,C(6,11));const R=Math.min(1,Math.max(0,N-.6)),b=Math.min(1,Math.max(0,N-5.6)),oe=Math.min(1,Math.max(0,N-8));f.material.opacity=W.material.opacity=R,h.material.opacity=_.material.opacity=b,p.material.opacity=w.material.opacity=U.material.opacity=Y.material.opacity=oe,M.material.opacity=z.material.opacity=Math.min(1,N)}}}const Ro={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class pt{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const mr=new po(-1,1,1,-1,0,1);class vr extends ke{constructor(){super(),this.setAttribute("position",new Ot([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ot([0,2,0,0,2,0],2))}}const gr=new vr;class ka{constructor(e){this._mesh=new I(gr,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,mr)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class wr extends pt{constructor(e,a){super(),this.textureID=a!==void 0?a:"tDiffuse",e instanceof ne?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=qt.clone(e.uniforms),this.material=new ne({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ka(this.material)}render(e,a,o){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=o.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class so extends pt{constructor(e,a){super(),this.scene=e,this.camera=a,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,a,o){const r=e.getContext(),n=e.state;n.buffers.color.setMask(!1),n.buffers.depth.setMask(!1),n.buffers.color.setLocked(!0),n.buffers.depth.setLocked(!0);let s,i;this.inverse?(s=0,i=1):(s=1,i=0),n.buffers.stencil.setTest(!0),n.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),n.buffers.stencil.setFunc(r.ALWAYS,s,4294967295),n.buffers.stencil.setClear(i),n.buffers.stencil.setLocked(!0),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),n.buffers.color.setLocked(!1),n.buffers.depth.setLocked(!1),n.buffers.color.setMask(!0),n.buffers.depth.setMask(!0),n.buffers.stencil.setLocked(!1),n.buffers.stencil.setFunc(r.EQUAL,1,4294967295),n.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),n.buffers.stencil.setLocked(!0)}}class xr extends pt{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class br{constructor(e,a){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),a===void 0){const o=e.getSize(new _e);this._width=o.width,this._height=o.height,a=new bt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Wt}),a.texture.name="EffectComposer.rt1"}else this._width=a.width,this._height=a.height;this.renderTarget1=a,this.renderTarget2=a.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wr(Ro),this.copyPass.material.blending=cn,this.clock=new un}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,a){this.passes.splice(a,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const a=this.passes.indexOf(e);a!==-1&&this.passes.splice(a,1)}isLastEnabledPass(e){for(let a=e+1;a<this.passes.length;a++)if(this.passes[a].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const a=this.renderer.getRenderTarget();let o=!1;for(let r=0,n=this.passes.length;r<n;r++){const s=this.passes[r];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,o),s.needsSwap){if(o){const i=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(i.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(i.EQUAL,1,4294967295)}this.swapBuffers()}so!==void 0&&(s instanceof so?o=!0:s instanceof xr&&(o=!1))}}this.renderer.setRenderTarget(a)}reset(e){if(e===void 0){const a=this.renderer.getSize(new _e);this._pixelRatio=this.renderer.getPixelRatio(),this._width=a.width,this._height=a.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,a){this._width=e,this._height=a;const o=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(o,r),this.renderTarget2.setSize(o,r);for(let n=0;n<this.passes.length;n++)this.passes[n].setSize(o,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class yr extends pt{constructor(e,a,o=null,r=null,n=null){super(),this.scene=e,this.camera=a,this.overrideMaterial=o,this.clearColor=r,this.clearAlpha=n,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new $}render(e,a,o){const r=e.autoClear;e.autoClear=!1;let n,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(n=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:o),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(n),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=r}}const Sr={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new $(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class dt extends pt{constructor(e,a,o,r){super(),this.strength=a!==void 0?a:1,this.radius=o,this.threshold=r,this.resolution=e!==void 0?new _e(e.x,e.y):new _e(256,256),this.clearColor=new $(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let n=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new bt(n,s,{type:Wt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let p=0;p<this.nMips;p++){const w=new bt(n,s,{type:Wt});w.texture.name="UnrealBloomPass.h"+p,w.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(w);const v=new bt(n,s,{type:Wt});v.texture.name="UnrealBloomPass.v"+p,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),n=Math.round(n/2),s=Math.round(s/2)}const i=Sr;this.highPassUniforms=qt.clone(i.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ne({uniforms:this.highPassUniforms,vertexShader:i.vertexShader,fragmentShader:i.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];n=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let p=0;p<this.nMips;p++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[p])),this.separableBlurMaterials[p].uniforms.invSize.value=new _e(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=a,this.compositeMaterial.uniforms.bloomRadius.value=.1;const f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new l(1,1,1),new l(1,1,1),new l(1,1,1),new l(1,1,1),new l(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Ro;this.copyUniforms=qt.clone(h.uniforms),this.blendMaterial=new ne({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:fe,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new $,this.oldClearAlpha=1,this.basic=new ye,this.fsQuad=new ka(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,a){let o=Math.round(e/2),r=Math.round(a/2);this.renderTargetBright.setSize(o,r);for(let n=0;n<this.nMips;n++)this.renderTargetsHorizontal[n].setSize(o,r),this.renderTargetsVertical[n].setSize(o,r),this.separableBlurMaterials[n].uniforms.invSize.value=new _e(1/o,1/r),o=Math.round(o/2),r=Math.round(r/2)}render(e,a,o,r,n){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),n&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=o.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=o.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let i=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=i.texture,this.separableBlurMaterials[u].uniforms.direction.value=dt.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=dt.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),i=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,n&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}getSeperableBlurMaterial(e){const a=[];for(let o=0;o<e;o++)a.push(.39894*Math.exp(-.5*o*o/(e*e))/e);return new ne({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new _e(.5,.5)},direction:{value:new _e(.5,.5)},gaussianCoefficients:{value:a}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ne({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}dt.BlurDirectionX=new _e(1,0);dt.BlurDirectionY=new _e(0,1);const Mr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Tr extends pt{constructor(){super();const e=Mr;this.uniforms=qt.clone(e.uniforms),this.material=new dn({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ka(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,a,o){this.uniforms.tDiffuse.value=o.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},fn.getTransfer(this._outputColorSpace)===pn&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===hn?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===mn?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===vn?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===mo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===gn?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===wn&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const m=xn(),{scene:Nt,rig:ht}=m;document.getElementById("enter").appendChild(m.vrButton);const _a=new bn,Yt=document.getElementById("loading");_a.onProgress=(t,e,a)=>{Yt&&(Yt.querySelector("span").textContent=`${Math.round(e/a*100)}%`)};_a.onLoad=()=>Yt&&Yt.classList.add("done");const j=Fn(m,_a),mt=m.scene;m.onFrame((t,e)=>{m.activeScene===mt&&j.update(t,e)});let $e=null;m.onFrame((t,e)=>{$e&&m.activeScene===$e.scene&&$e.update(t,e,ht)});let Be=null;const Aa=()=>Be||(Be=tr({earthMap:j.earthMap,skyTex:j.skyTexture,renderer:m.renderer}));let io=0;m.onFrame((t,e)=>{!Be||m.activeScene!==Be.scene||(Be.update(ht,m.camera,t,e),Be.mode==="down"&&e-io>.4&&(io=e,Vo()))});let De=null,Qe=null;m.onFrame((t,e)=>{Qe&&m.activeScene===Qe.scene&&Qe.update(t,e,ht)});const X=yn(),ee=Sn(new URL("../audio/solar-system/",location.href).href);m.onGesture(()=>X.unlock());const ta={position:new l(-34,0,0),yaw:-Math.PI/2},pe=new bo({width:1.35}),ft={pos:new l(.95,1.25,-1.6),rotY:-.38};function kt(t,e){pe.mesh.position.copy(t),pe.mesh.rotation.y=e}kt(ft.pos,ft.rotY);m.addPanel(pe);const No="VR GUYS",ko=[{id:"logo",x:800,y:14,w:210,h:80}],vt=new bo({width:.95,name:"picker"});vt.mesh.position.set(-1,1.1,-1.45);vt.mesh.rotation.y=.45;m.addPanel(vt);const Me={bloom:!0,labels:!0,speed:1},va=[1,5,25,0];function _o(){const t=(e,a)=>({id:"go:"+e,label:a,primary:Ba()===e});vt.show({title:"Go to",accent:"#a78bfa",rows:[[t("sun","Sun"),t("mercury","Mercury"),t("venus","Venus"),t("earth","Earth")],[t("mars","Mars"),t("belt","Belt"),t("jupiter","Jupiter"),t("saturn","Saturn")],[t("uranus","Uranus"),t("neptune","Neptune"),{id:"view:scale",label:ze.scale.button,size:34}],[{id:"view:tour",label:"Guided tour",size:32},{id:"view:bloom",label:Me.bloom?"Bloom: on":"Bloom: off",size:32},{id:"view:labels",label:Me.labels?"Labels: on":"Labels: off",size:32},{id:"view:speed",label:Me.speed?`Spin: ${Me.speed}x`:"Spin: paused",size:32}]]})}let lo="";m.onFrame(()=>{const t=m.activeScene===mt&&["intro","stop","result"].includes(c.screen)&&!m.isMoving(),e=t?Ba()+c.screen:"";e!==lo&&(lo=e,t?_o():vt.hide())});const _t=new br(m.renderer),Sa=new yr(Nt,m.camera);_t.addPass(Sa);_t.addPass(new dt(new _e(window.innerWidth,window.innerHeight),.68,.38,.97));_t.addPass(new Tr);window.addEventListener("resize",()=>_t.setSize(window.innerWidth,window.innerHeight));function At(){m.setRender(Me.bloom?(t,e)=>{Sa.scene=t,Sa.camera=e;const a=m.renderer.toneMapping;m.renderer.toneMapping=ho,_t.render(),m.renderer.toneMapping=a}:null),j.sunGlow.material.opacity=Me.bloom?.75:.45,j.starUniforms&&(j.starUniforms.uVRBoost.value=Me.bloom&&m.renderer.xr.isPresenting?1.35:1);for(const t of j.labels)t.visible=Me.labels;j.setTimeScale(Me.speed)}m.renderer.xr.addEventListener("sessionstart",At);m.renderer.xr.addEventListener("sessionend",At);const ue=Mn(),c={travel:"fly",screen:"intro",stop:0,quiz:0,score:0,answered:null,discovered:new Set,learner:null,session:null,answers:{},moment:null,scaleBack:null},Ba=()=>c.screen==="stop"?be[c.stop].id:null,aa=t=>be.findIndex(e=>e.id===t);for(const t of be){const e=t.id==="sun"?j.sun:j.bodies[t.id];m.addTarget(e,"planet:"+t.id,()=>Ba()===t.id)}const Cr=(()=>{const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");return e.strokeStyle="rgba(120,230,255,0.9)",e.lineWidth=6,e.shadowColor="rgba(80,220,255,1)",e.shadowBlur=14,e.beginPath(),e.arc(128,128,110,0,Math.PI*2),e.stroke(),new Ce(t)})(),Ie=new ve(new ge({map:Cr,transparent:!0,depthWrite:!1,blending:fe,toneMapped:!1}));Ie.visible=!1;Nt.add(Ie);let ot=null;m.onHoverTarget(t=>{if(ot=t?t.slice(7):null,Ie.visible=!!ot&&!c.discovered.has(ot),ot){const e=Z[ot];Ie.position.copy(Xe(ot)),Ie.userData.size=e.r*2.6}});m.onFrame((t,e)=>{Ie.visible&&Ie.scale.setScalar(Ie.userData.size*(1+.04*Math.sin(e*5)))});const Ao=(()=>{const e=new ke;e.setAttribute("position",new xe(new Float32Array(270),3));const a=(()=>{const i=document.createElement("canvas");i.width=i.height=64;const u=i.getContext("2d"),f=u.createRadialGradient(32,32,0,32,32,32);return f.addColorStop(0,"rgba(255,255,255,1)"),f.addColorStop(.3,"rgba(190,240,255,0.8)"),f.addColorStop(1,"rgba(120,200,255,0)"),u.fillStyle=f,u.fillRect(0,0,64,64),new Ce(i)})(),o=new za({map:a,color:16777215,size:.3,transparent:!0,depthWrite:!1,blending:fe,toneMapped:!1}),r=new it(e,o);r.visible=!1,r.frustumCulled=!1,Nt.add(r);const n=Array.from({length:90},()=>new l);let s=0;return m.onFrame(i=>{if(!r.visible)return;s+=i;const u=e.attributes.position;for(let f=0;f<90;f++)u.setXYZ(f,u.getX(f)+n[f].x*i,u.getY(f)+n[f].y*i,u.getZ(f)+n[f].z*i),n[f].multiplyScalar(Math.pow(.4,i));u.needsUpdate=!0,o.opacity=Math.max(0,1-s/1.6),s>1.6&&(r.visible=!1)}),(i,u,f=.1*u)=>{const h=e.attributes.position;for(let p=0;p<90;p++)h.setXYZ(p,i.x,i.y,i.z),n[p].randomDirection().multiplyScalar((1+Math.random()*3)*u);o.size=f,s=0,r.visible=!0}})(),co={lat:-33.92,lon:18.42},Xt=(()=>{const t=Z.earth.r,e=ea(co.lat,co.lon),a=new Te,o=new I(new le(.06,16,12),new ye({color:16731501,toneMapped:!1}));o.position.copy(e).multiplyScalar(t*1.005);const r=new I(new jt(.012,.012,.8,8),new ye({color:16748451,transparent:!0,opacity:.8,toneMapped:!1}));r.position.copy(e).multiplyScalar(t+.4),r.quaternion.setFromUnitVectors(new l(0,1,0),e);const n=document.createElement("canvas");n.width=768,n.height=128;const s=n.getContext("2d");s.fillStyle="rgba(10,16,32,0.85)",s.beginPath(),s.roundRect(8,16,752,96,44),s.fill(),s.font='bold 52px "Trebuchet MS", system-ui, sans-serif',s.fillStyle="#ffd1dc",s.textAlign="center",s.textBaseline="middle",s.fillText("Cape Town: you are here!",384,66,720);const i=new ve(new ge({map:new Ce(n),depthTest:!1,transparent:!0,toneMapped:!1}));return i.scale.set(2.7,.45,1),i.position.copy(e).multiplyScalar(t+1),i.renderOrder=20,a.add(o,r,i),a.visible=!1,j.bodies.earth.add(a),a.userData.dir=e,a})(),Kt={};function Bo(t,e,a){const o=j.bodies[t],r=Xe(t),n=new l(-1,0,0),s=o.rotation.y;let i=0,u=-2;for(let p=0;p<360;p+=2){o.rotation.y=p*Math.PI/180,o.updateMatrixWorld(!0);const v=e.clone().applyMatrix4(o.matrixWorld).sub(r).normalize().dot(n);v>u&&(u=v,i=o.rotation.y)}o.rotation.y=s;const f=((i-s%(Math.PI*2))%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;Kt[t]={from:s,to:s+f,t:0,then:a};const h=j.spinnerOf(t);h&&(h.saved=h.saved??h.speed,h.speed=0,h.boost=0)}m.onFrame(t=>{for(const[e,a]of Object.entries(Kt)){a.t=Math.min(1,a.t+t/1.8);const o=a.t<.5?2*a.t**2:1-(-2*a.t+2)**2/2;j.bodies[e].rotation.y=a.from+(a.to-a.from)*o,a.t>=1&&(delete Kt[e],a.then&&a.then())}});function Fo(t){delete Kt[t];const e=j.spinnerOf(t);e&&e.saved!==void 0&&(e.speed=e.saved,delete e.saved)}function Pr(){Bo("earth",Xt.userData.dir.clone().multiplyScalar(Z.earth.r),()=>Xt.visible=!0)}function Fa(){Xt.visible=!1,Fo("earth")}const Ke=fr(Nt,{earthMap:j.earthMap,sunPos:j.sunPos,sunR:Z.sun.r}),oa=pr(Nt,{earthUniforms:j.bodies.earth.material.uniforms,sunPos:j.sunPos}),zr=Object.fromEntries([...yo,...So].map(t=>[t,t==="earth"?j.earthMap:j.bodies[t].material.uniforms.uMap.value])),na=hr(ht,zr);let Ma=-1;m.onFrame(t=>{if(Ke.active){const e=Ke.update(t);e.added&&e.count%3===0&&X.sfx.tick(e.count/109),e.count!==Ma&&c.moment==="sunSize"&&(Ma=e.count,e.count===109&&X.sfx.swell(3.5),(e.count%4===0||e.count===109)&&Oe())}oa.update(t),na.update(t)});const Dr=Object.fromEntries([...yo.map(t=>[t,"#fdba74"]),...So.map(t=>[t,"#67e8f9"])]);function ra(){Ke.hide(),oa.hide(),na.hide(),j.tintLabels(null),Fo("jupiter"),c.moment=null}const Rr={position:new l(-12*1.42,0,0),yaw:-Math.PI/2};function Eo(){c.moment="sunSize",Ma=-1,Ke.hide(),ee.stop(),X.sfx.whoosh(),Oe(),m.teleport(Rr,()=>{const t=ht.position.clone().add(new l(0,m.isPresenting()?1.6:m.camera.position.y,0));Ke.show(t,4.5),ee.play("sun-size")})}function Lo(){c.moment="spot",Oe(),X.sfx.noise("rumble",9),Bo("jupiter",ea(zo,Do).multiplyScalar(Z.jupiter.r),()=>{c.moment==="spot"&&(oa.show(j.bodies.jupiter,Z.jupiter.r,m.camera.getWorldPosition(new l)),X.sfx.sparkle(),ee.play("jupiter-spot"))})}function Wo(t,e){c.discovered.has(t)||(c.discovered.add(t),Ie.visible=!1,X.sfx.sparkle(),Ao(e||Xe(t),Math.max(1,Z[t].r*.4)),t==="earth"?Pr():j.boost(t,2.5),Oe(),ee.play("secret-"+t))}function Uo(t,e,a,o){ee.stop();const r=t.position.distanceTo(ht.position)>12;c.travel==="fly"&&r?(j.markDestination(e),j.arrangeMoons(e,8.6),pe.show({title:`Next stop: ${a}`,body:"Hold on, explorer! We are flying up to see the whole solar system.",buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),X.sfx.cruise(8.6),m.fly(t,An,{out:3.2,hold:1.8,in:3.6,onVia:()=>pe.show({title:"The whole solar system!",body:["Look down: there is the Sun and all the planets going around it.",`The glowing ring shows ${a}, our next stop.`],buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),then:()=>{j.markDestination(null),o()}})):(X.sfx.whoosh(),m.teleport(t,o))}function Nr(){return{id:"sound",label:X.enabled?"Sound: on":"Sound: off"}}function Io(){$e||($e=$n({saturnMap:j.saturnMap,ringTex:j.satRingTex,skyTex:j.skyTexture})),c.screen="ringdive",ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene($e.scene),m.placeNow($e.start),pe.show({title:"Inside Saturn's rings!",body:["The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house.","That giant ball beside you is Saturn. Look all around you!"],footer:"The rings are huge but very thin: often only about 10 metres thick.",buttons:[{id:"leavedive",label:"Back to Saturn",primary:!0}],accent:"#fde68a"}),ee.play("ringdive")})}function Oo(){ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene(mt),m.placeNow(Rt("saturn")),c.screen="stop",Oe()})}const kr=t=>(t>=100?Math.round(t/10)*10:Math.round(t)).toLocaleString("en-ZA");function Vo(){const t=Be.altitude();pe.show({title:"Flying down to Cape Town",body:[`Height above the ground: ${kr(t)} km`,t>400?"Look down: that is Africa below you!":t>60?"Find the tip of Africa: that is the Cape.":"Almost there... look ahead for Table Mountain."],buttons:[{id:"capeskip",label:"Skip ahead"}],accent:"#60a5fa"})}async function Go(){const t=Aa();c.screen="cape",ee.stop(),pe.show({title:"Getting ready...",body:"Loading the map of the Cape.",accent:"#60a5fa"}),await t.load(),X.sfx.whoosh(),m.blink(()=>{m.setScene(t.scene),m.placeNow(t.start),j.setPadGlass(!0),m.camera.far=4e5,m.camera.updateProjectionMatrix(),t.descend(()=>{pe.show({title:"Cape Town from 7 km up!",body:["Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet.","To the right is False Bay, and far behind are the mountains of the Winelands."],footer:"See the cloud spilling over Table Mountain? Capetonians call it the tablecloth.",buttons:[{id:"leavecape",label:"Back to space",primary:!0}],accent:"#60a5fa"}),ee.play("cape")}),Vo(),X.sfx.cruise(24)})}function jo(){ee.stop(),pe.show({title:"Back to space!",body:"Hold on, we are flying up.",accent:"#60a5fa"}),X.sfx.cruise(13),Be.ascend(()=>{m.blink(()=>{m.setScene(mt),j.setPadGlass(!1),m.camera.far=2e3,m.camera.updateProjectionMatrix(),m.placeNow(Rt("earth")),Be.reset(),c.screen="stop",Oe()})})}const Ta=t=>String(t).padStart(2,"0");function _r(t,e){const a=De.info(),o=["year","yearDone"].includes(De.phase);t.fillStyle="rgba(255,255,255,0.06)",t.beginPath(),t.roundRect(e.x,e.y,e.w,e.h,26),t.fill();const r=e.y+e.h/2;if(t.textBaseline="middle",o){t.fillStyle="#ffffff",t.font='bold 50px "Trebuchet MS", system-ui, sans-serif',t.fillText(`Day ${a.daysPassed} of 365`,e.x+30,r-20),t.font='bold 36px "Trebuchet MS", system-ui, sans-serif',t.fillStyle={summer:"#fca5a5",autumn:"#fdba74",winter:"#93c5fd",spring:"#86efac"}[a.season],t.fillText(`${a.date}: ${a.season} in Cape Town`,e.x+30,r+32);const n=e.x+e.w-190,s=160;t.fillStyle="rgba(255,255,255,0.15)",t.fillRect(n,r-8,s,16),t.fillStyle="#34d399",t.fillRect(n,r-8,s*a.daysPassed/365,16)}else{const n=e.x+70;if(a.lit){t.fillStyle="#fbbf24",t.beginPath(),t.arc(n,r,30,0,Math.PI*2),t.fill(),t.strokeStyle="#fbbf24",t.lineWidth=6;for(let h=0;h<8;h++){const p=h/8*Math.PI*2;t.beginPath(),t.moveTo(n+Math.cos(p)*40,r+Math.sin(p)*40),t.lineTo(n+Math.cos(p)*52,r+Math.sin(p)*52),t.stroke()}}else t.fillStyle="#c7d2fe",t.beginPath(),t.arc(n,r,32,0,Math.PI*2),t.fill(),t.fillStyle="#0b1530",t.beginPath(),t.arc(n+16,r-10,28,0,Math.PI*2),t.fill();const s=Math.floor(a.hour),i=Math.floor(a.hour%1*60/15)*15;t.fillStyle="#ffffff",t.font='bold 54px "Trebuchet MS", system-ui, sans-serif',t.fillText(`Cape Town ${Ta(s)}:${Ta(i)}`,e.x+140,r-18),t.font='bold 34px "Trebuchet MS", system-ui, sans-serif',t.fillStyle=a.lit?"#fde68a":"#a5b4fc",t.fillText(a.lit?"Day: facing the Sun":"Night: facing away from the Sun",e.x+140,r+30);const u=e.x+e.w-190,f=160;t.fillStyle="rgba(255,255,255,0.15)",t.fillRect(u,r-8,f,16),t.fillStyle="#60a5fa",t.fillRect(u,r-8,f*Math.min(1,a.spinT),16),t.font='26px "Trebuchet MS", system-ui, sans-serif',t.fillStyle="#cfe3ff",t.fillText(`${Math.round(Math.min(1,a.spinT)*24)} of 24 hours`,u,r+32)}}function Mt(){const t=De.phase,e=["zoom","year","yearDone"].includes(t)?qa.year:qa.day,a=t==="dayDone"?[{id:"dn:back",label:"Back to Earth"},{id:"dn:year",label:"Next: one year",primary:!0}]:t==="yearDone"?[{id:"dn:again",label:"Watch again"},{id:"dn:back",label:"Back to Earth",primary:!0}]:[{id:"dn:back",label:"Back to Earth"}];pe.show({title:e.title,body:e.text,footer:e.footer,extra:{h:130,draw:_r},buttons:a,accent:"#60a5fa"})}let uo=0;m.onFrame((t,e)=>{!De||m.activeScene!==De.scene||(De.update(t),e-uo>.25&&(uo=e,Mt()))});function Ea(){if(!De){const t=j.bodies.earth.material.uniforms;De=rr({earthUniforms:t,skyTex:j.skyTexture,sunMaterial:j.sun.material}),De.on(e=>{e==="sunrise"&&X.sfx.dawn(!0),e==="sunset"&&X.sfx.dawn(!1),(e==="dayDone"||e==="yearDone")&&(X.sfx.correct(),Mt()),e==="yearStart"&&(ee.play("daynight-year"),X.sfx.sweep(4))})}c.screen="daynight",ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene(De.scene),m.placeNow(De.start),kt(new l(1,1.22,-1.5),-.52),De.begin(),Mt(),ee.play("daynight-day")})}function qo(){ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene(mt),kt(ft.pos,ft.rotY),m.placeNow(Rt("earth")),c.screen="stop",Oe()})}function Ar(t,e){const a=e.y+e.h/2-12,o=[e.x+e.w*.25,e.x+e.w*.75],r=58,n=t.createRadialGradient(o[0],a,0,o[0],a,r*1.6);n.addColorStop(0,"rgba(255,250,220,1)"),n.addColorStop(.6,"rgba(255,210,110,1)"),n.addColorStop(.62,"rgba(255,170,60,0.35)"),n.addColorStop(1,"rgba(255,140,40,0)"),t.fillStyle=n,t.beginPath(),t.arc(o[0],a,r*1.6,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255,235,170,0.6)",t.setLineDash([10,8]),t.lineWidth=3,t.beginPath(),t.arc(o[1],a,r,0,Math.PI*2),t.stroke(),t.setLineDash([]),t.fillStyle="rgba(255,245,215,0.95)",t.beginPath(),t.arc(o[1],a,Math.max(2.2,r/30),0,Math.PI*2),t.fill(),t.font='bold 30px "Trebuchet MS", system-ui, sans-serif',t.textAlign="center",t.textBaseline="top",t.fillStyle="#fde68a",t.fillText("From Earth",o[0],a+r+16),t.fillStyle="#c7d2fe",t.fillText("From Neptune",o[1],a+r+16),t.textAlign="left"}function La(){Qe||(Qe=cr({neptuneMap:j.bodies.neptune.material.uniforms.uMap.value,skyTex:j.skyTexture})),c.screen="neptune",ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene(Qe.scene),m.placeNow(Qe.start),pe.show({title:ze.neptuneSun.title,body:ze.neptuneSun.text,footer:ze.neptuneSun.footer,extra:{h:200,draw:Ar},buttons:[{id:"leaveneptune",label:"Back to Neptune",primary:!0}],accent:"#818cf8"}),X.sfx.noise("wind",16),ee.play("neptune-sun")})}function Ho(){ee.stop(),X.sfx.whoosh(),m.blink(()=>{m.setScene(mt),m.placeNow(Rt("neptune")),c.screen="stop",Oe()})}let st=null;m.onFrame(t=>{if(!st)return;const e=st;e.t=Math.min(1,e.t+t/e.seconds);const a=e.t<.5?4*e.t**3:1-(-2*e.t+2)**3/2;j.setLayout(e.from+(e.to-e.from)*a),e.t>=1&&(st=null,e.then&&e.then())});function Wa(){const t=c.screen==="stop"?{stop:c.stop}:{screen:c.screen};ra(),Fa(),c.scaleBack=t,c.screen="scale",ee.stop(),X.sfx.whoosh(),m.teleport(Bn,()=>{kt(new l(.95,1.85,-1.55),-.38),pe.show({title:ze.scale.title,body:["Watch the planets move out to their real distances from the Sun..."],accent:"#a78bfa"}),setTimeout(()=>{c.screen==="scale"&&(X.sfx.sweep(7,!0),ee.play("scale"),st={from:0,to:1,t:0,seconds:7,then:()=>pe.show({title:ze.scale.title,body:ze.scale.text,footer:ze.scale.footer,buttons:[{id:"scaleback",label:"Put them back",primary:!0}],accent:"#a78bfa"})})},900)})}function $o(){ee.stop(),X.sfx.sweep(4,!1),pe.show({title:"Back to the tour",body:"Moving the planets back close together...",accent:"#a78bfa"}),st={from:1,to:0,t:0,seconds:4,then:()=>{const t=c.scaleBack||{screen:"intro"};if(c.scaleBack=null,kt(ft.pos,ft.rotY),t.stop!==void 0)return Ge(t.stop);c.screen="travel",m.teleport(ta,()=>t.screen==="result"?Ua(!0):Ve())}}}function Ve(){c.screen="intro",pe.show({title:"Journey through the Solar System",body:["Welcome, space explorer! We will visit the Sun, the asteroid belt and all 8 planets.","Point at a button and squeeze the trigger (or pinch your fingers) to choose it."],footer:'Sizes and distances are made to fit, not to scale. Feeling dizzy when flying? Choose "Travel: jump".',buttons:[{id:"start",label:"Start",primary:!0},Nr(),{id:"travel",label:c.travel==="fly"?"Travel: fly":"Travel: jump"}],logo:No,hidden:ko,accent:"#22d3ee"}),ee.play("intro")}function Tt(){c.screen="learner",ee.stop();const t=[];for(let e=0;e<5;e++)t.push(Array.from({length:8},(a,o)=>{const r=e*8+o+1;return{id:"learner:"+r,label:String(r)}}));t.push([{id:"learner:0",label:"No number",size:36}]),pe.show({title:"Who is flying? Pick your number",rows:t,rowsTop:136,rowGap:14,logo:No,hidden:ko,accent:"#22d3ee"})}function Ca(){if(c.session={startedAt:performance.now(),start:ue.on?ue.start:"sun"},c.discovered.clear(),c.answers={},ue.on&&ue.start==="quiz")return Ct(0);Ge(ue.on?Math.max(0,aa(ue.start)):0)}function ga(){if(ue.askNumber)return Tt();c.learner=null,Ca()}function sa(){c.screen="teacher",ee.stop();const t=(e,a)=>({id:"tstart:"+e,label:a,primary:ue.start===e,size:34});pe.show({title:"Teacher mode",accent:"#f472b6",rowsTop:130,rowGap:16,rows:[[t("sun","Sun"),t("mercury","Mercury"),t("venus","Venus"),t("earth","Earth")],[t("mars","Mars"),t("belt","Belt"),t("jupiter","Jupiter"),t("saturn","Saturn")],[t("uranus","Uranus"),t("neptune","Neptune"),t("quiz","Quiz only")],[{id:"tmode",label:ue.on?"Teacher mode: on":"Teacher mode: off",size:32},{id:"tnumbers",label:ue.askNumber?"Learner numbers: on":"Learner numbers: off",size:32}],[{id:"tclose",label:"Close"},{id:"tgo",label:"Start now",primary:!0}]]})}function Oe(){const t=c.stop,e=be[t],a=c.discovered.has(e.id),o=[];e.id==="sun"&&o.push({id:"m:sunsize",label:ze.sunSize.button}),e.id==="earth"&&o.push({id:"daynight",label:"How do days and years work?",size:34},{id:"cape",label:"Fly to Cape Town",size:34}),e.id==="jupiter"&&o.push({id:"m:spot",label:ze.spot.button}),e.id==="saturn"&&o.push({id:"ringdive",label:"Dive into the rings"}),e.id==="neptune"&&o.push({id:"m:neptune",label:ze.neptuneSun.button});const r=[...t>0?[{id:"back",label:"Back"}]:[],{id:"next",label:t===be.length-1?"Take the quiz":"Next stop",primary:!0}];let n=`${t+1}/${be.length}  ${e.name}`,s=e.text;if(c.moment==="sunSize"){n=ze.sunSize.title;const u=Ke.count;s=[...ze.sunSize.text],s.unshift(`Earths across the Sun: ${u}`)}else c.moment==="spot"&&(n=ze.spot.title,s=ze.spot.text);const i=e.id==="belt"?a?`Secret: ${e.secret}`:"The belt is mostly empty space: spacecraft fly through it safely. Point at Ceres and squeeze to discover a secret!":a?`Secret: ${e.secret}`:`Point at ${e.id==="sun"?"the Sun":e.name} and squeeze to discover a secret!`;pe.show({title:n,body:s,footer:i,footerColor:a?e.accent:"#8fa6c9",buttonRows:[o,r],accent:e.accent})}function Ge(t){c.screen="travel",ra(),Fa(),c.travel!=="fly"&&j.arrangeMoons(be[t].id,.8),Uo(Rt(be[t].id),be[t].id,be[t].name,()=>{be[t].id==="earth"&&Aa().load(),c.screen="stop",c.stop=t,be[t].id==="belt"&&(na.show(),j.tintLabels(Dr)),Oe(),ee.play(be[t].id)})}function Br(t){const e=Array.from({length:t},(a,o)=>o);for(let a=t-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[e[a],e[o]]=[e[o],e[a]]}return e}let fo=0;function Ct(t){c.screen="quiz",c.quiz=t,c.answered=null;const e=Le[t],a=Br(e.options.length);c.order=a;const o=()=>pe.show({title:`Question ${t+1} of ${Le.length}`,body:e.q,stack:!0,accent:"#a78bfa",buttons:a.map((r,n)=>({id:"ans"+n,label:e.options[r],state:c.answered!==null?r===e.answer?"right":n===c.answered?"wrong":void 0:void 0}))});c.redraw=o,t===0?(c.score=0,c.answers={},c.screen="travel",ra(),Fa(),Uo(ta,"sun","Quiz time",()=>{c.screen="quiz",o(),ee.play("quiz")})):(o(),ee.play("q"+(t+1)))}function Qo(t){c.screen="why";const e=Le[t],a=c.answers[e.key];pe.show({title:a?"Correct!":"Not quite",body:[e.q,`Answer: ${e.options[e.answer]}.`,e.why],buttons:[{id:"nextq",label:t===Le.length-1?"See my score":"Next question",primary:!0}],accent:a?"#34d399":"#f87171"}),ee.play("why"+(t+1))}const Fr=t=>`${Math.floor(t/60)} min ${Ta(Math.round(t%60))} s`;function Ua(t=!1){c.screen="result";const e=c.score/Le.length,a=e===1?"result-perfect":e>=.6?"result-good":"result-try",o=e===1?"Perfect! You are a real space expert!":e>=.6?"Great job, explorer!":"Good try! Fly the tour again to learn even more.";if(!t&&c.session){const r=(performance.now()-c.session.startedAt)/1e3;c.lastSaved=Tn({learner:c.learner,score:c.score,total:Le.length,answers:{...c.answers},secrets:c.discovered.size,secretsTotal:be.length,seconds:r,start:c.session.start}),c.lastSeconds=r,c.session=null}pe.show({title:`You got ${c.score} out of ${Le.length}!`,body:[o,`You discovered ${c.discovered.size} of ${be.length} secrets on the way.`],footer:c.lastSaved?`${c.learner?`Learner ${c.learner}: `:""}saved for your teacher (time ${Fr(c.lastSeconds)}).`:void 0,buttons:[{id:"nextlearner",label:"Next learner",primary:!0},{id:"again",label:"Fly again"}],accent:"#34d399"}),t||(X.sfx.fanfare(),Ao(new l(ta.position.x+1.6,1.4,-.9),.5,.04),ee.play(a))}m.onHold(t=>{t==="logo"&&["intro","learner","result"].includes(c.screen)&&(X.sfx.sparkle(),sa())});function Yo(t,e,a){if(t.startsWith("planet:"))return Wo(t.slice(7),a);if(t!=="logo"){if(X.sfx.click(),t==="skip")return m.skipFlight();if(!(m.isMoving()||st)){if(t.startsWith("view:")){const o=t.slice(5);return o==="tour"?(ra(),Ge(0)):o==="scale"?Wa():(o==="bloom"&&(Me.bloom=!Me.bloom),o==="labels"&&(Me.labels=!Me.labels),o==="speed"&&(Me.speed=va[(va.indexOf(Me.speed)+1)%va.length]),At(),_o())}if(t.startsWith("go:")){const o=aa(t.slice(3));return o>=0&&!(c.screen==="stop"&&c.stop===o)?Ge(o):void 0}if(t==="travel")return c.travel=c.travel==="fly"?"jump":"fly",Ve();if(t==="sound")return X.setEnabled(!X.enabled),ee.setEnabled(X.enabled),Ve();if(c.screen==="intro"&&t==="start")return ga();if(c.screen==="learner"&&t.startsWith("learner:")){const o=Number(t.slice(8));return c.learner=o||null,Ca()}if(c.screen==="teacher")return t.startsWith("tstart:")&&(ue.start=t.slice(7)),t==="tmode"&&(ue.on=!ue.on),t==="tnumbers"&&(ue.askNumber=!ue.askNumber),ja(ue),t==="tclose"?ue.on&&ue.askNumber?Tt():Ve():t==="tgo"?(ue.on=!0,ja(ue),ga()):sa();if(c.screen==="ringdive"&&t==="leavedive")return Oo();if(c.screen==="neptune"&&t==="leaveneptune")return Ho();if(c.screen==="daynight")return t==="dn:back"?qo():t==="dn:year"?(De.startYear(),Mt()):t==="dn:again"?(De.begin(),ee.play("daynight-day"),Mt()):void 0;if(c.screen==="scale")return t==="scaleback"?$o():void 0;if(c.screen==="cape"){if(t==="capeskip"&&Be){Be.skip();return}return t==="leavecape"&&Be&&Be.mode==="hover"?jo():void 0}if(c.screen==="stop"){if(t==="ringdive")return Io();if(t==="cape")return Go();if(t==="daynight")return Ea();if(t==="m:sunsize")return Eo();if(t==="m:spot")return Lo();if(t==="m:neptune")return La();if(t==="next")return c.stop===be.length-1?Ct(0):Ge(c.stop+1);if(t==="back")return Ge(c.stop-1)}if(c.screen==="quiz"&&t.startsWith("ans")&&c.answered===null){const o=Number(t.slice(3)),r=Le[c.quiz],n=c.order[o]===r.answer;c.answered=o,c.answers[r.key]=n,n?(c.score++,X.sfx.correct()):X.sfx.wrong(),c.redraw();const s=++fo,i=c.quiz;setTimeout(()=>{s===fo&&c.screen==="quiz"&&Qo(i)},1100);return}if(c.screen==="why"&&t==="nextq")return c.quiz===Le.length-1?Ua():Ct(c.quiz+1);if(c.screen==="result"&&t==="again")return Ca();if(c.screen==="result"&&t==="nextlearner")return c.learner=null,ue.on?ga():ue.askNumber?Tt():Ve()}}}m.onPress(Yo);m.placeNow(ta);At();ue.on&&ue.askNumber?Tt():Ve();const Ze=new URLSearchParams(location.search);Ze.has("stop")&&Ge(Math.max(0,Math.min(be.length-1,Number(Ze.get("stop"))||0)));Ze.has("quiz")&&Ct(0);Ze.has("teacher")&&sa();Ze.has("daynight")&&(c.stop=aa("earth"),Ea());Ze.has("neptune")&&(c.stop=aa("neptune"),La());Ze.has("scale")&&Wa();window.__vrg={picker:vt,view:Me,applyView:At,showStop:Ge,showQuiz:Ct,showResult:Ua,showWhy:Qo,discover:Wo,state:c,world:j,capePin:Xt,app:m,panel:pe,enterRingDive:Io,leaveRingDive:Oo,enterCape:Go,leaveCape:jo,getCape:Aa,press:t=>Yo(t,null,null),quiz:Le,enterDayNight:Ea,leaveDayNight:qo,getDayNight:()=>De,enterNeptuneView:La,leaveNeptuneView:Ho,showScale:Wa,hideScale:$o,showSunSize:Eo,showSpot:Lo,showTeacher:sa,showLearner:Tt,hologram:na,sunRuler:Ke,spot:oa,teacher:ue};
