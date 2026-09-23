import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';
import { Media } from '@/components/site/media';
import { JsonLd } from '@/components/site/json-ld';
import { SITE_NAME, absoluteUrl, blogLd, breadcrumbLd, formatDate, publishedPosts, readingMinutes } from '@/lib/seo';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteContent();
  return {
    title: `Blog | ${SITE_NAME}`,
    description: s.blogIntro,
    alternates: { canonical: absoluteUrl('/blog') },
    openGraph: {
      type: 'website',
      url: absoluteUrl('/blog'),
      title: `Blog | ${SITE_NAME}`,
      description: s.blogIntro,
      siteName: SITE_NAME,
    },
    twitter: { card: 'summary_large_image', title: `Blog | ${SITE_NAME}`, description: s.blogIntro },
  };
}

export default async function BlogPage() {
  const s = await getSiteContent();
  const posts = publishedPosts(s.blogPosts);
  const [lead, ...rest] = posts;

  return (
    <>
      <JsonLd data={blogLd(posts, s.blogIntro)} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />

      <section className="page-head">
        <p className="section-kicker">Blog</p>
        <h1 className="page-title">Words, in my own time</h1>
        <p className="page-intro">{s.blogIntro}</p>
      </section>

      {posts.length === 0 ? (
        <section className="blog-empty">
          <p>The first piece is on its way. Check back soon.</p>
        </section>
      ) : (
        <>
          <Link href={`/blog/${lead.slug}`} className="blog-lead">
            {lead.cover && (
              <figure className="blog-lead-media">
                <Media src={lead.cover} alt="" sizes="(max-width: 980px) 100vw, 60vw" priority />
              </figure>
            )}
            <div className="blog-lead-copy">
              <p className="blog-meta">
                {[lead.category, formatDate(lead.date), `${readingMinutes(lead.body)} min read`].filter(Boolean).join(' · ')}
              </p>
              <h2>{lead.title}</h2>
              {lead.excerpt && <p className="blog-excerpt">{lead.excerpt}</p>}
              <span className="arrow-link">
                Read it <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>

          {rest.length > 0 && (
            <section className="blog-grid">
              {rest.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                  {p.cover && (
                    <figure className="blog-card-media">
                      <Media src={p.cover} alt="" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw" />
                    </figure>
                  )}
                  <p className="blog-meta">
                    {[p.category, formatDate(p.date), `${readingMinutes(p.body)} min read`].filter(Boolean).join(' · ')}
                  </p>
                  <h3>{p.title}</h3>
                  {p.excerpt && <p className="blog-excerpt">{p.excerpt}</p>}
                </Link>
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
