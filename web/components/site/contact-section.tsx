import { ContactForm } from '@/components/contact-form';

// ---------- Contact ----------

const SOCIALS: Array<{ key: string; icon: string; title: string }> = [
  { key: 'social.linkedin', icon: 'fa-brands fa-linkedin-in', title: 'LinkedIn' },
  { key: 'social.instagram', icon: 'fa-brands fa-instagram', title: 'Instagram' },
  { key: 'social.twitter', icon: 'fa-brands fa-x-twitter', title: 'X/Twitter' },
  { key: 'social.youtube', icon: 'fa-brands fa-youtube', title: 'YouTube' },
  { key: 'social.tiktok', icon: 'fa-brands fa-tiktok', title: 'TikTok' },
  { key: 'social.soundcloud', icon: 'fa-brands fa-soundcloud', title: 'SoundCloud' },
];

export function ContactSection({ c, intro }: { c: Record<string, string>; intro: string }) {
  return (
    <section className="contact contact-page" id="contact">
      <div className="section-split">
        <div className="section-intro">
          <p className="section-kicker">Contact</p>
          <h1 className="section-title">
            Let&apos;s Create <span className="italic-text">Something</span>
          </h1>
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
            <p>{intro}</p>
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
