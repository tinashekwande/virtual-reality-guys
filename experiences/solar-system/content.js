// Everything a teacher might want to edit: the stops of the tour, the quiz and every narration line.
// Distances and sizes in the 3D scene are for looking at, not to scale (see the note at the start of the tour).
//
// Curriculum: CAPS Natural Sciences and Technology, Grades 4-7, "Planet Earth and Beyond".
// Facts checked against NASA (science.nasa.gov, November 2026). Moon counts keep changing as new moons are
// confirmed, so they are given as "more than ...". South African spelling and number style (1 000, 5 500 °C).

export const STOPS = [
  {
    id: 'sun',
    name: 'The Sun',
    accent: '#fbbf24',
    text: [
      'The Sun is a star: a giant ball of hot, glowing gas. Everything in the solar system goes around it.',
      'It is about 109 Earths wide, and it holds almost all (99.8%) of the mass of the whole solar system.',
    ],
    secret: 'Its surface is about 5 500 °C, and light from the Sun takes about 8 minutes to reach Earth.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    accent: '#cbd5e1',
    text: [
      'Mercury is the smallest planet and the closest to the Sun. It has almost no air to hold heat in.',
      'Days reach 430 °C and nights drop to minus 180 °C. A year here is only 88 Earth days long.',
    ],
    secret: 'Its surface is covered in craters from space rocks crashing into it, just like our Moon.',
  },
  {
    id: 'venus',
    name: 'Venus',
    accent: '#fcd34d',
    text: [
      'Venus is wrapped in thick clouds that trap heat. That makes it the hottest planet, even hotter than Mercury.',
      'It also spins backwards compared to Earth, so on Venus the Sun rises in the west.',
    ],
    secret: 'It is about 467 °C on the surface: hot enough to melt lead!',
  },
  {
    id: 'earth',
    name: 'Earth',
    accent: '#60a5fa',
    text: [
      'This is home! Earth is the only planet we know of with life. About 71% of its surface is covered by ocean.',
      'It spins once a day and takes about 365 days to go around the Sun: one year. Earth has one Moon.',
    ],
    secret: 'See the pin? That is Cape Town, where you are right now! The lights on the dark side are cities at night.',
  },
  {
    id: 'mars',
    name: 'Mars',
    accent: '#fb923c',
    text: [
      'Mars is called the Red Planet because the iron in its dust and rocks has rusted.',
      'It has the biggest volcano in the solar system, Olympus Mons, and two tiny moons.',
    ],
    secret: 'Robots called rovers are exploring Mars right now, looking for signs of water and life from long ago.',
  },
  {
    id: 'belt',
    name: 'The Asteroid Belt',
    accent: '#e7b98a',
    text: [
      'Between Mars and Jupiter is the asteroid belt: millions of rocks left over from when the planets formed.',
      'It is a border. Inside it are the four small, rocky planets. Outside it are the four giant planets.',
    ],
    secret: 'That big round rock is Ceres, the biggest thing in the belt. It is a dwarf planet about 950 km wide.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    accent: '#f59e0b',
    text: [
      'Jupiter is the biggest planet: about 1 000 Earths could fit inside it! It is a gas giant with no solid ground.',
      'The Great Red Spot is a storm bigger than Earth. People have watched it for more than 300 years.',
    ],
    secret: 'Jupiter has more than 100 moons. You can see its four biggest moons circling it.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    accent: '#fde68a',
    text: [
      'Saturn is a gas giant famous for its rings. They are made of billions of pieces of ice and rock.',
      'Saturn is so light for its size that it could float in a giant bathtub of water!',
    ],
    secret: 'Saturn has well over 200 moons, more than any other planet. Its biggest, Titan, is wrapped in thick orange haze.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    accent: '#67e8f9',
    text: [
      'Uranus is an ice giant that is tipped over on its side, so it rolls around the Sun like a ball.',
      'It is freezing cold, and one trip around the Sun takes 84 Earth years.',
    ],
    secret: 'Its blue-green colour comes from methane gas, and it has 13 thin, faint rings.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    accent: '#818cf8',
    text: [
      'Neptune is an ice giant and the farthest planet from the Sun. Its winds blow at more than 2 000 km/h, the fastest of any planet.',
      'One year on Neptune is about 165 Earth years.',
    ],
    secret: 'Neptune was found using maths before anyone saw it through a telescope!',
  },
]

