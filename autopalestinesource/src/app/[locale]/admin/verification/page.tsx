import { BadgeCheck, FileText, ShieldCheck } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { decideVerification } from '@/lib/actions';
import { listVerificationRequests } from '@/lib/api';
import { getLocalized } from '@/lib/format';

const cardClass =
  'rounded-xl border border-border bg-card shadow-[0_4px_20px_rgba(11,25,44,0.05)]';

export default async function AdminVerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('admin');
  const status = await getTranslations('statusLabels');
  const requests = await listVerificationRequests();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">
        {t('verificationTitle')}
      </h1>

      {requests.length === 0 ? (
        <div className={`overflow-hidden ${cardClass}`}>
          <StateView icon={<BadgeCheck />} title={t('emptyQueue')} />
        </div>
      ) : (
        <div className={`overflow-hidden ${cardClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="border-b border-border bg-surface-container-low text-label-md text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 text-start font-medium">
                    {t('business')}
                  </th>
                  <th className="px-6 py-4 text-start font-medium">
                    {t('documents')}
                  </th>
                  <th className="px-6 py-4 text-start font-medium">
                    {t('submitted')}
                  </th>
                  <th className="px-6 py-4 text-start font-medium">
                    {t('status')}
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-body-md text-foreground">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                          <ShieldCheck className="size-5" />
                        </span>
                        <p className="font-medium">
                          {getLocalized(request.businessName, activeLocale)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                        <FileText className="size-4" />
                        {request.documentsCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground tabular-nums">
                      {request.submittedAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-label-md font-medium text-warning">
                        <span className="size-1.5 rounded-full bg-warning" />
                        {status('pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <form
                          action={decideVerification.bind(
                            null,
                            request.id,
                            'approve',
                          )}
                        >
                          <Button type="submit" variant="primary" size="sm">
                            {t('approve')}
                          </Button>
                        </form>
                        <form
                          action={decideVerification.bind(
                            null,
                            request.id,
                            'reject',
                          )}
                        >
                          <Button type="submit" variant="outline" size="sm">
                            {t('reject')}
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
