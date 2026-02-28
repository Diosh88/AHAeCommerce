/**
 * [SPEC] ArticleCard component tests — Gate 4c component test requirement.
 *
 * Strategy: Render with @testing-library/react in jsdom. Mock next/link to
 * render as a plain anchor so href assertions work in jsdom context.
 *
 * Spec source: components/shared/ArticleCard.tsx
 *
 * Props interface:
 *   title: string
 *   slug: string
 *   description: string
 *   topic: string
 *   topicLabel: string
 *   readingTime: number
 *   publishedAt: string (ISO 8601)
 *   featured?: boolean (default false)
 *
 * Requirements:
 *   - Renders title text
 *   - Renders description text
 *   - Renders topicLabel in the Badge component
 *   - Link href is /articles/{slug}
 *   - Featured variant applies a distinct CSS class (border-l-4)
 *   - Non-featured variant does NOT apply the featured border class
 *   - readingTime and publishedAt are shown in the metadata row
 *   - accessible aria-label on the link includes the article title
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// [TEST] Mock next/link — renders as a real <a> in jsdom so href is queryable
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

import { ArticleCard } from '@/components/shared/ArticleCard';

// ── Default test props ────────────────────────────────────────────────────────

const defaultProps = {
  title: 'Why Platform Selection Is a 5-Year Decision',
  slug: 'platform-selection-five-year-decision',
  description: 'Choosing an eCommerce platform locks you in for years. Here is how to evaluate them like a systems operator, not a feature shopper.',
  topic: 'platform',
  topicLabel: 'Platform',
  readingTime: 8,
  publishedAt: '2024-03-15T00:00:00.000Z',
  featured: false,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ArticleCard', () => {

  describe('[SPEC] Content rendering', () => {
    it('renders the article title', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('renders the article description', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('renders the topic label in a badge', () => {
      render(<ArticleCard {...defaultProps} />);
      // topicLabel is passed to <Badge> — should be visible as text
      expect(screen.getByText(defaultProps.topicLabel)).toBeInTheDocument();
    });

    it('renders the reading time', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(`${defaultProps.readingTime} min read`)).toBeInTheDocument();
    });

    it('renders a time element with the correct dateTime attribute', () => {
      render(<ArticleCard {...defaultProps} />);
      const timeEl = document.querySelector('time');
      expect(timeEl).toBeInTheDocument();
      expect(timeEl).toHaveAttribute('dateTime', defaultProps.publishedAt);
    });

    it('renders a human-readable formatted date', () => {
      render(<ArticleCard {...defaultProps} />);
      // 2024-03-15 → 'Mar 15, 2024' (en-US locale)
      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument();
    });
  });

  describe('[SPEC] Link behavior', () => {
    it('wraps content in a link with href /articles/{slug}', () => {
      render(<ArticleCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/articles/${defaultProps.slug}`);
    });

    it('link href is correct for slugs with hyphens', () => {
      const props = { ...defaultProps, slug: 'multi-word-article-slug-here' };
      render(<ArticleCard {...props} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/articles/multi-word-article-slug-here');
    });

    it('link has accessible aria-label that includes the article title', () => {
      render(<ArticleCard {...defaultProps} />);
      const link = screen.getByRole('link');
      const ariaLabel = link.getAttribute('aria-label') ?? '';
      expect(ariaLabel).toContain(defaultProps.title);
    });
  });

  describe('[SPEC] Featured variant styling', () => {
    it('non-featured card does NOT have the featured border-l-4 class', () => {
      render(<ArticleCard {...defaultProps} featured={false} />);
      const link = screen.getByRole('link');
      // Non-featured uses border-[--color-border], not the brand border + border-l-4
      expect(link.className).not.toContain('border-l-4');
    });

    it('featured card has the border-l-4 class for visual distinction', () => {
      render(<ArticleCard {...defaultProps} featured={true} />);
      const link = screen.getByRole('link');
      // [SPEC] Featured variant: 'border-[--color-border-brand] border-l-4'
      expect(link.className).toContain('border-l-4');
    });

    it('featured card has the brand border color class', () => {
      render(<ArticleCard {...defaultProps} featured={true} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('border-[--color-border-brand]');
    });

    it('non-featured card defaults to standard border color class', () => {
      render(<ArticleCard {...defaultProps} featured={false} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('border-[--color-border]');
    });
  });

  describe('[SPEC] Default prop behavior', () => {
    it('featured defaults to false when omitted', () => {
      // Render without featured prop
      const { title, slug, description, topic, topicLabel, readingTime, publishedAt } = defaultProps;
      render(
        <ArticleCard
          title={title}
          slug={slug}
          description={description}
          topic={topic}
          topicLabel={topicLabel}
          readingTime={readingTime}
          publishedAt={publishedAt}
        />
      );
      const link = screen.getByRole('link');
      // No border-l-4 when featured is omitted
      expect(link.className).not.toContain('border-l-4');
    });
  });

  describe('[SPEC] Accessibility', () => {
    it('renders exactly one link per card', () => {
      render(<ArticleCard {...defaultProps} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
    });

    it('heading is an h3 element (correct hierarchy for card in a list)', () => {
      render(<ArticleCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(defaultProps.title);
    });
  });
});
