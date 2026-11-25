// scripts/update-educational-vr-blog.js
// Updates the "educational-vr-experiences-for-schools" authority article (and related school article links) in Supabase.

const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

const envPath = path.join(__dirname, "..", ".env.local")
if (!fs.existsSync(envPath)) {
  console.error(".env.local file not found at:", envPath)
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, "utf8")
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, "m"))
  return match ? match[1].trim() : null
}

const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL")
const serviceRoleKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY")

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Supabase URL or Service Role Key missing in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const articleContent = `Imagine teaching learners about the solar system by allowing them to explore planets in three dimensions. Imagine explaining the human circulatory system by taking them inside the bloodstream. Or teaching the water cycle through an immersive environment where learners can explore each stage.

Virtual Reality creates opportunities to transform abstract educational concepts into experiences learners can see, explore and interact with.

At **Virtual Reality Guys**, we believe the future of educational VR goes beyond selecting games from a catalogue. We are developing immersive learning experiences informed by the South African curriculum, while giving schools the opportunity to propose entirely new educational experiences.

Whether you are a school principal evaluating educational technology, a Head of Department looking to enrich Natural or Life Sciences, or a classroom teacher searching for practical ways to help learners visualise complex syllabus topics, this guide explores how **educational VR experiences for schools** work—and how your school can both access existing simulations and help shape what gets built next.

---

## 1. What Is Educational Virtual Reality?

**Educational virtual reality (VR)** is the use of head-mounted 3D displays and spatial computing environments to help learners observe, explore, and interact with subject matter in three dimensions. Instead of looking at a flat representation on a page or projector screen, a learner wearing a VR headset is placed *inside* a computer-generated or 360-degree environment with true depth perception, scale, and spatial orientation.

However, not all virtual reality experiences offer the same type of learning. When planning [school VR demonstrations or programmes](/school-vr-demonstrations), it helps to distinguish between three distinct modes of educational VR:

| Educational VR Format | How Learners Experience It | Best Classroom Use Case |
| :--- | :--- | :--- |
| **1. Passive 360° Viewing** | Learners look around a pre-recorded spherical video or panoramic scene (such as a wildlife documentary or a guided museum walkthrough) without manipulating objects. | Introducing a new topic, building historical empathy, or observing real-world ecosystems and landmarks. |
| **2. Interactive 3D Exploration** | Learners navigate a three-dimensional model or environment—rotating organs, peeling back anatomical layers, changing planetary scale, or moving between rooms. | Understanding spatial relationships in anatomy, astronomy, geomorphology, and architecture. |
| **3. Guided Educational Simulations** | Learners actively perform tasks, test variables, connect components, or follow step-by-step scientific procedures inside a rule-based virtual environment. | Virtual chemistry titrations, electrical circuit building, industrial process walkthroughs, and spatial geometry problem-solving. |

Understanding these distinctions is essential. While a passive 360-degree tour is valuable for virtual field trips, many of the hardest concepts in the South African curriculum—such as cellular processes, electromagnetism, or three-dimensional trigonometry—benefit most from **interactive 3D environments and guided simulations** where learners can manipulate perspective and observe cause and effect.

---

## 2. Why Virtual Reality Has Potential in Education

Conventional classroom instruction relies heavily on two-dimensional media: textbook diagrams, chalkboard drawings, printed worksheets, and flat video clips. Skilled teachers use these tools remarkably well, yet certain topics remain difficult for learners to grasp simply because the underlying phenomenon is three-dimensional, microscopic, vast in scale, or invisible to the naked eye.

When thoughtfully integrated into a lesson plan, virtual reality offers several practical pedagogical advantages:

* **Visualising Abstract Concepts:** Topics such as atomic bonding, magnetic flux lines, DNA transcription, or planetary orbital planes require learners to build complex mental models from flat drawings. VR presents these structures directly in three-dimensional space, reducing the cognitive leap required to interpret 2D cross-sections.
* **Experiential Learning:** Rather than reading a list of stages in a process—such as how water is purified in a municipal treatment works or how blood flows through cardiac valves—learners can move through the sequence spatially and observe how each stage connects to the next.
* **Exploring Environments That Cannot Easily Be Visited:** Logistical costs, geographic distance, and safety regulations make it impossible for classes to visit deep-sea hydrothermal vents, the International Space Station, the inside of a power station turbine, or distant archaeological sites. VR brings safe, repeatable reconstructions of these environments into the school hall or classroom.
* **Interactive Learning and Agency:** In an interactive simulation, learners are not passive spectators. They can pick up a virtual specimen, isolate a skeletal layer, adjust a slider controlling Earth's axial tilt, or repeat a laboratory titration without consuming physical chemicals.
* **Spatial Understanding:** Fields such as Euclidean geometry, engineering graphics, anatomical dissection, and topographic map reading depend on spatial reasoning. Viewing objects from multiple angles in 1:1 or magnified scale helps learners connect flat schematic diagrams to real three-dimensional shapes.
* **Learner Curiosity and Focused Engagement:** Because a headset fills the learner's field of view, short, structured VR rotations naturally capture attention and spark questions. When learners remove the headset, they return to the classroom discussion with shared visual reference points that teachers can build upon.

> **A Note on Realistic Educational Expectations:** Virtual reality is not a magic shortcut that guarantees automatic improvements in exam marks, nor does it replace rigorous reading, writing, and problem-solving. Its true value lies in **conceptual clarity and spatial comprehension**—giving teachers a powerful visual tool to unlock topics where learners typically get stuck.

---

## 3. Educational VR Across the South African Curriculum

In South Africa, schools operate across diverse educational frameworks—most notably the national **CAPS (Curriculum and Assessment Policy Statement)** curriculum, the **IEB (Independent Examinations Board)** assessment framework, and international curricula such as **Cambridge Assessment International Education**.

Across all of these frameworks, teachers face a common challenge: **curriculum time is tight, and abstract syllabus topics often require substantial visual scaffolding.**

Our educational VR direction at Virtual Reality Guys is **curriculum-informed**—meaning we select existing simulations and evaluate new custom VR development projects around specific South African learning areas and grade levels:

* **Intermediate Phase (Grades 4–6):** In *Natural Sciences and Technology* and *Social Sciences*, learners are introduced to the solar system, ecosystems and food webs, states of matter, simple electrical circuits, South African physical geography, and early civilisations (such as Ancient Egypt and early Southern African kingdoms). Short, guided VR explorations make these foundational topics tangible.
* **Senior Phase (Grades 7–9):** As learners transition into deeper scientific and historical analysis, VR supports topics in *Life and Living* (cell structure, human circulatory, respiratory, and digestive systems), *Energy and Change* (forces, series and parallel circuits, electromagnetism), *Planet Earth and Beyond* (the lithosphere, mining, atmosphere, and astronomy), *Geography* (geomorphology, weathering, and mapwork), and *History* (World War II and turning points in South African history).
* **Further Education and Training — FET Phase (Grades 10–12):** In senior secondary grades, syllabus concepts become highly abstract and spatially demanding. Immersive simulations can support **Life Sciences** (cellular respiration, biodiversité, human nervous and endocrine systems, homeostatic organs), **Physical Sciences** (chemical bonding, titrations, electrodynamics, kinematics), **Geography** (fluvial geomorphology, climatology, catchment management), **Engineering Graphics and Design (EGD)**, and **Mathematics** (3D Euclidean geometry and trigonometry).

Crucially, effective curriculum integration requires **grade appropriateness and teacher guidance**. An experience suitable for a Grade 11 Life Sciences class studying cardiac pathology will differ in terminology and complexity from an experience designed for Grade 5 learners discovering the skeletal system. VR sessions work best when framed by the educator before immersion and consolidated through classroom discussion or worksheets afterwards.

---

## 4. Examples of Educational VR Experiences

To help educators see what immersive learning looks like in practice, below are **ten subject areas** showing how virtual reality can be applied in schools.

In keeping with our commitment to transparency, we clearly distinguish between **Available Experiences** (simulations already in our [educational VR catalogue](/school-vr-demonstrations#experience-catalogue) that schools can book for demonstrations today) and **Proposed / Custom Development Examples** (curriculum-informed concepts that schools can request or propose for evaluation by our VR development team).

### 4.1 Space Exploration and Astronomy

* **What Learners Experience:** Learners step outside Earth's atmosphere to float beside planets, moons, dwarf planets, and stars rendered at comparative scale, or board historical and modern spacecraft in orbit.
* **What They Can Explore or Interact With:** Compare the diameter of Earth against Jupiter and the Sun, observe orbital paths and moon phases in three dimensions, operate lunar lander controls, or move through zero-gravity compartments aboard the International Space Station.
* **Educational Concepts Illustrated:** Planetary scale and relative distance, orbital mechanics, gravity, rotation versus revolution, seasonality, phases of the Moon, and the history of spaceflight.
* **Subjects & Grades That Benefit:** CAPS *Natural Sciences: Planet Earth and Beyond* (Grades 4–9), *Physical Sciences* (Grades 10–12), and *Geography*.
* **Availability Status:**
  * **Available Experiences:** [*Titans of Space PLUS*](/vr-games-catalogue/titans-of-space), [*Cosmic XR*](/vr-games-catalogue/cosmic-vr), [*Mission: ISS*](/vr-games-catalogue/mission-iss), [*Apollo 11 VR*](/vr-games-catalogue/apollo-11-vr), [*Shuttle Commander*](/vr-games-catalogue/shuttle-commander), and [*Sky Overview 360*](/vr-games-catalogue/overview-360) are available now for school demonstrations.
  * **Proposed Custom Opportunity:** An interactive *Earth–Moon–Sun Seasonality and Southern Hemisphere Sky Simulator* allowing learners to manipulate Earth's 23.5° axial tilt and test solar/lunar eclipse alignments.

### 4.2 Human Anatomy and Biology

* **What Learners Experience:** Instead of trying to interpret flat anatomical charts, learners stand before a life-size or magnified 3D human body model and journey inside major organ systems.
* **What They Can Explore or Interact With:** Isolate the skeletal, muscular, nervous, cardiovascular, or digestive systems; peel back tissue layers; inspect heart chambers and valves from multiple angles; and observe how organs fit together inside the thoracic and abdominal cavities.
* **Educational Concepts Illustrated:** Structure and function of human organ systems, musculoskeletal mechanics, pulmonary and systemic blood circulation, gaseous exchange in the lungs, and homeostatic organ structure.
* **Subjects & Grades That Benefit:** CAPS *Natural Sciences: Life and Living* (Grades 5–9) and FET *Life Sciences* (Grades 10–12).
* **Availability Status:**
  * **Available Experiences:** [*Human Anatomy VR*](/vr-games-catalogue/human-anatomy-vr) and [*Inside COVID-19*](/vr-games-catalogue/inside-covid19) (volumetric respiratory and immune visualisation) are available for school demonstrations.
  * **Custom Development Opportunity:** Guided interactive journeys through the **human circulatory system**, the **human digestive system** (peristalsis, enzyme action, and villi absorption), or the **human nervous system and reflex arc** can be proposed by schools for custom development evaluation.

### 4.3 Cells and Microorganisms

* **What Learners Experience:** Learners are shrunk to a microscopic scale and transported across a semi-permeable cell membrane into the interior of a living cell.
* **What They Can Explore or Interact With:** Navigate through cytoplasm to locate the nucleus, mitochondria, ribosomes, endoplasmic reticulum, and Golgi apparatus; observe DNA transcription and translation into proteins; and see how viruses bind to cellular receptors.
* **Educational Concepts Illustrated:** Plant versus animal cell structure, organelle functions, cellular respiration, protein synthesis, DNA/RNA structure, and immune responses to pathogens.
* **Subjects & Grades That Benefit:** Senior Phase *Natural Sciences* (Grades 8–9) and FET *Life Sciences* (Grades 10–12).
* **Availability Status:**
  * **Available Experiences:** [*Cellverse*](/vr-games-catalogue/cellverse) and [*Inside COVID-19*](/vr-games-catalogue/inside-covid19) are available in our current school library.
  * **Custom Development Opportunity:** Schools can propose curriculum-specific cellular simulations—such as comparing mitosis and meiosis in 3D or visualising osmosis and active transport across plant root hair cells.

### 4.4 Ecosystems and Biodiversity

* **What Learners Experience:** Learners are immersed in terrestrial and marine habitats—from coral reefs and kelp forests to tropical rainforests and African savannas—observing living organisms in their natural ecological context.
* **What They Can Explore or Interact With:** Observe predator-prey interactions, inspect coral polyps at a microscopic scale, witness blue whales and reef biodiversity in 360 degrees, and follow conservation scientists in the field.
* **Educational Concepts Illustrated:** Food chains and trophic levels, biodiversity, adaptation, marine biology, habitat conservation, and human impact on fragile ecosystems.
* **Subjects & Grades That Benefit:** *Natural Sciences* (Grades 4–9), *Social Sciences: Geography*, and FET *Life Sciences* (Grades 10–11 Environmental Studies).
* **Availability Status:**
  * **Available Experiences:** [*Ecosphere*](/vr-games-catalogue/ecosphere), [*The Blue*](/vr-games-catalogue/the-blue), [*Ocean Rift*](/vr-games-catalogue/ocean-rift), and [*Hold the World*](/vr-games-catalogue/hold-the-world) (virtual natural history specimen study) are available for school demonstrations.
  * **Proposed Custom Opportunity:** Interactive explorations of **South African biomes**—such as Cape Floral Kingdom fynbos adaptations, Karoo succulent ecology, or estuarine food webs.

### 4.5 Geography and Landscapes

* **What Learners Experience:** Learners fly over three-dimensional satellite terrain, stand atop mountain ranges, kayak past Antarctic glaciers, or inspect river valleys and fault lines from an aerial perspective.
* **What They Can Explore or Interact With:** Zoom from orbital views down to street or canyon level; compare relief profiles of Table Mountain, the Drakensberg escarpment, and the Grand Canyon; and examine glacial landforms and coastal erosion.
* **Educational Concepts Illustrated:** Geomorphology, fluvial processes (meanders, oxbow lakes, drainage basins), plate tectonics, folding and faulting, relief and contour interpretation, and glaciology.
* **Subjects & Grades That Benefit:** CAPS *Social Sciences: Geography* (Grades 4–9) and FET *Geography* (Grades 10–12).
* **Availability Status:**
  * **Available Experiences:** [*Google Earth VR*](/vr-games-catalogue/google-earth-vr), [*National Geographic Explore VR*](/vr-games-catalogue/natgeo-explore), [*Wander*](/vr-games-catalogue/wander), and [*Everest VR*](/vr-games-catalogue/everest-vr) are available now.
  * **Proposed Custom Opportunity:** Interactive **geological formations and river catchment simulations** where learners manipulate rainfall, slope gradient, and rock strata permeability to observe erosion and runoff in real time.

### 4.6 South African History and Heritage

* **What Learners Experience:** Learners step inside historically reconstructed rooms, ancient monuments, and archaeological sites to experience history spatially rather than solely as a list of dates.
* **What They Can Explore or Interact With:** Walk through the rooms of the Secret Annex in Amsterdam during World War II, inspect laser-scanned Egyptian tomb hieroglyphics and the internal passages of the Great Pyramid, or explore classical Roman architecture.
* **Educational Concepts Illustrated:** World War II and human rights (Grade 9 & FET History), Ancient Egypt (Grade 5 CAPS Social Sciences), archaeological evidence, heritage preservation, and historical empathy.
* **Subjects & Grades That Benefit:** CAPS *Social Sciences: History* (Grades 5–9) and FET *History* (Grades 10–12).
* **Availability Status:**
  * **Available Experiences:** [*Anne Frank House VR*](/vr-games-catalogue/anne-frank-vr), [*Great Pyramid VR*](/vr-games-catalogue/great-pyramid), [*Nefertiti: Journey to Eternity*](/vr-games-catalogue/nefertiti-tomb), and [*Colosseum VR*](/vr-games-catalogue/colosseum-vr) are available for school sessions today.
  * **Proposed Custom Opportunity:** We are keen to partner with South African schools to develop local heritage environments—such as an immersive reconstruction of the **Kingdom of Mapungubwe**, early Southern African Iron Age settlements, or significant milestones in South African constitutional history.

### 4.7 Physics and Electricity

* **What Learners Experience:** Learners enter a virtual physics and physical sciences environment where invisible forces—such as electric current, voltage potential, magnetic fields, and relativistic motion—are made visible in three dimensions.
* **What They Can Explore or Interact With:** Conduct virtual laboratory experiments in [*10K Science*](/vr-games-catalogue/10k-science) and [*Virtual Lab Chemistry*](/vr-games-catalogue/virtual-lab-chem), or explore velocity and relativity thought experiments in [*Hallo Einstein*](/vr-games-catalogue/hallo-einstein).
* **Educational Concepts Illustrated:** States of matter, chemical reactions, acid-base titrations, kinematics, frames of reference, electric circuits, Ohm's law, and electromagnetism.
* **Subjects & Grades That Benefit:** CAPS *Natural Sciences: Energy & Change / Matter & Materials* (Grades 6–9) and FET *Physical Sciences* (Grades 10–12).
* **Availability Status:**
  * **Available Experiences:** [*10K Science*](/vr-games-catalogue/10k-science), [*Virtual Lab Chemistry*](/vr-games-catalogue/virtual-lab-chem), and [*Hallo Einstein*](/vr-games-catalogue/hallo-einstein) are available now.
  * **Proposed Custom Opportunity:** An interactive **Electricity and Electromagnetism VR Lab** where learners wire series and parallel circuits, visualise electron flow and voltage drops in 3D, and inspect magnetic field lines around current-carrying conductors and AC generators.

### 4.8 Engineering and Industrial Systems

* **What Learners Experience:** Learners step inside complex machinery, aerospace cockpits, water purification works, or power generation facilities that are normally off-limits or hazardous for school excursions.
* **What They Can Explore or Interact With:** Operate spacecraft instrumentation and robotic arms in [*Shuttle Commander*](/vr-games-catalogue/shuttle-commander), or—in custom-developed environments—walk through cutaway 3D views of industrial turbines, hydraulic systems, and municipal water treatment stages.
* **Educational Concepts Illustrated:** Mechanical and electrical systems, hydraulics and pneumatics, energy conversion in power stations, water purification and sanitation engineering, and structural design.
* **Subjects & Grades That Benefit:** *Natural Sciences and Technology* (Grades 4–6), Senior Phase *Technology* (Grades 7–9), and FET *Engineering Graphics and Design (EGD)*, *Civil Technology*, and *Electrical Technology*.
* **Availability Status:**
  * **Available Experiences:** [*Shuttle Commander*](/vr-games-catalogue/shuttle-commander) and [*Sky Overview 360*](/vr-games-catalogue/overview-360) are available in our catalogue.
  * **Proposed Custom Opportunity:** A **Virtual Water Treatment Plant** walkthrough or an interactive **Power Station & Renewable Energy Grid Simulator**—both prime examples of school-requested custom VR experiences.

### 4.9 Mathematics and Geometry

* **What Learners Experience:** Learners step inside a three-dimensional mathematical workspace where geometric solids, coordinate planes, vectors, and functions exist as objects they can walk around and manipulate.
* **What They Can Explore or Interact With:** Experience spatial scale and logical proportion puzzles in [*Curious Alice*](/vr-games-catalogue/curious-alice), or—in proposed custom mathematics environments—slice 3D polyhedra with intersecting planes, unfold prisms into 2D surface-area nets, and inspect angles of elevation and depression in 3D trigonometry.
* **Educational Concepts Illustrated:** Properties of 3D objects, surface area and volume, Euclidean geometry riders, 3D trigonometry, Cartesian coordinates, and spatial transformations.
* **Subjects & Grades That Benefit:** CAPS and IEB *Mathematics* (Grades 4–12) and *Technical Mathematics*.
* **Availability Status:**
  * **Available Experience:** [*Curious Alice*](/vr-games-catalogue/curious-alice) (spatial scale and logic puzzles) is available now.
  * **Proposed Custom Opportunity:** A dedicated **3D Euclidean Geometry, Polyhedra & Spatial Trigonometry Environment** designed around Senior and FET Phase mathematics objectives.

### 4.10 Environmental Science

* **What Learners Experience:** Learners investigate the chemical and ecological processes driving climate change, ocean acidification, water scarcity, and ecosystem resilience.
* **What They Can Explore or Interact With:** Shrink to the level of a coral reef in Stanford's [*Ocean Acidification VR*](/vr-games-catalogue/ocean-acidification) to observe how dissolved carbon dioxide alters seawater pH and affects calcifying marine life, or track conservation efforts across vulnerable habitats in [*Ecosphere*](/vr-games-catalogue/ecosphere).
* **Educational Concepts Illustrated:** The carbon cycle, greenhouse effect, ocean acidification, pH chemistry, water catchment sustainability, and biodiversity conservation.
* **Subjects & Grades That Benefit:** *Natural Sciences* (Grades 7–9), *Life Sciences* (Grades 10–12), and *Geography*.
* **Availability Status:**
  * **Available Experiences:** [*Ocean Acidification VR*](/vr-games-catalogue/ocean-acidification) and [*Ecosphere*](/vr-games-catalogue/ecosphere) are available for immediate school demonstrations.
  * **Proposed Custom Opportunity:** Interactive **South African Water Cycle, Drought & Catchment Management** simulations tailored to regional environmental challenges.

---

## 5. What Makes Curriculum-Informed VR Different?

A common pitfall in educational technology is mistaking novelty for learning. Putting a learner into an arcade roller coaster or an action game may be exciting for a school fun day, but **meaningful educational VR is not simply entertainment with an educational label attached.**

For a virtual reality experience to deliver genuine classroom value, it should be built or selected around seven core principles:

1. **A Defined Learning Objective:** Every session should answer a clear pedagogical question—for example, *"How do the four chambers and valves of the mammalian heart prevent the mixing of oxygenated and deoxygenated blood?"*
2. **Appropriate, Accurate Educational Content:** Visual models, proportions, processes, and terminology must be scientifically and historically sound rather than stylised for arcade drama.
3. **Age-Appropriate Comfort and Design:** Both the cognitive load and the physical comfort (stationary or gentle movement to prevent motion sickness, appropriate session length, and proper headset fit) must suit the age of the learners.
4. **Meaningful Interaction:** Interactive controls should direct attention *toward* the concept being taught—such as isolating an organ layer, connecting a circuit switch, or rotating a geometric solid—rather than distracting learners with unrelated mini-games.
5. **Relevant Explanations and Visual Cues:** Labels, guided narration, or spatial callouts should help learners connect what they see in 3D back to the terms used in their textbooks and assessments.
6. **Opportunities to Check Understanding:** Whether through in-headset checkpoints or structured post-session teacher questions, learners should be prompted to articulate what they observed and why it happens.
7. **A Direct Relationship With Classroom Teaching:** Immersive VR is most effective when it is embedded into a teacher's lesson sequence. **The VR experience should complement the teacher—never replace the teacher.**

---

## 6. Can Schools Request Their Own VR Experiences?

**Yes—and this is one of the most important ways Virtual Reality Guys differs from conventional mobile VR providers.**

When we speak with principals, Heads of Department, and teachers, they frequently mention specific topics in the South African curriculum where learners struggle year after year. Often, no off-the-shelf VR application exists for that exact syllabus requirement, or international software overlooks local South African context.

Because Virtual Reality Guys has **in-house VR development capabilities**, schools are not restricted to choosing from a fixed catalogue. **Schools can propose topics, subjects, or specific learning challenges they believe would benefit from virtual reality.**

### How Our Proposal Evaluation Works

We want educators to feel welcome to share their ideas—while being completely transparent about how development decisions are made. Submitting a custom VR request does not mean every proposed idea will automatically be built. Instead, our team evaluates each request across four key dimensions:

* **Curriculum Relevance:** How closely does the proposed experience support CAPS, IEB, or international curriculum learning objectives, and how many learners or grades could benefit?
* **Educational Value:** Does three-dimensional immersion or spatial interaction genuinely solve the learning challenge better than a video, diagram, or physical classroom demonstration?
* **Technical Feasibility:** Can the concept be accurately, comfortably, and reliably simulated on standalone school VR hardware?
* **Development Requirements:** What 3D modelling, programming, educational review, timeline, and budget specifications would be required to build it properly?

### Practical Examples of Custom Requests From Schools

A teacher or academic department might approach us with questions such as:

* *"Our Grade 10 Life Sciences learners struggle to visualise how blood flows through the heart and lungs—can we build an interactive exploration of the human circulatory system?"*
* *"Can we create a step-by-step journey through the human digestive system showing enzyme action and absorption in the small intestine?"*
* *"We want our Grade 6 and Grade 9 Natural Sciences learners to see how a municipal water treatment plant or coal/renewable power station operates from the inside."*
* *"Can we develop a respectful 3D reconstruction of the Kingdom of Mapungubwe to support our Social Sciences History curriculum?"*
* *"Our Mathematics department wants an interactive 3D Euclidean geometry environment where learners can inspect planes and cross-sections inside polyhedra."*

If your school has a concept like this, you can [submit a Custom VR Development Enquiry on our School VR page](/school-vr-demonstrations#propose-custom-vr) to start a conversation with our development team.

---

## 7. How Virtual Reality Guys Develops Educational Experiences

When a custom educational VR concept is selected for development—or when we expand our own curriculum-informed library—our development journey follows a structured, collaborative progression:

1. **Understanding the Educational Requirement:** We begin by consulting with educators to understand the classroom challenge, target grade level, and common learner misconceptions.
2. **Identifying the Learning Objectives:** Together, we define the specific takeaways learners should understand after completing the 8-to-15-minute immersive experience.
3. **Researching the Subject Matter:** We gather accurate scientific, geographical, engineering, or historical reference materials aligned with South African curriculum expectations.
4. **Designing the Immersive 3D Environment:** Our designers plan the spatial scale, visual hierarchy, comfort settings, and step-by-step learner journey.
5. **Developing Interactive Elements:** Our VR developers build the 3D assets, spatial audio, labels, and interactive mechanics that allow learners to explore and test concepts actively.
6. **Reviewing Educational Suitability:** We review the prototype against the intended learning objectives to ensure clarity, accuracy, and grade appropriateness.
7. **Testing Comfort and Usability:** We test frame rates, visual comfort, and intuitive controls so learners who have never worn a VR headset can navigate the experience effortlessly.
8. **Preparing for School Delivery:** Finally, the experience is packaged for reliable deployment on standalone VR headsets during supervised school sessions.

---

## 8. Bringing VR Learning Into Schools

A school does not need its own VR laboratory, IT maintenance staff, or capital hardware budget to introduce learners to immersive education. Through our [mobile school VR demonstrations and educational programmes](/school-vr-demonstrations), Virtual Reality Guys handles the practical delivery directly at your campus:

* **Classroom & Subject Demonstrations:** We set up 4 to 8 standalone VR headsets inside a classroom, science lab, library, or hall, rotating learners through focused 8-to-15-minute curriculum modules.
* **Science, Technology & STEM Days:** High-engagement educational stations curated around space, biology, chemistry, physics, and engineering for science weeks and innovation expos.
* **Teacher-Guided & Shared Viewing:** Where supported by the experience and venue setup, headset views can be cast to a spectator screen so teachers can point out structures and guide whole-class observation while learners wait for their turn.
* **Supervision, Safety & Hygiene:** Our facilitators map physical Guardian safety boundaries, assist every learner with headset fitting, manage session timing, and sanitise every headset interface with anti-bacterial wipes between rotations.

---

## 9. The Future of Educational VR in South Africa

Most commercial educational software available globally is built for North American or European classrooms. While universal topics like the solar system or cell biology travel well across borders, South African learners and teachers also deserve immersive content that reflects their own country and curriculum.

Our long-term ambition at Virtual Reality Guys is to progressively build an extensive library of educational VR experiences informed by the South African curriculum—with a strong focus on **local relevance**:

* **South African Geography & Geomorphology:** Exploring the Drakensberg escarpment, Table Mountain sandstone formations, the Great Karoo, and local river catchment systems.
* **Indigenous Ecosystems & Wildlife:** Experiencing the unique biodiversity of the Cape Floral Kingdom (fynbos), marine Benguela and Agulhas current ecosystems, and savanna conservation.
* **South African History & Heritage:** Reconstructing historical and archaeological sites—such as Mapungubwe, the Cradle of Humankind, and key moments in South African history—so learners across the country can explore their heritage regardless of travel budgets.
* **Local Infrastructure & Industries:** Visualising how South African water treatment plants, renewable energy installations, power stations, agricultural systems, and engineering projects operate.
* **Regional Environmental Challenges:** Helping learners investigate water scarcity, alien invasive vegetation, coastal management, and sustainable energy in a South African context.
* **South African Classroom Realities:** Designing experiences that work reliably in real South African classrooms, without requiring permanent high-speed internet or expensive school-owned hardware.

Building this library is a progressive, long-term journey—and we believe the best way to build it is in partnership with South African educators.

---

## 10. How Your School Can Get Involved

Whether your school is based in [Cape Town, the Western Cape](/educational-vr-cape-town), or elsewhere in South Africa, there are four immediate ways to collaborate with Virtual Reality Guys:

1. **Explore Existing Educational VR Experiences:** Browse our [subject-by-subject school VR catalogue](/school-vr-demonstrations#experience-catalogue) or our [complete VR experiences catalogue](/vr-games-catalogue) to see the simulations already available across Space, Biology, Chemistry, Physics, Geography, and History.
2. **Request a School Demonstration:** Book a supervised classroom session, STEM day, or introductory teacher/HOD showcase via our [School Demonstration Enquiry form](/school-vr-demonstrations#book-school-demo).
3. **Propose an Educational Topic:** Tell us which syllabus concept your learners find hardest to visualise by submitting a [Custom VR Development Enquiry](/school-vr-demonstrations#propose-custom-vr).
4. **Discuss a Custom Development Opportunity:** Speak directly with our team on [our main School VR Experiences & Custom Development page](/school-vr-demonstrations) or [contact us](/contact) to explore how we can bring your curriculum to life.`

