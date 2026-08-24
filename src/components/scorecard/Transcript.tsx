"use client";

import { useCallback, useEffect, useRef } from "react";
import { ResultsPanel } from "@/components/scorecard/ResultsPanel";
import { TypingDots } from "@/components/scorecard/TypingDots";
import type { ScorecardMessage } from "@/components/scorecard/messages";
import {
  analysingLine,
  botSpeakerLabel,
  transcriptLabel,
  youSpeakerLabel,
} from "@/content/scorecard";
import type { ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The scrolling conversation.
 *
 * Everything the person has been asked and everything they answered stays on
 * screen and stays reachable — including from the results, which are simply the
 * last entry in the log rather than a separate screen. That is the point of the
 * whole refactor: you can scroll back and see what you said.
 */

/**
 * How close to the bottom still counts as "following the conversation". A
 * person who has nudged up a line is still pinned; one who has scrolled back to
 * reread is not, and must not be dragged back down when the next message lands.
 */
const PINNED_THRESHOLD_PX = 48;

const BUBBLE_BASE = "sc-step-in max-w-[86%] px-4 py-2.5 text-[13.5px] leading-relaxed";

/*
 * Bubbles are rounded on three corners and tighter on the one nearest their
 * speaker, which is what makes a stack of them read as a conversation with two
 * sides rather than as a column of cards. The radius is the site's own
 * `rounded-lg` (8px) with the tail corner dropped to `rounded-sm` (2px).
 */
const BOT_BUBBLE = "rounded-lg rounded-bl-sm";
const USER_BUBBLE = "rounded-lg rounded-br-sm";

type TranscriptProps = {
  messages: ScorecardMessage[];
  summary: string;
  recommendations: ScorecardRecommendation[];
  readingFailed: boolean;
};

/** Reads the speaker out before the message, for anyone who cannot see the alignment. */
function Speaker({ label }: { label: string }) {
  return <span className="sr-only">{label} </span>;
}

export function Transcript({ messages, summary, recommendations, readingFailed }: TranscriptProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** Whether new messages should pull the view down. See the threshold above. */
  const pinnedRef = useRef(true);
  /** The first positioning is instant; later ones may glide. */
  const hasScrolledRef = useRef(false);

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    pinnedRef.current = distance < PINNED_THRESHOLD_PX;
  }, []);

  const lastMessage = messages.at(-1);
  const showingResults = lastMessage?.kind === "results";

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    /*
     * Results are the one message that scrolls unconditionally: arriving at the
     * reading and being left half way up the transcript would read as a bug.
     * Everything else respects where the person has put the scroll.
     */
    if (!pinnedRef.current && !showingResults) return;

    /*
     * `scrollTo` on the known scroller rather than `scrollIntoView` on the last
     * bubble. `scrollIntoView` walks up the ancestor chain and will happily
     * scroll the page behind a mobile bottom sheet, which is very visible and
     * very hard to attribute once it happens.
     *
     * The reduced-motion check is explicit because the global CSS rule collapses
     * animations and transitions but has no effect on a scroll `behavior` passed
     * from script.
     */
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: hasScrolledRef.current && !reduced ? "smooth" : "auto",
    });
    hasScrolledRef.current = true;
    pinnedRef.current = true;
  }, [messages.length, showingResults]);

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      /*
       * `role="log"` with additions-only announcements: a polite live region
       * that reads new messages as they arrive but stays quiet when one is
       * removed, which is what happens every time the typing bubble resolves.
       *
       * `tabIndex` makes the region reachable by keyboard. A scrollable box with
       * no focusable content inside it cannot otherwise be scrolled without a
       * mouse, and the panel's focus trap already recognises `[tabindex]`.
       *
       * `overscroll-contain` stops a flick past the end of the conversation from
       * chaining to the page behind the sheet.
       */
      role="log"
      aria-label={transcriptLabel}
      aria-live="polite"
      aria-relevant="additions"
      tabIndex={0}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-4"
    >
      {messages.map((message) => {
        switch (message.kind) {
          case "bot-question":
            return (
              <p
                key={message.id}
                className={`${BUBBLE_BASE} ${BOT_BUBBLE} bg-tpg-tint text-tpg-ink self-start font-serif text-[15.5px] leading-snug`}
              >
                <Speaker label={botSpeakerLabel} />
                {message.text}
              </p>
            );

          case "user-answer":
            return (
              <p
                key={message.id}
                className={`${BUBBLE_BASE} ${USER_BUBBLE} bg-tpg-ink self-end text-white`}
              >
                <Speaker label={youSpeakerLabel} />
                {message.text}
              </p>
            );

          case "bot-ack":
            return (
              <p
                key={message.id}
                /*
                 * The accent is an inset bar rather than a left border. A
                 * 3px border sitting under a rounded corner gets mitred into a
                 * wedge, which reads as a rendering fault; a `box-shadow` inset
                 * follows the radius cleanly and needs no extra element.
                 */
                className="sc-step-in bg-tpg-tint text-tpg-muted max-w-[86%] self-start rounded-lg rounded-bl-sm py-3 pr-4 pl-5 text-[13px] leading-relaxed shadow-[inset_3px_0_0_var(--tpg-accent)]"
              >
                <Speaker label={botSpeakerLabel} />
                {message.text}
              </p>
            );

          case "bot-typing":
            // Decoration only — the message that follows is the announcement.
            return (
              <span
                key={message.id}
                aria-hidden="true"
                className="sc-step-in bg-tpg-tint self-start rounded-lg rounded-bl-sm px-4 py-3"
              >
                <TypingDots />
              </span>
            );

          case "bot-analysing":
            return (
              <span
                key={message.id}
                className="sc-step-in flex flex-col items-start gap-2 self-start"
              >
                <span aria-hidden="true" className="bg-tpg-tint rounded-lg rounded-bl-sm px-4 py-3">
                  <TypingDots />
                </span>
                <span role="status" className="text-tpg-muted text-[13px]">
                  {analysingLine}
                </span>
              </span>
            );

          case "results":
            return (
              <div key={message.id} className="border-tpg-border -mx-5 border-t pt-1">
                <ResultsPanel
                  summary={summary}
                  recommendations={recommendations}
                  failed={readingFailed}
                />
              </div>
            );
        }
      })}
    </div>
  );
}
