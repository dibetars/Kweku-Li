import { Media } from './media';
import { PortfolioGrid, type PortfolioTile } from './portfolio-grid';
import { ContactForm } from '@/components/contact-form';
import type { ExperienceItem, InsightItem, PromoBanner, ServiceItem, TestimonialItem, WorkItem, WorkStat } from '@/lib/types';
import { ABOUT_IMAGES, SKILLS } from '@/lib/site-defaults';
import { parseJson } from '@/lib/content';

// ---------- Hero ----------

export function Hero({
  subtitle,
  titleHtml,
  image,
  stats,
}: {
  subtitle: string;
  titleHtml: string;
  image: string;
  stats: WorkStat[];
}) {
  return (
    <section className="hero" id="home">
      <div className="hero-shell fade-in-up">
        <aside className="hero-rail">
          <span className="hero-rail-label">{subtitle}</span>
          <span className="hero-rail-line" />
          <span className="hero-rail-year">{new Date().getFullYear()}</span>
        </aside>

        <div className="hero-main">
          <div className="hero-topline">
            {stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <strong>
                  <sup>+</sup>
                  {s.number.replace(/^\+/, '')}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-copy">
            <h1 className="hero-title">Hello</h1>
            <p className="hero-tagline">
              <span className="hero-dash" aria-hidden="true">
                —
              </span>
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            </p>
          </div>

          <a href="#services" className="hero-scroll">
            Scroll down <span aria-hidden="true">↓</span>
          </a>
        </div>

        <figure className="hero-figure">
          <Media src={image} alt="Portrait of Kweku Diaw" sizes="(max-width: 980px) 100vw, 46vw" priority position="bottom center" />
        </figure>
      </div>
    </section>
  );
}

// ---------- Services ----------

export function Services({ items, description }: { items: ServiceItem[]; description: string }) {
  return (
    <section className="services" id="services">
      <div className="section-split">
        <div className="section-intro">
          <p className="section-kicker">Services</p>
          <h2 className="section-title">
            What I Do <span className="italic-text">Best</span>
          </h2>
        </div>
        <p className="section-description section-description-inline">{description}</p>
      </div>

      <div className="services-grid">
        {items.map((s, i) => (
          <article className="service-card" key={s.title}>
            <span className="service-index">{String(i + 1).padStart(2, '0')}</span>
            <div className="service-icon-wrap">
              <div className="service-icon">{s.icon}</div>
            </div>
            <div className="service-body">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Latest works ----------

export type WorkCard = WorkItem & { image: string; client: string; year: string };

export function LatestWorks({ items }: { items: WorkCard[] }) {
  return (
    <section className="case-studies" id="work">
      <div className="section-center">
        <p className="pill-kicker">Portfolio</p>
        <h2 className="section-title">Latest Works</h2>
      </div>

      <div className="case-grid">
        {items.map((w) => {
          const stats = parseJson<WorkStat[]>(w.stats, []);
          return (
            <article className="case-card" key={w.title}>
              <a href={w.href || '#contact'} className="case-media">
                {w.image ? (
                  <Media src={w.image} alt={w.title} className="case-image" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw" />
                ) : (
                  <div className="case-image case-image-fallback">{w.icon || '📁'}</div>
                )}
                <span className="case-overlay">
                  <span>{w.tag}</span>
                  <span>{w.year}</span>
                </span>
                <span className="case-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <div className="case-content">
                <div className="case-heading">
                  <h3>{w.title}</h3>
                  {w.client && (
                    <span className="case-client">
                      For <strong>{w.client}</strong>
                    </span>
                  )}
                </div>
                <p>{w.description}</p>
                {stats.length > 0 && (
                  <div className="case-stats">
                    {stats.map((s) => (
                      <div className="stat" key={s.label}>
                        <span className="stat-number">{s.number}</span>
                        <span className="stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="section-more">
        <span>Check out more</span>
        <a href="#portfolio" className="arrow-link">
          <span aria-hidden="true">→</span> View More
        </a>
      </div>
    </section>
  );
}

// ---------- Portfolio ----------

export function Portfolio({ items }: { items: PortfolioTile[] }) {
  return (
    <section className="portfolio" id="portfolio">
      <div className="section-center">
        <p className="pill-kicker">Portfolio</p>
        <h2 className="section-title">
          Exploring My Work
          <br />
          Creative Solutions
        </h2>
      </div>
      <PortfolioGrid items={items} />
    </section>
  );
}

// ---------- Experiences ----------

export function Experiences({ items }: { items: ExperienceItem[] }) {
  return (
    <section className="experiences" id="experiences">
      <div className="section-split">
        <div className="section-intro">
          <p className="section-kicker">Experiences</p>
          <h2 className="section-title">Explore My Creative Journey</h2>
        </div>
        <div className="section-side-copy">
          <p className="section-description section-description-inline">
            Over the past few years I&apos;ve launched independent artists, documented underrepresented culture, and written
            for brands and newsrooms, always with storytelling that drives results.
          </p>
          <a href="#contact" className="arrow-link">
            Book A Call <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="experience-list">
        {items.map((e, i) => {
          const isLast = i === items.length - 1;
          const images = e.images ?? [];
          const tags = (
            <div className={`tag-list${isLast ? ' tag-list-dark' : ''}`}>
              {e.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          );
          if (isLast && images.length) {
            return (
              <article className="experience-row is-open" key={e.title}>
                <div className="experience-head">
                  <h3>{e.title}</h3>
                  <span className="experience-date">{e.date}</span>
                </div>
                {tags}
                <div className="experience-detail">
                  <div className="experience-thumbs">
                    {images.slice(0, 3).map((src) => (
                      <span className="experience-thumb" key={src}>
                        <Media src={src} alt="" sizes="(max-width: 720px) 30vw, 20vw" />
                      </span>
                    ))}
                  </div>
                  <p>{e.description}</p>
                  <a href="#contact" className="circle-arrow" aria-label="Get in touch">
                    ↗
                  </a>
                </div>
              </article>
            );
          }
          return (
            <article className="experience-row" key={e.title}>
              <div className="experience-head">
                <h3>{e.title}</h3>
                <span className="experience-date">{e.date}</span>
              </div>
              <p className="experience-desc">{e.description}</p>
              {tags}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Promo banner ----------

export function Promo({ banner }: { banner: PromoBanner }) {
  return (
    <section className="promo" id="promo">
      <div className="promo-banner">
        {banner.image && <Media src={banner.image} alt="" sizes="100vw" position="center 30%" />}
        <div className="promo-content">
          <p className="promo-kicker">{banner.kicker}</p>
          <h2>{banner.title}</h2>
          <p>{banner.description}</p>
          <a href="#contact" className="arrow-link arrow-link-light">
            {banner.cta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- About ----------

export function About({ intro, professional, mission }: { intro: string; professional: string; mission: string }) {
  return (
    <section className="about" id="about">
      <div className="about-grid">
        <div className="about-intro">
          <h2 className="section-title">About Me</h2>
          <p className="about-lead">{intro}</p>
          <svg className="about-doodle" viewBox="0 0 220 260" fill="none" aria-hidden="true">
            <path d="M20 240 C 40 150, 90 90, 200 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M150 40 L 200 60 L 175 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="about-card">
          <span className="about-card-icon">
            <i className="fa-solid fa-globe" aria-hidden="true" />
          </span>
          <strong className="about-card-number">200%</strong>
          <p>Increase in Sales Qualified Leads for a digital marketing client after our collaboration</p>
          <figure className="about-card-figure">
            <Media src={ABOUT_IMAGES.tall} alt="Kweku Diaw in profile" sizes="(max-width: 980px) 100vw, 30vw" position="top center" />
          </figure>
        </div>

        <div className="about-side">
          <a href="#contact" className="about-thumb">
            <Media src={ABOUT_IMAGES.thumb} alt="Kweku Diaw" sizes="(max-width: 720px) 100vw, 250px" position="top center" />
            <span className="about-thumb-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <ul className="about-points">
            {[professional, mission].map((text, i) => (
              <li key={i}>
                <span className="point-icon" aria-hidden="true">
                  ✦
                </span>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="skills-container">
        {SKILLS.map((group) => (
          <div className="skill-category" key={group.title}>
            <h4>{group.title}</h4>
            <ul className="skill-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Insights ----------

export function Insights({ items }: { items: InsightItem[] }) {
  return (
    <section className="insights" id="insights">
      <div className="section-center">
        <p className="pill-kicker">Insights</p>
        <h2 className="section-title">Notes &amp; Perspectives</h2>
      </div>

      <div className="insight-grid">
        {items.map((it) => (
          <article className="insight-card" key={it.title}>
            {it.image && (
              <span className="insight-media">
                <Media src={it.image} alt="" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw" />
              </span>
            )}
            <div className="insight-body">
              <div className="insight-meta">
                <span className="tag tag-dark">{it.category}</span>
                <span>{it.meta}</span>
              </div>
              <h3>{it.title}</h3>
              <p>{it.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Testimonials ----------

export function Testimonials({ items }: { items: TestimonialItem[] }) {
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
          <p className="section-description section-description-inline">Results speak louder than words, but these help too.</p>
        </div>
      </div>

      <div className="testimonial-grid">
        {items.map((t) => (
          <div className="testimonial-card" key={t.author}>
            <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
            <p className="testimonial-author">— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Vision CTA ----------

export function Vision() {
  return (
    <section className="vision">
      <div className="vision-block">
        <h2>Got a Vision? Let&apos;s Bring It to Life!</h2>
        <p>
          I&apos;m always excited to collaborate on new and meaningful projects. Whether you&apos;re starting from scratch or
          refining an existing idea, let&apos;s talk.
        </p>
        <a href="#contact" className="arrow-link">
          Book A Call <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

// ---------- Contact ----------

const SOCIALS: Array<{ key: string; icon: string; title: string }> = [
  { key: 'social.linkedin', icon: 'fa-brands fa-linkedin-in', title: 'LinkedIn' },
  { key: 'social.instagram', icon: 'fa-brands fa-instagram', title: 'Instagram' },
  { key: 'social.twitter', icon: 'fa-brands fa-x-twitter', title: 'X/Twitter' },
  { key: 'social.youtube', icon: 'fa-brands fa-youtube', title: 'YouTube' },
  { key: 'social.tiktok', icon: 'fa-brands fa-tiktok', title: 'TikTok' },
  { key: 'social.soundcloud', icon: 'fa-brands fa-soundcloud', title: 'SoundCloud' },
];

export function Contact({ c }: { c: Record<string, string> }) {
  return (
    <section className="contact" id="contact">
      <div className="section-split">
        <div className="section-intro">
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">
            Let&apos;s Create <span className="italic-text">Something</span>
          </h2>
        </div>
        <div className="section-side-copy">
          <p className="section-description section-description-inline">
            Ready to tell your story in a way that makes people fall in love?
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-intro-card">
            <h3>Get In Touch</h3>
            <p>
              I&apos;m open to working on projects that help brands and businesses tell their stories creatively. Whether
              it&apos;s photography, copywriting, marketing strategy, or cultural projects - let&apos;s talk.
            </p>
          </div>
          <ContactForm />

          <div className="contact-meta-grid">
            <div className="contact-item">
              <h4>Email</h4>
              <a href={`mailto:${c['contact.email']}`}>{c['contact.email']}</a>
            </div>
            <div className="contact-item">
              <h4>Phone</h4>
              <a href={`tel:${(c['contact.phone'] ?? '').replace(/[^\d+]/g, '')}`}>{c['contact.phone']}</a>
            </div>
            <div className="contact-item">
              <h4>Location</h4>
              <p>{c['contact.location']}</p>
            </div>
          </div>

          <div className="social-links">
            {SOCIALS.filter((s) => c[s.key]).map((s) => (
              <a key={s.key} href={c[s.key]} className="social-link" target="_blank" rel="noopener" title={s.title}>
                <i className={s.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <aside className="contact-side-panel">
          <p className="contact-side-label">Best For</p>
          <h3>Projects that need strategy, story, and sharp execution.</h3>
          <p>
            Bring me in when you need a campaign, brand narrative, creative direction, or visual storytelling approach that
            feels intentional and culturally aware.
          </p>
          <div className="contact-side-points">
            <div className="contact-side-point">
              <strong>Response Style</strong>
              <span>Clear, collaborative, and fast-moving from kickoff to delivery.</span>
            </div>
            <div className="contact-side-point">
              <strong>Project Types</strong>
              <span>Campaign launches, copy systems, photography, and creative consulting.</span>
            </div>
            <div className="contact-side-point">
              <strong>Working Across</strong>
              <span>Accra, remote collaborations, and international creative teams.</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ---------- Footer ----------

export function Footer({ email, quote, copyright }: { email: string; quote: string; copyright: string }) {
  return (
    <footer>
      <div className="footer-inner">
        <ul className="footer-nav">
          <li>
            <a href="#home" className="is-active">
              Home
            </a>
          </li>
          <li>
            <a href="#about">About Me</a>
          </li>
          <li>
            <a href="#work">Portfolio</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#insights">Insights</a>
          </li>
        </ul>
        <a href={`mailto:${email}`} className="footer-email">
          {email}
        </a>
      </div>
      <div className="footer-bottom">
        <p className="footer-quote">{quote}</p>
        <p className="footer-text">{copyright}</p>
      </div>
    </footer>
  );
}
