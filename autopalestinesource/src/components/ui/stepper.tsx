import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type Step = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  className?: string;
};

function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex w-full items-center gap-2', className)}>
      {steps.map((step, index) => {
        const status =
          index < current
            ? 'complete'
            : index === current
              ? 'current'
              : 'upcoming';
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <span
              aria-current={status === 'current' ? 'step' : undefined}
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-label-md',
                status === 'complete' &&
                  'border-primary bg-primary text-primary-foreground',
                status === 'current' && 'border-primary text-primary',
                status === 'upcoming' && 'border-border text-muted-foreground',
              )}
            >
              {status === 'complete' ? <Check className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                'truncate text-label-md',
                status === 'upcoming'
                  ? 'text-muted-foreground'
                  : 'text-foreground',
              )}
            >
              {step.label}
            </span>
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'h-px flex-1',
                  index < current ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
export type { Step, StepperProps };
