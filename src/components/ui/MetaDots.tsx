type MetaDotsProps = {
  /** A meta row joined with " · ", e.g. "One day · You leave with the Annual Blueprint". */
  text: string;
};

/**
 * A card meta row with its "·" separators in Action Orange. The separators
 * are split out only for colour; the rendered text is identical to the input.
 */
export function MetaDots({ text }: MetaDotsProps) {
  const parts = text.split(" · ");
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${index}-${part}`}>
          {index > 0 && <span className="text-tpg-cta"> · </span>}
          {part}
        </span>
      ))}
    </>
  );
}
