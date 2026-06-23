import { Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LeadsTable } from '@/components/dashboard/leads-table';
import { Card, CardContent } from '@/components/ui/card';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { listLeads } from '@/lib/api';

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('leads');
  const leads = await listLeads();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
      <Card>
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <StateView
              icon={<Users />}
              title={t('empty')}
              description={t('emptyDesc')}
            />
          ) : (
            <LeadsTable leads={leads} locale={locale as Locale} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
