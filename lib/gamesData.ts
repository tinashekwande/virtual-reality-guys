export interface Game {
  id: string;
  title: string;
  category: string;
  suitability: string;
  shortDesc: string;
  longDesc: string;
  difficulty: number;
  tags: string[];
  playStyle: string;
  actionType: string;
  image: string;
  developer?: string;
  publisher?: string;
  comfortRating?: string;
  controllers?: string;
  spaceRequired?: string;
  playerMode?: string;
  features?: string[];
  galleryImages?: string[];
}

export const gamesData: Game[] = [
  // 1. Horror Experiences
  {
    id: "richies-plank",
    title: "Richie's Plank Experience",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Walk a thin plank 80 stories high and face your fear of heights.",
    longDesc: "Richie's Plank Experience is a psychological thrill ride. Placed 80 stories above the ground, walk a narrow wooden plank and decide if you have the nerve to step off. It is designed to evoke strong physiological reactions, making it the perfect showcase for the power of immersive virtual reality. Includes multiple secondary modes such as superhero flying academy, firefighting simulators, and writing tools.",
    difficulty: 4,
    tags: ["Thrill", "Heights", "Short Play", "Immersive"],
    playStyle: "Standing/Room-Scale",
    actionType: "Simulation",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/517160/header.jpg",
    developer: "Toast Interactive",
    publisher: "Toast Interactive",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "1.8 GB",
    playerMode: "Single User",
    features: [
      "Real-world plank setup integration",
      "Stomach-dropping height simulation",
      "Superhero flight mode",
      "Firefighting mini-missions",
      "Skybrush skywriting tool"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "sleep-watch",
    title: "Sleep Watch",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Stay alert and survive the horrors lurking in the dark.",
    longDesc: "Sleep Watch places you in a dark and eerie environment where survival depends on your alertness and quick thinking. You must monitor multiple security cameras, check the hallway shadows, and keep your composure as tension rises in this sleep paralysis horror simulation.",
    difficulty: 4,
    tags: ["Survival", "Suspense", "Jump Scares", "Dark"],
    playStyle: "Sitting/Standing",
    actionType: "Survival Horror",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
    developer: "Cyberia Studios",
    publisher: "Cyberia Studios",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "1.2 GB",
    playerMode: "Single User",
    features: [
      "Real-time security monitor feed",
      "Heart-rate monitoring mechanics",
      "Randomized horror triggers",
      "Light and sound navigation puzzles"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "face-your-fears",
    title: "Face Your Fears",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Confront your deepest fears in spine-chilling scenarios.",
    longDesc: "Face Your Fears exposes you to common phobias and horror scenarios in full 360-degree immersion. From haunted houses to heights and paranormal entities, this experience is designed to test your limits and get your adrenaline pumping.",
    difficulty: 5,
    tags: ["Atmospheric", "Spooky", "Short Play", "Jump Scares"],
    playStyle: "Sitting",
    actionType: "Interactive Experience",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    developer: "Turtle Rock Studios",
    publisher: "Warner Bros. Interactive",
    comfortRating: "Intense",
    controllers: "Gaze/Touch Controllers",
    spaceRequired: "3.5 GB",
    playerMode: "Single User",
    features: [
      "Multi-sensory phobia modules",
      "Haunted children's bedroom module",
      "Giant skyscraper attack module",
      "Deep-sea ghost ship experience"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "cursed-night-house",
    title: "Cursed Night – The House",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Explore a haunted house and escape its cursed entities.",
    longDesc: "Cursed Night: The House is a narrative-driven horror game where you explore a derelict, cursed mansion. Solve basic puzzles, find clues, and evade the malevolent spirits that haunt the corridors before it is too late.",
    difficulty: 4,
    tags: ["Exploration", "Puzzle", "Escape Room", "Spooky"],
    playStyle: "Standing/Room-Scale",
    actionType: "Exploration Horror",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1740570/header.jpg",
    developer: "Red Soul Games",
    publisher: "Red Soul Games",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "4.0 GB",
    playerMode: "Single User",
    features: [
      "Physics-based puzzle objects",
      "Ambient lighting toggle mechanics",
      "3D spatial audio whispers",
      "Lock-and-key room locks"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "z-show",
    title: "Z-Show",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Survive a deadly zombie-infested television game show.",
    longDesc: "Z-Show casts you as a contestant in an apocalyptic, dystopian game show where the prize is your life. Face waves of zombies, activate environmental traps, and entertain the audience to secure supply drops in this high-tension horror shootout.",
    difficulty: 4,
    tags: ["Zombies", "Survival", "Action", "Arena"],
    playStyle: "Standing",
    actionType: "Zombie Combat",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    developer: "Pixelity Games",
    publisher: "Pixelity Games",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "2.1 GB",
    playerMode: "Single User",
    features: [
      "Dystopian arena game show layout",
      "Crowd noise feedback audio loop",
      "Interactive stage environmental traps",
      "High-score wave multiplier tracker"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1601513525393-832777b9bb7a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "cursed-echoes",
    title: "Cursed Echoes",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Investigate whispering ruins and piece together cursed histories.",
    longDesc: "Cursed Echoes is a psychological thriller that relies on spatial audio. Navigate shifting dark corridors, solve auditory puzzles, and avoid spectral entities that react to every sound you make in the real world.",
    difficulty: 4,
    tags: ["Audio-focus", "Mystery", "Atmospheric", "Spooky"],
    playStyle: "Standing/Room-Scale",
    actionType: "Psychological Horror",
    image: "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=600&q=80",
    developer: "Soundscape VR",
    publisher: "Soundscape VR",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.8 GB",
    playerMode: "Single User",
    features: [
      "Acoustic-guided gameplay",
      "Spatial echo-location scanners",
      "Shifting non-euclidean labyrinth",
      "Microphone audio feedback detection"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "descending",
    title: "Descending",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Descend into dark caverns with only a flashlight and your wits.",
    longDesc: "Descending puts you in the shoes of a deep cave explorer. As your ropes break, you find yourself trapped in an ancient, uncharted cavern system. Explore narrow tunnels, manage your oxygen, and discover what lurks in the absolute dark.",
    difficulty: 5,
    tags: ["Caves", "Exploration", "Survival", "Claustrophobic"],
    playStyle: "Standing/Room-Scale",
    actionType: "Survival Horror",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80",
    developer: "Vertigo Games",
    publisher: "Vertigo Games",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "5.2 GB",
    playerMode: "Single User",
    features: [
      "Rappelling and rock climbing physics",
      "Realistic flashlight battery mechanics",
      "Cave-in survival navigation scenarios",
      "Mysterious runic text decryption"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "panic-room-mr",
    title: "Panic Room MR",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Transform your actual room into a haunted mixed reality escape game.",
    longDesc: "Panic Room MR uses advanced pass-through mixed reality. Watch as ghosts break through your physical walls and haunted objects float in your living room. Solve clues anchored in your physical space to escape the curse.",
    difficulty: 4,
    tags: ["Mixed Reality", "Escape Room", "Interactive", "Spooky"],
    playStyle: "Room-Scale",
    actionType: "Mixed Reality Escape",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80",
    developer: "Resolution Games",
    publisher: "Resolution Games",
    comfortRating: "Comfortable",
    controllers: "Hand Tracking / Touch",
    spaceRequired: "900 MB",
    playerMode: "Single User / Co-op",
    features: [
      "Pass-through room mesh boundaries",
      "Anchored holographic props",
      "Furniture collider recognition",
      "Local multiplayer escape cooperation"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 2. Fighting & Action Games
  {
    id: "ninja-legends",
    title: "Ninja Legends",
    category: "Fighting & Action Games",
    suitability: "Ages 10+",
    shortDesc: "Wield dual katanas and slice through waves of ninja enemies.",
    longDesc: "Ninja Legends is an action-heavy combat game where you face waves of skilled enemies using a wide variety of ninja weaponry. Deflect arrows, block attacks, and unleash powerful shadow attacks in high-paced physical melee combat.",
    difficulty: 3,
    tags: ["Melee", "Swordplay", "Active", "Combat"],
    playStyle: "Standing/Room-Scale",
    actionType: "Action Combat",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1080750/header.jpg",
    developer: "Coinflip Studios",
    publisher: "Coinflip Studios",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "3.2 GB",
    playerMode: "Single User",
    features: [
      "18 weapons (Katanas, claws, bow)",
      "Real-time deflection and parrying",
      "Sword slice physics system",
      "Slow-motion cinematic execution states"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "creed-rise-glory",
    title: "Creed",
    category: "Fighting & Action Games",
    suitability: "Ages 10+",
    shortDesc: "Step into the boxing ring and fight your way to the top.",
    longDesc: "Creed (Rise to Glory) lets you train under Rocky Balboa and fight against legendary boxers. Features responsive boxing physics, stamina-draining physical movement, and multiplayer matches that test your endurance and boxing skills.",
    difficulty: 4,
    tags: ["Sports", "Boxing", "Active", "Simulation"],
    playStyle: "Standing",
    actionType: "Active Boxing",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945980/header.jpg",
    developer: "Survios",
    publisher: "Survios",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "4.5 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Phantom Melee fatigue mechanic",
      "Rocky Balboa training gyms",
      "Championship campaign mode",
      "Cross-platform PvP boxing matches"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "100-day-siege",
    title: "100 Day Siege",
    category: "Fighting & Action Games",
    suitability: "Ages 10+",
    shortDesc: "Defend your castle gates against waves of fantasy armies.",
    longDesc: "100 Day Siege is a tactical defensive combat game. Position archers, pour boiling oil, and step onto the ramparts with your broadsword to defend your kingdom's final outpost against giants, orcs, and siege engines.",
    difficulty: 3,
    tags: ["Defensive", "Combat", "Tactical", "Medieval"],
    playStyle: "Standing",
    actionType: "Castle Defense",
    image: "https://images.unsplash.com/photo-1533228894184-754f91165a2d?auto=format&fit=crop&w=600&q=80",
    developer: "Skydance Interactive",
    publisher: "Skydance Interactive",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "2.8 GB",
    playerMode: "Single User",
    features: [
      "Rampart archer post setup",
      "Physical archery mechanics",
      "Boiling oil kettle physics triggers",
      "Multi-stage fantasy wave sieges"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1533228894184-754f91165a2d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "legacy-awake",
    title: "Legacy Awake",
    category: "Fighting & Action Games",
    suitability: "Ages 10+",
    shortDesc: "Embark on an epic fantasy quest to awaken ancient guardians.",
    longDesc: "Legacy Awake places you in a stunning high-fantasy realm. Solve puzzle gates, learn spells, and fight colossal guardians using magical shields and swords to bring light back to a forgotten kingdom.",
    difficulty: 3,
    tags: ["Fantasy", "Spells", "Adventure", "Combat"],
    playStyle: "Standing/Room-Scale",
    actionType: "Fantasy Action",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    developer: "Polyarc Games",
    publisher: "Polyarc Games",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "3.6 GB",
    playerMode: "Single User",
    features: [
      "Hand gesture casting mechanics",
      "Ancient puzzle portal structures",
      "Titan climbing combat battles",
      "High-fidelity high-fantasy art direction"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 3. Driving & Racing Simulation
  {
    id: "just-drive",
    title: "Just Drive",
    category: "Driving & Racing Simulation",
    suitability: "All Ages",
    shortDesc: "Take the wheel and enjoy a relaxing or thrilling drive.",
    longDesc: "Just Drive is an open-road driving experience focused on realism and chill driving vibes. Choose from sports cars to trucks, explore scenic highways, and master vehicle handling in realistic weather and traffic conditions.",
    difficulty: 2,
    tags: ["Simulation", "Driving", "Scenic", "Relaxing"],
    playStyle: "Sitting",
    actionType: "Driving Simulation",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80",
    developer: "Sector3 Studios",
    publisher: "Sector3 Studios",
    comfortRating: "Moderate",
    controllers: "Steering Wheel/Touch",
    spaceRequired: "6.0 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Fully interactive dashboard dials",
      "Live weather & daylight cycles",
      "Interactive steering and gears",
      "Intelligent road traffic AI"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1560855814-114afabdfa20?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "car-parking-sim",
    title: "Car Parking Simulator",
    category: "Driving & Racing Simulation",
    suitability: "All Ages",
    shortDesc: "Master the art of parking in various realistic challenges.",
    longDesc: "Car Parking Simulator tests your driving precision. Learn parallel parking, reverse parking, and navigate tight spaces across multiple realistic vehicle types, complete with virtual mirrors, steering wheel controls, and parking sensors.",
    difficulty: 3,
    tags: ["Skill-based", "Driving", "Precision", "Relaxing"],
    playStyle: "Sitting",
    actionType: "Precision Simulation",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1324410/header.jpg",
    developer: "Aviary Games",
    publisher: "Aviary Games",
    comfortRating: "Comfortable",
    controllers: "Touch/Steering Wheel",
    spaceRequired: "1.2 GB",
    playerMode: "Single User",
    features: [
      "Functional vehicle side mirrors",
      "Audio-assist parking sensors",
      "100+ precision driving puzzles",
      "Interactive physics gear shifting"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "speed-racer",
    title: "Speed Racer",
    category: "Driving & Racing Simulation",
    suitability: "All Ages",
    shortDesc: "Race at breakneck speeds down futuristic, looping tracks.",
    longDesc: "Speed Racer is a high-speed arcade racing simulator. Grip the steering wheel and speed down gravity-defying vertical loops, boost pads, and drift corners against competitive AI in a neon-drenched skyway.",
    difficulty: 3,
    tags: ["Speed", "Racing", "Arcade", "Thrill"],
    playStyle: "Sitting",
    actionType: "Arcade Racing",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    developer: "Codemasters",
    publisher: "Codemasters",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "4.5 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Vertical gravity-defying tracks",
      "Drifting speed boost multiplier",
      "Sky-high vertical loops",
      "Immersive dashboard cockpit HUD"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1560855814-114afabdfa20?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "z-race",
    title: "Z Race",
    category: "Driving & Racing Simulation",
    suitability: "All Ages",
    shortDesc: "Pilot futuristic hovercrafts in zero-gravity racing leagues.",
    longDesc: "Z Race is a fresh hovercraft racing game. Fly through rings, collect boosts, and maneuver through zero-gravity tunnels. Features high visual fidelity and responsive flight controls tailored for VR cockpits.",
    difficulty: 4,
    tags: ["Sci-Fi", "Zero-G", "Racing", "Futuristic"],
    playStyle: "Sitting",
    actionType: "Hovercraft Racing",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1348750/header.jpg",
    developer: "XOCUS",
    publisher: "XOCUS",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "3.0 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Zero-gravity flight mechanics",
      "Vibrant cybernetic space tracks",
      "Speed gate acceleration rings",
      "Global leaderboard time trials"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1560855814-114afabdfa20?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "formula-x",
    title: "Formula X",
    category: "Driving & Racing Simulation",
    suitability: "Teens & Adults",
    shortDesc: "Experience the speed and G-forces of professional F1 track racing.",
    longDesc: "Formula X brings F1 simulation to VR. Complete with tire management, pit stops, and realistic steering feedback, race on world-famous circuits and shave milliseconds off your lap time in search of the podium.",
    difficulty: 4,
    tags: ["Formula", "Simulation", "Tracks", "Precision"],
    playStyle: "Sitting",
    actionType: "F1 Racing Sim",
    image: "https://images.unsplash.com/photo-1560855814-114afabdfa20?auto=format&fit=crop&w=600&q=80",
    developer: "Kunos Simulazioni",
    publisher: "Kunos Simulazioni",
    comfortRating: "Moderate",
    controllers: "Steering Wheel/Touch",
    spaceRequired: "8.0 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Live telemetry dash stats",
      "Dynamic tire degradation & pits",
      "Force-feedback steering integration",
      "Laser-scanned real world track maps"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1560855814-114afabdfa20?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "bus-parking-vr",
    title: "Bus Parking VR",
    category: "Driving & Racing Simulation",
    suitability: "All Ages",
    shortDesc: "Steer and park double-decker buses in heavy city traffic.",
    longDesc: "Bus Parking VR elevates the parking simulator genre. Manage the massive turn radius of city buses, watch your mirrors, avoid pedestrians, and slide into narrow terminal bays in structured parking scenarios.",
    difficulty: 4,
    tags: ["Bus", "Parking", "Heavy Vehicle", "Precision"],
    playStyle: "Sitting",
    actionType: "Parking Simulator",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    developer: "SimuGames",
    publisher: "SimuGames",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.8 GB",
    playerMode: "Single User",
    features: [
      "Detailed bus cockpit instruments",
      "Platform passenger alignment markers",
      "Integrated rearview mirror cameras",
      "Multiple articulated vehicle chassis"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 4. Adventure & Thrill Rides
  {
    id: "rollercoasters-coastal",
    title: "Roller Coasters / Coastal Combat",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Experience roller coaster loops and futuristic air-battles.",
    longDesc: "Roller Coasters / Coastal Combat blends two extreme experiences. First, enjoy breathtaking, stomach-dropping loops on virtual coasters. Then, fly a combat jet over beautiful coastal landscapes, dogfighting enemy fighters in full 3D space.",
    difficulty: 4,
    tags: ["Thrill", "Rollercoaster", "Flight", "Speed"],
    playStyle: "Sitting",
    actionType: "Thrill Ride",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    developer: "Coaster Games",
    publisher: "Coaster Games",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "3.0 GB",
    playerMode: "Single User",
    features: [
      "Desert canyon and city-scape coaster runs",
      "Interactive military flight cockpit",
      "Weapon tracking laser targeters",
      "Physiological stomach-drop curves"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "ocean-rift",
    title: "Ocean Rift",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Explore a beautiful aquatic world and swim with sharks.",
    longDesc: "Ocean Rift is the world's first VR aquatic safari park. Explore a vibrant underwater world containing sharks, dolphins, whales, and pre-historic sea creatures. Visit different environments from shallow coral reefs to the deep, dark ocean abyss.",
    difficulty: 1,
    tags: ["Nature", "Relaxing", "Exploration", "Education"],
    playStyle: "Sitting/Standing",
    actionType: "Aquatic Safari",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/422760/header.jpg",
    developer: "Llyr Ap Cenydd",
    publisher: "Llyr Ap Cenydd",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.4 GB",
    playerMode: "Single User",
    features: [
      "14 detailed underwater biomes",
      "AI-driven predator/prey behavior",
      "Educational narrative guides",
      "Interactive whale and turtle feed prompts"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "deepwater",
    title: "Deepwater",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Pilot a deep-sea submersible and explore shipwrecks and thermal vents.",
    longDesc: "Deepwater puts you inside a high-tech submarine research vessel. Descend to the Mariana Trench, guide robotic claws to collect deep-sea flora, and illuminate mysterious trenches filled with glowing bioluminescent life.",
    difficulty: 2,
    tags: ["Submarine", "Deep-sea", "Nature", "Relaxing"],
    playStyle: "Sitting",
    actionType: "Aquatic Exploration",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    developer: "SubSoft",
    publisher: "SubSoft",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.1 GB",
    playerMode: "Single User",
    features: [
      "Glass-dome cockpit navigation",
      "Hydrodynamic grabber claw controls",
      "Fauna photography collection logs",
      "High-power spotlight pathfinder system"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "escape-room",
    title: "Escape Room",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Solve environmental puzzles to escape locked rooms under pressure.",
    longDesc: "Escape Room VR presents multiple themed rooms: an ancient Pharaoh's tomb, a high-tech hacker den, and a mad scientist's lab. Work together or race the clock, uncovering hidden keys and deciphering cryptographic codes.",
    difficulty: 3,
    tags: ["Puzzles", "Escape", "Co-op", "Brain"],
    playStyle: "Standing/Room-Scale",
    actionType: "Puzzle Adventure",
    image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=600&q=80",
    developer: "Fireproof Games",
    publisher: "Fireproof Games",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.6 GB",
    playerMode: "Single User / Co-op",
    features: [
      "Multi-stage escape theme rooms",
      "Physics dials, keys, and gears",
      "Interactive puzzle clue journals",
      "Timer-based challenge modes"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "coaster-combat",
    title: "Coaster Combat",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Shoot targets and dodge obstacles while riding extreme rollercoasters.",
    longDesc: "Coaster Combat turns the classic rollercoaster into an active shooting gallery. Wield dual laser blasters, shoot glowing targets along the rails, lean physical left and right to dodge obstacles, and beat the high score.",
    difficulty: 3,
    tags: ["Rollercoaster", "Shooter", "Active", "Thrill"],
    playStyle: "Sitting",
    actionType: "Rollercoaster Shooter",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    developer: "Force Field",
    publisher: "Force Field",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "1.5 GB",
    playerMode: "Single User",
    features: [
      "Fast-paced rail shooter targeting",
      "Dual rapid-fire neon blasters",
      "Lean-to-dodge obstacle mechanics",
      "Dynamic scoreboard combos and multipliers"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "park",
    title: "Park",
    category: "Adventure & Thrill Rides",
    suitability: "All Ages",
    shortDesc: "Walk through prehistoric valleys and interact with dinosaurs.",
    longDesc: "Park takes you on a safari through a lush prehistoric reserve. Stand face-to-face with a towering Brachiosaurus, feed a baby Triceratops, and escape a Tyrannosaurus Rex in a thrilling, cinematic safari loop.",
    difficulty: 1,
    tags: ["Dinosaurs", "Safari", "Nature", "Cinematic"],
    playStyle: "Sitting/Standing",
    actionType: "Nature Safari",
    image: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80",
    developer: "Jurassic VR",
    publisher: "Jurassic VR",
    comfortRating: "Comfortable",
    controllers: "Gaze/Touch Controllers",
    spaceRequired: "4.1 GB",
    playerMode: "Single User",
    features: [
      "Life-size dinosaur encounter zones",
      "Detailed foliage and terrain physics",
      "Prehistoric reserve truck trail ride",
      "Wildlife snapshot photo log rewards"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 5. Shooting Games
  {
    id: "space-pirate",
    title: "Space Pirate Trainer",
    category: "Shooting Games",
    suitability: "Ages 12+",
    shortDesc: "Defend yourself against swarms of incoming space drones.",
    longDesc: "Space Pirate Trainer is the official trainer for wannabe space pirates. Fire your blasters, deflect lasers with a energy shield, and dodge incoming fire in slow motion in this arcade-style score-chasing shootout.",
    difficulty: 3,
    tags: ["Sci-Fi", "Shooter", "Active", "Arcade"],
    playStyle: "Standing/Room-Scale",
    actionType: "Wave Shooter",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/418650/header.jpg",
    developer: "I-Illusions",
    publisher: "I-Illusions",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.6 GB",
    playerMode: "Single User / Arena",
    features: [
      "6 weapon types (lasers, rails, ropes)",
      "Physical mirror reflection shields",
      "Bullet-time slowdown drone dodges",
      "Global leaderboards score tracking"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "repossessed-zombie",
    title: "Repossessed",
    category: "Shooting Games",
    suitability: "Ages 12+",
    shortDesc: "Fight for survival against hordes of terrifying zombies.",
    longDesc: "Repossessed is an intense arcade zombie shooter. Armed with pistols, shotguns, and rifles, defend your position as hordes of infected rush at you. Quick reloading, steady aim, and spatial awareness are critical to survival.",
    difficulty: 4,
    tags: ["Zombies", "Shooter", "Scary", "Action"],
    playStyle: "Standing",
    actionType: "Zombie Survival",
    image: "https://images.unsplash.com/photo-1601513525393-832777b9bb7a?auto=format&fit=crop&w=600&q=80",
    developer: "Indie Devs",
    publisher: "Indie Devs",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "2.0 GB",
    playerMode: "Single User",
    features: [
      "Tactical reloading physics models",
      "Shotgun slide pumps",
      "Fortified window wave blockers",
      "Flashlight directional darkness overlay"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1601513525393-832777b9bb7a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "anshar-2",
    title: "Anshar 2",
    category: "Shooting Games",
    suitability: "Ages 10+",
    shortDesc: "Pilot a space fighter jet in fast-paced sci-fi dogfights.",
    longDesc: "Anshar 2: Hyperdrive puts you inside the cockpit of a fighter starship. Loop, barrel-roll, and lock missiles onto enemy fleets across deep space, asteroid fields, and planetary surfaces in full 3D dogfights.",
    difficulty: 4,
    tags: ["Space", "Flight", "Jet", "Sci-Fi"],
    playStyle: "Sitting/Standing",
    actionType: "Space Dogfight",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1579730/header.jpg",
    developer: "OZWE Games",
    publisher: "OZWE Games",
    comfortRating: "Moderate",
    controllers: "Touch Controllers / Gamepad",
    spaceRequired: "2.2 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Dynamic 3rd-person & cockpit cams",
      "Multi-lock missile targeting arrays",
      "Full 360 space debris battle rings",
      "10-stage cinematic mission campaign"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "spatial-web-shooter",
    title: "Spatial Web Shooter",
    category: "Shooting Games",
    suitability: "Ages 8+",
    shortDesc: "Shoot cyber-webs to trap and capture waves of robot spider drones.",
    longDesc: "Spatial Web Shooter is a high-tech arcade shootout. Launch electrical, sticky cybernetic webs from your wrists to tie up and disable mechanical spiders climbing up your physical space walls.",
    difficulty: 2,
    tags: ["Active", "Robots", "Sci-Fi", "Score-chase"],
    playStyle: "Standing/Room-Scale",
    actionType: "Target Shooter",
    image: "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=600&q=80",
    developer: "WebTech",
    publisher: "WebTech",
    comfortRating: "Comfortable",
    controllers: "Hand Tracking / Touch",
    spaceRequired: "950 MB",
    playerMode: "Single User",
    features: [
      "Flick-wrist sticky web casting",
      "Physics-tension line pull",
      "Fracturing mechanical spider parts",
      "Automated laser sight assists"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "bodycam-unrecord",
    title: "Bodycam Unrecord",
    category: "Shooting Games",
    suitability: "Teens & Adults",
    shortDesc: "Experience ultra-realistic tactical military combat via a bodycam lens.",
    longDesc: "Bodycam Unrecord is a tactical shooter focused on realism. Moving through deserted industrial complexes, reload realistic weapons, lean around corners, and communicate with your squad using real bodycam angles.",
    difficulty: 5,
    tags: ["Realism", "Tactical", "Military", "Co-op"],
    playStyle: "Standing/Room-Scale",
    actionType: "Tactical Shooter",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=600&q=80",
    developer: "Tactical Games",
    publisher: "Tactical Games",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "6.2 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Bodycam style visual filters",
      "Manual tactical weapon reloads",
      "S.W.A.T squad briefing modes",
      "Directional spatial audio alerts"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1601513525393-832777b9bb7a?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "pistol-whip",
    title: "Pistol Whip",
    category: "Shooting Games",
    suitability: "Ages 12+",
    shortDesc: "Shoot and dodge obstacles to the beat in an action rhythm game.",
    longDesc: "Pistol Whip is an action-movie rhythm shooter. Shoot, dodge, and melee through a colorful cinematic dreamscape, synchronizing your physical movements to the thumping electronic soundtrack to maximize score multiplier.",
    difficulty: 4,
    tags: ["Rhythm", "Music", "Active", "Shooter"],
    playStyle: "Standing",
    actionType: "Rhythm Shooter",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1079800/header.jpg",
    developer: "Cloudhead Games",
    publisher: "Cloudhead Games",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "3.0 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Tempo-synchronized shooting points",
      "Action-movie style narrative campaigns",
      "Weapon configurations and skin sets",
      "Active fitness cardio tracking"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 6. Sports & Fitness
  {
    id: "beat-saber",
    title: "Beat Saber",
    category: "Sports & Fitness",
    suitability: "All Ages",
    shortDesc: "Slash glowing neon cubes to the rhythm of high-energy music.",
    longDesc: "Beat Saber is a global rhythm sensation. Slice neon-colored cubes representing musical beats using dual laser sabers. Avoid walls, duck under obstacles, and move your body to hit the perfect combo in an immersive neon world.",
    difficulty: 3,
    tags: ["Rhythm", "Music", "Active", "Fitness"],
    playStyle: "Standing",
    actionType: "Rhythm Action",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg",
    developer: "Beat Games",
    publisher: "Meta Quest Studios",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.2 GB",
    playerMode: "Single User / Multiplayer",
    features: [
      "Dual color light sabers physics",
      "360-degree immersive speaker tracks",
      "Custom beatmaps editor tool",
      "Active cardio fitness tracker dashboard"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "motion-soccer-pro",
    title: "Motion Soccer Pro",
    category: "Sports & Fitness",
    suitability: "All Ages",
    shortDesc: "Show off your soccer skills as a striker or goalkeeper in VR.",
    longDesc: "Motion Soccer Pro brings the football pitch directly to you. Step up as the striker to score free kicks, or put on goalie gloves to block incoming balls in real-time. Fun, physical, and competitive soccer challenges.",
    difficulty: 2,
    tags: ["Sports", "Soccer", "Active", "Fun"],
    playStyle: "Standing/Room-Scale",
    actionType: "Soccer Simulator",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3137350/header.jpg",
    developer: "ProSports VR",
    publisher: "ProSports VR",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers (Goalie)",
    spaceRequired: "1.8 GB",
    playerMode: "Single User / Local Multiplayer",
    features: [
      "1:1 hand-tracking goalie mitts",
      "Penalty targeting grids",
      "Simulated crowd noise cheer loops",
      "Cardio calorie-burned readouts"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "cooking-games",
    title: "The Cooking Game VR",
    category: "Sports & Fitness",
    suitability: "All Ages",
    shortDesc: "Chop, cook, and serve delicious dishes in a fast-paced virtual kitchen.",
    longDesc: "The Cooking Game VR puts you in charge of a busy, chaotic kitchen. Slice ingredients, fry burgers, assemble orders, and manage your time to keep customers happy. A physical and frantic cooking simulator that tests your hand-eye coordination.",
    difficulty: 2,
    tags: ["Simulation", "Cooking", "Time-Management", "Family"],
    playStyle: "Standing",
    actionType: "Cooking Simulator",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    developer: "VR Kitchen",
    publisher: "VR Kitchen",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.1 GB",
    playerMode: "Single User",
    features: [
      "Functional stove, fryers & cutting boards",
      "Rush-hour countdown tickets",
      "Multi-recipe cooking sheets",
      "Clean-up & dishwasher simulator challenges"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // 7. Educational & Learning Experiences (Expanded with 21 new titles)
  {
    id: "cosmic-vr",
    title: "Cosmic XR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Walk among the stars and explore our solar system up close.",
    longDesc: "Cosmic XR transforms your room into an interactive cosmos. Walk around planets, inspect orbits, witness supernovas, and see the scale of the universe in a visually stunning educational exploration of space.",
    difficulty: 1,
    tags: ["Space", "Astronomy", "Educational", "Interactive"],
    playStyle: "Sitting/Standing",
    actionType: "Science Simulation",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    developer: "Astronomy Labs",
    publisher: "Astronomy Labs",
    comfortRating: "Comfortable",
    controllers: "Touch/Hand Tracking",
    spaceRequired: "1.2 GB",
    playerMode: "Single User",
    features: [
      "Orbit path manipulation slider",
      "Planet size comparison maps",
      "Annotated stellar encyclopedias",
      "Supernova visual timeline animations"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "human-anatomy-vr",
    title: "Human Anatomy VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Inspect a highly detailed 3D map of the human body.",
    longDesc: "Human Anatomy VR provides a groundbreaking way to learn biology. Dissect muscle layers, trace blood flow, view skeletal structures, and zoom into specific organs in full 3D interactive space. Ideal for students and biology events.",
    difficulty: 1,
    tags: ["Biology", "Anatomy", "Educational", "Interactive"],
    playStyle: "Sitting/Standing",
    actionType: "Science Exploration",
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80",
    developer: "Virtual Medicine",
    publisher: "Virtual Medicine",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.5 GB",
    playerMode: "Single User",
    features: [
      "Muscle & bone layer dissection",
      "Animated blood flow simulations",
      "High-power zoom organ examinations",
      "Integrated biology quiz sets"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "natgeo-explore",
    title: "National Geographic Explore VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Travel to Antarctica and Machu Picchu on a virtual expedition.",
    longDesc: "National Geographic Explore VR lets you travel to the ends of the Earth. Navigate icebergs in a kayak, climb a giant ice wall, survive a blizzard, and explore the ancient ruins of Machu Picchu while taking photos for National Geographic.",
    difficulty: 2,
    tags: ["Adventure", "Geography", "Educational", "Interactive"],
    playStyle: "Standing/Room-Scale",
    actionType: "Virtual Travel",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    developer: "Force Field VR",
    publisher: "National Geographic",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "3.0 GB",
    playerMode: "Single User",
    features: [
      "Realistic kayak paddling mechanics",
      "Ice climbing rope and pick physics",
      "Expedition field camera lens system",
      "Immersive weather blizzard cycles"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "overview-360",
    title: "Sky Overview 360",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Fly around the globe and view earth's structures in 360-degree glory.",
    longDesc: "Sky Overview 360 gives you an astronaut's perspective of planet Earth. Fly around orbits, see cities lit up at night, watch weather cycles move across the atmosphere, and learn about satellite telemetry in a relaxed orbital simulation.",
    difficulty: 1,
    tags: ["Space", "Earth", "Relaxing", "Cinematic"],
    playStyle: "Sitting",
    actionType: "Cinematic Experience",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80",
    developer: "NASA Space Apps",
    publisher: "NASA Space Apps",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.5 GB",
    playerMode: "Single User",
    features: [
      "HD satellite texture overlays",
      "Dynamic weather storm trackers",
      "Orbit telemetry readouts",
      "Interactive globe spinning control"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "ambulate-to-wheelchair",
    title: "Ambulate to Wheelchair",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Healthcare Events",
    shortDesc: "Train in clinical patient mobilization from a bed to a wheelchair.",
    longDesc: "Ambulate to Wheelchair is an interactive medical nursing training simulator. Practice body mechanics, safety locking, pivot steps, and communication cues while assisting a virtual patient from their bedside into a wheelchair.",
    difficulty: 2,
    tags: ["Medical", "Healthcare", "Nursing", "Simulation"],
    playStyle: "Standing",
    actionType: "Nursing Simulation",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    developer: "HealthSim VR",
    publisher: "HealthSim VR",
    comfortRating: "Comfortable",
    controllers: "Hand Tracking / Touch",
    spaceRequired: "1.4 GB",
    playerMode: "Single User",
    features: [
      "Nursing ergonomics feedback detector",
      "Real-time weight shifting gauges",
      "Dialogue communication queues",
      "Safety brake validation check"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "hallo-einstein",
    title: "Hallo Einstein",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Enter Albert Einstein's study and explore theoretical physics.",
    longDesc: "Hallo Einstein places you inside the historic patent office. Solve physics puzzles, slide blocks to test special relativity, and converse with an interactive animated Albert Einstein in a charming historical simulator.",
    difficulty: 1,
    tags: ["Physics", "History", "Science", "Interactives"],
    playStyle: "Sitting/Standing",
    actionType: "Science Laboratory",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    developer: "Science Museum VR",
    publisher: "Science Museum VR",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.6 GB",
    playerMode: "Single User",
    features: [
      "Relativity chalkboard drawings",
      "Conversation engines with Einstein",
      "Patent office historical tours",
      "Physics velocity block experiments"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "10k-science",
    title: "10K Science",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Perform chemical experiments safely inside a virtual science lab.",
    longDesc: "10K Science is a comprehensive virtual chemistry and biology laboratory. Mix elements, run centrifuges, observe micro-organisms through virtual microscopes, and complete safe, curriculum-aligned experiments.",
    difficulty: 2,
    tags: ["Chemistry", "Biology", "Science", "School"],
    playStyle: "Standing",
    actionType: "Science Laboratory",
    image: "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=600&q=80",
    developer: "School Labs",
    publisher: "School Labs",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.0 GB",
    playerMode: "Single User",
    features: [
      "Interactive periodic element mixing",
      "Functional slides & microscopes",
      "Chemical fire safety drills",
      "Curriculum-aligned chemical guides"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "ambulate-transfer-belt",
    title: "Ambulate Transfer Belt",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Healthcare Events",
    shortDesc: "Learn nursing safety procedures using physical gait transfer belts.",
    longDesc: "Ambulate Transfer Belt teaches nursing and physical therapy safety guidelines. Practice adjusting, tightening, and holding gait belts while lifting, supporting, and walking patients through rehabilitation paths.",
    difficulty: 2,
    tags: ["Medical", "Healthcare", "Nursing", "Training"],
    playStyle: "Standing",
    actionType: "Nursing Simulation",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    developer: "HealthSim VR",
    publisher: "HealthSim VR",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.3 GB",
    playerMode: "Single User",
    features: [
      "Physiotherapy gait belt adjustments",
      "Real-time spine strain detectors",
      "Interactive patient safety triggers",
      "Assisted walking training corridors"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "world-lens-vr",
    title: "World Lens VR",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Explore global landmarks and heritage sites in 360-degree tours.",
    longDesc: "World Lens VR is a travel documentarian simulator. Travel to the Great Wall of China, Eiffel Tower, Colosseum, and more, reading built-in histories, taking 3D photos, and discovering cultural milestones.",
    difficulty: 1,
    tags: ["Geography", "History", "Travel", "Nature"],
    playStyle: "Sitting/Standing",
    actionType: "Virtual Traveling",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
    developer: "Travel Media",
    publisher: "Travel Media",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.2 GB",
    playerMode: "Single User",
    features: [
      "360 historical sight overlays",
      "Voiceover translation guides",
      "Historical zoom magnifying lenses",
      "Interactive map search selectors"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "wander",
    title: "Wander",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Teleport to any street or landmark on Earth using Google Street View.",
    longDesc: "Wander lets you explore the entire globe from a street-level perspective. Walk through your childhood neighborhood, visit polar reserves, or scale historic squares with voice search and cooperative multiplayer tours.",
    difficulty: 1,
    tags: ["Geography", "Maps", "Travel", "Relaxing"],
    playStyle: "Sitting/Standing",
    actionType: "Virtual Exploration",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    developer: "Parkline Studio",
    publisher: "Parkline Studio",
    comfortRating: "Comfortable",
    controllers: "Touch/Hand Tracking",
    spaceRequired: "1.4 GB",
    playerMode: "Single User / Co-op",
    features: [
      "Google Street View mapping overlays",
      "Time-travel historical photo sliders",
      "Co-op multiplayer voice tours",
      "Integrated Wikipedia reference blocks"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },

  // ---- START 21 NEW EDUCATIONAL EXPERIENCES ----
  {
    id: "anne-frank-vr",
    title: "Anne Frank House VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Step back in time to explore the secret annex where Anne Frank hid.",
    longDesc: "Anne Frank House VR offers a unique and highly emotional insight into the Secret Annex where Anne Frank and seven others hid from Nazi persecution during World War II. Walk through the realistically reconstructed rooms, decorated as they were during the hiding period, and experience history up close.",
    difficulty: 1,
    tags: ["History", "World War II", "Literature", "Empathy"],
    playStyle: "Standing/Room-Scale",
    actionType: "Historical Tour",
    image: "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=600&q=80",
    developer: "Force Field VR",
    publisher: "Anne Frank House",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.4 GB",
    playerMode: "Single User",
    features: [
      "1:1 historical layout reproduction",
      "Narrated diary excerpts",
      "Interactive background objects",
      "Highly detailed lighting and soundscapes"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "hold-the-world",
    title: "Hold the World",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Examine rare fossils with Sir David Attenborough in a virtual museum.",
    longDesc: "Hold the World is an interactive VR experience that teleports you inside London's Natural History Museum. Join a virtual Sir David Attenborough in a private library where you can pick up, rotate, scale, and study rare fossil specimens, prehistoric bones, and delicate insects.",
    difficulty: 1,
    tags: ["Paleontology", "Biology", "Museum", "Science"],
    playStyle: "Sitting",
    actionType: "Museum Science",
    image: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80",
    developer: "Sky VR",
    publisher: "Factory 42 Studios",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers / Hand Tracking",
    spaceRequired: "3.2 GB",
    playerMode: "Single User",
    features: [
      "Sir David Attenborough hologram guide",
      "Photogrammetric 3D scans of rare artifacts",
      "Dynamic anatomical internal scans",
      "Interactive magnifying and scaling tools"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "titans-of-space",
    title: "Titans of Space PLUS",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Take a deep-space tour of stars, planets, and galaxies at scale.",
    longDesc: "Titans of Space PLUS is a guided tour through our solar system and beyond. Sitting inside a virtual space capsule, drift past planets and moons shrunk down to 1 millionth of their actual size, compare star volumes, and learn orbital mechanics through interactive lessons.",
    difficulty: 1,
    tags: ["Astronomy", "Space", "Cosmology", "Physics"],
    playStyle: "Sitting",
    actionType: "Cosmic Tour",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    developer: "Drash VR",
    publisher: "Drash VR",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.9 GB",
    playerMode: "Single User",
    features: [
      "Guided audio-narration script",
      "Giant comparative star grids",
      "Interactive planet status widgets",
      "Zero-gravity orbital drift feeling"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "apollo-11-vr",
    title: "Apollo 11 VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Experience the historic 1969 moon landing through the eyes of the astronauts.",
    longDesc: "Apollo 11 VR is the story of the greatest journey ever taken by humankind. Re-create the historic event from launch to moon landing and return. Take control of the Command Module, land the Lunar Module, and walk on the moon in this documentary simulation.",
    difficulty: 2,
    tags: ["History", "Spaceflight", "Apollo", "NASA"],
    playStyle: "Sitting/Standing",
    actionType: "Documentary Simulation",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80",
    developer: "Immersive VR Education",
    publisher: "Immersive VR Education",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.8 GB",
    playerMode: "Single User",
    features: [
      "Historic audio and transcript logs",
      "Interactive lunar lander joystick controls",
      "Low-gravity surface walk navigation",
      "Detailed Saturn V rocket assembly checks"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "the-blue",
    title: "The Blue",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Stand on the deck of a sunken ship and face a massive blue whale.",
    longDesc: "The Blue is an award-winning deep-ocean adventure. Standing on a virtual coral reef or a sunken shipwreck deck, observe marine ecosystems in stunning detail. Watch schools of fish, glowing jellyfish, and a life-sized blue whale swim past.",
    difficulty: 1,
    tags: ["Marine Biology", "Ocean", "Relaxing", "Nature"],
    playStyle: "Standing/Room-Scale",
    actionType: "Aquatic Experience",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    developer: "Wevr Labs",
    publisher: "Wevr Labs",
    comfortRating: "Comfortable",
    controllers: "Gaze/Touch Controllers",
    spaceRequired: "2.5 GB",
    playerMode: "Single User",
    features: [
      "Sunken ship close-up encounter",
      "Bioluminescent jellyfish deep-dive",
      "Realistic sea water light refraction",
      "Responsive fish school navigation AI"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "nefertiti-tomb",
    title: "Nefertiti: Journey to Eternity",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Explore the ancient tomb of Nefertiti in stunning laser-scanned detail.",
    longDesc: "Nefertiti: Journey to Eternity uses high-resolution LiDAR laser scanning to reconstruct the interior of ancient Egyptian tombs. Walk inside the chamber walls, examine hieroglyphics up close, and learn about mummification and mythology.",
    difficulty: 1,
    tags: ["Egyptology", "History", "Archaeology", "Museum"],
    playStyle: "Standing/Room-Scale",
    actionType: "Virtual Tour",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
    developer: "ScanLAB Projects",
    publisher: "ScanLAB Projects",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.7 GB",
    playerMode: "Single User",
    features: [
      "LiDAR 1:1 tombs wall mapping",
      "Interactive magnifying glass reading tool",
      "Hieroglyphic translator overlays",
      "Chamber flashlight exploration options"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "google-earth-vr",
    title: "Google Earth VR",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Fly over cities, scale mountains, and explore any corner of the globe.",
    longDesc: "Google Earth VR lets you explore the world from entirely new perspectives. Stroll the streets of Tokyo, fly over the Grand Canyon, or stand atop Mount Everest. Explore satellite imagery, terrain data, and street-level views.",
    difficulty: 1,
    tags: ["Geography", "Maps", "Tourism", "Nature"],
    playStyle: "Sitting/Standing",
    actionType: "Virtual Flight",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    developer: "Google",
    publisher: "Google",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "8.5 GB",
    playerMode: "Single User",
    features: [
      "Full global orbital flight controls",
      "3D volumetric building renders",
      "Street View teleport hubs",
      "Daytime light slider adjustments"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "mondly-vr",
    title: "Mondly VR",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Practice foreign languages with lifelike virtual characters in real scenarios.",
    longDesc: "Mondly VR is a language learning experience. Practice speaking over 30 languages with virtual characters in lifelike situations (like checking into a hotel, ordering in a restaurant, or taking a taxi). Includes instant voice pronunciation feedback.",
    difficulty: 2,
    tags: ["Languages", "Education", "Interactive", "Speech"],
    playStyle: "Sitting",
    actionType: "Language Simulator",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    developer: "ATi Studios",
    publisher: "ATi Studios",
    comfortRating: "Comfortable",
    controllers: "Touch / Built-in Microphone",
    spaceRequired: "1.1 GB",
    playerMode: "Single User",
    features: [
      "Voice recognition speech feedback",
      "Lifelike conversational avatars",
      "Interactive restaurant & travel scenarios",
      "Vocabulary building cards games"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "colosseum-vr",
    title: "Colosseum VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Walk the arena floor of the Roman Colosseum at the height of the Empire.",
    longDesc: "Colosseum VR takes you back to ancient Rome. Walk through the gates, stand on the amphitheater arena floor, explore the underground hypogeum where gladiators and beasts waited, and see the architecture reconstructed as it stood in 80 AD.",
    difficulty: 1,
    tags: ["History", "Ancient Rome", "Architecture", "Education"],
    playStyle: "Standing/Room-Scale",
    actionType: "Historical Tour",
    image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=600&q=80",
    developer: "Unimersiv",
    publisher: "Unimersiv",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.4 GB",
    playerMode: "Single User",
    features: [
      "Roman Colosseum 3D reconstructions",
      "Interactive hypogeum cage elevator lifts",
      "Gladiator weapon inspection blocks",
      "Historical speech recordings guides"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "cellverse",
    title: "Cellverse",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Shrink down to enter a living human cell and solve molecular puzzles.",
    longDesc: "Cellverse shrinks you down to a microscopic scale. Step inside a virtual human cell to witness DNA translation, trace organelles like mitochondria, and study cell structures to solve molecular puzzles and cure simulated cellular mutations.",
    difficulty: 2,
    tags: ["Biology", "Cells", "Microbiology", "Science"],
    playStyle: "Sitting/Standing",
    actionType: "Science Puzzle",
    image: "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=600&q=80",
    developer: "Harvard & MIT labs",
    publisher: "Harvard University",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.6 GB",
    playerMode: "Single User",
    features: [
      "Microscopic cellular maps scale",
      "Interactive DNA helix repair sliders",
      "Ribosome particle translator triggers",
      "Cell mutation diagnostics panels"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "vr-museum-art",
    title: "VR Museum of Fine Art",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Walk through a virtual museum displaying life-sized master sculptures.",
    longDesc: "The VR Museum of Fine Art allows you to view world-famous paintings and sculptures in 1:1 scale in a quiet, modern museum gallery. Examine Michelangelo's David, Leonardo's Mona Lisa, and historic murals without crowds.",
    difficulty: 1,
    tags: ["Art", "Sculpture", "Museum", "History"],
    playStyle: "Standing/Room-Scale",
    actionType: "Art Exhibition",
    image: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=600&q=80",
    developer: "Finn Sinclair",
    publisher: "Finn Sinclair",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.1 GB",
    playerMode: "Single User",
    features: [
      "Michelangelo's David 1:1 scan render",
      "Detailed plaques translating artist history",
      "Dynamic ambient gallery shadows",
      "Smooth teleporter navigation mechanics"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1505635338219-0a113f66a337?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "everest-vr",
    title: "Everest VR",
    category: "Educational & Learning Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Ascend Mount Everest and witness the sheer scale of the Himalayas.",
    longDesc: "Everest VR is a realistic mountain climbing adventure. Experience the preparations, traverse deep crevasses on ladders, climb the Lhotse Face, camp overnight, and scale the Hillary Step to reach the summit of Mount Everest.",
    difficulty: 3,
    tags: ["Climbing", "Adventure", "Geography", "Nature"],
    playStyle: "Standing/Room-Scale",
    actionType: "Mountain Climbing Simulation",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    developer: "Sólfar Studios",
    publisher: "Sólfar Studios",
    comfortRating: "Intense",
    controllers: "Touch Controllers",
    spaceRequired: "4.8 GB",
    playerMode: "Single User",
    features: [
      "Realistic hand pickaxe climbing mechanics",
      "Traversing crevasses on thin ladders",
      "Icy wind particle and audio maps",
      "3D map of the Everest climb route"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "shuttle-commander",
    title: "Shuttle Commander",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Pilot the Space Shuttle Discovery and deploy the Hubble Space Telescope.",
    longDesc: "Shuttle Commander lets you experience the Hubble Space Telescope missions. Land the Space Shuttle Discovery at Kennedy Space Center, float in zero-gravity to repair Hubble, and learn cockpit control systems.",
    difficulty: 4,
    tags: ["Space", "Flight Sim", "NASA", "Hubble"],
    playStyle: "Sitting/Standing",
    actionType: "Aviation Simulator",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    developer: "Immersive VR Education",
    publisher: "Immersive VR Education",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "3.2 GB",
    playerMode: "Single User",
    features: [
      "Accurate Space Shuttle landing controls",
      "Hubble space telescope solar panel repairs",
      "Cockpit instrument dials telemetry",
      "Historical NASA space missions records"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "inside-covid19",
    title: "Inside COVID-19",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Healthcare Events",
    shortDesc: "Follow a doctor into the lungs and see how viruses attack cells.",
    longDesc: "Inside COVID-19 is a groundbreaking medical documentary that uses volumetric microscopy. Journey inside the lungs of a virtual patient to observe how the SARS-CoV-2 virus spikes and targets lung cells at a molecular scale.",
    difficulty: 1,
    tags: ["Medicine", "Microbiology", "Science", "Viral"],
    playStyle: "Sitting",
    actionType: "Medical Documentary",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    developer: "Oculus Studios",
    publisher: "Oculus Studios",
    comfortRating: "Comfortable",
    controllers: "Gaze/Touch Controllers",
    spaceRequired: "1.8 GB",
    playerMode: "Single User",
    features: [
      "Volumetric lungs scans viewer",
      "Virus cell attachment animation locks",
      "Immune system white cell reactions",
      "Medical doctors voice annotations"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "great-pyramid",
    title: "Great Pyramid VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Enter and navigate the narrow chambers of the Great Pyramid of Giza.",
    longDesc: "Great Pyramid VR is an archaeological exploration experience. Step inside the Great Pyramid of Giza and walk down the Grand Gallery to the King's and Queen's Chambers, exploring passageways reconstructed with historical accuracy.",
    difficulty: 1,
    tags: ["Egyptology", "History", "Archaeology", "Pyramids"],
    playStyle: "Standing/Room-Scale",
    actionType: "Historical Tour",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
    developer: "Unimersiv Labs",
    publisher: "Unimersiv Labs",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.2 GB",
    playerMode: "Single User",
    features: [
      "Grand Gallery narrow corridor paths",
      "Sarcophagus chamber interactive details",
      "Reconstructed tomb shaft structural maps",
      "Flashlight illumination options"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "house-of-languages",
    title: "House of Languages",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Learn English, Spanish, or German vocabulary in a fun cartoon playroom.",
    longDesc: "House of Languages is a gamified language learning playground for younger students. Search for toys, name elements, and match vocabulary terms in English, Spanish, or German inside a cartoon toy shop and playroom.",
    difficulty: 1,
    tags: ["Languages", "Schools", "Gamified", "Children"],
    playStyle: "Sitting/Standing",
    actionType: "Language Minigame",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    developer: "VRR Interactive",
    publisher: "VRR Interactive",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers / Gaze",
    spaceRequired: "1.0 GB",
    playerMode: "Single User",
    features: [
      "Cartoon character interactive guides",
      "Search-and-find word matching boards",
      "Spelled pronunciation guides",
      "Three-language dictionary card packs"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "mission-iss",
    title: "Mission: ISS",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Float in zero-gravity and dock cargo ships on the International Space Station.",
    longDesc: "Mission: ISS is an immersive simulation developed with NASA and the CSA. Float in zero-gravity inside the International Space Station, run space experiments, take spacewalks in an astronaut EVA suit, and guide resupply spacecraft to dock.",
    difficulty: 3,
    tags: ["Space", "NASA", "ISS", "Zero-G"],
    playStyle: "Standing/Room-Scale",
    actionType: "Aero Space Simulation",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    developer: "Magnopus Studio",
    publisher: "Oculus Studios",
    comfortRating: "Moderate",
    controllers: "Touch Controllers",
    spaceRequired: "2.6 GB",
    playerMode: "Single User",
    features: [
      "Realistic zero-gravity hand pull movement",
      "Astronaut spacewalk ropes & clips",
      "Robotic arm cargo ship docking",
      "Actual ISS video recordings logs"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "virtual-lab-chem",
    title: "Virtual Lab Chemistry",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Perform chemical titrations and molecular experiments in a safe virtual lab.",
    longDesc: "Virtual Lab Chemistry is a sandbox for secondary school science students. Safely handle dangerous chemical elements, mix reagents, perform titrations, heat glass flasks, and examine molecule bonds in 3D without real-world hazards.",
    difficulty: 2,
    tags: ["Chemistry", "Science", "School", "Safety"],
    playStyle: "Standing",
    actionType: "Chemistry Simulation",
    image: "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=600&q=80",
    developer: "Labster Labs",
    publisher: "Labster Labs",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "2.2 GB",
    playerMode: "Single User",
    features: [
      "Interactive chemistry balance weights",
      "Volumetric titration test pipettes",
      "Bunsen burner heating cycles",
      "Safety equipment gear wearing drills"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1532187640605-a33d9107988c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "curious-alice",
    title: "Curious Alice",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Enter Alice in Wonderland's fantasy landscape to solve surreal logic riddles.",
    longDesc: "Curious Alice brings Lewis Carroll's logical puzzles to life. Transport yourself to Wonderland to play croquet, resize objects, solve riddles from the Cheshire Cat, and decode mathematical riddles in an immersive fantasy setting.",
    difficulty: 2,
    tags: ["Literature", "Puzzles", "Fantasy", "Art"],
    playStyle: "Sitting/Standing",
    actionType: "Puzzle Adventure",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    developer: "V&A Museum Studio",
    publisher: "Victoria & Albert Museum",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.5 GB",
    playerMode: "Single User",
    features: [
      "Wonderland surreal paper art structures",
      "Scale scaling eat-me resize keys",
      "Interactive riddles speech blocks",
      "Foliage physics maze paths"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "ecosphere",
    title: "Ecosphere",
    category: "Educational & Learning Experiences",
    suitability: "All Ages",
    shortDesc: "Travel to Kenya, Borneo, and Raja Ampat to document endangered species.",
    longDesc: "Ecosphere is a nature documentary series. Travel to savanna grass plains in Kenya, jungle layers in Borneo, and marine reefs in Raja Ampat to study wildlife conversation, follow rangers, and photograph endangered species.",
    difficulty: 1,
    tags: ["Ecology", "Wildlife", "Nature", "Tourism"],
    playStyle: "Sitting/Standing",
    actionType: "Virtual Travel Documentary",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    developer: "PHORIA",
    publisher: "PHORIA",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers / Gaze",
    spaceRequired: "2.6 GB",
    playerMode: "Single User",
    features: [
      "3D volumetric nature video loops",
      "Elephant savanna patrol tracking",
      "Orangutan rescue station tours",
      "Coral reef growth observation markers"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
    ]
  },
  {
    id: "ocean-acidification",
    title: "Ocean Acidification VR",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Inspect how carbon emissions are affecting the ocean's coral reefs.",
    longDesc: "Ocean Acidification VR is an environmental science lab created by Stanford University. Shrink to the size of a coral polyp to see chemical changes in seawater, collect samples, and witness how acid levels destroy marine ecosystems.",
    difficulty: 1,
    tags: ["Ecology", "Oceanography", "Stanford", "Climate"],
    playStyle: "Sitting/Standing",
    actionType: "Science Simulation",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    developer: "Stanford VHIL Lab",
    publisher: "Stanford University",
    comfortRating: "Comfortable",
    controllers: "Touch Controllers",
    spaceRequired: "1.2 GB",
    playerMode: "Single User",
    features: [
      "Coral polyp microscopic scale look",
      "Seawater pH chemical mixing widgets",
      "Reef sample collection grids",
      "Interactive climate timeline charts"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
    ]
  }
  // ---- END 21 NEW EDUCATIONAL EXPERIENCES ----
];
