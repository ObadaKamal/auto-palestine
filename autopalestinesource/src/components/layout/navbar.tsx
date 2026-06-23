import { getTranslations } from 'next-intl/server';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoMark } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

async function Navbar() {
  const t = await getTranslations('nav');
  const common = await getTranslations('common');

  const links = [
    { href: '/', label: t('home') },
    { href: '/search', label: t('search') },
    { href: '/categories', label: t('categories') },
    { href: '/pricing', label: t('pricing') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary dark:text-white"
        >
          <LogoMark className="size-9" />
          <span className="text-body-lg font-semibold text-foreground">
            {common('appName')}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-md text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="ms-1 hidden lg:inline-flex"
          >
            <Link href="/login">{t('login')}</Link>
          </Button>
          <Button
            asChild
            variant="primary"
            size="sm"
            className="hidden lg:inline-flex"
          >
            <Link href="/onboarding">{t('listBusiness')}</Link>
          </Button>
          <MobileNav
            links={links}
            loginLabel={t('login')}
            listLabel={t('listBusiness')}
            menuLabel={t('menu')}
            closeLabel={t('close')}
          />
        </div>
      </div>
    </header>
  );
}

export { Navbar };
