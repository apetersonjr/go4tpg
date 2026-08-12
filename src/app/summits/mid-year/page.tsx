import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { DeliverableCards } from "@/components/sections/DeliverableCards";
import { NumberedSteps } from "@/components/sections/NumberedSteps";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { ProseSection } from "@/components/sections/ProseSection";
import { PageHero } from "@/components/ui/PageHero";
import {
  midYearClosing,
  midYearDeliverables,
  midYearDeliverablesHeadline,
  midYearDeliverablesKicker,
  midYearFaq,
  midYearHero,
  midYearHowItWorksHeadline,
  midYearHowItWorksKicker,
  midYearHowItWorksSteps,
  midYearMeta,
  midYearPricing,
  midYearWhy,
} from "@/content/summitMidYear";

export const metadata: Metadata = {
  title: midYearMeta.title,
  description: midYearMeta.description,
  alternates: { canonical: "/summits/mid-year/" },
  openGraph: {
    title: midYearMeta.title,
    description: midYearMeta.description,
    url: "/summits/mid-year/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: midYearMeta.title,
    description: midYearMeta.description,
  },
};

export default function MidYearResetSummitPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...midYearHero} />

        <ProseSection
          kicker={midYearWhy.kicker}
          headline={midYearWhy.headline}
          body={midYearWhy.body}
          note={midYearWhy.note}
          band="white"
        />

        <DeliverableCards
          kicker={midYearDeliverablesKicker}
          headline={midYearDeliverablesHeadline}
          items={midYearDeliverables}
          band="tint"
        />

        <NumberedSteps
          kicker={midYearHowItWorksKicker}
          headline={midYearHowItWorksHeadline}
          steps={midYearHowItWorksSteps}
          band="white"
        />

        <PricingBlock price={midYearPricing.price} notes={midYearPricing.notes} band="tint" />

        <Faq items={midYearFaq} />

        <BookingBlock headline={midYearClosing.headline} calendlyTitle={midYearClosing.ctaLabel} />
      </main>
      <Footer />
    </div>
  );
}
