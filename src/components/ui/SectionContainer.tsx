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
      <div className={cn("mx-auto max-w-[1200px]", innerClassName)}>{children}</div>
    </Tag>
  );
}
