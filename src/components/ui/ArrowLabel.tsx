type ArrowLabelProps = {
  /** Link text containing a "→", e.g. "See the Summits →" or "The year has drifted → Mid-Year". */
  label: string;
  /**
   * Set the text after the arrow in the warm tint, bold. Used by the /summits
   * hero chips, where that text is the Summit's short name.
   */
  warmTail?: boolean;
};

/**
 * Renders a label whose arrow lives in its own inline element, so the hover
 * nudge (`.arrow` in globals.css) slides the glyph without reflowing the words
 * around it. The rendered text is identical to the label passed in.
 */
export function ArrowLabel({ label, warmTail = false }: ArrowLabelProps) {
  const at = label.indexOf("→");
  if (at === -1) {
    return <>{label}</>;
  }
  const before = label.slice(0, at).trimEnd();
  const after = label.slice(at + 1).trimStart();
  return (
    <>
      {before}
      {before && " "}
      <span className="arrow" aria-hidden="true">
        →
      </span>
      {after && " "}
      {after && (warmTail ? <span className="text-tpg-warm font-bold">{after}</span> : after)}
    </>
  );
}
