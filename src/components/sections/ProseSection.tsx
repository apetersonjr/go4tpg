import type { ReactNode } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";

type ProseSectionProps = {
  id?: string;
  kicker?: string;
  headline: string;
  /** Paragraphs under the headline, in order. */
  body?: string[];
  /** Closing line, set in italic serif — used for the one line worth pausing on. */
  note?: string;
  /** Anything the page needs below the prose: lists, tables, sub-blocks. */
  children?: ReactNode;
  band?: Band;
};

/**
 * A headline and its argument. The workhorse band on the child offer pages,
 * which are long-form sales documents rather than the card grids that carry
 * the category pages.
 */
export function ProseSection({
  id,
  kicker,
  headline,
  body = [],
  note,
  children,
  band = "white",
}: ProseSectionProps) {
  return (
    <SectionContainer id={id} className={bandClass[band]}>
      <SectionHeading kicker={kicker} headline={headline} tight />
      {body.map((paragraph) => (
        <p key={paragraph} className="text-tpg-body mt-5 max-w-[860px] text-[17px]">
          {paragraph}
        </p>
      ))}
      {note && (
        <p className="text-tpg-ink mt-7 max-w-[860px] font-serif text-[clamp(19px,2.1vw,23px)] italic">
          {note}
        </p>
      )}
      {children}
    </SectionContainer>
  );
}
