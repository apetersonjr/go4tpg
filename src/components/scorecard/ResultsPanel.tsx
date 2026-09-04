"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { commitCalendlyUrl } from "@/content/commit";
import { brochures } from "@/content/installations";
import {
  bookLabel,
  brochureLabel,
  recommendationInstallsLabel,
  recommendationProblemLabel,
  recommendationProducesLabel,
  restartAriaLabel,
  restartLabel,
  resultsEmailed,
  resultsHeardEyebrow,
  resultsInstallEyebrow,
  resultsNotEmailed,
} from "@/content/scorecard";
import { findInstallation } from "@/data/installation-menu";
import { withBasePath } from "@/lib/basePath";
import type { ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The brochure the results screen offers. Deliberately looked up from the same
 * content module `/installations` renders from rather than hard-coded, so the
 * two can never end up offering different PDFs.
 */
const brochure = brochures.find((entry) => entry.downloadAs) ?? brochures.at(-1);

const eyebrowClass = "text-[11px] font-bold tracking-[0.16em] uppercase";

/** The label above each of a recommendation's three parts. */
const partLabelClass = "text-tpg-muted/70 text-[10px] font-bold tracking-[0.1em] uppercase";

/**
 * Whether a collapsed card carries a one-line taste of its payoff.
 *
 * On, a card reads as "here is what you get" before it is opened, which is
 * what makes a list of five closed cards worth opening. Off, the collapsed
 * list is bare name and section — quieter, and a legitimate preference if the
 * teaser reads as clutter at five entries.
 *
 * Deliberately a constant rather than a prop: it is one editorial decision for
 * the whole screen, and flipping it is a one-word edit here.
 */
const SHOW_PAYOFF_TEASER = true;

type ResultsPanelProps = {
  summary: string;
  recommendations: ScorecardRecommendation[];
  /** Whether the emailed copy actually went out. Decides the confirmation line. */
  emailed: boolean;
  onRestart: () => void;
};

/** One of the three parts, with its label. Absent parts render nothing. */
function Part({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className={partLabelClass}>{label}</span>
      <span className="text-tpg-muted text-[12.5px] leading-relaxed">{text}</span>
    </div>
  );
}

/**
 * One recommendation, collapsed until asked for.
 *
 * WHY COLLAPSED BY DEFAULT. Five recommendations expanded is roughly two
 * screens of prose in a 380px panel, and the shortlist — which installation,
 * in what order — is the thing the reader is actually scanning for. Closed
 * cards put the whole list on one screen and let the detail be pulled rather
 * than pushed.
 *
 * Every card owns its own open state, so several can be open at once. That is
 * the point: someone deciding between two installations needs both sets of
 * detail visible simultaneously, and an accordion that closes one to open
 * another actively fights that.
 *
 * The animation lives in `globals.css` under `.sc-card-*` — see the note there
 * on why the height transition is a grid row and not a max-height.
 */
function RecommendationCard({
  entry,
  number,
  position,
}: {
  entry: ScorecardRecommendation;
  number: string;
  position: number;
}) {
  const [open, setOpen] = useState(false);
  /**
   * Whether the panel's content is in the DOM at all.
   *
   * This trails `open` rather than mirroring it, and the gap is the closing
   * animation. `hidden` is not animatable — the moment it is set the content
   * is gone — so applying it on the same tick as `open` would make the card
   * snap shut with no fade while the row below it animated politely, which
   * looks worse than no animation at all.
   *
   * So: opening reveals immediately and animates; closing animates first and
   * hides when the transition ends. `onTransitionEnd` on the row is the
   * signal, and it is honest under reduced motion too, where the transition is
   * removed and the event never fires — hence the `matchMedia` shortcut below.
   */
  const [mounted, setMounted] = useState(false);

  /*
   * Ids for the `aria-controls` / `aria-labelledby` pair. `useId` rather than
   * the installation id because the widget could in principle mount twice on a
   * page, and duplicate ids would silently point one card's header at another
   * card's panel.
   */
  const reactId = useId();
  const headerId = `${reactId}-header`;
  const panelId = `${reactId}-panel`;

  function toggle() {
    const next = !open;
    setOpen(next);

    // Opening: the content has to exist before the row can animate to reveal
    // it. Closing under reduced motion: no transition will fire, so hide now
    // rather than waiting for an event that never arrives.
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (next) setMounted(true);
    else if (reduced) setMounted(false);
  }

  return (
    <div
      className="sc-step-in border-tpg-border overflow-hidden rounded-md border"
      /*
       * Staggered so the shortlist arrives as a list being read out rather
       * than as a block appearing at once. Capped at five entries by the
       * schema, so the last one is never more than 280ms behind the first.
       */
      style={{ animationDelay: `${position * 70}ms` }}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        /*
         * The whole header is the target, not the chevron. A 14px glyph is an
         * unreasonable thing to ask someone to hit on a phone, and a card that
         * only opens from its far corner reads as broken before it reads as
         * precise.
         *
         * `text-left` because a button centers its text by default and this one
         * contains a paragraph's worth of content.
         *
         * Enter and Space come free with a real <button>; nothing here
         * re-implements them, which is the whole reason this is not a div.
         */
        className="hover:bg-tpg-tint/60 focus-visible:ring-tpg-primary/35 flex w-full cursor-pointer items-start gap-3 px-3.5 py-3 text-left transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <span className="text-tpg-primary w-6 flex-none font-serif text-[15px] leading-snug">
          {number}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-tpg-ink font-serif text-[14.5px] leading-snug font-semibold">
            {entry.name}
          </span>
          {entry.bucket && (
            <span className="text-tpg-muted/80 text-[11px] font-semibold tracking-[0.08em] uppercase">
              {entry.bucket}
            </span>
          )}
          {/*
           * The teaser. `truncate` needs the `min-w-0` on this column to have
           * anything to clip against — a flex child defaults to its content
           * width and would push the card wider rather than ellipsing.
           *
           * Hidden from screen readers because the full `produces` line is
           * read out inside the panel; announcing a truncated copy of it as
           * well would have the reader hear the same sentence twice, once cut
           * off mid-clause.
           */}
          {SHOW_PAYOFF_TEASER && entry.produces && !open && (
            <span aria-hidden="true" className="text-tpg-muted/90 truncate pt-0.5 text-[12px]">
              {entry.produces}
            </span>
          )}
        </span>

        {/*
         * Chevron. Muted slate, never the accent — it is an affordance, not a
         * thing to look at. `aria-hidden` because `aria-expanded` on the
         * button already carries the state; a described icon would announce it
         * a second time.
         */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="sc-card-chevron text-tpg-muted mt-0.5 h-4 w-4 flex-none"
          data-open={open}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {/*
       * The animating row. `data-open` drives the CSS rather than a class so
       * the open state is inspectable in the DOM, which is what the browser
       * test asserts against.
       */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="sc-card-panel"
        data-open={open}
        /*
         * Hide the content once the closing animation has actually finished.
         * Guarded on the property because the opacity transition on the inner
         * wrapper bubbles up here too and fires earlier — acting on that one
         * would cut the row's own animation short.
         */
        onTransitionEnd={(event) => {
          if (event.propertyName !== "grid-template-rows") return;
          if (!open) setMounted(false);
        }}
      >
        <div className="sc-card-panel-inner">
          {/*
           * `hidden` while collapsed, so the content is genuinely gone from
           * the accessibility tree rather than merely clipped to zero height.
           * A screen reader will happily read text inside a `0fr` grid row and
           * a keyboard will happily tab into a link there — clipping is a
           * visual effect, not a semantic one.
           *
           * Deliberately plain `hidden` rather than `until-found`. The latter
           * lets find-in-page reveal the element, but it reveals only THIS
           * node: the grid row above it stays at `0fr` and React's state stays
           * false, so the match would be un-hidden inside a container that is
           * still collapsed — findable, invisible, and with the chevron
           * pointing the wrong way. Opening a card is this component's
           * decision to make.
           */}
          <div hidden={!mounted} className="flex flex-col gap-2 px-3.5 pt-0.5 pb-3.5 pl-[3.125rem]">
            <Part label={recommendationProblemLabel} text={entry.problem} />
            <Part label={recommendationInstallsLabel} text={entry.installs} />
            <Part label={recommendationProducesLabel} text={entry.produces} />

            {/*
             * V2 slot. `diagram` is null on every catalog entry today, so this
             * renders nothing; when the nineteen diagrams exist they appear
             * here with no schema change.
             */}
            {entry.diagram && (
              <Image
                // next/image does not prefix `src` with basePath, so the
                // helper does it — same as everywhere else on the site.
                src={withBasePath(entry.diagram)}
                alt={`How the ${entry.name} installation works`}
                width={320}
                height={180}
                className="border-tpg-border mt-1.5 h-auto w-full rounded-md border"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * What we heard, what we would install, and what to do next.
 *
 * Every recommendation shows all three parts: the problem, what gets
 * installed, what it produces. Naming the pain and stopping there was the
 * failure the client called out — the server drops any recommendation missing
 * a part before it reaches this component, so a rendered entry is a complete
 * one by construction.
 *
 * No prices anywhere on this screen — per-unit pricing is quoted in writing,
 * and a number here would be the one place on the site that breaks that.
 */
export function ResultsPanel({ summary, recommendations, emailed, onRestart }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
      <div className="flex flex-col gap-2">
        <span className={`text-tpg-accent ${eyebrowClass}`}>{resultsHeardEyebrow}</span>
        <p className="text-tpg-muted text-[13.5px] leading-relaxed">{summary}</p>
      </div>

      {/*
       * `gap-2` rather than the old `gap-4`: the cards now carry their own
       * border and padding, so the space between them is a seam between two
       * surfaces rather than the only thing separating two runs of text.
       */}
      <div className="border-tpg-border flex flex-col gap-2 border-t pt-4">
        <span className={`text-tpg-muted ${eyebrowClass} pb-1`}>{resultsInstallEyebrow}</span>
        {recommendations.map((entry, position) => {
          // The number comes from the catalog, not from the model — it is the
          // brochure's stable id and the model is never asked for it.
          const installation = findInstallation(entry.installationId);
          const number = installation ? String(installation.number).padStart(2, "0") : "";

          return (
            <RecommendationCard
              key={entry.installationId}
              entry={entry}
              number={number}
              position={position}
            />
          );
        })}
      </div>

      <div className="border-tpg-border flex flex-col gap-2.5 border-t pt-4">
        <a
          href={commitCalendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover rounded px-5 py-3.5 text-center text-[13.5px] font-bold text-white transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
        >
          {bookLabel}
        </a>

        {brochure && (
          <a
            href={brochure.href}
            aria-label={brochure.ariaLabel}
            {...(brochure.downloadAs ? { download: brochure.downloadAs } : {})}
            className="border-tpg-ink text-tpg-ink hover:bg-tpg-ink rounded border px-5 py-3 text-center text-[13.5px] font-semibold transition-[background-color,color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:text-white focus-visible:-translate-y-0.5"
          >
            {brochureLabel}
          </a>
        )}

        {/*
         * A statement of what already happened, so not a button — and the
         * statement changes with what actually happened. The panel promised an
         * instant email; if the send failed, this says so rather than
         * repeating a promise that is no longer true.
         */}
        <p className="text-tpg-muted/90 pt-1 text-[12px] leading-relaxed">
          {emailed ? resultsEmailed : resultsNotEmailed}
        </p>

        {/*
         * Start over. Deliberately the quietest thing on the screen: a text
         * button, muted, centered under everything else. It must not compete
         * with the call booking above it, so it gets no border, no fill and no
         * lift on hover — only a color change.
         */}
        <button
          type="button"
          onClick={onRestart}
          aria-label={restartAriaLabel}
          className="text-tpg-muted/80 hover:text-tpg-ink focus-visible:text-tpg-ink cursor-pointer self-center pt-1 text-[12px] underline underline-offset-4 transition-colors duration-200 ease-out"
        >
          {restartLabel}
        </button>
      </div>
    </div>
  );
}
