import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { BerthForm } from "@/components/sections/BerthForm";
import { BookingBlock } from "@/components/sections/BookingBlock";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { charterNote, reserveHero, reserveMeta } from "@/content/reserve";

export const metadata: Metadata = {
  title: reserveMeta.title,
  description: reserveMeta.description,
  alternates: { canonical: "/retreats-coaching/reserve/" },
  openGraph: {
    title: reserveMeta.title,
    description: reserveMeta.description,
    url: "/retreats-coaching/reserve/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: reserveMeta.title,
    description: reserveMeta.description,
  },
};

export default function ReserveBerthPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        {/*
          No PageHero here: its CTA button would compete with the form that
          follows it, and the only action on this page is the form itself.
        */}
        <SectionContainer as="header" className="bg-hero text-white" paddedY={false}>
          <div className="py-[clamp(56px,7vw,92px)]">
            <Kicker color="sky">{reserveHero.kicker}</Kicker>
            <h1 className="max-w-[900px] font-serif text-[clamp(38px,5.4vw,68px)] leading-[1.12] font-normal tracking-[-0.01em]">
              {reserveHero.headline}
            </h1>
            <p className="mt-7 max-w-[680px] text-[clamp(17px,1.9vw,21px)] leading-[1.65] text-white/[0.82]">
              {reserveHero.lede}
            </p>
            <p className="mt-5 max-w-[680px] font-serif text-[clamp(17px,1.8vw,20px)] text-white italic">
              {reserveHero.intro}
            </p>
          </div>
        </SectionContainer>

        <SectionContainer className="bg-tpg-tint">
          <div className="border-tpg-border mx-auto max-w-[820px] rounded-md border bg-white px-[clamp(22px,4vw,52px)] py-[clamp(32px,4vw,56px)]">
            <BerthForm />
          </div>

          <div className="border-tpg-accent mx-auto mt-12 max-w-[820px] rounded-md border-l-[5px] bg-white py-1 pl-8">
            <h2 className="text-tpg-ink font-serif text-[23px] leading-[1.2]">
              {charterNote.headline}
            </h2>
            <p className="text-tpg-body mt-3 text-[16.5px]">{charterNote.body}</p>
          </div>
        </SectionContainer>

        <BookingBlock
          headline="Would rather talk it through first?"
          body={[
            "A berth request is a written application and Alan reads every one. If you would sooner ask a few questions before committing anything to writing, take twenty minutes with him instead.",
          ]}
          calendlyTitle="Book a discovery call"
        />
      </main>
      <Footer />
    </div>
  );
}
