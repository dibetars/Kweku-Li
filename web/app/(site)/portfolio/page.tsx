import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { PageHero, WorkCard } from '@/components/site/ui';
import { PortfolioList } from '@/components/site/portfolio-list';

export const revalidate = 0;
export const metadata: Metadata = { title: 'Portfolio | Kweku Diaw' };

export default async function PortfolioPage() {
  const s = await getSiteContent();

  return (
    <>
      <PageHero kicker="Portfolio" title="Work & Case Studies">
        <p className="section-description">{s.portfolioIntro}</p>
      </PageHero>

      <section className="case-studies">
        <div className="case-grid">
          {s.caseStudies.map((cs) => (
            <WorkCard
              key={cs.slug}
              item={{ title: cs.title, year: cs.year, category: cs.category, image: cs.cover, video: '', url: '', caseStudy: cs.slug }}
              sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw"
            />
          ))}
        </div>
      </section>

      <section className="portfolio-index">
        <PortfolioList groups={s.portfolioGroups} />
      </section>
    </>
  );
}
