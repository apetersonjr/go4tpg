import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { DeliverableCards } from "@/components/sections/DeliverableCards";
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

        <DeliverableCards
          kicker={deliverablesKicker}
          headline={deliverablesHeadline}
          items={deliverables}
          band="white"
        />

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
