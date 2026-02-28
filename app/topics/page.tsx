import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/.velite';

export const metadata: Metadata = {
  title: 'Topics — eCommerce Decision Domains',
  description:
    'Browse AHAeCommerce by topic. Platform, operations, marketing, finance, technology, team, strategy, logistics, and customer experience.',
  openGraph: {
    title: 'Topics | AHAeCommerce',
    description:
      'Every eCommerce decision domain, systematically covered.',
  },
};

const allTopics = [
  {
    slug: 'platform',
    label: 'Platform',
    description:
      'Shopify, WooCommerce, custom — platform decisions you make early define what you can build later.',
  },
  {
    slug: 'operations',
    label: 'Operations',
    description:
      'SOPs, inventory, fulfillment, and workflows. Operational decisions that separate stores that scale from stores that stall.',
  },
  {
    slug: 'marketing',
    label: 'Marketing',
    description:
      'Acquisition, retention, and attribution. Marketing system decisions, not tactics.',
  },
  {
    slug: 'finance',
    label: 'Finance',
    description:
      'Unit economics, margins, cash flow, and the costs operators discover too late.',
  },
  {
    slug: 'technology',
    label: 'Technology',
    description:
      'Tech stack decisions, integration trade-offs, and the hidden costs of technical choices.',
  },
  {
    slug: 'team',
    label: 'Team',
    description:
      'Hiring, outsourcing, and org structure decisions for eCommerce operators.',
  },
  {
    slug: 'strategy',
    label: 'Strategy',
    description:
      'Long-game decisions: positioning, business model, expansion, and exit.',
  },
  {
    slug: 'logistics',
    label: 'Logistics',
    description:
      'Shipping, 3PLs, returns, and cross-border. Logistics decisions that affect margin and brand.',
  },
  {
    slug: 'customer',
    label: 'Customer',
    description:
      'CX, support, loyalty, and the decisions that build or destroy customer lifetime value.',
  },
];

export default function TopicsPage() {
  const publishedArticles = articles.filter((a) => !a.draft);

  // Count articles per topic
  const topicCounts = allTopics.map((topic) => ({
    ...topic,
    count: publishedArticles.filter((a) => a.topic === topic.slug).length,
  }));

  return (
    <div className="py-14 md:py-20">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
          Topics
        </h1>
        <p className="text-[--color-text-secondary] font-sans text-base mt-2 max-w-[45rem]">
          Every eCommerce decision domain, systematically covered. Browse by the area
          most relevant to the decision you&rsquo;re facing right now.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {topicCounts.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="border border-[--color-border] rounded-md p-6 bg-[--color-surface] hover:border-[--color-border-brand] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 transition-base block group"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold font-sans text-[--color-text] group-hover:text-[--color-text-brand] transition-base">
                  {topic.label}
                </h2>
                {topic.count > 0 && (
                  <span className="text-xs font-sans text-[--color-text-muted] bg-[--color-surface-raised] px-2 py-1 rounded-full shrink-0">
                    {topic.count}
                  </span>
                )}
              </div>
              <p className="text-sm font-sans text-[--color-text-secondary] mt-2 leading-relaxed">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
