// On-site case studies. Copy comes from Kweku's case-study documents (Lalovavi, This Ability,
// Scripps Career Success Day) and the original site copy (Greetings From Abroad, 5foot3, AfrOtakus).
// Stored in the `casestudies.list` content key; this file is the default and the seed.
import type { CaseStudy } from '../types';

const NOTION_STRATEGY = 'https://pollen-shadow-f66.notion.site/Strategy-Marketing-Portfolio-d76e1226ea30460c81a3ab217912922d';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'lalovavi',
    title: 'Building Community Around Cincinnati Opera’s Black Opera Project',
    year: '2026',
    category: 'Creative Direction',
    client: 'Cincinnati Opera',
    role: 'Communications, marketing & strategy',
    summary:
      'Storytelling, strategy, and community partnerships around the world premiere of Lalovavi, an Afrofuturist opera from Cincinnati Opera’s Black Opera Project.',
    cover: '/img/cs-lalovavi-stage.jpg',
    stats: [
      { number: 'Sold out', label: 'Second performance' },
      { number: '2', label: 'Community partners: CinSei & CYBP' },
      { number: '3-opera', label: 'Commissioning initiative' },
    ],
    sections: [
      {
        heading: 'Brief',
        body: `For years, Cincinnati Opera developed the Black Opera Project, a groundbreaking three-opera commissioning initiative to bring Black stories and Black creators to the operatic stage. In the summer of 2026, that vision became reality with the world premiere of Lalovavi, an Afrofuturist opera by composer Kevin Day and librettist Tifara Brown.

The Black Opera Project was designed to illuminate the resilience and heritage of the Black American experience while creating opportunities for artists of color. The initiative and the reality of it on stage represented a significant moment for Cincinnati Opera and for the broader cultural community.

I joined Cincinnati Opera as a summer communications intern working across communications, marketing, and strategy at this particularly significant moment. As a Black creative storyteller, avid anime and video game fan, and someone whose own creative work explores Black identity and representation, Lalovavi meant more. The opera’s Afrofuturist world, its use of Tutnese, a coded language developed by enslaved African Americans, and its focus on Black imagination gave me a personal connection to the story.

Rather than approaching the project solely as a communications assignment, I saw an opportunity to explore the people, communities, and cultural intersections behind the opera and to use those connections to expand how Cincinnati audiences could encounter the work. My role became one of storyteller, strategist, and connector: documenting the people behind Lalovavi, identifying community partnerships that could extend its reach, and creating communications opportunities that positioned the opera as more than a performance.`,
        bullets: [],
      },
      {
        heading: 'Humanize the project through storytelling',
        body: `The Black Opera Project was a major institutional initiative, but its significance was best understood through the people who brought it to life. I sought to document the lived experiences, creative journeys, and motivations of the people behind Lalovavi, including librettist Tifara Brown and the world builder, Dr. Sam Martin.

My profile of Tifara Brown explored her journey from performance poet and storyteller to history-making librettist, tracing her relationship with Black Southern culture, oral storytelling, Afrofuturism, and cultural legacy. My interview with Dr. Sam Martin detailed her background and how she became the craftsman for the visual identity of Rise of Titan, the original comic book prequel to Lalovavi.

My interviews went beyond the basic production narrative:`,
        bullets: [
          'Who are the originators and pioneers of this work?',
          'What personal experiences brought them to opera?',
          'Why was this story important for them to tell?',
          'What does it mean to see an all-Black creative team and story on the operatic stage?',
          'How could audiences understand the cultural significance of Lalovavi beyond the theater?',
        ],
      },
      {
        heading: 'Find the cultural intersections',
        body: `Lalovavi existed at the intersection of several cultural worlds: opera, Black storytelling, Afrofuturism, anime and manga, sci-fi, fantasy, escapism, community, young Black professionals, and popular culture. Its anime and manga-adjacent visual language created a way to reach audiences who might not typically see themselves represented in opera.

Rather than treating those communities as an afterthought, I looked for organizations and cultural spaces where those connections already existed. That led to partnerships with:`,
        bullets: [
          'CinSei: a Black-owned Cincinnati third space centered around anime, manga, community, and matcha.',
          'Cincinnati Young Black Professionals (CYBP): an organization creating community, professional networking, and social opportunities for Black professionals in Cincinnati.',
        ],
      },
      {
        heading: 'Turn partnerships into experiences',
        body: `Rather than simply asking a community organization to promote a show, the strategy was to create an experience in which the community could engage with the creators. At a CinSei-hosted gathering, Tifara Brown and Kevin Day spoke with CYBP members about the origins of the opera, their creative process, and what they hoped audiences would experience at the world premiere.

This approach aligned with Cincinnati Opera’s larger belief that opera should be accessible to everyone and that the organization should meet communities where they are. The wider strategy combined:`,
        bullets: [
          'Human-centered storytelling, artist profiles, and interviews',
          'Community partnerships and cross-cultural audience development',
          'Editorial and media relationships',
          'Social and digital storytelling',
          'Community-facing events',
          'Positioning Lalovavi beyond traditional opera audiences',
        ],
      },
      {
        heading: 'Results',
        body: `Lalovavi premiered successfully during Cincinnati Opera’s 2026 Summer Festival. The production sold out and generated a profit for Cincinnati Opera, demonstrating that a project centered on Black stories and creators could create both cultural impact and commercial value.

The result was particularly meaningful because the communications strategy did not depend on treating Black audiences as a niche market. Instead, it positioned Lalovavi as a culturally significant work with multiple points of entry for audiences across Cincinnati. The Community Open Dress Rehearsal programming connected Brown and the creative team with young people, including workshops at the Hamilton County Youth Center that inspired students to create original rap songs based on the Lalovavi story and their own experiences.

The Black Opera Project demonstrated the power of communications when it moves beyond broadcasting information and begins creating connections.`,
        bullets: [
          'Interviewed and documented key creative voices behind Lalovavi',
          'Identified and helped establish a collaboration between Cincinnati Opera, CinSei, and CYBP',
          'Connected the opera’s creative team with Cincinnati’s Black professional community',
          'Approached marketing as community building rather than a purely promotional function',
          'The opening show was spectacular, and the second show sold out',
        ],
      },
    ],
    gallery: [
      '/img/cs-lalovavi-scene.jpg',
      '/img/cs-lalovavi-duet.jpg',
      '/img/cs-lalovavi-finale.jpg',
      '/img/cs-lalovavi-ensemble.jpg',
      '/img/cs-lalovavi-rise-of-titan.jpg',
      '/img/cs-lalovavi-cybp.jpg',
      '/img/cs-lalovavi-cinsei.jpg',
      '/img/cs-lalovavi-cinsei-2.jpg',
    ],
    videos: [],
    links: [
      {
        label: 'The Canvas of Honeysuckle Poetry: Tifara Brown',
        url: 'https://www.cincinnatiopera.org/blog-database/2026/6/15/the-canvas-of-honeysuckle-poetry-tifara-browns-life-and-path-to-lalovavi',
      },
      {
        label: 'Building Worlds: Dr. Sam Martin',
        url: 'https://www.cincinnatiopera.org/blog-database/2026/7/27/building-worlds-dr-sam-martin-on-defining-the-aesthetic-of-rise-of-titan-a-prequel-to-lalovavi',
      },
      {
        label: 'Partnerships with CYBP & CinSei',
        url: 'https://www.cincinnatiopera.org/blog-database/2026/7/7/cincinnati-opera-black-opera-project-lalovavi-spawns-partnerships-with-cybp-amp-cinsei',
      },
    ],
  },
  {
    slug: 'this-ability',
    title: 'This Ability',
    year: '2025',
    category: 'Executive Production',
    client: 'KooKusi',
    role: 'Executive production & campaign strategy',
    summary:
      'An interdisciplinary audiovisual mental health project telling the story of Ghanaian basketball icon Emmanuel “Clock” Eckow Amoako.',
    cover: '/img/cs-this-ability-cover.jpg',
    stats: [
      { number: 'CARE', label: 'Accepted into Culture for Mental Health' },
      { number: 'USC', label: 'Taught in a Music & Disability Studies seminar' },
    ],
    sections: [
      {
        heading: 'Brief',
        body: `At the time of this writing, the artist known as KooKusi is no longer an underground artist. He might not be the most commercial, mainstream Ghanaian artist, but with his ever-growing catalog and the themes he’s tackled in his projects, he’s carved out quite a name for himself. After his collaborative effort with RBD, a fellow Ghanaian rapper, KooKusi took to the studio again, this time with a project born out of the true story of an athlete he knew back in Ghana.

This Ability is an interdisciplinary audiovisual mental health project that tells the real-life story of Emmanuel Eckow Amoako, a Ghanaian basketball icon born with anisomelia (limb length discrepancy), for which he earned the nickname “Clock”. Inspired by the lack of awareness of the silent battles disability comes with, the project explores the stigma associated with disability, the accompanying inferiority complex, and the resilience and faith an individual shows to navigate life with the condition.

Developed under the creative movement 5footbreed, the project blends hip-hop, choral music, poetry, documentary journalism, photography, live performance, and digital storytelling. It was created to draw attention to the often overlooked mental health impact of stigma aimed at disabled people, to empower those battling low self-esteem, and to celebrate a heroic survivor who overcame the psychological burden of a physical disability.`,
        bullets: [],
      },
      {
        heading: 'Goals',
        body: '',
        bullets: [
          'Release the project record by record, each with visuals carrying its song and message as an individual campaign, building into one coherent story. It was the first project in KooKusi’s catalog to use an audiovisual documentary release rather than a single-led album drop.',
          'Raise major awareness of the project’s themes in music, academic, and health circles.',
          'Get the project recognized by prestigious organizations.',
          'Get the songs onto major playlists on streaming platforms.',
        ],
      },
      {
        heading: 'Major achievements',
        body: '',
        bullets: [
          'Accepted into the Europe-based CARE – Culture for Mental Health project.',
          'Used in higher education by Professor Alexandria Carrico, who incorporated This Ability into her Music and Disability Studies seminar at the University of South Carolina.',
        ],
      },
    ],
    gallery: ['/img/cs-this-ability-tracklist.jpg', '/img/cs-this-ability-230.jpg'],
    videos: ['https://www.youtube.com/watch?v=Jpduu_rZt9I'],
    links: [],
  },
  {
    slug: 'scripps-career-success-day',
    title: 'Inaugural Scripps Career Success Day',
    year: '2026',
    category: 'Creative Direction',
    client: 'Ohio University Scripps College of Communication',
    role: 'Event concept, planning & program coordination',
    summary:
      'A first-of-its-kind career event helping graduating communication students face life after college with alumni and industry leaders.',
    cover: '/img/cs-scripps-schedule.jpg',
    stats: [{ number: '1st', label: 'Edition, with the Dean’s blessing for more' }],
    sections: [
      {
        heading: 'Brief',
        body: `Exploring how to best serve the career goals of students in the Ohio University Scripps College of Communication, one of the biggest conclusions we came to was that we had to craft an experience addressing the problem graduating students face. With graduation comes trepidation: you’re not coming back to the hallowed walls of your college, you won’t see the familiar faces you’ve spent four years with, and there are no more classes or exams. Now you have to figure the future out.

If we wanted to curate an event that addressed all these worries, what would it look like, and what would success look like for the students who attended? That line of thinking birthed the inaugural edition of Scripps Career Success Day. With a bubbly atmosphere curated by a well-known DJ and a host of alumni and industry leaders offering advice, from pivoting after a rejection to maximizing professional networks, the event was a brimming success.

It was incredibly rewarding to see an event go from ideas on a piece of paper to genuine connections formed in real life. The lessons learned in event planning, program coordination, and stakeholder recognition were invaluable.`,
        bullets: [],
      },
      {
        heading: 'Goals',
        body: '',
        bullets: [
          'Produce a well-curated, impactful experience for the inaugural Scripps Career Success Day.',
          'Create an interactive environment where students could engage and network with panelists throughout the event.',
          'Bring 50 to 75 students into the building across the sessions, despite a busy Monday class schedule.',
        ],
      },
      {
        heading: 'Major achievements',
        body: '',
        bullets: ['Pulled off a successful and impactful event.', 'Earned the blessing of the then Dean of the college for future editions.'],
      },
    ],
    gallery: ['/img/cs-scripps-panel.jpg'],
    videos: [],
    links: [],
  },
  {
    slug: 'greetings-from-abroad',
    title: 'Greetings From Abroad',
    year: '2023',
    category: 'Executive Production',
    client: 'KooKusi',
    role: 'Marketing campaign & executive production',
    summary:
      'A campaign for an independent hip-hop artist’s sophomore EP about the Ghanaian immigrant experience, run while the artist was in the U.S.',
    cover: '/img/case-greetings-from-abroad.jpg',
    stats: [
      { number: '21.7K', label: 'First-week streams' },
      { number: '#1', label: 'Organic Twitter trend' },
      { number: '2 months', label: 'Sustained relevance' },
      { number: '5+', label: 'Major publications' },
    ],
    sections: [
      {
        heading: 'Brief',
        body: `A marketing campaign for an independent hip-hop artist’s sophomore EP addressing Ghanaian youth seeking opportunities abroad. The artist was physically in the U.S. for the entire campaign, so the launch had to create momentum at home without him on the ground.`,
        bullets: [],
      },
    ],
    gallery: ['/img/cs-gfa-back-cover.jpg'],
    videos: [],
    links: [{ label: 'Strategy & marketing portfolio', url: NOTION_STRATEGY }],
  },
  {
    slug: '5foot3',
    title: '5foot3',
    year: '2022',
    category: 'Executive Production',
    client: 'KooKusi',
    role: 'Launch campaign & executive production',
    summary: 'The debut project launch for a then-unknown artist, opening conversations on mental health and socio-cultural issues.',
    cover: '/img/case-5foot3.jpg',
    stats: [
      { number: '2x', label: 'Organic Twitter trends' },
      { number: '10K', label: 'First-month streams' },
      { number: '3 months', label: 'Continued relevance' },
      { number: '1', label: 'Merchandising deal' },
    ],
    sections: [
      {
        heading: 'Brief',
        body: `A launch campaign for an unknown artist’s debut project addressing mental health and socio-cultural issues. The campaign created safe spaces for those conversations while the artist pursued a PhD in the U.S.`,
        bullets: [],
      },
    ],
    gallery: ['/img/cs-5foot3-card.jpg', '/img/cs-5foot3-tracklist.jpg'],
    videos: ['https://www.youtube.com/watch?v=IkioLhgPOzQ'],
    links: [{ label: 'Strategy & marketing portfolio', url: NOTION_STRATEGY }],
  },
  {
    slug: 'afrotakus',
    title: 'AfrOtakus: Black People & Cosplay',
    year: '2025',
    category: 'Photography & Video',
    client: '',
    role: 'Photographer & researcher',
    summary:
      'A grant-winning, exhibition-featured photography project documenting Black cosplay culture and identity in anime fandom.',
    cover: '/img/cs-afrotakus-cover.jpg',
    stats: [
      { number: 'Gallery', label: 'Exhibition in Athens, OH' },
      { number: 'Video', label: 'Documentary interview' },
      { number: 'Anime North', label: '2024 coverage' },
    ],
    sections: [
      {
        heading: 'Brief',
        body: `A grant-winning and exhibition-featured photography project documenting Black cosplay culture, exploring identity, representation, and cultural appreciation in Japanese anime fandom. What began as a master’s thesis project grew into a wider body of work.`,
        bullets: [],
      },
    ],
    gallery: [
      '/img/cs-afrotakus-1.jpg',
      '/img/cs-afrotakus-2.jpg',
      '/img/cs-afrotakus-3.jpg',
      '/img/cs-afrotakus-4.jpg',
      '/img/cs-afrotakus-5.jpg',
      '/img/cs-afrotakus-6.jpg',
      '/img/cs-afrotakus-7.jpg',
      '/img/cs-afrotakus-8.jpg',
      '/img/cs-afrotakus-9.jpg',
    ],
    videos: [],
    links: [
      { label: 'AfrOtakus project page', url: 'https://pollen-shadow-f66.notion.site/AfrOtakus-Black-People-Cosplay-7f5b46e111f74c54a20e2e6ed0a179db' },
    ],
  },
];
