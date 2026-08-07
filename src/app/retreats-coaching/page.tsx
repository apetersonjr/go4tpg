import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/ui/PageHero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import {
  retreatOfferings,
  retreatTiers,
  retreatTiersNote,
  retreatsHero,
  retreatsMeta,
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

export default function RetreatsCoachingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...retreatsHero} />

        <SectionContainer className="bg-tpg-tint">
          <div className="grid gap-[26px]">
            <OfferDetail offering={retreatOfferings[0]}>
              <div className="border-tpg-border mt-9 overflow-hidden rounded-md border">
                <ul className="bg-tpg-border grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px">
                  {retreatTiers.map((tier) => (
                    <li key={tier.name} className="bg-white px-6 py-7">
                      <span className="text-tpg-primary block font-serif text-[21px] leading-[1.2]">
                        {tier.name}
                      </span>
                      {tier.detail && (
                        <span className="text-tpg-muted mt-2 block text-[14.5px]">
                          {tier.detail}
                        </span>
                      )}
                      {tier.price && (
                        <span className="text-tpg-ink mt-3 block font-serif text-2xl">
                          {tier.price}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-tpg-muted mt-5 max-w-[860px] text-[16px]">{retreatTiersNote}</p>
            </OfferDetail>

            <OfferDetail offering={retreatOfferings[1]} />
          </div>
        </SectionContainer>

        <ClosingCta {...servicesClosing} />
      </main>
      <Footer />
    </div>
  );
}
