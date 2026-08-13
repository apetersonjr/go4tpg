export type ClientLogo = {
  /** Filename inside `public/assets/logos/`. */
  src: string;
  /**
   * Company name. This is the only place the client names survive as text
   * now that the strip replaced the written list, so it carries the
   * credential for screen readers and for search engines — keep it exact.
   */
  alt: string;
  /**
   * The file's own pixel dimensions. next/image needs them to reserve space
   * and avoid layout shift. They do not set the rendered size: every mark is
   * scaled to fit a uniform cell in the strip, so these only have to be
   * truthful about the source file's aspect ratio.
   */
  width: number;
  height: number;
  /**
   * Bounding box of the visible mark inside that canvas, in the same pixels.
   *
   * Every file supplied so far is a padded canvas, and the padding is wildly
   * uneven — Waste Management's mark uses 42% of its file's height, the
   * County seal uses 97%. Sizing on the canvas would therefore render one
   * credential twice the size of another for no reason but how the artwork
   * was exported, so the strip sizes on this box instead and crops the
   * padding away. Every supplied mark is centred in its canvas to within
   * about 1%, which is what lets the crop be a plain centred overflow.
   *
   * Measured as the extent of the non-transparent pixels (non-white, for the
   * one opaque file). Re-measure when artwork is replaced.
   */
  ink: { width: number; height: number };
  /**
   * Set when the file has an opaque white background rather than a
   * transparent one, which would otherwise show as a pale card sitting on
   * the tint band. See `LogoMarquee` for how it is knocked out.
   */
  whitePlate?: boolean;
};

/**
 * Label above the strip. This is the V19 trust line verbatim — it used to
 * sit in `proof.ts` as `trustLine.lead`, and moved here when the strip left
 * the proof section for the hero shelf.
 */
export const logosCaption = "35 years. Startups to Fortune 200.";

/**
 * Client marks for the trust strip, replacing the sentence that used to run
 * under the trust line.
 *
 * Ordered so the strip alternates rather than clumps: the widest wordmark
 * (Weaver) and the only square mark (the County seal) are kept apart, so no
 * stretch of the track reads as either a wall of text or a run of gaps.
 */
export const clientLogos: ClientLogo[] = [
  {
    src: "waste-management.png",
    alt: "Waste Management",
    width: 4267,
    height: 2667,
    ink: { width: 4215, height: 1125 },
  },
  {
    src: "xerox.png",
    alt: "Xerox Corporate",
    width: 5000,
    height: 3125,
    ink: { width: 4668, height: 1253 },
  },
  {
    src: "southern-california-edison.svg",
    alt: "Southern California Edison",
    width: 1200,
    height: 800,
    ink: { width: 923, height: 327 },
  },
  {
    src: "county-of-la.jpg",
    alt: "County of Los Angeles",
    width: 152,
    height: 145,
    ink: { width: 139, height: 140 },
    whitePlate: true,
  },
  {
    src: "logo-weavercg.svg",
    alt: "Weaver Consulting Group",
    width: 1158,
    height: 178,
    ink: { width: 1158, height: 178 },
  },
  {
    src: "abbott-logo.png",
    alt: "Abbott Medical Optics",
    width: 300,
    height: 150,
    ink: { width: 210, height: 81 },
  },
  {
    src: "psc-logo.png",
    alt: "PSC",
    width: 300,
    height: 150,
    ink: { width: 280, height: 80 },
  },
  {
    src: "team-industrial-logo.png",
    alt: "TEAM Industrial Services",
    width: 300,
    height: 150,
    ink: { width: 284, height: 116 },
  },
];
