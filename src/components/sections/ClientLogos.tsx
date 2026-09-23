import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { logosCaption, logosCredential } from "@/content/logos";

/**
 * Client credential shelf, sitting directly under the hero.
 *
 * Deliberately shallow — `paddedY` is off and the vertical rhythm is set
 * here — so it reads as a ledge hanging off the hero rather than as the
 * first real section. The pale tint also keeps the dark hero and the white
 * opening question from colliding.
 */
export function ClientLogos() {
  return (
    <SectionContainer
      className="bg-tpg-tint border-tpg-border border-b py-12 md:py-14"
      paddedY={false}
    >
      <Kicker className="mb-3 text-center">{logosCaption}</Kicker>
      {/* V20 credential line. Prose, not a second kicker — it is a full sentence. */}
      <p className="text-tpg-body mx-auto mb-8 max-w-[720px] text-center text-[16px]">
        {logosCredential}
      </p>
      <LogoMarquee />
    </SectionContainer>
  );
}
