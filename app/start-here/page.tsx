import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/.velite';
import { Badge } from '@/components/shared/Badge';
import { EmailCapture } from '@/components/shared/EmailCapture';

export const metadata: Metadata = {
  title: 'Where to Start | AHAeCommerce',
  description:
    'New to AHAeCommerce? Start here. A curated sequence of foundational decision frameworks for eCommerce operators.',
  openGraph: {
    title: 'Where to Start | AHAeCommerce',
    description:
      'Foundational decision frameworks for eCommerce operators, in the order that matters.',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function StartHerePage() {
  const foundationalArticles = articles
    .filter((a) => !a.draft && a.featured)
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());

  const allArticles = articles
    .filter((a) => !a.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  const displayArticles = foundationalArticles.length > 0 ? foundationalArticles : allArticles;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="max-w-[45rem]">
          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
            Where to Start
          </h1>
          <p className="text-lg font-sans text-[--color-text-secondary] mt-4 leading-relaxed">
            AHAeCommerce covers the A&ndash;Z of eCommerce decisions. If you&rsquo;re new here,
            start with these foundational frameworks. They form the decision architecture
            everything else builds on.
          </p>
        </div>

        {/* ── Reading roadmap ── */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-8">
            Foundational Reading
          </h2>

          {displayArticles.length === 0 ? (
            <div className="text-center py-16 border border-[--color-border] rounded-md bg-[--color-surface]">
              <p className="text-xl font-semibold font-sans text-[--color-text-secondary]">
                Content launching soon.
              </p>
              <p className="text-base font-sans text-[--color-text-muted] mt-2">
                Subscribe below to be first to know when foundational frameworks drop.
              </p>
            </div>
          ) : (
            <ol className="space-y-6" aria-label="Foundational reading list">
              {displayArticles.map((article, index) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex gap-5 border border-[--color-border] rounded-md p-6 bg-[--color-surface] hover:border-[--color-border-brand] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 transition-base group"
                    aria-label={`Step ${index + 1}: Read ${article.title}`}
                  >
                    {/* Step number */}
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[--color-brand] text-[--color-text-inverse] font-bold font-sans text-base shrink-0"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Badge variant="default">{article.topicLabel}</Badge>
                      <h3 className="text-xl font-semibold mt-2 mb-1 leading-snug font-sans text-[--color-text] group-hover:text-[--color-text-brand] transition-base">
                        {article.title}
                      </h3>
                      <p className="text-[--color-text-secondary] text-base leading-normal font-sans line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex gap-3 mt-3 text-[--color-text-muted] text-sm font-sans">
                        <span>{article.readingTime} min read</span>
                        <span aria-hidden="true">&middot;</span>
                        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* ── Email capture ── */}
        <div className="mt-16 max-w-[45rem]">
          <EmailCapture
            source="subscribe-page"
            heading="Keep the frameworks coming"
            description="Get new decision frameworks delivered to your inbox as they publish."
          />
        </div>
      </div>
    </div>
  );
}
