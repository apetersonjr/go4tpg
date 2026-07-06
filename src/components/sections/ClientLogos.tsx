import { SectionContainer } from "@/components/ui/SectionContainer";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { clientLogos, logosEyebrow } from "@/content/logos";

export function ClientLogos() {
  return (
    <SectionContainer
      id="results"
      as="section"
      className="border-tpg-border bg-tpg-bg-tint border-y"
      innerClassName="py-8"
    >
      <EyebrowLabel className="mb-6 text-center" color="subtle">
        {logosEyebrow}
      </EyebrowLabel>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {clientLogos.map((name) => (
          <div
            key={name}
            className="border-tpg-border-strong text-tpg-subtle flex h-16 max-w-[250px] min-w-[42%] flex-1 items-center justify-center rounded-md border border-dashed font-mono text-[11.5px] opacity-55 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
          >
            {name}
          </div>
        ))}
      </div>

      <p className="text-tpg-border-strong mt-4 text-center font-mono text-[10px] tracking-[0.5px]">
        logo slots — drop client marks here
      </p>
    </SectionContainer>
  );
}
