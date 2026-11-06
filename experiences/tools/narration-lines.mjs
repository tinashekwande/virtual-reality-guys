// Prints every narration line (both experiences) as JSON: { "solar-system": [[key, text]], "kelp-forest": [...] }
import { STOPS as SS, QUIZ as SQ } from '../solar-system/content.js'
import { STOPS as KS, QUIZ as KQ } from '../kelp-forest/content.js'
function lines(stops, quiz, intro, quizIntro, results) {
  const out = [['intro', intro]]
  for (const s of stops) { out.push([s.id, s.text.join(' ')]); out.push(['secret-' + s.id, s.secret]) }
  out.push(['quiz', `${quizIntro} ${quiz[0].q}`])
  quiz.slice(1).forEach((q, i) => out.push(['q' + (i + 2), q.q]))
  out.push(['result-perfect', results[0]], ['result-good', results[1]], ['result-try', results[2]])
  return out
}
const solar = lines(SS, SQ, 'Welcome, space explorer! Today we will visit the Sun and all eight planets. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.',
  "Great flying! Now let's see what you remember.", ['Perfect score! You are a real space expert!', 'Great job, explorer! You learned a lot today.', 'Good try! Fly the tour again to learn even more.'])
solar.push(['ringdive', "Welcome inside Saturn's rings! The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house. That giant ball beside you is Saturn. Look all around you!"])
solar.push(['cape', "This is Cape Town from seven kilometres up! Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet. To the right is False Bay, and far behind are the mountains of the Winelands."])
const kelp = lines(KS, KQ, 'Welcome, ocean explorer! We are going to dive into a giant kelp forest near Cape Town. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.',
  "Great diving! Now let's see what you remember.", ['Perfect score! You are a real ocean expert!', 'Great job, ocean explorer!', 'Good try! Dive again to learn even more.'])
console.log(JSON.stringify({ 'solar-system': solar, 'kelp-forest': kelp }))
