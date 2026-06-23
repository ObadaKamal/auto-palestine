'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

function AuthToggle() {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const isLogin = pathname.startsWith('/login');

  const tab =
    'flex-1 rounded-full py-2 text-center text-label-md transition-all';
  const active = 'bg-card text-foreground shadow-sm';
  const inactive = 'text-muted-foreground hover:text-foreground';

  return (
    <div className="mx-auto mb-10 flex w-64 rounded-full bg-surface-container p-1 shadow-inner">
      <Link href="/login" className={cn(tab, isLogin ? active : inactive)}>
        {t('login')}
      </Link>
      <Link href="/register" className={cn(tab, !isLogin ? active : inactive)}>
        {t('signupTab')}
      </Link>
    </div>
  );
}

export { AuthToggle };
