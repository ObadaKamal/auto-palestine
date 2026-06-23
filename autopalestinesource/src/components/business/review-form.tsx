import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Locale } from '@/i18n/routing';
import { submitReview } from '@/lib/actions';
import { cn } from '@/lib/utils';

async function ReviewForm({ slug, locale }: { slug: string; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'business' });
  const selectClass = cn(
    'h-10 w-28 rounded-[var(--radius)] border border-input bg-muted px-3 text-body-md text-foreground',
    'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
  );

  return (
    <Card>
      <CardContent className="py-5">
        <form
          action={submitReview.bind(null, slug)}
          className="flex flex-col gap-3"
        >
          <h3 className="text-body-lg text-foreground">{t('leaveReview')}</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="author">{t('yourName')}</Label>
              <Input id="author" name="author" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rating">{t('ratingLabel')}</Label>
              <select
                id="rating"
                name="rating"
                className={selectClass}
                defaultValue="5"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment">{t('yourReview')}</Label>
            <Textarea id="comment" name="comment" rows={3} required />
          </div>
          <Button type="submit" className="self-start">
            {t('submitReview')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { ReviewForm };
