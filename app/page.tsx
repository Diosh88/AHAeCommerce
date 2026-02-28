import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/.velite';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { EmailCapture } from '@/components/shared/EmailCapture';

export const metadata: Metadata = {
  title: 'A\u2013Z eCommerce Decision Intelligence | AHAeCommerce',
  description:
    'Decision frameworks, system blueprints, and cost realities for eCommerce operators. Cut through the noise. Build what works.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahaecommerce.com',
  },
  openGraph: {
    title: 'A\u2013Z eCommerce Decision Intelligence | AHAeCommerce',
    description:
      'Decision frameworks, system blueprints, and cost realities for eCommerce operators. Cut through the noise. Build what works.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A\u2013Z eCommerce Decision Intelligence | AHAeCommerce',
    description:
      'Decision frameworks, system blueprints, and cost realities for eCommerce operators.',
  },
};

const topicCards = [
  { slug: 'platform', label: 'Platform', description: 'Shopify vs WooCommerce vs custom. Choose without regret.' },
  { slug: 'operations', label: 'Operations', description: 'SOPs, workflows, and systems that scale.' },
  { slug: 'marketing', label: 'Marketing', description: 'Acquisition frameworks, not tactics.' },
  { slug: 'finance', label: 'Finance', description: 'Unit economics, margins, and cash flow realities.' },
  { slug: 'technology', label: 'Technology', description: 'Tech stack decisions and integration trade-offs.' },
  { slug: 'strategy', label: 'Strategy', description: 'Long-game decisions for sustainable eCommerce.' },
];

export default function HomePage() {
  const publishedArticles = articles
    .filter((a) => !a.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const featuredArticles = publishedArticles.filter((a) => a.featured).slice(0, 3);
  const recentArticles = publishedArticles.slice(0, 6);
  const hasArticles = publishedArticles.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[--color-brand] text-[--color-text-inverse] py-20 md:py-28">
        <div className="max-w-[65rem] mx-auto px-4 md:px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight font-sans text-[--color-text-inverse]">
            The A&ndash;Z of eCommerce Decisions
          </h1>
          <p className="mt-6 text-xl font-sans text-[--color-text-inverse] opacity-90 max-w-[45rem] leading-relaxed">
            Not tutorials. Not trends. Decision frameworks, system blueprints, and cost realities
            for operators who build to last.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/subscribe"
              className="bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
            >
              Subscribe &mdash; it&apos;s free
            </Link>
            <Link
              href="/start-here"
              className="border border-[--color-text-inverse] text-[--color-text-inverse] hover:bg-[--color-text-inverse] hover:text-[--color-text-brand] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-text-inverse] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
            >
              Start Here
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Articles ── */}
      {hasArticles && featuredArticles.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-[65rem] mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold leading-tight font-sans text-[--color-text] mb-8">
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  slug={article.slug}
                  description={article.description}
                  topic={article.topic}
                  topicLabel={article.topicLabel}
                  readingTime={article.readingTime}
                  publishedAt={article.publishedAt}
                  featured={article.featured}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty state — no articles yet ── */}
      {!hasArticles && (
        <section className="py-20">
          <div className="max-w-[65rem] mx-auto px-4 md:px-6 text-center">
            <p className="text-2xl font-semibold font-sans text-[--color-text-secondary]">
              Content launching soon.
            </p>
            <p className="mt-3 text-base font-sans text-[--color-text-muted]">
              Subscribe below to be first to know when frameworks drop.
            </p>
          </div>
        </section>
      )}

      {/* ── Topics Overview ── */}
      <section className="py-16 md:py-20 bg-[--color-surface-raised]">
        <div className="max-w-[65rem] mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold leading-tight font-sans text-[--color-text] mb-2">
            Browse by Topic
          </h2>
          <p className="text-[--color-text-secondary] font-sans text-base mb-8">
            Every decision domain, systematically covered.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicCards.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="border border-[--color-border] rounded-md p-5 bg-[--color-surface] hover:border-[--color-border-brand] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 transition-base block"
              >
                <h3 className="text-lg font-semibold font-sans text-[--color-text] mb-1">
                  {topic.label}
                </h3>
                <p className="text-sm font-sans text-[--color-text-secondary] leading-normal">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inline Email Capture ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-[45rem] mx-auto px-4">
          <EmailCapture
            source="home-hero"
            heading="Get decision frameworks in your inbox"
            description="No spam. No trends. Pure decision intelligence for eCommerce operators."
          />
        </div>
      </section>

      {/* ── Recent Articles ── */}
      {recentArticles.length > 0 && (
        <section className="py-16 md:py-20 bg-[--color-surface-raised]">
          <div className="max-w-[65rem] mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-tight font-sans text-[--color-text]">
                Recent Articles
              </h2>
              <Link
                href="/articles"
                className="text-sm font-semibold font-sans text-[--color-text-brand] hover:text-[--color-brand-hover] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  slug={article.slug}
                  description={article.description}
                  topic={article.topic}
                  topicLabel={article.topicLabel}
                  readingTime={article.readingTime}
                  publishedAt={article.publishedAt}
                  featured={article.featured}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
