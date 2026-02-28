import type { MetadataRoute } from 'next';
import { articles } from '@/.velite';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahaecommerce.com';

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/start-here`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/topics`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/articles`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/subscribe`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
];

const topicSlugs = [
  'platform',
  'operations',
  'marketing',
  'finance',
  'technology',
  'team',
  'strategy',
  'logistics',
  'customer',
];

const topicRoutes: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
  url: `${BASE_URL}/topics/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => !a.draft)
    .map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: article.featured ? 0.9 : 0.7,
    }));

  return [...staticRoutes, ...topicRoutes, ...articleRoutes];
}
