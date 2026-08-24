import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { Faq } from "@/components/sections/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { cardHover } from "@/lib/motion";
import {
  auditBody,
  auditCta,
  auditHeadline,
  auditKicker,
  brochureLeadIn,
  brochures,
  installationOfferings,
  installationsFaq,
  installationsHero,
  installationsMeta,
  lanes,
  lanesHeadline,
  lanesKicker,
  lanesNote,
  menuBody,
  menuCategories,
  menuHeadline,
  menuKicker,
  sprintOutcomes,
  sprintOutcomesHeadline,
} from "@/content/installations";
import { servicesClosing } from "@/content/servicesClosing";

export const metadata: Metadata = {
  title: installationsMeta.title,
  description: installationsMeta.description,
  alternates: { canonical: "/installations/" },
  openGraph: {
    title: installationsMeta.title,
    description: installationsMeta.description,
    url: "/installations/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: installationsMeta.title,
    description: installationsMeta.description,
  },
};

export default function InstallationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...installationsHero} />

        <SectionContainer className="bg-white">
          <Kicker>{lanesKicker}</Kicker>
          <h2 className="text-tpg-ink mb-14 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {lanesHeadline}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[26px]">
            {lanes.map((lane) => (
              <div
                key={lane.title}
                className={cn(
                  "border-tpg-border rounded-md border border-t-[6px] bg-white px-[34px] py-10",
                  cardHover,
                  lane.variant === "standard" ? "border-t-tpg-cta" : "border-t-tpg-accent",
                )}
              >
                <h3 className="text-tpg-ink mb-4 font-serif text-[23px] leading-[1.15]">
                  {lane.title}
                </h3>
                <p className="text-tpg-body text-[16.5px]">{lane.description}</p>
              </div>
            ))}
          </div>
          <p className="text-tpg-muted mt-10 max-w-[860px] text-[16.5px]">{lanesNote}</p>

          {/* The gate on Lane 2 — stated here so no reader reaches a custom quote without it. */}
          <div className="border-tpg-accent mt-14 max-w-[900px] rounded-md border-l-[5px] bg-white pl-8">
            <Kicker>{auditKicker}</Kicker>
            <h3 className="text-tpg-ink mb-6 font-serif text-[clamp(24px,2.8vw,32px)] leading-[1.15]">
              {auditHeadline}
            </h3>
            {auditBody.map((paragraph) => (
              <p key={paragraph} className="text-tpg-body mt-4 text-[16.5px]">
                {paragraph}
              </p>
            ))}
            <p className="mt-8">
              <Button href={auditCta.href}>{auditCta.label}</Button>
            </p>
          </div>
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <Kicker>{menuKicker}</Kicker>
          <h2 className="text-tpg-ink mb-8 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {menuHeadline}
          </h2>
          <p className="text-tpg-body mb-12 max-w-[860px] text-[17px]">{menuBody}</p>
          <ul className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {menuCategories.map((category) => (
              <li
                key={category}
                className={cn(
                  "border-tpg-border border-t-tpg-cta text-tpg-ink rounded-md border border-t-[5px] bg-white px-6 py-7 text-center font-serif text-[21px]",
                  /*
                    "Operations & Administration" is nearly three times the
                    length of "People". Centring every label in a common
                    minimum height keeps the six reading as one set instead of
                    a ragged grid, and leaves room for the two-line labels the
                    narrower breakpoints produce.
                  */
                  "flex min-h-[104px] items-center justify-center",
                  cardHover,
                )}
              >
                {category}
              </li>
            ))}
          </ul>
          {/*
            The slot the per-unit list (names + prices) will eventually fill.
            Those names and prices still do not exist and must never be
            invented — until they do, the brochures stand in for them, which
            is why this is the one place on the page they appear.

            The two anchors are deliberately asymmetric. The overview opens
            inline in a new tab and carries no `download`, because a
            same-origin `download` wins over `target` and would save the file
            instead of showing it. The complete menu carries `download` with
            an explicit filename and no `target`, so it saves to disk rather
            than opening in the browser viewer. Both point straight at files
            under `public/` — never routed, never proxied.
          */}
          <div className="mt-10 text-center">
            <p className="text-tpg-muted mx-auto mb-7 max-w-[620px] text-[16.5px]">
              {brochureLeadIn}
            </p>
            <div className="mx-auto flex max-w-[760px] flex-col items-stretch gap-4 sm:flex-row sm:items-stretch sm:justify-center sm:gap-5">
              {brochures.map((brochure) => (
                <Button
                  key={brochure.href}
                  external
                  variant="secondary"
                  href={brochure.href}
                  aria-label={brochure.ariaLabel}
                  /*
                    Narrower side padding until `sm`: at 375px the default
                    `px-10` pushes "View the Installation Menu" onto a second
                    line and strands the PDF token beside the wrapped word.

                    From `sm` up both buttons share a minimum width, so the
                    shorter label does not produce a visibly smaller button
                    From `sm` up the two share the row as equal halves —
                    `basis-0` with `grow` sizes both to the same width rather
                    than letting each shrink to its own label, which is what
                    made the pair look ragged. The padding tightens one step
                    at `sm` so the longer label still clears 768px on one row,
                    and opens back up at `lg`.
                  */
                  className="px-5 text-center whitespace-nowrap sm:grow sm:basis-0 sm:px-6 lg:px-10"
                  {...(brochure.downloadAs
                    ? { download: brochure.downloadAs }
                    : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {brochure.label}
                  {/*
                    The format, inside the button rather than beside it, so it
                    travels with the control instead of reading as stray page
                    text. The aria-label already says "PDF", so this is hidden
                    from assistive technology rather than announced twice.
                  */}
                  <span
                    aria-hidden="true"
                    className="ml-2.5 text-[12.5px] font-bold tracking-[0.14em] uppercase opacity-65"
                  >
                    PDF
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </SectionContainer>

        <SectionContainer className="bg-white">
          <div className="grid gap-[26px]">
            <OfferDetail offering={installationOfferings[0]}>
              <h4 className="text-tpg-muted mt-10 mb-5 text-[13.5px] font-bold tracking-[0.14em] uppercase">
                {sprintOutcomesHeadline}
              </h4>
              <ol className="text-tpg-body max-w-[860px] list-decimal space-y-3 pl-5 text-[16px]">
                {sprintOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ol>
            </OfferDetail>
            <OfferDetail offering={installationOfferings[1]} />
          </div>
        </SectionContainer>

        <Faq items={installationsFaq} />

        <BookingBlock
          kicker={servicesClosing.kicker}
          headline={servicesClosing.headline}
          body={[servicesClosing.body]}
          calendlyTitle={servicesClosing.ctaLabel}
        />
      </main>
      <Footer />
    </div>
  );
}
