import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Deliverable } from "@/content/summits";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";
import { cn } from "@/lib/cn";
import { cardHover } from "@/lib/motion";

type DeliverableCardsProps = {
  kicker?: string;
  headline?: string;
  /** Rendered side by side on wide viewports, stacked below ~700px. */
  items: Deliverable[];
  band?: Band;
};

/**
 * The "what you leave with" grid: one card per written deliverable, each with
 * its delivery window as a sub-label and its contents as a numbered list.
 *
 * Extracted from the Planning Summits category page, which still renders it —
 * the two summit child pages carry the same block with their own named
 * deliverables, and three hand-copies of this markup would have drifted.
 */
export function DeliverableCards({
  kicker,
  headline,
  items,
  band = "white",
}: DeliverableCardsProps) {
  return (
    <SectionContainer className={bandClass[band]}>
      {headline && <SectionHeading kicker={kicker} headline={headline} />}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[26px]">
        {items.map((deliverable) => (
          <div
            key={deliverable.title}
            className={cn(
              "border-tpg-border border-t-tpg-primary rounded-md border border-t-[6px] bg-white px-[34px] py-10",
              cardHover,
            )}
          >
            <h3 className="text-tpg-ink font-serif text-[25px] leading-[1.15]">
              {deliverable.title}
            </h3>
            <p className="text-tpg-muted mt-1.5 mb-6 text-[13.5px] tracking-[0.08em] uppercase">
              {deliverable.note}
            </p>
            {deliverable.intro && (
              <p className="text-tpg-body mb-5 text-[16px]">{deliverable.intro}</p>
            )}
            <ol className="text-tpg-body list-decimal space-y-3 pl-5 text-[16px]">
              {deliverable.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            {deliverable.outro && (
              <p className="text-tpg-muted mt-5 text-[15px]">{deliverable.outro}</p>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
