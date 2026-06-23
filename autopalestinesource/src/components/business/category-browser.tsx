'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { CategoryIcon } from '@/components/common/category-icon';
import { Link } from '@/i18n/navigation';

type Item = {
  slug: string;
  name: string;
  icon: string;
  count: string;
};

function CategoryBrowser({ categories }: { categories: Item[] }) {
  const t = useTranslations('categories');
  const [query, setQuery] = React.useState('');
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-headline-md text-foreground">
          {t('allCategories')}
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchCategory')}
            aria-label={t('searchCategory')}
            className="w-full rounded-lg border border-input bg-card py-3 ps-4 pe-12 text-body-md text-foreground shadow-card focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group flex flex-col items-center rounded-lg border border-transparent bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:border-secondary/30 hover:shadow-modal"
          >
            <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-secondary transition-colors group-hover:bg-primary/10 group-hover:text-primary [&_svg]:size-7">
              <CategoryIcon name={category.icon} />
            </span>
            <h3 className="mb-2 text-body-lg font-semibold text-foreground">
              {category.name}
            </h3>
            <span className="rounded-full bg-muted px-3 py-1 text-label-md text-muted-foreground">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { CategoryBrowser };
