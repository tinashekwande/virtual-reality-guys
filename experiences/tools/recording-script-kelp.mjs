// Writes kelp-forest/RECORDING_SCRIPT.md: every narration line with the file name to save it as.
import { writeFileSync } from 'node:fs'
import { STOPS, QUIZ } from '../kelp-forest/content.js'
const lines = [['intro', 'Welcome, ocean explorer! We are going to dive into a giant kelp forest near Cape Town. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.']]
for (const s of STOPS) { lines.push([s.id, s.text.join(' ')]); lines.push(['secret-' + s.id, s.secret]) }
lines.push(['quiz', `Great diving! Now let's see what you remember. ${QUIZ[0].q}`])
QUIZ.slice(1).forEach((q, i) => lines.push(['q' + (i + 2), q.q]))
lines.push(['result-perfect', 'Perfect score! You are a real ocean expert!'], ['result-good', 'Great job, ocean explorer!'], ['result-try', 'Good try! Dive again to learn even more.'])
let md = `# Dive into the Great African Seaforest: narration recording script

Record each line as its own clip and name the file exactly as shown (MP3). Quiet room, phone about 20 cm away,
slow and warm, like talking to a Grade 5 class. Clips go in \`experiences/public/audio/kelp-forest/\` and their
names are listed in \`clips.json\` there.

| # | File | Say this |
|---|------|----------|
`
lines.forEach(([k, t], i) => (md += `| ${i + 1} | \`${k}.mp3\` | ${t.replace(/\|/g, '/')} |\n`))
writeFileSync(new URL('../kelp-forest/RECORDING_SCRIPT.md', import.meta.url), md)
console.log(lines.length, 'lines')
