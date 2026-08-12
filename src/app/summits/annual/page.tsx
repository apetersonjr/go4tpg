import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { CardList } from "@/components/sections/CardList";
import { DeliverableCards } from "@/components/sections/DeliverableCards";
import { NumberedSteps } from "@/components/sections/NumberedSteps";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { PageHero } from "@/components/ui/PageHero";
import {
  annualAudienceHeadline,
  annualAudienceItems,
  annualAudienceKicker,
  annualClosing,
  annualDeliverables,
  annualDeliverablesHeadline,
  annualDeliverablesKicker,
  annualFaq,
  annualHero,
  annualHowItWorksHeadline,
  annualHowItWorksKicker,
  annualHowItWorksSteps,
  annualMeta,
  annualPricing,
} from "@/content/summitAnnual";

export const metadata: Metadata = {
  title: annualMeta.title,
  description: annualMeta.description,
  alternates: { canonical: "/summits/annual/" },
  openGraph: {
    title: annualMeta.title,
    description: annualMeta.description,
    url: "/summits/annual/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: annualMeta.title,
    description: annualMeta.description,
  },
};

export default function AnnualPlanningSummitPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...annualHero} />

        <DeliverableCards
          kicker={annualDeliverablesKicker}
          headline={annualDeliverablesHeadline}
          items={annualDeliverables}
          band="white"
        />

        <NumberedSteps
          kicker={annualHowItWorksKicker}
          headline={annualHowItWorksHeadline}
          steps={annualHowItWorksSteps}
          band="tint"
        />

        <CardList
          kicker={annualAudienceKicker}
          headline={annualAudienceHeadline}
          items={annualAudienceItems}
          band="white"
        />

        <PricingBlock price={annualPricing.price} notes={annualPricing.notes} band="tint" />

        <Faq items={annualFaq} />

        <BookingBlock headline={annualClosing.headline} calendlyTitle={annualClosing.ctaLabel} />
      </main>
      <Footer />
    </div>
  );
}
