// Canonical URLs and schema.org data for search engines and AI indexers.
import type { BlogPost } from './types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kwekudiaw.com').replace(/\/+$/, '');
export const SITE_NAME = 'Kweku Diaw';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function postUrl(slug: string): string {
  return absoluteUrl(`/blog/${slug}`);
}

// A post counts as published unless it is explicitly marked a draft.
export function isPublished(p: BlogPost): boolean {
  return !!p.slug && !!p.title && p.status.trim().toLowerCase() !== 'draft';
}

export function publishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(isPublished).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function wordCount(body: string): number {
  return body.split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / 200));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

const author = (name: string) => ({
  '@type': 'Person',
  name: name || SITE_NAME,
  url: absoluteUrl('/about'),
});

const publisher = {
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
};

// One article, described for search engines and AI answer engines.
export function blogPostingLd(post: BlogPost) {
  const keywords = post.keywords.filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl(post.slug)}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl(post.slug) },
    url: postUrl(post.slug),
    headline: post.title,
    description: post.excerpt,
    ...(post.cover ? { image: [absoluteUrl(post.cover)] } : {}),
    datePublished: post.date || undefined,
    dateModified: post.updated || post.date || undefined,
    author: author(post.author),
    publisher,
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    wordCount: wordCount(post.body),
    inLanguage: 'en',
    isAccessibleForFree: true,
  };
}

// The blog itself, with its posts listed so crawlers can find every article.
export function blogLd(posts: BlogPost[], description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absoluteUrl('/blog')}#blog`,
    url: absoluteUrl('/blog'),
    name: `${SITE_NAME} — Blog`,
    description,
    inLanguage: 'en',
    author: author(SITE_NAME),
    publisher,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      '@id': `${postUrl(p.slug)}#article`,
      url: postUrl(p.slug),
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date || undefined,
      ...(p.cover ? { image: [absoluteUrl(p.cover)] } : {}),
      author: author(p.author),
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
