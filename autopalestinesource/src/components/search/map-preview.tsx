import { Map } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

async function MapPreview() {
  const t = await getTranslations('discovery');
  return (
    <div
      className="relative flex h-48 items-end justify-center overflow-hidden rounded-lg border border-border shadow-card"
      style={{
        backgroundImage:
          'radial-gradient(circle at 30% 30%, rgba(255,101,0,0.15), transparent 45%), radial-gradient(circle at 70% 70%, rgba(11,25,44,0.1), transparent 45%), linear-gradient(180deg, #eceef1, #e0e3e6)',
      }}
    >
      <span className="mb-4 flex items-center gap-2 rounded-[var(--radius)] bg-card px-4 py-2 text-label-md font-medium text-foreground shadow-sm">
        <Map className="size-4 text-primary" />
        {t('viewMap')}
      </span>
    </div>
  );
}

export { MapPreview };
