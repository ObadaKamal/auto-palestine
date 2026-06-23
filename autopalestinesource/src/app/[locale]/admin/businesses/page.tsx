import { Car, ShieldCheck, Star } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { setBusinessStatus } from '@/lib/actions';
import { listAllBusinesses, listCategories } from '@/lib/api';
import { formatRating, getLocalized } from '@/lib/format';

const cardClass =
  'rounded-xl border border-border bg-card shadow-[0_4px_20px_rgba(11,25,44,0.05)]';

const statusDot: Record<string, string> = {
  active: 'bg-success',
  pending: 'bg-warning',
  draft: 'bg-warning',
  suspended: 'bg-destructive',
};

const statusPill: Record<string, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/15 text-warning',
  draft: 'bg-warning/15 text-warning',
  suspended: 'bg-destructive/10 text-destructive',
};

export default async function AdminBusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations('admin');
  const status = await getTranslations('statusLabels');

  const [businesses, categories] = await Promise.all([
    listAllBusinesses(),
    listCategories(),
  ]);

  const categoryName = (ids: string[]) => {
    const c = categories.find((x) => x.id === ids[0]);
    return c ? getLocalized(c.name, activeLocale) : '—';
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">
        {t('businessesTitle')}
      </h1>

      <div className={`overflow-hidden ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="border-b border-border bg-surface-container-low text-label-md text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-start font-medium">
                  {t('name')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('category')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('status')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('verification')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('rating')}
                </th>
                <th className="px-6 py-4 text-center font-medium">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-md text-foreground">
              {businesses.map((business) => {
                const suspended = business.status === 'suspended';
                const verified = business.verificationStatus === 'verified';
                return (
                  <tr
                    key={business.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-md bg-muted text-secondary">
                          <Car className="size-5" />
                        </span>
                        <div>
                          <p className="font-medium">
                            {getLocalized(business.name, activeLocale)}
                          </p>
                          <p className="text-label-md text-muted-foreground">
                            {getLocalized(business.location.city, activeLocale)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {categoryName(business.categoryIds)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md font-medium ${statusPill[business.status] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${statusDot[business.status] ?? 'bg-muted-foreground'}`}
                        />
                        {status(business.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-label-md font-medium ${verified ? 'text-success' : 'text-muted-foreground'}`}
                      >
                        <ShieldCheck className="size-4" />
                        {status(business.verificationStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Star className="size-4 fill-warning text-warning" />
                        {formatRating(business.rating, activeLocale)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/business/${business.slug}`}>
                            {t('view')}
                          </Link>
                        </Button>
                        <form
                          action={setBusinessStatus.bind(
                            null,
                            business.id,
                            suspended ? 'active' : 'suspended',
                          )}
                        >
                          <Button
                            type="submit"
                            variant={suspended ? 'primary' : 'outline'}
                            size="sm"
                          >
                            {suspended ? t('activate') : t('suspend')}
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
