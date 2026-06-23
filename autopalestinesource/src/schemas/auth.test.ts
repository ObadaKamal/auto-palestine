import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from '@/schemas/auth';

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({
      email: 'a@b.com',
      password: 'secret1',
      role: 'owner',
      locale: 'ar',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email and short password', () => {
    const bad = loginSchema.safeParse({
      email: 'nope',
      password: '123',
      role: 'owner',
      locale: 'ar',
    });
    expect(bad.success).toBe(false);
  });

  it('rejects an unknown role', () => {
    const bad = loginSchema.safeParse({
      email: 'a@b.com',
      password: 'secret1',
      role: 'superuser',
      locale: 'ar',
    });
    expect(bad.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('requires a valid phone length', () => {
    const bad = registerSchema.safeParse({
      name: 'Sam',
      email: 'a@b.com',
      phone: '12',
      password: 'secret1',
      locale: 'en',
    });
    expect(bad.success).toBe(false);
  });
});
