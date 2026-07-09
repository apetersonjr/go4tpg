import { SectionContainer } from "@/components/ui/SectionContainer";
import { faqHeadline, faqItems } from "@/content/faq";

export function Faq() {
  return (
    <SectionContainer id="faq" className="bg-white">
      <h2 className="text-tpg-muted mb-[34px] text-[15px] font-bold tracking-[0.2em] uppercase">
        {faqHeadline}
      </h2>
      {faqItems.map((item) => (
        <details key={item.question} className="group border-tpg-border border-t last:border-b">
          <summary className="text-tpg-ink relative cursor-pointer list-none py-[26px] pr-11 pl-1 font-serif text-[21px] [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="text-tpg-accent absolute top-1/2 right-2.5 -translate-y-1/2 font-sans text-3xl"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">–</span>
            </span>
          </summary>
          <p className="text-tpg-body max-w-[860px] px-1 pb-[30px] text-[16.5px]">{item.answer}</p>
        </details>
      ))}
    </SectionContainer>
  );
}
