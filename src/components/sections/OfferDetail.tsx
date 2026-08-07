import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import type { Offering } from "@/content/summits";

type OfferDetailProps = {
  offering: Offering;
  /** Extra blocks (deliverable lists, tier tables) rendered before the CTA. */
  children?: ReactNode;
};

/**
 * One offering: title, tagline, prose, then whatever the page needs to slot in
 * before the call to action.
 *
 * The price block renders when the offering has a figure, notes, or both — so
 * an offer with no fixed price (the Fractional CRA) still gets the same
 * treatment, carrying its scoping sentence where the figure would sit.
 */
export function OfferDetail({ offering, children }: OfferDetailProps) {
  return (
    <article className="border-tpg-border rounded-md border bg-white px-[clamp(24px,4vw,48px)] py-[clamp(32px,4vw,52px)]">
      {offering.eyebrow && <Kicker>{offering.eyebrow}</Kicker>}
      <h3 className="text-tpg-ink font-serif text-[clamp(26px,3vw,36px)] leading-[1.15]">
        {offering.title}
      </h3>
      <p className="text-tpg-accent mt-4 max-w-[820px] font-serif text-[19px] italic">
        {offering.tagline}
      </p>
      {offering.body.map((paragraph) => (
        <p key={paragraph} className="text-tpg-body mt-5 max-w-[860px] text-[16.5px]">
          {paragraph}
        </p>
      ))}

      {children}

      {(offering.price || offering.priceNotes.length > 0) && (
        <div className="border-tpg-border mt-9 border-t pt-7">
          {offering.price && (
            <p className="text-tpg-ink font-serif text-[clamp(30px,3.4vw,40px)] leading-none">
              {offering.price}
            </p>
          )}
          {offering.priceNotes.map((note) => (
            <p key={note} className="text-tpg-muted mt-2.5 max-w-[620px] text-[15px]">
              {note}
            </p>
          ))}
        </div>
      )}

      <p className="mt-9">
        <Button href={offering.ctaHref}>{offering.ctaLabel}</Button>
      </p>
    </article>
  );
}
