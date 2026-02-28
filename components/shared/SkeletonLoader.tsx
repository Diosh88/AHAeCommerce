import React from 'react';

type SkeletonVariant = 'article-card' | 'article-hero' | 'text-block' | 'article-grid';

interface SkeletonLoaderProps {
  variant: SkeletonVariant;
}

function ArticleCardSkeleton() {
  return (
    <div
      className="border border-[--color-border] rounded-md p-6 bg-[--color-surface] animate-pulse"
      aria-hidden="true"
    >
      {/* Badge skeleton */}
      <div className="h-5 w-20 bg-[--color-surface-raised] rounded-full" />
      {/* Title skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-5 bg-[--color-surface-raised] rounded w-full" />
        <div className="h-5 bg-[--color-surface-raised] rounded w-4/5" />
      </div>
      {/* Description skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-[--color-surface-raised] rounded w-full" />
        <div className="h-4 bg-[--color-surface-raised] rounded w-full" />
        <div className="h-4 bg-[--color-surface-raised] rounded w-3/5" />
      </div>
      {/* Metadata skeleton */}
      <div className="flex gap-3 mt-4">
        <div className="h-3 w-16 bg-[--color-surface-raised] rounded" />
        <div className="h-3 w-2 bg-[--color-surface-raised] rounded" />
        <div className="h-3 w-24 bg-[--color-surface-raised] rounded" />
      </div>
    </div>
  );
}

function ArticleHeroSkeleton() {
  return (
    <div
      className="max-w-[45rem] mx-auto px-4 animate-pulse py-12"
      aria-hidden="true"
    >
      {/* Badge */}
      <div className="h-5 w-24 bg-[--color-surface-raised] rounded-full" />
      {/* Title */}
      <div className="mt-4 space-y-3">
        <div className="h-10 bg-[--color-surface-raised] rounded w-full" />
        <div className="h-10 bg-[--color-surface-raised] rounded w-3/4" />
      </div>
      {/* Description */}
      <div className="mt-4 space-y-2">
        <div className="h-5 bg-[--color-surface-raised] rounded w-full" />
        <div className="h-5 bg-[--color-surface-raised] rounded w-5/6" />
      </div>
      {/* Metadata */}
      <div className="flex gap-4 mt-6">
        <div className="h-4 w-20 bg-[--color-surface-raised] rounded" />
        <div className="h-4 w-2 bg-[--color-surface-raised] rounded" />
        <div className="h-4 w-28 bg-[--color-surface-raised] rounded" />
      </div>
    </div>
  );
}

function TextBlockSkeleton() {
  return (
    <div
      className="space-y-3 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-4 bg-[--color-surface-raised] rounded w-full" />
      <div className="h-4 bg-[--color-surface-raised] rounded w-full" />
      <div className="h-4 bg-[--color-surface-raised] rounded w-11/12" />
      <div className="h-4 bg-[--color-surface-raised] rounded w-full" />
      <div className="h-4 bg-[--color-surface-raised] rounded w-4/5" />
    </div>
  );
}

function ArticleGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-hidden="true"
      aria-label="Loading articles"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SkeletonLoader({ variant }: SkeletonLoaderProps) {
  const skeletons: Record<SkeletonVariant, React.ReactNode> = {
    'article-card': <ArticleCardSkeleton />,
    'article-hero': <ArticleHeroSkeleton />,
    'text-block': <TextBlockSkeleton />,
    'article-grid': <ArticleGridSkeleton />,
  };

  return (
    <div role="status" aria-label="Loading content">
      {skeletons[variant]}
    </div>
  );
}
