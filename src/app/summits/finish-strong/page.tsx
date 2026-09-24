import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLabel } from "@/components/ui/ArrowLabel";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { DeliverableCards } from "@/components/sections/DeliverableCards";
import { NumberedSteps } from "@/components/sections/NumberedSteps";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { ProseSection } from "@/components/sections/ProseSection";
import { SummitHero } from "@/components/ui/SummitHero";
import {
  finishStrongClosing,
  finishStrongDeliverables,
  finishStrongDeliverablesHeadline,
  finishStrongDeliverablesKicker,
  finishStrongFaq,
  finishStrongHero,
  finishStrongHowItWorksHeadline,
  finishStrongHowItWorksKicker,
  finishStrongHowItWorksSteps,
  finishStrongMeta,
  finishStrongOnRamp,
  finishStrongPricing,
  finishStrongWhy,
} from "@/content/summitFinishStrong";

export const metadata: Metadata = {
  title: finishStrongMeta.title,
  description: finishStrongMeta.description,
  alternates: { canonical: "/summits/finish-strong/" },
  openGraph: {
    title: finishStrongMeta.title,
    description: finishStrongMeta.description,
    url: "/summits/finish-strong/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: finishStrongMeta.title,
    description: finishStrongMeta.description,
  },
};

export default function FinishStrongResetPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <SummitHero {...finishStrongHero} />

        <ProseSection
          kicker={finishStrongWhy.kicker}
          headline={finishStrongWhy.headline}
          body={finishStrongWhy.body}
          note={finishStrongWhy.note}
          band="white"
        />

        <DeliverableCards
          kicker={finishStrongDeliverablesKicker}
          headline={finishStrongDeliverablesHeadline}
          items={finishStrongDeliverables}
          band="tint"
        />

        <NumberedSteps
          kicker={finishStrongHowItWorksKicker}
          headline={finishStrongHowItWorksHeadline}
          steps={finishStrongHowItWorksSteps}
          band="white"
        />

        <ProseSection
          kicker={finishStrongOnRamp.kicker}
          headline={finishStrongOnRamp.headline}
          body={finishStrongOnRamp.body}
          band="tint"
        >
          <p className="mt-8">
            <Link
              href={finishStrongOnRamp.linkHref}
              className="text-tpg-cta hover:text-tpg-cta-hover text-[17px] font-bold"
            >
              <ArrowLabel label={finishStrongOnRamp.linkLabel} />
            </Link>
          </p>
        </ProseSection>

        <PricingBlock
          price={finishStrongPricing.price}
          notes={finishStrongPricing.notes}
          band="white"
        />

        <Faq items={finishStrongFaq} />

        <BookingBlock
          headline={finishStrongClosing.headline}
          calendlyTitle={finishStrongClosing.ctaLabel}
        />
      </main>
      <Footer />
    </div>
  );
}
