import { MessageSquare, Store } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RatingStars } from '@/components/common/rating-stars';
import { Button } from '@/components/ui/button';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { listAllBusinesses } from '@/lib/api';
import { getLocalized } from '@/lib/format';
import type { ReviewStatus } from '@/types';

const cardClass =
  'rounded-xl border border-border bg-card shadow-[0_4px_20px_rgba(11,25,44,0.05)]';

const statusPill: Record<ReviewStatus, string> = {
  published: 'bg-success/10 text-success',
  pending: 'bg-warning/15 text-warning',
  hidden: 'bg-muted text-muted-foreground',
};

const statusDot: Record<ReviewStatus, string> = {
  published: 'bg-success',
  pending: 'bg-warning',
  hidden: 'bg-muted-foreground',
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('');
}

export default async function AdminReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('admin');
  const ownerReviews = await getTranslations('ownerReviews');
  const businesses = await listAllBusinesses();

  const statusLabel: Record<ReviewStatus, string> = {
    published: t('reviewPublished'),
    pending: t('reviewPending'),
    hidden: t('reviewHidden'),
  };

  const rows = businesses.flatMap((business) =>
    business.reviews.map((review) => ({
      review,
      businessName: getLocalized(business.name, activeLocale),
    })),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('reviewsTitle')}</h1>

      {rows.length === 0 ? (
        <div className={`overflow-hidden ${cardClass}`}>
          <StateView icon={<MessageSquare />} title={ownerReviews('empty')} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map(({ review, businessName }) => (
            <div key={review.id} className={`p-6 ${cardClass}`}>
              <div className="flex items-start gap-4">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-label-md font-bold text-secondary uppercase"
                  dir="ltr"
                >
                  {initials(review.authorName)}
                </span>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {review.authorName}
                      </p>
                      <p className="flex items-center gap-1.5 text-label-md text-muted-foreground">
                        <Store className="size-3.5" />
                        {businessName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <RatingStars
                        rating={review.rating}
                        locale={activeLocale}
                      />
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md font-medium ${statusPill[review.status]}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${statusDot[review.status]}`}
                        />
                        {statusLabel[review.status]}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-body-md leading-relaxed text-muted-foreground">
                    {getLocalized(review.comment, activeLocale)}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="text-label-md text-muted-foreground tabular-nums">
                      {review.createdAt}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        {t('hide')}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('reject')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
