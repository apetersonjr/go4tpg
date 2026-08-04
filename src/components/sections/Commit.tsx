import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { CalendlyInline } from "@/components/ui/CalendlyInline";
import {
  commitBody,
  commitCalendlyUrl,
  commitEmail,
  commitHeadline,
  commitKicker,
  commitSecond,
} from "@/content/commit";

/**
 * Closing section and the site's single booking point — every CTA in the nav
 * and hero targets `#commit`, so the scheduler lives here inline rather than
 * behind another click.
 */
export function Commit() {
  return (
    <SectionContainer id="commit" className="bg-commit text-white">
      <div className="grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <Kicker color="sky">{commitKicker}</Kicker>
          <h2 className="mb-[26px] font-serif text-[clamp(28px,3vw,40px)] leading-[1.16]">
            {commitHeadline}
          </h2>
          <p className="text-[clamp(16px,1.7vw,19px)] text-white/85">{commitBody}</p>
          <p className="mt-[18px] font-serif text-[clamp(16px,1.7vw,19px)] text-white italic">
            {commitSecond}
          </p>
          <p className="mt-10 border-t border-white/[0.12] pt-8 text-[15px] text-white/70">
            {commitEmail.prompt}{" "}
            <a
              href={`mailto:${commitEmail.address}`}
              className="text-tpg-sky underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              {commitEmail.address}
            </a>
          </p>
        </div>

        <div>
          <div className="overflow-hidden rounded-lg bg-white shadow-[0_24px_60px_rgba(3,42,69,0.38)]">
            <CalendlyInline url={commitCalendlyUrl} title="Book a Planning Summit" />
          </div>
          {/* Escape hatch for anyone whose browser blocks the Calendly frame. */}
          <p className="mt-4 text-center text-[13px] text-white/55">
            Calendar not loading?{" "}
            <a
              href={commitCalendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-white"
            >
              Open the scheduler in a new tab
            </a>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
