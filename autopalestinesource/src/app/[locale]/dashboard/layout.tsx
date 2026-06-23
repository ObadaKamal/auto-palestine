import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import type { ConsoleNavItem } from '@/components/layout/console-nav';
import { ConsoleShell } from '@/components/layout/console-shell';
import { getSession } from '@/lib/auth/session';

export default async function DashboardLayout({
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
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('ownerNav');
  const consoleT = await getTranslations('console');

  const items: ConsoleNavItem[] = [
    { href: '/dashboard', label: t('overview'), icon: 'LayoutDashboard' },
    { href: '/dashboard/leads', label: t('leads'), icon: 'Users' },
    { href: '/dashboard/profile', label: t('profile'), icon: 'Store' },
    { href: '/dashboard/services', label: t('services'), icon: 'Wrench' },
    { href: '/dashboard/reviews', label: t('reviews'), icon: 'Star' },
    {
      href: '/dashboard/verification',
      label: t('verification'),
      icon: 'BadgeCheck',
    },
    {
      href: '/dashboard/subscription',
      label: t('subscription'),
      icon: 'CreditCard',
    },
    {
      href: '/dashboard/notifications',
      label: t('notifications'),
      icon: 'Bell',
    },
  ];

  return (
    <ConsoleShell
      title={consoleT('ownerTitle')}
      items={items}
      locale={locale}
      userName={session.name}
    >
      {children}
    </ConsoleShell>
  );
}
