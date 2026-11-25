// Quiz results for the teacher, kept in this browser (localStorage). Each headset keeps its own list; the results
// page can export them as CSV and import CSV files from other headsets to see the whole class together.
// Only a learner number (1-40) is stored: no names or other personal information.

const KEY = 'vrg-solar-results-v1'
const TEACHER_KEY = 'vrg-solar-teacher-v1'

function read(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}

export function loadSessions() {
  const list = read(KEY, [])
  return Array.isArray(list) ? list : []
}

/** session: { learner, score, total, answers: { key: true|false }, secrets, secretsTotal, seconds, start } */
export function saveSession(session) {
  const s = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), date: new Date().toISOString(), ...session }
  const list = loadSessions()
  list.push(s)
  return write(KEY, list) ? s : null
}

export function clearSessions() { write(KEY, []) }

/** Add sessions (e.g. from another headset's CSV), skipping any already here. Returns how many were added. */
export function mergeSessions(incoming) {
  const list = loadSessions()
  const have = new Set(list.map((s) => s.id))
  let added = 0
  for (const s of incoming) if (s && s.id && !have.has(s.id)) { list.push(s); have.add(s.id); added++ }
  write(KEY, list)
  return added
}

export function loadTeacher() {
  return { on: false, start: 'sun', askNumber: true, ...read(TEACHER_KEY, {}) }
}
export function saveTeacher(t) { write(TEACHER_KEY, t) }

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

/** CSV with one row per session. quiz: the QUIZ list (for the question columns). */
export function toCSV(sessions, quiz) {
  const head = ['session_id', 'date', 'time', 'learner_number', 'score', 'out_of', 'percent', 'secrets_found', 'secrets_total', 'time_taken', 'seconds', 'started_at',
    ...quiz.map((q, i) => `Q${i + 1}_${q.key}`)]
  const rows = sessions.map((s) => {
    const d = new Date(s.date)
    const p2 = (n) => String(n).padStart(2, '0')
    return [s.id, `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`, `${p2(d.getHours())}:${p2(d.getMinutes())}`, s.learner ?? '', s.score, s.total,
      Math.round((s.score / s.total) * 100), s.secrets, s.secretsTotal, fmtTime(s.seconds), Math.round(s.seconds), s.start ?? '',
      ...quiz.map((q) => (s.answers && q.key in s.answers ? (s.answers[q.key] ? 1 : 0) : ''))]
  })
  return [head, ...rows].map((r) => r.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(',')).join('\r\n')
}

/** Read sessions back from a CSV made by toCSV (dates are rebuilt from the date and time columns). */
export function fromCSV(text, quiz) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim())
  if (!lines.length) return []
  const split = (l) => {
    const out = []
    let cur = '', q = false
    for (let i = 0; i < l.length; i++) {
      const ch = l[i]
      if (q) { if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++ } else if (ch === '"') q = false; else cur += ch }
      else if (ch === '"') q = true
      else if (ch === ',') { out.push(cur); cur = '' }
      else cur += ch
    }
    out.push(cur)
    return out
  }
  const head = split(lines[0])
  const col = (name) => head.indexOf(name)
  if (col('session_id') < 0) throw new Error('This is not a results file from this page.')
  return lines.slice(1).map((l) => {
    const r = split(l)
    const [yy, mm, dd] = (r[col('date')] || '').split('-').map(Number)
    const [hh, mi] = (r[col('time')] || '0:0').split(':').map(Number)
    const date = yy ? new Date(yy, mm - 1, dd, hh || 0, mi || 0) : new Date()
    const answers = {}
    quiz.forEach((q, i) => { const v = r[col(`Q${i + 1}_${q.key}`)]; if (v === '1' || v === '0') answers[q.key] = v === '1' })
    const n = (name) => Number(r[col(name)])
    return {
      id: r[col('session_id')], date: date.toISOString(), learner: r[col('learner_number')] ? n('learner_number') : null,
      score: n('score'), total: n('out_of'), secrets: n('secrets_found'), secretsTotal: n('secrets_total'), seconds: n('seconds'), start: r[col('started_at')] || null, answers,
    }
  })
}
