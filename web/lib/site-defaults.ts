// Defaults for the redesigned homepage. Content stored in the database wins; these fill the gaps
// for databases seeded before the new keys existed (e.g. production), and give lists without
// an `image` field the photos supplied for each item.
import type { ExperienceItem, InsightItem, PromoBanner, WorkStat } from './types';

export const HERO_IMAGE = '/img/hero-portrait.png';

export const HERO_STATS: WorkStat[] = [
  { number: '21.7K', label: 'First-week campaign streams' },
  { number: '5', label: 'Major publications featured' },
];

// Keyed by lower-cased item title.
export const WORK_DEFAULTS: Record<string, { image: string; client?: string; year?: string }> = {
  'greetings from abroad': { image: '/img/case-greetings-from-abroad.jpg', client: 'KooKusi', year: '2023' },
  '5foot3 debut ep': { image: '/img/case-5foot3.jpg', client: 'KooKusi', year: '2022' },
  'afrotakus: black people & cosplay': { image: '/img/case-afrotakus.jpg', client: 'Ohio University', year: '2025' },
};

export const PORTFOLIO_DEFAULTS: Record<string, { image: string; category: string; subtitle: string }> = {
  'web copywriting': { image: '/img/portfolio-web-copywriting.jpg', category: 'Copywriting', subtitle: 'Copy systems' },
  'video copywriting': { image: '/img/portfolio-video-copywriting.jpg', category: 'Copywriting', subtitle: 'Scripts' },
  journalism: { image: '/img/portfolio-journalism.jpg', category: 'Journalism', subtitle: '25+ articles' },
  photography: { image: '/img/portfolio-photography.jpg', category: 'Photography', subtitle: 'Portraiture' },
  'marketing campaigns': { image: '/img/portfolio-marketing-campaigns.jpg', category: 'Campaigns', subtitle: 'Music releases' },
  'the li chronicles': { image: '/img/portfolio-li-chronicles.jpg', category: 'Spoken Word', subtitle: 'The Li Chronicles' },
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    title: 'AfrOtakus: Black People & Cosplay',
    date: '2025 · Photography & Exhibition',
    description: 'Grant-winning, exhibition-featured photography project documenting Black cosplay culture and identity in anime fandom.',
    tags: ['Photography', 'Culture'],
  },
  {
    title: 'This Ability EP',
    date: '2025 · Executive Production',
    description: 'Socially impactful music project with KooKusi exploring disability themes, from concept to campaign.',
    tags: ['Campaign', 'Direction'],
  },
  {
    title: 'Greetings From Abroad',
    date: '2023 · Digital Strategy',
    description: 'Sophomore EP campaign that trended organically and earned 21.7K first-week streams with the artist abroad.',
    tags: ['Strategy', 'Copy'],
  },
  {
    title: '5Foot3 Debut EP',
    date: '2022 · Album Launch',
    description: 'From crafting launch narratives to leading full campaign direction, each project has shaped my approach and strengthened my passion for stories that shift culture.',
    tags: ['Campaign', 'Direction'],
    images: ['/img/experience-1.jpg', '/img/experience-2.jpg', '/img/portfolio-web-copywriting.jpg'],
  },
];

export const INSIGHTS: InsightItem[] = [
  {
    category: 'The Artist',
    meta: 'Spoken Word',
    title: '"Li" / "The Beast"',
    description: "Unlike those who tell their stories through song and rap, I deliver my message through the aesthetic art of Spoken Word & Poetry. I'm a faith-based, eclectic individual who dreams that words will one day break through to the core of humanity.",
    image: '/img/portfolio-li-chronicles.jpg',
  },
  {
    category: 'The Philosophy',
    meta: 'Perspective',
    title: 'Everyone is searching, except the pilot in airplane mode.',
    description: 'I believe in intentional disconnection from noise to find clarity. My work explores identity, representation, and cultural appreciation, amplifying narratives often overlooked in mainstream visual media.',
    image: '/img/portfolio-video-copywriting.jpg',
  },
  {
    category: 'The Mission',
    meta: 'Culture',
    title: 'Making the invisible visible.',
    description: "I'm driven to document underrepresented artistic movements and create work at the intersection of visual communication and storytelling, from Black cosplay culture to independent music.",
    image: '/img/experience-1.jpg',
  },
];

export const PROMO: PromoBanner = {
  kicker: '(Start your next project)',
  title: "Book a Free Discovery Call and Let's Shape Your Story",
  description: 'Take a moment to talk through your campaign, brand narrative, or creative direction with an experienced strategist and visual storyteller.',
  cta: "Let's talk",
  image: '/img/banner-promo.jpg',
};

export const ABOUT_IMAGES = {
  tall: '/img/about-portrait-tall.png',
  thumb: '/img/about-thumb.png',
};

export const SKILLS: Array<{ title: string; items: string[] }> = [
  { title: 'Photography', items: ['Commercial Photography', 'Portraiture & Fashion', 'Still Life', 'Cultural Documentation', 'Cosplay Photography'] },
  { title: 'Writing', items: ['Web Copywriting', 'Video Scripts', 'Journalism', 'Spoken Word Poetry', 'Content Strategy'] },
  { title: 'Marketing', items: ['Campaign Strategy', 'Social Media Marketing', 'Brand Storytelling', 'Music Marketing', 'Event Promotion'] },
  { title: 'Creative Direction', items: ['Art Direction', 'Video Production', 'Brand Development', 'Cultural Projects', 'Visual Storytelling'] },
];

export const SERVICE_OPTIONS = [
  'Photography & Visual Communication',
  'Copywriting & Content Creation',
  'Marketing Strategy & Campaign Management',
  'Creative Direction & Art Direction',
  'Cultural Projects & Collaborations',
  'Spoken Word Performances',
  'Speaking Engagements & Workshops',
  'Video Production & Scriptwriting',
];

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
