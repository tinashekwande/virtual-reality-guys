// Prints every narration line (both experiences) as JSON: { "solar-system": [[key, text]], "kelp-forest": [...] }
import { NARRATION as SOLAR } from '../solar-system/content.js'
import { STOPS as KS, QUIZ as KQ } from '../kelp-forest/content.js'
function lines(stops, quiz, intro, quizIntro, results) {
  const out = [['intro', intro]]
  for (const s of stops) { out.push([s.id, s.text.join(' ')]); out.push(['secret-' + s.id, s.secret]) }
  out.push(['quiz', `${quizIntro} ${quiz[0].q}`])
  quiz.slice(1).forEach((q, i) => out.push(['q' + (i + 2), q.q]))
  out.push(['result-perfect', results[0]], ['result-good', results[1]], ['result-try', results[2]])
  return out
}
const solar = SOLAR
const kelp = lines(KS, KQ, "Welcome, ocean explorer! You are in a helicopter, high above Cape Town. Look around. Can you find Table Mountain, Lion's Head, and the big white stadium? When you are ready, we will fly along the coast and dive into a giant kelp forest. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.",
  "Great diving! Now let's see what you remember.", ['Perfect score! You are a real ocean expert!', 'Great job, ocean explorer!', 'Good try! Dive again to learn even more.'])
console.log(JSON.stringify({ 'solar-system': solar, 'kelp-forest': kelp }))
