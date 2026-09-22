// Default copy for the homepage, About, Portfolio and Sensei-Hood pages, taken from Kweku's
// Landing Page, About, Portfolio and Sensei-Hood documents. Stored in the content table under the
// keys noted beside each export; these values are the fallback and the seed.
import type {
  AboutPage,
  FeaturedWorkItem,
  Film,
  HomeAbout,
  MentorStory,
  PortfolioGroup,
  SenseiPage,
  ServiceItem,
  SkillGroup,
  Stat,
  TestimonialItem,
} from '../types';

// ---------- Home ----------

export const HERO_ROLES = 'Digital Strategy. Creative Vision. Art Direction'; // hero.subtitle
export const HERO_TAGLINE = 'I help brands tell stories that shift culture, create impact and allow customers to fall in love'; // hero.title
export const HERO_DESCRIPTION = // hero.description
  'An eclectic thinker and a writer at heart who has become a force in creative direction, with skills in digital strategy in advertising and marketing, website and social media copywriting, creative writing and video editing. He is an award-winning photographer and a mercurial journalist with published pieces written for the Cincinnati Opera and OU Student News Bureau.';
export const HERO_IMAGE = '/img/hero-portrait.png'; // hero.image
export const HERO_STATS: Stat[] = [ // hero.stats
  { number: '21.7K', label: 'First-week campaign streams' },
  { number: '5', label: 'Major publications featured' },
];

export const FILMS: Film[] = [ // home.films
  { title: 'The 5foot3 Story', video: 'https://www.youtube.com/watch?v=IkioLhgPOzQ' },
];

export const SERVICES_INTRO = 'Combining creativity with strategic thinking to deliver results that exceed expectations.'; // services.description
export const SERVICES: ServiceItem[] = [ // services.list
  {
    icon: '🎯',
    title: 'Digital Strategy & Creative Direction',
    description:
      'Full, end-to-end creative vision for brands, artists, and cultural projects, curated into advertising and marketing campaigns that generate organic trends, meteoric visibility, and sustained engagement. A proven track record of growing brand visibility and launching independent artists and projects on limited budgets, from concept development and artistic direction to final execution across video, photography, and digital content.',
  },
  {
    icon: '✍️',
    title: 'Copywriting & Journalism',
    description:
      "Creative writing, video scripts, journalistic articles, and website copy that converts. Crafting compelling narratives for brands from tech startups to luxury real estate, with published work in major outlets. Master's degree in Journalism from Ohio University with a focus on representation and storytelling.",
  },
  {
    icon: '📸',
    title: 'Photography & Video Editing',
    description:
      "Commercial photography specializing in portraiture and fashion, with an acumen for video editing and content creation. Master's degree in Visual Communication from Ohio University with a focus on representation and storytelling.",
  },
  {
    icon: '🎬',
    title: 'Executive Production for Cultural & Social Impact Projects',
    description:
      'A grant-winning, exhibition-featured photography project documenting Black cosplay culture and identity in anime fandom. Mainstream success with three socially impactful music projects with KooKusi, exploring mental health and socio-cultural issues, the Ghanaian immigrant experience, and disability.',
  },
];

export const FEATURED_CASES: FeaturedWorkItem[] = [ // featured.cases
  { title: 'Cincinnati Opera’s Black Opera Project: Lalovavi', year: '2026', category: 'Creative Direction', image: '/img/cs-lalovavi-stage.jpg', video: '', url: '', caseStudy: 'lalovavi' },
  { title: 'NEXT', year: '2026', category: 'Website & Socials', image: '/img/cs-next-cover.jpg', video: '', url: 'https://www.nextohio.com/', caseStudy: '' },
  { title: 'Ohio University Music Industry Summit: The Launchpad MAG (Vol 2)', year: '2026', category: 'Creative Direction', image: '/img/cs-launchpad-cover.jpg', video: '', url: '', caseStudy: 'launchpad-mag' },
  { title: 'This Ability', year: '2025', category: 'Executive Production', image: '/img/cs-this-ability-cover.jpg', video: '', url: '', caseStudy: 'this-ability' },
];

