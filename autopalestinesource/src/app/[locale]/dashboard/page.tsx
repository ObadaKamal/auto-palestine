import {
  CheckCircle2,
  Circle,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Star,
  Users,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { LeadsTable } from '@/components/dashboard/leads-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getOwnerStats, listLeads } from '@/lib/api';
import { formatCount, formatRating } from '@/lib/format';

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('overview');

  const [stats, leads] = await Promise.all([getOwnerStats(), listLeads()]);
  const num = (n: number) => formatCount(n, activeLocale);

  const statCards: { icon: ReactNode; label: string; value: string }[] = [
    { icon: <Eye />, label: t('profileViews'), value: num(stats.profileViews) },
    { icon: <Phone />, label: t('phoneClicks'), value: num(stats.phoneClicks) },
    {
      icon: <MessageCircle />,
      label: t('whatsappClicks'),
      value: num(stats.whatsappClicks),
    },
    {
      icon: <Navigation />,
      label: t('directionsClicks'),
      value: num(stats.directionsClicks),
    },
    { icon: <Users />, label: t('reviews'), value: num(stats.reviewCount) },
    {
      icon: <Star />,
      label: t('rating'),
      value: formatRating(stats.rating, activeLocale),
    },
  ];

  const checklist = [
    { label: t('checkLogo'), done: true },
    { label: t('checkHours'), done: true },
    { label: t('checkPhotos'), done: false },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-headline-lg text-foreground">{t('title')}</h1>

      {/* Stats grid */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <span className="mb-1 text-secondary [&_svg]:size-7">
                {stat.icon}
              </span>
              <span className="text-label-md text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-headline-md text-foreground">
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Performance chart placeholder */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-body-lg">
                {t('weeklyPerformance')}
              </CardTitle>
              <span className="text-label-md text-primary">
                {t('exportReport')}
              </span>
            </CardHeader>
            <CardContent>
              <div className="relative flex h-64 items-end justify-between gap-3 rounded-lg border border-border bg-surface-container-low p-6">
                {[25, 50, 75, 65, 100, 35, 80].map((h, i) => (
                  <div
                    key={i}
                    className={
                      i % 2
                        ? 'flex-1 rounded-t bg-primary'
                        : 'flex-1 rounded-t bg-secondary'
                    }
                    style={{ height: `${h}%` }}
                  />
                ))}
                <span className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-card px-4 py-2 text-body-md text-muted-foreground shadow-sm">
                  {t('chartPlaceholder')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent leads */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-body-lg">{t('recentLeads')}</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/leads">{t('viewAll')}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <LeadsTable leads={leads} locale={activeLocale} limit={3} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          <Card className="relative overflow-hidden">
            <span className="absolute inset-y-0 end-0 w-1.5 bg-primary" />
            <CardContent className="py-6">
              <h2 className="text-body-lg font-semibold text-foreground">
                {t('profileCompletion')}
              </h2>
              <p className="mt-1 text-body-md text-muted-foreground">
                {t('profileCompletionDesc', { percent: 85 })}
              </p>
              <div className="my-4 h-2.5 w-full rounded-full bg-muted">
                <div
                  className="h-2.5 rounded-full bg-primary"
                  style={{ width: '85%' }}
                />
              </div>
              <ul className="mb-6 space-y-2">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-body-md text-muted-foreground"
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Circle className="text-outline size-4" />
                    )}
                    {item.label}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/profile">{t('completeProfile')}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-body-lg">
                {t('quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/dashboard/services">
                  <Plus />
                  {t('qaAddService')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">
                  <ImageIcon />
                  {t('qaGallery')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/subscription">
                  <Star />
                  {t('qaSubscription')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
