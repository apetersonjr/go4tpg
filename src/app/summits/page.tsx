import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { PageHero } from "@/components/ui/PageHero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import {
  audienceHeadline,
  audienceItems,
  audienceKicker,
  deliverables,
  deliverablesHeadline,
  deliverablesKicker,
  howItWorksHeadline,
  howItWorksKicker,
  howItWorksSteps,
  offeringsHeadline,
  offeringsKicker,
  summitOfferings,
  summitsClosing,
  summitsFaq,
  summitsHero,
  summitsMeta,
} from "@/content/summits";

export const metadata: Metadata = {
  title: summitsMeta.title,
  description: summitsMeta.description,
  alternates: { canonical: "/summits/" },
  openGraph: {
    title: summitsMeta.title,
    description: summitsMeta.description,
    url: "/summits/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: summitsMeta.title,
    description: summitsMeta.description,
  },
};

export default function SummitsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...summitsHero} />

        <SectionContainer className="bg-white">
          <Kicker>{deliverablesKicker}</Kicker>
          <h2 className="text-tpg-ink mb-14 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {deliverablesHeadline}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[26px]">
            {deliverables.map((deliverable) => (
              <div
                key={deliverable.title}
                className="border-tpg-border border-t-tpg-primary rounded-md border border-t-[6px] bg-white px-[34px] py-10"
              >
                <h3 className="text-tpg-ink font-serif text-[25px] leading-[1.15]">
                  {deliverable.title}
                </h3>
                <p className="text-tpg-muted mt-1.5 mb-6 text-[13.5px] tracking-[0.08em] uppercase">
                  {deliverable.note}
                </p>
                {deliverable.intro && (
                  <p className="text-tpg-body mb-5 text-[16px]">{deliverable.intro}</p>
                )}
                <ol className="text-tpg-body list-decimal space-y-3 pl-5 text-[16px]">
                  {deliverable.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                {deliverable.outro && (
                  <p className="text-tpg-muted mt-5 text-[15px]">{deliverable.outro}</p>
                )}
              </div>
            ))}
          </div>
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <Kicker>{howItWorksKicker}</Kicker>
          <h2 className="text-tpg-ink mb-14 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {howItWorksHeadline}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step}
                className="border-tpg-border rounded-md border bg-white px-8 py-[34px]"
              >
                <span className="text-tpg-accent block font-serif text-[44px] leading-none">
                  {index + 1}
                </span>
                <p className="text-tpg-body mt-4 text-[16.5px]">{step}</p>
              </div>
            ))}
          </div>
        </SectionContainer>

        <SectionContainer className="bg-white">
          <Kicker>{offeringsKicker}</Kicker>
          <h2 className="text-tpg-ink mb-14 max-w-[900px] font-serif text-[clamp(28px,3.4vw,44px)] leading-[1.14]">
            {offeringsHeadline}
          </h2>
          <div className="grid gap-[26px]">
            {summitOfferings.map((offering) => (
              <OfferDetail key={offering.title} offering={offering} />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <Kicker>{audienceKicker}</Kicker>
          <h2 className="text-tpg-ink mb-12 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {audienceHeadline}
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
            {audienceItems.map((item) => (
              <li
                key={item}
                className="border-tpg-border text-tpg-body rounded-md border bg-white px-8 py-[30px] text-[17px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionContainer>

        <Faq items={summitsFaq} />

        <BookingBlock headline={summitsClosing.headline} calendlyTitle={summitsClosing.ctaLabel} />
      </main>
      <Footer />
    </div>
  );
}
