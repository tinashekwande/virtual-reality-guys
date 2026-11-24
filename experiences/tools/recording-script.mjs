// Writes RECORDING_SCRIPT.md: every narration line, in order, with the file name to save it as.
import { writeFileSync } from 'node:fs'
import { NARRATION as lines } from '../solar-system/content.js'

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
