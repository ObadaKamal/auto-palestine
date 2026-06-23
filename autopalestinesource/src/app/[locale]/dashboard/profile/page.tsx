import {
  Camera,
  CheckCircle2,
  Circle,
  ImagePlus,
  MapPin,
  MessageCircle,
  Phone,
  Save,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { updateOwnerProfile } from '@/lib/actions';
import { getOwnerBusiness, listCities } from '@/lib/api';
import { getLocalized } from '@/lib/format';
import { cn } from '@/lib/utils';

const cardClass = 'rounded-xl border border-border bg-card p-8 shadow-card';
const sectionTitle =
  'mb-6 border-b border-border pb-4 text-headline-md text-foreground';
const fieldClass = cn(
  'w-full rounded-[var(--radius)] border border-input bg-muted px-4 py-3 text-body-md text-foreground',
  'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
);

export default async function OwnerProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('ownerProfile');
  const [business, cities] = await Promise.all([
    getOwnerBusiness(),
    listCities(),
  ]);

  const checklist = [
    { label: t('checkBasic'), done: true },
    { label: t('checkContact'), done: true },
    { label: t('checkHours'), done: false },
    { label: t('checkGallery'), done: false },
  ];

  return (
    <form action={updateOwnerProfile} className="flex flex-col gap-8 pb-24">
      <input type="hidden" name="locale" value={activeLocale} />

      <div>
        <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
        <p className="mt-1 text-body-md text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: form cards */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Basic info */}
          <section className={cardClass}>
            <h3 className={sectionTitle}>{t('basicInfo')}</h3>
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('businessName')}</Label>
                <input
                  id="name"
                  name="name"
                  className={fieldClass}
                  defaultValue={getLocalized(business.name, activeLocale)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className={cn(fieldClass, 'resize-none')}
                  defaultValue={getLocalized(
                    business.description,
                    activeLocale,
                  )}
                />
              </div>
            </div>
          </section>

          {/* Visual assets (placeholders) */}
          <section className={cardClass}>
            <h3 className={sectionTitle}>{t('visualAssets')}</h3>
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="shrink-0">
                <Label className="mb-2 block">{t('logo')}</Label>
                <div className="flex size-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input text-muted-foreground transition-colors hover:bg-muted">
                  <Camera className="mb-1 size-6" />
                  <span className="text-label-md">{t('changeLogo')}</span>
                </div>
              </div>
              <div className="flex-grow">
                <Label className="mb-2 block">{t('coverImage')}</Label>
                <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input text-muted-foreground transition-colors hover:bg-muted">
                  <ImagePlus className="mb-1 size-6" />
                  <span className="text-label-md">{t('uploadCover')}</span>
                </div>
                <p className="mt-2 text-label-md text-muted-foreground">
                  {t('coverHint')}
                </p>
              </div>
            </div>
          </section>

          {/* Contact & location */}
          <section className={cardClass}>
            <h3 className={sectionTitle}>{t('contactLocation')}</h3>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone"
                    name="phone"
                    dir="ltr"
                    className={cn(fieldClass, 'pe-12 text-end')}
                    defaultValue={business.contact.phones[0]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t('whatsapp')}</Label>
                <div className="relative">
                  <MessageCircle className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    dir="ltr"
                    className={cn(fieldClass, 'pe-12 text-end')}
                    defaultValue={business.contact.whatsapp}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
                <select
                  id="city"
                  name="city"
                  className={fieldClass}
                  defaultValue={business.location.cityId}
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getLocalized(c.name, activeLocale)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('address')}</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="address"
                    name="address"
                    className={cn(fieldClass, 'pe-12')}
                    defaultValue={getLocalized(
                      business.location.addressText,
                      activeLocale,
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('mapLabel')}</Label>
              <div
                className="h-56 rounded-xl border border-border"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 40% 40%, rgba(255,101,0,0.18), transparent 45%), linear-gradient(180deg,#eceef1,#e0e3e6)',
                }}
              />
            </div>
          </section>
        </div>

        {/* Right: profile strength */}
        <aside className="w-full shrink-0 lg:w-80">
          <Card className="sticky top-24">
            <CardContent className="flex flex-col items-center py-6 text-center">
              <h3 className="text-headline-md text-foreground">
                {t('profileStrength')}
              </h3>
              <p className="mt-1 mb-6 text-label-md text-muted-foreground">
                {t('profileStrengthDesc')}
              </p>
              <div className="relative mb-6 size-40">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray="85, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-headline-lg font-bold text-foreground">
                    85%
                  </span>
                </div>
              </div>
              <ul className="flex w-full flex-col gap-3 text-start text-label-md">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      'flex items-center gap-2',
                      item.done ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                    {item.label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-4 border-t border-border bg-card/95 p-4 backdrop-blur md:ms-64">
        <Button asChild variant="outline">
          <Link href="/dashboard">{t('cancel')}</Link>
        </Button>
        <Button type="submit">
          <Save />
          {t('save')}
        </Button>
      </div>
    </form>
  );
}
