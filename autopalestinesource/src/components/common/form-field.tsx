import * as React from 'react';

import { Label } from '@/components/ui/label';

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-label-md text-destructive">{error}</p> : null}
    </div>
  );
}

export { FormField };