const updatedWhySchoolsContent = `Education is shifting from passive listening to active spatial exploration. In classrooms across Cape Town and South Africa, teachers are looking for practical ways to capture learners' attention and explain complex, three-dimensional concepts. Among these tools, **Educational Virtual Reality (VR)** offers unique potential when paired with strong classroom teaching.

Rather than only reading about the solar system or looking at a flat diagram of a cell, learners can put on a VR headset to compare planetary orbits in three dimensions or step inside a microscopic cellular environment. Here is why schools are increasingly integrating VR into their educational programmes—and how [Virtual Reality Guys' school VR demonstrations and custom development](/school-vr-demonstrations) support South African educators.

## 1. Experiential Learning for Hard-to-Visit Environments
School field trips are invaluable, but organising logistics, transport, and safety for a trip to a distant museum, industrial plant, or heritage site can be costly and difficult.
* **The VR Solution:** With [educational VR experiences for schools](/blog/educational-vr-experiences-for-schools), learners can take supervised virtual field trips. They can explore the International Space Station, examine ancient Egyptian tombs, or observe marine ecosystems—all within the safety of the school hall or classroom.

## 2. Visualising Abstract Scientific and Mathematical Concepts
Subjects like Natural Sciences, Life Sciences, Physical Sciences, and Mathematics deal with phenomena that are microscopic, vast in scale, or invisible to the naked eye.
* **The VR Solution:** In VR, learners can inspect 3D anatomical layers, observe cellular organelles, or conduct virtual chemistry titrations safely. Being able to view structures in three dimensions helps bridge the gap between flat textbook diagrams and spatial understanding.

## 3. Focused Attention and Classroom Discussion
When a learner puts on a VR headset for a structured 8-to-15-minute rotation, their field of view is completely focused on the learning environment.
* **The VR Solution:** Short, guided VR experiences spark immediate curiosity and give the entire class shared visual reference points that teachers can build upon during post-session discussions and worksheet activities.

## 4. Custom Curriculum-Informed VR Development
Beyond existing off-the-shelf simulations, schools often have specific CAPS or IEB syllabus topics that are difficult to demonstrate using conventional resources.
* **The VR Solution:** At Virtual Reality Guys, schools are not restricted to a fixed catalogue. Educators can [propose new educational VR topics](/school-vr-demonstrations#propose-custom-vr)—such as a virtual water treatment plant, an interactive circulatory system journey, or a South African heritage reconstruction—for our development team to evaluate.

---

### Bringing VR to Your School
At **Virtual Reality Guys**, we specialise in [school VR demonstrations and custom educational VR development](/school-vr-demonstrations) in Cape Town and South Africa. We bring the equipment, set up safe classroom rotations, sanitise headsets between every learner, and work alongside your teachers to bring your curriculum to life.`

