import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BusinessCardGrid } from '@/components/business/business-card-grid';
import { PageContainer } from '@/components/layout/page-container';
import { SectionHeader } from '@/components/layout/section-header';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { getCategoryBySlug, listCategories, searchBusinesses } from '@/lib/api';
import { getLocalized } from '@/lib/format';

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: getLocalized(category.name, locale as Locale) };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const t = await getTranslations('discovery');
  const result = await searchBusinesses({ category: category.id });

  return (
    <PageContainer className="py-10">
      <SectionHeader
        title={getLocalized(category.name, activeLocale)}
        description={t('resultsCount', { count: result.total })}
      />
      <div className="mt-8">
        {result.total === 0 ? (
          <StateView
            variant="empty"
            icon={<SearchX />}
            title={t('noResults')}
            description={t('noResultsDesc')}
          />
        ) : (
          <BusinessCardGrid businesses={result.items} locale={activeLocale} />
        )}
      </div>
    </PageContainer>
  );
}
