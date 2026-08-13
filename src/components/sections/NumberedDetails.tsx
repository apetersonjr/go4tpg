import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";
import { cn } from "@/lib/cn";
import { cardHover } from "@/lib/motion";

export type NumberedDetail = {
  title: string;
  body: string;
};

type NumberedDetailsProps = {
  kicker?: string;
  headline: string;
  items: NumberedDetail[];
  band?: Band;
};

/**
 * Numbered items that each carry a name and a paragraph — the Sprint's five
 * deliverables, where `NumberedSteps`' one-line cards would truncate the
 * argument. Wider minimum column than the steps grid so the prose has room to
 * settle instead of laddering down a narrow gutter.
 */
export function NumberedDetails({ kicker, headline, items, band = "white" }: NumberedDetailsProps) {
  return (
    <SectionContainer className={bandClass[band]}>
      <SectionHeading kicker={kicker} headline={headline} />
      <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-[26px]">
        {items.map((item, index) => (
          <li
            key={item.title}
            className={cn(
              "border-tpg-border border-t-tpg-cta rounded-md border border-t-[6px] bg-white px-[34px] py-10",
              cardHover,
            )}
          >
            <span
              aria-hidden="true"
              className="text-tpg-accent block font-serif text-[40px] leading-none"
            >
              {index + 1}
            </span>
            <h3 className="text-tpg-ink mt-3 font-serif text-[23px] leading-[1.15]">
              {item.title}
            </h3>
            <p className="text-tpg-body mt-4 text-[16.5px]">{item.body}</p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
