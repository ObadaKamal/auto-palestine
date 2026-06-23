import { getTranslations } from 'next-intl/server';

import { LogoMark } from '@/components/common/logo';
import { PageContainer } from '@/components/layout/page-container';
import { Link } from '@/i18n/navigation';

async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-surface-container-low">
      <PageContainer className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary dark:text-white">
              <LogoMark className="size-9" />
              <span className="text-body-lg font-semibold text-foreground">
                {common('appName')}
              </span>
            </div>
            <p className="max-w-xs text-body-md text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-label-md text-foreground">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-body-md text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-foreground">
                  {nav('search')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  {nav('categories')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  {nav('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  {nav('blog')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-label-md text-foreground">{t('company')}</h3>
            <ul className="space-y-2 text-body-md text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {nav('about')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  {nav('faq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-label-md text-foreground">
              {t('forBusinesses')}
            </h3>
            <ul className="space-y-2 text-body-md text-muted-foreground">
              <li>
                <Link href="/onboarding" className="hover:text-foreground">
                  {nav('listBusiness')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {nav('login')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-label-md text-muted-foreground">
          © {year} {common('appName')}. {t('rights')}
        </p>
      </PageContainer>
    </footer>
  );
}

export { Footer };
