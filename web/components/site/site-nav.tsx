'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const NAV_LINKS = [
  { href: '/about', label: 'About Me' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/sensei-hood', label: 'Sensei-Hood' },
  { href: '/contact', label: 'Contact' },
];

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/portfolio') return pathname.startsWith('/portfolio') || pathname.startsWith('/work');
  return pathname.startsWith(href);
}

export function SiteNav({ logo, cta }: { logo: string; cta: { text: string; href: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

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

  const ctaHref = cta.href === '#contact' ? '/contact' : cta.href;

  return (
    <>
      <nav>
        <div className="nav-left">
          <Link href="/" className="logo" aria-label="Home">
            {logo}
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(pathname, l.href) ? 'is-active' : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          <Link href={ctaHref} className="arrow-link">
            {cta.text} <span aria-hidden="true">↗</span>
          </Link>
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
          {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={ctaHref} className="cta-button" onClick={() => setOpen(false)}>
          {cta.text}
        </Link>
      </div>
    </>
  );
}
