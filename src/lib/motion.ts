/**
 * Hover treatments shared by the card grids.
 *
 * These live here rather than being retyped per component because the site
 * has a dozen card grids across ten pages, and a card that lifts a different
 * distance on one page than the next reads as a bug rather than as a detail.
 *
 * Both are transform/opacity/colour only — nothing here moves anything else on
 * the page — and both are neutralised by the reduced-motion rule in
 * `globals.css`, which collapses every transition on the site to instant.
 */

/** Free-standing cards: a small lift out of the page. */
export const cardHover =
  "transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(3,62,99,0.14)]";

/**
 * Cards that butt up against each other in a seamless grid — pricing tiers,
 * the proof metrics — where lifting one would tear the 1px seam it shares
 * with its neighbours. Shades instead of moving.
 */
export const cellHover = "transition-colors duration-200 ease-out hover:bg-tpg-tint";
