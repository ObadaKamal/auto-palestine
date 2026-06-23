import { Flag, MessageSquare, Star, Store } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StateView } from '@/components/ui/state-view';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/i18n/routing';
import { replyToReview } from '@/lib/actions';
import { getOwnerBusiness } from '@/lib/api';
import { formatCount, formatRating, getLocalized } from '@/lib/format';
import { cn } from '@/lib/utils';

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i < rounded ? 'fill-warning text-warning' : 'fill-muted text-muted'
          }
        />
      ))}
    </div>
  );
}

export default async function OwnerReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('ownerReviews');
  const business = await getOwnerBusiness();

  const reviews = business.reviews.filter((r) => r.status === 'published');
  const total = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
        <p className="mt-1 text-body-md text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="flex flex-col items-center gap-8 py-8 md:flex-row">
          <div className="flex min-w-[200px] flex-col items-center justify-center border-b border-border pb-6 text-center md:border-s md:border-b-0 md:ps-8 md:pb-0">
            <div className="mb-2 text-6xl leading-none font-bold text-foreground">
              {formatRating(business.rating, activeLocale)}
            </div>
            <Stars rating={business.rating} size={24} />
            <p className="mt-2 text-label-md text-muted-foreground">
              {t('totalReviews', {
                count: formatCount(business.reviewCount, activeLocale),
              })}
            </p>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3">
            {distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-4">
                <span className="flex min-w-[40px] items-center gap-1 text-label-md text-foreground">
                  {row.star}
                  <Star className="size-3.5 fill-warning text-warning" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-warning"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="min-w-[30px] text-label-md text-muted-foreground">
                  {formatCount(row.count, activeLocale)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <StateView icon={<MessageSquare />} title={t('empty')} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="py-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-headline-md text-primary">
                      {review.authorName.charAt(0)}
                    </span>
                    <div>
                      <h3 className="text-body-lg text-foreground">
                        {review.authorName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="text-label-md text-muted-foreground">
                          {review.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={t('report')}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Flag className="size-5" />
                  </button>
                </div>

                <p className="text-body-md text-foreground">
                  {getLocalized(review.comment, activeLocale)}
                </p>

                {review.ownerReply ? (
                  <div className="mt-4 rounded-lg border-s-4 border-secondary bg-surface-container-low p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Store className="size-4 text-secondary" />
                      <span className="text-label-md font-semibold text-foreground">
                        {t('shopReply')}
                      </span>
                    </div>
                    <p className="text-label-md text-muted-foreground">
                      {getLocalized(review.ownerReply, activeLocale)}
                    </p>
                  </div>
                ) : (
                  <form
                    action={replyToReview.bind(null, review.id)}
                    className="mt-4 flex flex-col gap-2 border-t border-border pt-4"
                  >
                    <Textarea
                      name="reply"
                      rows={2}
                      placeholder={t('replyTo')}
                      required
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className={cn('self-start')}
                    >
                      {t('sendReply')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
