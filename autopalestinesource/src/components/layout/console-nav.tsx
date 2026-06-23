'use client';

import {
  BadgeCheck,
  Bell,
  Building2,
  Circle,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Store,
  Tags,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const icons: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Store,
  Wrench,
  Star,
  BadgeCheck,
  CreditCard,
  Bell,
  Building2,
  ShieldCheck,
  Tags,
  UserCog,
};

export type ConsoleNavItem = {
  href: string;
  label: string;
  icon: string;
};

function ConsoleNav({ items }: { items: ConsoleNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = icons[item.icon] ?? Circle;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-label-md transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { ConsoleNav };
