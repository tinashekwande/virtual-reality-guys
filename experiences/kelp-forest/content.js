// Stops, facts and quiz for "Dive into the Great African Seaforest". Teachers can edit the words here.
// x = how far along the dive (metres); you always look forward, along +x.

export const STOPS = [
  {
    id: 'surface', name: 'Into the sea', x: 0, depth: 2.6, accent: '#5eead4',
    text: [
      'Welcome to the Great African Seaforest! This underwater forest grows along the coast of Cape Town and up the west coast of Africa.',
      'Look up: you can see the sunlight shining through the waves.',
    ],
    secret: 'The water here is cold, often only 10 to 15 °C, because a cold ocean current flows up from the south. Kelp loves cold water.',
    target: 'fish', targetName: 'the fish',
  },
  {
    id: 'forest', name: 'The sea bamboo forest', x: 28, depth: 6.5, accent: '#facc15',
    text: [
      'These tall towers are sea bamboo, a giant kelp. Kelp is not a plant: it is a kind of seaweed, called algae.',
      'Each one grips the rock with a "holdfast". A bulb full of gas at the top floats it up towards the sunlight.',
    ],
    secret: 'Sea bamboo can grow more than 10 metres tall. Its stalk is hollow, like a straw.',
    target: 'fish', targetName: 'the fish',
  },
  {
    id: 'seals', name: 'Cape fur seals', x: 52, depth: 5, accent: '#fb923c',
    text: [
      'Here come the Cape fur seals! They twist and roll through the kelp hunting for fish and squid.',
      'They are mammals, so they breathe air and come back to the surface to breathe.',
    ],
    secret: 'Cape fur seals can dive deeper than 100 metres and hold their breath for several minutes.',
    target: 'seals', targetName: 'a seal',
  },
  {
    id: 'reef', name: 'The rocky reef', x: 76, floor: true, accent: '#f472b6',
    text: [
      'The rocks are covered in life: spiky purple sea urchins, colourful anemones, sponges and starfish.',
      'Anemones look like flowers, but they are animals that catch food with stinging tentacles.',
    ],
    secret: 'Baby abalone hide under the spines of sea urchins to stay safe from hungry fish!',
    target: 'urchins', targetName: 'the sea urchins',
  },
  {
    id: 'octopus', name: "The octopus's den", x: 98, floor: true, accent: '#f87171',
    text: [
      'Can you spot the octopus in its den? Octopuses are very clever. They hide in caves and use shells and rocks as armour.',
      "The film 'My Octopus Teacher' was made in a kelp forest just like this one, near Cape Town.",
    ],
    secret: 'An octopus has three hearts and blue blood, and it can change colour in less than a second!',
    target: 'octopus', targetName: 'the octopus',
  },
  {
    id: 'shysharks', name: 'Shy little sharks', x: 116, floor: true, accent: '#fbbf24',
    text: [
      'These small spotted sharks are puffadder shysharks. They only live in South Africa.',
      'Next to them is a striped pyjama shark, resting on the reef.',
    ],
    secret: 'When a shyshark is scared, it curls into a ring and covers its eyes with its tail, as if it is shy!',
    target: 'shysharks', targetName: 'a shyshark',
  },
  {
    id: 'sevengill', name: 'The sevengill shark', x: 134, floor: true, accent: '#94a3b8',
    text: [
      'A broadnose sevengill shark glides past. It can grow up to 3 metres long: longer than a grown-up lying down!',
      'Most sharks have five gill slits on each side to breathe. This one has seven.',
    ],
    secret: "Sevengill sharks visit the kelp forests of False Bay near Simon's Town. They belong to a very old family of sharks that lived in the time of the dinosaurs.",
    target: 'sevengill', targetName: 'the shark',
  },
]

export const QUIZ = [
  { q: 'What is kelp?', options: ['A tree', 'A kind of seaweed (algae)', 'A coral', 'A fish'], answer: 1 },
  { q: 'What keeps sea bamboo standing up towards the light?', options: ['Strong roots', 'A gas-filled bulb that floats', 'Fish holding it up', 'Wooden branches'], answer: 1 },
  { q: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Eight'], answer: 2 },
  { q: 'What does a shyshark do when it is scared?', options: ['Swims away very fast', 'Changes colour', 'Curls into a ring and covers its eyes', 'Puffs up like a balloon'], answer: 2 },
  { q: 'Why do Cape fur seals come back to the surface?', options: ['To breathe air', 'To sleep', 'To find kelp', 'To get warm'], answer: 0 },
]
