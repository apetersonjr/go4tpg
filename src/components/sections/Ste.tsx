import { SectionContainer } from "@/components/ui/SectionContainer";
import { steHeadline, stePillars } from "@/content/ste";

export function Ste() {
  return (
    <SectionContainer className="bg-ste text-white">
      <h2 className="mb-[70px] max-w-[760px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
        {steHeadline}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-14">
        {stePillars.map((pillar) => (
          <div key={pillar.letter}>
            <span className="block font-serif text-[96px] leading-none text-white">
              {pillar.letter}
            </span>
            <h3 className="mt-[18px] mb-3.5 font-serif text-2xl leading-[1.15]">{pillar.title}</h3>
            <p className="text-[16.5px] text-white/[0.78]">{pillar.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
