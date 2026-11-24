# VR Guys school WebXR experiences

Handoff notes so a new Claude Code session can carry on where the claude.ai conversation left off.

## What this is
- WebXR experiences for Virtual Reality Guys school visits, aimed at primary school (Gr 4–7) on Meta Quest headsets.
- They are for trial and demo: **merge every change straight to `main` without asking**, because merging deploys.
- Built with three.js 0.170 and Vite (multi-page, see `vite.config.js`). The output goes to `../public/experiences/` and deploys with the main site on Vercel.
  - Vercel project: `prj_vdwSkztzhBgqPmu4HC2G7N9G7CM4`
  - Vercel team: `team_O0MQy0F5zOjkF5EPpebdluV0`
- Workflow:
  1. Create a feature branch.
  2. Run `npx vite build` and commit the built output too.
  3. Push the branch, open a PR, and squash-merge it.
- Commands (run in `experiences/`):
  - `npm run dev`: dev server.
  - `npx vite build`: production build.

## Shared code (`shared/`)
- `xr-app.js`: renderer, rig and VR button.
  - Controller, hand-pinch and mouse pointer on panels and targets.
  - Movement: `fly(place, via, opts)` (with a `lift` option for how far a glide bulges), `teleport`, `placeNow`.
  - Scenes and rendering: `setScene`, `setRender(fn)` for flat-screen post-processing only.
  - Comfort vignette and fade.
- `panel.js`: canvas UI panel. Content can use `buttons`, `stack` or `rows` (grid layout).
- `audio.js`: synthesised music and sound effects.
- `narration.js`: plays the MP3s listed in `public/audio/<experience>/clips.json`.

## Solar system (`solar-system/`)
- Pitched to schools as a CAPS lesson (Natural Sciences and Technology, Gr 4–7, "Planet Earth and Beyond"). Facts were checked against science.nasa.gov (Nov 2026); keep them NASA-checked, South African spelling, moon counts as "more than ...".
- **Realism rule (Tinashe):** nothing may look less real than what is there. New features reuse the real shaders (Earth, Sun, planets) rather than simpler stand-ins.
- Guided tour of 10 stops: Sun → Mars, **the Asteroid Belt** (Ceres, `SPEC.belt`, plus a hologram grouping the rocky inner and giant outer planets), Jupiter → Neptune. Each stop has narration and a tap-to-discover secret.
- All text lives in `content.js`: `STOPS`, the 8-question `QUIZ` (key, options, answer, why), `DAYNIGHT`, `MOMENTS`, and `NARRATION` (every clip; panel `text` can be shorter than the narrated `say`).
- Wow moments:
  - Sun: "How big is the Sun?" glides close and lines up 109 Earths across its face, at true angular sizes (`moments.js`).
  - Earth: "How do days and years work?" (`daynight.js`, its own scene). Part 1: Earth spins on its 23.4° axis with a Cape Town clock. Part 2: a zoom-out to one orbit with a day counter and Cape Town seasons. Plus "Fly to Cape Town" (`cape.js`).
  - Jupiter: the Great Red Spot turned towards you, with Earth at the same scale (GRS centre measured on the texture: lat -26, lon -90.4).
  - Saturn: the ring dive.
  - Neptune: "Look back at the Sun" (`neptune-view.js`): the Sun as a bright point, with a panel comparing it to the Sun seen from Earth.
  - Picker: "Show real distances" calls `world.setLayout(k)`, which animates the planets to their real AU distances (Neptune stays put) and back.
