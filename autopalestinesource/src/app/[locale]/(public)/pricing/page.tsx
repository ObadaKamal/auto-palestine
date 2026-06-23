import { Award, HelpCircle, Store, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PlanCard } from '@/components/dashboard/plan-card';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listPlans } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return { title: t('title') };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('pricing');
  const common = await getTranslations('common');
  const plans = await listPlans();

  const planMeta: Record<string, { icon: ReactNode; subtitle: string }> = {
    free: { icon: <Store />, subtitle: t('subFree') },
    pro: { icon: <TrendingUp />, subtitle: t('subPro') },
    business: { icon: <Award />, subtitle: t('subBusiness') },
  };

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-secondary py-20 text-center text-white">
        <PageContainer className="max-w-3xl">
          <h1 className="mb-6 text-headline-lg md:text-headline-xl">
            {t('heroTitle')}{' '}
            <span className="text-primary">{common('appName')}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-body-lg text-white/80">
            {t('heroSubtitle')}
          </p>
        </PageContainer>
      </section>

      {/* Plans */}
      <PageContainer className="relative z-10 -mt-12 pb-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
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
      </PageContainer>

      {/* FAQ */}
      <PageContainer className="pb-24">
        <div className="rounded-lg bg-surface-container-low p-8 md:p-16">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-headline-lg text-foreground">
              {t('faqTitle')}
            </h2>
            <p className="text-body-lg text-muted-foreground">
              {t('faqSubtitle')}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="py-6">
                  <h4 className="mb-2 flex items-center gap-2 text-body-lg font-semibold text-foreground">
                    <HelpCircle className="size-5 text-primary" />
                    {faq.q}
                  </h4>
                  <p className="text-body-md text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center gap-4 p-6 text-center">
              <h4 className="text-body-lg font-semibold text-foreground">
                {t('moreQuestions')}
              </h4>
              <Button asChild variant="outline">
                <Link href="/contact">{t('contactSupport')}</Link>
              </Button>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
