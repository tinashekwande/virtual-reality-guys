import { QUIZ } from './solar-system/content.js'
import { loadSessions, clearSessions, mergeSessions, toCSV, fromCSV } from './solar-system/results-store.js'

const $ = (id) => document.getElementById(id)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const colour = (p) => (p >= 75 ? 'var(--good)' : p >= 50 ? 'var(--mid)' : 'var(--bad)')
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

function render() {
  const list = loadSessions().sort((a, b) => a.date.localeCompare(b.date))
  const n = list.length
  const avg = n ? list.reduce((t, s) => t + s.score / s.total, 0) / n : 0
  const avgSecrets = n ? list.reduce((t, s) => t + s.secrets, 0) / n : 0
  const avgTime = n ? list.reduce((t, s) => t + s.seconds, 0) / n : 0
  const learners = new Set(list.map((s) => s.learner).filter(Boolean)).size
  $('stats').innerHTML = [
    [n, 'sessions'],
    [learners, 'learner numbers'],
    [n ? `${Math.round(avg * 100)}%` : '–', `average score (out of ${QUIZ.length})`],
    [n ? avgSecrets.toFixed(1) : '–', 'secrets found (average)'],
    [n ? mmss(avgTime) : '–', 'time in VR (average)'],
  ].map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('')

  $('questions').innerHTML = QUIZ.map((q, i) => {
    const answered = list.filter((s) => s.answers && q.key in s.answers)
    const pct = answered.length ? Math.round((answered.filter((s) => s.answers[q.key]).length / answered.length) * 100) : null
    return `<div class="q"><span>${i + 1}. ${esc(q.q)} <span style="color:var(--muted)">(${esc(q.options[q.answer])})</span></span>
      <div class="bar"><i style="width:${pct ?? 0}%;background:${colour(pct ?? 0)}"></i></div><em>${pct === null ? '–' : pct + '%'}</em></div>`
  }).join('')

  $('sessions').innerHTML = n
    ? `<tr><th>Date</th><th>Learner</th><th>Score</th><th>Secrets</th><th>Time</th><th>Q1–Q${QUIZ.length}</th></tr>` +
      list.slice().reverse().map((s) => {
        const d = new Date(s.date)
        const ticks = QUIZ.map((q) => (s.answers && q.key in s.answers ? (s.answers[q.key] ? '<span class="ok">✓</span>' : '<span class="no">✗</span>') : '·')).join('')
        return `<tr><td>${d.toLocaleDateString('en-ZA')} ${d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</td><td>${s.learner ?? '–'}</td>
          <td><b style="color:${colour((s.score / s.total) * 100)}">${s.score}/${s.total}</b></td><td>${s.secrets}/${s.secretsTotal}</td><td>${mmss(s.seconds)}</td><td class="ticks">${ticks}</td></tr>`
      }).join('')
    : '<tr><td class="empty">No sessions yet. Results appear here after a learner finishes the quiz in the headset.</td></tr>'
  $('export').disabled = $('clear').disabled = !n
}

function flash(text) {
  $('msg').textContent = text
  setTimeout(() => ($('msg').textContent = ''), 4000)
}

$('export').addEventListener('click', () => {
  const blob = new Blob([toCSV(loadSessions(), QUIZ)], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `solar-system-results-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
})
$('import').addEventListener('change', async (e) => {
  let added = 0
  try {
    for (const f of e.target.files) added += mergeSessions(fromCSV(await f.text(), QUIZ))
    flash(`Added ${added} session${added === 1 ? '' : 's'}.`)
  } catch (err) {
    flash(err.message || 'Could not read that file.')
  }
  e.target.value = ''
  render()
})
$('clear').addEventListener('click', () => {
  if (!confirm('Delete all results on this device? Export a CSV first if you want to keep them.')) return
  clearSessions()
  render()
  flash('Class cleared.')
})
window.addEventListener('storage', render)
render()
