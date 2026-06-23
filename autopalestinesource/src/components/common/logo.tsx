import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Auto Palestine logo. The artwork lives in `public/logo.svg` (color, for
 * light backgrounds) and `public/logo-light.svg` (white, for dark / navy
 * backgrounds) — replace those files with the official artwork; no code
 * change required.
 *
 * - variant="auto" (default): shows color in light mode, white in dark mode.
 * - variant="light": always the white mark (use on navy/dark surfaces).
 * - variant="color": always the color mark.
 */
function LogoMark({
  className,
  variant = 'auto',
}: {
  className?: string;
  variant?: 'auto' | 'color' | 'light';
}) {
  const base = cn('object-contain', className);

  if (variant === 'light') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo-light.svg" alt="Auto Palestine" className={base} />;
  }
  if (variant === 'color') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo.svg" alt="Auto Palestine" className={base} />;
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Auto Palestine"
        className={cn(base, 'block dark:hidden')}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-light.svg"
        alt=""
        aria-hidden
        className={cn(base, 'hidden dark:block')}
      />
    </>
  );
}

function Logo({
  label,
  className,
  markClassName,
}: {
  label: string;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark className={cn('size-9', markClassName)} />
      <span className="text-body-lg font-semibold">{label}</span>
    </span>
  );
}

export { Logo, LogoMark };
