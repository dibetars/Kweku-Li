import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { Media } from '@/components/site/media';
import { ArrowLink, Avatar, Paragraphs } from '@/components/site/ui';
import type { MentorStory } from '@/lib/types';

export const revalidate = 0;
export const metadata: Metadata = { title: 'Sensei-Hood | Kweku Diaw' };

const STORY_PARTS: Array<[keyof MentorStory, string]> = [
  ['goals', 'Goals & aspirations'],
  ['challenges', 'Challenges & roadblocks'],
  ['strategies', 'Strategies & resources'],
  ['milestones', 'Milestones'],
  ['outcome', 'Outcome & growth'],
  ['present', 'Present day'],
];

export default async function SenseiPage() {
  const s = await getSiteContent();
  const p = s.sensei;

  return (
    <>
      <section className="about-hero sensei-hero">
        <div className="about-hero-copy">
          <p className="section-kicker">Origins · Birth of a Senpai</p>
          <h1 className="page-title">Sensei-Hood</h1>
          <blockquote className="philosophy-quote">
            &ldquo;{p.quote}&rdquo;
            {p.quoteSource && <cite>{p.quoteSource}</cite>}
          </blockquote>
        </div>
        <figure className="about-hero-figure">
          <Media src="/img/portrait-garden.jpg" alt="Kweku Diaw" sizes="(max-width: 980px) 100vw, 40vw" priority position="center 30%" />
        </figure>
      </section>

      <section className="words">
        <div className="words-body">
          <Paragraphs text={p.origins} />
        </div>
      </section>

      <section className="section-split sensei-roles">
        <div className="section-intro">
          <p className="section-kicker">Experience</p>
          <h2 className="section-title">How I help</h2>
        </div>
        <div className="role-chips">
          {p.roles.filter(Boolean).map((r) => (
            <span key={r} className="role-chip">
              {r}
            </span>
          ))}
        </div>
      </section>

      <section className="mentor-section">
        <div className="section-center">
          <p className="pill-kicker">Testimonials</p>
          <h2 className="section-title">Proud Mentor Moments</h2>
        </div>

        <div className="mentor-list">
          {s.mentors.map((m) => (
            <article key={m.name} className="mentor-card">
              <header className="mentor-head">
                <Avatar name={m.name} />
                <div>
                  <h3>{m.name}</h3>
                  <p>{m.bio}</p>
                </div>
              </header>

              {m.guidance && (
                <div className="mentor-quote">
                  <p className="mentor-label">Kweku&apos;s guidance</p>
                  <Paragraphs text={m.guidance} />
                </div>
              )}

              <details className="mentor-details">
                <summary>Read the full story</summary>
                <dl>
                  {STORY_PARTS.filter(([k]) => m[k]).map(([k, label]) => (
                    <div key={k}>
                      <dt>{label}</dt>
                      <dd>
                        <Paragraphs text={m[k]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>

              {m.recommendation && <p className="mentor-recommendation">&ldquo;{m.recommendation}&rdquo;</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="vision">
        <div className="vision-block">
          <h2>Life is hard, but there&apos;s too much beauty in it to give up.</h2>
          <p>If you&apos;d like a coach, a sounding board, or an accountability partner, reach out.</p>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </section>
    </>
  );
}
