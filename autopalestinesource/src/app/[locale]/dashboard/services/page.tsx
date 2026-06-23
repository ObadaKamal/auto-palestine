import { Plus, Trash2, Wrench } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/routing';
import { addOwnerService, deleteOwnerService } from '@/lib/actions';
import { getOwnerBusiness } from '@/lib/api';
import { formatPrice, getLocalized } from '@/lib/format';

export default async function OwnerServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('ownerServices');
  const tb = await getTranslations('business');
  const business = await getOwnerBusiness();

  const presets = [
    t('presetOil'),
    t('presetComputer'),
    t('presetTire'),
    t('presetBattery'),
    t('presetWash'),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-foreground">{t('title')}</h1>
          <p className="mt-1 text-body-md text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Add form */}
      <Card>
        <CardContent className="py-5">
          <form
            action={addOwnerService}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <Input
              name="serviceName"
              placeholder={t('name')}
              className="flex-1"
              required
            />
            <Input
              name="price"
              type="number"
              min="0"
              placeholder={t('price')}
              className="sm:w-40"
            />
            <Button type="submit">
              <Plus />
              {t('addService')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Popular quick-add chips */}
      <section>
        <h3 className="mb-4 text-headline-md text-foreground">
          {t('popular')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {presets.map((label) => (
            <form key={label} action={addOwnerService}>
              <input type="hidden" name="serviceName" value={label} />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-label-md text-muted-foreground shadow-sm transition-colors hover:border-secondary hover:text-secondary"
              >
                <Plus className="size-4" />
                {label}
              </button>
            </form>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {business.services.map((service) => (
          <Card key={service.id} className="group relative">
            <CardContent className="py-6">
              <form
                action={deleteOwnerService.bind(null, service.id)}
                className="absolute end-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <button
                  type="submit"
                  aria-label={t('delete')}
                  className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-5" />
                </button>
              </form>

              <div className="mb-4 flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-secondary text-secondary-foreground">
                  <Wrench className="size-6" />
                </span>
                <div>
                  <h4 className="text-body-lg font-semibold text-foreground">
                    {getLocalized(service.name, activeLocale)}
                  </h4>
                  {service.durationMins ? (
                    <span className="mt-1 inline-block rounded bg-muted px-2 py-1 text-label-md text-muted-foreground">
                      {tb('minutes', { count: service.durationMins })}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-label-md text-muted-foreground">
                  {t('approxPrice')}
                </span>
                <span className="text-headline-md font-bold text-secondary">
                  {service.price !== undefined
                    ? formatPrice(service.price, activeLocale)
                    : t('consultation')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
