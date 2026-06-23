import {
  Award,
  CheckCheck,
  CheckCircle2,
  Lightbulb,
  MailWarning,
  MessageSquare,
  ShieldCheck,
  Star,
  Stars,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/routing';
import { markNotificationsRead } from '@/lib/actions';
import { listNotifications, listPlans } from '@/lib/api';
import { getLocalized } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@/types';

type TypeConfig = {
  icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
  action: string;
};

const cardShadow = 'shadow-[0_4px_20px_rgba(11,25,44,0.06)]';

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('notifications');

  const [notifications, plans] = await Promise.all([
    listNotifications(),
    listPlans(),
  ]);

  const unread = notifications.filter((n) => !n.read).length;
  const currentPlan = plans.find((p) => p.id === 'pro') ?? plans[0]!;

  const typeConfig: Record<NotificationType, TypeConfig> = {
    review: {
      icon: Star,
      iconWrap: 'bg-primary/10',
      iconColor: 'text-primary',
      action: t('actionReview'),
    },
    lead: {
      icon: MessageSquare,
      iconWrap: 'bg-secondary/10',
      iconColor: 'text-secondary',
      action: t('actionLead'),
    },
    verification: {
      icon: ShieldCheck,
      iconWrap: 'bg-success/10',
      iconColor: 'text-success',
      action: t('actionVerification'),
    },
    system: {
      icon: Lightbulb,
      iconWrap: 'bg-warning/10',
      iconColor: 'text-warning',
      action: t('actionSystem'),
    },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <form action={markNotificationsRead}>
          <Button type="submit" variant="ghost" size="sm">
            <CheckCheck className="size-4" />
            {t('markAllRead')}
          </Button>
        </form>
      </div>

      {/* Bento summary grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Unread count */}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border border-border bg-card p-6',
            cardShadow,
          )}
        >
          <span className="absolute inset-y-0 start-0 w-1.5 bg-primary" />
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-body-md font-medium text-muted-foreground">
              {t('unreadCount')}
            </h3>
            <span className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <MailWarning className="size-5" />
            </span>
          </div>
          <div className="text-4xl font-bold text-foreground tabular-nums">
            {unread}
          </div>
        </div>

        {/* Subscription status */}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl bg-secondary p-6 text-white',
            cardShadow,
          )}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-body-md font-medium text-white/70">
                {t('subStatus')}
              </h3>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-primary">
                <Award className="size-5" />
              </span>
            </div>
            <div className="mb-1 text-2xl font-bold">
              {getLocalized(currentPlan.name, activeLocale)}
            </div>
            <p className="text-label-md text-white/70">
              {t('renewal', { date: '2026-07-15' })}
            </p>
          </div>
        </div>

        {/* All systems */}
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center',
            cardShadow,
          )}
        >
          <CheckCircle2 className="mb-3 size-9 text-success" />
          <h3 className="mb-1 font-bold text-foreground">{t('allSystems')}</h3>
          <p className="text-label-md text-muted-foreground">
            {t('allSystemsDesc')}
          </p>
        </div>
      </div>

      {/* Filters + list */}
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-border bg-card',
          cardShadow,
        )}
      >
        <div className="flex flex-wrap gap-3 border-b border-border bg-surface-container-low p-4 px-6">
          <span className="rounded-full bg-secondary px-5 py-2 text-label-md font-medium text-white">
            {t('filterAll')}
          </span>
          <span className="rounded-full bg-muted px-5 py-2 text-label-md font-medium text-muted-foreground">
            {t('filterUnread')} ({unread})
          </span>
          <span className="flex items-center gap-2 rounded-full bg-muted px-5 py-2 text-label-md font-medium text-muted-foreground">
            <Stars className="size-4" />
            {t('filterImportant')}
          </span>
        </div>

        <div className="flex flex-col">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className={cn(
                  'group relative flex items-start gap-5 border-b border-border p-6 transition-colors last:border-b-0 hover:bg-surface-container-low',
                  notification.read ? 'opacity-80 hover:opacity-100' : '',
                  !notification.read && 'bg-primary/5',
                )}
              >
                {!notification.read ? (
                  <span className="absolute inset-y-0 start-0 w-1 bg-primary" />
                ) : null}
                <span
                  className={cn(
                    'mt-1 flex size-12 shrink-0 items-center justify-center rounded-full',
                    config.iconWrap,
                    config.iconColor,
                  )}
                >
                  <Icon className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h4
                      className={cn(
                        'flex items-center gap-2 text-body-lg text-foreground',
                        notification.read ? 'font-medium' : 'font-bold',
                      )}
                    >
                      {getLocalized(notification.title, activeLocale)}
                      {!notification.read ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                          {t('isNew')}
                        </span>
                      ) : null}
                    </h4>
                    <span className="shrink-0 text-label-md text-muted-foreground tabular-nums">
                      {notification.createdAt}
                    </span>
                  </div>
                  <p className="mb-3 max-w-3xl text-body-md leading-relaxed text-muted-foreground">
                    {getLocalized(notification.body, activeLocale)}
                  </p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="text-label-md font-medium text-secondary transition-colors hover:text-primary"
                    >
                      {config.action}
                    </button>
                    {!notification.read ? (
                      <button
                        type="button"
                        className="text-label-md font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t('markRead')}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-6 text-center">
            <button
              type="button"
              className="rounded-full border border-border px-6 py-2 text-label-md font-medium text-secondary transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              {t('viewMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
