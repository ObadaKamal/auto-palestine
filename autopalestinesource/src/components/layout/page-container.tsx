import * as React from 'react';

import { cn } from '@/lib/utils';

function PageContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-content px-4 md:px-8', className)}
      {...props}
    />
  );
}

export { PageContainer };
