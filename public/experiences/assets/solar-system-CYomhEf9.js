import{y as io,V as p,G as be,I as dt,M as G,d as me,j as we,k as xe,i as ne,l as Se,c as oe,o as Ee,n as _t,f as Xe,$ as Ge,Q as Le,a as fe,b as Ye,C as Z,K as Pt,a0 as lo,U as co,a1 as uo,t as Pe,P as Bt,N as pt,a2 as po,a3 as fo,A as mo,W as Et,S as ve,h as De,B as ft,a4 as Ct,a5 as zt,a6 as Ot,a7 as ho,u as Vt,e as jt,E as qt,r as Gt,T as vo,p as go,g as ye,a8 as mt,R as wo,F as Lt,D as st,a9 as xo,s as kt,m as yo,H as bo,X as Mo,aa as So,Y as Po,Z as Co,_ as zo}from"./BufferGeometryUtils-DGkOpbKr.js";const et=new io([new p(-260,120,-320),new p(-90,55,-150),new p(20,26,-62),new p(70,22,-20),new p(140,42,60),new p(260,90,210),new p(420,150,380)]),ko=600;function Tt(e,t,a,o,r=64,l=28){const u=[],s=[],m=[];for(let h=0;h<=r;h++){const S=h/r,b=t+(a-t)*Math.pow(S,.8),P=S*e,_=o*S*S*e;for(let N=0;N<=l;N++){const O=N/l*Math.PI*2;u.push(_+Math.cos(O)*b,P,Math.sin(O)*b),s.push(N/l,S)}}for(let h=0;h<r;h++)for(let S=0;S<l;S++){const b=h*(l+1)+S,P=b+l+1;m.push(b,P,b+1,P,P+1,b+1)}const c=new Se;return c.setAttribute("position",new Pt(u,3)),c.setAttribute("uv",new Pt(s,2)),c.setIndex(m),c.computeVertexNormals(),c}function Rt(e,{streak:t=10,flow:a=.25,power:o=1.6,strength:r=1}){return new fe({uniforms:{uColor:{value:new Z(...e)},uTime:{value:0},uStrength:{value:r}},vertexShader:`varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${Oe}
      uniform vec3 uColor; uniform float uTime; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float v = vUv.y;
        float along = pow(1.0 - v, ${o.toFixed(2)}) * smoothstep(0.0, 0.03, v);
        float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.4);
        float a = vUv.x * 6.2832;
        float n = snoise(vec3(cos(a) * ${t.toFixed(1)}, sin(a) * ${t.toFixed(1)}, v * 4.0 - uTime * ${a.toFixed(3)}));
        float streaks = 0.55 + 0.45 * n;
        gl_FragColor = vec4(uColor * along * core * streaks * uStrength, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ne,side:Ye,toneMapped:!1})}function To(e,t){const a=new be;e.add(a);const o=new dt(.22,3),r=o.attributes.position;for(let V=0;V<r.count;V++){const D=new p().fromBufferAttribute(r,V),J=1+.25*Math.sin(D.x*9)*Math.cos(D.y*7)+.15*Math.sin(D.z*13);D.multiplyScalar(J),D.x*=1.5,r.setXYZ(V,D.x,D.y,D.z)}o.computeVertexNormals();const l=new G(o,new me({color:3814704,roughness:1}));a.add(l);const u=new we(new xe({map:Fe([210,255,235],[80,200,170],.45),blending:ne,transparent:!0,depthWrite:!1,toneMapped:!1}));u.scale.setScalar(5),a.add(u);const s=new we(new xe({map:Fe([255,255,255],[180,240,255],.25),blending:ne,transparent:!0,depthWrite:!1,toneMapped:!1}));s.scale.setScalar(1.4),a.add(s);const m=Rt([.35,.6,1.25],{streak:14,flow:.9,power:1.2,strength:1.1}),c=new G(Tt(55,.12,1.4,0),m),h=Rt([1.15,.98,.78],{streak:6,flow:.18,power:1.9,strength:.85}),S=new G(Tt(38,.35,7,.32),h);c.frustumCulled=S.frustumCulled=!1,a.add(c,S);const b=500,P=new Float32Array(b*3),_=Array.from({length:b},()=>new p),N=new Float32Array(b).map(()=>Math.random()*6),O=new Se;O.setAttribute("position",new oe(P,3));const H=new Ee(O,new _t({map:Fe([255,245,220],[255,200,150],.3),size:.35,color:16773336,transparent:!0,opacity:.8,depthWrite:!1,blending:ne,toneMapped:!1}));H.frustumCulled=!1,e.add(H);const k=new p,B=new p,I=new p,z=new Le,L=new Xe,$=new p(0,1,0),X=new p;let ee=!0,A=.35;return{root:a,update(V,D){const J=et.getPointAt(A),K=Ge.clamp(Math.sqrt(70/Math.max(1,J.distanceTo(t))),.45,2.2);A=(A+Math.min(V,.1)*K/ko)%1;const C=et.getPointAt(A);a.position.copy(C),ee&&(X.copy(C),ee=!1),B.copy(C).sub(X),B.lengthSq()<1e-8&&B.copy(et.getTangentAt(A)),B.normalize(),X.copy(C);const q=C.distanceTo(t),R=Ge.clamp(90/q,.35,1.5);k.copy(C).sub(t).normalize(),z.setFromUnitVectors($,k),c.quaternion.copy(z),c.scale.setScalar(R),I.copy(B).multiplyScalar(-1).addScaledVector(k,-B.clone().multiplyScalar(-1).dot(k)).normalize();const E=new p().crossVectors(I,k).normalize();L.makeBasis(I,k,E),S.quaternion.setFromRotationMatrix(L),S.scale.setScalar(R),m.uniforms.uTime.value=D,h.uniforms.uTime.value=D,m.uniforms.uStrength.value=1.1*R,h.uniforms.uStrength.value=.85*R,u.scale.setScalar(4+3*R+.3*Math.sin(D*2.1)),l.rotation.y+=V*.3,l.rotation.x+=V*.11;for(let y=0;y<b;y++)N[y]+=V,N[y]>6?(N[y]=0,P[y*3]=C.x,P[y*3+1]=C.y,P[y*3+2]=C.z,_[y].copy(k).multiplyScalar(2+Math.random()*5*R).add(new p().randomDirection().multiplyScalar(.8)).addScaledVector(B,-1.5*Math.random())):(P[y*3]+=_[y].x*V,P[y*3+1]+=_[y].y*V,P[y*3+2]+=_[y].z*V);O.attributes.position.needsUpdate=!0,H.material.opacity=.75*R}}}const Ro=`
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
`,Wt={vertexShader:`
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
      `},At={vertexShader:`
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
      `},Ze=new p(.52,.85,0).normalize(),Ut=new p(0,0,-1),Wo=new p().crossVectors(Ze,Ut).normalize(),ht=Ut.clone().multiplyScalar(Math.cos(.16)).addScaledVector(Wo,Math.sin(.16)).normalize(),Ao=new p().crossVectors(Ze,ht).normalize();function Do(e,t=4096){const a=new lo(t,t/2,{generateMipmaps:!0,minFilter:uo,magFilter:co});a.texture.colorSpace=Pe;const o=new fe({uniforms:{uTime:{value:0},uNebulaIntensity:{value:1},uMilkyWay:{value:1},uVRBoost:{value:1},uGalPole:{value:Ze},uGalCenter:{value:ht}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Ro,depthTest:!1,depthWrite:!1}),r=new G(new Bt(2,2),o);r.frustumCulled=!1;const l=new pt;l.add(r);const u=new po(-1,1,1,-1,0,1),s=e.getRenderTarget(),m=e.xr.enabled,c=e.toneMapping;return e.xr.enabled=!1,e.toneMapping=fo,e.setRenderTarget(a),e.render(l,u),e.setRenderTarget(s),e.xr.enabled=m,e.toneMapping=c,o.dispose(),r.geometry.dispose(),a.texture}function Fo(e=900,{scale:t=.45}={}){const a=new be,o=()=>{let v=0,w=0;for(;v===0;)v=Math.random();for(;w===0;)w=Math.random();return Math.sqrt(-2*Math.log(v))*Math.cos(2*Math.PI*w)},r=(v,w,F)=>{const T=Math.cos(v);return F.copy(ht).multiplyScalar(T*Math.cos(w)).addScaledVector(Ao,T*Math.sin(w)).addScaledVector(Ze,Math.sin(v))},l=v=>{const w=2*Math.random()-1,F=Math.random()*Math.PI*2,T=Math.sqrt(1-w*w);return v.set(T*Math.cos(F),T*Math.sin(F),w)},u=(v,w,F=!1)=>{if(Math.random()<v){let T,n;return Math.random()<.42?(T=-.1+o()*.62,n=o()*.16-Math.sin(T*2+.4)*.035):(T=(Math.random()*2-1)*Math.PI,n=o()*.115-Math.sin(T*2+.4)*.035),F&&Math.abs(n-.01)<.032&&Math.random()<.65&&(n+=(n>=0?1:-1)*(.035+Math.abs(o())*.05)),r(n,T,w)}return l(w)},s=[[.26,new Z(.68,.84,1)],[.26,new Z(1,1,1)],[.16,new Z(1,.94,.82)],[.12,new Z(1,.8,.48)],[.08,new Z(1,.56,.3)],[.07,new Z(.38,.72,1)],[.05,new Z(.84,.64,1)]],m=()=>{let v=Math.random();for(const[w,F]of s)if((v-=w)<=0)return F;return s[1][1]},c=Math.round(11500*t),h=Math.round(49e3*t),S=24,b=Math.round(175*Math.max(.6,t)),P=c+h+S*b,_=new Float32Array(P*3),N=new Float32Array(P*3),O=new Float32Array(P),H=new Float32Array(P*3),k=new p;let B=0;const I=(v,w,F,T,n,i=1)=>{_.set([v.x*e,v.y*e,v.z*e],B*3),N.set([w.r*F,w.g*F,w.b*F],B*3),O[B]=T,H.set([Math.random()*Math.PI*2,(.3+Math.random()*1)*i,n],B*3),B++};for(let v=0;v<c;v++){u(.38,k,!0);const w=Math.pow(Math.random(),4),F=w>.62;I(k,m(),.16+w*.76,F?4+(w-.62)*6.5:1.8+w*2.8,.18+Math.random()*.38,F?.85:1.15)}for(let v=0;v<h;v++){u(.58,k,!0);const w=Math.pow(Math.random(),2.5);I(k,m(),.06+w*.25,1.5+w*.92,Math.random()<.65?.14+Math.random()*.34:.06,1.25)}const z=new p;for(let v=0;v<S;v++){v<8?r((Math.random()-.5)*.26,(v/8-.5)*1.2,z):u(.84,z,!0);const w=.024+Math.random()*.045,F=[s[0][1],s[1][1],s[3][1],s[5][1],s[6][1]];for(let T=0;T<b;T++){k.set(z.x+o()*w,z.y+o()*w,z.z+o()*w).normalize();const n=Math.pow(Math.random(),3.6);I(k,Math.random()<.68?F[v%F.length]:m(),.075+n*.58,1.55+n*3.4,.16+Math.random()*.34,1.1)}}const L=new Se;L.setAttribute("position",new oe(_,3)),L.setAttribute("aColor",new oe(N,3)),L.setAttribute("aSize",new oe(O,1)),L.setAttribute("aTwinkle",new oe(H,3));const $={uTime:{value:0},uPixelScale:{value:1},uVRBoost:{value:1}},X=new fe({uniforms:$,vertexShader:Wt.vertexShader,fragmentShader:Wt.fragmentShader,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),ee=new Ee(L,X);ee.frustumCulled=!1,ee.renderOrder=-9,a.add(ee);const A=[{lat:-.065,lon:-.29,size:86,bright:1.15,color:new Z(1,.9,.7),angle:.785},{lat:.075,lon:.26,size:82,bright:1.1,color:new Z(.92,.95,1),angle:.785},{lat:-.145,lon:.08,size:54,bright:.85,color:new Z(.75,.88,1),angle:.76},{lat:.155,lon:-.16,size:52,bright:.82,color:new Z(1,.84,.58),angle:.8},{lat:.18,lon:.42,size:50,bright:.78,color:new Z(.9,.76,1),angle:.77},{lat:-.175,lon:-.46,size:54,bright:.84,color:new Z(.68,.86,1),angle:.81}],V=[new Z(1,.9,.68),new Z(.95,.97,1),new Z(.62,.84,1),new Z(.45,.76,1),new Z(1,.74,.45),new Z(.88,.72,1)],D=A.length+26,J=new Float32Array(D*3),K=new Float32Array(D*3),C=new Float32Array(D),q=new Float32Array(D*3),R=new Float32Array(D),E=[];for(let v=0;v<D;v++){let w,F,T,n;if(v<A.length){const i=A[v];r(i.lat,i.lon,k),w=i.color,F=i.bright,T=i.size,n=i.angle}else{for(let f=0;f<25&&(u(.45,k,!1),!!E.some(d=>k.dot(d)>.955));f++);w=V[Math.floor(Math.random()*V.length)];const i=Math.pow(Math.random(),1.8);F=.48+i*.44,T=32+i*36,n=Math.PI*.25+(Math.random()-.5)*.14}E.push(k.clone()),J.set([k.x*e*.98,k.y*e*.98,k.z*e*.98],v*3),K.set([w.r*F,w.g*F,w.b*F],v*3),C[v]=T,q.set([Math.random()*Math.PI*2,.3+Math.random()*.7,.14+Math.random()*.18],v*3),R[v]=n}const y=new Se;y.setAttribute("position",new oe(J,3)),y.setAttribute("aColor",new oe(K,3)),y.setAttribute("aSize",new oe(C,1)),y.setAttribute("aTwinkle",new oe(q,3)),y.setAttribute("aAngle",new oe(R,1));const Y=new fe({uniforms:$,vertexShader:At.vertexShader,fragmentShader:At.fragmentShader,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),W=new Ee(y,Y);return W.frustumCulled=!1,W.renderOrder=-8,a.add(W),{group:a,uniforms:$}}const $t=1.6,Io=new URL("../textures/solar/",location.href).href,U={sun:{r:12,x:0},mercury:{a:25,r:1.2,x:34,spin:.003,tilt:.03,atmo:null},venus:{a:-35,r:2.2,x:52,spin:-.002,tilt:.05,atmo:[1,.85,.55,.9]},earth:{a:15,r:2.4,x:72,spin:.042,tilt:.41,atmo:[.35,.6,1,1.2]},mars:{a:-20,r:1.6,x:90,spin:.041,tilt:.44,atmo:[1,.55,.35,.5]},jupiter:{a:35,r:7,x:150,spin:.101,tilt:.05,atmo:[1,.85,.7,.5]},saturn:{a:-25,r:5.6,x:195,spin:.094,tilt:.47,atmo:[1,.9,.7,.45]},uranus:{a:30,r:3.4,x:232,spin:-.058,tilt:1.7,atmo:[.6,.95,1,.8]},neptune:{a:-15,r:3.3,x:262,spin:.063,tilt:.49,atmo:[.45,.6,1,.9]}};function ze(e){const t=U[e],a=(t.a||0)*Math.PI/180;return new p(Math.cos(a)*t.x,$t,Math.sin(a)*t.x)}const No=new p(-150,62,0);function vt(e){const a=U[e].r*(e==="sun"?2.4:3.2)+4,o=ze(e);return{position:new p(o.x-a,0,o.z),yaw:-Math.PI/2}}function _o(e,t){const{scene:a,renderer:o,rig:r,camera:l}=e;o.toneMapping=mo,o.toneMappingExposure=1.05;const u=new Et(t),s=(n,i=!0)=>m("real/"+n,i),m=(n,i=!0)=>{const f=u.load(Io+n+".jpg");return i&&(f.colorSpace=Pe),f.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),f},c=[],h=new p(0,$t,0),S=Do(o,4096),b=new G(new ve(950,64,32),new De({map:S,side:ft,depthWrite:!1,fog:!1,toneMapped:!1}));b.renderOrder=-10,a.add(b),c.push(()=>b.position.copy(r.position));{const{group:n,uniforms:i}=Fo(900,{scale:.45});a.add(n),c.push((f,d)=>{i.uTime.value=d,i.uPixelScale.value=o.xr.isPresenting?1.3:1,n.position.copy(r.position)})}{const n=[];for(let f=0;f<3;f++){const d=new Se;d.setAttribute("position",new oe(new Float32Array(6),3)),d.setAttribute("color",new oe(new Float32Array([1,1,1,1,.6,.8,1,0]),4));const g=new Ct(d,new zt({vertexColors:!0,transparent:!0,depthWrite:!1,blending:ne}));g.visible=!1,g.frustumCulled=!1,a.add(g),n.push({line:g,t:0,life:0,a:new p,b:new p})}let i=3;c.push(f=>{if(i-=f,i<=0){i=4+Math.random()*7;const d=n.find(g=>!g.line.visible);if(d){const j=new p(0,0,-1).applyQuaternion(l.getWorldQuaternion(new Le)).clone().add(new p((Math.random()-.5)*1.6,.35+Math.random()*.5,(Math.random()-.5)*1.6)).normalize();d.a.copy(j).multiplyScalar(400).add(r.position),d.b.set(Math.random()-.5,-.4-Math.random()*.4,Math.random()-.5).normalize().multiplyScalar(160),d.t=0,d.life=.9+Math.random()*.6,d.line.visible=!0}}for(const d of n){if(!d.line.visible)continue;d.t+=f;const g=d.t/d.life;if(g>=1){d.line.visible=!1;continue}const j=d.a.clone().addScaledVector(d.b,g),te=d.a.clone().addScaledVector(d.b,Math.max(0,g-.25)),re=d.line.geometry.attributes.position;re.setXYZ(0,j.x,j.y,j.z),re.setXYZ(1,te.x,te.y,te.z),re.needsUpdate=!0,d.line.material.opacity=Math.sin(g*Math.PI)}})}a.add(new Ot(8425648,.05));const P=new ho(16774368,3.2,0,0);P.position.copy(h),a.add(P);const _=new fe({uniforms:{uTime:{value:0}},vertexShader:`varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${Oe}
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
      }`,toneMapped:!1}),N=new G(new ve(U.sun.r,128,96),_);N.position.copy(h),a.add(N);const O=new fe({uniforms:{uTime:{value:0},uDisc:{value:U.sun.r},uHalf:{value:U.sun.r*2.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`${Oe}
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
      }`,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),H=new G(new Bt(U.sun.r*4.4,U.sun.r*4.4),O);H.position.copy(h),a.add(H);const k=Bo(Fe([255,150,60],[255,70,0],.35),130,h);k.material.opacity=.75,a.add(k);const B=new p;c.push((n,i)=>{_.uniforms.uTime.value=i,O.uniforms.uTime.value=i,N.rotation.y+=n*.0017,l.getWorldPosition(B),H.lookAt(B);const f=Math.max(B.distanceTo(h),U.sun.r*1.05);O.uniforms.uDisc.value=U.sun.r*f/Math.sqrt(f*f-U.sun.r*U.sun.r),k.scale.setScalar(130*(1+.025*Math.sin(i*.7)))});const I={},z={},L=[],$=[];function X(n,i){const f=U[n],d=new be;d.position.copy(ze(n)),d.rotation.z=f.tilt*.8,d.rotation.x=f.tilt*.6,a.add(d);const g=new G(new ve(f.r,96,64),i);g.name=n,d.add(g),f.atmo&&d.add(jo(f.r,f.atmo,h)),I[n]=g,z[n]=d,$.push({mesh:g,speed:f.spin,boost:0});const j=Vo(n,f);return L.push(j),a.add(j),g}const ee=(n,i={})=>new me({map:m(n),roughness:1,metalness:0,...i}),A=(n,i,f={})=>{const d=s(n);return new me({map:d,bumpMap:d,bumpScale:i,roughness:1,metalness:0,...f})};X("mercury",A("mercury",2.8)),X("venus",A("venus",.6,{color:16771524}));const V=new me({map:s("earth_day"),normalMap:s("earth_normal",!1),normalScale:new Vt(1.6,1.6),roughnessMap:s("earth_rough",!1),roughness:1,metalness:0,emissive:16761978,emissiveMap:s("earth_lights"),emissiveIntensity:2.2});Lo(V),qo(V,h),X("earth",V);const D=new G(new ve(U.earth.r*1.012,96,64),new me({color:16777215,alphaMap:s("earth_clouds",!1),transparent:!0,depthWrite:!1,roughness:1,opacity:1}));z.earth.add(D),$.push({mesh:D,speed:U.earth.spin*1.12,boost:0}),X("mars",A("mars",3.2)),X("jupiter",A("jupiter",1.2)),X("saturn",A("saturn",1)),X("uranus",A("uranus",.4)),X("neptune",A("neptune",.6));const J=Ho(),K=$o(U.saturn.r*1.24,U.saturn.r*2.3,I.saturn,h);z.saturn.add(K),z.uranus.add(Go(U.uranus.r*1.6,U.uranus.r*2,Xo(),I.uranus,h,.5));const C={},q={},R=(n,i)=>ee(n,{});E("earth",A("moon",2.2),.6,6.2,.02,.25,null,1.2),E("mars",R("rockmoon"),.22,3,.06,.1,[1,.75,.85]),E("mars",R("rockmoon"),.15,4.6,.035,-.2,[1,.8,.9]),E("jupiter",R("io"),.55,10.5,.05,.05),E("jupiter",R("europa"),.48,13,.035,.12),E("jupiter",R("ganymede"),.8,16.5,.025,-.08),E("jupiter",R("callisto"),.72,18.5,.016,.15),E("saturn",R("titan"),.7,14,.02,.35,null,2.4),E("neptune",R("triton"),.45,7.5,-.03,.3);function E(n,i,f,d,g,j,te,re=Math.random()*6.28){const ie=new be;(C[n]||(C[n]=[])).push(ie),g=-Math.abs(g),ie.position.copy(z[n].position),ie.rotation.z=j,ie.rotation.y=re;const ue=new G(new ve(f,40,24),i);return te&&ue.scale.set(...te),ue.position.set(0,0,-d),ie.add(ue),a.add(ie),$.push({mesh:ie,speed:g,boost:0}),(q[n]||(q[n]=[])).push({obj:ue,r:f}),ue}const y=[];for(const n of["earth","mars","jupiter","saturn","neptune"]){const i=q[n]||[],f=I[n],d=n==="saturn"?{mesh:K,inner:U.saturn.r*1.24,outer:U.saturn.r*2.3,texture:J}:null;it(f.material,h,i,d),y.push(f.material);for(const g of i)it(g.obj.material,h,[{obj:f,r:U[n].r},...i.filter(j=>j!==g)]),y.push(g.obj.material)}c.push(()=>{for(const n of y)n.userData.updateShadows()});{const n=new dt(1,1),i=n.attributes.position;for(let de=0;de<i.count;de++){const ke=.75+Math.random()*.45;i.setXYZ(de,i.getX(de)*ke,i.getY(de)*ke*.8,i.getZ(de)*ke)}n.computeVertexNormals();const f=1100,d=new jt(n,new me({color:9207924,roughness:1,flatShading:!0}),f),g=new Xe,j=new Le,te=new qt,re=new p,ie=new p;for(let de=0;de<f;de++){const ke=Math.random()*Math.PI*2,St=99+Math.random()*12+(Math.random()-.5)*3;re.set(Math.cos(ke)*St,(Math.random()-.5)*3*(.5+Math.random()),Math.sin(ke)*St),te.set(Math.random()*6,Math.random()*6,Math.random()*6),j.setFromEuler(te);const Ke=.06+Math.pow(Math.random(),3)*.55;ie.set(Ke,Ke,Ke),g.compose(re,j,ie),d.setMatrixAt(de,g),d.setColorAt(de,new Z().setHSL(.07+Math.random()*.04,.15+Math.random()*.15,.3+Math.random()*.25))}const ue=new be;ue.position.copy(h),ue.add(d),a.add(ue),c.push(de=>ue.rotation.y+=de*.002)}const Y=[];for(const[n,i]of Object.entries(U)){if(n==="sun")continue;const f=[];for(let g=0;g<=256;g++){const j=g/256*Math.PI*2;f.push(new p(Math.cos(j)*i.x,0,Math.sin(j)*i.x))}const d=new Ct(new Se().setFromPoints(f),new zt({color:8369407,transparent:!0,opacity:.12,depthWrite:!1}));Y.push(d.material),d.position.copy(h),a.add(d)}let W=null;{const n=new be,i=new G(new Gt(1.2,1.05,.06,72),new me({color:1581621,metalness:.7,roughness:.35,emissive:660516,emissiveMap:Oo(),emissiveIntensity:3}));i.position.y=-.035;const f=new G(new vo(1.18,.018,12,96),new De({color:2282478,toneMapped:!1}));f.rotation.x=Math.PI/2,f.position.y=0;const d=new G(new go(1.6,64),new De({map:Fe([60,200,255],[0,80,160],.6),transparent:!0,depthWrite:!1,blending:ne,opacity:.45}));d.rotation.x=-Math.PI/2,d.position.y=-.09,n.add(i,f,d),r.add(n),W={pad:n,base:i,rim:f,glow:d},c.push((g,j)=>f.material.color.setHSL(.52,.85,.5+.08*Math.sin(j*1.6)))}const v=new we(new xe({map:Eo(),transparent:!0,depthWrite:!1,depthTest:!1,blending:ne,toneMapped:!1}));v.renderOrder=15,v.visible=!1,a.add(v);let w=1;const F=new p;c.push((n,i)=>{const f=l.getWorldPosition(F);for(const g of L){const j=g.position.distanceTo(f),te=Math.min(5,Math.max(1,j/45));g.scale.set(g.userData.w*te,g.userData.w/4*te,1)}const d=Math.min(1,Math.max(0,(r.position.y-5)/60));for(const g of Y)g.opacity=.12+.3*d;if(v.visible){const g=v.position.distanceTo(f);v.scale.setScalar(Math.max(w,g*.06)*(1+.12*Math.sin(i*4)))}});const T=To(a,h);return c.push((n,i)=>T.update(n,i)),c.push(n=>{for(const i of $)i.mesh.rotation.y+=(i.speed+i.boost)*n,i.boost*=Math.pow(.35,n)}),{bodies:I,tilts:z,sun:N,sunPos:h,moonsOf:C,comet:T,satRingTex:J,skyTexture:S,setPadGlass(n){const{base:i,rim:f,glow:d}=W;i.material.transparent=n,i.material.opacity=n?.18:1,i.material.depthWrite=!n,i.material.needsUpdate=!0,d.visible=!n,f.scale.setScalar(n?.6:1),f.material.transparent=n,f.material.opacity=n?.5:1},markDestination(n){if(!n){v.visible=!1;return}const i=U[n];v.position.copy(ze(n)),w=i.r*3,v.visible=!0},update(n,i){for(const f of c)f(n,i)},arrangeMoons(n,i=0){const f=C[n]||[];f.forEach((d,g)=>{const j=$.find(te=>te.mesh===d);d.rotation.y=-.45-g*2.2/Math.max(1,f.length)+Math.abs(j?j.speed:0)*i})},boost(n,i=2.5){const f=$.find(d=>d.mesh===I[n]);f&&(f.boost=i)},spinnerOf(n){return $.find(i=>i.mesh===I[n])}}}function Bo(e,t,a){const o=new we(new xe({map:e,blending:ne,depthWrite:!1,transparent:!0,toneMapped:!1}));return o.scale.setScalar(t),o.position.copy(a),o}function Fe(e,t,a=.4){const o=document.createElement("canvas");o.width=o.height=256;const r=o.getContext("2d"),l=r.createRadialGradient(128,128,0,128,128,128);l.addColorStop(0,`rgba(${e},0.95)`),l.addColorStop(a*.5,`rgba(${e},0.5)`),l.addColorStop(a,`rgba(${t},0.2)`),l.addColorStop(1,`rgba(${t},0)`),r.fillStyle=l,r.fillRect(0,0,256,256);const u=new ye(o);return u.colorSpace=Pe,u}function Eo(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d");t.strokeStyle="rgba(255,230,120,0.95)",t.shadowColor="rgba(255,200,60,1)",t.shadowBlur=16,t.lineWidth=7,t.setLineDash([26,14]),t.beginPath(),t.arc(128,128,104,0,Math.PI*2),t.stroke();const a=new ye(e);return a.colorSpace=Pe,a}function Oo(){const e=document.createElement("canvas");e.width=e.height=512;const t=e.getContext("2d");t.fillStyle="#000",t.fillRect(0,0,512,512),t.strokeStyle="rgba(34,211,238,0.55)",t.lineWidth=2;for(let o=40;o<256;o+=44)t.beginPath(),t.arc(256,256,o,0,Math.PI*2),t.stroke();for(let o=0;o<12;o++){const r=o/12*Math.PI*2;t.beginPath(),t.moveTo(256+Math.cos(r)*40,256+Math.sin(r)*40),t.lineTo(256+Math.cos(r)*250,256+Math.sin(r)*250),t.stroke()}const a=new ye(e);return a.colorSpace=Pe,a}function Vo(e,t){const a=document.createElement("canvas");a.width=512,a.height=128;const o=a.getContext("2d");o.font='bold 64px "Trebuchet MS", system-ui, sans-serif',o.textAlign="center",o.textBaseline="middle",o.shadowColor="rgba(0,0,0,0.9)",o.shadowBlur=12,o.fillStyle="rgba(220,240,255,0.92)",o.fillText(e[0].toUpperCase()+e.slice(1),256,64);const r=new ye(a);r.colorSpace=Pe;const l=new we(new xe({map:r,transparent:!0,depthWrite:!1,toneMapped:!1})),u=Math.max(2.4,t.r*1.1);return l.scale.set(u,u/4,1),l.userData.w=u,l.position.copy(ze(e)).add(new p(0,t.r*(e==="saturn"?1.5:1.25)+.6,0)),l}function jo(e,[t,a,o,r],l){const u=new fe({uniforms:{uColor:{value:new Z(t,a,o)},uSun:{value:l},uStrength:{value:r}},vertexShader:`varying vec3 vWN; varying vec3 vWP;
      void main(){ vWN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`uniform vec3 uColor; uniform vec3 uSun; uniform float uStrength; varying vec3 vWN; varying vec3 vWP;
      void main(){
        vec3 v = normalize(cameraPosition - vWP);
        float rim = 1.0 - max(dot(v, normalize(vWN)), 0.0);
        float f = pow(rim, 3.0);
        float lit = smoothstep(-0.35, 0.45, dot(normalize(vWN), normalize(uSun - vWP)));
        gl_FragColor = vec4(uColor * f * lit * uStrength, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1});return new G(new ve(e*1.035,64,40),u)}function gt(e,t,a){var l;const o=e.onBeforeCompile,r=(l=e.userData).patchKeys||(l.patchKeys=[]);r.push(t),e.onBeforeCompile=(u,s)=>{o.call(e,u,s),a(u)},e.customProgramCacheKey=()=>r.join("+")}function it(e,t,a,o){const r=Array.from({length:4},()=>new wo),l={uShSun:{value:t},uShSunR:{value:1.6},uOcc:{value:r},uOccN:{value:0},uRingOn:{value:o?1:0},uRingC:{value:new p},uRingN:{value:new p(0,1,0)},uRingIn:{value:o?o.inner:0},uRingOut:{value:o?o.outer:0},uRingTex:{value:o?o.texture:null}},u=new p,s=new p;e.userData.updateShadows=()=>{let m=0;for(const c of a){if(m>=4)break;c.obj.getWorldPosition(u),c.obj.getWorldScale(s),r[m++].set(u.x,u.y,u.z,c.r*Math.max(s.x,s.y,s.z))}l.uOccN.value=m,o&&(o.mesh.getWorldPosition(l.uRingC.value),l.uRingN.value.set(0,0,1).transformDirection(o.mesh.matrixWorld))},gt(e,"shadow"+(o?"R":""),m=>{Object.assign(m.uniforms,l),m.vertexShader=m.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vShWP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vShWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`),m.fragmentShader=m.fragmentShader.replace("#include <common>",`#include <common>
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
        #include <lights_fragment_end>`)})}function qo(e,t){gt(e,"night",a=>{a.uniforms.uSun={value:t},a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWN2; varying vec3 vWP2;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vWN2 = normalize(mat3(modelMatrix) * objectNormal); vWP2 = (modelMatrix * vec4(transformed, 1.0)).xyz;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWN2; varying vec3 vWP2; uniform vec3 uSun;`).replace("#include <emissivemap_fragment>",`#ifdef USE_EMISSIVEMAP
          vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
          float nightF = smoothstep(0.12, -0.22, dot(normalize(vWN2), normalize(uSun - vWP2)));
          totalEmissiveRadiance *= emissiveColor.rgb * nightF;
        #endif`)})}function Go(e,t,a,o,r,l){const u=new mt(e,t,192,1),s=u.attributes.position,m=u.attributes.uv;for(let b=0;b<s.count;b++)m.setXY(b,(Math.hypot(s.getX(b),s.getY(b))-e)/(t-e),.5);const c=new p,h=new fe({uniforms:{map:{value:a},uSun:{value:r},uPlanet:{value:c},uR:{value:o.geometry.parameters.radius},uB:{value:l}},vertexShader:`varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
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
      }`,transparent:!0,side:Ye,depthWrite:!1}),S=new G(u,h);return S.rotation.x=-Math.PI/2,S.onBeforeRender=()=>o.getWorldPosition(c),S}function Lo(e){gt(e,"grade",t=>{t.fragmentShader=t.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
      {
        vec3 c = diffuseColor.rgb;
        float ocean = smoothstep(0.0, 0.06, c.b - max(c.r, c.g * 0.9));
        float arid = clamp((c.r - c.b) * 1.8, 0.0, 1.0) * (1.0 - ocean);
        vec3 land = mix(c * vec3(0.95, 1.04, 0.88), c * vec3(1.06, 0.86, 0.68), arid * 0.78);
        diffuseColor.rgb = mix(land, c * vec3(0.68, 0.88, 1.18), ocean);
      }`)})}function Uo(e){const t=Math.sin(e*190),a=Math.sin(e*540+1.2),o=Math.sin(e*1480+2.5),r=.5+.22*t+.15*a+.09*o,l=Te(.02,.98,r),u=[.72,.58,.45],s=[.56,.44,.34],m=[.38,.29,.22],c=(h,S,b)=>h.map((P,_)=>P+(S[_]-P)*b);if(e<.08)return[m,Te(0,.08,e)*.22*l];if(e<.28){const h=.5+.5*Math.sin(e*120);return[c(m,s,h),(.18+.38*h)*l]}if(e<.64){const h=.65+.35*Math.sin(e*75)*Math.cos(e*160);return[c(s,u,l*h),(.62+.34*l)*h*Te(.004,.011,Math.abs(e-.39))*Te(.005,.013,Math.abs(e-.51))]}return e<.72?[m,.03]:e<.94?[c(s,u.map(h=>h*.92),l),(.5+.38*l)*Te(.005,.014,Math.abs(e-.85))*Te(.002,.006,Math.abs(e-.92))]:[u,Math.exp(-(((e-.975)*95)**2))*.65]}function Te(e,t,a){const o=Math.min(1,Math.max(0,(a-e)/(t-e)));return o*o*(3-2*o)}function $o(e,t,a,o){const r=new mt(e,t,256,1),l=new p,u=new fe({uniforms:{uSunPos:{value:o},uPlanetPos:{value:l},uPlanetRadius:{value:a.geometry.parameters.radius},uInnerRadius:{value:e},uOuterRadius:{value:t}},vertexShader:`varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
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
      }`,transparent:!0,side:Ye,depthWrite:!1}),s=new G(r,u);return s.rotation.x=-Math.PI/2,s.onBeforeRender=()=>a.getWorldPosition(l),s}function Ht(e){const t=document.createElement("canvas");t.width=1024,t.height=2;const a=t.getContext("2d");for(let r=0;r<1024;r++){const[l,u,s,m]=e(r/1024);a.fillStyle=`rgba(${l|0},${u|0},${s|0},${Math.max(0,Math.min(1,m))})`,a.fillRect(r,0,1,2)}const o=new ye(t);return o.colorSpace=Pe,o}function Ho(){return Ht(e=>{const[t,a]=Uo(e);return[Math.pow(t[0],1/2.2)*255*1.15,Math.pow(t[1],1/2.2)*255*1.15,Math.pow(t[2],1/2.2)*255*1.15,Math.min(.92,a)]})}function Xo(){return Ht(e=>{const t=[.1,.3,.45,.62,.8,.95];let a=0;for(const o of t)a=Math.max(a,Math.exp(-(((e-o)/.012)**2)));return[170,190,200,a*.55]})}const Oe=`
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
}`,le=[{id:"sun",name:"The Sun",accent:"#fbbf24",text:["The Sun is a star: a giant ball of hot, glowing gas. Everything in the solar system goes around it.","It is about 109 Earths wide, and it makes up almost all of the weight of the whole solar system."],secret:"The surface is around 5 500 °C, and light from the Sun takes about 8 minutes to reach Earth."},{id:"mercury",name:"Mercury",accent:"#cbd5e1",text:["Mercury is the closest planet to the Sun and the smallest. It has no air to hold heat in.","Days are scorching hot and nights are freezing cold. A year here is only 88 Earth days long."],secret:"Its surface is covered in craters from space rocks crashing into it, just like our Moon."},{id:"venus",name:"Venus",accent:"#fcd34d",text:["Venus is wrapped in thick clouds that trap heat. That makes it the hottest planet, even hotter than Mercury.","It also spins backwards compared to most planets."],secret:"It is about 465 °C on the surface: hot enough to melt lead!"},{id:"earth",name:"Earth",accent:"#60a5fa",text:["This is home! Earth is the only planet we know of with life. About 70% of it is covered in water.","It takes 365 days to go around the Sun, which is one year. Earth has one Moon."],secret:"See the pin? That is Cape Town, where you are right now! The lights on the dark side are cities at night."},{id:"mars",name:"Mars",accent:"#fb923c",text:["Mars is called the Red Planet because its dust and rocks contain iron that has rusted.","It has the biggest volcano in the solar system, Olympus Mons, and two tiny moons."],secret:"Robots called rovers are exploring Mars right now, looking for signs of water and life."},{id:"jupiter",name:"Jupiter",accent:"#f59e0b",text:["Jupiter is the biggest planet. More than 1 000 Earths could fit inside it!","It is a gas giant with no solid ground. The Great Red Spot is a storm bigger than Earth that has lasted for hundreds of years."],secret:"Jupiter has more than 90 moons. You can see its four biggest moons circling it."},{id:"saturn",name:"Saturn",accent:"#fde68a",text:["Saturn is famous for its beautiful rings. They are made of billions of pieces of ice and rock.","Saturn is so light for its size that it would float in a giant bathtub of water!"],secret:"Saturn has well over 100 moons. Its biggest, Titan, has thick orange clouds."},{id:"uranus",name:"Uranus",accent:"#67e8f9",text:["Uranus is an ice giant that is tipped over on its side, so it rolls around the Sun like a ball.","It is freezing cold, and one trip around the Sun takes 84 Earth years."],secret:"Its blue-green colour comes from methane gas, and it has thin, dark rings."},{id:"neptune",name:"Neptune",accent:"#818cf8",text:["Neptune is the farthest planet from the Sun. It is dark, cold and very windy, with the fastest winds of any planet.","One year on Neptune is about 165 Earth years."],secret:"Neptune was found using maths before anyone saw it through a telescope!"}],Ne=[{q:"What is at the centre of our solar system?",options:["The Moon","The Sun","Jupiter","Earth"],answer:1},{q:"Which planet is the hottest?",options:["Mercury","Mars","Venus","Neptune"],answer:2},{q:"Why does Mars look red?",options:["It is on fire","Rusty iron in its dust and rocks","It is close to the Sun","It is covered in lava"],answer:1},{q:"Which is the biggest planet?",options:["Saturn","Earth","Jupiter","Uranus"],answer:2},{q:"Which is the only planet we know has life?",options:["Mars","Earth","Venus","Mercury"],answer:1}],_e=new p(.62,.22,.75).normalize(),tt=-8,Ve=new p(280,22,280),Yo=3.2;function Zo({saturnMap:e,ringTex:t,skyTex:a}){const o=new pt;o.fog=new Lt(8221540,.0085);const r=new st(16774114,3.4);r.position.copy(_e).multiplyScalar(100),o.add(r);const l=new st(15124634,.7);l.position.set(-.2,.1,-1).multiplyScalar(100),o.add(l),o.add(new Ot(10135224,.3));const u=new be;o.add(u);const s=new G(new ve(1900,48,24),new De({map:a,side:ft,depthWrite:!1,fog:!1,toneMapped:!1,color:12303291}));s.renderOrder=-10,o.add(s);const m=new we(new xe({map:Fe([255,250,235],[255,200,120],.25),blending:ne,depthWrite:!1,fog:!1,toneMapped:!1}));m.position.copy(_e).multiplyScalar(1700),m.scale.setScalar(150),o.add(m);const c=new p(180,0,-1e3),h=580,S=720,b=1340,P=new me({map:e,roughness:1,metalness:0,fog:!1}),_=new G(new ve(h,128,80),P);_.position.copy(c),_.rotation.z=.05,_.renderOrder=-6,u.add(_);const N=new mt(S,b,512,8),O=N.attributes.position,H=N.attributes.uv;for(let C=0;C<O.count;C++)H.setXY(C,(Math.hypot(O.getX(C),O.getY(C))-S)/(b-S),.5);const k=new fe({uniforms:{map:{value:t},uSun:{value:_e},uSat:{value:c},uR:{value:h}},vertexShader:"varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = (wp.xyz - (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`${Oe}
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
      }`,transparent:!1,blending:xo,side:Ye,depthWrite:!1,fog:!1}),B=new G(N,k);B.rotation.x=-Math.PI/2,B.position.set(c.x,(tt-1.6)/100,c.z),B.renderOrder=-5,u.add(B);const I=new p;it(P,I,[],{mesh:B,inner:S,outer:b,texture:t}),P.userData.shadowSunR=1;const z={value:new p},L={value:0},$={value:Ve};function X(C,q){let R=new dt(1,C);R.deleteAttribute("normal"),R.deleteAttribute("uv"),R=yo(R);const E=R.attributes.position;for(let y=0;y<E.count;y++){const Y=new p().fromBufferAttribute(E,y),W=1+.24*Math.sin(Y.x*4.1+q)*Math.cos(Y.y*3.7+q*2)+.12*Math.sin(Y.z*8.3+q*3)+.05*Math.sin(Y.x*17+Y.y*13);Y.multiplyScalar(W),E.setXYZ(y,Y.x*1.15,Y.y*.85,Y.z)}return R.computeVertexNormals(),R}function ee(C,q,R,E){const y=new Float32Array(q*3),Y=new Float32Array(q*4),W=new me({color:16777215,roughness:.62,metalness:0}),v=new jt(C,W,q),w=new Xe,F=new Le,T=new qt,n=new p,i=new p,f=new Z;let d=0;for(;d<q;){const g=(Math.random()-.5)*Ve.x,j=(Math.random()-.5)*Ve.z,te=tt+(Math.random()+Math.random()+Math.random()-1.5)*(Ve.y/3),re=R();if(Math.abs(j)<3.5+re&&Math.abs(te-1)<3+re)continue;y.set([g,te,j],d*3);const ie=new p().randomDirection();Y.set([ie.x,ie.y,ie.z,(.04+Math.random()*.25)/Math.sqrt(re+.2)],d*4),T.set(Math.random()*6,Math.random()*6,Math.random()*6),F.setFromEuler(T),n.set(re,re*(.7+Math.random()*.3),re*(.8+Math.random()*.4)),w.compose(i,F,n),v.setMatrixAt(d,w);const ue=Math.random();f.setRGB(.97,.95-.04*ue,.9-.07*ue),Math.random()<.15&&f.multiplyScalar(.55),v.setColorAt(d,f),d++}return C.setAttribute("aBase",new kt(y,3)),C.setAttribute("aSpin",new kt(Y,4)),v.frustumCulled=!1,W.onBeforeCompile=g=>{g.uniforms.uOffset=z,g.uniforms.uTime=L,g.uniforms.uBox=$,g.vertexShader=g.vertexShader.replace("#include <common>",`#include <common>
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
          gl_Position = projectionMatrix * mvPosition;`),g.fragmentShader=g.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vObjP;
${Oe}`).replace("#include <color_fragment>",`#include <color_fragment>
          float grime = snoise(vObjP * 2.7) * 0.5 + snoise(vObjP * 7.9) * 0.25;
          diffuseColor.rgb *= 0.78 + 0.3 * grime;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), smoothstep(0.55, 0.9, snoise(vObjP * 5.3 + 11.0)) * 0.35);`)},W.customProgramCacheKey=()=>"ringchunks"+E,o.add(v),v}ee(X(3,1.7),260,()=>.7+2.4*Math.pow(Math.random(),3),"big"),ee(X(1,4.2),2800,()=>.05+.65*Math.pow(Math.random(),2.5),"small");const A=6e3,V=new Float32Array(A*3);for(let C=0;C<A;C++)V.set([(Math.random()-.5)*120,tt+(Math.random()-.5)*18,(Math.random()-.5)*120],C*3);const D=new Se;D.setAttribute("position",new oe(V,3));const J=new fe({uniforms:{uOffset:z,uTime:L},vertexShader:`uniform vec3 uOffset; uniform float uTime; varying float vA;
      void main(){
        vec3 p = position; p.xz = mod(p.xz - uOffset.xz + 60.0, 120.0) - 60.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float d = -mv.z;
        vA = (0.5 + 0.5 * sin(uTime * 3.0 + position.x * 13.0)) * smoothstep(60.0, 8.0, d);
        gl_PointSize = clamp(60.0 / d, 1.0, 4.0);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:"varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * vA * smoothstep(0.5, 0.0, d), 1.0); }",transparent:!0,depthWrite:!1,blending:ne}),K=new Ee(D,J);return K.frustumCulled=!1,o.add(K),{scene:o,start:{position:new p(0,0,0),yaw:-Math.PI/2},update(C,q,R){var E,y;L.value=q,z.value.x+=Yo*C,u.position.copy(R.position).add(new p(0,1.6,0)),s.position.copy(R.position),m.position.copy(_e).multiplyScalar(1700).add(R.position),I.copy(_e).multiplyScalar(1e6).add(u.position),u.updateMatrixWorld(!0),(y=(E=P.userData).updateShadows)==null||y.call(E)}}}const he=6371,Qo=Math.PI/180,We={lat:-33.96,lon:18.4},ot={lon0:17.8,lon1:19.4,lat0:-34.45,lat1:-33.5},Jo={lon0:12,lon1:26,lat0:-36,lat1:-28},Dt={lon0:18.3,lon1:18.56,lat0:-34.2,lat1:-33.88},je=1.5,at=new URL("../textures/cape/",location.href).href;function Ue(e,t){const a=(90-e)*Qo,o=(t+180)/360*Math.PI*2;return new p(-Math.cos(o)*Math.sin(a),Math.cos(a),Math.sin(o)*Math.sin(a))}const Ie=Ue(We.lat,We.lon),Be=Ue(We.lat,We.lon+.01).sub(Ue(We.lat,We.lon-.01)).normalize(),qe=new p().crossVectors(Ie,Be).normalize();function lt(e,t,a=0){const o=Ue(e,t).multiplyScalar(he+a).sub(Ie.clone().multiplyScalar(he));return new p(o.dot(Be),o.dot(Ie),-o.dot(qe))}const Xt=9e3,Yt=7,Ko=.62,ea=Math.asin(19/(he+Yt)),ta=e=>e*e*e*(e*(6*e-15)+10);function Ft(e){const t=ta(Math.min(1,Math.max(0,e))),a=Math.exp(Math.log(Xt)*(1-t)+Math.log(Yt)*t),o=Math.exp(Math.log(Ko)*(1-t)+Math.log(ea)*t);return{a,H:new p(-(he+a)*Math.sin(o),-he+(he+a)*Math.cos(o),0)}}const nt=new p(-.41,.574,-.709).normalize();function rt(e,t,a,o,r,l=.06,u=e,s=null){const m=new Float32Array(t*a*3),c=new Float32Array(t*a*2),h=new Float32Array(t*a*4);for(let P=0;P<a;P++){const _=1-P/(a-1),N=e.lat0+_*(e.lat1-e.lat0);for(let O=0;O<t;O++){const H=O/(t-1),k=e.lon0+H*(e.lon1-e.lon0),B=P*t+O;let I=r;if(o){const $=o[B];I+=$>0?$*je/1e3:0}let z=Math.min(1,Math.min(H,1-H,_,1-_)/l);if(z=z*z*(3-2*z),s){const $=(k-s.lon0)/(s.lon1-s.lon0),X=(N-s.lat0)/(s.lat1-s.lat0),ee=Math.min($,1-$,X,1-X);ee>0&&(z*=1-Math.min(1,Math.max(0,ee-.02)/.06),I-=.04*Math.min(1,ee/.06))}const L=lt(N,k,I);m.set([L.x,L.y,L.z],B*3),c.set([(k-u.lon0)/(u.lon1-u.lon0),(N-u.lat0)/(u.lat1-u.lat0)],B*2),h.set([1,1,1,z],B*4)}}const S=[];for(let P=0;P<a-1;P++)for(let _=0;_<t-1;_++){const N=P*t+_,O=N+1,H=N+t,k=H+1;S.push(N,H,O,O,H,k)}const b=new Se;return b.setAttribute("position",new oe(m,3)),b.setAttribute("uv",new oe(c,2)),b.setAttribute("color",new oe(h,4)),b.setIndex(S),b.computeVertexNormals(),b}function oa(e,t){const a=document.createElement("canvas");a.width=640,a.height=t?176:112;const o=a.getContext("2d");o.fillStyle="rgba(8,14,28,0.72)",o.beginPath(),o.roundRect(6,6,628,a.height-12,36),o.fill(),o.textAlign="center",o.textBaseline="middle",o.fillStyle="#ffffff",o.font='bold 56px "Trebuchet MS", system-ui, sans-serif',o.fillText(e,320,t?66:58,600),t&&(o.fillStyle="#9fd8ff",o.font='38px "Trebuchet MS", system-ui, sans-serif',o.fillText(t,320,130,600));const r=new ye(a);r.colorSpace=Pe;const l=new we(new xe({map:r,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}));return l.renderOrder=30,l.userData.aspect=a.width/a.height,l}function aa(){const e=document.createElement("canvas");e.width=e.height=128;const t=e.getContext("2d");for(let a=0;a<26;a++){const o=64+(Math.random()-.5)*60,r=64+(Math.random()-.5)*40,l=14+Math.random()*26,u=t.createRadialGradient(o,r,0,o,r,l);u.addColorStop(0,"rgba(255,255,255,0.5)"),u.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=u,t.fillRect(0,0,128,128)}return new ye(e)}function na({earthMap:e,skyTex:t,renderer:a}){const o=new pt;o.fog=new Lt(12044508,0);const r=new be;o.add(r);const l=Math.min(8,a.capabilities.getMaxAnisotropy()),u=new Et,s=(A,V=!0)=>new Promise(D=>u.load(at+A,J=>{V&&(J.colorSpace=Pe),J.anisotropy=l,D(J)},void 0,()=>D(null))),m=new st(16774374,3);m.position.copy(nt).multiplyScalar(100),o.add(m),o.add(new bo(11061503,6181956,.55));const c=new fe({uniforms:{uStars:{value:t},uAlt:{value:Xt},uSun:{value:nt},uDip:{value:0}},vertexShader:"varying vec3 vDir; varying vec2 vUv; void main(){ vDir = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D uStars; uniform float uAlt; uniform vec3 uSun; uniform float uDip; varying vec3 vDir; varying vec2 vUv;
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
      }`,side:ft,depthWrite:!1,fog:!1,toneMapped:!0}),h=new G(new ve(1800,64,32),c);h.renderOrder=-10,o.add(h);const S=new me({map:e,roughness:.75,metalness:0}),b=new G(new ve(he-5,192,110),S),P=new Xe().set(Be.x,Be.y,Be.z,0,Ie.x,Ie.y,Ie.z,0,-qe.x,-qe.y,-qe.z,0,0,0,0,1);b.quaternion.setFromRotationMatrix(P),b.position.set(0,-he,0),r.add(b);const _=new fe({uniforms:{uSun:{value:nt},uOn:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; varying vec3 vWN; void main(){ vN = normalize(normalMatrix * normal); vWN = normalize(mat3(modelMatrix) * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uSun; uniform float uOn; varying vec3 vN; varying vec3 vV; varying vec3 vWN;
      void main(){ float rim = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0); float lit = smoothstep(-0.3, 0.4, dot(normalize(vWN), uSun));
        gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * pow(rim, 4.0) * 1.6 * lit * uOn, 1.0); }`,transparent:!0,depthWrite:!1,blending:ne,fog:!1}),N=new G(new ve(he+70,128,64),_);N.position.set(0,-he,0),r.add(N);const O=[],H=[];let k=null;function B(){return k||(k=(async()=>{const[A,V,D,J,K,C,q,R]=await Promise.all([s("region.jpg"),s("region_n.jpg",!1),s("detail.jpg"),s("detail_n.jpg",!1),s("detail_rough.jpg",!1),s("detail_a.jpg",!1),fetch(at+"detail_h.bin").then(T=>T.arrayBuffer()),fetch(at+"pen_h.bin").then(T=>T.arrayBuffer())]),E=new G(rt(Jo,180,104,null,-.3,.16),new me({map:A,normalMap:V,normalScale:new Vt(1.4,1.4),roughness:.8,metalness:0,vertexColors:!0,transparent:!0}));E.renderOrder=1,r.add(E);const y=new Int16Array(q),Y=new me({map:D,normalMap:J,roughnessMap:K,alphaMap:C,roughness:1,metalness:0,vertexColors:!0,transparent:!0}),W=new G(rt(ot,321,241,y,0,.05,ot,Dt),Y);W.renderOrder=2,r.add(W);const v=new G(rt(Dt,241,321,new Int16Array(R),0,.08,ot),Y);v.renderOrder=3,r.add(v);const w=(T,n,i,f,d)=>{const g=oa(T,n);g.position.copy(lt(i,f,d)),r.add(g),O.push(g)};w("Table Mountain","1 085 m high",-33.9575,18.405,1.085*je+.9),w("Lion's Head",null,-33.9351,18.389,.67*je+.6),w("Cape Town","city centre",-33.922,18.423,.9),w("Robben Island",null,-33.806,18.366,.6),w("Cape Point",null,-34.357,18.497,.9),w("False Bay",null,-34.2,18.65,.5),w("Stellenbosch",null,-33.935,18.86,.9),w("Table Bay",null,-33.87,18.43,.4),w("Atlantic Ocean",null,-34.05,18.15,.4);const F=aa();for(let T=0;T<34;T++){const n=T/33,i=new we(new xe({map:F,transparent:!0,depthWrite:!1,opacity:0,fog:!0}));i.userData={t:n,phase:Math.random(),size:.6+Math.random()*.5},i.renderOrder=10,r.add(i),H.push(i)}})(),k)}let I="idle",z=0,L=null;const $=new p,X=new p;function ee(A,V,D,J){if(I==="down"){if(z=Math.min(1,z+D/24),z>=1){I="hover";const W=L;L=null,W&&W()}}else if(I==="up"&&(z=Math.max(0,z-D/13),z<=0)){I="idle";const W=L;L=null,W&&W()}const{a:K,H:C}=Ft(z),q=200/K;$.copy(A.position).add(new p(0,1.6,0)),r.scale.setScalar(q),r.position.copy($).addScaledVector(C,-q),h.position.copy(A.position);const R=.0085*Math.pow(Math.min(1,30/K),.9);o.fog.density=R/q,c.uniforms.uAlt.value=K,c.uniforms.uDip.value=Math.acos(he/(he+K)),_.uniforms.uOn.value=Ge.smoothstep(K,60,160);const E=1-Ge.smoothstep(K,60,140);V.getWorldPosition(X);for(const W of O){W.visible=E>.02,W.material.opacity=E;const w=W.getWorldPosition(new p).distanceTo(X)*.16/q;W.scale.set(w,w/W.userData.aspect,1)}const y=[-33.9545,18.392],Y=[-33.9575,18.42];for(const W of H){const v=(W.userData.phase+J*.035)%1,w=y[0]+(Y[0]-y[0])*W.userData.t+.006-v*.012,F=y[1]+(Y[1]-y[1])*W.userData.t,T=1.06*je+.22-Math.max(0,v-.45)*1.2;W.position.copy(lt(w,F,T)),W.scale.setScalar(W.userData.size),W.material.opacity=Math.sin(v*Math.PI)*.9*E}}return{scene:o,start:{position:new p(0,0,0),yaw:-Math.PI/2},load:B,altitude:()=>Ft(z).a,descend(A){z=0,I="down",L=A},ascend(A){I="up",L=A},reset(){z=0,I="idle"},skip(){I==="down"&&(z=.999)},setProgress(A){z=A},get mode(){return I},update:ee}}const M=Mo(),{scene:Zt,rig:wt}=M;document.getElementById("enter").appendChild(M.vrButton);const xt=new So,$e=document.getElementById("loading");xt.onProgress=(e,t,a)=>{$e&&($e.querySelector("span").textContent=`${Math.round(t/a*100)}%`)};xt.onLoad=()=>$e&&$e.classList.add("done");const Q=_o(M,xt),yt=M.scene;M.onFrame((e,t)=>{M.activeScene===yt&&Q.update(e,t)});let Ce=null;M.onFrame((e,t)=>{Ce&&M.activeScene===Ce.scene&&Ce.update(e,t,wt)});let ge=null;const bt=()=>ge||(ge=na({earthMap:Q.bodies.earth.material.map,skyTex:Q.skyTexture,renderer:M.renderer}));let It=0;M.onFrame((e,t)=>{!ge||M.activeScene!==ge.scene||(ge.update(wt,M.camera,e,t),ge.mode==="down"&&t-It>.4&&(It=t,ao()))});const ae=Po(),ce=Co(new URL("../audio/solar-system/",location.href).href);M.onGesture(()=>ae.unlock());const Mt={position:new p(-34,0,0),yaw:-Math.PI/2},se=new zo({width:1.35});se.mesh.position.set(.95,1.25,-1.6);se.mesh.rotation.y=-.38;M.addPanel(se);const x={travel:"fly",screen:"intro",stop:0,quiz:0,score:0,answered:null,discovered:new Set},ra=()=>x.screen==="stop"?le[x.stop].id:null;for(const e of le){const t=e.id==="sun"?Q.sun:Q.bodies[e.id];M.addTarget(t,"planet:"+e.id,()=>ra()===e.id)}const sa=(()=>{const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d");return t.strokeStyle="rgba(120,230,255,0.9)",t.lineWidth=6,t.shadowColor="rgba(80,220,255,1)",t.shadowBlur=14,t.beginPath(),t.arc(128,128,110,0,Math.PI*2),t.stroke(),new ye(e)})(),Me=new we(new xe({map:sa,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}));Me.visible=!1;Zt.add(Me);let Re=null;M.onHoverTarget(e=>{if(Re=e?e.slice(7):null,Me.visible=!!Re&&!x.discovered.has(Re),Re){const t=U[Re];Me.position.copy(ze(Re)),Me.userData.size=t.r*2.6}});M.onFrame((e,t)=>{Me.visible&&Me.scale.setScalar(Me.userData.size*(1+.04*Math.sin(t*5)))});const Qt=(()=>{const t=new Se;t.setAttribute("position",new oe(new Float32Array(270),3));const a=(()=>{const s=document.createElement("canvas");s.width=s.height=64;const m=s.getContext("2d"),c=m.createRadialGradient(32,32,0,32,32,32);return c.addColorStop(0,"rgba(255,255,255,1)"),c.addColorStop(.3,"rgba(190,240,255,0.8)"),c.addColorStop(1,"rgba(120,200,255,0)"),m.fillStyle=c,m.fillRect(0,0,64,64),new ye(s)})(),o=new _t({map:a,color:16777215,size:.3,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),r=new Ee(t,o);r.visible=!1,r.frustumCulled=!1,Zt.add(r);const l=Array.from({length:90},()=>new p);let u=0;return M.onFrame(s=>{if(!r.visible)return;u+=s;const m=t.attributes.position;for(let c=0;c<90;c++)m.setXYZ(c,m.getX(c)+l[c].x*s,m.getY(c)+l[c].y*s,m.getZ(c)+l[c].z*s),l[c].multiplyScalar(Math.pow(.4,s));m.needsUpdate=!0,o.opacity=Math.max(0,1-u/1.6),u>1.6&&(r.visible=!1)}),(s,m,c=.1*m)=>{const h=t.attributes.position;for(let S=0;S<90;S++)h.setXYZ(S,s.x,s.y,s.z),l[S].randomDirection().multiplyScalar((1+Math.random()*3)*m);o.size=c,u=0,r.visible=!0}})(),Nt={lat:-33.92,lon:18.42},Qe=(()=>{const e=U.earth.r,t=(Nt.lon+180)/360,a=t*Math.PI*2,o=(90-Nt.lat)/180*Math.PI,r=new p(-Math.cos(a)*Math.sin(o),Math.cos(o),Math.sin(a)*Math.sin(o)),l=new be,u=new G(new ve(.06,16,12),new De({color:16731501,toneMapped:!1}));u.position.copy(r).multiplyScalar(e*1.005);const s=new G(new Gt(.012,.012,.8,8),new De({color:16748451,transparent:!0,opacity:.8,toneMapped:!1}));s.position.copy(r).multiplyScalar(e+.4),s.quaternion.setFromUnitVectors(new p(0,1,0),r);const m=document.createElement("canvas");m.width=768,m.height=128;const c=m.getContext("2d");c.fillStyle="rgba(10,16,32,0.85)",c.beginPath(),c.roundRect(8,16,752,96,44),c.fill(),c.font='bold 52px "Trebuchet MS", system-ui, sans-serif',c.fillStyle="#ffd1dc",c.textAlign="center",c.textBaseline="middle",c.fillText("Cape Town: you are here!",384,66,720);const h=new we(new xe({map:new ye(m),depthTest:!1,transparent:!0,toneMapped:!1}));return h.scale.set(2.7,.45,1),h.position.copy(r).multiplyScalar(e+1),h.renderOrder=20,l.add(u,s,h),l.visible=!1,Q.bodies.earth.add(l),l.userData.dir=r,l})();let pe=null;function ia(){const e=Q.bodies.earth,t=ze("earth"),a=new p(-1,0,0),o=e.rotation.y;let r=0,l=-2;for(let m=0;m<360;m+=2){e.rotation.y=m*Math.PI/180,e.updateMatrixWorld(!0);const h=Qe.userData.dir.clone().applyMatrix4(e.matrixWorld).sub(t).normalize().dot(a);h>l&&(l=h,r=e.rotation.y)}e.rotation.y=o;let u=((r-o%(Math.PI*2))%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;pe={from:o,to:o+u,t:0};const s=Q.spinnerOf("earth");s&&(s.saved=s.saved??s.speed,s.speed=0,s.boost=0)}M.onFrame(e=>{if(!pe)return;pe.t=Math.min(1,pe.t+e/1.8);const t=pe.t<.5?2*pe.t**2:1-(-2*pe.t+2)**2/2;Q.bodies.earth.rotation.y=pe.from+(pe.to-pe.from)*t,pe.t>=1&&(pe=null,Qe.visible=!0)});function Jt(){Qe.visible=!1,pe=null;const e=Q.spinnerOf("earth");e&&e.saved!==void 0&&(e.speed=e.saved,delete e.saved)}function Kt(e,t){x.discovered.has(e)||(x.discovered.add(e),Me.visible=!1,ae.sfx.sparkle(),Qt(t||ze(e),Math.max(1,U[e].r*.4)),e==="earth"?ia():Q.boost(e,2.5),Je(),ce.play("secret-"+e))}function eo(e,t,a,o){ce.stop();const r=e.position.distanceTo(wt.position)>12;x.travel==="fly"&&r?(Q.markDestination(t),Q.arrangeMoons(t,8.6),se.show({title:`Next stop: ${a}`,body:"Hold on, explorer! We are flying up to see the whole solar system.",buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),ae.sfx.cruise(8.6),M.fly(e,No,{out:3.2,hold:1.8,in:3.6,onVia:()=>se.show({title:"The whole solar system!",body:["Look down: there is the Sun and all the planets going around it.",`The glowing ring shows ${a}, our next stop.`],buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),then:()=>{Q.markDestination(null),o()}})):(ae.sfx.whoosh(),M.teleport(e,o))}function la(){return{id:"sound",label:ae.enabled?"Sound: on":"Sound: off"}}function to(){Ce||(Ce=Zo({saturnMap:Q.bodies.saturn.material.map,ringTex:Q.satRingTex,skyTex:Q.skyTexture})),x.screen="ringdive",ce.stop(),ae.sfx.whoosh(),M.blink(()=>{M.setScene(Ce.scene),M.placeNow(Ce.start),se.show({title:"Inside Saturn's rings!",body:["The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house.","That giant ball beside you is Saturn. Look all around you!"],footer:"The rings are huge but very thin: often only about 10 metres thick.",buttons:[{id:"leavedive",label:"Back to Saturn",primary:!0}],accent:"#fde68a"}),ce.play("ringdive")})}function oo(){ce.stop(),ae.sfx.whoosh(),M.blink(()=>{M.setScene(yt),M.placeNow(vt("saturn")),x.screen="stop",Je()})}const ca=e=>(e>=100?Math.round(e/10)*10:Math.round(e)).toLocaleString("en-ZA");function ao(){const e=ge.altitude();se.show({title:"Flying down to Cape Town",body:[`Height above the ground: ${ca(e)} km`,e>400?"Look down: that is Africa below you!":e>60?"Find the tip of Africa: that is the Cape.":"Almost there... look ahead for Table Mountain."],buttons:[{id:"capeskip",label:"Skip ahead"}],accent:"#60a5fa"})}async function no(){const e=bt();x.screen="cape",ce.stop(),se.show({title:"Getting ready...",body:"Loading the map of the Cape.",accent:"#60a5fa"}),await e.load(),ae.sfx.whoosh(),M.blink(()=>{M.setScene(e.scene),M.placeNow(e.start),Q.setPadGlass(!0),M.camera.far=4e5,M.camera.updateProjectionMatrix(),e.descend(()=>{se.show({title:"Cape Town from 7 km up!",body:["Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet.","To the right is False Bay, and far behind are the mountains of the Winelands."],footer:"See the cloud spilling over Table Mountain? Capetonians call it the tablecloth.",buttons:[{id:"leavecape",label:"Back to space",primary:!0}],accent:"#60a5fa"}),ce.play("cape")}),ao(),ae.sfx.cruise(24)})}function ro(){ce.stop(),se.show({title:"Back to space!",body:"Hold on, we are flying up.",accent:"#60a5fa"}),ae.sfx.cruise(13),ge.ascend(()=>{M.blink(()=>{M.setScene(yt),Q.setPadGlass(!1),M.camera.far=2e3,M.camera.updateProjectionMatrix(),M.placeNow(vt("earth")),ge.reset(),x.screen="stop",Je()})})}function ct(){x.screen="intro",se.show({title:"Journey through the Solar System",body:["Welcome, space explorer! We will visit the Sun and all 8 planets.","Point at a button and squeeze the trigger (or pinch your fingers) to choose it."],footer:'Sizes and distances are made to fit, not to scale. Feeling dizzy when flying? Choose "Travel: jump".',buttons:[{id:"start",label:"Start",primary:!0},la(),{id:"travel",label:x.travel==="fly"?"Travel: fly":"Travel: jump"}],accent:"#22d3ee"}),ce.play("intro")}function Je(){const e=x.stop,t=le[e],a=x.discovered.has(t.id);se.show({title:`${e+1}/${le.length}  ${t.name}`,body:t.text,footer:a?`Secret: ${t.secret}`:`Point at ${t.id==="sun"?"the Sun":t.name} and squeeze to discover a secret!`,footerColor:a?t.accent:"#8fa6c9",buttons:[...e>0?[{id:"back",label:"Back"}]:[],...t.id==="saturn"?[{id:"ringdive",label:"Dive into rings"}]:[],...t.id==="earth"?[{id:"cape",label:"Fly to Cape Town"}]:[],{id:"next",label:e===le.length-1?"Take the quiz":"Next planet",primary:!0}],accent:t.accent})}function Ae(e){x.screen="travel",Jt(),x.travel!=="fly"&&Q.arrangeMoons(le[e].id,.8),eo(vt(le[e].id),le[e].id,le[e].name,()=>{le[e].id==="earth"&&bt().load(),x.screen="stop",x.stop=e,Je(),ce.play(le[e].id)})}function He(e){x.screen="quiz",x.quiz=e,x.answered=null;const t=Ne[e],a=()=>se.show({title:`Question ${e+1} of ${Ne.length}`,body:t.q,stack:!0,accent:"#a78bfa",buttons:t.options.map((o,r)=>({id:"ans"+r,label:o,state:x.answered!==null?r===t.answer?"right":r===x.answered?"wrong":void 0:void 0}))});x.redraw=a,e===0?(x.score=0,x.screen="travel",Jt(),eo(Mt,"sun","Quiz time",()=>{x.screen="quiz",a(),ce.play("quiz")})):(a(),ce.play("q"+(e+1)))}function so(){x.screen="result";const e=x.score/Ne.length,t=e===1?"result-perfect":e>=.6?"result-good":"result-try",a=e===1?"Perfect! You are a real space expert!":e>=.6?"Great job, explorer!":"Good try! Fly the tour again to learn even more.";se.show({title:`You got ${x.score} out of ${Ne.length}!`,body:[a,`You discovered ${x.discovered.size} of ${le.length} secrets on the way.`],buttons:[{id:"again",label:"Fly again",primary:!0}],accent:"#34d399"}),ae.sfx.fanfare(),Qt(new p(Mt.position.x+1.6,1.4,-.9),.5,.04),ce.play(t)}M.onPress((e,t,a)=>{if(e.startsWith("planet:"))return Kt(e.slice(7),a);if(ae.sfx.click(),e==="skip")return M.skipFlight();if(!M.isMoving()){if(e==="travel")return x.travel=x.travel==="fly"?"jump":"fly",ct();if(e==="sound")return ae.setEnabled(!ae.enabled),ce.setEnabled(ae.enabled),ct();if(x.screen==="intro"&&e==="start")return Ae(0);if(x.screen==="ringdive"&&e==="leavedive")return oo();if(x.screen==="cape"){if(e==="capeskip"&&ge){ge.skip();return}return e==="leavecape"&&ge&&ge.mode==="hover"?ro():void 0}if(x.screen==="stop"){if(e==="ringdive")return to();if(e==="cape")return no();if(e==="next")return x.stop===le.length-1?He(0):Ae(x.stop+1);if(e==="back")return Ae(x.stop-1)}if(x.screen==="quiz"&&e.startsWith("ans")&&x.answered===null){const o=Number(e.slice(3));x.answered=o,o===Ne[x.quiz].answer?(x.score++,ae.sfx.correct()):ae.sfx.wrong(),x.redraw(),setTimeout(()=>x.quiz===Ne.length-1?so():He(x.quiz+1),1500);return}if(x.screen==="result"&&e==="again")return x.discovered.clear(),Ae(0)}});M.placeNow(Mt);ct();const ut=new URLSearchParams(location.search);ut.has("stop")&&Ae(Math.max(0,Math.min(le.length-1,Number(ut.get("stop"))||0)));ut.has("quiz")&&He(0);window.__vrg={showStop:Ae,showQuiz:He,showResult:so,discover:Kt,state:x,world:Q,capePin:Qe,app:M,panel:se,enterRingDive:to,leaveRingDive:oo,enterCape:no,leaveCape:ro,getCape:bt};
