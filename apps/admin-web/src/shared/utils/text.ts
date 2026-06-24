/** Convert a string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Truncate text to a max length, appending an ellipsis. */
export function truncate(input: string, max = 80): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1).trimEnd()}…`;
}

/** Build initials from a full name, e.g. "Jane Doe" -> "JD". */
export function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Generate a human-readable order number, e.g. "MD-7F3A2B". */
export function formatOrderNumber(id: string): string {
  return `MD-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}
