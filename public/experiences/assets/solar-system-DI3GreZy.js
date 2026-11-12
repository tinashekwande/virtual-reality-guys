import{y as Ia,V as d,G as De,I as Bt,M as O,d as Re,j as Ce,k as Te,i as ne,l as Pe,c as re,o as Je,n as da,f as pt,$ as st,Q as lt,a as ae,b as vt,C as F,K as ct,a0 as Ke,U as Va,a1 as Oa,t as _e,P as fa,N as Ut,a2 as ha,a3 as ma,A as pa,W as va,S as we,h as Ue,B as ut,a4 as Qt,a5 as Xt,a6 as ga,a7 as Ga,e as wa,E as xa,r as ba,T as ja,p as qa,g as ze,a8 as Ha,a9 as Et,R as $a,F as ya,D as Rt,aa as Qa,s as Yt,m as Xa,H as Ya,u as xe,ab as dt,ac as nt,ad as Ka,ae as Za,af as Ja,ag as eo,ah as to,ai as ao,aj as oo,ak as no,al as ro,am as io,X as so,an as lo,Y as co,Z as uo,_ as Ma}from"./BufferGeometryUtils-B2MhgPTc.js";const Mt=new Ia([new d(-260,120,-320),new d(-90,55,-150),new d(20,26,-62),new d(70,22,-20),new d(140,42,60),new d(260,90,210),new d(420,150,380)]),fo=600;function Kt(t,e,o,a,n=64,r=28){const s=[],i=[],c=[];for(let b=0;b<=n;b++){const h=b/n,M=e+(o-e)*Math.pow(h,.8),S=h*t,B=a*h*h*t;for(let I=0;I<=r;I++){const G=I/r*Math.PI*2;s.push(B+Math.cos(G)*M,S,Math.sin(G)*M),i.push(I/r,h)}}for(let b=0;b<n;b++)for(let h=0;h<r;h++){const M=b*(r+1)+h,S=M+r+1;c.push(M,S,M+1,S,S+1,M+1)}const u=new Pe;return u.setAttribute("position",new ct(s,3)),u.setAttribute("uv",new ct(i,2)),u.setIndex(c),u.computeVertexNormals(),u}function Zt(t,{streak:e=10,flow:o=.25,power:a=1.6,strength:n=1}){return new ae({uniforms:{uColor:{value:new F(...t)},uTime:{value:0},uStrength:{value:n}},vertexShader:`varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${et}
      uniform vec3 uColor; uniform float uTime; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float v = vUv.y;
        float along = pow(1.0 - v, ${a.toFixed(2)}) * smoothstep(0.0, 0.03, v);
        float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.4);
        float a = vUv.x * 6.2832;
        float n = snoise(vec3(cos(a) * ${e.toFixed(1)}, sin(a) * ${e.toFixed(1)}, v * 4.0 - uTime * ${o.toFixed(3)}));
        float streaks = 0.55 + 0.45 * n;
        gl_FragColor = vec4(uColor * along * core * streaks * uStrength, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ne,side:vt,toneMapped:!1})}function ho(t,e){const o=new De;t.add(o);const a=new Bt(.22,3),n=a.attributes.position;for(let j=0;j<n.count;j++){const A=new d().fromBufferAttribute(n,j),K=1+.25*Math.sin(A.x*9)*Math.cos(A.y*7)+.15*Math.sin(A.z*13);A.multiplyScalar(K),A.x*=1.5,n.setXYZ(j,A.x,A.y,A.z)}a.computeVertexNormals();const r=new O(a,new Re({color:3814704,roughness:1}));o.add(r);const s=new Ce(new Te({map:Ge([210,255,235],[80,200,170],.45),blending:ne,transparent:!0,depthWrite:!1,toneMapped:!1}));s.scale.setScalar(5),o.add(s);const i=new Ce(new Te({map:Ge([255,255,255],[180,240,255],.25),blending:ne,transparent:!0,depthWrite:!1,toneMapped:!1}));i.scale.setScalar(1.4),o.add(i);const c=Zt([.35,.6,1.25],{streak:14,flow:.9,power:1.2,strength:1.1}),u=new O(Kt(55,.12,1.4,0),c),b=Zt([1.15,.98,.78],{streak:6,flow:.18,power:1.9,strength:.85}),h=new O(Kt(38,.35,7,.32),b);u.frustumCulled=h.frustumCulled=!1,o.add(u,h);const M=500,S=new Float32Array(M*3),B=Array.from({length:M},()=>new d),I=new Float32Array(M).map(()=>Math.random()*6),G=new Pe;G.setAttribute("position",new re(S,3));const Y=new Je(G,new da({map:Ge([255,245,220],[255,200,150],.3),size:.35,color:16773336,transparent:!0,opacity:.8,depthWrite:!1,blending:ne,toneMapped:!1}));Y.frustumCulled=!1,t.add(Y);const z=new d,W=new d,V=new d,R=new lt,N=new pt,Z=new d(0,1,0),oe=new d;let J=!0,k=.35;return{root:o,update(j,A){const K=Mt.getPointAt(k),$=st.clamp(Math.sqrt(70/Math.max(1,K.distanceTo(e))),.45,2.2);k=(k+Math.min(j,.1)*$/fo)%1;const P=Mt.getPointAt(k);o.position.copy(P),J&&(oe.copy(P),J=!1),W.copy(P).sub(oe),W.lengthSq()<1e-8&&W.copy(Mt.getTangentAt(k)),W.normalize(),oe.copy(P);const Q=P.distanceTo(e),U=st.clamp(90/Q,.35,1.5);z.copy(P).sub(e).normalize(),R.setFromUnitVectors(Z,z),u.quaternion.copy(R),u.scale.setScalar(U),V.copy(W).multiplyScalar(-1).addScaledVector(z,-W.clone().multiplyScalar(-1).dot(z)).normalize();const ee=new d().crossVectors(V,z).normalize();N.makeBasis(V,z,ee),h.quaternion.setFromRotationMatrix(N),h.scale.setScalar(U),c.uniforms.uTime.value=A,b.uniforms.uTime.value=A,c.uniforms.uStrength.value=1.1*U,b.uniforms.uStrength.value=.85*U,s.scale.setScalar(4+3*U+.3*Math.sin(A*2.1)),r.rotation.y+=j*.3,r.rotation.x+=j*.11;for(let C=0;C<M;C++)I[C]+=j,I[C]>6?(I[C]=0,S[C*3]=P.x,S[C*3+1]=P.y,S[C*3+2]=P.z,B[C].copy(z).multiplyScalar(2+Math.random()*5*U).add(new d().randomDirection().multiplyScalar(.8)).addScaledVector(W,-1.5*Math.random())):(S[C*3]+=B[C].x*j,S[C*3+1]+=B[C].y*j,S[C*3+2]+=B[C].z*j);G.attributes.position.needsUpdate=!0,Y.material.opacity=.75*U}}}const mo=`
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
`,Jt={vertexShader:`
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
      `},ea={vertexShader:`
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
      `},gt=new d(.52,.85,0).normalize(),Sa=new d(0,0,-1),po=new d().crossVectors(gt,Sa).normalize(),Wt=Sa.clone().multiplyScalar(Math.cos(.16)).addScaledVector(po,Math.sin(.16)).normalize(),vo=new d().crossVectors(gt,Wt).normalize();function go(t,e=4096){const o=new Ke(e,e/2,{generateMipmaps:!0,minFilter:Oa,magFilter:Va});o.texture.colorSpace=_e;const a=new ae({uniforms:{uTime:{value:0},uNebulaIntensity:{value:1},uMilkyWay:{value:1},uVRBoost:{value:1},uGalPole:{value:gt},uGalCenter:{value:Wt}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:mo,depthTest:!1,depthWrite:!1}),n=new O(new fa(2,2),a);n.frustumCulled=!1;const r=new Ut;r.add(n);const s=new ha(-1,1,1,-1,0,1),i=t.getRenderTarget(),c=t.xr.enabled,u=t.toneMapping;return t.xr.enabled=!1,t.toneMapping=ma,t.setRenderTarget(o),t.render(r,s),t.setRenderTarget(i),t.xr.enabled=c,t.toneMapping=u,a.dispose(),n.geometry.dispose(),o.texture}function wo(t=900,{scale:e=.45}={}){const o=new De,a=()=>{let v=0,m=0;for(;v===0;)v=Math.random();for(;m===0;)m=Math.random();return Math.sqrt(-2*Math.log(v))*Math.cos(2*Math.PI*m)},n=(v,m,D)=>{const T=Math.cos(v);return D.copy(Wt).multiplyScalar(T*Math.cos(m)).addScaledVector(vo,T*Math.sin(m)).addScaledVector(gt,Math.sin(v))},r=v=>{const m=2*Math.random()-1,D=Math.random()*Math.PI*2,T=Math.sqrt(1-m*m);return v.set(T*Math.cos(D),T*Math.sin(D),m)},s=(v,m,D=!1)=>{if(Math.random()<v){let T,E;return Math.random()<.42?(T=-.1+a()*.62,E=a()*.16-Math.sin(T*2+.4)*.035):(T=(Math.random()*2-1)*Math.PI,E=a()*.115-Math.sin(T*2+.4)*.035),D&&Math.abs(E-.01)<.032&&Math.random()<.65&&(E+=(E>=0?1:-1)*(.035+Math.abs(a())*.05)),n(E,T,m)}return r(m)},i=[[.26,new F(.68,.84,1)],[.26,new F(1,1,1)],[.16,new F(1,.94,.82)],[.12,new F(1,.8,.48)],[.08,new F(1,.56,.3)],[.07,new F(.38,.72,1)],[.05,new F(.84,.64,1)]],c=()=>{let v=Math.random();for(const[m,D]of i)if((v-=m)<=0)return D;return i[1][1]},u=Math.round(11500*e),b=Math.round(49e3*e),h=24,M=Math.round(175*Math.max(.6,e)),S=u+b+h*M,B=new Float32Array(S*3),I=new Float32Array(S*3),G=new Float32Array(S),Y=new Float32Array(S*3),z=new d;let W=0;const V=(v,m,D,T,E,L=1)=>{B.set([v.x*t,v.y*t,v.z*t],W*3),I.set([m.r*D,m.g*D,m.b*D],W*3),G[W]=T,Y.set([Math.random()*Math.PI*2,(.3+Math.random()*1)*L,E],W*3),W++};for(let v=0;v<u;v++){s(.38,z,!0);const m=Math.pow(Math.random(),4),D=m>.62;V(z,c(),.16+m*.76,D?4+(m-.62)*6.5:1.8+m*2.8,.18+Math.random()*.38,D?.85:1.15)}for(let v=0;v<b;v++){s(.58,z,!0);const m=Math.pow(Math.random(),2.5);V(z,c(),.06+m*.25,1.5+m*.92,Math.random()<.65?.14+Math.random()*.34:.06,1.25)}const R=new d;for(let v=0;v<h;v++){v<8?n((Math.random()-.5)*.26,(v/8-.5)*1.2,R):s(.84,R,!0);const m=.024+Math.random()*.045,D=[i[0][1],i[1][1],i[3][1],i[5][1],i[6][1]];for(let T=0;T<M;T++){z.set(R.x+a()*m,R.y+a()*m,R.z+a()*m).normalize();const E=Math.pow(Math.random(),3.6);V(z,Math.random()<.68?D[v%D.length]:c(),.075+E*.58,1.55+E*3.4,.16+Math.random()*.34,1.1)}}const N=new Pe;N.setAttribute("position",new re(B,3)),N.setAttribute("aColor",new re(I,3)),N.setAttribute("aSize",new re(G,1)),N.setAttribute("aTwinkle",new re(Y,3));const Z={uTime:{value:0},uPixelScale:{value:1},uVRBoost:{value:1}},oe=new ae({uniforms:Z,vertexShader:Jt.vertexShader,fragmentShader:Jt.fragmentShader,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),J=new Je(N,oe);J.frustumCulled=!1,J.renderOrder=-9,o.add(J);const k=[{lat:-.065,lon:-.29,size:86,bright:1.15,color:new F(1,.9,.7),angle:.785},{lat:.075,lon:.26,size:82,bright:1.1,color:new F(.92,.95,1),angle:.785},{lat:-.145,lon:.08,size:54,bright:.85,color:new F(.75,.88,1),angle:.76},{lat:.155,lon:-.16,size:52,bright:.82,color:new F(1,.84,.58),angle:.8},{lat:.18,lon:.42,size:50,bright:.78,color:new F(.9,.76,1),angle:.77},{lat:-.175,lon:-.46,size:54,bright:.84,color:new F(.68,.86,1),angle:.81}],j=[new F(1,.9,.68),new F(.95,.97,1),new F(.62,.84,1),new F(.45,.76,1),new F(1,.74,.45),new F(.88,.72,1)],A=k.length+26,K=new Float32Array(A*3),$=new Float32Array(A*3),P=new Float32Array(A),Q=new Float32Array(A*3),U=new Float32Array(A),ee=[];for(let v=0;v<A;v++){let m,D,T,E;if(v<k.length){const L=k[v];n(L.lat,L.lon,z),m=L.color,D=L.bright,T=L.size,E=L.angle}else{for(let ve=0;ve<25&&(s(.45,z,!1),!!ee.some(de=>z.dot(de)>.955));ve++);m=j[Math.floor(Math.random()*j.length)];const L=Math.pow(Math.random(),1.8);D=.48+L*.44,T=32+L*36,E=Math.PI*.25+(Math.random()-.5)*.14}ee.push(z.clone()),K.set([z.x*t*.98,z.y*t*.98,z.z*t*.98],v*3),$.set([m.r*D,m.g*D,m.b*D],v*3),P[v]=T,Q.set([Math.random()*Math.PI*2,.3+Math.random()*.7,.14+Math.random()*.18],v*3),U[v]=E}const C=new Pe;C.setAttribute("position",new re(K,3)),C.setAttribute("aColor",new re($,3)),C.setAttribute("aSize",new re(P,1)),C.setAttribute("aTwinkle",new re(Q,3)),C.setAttribute("aAngle",new re(U,1));const te=new ae({uniforms:Z,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),_=new Je(C,te);return _.frustumCulled=!1,_.renderOrder=-8,o.add(_),{group:o,uniforms:Z}}const ta={uniforms:{uSunDir:{value:new d(1,0,0)}},vertexShader:`
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
  `},aa={uniforms:{uSunDir:{value:new d(1,0,0)}},vertexShader:`
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
  `},oa={uniforms:{uColor:{value:new F("#388aff")},uSunDir:{value:new d(1,0,0)}},vertexShader:`
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
  `};new d(0,0,0),new d(0,1,0);const na={uniforms:{uSunPos:{value:new d(0,0,0)},uTint:{value:new F("#ffffff")},uLimbColor:{value:new F("#000000")}},vertexShader:`
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
  `},Ca=1.6,xo=new URL("../textures/solar/",location.href).href,q={sun:{r:12,x:0},mercury:{a:25,r:1.2,x:34,spin:.003,tilt:.03,atmo:null},venus:{a:-35,r:2.2,x:52,spin:-.002,tilt:.05,atmo:[1,.85,.55,.9]},earth:{a:15,r:2.4,x:72,spin:.042,tilt:.41,atmo:[.35,.6,1,1.2]},mars:{a:-20,r:1.6,x:90,spin:.041,tilt:.44,atmo:[1,.55,.35,.5]},jupiter:{a:35,r:7,x:150,spin:.101,tilt:.05,atmo:[1,.85,.7,.5]},saturn:{a:-25,r:5.6,x:195,spin:.094,tilt:.47,atmo:[1,.9,.7,.45]},uranus:{a:30,r:3.4,x:232,spin:-.058,tilt:1.7,atmo:[.6,.95,1,.8]},neptune:{a:-15,r:3.3,x:262,spin:.063,tilt:.49,atmo:[.45,.6,1,.9]}};function Ee(t){const e=q[t],o=(e.a||0)*Math.PI/180;return new d(Math.cos(o)*e.x,Ca,Math.sin(o)*e.x)}const bo=new d(-150,62,0);function Lt(t){const e=q[t],o=t==="sun"?e.r*2.4+4:e.r*2.05+1.8,a=Ee(t);return{position:new d(a.x-o,0,a.z),yaw:-Math.PI/2}}function yo(t,e){const{scene:o,renderer:a,rig:n,camera:r}=t;a.toneMapping=pa,a.toneMappingExposure=1.05;const s=new va(e),i=(l,f=!0)=>c("real/"+l,f),c=(l,f=!0)=>{const g=s.load(xo+l+".jpg");return f&&(g.colorSpace=_e),g.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),g},u=[];let b=1;const h=new d(0,Ca,0);let M=null;const S=go(a,4096),B=new O(new we(950,64,32),new Ue({map:S,side:ut,depthWrite:!1,fog:!1,toneMapped:!1}));B.renderOrder=-10,o.add(B),u.push(()=>B.position.copy(n.position));{const{group:l,uniforms:f}=wo(900,{scale:.45});M=f,o.add(l),u.push((g,p)=>{f.uTime.value=p,f.uPixelScale.value=a.xr.isPresenting?1.3:1,l.position.copy(n.position)})}{const l=[];for(let g=0;g<3;g++){const p=new Pe;p.setAttribute("position",new re(new Float32Array(6),3)),p.setAttribute("color",new re(new Float32Array([1,1,1,1,.6,.8,1,0]),4));const y=new Qt(p,new Xt({vertexColors:!0,transparent:!0,depthWrite:!1,blending:ne}));y.visible=!1,y.frustumCulled=!1,o.add(y),l.push({line:y,t:0,life:0,a:new d,b:new d})}let f=3;u.push(g=>{if(f-=g,f<=0){f=4+Math.random()*7;const p=l.find(y=>!y.line.visible);if(p){const X=new d(0,0,-1).applyQuaternion(r.getWorldQuaternion(new lt)).clone().add(new d((Math.random()-.5)*1.6,.35+Math.random()*.5,(Math.random()-.5)*1.6)).normalize();p.a.copy(X).multiplyScalar(400).add(n.position),p.b.set(Math.random()-.5,-.4-Math.random()*.4,Math.random()-.5).normalize().multiplyScalar(160),p.t=0,p.life=.9+Math.random()*.6,p.line.visible=!0}}for(const p of l){if(!p.line.visible)continue;p.t+=g;const y=p.t/p.life;if(y>=1){p.line.visible=!1;continue}const X=p.a.clone().addScaledVector(p.b,y),fe=p.a.clone().addScaledVector(p.b,Math.max(0,y-.25)),Ae=p.line.geometry.attributes.position;Ae.setXYZ(0,X.x,X.y,X.z),Ae.setXYZ(1,fe.x,fe.y,fe.z),Ae.needsUpdate=!0,p.line.material.opacity=Math.sin(y*Math.PI)}})}o.add(new ga(8425648,.05));const I=new Ga(16774368,3.2,0,0);I.position.copy(h),o.add(I);const G=new ae({uniforms:{uTime:{value:0}},vertexShader:`varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`${et}
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
      }`,toneMapped:!1}),Y=new O(new we(q.sun.r,128,96),G);Y.position.copy(h),o.add(Y);const z=new ae({uniforms:{uTime:{value:0},uDisc:{value:q.sun.r},uHalf:{value:q.sun.r*2.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`${et}
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
      }`,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),W=new O(new fa(q.sun.r*4.4,q.sun.r*4.4),z);W.position.copy(h),o.add(W);const V=Mo(Ge([255,150,60],[255,70,0],.35),130,h);V.material.opacity=.75,o.add(V);const R=new d;u.push((l,f)=>{G.uniforms.uTime.value=f,z.uniforms.uTime.value=f,Y.rotation.y+=l*.0017,r.getWorldPosition(R),W.lookAt(R);const g=Math.max(R.distanceTo(h),q.sun.r*1.05);z.uniforms.uDisc.value=q.sun.r*g/Math.sqrt(g*g-q.sun.r*q.sun.r),V.scale.setScalar(130*(1+.025*Math.sin(f*.7)))});const N={},Z={},oe=[],J=[];function k(l,f){const g=q[l],p=new De;p.position.copy(Ee(l)),p.rotation.z=g.tilt*.8,p.rotation.x=g.tilt*.6,o.add(p);const y=new O(new we(g.r,96,64),f);y.name=l,p.add(y),N[l]=y,Z[l]=p,J.push({mesh:y,speed:g.spin,boost:0});const X=To(l,g);return oe.push(X),o.add(X),y}const j=(l,f={})=>new Re({map:c(l),roughness:1,metalness:0,...f}),A={value:h},K=l=>(l.wrapS=Ha,l),$=(l,f={})=>new ae({uniforms:{uMap:{value:K(i(l))},uSunPos:A,uBumpScale:{value:f.bumpScale??2},uTint:{value:new F(f.tint||"#ffffff")},uLimbColor:{value:new F(f.limbColor||"#000000")},uLimbStrength:{value:f.limbStrength??0}},vertexShader:na.vertexShader,fragmentShader:na.fragmentShader});k("mercury",$("mercury",{bumpScale:2.8,tint:"#d8cfc8"})),k("venus",$("venus",{bumpScale:1.4,tint:"#ffdfa8",limbColor:"#ffbe66",limbStrength:.42}));const P={value:new d(1,0,0)},Q=K(i("earth_day")),U=K(i("earth_clouds_trans",!1)),ee=new ae({uniforms:{uDayTex:{value:Q},uNightTex:{value:K(i("earth_lights"))},uSpecTex:{value:K(i("earth_spec",!1))},uNormalMap:{value:K(i("earth_normal",!1))},uCloudTex:{value:U},uHasNormal:{value:1},uSunDir:P},vertexShader:ta.vertexShader,fragmentShader:ta.fragmentShader}),C=k("earth",ee),te=new O(new we(q.earth.r*1.009,96,64),new ae({uniforms:{uCloudTex:{value:U},uSunDir:P},vertexShader:aa.vertexShader,fragmentShader:aa.fragmentShader,transparent:!0,depthWrite:!1}));C.add(te),C.add(new O(new we(q.earth.r*1.032,64,48),new ae({uniforms:{uColor:{value:new F("#429eff")},uSunDir:P},vertexShader:oa.vertexShader,fragmentShader:oa.fragmentShader,transparent:!0,side:ut,blending:ne,depthWrite:!1})));const _=new d;u.push(()=>P.value.copy(h).sub(C.getWorldPosition(_)).normalize()),k("mars",$("mars",{bumpScale:3.2,tint:"#ff9d6e",limbColor:"#e87846",limbStrength:.35})),k("jupiter",$("jupiter",{bumpScale:1.9,tint:"#f5dfc6",limbColor:"#d4b48c",limbStrength:.25})),k("saturn",$("saturn",{bumpScale:1,tint:"#fff4e2",limbColor:"#d9b98a",limbStrength:.25})),k("uranus",$("uranus",{bumpScale:.8,tint:"#a8ecff",limbColor:"#6ad8ff",limbStrength:.35})),k("neptune",$("neptune",{bumpScale:1.1,tint:"#6e9eff",limbColor:"#3d78ff",limbStrength:.38}));const v=ko(),m=Ro(q.saturn.r*1.24,q.saturn.r*2.3,N.saturn,h);Z.saturn.add(m),Z.uranus.add(zo(q.uranus.r*1.6,q.uranus.r*2,_o(),N.uranus,h,.5));const D={},T={},E=(l,f)=>j(l,{});L("earth",$("moon",{bumpScale:3.4,tint:"#e0dcd5"}),.6,9.5,.02,.25,null,1.2),L("mars",E("rockmoon"),.22,3,.06,.1,[1,.75,.85]),L("mars",E("rockmoon"),.15,4.6,.035,-.2,[1,.8,.9]),L("jupiter",E("io"),.55,11,.05,.05),L("jupiter",E("europa"),.48,14,.035,.12),L("jupiter",E("ganymede"),.8,20,.025,-.08),L("jupiter",E("callisto"),.72,24,.016,.15),L("saturn",E("titan"),.7,19,.02,.35,null,2.4),L("neptune",E("triton"),.45,11,-.03,.3);function L(l,f,g,p,y,X,fe,Ae=Math.random()*6.28){const Me=new De;(D[l]||(D[l]=[])).push(Me),y=-Math.abs(y),Me.position.copy(Z[l].position),Me.rotation.z=X,Me.rotation.y=Ae;const Se=new O(new we(g,40,24),f);return fe&&Se.scale.set(...fe),Se.position.set(0,0,-p),Me.add(Se),o.add(Me),J.push({mesh:Me,speed:y,boost:0}),(T[l]||(T[l]=[])).push({obj:Se,r:g}),Se}const ve=[];for(const l of["earth","mars","jupiter","saturn","neptune"]){const f=T[l]||[],g=N[l],p=l==="saturn"?{mesh:m,inner:q.saturn.r*1.24,outer:q.saturn.r*2.3,texture:v}:null;g.material.isMeshStandardMaterial&&(kt(g.material,h,f,p),ve.push(g.material));for(const y of f)y.obj.material.isMeshStandardMaterial&&(kt(y.obj.material,h,[{obj:g,r:q[l].r},...f.filter(X=>X!==y)]),ve.push(y.obj.material))}u.push(()=>{for(const l of ve)l.userData.updateShadows()});{const l=new Bt(1,1),f=l.attributes.position;for(let me=0;me<f.count;me++){const Le=.75+Math.random()*.45;f.setXYZ(me,f.getX(me)*Le,f.getY(me)*Le*.8,f.getZ(me)*Le)}l.computeVertexNormals();const g=1100,p=new wa(l,new Re({color:9207924,roughness:1,flatShading:!0}),g),y=new pt,X=new lt,fe=new xa,Ae=new d,Me=new d;for(let me=0;me<g;me++){const Le=Math.random()*Math.PI*2,$t=99+Math.random()*12+(Math.random()-.5)*3;Ae.set(Math.cos(Le)*$t,(Math.random()-.5)*3*(.5+Math.random()),Math.sin(Le)*$t),fe.set(Math.random()*6,Math.random()*6,Math.random()*6),X.setFromEuler(fe);const yt=.06+Math.pow(Math.random(),3)*.55;Me.set(yt,yt,yt),y.compose(Ae,X,Me),p.setMatrixAt(me,y),p.setColorAt(me,new F().setHSL(.07+Math.random()*.04,.15+Math.random()*.15,.3+Math.random()*.25))}const Se=new De;Se.position.copy(h),Se.add(p),o.add(Se),u.push(me=>Se.rotation.y+=me*.002*b)}const de=[];for(const[l,f]of Object.entries(q)){if(l==="sun")continue;const g=[];for(let y=0;y<=256;y++){const X=y/256*Math.PI*2;g.push(new d(Math.cos(X)*f.x,0,Math.sin(X)*f.x))}const p=new Qt(new Pe().setFromPoints(g),new Xt({color:8369407,transparent:!0,opacity:.12,depthWrite:!1}));de.push(p.material),p.position.copy(h),o.add(p)}let se=null;{const l=new De,f=new O(new ba(1.2,1.05,.06,72),new Re({color:1581621,metalness:.7,roughness:.35,emissive:660516,emissiveMap:Co(),emissiveIntensity:3}));f.position.y=-.035;const g=new O(new ja(1.18,.018,12,96),new Ue({color:2282478,toneMapped:!1}));g.rotation.x=Math.PI/2,g.position.y=0;const p=new O(new qa(1.6,64),new Ue({map:Ge([60,200,255],[0,80,160],.6),transparent:!0,depthWrite:!1,blending:ne,opacity:.45}));p.rotation.x=-Math.PI/2,p.position.y=-.09,l.add(f,g,p),n.add(l),se={pad:l,base:f,rim:g,glow:p},u.push((y,X)=>g.material.color.setHSL(.52,.85,.5+.08*Math.sin(X*1.6)))}const ge=new Ce(new Te({map:So(),transparent:!0,depthWrite:!1,depthTest:!1,blending:ne,toneMapped:!1}));ge.renderOrder=15,ge.visible=!1,o.add(ge);let Xe=1;const Ne=new d;u.push((l,f)=>{const g=r.getWorldPosition(Ne);for(const y of oe){const X=y.position.distanceTo(g),fe=Math.min(5,Math.max(1,X/45));y.scale.set(y.userData.w*fe,y.userData.w/4*fe,1)}const p=Math.min(1,Math.max(0,(n.position.y-5)/60));for(const y of de)y.opacity=.12+.3*p;if(ge.visible){const y=ge.position.distanceTo(g);ge.scale.setScalar(Math.max(Xe,y*.06)*(1+.12*Math.sin(f*4)))}});const We=ho(o,h);return u.push((l,f)=>We.update(l,f)),u.push(l=>{for(const f of J)f.mesh.rotation.y+=(f.speed*b+f.boost)*l,f.boost*=Math.pow(.35,l)}),{bodies:N,tilts:Z,sun:Y,sunPos:h,moonsOf:D,comet:We,satRingTex:v,skyTexture:S,earthMap:Q,saturnMap:N.saturn.material.uniforms.uMap.value,labels:oe,orbitLines:de,sunGlow:V,starUniforms:M,setPadGlass(l){const{base:f,rim:g,glow:p}=se;f.material.transparent=l,f.material.opacity=l?.18:1,f.material.depthWrite=!l,f.material.needsUpdate=!0,p.visible=!l,g.scale.setScalar(l?.6:1),g.material.transparent=l,g.material.opacity=l?.5:1},markDestination(l){if(!l){ge.visible=!1;return}const f=q[l];ge.position.copy(Ee(l)),Xe=f.r*3,ge.visible=!0},update(l,f){for(const g of u)g(l,f)},setTimeScale(l){b=l},arrangeMoons(l,f=0){const g=D[l]||[];g.forEach((p,y)=>{const X=J.find(fe=>fe.mesh===p);p.rotation.y=-.45-y*2.2/Math.max(1,g.length)+Math.abs(X?X.speed:0)*f})},boost(l,f=2.5){const g=J.find(p=>p.mesh===N[l]);g&&(g.boost=f)},spinnerOf(l){return J.find(f=>f.mesh===N[l])}}}function Mo(t,e,o){const a=new Ce(new Te({map:t,blending:ne,depthWrite:!1,transparent:!0,toneMapped:!1}));return a.scale.setScalar(e),a.position.copy(o),a}function Ge(t,e,o=.4){const a=document.createElement("canvas");a.width=a.height=256;const n=a.getContext("2d"),r=n.createRadialGradient(128,128,0,128,128,128);r.addColorStop(0,`rgba(${t},0.95)`),r.addColorStop(o*.5,`rgba(${t},0.5)`),r.addColorStop(o,`rgba(${e},0.2)`),r.addColorStop(1,`rgba(${e},0)`),n.fillStyle=r,n.fillRect(0,0,256,256);const s=new ze(a);return s.colorSpace=_e,s}function So(){const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");e.strokeStyle="rgba(255,230,120,0.95)",e.shadowColor="rgba(255,200,60,1)",e.shadowBlur=16,e.lineWidth=7,e.setLineDash([26,14]),e.beginPath(),e.arc(128,128,104,0,Math.PI*2),e.stroke();const o=new ze(t);return o.colorSpace=_e,o}function Co(){const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d");e.fillStyle="#000",e.fillRect(0,0,512,512),e.strokeStyle="rgba(34,211,238,0.55)",e.lineWidth=2;for(let a=40;a<256;a+=44)e.beginPath(),e.arc(256,256,a,0,Math.PI*2),e.stroke();for(let a=0;a<12;a++){const n=a/12*Math.PI*2;e.beginPath(),e.moveTo(256+Math.cos(n)*40,256+Math.sin(n)*40),e.lineTo(256+Math.cos(n)*250,256+Math.sin(n)*250),e.stroke()}const o=new ze(t);return o.colorSpace=_e,o}function To(t,e){const o=document.createElement("canvas");o.width=512,o.height=128;const a=o.getContext("2d");a.font='bold 64px "Trebuchet MS", system-ui, sans-serif',a.textAlign="center",a.textBaseline="middle",a.shadowColor="rgba(0,0,0,0.9)",a.shadowBlur=12,a.fillStyle="rgba(220,240,255,0.92)",a.fillText(t[0].toUpperCase()+t.slice(1),256,64);const n=new ze(o);n.colorSpace=_e;const r=new Ce(new Te({map:n,transparent:!0,depthWrite:!1,toneMapped:!1})),s=Math.max(2.4,e.r*1.1);return r.scale.set(s,s/4,1),r.userData.w=s,r.position.copy(Ee(t)).add(new d(0,e.r*(t==="saturn"?1.5:1.25)+.6,0)),r}function Po(t,e,o){var r;const a=t.onBeforeCompile,n=(r=t.userData).patchKeys||(r.patchKeys=[]);n.push(e),t.onBeforeCompile=(s,i)=>{a.call(t,s,i),o(s)},t.customProgramCacheKey=()=>n.join("+")}function kt(t,e,o,a){const n=Array.from({length:4},()=>new $a),r={uShSun:{value:e},uShSunR:{value:1.6},uOcc:{value:n},uOccN:{value:0},uRingOn:{value:a?1:0},uRingC:{value:new d},uRingN:{value:new d(0,1,0)},uRingIn:{value:a?a.inner:0},uRingOut:{value:a?a.outer:0},uRingTex:{value:a?a.texture:null}},s=new d,i=new d;t.userData.updateShadows=()=>{let c=0;for(const u of o){if(c>=4)break;u.obj.getWorldPosition(s),u.obj.getWorldScale(i),n[c++].set(s.x,s.y,s.z,u.r*Math.max(i.x,i.y,i.z))}r.uOccN.value=c,a&&(a.mesh.getWorldPosition(r.uRingC.value),r.uRingN.value.set(0,0,1).transformDirection(a.mesh.matrixWorld))},Po(t,"shadow"+(a?"R":""),c=>{Object.assign(c.uniforms,r),c.vertexShader=c.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vShWP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vShWP = (modelMatrix * vec4(transformed, 1.0)).xyz;`),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
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
        #include <lights_fragment_end>`)})}function zo(t,e,o,a,n,r){const s=new Et(t,e,192,1),i=s.attributes.position,c=s.attributes.uv;for(let M=0;M<i.count;M++)c.setXY(M,(Math.hypot(i.getX(M),i.getY(M))-t)/(e-t),.5);const u=new d,b=new ae({uniforms:{map:{value:o},uSun:{value:n},uPlanet:{value:u},uR:{value:a.geometry.parameters.radius},uB:{value:r}},vertexShader:`varying vec2 vUv; varying vec3 vWP; varying vec3 vWN;
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
      }`,transparent:!0,side:vt,depthWrite:!1}),h=new O(s,b);return h.rotation.x=-Math.PI/2,h.onBeforeRender=()=>a.getWorldPosition(u),h}function Do(t){const e=Math.sin(t*190),o=Math.sin(t*540+1.2),a=Math.sin(t*1480+2.5),n=.5+.22*e+.15*o+.09*a,r=Ie(.02,.98,n),s=[.72,.58,.45],i=[.56,.44,.34],c=[.38,.29,.22],u=(b,h,M)=>b.map((S,B)=>S+(h[B]-S)*M);if(t<.08)return[c,Ie(0,.08,t)*.22*r];if(t<.28){const b=.5+.5*Math.sin(t*120);return[u(c,i,b),(.18+.38*b)*r]}if(t<.64){const b=.65+.35*Math.sin(t*75)*Math.cos(t*160);return[u(i,s,r*b),(.62+.34*r)*b*Ie(.004,.011,Math.abs(t-.39))*Ie(.005,.013,Math.abs(t-.51))]}return t<.72?[c,.03]:t<.94?[u(i,s.map(b=>b*.92),r),(.5+.38*r)*Ie(.005,.014,Math.abs(t-.85))*Ie(.002,.006,Math.abs(t-.92))]:[s,Math.exp(-(((t-.975)*95)**2))*.65]}function Ie(t,e,o){const a=Math.min(1,Math.max(0,(o-t)/(e-t)));return a*a*(3-2*a)}function Ro(t,e,o,a){const n=new Et(t,e,256,1),r=new d,s=new ae({uniforms:{uSunPos:{value:a},uPlanetPos:{value:r},uPlanetRadius:{value:o.geometry.parameters.radius},uInnerRadius:{value:t},uOuterRadius:{value:e}},vertexShader:`varying vec3 vLocalPos; varying vec3 vWorldPos; varying vec3 vWN;
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
      }`,transparent:!0,side:vt,depthWrite:!1}),i=new O(n,s);return i.rotation.x=-Math.PI/2,i.onBeforeRender=()=>o.getWorldPosition(r),i}function Ta(t){const e=document.createElement("canvas");e.width=1024,e.height=2;const o=e.getContext("2d");for(let n=0;n<1024;n++){const[r,s,i,c]=t(n/1024);o.fillStyle=`rgba(${r|0},${s|0},${i|0},${Math.max(0,Math.min(1,c))})`,o.fillRect(n,0,1,2)}const a=new ze(e);return a.colorSpace=_e,a}function ko(){return Ta(t=>{const[e,o]=Do(t);return[Math.pow(e[0],1/2.2)*255*1.15,Math.pow(e[1],1/2.2)*255*1.15,Math.pow(e[2],1/2.2)*255*1.15,Math.min(.92,o)]})}function _o(){return Ta(t=>{const e=[.1,.3,.45,.62,.8,.95];let o=0;for(const a of e)o=Math.max(o,Math.exp(-(((t-a)/.012)**2)));return[170,190,200,o*.55]})}const et=`
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
}`,ce=[{id:"sun",name:"The Sun",accent:"#fbbf24",text:["The Sun is a star: a giant ball of hot, glowing gas. Everything in the solar system goes around it.","It is about 109 Earths wide, and it makes up almost all of the weight of the whole solar system."],secret:"The surface is around 5 500 °C, and light from the Sun takes about 8 minutes to reach Earth."},{id:"mercury",name:"Mercury",accent:"#cbd5e1",text:["Mercury is the closest planet to the Sun and the smallest. It has no air to hold heat in.","Days are scorching hot and nights are freezing cold. A year here is only 88 Earth days long."],secret:"Its surface is covered in craters from space rocks crashing into it, just like our Moon."},{id:"venus",name:"Venus",accent:"#fcd34d",text:["Venus is wrapped in thick clouds that trap heat. That makes it the hottest planet, even hotter than Mercury.","It also spins backwards compared to most planets."],secret:"It is about 465 °C on the surface: hot enough to melt lead!"},{id:"earth",name:"Earth",accent:"#60a5fa",text:["This is home! Earth is the only planet we know of with life. About 70% of it is covered in water.","It takes 365 days to go around the Sun, which is one year. Earth has one Moon."],secret:"See the pin? That is Cape Town, where you are right now! The lights on the dark side are cities at night."},{id:"mars",name:"Mars",accent:"#fb923c",text:["Mars is called the Red Planet because its dust and rocks contain iron that has rusted.","It has the biggest volcano in the solar system, Olympus Mons, and two tiny moons."],secret:"Robots called rovers are exploring Mars right now, looking for signs of water and life."},{id:"jupiter",name:"Jupiter",accent:"#f59e0b",text:["Jupiter is the biggest planet. More than 1 000 Earths could fit inside it!","It is a gas giant with no solid ground. The Great Red Spot is a storm bigger than Earth that has lasted for hundreds of years."],secret:"Jupiter has more than 90 moons. You can see its four biggest moons circling it."},{id:"saturn",name:"Saturn",accent:"#fde68a",text:["Saturn is famous for its beautiful rings. They are made of billions of pieces of ice and rock.","Saturn is so light for its size that it would float in a giant bathtub of water!"],secret:"Saturn has well over 100 moons. Its biggest, Titan, has thick orange clouds."},{id:"uranus",name:"Uranus",accent:"#67e8f9",text:["Uranus is an ice giant that is tipped over on its side, so it rolls around the Sun like a ball.","It is freezing cold, and one trip around the Sun takes 84 Earth years."],secret:"Its blue-green colour comes from methane gas, and it has thin, dark rings."},{id:"neptune",name:"Neptune",accent:"#818cf8",text:["Neptune is the farthest planet from the Sun. It is dark, cold and very windy, with the fastest winds of any planet.","One year on Neptune is about 165 Earth years."],secret:"Neptune was found using maths before anyone saw it through a telescope!"}],qe=[{q:"What is at the centre of our solar system?",options:["The Moon","The Sun","Jupiter","Earth"],answer:1},{q:"Which planet is the hottest?",options:["Mercury","Mars","Venus","Neptune"],answer:2},{q:"Why does Mars look red?",options:["It is on fire","Rusty iron in its dust and rocks","It is close to the Sun","It is covered in lava"],answer:1},{q:"Which is the biggest planet?",options:["Saturn","Earth","Jupiter","Uranus"],answer:2},{q:"Which is the only planet we know has life?",options:["Mars","Earth","Venus","Mercury"],answer:1}],Ye=new d(.62,.22,.75).normalize(),St=-8,ot=new d(280,22,280),No=3.2;function Ao({saturnMap:t,ringTex:e,skyTex:o}){const a=new Ut;a.fog=new ya(8221540,.0085);const n=new Rt(16774114,3.4);n.position.copy(Ye).multiplyScalar(100),a.add(n);const r=new Rt(15124634,.7);r.position.set(-.2,.1,-1).multiplyScalar(100),a.add(r),a.add(new ga(10135224,.3));const s=new De;a.add(s);const i=new O(new we(1900,48,24),new Ue({map:o,side:ut,depthWrite:!1,fog:!1,toneMapped:!1,color:12303291}));i.renderOrder=-10,a.add(i);const c=new Ce(new Te({map:Ge([255,250,235],[255,200,120],.25),blending:ne,depthWrite:!1,fog:!1,toneMapped:!1}));c.position.copy(Ye).multiplyScalar(1700),c.scale.setScalar(150),a.add(c);const u=new d(180,0,-1e3),b=580,h=720,M=1340,S=new Re({map:t,roughness:1,metalness:0,fog:!1}),B=new O(new we(b,128,80),S);B.position.copy(u),B.rotation.z=.05,B.renderOrder=-6,s.add(B);const I=new Et(h,M,512,8),G=I.attributes.position,Y=I.attributes.uv;for(let P=0;P<G.count;P++)Y.setXY(P,(Math.hypot(G.getX(P),G.getY(P))-h)/(M-h),.5);const z=new ae({uniforms:{map:{value:e},uSun:{value:Ye},uSat:{value:u},uR:{value:b}},vertexShader:"varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vP = (wp.xyz - (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz); gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`${et}
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
      }`,transparent:!1,blending:Qa,side:vt,depthWrite:!1,fog:!1}),W=new O(I,z);W.rotation.x=-Math.PI/2,W.position.set(u.x,(St-1.6)/100,u.z),W.renderOrder=-5,s.add(W);const V=new d;kt(S,V,[],{mesh:W,inner:h,outer:M,texture:e}),S.userData.shadowSunR=1;const R={value:new d},N={value:0},Z={value:ot};function oe(P,Q){let U=new Bt(1,P);U.deleteAttribute("normal"),U.deleteAttribute("uv"),U=Xa(U);const ee=U.attributes.position;for(let C=0;C<ee.count;C++){const te=new d().fromBufferAttribute(ee,C),_=1+.24*Math.sin(te.x*4.1+Q)*Math.cos(te.y*3.7+Q*2)+.12*Math.sin(te.z*8.3+Q*3)+.05*Math.sin(te.x*17+te.y*13);te.multiplyScalar(_),ee.setXYZ(C,te.x*1.15,te.y*.85,te.z)}return U.computeVertexNormals(),U}function J(P,Q,U,ee){const C=new Float32Array(Q*3),te=new Float32Array(Q*4),_=new Re({color:16777215,roughness:.62,metalness:0}),v=new wa(P,_,Q),m=new pt,D=new lt,T=new xa,E=new d,L=new d,ve=new F;let de=0;for(;de<Q;){const se=(Math.random()-.5)*ot.x,ge=(Math.random()-.5)*ot.z,Xe=St+(Math.random()+Math.random()+Math.random()-1.5)*(ot.y/3),Ne=U();if(Math.abs(ge)<3.5+Ne&&Math.abs(Xe-1)<3+Ne)continue;C.set([se,Xe,ge],de*3);const We=new d().randomDirection();te.set([We.x,We.y,We.z,(.04+Math.random()*.25)/Math.sqrt(Ne+.2)],de*4),T.set(Math.random()*6,Math.random()*6,Math.random()*6),D.setFromEuler(T),E.set(Ne,Ne*(.7+Math.random()*.3),Ne*(.8+Math.random()*.4)),m.compose(L,D,E),v.setMatrixAt(de,m);const l=Math.random();ve.setRGB(.97,.95-.04*l,.9-.07*l),Math.random()<.15&&ve.multiplyScalar(.55),v.setColorAt(de,ve),de++}return P.setAttribute("aBase",new Yt(C,3)),P.setAttribute("aSpin",new Yt(te,4)),v.frustumCulled=!1,_.onBeforeCompile=se=>{se.uniforms.uOffset=R,se.uniforms.uTime=N,se.uniforms.uBox=Z,se.vertexShader=se.vertexShader.replace("#include <common>",`#include <common>
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
          gl_Position = projectionMatrix * mvPosition;`),se.fragmentShader=se.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vObjP;
${et}`).replace("#include <color_fragment>",`#include <color_fragment>
          float grime = snoise(vObjP * 2.7) * 0.5 + snoise(vObjP * 7.9) * 0.25;
          diffuseColor.rgb *= 0.78 + 0.3 * grime;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), smoothstep(0.55, 0.9, snoise(vObjP * 5.3 + 11.0)) * 0.35);`)},_.customProgramCacheKey=()=>"ringchunks"+ee,a.add(v),v}J(oe(3,1.7),260,()=>.7+2.4*Math.pow(Math.random(),3),"big"),J(oe(1,4.2),2800,()=>.05+.65*Math.pow(Math.random(),2.5),"small");const k=6e3,j=new Float32Array(k*3);for(let P=0;P<k;P++)j.set([(Math.random()-.5)*120,St+(Math.random()-.5)*18,(Math.random()-.5)*120],P*3);const A=new Pe;A.setAttribute("position",new re(j,3));const K=new ae({uniforms:{uOffset:R,uTime:N},vertexShader:`uniform vec3 uOffset; uniform float uTime; varying float vA;
      void main(){
        vec3 p = position; p.xz = mod(p.xz - uOffset.xz + 60.0, 120.0) - 60.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float d = -mv.z;
        vA = (0.5 + 0.5 * sin(uTime * 3.0 + position.x * 13.0)) * smoothstep(60.0, 8.0, d);
        gl_PointSize = clamp(60.0 / d, 1.0, 4.0);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:"varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * vA * smoothstep(0.5, 0.0, d), 1.0); }",transparent:!0,depthWrite:!1,blending:ne}),$=new Je(A,K);return $.frustumCulled=!1,a.add($),{scene:a,start:{position:new d(0,0,0),yaw:-Math.PI/2},update(P,Q,U){var ee,C;N.value=Q,R.value.x+=No*P,s.position.copy(U.position).add(new d(0,1.6,0)),i.position.copy(U.position),c.position.copy(Ye).multiplyScalar(1700).add(U.position),V.copy(Ye).multiplyScalar(1e6).add(s.position),s.updateMatrixWorld(!0),(C=(ee=S.userData).updateShadows)==null||C.call(ee)}}}const be=6371,Fo=Math.PI/180,Oe={lat:-33.96,lon:18.4},Ct={lon0:17.8,lon1:19.4,lat0:-34.45,lat1:-33.5},Bo={lon0:12,lon1:26,lat0:-36,lat1:-28},ra={lon0:18.3,lon1:18.56,lat0:-34.2,lat1:-33.88},rt=1.5,Tt=new URL("../textures/cape/",location.href).href;function ft(t,e){const o=(90-t)*Fo,a=(e+180)/360*Math.PI*2;return new d(-Math.cos(a)*Math.sin(o),Math.cos(o),Math.sin(a)*Math.sin(o))}const je=ft(Oe.lat,Oe.lon),Ze=ft(Oe.lat,Oe.lon+.01).sub(ft(Oe.lat,Oe.lon-.01)).normalize(),it=new d().crossVectors(je,Ze).normalize();function _t(t,e,o=0){const a=ft(t,e).multiplyScalar(be+o).sub(je.clone().multiplyScalar(be));return new d(a.dot(Ze),a.dot(je),-a.dot(it))}const Pa=9e3,za=7,Uo=.62,Eo=Math.asin(19/(be+za)),Wo=t=>t*t*t*(t*(6*t-15)+10);function ia(t){const e=Wo(Math.min(1,Math.max(0,t))),o=Math.exp(Math.log(Pa)*(1-e)+Math.log(za)*e),a=Math.exp(Math.log(Uo)*(1-e)+Math.log(Eo)*e);return{a:o,H:new d(-(be+o)*Math.sin(a),-be+(be+o)*Math.cos(a),0)}}const Pt=new d(-.41,.574,-.709).normalize();function zt(t,e,o,a,n,r=.06,s=t,i=null){const c=new Float32Array(e*o*3),u=new Float32Array(e*o*2),b=new Float32Array(e*o*4);for(let S=0;S<o;S++){const B=1-S/(o-1),I=t.lat0+B*(t.lat1-t.lat0);for(let G=0;G<e;G++){const Y=G/(e-1),z=t.lon0+Y*(t.lon1-t.lon0),W=S*e+G;let V=n;if(a){const Z=a[W];V+=Z>0?Z*rt/1e3:0}let R=Math.min(1,Math.min(Y,1-Y,B,1-B)/r);if(R=R*R*(3-2*R),i){const Z=(z-i.lon0)/(i.lon1-i.lon0),oe=(I-i.lat0)/(i.lat1-i.lat0),J=Math.min(Z,1-Z,oe,1-oe);J>0&&(R*=1-Math.min(1,Math.max(0,J-.02)/.06),V-=.04*Math.min(1,J/.06))}const N=_t(I,z,V);c.set([N.x,N.y,N.z],W*3),u.set([(z-s.lon0)/(s.lon1-s.lon0),(I-s.lat0)/(s.lat1-s.lat0)],W*2),b.set([1,1,1,R],W*4)}}const h=[];for(let S=0;S<o-1;S++)for(let B=0;B<e-1;B++){const I=S*e+B,G=I+1,Y=I+e,z=Y+1;h.push(I,Y,G,G,Y,z)}const M=new Pe;return M.setAttribute("position",new re(c,3)),M.setAttribute("uv",new re(u,2)),M.setAttribute("color",new re(b,4)),M.setIndex(h),M.computeVertexNormals(),M}function Lo(t,e){const o=document.createElement("canvas");o.width=640,o.height=e?176:112;const a=o.getContext("2d");a.fillStyle="rgba(8,14,28,0.72)",a.beginPath(),a.roundRect(6,6,628,o.height-12,36),a.fill(),a.textAlign="center",a.textBaseline="middle",a.fillStyle="#ffffff",a.font='bold 56px "Trebuchet MS", system-ui, sans-serif',a.fillText(t,320,e?66:58,600),e&&(a.fillStyle="#9fd8ff",a.font='38px "Trebuchet MS", system-ui, sans-serif',a.fillText(e,320,130,600));const n=new ze(o);n.colorSpace=_e;const r=new Ce(new Te({map:n,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}));return r.renderOrder=30,r.userData.aspect=o.width/o.height,r}function Io(){const t=document.createElement("canvas");t.width=t.height=128;const e=t.getContext("2d");for(let o=0;o<26;o++){const a=64+(Math.random()-.5)*60,n=64+(Math.random()-.5)*40,r=14+Math.random()*26,s=e.createRadialGradient(a,n,0,a,n,r);s.addColorStop(0,"rgba(255,255,255,0.5)"),s.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=s,e.fillRect(0,0,128,128)}return new ze(t)}function Vo({earthMap:t,skyTex:e,renderer:o}){const a=new Ut;a.fog=new ya(12044508,0);const n=new De;a.add(n);const r=Math.min(8,o.capabilities.getMaxAnisotropy()),s=new va,i=(k,j=!0)=>new Promise(A=>s.load(Tt+k,K=>{j&&(K.colorSpace=_e),K.anisotropy=r,A(K)},void 0,()=>A(null))),c=new Rt(16774374,3);c.position.copy(Pt).multiplyScalar(100),a.add(c),a.add(new Ya(11061503,6181956,.55));const u=new ae({uniforms:{uStars:{value:e},uAlt:{value:Pa},uSun:{value:Pt},uDip:{value:0}},vertexShader:"varying vec3 vDir; varying vec2 vUv; void main(){ vDir = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D uStars; uniform float uAlt; uniform vec3 uSun; uniform float uDip; varying vec3 vDir; varying vec2 vUv;
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
      }`,side:ut,depthWrite:!1,fog:!1,toneMapped:!0}),b=new O(new we(1800,64,32),u);b.renderOrder=-10,a.add(b);const h=new Re({map:t,roughness:.75,metalness:0}),M=new O(new we(be-5,192,110),h),S=new pt().set(Ze.x,Ze.y,Ze.z,0,je.x,je.y,je.z,0,-it.x,-it.y,-it.z,0,0,0,0,1);M.quaternion.setFromRotationMatrix(S),M.position.set(0,-be,0),n.add(M);const B=new ae({uniforms:{uSun:{value:Pt},uOn:{value:1}},vertexShader:"varying vec3 vN; varying vec3 vV; varying vec3 vWN; void main(){ vN = normalize(normalMatrix * normal); vWN = normalize(mat3(modelMatrix) * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform vec3 uSun; uniform float uOn; varying vec3 vN; varying vec3 vV; varying vec3 vWN;
      void main(){ float rim = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0); float lit = smoothstep(-0.3, 0.4, dot(normalize(vWN), uSun));
        gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * pow(rim, 4.0) * 1.6 * lit * uOn, 1.0); }`,transparent:!0,depthWrite:!1,blending:ne,fog:!1}),I=new O(new we(be+70,128,64),B);I.position.set(0,-be,0),n.add(I);const G=[],Y=[];let z=null;function W(){return z||(z=(async()=>{const[k,j,A,K,$,P,Q,U]=await Promise.all([i("region.jpg"),i("region_n.jpg",!1),i("detail.jpg"),i("detail_n.jpg",!1),i("detail_rough.jpg",!1),i("detail_a.jpg",!1),fetch(Tt+"detail_h.bin").then(T=>T.arrayBuffer()),fetch(Tt+"pen_h.bin").then(T=>T.arrayBuffer())]),ee=new O(zt(Bo,180,104,null,-.3,.16),new Re({map:k,normalMap:j,normalScale:new xe(1.4,1.4),roughness:.8,metalness:0,vertexColors:!0,transparent:!0}));ee.renderOrder=1,n.add(ee);const C=new Int16Array(Q),te=new Re({map:A,normalMap:K,roughnessMap:$,alphaMap:P,roughness:1,metalness:0,vertexColors:!0,transparent:!0}),_=new O(zt(Ct,321,241,C,0,.05,Ct,ra),te);_.renderOrder=2,n.add(_);const v=new O(zt(ra,241,321,new Int16Array(U),0,.08,Ct),te);v.renderOrder=3,n.add(v);const m=(T,E,L,ve,de)=>{const se=Lo(T,E);se.position.copy(_t(L,ve,de)),n.add(se),G.push(se)};m("Table Mountain","1 085 m high",-33.9575,18.405,1.085*rt+.9),m("Lion's Head",null,-33.9351,18.389,.67*rt+.6),m("Cape Town","city centre",-33.922,18.423,.9),m("Robben Island",null,-33.806,18.366,.6),m("Cape Point",null,-34.357,18.497,.9),m("False Bay",null,-34.2,18.65,.5),m("Stellenbosch",null,-33.935,18.86,.9),m("Table Bay",null,-33.87,18.43,.4),m("Atlantic Ocean",null,-34.05,18.15,.4);const D=Io();for(let T=0;T<34;T++){const E=T/33,L=new Ce(new Te({map:D,transparent:!0,depthWrite:!1,opacity:0,fog:!0}));L.userData={t:E,phase:Math.random(),size:.6+Math.random()*.5},L.renderOrder=10,n.add(L),Y.push(L)}})(),z)}let V="idle",R=0,N=null;const Z=new d,oe=new d;function J(k,j,A,K){if(V==="down"){if(R=Math.min(1,R+A/24),R>=1){V="hover";const _=N;N=null,_&&_()}}else if(V==="up"&&(R=Math.max(0,R-A/13),R<=0)){V="idle";const _=N;N=null,_&&_()}const{a:$,H:P}=ia(R),Q=200/$;Z.copy(k.position).add(new d(0,1.6,0)),n.scale.setScalar(Q),n.position.copy(Z).addScaledVector(P,-Q),b.position.copy(k.position);const U=.0085*Math.pow(Math.min(1,30/$),.9);a.fog.density=U/Q,u.uniforms.uAlt.value=$,u.uniforms.uDip.value=Math.acos(be/(be+$)),B.uniforms.uOn.value=st.smoothstep($,60,160);const ee=1-st.smoothstep($,60,140);j.getWorldPosition(oe);for(const _ of G){_.visible=ee>.02,_.material.opacity=ee;const m=_.getWorldPosition(new d).distanceTo(oe)*.16/Q;_.scale.set(m,m/_.userData.aspect,1)}const C=[-33.9545,18.392],te=[-33.9575,18.42];for(const _ of Y){const v=(_.userData.phase+K*.035)%1,m=C[0]+(te[0]-C[0])*_.userData.t+.006-v*.012,D=C[1]+(te[1]-C[1])*_.userData.t,T=1.06*rt+.22-Math.max(0,v-.45)*1.2;_.position.copy(_t(m,D,T)),_.scale.setScalar(_.userData.size),_.material.opacity=Math.sin(v*Math.PI)*.9*ee}}return{scene:a,start:{position:new d(0,0,0),yaw:-Math.PI/2},load:W,altitude:()=>ia(R).a,descend(k){R=0,V="down",N=k},ascend(k){V="up",N=k},reset(){R=0,V="idle"},skip(){V==="down"&&(R=.999)},setProgress(k){R=k},get mode(){return V},update:J}}const Da={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class $e{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Oo=new ha(-1,1,1,-1,0,1);class Go extends Pe{constructor(){super(),this.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ct([0,2,0,0,2,0],2))}}const jo=new Go;class It{constructor(e){this._mesh=new O(jo,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Oo)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class qo extends $e{constructor(e,o){super(),this.textureID=o!==void 0?o:"tDiffuse",e instanceof ae?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=dt.clone(e.uniforms),this.material=new ae({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new It(this.material)}render(e,o,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class sa extends $e{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,a){const n=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,i;this.inverse?(s=0,i=1):(s=1,i=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,s,4294967295),r.buffers.stencil.setClear(i),r.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class Ho extends $e{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class $o{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const a=e.getSize(new xe);this._width=a.width,this._height=a.height,o=new Ke(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nt}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new qo(Da),this.copyPass.material.blending=Ka,this.clock=new Za}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let a=!1;for(let n=0,r=this.passes.length;n<r;n++){const s=this.passes[n];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),s.needsSwap){if(a){const i=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(i.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(i.EQUAL,1,4294967295)}this.swapBuffers()}sa!==void 0&&(s instanceof sa?a=!0:s instanceof Ho&&(a=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const a=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(a,n),this.renderTarget2.setSize(a,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(a,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Qo extends $e{constructor(e,o,a=null,n=null,r=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=a,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new F}render(e,o,a){const n=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=n}}const Xo={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new F(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class He extends $e{constructor(e,o,a,n){super(),this.strength=o!==void 0?o:1,this.radius=a,this.threshold=n,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new F(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new Ke(r,s,{type:nt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const M=new Ke(r,s,{type:nt});M.texture.name="UnrealBloomPass.h"+h,M.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(M);const S=new Ke(r,s,{type:nt});S.texture.name="UnrealBloomPass.v"+h,S.texture.generateMipmaps=!1,this.renderTargetsVertical.push(S),r=Math.round(r/2),s=Math.round(s/2)}const i=Xo;this.highPassUniforms=dt.clone(i.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ae({uniforms:this.highPassUniforms,vertexShader:i.vertexShader,fragmentShader:i.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new xe(1/r,1/s),r=Math.round(r/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const b=Da;this.copyUniforms=dt.clone(b.uniforms),this.blendMaterial=new ae({uniforms:this.copyUniforms,vertexShader:b.vertexShader,fragmentShader:b.fragmentShader,blending:ne,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new F,this.oldClearAlpha=1,this.basic=new Ue,this.fsQuad=new It(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,o){let a=Math.round(e/2),n=Math.round(o/2);this.renderTargetBright.setSize(a,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(a,n),this.renderTargetsVertical[r].setSize(a,n),this.separableBlurMaterials[r].uniforms.invSize.value=new xe(1/a,1/n),a=Math.round(a/2),n=Math.round(n/2)}render(e,o,a,n,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=a.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let i=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=i.texture,this.separableBlurMaterials[c].uniforms.direction.value=He.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=He.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),i=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}getSeperableBlurMaterial(e){const o=[];for(let a=0;a<e;a++)o.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new ae({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new ae({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}He.BlurDirectionX=new xe(1,0);He.BlurDirectionY=new xe(0,1);const Yo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ko extends $e{constructor(){super();const e=Yo;this.uniforms=dt.clone(e.uniforms),this.material=new Ja({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new It(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},eo.getTransfer(this._outputColorSpace)===to&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ao?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===oo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===no?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===pa?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ro?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===io&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const x=so(),{scene:Vt,rig:Ot}=x;document.getElementById("enter").appendChild(x.vrButton);const Gt=new lo,ht=document.getElementById("loading");Gt.onProgress=(t,e,o)=>{ht&&(ht.querySelector("span").textContent=`${Math.round(e/o*100)}%`)};Gt.onLoad=()=>ht&&ht.classList.add("done");const H=yo(x,Gt),wt=x.scene;x.onFrame((t,e)=>{x.activeScene===wt&&H.update(t,e)});let Be=null;x.onFrame((t,e)=>{Be&&x.activeScene===Be.scene&&Be.update(t,e,Ot)});let ye=null;const jt=()=>ye||(ye=Vo({earthMap:H.earthMap,skyTex:H.skyTexture,renderer:x.renderer}));let la=0;x.onFrame((t,e)=>{!ye||x.activeScene!==ye.scene||(ye.update(Ot,x.camera,t,e),ye.mode==="down"&&e-la>.4&&(la=e,Ua()))});const ie=co(),he=uo(new URL("../audio/solar-system/",location.href).href);x.onGesture(()=>ie.unlock());const qt={position:new d(-34,0,0),yaw:-Math.PI/2},ue=new Ma({width:1.35});ue.mesh.position.set(.95,1.25,-1.6);ue.mesh.rotation.y=-.38;x.addPanel(ue);const Qe=new Ma({width:.95,name:"picker"});Qe.mesh.position.set(-1,1.1,-1.45);Qe.mesh.rotation.y=.45;x.addPanel(Qe);const le={bloom:!0,labels:!0,speed:1},Dt=[1,5,25,0];function Ra(){const t=(e,o)=>({id:"go:"+e,label:o,primary:Ht()===e});Qe.show({title:"Go to",accent:"#a78bfa",rows:[[t("sun","Sun"),t("mercury","Mercury"),t("venus","Venus")],[t("earth","Earth"),t("mars","Mars"),t("jupiter","Jupiter")],[t("saturn","Saturn"),t("uranus","Uranus"),t("neptune","Neptune")],[{id:"view:tour",label:"Guided tour"},{id:"view:bloom",label:le.bloom?"Bloom: on":"Bloom: off"},{id:"view:labels",label:le.labels?"Labels: on":"Labels: off"},{id:"view:speed",label:le.speed?`Spin: ${le.speed}x`:"Spin: paused"}]]})}let ca="";x.onFrame(()=>{const t=x.activeScene===wt&&["intro","stop","quiz","result"].includes(w.screen)&&!x.isMoving(),e=t?Ht()+w.screen:"";e!==ca&&(ca=e,t?Ra():Qe.hide())});const tt=new $o(x.renderer),Nt=new Qo(Vt,x.camera);tt.addPass(Nt);tt.addPass(new He(new xe(window.innerWidth,window.innerHeight),.68,.38,.97));tt.addPass(new Ko);window.addEventListener("resize",()=>tt.setSize(window.innerWidth,window.innerHeight));function at(){x.setRender(le.bloom?(t,e)=>{Nt.scene=t,Nt.camera=e;const o=x.renderer.toneMapping;x.renderer.toneMapping=ma,tt.render(),x.renderer.toneMapping=o}:null),H.sunGlow.material.opacity=le.bloom?.75:.45,H.starUniforms&&(H.starUniforms.uVRBoost.value=le.bloom&&x.renderer.xr.isPresenting?1.35:1);for(const t of H.labels)t.visible=le.labels;H.setTimeScale(le.speed)}x.renderer.xr.addEventListener("sessionstart",at);x.renderer.xr.addEventListener("sessionend",at);const w={travel:"fly",screen:"intro",stop:0,quiz:0,score:0,answered:null,discovered:new Set},Ht=()=>w.screen==="stop"?ce[w.stop].id:null;for(const t of ce){const e=t.id==="sun"?H.sun:H.bodies[t.id];x.addTarget(e,"planet:"+t.id,()=>Ht()===t.id)}const Zo=(()=>{const t=document.createElement("canvas");t.width=t.height=256;const e=t.getContext("2d");return e.strokeStyle="rgba(120,230,255,0.9)",e.lineWidth=6,e.shadowColor="rgba(80,220,255,1)",e.shadowBlur=14,e.beginPath(),e.arc(128,128,110,0,Math.PI*2),e.stroke(),new ze(t)})(),ke=new Ce(new Te({map:Zo,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}));ke.visible=!1;Vt.add(ke);let Ve=null;x.onHoverTarget(t=>{if(Ve=t?t.slice(7):null,ke.visible=!!Ve&&!w.discovered.has(Ve),Ve){const e=q[Ve];ke.position.copy(Ee(Ve)),ke.userData.size=e.r*2.6}});x.onFrame((t,e)=>{ke.visible&&ke.scale.setScalar(ke.userData.size*(1+.04*Math.sin(e*5)))});const ka=(()=>{const e=new Pe;e.setAttribute("position",new re(new Float32Array(270),3));const o=(()=>{const i=document.createElement("canvas");i.width=i.height=64;const c=i.getContext("2d"),u=c.createRadialGradient(32,32,0,32,32,32);return u.addColorStop(0,"rgba(255,255,255,1)"),u.addColorStop(.3,"rgba(190,240,255,0.8)"),u.addColorStop(1,"rgba(120,200,255,0)"),c.fillStyle=u,c.fillRect(0,0,64,64),new ze(i)})(),a=new da({map:o,color:16777215,size:.3,transparent:!0,depthWrite:!1,blending:ne,toneMapped:!1}),n=new Je(e,a);n.visible=!1,n.frustumCulled=!1,Vt.add(n);const r=Array.from({length:90},()=>new d);let s=0;return x.onFrame(i=>{if(!n.visible)return;s+=i;const c=e.attributes.position;for(let u=0;u<90;u++)c.setXYZ(u,c.getX(u)+r[u].x*i,c.getY(u)+r[u].y*i,c.getZ(u)+r[u].z*i),r[u].multiplyScalar(Math.pow(.4,i));c.needsUpdate=!0,a.opacity=Math.max(0,1-s/1.6),s>1.6&&(n.visible=!1)}),(i,c,u=.1*c)=>{const b=e.attributes.position;for(let h=0;h<90;h++)b.setXYZ(h,i.x,i.y,i.z),r[h].randomDirection().multiplyScalar((1+Math.random()*3)*c);a.size=u,s=0,n.visible=!0}})(),ua={lat:-33.92,lon:18.42},xt=(()=>{const t=q.earth.r,e=(ua.lon+180)/360,o=e*Math.PI*2,a=(90-ua.lat)/180*Math.PI,n=new d(-Math.cos(o)*Math.sin(a),Math.cos(a),Math.sin(o)*Math.sin(a)),r=new De,s=new O(new we(.06,16,12),new Ue({color:16731501,toneMapped:!1}));s.position.copy(n).multiplyScalar(t*1.005);const i=new O(new ba(.012,.012,.8,8),new Ue({color:16748451,transparent:!0,opacity:.8,toneMapped:!1}));i.position.copy(n).multiplyScalar(t+.4),i.quaternion.setFromUnitVectors(new d(0,1,0),n);const c=document.createElement("canvas");c.width=768,c.height=128;const u=c.getContext("2d");u.fillStyle="rgba(10,16,32,0.85)",u.beginPath(),u.roundRect(8,16,752,96,44),u.fill(),u.font='bold 52px "Trebuchet MS", system-ui, sans-serif',u.fillStyle="#ffd1dc",u.textAlign="center",u.textBaseline="middle",u.fillText("Cape Town: you are here!",384,66,720);const b=new Ce(new Te({map:new ze(c),depthTest:!1,transparent:!0,toneMapped:!1}));return b.scale.set(2.7,.45,1),b.position.copy(n).multiplyScalar(t+1),b.renderOrder=20,r.add(s,i,b),r.visible=!1,H.bodies.earth.add(r),r.userData.dir=n,r})();let pe=null;function Jo(){const t=H.bodies.earth,e=Ee("earth"),o=new d(-1,0,0),a=t.rotation.y;let n=0,r=-2;for(let c=0;c<360;c+=2){t.rotation.y=c*Math.PI/180,t.updateMatrixWorld(!0);const b=xt.userData.dir.clone().applyMatrix4(t.matrixWorld).sub(e).normalize().dot(o);b>r&&(r=b,n=t.rotation.y)}t.rotation.y=a;let s=((n-a%(Math.PI*2))%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;pe={from:a,to:a+s,t:0};const i=H.spinnerOf("earth");i&&(i.saved=i.saved??i.speed,i.speed=0,i.boost=0)}x.onFrame(t=>{if(!pe)return;pe.t=Math.min(1,pe.t+t/1.8);const e=pe.t<.5?2*pe.t**2:1-(-2*pe.t+2)**2/2;H.bodies.earth.rotation.y=pe.from+(pe.to-pe.from)*e,pe.t>=1&&(pe=null,xt.visible=!0)});function _a(){xt.visible=!1,pe=null;const t=H.spinnerOf("earth");t&&t.saved!==void 0&&(t.speed=t.saved,delete t.saved)}function Na(t,e){w.discovered.has(t)||(w.discovered.add(t),ke.visible=!1,ie.sfx.sparkle(),ka(e||Ee(t),Math.max(1,q[t].r*.4)),t==="earth"?Jo():H.boost(t,2.5),bt(),he.play("secret-"+t))}function Aa(t,e,o,a){he.stop();const n=t.position.distanceTo(Ot.position)>12;w.travel==="fly"&&n?(H.markDestination(e),H.arrangeMoons(e,8.6),ue.show({title:`Next stop: ${o}`,body:"Hold on, explorer! We are flying up to see the whole solar system.",buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),ie.sfx.cruise(8.6),x.fly(t,bo,{out:3.2,hold:1.8,in:3.6,onVia:()=>ue.show({title:"The whole solar system!",body:["Look down: there is the Sun and all the planets going around it.",`The glowing ring shows ${o}, our next stop.`],buttons:[{id:"skip",label:"Skip the flight"}],accent:"#fde68a"}),then:()=>{H.markDestination(null),a()}})):(ie.sfx.whoosh(),x.teleport(t,a))}function en(){return{id:"sound",label:ie.enabled?"Sound: on":"Sound: off"}}function Fa(){Be||(Be=Ao({saturnMap:H.saturnMap,ringTex:H.satRingTex,skyTex:H.skyTexture})),w.screen="ringdive",he.stop(),ie.sfx.whoosh(),x.blink(()=>{x.setScene(Be.scene),x.placeNow(Be.start),ue.show({title:"Inside Saturn's rings!",body:["The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house.","That giant ball beside you is Saturn. Look all around you!"],footer:"The rings are huge but very thin: often only about 10 metres thick.",buttons:[{id:"leavedive",label:"Back to Saturn",primary:!0}],accent:"#fde68a"}),he.play("ringdive")})}function Ba(){he.stop(),ie.sfx.whoosh(),x.blink(()=>{x.setScene(wt),x.placeNow(Lt("saturn")),w.screen="stop",bt()})}const tn=t=>(t>=100?Math.round(t/10)*10:Math.round(t)).toLocaleString("en-ZA");function Ua(){const t=ye.altitude();ue.show({title:"Flying down to Cape Town",body:[`Height above the ground: ${tn(t)} km`,t>400?"Look down: that is Africa below you!":t>60?"Find the tip of Africa: that is the Cape.":"Almost there... look ahead for Table Mountain."],buttons:[{id:"capeskip",label:"Skip ahead"}],accent:"#60a5fa"})}async function Ea(){const t=jt();w.screen="cape",he.stop(),ue.show({title:"Getting ready...",body:"Loading the map of the Cape.",accent:"#60a5fa"}),await t.load(),ie.sfx.whoosh(),x.blink(()=>{x.setScene(t.scene),x.placeNow(t.start),H.setPadGlass(!0),x.camera.far=4e5,x.camera.updateProjectionMatrix(),t.descend(()=>{ue.show({title:"Cape Town from 7 km up!",body:["Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet.","To the right is False Bay, and far behind are the mountains of the Winelands."],footer:"See the cloud spilling over Table Mountain? Capetonians call it the tablecloth.",buttons:[{id:"leavecape",label:"Back to space",primary:!0}],accent:"#60a5fa"}),he.play("cape")}),Ua(),ie.sfx.cruise(24)})}function Wa(){he.stop(),ue.show({title:"Back to space!",body:"Hold on, we are flying up.",accent:"#60a5fa"}),ie.sfx.cruise(13),ye.ascend(()=>{x.blink(()=>{x.setScene(wt),H.setPadGlass(!1),x.camera.far=2e3,x.camera.updateProjectionMatrix(),x.placeNow(Lt("earth")),ye.reset(),w.screen="stop",bt()})})}function At(){w.screen="intro",ue.show({title:"Journey through the Solar System",body:["Welcome, space explorer! We will visit the Sun and all 8 planets.","Point at a button and squeeze the trigger (or pinch your fingers) to choose it."],footer:'Sizes and distances are made to fit, not to scale. Feeling dizzy when flying? Choose "Travel: jump".',buttons:[{id:"start",label:"Start",primary:!0},en(),{id:"travel",label:w.travel==="fly"?"Travel: fly":"Travel: jump"}],accent:"#22d3ee"}),he.play("intro")}function bt(){const t=w.stop,e=ce[t],o=w.discovered.has(e.id);ue.show({title:`${t+1}/${ce.length}  ${e.name}`,body:e.text,footer:o?`Secret: ${e.secret}`:`Point at ${e.id==="sun"?"the Sun":e.name} and squeeze to discover a secret!`,footerColor:o?e.accent:"#8fa6c9",buttons:[...t>0?[{id:"back",label:"Back"}]:[],...e.id==="saturn"?[{id:"ringdive",label:"Dive into rings"}]:[],...e.id==="earth"?[{id:"cape",label:"Fly to Cape Town"}]:[],{id:"next",label:t===ce.length-1?"Take the quiz":"Next planet",primary:!0}],accent:e.accent})}function Fe(t){w.screen="travel",_a(),w.travel!=="fly"&&H.arrangeMoons(ce[t].id,.8),Aa(Lt(ce[t].id),ce[t].id,ce[t].name,()=>{ce[t].id==="earth"&&jt().load(),w.screen="stop",w.stop=t,bt(),he.play(ce[t].id)})}function mt(t){w.screen="quiz",w.quiz=t,w.answered=null;const e=qe[t],o=()=>ue.show({title:`Question ${t+1} of ${qe.length}`,body:e.q,stack:!0,accent:"#a78bfa",buttons:e.options.map((a,n)=>({id:"ans"+n,label:a,state:w.answered!==null?n===e.answer?"right":n===w.answered?"wrong":void 0:void 0}))});w.redraw=o,t===0?(w.score=0,w.screen="travel",_a(),Aa(qt,"sun","Quiz time",()=>{w.screen="quiz",o(),he.play("quiz")})):(o(),he.play("q"+(t+1)))}function La(){w.screen="result";const t=w.score/qe.length,e=t===1?"result-perfect":t>=.6?"result-good":"result-try",o=t===1?"Perfect! You are a real space expert!":t>=.6?"Great job, explorer!":"Good try! Fly the tour again to learn even more.";ue.show({title:`You got ${w.score} out of ${qe.length}!`,body:[o,`You discovered ${w.discovered.size} of ${ce.length} secrets on the way.`],buttons:[{id:"again",label:"Fly again",primary:!0}],accent:"#34d399"}),ie.sfx.fanfare(),ka(new d(qt.position.x+1.6,1.4,-.9),.5,.04),he.play(e)}x.onPress((t,e,o)=>{if(t.startsWith("planet:"))return Na(t.slice(7),o);if(ie.sfx.click(),t==="skip")return x.skipFlight();if(!x.isMoving()){if(t.startsWith("view:")){const a=t.slice(5);return a==="tour"?Fe(0):(a==="bloom"&&(le.bloom=!le.bloom),a==="labels"&&(le.labels=!le.labels),a==="speed"&&(le.speed=Dt[(Dt.indexOf(le.speed)+1)%Dt.length]),at(),Ra())}if(t.startsWith("go:")){const a=ce.findIndex(n=>n.id===t.slice(3));return a>=0&&!(w.screen==="stop"&&w.stop===a)?Fe(a):void 0}if(t==="travel")return w.travel=w.travel==="fly"?"jump":"fly",At();if(t==="sound")return ie.setEnabled(!ie.enabled),he.setEnabled(ie.enabled),At();if(w.screen==="intro"&&t==="start")return Fe(0);if(w.screen==="ringdive"&&t==="leavedive")return Ba();if(w.screen==="cape"){if(t==="capeskip"&&ye){ye.skip();return}return t==="leavecape"&&ye&&ye.mode==="hover"?Wa():void 0}if(w.screen==="stop"){if(t==="ringdive")return Fa();if(t==="cape")return Ea();if(t==="next")return w.stop===ce.length-1?mt(0):Fe(w.stop+1);if(t==="back")return Fe(w.stop-1)}if(w.screen==="quiz"&&t.startsWith("ans")&&w.answered===null){const a=Number(t.slice(3));w.answered=a,a===qe[w.quiz].answer?(w.score++,ie.sfx.correct()):ie.sfx.wrong(),w.redraw(),setTimeout(()=>w.quiz===qe.length-1?La():mt(w.quiz+1),1500);return}if(w.screen==="result"&&t==="again")return w.discovered.clear(),Fe(0)}});x.placeNow(qt);at();At();const Ft=new URLSearchParams(location.search);Ft.has("stop")&&Fe(Math.max(0,Math.min(ce.length-1,Number(Ft.get("stop"))||0)));Ft.has("quiz")&&mt(0);window.__vrg={picker:Qe,view:le,applyView:at,showStop:Fe,showQuiz:mt,showResult:La,discover:Na,state:w,world:H,capePin:xt,app:x,panel:ue,enterRingDive:Fa,leaveRingDive:Ba,enterCape:Ea,leaveCape:Wa,getCape:jt};
