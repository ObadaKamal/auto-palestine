import { BadgeCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

function VerifiedBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Badge variant="success" className={className}>
      <BadgeCheck />
      {label}
    </Badge>
  );
}

export { VerifiedBadge };
