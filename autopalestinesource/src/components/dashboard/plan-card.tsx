import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Locale } from '@/i18n/routing';
import { formatPrice, getLocalized } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types';

async function PlanCard({
  plan,
  locale,
  current = false,
  elevated = false,
  subtitle,
  icon,
}: {
  plan: SubscriptionPlan;
  locale: Locale;
  current?: boolean;
  elevated?: boolean;
  subtitle?: string;
  icon?: ReactNode;
}) {
  const t = await getTranslations('subscription');
  const price =
    plan.priceMonthly === 0 ? '—' : formatPrice(plan.priceMonthly, locale);

  return (
    <Card
      className={cn(
        'relative flex flex-col items-center p-8 text-center',
        plan.isPopular && 'ring-2 ring-primary',
        elevated && plan.isPopular && 'md:-translate-y-6',
      )}
    >
      {plan.isPopular ? (
        <Badge
          variant="primary"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          {t('mostPopular')}
        </Badge>
      ) : null}

      {icon ? (
        <span
          className={cn(
            'mb-6 flex size-16 items-center justify-center rounded-full [&_svg]:size-7',
            plan.isPopular
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-secondary',
          )}
        >
          {icon}
        </span>
      ) : null}

      <h3 className="text-headline-md text-foreground">
        {getLocalized(plan.name, locale)}
      </h3>
      {subtitle ? (
        <p className="mt-1 text-body-md text-muted-foreground">{subtitle}</p>
      ) : null}

      <p className="mt-6 mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {plan.priceMonthly > 0 ? (
          <span className="text-body-md text-muted-foreground">
            {t('perMonth')}
          </span>
        ) : null}
      </p>

      <CardContent className="flex w-full flex-grow flex-col p-0">
        <ul className="mb-10 flex w-full flex-grow flex-col gap-4 text-start">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-body-md">
              <Check className="size-5 shrink-0 text-success" />
              {getLocalized(feature, locale)}
            </li>
          ))}
        </ul>
        <Button
          variant={current ? 'outline' : plan.isPopular ? 'primary' : 'outline'}
          disabled={current}
          className="w-full"
        >
          {current ? t('currentBadge') : t('choosePlan')}
        </Button>
      </CardContent>
    </Card>
  );
}

export { PlanCard };