export const FEATURED_WORK: FeaturedWorkItem[] = [ // featured.work
  { title: 'Tekura', year: '', category: 'Video copywriting', image: '/img/fw-tekura-cover.jpg', video: '', url: 'https://www.instagram.com/reel/CiVMa79jKTG/', caseStudy: '' },
  { title: 'The 5foot3 Story', year: '', category: 'Film', image: '', video: 'https://www.youtube.com/watch?v=IkioLhgPOzQ', url: '', caseStudy: '5foot3' },
  { title: 'Here I Am', year: '', category: 'Kinpee ft. Li & Evance', image: '', video: 'https://www.youtube.com/watch?v=I5FIkqipNjY', url: '', caseStudy: '' },
  { title: 'Welcome to the DVRE MOVEMENT', year: '', category: 'The Li Chronicles', image: '', video: 'https://www.youtube.com/watch?v=aNimMhiVQ8A', url: '', caseStudy: '' },
  { title: 'AfrOtakus: Black Cosplay Culture', year: '2025', category: 'Photography', image: '/img/cs-afrotakus-cover.jpg', video: '', url: '', caseStudy: 'afrotakus' },
  { title: 'VARIANT MAGAZINE: DIVINITY [Robert Wun]', year: '', category: 'Journalism', image: '/img/fw-variant-cover.jpg', video: '', url: 'https://issuu.com/vrntmagazine/docs/vrnt_falldraft7.2_compressed', caseStudy: '' },
];

export const HOME_ABOUT: HomeAbout = { // home.about
  lead: 'The last Diaw is a storyteller who was touched by an angel from the moment he was born. Intrigued by stories and communication, he sat at the feet of the gods, listening and studying the art of storytelling.',
  body: 'He has a way with words that translates into images, visuals and messages that create impact and resonate with the humanity in his audience. A multi-hyphenate thinker crafting stories through digital strategy, copywriting, photography, and video editing, from capturing Black cosplay culture to launching independent artists to mainstream success.',
  statNumber: '3',
  statLabel: 'Socially impactful music projects with KooKusi, from mental health to disability',
};

export const SKILLS: SkillGroup[] = [ // skills.list
  { title: 'Creative Direction & Strategy', items: ['Digital Campaigns', 'Brand Storytelling', 'Social Media Strategy', 'Content Strategy', 'Executive Production'] },
  { title: 'Copywriting', items: ['Creative Writing', 'Web Copywriting', 'Journalism & Script Writing', 'Social & Video Copywriting'] },
  { title: 'Commercial Photography', items: ['Portrait Photography', 'Cosplay Photography', 'Fashion Photography'] },
];

export const SERVICE_OPTIONS = [ // options in the contact form
  'Digital Strategy & Creative Direction',
  'Copywriting & Journalism',
  'Photography & Video Editing',
  'Executive Production',
  'Life, Career or Accountability Coaching',
  'Speaking Engagements & Workshops',
  'Something else',
];

export const CONTACT_INTRO = // contact.intro
  "I'm open to working on remote and in-person projects that help brands and businesses tell their stories creatively. Whether it's photography, copywriting, marketing strategy, or cultural projects, let's talk.";
export const CONTACT_LOCATION = 'Athens, Ohio, USA'; // contact.location

// ---------- Testimonials (About page, and the first three on the homepage) ----------

export const TESTIMONIALS: TestimonialItem[] = [ // testimonials.list
  { author: 'Stan Alost', text: 'Kweku’s talent, originality, and drive set him apart. He raises the standard of any team he joins, not just through his creative skill, but through his character and professionalism.' },
  { author: 'Kofi Kusi Boadum', text: 'Over the past five years, I’ve worked on five social-impact art projects, none of which would exist without Kweku Diaw. Having Kweku as an executive director, artist, and creative mirror from concept development through post-release assessment has been a true blessing.' },
  { author: 'Lee Jones', text: 'What distinguishes Kweku is his ability to own projects from end to end. He approaches creative work with the mindset of a builder, taking responsibility for both the output and the infrastructure behind it. Whether refining editorial voice or ensuring cohesion across visual and written elements, he demonstrates an advanced understanding of modern media ecosystems.' },
  { author: 'Sarah Logue', text: 'Kweku’s digital savvy, combined with a strong work ethic and collaborative spirit, enables him to create content that resonates and drives positive social change.' },
  { author: 'Paapa hMensa', text: 'He possesses a rare ability to see the emotional, cultural, and aesthetic layers of a project and synthesize them into a cohesive, compelling narrative. His contributions are never superficial; they reshape the work itself. This capacity to elevate the work of others while simultaneously asserting a distinctive artistic voice is one of the many qualities that make him irreplaceable.' },
  { author: 'Richard Miller', text: 'He is able to connect with individuals and tell compelling stories through his photography, writing and his expertise in advertising. He has put himself through hours of rigorous training and self-improvement, which is evident through his leadership positions, awards, and significant recognition.' },
  { author: 'Jane Faakye', text: 'A perfect fit for elevating any company. His extensive knowledge and expertise in creative direction, advertising, copywriting, and photography made an instant impact with our establishment.' },
];

