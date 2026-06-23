'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

const fieldClass = cn(
  'w-full rounded-[var(--radius)] border border-input bg-muted px-3 py-2 text-body-md text-foreground',
  'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
);

function SearchSidebar({
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
    rating: params.get('rating') ?? '',
    sort: params.get('sort') ?? '',
    verified: params.get('verified') === '1',
  };

  function apply(next: Partial<typeof current>) {
    const merged = { ...current, ...next };
    const search = new URLSearchParams();
    if (merged.q) search.set('q', merged.q);
    if (merged.city) search.set('city', merged.city);
    if (merged.category) search.set('category', merged.category);
    if (merged.rating) search.set('rating', merged.rating);
    if (merged.sort) search.set('sort', merged.sort);
    if (merged.verified) search.set('verified', '1');
    const qs = search.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  }

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-card">
      <h3 className="text-headline-md text-foreground">{t('filtersTitle')}</h3>

      <div className="space-y-2">
        <h4 className="text-body-lg text-muted-foreground">{t('city')}</h4>
        <select
          className={fieldClass}
          value={current.city}
          onChange={(e) => apply({ city: e.target.value })}
        >
          <option value="">{t('allCities')}</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h4 className="text-body-lg text-muted-foreground">{t('category')}</h4>
        <select
          className={fieldClass}
          value={current.category}
          onChange={(e) => apply({ category: e.target.value })}
        >
          <option value="">{t('allCategories')}</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h4 className="text-body-lg text-muted-foreground">{t('rating')}</h4>
        <select
          className={fieldClass}
          value={current.rating}
          onChange={(e) => apply({ rating: e.target.value })}
        >
          <option value="">{t('ratingAny')}</option>
          <option value="4">{t('rating4plus')}</option>
        </select>
      </div>

      <div className="space-y-2">
        <h4 className="text-body-lg text-muted-foreground">{t('sort')}</h4>
        <select
          className={fieldClass}
          value={current.sort}
          onChange={(e) => apply({ sort: e.target.value })}
        >
          <option value="">{t('sortRelevance')}</option>
          <option value="rating">{t('sortRating')}</option>
          <option value="reviews">{t('sortReviews')}</option>
          <option value="newest">{t('sortNewest')}</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-body-md text-foreground">
        <input
          type="checkbox"
          className="size-5 accent-primary"
          checked={current.verified}
          onChange={(e) => apply({ verified: e.target.checked })}
        />
        {t('verifiedOnly')}
      </label>
    </div>
  );
}

export { SearchSidebar };
