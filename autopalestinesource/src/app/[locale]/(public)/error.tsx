'use client';

import { useTranslations } from 'next-intl';

import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { StateView } from '@/components/ui/state-view';

export default function PublicError({ reset }: { reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <PageContainer className="py-24">
      <StateView
        variant="error"
        title={t('genericTitle')}
        description={t('genericDesc')}
        action={<Button onClick={reset}>{t('retry')}</Button>}
      />
    </PageContainer>
  );
}
