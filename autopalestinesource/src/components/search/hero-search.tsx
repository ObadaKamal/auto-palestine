'use client';

import { MapPin, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

function HeroSearch({ cities }: { cities: Option[] }) {
  const t = useTranslations('home');
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const [city, setCity] = React.useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city) params.set('city', city);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  }

  const fieldClass = cn(
    'w-full rounded-[var(--radius)] border-0 bg-muted py-4 pe-12 ps-4 text-body-md text-foreground',
    'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
  );

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-lg bg-card p-4 shadow-modal md:flex-row"
    >
      <div className="relative w-full flex-1">
        <Search className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('searchWhat')}
          aria-label={t('searchWhat')}
          className={fieldClass}
        />
      </div>
      <div className="relative w-full flex-1">
        <MapPin className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label={t('chooseCity')}
          className={cn(fieldClass, 'appearance-none')}
        >
          <option value="">{t('chooseCity')}</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-8 py-4 font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 md:w-auto"
      >
        <Search className="size-5" />
        {t('searchBtn')}
      </button>
    </form>
  );
}

export { HeroSearch };
