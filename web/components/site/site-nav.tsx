'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'About Me' },
  { href: '#work', label: 'Portfolio' },
  { href: '#services', label: 'Services' },
  { href: '#insights', label: 'Insights' },
];

const MOBILE_LINKS = [
  ...LINKS.slice(0, 3),
  { href: '#experiences', label: 'Experiences' },
  LINKS[3],
  { href: '#contact', label: 'Contact' },
];

export function SiteNav({ logo, cta }: { logo: string; cta: { text: string; href: string } }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 720 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <nav>
        <div className="nav-left">
          <a href="#home" className="logo">
            {logo}
          </a>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          <a href={cta.href} className="arrow-link">
            {cta.text} <span aria-hidden="true">↗</span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        <ul>
          {MOBILE_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={cta.href} className="cta-button" onClick={() => setOpen(false)}>
          {cta.text}
        </a>
      </div>
    </>
  );
}
