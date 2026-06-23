import { ArrowLeft, Star } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CategoryBrowser } from '@/components/business/category-browser';
import { CategoryIcon } from '@/components/common/category-icon';
import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { PageContainer } from '@/components/layout/page-container';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listCategories } from '@/lib/api';
import { formatCount, getLocalized } from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  return { title: t('title') };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('categories');
  const categories = await listCategories();

  const countLabel = (n: number) =>
    t('shopsCount', { count: formatCount(n, activeLocale) });

  const featured = categories[0];
  const secondary = categories.slice(1, 3);

  const browserItems = categories.map((c) => ({
    slug: c.slug,
    name: getLocalized(c.name, activeLocale),
    icon: c.icon,
    count: countLabel(c.businessCount),
  }));

  return (
    <PageContainer className="py-12">
      {/* Header */}
      <section className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-headline-lg text-foreground md:text-headline-xl">
          {t('title')}
        </h1>
        <p className="text-body-lg text-muted-foreground">{t('subtitle')}</p>
      </section>

      {/* Popular bento */}
      {featured ? (
        <section className="mb-16">
          <h2 className="mb-8 flex items-center gap-2 text-headline-md text-foreground">
            <Star className="size-5 fill-warning text-warning" />
            {t('popular')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <Link
              href={`/categories/${featured.slug}`}
              className="group grid overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-modal md:col-span-8 md:grid-cols-2"
            >
              <CoverPlaceholder
                seed={featured.businessCount + 5}
                className="h-48 w-full md:h-full"
              />
              <div className="flex flex-col justify-center gap-3 p-8">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-6">
                  <CategoryIcon name={featured.icon} />
                </span>
                <h3 className="text-headline-md text-foreground">
                  {getLocalized(featured.name, activeLocale)}
                </h3>
                <span className="text-body-md text-muted-foreground">
                  {countLabel(featured.businessCount)}
                </span>
                <span className="flex items-center gap-2 font-bold text-primary">
                  {t('browseShops')}
                  <ArrowLeft className="size-4 rtl:rotate-180" />
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-6 md:col-span-4">
              {secondary.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group flex flex-1 flex-col justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-modal"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-[var(--radius)] bg-muted text-secondary transition-colors group-hover:bg-primary/10 group-hover:text-primary [&_svg]:size-5">
                      <CategoryIcon name={category.icon} />
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-label-md text-muted-foreground">
                      {countLabel(category.businessCount)}
                    </span>
                  </div>
                  <h3 className="text-headline-md text-foreground">
                    {getLocalized(category.name, activeLocale)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* All categories + search */}
      <CategoryBrowser categories={browserItems} />
    </PageContainer>
  );
}
