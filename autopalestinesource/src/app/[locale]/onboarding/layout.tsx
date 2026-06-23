import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoMark } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Link } from '@/i18n/navigation';
import { getSession } from '@/lib/auth/session';

export default async function OnboardingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/register`);
  }

  const common = await getTranslations('common');
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary dark:text-white"
        >
          <LogoMark className="size-9" />
          <span className="text-body-lg font-semibold text-foreground">
            {common('appName')}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        {children}
      </main>
    </div>
  );
}
