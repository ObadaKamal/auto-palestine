import { getTranslations } from 'next-intl/server';

import { LeadStatusSelect } from '@/components/dashboard/lead-status-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/lib/format';
import type { Lead } from '@/types';

async function LeadsTable({
  leads,
  locale,
  limit,
}: {
  leads: Lead[];
  locale: Locale;
  limit?: number;
}) {
  const t = await getTranslations({ locale, namespace: 'leads' });
  const rows = limit ? leads.slice(0, limit) : leads;

  const sourceLabel: Record<Lead['source'], string> = {
    call: t('sourceCall'),
    whatsapp: t('sourceWhatsapp'),
    form: t('sourceForm'),
    directions: t('sourceDirections'),
  };
  const statusLabel: Record<Lead['status'], string> = {
    new: t('statusNew'),
    contacted: t('statusContacted'),
    won: t('statusWon'),
    lost: t('statusLost'),
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('customer')}</TableHead>
          <TableHead>{t('phone')}</TableHead>
          <TableHead>{t('source')}</TableHead>
          <TableHead>{t('service')}</TableHead>
          <TableHead>{t('status')}</TableHead>
          <TableHead>{t('date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>{lead.customerName}</TableCell>
            <TableCell className="text-muted-foreground tabular-nums" dir="ltr">
              {lead.phone}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {sourceLabel[lead.source]}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {lead.serviceInterest
                ? getLocalized(lead.serviceInterest, locale)
                : '—'}
            </TableCell>
            <TableCell>
              <LeadStatusSelect
                leadId={lead.id}
                status={lead.status}
                labels={statusLabel}
              />
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {lead.createdAt}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { LeadsTable };
