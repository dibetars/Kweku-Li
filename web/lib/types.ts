// Shapes of the JSON values stored in the `content` table.

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  number: string;
  label: string;
}
/** @deprecated kept for older code paths; use Stat */
export type WorkStat = Stat;

export interface LinkItem {
  label: string;
  url: string;
}

export interface CaseSection {
  heading: string;
  body: string; // paragraphs separated by blank lines
  bullets: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  year: string;
  category: string; // e.g. Creative Direction
  client: string;
  role: string;
  summary: string; // one or two sentences for cards
  cover: string;
  stats: Stat[];
  sections: CaseSection[];
  gallery: string[];
  videos: string[]; // YouTube URLs
  links: LinkItem[]; // public links only
}

// A card in "Featured Case Studies" or "Featured Work" on the homepage.
export interface FeaturedWorkItem {
  title: string;
  year: string;
  category: string;
  image: string;
  video: string; // YouTube URL, plays inline
  url: string; // external link
  caseStudy: string; // slug of an on-site case study
}

export interface Film {
  title: string;
  video: string;
}

export interface PortfolioEntry {
  year: string;
  title: string;
  outlet: string; // optional sub-heading, e.g. "Cincinnati Opera"
  url: string;
  caseStudy: string;
  image?: string; // small thumbnail beside the entry
}

export interface PortfolioGroup {
  title: string;
  description: string;
  entries: PortfolioEntry[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface TestimonialItem {
  text: string;
  author: string;
  role?: string;
}

export interface HomeAbout {
  lead: string;
  body: string;
  statNumber: string;
  statLabel: string;
}

export interface AboutPage {
  name: string;
  origin: string;
  meaning: string;
  intro: string;
  wordsTitle: string;
  words: string;
  professional: string;
  mission: string;
  portfolioBlurb: string;
  artistTitle: string;
  artist: string;
  artistVideo: string;
  philosophyQuote: string;
  philosophyVideo: string;
  artistry: string;
  artistryVideo: string;
  artistPortfolioUrl: string;
  lifeCoach: string;
}

export interface SenseiPage {
  quote: string;
  quoteSource: string;
  origins: string;
  roles: string[];
}

export interface MentorStory {
  name: string;
  bio: string;
  goals: string;
  challenges: string;
  strategies: string;
  guidance: string;
  milestones: string;
  outcome: string;
  present: string;
  recommendation: string;
}

export interface HeaderCta {
  text: string;
  href: string;
}

export interface HeroTitle {
  text: string;
}
