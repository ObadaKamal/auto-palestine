import { Car } from 'lucide-react';

import { cn } from '@/lib/utils';

function CoverPlaceholder({
  seed,
  className,
}: {
  seed: number;
  className?: string;
}) {
  const hue = (seed * 47) % 360;
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-muted',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 35% 28%), hsl(${(hue + 40) % 360} 45% 20%))`,
      }}
    >
      <Car className="size-10 text-white/40" />
    </div>
  );
}

export { CoverPlaceholder };
