type PriceProps = {
  /** A display figure such as "$4,750" or "$1,500/month". */
  value: string;
  className?: string;
};

/**
 * A large price figure with its currency symbol set small and top-aligned.
 *
 * The "$" moves into its own element so `.price-currency` in globals.css can
 * size it at 60% of the numerals; the text content is unchanged. Only the
 * large-figure sites use this — a price inside a sentence is left alone.
 */
export function Price({ value, className }: PriceProps) {
  if (!value.startsWith("$")) {
    return <span className={className}>{value}</span>;
  }
  return (
    <span className={className}>
      <span className="price-currency">$</span>
      {value.slice(1)}
    </span>
  );
}
