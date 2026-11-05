// Everything a teacher might want to edit: the stops of the tour and the quiz.
// Distances and sizes in the 3D scene are for looking at, not to scale (see the note at the start of the tour).

export const STOPS = [
  {
    id: 'sun',
    name: 'The Sun',
    accent: '#fbbf24',
    text: [
      'The Sun is a star: a giant ball of hot, glowing gas. Everything in the solar system goes around it.',
      'It is about 109 Earths wide, and it makes up almost all of the weight of the whole solar system.',
    ],
    fact: 'Fun fact: the surface is around 5 500 °C.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    accent: '#cbd5e1',
    text: [
      'Mercury is the closest planet to the Sun and the smallest. It has no air to hold heat in.',
      'Days are scorching hot and nights are freezing cold. A year here is only 88 Earth days long.',
    ],
    fact: 'Fun fact: its surface is covered in craters, like the Moon.',
  },
  {
    id: 'venus',
    name: 'Venus',
    accent: '#fcd34d',
    text: [
      'Venus is wrapped in thick clouds that trap heat. That makes it the hottest planet, even hotter than Mercury.',
      'It also spins backwards compared to most planets.',
    ],
    fact: 'Fun fact: it is about 465 °C on the surface.',
  },
  {
    id: 'earth',
    name: 'Earth',
    accent: '#60a5fa',
    text: [
      'This is home! Earth is the only planet we know of with life. About 70% of it is covered in water.',
      'It takes 365 days to go around the Sun, which is one year. Earth has one Moon.',
    ],
    fact: 'Look closely: can you see the white clouds moving?',
  },
  {
    id: 'mars',
    name: 'Mars',
    accent: '#fb923c',
    text: [
      'Mars is called the Red Planet because its dust and rocks contain iron that has rusted.',
      'It has the biggest volcano in the solar system, Olympus Mons, and two tiny moons.',
    ],
    fact: 'Fun fact: robots called rovers are exploring it right now.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    accent: '#f59e0b',
    text: [
      'Jupiter is the biggest planet. More than 1 000 Earths could fit inside it!',
      'It is a gas giant with no solid ground. The Great Red Spot is a storm bigger than Earth that has lasted for hundreds of years.',
    ],
    fact: 'Fun fact: Jupiter has more than 90 moons.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    accent: '#fde68a',
    text: [
      'Saturn is famous for its beautiful rings. They are made of billions of pieces of ice and rock.',
      'Saturn is so light for its size that it would float in a giant bathtub of water!',
    ],
    fact: 'Fun fact: Saturn has well over 100 moons.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    accent: '#67e8f9',
    text: [
      'Uranus is an ice giant that is tipped over on its side, so it rolls around the Sun like a ball.',
      'It is freezing cold, and one trip around the Sun takes 84 Earth years.',
    ],
    fact: 'Fun fact: its blue-green colour comes from methane gas.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    accent: '#818cf8',
    text: [
      'Neptune is the farthest planet from the Sun. It is dark, cold and very windy, with the fastest winds of any planet.',
      'One year on Neptune is about 165 Earth years.',
    ],
    fact: 'Fun fact: Neptune was found using maths before anyone saw it with a telescope.',
  },
]

export const QUIZ = [
  { q: 'What is at the centre of our solar system?', options: ['The Moon', 'The Sun', 'Jupiter', 'Earth'], answer: 1 },
  { q: 'Which planet is the hottest?', options: ['Mercury', 'Mars', 'Venus', 'Neptune'], answer: 2 },
  { q: 'Why does Mars look red?', options: ['It is on fire', 'Rusty iron in its dust and rocks', 'It is close to the Sun', 'It is covered in lava'], answer: 1 },
  { q: 'Which is the biggest planet?', options: ['Saturn', 'Earth', 'Jupiter', 'Uranus'], answer: 2 },
  { q: 'Which is the only planet we know has life?', options: ['Mars', 'Earth', 'Venus', 'Mercury'], answer: 1 },
]
