"use client";

import { useEffect, useRef, useState } from "react";

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

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        inlineStyles?: boolean;
      }): void;
    };
  }
}

/**
 * One in-flight load shared by every embed on the page and across navigations.
 * Cleared on failure so a later mount can retry rather than inheriting a
 * permanently rejected promise.
 */
let scriptPromise: Promise<void> | null = null;

function loadWidgetScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CALENDLY_WIDGET_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("Calendly widget script failed to load"));
    });
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/** Runs `task` at the first idle moment, with a plain timeout where rIC is absent. */
function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(task, { timeout: 2000 });
    return () => window.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(task, 200);
  return () => window.clearTimeout(handle);
}

type CalendlyInlineProps = {
  /** Plain event URL, e.g. `https://calendly.com/user/20min`. */
  url: string;
  /** Embed height in px; the scheduler scrolls internally past it. */
  height?: number;
  /** Accessible name for the booking region. */
  title?: string;
};

/**
 * Calendly's inline scheduler.
 *
 * This used to be a server component that dropped a `.calendly-inline-widget`
 * div next to `<Script strategy="lazyOnload">` and let `widget.js` find it.
 * That works exactly once per browser session and no more:
 *
 *  - `widget.js` sweeps for `.calendly-inline-widget` a single time, as it
 *    evaluates. It registers no MutationObserver and never re-scans.
 *  - `next/script` keeps a module-level `LoadCache` and returns early for any
 *    src it has already loaded, so mounting the component again does not
 *    re-execute the script.
 *
 * So a hard load rendered the scheduler, and every client-side navigation
 * after it rendered an empty box — leaving the "open in a new tab" fallback as
 * the only working path. With a booking block now on ten pages and a nav that
 * links between all of them, that was most page views.
 *
 * The fix is to stop depending on the sweep. `data-auto-load="false"` opts this
 * node out of it explicitly, and the effect calls `initInlineWidget` itself on
 * every mount — identical behaviour on first paint and on the tenth navigation.
 * The script still loads lazily, at the first idle moment after mount, so it
 * never competes with hydration.
 */
export function CalendlyInline({
  url,
  height = 720,
  title = "Booking calendar",
}: CalendlyInlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"pending" | "ready" | "failed">("pending");

  useEffect(() => {
    let cancelled = false;

    const cancelIdle = whenIdle(() => {
      loadWidgetScript()
        .then(() => {
          const container = containerRef.current;
          if (cancelled || !container || !window.Calendly) return;
          // Effects run twice under React StrictMode in development, and a
          // second inject would stack a duplicate iframe. React owns no
          // children here, so clearing them is safe.
          container.replaceChildren();
          window.Calendly.initInlineWidget({
            url: `${url}?${EMBED_PARAMS}`,
            parentElement: container,
            inlineStyles: true,
          });
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("failed");
        });
    });

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [url]);

  return (
    <div className="relative" style={{ minWidth: 320, height }}>
      <div
        ref={containerRef}
        className="calendly-inline-widget h-full w-full"
        data-auto-load="false"
        role="region"
        aria-label={title}
      />
      {status !== "ready" && (
        <div className="text-tpg-muted absolute inset-0 flex items-center justify-center px-6 text-center text-[15px]">
          {status === "pending" ? (
            <span>Loading the scheduler…</span>
          ) : (
            <span>
              The scheduler could not load — it may be blocked by a browser extension or network
              policy. Use the link below to open it directly.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
