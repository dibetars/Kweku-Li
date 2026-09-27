import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/site-content';
import { Media } from '@/components/site/media';
import { Prose } from '@/components/site/prose';
import { JsonLd } from '@/components/site/json-ld';
import { ShareButtons } from '@/components/site/share-buttons';
import {
  SITE_NAME,
  absoluteUrl,
  blogPostingLd,
  breadcrumbLd,
  canonicalUrl,
  formatDate,
  isLinkOut,
  postUrl,
  publishedPosts,
  readingMinutes,
} from '@/lib/seo';
import { fetchMediumPosts, mergePosts } from '@/lib/medium';

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSiteContent();
  const post = publishedPosts(mergePosts(s.blogPosts, await fetchMediumPosts(s.medium))).find((p) => p.slug === slug);
  if (!post) return { title: `Blog | ${SITE_NAME}` };

  const keywords = post.keywords.filter(Boolean);
  const images = post.cover ? [absoluteUrl(post.cover)] : undefined;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    ...(keywords.length ? { keywords } : {}),
    authors: [{ name: post.author || SITE_NAME }],
    alternates: { canonical: canonicalUrl(post) },
    openGraph: {
      type: 'article',
      url: canonicalUrl(post),
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || post.date || undefined,
      authors: [post.author || SITE_NAME],
      tags: keywords,
      images,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const s = await getSiteContent();
  const posts = publishedPosts(mergePosts(s.blogPosts, await fetchMediumPosts(s.medium)));
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1 || isLinkOut(posts[index])) notFound();

  const post = posts[index];
  const next = posts[index + 1] ?? posts[0];
  const keywords = post.keywords.filter(Boolean);

  return (
    <article className="post-page">
      <JsonLd data={blogPostingLd(post)} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <header className="post-head">
        <Link href="/blog" className="case-back">
          ← Blog
        </Link>
        <p className="section-kicker">{post.category || 'Blog'}</p>
        <h1 className="page-title">{post.title}</h1>
        {post.excerpt && <p className="post-standfirst">{post.excerpt}</p>}
        <p className="post-byline">
          {[post.author || SITE_NAME, formatDate(post.date), `${readingMinutes(post.body)} min read`].filter(Boolean).join(' · ')}
        </p>
        {post.source === 'medium' && post.externalUrl && (
          <p className="post-origin">
            Originally published on{' '}
            <a href={post.externalUrl} target="_blank" rel="noopener">
              Medium
            </a>
          </p>
        )}
        <ShareButtons url={postUrl(post.slug)} title={post.title} />
      </header>

      {post.cover && (
        <figure className="post-cover">
          <Media src={post.cover} alt={post.title} sizes="(max-width: 1200px) 100vw, 1200px" priority />
        </figure>
      )}

      <div className="post-body">
        {post.source === 'medium' ? (
          // Already sanitized against an allowlist in lib/medium.ts.
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
        ) : (
          <Prose text={post.body} />
        )}
      </div>

      {keywords.length > 0 && (
        <ul className="post-tags" aria-label="Topics">
          {keywords.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      )}

      <div className="post-foot">
        <ShareButtons url={postUrl(post.slug)} title={post.title} />
      </div>

      {next && next.slug !== post.slug && (
        <Link href={`/blog/${next.slug}`} className="case-next">
          <span>Next piece</span>
          <strong>{next.title}</strong>
          <span className="circle-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      )}
    </article>
  );
}