/** Which planets are which (for the inner and outer planets picture). */
export const INNER = ['mercury', 'venus', 'earth', 'mars']
export const OUTER = ['jupiter', 'saturn', 'uranus', 'neptune']

/**
 * The quiz (it matches the lesson's exit quiz). The answer positions are shuffled each time.
 * key: a short name used in the teacher's results. answer: index of the right option in this list.
 */
export const QUIZ = [
  { key: 'centre', q: 'What is at the centre of our solar system?', options: ['The Moon', 'The Sun', 'Jupiter', 'Earth'], answer: 1,
    why: 'The Sun is in the middle, and all the planets travel around it.' },
  { key: 'hottest', q: 'Which planet is the hottest?', options: ['Mercury', 'Mars', 'Venus', 'Neptune'], answer: 2,
    why: 'Venus has thick clouds that trap heat, so it is even hotter than Mercury.' },
  { key: 'mars-red', q: 'Why does Mars look red?', options: ['It is on fire', 'Rusty iron in its dust and rocks', 'It is close to the Sun', 'It is covered in lava'], answer: 1,
    why: 'The iron in the dust and rocks on Mars has rusted, and rust is red.' },
  { key: 'biggest', q: 'Which is the biggest planet?', options: ['Saturn', 'Earth', 'Jupiter', 'Uranus'], answer: 2,
    why: 'Jupiter is the biggest. About 1 000 Earths could fit inside it.' },
  { key: 'life', q: 'Which is the only planet we know has life?', options: ['Mars', 'Earth', 'Venus', 'Mercury'], answer: 1,
    why: 'So far, Earth is the only planet where we have found life.' },
  { key: 'order', q: 'Which planet comes after Earth, going out from the Sun?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 1,
    why: 'The order is Mercury, Venus, Earth, Mars, then Jupiter, Saturn, Uranus and Neptune.' },
  { key: 'inner', q: 'Which of these is a small, rocky inner planet?', options: ['Jupiter', 'Saturn', 'Mercury', 'Neptune'], answer: 2,
    why: 'Mercury, Venus, Earth and Mars are the rocky planets inside the asteroid belt. The others are giants.' },
  { key: 'daynight', q: 'What causes day and night?', options: ['Earth spinning on its axis', 'The Sun going around Earth', 'Clouds covering the Sun', 'The Moon blocking the Sun'], answer: 0,
    why: 'Earth spins once every 24 hours. The side facing the Sun has day, and the side facing away has night.' },
]

/** Day and night, and one year (the button at the Earth stop). */
export const DAYNIGHT = {
  day: {
    title: 'Day and night',
    text: ['Earth spins on a tilted line called its axis. The side facing the Sun has day; the other side has night.', 'The red pin is Cape Town. One whole spin takes 24 hours.'],
    say: [
      'Earth spins like a top on a tilted line called its axis. The side facing the Sun has day; the side facing away has night.',
      'Watch the red pin: that is Cape Town. One whole spin takes 24 hours: one day and one night.',
    ],
    footer: 'The Sun does not go around Earth: it only seems to move across the sky because Earth spins.',
  },
  year: {
    title: 'One year',
    text: ['Earth travels around the Sun once every 365 days: one year.', 'The tilt always points the same way, so in December our southern half leans towards the Sun: summer in Cape Town!'],
    say: [
      'While it spins, Earth also travels around the Sun. One whole trip takes about 365 days: one year.',
      'The tilt never changes, so in December the southern half of Earth leans towards the Sun. That is why Cape Town has summer in December.',
    ],
    footer: 'Seasons are not caused by distance: Earth is actually closest to the Sun in January!',
  },
}

