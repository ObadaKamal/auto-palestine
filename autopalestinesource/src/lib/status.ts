import type { BadgeProps } from '@/components/ui/badge';
import type { BusinessStatus, LeadStatus, VerificationStatus } from '@/types';

type Tone = NonNullable<BadgeProps['variant']>;

export const leadStatusTone: Record<LeadStatus, Tone> = {
  new: 'primary',
  contacted: 'warning',
  won: 'success',
  lost: 'muted',
};

export const verificationTone: Record<VerificationStatus, Tone> = {
  unverified: 'muted',
  pending: 'warning',
  verified: 'success',
  rejected: 'destructive',
};

export const businessStatusTone: Record<BusinessStatus, Tone> = {
  draft: 'muted',
  pending: 'warning',
  active: 'success',
  suspended: 'destructive',
};