// ---------- About ----------

export const ABOUT_PAGE: AboutPage = { // about.page
  name: 'Kweku [Qweyy-Ku]',
  origin: 'Fante, Wednesday Born',
  meaning: 'Endowed with intelligence, adaptability, tenacity and spiritual awareness',
  intro: 'The name is Diaw, Kweku Diaw. As it stands, I am the last Diaw.',
  wordsTitle: 'Words I Live By',
  words: `My oldest brother says, nothing is devastating and that hope is bigger. My other brother says, you will remember the name. I believe in them both. Hope is always bigger and because of that, you will remember the name.

I’m a wordsmith at heart as you can tell, and family means a lot to me. I picked up the pen in high school and underwent many trials and experiences to become the man I am today. It’s by grace and an intent to be the best version of myself to serve humanity. My ethos is simple: be present, make memories and don’t postpone the future.`,
  professional:
    'A multifaceted visual communicator, music journalist, and digital strategist with an MA in Visual Communication and an MS in Journalism from Ohio University. My work spans copywriting, marketing strategy, photography, and journalism, always with a focus on storytelling that drives results.',
  mission:
    "I'm driven by a desire to document artistic movements and create work at the intersection of visual communication and storytelling. Whether it's Black cosplay culture, independent music, or brand narratives, I believe in making the invisible visible.",
  portfolioBlurb: `An eclectic thinker whose mind bridges the arts and sciences, revealing the beauty in simple things. Kweku has maintained his core as a writer at heart, making his fortitude in creative and art direction, including skills in digital and creative strategy, copywriting, journalism, advertising, photography, and video.

His career began in digital products and advertising agencies, where he gained most of his formative experience helping brands use digital technology and storytelling to scale. His talents have evolved from writing to strategy and creative direction, with notable awards and recognition for his journalistic writing and photography.`,
  artistTitle: '"Li" / "The Beast"',
  artist:
    "Unlike those who tell their stories through song and rap, I deliver my message through the aesthetic art of spoken word & poetry. I'm a faith-based, eclectic individual who dreams that words will one day break through to the core of humanity and revive a dying breed of individuals to be more human.",
  artistVideo: 'https://www.youtube.com/watch?v=Jpduu_rZt9I',
  philosophyQuote: 'Everyone is searching, except the pilot in airplane mode.',
  philosophyVideo: 'https://www.youtube.com/watch?v=F-lUQnX0fYQ',
  artistry:
    'From the dust of the garden city, the concrete that boasts proudly of the rich ancestry of the Ashanti Kingdom, the footprints of the iconic Oseikrom Aberanteɛ, and the ominous, anthemic sound of the Asakaa movement, comes another Kumasi-bred native with fire in his belly and a message on his tongue.',
  artistryVideo: 'https://www.youtube.com/watch?v=id5CzeKZJD4',
  artistPortfolioUrl: 'https://thelichronicles.mypixieset.com/',
  lifeCoach:
    'Beyond the work, I coach. As a life coach, career coach and accountability partner, I talk to people, listen to their souls, and help them find their own path forward.',
};

// ---------- Portfolio ----------

const LAUNCHPAD_VOL1 =
  'https://catmailohio-my.sharepoint.com/my?id=%2Fpersonal%2Fkd449322%5Fohio%5Fedu%2FDocuments%2FLaunchpad%20Mag%20Final%20Version%2Epdf&parent=%2Fpersonal%2Fkd449322%5Fohio%5Fedu%2FDocuments';
