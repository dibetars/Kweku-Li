// Pulls posts from a Medium RSS feed and maps them into the blog's own post shape.
// Medium serves the ~10 most recent posts at https://medium.com/feed/@handle, with the full
// article HTML in <content:encoded>. The HTML is sanitized before it ever reaches the page.
import { XMLParser } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';
import type { BlogPost } from './types';

export interface MediumSettings {
  url: string; // feed URL or @handle
  mode: string; // "link" shows a card that opens Medium; anything else renders the article here
  category: string; // label shown on the card
}

export const MEDIUM_DEFAULTS: MediumSettings = { url: '', mode: 'full', category: 'Medium' };

const FEED_TTL = 1800; // seconds; Medium updates are not urgent and the feed is rate-limited

// Accepts a full feed URL, a profile URL, or a bare @handle.
export function feedUrl(input: string): string {
  const v = input.trim();
  if (!v) return '';
  if (v.startsWith('@')) return `https://medium.com/feed/${v}`;
  if (!v.startsWith('http')) return `https://medium.com/feed/@${v.replace(/^@/, '')}`;
  if (v.includes('/feed/')) return v;
  try {
    const u = new URL(v);
    const handle = u.pathname.split('/').filter(Boolean)[0] || '';
    return handle ? `https://medium.com/feed/${handle.startsWith('@') ? handle : `@${handle}`}` : '';
  } catch {
    return '';
  }
}

// Medium ends each post with a 1x1 stat pixel; it is not an image of the article.
const TRACKER = /\/_\/stat|\/stat\?event=/i;

const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'strong', 'em', 'b', 'i', 'u', 's',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'figure', 'figcaption',
];

function clean(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'title'],
    },
    allowedSchemes: ['https', 'mailto'],
    exclusiveFilter: (frame) => frame.tag === 'img' && TRACKER.test(frame.attribs.src || ''),
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener', target: '_blank' }),
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }),
      h1: 'h2', // the page already has an h1
    },
  });
}

// Feed values arrive as plain strings, CDATA wrappers, or nodes with attributes.
function str(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if ('#text' in o) return str(o['#text']);
    if ('__cdata' in o) return str(o['__cdata']);
  }
  return '';
}

function textOf(html: string): string {
  const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote|figcaption|div|tr)>/gi, ' $& ');
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
}

function firstImage(html: string): string {
  const matches = html.matchAll(/<img[^>]+src="(https:\/\/[^"]+)"/gi);
  for (const m of matches) {
    if (!TRACKER.test(m[1])) return m[1];
  }
  return '';
}

// Medium appends ?source=rss-... to feed links; the canonical URL should not carry it.
function cleanLink(link: string): string {
  const v = link.trim();
  if (!v) return '';
  try {
    const u = new URL(v);
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return v;
  }
}

function slugOf(link: string): string {
  try {
    const last = new URL(link).pathname.split('/').filter(Boolean).pop() || '';
    // Medium slugs end in a hash, e.g. my-story-3f2b1c9d4e. Keep it: it makes the slug unique.
    return last.toLowerCase().replace(/[^a-z0-9-]/g, '');
  } catch {
    return '';
  }
}

function isoDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function asArray<T>(v: T | T[] | undefined): T[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string | string[];
  'dc:creator'?: string;
  'content:encoded'?: string;
  description?: string;
};

// Never throws: a feed that is down, slow, or malformed must not take the blog down with it.
export async function fetchMediumPosts(settings: MediumSettings): Promise<BlogPost[]> {
  const url = feedUrl(settings.url);
  if (!url) return [];

  let xml: string;
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8' },
      next: { revalidate: FEED_TTL },
    });
    if (!res.ok) {
      console.error(`Medium feed ${url} returned ${res.status}`);
      return [];
    }
    xml = await res.text();
  } catch (err) {
    console.error(`Medium feed ${url} could not be read`, err);
    return [];
  }

  try {
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const items: RssItem[] = asArray(parsed?.rss?.channel?.item);

    return items
      .map((item): BlogPost | null => {
        const link = cleanLink(str(item.link));
        const slug = slugOf(link);
        const title = textOf(str(item.title));
        if (!link || !slug || !title) return null;

        const raw = str(item['content:encoded']) || str(item.description);
        const body = clean(raw);
        let plain = textOf(raw);
        if (plain.toLowerCase().startsWith(title.toLowerCase())) {
          plain = plain.slice(title.length).trim();
        }

        return {
          slug,
          title,
          date: isoDate(str(item.pubDate)),
          updated: '',
          author: textOf(str(item['dc:creator'])),
          category: settings.category || MEDIUM_DEFAULTS.category,
          status: '',
          excerpt: plain.length > 200 ? `${plain.slice(0, 197).trimEnd()}…` : plain,
          cover: firstImage(raw),
          body: settings.mode === 'link' ? '' : body,
          keywords: asArray(item.category).map((c) => textOf(str(c))).filter(Boolean).slice(0, 8),
          source: 'medium',
          externalUrl: link,
        };
      })
      .filter((p): p is BlogPost => p !== null);
  } catch (err) {
    console.error(`Medium feed ${url} could not be parsed`, err);
    return [];
  }
}

// Admin-written posts win over a Medium post with the same slug.
export function mergePosts(own: BlogPost[], medium: BlogPost[]): BlogPost[] {
  const taken = new Set(own.map((p) => p.slug));
  return [...own, ...medium.filter((p) => !taken.has(p.slug))];
}
