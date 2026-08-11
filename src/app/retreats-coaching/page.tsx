import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/ui/PageHero";
import { PricingTiers } from "@/components/ui/PricingTiers";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import {
  coachInstaller,
  collection,
  jdlOffering,
  jdlSections,
  jdlTiers,
  lighthouseAddOn,
  lighthouseEntry,
  lighthouseTiers,
  retreatOfferings,
  retreatTiers,
  retreatTiersNote,
  retreatsHero,
  retreatsMeta,
  sailingCalendar,
  voyageComparison,
  whatYouBring,
} from "@/content/retreats";
import { servicesClosing } from "@/content/servicesClosing";

export const metadata: Metadata = {
  title: retreatsMeta.title,
  description: retreatsMeta.description,
  alternates: { canonical: "/retreats-coaching/" },
  openGraph: {
    title: retreatsMeta.title,
    description: retreatsMeta.description,
    url: "/retreats-coaching/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: retreatsMeta.title,
    description: retreatsMeta.description,
  },
};

/** Shared label style for sub-blocks inside an offer card. */
const subheadClass =
  "text-tpg-muted mt-10 mb-5 text-[13.5px] font-bold tracking-[0.14em] uppercase";

export default function RetreatsCoachingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...retreatsHero} />

        {/* The Cyrolia Retreats collection */}
        <SectionContainer className="bg-white">
          <Kicker>{collection.kicker}</Kicker>
          <h2 className="text-tpg-ink mb-8 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {collection.headline}
          </h2>
          <div className="max-w-[860px] space-y-5 text-[17px]">
            <p>{collection.intro}</p>
            {collection.voyages.map((voyage) => (
              <p key={voyage.name}>
                <strong className="text-tpg-ink">{voyage.name}</strong>
                {voyage.text}
              </p>
            ))}
            {collection.outro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </SectionContainer>

        {/* The two voyages */}
        <SectionContainer className="bg-tpg-tint">
          <div className="grid gap-[26px]">
            <OfferDetail offering={retreatOfferings[0]}>
              <div className="mt-10">
                <Kicker>{sailingCalendar.kicker}</Kicker>
                <p className="text-tpg-ink font-serif text-[23px] leading-[1.2]">
                  {sailingCalendar.headline}
                </p>
                <p className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                  {sailingCalendar.body}
                </p>
              </div>

              <h4 className={subheadClass}>{whatYouBring.headline}</h4>
              {whatYouBring.body.map((paragraph) => (
                <p key={paragraph} className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                  {paragraph}
                </p>
              ))}

              <PricingTiers tiers={retreatTiers} note={retreatTiersNote} />
            </OfferDetail>

            <OfferDetail offering={jdlOffering}>
              <h4 className={subheadClass}>{jdlSections.problem.heading}</h4>
              {jdlSections.problem.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                  {paragraph}
                </p>
              ))}

              <h4 className={subheadClass}>{jdlSections.workOn.heading}</h4>
              <p className="text-tpg-body max-w-[860px] text-[16.5px]">
                {jdlSections.workOn.intro}
              </p>
              <ol className="text-tpg-body mt-4 max-w-[860px] list-decimal space-y-2.5 pl-5 text-[16px]">
                {jdlSections.workOn.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>

              <h4 className={subheadClass}>{jdlSections.blueprint.heading}</h4>
              <p className="text-tpg-body max-w-[860px] text-[16.5px]">
                {jdlSections.blueprint.intro}
              </p>
              <ol className="text-tpg-body mt-4 max-w-[860px] list-decimal space-y-2.5 pl-5 text-[16px]">
                {jdlSections.blueprint.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                {jdlSections.blueprint.closing}
              </p>

              <h4 className={subheadClass}>{jdlSections.whoComes.heading}</h4>
              {jdlSections.whoComes.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                  {paragraph}
                </p>
              ))}

              <h4 className={subheadClass}>{jdlSections.week.heading}</h4>
              {jdlSections.week.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                  {paragraph}
                </p>
              ))}

              <h4 className={subheadClass}>{jdlSections.dates.heading}</h4>
              <p className="text-tpg-ink font-serif text-[23px] leading-[1.2]">
                {jdlSections.dates.status}
              </p>
              <p className="text-tpg-body mt-4 max-w-[860px] text-[16.5px]">
                {jdlSections.dates.body}
              </p>

              <h4 className={subheadClass}>{jdlSections.investmentHeading}</h4>
              <PricingTiers tiers={jdlTiers} />
            </OfferDetail>
          </div>
        </SectionContainer>

        {/* Which voyage? */}
        <SectionContainer className="bg-white">
          <h2 className="text-tpg-ink mb-3 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {voyageComparison.headline}
          </h2>
          <p className="text-tpg-muted mb-12 text-[18px]">{voyageComparison.subhead}</p>
          <div className="border-tpg-border overflow-x-auto rounded-md border">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15.5px]">
              <thead>
                <tr className="bg-tpg-primary text-white">
                  <th className="px-5 py-[18px]" />
                  {voyageComparison.columns.map((column) => (
                    <th key={column} className="px-5 py-[18px] font-bold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {voyageComparison.rows.map((row) => (
                  <tr key={row.label} className="border-tpg-border border-t">
                    <th className="text-tpg-muted w-[18%] px-5 py-4 align-top font-bold">
                      {row.label}
                    </th>
                    <td className="text-tpg-body px-5 py-4 align-top">{row.a}</td>
                    <td className="text-tpg-body px-5 py-4 align-top">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-tpg-body mt-8 text-[17px]">{voyageComparison.closing}</p>
        </SectionContainer>

        {/* Lighthouse Leadership OS */}
        <SectionContainer className="bg-tpg-tint">
          <OfferDetail offering={retreatOfferings[1]}>
            <p className="text-tpg-body mt-9 max-w-[860px] text-[17px]">
              {lighthouseEntry.pre}
              <strong className="text-tpg-ink">{lighthouseEntry.emphasis}</strong>
              {lighthouseEntry.post}
            </p>
            <PricingTiers tiers={lighthouseTiers} note={lighthouseAddOn} />
          </OfferDetail>
        </SectionContainer>

        {/* Coach and Installer */}
        <SectionContainer className="bg-white">
          <h2 className="text-tpg-ink mb-10 max-w-[860px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {coachInstaller.headline}
          </h2>
          <div className="max-w-[860px] space-y-5 text-[17px]">
            {coachInstaller.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className="text-tpg-ink mt-14 mb-5 font-serif text-[26px] leading-[1.15]">
            {coachInstaller.economics.subhead}
          </h3>
          <div className="max-w-[860px] space-y-5 text-[16.5px]">
            {coachInstaller.economics.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className="text-tpg-ink mt-14 mb-5 font-serif text-[26px] leading-[1.15]">
            {coachInstaller.lifeguard.subhead}
          </h3>
          <div className="max-w-[860px] space-y-5 text-[16.5px]">
            {coachInstaller.lifeguard.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </SectionContainer>

        <ClosingCta {...servicesClosing} />
      </main>
      <Footer />
    </div>
  );
}
