import { Star } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatCount, formatRating } from '@/lib/format';
import { cn } from '@/lib/utils';

function RatingStars({
  rating,
  count,
  locale,
  size = 'sm',
  className,
}: {
  rating: number;
  count?: number;
  locale: Locale;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      role="img"
      aria-label={`${formatRating(rating, locale)} / 5`}
    >
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              size === 'md' ? 'size-4' : 'size-3.5',
              i < rounded
                ? 'fill-warning text-warning'
                : 'fill-muted text-muted',
            )}
          />
        ))}
      </div>
      <span className="text-label-md text-foreground">
        {formatRating(rating, locale)}
      </span>
      {typeof count === 'number' ? (
        <span className="text-label-md text-muted-foreground">
          ({formatCount(count, locale)})
        </span>
      ) : null}
    </div>
  );
}

export { RatingStars };