async function run() {
  console.log("Updating 'educational-vr-experiences-for-schools' in Supabase...")
  const now = new Date().toISOString()

  const { data: updatedMain, error: mainError } = await supabase
    .from("blog_posts")
    .update({
      title: "Educational VR Experiences for Schools: Bringing the South African Curriculum to Life",
      excerpt:
        "Imagine teaching learners about the solar system in 3D, exploring the human circulatory system from inside the bloodstream, or walking through the water cycle. Discover how curriculum-informed educational VR and custom school-proposed VR development bring South African classrooms to life.",
      featured_image: "/images/vr-school.jpg",
      category: "Schools",
      tags: [
        "Schools",
        "Educational VR",
        "South African Curriculum",
        "CAPS Curriculum VR",
        "Custom VR Development",
        "Immersive Learning",
        "Virtual Reality in Education",
      ],
      reading_time: 14,
      author: "Virtual Reality Guys",
      status: "published",
      seo_title:
        "Educational VR Experiences for Schools: South African Curriculum Guide | Virtual Reality Guys",
      seo_description:
        "Explore how educational VR experiences bring the South African curriculum to life. Discover 10 subject examples, CAPS-informed VR learning, and how schools can propose custom VR experiences.",
      content: articleContent,
      updated_at: now,
    })
    .eq("slug", "educational-vr-experiences-for-schools")
    .select("id, title, slug, seo_title, reading_time, updated_at")
    .single()

  if (mainError) {
    console.error("Failed to update educational-vr-experiences-for-schools:", mainError.message)
    process.exit(1)
  }

  console.log("Updated main article:", updatedMain)

  const { data: updatedSecondary, error: secError } = await supabase
    .from("blog_posts")
    .update({
      content: updatedWhySchoolsContent,
      updated_at: now,
    })
    .eq("slug", "why-schools-are-using-virtual-reality-for-learning")
    .select("id, title, slug")
    .single()

  if (secError) {
    console.warn("Warning updating secondary school post:", secError.message)
  } else {
    console.log("Updated related school article:", updatedSecondary)
  }
}

run()
