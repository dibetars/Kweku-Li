import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { SITE_URL, publishedPosts } from '@/lib/seo';

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getSiteContent();
  const now = new Date();

  const pages = ['/', '/about', '/portfolio', '/blog', '/sensei-hood', '/contact'].map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.8,
  }));

  // Posts that live on Medium carry a canonical URL there, so they are not listed here.
  const posts = publishedPosts(s.blogPosts).filter((p) => p.source !== 'medium').map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated || p.date ? new Date(p.updated || p.date) : now,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const cases = s.caseStudies.map((c) => ({
    url: `${SITE_URL}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...posts, ...cases];
}
