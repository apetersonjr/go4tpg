import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";

type PageHeroProps = {
  kicker: string;
  headline: string;
  lede: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Category-page hero. Shares the homepage hero's gradient so the subpages read
 * as the same site, but is deliberately shorter — the homepage hero is a
 * 92vh landing statement, these are the top of a document someone is reading.
 */
export function PageHero({ kicker, headline, lede, ctaLabel, ctaHref }: PageHeroProps) {
  return (
    <SectionContainer as="header" className="bg-hero text-white" paddedY={false}>
      <div className="py-[clamp(64px,8vw,110px)]">
        <Kicker color="sky">{kicker}</Kicker>
        <h1 className="max-w-[900px] font-serif text-[clamp(38px,5.4vw,68px)] leading-[1.12] font-normal tracking-[-0.01em]">
          {headline}
        </h1>
        <p className="mt-7 mb-10 max-w-[680px] text-[clamp(17px,1.9vw,21px)] leading-[1.65] text-white/[0.82]">
          {lede}
        </p>
        <Button href={ctaHref}>{ctaLabel}</Button>
      </div>
    </SectionContainer>
  );
}
