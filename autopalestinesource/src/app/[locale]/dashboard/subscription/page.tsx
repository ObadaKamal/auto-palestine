import { CheckCircle2, Download, Receipt } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PlanCard } from '@/components/dashboard/plan-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Locale } from '@/i18n/routing';
import { listPlans } from '@/lib/api';
import { formatPrice, getLocalized } from '@/lib/format';

const currentPlanId = 'pro';

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('subscription');
  const plans = await listPlans();

  const current = plans.find((p) => p.id === currentPlanId) ?? plans[0]!;
  const others = plans.filter((p) => p.id !== current.id);
  const invoices = ['2026-05-15', '2026-04-15', '2026-03-15'];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
        <p className="mt-1 text-body-md text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: current plan + billing */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Card className="relative overflow-hidden">
            <CardContent className="py-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-headline-md text-foreground">
                    {getLocalized(current.name, activeLocale)}
                  </h3>
                  <Badge variant="success">
                    <CheckCircle2 className="size-3.5" />
                    {t('active')}
                  </Badge>
                </div>
                <div className="text-end">
                  <span className="block text-3xl font-bold text-foreground">
                    {formatPrice(current.priceMonthly, activeLocale)}
                  </span>
                  <span className="text-label-md text-muted-foreground">
                    {t('perMonth')}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-body-md text-muted-foreground">
                {t('renewalDate', { date: '2026-07-15' })}
              </p>
              <h4 className="mb-2 text-label-md tracking-wider text-muted-foreground uppercase">
                {t('currentFeatures')}
              </h4>
              <ul className="mb-8 space-y-2">
                {current.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-md">
                    <CheckCircle2 className="size-4 text-secondary" />
                    {getLocalized(f, activeLocale)}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                {t('cancelSub')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-body-lg">
                {t('billingHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {invoices.map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-lg bg-surface-container-low p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-10 items-center justify-center rounded-[var(--radius)] bg-secondary/10 text-secondary">
                      <Receipt className="size-5" />
                    </span>
                    <div>
                      <p className="text-body-md font-medium text-foreground">
                        {t('invoice')}
                      </p>
                      <p className="text-label-md text-muted-foreground tabular-nums">
                        {date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-body-md text-foreground">
                      {formatPrice(current.priceMonthly, activeLocale)}
                    </span>
                    <button
                      type="button"
                      className="text-secondary transition-colors hover:text-primary"
                      aria-label="download"
                    >
                      <Download className="size-5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: other plans */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardContent className="py-8">
              <div className="mb-8">
                <h3 className="mb-2 text-headline-md text-foreground">
                  {t('otherPlans')}
                </h3>
                <p className="text-body-md text-muted-foreground">
                  {t('otherPlansDesc')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {others.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} locale={activeLocale} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
