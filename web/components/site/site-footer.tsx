'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, isActive } from './site-nav';

export function SiteFooter({ email, quote, copyright }: { email: string; quote: string; copyright: string }) {
  const pathname = usePathname();
  return (
    <footer>
      <div className="footer-inner">
        <ul className="footer-nav">
          {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={isActive(pathname, l.href) ? 'is-active' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
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
