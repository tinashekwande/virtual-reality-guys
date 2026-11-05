// Writes RECORDING_SCRIPT.md: every narration line, in order, with the file name to save it as.
import { writeFileSync } from 'node:fs'
import { STOPS, QUIZ } from '../solar-system/content.js'

const lines = [
  ['intro', 'Welcome, space explorer! Today we will visit the Sun and all eight planets. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.'],
]
for (const s of STOPS) {
  lines.push([s.id, s.text.join(' ')])
  lines.push(['secret-' + s.id, s.secret])
}
lines.push(['quiz', `Great flying! Now let's see what you remember. ${QUIZ[0].q}`])
QUIZ.slice(1).forEach((q, i) => lines.push(['q' + (i + 2), q.q]))
lines.push(['result-perfect', 'Perfect score! You are a real space expert!'])
lines.push(['result-good', 'Great job, explorer! You learned a lot today.'])
lines.push(['result-try', 'Good try! Fly the tour again to learn even more.'])

let md = `# Journey through the Solar System: narration recording script

Record each line as its own clip and name the file exactly as shown (MP3).
Tips: a quiet room, phone held about 20 cm away, speak slowly and warmly, like you're talking to a Grade 5 class.
Leave half a second of silence at the start and end. When the clips are ready, send them over and they'll be added to
\`experiences/public/audio/solar-system/\` with their names listed in \`clips.json\`.

| # | File | Say this |
|---|------|----------|
`
lines.forEach(([k, t], i) => (md += `| ${i + 1} | \`${k}.mp3\` | ${t.replace(/\|/g, '/')} |\n`))
writeFileSync(new URL('../solar-system/RECORDING_SCRIPT.md', import.meta.url), md)
console.log(lines.length, 'lines')
