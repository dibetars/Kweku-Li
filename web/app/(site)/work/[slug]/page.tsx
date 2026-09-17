import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/site-content';
import { Media } from '@/components/site/media';
import { YouTube } from '@/components/site/youtube';
import { ArrowLink, Paragraphs } from '@/components/site/ui';

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = (await getSiteContent()).caseStudies.find((c) => c.slug === slug);
  return cs ? { title: `${cs.title} | Kweku Diaw`, description: cs.summary } : { title: 'Case study | Kweku Diaw' };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const all = (await getSiteContent()).caseStudies;
  const index = all.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const cs = all[index];
  const next = all[(index + 1) % all.length];

  const meta = [
    ['Year', cs.year],
    ['Discipline', cs.category],
    ['Client', cs.client],
    ['Role', cs.role],
  ].filter(([, v]) => v);

  return (
    <article className="case-page">
      <header className="case-page-head">
        <Link href="/portfolio" className="case-back">
          ← Portfolio
        </Link>
        <p className="section-kicker">Case Study</p>
        <h1 className="page-title">{cs.title}</h1>
        {cs.summary && <p className="case-page-summary">{cs.summary}</p>}
        <dl className="case-meta">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {cs.cover && (
        <figure className="case-cover">
          <Media src={cs.cover} alt={cs.title} sizes="(max-width: 1440px) 100vw, 1440px" priority />
        </figure>
      )}

      {cs.stats.length > 0 && (
        <section className="case-stat-row">
          {cs.stats.map((st) => (
            <div key={st.label} className="case-stat">
              <strong>{st.number}</strong>
              <span>{st.label}</span>
            </div>
          ))}
        </section>
      )}

      <div className="case-body">
        {cs.sections.map((sec, i) => (
          <section key={i} className="case-section">
            <h2>{sec.heading}</h2>
            <div className="case-section-body">
              <Paragraphs text={sec.body} />
              {sec.bullets.filter(Boolean).length > 0 && (
                <ul>
                  {sec.bullets.filter(Boolean).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      {cs.videos.filter(Boolean).length > 0 && (
        <section className="case-videos">
          {cs.videos.filter(Boolean).map((v) => (
            <YouTube key={v} url={v} title={cs.title} sizes="(max-width: 980px) 100vw, 60vw" />
          ))}
        </section>
      )}

      {cs.gallery.filter(Boolean).length > 0 && (
        <section className="case-gallery">
          {cs.gallery.filter(Boolean).map((src) => (
            <figure key={src} className="case-gallery-item">
              <Media src={src} alt="" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw" />
            </figure>
          ))}
        </section>
      )}

      {cs.links.filter((l) => l.url).length > 0 && (
        <section className="case-links">
          <h2>Read more</h2>
          <ul>
            {cs.links
              .filter((l) => l.url)
              .map((l) => (
                <li key={l.url}>
                  <ArrowLink href={l.url}>{l.label || l.url}</ArrowLink>
                </li>
              ))}
          </ul>
        </section>
      )}

      {next && next.slug !== cs.slug && (
        <Link href={`/work/${next.slug}`} className="case-next">
          <span>Next case study</span>
          <strong>{next.title}</strong>
          <span className="circle-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      )}
    </article>
  );
}
