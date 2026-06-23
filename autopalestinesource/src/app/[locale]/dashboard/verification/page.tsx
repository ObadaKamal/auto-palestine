import { BadgeCheck, ShieldCheck, Upload } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requestVerification } from '@/lib/actions';
import { getOwnerBusiness } from '@/lib/api';
import { verificationTone } from '@/lib/status';
import type { VerificationStatus } from '@/types';

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('verification');
  const business = await getOwnerBusiness();
  const status = business.verificationStatus;

  const statusLabel: Record<VerificationStatus, string> = {
    unverified: t('statusUnverified'),
    pending: t('statusPending'),
    verified: t('statusVerified'),
    rejected: t('statusRejected'),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('title')}</h1>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-[var(--radius)] bg-accent text-secondary">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <p className="text-label-md text-muted-foreground">
                {t('current')}
              </p>
              <Badge variant={verificationTone[status]}>
                {statusLabel[status]}
              </Badge>
            </div>
          </div>
          {status === 'unverified' || status === 'rejected' ? (
            <form action={requestVerification}>
              <Button type="submit">
                <Upload />
                {t('requestVerification')}
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-body-lg">{t('benefitsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {[t('benefit1'), t('benefit2'), t('benefit3')].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-body-md"
              >
                <ShieldCheck className="size-4 shrink-0 text-success" />
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
