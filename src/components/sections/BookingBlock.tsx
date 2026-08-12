import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { CalendlyInline } from "@/components/ui/CalendlyInline";
import { commitCalendlyUrl, commitEmail } from "@/content/commit";

type BookingBlockProps = {
  /** Small label above the directive. */
  kicker?: string;
  /** The directive. Largest type in the section. */
  headline: string;
  /** Supporting sentences under the directive, in order. */
  body?: string[];
  /** Closing line, set in italic serif. */
  note?: string;
  /**
   * A primary action that is not "book a call" — the retreat pages close on
   * "Reserve a Berth", which is a written application, not a 20-minute slot.
   * The scheduler stays either way, so a reader who would rather talk first
   * still has somewhere to go.
   */
  cta?: { label: string; href: string };
  /** Accessible name for the scheduler region. */
  calendlyTitle?: string;
};

/**
 * The site's booking surface, rendered at the foot of every page.
 *
 * Category pages used to close with a button back to the homepage's `#commit`,
 * which threw a reader who had just finished a page to the top of a different
 * one. Each page now carries its own copy of this block and every on-page CTA
 * targets the local `#commit`, so the booking happens without losing context.
 * One scheduler loads per page view either way.
 */
export function BookingBlock({
  kicker,
  headline,
  body = [],
  note,
  cta,
  calendlyTitle = "Book a Planning Summit",
}: BookingBlockProps) {
  return (
    <SectionContainer id="commit" className="bg-commit text-white">
      <div className="grid items-start gap-x-[clamp(32px,5vw,72px)] gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          {kicker && <Kicker color="sky">{kicker}</Kicker>}
          <h2 className="mb-[26px] font-serif text-[clamp(32px,3.8vw,48px)] leading-[1.12]">
            {headline}
          </h2>
          {body.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[clamp(16px,1.7vw,19px)] leading-[1.6] text-white/85"
            >
              {paragraph}
            </p>
          ))}
          {note && (
            <p className="mt-[18px] font-serif text-[clamp(16px,1.7vw,19px)] text-white italic">
              {note}
            </p>
          )}
          {cta && (
            <p className="mt-9">
              <Button href={cta.href} size="big">
                {cta.label}
              </Button>
            </p>
          )}
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
            <CalendlyInline url={commitCalendlyUrl} title={calendlyTitle} />
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
