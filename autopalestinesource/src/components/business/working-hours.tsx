import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { WorkingHours as WorkingHoursType } from '@/types';

const dayNames: Record<Locale, string[]> = {
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
};

async function WorkingHours({
  hours,
  locale,
}: {
  hours: WorkingHoursType[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'business' });
  const todayIndex = new Date().getDay();

  return (
    <ul className="flex flex-col gap-3 text-body-md">
      {hours.map((entry) => {
        const isToday = entry.day === todayIndex;
        return (
          <li
            key={entry.day}
            className={cn(
              'flex items-center justify-between gap-4',
              isToday && 'font-bold text-primary',
              entry.closed && !isToday && 'text-destructive',
            )}
          >
            <span>
              {isToday
                ? `${t('today')} (${dayNames[locale][entry.day]})`
                : dayNames[locale][entry.day]}
            </span>
            <span className="tabular-nums">
              {entry.closed ? t('closed') : `${entry.open} – ${entry.close}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export { WorkingHours };
