// Ported verbatim from the previous Express app's SEED_CONTENT (server/index.js).
// This is the entire site's copy — do not re-author, only extend.
export const SEED_CONTENT: Record<string, string> = {
  'hero.subtitle': 'Visual Storyteller & Creative Strategist',
  'layout.order': JSON.stringify(['hero', 'services', 'work', 'portfolio', 'about', 'testimonials', 'contact']),
  'header.logo': 'Kweku Diaw',
  'header.cta': JSON.stringify({ text: "Let's Talk", href: '#contact' }),
  'footer.copyright': '© 2026 Kweku Diaw. Visual Storyteller & Creative Strategist.',
  'hero.title': JSON.stringify({ text: 'I help brands tell <span class="italic-text">stories</span> that make customers fall in <span class="italic-text">love</span>' }),
  'hero.description': "A multifaceted creative professional bridging photography, copywriting, marketing strategy, and visual communication. From capturing Black cosplay culture to launching independent artists to mainstream success, I create work that matters.",

  'services.list': JSON.stringify([
    { icon: '📸', title: 'Photography & Visual Communication', description: "Commercial photography specializing in portraiture, fashion, and cultural documentation. Master's degree in Visual Communication from Ohio University with a focus on representation and storytelling." },
    { icon: '✍️', title: 'Copywriting & Content Creation', description: 'Web copy, video scripts, journalism, and creative writing that converts. Crafting compelling narratives for brands from tech startups to luxury real estate with published work in major outlets.' },
    { icon: '📈', title: 'Marketing Strategy & Campaign Execution', description: 'Full-service marketing campaigns that generate organic trends and sustained engagement. Proven track record of launching independent artists and growing brand visibility on limited budgets.' },
    { icon: '🎤', title: 'Spoken Word & Visual Storytelling', description: 'The Li Chronicles: Combining spoken word poetry with photography and videography. Creating work at the intersection of art, culture, and social commentary under the moniker "Li" / "The Beast".' },
    { icon: '🎨', title: 'Creative Direction & Art Direction', description: 'End-to-end creative direction for brands, artists, and cultural projects. From concept development to final execution across multiple mediums including video, photography, and digital content.' },
    { icon: '🎭', title: 'Cultural Projects & Representation', description: 'AfrOtakus project documenting Black cosplay culture, exploring identity and representation in anime fandom. Work exhibited in galleries and featured in academic contexts.' },
  ]),

  'work.list': JSON.stringify([
    {
      icon: '🎵',
      tag: 'Marketing Campaign',
      title: 'Greetings From Abroad',
      description: "Marketing campaign for independent hip-hop artist's sophomore EP addressing Ghanaian youth seeking opportunities abroad. Artist was physically in the U.S. during entire campaign.",
      stats: JSON.stringify([
        { number: '21.7K', label: 'First Week Streams' },
        { number: '#1', label: 'Organic Twitter Trend' },
        { number: '2 Months', label: 'Sustained Relevance' },
        { number: '5+', label: 'Major Publications' },
      ]),
    },
    {
      icon: '🎤',
      tag: 'Album Launch',
      title: '5Foot3 Debut EP',
      description: "Launch campaign for unknown artist's debut project addressing mental health and socio-cultural issues. Created safe spaces for conversations while artist pursued PhD in U.S.",
      stats: JSON.stringify([
        { number: '2x', label: 'Organic Twitter Trends' },
        { number: '10K', label: 'First Month Streams' },
        { number: '3 Months', label: 'Continued Relevance' },
        { number: '1', label: 'Merchandising Deal' },
      ]),
    },
    {
      icon: '🎭',
      tag: 'Cultural Project',
      title: 'AfrOtakus: Black People & Cosplay',
      description: "Photographic documentation of Black cosplay culture exploring identity, representation, and cultural appreciation in Japanese anime fandom. Master's thesis project turned cultural movement.",
      stats: JSON.stringify([
        { number: 'Gallery', label: 'Exhibition in Athens, OH' },
        { number: 'Video', label: 'Documentary Interview' },
        { number: 'Fashion', label: 'Creative Ads Produced' },
        { number: 'Anime North', label: '2024 Coverage' },
      ]),
    },
  ]),

  'portfolio.list': JSON.stringify([
    { icon: '🌐', title: 'Web Copywriting', description: 'Hubject (eRoaming), PayPlux (Crypto), Bewsys (ICT), BS Holding, UrbanPlug (Solar), Irrigation Hub - Complete information architecture and copy for 7+ websites' },
    { icon: '🎬', title: 'Video Copywriting', description: "Tekura (Furniture), FanMilk SuperYogo (Father's Day), Goldkey (Founder's Day) - Poetic scripts combining brand storytelling with cultural commentary" },
    { icon: '📰', title: 'Journalism', description: '25+ articles for Ohio University covering arts, culture, sports, and academia. Features in Dallas Morning News, MyJoyOnline, VARIANT Magazine' },
    { icon: '📸', title: 'Photography', description: 'Portraiture, Still Life, and Cosplay photography. Specializing in candid storytelling and cultural documentation with technical mastery' },
    { icon: '🚀', title: 'Marketing Campaigns', description: 'QodeHub Internship (500+ video views unpaid), SASA Urban Lights (organic Twitter trend), multiple music releases with sustained 2-3 month relevance' },
    { icon: '🎤', title: 'The Li Chronicles', description: 'Spoken word poetry, visual storytelling, and sonic narratives. "The cadence of a rapper. The delivery of a warrior. And a message rooted in spoken word poetry."' },
  ]),

  'about.intro': "Hi! I'm Kweku Diaw. I have a way with words that translates into images that interest brands and businesses. I help customers fall in love with brands and their products.",
  'about.professional': "A multifaceted visual communicator, music journalist, and digital strategist with a Master's degree in Visual Communication from Ohio University, specializing in commercial photography. My work spans copywriting, photography, marketing strategy, and journalism - always with a focus on storytelling that drives results.",
  'about.artist': "Unlike those who tell their stories through song and rap, I deliver my message through the aesthetic art of Spoken Word & Poetry. I'm a faith-based, eclectic individual who dreams that words will one day break through to the core of humanity and revive a dying breed of individuals to be more human.",
  'about.philosophy': '"Everyone is searching, except the pilot in airplane mode." - I believe in intentional disconnection from noise to find clarity. My work explores identity, representation, and cultural appreciation, amplifying narratives often overlooked in mainstream visual media.',
  'about.mission': "I'm driven by a desire to document underrepresented artistic movements and create work at the intersection of visual communication and storytelling. Whether it's Black cosplay culture, independent music, or brand narratives - I believe in making the invisible visible.",

  'testimonials.list': JSON.stringify([
    { text: "We saw a 200% increase in Sales Qualified Leads from our collaboration. Kweku's strategic approach combined with creative execution delivered results beyond our expectations.", author: 'Digital Marketing Client' },
    { text: "The album campaign was a game-changer. Despite being physically absent during the release, we trended organically twice and maintained relevance for 3 months. That's unheard of for independent artists.", author: 'Koo Kusi, Recording Artist' },
    { text: "Kweku doesn't just write copy - he crafts experiences. The website copy he created for our brand perfectly captured our mission and dramatically improved our conversion rates.", author: 'Tech Startup Founder' },
  ]),

  'contact.email': 'kwekuk.diaw@gmail.com',
  'contact.phone': '+1 (704) 707-5226',
  'contact.location': 'Accra, Greater Accra, Ghana / Athens, Ohio, USA',
  'footer.quote': '"Everyone is searching, except the pilot in airplane mode."',

  'social.linkedin': 'https://www.linkedin.com/in/kweku-li-diaw/',
  'social.instagram': 'https://instagram.com/cue_li',
  'social.twitter': 'https://x.com/cue_li_beast',
  'social.youtube': 'https://www.youtube.com/channel/UCFOma1eGE_4ECagsg7B-ZJw',
  'social.tiktok': 'https://tiktok.com/@cuelibeast',
  'social.soundcloud': 'https://soundcloud.com/beast_li',

  'theme.config': JSON.stringify({
    mode: 'light',
    variables: {
      '--bg-body': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-nav': 'rgba(255, 255, 255, 0.95)',
      '--bg-gradient-start': '#ffffff',
      '--bg-gradient-end': '#f5f5f5',
      '--bg-inverse': '#0a0a0a',
      '--text-main': '#0a0a0a',
      '--text-muted': '#666666',
      '--text-inverse': '#ffffff',
      '--accent': '#6c3baa',
      '--accent-hover': '#341539',
      '--gradient-accent-end': '#ff8555',
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--border-light': 'rgba(0, 0, 0, 0.05)',
      '--shadow-sm': '0 4px 20px rgba(0, 0, 0, 0.08)',
      '--shadow-lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
      '--overlay-light': 'rgba(255, 255, 255, 0.05)',
      '--border-overlay': 'rgba(255, 255, 255, 0.1)',
      '--text-overlay-main': 'rgba(255, 255, 255, 0.9)',
      '--text-overlay-muted': 'rgba(255, 255, 255, 0.6)',
    },
  }),
};
