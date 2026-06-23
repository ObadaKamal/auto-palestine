'use client';

import { Menu, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

type NavLink = { href: string; label: string };

function MobileNav({
  links,
  loginLabel,
  listLabel,
  menuLabel,
  closeLabel,
}: {
  links: NavLink[];
  loginLabel: string;
  listLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={menuLabel}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-72 max-w-[80%] flex-col gap-1 bg-card p-4 shadow-modal">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius)] px-3 py-2 text-body-md text-foreground transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="ghost">
                <Link href="/login" onClick={() => setOpen(false)}>
                  {loginLabel}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/onboarding" onClick={() => setOpen(false)}>
                  {listLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { MobileNav };
