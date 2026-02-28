import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you were looking for does not exist.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="py-24 md:py-32">
      {/* React 19 hoists <meta> to <head>. Metadata exports from not-found.tsx
          are not processed by Next.js App Router, so we render directly. */}
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-[45rem] mx-auto px-4 text-center">
        <p className="text-6xl font-extrabold font-sans text-[--color-brand] leading-none">
          404
        </p>

        <h1 className="text-3xl font-bold leading-tight font-sans text-[--color-text] mt-4">
          Page Not Found
        </h1>

        <p className="text-base font-sans text-[--color-text-secondary] mt-3 leading-relaxed">
          The page you&rsquo;re looking for doesn&rsquo;t exist, was moved, or the URL
          is incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="bg-[--color-brand] hover:bg-[--color-brand-hover] text-[--color-text-inverse] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Back to home
          </Link>
          <Link
            href="/articles"
            className="border border-[--color-border-brand] text-[--color-text-brand] hover:bg-[--color-brand-light] font-semibold px-6 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 text-base font-sans inline-flex items-center justify-center min-h-[44px]"
          >
            Browse all articles
          </Link>
        </div>

        <p className="text-sm font-sans text-[--color-text-muted] mt-8">
          Looking for something specific?{' '}
          <Link
            href="/search"
            className="text-[--color-text-brand] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
          >
            Try search
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
