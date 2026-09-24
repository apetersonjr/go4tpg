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

/**
 * Free-standing cards: a small lift out of the page.
 *
 * Tailwind v4's `-translate-y-*` utilities set the `translate` property, not
 * `transform`, so `translate` is what must be transitioned — listing
 * `transform` here left the lift snapping instead of easing.
 */
export const cardHover =
  "transition-[box-shadow,translate] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(3,62,99,0.14)]";

/**
 * Cards that butt up against each other in a seamless grid — pricing tiers,
 * the proof metrics — where lifting one would tear the 1px seam it shares
 * with its neighbours. Shades instead of moving.
 */
export const cellHover = "transition-colors duration-200 ease-out hover:bg-tpg-tint";
