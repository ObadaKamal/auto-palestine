import { SearchX } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SearchResultCard } from '@/components/business/search-result-card';
import { PageContainer } from '@/components/layout/page-container';
import { MapPreview } from '@/components/search/map-preview';
import { SearchSidebar } from '@/components/search/search-sidebar';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { listCategories, listCities, searchBusinesses } from '@/lib/api';
import { getLocalized } from '@/lib/format';
import type { SortOption } from '@/types';

type SearchParams = Promise<{
  q?: string;
  city?: string;
  category?: string;
  sort?: string;
  rating?: string;
  verified?: string;
}>;

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const sp = await searchParams;

  const t = await getTranslations('discovery');
  const [cities, categories, result] = await Promise.all([
    listCities(),
    listCategories(),
    searchBusinesses({
      q: sp.q,
      city: sp.city,
      category: sp.category,
      verified: sp.verified === '1',
      rating: sp.rating ? Number(sp.rating) : undefined,
      sort: sp.sort as SortOption | undefined,
    }),
  ]);

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: getLocalized(c.name, activeLocale),
  }));
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: getLocalized(c.name, activeLocale),
  }));

  return (
    <PageContainer className="py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="space-y-6 md:col-span-3">
          <SearchSidebar cities={cityOptions} categories={categoryOptions} />
          <MapPreview />
        </aside>

        <section className="flex flex-col gap-6 md:col-span-9">
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h2 className="text-body-lg text-foreground">
              {t('resultsCount', { count: result.total })}
              {sp.q ? (
                <span className="font-bold"> · &ldquo;{sp.q}&rdquo;</span>
              ) : null}
            </h2>
          </div>

          {result.total === 0 ? (
            <div className="rounded-lg border border-border bg-card">
              <StateView
                variant="empty"
                icon={<SearchX />}
                title={t('noResults')}
                description={t('noResultsDesc')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {result.items.map((business) => (
                <SearchResultCard
                  key={business.id}
                  business={business}
                  locale={activeLocale}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
