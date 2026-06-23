import {
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BusinessGallery } from '@/components/business/business-gallery';
import { ReviewForm } from '@/components/business/review-form';
import { ReviewsSection } from '@/components/business/reviews-section';
import { WorkingHours } from '@/components/business/working-hours';
import { CoverPlaceholder } from '@/components/common/cover-placeholder';
import { PageContainer } from '@/components/layout/page-container';
import type { Locale } from '@/i18n/routing';
import { getBusinessBySlugOrId, listBusinessSlugs } from '@/lib/api';
import { formatCount, formatRating, getLocalized } from '@/lib/format';
import { isOpenNow } from '@/lib/hours';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listBusinessSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const business = await getBusinessBySlugOrId(slug);
  if (!business) return {};
  const activeLocale = locale as Locale;
  return {
    title: getLocalized(business.name, activeLocale),
    description: getLocalized(business.description, activeLocale),
  };
}

const cardClass = 'rounded-lg border border-border bg-card shadow-card';

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;

  // Dynamic: resolve by slug OR id from the data source.
  const business = await getBusinessBySlugOrId(slug);
  if (!business) notFound();

  const t = await getTranslations('business');
  const open = isOpenNow(business.workingHours);
  const phone = business.contact.phones[0];
  const whatsapp = business.contact.whatsapp;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: getLocalized(business.name, activeLocale),
    description: getLocalized(business.description, activeLocale),
    address: {
      '@type': 'PostalAddress',
      addressLocality: getLocalized(business.location.city, activeLocale),
      addressCountry: 'PS',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.location.lat,
      longitude: business.location.lng,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
    telephone: phone,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero cover */}
      <section className="relative h-[300px] md:h-[420px]">
        <CoverPlaceholder
          seed={business.coverSeed}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/40 to-transparent" />
        <PageContainer className="absolute inset-x-0 bottom-0 pb-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
            <div className="size-24 shrink-0 overflow-hidden rounded-xl border-4 border-card bg-card p-2 shadow-md md:size-32">
              <CoverPlaceholder
                seed={business.coverSeed + 3}
                className="h-full w-full rounded-lg"
              />
            </div>
            <div className="text-white">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-headline-lg md:text-headline-xl">
                  {getLocalized(business.name, activeLocale)}
                </h1>
                {business.verificationStatus === 'verified' ? (
                  <ShieldCheck className="size-6 text-success" />
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-body-md text-white/90">
                <span className="flex items-center gap-1">
                  <Star className="size-5 fill-warning text-warning" />
                  {formatRating(business.rating, activeLocale)} (
                  {formatCount(business.reviewCount, activeLocale)}{' '}
                  {t('reviews')})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {getLocalized(business.location.city, activeLocale)}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 rounded px-2 py-0.5 font-bold',
                    open
                      ? 'bg-success/20 text-success'
                      : 'bg-destructive/20 text-white',
                  )}
                >
                  <Clock className="size-4" />
                  {open ? t('openNow') : t('closed')}
                </span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="grid grid-cols-1 gap-6 py-10 md:grid-cols-12">
        {/* Sidebar */}
        <aside className="flex flex-col gap-6 md:col-span-4">
          <div
            className={cn(cardClass, 'sticky top-24 flex flex-col gap-3 p-6')}
          >
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-[var(--radius)] bg-primary py-3 font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Phone className="size-5" />
                {t('callNow')}
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-secondary py-3 font-bold text-secondary transition-colors hover:bg-accent"
              >
                <MessageCircle className="size-5" />
                {t('whatsappContact')}
              </a>
            ) : null}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-[var(--radius)] bg-muted py-3 text-foreground transition-colors hover:bg-surface-container-high"
            >
              <Navigation className="size-5" />
              {t('getDirections')}
            </a>
            <div className="mt-3 flex items-center justify-center gap-2 border-t border-border pt-4 text-label-md text-muted-foreground">
              <ShieldCheck className="size-4 text-success" />
              {t('trustedBy')}
            </div>
          </div>

          <div className={cn(cardClass, 'overflow-hidden')}>
            <div className="border-b border-border bg-surface-container-low p-4">
              <h3 className="text-headline-md text-foreground">
                {t('location')}
              </h3>
            </div>
            <div
              className="relative h-48"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 35% 35%, rgba(255,101,0,0.18), transparent 45%), linear-gradient(180deg,#eceef1,#e0e3e6)',
              }}
            >
              <span className="absolute start-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="size-5" />
              </span>
            </div>
            <p className="p-4 text-body-md text-muted-foreground">
              {getLocalized(business.location.addressText, activeLocale)}
            </p>
          </div>

          <div className={cn(cardClass, 'p-6')}>
            <h3 className="mb-4 flex items-center gap-2 text-headline-md text-foreground">
              <Clock className="size-5" />
              {t('workingHours')}
            </h3>
            <WorkingHours hours={business.workingHours} locale={activeLocale} />
          </div>
        </aside>

        {/* Content */}
        <div className="flex flex-col gap-6 md:col-span-8">
          <section className={cn(cardClass, 'p-8')}>
            <h2 className="mb-4 border-b border-border pb-4 text-headline-md text-foreground">
              {t('aboutShop')}
            </h2>
            <p className="text-body-md leading-relaxed text-muted-foreground">
              {getLocalized(business.description, activeLocale)}
            </p>
          </section>

          {business.services.length > 0 ? (
            <section className={cn(cardClass, 'p-8')}>
              <h2 className="mb-6 text-headline-md text-foreground">
                {t('servicesOffered')}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {business.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted p-4 text-center transition-shadow hover:shadow-card"
                  >
                    <Wrench className="size-7 text-secondary" />
                    <span className="text-label-md text-foreground">
                      {getLocalized(service.name, activeLocale)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {business.galleryCount > 0 ? (
            <section className={cn(cardClass, 'p-8')}>
              <h2 className="mb-6 text-headline-md text-foreground">
                {t('gallery')}
              </h2>
              <BusinessGallery
                count={business.galleryCount}
                seed={business.coverSeed}
              />
            </section>
          ) : null}

          <section className={cn(cardClass, 'p-8')}>
            <h2 className="mb-6 text-headline-md text-foreground">
              {t('reviews')}
            </h2>
            <div className="flex flex-col gap-6">
              <ReviewForm slug={business.slug} locale={activeLocale} />
              <ReviewsSection
                reviews={business.reviews}
                locale={activeLocale}
              />
            </div>
          </section>
        </div>
      </PageContainer>
    </article>
  );
}
