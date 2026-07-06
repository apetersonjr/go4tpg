import { Figtree, IBM_Plex_Mono, Newsreader } from "next/font/google";

/**
 * Body / UI font. Variable font, weights 400-800.
 */
export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Serif display font used for all headlines. Loaded normal + italic since
 * the hero and pull-quote sections rely on italic emphasis spans.
 */
export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Monospace font used for eyebrow labels, numbered badges, and tags.
 */
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
