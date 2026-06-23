import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RegisterForm } from '@/components/auth/register-form';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');

  return (
    <div>
      <h1 className="mb-2 text-headline-md text-foreground">
        {t('registerTitle')}
      </h1>
      <p className="mb-6 text-body-md text-muted-foreground">
        {t('registerSubtitle')}
      </p>
      <RegisterForm />
    </div>
  );
}
