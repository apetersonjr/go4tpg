import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The colour key for each Summit's hero field. Annual keeps the standard blue;
 * Mid-Year sits one step deeper; Finish Strong adds the warm act-now glow.
 */
export type SummitField = "standard" | "midyear" | "finish";

const fieldClass: Record<SummitField, string> = {
  standard: "bg-hero",
  midyear: "bg-hero-midyear",
  finish: "bg-hero-finish",
};

type SummitHeroProps = {
  /** Short name shown at the end of the breadcrumb, e.g. "Annual". */
  crumb: string;
  /** The product name, set as the H1 with its trailing period. */
  name: string;
  /** The line that used to be the H1, now an italic serif tagline. */
  tagline: string;
  lede: string;
  ctaLabel: string;
  ctaHref: string;
  field: SummitField;
  /** Seasonal pill riding on the breadcrumb row. */
  badge?: string;
};

/**
 * Hero for the three Summit child pages (Alan, 24 Sep 2026).
 *
 * The page leads with its product name, and a working breadcrumb makes the
 * parent one tap away. The three pages share this layout and differ only by
 * their colour field, so each is recognisable at a glance without drifting
 * from the others.
 */
export function SummitHero({
  crumb,
  name,
  tagline,
  lede,
  ctaLabel,
  ctaHref,
  field,
  badge,
}: SummitHeroProps) {
  return (
    <SectionContainer as="header" className={cn(fieldClass[field], "text-white")} paddedY={false}>
      <div className="py-[clamp(64px,8vw,110px)]">
        <div className="mb-[22px] flex flex-wrap items-center gap-x-3 gap-y-2">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[13px] font-bold tracking-[0.22em] uppercase">
              <li>
                <Link
                  href="/summits"
                  className="text-tpg-sky underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Planning Summits
                </Link>
              </li>
              <li aria-hidden="true" className="text-tpg-sky">
                →
              </li>
              <li aria-current="page" className="text-tpg-warm">
                {crumb}
              </li>
            </ol>
          </nav>
          {badge && (
            <span className="rounded-full border border-white/70 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.12em] text-white uppercase">
              {badge}
            </span>
          )}
        </div>
        <h1 className="max-w-[900px] font-serif text-[clamp(38px,5.4vw,68px)] leading-[1.12] font-normal tracking-[-0.01em]">
          {name}
        </h1>
        {/*
          24px floor keeps the tagline in WCAG's large-text band, where 3:1 is
          the AA bar; the light top of the standard field cannot give smaller
          text 4.5:1.
        */}
        <p className="text-tpg-ice mt-4 max-w-[860px] font-serif text-[clamp(24px,2.2vw,26px)] leading-[1.3] italic">
          {tagline}
        </p>
        <p className="mt-7 mb-10 max-w-[680px] text-[clamp(17px,1.9vw,21px)] leading-[1.65] text-white/[0.82]">
          {lede}
        </p>
        <Button href={ctaHref}>{ctaLabel}</Button>
      </div>
    </SectionContainer>
  );
}
