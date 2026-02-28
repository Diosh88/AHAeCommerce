import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/.velite';
import { ArticleCard } from '@/components/shared/ArticleCard';

export const metadata: Metadata = {
  title: 'All Articles',
  description:
    'Browse every decision framework, cost reality, and system blueprint published on AHAeCommerce.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahaecommerce.com'}/articles`,
  },
  openGraph: {
    title: 'All Articles | AHAeCommerce',
    description:
      'Browse every decision framework, cost reality, and system blueprint published on AHAeCommerce.',
  },
};

const topicFilters = [
  { slug: '', label: 'All' },
  { slug: 'platform', label: 'Platform' },
  { slug: 'operations', label: 'Operations' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'team', label: 'Team' },
  { slug: 'strategy', label: 'Strategy' },
  { slug: 'logistics', label: 'Logistics' },
  { slug: 'customer', label: 'Customer' },
];

interface AllArticlesPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function AllArticlesPage({ searchParams }: AllArticlesPageProps) {
  const { topic } = await searchParams;
  const activeTopic = topic ?? '';

  const publishedArticles = articles
    .filter((a) => !a.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const filteredArticles = activeTopic
    ? publishedArticles.filter((a) => a.topic === activeTopic)
    : publishedArticles;

  return (
    <div className="py-14 md:py-20">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
          All Articles
        </h1>
        <p className="text-[--color-text-secondary] font-sans text-base mt-2">
          {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
          {activeTopic && ` in ${topicFilters.find((t) => t.slug === activeTopic)?.label}`}
        </p>

        {/* ── Topic filter tabs ── */}
        <nav
          aria-label="Filter articles by topic"
          className="mt-8 flex flex-wrap gap-2"
        >
          {topicFilters.map((filter) => {
            const isActive = filter.slug === activeTopic;
            const href =
              filter.slug === ''
                ? '/articles'
                : `/articles?topic=${filter.slug}`;

            return (
              <Link
                key={filter.slug || 'all'}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'px-4 py-2 rounded-full text-sm font-semibold font-sans transition-base min-h-[44px] inline-flex items-center',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-[--color-brand] text-[--color-text-inverse]'
                    : 'border border-[--color-border] text-[--color-text-secondary] hover:border-[--color-border-brand] hover:text-[--color-text-brand] bg-[--color-surface]',
                ].join(' ')}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Articles grid ── */}
        <div className="mt-10">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 border border-[--color-border] rounded-md bg-[--color-surface]">
              <p className="text-xl font-semibold font-sans text-[--color-text-secondary]">
                No articles yet
                {activeTopic && ` in ${topicFilters.find((t) => t.slug === activeTopic)?.label}`}.
              </p>
              <p className="text-base font-sans text-[--color-text-muted] mt-2">
                Content launching soon.{' '}
                <Link
                  href="/subscribe"
                  className="text-[--color-text-brand] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
                >
                  Subscribe
                </Link>{' '}
                to be first to know.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
