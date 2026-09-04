/**
 * Print tokens for the generated report pages.
 *
 * These are NOT the web tokens from `globals.css`, and the difference is
 * deliberate. The generated pages in this report are bound between pages that
 * already exist as finished PDFs — the nineteen one-pagers and the brochure —
 * and the requirement those pages set is that a reader cannot tell which pages
 * were generated. That is a harder constraint than matching the website.
 *
 * The values below were sampled out of the one-pagers' own content streams by
 * decoding their `rg` fill operators and ranking by frequency. They are the
 * literal ink of the documents these pages sit beside:
 *
 *     #7a8d9b  335 fills    #103a54  242 fills    #54697a  193 fills
 *     #8b9daa   46 fills    #e5701b   25 fills    #dce5ec   12 fills
 *
 * The web palette runs cooler and more saturated (`--tpg-ink: #032a45`,
 * `--tpg-primary: #0088cc`). Setting a generated heading in the web navy next
 * to a designed heading in #103a54 reads as two different brands on facing
 * pages, which is exactly the assembly error this document must not look like.
 *
 * Note which color is the accent. The one-pagers set their numerals, rules and
 * section marks in ORANGE, not blue — the blue that appears on installation 01
 * belongs to its workflow diagram, not to the page furniture. An early version
 * of this file read the palette off 01 alone and drew blue rules throughout,
 * which put the generated pages visibly out of step with all nineteen. Sample
 * more than one page before believing a palette.
 *
 * If the one-pagers are ever re-exported with a different palette, re-sample
 * rather than hand-editing: the numbers here are measurements, not choices.
 */

/** A PDF fill color as the 0-1 RGB triple `pdf-lib`'s `rgb()` expects. */
export type Ink = { r: number; g: number; b: number };

function hex(value: string): Ink {
  const n = parseInt(value.replace("#", ""), 16);
  return {
    r: ((n >> 16) & 0xff) / 255,
    g: ((n >> 8) & 0xff) / 255,
    b: (n & 0xff) / 255,
  };
}

export const ink = {
  /** Headings and cover ground. The dominant navy of the one-pagers. */
  navy: hex("#103a54"),
  /** A step darker than `navy`, for the cover gradient's far edge only. */
  navyDeep: hex("#0b2a3e"),
  /**
   * The accent: numerals, rules and section marks. Sampled from the shared
   * page furniture rather than from any one page's illustration.
   */
  accent: hex("#e5701b"),
  /** Present only in installation 01's workflow diagram. Not page furniture. */
  blue: hex("#0a76bc"),
  /** Running body text. */
  body: hex("#54697a"),
  /** Eyebrows, footers, and anything deliberately quieter than body. */
  muted: hex("#7a8d9b"),
  /** Hairlines and table rules. */
  rule: hex("#dce5ec"),
  /** The callout ground on page 2. */
  tint: hex("#f4f7fa"),
  white: hex("#ffffff"),
  /**
   * The one value not sampled from the one-pagers: they contain no orange.
   * The brochure cover's rule and the site's CTA are the same warm orange, and
   * the brief calls for it in two places — the cover's thin rule and the
   * callout's left border. Taken from `--tpg-cta` in `globals.css`.
   */
  orange: hex("#e8651f"),
} as const;

/**
 * US Letter. Every asset in `public/assets` measures exactly 612 x 792, which
 * was verified rather than assumed — a generated page at any other size would
 * make the merged document reflow in a viewer's two-page spread.
 */
export const PAGE = { width: 612, height: 792 } as const;

/**
 * Margins matching the one-pagers. Their content column starts at x=64 in the
 * 816-wide space the page is drawn in, under a 0.75 scale — 64 * 0.75 = 48pt.
 */
export const MARGIN = { x: 48, top: 56, bottom: 56 } as const;

/** Type scale, in points. */
export const TYPE = {
  coverTitle: 34,
  coverSubtitle: 13,
  heading: 24,
  subheading: 15,
  body: 10.5,
  small: 9,
  eyebrow: 8,
} as const;

/** Leading multipliers, applied to the size they belong to. */
export const LEADING = { body: 1.55, heading: 1.2, cover: 1.25 } as const;
