import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AuthToggle } from '@/components/auth/auth-toggle';
import { LogoMark } from '@/components/common/logo';
import { Link } from '@/i18n/navigation';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations('common');
  const a = await getTranslations('auth');

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-container-low p-4 md:p-8">
      <main className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-modal">
        {/* Brand side */}
        <div className="relative hidden w-1/2 flex-col justify-end gap-6 bg-secondary p-10 text-white md:flex">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 20%, rgba(255,101,0,0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 45%)',
            }}
          />
          <Link
            href="/"
            className="relative flex items-center gap-2 text-white"
          >
            <LogoMark className="size-12" variant="light" />
            <span className="text-headline-md font-semibold">
              {t('appName')}
            </span>
          </Link>
          <p className="relative max-w-md text-body-lg text-white/85">
            {a('brandTagline')}
          </p>
        </div>

        {/* Forms side */}
        <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-10">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-secondary md:hidden dark:text-white"
          >
            <LogoMark className="size-10" />
            <span className="text-headline-md font-semibold text-foreground">
              {t('appName')}
            </span>
          </Link>
          <AuthToggle />
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
