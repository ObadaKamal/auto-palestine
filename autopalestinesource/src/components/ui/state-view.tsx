import * as React from 'react';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

type StateViewProps = {
  variant?: 'loading' | 'empty' | 'error';
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

function StateView({
  variant = 'empty',
  icon,
  title,
  description,
  action,
  className,
}: StateViewProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="text-muted-foreground [&_svg]:size-10">
        {variant === 'loading' ? <Spinner className="size-8" /> : icon}
      </div>
      <div className="space-y-1">
        <p className="text-headline-md text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-md text-body-md text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

export { StateView };
export type { StateViewProps };
