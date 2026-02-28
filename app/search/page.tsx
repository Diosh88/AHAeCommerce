import type { Metadata } from 'next';
import { SearchBox } from '@/components/shared/SearchBox';

export const metadata: Metadata = {
  title: 'Search AHAeCommerce',
  description:
    'Search decision frameworks, cost realities, and system blueprints across all AHAeCommerce articles.',
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <div className="py-14 md:py-20">
      <div className="max-w-[65rem] mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
          Search
        </h1>
        <p className="text-[--color-text-secondary] font-sans text-base mt-2">
          Search across all published articles and frameworks.
        </p>

        <div className="mt-8">
          <SearchBox />
        </div>
      </div>
    </div>
  );
}
