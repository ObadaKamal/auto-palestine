import { ExternalLink, LogOut } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoMark } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import {
  ConsoleNav,
  type ConsoleNavItem,
} from '@/components/layout/console-nav';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { logoutAction } from '@/lib/auth/actions';

async function ConsoleShell({
  title,
  items,
  locale,
  userName,
  children,
}: {
  title: string;
  items: ConsoleNavItem[];
  locale: string;
  userName: string;
  children: ReactNode;
}) {
  const t = await getTranslations('console');

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface-container-low md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4 text-secondary dark:text-white">
          <LogoMark className="size-8" />
          <span className="text-body-lg font-semibold text-foreground">
            {title}
          </span>
        </div>
        <ConsoleNav items={items} />
        {userName ? (
          <div className="mt-auto border-t border-border p-4">
            <p className="text-label-md text-muted-foreground">
              {t('account')}
            </p>
            <p className="truncate text-body-md text-foreground" dir="ltr">
              {userName}
            </p>
          </div>
        ) : null}
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-8">
          <span className="text-body-lg text-foreground md:hidden">
            {title}
          </span>
          <div className="ms-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ExternalLink />
                <span className="hidden sm:inline">{t('backToSite')}</span>
              </Link>
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <form action={logoutAction.bind(null, locale)}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut />
                <span className="hidden sm:inline">{t('signOut')}</span>
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export { ConsoleShell };
