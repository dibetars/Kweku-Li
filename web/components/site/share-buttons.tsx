'use client';

import { useState } from 'react';

// Share links for a post. Every target opens the post's canonical URL, so shares point back here.
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: 'fa-brands fa-x-twitter' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: 'fa-brands fa-linkedin-in' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: 'fa-brands fa-facebook-f' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, icon: 'fa-brands fa-whatsapp' },
    { label: 'Email', href: `mailto:?subject=${t}&body=${u}`, icon: 'fa-solid fa-envelope' },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="share-row">
      <span className="share-label">Share</span>
      <ul className="share-links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener" aria-label={`Share on ${l.label}`} title={`Share on ${l.label}`}>
              <i className={l.icon} aria-hidden="true" />
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} aria-label="Copy link" title="Copy link">
            <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-link'} aria-hidden="true" />
          </button>
        </li>
      </ul>
      <span className="share-copied" role="status">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  );
}
