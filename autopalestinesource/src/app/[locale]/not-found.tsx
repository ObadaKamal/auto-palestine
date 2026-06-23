import { getTranslations } from 'next-intl/server';

import { PageContainer } from '@/components/layout/page-container';
import { StateView } from '@/components/ui/state-view';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <PageContainer className="py-24">
      <StateView
        variant="error"
        title={t('notFoundTitle')}
        description={t('notFoundDesc')}
        action={
          <Button asChild>
            <Link href="/">{t('backHome')}</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}
