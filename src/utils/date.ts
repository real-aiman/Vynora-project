// Anchored once at module load so every date computation in the app (event
// dates, calendar "today", quick filters) agrees on the same "now" for the
// whole session, without re-reading the clock on every render.
export const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/** Returns an ISO (yyyy-mm-dd) date `days` ahead of a base date, in local time. */
export function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysFromToday(iso: string): number {
  const d = new Date(`${iso}T00:00:00`);
  const diff = d.getTime() - TODAY.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
