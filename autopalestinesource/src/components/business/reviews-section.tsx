import { MessageSquare } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { RatingStars } from '@/components/common/rating-stars';
import { StateView } from '@/components/ui/state-view';
import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/lib/format';
import type { Review } from '@/types';

async function ReviewsSection({
  reviews,
  locale,
}: {
  reviews: Review[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'business' });
  const published = reviews.filter((review) => review.status === 'published');

  if (published.length === 0) {
    return (
      <StateView
        variant="empty"
        icon={<MessageSquare />}
        title={t('noReviews')}
        description={t('noReviewsDesc')}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {published.map((review) => (
        <li
          key={review.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-body-md text-foreground">
              {review.authorName}
            </span>
            <RatingStars rating={review.rating} locale={locale} />
          </div>
          <p className="mt-2 text-body-md text-muted-foreground">
            {getLocalized(review.comment, locale)}
          </p>
          {review.ownerReply ? (
            <div className="mt-3 rounded-md bg-surface-container-low p-3">
              <p className="text-label-md text-foreground">{t('ownerReply')}</p>
              <p className="mt-1 text-label-md text-muted-foreground">
                {getLocalized(review.ownerReply, locale)}
              </p>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export { ReviewsSection };
