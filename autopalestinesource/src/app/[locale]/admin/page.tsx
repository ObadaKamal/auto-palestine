import {
  CalendarDays,
  Car,
  Download,
  Eye,
  Store,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getAdminStats, listAllBusinesses, listCategories } from '@/lib/api';
import { formatCompact, formatCount, getLocalized } from '@/lib/format';

const cardClass =
  'rounded-xl border border-border bg-card shadow-[0_4px_20px_rgba(11,25,44,0.05)]';

const statusDot: Record<string, string> = {
  active: 'bg-success',
  pending: 'bg-warning',
  draft: 'bg-warning',
  suspended: 'bg-destructive',
};

const statusPill: Record<string, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/15 text-warning',
  draft: 'bg-warning/15 text-warning',
  suspended: 'bg-destructive/10 text-destructive',
};

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('admin');
  const status = await getTranslations('statusLabels');

  const [stats, businesses, categories] = await Promise.all([
    getAdminStats(),
    listAllBusinesses(),
    listCategories(),
  ]);

  const num = (n: number) => formatCount(n, activeLocale);
  const categoryName = (ids: string[]) => {
    const c = categories.find((x) => x.id === ids[0]);
    return c ? getLocalized(c.name, activeLocale) : '—';
  };

  // ---- Category distribution (dynamic) ----
  const counts = new Map<string, number>();
  for (const b of businesses) {
    const id = b.categoryIds[0] ?? 'other';
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const total = businesses.length || 1;
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id, count]) => ({
      id,
      label: categoryName([id]),
      pct: Math.round((count / total) * 100),
    }));
  const topPct = ranked.reduce((sum, r) => sum + r.pct, 0);
  const segments = [
    ...ranked,
    { id: 'other', label: t('otherCategory'), pct: Math.max(0, 100 - topPct) },
  ];
  const segColors = ['var(--secondary)', 'var(--primary)', 'var(--muted)'];
  let acc = 0;
  const gradientStops = segments
    .map((s, i) => {
      const start = acc;
      acc += s.pct;
      return `${segColors[i]} ${start}% ${acc}%`;
    })
    .join(', ');

  const months = t('monthsShort').split(',');

  const metrics: {
    icon: ReactNode;
    iconTone: string;
    label: string;
    value: string;
    trend: ReactNode;
    accent?: boolean;
  }[] = [
    {
      icon: <Store />,
      iconTone: 'bg-surface-container-low text-secondary',
      label: t('totalShops'),
      value: num(stats.totalBusinesses),
      trend: (
        <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-label-md font-medium text-success">
          <TrendingUp className="size-4" />
          12.5%
        </span>
      ),
    },
    {
      icon: <Users />,
      iconTone: 'bg-surface-container-low text-secondary',
      label: t('totalUsers'),
      value: num(stats.totalUsers),
      trend: (
        <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-label-md font-medium text-success">
          <TrendingUp className="size-4" />
          8.2%
        </span>
      ),
    },
    {
      icon: <Wallet />,
      iconTone: 'bg-surface-container-low text-secondary',
      label: t('monthlyRevenue'),
      value: `₪ ${formatCompact(stats.monthlyRevenue, activeLocale)}`,
      trend: (
        <span className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-label-md font-medium text-destructive">
          <TrendingDown className="size-4" />
          2.1%
        </span>
      ),
    },
    {
      icon: <CalendarDays />,
      iconTone: 'bg-primary/10 text-primary',
      label: t('pendingApprovals'),
      value: num(stats.pendingApprovals),
      accent: true,
      trend: (
        <span className="rounded-md bg-surface-container-low px-2 py-1 text-label-md font-medium text-muted-foreground">
          {t('urgent')}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-headline-xl text-foreground">
            {t('overviewTitle')}
          </h1>
          <p className="mt-2 text-body-lg text-muted-foreground">
            {t('welcomeBack')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-label-md text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <CalendarDays className="size-5" />
            {t('last30Days')}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-label-md text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Download className="size-5" />
            {t('exportReport')}
          </button>
        </div>
      </div>

      {/* Metrics grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`group relative overflow-hidden p-6 ${cardClass} transition-shadow hover:shadow-[0_8px_30px_rgba(11,25,44,0.08)]`}
          >
            <span
              className={`absolute inset-y-0 end-0 w-1 bg-primary transition-opacity ${m.accent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            />
            <div className="mb-4 flex items-start justify-between">
              <span
                className={`flex size-12 items-center justify-center rounded-lg [&_svg]:size-7 ${m.iconTone}`}
              >
                {m.icon}
              </span>
              {m.trend}
            </div>
            <p className="mb-1 text-body-md text-muted-foreground">{m.label}</p>
            <h3 className="text-headline-xl text-foreground tabular-nums">
              {m.value}
            </h3>
          </div>
        ))}
      </section>

      {/* Charts bento */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Growth chart */}
        <div className={`flex flex-col p-8 lg:col-span-2 ${cardClass}`}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-headline-md text-foreground">
              {t('platformGrowth')}
            </h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-label-md text-muted-foreground">
                <span className="size-3 rounded-full bg-secondary" />
                {t('legendUsers')}
              </span>
              <span className="flex items-center gap-2 text-label-md text-muted-foreground">
                <span className="size-3 rounded-full bg-primary" />
                {t('legendShops')}
              </span>
            </div>
          </div>
          <div className="relative mt-4 min-h-[300px] flex-1 border-s border-b border-border">
            <div className="absolute inset-0 flex flex-col justify-between opacity-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-0 w-full border-t border-border" />
              ))}
            </div>
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,90 Q20,80 40,50 T80,30 T100,10"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,95 Q30,85 50,60 T90,40 T100,35"
                fill="none"
                stroke="var(--primary)"
                strokeDasharray="4"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="mt-4 flex justify-between px-2 text-label-md text-muted-foreground">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Category distribution donut */}
        <div className={`flex flex-col p-8 ${cardClass}`}>
          <h3 className="mb-6 text-headline-md text-foreground">
            {t('categoryDistribution')}
          </h3>
          <div className="flex flex-1 items-center justify-center">
            <div
              className="relative flex size-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${gradientStops})`,
              }}
            >
              <div className="flex size-32 flex-col items-center justify-center rounded-full bg-card">
                <span className="text-3xl font-bold text-foreground">
                  {formatCompact(stats.totalBusinesses, activeLocale)}
                </span>
                <span className="text-label-md text-muted-foreground">
                  {t('activeLabel')}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {segments.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-label-md"
              >
                <div className="flex items-center gap-2 text-foreground">
                  <span
                    className="size-3 rounded-sm"
                    style={{ background: segColors[i] }}
                  />
                  {s.label}
                </div>
                <span className="font-bold text-foreground tabular-nums">
                  {s.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent applications */}
      <div className={`overflow-hidden ${cardClass}`}>
        <div className="flex items-center justify-between border-b border-border bg-surface-container-low p-6">
          <h3 className="text-headline-md text-foreground">
            {t('recentApplications')}
          </h3>
          <Link
            href="/admin/businesses"
            className="text-label-md text-primary hover:underline"
          >
            {t('viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="border-b border-border bg-surface-container-low text-label-md text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-start font-medium">
                  {t('name')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('type')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('date')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('status')}
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-md text-foreground">
              {businesses.slice(0, 5).map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-muted text-secondary">
                        <Car className="size-5" />
                      </span>
                      <div>
                        <p className="font-medium">
                          {getLocalized(b.name, activeLocale)}
                        </p>
                        <p className="text-label-md text-muted-foreground">
                          {getLocalized(b.location.city, activeLocale)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {categoryName(b.categoryIds)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground tabular-nums">
                    {b.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md font-medium ${statusPill[b.status] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${statusDot[b.status] ?? 'bg-muted-foreground'}`}
                      />
                      {status(b.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href="/admin/businesses"
                      className="inline-flex rounded-full p-2 text-secondary transition-colors hover:bg-muted hover:text-primary"
                      aria-label={t('view')}
                    >
                      <Eye className="size-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
