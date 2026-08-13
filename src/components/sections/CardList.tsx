import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";
import { cn } from "@/lib/cn";
import { cardHover } from "@/lib/motion";

type CardListProps = {
  kicker?: string;
  headline: string;
  /** Lead-in paragraphs above the cards, in order. */
  body?: string[];
  items: string[];
  band?: Band;
};

/**
 * An unordered set of short statements, one per card — "who this is for",
 * "what people bring". Deliberately not a numbered list: nothing here is a
 * sequence, and numbering them would imply one.
 */
export function CardList({ kicker, headline, body = [], items, band = "tint" }: CardListProps) {
  return (
    <SectionContainer className={bandClass[band]}>
      <SectionHeading kicker={kicker} headline={headline} tight={body.length > 0} />
      {body.map((paragraph) => (
        <p key={paragraph} className="text-tpg-body mt-4 mb-10 max-w-[860px] text-[17px]">
          {paragraph}
        </p>
      ))}
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "border-tpg-border text-tpg-body rounded-md border bg-white px-8 py-[30px] text-[17px]",
              cardHover,
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
