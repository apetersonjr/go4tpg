/**
 * Section bands alternate white and tint down every page, so the reader gets a
 * horizon line between one idea and the next. Sections take a `band` rather
 * than a raw class so a page reads as a sequence of bands, not of hex values.
 */
export type Band = "white" | "tint";

export const bandClass: Record<Band, string> = {
  white: "bg-white",
  tint: "bg-tpg-tint",
};
