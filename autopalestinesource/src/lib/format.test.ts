import { describe, expect, it } from 'vitest';

import { formatPrice, formatRating, getLocalized } from '@/lib/format';

describe('getLocalized', () => {
  it('returns the value for the active locale', () => {
    const text = { ar: 'مرحبا', en: 'Hello' };
    expect(getLocalized(text, 'ar')).toBe('مرحبا');
    expect(getLocalized(text, 'en')).toBe('Hello');
  });
});

describe('formatRating', () => {
  it('always shows one decimal place', () => {
    expect(formatRating(4, 'en')).toBe('4.0');
    expect(formatRating(4.85, 'en')).toBe('4.9');
  });
});

describe('formatPrice', () => {
  it('formats as ILS currency', () => {
    const result = formatPrice(120, 'en');
    expect(result).toMatch(/120/);
  });
});
