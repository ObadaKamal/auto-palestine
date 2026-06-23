import { MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatRating, getLocalized } from '@/lib/format';
import { isOpenNow } from '@/lib/hours';
import { cn } from '@/lib/utils';
import type { Business } from '@/types';

async function SearchResultCard({
  business,
  locale,
}: {
  business: Business;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'discovery' });
  const tb = await getTranslations({ locale, namespace: 'business' });
  const open = isOpenNow(business.workingHours);
  const phone = business.contact.phones[0];
  const whatsapp = business.contact.whatsapp;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-modal">
      <Link
        href={`/business/${business.slug}`}
        className="relative block h-48 overflow-hidden"
      >
        <CoverPlaceholder
          seed={business.coverSeed}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute end-4 top-4 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="text-label-md font-bold text-foreground">
            {formatRating(business.rating, locale)}
          </span>
        </span>
        <span
          className={cn(
            'absolute start-4 top-4 rounded px-2 py-1 text-xs font-bold',
            open
              ? 'bg-success/15 text-success'
              : 'bg-destructive/15 text-destructive',
          )}
        >
          {open ? t('openNow') : t('closedNow')}
        </span>
      </Link>

      <div className="flex flex-grow flex-col p-5">
        <Link href={`/business/${business.slug}`}>
          <h3 className="mb-2 text-headline-md text-foreground hover:text-primary">
            {getLocalized(business.name, locale)}
          </h3>
        </Link>
        <p className="mb-4 flex items-center gap-1 text-body-md text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {getLocalized(business.location.city, locale)}
        </p>
        <div className="mt-auto flex gap-3">
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary py-2 text-label-md font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Phone className="size-4" />
              {tb('call')}
            </a>
          ) : null}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-input py-2 text-label-md font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <MessageCircle className="size-4" />
              {tb('whatsapp')}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { SearchResultCard };
