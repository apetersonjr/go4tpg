import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Faq } from "@/components/sections/Faq";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { cardHover } from "@/lib/motion";
import {
  audienceHeadline,
  audienceItems,
  audienceKicker,
  chooserHeadline,
  chooserSubline,
  howItWorksHeadline,
  howItWorksSteps,
  howItWorksSubline,
  includes,
  includesHeadline,
  summitChoices,
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

/**
 * Chooser-first category page. The reader arrives, learns what a Planning
 * Summit is in one paragraph, and picks the Summit that fits the moment. The
 * offer detail lives on the three child pages; this page only routes to them.
 */
export default function SummitsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <SectionContainer as="header" className="bg-hero text-white" paddedY={false}>
          <div className="py-[clamp(64px,8vw,110px)]">
            <Kicker color="sky">{summitsHero.kicker}</Kicker>
            <h1 className="max-w-[960px] font-serif text-[clamp(38px,5.4vw,68px)] leading-[1.12] font-normal tracking-[-0.01em]">
              {summitsHero.headline.lead}
              <span className="text-tpg-sky italic">{summitsHero.headline.emphasis}</span>
            </h1>
            <p className="mt-7 max-w-[760px] text-[clamp(17px,1.9vw,21px)] leading-[1.65] text-white/[0.82]">
              {summitsHero.definition}
            </p>
            {/* The three-second router: one chip per Summit, straight to its page. */}
            <ul className="mt-9 flex flex-wrap gap-3">
              {summitsHero.chips.map((chip) => (
                <li key={chip.href}>
                  <Link
                    href={chip.href}
                    className="inline-block rounded-full border border-white/45 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SectionContainer>

        {/* Section 2 — the chooser */}
        <SectionContainer className="bg-white">
          <SectionHeading headline={chooserHeadline} tight />
          <p className="text-tpg-muted mb-12 max-w-[760px] text-[18px]">{chooserSubline}</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
            {summitChoices.map((choice) => (
              <article
                key={choice.id}
                id={choice.id}
                className={cn(
                  "border-tpg-border border-t-tpg-primary flex flex-col rounded-md border border-t-[6px] bg-white px-[34px] py-10",
                  cardHover,
                )}
              >
                {/*
                  Fixed height on the kicker row so every Summit name sits on
                  the same line across the three cards, badge or no badge.
                */}
                <div
                  className={cn(
                    "flex h-6 items-center gap-2.5 text-[12.5px] font-bold tracking-[0.2em] whitespace-nowrap uppercase",
                    choice.badge ? "text-tpg-cta" : "text-tpg-accent",
                  )}
                >
                  <span>{choice.kicker}</span>
                  {choice.badge && (
                    <span className="bg-tpg-cta rounded-full px-2.5 py-0.5 text-[11px] tracking-[0.12em] text-white">
                      {choice.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-tpg-ink mt-4 font-serif text-[27px] leading-[1.15]">
                  {choice.title}
                </h3>
                <p className="text-tpg-accent mt-3 font-serif text-[17px] italic">
                  {choice.tagline}
                </p>
                <p className="text-tpg-muted mt-4 text-[14.5px]">{choice.meta}</p>
                <p className="text-tpg-ink mt-6 font-serif text-[36px] leading-none">
                  {choice.price}
                </p>
                <p className="text-tpg-muted mt-3 grow text-[15px]">{choice.credit}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Button href={choice.bookHref} className="px-8 py-[14px] text-[16px]">
                    Book It
                  </Button>
                  <Link
                    href={choice.detailHref}
                    className="text-tpg-primary hover:text-tpg-primary-dark text-[15.5px] font-bold underline decoration-2 underline-offset-4 transition-colors"
                  >
                    Full details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SectionContainer>

        {/* Section 3 — every summit includes */}
        <SectionContainer className="bg-tpg-tint">
          <SectionHeading headline={includesHeadline} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
            {includes.map((item) => (
              <div
                key={item.title}
                className={cn(
                  "border-tpg-border rounded-md border border-t-[6px] bg-white px-7 py-8",
                  item.featured ? "border-t-tpg-cta" : "border-t-tpg-primary",
                  cardHover,
                )}
              >
                <h3 className="text-tpg-ink font-serif text-[22px] leading-[1.15]">{item.title}</h3>
                <p className="text-tpg-body mt-4 text-[16px]">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionContainer>

        {/* Section 4 — how our summits work: five compact cards on one desktop line */}
        <SectionContainer className="bg-white">
          <SectionHeading headline={howItWorksHeadline} tight />
          <p className="text-tpg-accent mb-12 max-w-[760px] font-serif text-[19px] italic">
            {howItWorksSubline}
          </p>
          <ol className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {howItWorksSteps.map((step, index) => (
              <li
                key={step.lead}
                className={cn("border-tpg-border rounded-md border bg-white px-6 py-7", cardHover)}
              >
                <span
                  aria-hidden="true"
                  className="text-tpg-accent block font-serif text-[34px] leading-none"
                >
                  {index + 1}
                </span>
                <p className="text-tpg-body mt-3 text-[15px]">
                  <strong className="text-tpg-ink">{step.lead}</strong>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </SectionContainer>

        {/* Section 5 — who this is for (unchanged) */}
        <SectionContainer className="bg-tpg-tint">
          <Kicker>{audienceKicker}</Kicker>
          <h2 className="text-tpg-ink mb-12 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {audienceHeadline}
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
            {audienceItems.map((item) => (
              <li
                key={item}
                className={cn(
                  "border-tpg-border text-tpg-body rounded-md border bg-white px-8 py-[30px] text-[17px]",
                  cardHover,
                )}
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
