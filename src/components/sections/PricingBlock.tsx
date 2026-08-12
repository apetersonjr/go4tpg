import type { ReactNode } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";

type PricingBlockProps = {
  kicker?: string;
  headline?: string;
  /** The headline figure. Omitted on pages whose pricing is a tier table. */
  price?: string;
  /** Qualifying lines under the figure, in order: what it includes, credit terms. */
  notes?: string[];
  /** A tier table, where one figure will not do. */
  children?: ReactNode;
  band?: Band;
};

/**
 * The one place a price appears on a page.
 *
 * House rule: pricing appears exactly once per page, in its own block, and
 * never inside narrative copy. Giving it a dedicated component keeps that rule
 * checkable — a second figure on a page means a second one of these, which is
 * visible in the page file at a glance.
 */
export function PricingBlock({
  kicker = "Investment",
  headline,
  price,
  notes = [],
  children,
  band = "tint",
}: PricingBlockProps) {
  return (
    <SectionContainer id="pricing" className={bandClass[band]}>
      {headline ? (
        <SectionHeading kicker={kicker} headline={headline} tight />
      ) : (
        <p className="text-tpg-accent mb-[22px] text-[13px] font-bold tracking-[0.22em] uppercase">
          {kicker}
        </p>
      )}

      {price && (
        <p className="text-tpg-ink font-serif text-[clamp(44px,6vw,72px)] leading-none">{price}</p>
      )}

      {notes.map((note) => (
        <p key={note} className="text-tpg-body mt-5 max-w-[760px] text-[17px]">
          {note}
        </p>
      ))}

      {children}
    </SectionContainer>
  );
}
