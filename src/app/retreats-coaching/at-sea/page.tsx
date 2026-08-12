import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { CardList } from "@/components/sections/CardList";
import { PricingBlock } from "@/components/sections/PricingBlock";
import { ProseSection } from "@/components/sections/ProseSection";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { PricingTiers } from "@/components/ui/PricingTiers";
import {
  atSeaCalendar,
  atSeaCharterNote,
  atSeaClosing,
  atSeaFaq,
  atSeaHero,
  atSeaMeta,
  atSeaPricingNotes,
  atSeaSibling,
  atSeaTiers,
  atSeaWeek,
  atSeaWhatItIs,
  atSeaWhatYouBring,
  atSeaWhatYouLeaveWith,
  reserveHref,
  reserveLabel,
} from "@/content/retreatAtSea";

export const metadata: Metadata = {
  title: atSeaMeta.title,
  description: atSeaMeta.description,
  alternates: { canonical: "/retreats-coaching/at-sea/" },
  openGraph: {
    title: atSeaMeta.title,
    description: atSeaMeta.description,
    url: "/retreats-coaching/at-sea/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: atSeaMeta.title,
    description: atSeaMeta.description,
  },
};

export default function StrategyBlueprintAtSeaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero {...atSeaHero} />

        <ProseSection
          kicker={atSeaWhatItIs.kicker}
          headline={atSeaWhatItIs.headline}
          body={atSeaWhatItIs.body}
          band="white"
        />

        <CardList
          kicker={atSeaWhatYouBring.kicker}
          headline={atSeaWhatYouBring.headline}
          body={atSeaWhatYouBring.body}
          items={atSeaWhatYouBring.items}
          band="tint"
        />

        <CardList
          headline={atSeaWhatYouLeaveWith.headline}
          items={atSeaWhatYouLeaveWith.items}
          band="white"
        />

        <ProseSection kicker={atSeaWeek.kicker} headline={atSeaWeek.headline} band="tint">
          <ul className="mt-2 grid max-w-[900px] gap-4">
            {atSeaWeek.items.map((item) => (
              <li
                key={item}
                className="border-tpg-border border-l-tpg-primary text-tpg-body rounded-md border border-l-[5px] bg-white px-7 py-6 text-[16.5px]"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="text-tpg-body mt-9 max-w-[860px] text-[17px]">
            <strong className="text-tpg-ink font-bold">{atSeaWeek.whoHeading}</strong>{" "}
            {atSeaWeek.whoBody}
          </p>
        </ProseSection>

        <ProseSection
          kicker={atSeaCalendar.kicker}
          headline={atSeaCalendar.headline}
          body={atSeaCalendar.body}
          band="white"
        >
          <p className="mt-9">
            <Button href={reserveHref}>{reserveLabel}</Button>
          </p>
        </ProseSection>

        <PricingBlock notes={atSeaPricingNotes} band="tint">
          <PricingTiers tiers={atSeaTiers} note={atSeaCharterNote} />
        </PricingBlock>

        <ProseSection
          kicker={atSeaSibling.kicker}
          headline={atSeaSibling.headline}
          body={atSeaSibling.body}
          band="white"
        >
          <p className="mt-8">
            <Link
              href={atSeaSibling.linkHref}
              className="text-tpg-primary hover:text-tpg-primary-dark text-[16px] font-bold underline decoration-2 underline-offset-4 transition-colors"
            >
              {atSeaSibling.linkLabel} →
            </Link>
          </p>
        </ProseSection>

        <Faq items={atSeaFaq} />

        <BookingBlock
          headline={atSeaClosing.headline}
          cta={{ label: reserveLabel, href: reserveHref }}
          calendlyTitle="Book a discovery call"
        />
      </main>
      <Footer />
    </div>
  );
}
