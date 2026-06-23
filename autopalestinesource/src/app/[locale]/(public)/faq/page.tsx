import { ArrowLeft, Headset } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { listFaqs } from '@/lib/api';
import { getLocalized } from '@/lib/format';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return { title: t('title') };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('faq');
  const faqs = await listFaqs();

  return (
    <PageContainer className="max-w-4xl py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-headline-lg text-foreground md:text-headline-xl">
          {t('title')}
        </h1>
        <p className="mx-auto max-w-2xl text-body-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="mb-16 flex flex-col gap-4"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="overflow-hidden rounded-lg border border-border bg-card px-6 transition-shadow hover:shadow-card"
          >
            <AccordionTrigger className="text-body-lg font-semibold text-foreground">
              {getLocalized(faq.question, activeLocale)}
            </AccordionTrigger>
            <AccordionContent className="text-body-md text-muted-foreground">
              {getLocalized(faq.answer, activeLocale)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex flex-col items-center rounded-xl bg-secondary p-8 text-center text-white shadow-modal">
        <Headset className="mb-4 size-12 text-primary" />
        <h2 className="mb-2 text-headline-md">{t('needHelpTitle')}</h2>
        <p className="mx-auto mb-6 max-w-md text-body-md text-white/80">
          {t('needHelpDesc')}
        </p>
        <Button asChild>
          <Link href="/contact">
            {t('contactUs')}
            <ArrowLeft className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}
