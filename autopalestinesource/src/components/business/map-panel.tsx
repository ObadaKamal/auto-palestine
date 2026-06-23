import { MapPin } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BusinessLocation } from '@/types';

/**
 * Static, network-independent map placeholder. Real interactive tiles
 * (MapLibre/Mapbox) are wired in a later phase once a tile key is set.
 */
function MapPanel({
  location,
  locale,
  className,
}: {
  location: BusinessLocation;
  locale: Locale;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-40 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-surface-container p-6 text-center',
        className,
      )}
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(255,101,0,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(11,25,44,0.08), transparent 40%)',
      }}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <MapPin className="size-5" />
      </span>
      <p className="text-body-md text-foreground">
        {getLocalized(location.addressText, locale)}
      </p>
      <p className="text-label-md text-muted-foreground tabular-nums">
        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </p>
    </div>
  );
}

export { MapPanel };
