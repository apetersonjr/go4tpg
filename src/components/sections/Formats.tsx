import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { formatCards, formatsHeadline, formatsKicker } from "@/content/formats";
import type { FormatCard } from "@/content/formats";
import { cn } from "@/lib/cn";

const accentClassMap: Record<FormatCard["accent"], string> = {
  primary: "border-t-tpg-primary",
  cta: "border-t-tpg-cta",
  accent: "border-t-tpg-accent",
};

export function Formats() {
  return (
    <SectionContainer id="formats">
      <Kicker>{formatsKicker}</Kicker>
      <h2 className="text-tpg-ink mb-16 max-w-[900px] font-serif text-[clamp(32px,4.4vw,56px)] leading-[1.12]">
        {formatsHeadline}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
        {formatCards.map((card) => (
          <div
            key={card.title}
            className={cn(
              "border-tpg-border flex flex-col rounded-md border border-t-[6px] bg-white px-[34px] py-10",
              "transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(3,62,99,0.14)]",
              accentClassMap[card.accent],
            )}
          >
            <h3 className="text-tpg-ink mb-[18px] font-serif text-[27px] leading-[1.15]">
              {card.title}
            </h3>
            <p className="text-tpg-body grow text-[16.5px]">{card.description}</p>
            <p className="border-tpg-border text-tpg-muted my-[26px] mb-[26px] border-t pt-[22px] text-[15px] leading-8">
              {card.offers.map((offer) => (
                <b key={offer} className="text-tpg-primary block font-bold">
                  {offer}
                </b>
              ))}
            </p>
            <a href="#" className="text-tpg-cta hover:text-tpg-cta-hover text-base font-bold">
              {card.linkLabel}
            </a>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
