import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Band } from "@/lib/band";
import { bandClass } from "@/lib/band";

type NumberedStepsProps = {
  kicker?: string;
  headline: string;
  steps: string[];
  band?: Band;
};

/**
 * The "how it works" band: each step in its own card behind a large serif
 * numeral. The numerals are decorative — the ordering is already carried by
 * the reading order, so they are not announced separately to a screen reader.
 */
export function NumberedSteps({ kicker, headline, steps, band = "tint" }: NumberedStepsProps) {
  return (
    <SectionContainer className={bandClass[band]}>
      <SectionHeading kicker={kicker} headline={headline} />
      <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
        {steps.map((step, index) => (
          <li key={step} className="border-tpg-border rounded-md border bg-white px-8 py-[34px]">
            <span
              aria-hidden="true"
              className="text-tpg-accent block font-serif text-[44px] leading-none"
            >
              {index + 1}
            </span>
            <p className="text-tpg-body mt-4 text-[16.5px]">{step}</p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
