import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/ui/PageHero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/cn";
import {
  installationOfferings,
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
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <Kicker>{menuKicker}</Kicker>
          <h2 className="text-tpg-ink mb-8 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {menuHeadline}
          </h2>
          <p className="text-tpg-body mb-12 max-w-[860px] text-[17px]">{menuBody}</p>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[18px]">
            {menuCategories.map((category) => (
              <li
                key={category}
                className="border-tpg-border border-t-tpg-cta text-tpg-ink rounded-md border border-t-[5px] bg-white px-6 py-7 text-center font-serif text-[21px]"
              >
                {category}
              </li>
            ))}
          </ul>
          {/*
            The per-unit menu (names + prices) does not exist yet and must
            never be invented. This placeholder renders only under `npm run
            dev` — the closest thing this repo has to staging — and is
            excluded from the production static export by the NODE_ENV gate.
          */}
          {process.env.NODE_ENV === "development" && (
            <p className="border-tpg-cta text-tpg-cta mt-10 rounded-md border-2 border-dashed px-6 py-8 text-center text-[21px] font-bold tracking-[0.1em]">
              INSERT INSTALLATIONS MENU
            </p>
          )}
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

        <ClosingCta {...servicesClosing} />
      </main>
      <Footer />
    </div>
  );
}
