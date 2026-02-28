import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/shared/Badge';

interface ArticleCardProps {
  title: string;
  slug: string;
  description: string;
  topic: string;
  topicLabel: string;
  readingTime: number;
  publishedAt: string;
  featured?: boolean;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleCard({
  title,
  slug,
  description,
  topic: _topic,
  topicLabel,
  readingTime,
  publishedAt,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className={[
        'block border rounded-md p-6 bg-[--color-surface]',
        'hover:border-[--color-border-brand] hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2',
        'transition-base group',
        featured
          ? 'border-[--color-border-brand] border-l-4'
          : 'border-[--color-border]',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Read article: ${title}`}
    >
      <Badge variant="default">{topicLabel}</Badge>

      <h3 className="text-xl font-semibold mt-3 mb-2 leading-snug font-sans text-[--color-text] group-hover:text-[--color-text-brand] transition-base">
        {title}
      </h3>

      <p className="text-[--color-text-secondary] text-base leading-normal line-clamp-3 font-sans">
        {description}
      </p>

      <div className="flex gap-3 mt-4 text-[--color-text-muted] text-sm font-sans items-center">
        <span>{readingTime} min read</span>
        <span aria-hidden="true">·</span>
        <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      </div>
    </Link>
  );
}
