import { getTranslations, setRequestLocale } from 'next-intl/server';

import { listUsers } from '@/lib/api';
import type { UserRole } from '@/types';

const cardClass =
  'rounded-xl border border-border bg-card shadow-[0_4px_20px_rgba(11,25,44,0.05)]';

const rolePill: Record<UserRole, string> = {
  visitor: 'bg-muted text-muted-foreground',
  owner: 'bg-primary/10 text-primary',
  admin: 'bg-success/10 text-success',
};

const roleDot: Record<UserRole, string> = {
  visitor: 'bg-muted-foreground',
  owner: 'bg-primary',
  admin: 'bg-success',
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('');
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const users = await listUsers();

  const roleLabel: Record<UserRole, string> = {
    visitor: t('roleVisitor'),
    owner: t('roleOwner'),
    admin: t('roleAdmin'),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-foreground">{t('usersTitle')}</h1>

      <div className={`overflow-hidden ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="border-b border-border bg-surface-container-low text-label-md text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-start font-medium">
                  {t('user')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('email')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('role')}
                </th>
                <th className="px-6 py-4 text-start font-medium">
                  {t('joined')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-md text-foreground">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-label-md font-bold text-secondary uppercase"
                        dir="ltr"
                      >
                        {initials(user.name)}
                      </span>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground" dir="ltr">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md font-medium ${rolePill[user.role]}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${roleDot[user.role]}`}
                      />
                      {roleLabel[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground tabular-nums">
                    {user.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
