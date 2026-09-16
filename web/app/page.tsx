import './site.css';
import { getAllContent, parseJson } from '@/lib/content';
import type {
  ExperienceItem,
  HeaderCta,
  HeroTitle,
  InsightItem,
  PortfolioItem,
  PromoBanner,
  ServiceItem,
  TestimonialItem,
  WorkItem,
  WorkStat,
} from '@/lib/types';
import {
  EXPERIENCES,
  HERO_IMAGE,
  HERO_STATS,
  INSIGHTS,
  PORTFOLIO_DEFAULTS,
  PROMO,
  WORK_DEFAULTS,
} from '@/lib/site-defaults';
import { SiteNav } from '@/components/site/site-nav';
import type { PortfolioTile } from '@/components/site/portfolio-grid';
import {
  About,
  Contact,
  Experiences,
  Footer,
  Hero,
  Insights,
  LatestWorks,
  Portfolio,
  Promo,
  Services,
  Testimonials,
  Vision,
  type WorkCard,
} from '@/components/site/sections';

export const revalidate = 0; // always read fresh content; admin saves call revalidatePath too

export default async function HomePage() {
  const c = await getAllContent();

  const headerCta = parseJson<HeaderCta>(c['header.cta'], { text: 'Book A Call', href: '#contact' });
  const heroTitle = parseJson<HeroTitle>(c['hero.title'], { text: 'I help brands tell stories that make customers fall in love' });
  const heroStats = parseJson<WorkStat[]>(c['hero.stats'], HERO_STATS);
  const services = parseJson<ServiceItem[]>(c['services.list'], []);
  const testimonials = parseJson<TestimonialItem[]>(c['testimonials.list'], []);
  const experiences = parseJson<ExperienceItem[]>(c['experience.list'], EXPERIENCES);
  const insights = parseJson<InsightItem[]>(c['insights.list'], INSIGHTS);
  const promo = parseJson<PromoBanner>(c['promo.banner'], PROMO);

  // Lists saved before the image fields existed fall back to the photo supplied for that title.
  const work: WorkCard[] = parseJson<WorkItem[]>(c['work.list'], []).map((w) => {
    const d = WORK_DEFAULTS[w.title.trim().toLowerCase()];
    return { ...w, image: w.image || d?.image || '', client: w.client || d?.client || '', year: w.year || d?.year || '' };
  });

  const portfolio: PortfolioTile[] = parseJson<PortfolioItem[]>(c['portfolio.list'], []).map((p) => {
    const d = PORTFOLIO_DEFAULTS[p.title.trim().toLowerCase()];
    return {
      title: p.title,
      description: p.description,
      image: p.image || d?.image || '',
      category: p.category || d?.category || 'Other',
      subtitle: p.subtitle || d?.subtitle || '',
    };
  });

  return (
    <div className="site">
      <SiteNav logo={c['header.logo'] === 'Kweku Diaw' || !c['header.logo'] ? 'KD' : c['header.logo']} cta={headerCta} />

      <Hero subtitle={c['hero.subtitle'] ?? ''} titleHtml={heroTitle.text} image={c['hero.image'] || HERO_IMAGE} stats={heroStats} />
      <Services items={services} description={c['services.description'] ?? 'Combining creativity with strategic thinking to deliver results that exceed expectations'} />
      <LatestWorks items={work} />
      <Portfolio items={portfolio} />
      <Experiences items={experiences} />
      <Promo banner={promo} />
      <About intro={c['about.intro'] ?? ''} professional={c['about.professional'] ?? ''} mission={c['about.mission'] ?? ''} />
      <Insights items={insights} />
      <Testimonials items={testimonials} />
      <Vision />
      <Contact c={c} />
      <Footer email={c['contact.email'] ?? ''} quote={c['footer.quote'] ?? ''} copyright={c['footer.copyright'] ?? ''} />
    </div>
  );
}
