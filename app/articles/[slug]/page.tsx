import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles } from '@/.velite';
import { Badge } from '@/components/shared/Badge';
import { EmailCapture } from '@/components/shared/EmailCapture';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { MDXContent } from '@/components/shared/MDXContent';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  return articles
    .filter((a) => !a.draft)
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  { params }: ArticlePageProps
): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug && !a.draft);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahaecommerce.com';

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: article.canonicalUrl ?? `${siteUrl}/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug && !a.draft);

  if (!article) {
    notFound();
  }

  // TODO(G-013): Add JSON-LD Article structured data once security hook exemption is resolved

  const relatedArticles = articles
    .filter(
      (a) => a.topic === article.topic && a.slug !== article.slug && !a.draft
    )
    .slice(0, 3);

  return (
    <>
      {/* ── Article Hero ── */}
      <div className="border-b border-[--color-border] py-10 md:py-14">
        <div className="max-w-[45rem] mx-auto px-4">
          <Badge variant="default">{article.topicLabel}</Badge>

          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text] mt-4">
            {article.title}
          </h1>

          <p className="text-lg leading-relaxed font-sans text-[--color-text-secondary] mt-4">
            {article.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-5 text-sm font-sans text-[--color-text-muted] items-center">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTime} min read</span>
            <span aria-hidden="true">&middot;</span>
            <Link
              href={`/topics/${article.topic}`}
              className="text-[--color-text-brand] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
            >
              {article.topicLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Affiliate Disclosure ── */}
      {article.affiliateLinks && (
        <div className="max-w-[45rem] mx-auto px-4 mt-8">
          <div className="bg-[--color-warning-bg] border-l-4 border-[--color-warning] rounded-md p-4">
            <p className="text-sm font-sans text-[--color-text-secondary]">
              <strong className="text-[--color-text]">Disclosure:</strong> This article contains
              affiliate links. If you purchase through these links, we may earn a commission at
              no extra cost to you. We only recommend products and services we genuinely use and
              believe in.
            </p>
          </div>
        </div>
      )}

      {/* ── Inline Email Capture (before article body) ── */}
      <div className="max-w-[45rem] mx-auto px-4 mt-8">
        <EmailCapture
          source="article-inline"
          heading="Found this useful? Get more frameworks like it."
        />
      </div>

      {/* ── Article Body ── */}
      <article
        className="max-w-[45rem] mx-auto px-4 py-10 prose"
        data-testid="article-body"
      >
        <MDXContent code={article.code} />
      </article>

      {/* ── Email Capture (after article) ── */}
      <div className="max-w-[45rem] mx-auto px-4 pb-10">
        <EmailCapture
          source="article-end"
          heading="Get more frameworks like this"
          description="Decision intelligence for eCommerce operators, delivered to your inbox."
        />
      </div>

      {/* ── Related Articles ── */}
      {relatedArticles.length > 0 && (
        <section className="bg-[--color-surface-raised] border-t border-[--color-border] py-14">
          <div className="max-w-[65rem] mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard
                  key={related.slug}
                  title={related.title}
                  slug={related.slug}
                  description={related.description}
                  topic={related.topic}
                  topicLabel={related.topicLabel}
                  readingTime={related.readingTime}
                  publishedAt={related.publishedAt}
                  featured={related.featured}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
