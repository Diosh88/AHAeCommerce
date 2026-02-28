import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles } from '@/.velite';
import { ArticleCard } from '@/components/shared/ArticleCard';
import { EmailCapture } from '@/components/shared/EmailCapture';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

const topicMeta: Record<string, { label: string; description: string }> = {
  platform: {
    label: 'Platform',
    description:
      'Shopify, WooCommerce, custom — platform decisions you make early define what you can build later. Get the framework before you commit.',
  },
  operations: {
    label: 'Operations',
    description:
      'SOPs, inventory, fulfillment, and workflows. Operational decisions that separate stores that scale from stores that stall.',
  },
  marketing: {
    label: 'Marketing',
    description:
      'Acquisition, retention, and attribution. Marketing system decisions, not tactics.',
  },
  finance: {
    label: 'Finance',
    description:
      'Unit economics, margins, cash flow, and the costs operators discover too late.',
  },
  technology: {
    label: 'Technology',
    description:
      'Tech stack decisions, integration trade-offs, and the hidden costs of technical choices.',
  },
  team: {
    label: 'Team',
    description:
      'Hiring, outsourcing, and org structure decisions for eCommerce operators.',
  },
  strategy: {
    label: 'Strategy',
    description:
      'Long-game decisions: positioning, business model, expansion, and exit.',
  },
  logistics: {
    label: 'Logistics',
    description:
      'Shipping, 3PLs, returns, and cross-border. Logistics decisions that affect margin and brand.',
  },
  customer: {
    label: 'Customer',
    description:
      'CX, support, loyalty, and the decisions that build or destroy customer lifetime value.',
  },
};

export async function generateStaticParams() {
  const topics = [...new Set(articles.filter((a) => !a.draft).map((a) => a.topic))];
  return topics.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: TopicPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const meta = topicMeta[slug];

  if (!meta) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: `${meta.label} — eCommerce Decision Frameworks`,
    description: meta.description,
    openGraph: {
      title: `${meta.label} — eCommerce Decision Frameworks | AHAeCommerce`,
      description: meta.description,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const meta = topicMeta[slug];

  if (!meta) {
    notFound();
  }

  const topicArticles = articles
    .filter((a) => a.topic === slug && !a.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const articleCount = topicArticles.length;

  return (
    <>
      {/* ── Topic Hero ── */}
      <div className="bg-[--color-brand-light] border-b border-[--color-border] py-14 md:py-20">
        <div className="max-w-[65rem] mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
            {meta.label}
          </h1>
          <p className="text-lg font-sans text-[--color-text-secondary] mt-3 max-w-[45rem] leading-relaxed">
            {meta.description}
          </p>
          <p className="text-sm font-sans text-[--color-text-muted] mt-4">
            {articleCount === 0
              ? 'Content launching soon'
              : `${articleCount} article${articleCount === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {/* ── Article Grid ── */}
      <div className="py-14 md:py-20">
        <div className="max-w-[65rem] mx-auto px-4 md:px-6">
          {topicArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-semibold font-sans text-[--color-text-secondary]">
                No articles yet in {meta.label}.
              </p>
              <p className="text-base font-sans text-[--color-text-muted] mt-2">
                Subscribe to be first to know when frameworks drop.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topicArticles.map((article) => (
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

          {/* Email capture */}
          <div className="max-w-[45rem] mx-auto mt-14">
            <EmailCapture
              source="category-page"
              heading={`Stay ahead of ${meta.label} decisions`}
              description="Get frameworks and realities from operators who&apos;ve been there."
            />
          </div>
        </div>
      </div>
    </>
  );
}
