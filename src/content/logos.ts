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
 * All three supplied files are padded canvases — the mark sits inside a lot
 * of transparent margin — which is why the strip fits them to a box rather
 * than matching them on height. Swapping in tightly cropped artwork later
 * needs no code change, only better files.
 *
 * The County of Los Angeles has no artwork yet, so that credential currently
 * appears nowhere on the page. Add a fourth entry once a mark exists.
 */
export const clientLogos: ClientLogo[] = [
  {
    src: "waste-management.png",
    alt: "Waste Management",
    width: 4267,
    height: 2667,
  },
  {
    src: "xerox.png",
    alt: "Xerox Corporate",
    width: 5000,
    height: 3125,
  },
  {
    src: "southern-california-edison.svg",
    alt: "Southern California Edison",
    width: 1200,
    height: 800,
  },
];
