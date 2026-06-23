import { BusinessCard } from '@/components/business/business-card';
import type { Locale } from '@/i18n/routing';
import type { Business } from '@/types';

function BusinessCardGrid({
  businesses,
  locale,
}: {
  businesses: Business[];
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} locale={locale} />
      ))}
    </div>
  );
}

export { BusinessCardGrid };