/** Extra wow moments at some stops. */
export const MOMENTS = {
  sunSize: {
    button: 'How big is the Sun?',
    title: '109 Earths across!',
    text: ['About 109 Earths could fit in a line across the face of the Sun.', 'And about 1.3 million Earths could fit inside it!'],
  },
  spot: {
    button: 'See the Great Red Spot',
    title: 'The Great Red Spot',
    text: [
      'That giant reddish swirl is a storm, with winds of about 400 km/h. People have watched it for more than 300 years.',
      'The little blue ball beside it is Earth, drawn to the same size. The storm is wider than our whole planet!',
    ],
  },
  neptuneSun: {
    button: 'Look back at the Sun',
    title: 'The Sun from Neptune',
    text: ['That tiny bright star is our Sun! Neptune is 30 times farther away from it than Earth.', 'From here the Sun looks 30 times smaller and 900 times dimmer.'],
    say: [
      'That tiny bright star is our Sun! Neptune is 30 times farther from the Sun than Earth is.',
      'Here the Sun looks about 30 times narrower, and sunlight is about 900 times dimmer. Noon on Neptune would look like dim twilight to us.',
    ],
    footer: 'Noon on Neptune would look like dim twilight to us. Sunlight takes 4 hours to get here.',
  },
  scale: {
    button: 'Show real distances',
    title: 'The real distances',
    text: [
      'Now the planets are at their real distances apart. See how close the four rocky planets stay to the Sun, and how far out the giants are. Space is huge and mostly empty!',
      'The sizes are still made bigger so you can see them. At this scale the Sun would be about as big as a tennis ball, and Earth smaller than a grain of sand.',
    ],
    footer: 'The rest of the tour is not to scale: we moved the planets closer together so the trip is short.',
  },
}

const INTRO = 'Welcome, space explorer! Today we will visit the Sun, the asteroid belt and all eight planets. Point at a button and squeeze the trigger, or pinch your fingers, to choose it.'
const RESULTS = ['Perfect score! You are a real space expert!', 'Great job, explorer! You learned a lot today.', 'Good try! Fly the tour again to learn even more.']

/** Every narration clip: [file name (without .mp3), what is said]. Used to make the audio and the recording script. */
export const NARRATION = [
  ['intro', INTRO],
  ...STOPS.flatMap((s) => [[s.id, s.text.join(' ')], ['secret-' + s.id, s.secret]]),
  ['daynight-day', DAYNIGHT.day.say.join(' ')],
  ['daynight-year', DAYNIGHT.year.say.join(' ')],
  ['sun-size', MOMENTS.sunSize.text.join(' ')],
  ['jupiter-spot', 'See that giant reddish swirl? ' + MOMENTS.spot.text.join(' ')],
  ['neptune-sun', 'Look back towards home. ' + MOMENTS.neptuneSun.say.join(' ')],
  ['scale', 'Hold on! The planets are moving to their real distances. ' + MOMENTS.scale.text.join(' ')],
  ['quiz', `Great flying! Now let's see what you remember. ${QUIZ[0].q}`],
  ...QUIZ.slice(1).map((q, i) => ['q' + (i + 2), q.q]),
  ...QUIZ.map((q, i) => ['why' + (i + 1), q.why]),
  ['result-perfect', RESULTS[0]],
  ['result-good', RESULTS[1]],
  ['result-try', RESULTS[2]],
  ['ringdive', "Welcome inside Saturn's rings! The rings are made of billions of chunks of ice and rock, from tiny grains to pieces as big as a house. That giant ball beside you is Saturn. Look all around you!"],
  ['cape', "This is Cape Town from seven kilometres up! Straight ahead is Table Mountain, the flat-topped mountain, with Lion's Head beside it. The city of Cape Town sits at its feet. To the right is False Bay, and far behind are the mountains of the Winelands."],
]
