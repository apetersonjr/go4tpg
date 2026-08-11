import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cn } from "@/lib/cn";
import {
  comparisonColumns,
  comparisonHeadline,
  comparisonNote,
  comparisonRows,
  headcountReframe,
  serviceCards,
  servicesHero,
  servicesMeta,
  startHere,
} from "@/content/services";
import type { ServiceCard } from "@/content/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
  alternates: { canonical: "/services/" },
  openGraph: {
    title: servicesMeta.title,
    description: servicesMeta.description,
    url: "/services/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: servicesMeta.title,
    description: servicesMeta.description,
  },
};

const accentClassMap: Record<ServiceCard["accent"], string> = {
  primary: "border-t-tpg-primary",
  cta: "border-t-tpg-cta",
  accent: "border-t-tpg-accent",
};

/**
 * Routing and comparison hub. It exists to answer "what does TPG offer" and
 * send the reader onward — the offer detail lives on the category pages, and
 * the comparison table is the only pricing here by design.
 */
export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <SectionContainer as="header" className="bg-hero text-white" paddedY={false}>
          <div className="py-[clamp(64px,8vw,110px)]">
            <h1 className="max-w-[900px] font-serif text-[clamp(38px,5.4vw,68px)] leading-[1.12] font-normal tracking-[-0.01em]">
              {servicesHero.headline}
            </h1>
            <p className="mt-7 max-w-[680px] text-[clamp(17px,1.9vw,21px)] leading-[1.65] text-white/[0.82]">
              {servicesHero.subline}
            </p>
          </div>
        </SectionContainer>

        <SectionContainer className="bg-white">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px]">
            {serviceCards.map((card) => (
              <div
                key={card.title}
                className={cn(
                  "border-tpg-border flex flex-col rounded-md border border-t-[6px] bg-white px-[34px] py-10",
                  "transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(3,62,99,0.14)]",
                  accentClassMap[card.accent],
                )}
              >
                <h2 className="text-tpg-ink font-serif text-[27px] leading-[1.15]">{card.title}</h2>
                <p className="text-tpg-accent mt-2.5 mb-[18px] font-serif text-[17px] italic">
                  {card.whatYouBuy}
                </p>
                <p className="text-tpg-body grow text-[16.5px]">{card.description}</p>
                <p className="border-tpg-border text-tpg-primary my-[26px] border-t pt-[22px] text-[15px] font-bold">
                  {card.offers.join(" · ")}
                </p>
                <Link
                  href={card.href}
                  className="text-tpg-cta hover:text-tpg-cta-hover text-base font-bold"
                >
                  {card.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <h2 className="text-tpg-ink mb-12 max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {comparisonHeadline}
          </h2>
          <div className="border-tpg-border overflow-x-auto rounded-md border bg-white">
            <table className="w-full min-w-[900px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="bg-tpg-primary text-white">
                  {comparisonColumns.map((column) => (
                    <th key={column} className="px-5 py-[18px] font-bold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.offer} className="border-tpg-border border-t">
                    <th className="text-tpg-ink w-[20%] px-5 py-4 align-top font-bold">
                      {row.offer}
                    </th>
                    <td className="text-tpg-muted px-5 py-4 align-top">{row.category}</td>
                    <td className="text-tpg-body px-5 py-4 align-top">{row.duration}</td>
                    <td className="text-tpg-body px-5 py-4 align-top">{row.investment}</td>
                    <td className="text-tpg-body px-5 py-4 align-top">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-tpg-muted mt-7 max-w-[860px] text-[16px]">{comparisonNote}</p>
        </SectionContainer>

        <SectionContainer className="bg-white">
          <h2 className="text-tpg-ink mb-8 max-w-[900px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]">
            {headcountReframe.headline}
          </h2>
          <p className="text-tpg-body max-w-[860px] text-[17px]">{headcountReframe.body}</p>
          <p className="mt-9">
            <Link
              href={headcountReframe.ctaHref}
              className="text-tpg-cta hover:text-tpg-cta-hover text-[17px] font-bold"
            >
              {headcountReframe.ctaLabel}
            </Link>
          </p>
        </SectionContainer>

        <BookingBlock headline={startHere.directive} body={[startHere.body]} />
      </main>
      <Footer />
    </div>
  );
}
