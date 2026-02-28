import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/.velite';
import { ArticleCard } from '@/components/shared/ArticleCard';

export const metadata: Metadata = {
  title: 'You\'re subscribed! | AHAeCommerce',
  description:
    'Welcome to AHAeCommerce. Your first decision framework is on its way.',
  robots: { index: false },
};

export default function ThankYouPage() {
  const suggestedArticles = articles
    .filter((a) => !a.draft && a.featured)
    .slice(0, 3);

  const fallbackArticles = articles
    .filter((a) => !a.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const displayArticles = suggestedArticles.length > 0 ? suggestedArticles : fallbackArticles;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">

        {/* ── Confirmation ── */}
        <div className="max-w-[45rem]">
          {/* Success check */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[--color-success-bg] border-2 border-[--color-success] mb-6"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 text-[--color-success]"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
            You&rsquo;re subscribed!
          </h1>

          <p className="text-lg font-sans text-[--color-text-secondary] mt-4 leading-relaxed">
            Welcome. Your first decision framework is on its way.
          </p>
        </div>

        {/* ── What to expect ── */}
        <div className="mt-12 max-w-[45rem]">
          <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-6">
            What to expect
          </h2>
          <ul className="space-y-4" role="list">
            <li className="flex gap-4">
              <div
                className="w-2 h-2 rounded-full bg-[--color-brand] mt-3 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-base font-semibold font-sans text-[--color-text]">
                  Decision frameworks, not content noise
                </h3>
                <p className="text-sm font-sans text-[--color-text-secondary] mt-1 leading-relaxed">
                  Every email we send answers: what decision does this clarify, what mistake
                  does this prevent, what cost does this reveal?
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="w-2 h-2 rounded-full bg-[--color-brand] mt-3 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-base font-semibold font-sans text-[--color-text]">
                  No weekly cadence pressure
                </h3>
                <p className="text-sm font-sans text-[--color-text-secondary] mt-1 leading-relaxed">
                  We publish when the framework is ready, not to fill a calendar. Quality
                  over frequency.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div
                className="w-2 h-2 rounded-full bg-[--color-brand] mt-3 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-base font-semibold font-sans text-[--color-text]">
                  Easy to unsubscribe
                </h3>
                <p className="text-sm font-sans text-[--color-text-secondary] mt-1 leading-relaxed">
                  Every email has an unsubscribe link. No friction, no guilt.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* ── Start reading ── */}
        {displayArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-6">
              Start reading while you wait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayArticles.map((article) => (
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
        )}

        {/* ── Nav CTA ── */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/start-here"
            className="bg-[--color-brand] hover:bg-[--color-brand-hover] text-[--color-text-inverse] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Start Here
          </Link>
          <Link
            href="/articles"
            className="border border-[--color-border-brand] text-[--color-text-brand] hover:bg-[--color-brand-light] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Browse all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
