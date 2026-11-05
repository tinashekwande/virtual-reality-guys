// Plays recorded narration clips from <baseUrl><key>.mp3. The folder must contain clips.json listing the keys that
// have been recorded (e.g. ["intro", "sun"]). Missing clips are skipped; the text is always on screen anyway.

export function createNarration(baseUrl) {
  let current = null
  let enabled = true
  let available = new Set()
  fetch(baseUrl + 'clips.json')
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => (available = new Set(list)))
    .catch(() => {})

  return {
    play(key) {
      this.stop()
      if (!enabled || !available.has(key)) return
      const a = new Audio(`${baseUrl}${key}.mp3`)
      a.play().catch(() => {})
      current = a
    },
    stop() {
      if (current) { current.pause(); current = null }
    },
    setEnabled(on) {
      enabled = on
      if (!on) this.stop()
    },
  }
}