- Quiz: answers are shuffled and each one shows a "why". Results (learner number 1–40, score, per-question correct, secrets, time) are saved to localStorage (`results-store.js`).
  - The teacher page is `experiences/results.html` (+ `results-page.js`): class summary, % correct per question, sessions, CSV export and import (to merge headsets), and clear class.
  - Each headset has its own localStorage. A shared class view would need a server (e.g. the portal's Supabase).
- Teacher mode: hold the faint "VR GUYS" badge on the welcome, learner or result panel for 1.6 s (`app.onHold`), or use `?teacher=1`. It sets the start stop and turns learner numbers on or off; the settings are kept in localStorage.
- Test hooks: `?stop=N`, `?quiz=1`, `?daynight=1`, `?neptune=1`, `?scale=1`; `window.__vrg.press(id)` presses a button by id.
- Panels: `panel.js` shrinks body text to fit, and sets `panel.overflow` if it still doesn't fit. Check that it stays false. It also supports `buttonRows`, `extra` (a canvas picture strip) and `hidden` hot spots.
- A left-hand "Go to" picker jumps to any stop in any order. It also has toggles for the guided tour, bloom, labels and spin speed (1x, 5x, 25x or paused), plus "Show real distances".
- The look comes from Tinashe's "Beyond the Void" prototype (on his Desktop, in "Schools Experiences"). The Sun is our own and should stay.
  - `planet-shaders.js`: the prototype's planet shaders, copied as they are. Each ends with a pow 2.2 + colorspace step so it displays the same as in the prototype.
  - `deep-space.js`: the Milky Way and nebula sky, baked once into a 4K texture at start-up, plus true-colour stars and spiked "hero" stars.
  - The Saturn ring shader lives in `scene.js` (`saturnRings`, `ringProfile`).
- Textures: `public/textures/solar/real/`, credits in `CREDITS.md` there.
- Bloom only runs on a flat screen. Headsets can't run post-processing, so in VR the toggle boosts the Sun's glow and the stars instead.
- Motion: real relative spin rates, slowed down (Earth's day is 150 s). Venus and Uranus spin backwards. The comet follows Kepler's second law.

## Kelp forest (`kelp-forest/`)
- Opens in a helicopter over Mouille Point, Cape Town (`cape-opening.js`). From there it flies down the Atlantic seaboard and dives into the kelp forest off Bantry Bay.
  - Heights are modelled. The coastline comes from Who's On First.
  - Ground data is generated by `tools/gen-cape-close.mjs` and written to `public/textures/cape-close/`.
- Underwater files:
  - `ocean.js`: water, fog, caustics and the seabed.
  - `kelp.js`: kelp plants with swaying, translucent fronds.
  - `life.js`: fish, seals, the octopus and sharks.
  - `bodies.js`: the creature mesh and swim-shader helpers used by `life.js`.

## Narration
- Voice: the free Kokoro AI voice "Heart" (`af_heart`).
- Narration text: `tools/narration-lines.mjs`. Generate the audio with `tools/tts-kokoro.py`.
- The model files (`kokoro-v1.0.int8.onnx` and `voices-v1.0.bin`) are git-ignored. Download them from the thewh1teagle/kokoro-onnx GitHub release `model-files-v1.0`.

## Gotchas learned the hard way
- **Following the eye in VR:** never call `camera.getWorldPosition()` inside `onBeforeRender` in VR. It rebuilds the eye camera's matrix and drops you at the origin. Read `cam.matrixWorld` instead.
- **Texture paths:** load them relative to `location.href`, not `import.meta.url`. Vite rewrites the latter in dev.
- **Near and far planes:** the helicopter scene uses near 1 m and far 60 km. Underwater uses 0.05 m and 2000 m.
- **Testing without a headset:** use headless Playwright with `--use-gl=swiftshader`. For VR, inject IWER (`npm i iwer`; `addInitScript` its `build/iwer.min.js`, then `new IWER.XRDevice(IWER.metaQuest2).installRuntime({ forceInstall: true })`), click "Enter VR", aim `device.controllers.right` / `device.hands.right` (position + quaternion in rig space) and use `updateButtonValue('trigger', 1)` / `updatePinchValue(1)`.
- **Timers and swiftshader:** the frame `dt` is capped at 0.1 s, so time-critical things (like long presses) use `performance.now()`.
- **Narration:** `node tools/narration-lines.mjs > tools/lines.json`, then `python3 tools/tts-kokoro.py full af_heart solar-system public/audio/solar-system` (about 7 minutes on CPU).
