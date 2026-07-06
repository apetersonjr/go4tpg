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
            className="border-tpg-border-strong text-tpg-muted hover:text-tpg-navy flex h-16 max-w-[250px] min-w-[42%] flex-1 items-center justify-center rounded-md border border-dashed font-mono text-[11.5px] grayscale transition-[color,filter] duration-300 hover:grayscale-0"
          >
            {name}
          </div>
        ))}
      </div>

      {/* TODO: replace text placeholders with real client logo images once received */}
    </SectionContainer>
  );
}
