import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { OfferDetail } from "@/components/sections/OfferDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/ui/PageHero";
import { PricingTiers } from "@/components/ui/PricingTiers";
import { SectionContainer } from "@/components/ui/SectionContainer";
import {
  lighthouseAddOn,
  lighthouseTiers,
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
              <PricingTiers tiers={retreatTiers} note={retreatTiersNote} />
            </OfferDetail>

            <OfferDetail offering={retreatOfferings[1]}>
              <PricingTiers tiers={lighthouseTiers} note={lighthouseAddOn} />
            </OfferDetail>
          </div>
        </SectionContainer>

        <ClosingCta {...servicesClosing} />
      </main>
      <Footer />
    </div>
  );
}
