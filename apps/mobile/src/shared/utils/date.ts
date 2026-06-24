const DEFAULT_LOCALE = "en-GH";

/** Format an ISO date string as a human-readable date, e.g. "14 Jun 2026". */
export function formatDate(iso: string, locale: string = DEFAULT_LOCALE): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format an ISO date string with time, e.g. "14 Jun 2026, 14:30". */
export function formatDateTime(iso: string, locale: string = DEFAULT_LOCALE): string {
  return new Date(iso).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Relative time, e.g. "3 hours ago" / "in 2 days". */
export function timeAgo(iso: string, locale: string = DEFAULT_LOCALE): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return "";
}
