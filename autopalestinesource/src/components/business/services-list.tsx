import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { formatPrice, getLocalized } from '@/lib/format';
import type { Service } from '@/types';

async function ServicesList({
  services,
  locale,
}: {
  services: Service[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'business' });

  function priceLabel(service: Service) {
    if (service.priceType === 'quote' || service.price === undefined) {
      return t('priceQuote');
    }
    const price = formatPrice(service.price, locale);
    return service.priceType === 'from' ? t('priceFrom', { price }) : price;
  }

  return (
    <ul className="divide-y divide-border">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex items-start justify-between gap-4 py-3"
        >
          <div className="space-y-0.5">
            <p className="text-body-md text-foreground">
              {getLocalized(service.name, locale)}
            </p>
            {service.description ? (
              <p className="text-label-md text-muted-foreground">
                {getLocalized(service.description, locale)}
              </p>
            ) : null}
            {service.durationMins ? (
              <p className="text-label-md text-muted-foreground">
                {t('minutes', { count: service.durationMins })}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 font-semibold text-foreground">
            {priceLabel(service)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export { ServicesList };
