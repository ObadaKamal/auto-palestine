import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-11 items-center justify-center rounded-[var(--radius)] bg-accent text-secondary [&_svg]:size-5">
          {icon}
        </span>
        <div className="space-y-0.5">
          <p className="text-label-md text-muted-foreground">{label}</p>
          <p className="text-headline-md text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
