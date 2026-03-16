// lib/usage.ts
const FREE_LIMIT = 20;

interface UsageData {
  date: string;
  count: number;
}

export function getDailyCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('parlons_usage') || '{}') as UsageData;
  if (stored.date !== today) return 0;
  return stored.count || 0;
}

export function incrementCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('parlons_usage') || '{}') as UsageData;
  const count = stored.date === today ? (stored.count || 0) + 1 : 1;
  localStorage.setItem('parlons_usage', JSON.stringify({ date: today, count }));
  return count;
}

export function isLimitReached(): boolean {
  return getDailyCount() >= FREE_LIMIT;
}
