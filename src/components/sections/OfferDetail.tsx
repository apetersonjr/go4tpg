import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
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
 * `offering.price` is rendered only when set. Every offering currently ships
 * with it null, so approving a figure is a one-line content change and needs
 * no markup here.
 */
export function OfferDetail({ offering, children }: OfferDetailProps) {
  return (
    <article className="border-tpg-border rounded-md border bg-white px-[clamp(24px,4vw,48px)] py-[clamp(32px,4vw,52px)]">
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

      {offering.price && <p className="text-tpg-ink mt-8 font-serif text-3xl">{offering.price}</p>}

      <p className="mt-9">
        <Button href={offering.ctaHref}>{offering.ctaLabel}</Button>
      </p>
    </article>
  );
}
