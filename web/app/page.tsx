import { getAllContent, parseJson } from '@/lib/content';
import type {
  ServiceItem,
  WorkItem,
  WorkStat,
  PortfolioItem,
  TestimonialItem,
  ThemeConfig,
  HeaderCta,
  HeroTitle,
} from '@/lib/types';
import { ContactForm } from '@/components/contact-form';

export const revalidate = 0; // always read fresh content; admin saves call revalidatePath too

export default async function HomePage() {
  const c = await getAllContent();

  const theme = parseJson<ThemeConfig>(c['theme.config'], { mode: 'light', variables: {} });
  const order = parseJson<string[]>(c['layout.order'], [
    'hero',
    'services',
    'work',
    'portfolio',
    'about',
    'testimonials',
    'contact',
  ]);
  const headerCta = parseJson<HeaderCta>(c['header.cta'], { text: "Let's Talk", href: '#contact' });
  const heroTitle = parseJson<HeroTitle>(c['hero.title'], { text: '' });
  const services = parseJson<ServiceItem[]>(c['services.list'], []);
  const work = parseJson<WorkItem[]>(c['work.list'], []);
  const portfolio = parseJson<PortfolioItem[]>(c['portfolio.list'], []);
  const testimonials = parseJson<TestimonialItem[]>(c['testimonials.list'], []);

  const rootStyle = theme.variables as React.CSSProperties;

  const sections: Record<string, React.ReactNode> = {
    hero: (
      <section id="hero" key="hero" className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">{c['hero.subtitle']}</p>
        <h1
          className="mt-4 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl [&_.italic-text]:italic"
          dangerouslySetInnerHTML={{ __html: heroTitle.text }}
        />
        <p className="mt-6 max-w-xl text-lg text-neutral-600">{c['hero.description']}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#work" className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800">
            Explore My Work
          </a>
          <a href="#contact" className="rounded-full border border-black px-6 py-3 text-sm font-medium hover:bg-black hover:text-white">
            Book A Call
          </a>
        </div>
      </section>
    ),

    services: (
      <section id="services" key="services" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Services</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">What I Do Best</h2>
        <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
          {services.map((s, i) => (
            <div key={s.title} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start">
              <span className="text-sm text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-3xl">
                {s.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 max-w-2xl text-neutral-600">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    work: (
      <section id="work" key="work" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Selected Campaigns</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Featured Case Studies</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {work.map((w) => {
            const stats = parseJson<WorkStat[]>(w.stats, []);
            return (
              <div key={w.title} className="rounded-2xl border border-neutral-200 p-6">
                <div className="text-4xl">{w.icon}</div>
                <span className="mt-4 inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                  {w.tag}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{w.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-lg font-bold">{s.number}</div>
                      <div className="text-xs text-neutral-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ),

    portfolio: (
      <section id="portfolio" key="portfolio" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Portfolio</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Selected Work</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => (
            <div key={p.title} className="rounded-2xl border border-neutral-200 p-6">
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    ),

    about: (
      <section id="about" key="about" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">About</p>
        <p className="mt-4 max-w-2xl text-lg">{c['about.intro']}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">The Professional</h3>
            <p className="mt-2 text-sm text-neutral-600">{c['about.professional']}</p>
          </div>
          <div>
            <h3 className="font-semibold">The Artist</h3>
            <p className="mt-2 text-sm text-neutral-600">{c['about.artist']}</p>
          </div>
          <div>
            <h3 className="font-semibold">The Philosophy</h3>
            <p className="mt-2 text-sm text-neutral-600">{c['about.philosophy']}</p>
          </div>
        </div>
      </section>
    ),

    testimonials: (
      <section id="testimonials" key="testimonials" className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-widest text-neutral-400">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">What People Say</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.author} className="rounded-2xl border border-white/10 p-6">
                <p className="text-neutral-200">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 text-sm text-neutral-400">— {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    ),

    contact: (
      <section id="contact" key="contact" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-neutral-500">Contact</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Let&apos;s Create Something</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <ContactForm />
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">Email</h4>
              <a className="text-neutral-600 hover:underline" href={`mailto:${c['contact.email']}`}>
                {c['contact.email']}
              </a>
            </div>
            <div>
              <h4 className="font-semibold">Phone</h4>
              <a className="text-neutral-600 hover:underline" href={`tel:${c['contact.phone']}`}>
                {c['contact.phone']}
              </a>
            </div>
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-neutral-600">{c['contact.location']}</p>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <div data-theme={theme.mode} style={rootStyle} className="min-h-screen bg-white text-black">
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur">
        <a href="#hero" className="font-bold">
          {c['header.logo']}
        </a>
        <ul className="hidden gap-6 text-sm sm:flex">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <a href={headerCta.href} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
          {headerCta.text}
        </a>
      </nav>

      {order.map((id) => sections[id]).filter(Boolean)}

      <footer className="border-t border-neutral-200 px-6 py-12 text-center">
        <p className="italic text-neutral-500">{c['footer.quote']}</p>
        <p className="mt-4 text-sm text-neutral-400">{c['footer.copyright']}</p>
      </footer>
    </div>
  );
}
