import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { Media } from '@/components/site/media';
import { YouTube } from '@/components/site/youtube';
import { ArrowLink, Paragraphs, TestimonialCard } from '@/components/site/ui';

export const revalidate = 0;
export const metadata: Metadata = { title: 'About | Kweku Diaw' };

export default async function AboutPage() {
  const s = await getSiteContent();
  const a = s.about;

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="section-kicker">About</p>
          <h1 className="page-title">{a.name}</h1>
          <p className="about-origin">{a.origin}</p>
          <p className="about-meaning">
            <span>Meaning</span> {a.meaning}
          </p>
          <p className="about-intro-line">{a.intro}</p>
        </div>
        <figure className="about-hero-figure">
          <Media src="/img/about-portrait-tall.png" alt="Kweku Diaw" sizes="(max-width: 980px) 100vw, 40vw" priority position="top center" />
        </figure>
      </section>

      <section className="words">
        <p className="section-kicker">{a.wordsTitle}</p>
        <div className="words-body">
          <Paragraphs text={a.words} />
        </div>
      </section>

      <section className="about-pair">
        <article className="about-panel">
          <p className="section-kicker">The Professional</p>
          <h2>Kweku Diaw</h2>
          <Paragraphs text={a.professional} />
        </article>
        <article className="about-panel about-panel-dark">
          <p className="section-kicker">The Mission</p>
          <h2>Making the invisible visible</h2>
          <Paragraphs text={a.mission} />
        </article>
      </section>

      <section className="section-split about-portfolio">
        <div className="section-intro">
          <p className="section-kicker">Portfolio</p>
          <h2 className="section-title">A writer at heart</h2>
        </div>
        <div className="section-side-copy">
          <Paragraphs text={a.portfolioBlurb} className="section-description" />
          <ArrowLink href="/portfolio">View Professional Portfolio</ArrowLink>
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-copy">
          <p className="section-kicker">The Artist</p>
          <h2 className="section-title">{a.artistTitle}</h2>
          <Paragraphs text={a.artist} />
        </div>
        <div className="feature-media">
          <YouTube url={a.artistVideo} title="2 Mins 30 Secs: Disability Project" />
        </div>
      </section>

      <section className="feature-row feature-row-reverse">
        <div className="feature-copy">
          <p className="section-kicker">The Philosophy</p>
          <blockquote className="philosophy-quote">&ldquo;{a.philosophyQuote}&rdquo;</blockquote>
        </div>
        <div className="feature-media">
          <YouTube url={a.philosophyVideo} title="Yin & Yang" />
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-copy">
          <p className="section-kicker">Artistry</p>
          <Paragraphs text={a.artistry} className="feature-lead" />
          <ArrowLink href={a.artistPortfolioUrl}>View Artist Portfolio</ArrowLink>
        </div>
        <div className="feature-media">
          <YouTube url={a.artistryVideo} title="Twereduampong Nyame" />
        </div>
      </section>

      <section className="coach-teaser">
        <div>
          <p className="section-kicker">Life Coach</p>
          <h2 className="section-title">Sensei-Hood</h2>
          <Paragraphs text={a.lifeCoach} className="section-description" />
          <ArrowLink href="/sensei-hood">Meet the Sensei</ArrowLink>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="section-split section-split-dark">
          <div className="section-intro">
            <p className="section-kicker">Testimonials</p>
            <h2 className="section-title">
              What People <span className="italic-text">Say</span>
            </h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {s.testimonials.map((t) => (
            <TestimonialCard key={t.author} item={t} />
          ))}
        </div>
      </section>
    </>
  );
}
