import Link from 'next/link';
import type { ReactNode } from 'react';
import { Media } from './media';
import { YouTube } from './youtube';
import { initials, paragraphs } from '@/lib/site-utils';
import type { FeaturedWorkItem, TestimonialItem } from '@/lib/types';

// Small building blocks shared by every public page.

export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {paragraphs(text).map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </>
  );
}

export function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const external = /^https?:\/\//.test(href);
  const cls = `arrow-link${light ? ' arrow-link-light' : ''}`;
  const inner = (
    <>
      {children} <span aria-hidden="true">↗</span>
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <p className="section-kicker">{kicker}</p>
      <h1 className="page-title">{title}</h1>
      {children && <div className="page-hero-body">{children}</div>}
    </section>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="testimonial-card">
      <blockquote className="testimonial-text">&ldquo;{item.text}&rdquo;</blockquote>
      <figcaption className="testimonial-author">
        <Avatar name={item.author} />
        <span>
          <strong>{item.author}</strong>
          {item.role && <span className="testimonial-role">{item.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

// A card used for featured case studies and featured work. Media is a photo, an inline YouTube
// player, or a typographic tile when neither exists.
export function WorkCard({ item, sizes }: { item: FeaturedWorkItem; sizes: string }) {
  const href = item.caseStudy ? `/work/${item.caseStudy}` : item.url;
  const external = !item.caseStudy && !!item.url;

  const tile = (
    <span className="work-tile">
      <span className="work-tile-kicker">{item.category}</span>
      <span className="work-tile-title">{item.title}</span>
    </span>
  );

  let media: ReactNode;
  if (item.video) {
    media = (
      <div className="case-media case-media-video">
        <YouTube url={item.video} title={item.title} sizes={sizes} />
      </div>
    );
  } else {
    const inner = (
      <>
        {item.image ? <Media src={item.image} alt={item.title} className="case-image" sizes={sizes} /> : tile}
        {item.image && (
          <span className="case-overlay">
            <span>{item.category}</span>
            <span>{item.year}</span>
          </span>
        )}
        {href && (
          <span className="case-arrow" aria-hidden="true">
            ↗
          </span>
        )}
      </>
    );
    media = href ? (
      external ? (
        <a href={href} className="case-media" target="_blank" rel="noopener">
          {inner}
        </a>
      ) : (
        <Link href={href} className="case-media">
          {inner}
        </Link>
      )
    ) : (
      <div className="case-media">{inner}</div>
    );
  }

  return (
    <article className="case-card">
      {media}
      <div className="case-content">
        <div className="case-heading">
          <h3>{item.title}</h3>
          {item.year && <span className="case-client">{item.year}</span>}
        </div>
        {href && (
          <div>
            <ArrowLink href={href}>{item.caseStudy ? 'Full details' : 'View'}</ArrowLink>
          </div>
        )}
      </div>
    </article>
  );
}
