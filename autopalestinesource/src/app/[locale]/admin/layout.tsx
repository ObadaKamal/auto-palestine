import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import type { ConsoleNavItem } from '@/components/layout/console-nav';
import { ConsoleShell } from '@/components/layout/console-shell';
import { getSession } from '@/lib/auth/session';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('adminNav');
  const consoleT = await getTranslations('console');

  const items: ConsoleNavItem[] = [
    { href: '/admin', label: t('overview'), icon: 'LayoutDashboard' },
    { href: '/admin/businesses', label: t('businesses'), icon: 'Building2' },
    {
      href: '/admin/verification',
      label: t('verification'),
      icon: 'BadgeCheck',
    },
    { href: '/admin/reviews', label: t('reviews'), icon: 'Star' },
    { href: '/admin/users', label: t('users'), icon: 'UserCog' },
    { href: '/admin/plans', label: t('plans'), icon: 'Tags' },
  ];

  return (
    <ConsoleShell
      title={consoleT('adminTitle')}
      items={items}
      locale={locale}
      userName={session.name}
    >
      {children}
    </ConsoleShell>
  );
}
