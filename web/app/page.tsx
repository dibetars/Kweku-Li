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

const TILE_COLORS = [
  'bg-rose-100',
  'bg-sky-100',
  'bg-amber-100',
  'bg-emerald-100',
  'bg-violet-100',
  'bg-orange-100',
];

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

  // Pull real headline stats from the case studies themselves rather than inventing numbers.
  const heroStats = work
    .map((w) => parseJson<WorkStat[]>(w.stats, [])[0])
    .filter(Boolean)
    .slice(0, 3);

  const rootStyle = theme.variables as React.CSSProperties;

  const sections: Record<string, React.ReactNode> = {
    hero: (
      <section id="hero" key="hero" className="mx-auto max-w-6xl px-6 pb-24 pt-40">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div className="hidden flex-col items-center lg:flex">
            <span className="whitespace-nowrap text-xs uppercase tracking-[0.3em] text-neutral-400 [writing-mode:vertical-rl]">
              {c['hero.subtitle']}
            </span>
            <span className="mt-6 h-24 w-px bg-neutral-300" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 lg:hidden">{c['hero.subtitle']}</p>
            <h1
              className="mt-4 max-w-4xl text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl [&_.italic-text]:italic [&_.italic-text]:font-serif [&_.italic-text]:font-normal"
              dangerouslySetInnerHTML={{ __html: heroTitle.text }}
            />
            <p className="mt-8 max-w-xl text-lg text-neutral-600">{c['hero.description']}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#work"
                className="rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Explore My Work
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 px-7 py-3.5 text-sm font-medium transition hover:border-black"
              >
                Book A Call
                <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </div>

            {heroStats.length > 0 && (
              <div className="mt-16 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-8 sm:grid-cols-3">
                {heroStats.map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-black">{s.number}</div>
                    <div className="mt-1 text-sm text-neutral-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    ),

    services: (
      <section id="services" key="services" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium">Services</span>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Design Services{' '}
              <span className="font-serif font-normal italic">Tailored</span> to You
            </h2>
          </div>
        </div>
        <div className="mt-14 divide-y divide-neutral-200 border-t border-neutral-200">
          {services.map((s, i) => (
            <div key={s.title} className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
              <span className="w-10 flex-shrink-0 text-sm text-neutral-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-3xl">
                {s.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-1 max-w-2xl text-neutral-600">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    work: (
      <section id="work" key="work" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-block rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium">
              Experience
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Explore My Creative <span className="font-serif font-normal italic">Journey</span>
            </h2>
          </div>
          <p className="max-w-sm text-neutral-500">{c['about.professional']}</p>
        </div>

        <div className="mt-14 divide-y divide-neutral-200 border-t border-neutral-200">
          {work.map((w) => {
            const stats = parseJson<WorkStat[]>(w.stats, []);
            return (
              <div key={w.title} className="grid gap-4 py-8 sm:grid-cols-[2fr_2fr_1fr] sm:items-center">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{w.icon}</span>
                  <h3 className="text-lg font-bold leading-tight">{w.title}</h3>
                </div>
                <p className="text-sm text-neutral-600">{w.description}</p>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{w.tag}</span>
                  {stats[0] && (
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                      {stats[0].number} {stats[0].label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ),

    portfolio: (
      <section id="portfolio" key="portfolio" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <span className="inline-block rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium">Portfolio</span>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Selected <span className="font-serif font-normal italic">Work</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p, i) => (
            <div key={p.title} className="overflow-hidden rounded-3xl border border-neutral-200">
              <div className={`flex h-40 items-center justify-center text-5xl ${TILE_COLORS[i % TILE_COLORS.length]}`}>
                {p.icon}
              </div>
              <div className="p-6">
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    about: (
      <section id="about" key="about" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-block rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium">About</span>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              About <span className="font-serif font-normal italic">Me</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg text-neutral-600">{c['about.intro']}</p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
                  ✦
                </span>
                <p className="text-neutral-600">{c['about.artist']}</p>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
                  ✦
                </span>
                <p className="text-neutral-600">{c['about.mission']}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-neutral-950 p-8 text-white">
              <div className="text-5xl">🌐</div>
              <div className="mt-6 text-5xl font-black">+{work.length}</div>
              <p className="mt-2 text-neutral-400">Campaigns launched across music, brands, and culture</p>
            </div>
            <div className="rounded-3xl bg-neutral-100 p-8">
              <p className="italic text-neutral-700">{c['about.philosophy']}</p>
            </div>
          </div>
        </div>
      </section>
    ),

    testimonials: (
      <section id="testimonials" key="testimonials" className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              What People <span className="font-serif font-normal italic">Say</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.author} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-neutral-200">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-6 text-sm text-neutral-400">— {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    ),

    contact: (
      <section id="contact" key="contact" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-neutral-100 px-8 py-20 text-center sm:px-16">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Got A Vision? Let&apos;s <span className="font-serif font-normal italic">Bring It To Life</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-neutral-600">{c['contact.location']}</p>
            <a
              href="#contact-form"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Let&apos;s Talk ↗
            </a>
          </div>

          <div id="contact-form" className="mt-20 grid gap-12 md:grid-cols-2">
            <ContactForm />
            <div className="space-y-6 text-sm">
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
        </div>
      </section>
    ),
  };

  return (
    <div data-theme={theme.mode} style={rootStyle} className="min-h-screen bg-white text-black">
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5">
        <a href="#hero" className="font-black">
          {c['header.logo']}
        </a>
        <ul className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-white/90 px-2 py-2 text-sm backdrop-blur sm:flex">
          <li>
            <a href="#services" className="rounded-full px-4 py-1.5 hover:bg-neutral-100">
              Services
            </a>
          </li>
          <li>
            <a href="#work" className="rounded-full px-4 py-1.5 hover:bg-neutral-100">
              Work
            </a>
          </li>
          <li>
            <a href="#about" className="rounded-full px-4 py-1.5 hover:bg-neutral-100">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="rounded-full px-4 py-1.5 hover:bg-neutral-100">
              Contact
            </a>
          </li>
        </ul>
        <a
          href={headerCta.href}
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          {headerCta.text} ↗
        </a>
      </nav>

      {order.map((id) => sections[id]).filter(Boolean)}

      <footer className="bg-neutral-950 px-6 pt-20 pb-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Let&apos;s work together</p>
          <a
            href={`mailto:${c['contact.email']}`}
            className="mt-4 block break-words text-4xl font-black tracking-tight hover:text-neutral-300 sm:text-6xl"
          >
            {c['contact.email']}
          </a>

          <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="italic text-neutral-400">{c['footer.quote']}</p>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
              <a href="#services" className="hover:text-white">
                Services
              </a>
              <a href="#work" className="hover:text-white">
                Work
              </a>
              <a href="#about" className="hover:text-white">
                About
              </a>
              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <p className="mt-8 text-xs text-neutral-500">{c['footer.copyright']}</p>
        </div>
      </footer>
    </div>
  );
}
