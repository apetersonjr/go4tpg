import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";

type ClosingCtaProps = {
  kicker?: string;
  headline: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Closing band for the category pages. Mirrors the homepage commitment
 * section's gradient, but links to that section rather than embedding a second
 * copy of the scheduler — one booking surface, one Calendly load.
 */
export function ClosingCta({ kicker, headline, body, ctaLabel, ctaHref }: ClosingCtaProps) {
  return (
    <SectionContainer className="bg-commit text-center text-white">
      {kicker && (
        <Kicker color="sky" className="mx-auto max-w-[720px]">
          {kicker}
        </Kicker>
      )}
      <h2 className="mx-auto max-w-[900px] font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.16]">
        {headline}
      </h2>
      {body && (
        <p className="mx-auto mt-6 max-w-[640px] text-[clamp(16px,1.7vw,19px)] text-white/85">
          {body}
        </p>
      )}
      <p className="mt-10">
        <Button href={ctaHref} size="big">
          {ctaLabel}
        </Button>
      </p>
    </SectionContainer>
  );
}
