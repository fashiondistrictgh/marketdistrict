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
// Plain, dependency-free relative time. Avoids Intl.RelativeTimeFormat which is
// not reliably available in React Native's Hermes engine (would throw).
export function timeAgo(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const sec = Math.round((Date.now() - then) / 1000);
    if (sec < 60) return "just now";
    const min = Math.round(sec / 60);
    if (min < 60) return min === 1 ? "1 minute ago" : `${min} minutes ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return hr === 1 ? "1 hour ago" : `${hr} hours ago`;
    const day = Math.round(hr / 24);
    if (day < 7) return day === 1 ? "1 day ago" : `${day} days ago`;
    const wk = Math.round(day / 7);
    if (wk < 5) return wk === 1 ? "1 week ago" : `${wk} weeks ago`;
    const mo = Math.round(day / 30);
    if (mo < 12) return mo === 1 ? "1 month ago" : `${mo} months ago`;
    const yr = Math.round(day / 365);
    return yr === 1 ? "1 year ago" : `${yr} years ago`;
  } catch {
    return "";
  }
}
