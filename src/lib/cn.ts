type ClassValue = string | number | null | undefined | false;

/**
 * Minimal classnames joiner. Filters out falsy values and joins the rest
 * with a single space. Deliberately small — this project doesn't need the
 * full clsx/tailwind-merge combo for a handful of conditional classes.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
