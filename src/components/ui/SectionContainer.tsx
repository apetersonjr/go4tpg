import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionContainerProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Extra classes on the inner max-width wrapper. */
  innerClassName?: string;
  /** Set false for bands with their own vertical rhythm (nav, hero, footer). */
  paddedY?: boolean;
  as?: "section" | "div" | "header" | "footer";
};

/**
 * Shared section wrapper mirroring the reference design's `.wrap` rule:
 * 1200px max width, fluid side padding `clamp(24px, 5vw, 64px)`, and
 * fluid vertical section padding `clamp(72px, 9vw, 128px)`.
 */
export function SectionContainer({
  id,
  children,
  className,
  innerClassName,
  paddedY = true,
  as = "section",
}: SectionContainerProps) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={cn(
        "px-[clamp(24px,5vw,64px)]",
        paddedY && "py-[clamp(72px,9vw,128px)]",
        className,
      )}
    >
      {/*
        `SectionReveal` fades this up on arrival. It is deliberately the inner
        wrapper rather than the section itself: the section carries the id an
        anchor lands on, and `scroll-margin-top` is measured against its own
        box, so putting a 12px transform on it would land every `#commit`-style
        jump 12px high and then slide the content out from under the reader.
        The band stays put; what moves is what is written on it.
      */}
      <div data-reveal="" className={cn("mx-auto max-w-[1200px]", innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}
