import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import type { Locale } from '@/i18n/routing';
import { listCategories, listCities } from '@/lib/api';
import { getLocalized } from '@/lib/format';

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('onboarding');

  const [cities, categories] = await Promise.all([
    listCities(),
    listCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
      <OnboardingWizard
        cityOptions={cities.map((city) => ({
          value: city.id,
          label: getLocalized(city.name, activeLocale),
        }))}
        categoryOptions={categories.map((category) => ({
          value: category.id,
          label: getLocalized(category.name, activeLocale),
        }))}
      />
    </div>
  );
}
