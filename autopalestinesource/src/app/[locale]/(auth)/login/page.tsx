import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage({
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
        {t('loginTitle')}
      </h1>
      <p className="mb-8 text-body-md text-muted-foreground">
        {t('loginSubtitle')}
      </p>
      <LoginForm />
    </div>
  );
}
