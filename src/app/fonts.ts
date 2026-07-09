import { Figtree, Newsreader } from "next/font/google";

/**
 * Body / UI font. Variable font, weights 400-700.
 */
export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Serif display font used for all headlines. Loaded normal + italic since
 * the hero accent, testimonial quotes, and footer tagline rely on italics.
 */
export const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