const CO = (y: string, title: string, url: string) => ({ year: y, title, outlet: 'Cincinnati Opera', url, caseStudy: '' });
const OU = (y: string, title: string, url: string) => ({ year: y, title, outlet: 'Ohio University Student News Bureau', url, caseStudy: '' });

export const PORTFOLIO_INTRO = // portfolio.intro
  'Creative direction, writing, photography, and executive production across arts institutions, universities, brands, and independent artists.';

export const PORTFOLIO_GROUPS: PortfolioGroup[] = [ // portfolio.groups
  {
    title: 'Creative Direction',
    description: '',
    entries: [
      { year: '2026', title: 'Cincinnati Opera’s Black Opera Project: Lalovavi', outlet: '', url: '', caseStudy: 'lalovavi', image: '/img/cs-lalovavi-stage.jpg' },
      { year: '2026', title: 'NEXT', outlet: '', url: 'https://www.nextohio.com/', caseStudy: '', image: '/img/cs-next-cover.jpg' },
      { year: '2026', title: 'Ohio University Music Industry Summit: The Launchpad MAG (Vol 2)', outlet: '', url: '', caseStudy: 'launchpad-mag', image: '/img/cs-launchpad-cover.jpg' },
      { year: '2025', title: 'Ananse’s Journey', outlet: '', url: 'https://www.anansesjourney.com/', caseStudy: '', image: '/img/cs-ananse-cover.jpg' },
      { year: '2025', title: 'Ohio University Music Industry Summit: The Launchpad MAG (Vol 1)', outlet: '', url: LAUNCHPAD_VOL1, caseStudy: '', image: '' },
      { year: '2026', title: 'Inaugural Scripps Career Success Day', outlet: '', url: '', caseStudy: 'scripps-career-success-day', image: '/img/cs-scripps-schedule.jpg' },
    ],
  },
  {
    title: 'Creative Writing, Copywriting & Journalism',
    description: '',
    entries: [
      CO('2026', 'Full Circle: CCM student-turned-Associate Professor José Maria Condemi directs Salome after its 26-year absence', 'https://www.cincinnatiopera.org/blog-database/2026/6/12/full-circle-ccm-student-turned-ccm-associate-professor-jos-maria-condemi-directs-salome-after-its-26-year-absence'),
      CO('2026', 'The Canvas of Honeysuckle Poetry: Tifara Brown’s Life and Path to Lalovavi', 'https://www.cincinnatiopera.org/blog-database/2026/6/15/the-canvas-of-honeysuckle-poetry-tifara-browns-life-and-path-to-lalovavi'),
      CO('2026', '2026 Press Release for SALOME', 'https://www.broadwayworld.com/bwwopera/article/SALOME-to-Open-Cincinnati-Operas-2026-Summer-Festival-at-Music-Hall-20260605'),
      CO('2026', '30 Seasons of Light: Thomas Hase, Cincinnati Opera’s Lighting Director', 'https://www.cincinnatiopera.org/blog-database/2026/7/9/30-seasons-of-light-thomas-hase-cincinnati-operas-lighting-director'),
      CO('2026', 'Cincinnati Opera Black Opera Project Spawns Partnerships with CYBP & CinSei', 'https://www.cincinnatiopera.org/blog-database/2026/7/7/cincinnati-opera-black-opera-project-lalovavi-spawns-partnerships-with-cybp-amp-cinsei'),
      CO('2026', 'Building Worlds: Dr. Sam Martin on Defining the Aesthetic of “Rise of Titan: A Prequel to Lalovavi”', 'https://www.cincinnatiopera.org/blog-database/2026/7/27/building-worlds-dr-sam-martin-on-defining-the-aesthetic-of-rise-of-titan-a-prequel-to-lalovavi'),
      { year: '2025', title: 'Welcome to unmatte!', outlet: 'unmatte Magazine', url: 'https://unmatte.com/articles/design-at-your-fingertips-welcome-to-unmatte/', caseStudy: '' },
      { year: '', title: 'VIS Magazine, Issue 2', outlet: 'VIS Magazine', url: 'https://online.fliphtml5.com/izcah/pmxp/', caseStudy: '' },
      OU('2025', 'Revolutionizing reporting', 'https://www.ohio.edu/news/2025/06/revolutionizing-reporting'),
      OU('2025', 'The Dozers: OHIO’s graduating siblings', 'https://www.ohio.edu/news/2025/06/dozers-ohios-graduating-siblings'),
      OU('2025', 'Centering community voices in research', 'https://news.ohio.edu/news/2025/05/centering-community-voices-research'),
      OU('2025', 'Still delivering', 'https://www.ohio.edu/news/2025/05/still-delivering'),
      OU('2025', 'Forever OHIO: A network beyond OHIO’s walls', 'https://www.ohio.edu/news/2025/04/forever-ohio-network-beyond-ohios-walls'),
      OU('2025', 'The keys to success: A pianist’s journey from Venezuela to Athens', 'https://www.ohio.edu/news/2025/04/keys-success-pianists-journey-venezuela-athens'),
      OU('2025', 'From Kenya to Ohio: Bridging continents through music', 'https://www.ohio.edu/news/2025/03/kenya-ohio-bridging-continents-through-music'),
      OU('2024', 'Protecting the green for the greater good', 'https://news.ohio.edu/news/2024/12/protecting-green-greater-good'),
      OU('2024', 'From OHIO to NASA', 'https://news.ohio.edu/news/2024/11/ohio-nasa'),
      OU('2024', 'A ray of musical greatness', 'https://news.ohio.edu/news/2024/11/ray-musical-greatness'),
      OU('2024', 'At the cutting edge of wellness', 'https://www.ohio.edu/news/2024/10/cutting-edge-wellness'),
      OU('2024', 'OHIO’s Sigma Delta Pi chapter earns National Hispanic Honors Recognition', 'https://www.ohio.edu/news/2024/10/ohios-sigma-delta-pi-chapter-earns-national-hispanic-honors-recognition'),
      OU('2024', 'Realizing impact: Lessons from a summer business program', 'https://www.ohio.edu/news/2024/09/realizing-impact-lessons-summer-business-program'),
      OU('2024', 'Breaking barriers with beep baseball: Dr. David Wanczyk’s journey to Senegal', 'https://www.ohio.edu/news/2024/08/breaking-barriers-beep-baseball-dr-david-wanczyks-journey-senegal'),
      OU('2024', 'Celebrated for work in the counseling field: Dr. Christine Bhat', 'https://www.ohio.edu/news/2024/07/celebrated-work-counseling-field-dr-christine-bhat'),
      OU('2024', 'Undergrad GM: A summer job with the Copperheads', 'https://www.ohio.edu/news/2024/07/undergrad-gm-summer-job-copperheads'),
      OU('2024', 'Undergrad takes the lead: An OVST summer classic', 'https://www.ohio.edu/news/2024/07/undergrad-takes-lead-ovst-summer-classic'),
      OU('2024', 'OHIO’s anime community', 'https://news.ohio.edu/news/2024/06/ohios-anime-community'),
      OU('2024', 'Creating a world for animation enthusiasts', 'https://www.ohio.edu/news/2024/06/creating-world-animation-enthusiasts'),
      OU('2024', 'Robot Wars', 'https://www.ohio.edu/news/2024/06/robot-wars'),
      OU('2024', '‘The most fun I’ve ever had’: Singing group takes new approach', 'https://www.ohio.edu/news/2024/05/most-fun-ive-ever-had-singing-group-takes-new-approach'),
      OU('2024', 'A safe space for exploring contemporary dance', 'https://news.ohio.edu/news/2024/05/safe-space-exploring-contemporary-dance'),
      OU('2024', 'Sports & Academia: A safe pair of hands, senior interior architecture major wins second place in the OSCARS', 'https://www.ohio.edu/news/2024/04/safe-pair-hands-senior-interior-architecture-major-wins-second-place-oscars'),
      OU('2024', 'Artificial Intelligence: New AI student organization opens a dialogue', 'https://news.ohio.edu/news/2024/02/new-ai-student-organization-opens-dialogue'),
      OU('2024', 'Acting & Hollywood: A winding path to Hollywood', 'https://news.ohio.edu/news/2024/02/winding-path-hollywood'),
      { year: '2020–26', title: 'Web copy for NEXT, Ananse’s Journey, Hubject & PayPlux', outlet: 'Brand copywriting', url: '', caseStudy: '' },
    ],
  },
  {
    title: 'Photography',
    description: '',
    entries: [
      { year: '', title: 'Photography Portfolio', outlet: '', url: 'https://app.notion.com/p/Photography-Portfolio-1943a70062e480e69446c1f66366d42e', caseStudy: '' },
      { year: '2025', title: 'Basiet x Frances', outlet: '', url: '', caseStudy: '' },
      { year: '2025', title: 'AfrOtakus: Black People & Cosplay', outlet: '', url: '', caseStudy: 'afrotakus', image: '/img/cs-afrotakus-cover.jpg' },
    ],
  },
  {
    title: 'Executive Production',
    description: '',
    entries: [
      { year: '2025', title: 'This Ability', outlet: '', url: '', caseStudy: 'this-ability' },
      { year: '2023', title: 'Greetings From Abroad', outlet: '', url: '', caseStudy: 'greetings-from-abroad' },
      { year: '2022', title: '5foot3', outlet: '', url: '', caseStudy: '5foot3' },
    ],
  },
];

