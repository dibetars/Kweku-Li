import Link from 'next/link';
import { Media } from './media';
import { YouTube } from './youtube';
import { ArrowLink, TestimonialCard, WorkCard } from './ui';
import type { SiteContent } from '@/lib/site-content';

const CARD_SIZES = '(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw';

export function Hero({ s }: { s: SiteContent }) {
  return (
    <section className="hero" id="home">
      <div className="hero-shell fade-in-up">
        <aside className="hero-rail">
          <span className="hero-rail-label">{s.heroRoles}</span>
          <span className="hero-rail-line" />
          <span className="hero-rail-year">{new Date().getFullYear()}</span>
        </aside>

        <div className="hero-main">
          <div className="hero-topline">
            {s.heroStats.map((st) => (
              <div className="hero-stat" key={st.label}>
                <strong>
                  <sup>+</sup>
                  {st.number.replace(/^\+/, '')}
                </strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-copy">
            <h1 className="hero-title">Hello</h1>
            <p className="hero-tagline">
              <span className="hero-dash" aria-hidden="true">
                —
              </span>
              <span dangerouslySetInnerHTML={{ __html: s.heroTagline }} />
            </p>
            <p className="hero-description">{s.heroDescription}</p>
            <div className="hero-actions">
              <Link href="/about" className="cta-button">
                Explore My World
              </Link>
              <a href="#films" className="hero-scroll">
                Scroll down <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>

        <figure className="hero-figure">
          <Media src={s.heroImage} alt="Portrait of Kweku Diaw" sizes="(max-width: 980px) 100vw, 46vw" priority position="bottom center" />
        </figure>
      </div>
    </section>
  );
}

export function Films({ s }: { s: SiteContent }) {
  if (!s.films.length) return null;
  return (
    <section className="films" id="films">
      <div className={`films-grid${s.films.length === 1 ? ' films-single' : ''}`}>
        {s.films.map((f) => (
          <div className="film" key={f.video}>
            <YouTube url={f.video} title={f.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services({ s }: { s: SiteContent }) {
  return (
    <section className="services" id="services">
      <div className="section-split">
        <div className="section-intro">
          <p className="section-kicker">Services</p>
          <h2 className="section-title">
            What I Do <span className="italic-text">Best</span>
          </h2>
        </div>
        <div className="section-side-copy">
          <p className="section-description section-description-inline">{s.servicesIntro}</p>
          <ArrowLink href="/contact">Let&apos;s Work!</ArrowLink>
        </div>
      </div>

      <div className="services-grid">
        {s.services.map((sv, i) => (
          <article className="service-card" key={sv.title}>
            <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
            <div className="service-icon-wrap">
              <div className="service-icon">{sv.icon}</div>
            </div>
            <div className="service-body">
              <h3>{sv.title}</h3>
              <p>{sv.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FeaturedCases({ s }: { s: SiteContent }) {
  return (
    <section className="case-studies" id="work">
      <div className="section-center">
        <p className="pill-kicker">Case Studies</p>
        <h2 className="section-title">Featured Case Studies</h2>
      </div>
      <div className="case-grid case-grid-2">
        {s.featuredCases.map((item) => (
          <WorkCard key={item.title} item={item} sizes="(max-width: 720px) 100vw, 50vw" />
        ))}
      </div>
      <div className="section-more">
        <span>Check out more</span>
        <Link href="/portfolio" className="arrow-link">
          <span aria-hidden="true">→</span> Full Details
        </Link>
      </div>
    </section>
  );
}

export function FeaturedWork({ s }: { s: SiteContent }) {
  return (
    <section className="case-studies featured-work">
      <div className="section-center">
        <p className="pill-kicker">Portfolio</p>
        <h2 className="section-title">Featured Work</h2>
      </div>
      <div className="case-grid">
        {s.featuredWork.map((item) => (
          <WorkCard key={item.title} item={item} sizes={CARD_SIZES} />
        ))}
      </div>
      <div className="section-more">
        <span>See everything</span>
        <Link href="/portfolio" className="arrow-link">
          <span aria-hidden="true">→</span> Full Details
        </Link>
      </div>
    </section>
  );
}

export function AboutTeaser({ s }: { s: SiteContent }) {
  const a = s.homeAbout;
  return (
    <section className="about" id="about">
      <div className="about-grid">
        <div className="about-intro">
          <h2 className="section-title">About Kweku</h2>
          <p className="about-lead">{a.lead}</p>
          <p className="about-body">{a.body}</p>
          <ArrowLink href="/about">More about me</ArrowLink>
        </div>

        <div className="about-card">
          <span className="about-card-icon">
            <i className="fa-solid fa-globe" aria-hidden="true" />
          </span>
          <strong className="about-card-number">{a.statNumber}</strong>
          <p>{a.statLabel}</p>
          <figure className="about-card-figure">
            <Media src="/img/about-portrait-tall.png" alt="Kweku Diaw in profile" sizes="(max-width: 980px) 100vw, 30vw" position="top center" />
          </figure>
        </div>

        <div className="about-side">
          <Link href="/about" className="about-thumb" aria-label="About Kweku">
            <Media src="/img/about-thumb.png" alt="" sizes="(max-width: 720px) 100vw, 250px" position="top center" />
            <span className="about-thumb-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <div className="skills-stack">
            {s.skills.map((g) => (
              <div className="skill-category" key={g.title}>
                <h4>{g.title}</h4>
                <ul className="skill-list">
                  {g.items.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsStrip({ s }: { s: SiteContent }) {
  const items = s.testimonials.slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="testimonials">
      <div className="section-split section-split-dark">
        <div className="section-intro">
          <p className="section-kicker">Testimonials</p>
          <h2 className="section-title">
            What People <span className="italic-text">Say</span>
          </h2>
        </div>
        <div className="section-side-copy">
          <ArrowLink href="/about#testimonials" light>
            Read them all
          </ArrowLink>
        </div>
      </div>
      <div className="testimonial-grid">
        {items.map((t) => (
          <TestimonialCard key={t.author} item={t} />
        ))}
      </div>
    </section>
  );
}

export function ContactStrip({ s }: { s: SiteContent }) {
  return (
    <section className="vision">
      <div className="vision-block">
        <h2>Got a Vision? Let&apos;s Bring It to Life!</h2>
        <p>{s.contactIntro}</p>
        <div className="vision-details">
          <a href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
          {s.contact.phone && <a href={`tel:${s.contact.phone.replace(/[^\d+]/g, '')}`}>{s.contact.phone}</a>}
          {s.contact.location && <span>{s.contact.location}</span>}
        </div>
        <ArrowLink href="/contact">Book A Call</ArrowLink>
      </div>
    </section>
  );
}
