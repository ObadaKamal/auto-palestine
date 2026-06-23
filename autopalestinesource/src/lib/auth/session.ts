import 'server-only';

import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'ap_session';

export type SessionRole = 'owner' | 'admin';
export type Session = { role: SessionRole; name: string };

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'role' in parsed &&
      (parsed.role === 'owner' || parsed.role === 'admin')
    ) {
      const name =
        'name' in parsed && typeof parsed.name === 'string' ? parsed.name : '';
      return { role: parsed.role, name };
    }
  } catch {
    return null;
  }
  return null;
}
