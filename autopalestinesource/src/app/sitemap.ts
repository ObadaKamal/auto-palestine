import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { listBlogSlugs, listBusinessSlugs, listCategories } from '@/lib/api';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const staticPaths = [
  '',
  'search',
  'categories',
  'pricing',
  'blog',
  'about',
  'contact',
  'faq',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [businessSlugs, blogSlugs, categories] = await Promise.all([
    listBusinessSlugs(),
    listBlogSlugs(),
    listCategories(),
  ]);

  const paths = [
    ...staticPaths,
    ...categories.map((c) => `categories/${c.slug}`),
    ...businessSlugs.map((slug) => `business/${slug}`),
    ...blogSlugs.map((slug) => `blog/${slug}`),
  ];

  const now = new Date();
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path ? `/${path}` : ''}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );
}
