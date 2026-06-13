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
}

export const gamesData: Game[] = [
  // 1. Horror Experiences
  {
    id: "richies-plank",
    title: "Richie's Plank Experience",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Walk a thin plank 80 stories high and face your fear of heights.",
    longDesc: "Richie's Plank Experience is a psychological thrill ride. Placed 80 stories above the ground, walk a narrow wooden plank and decide if you have the nerve to step off. Includes secondary modes like Hero Academy, Firefighting, and Skybrush for creative VR play.",
    difficulty: 4,
    tags: ["Thrill", "Heights", "Short Play", "Immersive"],
    playStyle: "Standing/Room-Scale",
    actionType: "Simulation",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/517160/header.jpg"
  },
  {
    id: "sleep-watch",
    title: "Sleep Watch",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Stay alert and survive the horrors lurking in the dark.",
    longDesc: "Sleep Watch places you in a dark and eerie environment where survival depends on your alertness and quick thinking. Monitor security systems, avoid lurking threats, and keep your composure as tension rises in this sleep paralysis horror simulation.",
    difficulty: 4,
    tags: ["Survival", "Suspense", "Jump Scares", "Dark"],
    playStyle: "Sitting/Standing",
    actionType: "Survival Horror",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "face-your-fears",
    title: "Face Your Fears",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Confront your deepest fears in spine-chilling scenarios.",
    longDesc: "Face Your Fears exposes you to common phobias and horror scenarios in full 360-degree immersion. From haunted houses to heights and paranormal entities, this experience is designed to get your adrenaline pumping.",
    difficulty: 5,
    tags: ["Atmospheric", "Spooky", "Short Play", "Jump Scares"],
    playStyle: "Sitting",
    actionType: "Interactive Experience",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cursed-night-house",
    title: "Cursed Night: The House",
    category: "Horror Experiences",
    suitability: "Teens & Adults",
    shortDesc: "Explore a haunted house and escape its cursed entities.",
    longDesc: "Cursed Night: The House is a narrative-driven horror game where you explore a derelict, cursed mansion. Solve basic puzzles, find clues, and evade the malevolent spirits that haunt the corridors before it is too late.",
    difficulty: 4,
    tags: ["Exploration", "Puzzle", "Escape Room", "Spooky"],
    playStyle: "Standing/Room-Scale",
    actionType: "Exploration Horror",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1740570/header.jpg"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1080750/header.jpg"
  },
  {
    id: "creed-rise-glory",
    title: "Creed: Rise to Glory",
    category: "Fighting & Action Games",
    suitability: "Ages 10+",
    shortDesc: "Step into the boxing ring and fight your way to the top.",
    longDesc: "Creed: Rise to Glory lets you train under Rocky Balboa and fight against legendary boxers. Features responsive boxing physics, stamina-draining physical movement, and multiplayer matches that test your endurance and boxing skills.",
    difficulty: 4,
    tags: ["Sports", "Boxing", "Active", "Simulation"],
    playStyle: "Standing",
    actionType: "Active Boxing",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945980/header.jpg"
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
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1324410/header.jpg"
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
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/422760/header.jpg"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/418650/header.jpg"
  },
  {
    id: "repossessed-zombie",
    title: "Repossessed (Zombie Shooting)",
    category: "Shooting Games",
    suitability: "Ages 12+",
    shortDesc: "Fight for survival against hordes of terrifying zombies.",
    longDesc: "Repossessed is an intense arcade zombie shooter. Armed with pistols, shotguns, and rifles, defend your position as hordes of infected rush at you. Quick reloading, steady aim, and spatial awareness are critical to survival.",
    difficulty: 4,
    tags: ["Zombies", "Shooter", "Scary", "Action"],
    playStyle: "Standing",
    actionType: "Zombie Survival",
    image: "https://images.unsplash.com/photo-1601513525393-832777b9bb7a?auto=format&fit=crop&w=600&q=80"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg"
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
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3137350/header.jpg"
  },
  {
    id: "cooking-games",
    title: "The Cooking Games",
    category: "Sports & Fitness",
    suitability: "All Ages",
    shortDesc: "Chop, cook, and serve delicious dishes in a fast-paced virtual kitchen.",
    longDesc: "The Cooking Games puts you in charge of a busy, chaotic kitchen. Slice ingredients, fry burgers, assemble orders, and manage your time to keep customers happy. A physical and frantic cooking simulator that tests your hand-eye coordination.",
    difficulty: 2,
    tags: ["Simulation", "Cooking", "Time-Management", "Family"],
    playStyle: "Standing",
    actionType: "Cooking Simulator",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
  },

  // 7. Educational & Learning Experiences
  {
    id: "cosmic-vr",
    title: "Cosmic VR – Space in Your Room",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Walk among the stars and explore our solar system up close.",
    longDesc: "Cosmic VR transforms your room into an interactive cosmos. Walk around planets, inspect orbits, witness supernovas, and see the scale of the universe in a visually stunning educational exploration of space.",
    difficulty: 1,
    tags: ["Space", "Astronomy", "Educational", "Interactive"],
    playStyle: "Sitting/Standing",
    actionType: "Science Simulation",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
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
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80"
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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "overview-360",
    title: "Overview 360",
    category: "Educational & Learning Experiences",
    suitability: "Schools & Educational Events",
    shortDesc: "Fly around the globe and view earth's structures in 360-degree glory.",
    longDesc: "Overview 360 gives you an astronaut's perspective of planet Earth. Fly around orbits, see cities lit up at night, watch weather cycles move across the atmosphere, and learn about satellite telemetry in a relaxed orbital simulation.",
    difficulty: 1,
    tags: ["Space", "Earth", "Relaxing", "Cinematic"],
    playStyle: "Sitting",
    actionType: "Cinematic Experience",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80"
  }
];
