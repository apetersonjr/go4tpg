import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Small label above the headline. Empty renders nothing. */
  kicker?: string;
  headline: string;
  /**
   * Tighter gap below, for sections whose own prose follows immediately rather
   * than a grid of cards.
   *
   * This is a boolean rather than a `className` passthrough on purpose: `cn`
   * is a plain joiner, not tailwind-merge, so passing "mb-8" alongside the
   * default "mb-14" emits both and the winner is decided by stylesheet order,
   * not by the caller. One flag, one margin class, no ambiguity.
   */
  tight?: boolean;
};

/**
 * The kicker-plus-headline pair that opens almost every band on the site.
 * The child offer pages repeat it a dozen times over, so the type scale lives
 * here rather than being re-typed — and stays in step with the category pages.
 */
export function SectionHeading({ kicker, headline, tight = false }: SectionHeadingProps) {
  return (
    <>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2
        className={cn(
          "text-tpg-ink max-w-[820px] font-serif text-[clamp(30px,3.8vw,48px)] leading-[1.12]",
          tight ? "mb-8" : "mb-14",
        )}
      >
        {headline}
      </h2>
    </>
  );
}
