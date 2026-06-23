import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { PageContainer } from '@/components/layout/page-container';
import type { Locale } from '@/i18n/routing';
import { getBlogPostBySlug, listBlogSlugs } from '@/lib/api';
import { getLocalized } from '@/lib/format';

export async function generateStaticParams() {
  const slugs = await listBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const activeLocale = locale as Locale;
  return {
    title: getLocalized(post.title, activeLocale),
    description: getLocalized(post.excerpt, activeLocale),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('blog');

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <CoverPlaceholder seed={post.coverSeed} className="h-60 w-full" />
      <PageContainer className="max-w-3xl py-10">
        <p className="text-label-md text-muted-foreground tabular-nums">
          {t('by')} {post.author} · {post.publishedAt}
        </p>
        <h1 className="mt-2 text-headline-lg text-foreground">
          {getLocalized(post.title, activeLocale)}
        </h1>
        <p className="mt-6 text-body-lg leading-relaxed text-foreground">
          {getLocalized(post.body, activeLocale)}
        </p>
      </PageContainer>
    </article>
  );
}
