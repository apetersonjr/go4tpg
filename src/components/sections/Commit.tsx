import { BookingBlock } from "@/components/sections/BookingBlock";
import { commitBenefit, commitBody, commitDirective, commitSecond } from "@/content/commit";

/**
 * The homepage's closing section and booking point. Every CTA in the nav and
 * hero targets `#commit`, which this renders.
 */
export function Commit() {
  return (
    <BookingBlock
      headline={commitDirective}
      body={[commitBenefit, commitBody]}
      note={commitSecond}
    />
  );
}
