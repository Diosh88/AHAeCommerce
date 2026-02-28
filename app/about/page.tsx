import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/shared/EmailCapture';

export const metadata: Metadata = {
  title: 'About AHAeCommerce',
  description:
    'AHAeCommerce exists to answer the questions eCommerce operators actually ask — before they make the decisions that cost the most.',
  openGraph: {
    title: 'About AHAeCommerce',
    description:
      'AHAeCommerce exists to answer the questions eCommerce operators actually ask.',
  },
};

const editorialQuestions = [
  {
    question: 'Does this clarify a decision?',
    explanation:
      'Every operator faces a version of this decision. Does this article help them choose with confidence?',
  },
  {
    question: 'Does this prevent a mistake?',
    explanation:
      'Is there a common error operators make here? Does this article name it clearly enough to stop it?',
  },
  {
    question: 'Does this reveal a cost?',
    explanation:
      'Are there hidden costs — in money, time, complexity, or opportunity — that operators miss? Does this surface them?',
  },
  {
    question: 'Does this explain a trade-off?',
    explanation:
      'Is there a meaningful tension between approaches? Does this article map it honestly?',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="max-w-[45rem]">
          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
            About AHAeCommerce
          </h1>
          <p className="text-lg font-sans text-[--color-text-secondary] mt-4 leading-relaxed">
            AHAeCommerce exists to answer the questions eCommerce operators actually ask &mdash;
            before they make the decisions that cost the most.
          </p>
        </div>

        {/* ── Editorial philosophy ── */}
        <div className="mt-14 max-w-[45rem]">
          <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-4">
            What we are
          </h2>
          <div className="prose">
            <p>
              The internet is full of eCommerce content. Most of it is tutorials, trend reports,
              and tool documentation that answers the question &ldquo;how do I click this
              button?&rdquo; &mdash; not &ldquo;should I use this platform, and what will it
              cost me three years from now?&rdquo;
            </p>
            <p>
              AHAeCommerce is different. We publish the A&ndash;Z of eCommerce decisions,
              systems, and realities. Not step-by-step tutorials. Not trending tactics. Not
              tool documentation.
            </p>
            <p>
              Every article we publish must answer at least one of these questions:
            </p>
          </div>

          {/* Editorial gate questions */}
          <div className="mt-8 space-y-4">
            {editorialQuestions.map((item, index) => (
              <div
                key={index}
                className="border border-[--color-border] rounded-md p-5 bg-[--color-surface]"
              >
                <h3 className="text-base font-semibold font-sans text-[--color-text-brand] mb-2">
                  {item.question}
                </h3>
                <p className="text-sm font-sans text-[--color-text-secondary] leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base font-sans text-[--color-text-secondary] mt-6 leading-relaxed">
            If an article doesn&rsquo;t pass at least one of these, we don&rsquo;t publish it.
            Full stop.
          </p>
        </div>

        {/* ── Who it's for ── */}
        <div className="mt-14 max-w-[45rem]">
          <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-4">
            Who this is for
          </h2>
          <div className="prose">
            <p>
              AHAeCommerce is for eCommerce operators: founders, directors of eCommerce,
              heads of growth, and the agencies and consultants who work with them.
            </p>
            <p>
              If you&rsquo;re evaluating a platform, building a system, managing a team, or
              trying to understand why your margins look the way they do &mdash; this is for you.
            </p>
            <p>
              If you&rsquo;re looking for beginner tutorials or trend round-ups, there are
              better resources. We&rsquo;re not them.
            </p>
          </div>
        </div>

        {/* ── Strategic partners mention ── */}
        <div className="mt-14 max-w-[45rem]">
          <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-4">
            Behind the work
          </h2>
          <div className="prose">
            <p>
              AHAeCommerce is built on real operational experience. The frameworks published
              here come from working inside eCommerce businesses &mdash; not observing them
              from the outside.
            </p>
            <p>
              We partner with{' '}
              <strong>HavenWizards</strong> for backend execution and reference{' '}
              <strong>Bayanihan Harvest</strong> as a proof point of systems depth.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4">
          <Link
            href="/start-here"
            className="bg-[--color-brand] hover:bg-[--color-brand-hover] text-[--color-text-inverse] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Start reading
          </Link>
          <Link
            href="/topics"
            className="border border-[--color-border-brand] text-[--color-text-brand] hover:bg-[--color-brand-light] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Browse topics
          </Link>
        </div>

        {/* ── Email Capture ── */}
        <div className="mt-16 max-w-[45rem]">
          <EmailCapture
            source="subscribe-page"
            heading="Get frameworks in your inbox"
          />
        </div>
      </div>
    </div>
  );
}
