import { describe, expect, it } from 'vitest';

import { searchBusinesses } from '@/lib/api';

describe('searchBusinesses', () => {
  it('returns only active businesses by default', async () => {
    const { items, total } = await searchBusinesses({});
    expect(total).toBeGreaterThan(0);
    expect(items.every((b) => b.status === 'active')).toBe(true);
  });

  it('filters by city', async () => {
    const { items } = await searchBusinesses({ city: 'ramallah' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((b) => b.location.cityId === 'ramallah')).toBe(true);
  });

  it('filters by verified only', async () => {
    const { items } = await searchBusinesses({ verified: true });
    expect(items.every((b) => b.verificationStatus === 'verified')).toBe(true);
  });

  it('filters by category', async () => {
    const { items } = await searchBusinesses({ category: 'tires' });
    expect(items.every((b) => b.categoryIds.includes('tires'))).toBe(true);
  });

  it('sorts by rating descending', async () => {
    const { items } = await searchBusinesses({ sort: 'rating' });
    for (let i = 1; i < items.length; i += 1) {
      expect(items[i - 1]!.rating).toBeGreaterThanOrEqual(items[i]!.rating);
    }
  });
});
