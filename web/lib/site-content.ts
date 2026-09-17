import { cache } from 'react';
import { getAllContent, parseJson, type ContentMap } from './content';
import type {
  AboutPage,
  CaseStudy,
  FeaturedWorkItem,
  Film,
  HeaderCta,
  HeroTitle,
  HomeAbout,
  MentorStory,
  PortfolioGroup,
  SenseiPage,
  ServiceItem,
  SkillGroup,
  Stat,
  TestimonialItem,
} from './types';
import { CASE_STUDIES } from './data/case-studies';
import * as D from './data/pages';

// One typed view of the content table for every public page. Stored values win; the defaults in
// lib/data fill any key that is missing or unreadable. Objects are merged so a partially saved
// object never blanks the fields it lacks.
function merged<T extends object>(value: string | undefined, fallback: T): T {
  const parsed = parseJson<Partial<T> | null>(value, null);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? { ...fallback, ...parsed } : fallback;
}

function list<T>(value: string | undefined, fallback: T[]): T[] {
  const parsed = parseJson<T[] | null>(value, null);
  return Array.isArray(parsed) ? parsed : fallback;
}

function text(c: ContentMap, key: string, fallback: string): string {
  const v = c[key];
  return typeof v === 'string' && v.trim() ? v : fallback;
}

export function buildSiteContent(c: ContentMap) {
  return {
    logo: !c['header.logo'] || c['header.logo'] === 'Kweku Diaw' ? 'KD' : c['header.logo'],
    headerCta: merged<HeaderCta>(c['header.cta'], { text: 'Book A Call', href: '/contact' }),
    footerQuote: text(c, 'footer.quote', '"Everyone is searching, except the pilot in airplane mode."'),
    footerCopyright: text(c, 'footer.copyright', `© ${new Date().getFullYear()} Kweku Diaw. Visual Storyteller & Creative Strategist.`),

    heroRoles: text(c, 'hero.subtitle', D.HERO_ROLES),
    heroTagline: merged<HeroTitle>(c['hero.title'], { text: D.HERO_TAGLINE }).text || D.HERO_TAGLINE,
    heroDescription: text(c, 'hero.description', D.HERO_DESCRIPTION),
    heroImage: text(c, 'hero.image', D.HERO_IMAGE),
    heroStats: list<Stat>(c['hero.stats'], D.HERO_STATS),
    films: list<Film>(c['home.films'], D.FILMS),
    servicesIntro: text(c, 'services.description', D.SERVICES_INTRO),
    services: list<ServiceItem>(c['services.list'], D.SERVICES),
    featuredCases: list<FeaturedWorkItem>(c['featured.cases'], D.FEATURED_CASES),
    featuredWork: list<FeaturedWorkItem>(c['featured.work'], D.FEATURED_WORK),
    homeAbout: merged<HomeAbout>(c['home.about'], D.HOME_ABOUT),
    skills: list<SkillGroup>(c['skills.list'], D.SKILLS),
    testimonials: list<TestimonialItem>(c['testimonials.list'], D.TESTIMONIALS),
    contactIntro: text(c, 'contact.intro', D.CONTACT_INTRO),

    caseStudies: list<CaseStudy>(c['casestudies.list'], CASE_STUDIES).filter((cs) => cs.slug),
    about: merged<AboutPage>(c['about.page'], D.ABOUT_PAGE),
    portfolioIntro: text(c, 'portfolio.intro', D.PORTFOLIO_INTRO),
    portfolioGroups: list<PortfolioGroup>(c['portfolio.groups'], D.PORTFOLIO_GROUPS),
    sensei: merged<SenseiPage>(c['sensei.page'], D.SENSEI_PAGE),
    mentors: list<MentorStory>(c['mentors.list'], D.MENTORS),

    contact: {
      email: text(c, 'contact.email', 'kwekuk.diaw@gmail.com'),
      phone: text(c, 'contact.phone', ''),
      location: text(c, 'contact.location', ''),
    },
    socials: c,
  };
}

export type SiteContent = ReturnType<typeof buildSiteContent>;

// Cached per request so the layout and the page share one database read.
export const getSiteContent = cache(async (): Promise<SiteContent> => buildSiteContent(await getAllContent()));

export { youtubeId, paragraphs, initials } from './site-utils';
