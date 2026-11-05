// All sound is synthesised in the browser (no audio files), so it works offline and costs nothing to load.
// Browsers only allow sound after the first tap/click, so call unlock() from a user action.

export function createAudio() {
  let ctx = null
  let master, musicBus, sfxBus, reverb
  let enabled = true
  let musicStarted = false

  function init() {
    if (ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(ctx.destination)
    reverb = ctx.createConvolver()
    reverb.buffer = impulse(3.2, 2.5)
    const wet = ctx.createGain()
    wet.gain.value = 0.55
    reverb.connect(wet).connect(master)
    musicBus = ctx.createGain()
    musicBus.gain.value = 0.0
    musicBus.connect(master)
    musicBus.connect(reverb)
    sfxBus = ctx.createGain()
    sfxBus.gain.value = 0.7
    sfxBus.connect(master)
    sfxBus.connect(reverb)
  }

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
    return buf
  }

  function noiseBuffer(seconds = 2) {
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  // ---- calm space music: slow evolving chords + soft "solar wind" ----
  function startMusic() {
    if (musicStarted || !ctx) return
    musicStarted = true
    const chords = [
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
      [110.0, 164.81, 246.94, 261.63], // Am(add9)
      [87.31, 174.61, 220.0, 329.63], // Fmaj7
      [98.0, 146.83, 246.94, 293.66], // G6
    ]
    const voices = chords[0].map(() => {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator()
      o1.type = 'sine'
      o2.type = 'triangle'
      o2.detune.value = 7
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 900
      const g = ctx.createGain()
      g.gain.value = 0.05
      o1.connect(f)
      o2.connect(f)
      f.connect(g).connect(musicBus)
      o1.start()
      o2.start()
      return { o1, o2, g }
    })
    let i = 0
    const step = () => {
      const now = ctx.currentTime
      chords[i % chords.length].forEach((freq, k) => {
        const v = voices[k]
        v.o1.frequency.setTargetAtTime(freq, now, 1.6)
        v.o2.frequency.setTargetAtTime(freq * 2, now, 1.6)
        v.g.gain.setTargetAtTime(0.035 + Math.random() * 0.03, now, 2)
      })
      i++
    }
    step()
    setInterval(step, 9000)
    // solar wind
    const n = ctx.createBufferSource()
    n.buffer = noiseBuffer(4)
    n.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 400
    bp.Q.value = 0.7
    const ng = ctx.createGain()
    ng.gain.value = 0.025
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 250
    lfo.connect(lfoGain).connect(bp.frequency)
    n.connect(bp).connect(ng).connect(musicBus)
    n.start()
    lfo.start()
    musicBus.gain.setTargetAtTime(enabled ? 1 : 0, ctx.currentTime, 3)
  }

  function tone(freq, { type = 'sine', start = 0, dur = 0.3, vol = 0.2, attack = 0.005, slideTo = null } = {}) {
    if (!ctx || !enabled) return
    const t = ctx.currentTime + start
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(sfxBus)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  const sfx = {
    click() { tone(880, { dur: 0.09, vol: 0.12 }); tone(1320, { start: 0.03, dur: 0.08, vol: 0.06 }) },
    whoosh() {
      if (!ctx || !enabled) return
      const t = ctx.currentTime
      const n = ctx.createBufferSource()
      n.buffer = noiseBuffer(1.4)
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.Q.value = 1.2
      f.frequency.setValueAtTime(180, t)
      f.frequency.exponentialRampToValueAtTime(2400, t + 0.45)
      f.frequency.exponentialRampToValueAtTime(220, t + 1.2)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.35, t + 0.3)
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.3)
      n.connect(f).connect(g).connect(sfxBus)
      n.start(t)
      n.stop(t + 1.4)
      tone(140, { type: 'sine', dur: 1.1, vol: 0.12, attack: 0.25, slideTo: 60 })
    },
    sparkle() {
      for (let i = 0; i < 9; i++) tone(1200 + Math.random() * 1800, { start: i * 0.06, dur: 0.4, vol: 0.07 })
      tone(523.25, { dur: 0.8, vol: 0.08, type: 'triangle' })
    },
    correct() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { start: i * 0.09, dur: 0.5, vol: 0.13, type: 'triangle' })) },
    wrong() { tone(311, { dur: 0.25, vol: 0.12, type: 'triangle' }); tone(233, { start: 0.18, dur: 0.4, vol: 0.12, type: 'triangle' }) },
    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
      notes.forEach((f, i) => tone(f, { start: i * 0.14, dur: i === notes.length - 1 ? 1.2 : 0.3, vol: 0.14, type: 'triangle' }))
      for (let i = 0; i < 12; i++) tone(1500 + Math.random() * 2000, { start: 0.8 + i * 0.05, dur: 0.5, vol: 0.05 })
    },
  }

  return {
    unlock() {
      init()
      if (ctx && ctx.state === 'suspended') ctx.resume()
      startMusic()
    },
    setEnabled(on) {
      enabled = on
      if (ctx) musicBus.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.5)
    },
    get enabled() { return enabled },
    get context() { return ctx },
    get output() { return master },
    sfx,
  }
}
