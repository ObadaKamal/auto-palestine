'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/lib/auth/session';
import { loginSchema, registerSchema } from '@/schemas/auth';

type ActionError = { ok: false; error: 'invalid' };

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function loginAction(values: unknown): Promise<ActionError> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: 'invalid' };
  }
  const { role, locale, email } = parsed.data;
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({ role, name: email }),
    cookieOptions,
  );
  redirect(`/${locale}/${role === 'admin' ? 'admin' : 'dashboard'}`);
}

export async function registerAction(values: unknown): Promise<ActionError> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: 'invalid' };
  }
  const { locale, name } = parsed.data;
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({ role: 'owner', name }),
    cookieOptions,
  );
  redirect(`/${locale}/onboarding`);
}

export async function logoutAction(locale: string): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect(`/${locale}`);
}
