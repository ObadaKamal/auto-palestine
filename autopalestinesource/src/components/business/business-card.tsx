import { MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { RatingStars } from '@/components/common/rating-stars';
import { VerifiedBadge } from '@/components/common/verified-badge';
import { Card } from '@/components/ui/card';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/format';
import type { Business } from '@/types';

async function BusinessCard({
  business,
  locale,
}: {
  business: Business;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'discovery' });

  return (
    <Link
      href={`/business/${business.slug}`}
      className="group block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-modal">
        <div className="relative">
          <CoverPlaceholder seed={business.coverSeed} className="h-40 w-full" />
          {business.verificationStatus === 'verified' ? (
            <VerifiedBadge
              label={t('verified')}
              className="absolute end-3 top-3"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-1 text-body-lg text-foreground">
            {getLocalized(business.name, locale)}
          </h3>
          <div className="flex items-center gap-1 text-label-md text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">
              {getLocalized(business.location.city, locale)}
            </span>
          </div>
          <RatingStars
            rating={business.rating}
            count={business.reviewCount}
            locale={locale}
          />
        </div>
      </Card>
    </Link>
  );
}

export { BusinessCard };
