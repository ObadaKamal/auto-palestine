import { Map, Store, Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CategoryCard } from '@/components/business/category-card';
import { PageContainer } from '@/components/layout/page-container';
import { HeroSearch } from '@/components/search/hero-search';
import { Card, CardContent } from '@/components/ui/card';
import type { Locale } from '@/i18n/routing';
import { listCategories, listCities } from '@/lib/api';
import { getLocalized } from '@/lib/format';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;

  const t = await getTranslations('home');
  const [categories, cities] = await Promise.all([
    listCategories(),
    listCities(),
  ]);

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: getLocalized(city.name, activeLocale),
  }));

  const stats = [
    { icon: <Store />, value: '+500', label: t('statsWorkshops') },
    { icon: <Map />, value: '20', label: t('statsCities') },
    { icon: <Users />, value: '+10,000', label: t('statsClients') },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-secondary">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 20%, rgba(255,101,0,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06), transparent 40%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary" />
        </div>
        <PageContainer className="relative z-10 max-w-5xl py-20 text-center">
          <h1 className="mb-6 text-headline-lg-mobile text-white md:text-headline-xl">
            {t('heroTitle')}
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-body-lg text-white/80">
            {t('heroSubtitle')}
          </p>
          <HeroSearch cities={cityOptions} />
        </PageContainer>
      </section>

      {/* Stats */}
      <section className="bg-surface-container-low py-16">
        <PageContainer>
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="transition-shadow hover:shadow-modal"
              >
                <CardContent className="flex flex-col items-center gap-2 py-8">
                  <span className="text-primary [&_svg]:size-9">
                    {stat.icon}
                  </span>
                  <p className="text-headline-md text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-body-md text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Categories */}
      <section className="bg-background py-20">
        <PageContainer>
          <h2 className="mb-12 text-center text-headline-md text-foreground">
            {t('browseByCategory')}
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                locale={activeLocale}
              />
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
