'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

const selectClass = cn(
  'h-10 rounded-[var(--radius)] border border-input bg-muted px-3 text-body-md text-foreground',
  'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
);

function FilterBar({
  cities,
  categories,
}: {
  cities: Option[];
  categories: Option[];
}) {
  const t = useTranslations('discovery');
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    q: params.get('q') ?? '',
    city: params.get('city') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? '',
    verified: params.get('verified') === '1',
  };

  function apply(next: Partial<typeof current>) {
    const merged = { ...current, ...next };
    const search = new URLSearchParams();
    if (merged.q) search.set('q', merged.q);
    if (merged.city) search.set('city', merged.city);
    if (merged.category) search.set('category', merged.category);
    if (merged.sort) search.set('sort', merged.sort);
    if (merged.verified) search.set('verified', '1');
    const qs = search.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  }

  const hasFilters =
    current.city || current.category || current.sort || current.verified;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label={t('city')}
        className={selectClass}
        value={current.city}
        onChange={(event) => apply({ city: event.target.value })}
      >
        <option value="">{t('allCities')}</option>
        {cities.map((city) => (
          <option key={city.value} value={city.value}>
            {city.label}
          </option>
        ))}
      </select>

      <select
        aria-label={t('category')}
        className={selectClass}
        value={current.category}
        onChange={(event) => apply({ category: event.target.value })}
      >
        <option value="">{t('allCategories')}</option>
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <select
        aria-label={t('sort')}
        className={selectClass}
        value={current.sort}
        onChange={(event) => apply({ sort: event.target.value })}
      >
        <option value="">{t('sortRelevance')}</option>
        <option value="rating">{t('sortRating')}</option>
        <option value="reviews">{t('sortReviews')}</option>
        <option value="newest">{t('sortNewest')}</option>
      </select>

      <label className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-input bg-muted px-3 text-label-md text-foreground">
        <input
          type="checkbox"
          className="accent-primary"
          checked={current.verified}
          onChange={(event) => apply({ verified: event.target.checked })}
        />
        {t('verifiedOnly')}
      </label>

      {hasFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            apply({ city: '', category: '', sort: '', verified: false })
          }
        >
          {t('clear')}
        </Button>
      ) : null}
    </div>
  );
}

export { FilterBar };
