"use client";

import { useEffect, useRef, useState } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { NumberedBadge } from "@/components/ui/NumberedBadge";
import {
  heroEyebrow,
  heroHeadlines,
  heroInstallList,
  heroInstallPanelEyebrow,
  heroInstallPanelTitle,
  heroRotationSeconds,
  heroSupportingCopy,
} from "@/content/hero";

const FADE_MS = 780;

export function Hero() {
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLHeadingElement>(null);

  // Rotate to the next headline every `heroRotationSeconds`, pausing longer
  // on taller headlines so they stay readable (mirrors the reference
  // design's per-slide dwell adjustment).
  useEffect(() => {
    const activeEl = activeRef.current;
    const isTall = (activeEl?.offsetHeight ?? 0) > 110;
    const dwellMs = heroRotationSeconds * 1000 + (isTall ? 2000 : 0);

    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % heroHeadlines.length);
    }, dwellMs);

    return () => clearTimeout(timer);
  }, [index]);

  // Keep the wrapper's min-height in sync with the currently visible
  // headline so the crossfade never causes a layout jump.
  useEffect(() => {
    const wrap = wrapRef.current;
    const activeEl = activeRef.current;
    if (wrap && activeEl) {
      wrap.style.minHeight = `${activeEl.offsetHeight}px`;
    }

    const onResize = () => {
      if (wrap && activeEl) {
        wrap.style.minHeight = `${activeEl.offsetHeight}px`;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  const headline = heroHeadlines[index];

  return (
    <SectionContainer
      as="section"
      innerClassName="grid grid-cols-1 items-center gap-12 py-16 md:py-[92px] lg:grid-cols-[1.28fr_1fr] lg:gap-[60px]"
    >
      <div>
        <EyebrowLabel className="mb-7">{heroEyebrow}</EyebrowLabel>

        <div
          ref={wrapRef}
          className="relative"
          style={{ transition: `min-height ${FADE_MS * 0.7}ms cubic-bezier(0.4,0,0.2,1)` }}
        >
          <h1
            key={index}
            ref={activeRef}
            className="text-tpg-navy font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] sm:text-[40px] lg:text-[clamp(28px,4vw,52px)]"
            style={{
              animation: `tpg-hero-fade ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
            }}
          >
            {headline.lead}{" "}
            <em className="text-tpg-blue font-medium italic">{headline.emphasis}</em>
          </h1>
        </div>

        <p className="text-tpg-muted-soft mt-6 max-w-[540px] text-[17.5px] leading-[1.68]">
          {heroSupportingCopy}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Button href="#contact" variant="cta">
            Book a Strategy Call
          </Button>
          <Button href="#offers" variant="text-navy">
            See how it works →
          </Button>
        </div>
      </div>

      <div className="border-tpg-border-strong rounded-[10px] border bg-[#fbfcfe] p-8 shadow-[0_14px_40px_-22px_rgba(15,44,76,0.28)]">
        <div className="text-tpg-navy mb-1 font-serif text-xl leading-[1.25] font-medium">
          {heroInstallPanelTitle}
        </div>
        <div className="text-tpg-subtle mb-6 font-mono text-[11px] tracking-[0.5px]">
          {heroInstallPanelEyebrow}
        </div>
        <ul className="flex flex-col gap-4">
          {heroInstallList.map((item, i) => (
            <li key={item} className="flex items-start gap-3.5">
              <NumberedBadge number={i + 1} />
              <span className="text-tpg-muted text-[15px] leading-[1.5]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes tpg-hero-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </SectionContainer>
  );
}
