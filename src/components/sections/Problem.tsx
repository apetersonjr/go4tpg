import { SectionContainer } from "@/components/ui/SectionContainer";
import { problemHeadline, problemItems } from "@/content/problem";

export function Problem() {
  return (
    <SectionContainer className="bg-tpg-tint">
      <h2 className="text-tpg-ink mb-16 max-w-[820px] font-serif text-[clamp(32px,4.4vw,56px)] leading-[1.12]">
        {problemHeadline}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[22px]">
        {problemItems.map((item, index) => (
          <div
            key={item.lead}
            className="border-tpg-border flex items-start gap-[22px] rounded-md border bg-white px-8 py-[34px]"
          >
            <span className="text-tpg-accent min-w-[44px] font-serif text-[44px] leading-none">
              {index + 1}
            </span>
            <p className="text-tpg-body text-[17px]">
              <b className="text-tpg-ink">{item.lead}</b>
              {item.rest}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
