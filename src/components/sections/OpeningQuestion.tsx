import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import {
  openingQuestionKicker,
  openingQuestionQuote,
  openingQuestionVerdict,
} from "@/content/openingQuestion";

export function OpeningQuestion() {
  return (
    <SectionContainer className="bg-white text-center">
      <Kicker>{openingQuestionKicker}</Kicker>
      <blockquote className="text-tpg-ink mx-auto max-w-[920px] font-serif text-[clamp(28px,3.6vw,46px)] leading-[1.3]">
        <span
          aria-hidden="true"
          className="text-tpg-cta mr-1.5 align-[-0.1em] text-[1.4em] leading-none"
        >
          “
        </span>
        {openingQuestionQuote}”
      </blockquote>
      <p className="text-tpg-muted mx-auto mt-9 max-w-[640px] text-[clamp(17px,1.8vw,21px)]">
        {openingQuestionVerdict.pre}
        <strong className="text-tpg-cta">{openingQuestionVerdict.emphasis}</strong>
      </p>
    </SectionContainer>
  );
}
