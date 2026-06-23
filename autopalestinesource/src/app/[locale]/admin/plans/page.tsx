import { Award, Info, Store, TrendingUp } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { PlanCard } from '@/components/dashboard/plan-card';
import type { Locale } from '@/i18n/routing';
import { listPlans } from '@/lib/api';

export default async function AdminPlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('admin');
  const pricing = await getTranslations('pricing');
  const plans = await listPlans();

  const planMeta: Record<string, { icon: ReactNode; subtitle: string }> = {
    free: { icon: <Store />, subtitle: pricing('subFree') },
    pro: { icon: <TrendingUp />, subtitle: pricing('subPro') },
    business: { icon: <Award />, subtitle: pricing('subBusiness') },
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('plansTitle')}</h1>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-container-low p-4 text-label-md text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" />
        {t('demoNote')}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 pt-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            locale={activeLocale}
            elevated
            icon={planMeta[plan.id]?.icon}
            subtitle={planMeta[plan.id]?.subtitle}
          />
        ))}
      </div>
    </div>
  );
}
