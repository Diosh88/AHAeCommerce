import type { Metadata } from 'next';
import { EmailCapture } from '@/components/shared/EmailCapture';

export const metadata: Metadata = {
  title: 'Subscribe — Get the A\u2013Z Decision Playbook, Free',
  description:
    'Join operators who get eCommerce decision frameworks, cost realities, and system blueprints delivered to their inbox. No spam. No trends. Pure signal.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahaecommerce.com'}/subscribe`,
  },
  openGraph: {
    title: 'Subscribe to AHAeCommerce',
    description:
      'Decision frameworks for eCommerce operators. Free. No spam.',
  },
};

const valueProps = [
  {
    heading: 'Decision frameworks, not tutorials',
    body: 'Every piece we publish answers: what decision does this clarify, what mistake does this prevent, what cost does this reveal?',
  },
  {
    heading: 'Written for operators, not beginners',
    body: 'If you run or build eCommerce operations, this is signal — not noise. No step-by-step setups. No trending tactics.',
  },
  {
    heading: 'A\u2013Z coverage across every domain',
    body: 'Platform, operations, marketing, finance, technology, team, logistics, strategy, and customer experience.',
  },
  {
    heading: 'No spam. Unsubscribe anytime.',
    body: 'We treat your inbox the way you should treat your customers\u2019 inboxes: with respect.',
  },
];

export default function SubscribePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="max-w-[45rem]">
          <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
            Get the A&ndash;Z Decision Playbook, Free
          </h1>
          <p className="text-lg font-sans text-[--color-text-secondary] mt-4 leading-relaxed">
            Decision frameworks, cost realities, and system blueprints for eCommerce operators.
            Not tutorials. Not trends. Pure decision intelligence.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Value props ── */}
          <div>
            <h2 className="text-2xl font-bold leading-tight font-sans text-[--color-text] mb-6">
              What you get
            </h2>
            <ul className="space-y-6" role="list">
              {valueProps.map((prop) => (
                <li key={prop.heading} className="flex gap-4">
                  <div
                    className="w-2 h-2 rounded-full bg-[--color-brand] mt-3 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-base font-semibold font-sans text-[--color-text] leading-snug">
                      {prop.heading}
                    </h3>
                    <p className="text-sm font-sans text-[--color-text-secondary] mt-1 leading-relaxed">
                      {prop.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="mt-10 p-4 bg-[--color-surface-raised] rounded-md border border-[--color-border]">
              <p className="text-sm font-sans text-[--color-text-secondary] italic">
                &ldquo;Finally, eCommerce content that respects my time. Every article has
                a decision I can act on.&rdquo;
              </p>
              <p className="text-xs font-sans text-[--color-text-muted] mt-2">
                &mdash; eCommerce operator
              </p>
            </div>
          </div>

          {/* ── Email form ── */}
          <div>
            <EmailCapture
              source="subscribe-page"
              heading="Subscribe \u2014 it\u2019s free"
              description="Join operators making better eCommerce decisions."
              variant="inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
