import { ArrowLeft, Car, Handshake, Rocket, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const values: { icon: ReactNode; title: string; body: string }[] = [
    { icon: <ShieldCheck />, title: t('p1Title'), body: t('p1Body') },
    { icon: <Rocket />, title: t('p2Title'), body: t('p2Body') },
    { icon: <Handshake />, title: t('p3Title'), body: t('p3Body') },
  ];

  return (
    <div className="flex flex-col">
      {/* Mission hero */}
      <PageContainer className="py-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="order-2 flex flex-col gap-6 md:order-1 md:col-span-5">
            <span className="text-label-md tracking-widest text-primary uppercase">
              {t('label')}
            </span>
            <h1 className="text-headline-lg text-foreground md:text-headline-xl">
              {t('heroTitle')}
            </h1>
            <p className="text-body-lg leading-relaxed text-muted-foreground">
              {t('intro')}
            </p>
            <Button asChild className="self-start">
              <Link href="/contact">
                {t('contactCta')}
                <ArrowLeft className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="order-1 grid h-[420px] grid-cols-2 gap-4 md:order-2 md:col-span-7">
            <CoverPlaceholder
              seed={7}
              className="col-span-2 h-full w-full rounded-xl"
            />
            <CoverPlaceholder seed={21} className="h-full w-full rounded-xl" />
            <div className="flex flex-col items-center justify-center rounded-xl bg-secondary p-6 text-center text-white">
              <Car className="mb-2 size-12 text-primary" />
              <span className="text-headline-md">{t('statValue')}</span>
              <span className="text-label-md text-white/80">
                {t('statLabel')}
              </span>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Core values */}
      <section className="bg-surface-container-low py-16">
        <PageContainer>
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-headline-md text-foreground">
              {t('valuesTitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-body-md text-muted-foreground">
              {t('valuesSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="flex flex-col gap-3 py-8">
                  <span className="flex size-12 items-center justify-center rounded-[var(--radius)] bg-muted text-secondary [&_svg]:size-6">
                    {value.icon}
                  </span>
                  <h3 className="text-body-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-body-md leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
