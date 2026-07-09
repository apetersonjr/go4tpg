import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type KickerProps = {
  children: ReactNode;
  className?: string;
  /** `sky` is used on dark gradient bands (the commitment section). */
  color?: "accent" | "sky";
};

const colorClassMap: Record<NonNullable<KickerProps["color"]>, string> = {
  accent: "text-tpg-accent",
  sky: "text-tpg-sky",
};

/**
 * Small bold, wide-tracking uppercase label above section headlines
 * ("Three ways in. One commitment.", etc).
 */
export function Kicker({ children, className, color = "accent" }: KickerProps) {
  return (
    <div
      className={cn(
        "mb-[22px] text-[13px] font-bold tracking-[0.22em] uppercase",
        colorClassMap[color],
        className,
      )}
    >
      {children}
    </div>
  );
}
