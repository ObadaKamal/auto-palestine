import type { WorkingHours } from '@/types';

/** Whether the business is open right now based on its working hours. */
export function isOpenNow(hours: WorkingHours[]): boolean {
  if (!hours.length) return false;
  const now = new Date();
  const today = hours.find((h) => h.day === now.getDay());
  if (!today || today.closed) return false;
  const current = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (value: string) => {
    const [h, m] = value.split(':').map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };
  return current >= toMinutes(today.open) && current <= toMinutes(today.close);
}
