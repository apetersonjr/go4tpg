import Script from "next/script";

const CALENDLY_WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Calendly renders inside an iframe and so cannot read our CSS variables;
 * these mirror the brand tokens in `globals.css` (--tpg-cta, --tpg-body).
 * Calendly expects hex without the leading `#`.
 */
const EMBED_PARAMS = new URLSearchParams({
  hide_gdpr_banner: "1",
  background_color: "ffffff",
  text_color: "3a4e5f",
  primary_color: "e8651f",
}).toString();

type CalendlyInlineProps = {
  /** Plain event URL, e.g. `https://calendly.com/user/20min`. */
  url: string;
  /** Embed height in px; the scheduler scrolls internally past it. */
  height?: number;
  /** Accessible name for the booking region. */
  title?: string;
};

/**
 * Calendly's inline scheduler, embedded from nothing but the event URL:
 * `widget.js` finds every `.calendly-inline-widget` on the page and swaps in
 * the scheduler iframe. The script carries no event handlers, so this stays a
 * server component, and `lazyOnload` runs it on browser idle — well after
 * hydration, so React never sees the injected iframe.
 */
export function CalendlyInline({
  url,
  height = 720,
  title = "Booking calendar",
}: CalendlyInlineProps) {
  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={`${url}?${EMBED_PARAMS}`}
        style={{ minWidth: 320, height }}
        role="region"
        aria-label={title}
      />
      <Script src={CALENDLY_WIDGET_SRC} strategy="lazyOnload" />
    </>
  );
}
