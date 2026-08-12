import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { CardList } from "@/components/sections/CardList";
import { NumberedDetails } from "@/components/sections/NumberedDetails";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { ProseSection } from "@/components/sections/ProseSection";
import { PageHero } from "@/components/ui/PageHero";
import {
  sprintAudienceHeadline,
  sprintAudienceItems,
  sprintAudienceKicker,
  sprintCadence,
  sprintClosing,
  sprintFaq,
  sprintHero,
  sprintHire,
  sprintInstalled,
  sprintInstalledHeadline,
  sprintInstalledKicker,
  sprintIntegrator,
  sprintMeta,
  sprintPricing,
} from "@/content/installationSprint";

export const metadata: Metadata = {
  title: sprintMeta.title,
  description: sprintMeta.description,
  alternates: { canonical: "/installations/sprint/" },
  openGraph: {
    title: sprintMeta.title,
    description: sprintMeta.description,
    url: "/installations/sprint/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: sprintMeta.title,
    description: sprintMeta.description,
  },
};

export default function RevenueOperationsSprintPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...sprintHero} />

        <ProseSection
          kicker={sprintHire.kicker}
          headline={sprintHire.headline}
          body={sprintHire.body}
          band="white"
        >
          {/* Same treatment as the Systems and Data Audit gate on /installations. */}
          <div className="border-tpg-accent mt-14 max-w-[900px] rounded-md border-l-[5px] bg-white pl-8">
            <h3 className="text-tpg-ink mb-2 font-serif text-[clamp(22px,2.6vw,29px)] leading-[1.15]">
              {sprintIntegrator.heading}
            </h3>
            {sprintIntegrator.body.map((paragraph) => (
              <p key={paragraph} className="text-tpg-body mt-4 text-[16.5px]">
                {paragraph}
              </p>
            ))}
          </div>
        </ProseSection>

        <ProseSection
          kicker={sprintCadence.kicker}
          headline={sprintCadence.headline}
          body={sprintCadence.body}
          band="tint"
        >
          <ul className="mt-9 grid max-w-[900px] gap-4">
            {sprintCadence.items.map((item) => (
              <li
                key={item}
                className="border-tpg-border border-l-tpg-cta text-tpg-body rounded-md border border-l-[5px] bg-white px-7 py-6 text-[16.5px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </ProseSection>

        <NumberedDetails
          kicker={sprintInstalledKicker}
          headline={sprintInstalledHeadline}
          items={sprintInstalled}
          band="white"
        />

        <CardList
          kicker={sprintAudienceKicker}
          headline={sprintAudienceHeadline}
          items={sprintAudienceItems}
          band="tint"
        />

        <PricingBlock price={sprintPricing.price} notes={sprintPricing.notes} band="white" />

        <Faq items={sprintFaq} />

        <BookingBlock headline={sprintClosing.headline} calendlyTitle={sprintClosing.ctaLabel} />
      </main>
      <Footer />
    </div>
  );
}
