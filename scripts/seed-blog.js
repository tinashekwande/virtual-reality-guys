// scripts/seed-blog.js
// Reads .env.local and seeds 8 draft blog posts into Supabase.
// Run with: node scripts/seed-blog.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Service Role Key missing in .env.local');
  process.exit(1);
}

// 2. Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// 3. Define the 8 starter posts
const seedPosts = [
  {
    title: '10 Amazing VR Birthday Party Ideas in Cape Town',
    slug: '10-amazing-vr-birthday-party-ideas-cape-town',
    category: 'Birthday Parties',
    tags: ['Birthday Parties', 'Cape Town', 'Event Ideas', 'Kids'],
    excerpt: 'Discover how to host an unforgettable birthday party in Cape Town using mobile virtual reality. From action-packed games to creative experiences, here are 10 ideas to inspire your next event.',
    featured_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    reading_time: 6,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: '10 Amazing VR Birthday Party Ideas in Cape Town | VR Guys',
    seo_description: 'Host the ultimate VR birthday party in Cape Town. Discover 10 creative mobile VR ideas, games, and setups that will blow your guests away.',
    content: `# 10 Amazing VR Birthday Party Ideas in Cape Town

Looking to take your child's birthday party to the next level? Traditional party entertainment like jumping castles and magicians are great, but if you want an experience that will have kids and adults talking for months, a **Virtual Reality (VR) party** is the ultimate choice.

With mobile VR hire in Cape Town, you don't even need to travel to a venue. The virtual reality setups can be delivered and fully managed right at your home or chosen event space. Here are 10 amazing VR party ideas to make your next celebration in Cape Town unforgettable.

## 1. Setup a Beat Saber Championship
*Beat Saber* is the ultimate VR crowd-pleaser. Players slice through neon blocks to the rhythm of high-energy music. 
* **The Idea:** Host a tournament-style bracket. Print out a physical scoreboard and have players compete for the highest score on a specific song.
* **Why it works:** It is highly active, easy to learn, and incredibly fun for spectators to watch on the external screens.

## 2. Walk the Plank Challenge
Bring the thrill of high-altitude fear with *Richie's Plank Experience*. 
* **The Idea:** Place a real wooden plank flat on the floor in the middle of your setup. In VR, the player takes an elevator to the 80th floor of a skyscraper and must walk out onto a plank suspended in the air.
* **Why it works:** The psychological impact of stepping onto a real plank while seeing the virtual drop is a hilarious experience for spectators and an unforgettable rush for the player.

## 3. Co-Op Bomb Defusal
Get everyone working together with *Keep Talking and Nobody Explodes*.
* **The Idea:** One player wears the VR headset and sees a ticking bomb with various modules. The other party guests sit around with a physical printed "Bomb Defusal Manual" and must guide the player through defusing it before the timer runs out.
* **Why it works:** It requires intense communication and keeps large groups of kids or adults active and laughing.

## 4. Job Simulator - The Funny Routine
*Job Simulator* is an absolute favorite among younger kids. It lets them step into a tongue-in-cheek world where robots run society and kids try their hand at being a chef, auto mechanic, or office worker.
* **The Idea:** Let kids get creative. They can cook weird soup recipes, throw coffee mugs at robot bosses, or soup up virtual cars.
* **Why it works:** It is low-stress, extremely funny, and serves as an excellent introduction for kids who have never experienced VR before.

## 5. Fruit Ninja Tournament
Unleash their inner ninja with *Fruit Ninja VR*.
* **The Idea:** Slice giant watermelons, pineapples, and coconuts flying through the air in 360 degrees.
* **Why it works:** Classic arcade fun that translates perfectly into active physical movements.

## 6. Tilt Brush Art Gallery
For the creative child, *Tilt Brush* lets them paint in 3D space using light, fire, and stars.
* **The Idea:** Let the birthday boy or girl design a giant virtual birthday card or sculpture, then take a screenshot of it to print out later.
* **Why it works:** It shows a completely different, artistic side of virtual reality.

## 7. The Ultimate VR Racing Rig
Turn a corner of your venue into a professional racing bay.
* **The Idea:** Pair a VR headset with a physical steering wheel, pedals, and a racing seat. Let guests race on famous tracks around the world.
* **Why it works:** The depth perception in VR racing is incredibly immersive, making you feel the speed and G-forces.

## 8. Space Pirate Trainer Survival
For the action fans, *Space Pirate Trainer* lets them duel waves of attacking droid ships using dual lasers and shields.
* **The Idea:** Set up a survival high-score leaderboard.
* **Why it works:** Fast-paced, active, and keeps players fully engaged in physical dodging and blocking.

## 9. VR Team Building & Relay Games
If you have a large guest list, turn the VR setup into a relay team race.
* **The Idea:** Divide guests into teams. Each member has 2 minutes to score as many points as possible in games like *Superhot* or *Fruit Ninja* before passing the headset to the next teammate.
* **Why it works:** Encourages teamwork and keeps energy levels high.

## 10. Multi-Generational Family Play
Don't forget the parents and grandparents!
* **The Idea:** Introduce older guests to gentle immersive experiences like *Ocean Rift* (underwater safari) or Google Earth VR, allowing them to visit their childhood hometown in 3D.
* **Why it works:** Bridges the generation gap and creates heartwarming shared family memories.

---

### Ready to book?
Bring the future of gaming directly to your venue. Contact us to learn more about our customizable party packages.
* **Request a Quote:** Click the Contact Us button to secure your date today!
`
  },
  {
    title: 'Why Schools Are Using Virtual Reality for Learning',
    slug: 'why-schools-are-using-virtual-reality-for-learning',
    category: 'Schools',
    tags: ['Schools', 'Education', 'Virtual Reality', 'Mobile VR'],
    excerpt: 'Virtual Reality is transforming education. Explore how schools in Cape Town are integrating immersive VR to make science, history, and geography lessons interactive and memorable.',
    featured_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
    reading_time: 5,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Why Schools Are Using Virtual Reality for Learning | VR Guys',
    seo_description: 'Discover the educational benefits of Virtual Reality in schools. Learn how immersive VR field trips, biology lessons, and history tours boost engagement.',
    content: `# Why Schools Are Using Virtual Reality for Learning

Education is shifting from passive listening to active experiencing. In classrooms across Cape Town, teachers are finding innovative ways to capture students' attention and explain complex concepts. Among these new tools, **Virtual Reality (VR)** is showing the most exciting potential.

Rather than reading about the solar system or looking at a flat diagram of a cell, students can put on a VR headset and float next to Saturn or walk through a human capillary. Here is why schools are increasingly integrating VR into their educational programs.

## 1. Experiential Learning Without the Cost
School field trips are invaluable, but organizing logistics, transport, and safety for a trip to a distant museum or wildlife park can be costly and difficult.
* **The VR Solution:** With educational VR, students can take virtual field trips. They can tour the International Space Station, walk among ancient Egyptian tombs, or dive to the depths of the ocean—all within the safety of the school hall.

## 2. Visualizing Abstract Scientific Concepts
Subjects like physics, chemistry, and biology deal with phenomena that are invisible to the naked eye.
* **The VR Solution:** In VR, students can interact with molecules, build atoms, or see how electric circuits flow in 3D. Being able to scale objects up or down makes abstract concepts tangible and easier to grasp.

## 3. High Engagement and Information Retention
Traditional lecturing can struggle to compete with modern digital distractions. VR is fully immersive; when a student puts on the headset, there are no text notifications, classmates whispering, or window views to distract them.
* **The VR Solution:** Research shows that learning through immersion leads to higher emotional connection and up to **4x faster learning rates** compared to traditional classroom methods.

## 4. Empathy and Historical Understanding
History is often taught as a list of dates and events. VR allows students to step into the past and witness history firsthand.
* **The VR Solution:** Walking through Anne Frank's annex or standing on the deck of the Titanic gives students a profound sense of presence and perspective that textbooks simply cannot replicate.

---

### Bringing VR to Your School
At **Virtual Reality Guys**, we specialize in school VR demonstrations and curriculum-aligned workshops in Cape Town. We bring all the equipment, set it up, and run the sessions safely under student-teacher supervision.

Contact us to discuss how we can bring an immersive learning day to your school.
`
  },
  {
    title: 'What Age Can Children Use VR?',
    slug: 'what-age-can-children-use-vr',
    category: 'Tips & Guides',
    tags: ['Kids', 'Virtual Reality', 'Tips & Guides', 'Birthday Parties'],
    excerpt: 'Curious about the safety of VR for younger players? We discuss the recommended age limits, eye health considerations, and tips for parents hosting a kids VR party.',
    featured_image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop',
    reading_time: 4,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'What Age Can Children Use VR? Safety Guide | VR Guys',
    seo_description: 'Is VR safe for kids? Learn the age recommendations for VR headsets like Meta Quest, eye health tips, and how to set up a safe gaming environment.',
    content: `# What Age Can Children Use VR?

As Virtual Reality (VR) headsets become a standard feature at birthday parties, malls, and homes, a question we often hear from parents is: **"Is VR safe for my child, and at what age can they start playing?"**

Understanding the safety guidelines helps ensure kids have a fun, positive experience without any unnecessary strain. Here is a breakdown of age recommendations, eye health safety, and best practices.

## Headset Manufacturer Age Limits
Most VR headset manufacturers, including Meta (Oculus), HTC, and Sony, have set a minimum age guideline of **10 to 13 years old**. 

| Manufacturer / Device | Age Limit Recommendation |
| --- | --- |
| Meta Quest 2 / 3 | 10+ (recently lowered from 13+) |
| PlayStation VR2 | 12+ |
| Apple Vision Pro | 13+ |

### Why these age limits exist:
1. **Visual Development:** Children's eyes are still developing. Headsets feature lenses that project images directly in front of the eyes. Extended use before visual maturity could potentially affect binocular vision development.
2. **Interpupillary Distance (IPD):** This is the distance between the center of the pupils. VR headsets are designed to fit adult faces. If a child's IPD is too small, they will experience a blurry image, which can lead to eye strain and headaches.
3. **Physical Comfort:** VR headsets weigh between 400g and 600g. A young child's neck muscles may struggle with the weight, leading to fatigue.

## Best Safety Practices for Younger Kids
While the official guidelines recommend age 10+, younger children (e.g. 7-9 years old) can still enjoy VR occasionally, provided safety precautions are followed:

* **Keep Sessions Short:** A strict limit of **10 to 15 minutes** of playtime, followed by a break in the real world, prevents eye strain and motion sickness.
* **Adjust the Straps & IPD:** Ensure the headset is snug, weight is evenly distributed, and the lenses are adjusted to the child's eye width.
* **Supervise at All Times:** A designated adult should guide the child, ensuring they stay within the safe playing area and don't trip over physical objects.
* **Choose Appropriate Games:** Start with stationary, gentle games (like *Job Simulator* or *Tilt Brush*) rather than fast-paced rollercoasters or shooters that can induce nausea.

---

At **Virtual Reality Guys**, we prioritize safety. Our trained coordinators manage every event, ensuring headsets are adjusted properly, rotation schedules are enforced to prevent long sessions, and every child plays in a safe, monitored environment.
`
  },
  {
    title: 'Best VR Games for Birthday Parties',
    slug: 'best-vr-games-for-birthday-parties',
    category: 'Birthday Parties',
    tags: ['Birthday Parties', 'Virtual Reality', 'Kids', 'Mobile VR'],
    excerpt: 'Ready to game? Here is a curated list of the top multiplayer and single-player VR games that are perfect for birthday parties, keeping players and spectators fully entertained.',
    featured_image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop',
    reading_time: 5,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Best VR Games for Birthday Parties in Cape Town | VR Guys',
    seo_description: 'Planning a VR party? Here are the best, most entertaining VR games for kids and adults, including Beat Saber, Richie\'s Plank, and Job Simulator.',
    content: `# Best VR Games for Birthday Parties

When hosting a VR party, choosing the right games is the secret to a successful event. The best party games are easy to pick up, active, fast-paced, and—most importantly—just as fun to watch on a screen as they are to play in the headset.

Here is our handpicked selection of the best VR games for birthday parties.

## 1. Beat Saber
* **The Vibe:** Rhythm, neon lights, and light sabers.
* **How it works:** Players slice through flying blocks to the beat of popular songs.
* **Why it\'s great for parties:** Anyone can play it immediately. It gets people moving, and seeing someone dance while trying to hit blocks is great entertainment for the crowd.

## 2. Richie's Plank Experience
* **The Vibe:** Extreme heights and physical humor.
* **How it works:** The elevator opens, and you step out onto a thin plank 80 stories above a city.
* **Why it\'s great for parties:** It is the ultimate simulator challenge. The reactions of players stepping out onto the plank are always hilarious, making it a brilliant ice-breaker.

## 3. Job Simulator
* **The Vibe:** Lighthearted, humorous, and creative.
* **How it works:** In a world run by robots, players try out funny, exaggerated versions of jobs like Chef, Clerk, or Mechanic.
* **Why it\'s great for parties:** Perfect for younger children (7-12). It is non-competitive, highly interactive, and encourages experimentation.

## 4. Superhot VR
* **The Vibe:** Stylish action.
* **How it works:** Time only moves when the player moves. Dodging bullets, throwing bottles, and fighting enemies feels like stepping into *The Matrix*.
* **Why it\'s great for parties:** It forces players to move in slow motion, which looks incredibly funny to anyone watching from the outside.

## 5. Space Pirate Trainer
* **The Vibe:** Classic arcade shooter.
* **How it works:** Duel waves of flying robots using lasers, shields, and gravity hooks.
* **Why it\'s great for parties:** Quick rounds, clear high scores, and active physical gameplay. It is ideal for setting up a leader board tournament.

---

### Need help setting up?
We provide all of these games and more as part of our mobile VR hire services. Let our coordinators manage the gameplay and ensure everyone gets a turn at the controls.
`
  },
  {
    title: 'Why Virtual Reality Makes Team Building More Fun',
    slug: 'why-virtual-reality-makes-team-building-more-fun',
    category: 'Corporate Events',
    tags: ['Corporate Events', 'Team Building', 'Cape Town', 'Mobile VR'],
    excerpt: 'Ditch the boring trust falls. Find out how VR team building events encourage collaboration, communication, and problem-solving through fun virtual challenges.',
    featured_image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop',
    reading_time: 5,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Why VR Makes Team Building More Fun | Corporate VR Cape Town',
    seo_description: 'Transform your next corporate event with VR team building in Cape Town. Learn how immersive cooperative challenges build trust, leadership, and communication.',
    content: `# Why Virtual Reality Makes Team Building More Fun

Traditional team building events often get a bad reputation. Awkward ice-breakers and generic physical activities can leave employees feeling uninspired. If you are looking to truly engage your team, build trust, and spark collaboration, **Virtual Reality (VR)** offers a modern, high-tech alternative.

VR breaks down social barriers and places employees in scenarios that require active cooperation, quick communication, and collective problem-solving. Here is why VR is the future of corporate team building.

## 1. True Level Playing Field
In physical sports or outdoor activities, athletic ability often dictates who takes the lead. 
* **The VR Advantage:** VR is a fresh experience for almost everyone. Athletic skills don't apply, ensuring that every team member starts on equal footing, which encourages quieter employees to speak up and participate.

## 2. Emphasizes Verbal Communication
Cooperative VR games require team members to work together when only one of them can see the problem, or when they are in different virtual locations.
* **The VR Advantage:** In games like *Keep Talking and Nobody Explodes*, one person defuses a bomb while the rest of the team reads a manual. Success depends entirely on clear, calm, and precise verbal communication under pressure.

## 3. High Novelty and Shared Memories
A memorable team building event is one that people talk about back at the office.
* **The VR Advantage:** Flying through space, walking on a plank high above the city, or defending a castle from virtual attackers creates shared, unique memories that act as a strong social glue for the workplace.

## 4. Adaptable to Any Office Space
You don\'t need to rent an expensive outdoor venue or travel far.
* **The VR Advantage:** Our mobile VR setups can be deployed directly in your office boardroom, canteen, or conference room. It is completely weather-proof and fits into any corporate schedule.

---

### Plan Your Corporate VR Event
From small startups to large corporate events, we provide premium mobile VR team building packages in Cape Town. We handle transport, set up double or quad VR stations, and run the event with professional coordinators.

Contact us today to book an unforgettable corporate event!
`
  },
  {
    title: 'Indoor Birthday Party Ideas for Kids',
    slug: 'indoor-birthday-party-ideas-for-kids',
    category: 'Birthday Parties',
    tags: ['Birthday Parties', 'Kids', 'Cape Town', 'Event Ideas'],
    excerpt: 'Rainy day or winter birthday? Explore why mobile VR is the ultimate indoor birthday party solution for kids, bringing full-scale gaming entertainment directly to your living room.',
    featured_image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=1200&auto=format&fit=crop',
    reading_time: 4,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Indoor Birthday Party Ideas for Kids in Cape Town | VR Guys',
    seo_description: 'Looking for winter or indoor kids party ideas in Cape Town? Discover how mobile VR hire brings a full arcade experience directly to your home.',
    content: `# Indoor Birthday Party Ideas for Kids

Planning a kids\' birthday party in Cape Town during the winter months or on a rainy day can be stressful. Outdoor activities are risky, and standard indoor play gyms can get overcrowded and loud.

If you are looking for an indoor party solution that keeps kids active, fully entertained, and dry, **mobile VR hire** is the perfect option. Here is how you can host a premium indoor gaming party right in your living room or garage.

## Why Mobile VR is Perfect for Indoor Parties
* **Compact Setup:** You only need a clear space of about **3m x 3m** per headset. We can set up in a living room, double garage, or school hall.
* **Weather-Proof:** Rain, wind, or cold weather won\'t affect the fun. Kids play in a comfortable, indoor environment.
* **Trained Supervision:** Our packages include professional VR hosts who manage the equipment, load the games, and guide the children, leaving you free to relax.

## Tips for Hosting a Great Indoor VR Party
1. **Clear the Space:** Move coffee tables, rugs, and fragile objects out of the designated VR play area.
2. **Encourage Spectating:** We connect the VR headsets to large screen displays. This ensures the kids sitting on the couch can see exactly what the player in VR is seeing, making it a highly shared and social experience.
3. **Have a Scoreboard:** Draw up a simple tournament chart on a whiteboard. Write down scores for active games like *Fruit Ninja* or *Beat Saber* to keep kids cheering each other on.

---

### Book an Indoor VR Experience
Don\'t let Cape Town\'s unpredictable weather ruin your child\'s special day. Get in touch to discuss our mobile VR packages and secure a date for your indoor event.
`
  },
  {
    title: 'Educational VR Experiences for Schools',
    slug: 'educational-vr-experiences-for-schools',
    category: 'Schools',
    tags: ['Schools', 'Education', 'Virtual Reality'],
    excerpt: 'From swimming with blue whales to walking on the surface of Mars, discover the best educational VR experiences that align with school curricula and spark students curiosity.',
    featured_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    reading_time: 5,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Educational VR Experiences for Schools | VR Guys',
    seo_description: 'Explore curriculum-aligned educational VR experiences for schools. Virtual reality field trips, space exploration, anatomy, and historical tours.',
    content: `# Educational VR Experiences for Schools

Immersive technology is rewriting the rules of student engagement. In Cape Town, forward-thinking schools are using Virtual Reality (VR) to enrich their lesson plans. By transforming abstract curriculum topics into interactive 3D adventures, teachers can spark curiosity and improve learning outcomes.

Here are some of the top educational VR experiences currently available for schools.

## 1. Astronomy: Titans of Space
Instead of memorizing planet names from a flat diagram, students take a guided tour of the solar system.
* **The Experience:** Students float next to giant planets, compare the sizes of stars, and watch moons orbit in real time.
* **Curriculum Fit:** Natural Sciences, Geography.

## 2. Anatomy: The Body VR
Take a microscopic journey through the human body.
* **The Experience:** Travel inside the bloodstream, witness how red blood cells carry oxygen, and watch white blood cells attack viruses.
* **Curriculum Fit:** Life Sciences, Biology.

## 3. History: Anne Frank House VR
Step into history and experience the living conditions of Anne Frank and her family during WWII.
* **The Experience:** Walk through the secret annex in Amsterdam, recreated with photorealistic accuracy, providing deep emotional context.
* **Curriculum Fit:** Social Sciences, History.

## 4. Geography: Google Earth VR
Fly around the globe and explore cities, canyons, and mountains in stunning 3D.
* **The Experience:** Students can inspect the topography of Table Mountain, visit the Colosseum in Rome, or check out the scale of the Grand Canyon.
* **Curriculum Fit:** Geography, Environmental Studies.

---

### Schedule a Demo Day at Your School
At **Virtual Reality Guys**, we provide mobile VR solutions for educational exhibitions, science fairs, and classroom showcases. Our team handles the setup, safety briefing, and content management to ensure a smooth, educational, and inspiring day for students.
`
  },
  {
    title: 'Mobile VR vs Traditional Party Entertainment',
    slug: 'mobile-vr-vs-traditional-party-entertainment',
    category: 'Event Ideas',
    tags: ['Event Ideas', 'Tips & Guides', 'Birthday Parties', 'Mobile VR'],
    excerpt: 'Compare mobile VR hire with traditional party entertainment like jumping castles, clowns, or laser tag, and see why VR is the top-rated choice for modern Cape Town events.',
    featured_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    reading_time: 5,
    author: 'Virtual Reality Guys',
    status: 'draft',
    seo_title: 'Mobile VR vs Traditional Party Entertainment | Cape Town Events',
    seo_description: 'Comparing birthday party options in Cape Town. See how mobile VR rentals stack up against jumping castles, gaming trucks, and laser tag.',
    content: `# Mobile VR vs Traditional Party Entertainment

Planning a party or corporate gathering in Cape Town means sorting through dozens of entertainment options. Clowns, jumping castles, laser tag, and video game trucks are popular classics, but how do they compare to **Mobile Virtual Reality (VR) Hire**?

Here is a side-by-side comparison of mobile VR against traditional party entertainment to help you make the best choice for your next event.

## Comparison Breakdown

| Feature | Jumping Castle | Laser Tag | Mobile VR Hire |
| --- | --- | --- | --- |
| **Age Range** | Toddlers to early teens | 8 years to adults | 8 years to adults |
| **Weather Dependency** | High (wind/rain cancels it) | High (outdoor spaces) | Zero (completely indoors) |
| **Novelty Factor** | Low (common at parties) | Medium | Very High |
| **Activity Level** | High (jumping) | High (running) | Moderate to High |
| **Supervision Required** | Parents must watch closely | Managed by coordinator | Fully managed by VR hosts |

### 1. The Novelty & Wow Factor
While most kids have jumped on a castle or played laser tag before, many have never experienced high-quality, fully immersive Virtual Reality. The chance to walk on a skyscraper plank or defend a futuristic base with laser shields creates an instant draw and has high appeal.

### 2. Space and Weather Flexibility
Outdoor entertainment is highly vulnerable to Cape Town\'s sudden rainstorms or strong summer winds. Mobile VR is completely weatherproof. Setups can be arranged in a living room, garage, or office boardroom, requiring only a small, flat indoor area.

### 3. All-Inclusive Coordination
When renting a jumping castle, parents are typically responsible for watching the children to prevent injuries. With professional mobile VR hire, the package includes dedicated coordinators who handle the entire setup, clean the headsets between rounds, guide players, and run the party games, allowing parents to actually enjoy the event.

---

### Experience the Future of Party Fun
Ready to book something unique? Our mobile VR packages deliver state-of-the-art gaming directly to your Cape Town venue. Get in touch to learn more about our options.
`
  }
];

// 4. Seeding logic
async function seed() {
  console.log('Starting database seeding...');

  try {
    // Check if table exists and has rows
    const { data: existing, error: countError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);

    if (countError) {
      console.error('Error querying blog_posts table:', countError.message);
      console.log('Please ensure the tables are created by running supabase/blog.sql first.');
      process.exit(1);
    }

    if (existing && existing.length > 0) {
      console.log('Database already contains blog posts. Skipping seed to prevent duplicate entries.');
      process.exit(0);
    }

    console.log(`Inserting ${seedPosts.length} draft posts...`);
    const { data, error: insertError } = await supabase
      .from('blog_posts')
      .insert(seedPosts)
      .select();

    if (insertError) {
      console.error('Failed to insert seed posts:', insertError.message);
      process.exit(1);
    }

    console.log('Seeding completed successfully!');
    console.log(`Successfully seeded ${data.length} draft posts:`);
    data.forEach(p => console.log(` - [${p.category}] ${p.title} (Slug: ${p.slug})`));

  } catch (err) {
    console.error('Unexpected error during seeding:', err);
    process.exit(1);
  }
}

seed();
