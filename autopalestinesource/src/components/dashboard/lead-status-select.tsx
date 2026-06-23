'use client';

import { useTransition } from 'react';

import { setLeadStatus } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/types';

const order: LeadStatus[] = ['new', 'contacted', 'won', 'lost'];

function LeadStatusSelect({
  leadId,
  status,
  labels,
}: {
  leadId: string;
  status: LeadStatus;
  labels: Record<LeadStatus, string>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as LeadStatus;
        startTransition(() => {
          void setLeadStatus(leadId, next);
        });
      }}
      className={cn(
        'h-9 rounded-[var(--radius)] border border-input bg-muted px-2 text-label-md text-foreground',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
        pending && 'opacity-60',
      )}
    >
      {order.map((value) => (
        <option key={value} value={value}>
          {labels[value]}
        </option>
      ))}
    </select>
  );
}

export { LeadStatusSelect };
