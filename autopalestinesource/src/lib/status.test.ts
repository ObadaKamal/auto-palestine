import { describe, expect, it } from 'vitest';

import {
  businessStatusTone,
  leadStatusTone,
  verificationTone,
} from '@/lib/status';

describe('status tone maps', () => {
  it('maps verification statuses to badge tones', () => {
    expect(verificationTone.verified).toBe('success');
    expect(verificationTone.pending).toBe('warning');
    expect(verificationTone.rejected).toBe('destructive');
    expect(verificationTone.unverified).toBe('muted');
  });

  it('maps lead and business statuses', () => {
    expect(leadStatusTone.won).toBe('success');
    expect(leadStatusTone.lost).toBe('muted');
    expect(businessStatusTone.active).toBe('success');
    expect(businessStatusTone.suspended).toBe('destructive');
  });
});
