import { Globe, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/routing';
import type { Business } from '@/types';

async function ContactBlock({
  business,
  locale,
}: {
  business: Business;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'business' });
  const { contact, location } = business;
  const phone = contact.phones[0];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <div className="flex flex-col gap-2">
      {phone ? (
        <Button asChild variant="primary">
          <a href={`tel:${phone.replace(/\s/g, '')}`}>
            <Phone />
            {t('call')}
          </a>
        </Button>
      ) : null}
      {contact.whatsapp ? (
        <Button asChild variant="ghost">
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
            {t('whatsapp')}
          </a>
        </Button>
      ) : null}
      <Button asChild variant="outline">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin />
          {t('directions')}
        </a>
      </Button>
      {contact.website ? (
        <Button asChild variant="outline">
          <a href={contact.website} target="_blank" rel="noopener noreferrer">
            <Globe />
            {t('website')}
          </a>
        </Button>
      ) : null}
    </div>
  );
}

export { ContactBlock };