// ---------- Sensei-Hood ----------

export const SENSEI_PAGE: SenseiPage = { // sensei.page
  quote: 'With great power comes great responsibility.',
  quoteSource: 'Uncle Ben / Aunt May',
  origins: `I ain’t no hero though. Certainly not a revolutionary or any of these assigned labels that breathe life into the cosmos. I haven't lived that long for all my hair to turn into a crown of wisdom and I don’t think I’ve seen the world nearly enough. But I’ve experienced a lot. I’ve had to stare into the abyss and figure out the shape of my soul. I’ve had the privilege of being able to understand life’s hopeful and brightest sparks. I am not a hero, just a young lad who believes the world can be a better place if we can be better people.

We can only change the world by changing the next man. That’s what I do. I believe I am a servant of humanity and so the gifts of discernment, knowledge and wisdom are at my beck and call to help people. That’s what I do. I talk to people and I listen to their souls. I share perspectives and challenge their beliefs and values all while being empathetic to the hardships of life and helping them seek their own version of justice for their lives.

Life is hard, you know. But there’s too much beauty in it for you to give up. I’m here to help.`,
  roles: ['Life Coach (LC)', 'Career Coach (CC)', 'Accountability Partner (AP)'],
};

export const MENTORS: MentorStory[] = [ // mentors.list
  {
    name: 'Joey Micah Earley',
    bio: 'Graduated in May 2025 from Ohio University with a BS in Visual Communications, specializing in Commercial Photography. Currently working part-time for the Cleveland Cavaliers Youth Sports Organization (The Cavalittles).',
    goals: 'Doing work for a sports team in either photography or social media, and eventually becoming a media manager for a team, preferably an NBA or NFL franchise.',
    challenges: 'Lots of rejection and, with that, a loss of motivation. In the first few months out of school I was working a part-time job I didn’t love and wasn’t making great money at. Putting in application after application and getting rejected and ghosted was incredibly difficult to deal with.',
    strategies: 'Applications, LinkedIn connections and alumni connections.',
    guidance: `Kweku always reminded me that the journey is not short or easy. It takes hard work and dedication to your craft and the process. It can be really difficult to see you’re making progress when you’re in the thick of it; sometimes it takes someone outside to make you see you are in fact moving toward the goal, even if it’s just in small strides.

It’s also incredibly helpful to have someone to bounce ideas off of, or just to “shout into the void” with. Every time I’ve come to Kweku with a problem or having wound myself up, he’d tell me a different way to approach it, or let me throw ideas at the wall until we had a solution.`,
    milestones: 'I got my first job in my field, at my dream corporation.',
    outcome: `I feel stronger doing the hard but necessary things. Now I know little bumps may arise, but I have the tools to deal with them. I’ve started to notice how pivotal the little investments are for the whole outcome, and I work on the nitty gritty just as hard as the big projects.

I used to really struggle with networking, but now I’m able to reframe it so it’s less scary. I’ve had a massive mindset change in the way I view my work and my branding, paying attention to the little things, from handing out business cards to how my tone comes across online.`,
    present: 'I’m focused on the ways I can make my work better and how I can continue to improve. There’s so much left to do, but I feel more confident in myself and my work than I did before.',
    recommendation: 'Working with Kweku is truly a joy. He’s incredibly caring, hardworking, and determined. He pushes me constantly to be a better version of myself and work hard. Though, he also encourages me to play just as hard as I work!',
  },
  {
    name: 'Ewura-Adjoa Dzidzor Tossou',
    bio: 'Graduated in July 2023 from Central University with a BA in Communications and Media Studies. Currently a Digital Content Creator at Studio Wavure.',
    goals: 'Becoming a maestro and a fortitude of counsel in everything content creation and social media.',
    challenges: 'Establishing my confidence in the digital media and communications field, and landing jobs that elevate my career and match my professional aspirations.',
    strategies: 'Applications and connections.',
    guidance: 'I’ve worked with Kweku as my career coach for three years, and it’s been transformative. What sets him apart is his ability to see situations from multiple angles. He doesn’t just give you surface-level advice. He reads the room, understands the nuances, and gives you direction that actually makes sense for where you are and where you’re trying to go.',
    milestones: 'I’ve gotten into jobs without feeling overwhelmed or out of place, knowing that I have the skills, the abilities and minerals to step up.',
    outcome: 'Kweku helped me decode the unspoken rules of professional spaces. He showed me how to navigate ambiguity, how to position myself strategically, and how to enter any opportunity with the right mindset. More than that, he understands the unique pressures and struggles that come with building a career, especially when you’re trying to break through in competitive spaces.',
    present: 'Confidently getting more experience, learning to negotiate better terms for the jobs I take on, and grounding myself in my skills and abilities.',
    recommendation: 'If you’re looking for someone who will challenge you, guide you with clarity, and genuinely invest in your growth, Kweku is that person. His vision extends beyond individual coaching; he has the strategic insight to take an entire company forward. Wherever he shows up, progress follows. I can’t recommend him highly enough.',
  },
  {
    name: 'Sharon Boaduwaa Boadu',
    bio: 'Graduated in June 2025 from the University of Birmingham with a master’s degree in Development Politics and Policy, with a Mo Ibrahim Foundation internship. Worked as a Community Safety Officer at the University of Birmingham and hosts and produces Gospel Epics on Switch Radio in Birmingham. Now an NHS Graduate Trainee.',
    goals: 'Working in a specialised student support role at management level, and thriving in radio presenting and production.',
    challenges: 'It’s been incredibly hard navigating a new life in a strange land, trying to build a better life for myself while being aware of everything I need to unlearn and learn to make that happen. It’s an emotional and mental rollercoaster. The UK immigration system is also really challenging, and it’s hard to live life fully when you feel like you are on a timeline.',
    strategies: `Holding on to faith and trusting God. Applying for jobs. Learning my current job to be excellent at it. Consistency and creativity in radio.

Holding on to faith helps me deal with the disappointment when things don’t go my way. Applying for jobs is my faith at work, because faith without works is dead. Learning my current job and being consistent in radio gives me something else to focus on and equips me for the future.`,
    guidance: 'Kweku has primarily been my voice of reason and reality check for a while. His unique perspective on life almost always challenges the status quo and gets me thinking in a completely different way. I always leave our conversations with more information, something to think about, and feeling challenged. He is also an incredible listener. With Kweku, no topic is off limits, and that allows me to be unapologetically myself without fearing judgement.',
    milestones: 'The first and only Gospel show on Switch Radio Birmingham, and significant strides at work compared to when I started.',
    outcome: 'Increased awareness of the realities of life. Moving to the UK has allowed me to face life by myself, on my terms, and make big decisions in every aspect of my life. This awareness has made me more sober-minded than I was before.',
    present: 'I am still learning how to carry this higher level of awareness while living a full, flourishing life rooted in growth and healing rather than pessimism.',
    recommendation: 'If you want to be challenged in everything, get different perspectives, get excellent work or service, be in a non-judgemental space and have the support of someone who is genuine and wants the best out of everything he touches, then Kweku is the person for you.',
  },
];
