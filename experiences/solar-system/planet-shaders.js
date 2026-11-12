import * as THREE from 'three'

// Planet shaders from the Beyond the Void prototype (Schools Experiences), copied as they are.
// Each fragment shader ends with displayColor(): the prototype shows its colours straight on screen, so we turn
// them back into linear light and let three.js encode them, which looks the same and also works with bloom.

export const EarthShader = {
  uniforms: {
    uDayTex: { value: null },
    uNightTex: { value: null },
    uSpecTex: { value: null },
    uNormalMap: { value: null },
    uCloudTex: { value: null },
    uHasNormal: { value: 0 },
    uSunDir: { value: new THREE.Vector3(1, 0, 0) }
  },
  vertexShader: `
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
  `,
  fragmentShader: `
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
  `
};

export const EarthCloudsShader = {
  uniforms: {
    uCloudTex: { value: null },
    uSunDir: { value: new THREE.Vector3(1, 0, 0) }
  },
  vertexShader: `
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
  `,
  fragmentShader: `
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
  `
};

export const AtmosphereHaloShader = {
  uniforms: {
    uColor: { value: new THREE.Color('#388aff') },
    uSunDir: { value: new THREE.Vector3(1, 0, 0) }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
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
  `
};

export const SaturnPlanetShader = {
  uniforms: {
    uBaseTex: { value: null },
    uDetailTex: { value: null },
    uNormalMap: { value: null },
    uSunPos: { value: new THREE.Vector3(0, 0, 0) },
    uInnerRadius: { value: 25.0 },
    uOuterRadius: { value: 52.0 },
    uRingNormal: { value: new THREE.Vector3(0, 1, 0) }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPos;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    void main() {
      vUv = uv;
      vLocalPos = position;
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
  `,
  fragmentShader: `
    uniform sampler2D uBaseTex;
    uniform sampler2D uDetailTex;
    uniform sampler2D uNormalMap;
    uniform vec3 uSunPos;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPos;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vTangent;
    varying vec3 vBitangent;

    void main() {
      vec3 geoNormal = normalize(vNormal);
      vec3 T = normalize(vTangent);
      vec3 B = normalize(vBitangent);
      mat3 tbn = mat3(T, B, geoNormal);

      vec3 baseBands = texture2D(uBaseTex, vUv).rgb;
      vec3 detailSample = texture2D(uDetailTex, vUv * vec2(1.5, 1.2)).rgb;
      vec3 normalSample = texture2D(uNormalMap, vUv * vec2(2.0, 1.5)).xyz * 2.0 - 1.0;

      // Extract canyon/fracture relief gradients (Reference Image 4)
      vec2 stepUv = vec2(1.0 / 1024.0, 1.0 / 512.0);
      float dL = texture2D(uDetailTex, vUv - vec2(stepUv.x, 0.0)).r;
      float dR = texture2D(uDetailTex, vUv + vec2(stepUv.x, 0.0)).r;
      float dD = texture2D(uDetailTex, vUv - vec2(0.0, stepUv.y)).r;
      float dU = texture2D(uDetailTex, vUv + vec2(0.0, stepUv.y)).r;

      normalSample.xy = normalSample.xy * 0.7 + vec2(dL - dR, dD - dU) * 2.2;
      vec3 normal = normalize(tbn * normalSample);

      vec3 sunDir = normalize(uSunPos - vWorldPos);
      float geoNdotL = dot(geoNormal, sunDir);
      float NdotL = max(0.0, dot(normal, sunDir));

      // Warm peach-amber-bronze color grading matching Reference Image 4
      vec3 warmSurface = mix(baseBands * vec3(1.05, 0.88, 0.72), detailSample * vec3(1.12, 0.86, 0.68), 0.42);
      float dayFactor = smoothstep(-0.12, 0.22, geoNdotL);

      // Soft atmospheric limb scattering on sunlit side
      float fresnel = 1.0 - max(0.0, dot(geoNormal, vViewDir));
      vec3 limbHaze = vec3(0.96, 0.78, 0.62) * pow(fresnel, 3.2) * smoothstep(-0.15, 0.5, geoNdotL) * 0.48;

      // Golden-amber thermal/storm fissure glints in the dark terminator region (Ref Image 4)
      float ridgeMask = smoothstep(0.22, 0.42, abs(dL - dR) + abs(dD - dU));
      float terminatorZone = smoothstep(-0.30, -0.02, geoNdotL) * smoothstep(0.20, -0.02, geoNdotL);
      float southernBelt = smoothstep(0.15, 0.55, 1.0 - vUv.y);
      vec3 thermalGlints = vec3(1.0, 0.6, 0.22) * ridgeMask * terminatorZone * southernBelt * 0.45;

      vec3 litColor = warmSurface * (NdotL * 0.92 + 0.08 * max(0.0, geoNdotL)) * dayFactor + limbHaze + thermalGlints;
      vec3 nightFloor = vec3(0.001, 0.001, 0.0015);

      gl_FragColor = vec4(max(nightFloor, litColor), 1.0);
          gl_FragColor.rgb = pow(max(gl_FragColor.rgb, vec3(0.0)), vec3(2.2)); // displayColor
          #include <colorspace_fragment>
    }
  `
};

export const PlanetPBRShader = {
  uniforms: {
    uMap: { value: null },
    uSunPos: { value: new THREE.Vector3(0, 0, 0) },
    uBumpScale: { value: 1.8 },
    uTint: { value: new THREE.Color('#ffffff') },
    uLimbColor: { value: new THREE.Color('#000000') },
    uLimbStrength: { value: 0.0 }
  },
  vertexShader: `
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
  `,
  fragmentShader: `
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
  `
};
