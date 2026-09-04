"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GateForm } from "@/components/scorecard/GateForm";
import { ResultsPanel } from "@/components/scorecard/ResultsPanel";
import { TypingDots } from "@/components/scorecard/TypingDots";
import { formatSentAt, isFromVisitor } from "@/components/scorecard/messages";
import type { Message } from "@/components/scorecard/messages";
import {
  botSpeakerLabel,
  jumpToLatestLabel,
  todayLabel,
  transcriptLabel,
  youSpeakerLabel,
} from "@/content/scorecard";
import type { ScorecardContact, ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The scrolling conversation, and the only scrollable region in the panel.
 *
 * It renders the message log and nothing else — no `currentTurn`, no
 * `latestAck`, no question held in a single-value prop. Everything on screen
 * arrives as an entry in `messages`, in the order it was appended, keyed by the
 * id it was born with. That is the whole contract, and it is what makes the
 * conversation readable from the first question to the last at any point.
 *
 * The chips are passed in as a slot rather than rendered by a sibling below,
 * because they belong to the flow: they are the tail of the conversation, so
 * they sit in the same scroll context as the messages above them and no second
 * scrollbar exists to compete with this one.
 */

/**
 * How close to the bottom still counts as "following the conversation". A
 * person who has nudged up a line is still pinned; one who has scrolled back to
 * reread is not, and must not be dragged down when the next message lands.
 */
const PINNED_THRESHOLD_PX = 48;

/*
 * BUBBLE GEOMETRY.
 *
 * A messenger tail: three corners at 14px and one squared to 4px, and which
 * corner is squared says who is speaking. The bot squares its TOP-LEFT and the
 * visitor its TOP-RIGHT, so the notch sits beside the avatar on the bot's side
 * and against the panel edge on the visitor's — the corner points back at the
 * speaker, the way a speech tail does.
 *
 * 4px rather than 0. A fully square corner against three 14px ones reads as a
 * clipping bug at this size; a small radius reads as a tail.
 *
 * Only the FIRST bubble in a run from one speaker gets its tail. A run of three
 * bot messages with three tails looks like three separate arrivals rather than
 * one person still talking.
 */
const BOT_TAIL = "rounded-[14px] rounded-tl-[4px]";
const MINE_TAIL = "rounded-[14px] rounded-tr-[4px]";
const NO_TAIL = "rounded-[14px]";

/**
 * The bot's bubble: plain white on the recessed ground, with the faint lift a
 * messenger gives its messages.
 *
 * There is no accent bar and no quoted card. Continuity is carried by the
 * question's own wording — it is rewritten each turn from what the visitor just
 * said — rather than by a decoration announcing that a reference is being made.
 */
const BOT_BUBBLE = "bg-white shadow-[0_1px_1.5px_rgba(3,42,69,0.14)]";
/** The visitor's own: the pale blue every messenger reserves for "mine". */
const MINE_BUBBLE = "bg-tpg-chat-mine";

/** Avatar column width, reserved even when no avatar is drawn, so a run stays aligned. */
const AVATAR_GUTTER = "w-[26px] flex-none";

type TranscriptProps = {
  messages: Message[];
  summary: string;
  recommendations: ScorecardRecommendation[];
  emailed: boolean;
  onRestart: () => void;
  /** The chip group for the current question, when there is one. Rendered inline. */
  chips?: React.ReactNode;
  /** Gate submission, for the form that renders inside the thread. */
  gatePending: boolean;
  gateErrors: Record<string, string>;
  onGateSubmit: (contact: ScorecardContact, honeypot: string) => void;
  /** True once the gate has been answered, which retires the card. */
  gateDone: boolean;
};

/** Reads the speaker out before the message, for anyone who cannot see the alignment. */
function Speaker({ label }: { label: string }) {
  return <span className="sr-only">{label} </span>;
}

/** The bot's mark, drawn once per run of its messages. */
function Avatar({ shown }: { shown: boolean }) {
  if (!shown) return <div className={AVATAR_GUTTER} aria-hidden="true" />;
  return (
    <div
      aria-hidden="true"
      className={`bg-tpg-ink ${AVATAR_GUTTER} flex h-[26px] items-center justify-center rounded-full font-serif text-[13px] text-white`}
    >
      P
    </div>
  );
}

/**
 * The send time, in the corner of the bubble.
 *
 * A timestamp and nothing else. The design also drew read receipts and an
 * "Online · replies instantly" line, and those are deliberately absent: a
 * double-check mark means a person has seen your message and a presence line
 * claims someone is there, and on the other end of this thread is a model. A
 * send time is simply true.
 */
function SentAt({ at, mine }: { at: number; mine?: boolean }) {
  return (
    <div
      className={`mt-0.5 text-right text-[10.5px] ${mine ? "text-[#7e96a8]" : "text-tpg-chat-time"}`}
    >
      <time dateTime={new Date(at).toISOString()}>{formatSentAt(at)}</time>
    </div>
  );
}

export function Transcript({
  messages,
  summary,
  recommendations,
  emailed,
  onRestart,
  chips,
  gatePending,
  gateErrors,
  onGateSubmit,
  gateDone,
}: TranscriptProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** Whether new messages should pull the view down. See the threshold above. */
  const pinnedRef = useRef(true);
  /** The first positioning is instant; later ones may glide. */
  const hasScrolledRef = useRef(false);
  /**
   * Mirrors `pinnedRef` into render, and exists only to draw the jump button.
   *
   * The ref is what the scroll effect reads, because it has to be current
   * within the same tick as an append. This is the same fact as state, one
   * render behind, which is fine for a button that only has to appear.
   */
  const [pinned, setPinned] = useState(true);

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    const atBottom = distance < PINNED_THRESHOLD_PX;
    pinnedRef.current = atBottom;
    setPinned(atBottom);
  }, []);

  const reducedMotion = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollToLatest = useCallback((smooth: boolean) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    /*
     * `scrollTo` on the known scroller rather than `scrollIntoView` on the last
     * bubble. `scrollIntoView` walks up the ancestor chain and will happily
     * scroll the page behind a mobile bottom sheet, which is very visible and
     * very hard to attribute once it happens.
     *
     * The reduced-motion check is explicit because the global CSS rule
     * collapses animations and transitions but has no effect on a scroll
     * `behavior` passed from script.
     */
    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: smooth && !reducedMotion() ? "smooth" : "auto",
    });
    pinnedRef.current = true;
    setPinned(true);
  }, []);

  const showingResults = messages.at(-1)?.kind === "results";

  /*
   * Follows every append, and the chip slot too: chips arriving under the last
   * question change the scroll height without adding a message, and leaving the
   * view where it was would hide the controls the visitor is meant to use next.
   */
  useEffect(() => {
    /*
     * Results are the one message that scrolls unconditionally: arriving at the
     * report and being left half way up the transcript would read as a bug.
     * Everything else respects where the person has put the scroll — someone
     * re-reading their earlier answers is not yanked to the bottom, they get
     * the jump affordance instead.
     */
    if (!pinnedRef.current && !showingResults) return;

    scrollToLatest(hasScrolledRef.current);
    hasScrolledRef.current = true;
  }, [messages.length, showingResults, chips, scrollToLatest]);

  return (
    // `relative` is the positioning context for the jump button, which floats
    // over the conversation rather than displacing it.
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        /*
         * `role="log"` with additions-only announcements: a polite live region
         * that reads new messages as they arrive but stays quiet when one is
         * removed, which is what happens every time the typing bubble resolves.
         *
         * `tabIndex` makes the region reachable by keyboard. A scrollable box
         * with no focusable content inside it cannot otherwise be scrolled
         * without a mouse, and the panel's focus trap already recognizes
         * `[tabindex]`.
         *
         * `overscroll-contain` stops a flick past the end of the conversation
         * from chaining to the page behind the sheet.
         *
         * The dotted ground is what makes this read as a messenger rather than
         * as a form: the conversation sits in a recessed surface and the
         * bubbles sit on top of it. Drawn as a `radial-gradient` on an 18px
         * grid — one element, no image to load.
         */
        role="log"
        aria-label={transcriptLabel}
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
        className="bg-tpg-chat-ground flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4"
        style={{
          backgroundImage: "radial-gradient(var(--tpg-chat-dot) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        {/*
         * BOTTOM ANCHORING, and why it is `mt-auto` here and NOT `justify-end`
         * on the scroller.
         *
         * `mt-auto` on this wrapper is what settles a short thread against the
         * message bar rather than stranding it at the top of a tall blank
         * panel. `flex-none` keeps it from absorbing the slack instead of being
         * pushed by it. Once the conversation outgrows the panel the auto
         * margin resolves to zero, so it costs nothing later.
         *
         * `justify-content: flex-end` on the scroll container looks like it
         * does the same job and quietly breaks scrolling: a flex container
         * justified to the end overflows in the START direction, and browsers
         * do not extend `scrollHeight` into that overflow. The container then
         * reports `scrollHeight === clientHeight` — measured at 410px against
         * 1336px of real content — so it believes everything fits, no scrollbar
         * appears, and the top of the conversation cannot be reached at all.
         * An auto margin overflows in the end direction instead, which is
         * scrollable. Do not reintroduce it.
         */}
        <div className="mt-auto flex flex-none flex-col gap-2.5">
          {/*
           * The day divider. A session never meaningfully spans midnight — the
           * scorecard takes three minutes — so this is a single fixed marker at
           * the head of the thread rather than real date grouping.
           */}
          {messages.length > 0 && (
            <div className="flex justify-center pb-0.5">
              <span className="rounded-full bg-[#e4edf4] px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] text-[#5e7789] uppercase">
                {todayLabel}
              </span>
            </div>
          )}

          {messages.map((message, position) => {
            const mine = isFromVisitor(message);
            /*
             * The tail is drawn only on the first bubble of a run from one
             * speaker. Consecutive messages from the same side are one person
             * still talking, and giving each its own tail makes them read as
             * separate arrivals.
             */
            const previous = position > 0 ? messages[position - 1] : undefined;
            const startsRun = !previous || isFromVisitor(previous) !== mine;
            const tail = startsRun ? (mine ? MINE_TAIL : BOT_TAIL) : NO_TAIL;

            switch (message.kind) {
              case "question":
                return (
                  <div key={message.id} className="sc-step-in flex items-end gap-2">
                    <Avatar shown={startsRun} />
                    <div className={`${BOT_BUBBLE} ${tail} max-w-[280px] px-3 pt-2.5 pb-1.5`}>
                      <Speaker label={botSpeakerLabel} />
                      <p className="text-tpg-ink text-[14px] leading-normal text-pretty">
                        {message.text}
                      </p>
                      <SentAt at={message.sentAt} />
                    </div>
                  </div>
                );

              case "answer":
                return (
                  <div key={message.id} className="sc-step-in flex justify-end">
                    <div
                      className={`${MINE_BUBBLE} ${tail} max-w-[280px] px-3 pt-2.5 pb-1.5 break-words whitespace-pre-wrap`}
                    >
                      <Speaker label={youSpeakerLabel} />
                      <p className="text-tpg-ink text-[14px] leading-normal">{message.text}</p>
                      <SentAt at={message.sentAt} mine />
                    </div>
                  </div>
                );

              case "gate":
                /*
                 * The gate, asked in the thread. It is the card alone — there
                 * is no framing bubble above it, because the card already says
                 * what it wants: three labeled fields and a button reading
                 * "Start the scorecard". A bot message restating that in
                 * sentences was a line to read before reaching a form that was
                 * about to ask the same thing anyway.
                 *
                 * So it spans the full width rather than sitting in the
                 * avatar's indent: with no message to be attached to, an indent
                 * would be alignment to something that is not there.
                 */
                return (
                  <div key={message.id} className="sc-step-in flex flex-col">
                    {/*
                     * The card is RETIRED once answered, not removed. It stays
                     * in the log — the exchange happened and must remain
                     * scrollable to — but it is faded and made inert, so a
                     * visitor scrolling back through the conversation cannot
                     * type into a form that has already been submitted. The
                     * answer they gave is the bubble directly below it.
                     */}
                    <div className={gateDone ? "opacity-55" : ""}>
                      <div className="rounded-[14px] bg-white p-4 shadow-[0_1px_1.5px_rgba(3,42,69,0.14)]">
                        <fieldset disabled={gateDone} className="min-w-0 border-0 p-0">
                          <GateForm
                            pending={gatePending}
                            errors={gateErrors}
                            onSubmit={onGateSubmit}
                          />
                        </fieldset>
                      </div>
                    </div>
                  </div>
                );

              case "typing":
                // Decoration only — the message that follows is the
                // announcement. It sits in the bot's bubble position so the
                // wait has a visible owner.
                return (
                  <div
                    key={message.id}
                    aria-hidden="true"
                    className="sc-step-in flex items-end gap-2"
                  >
                    <Avatar shown={startsRun} />
                    <div className={`${BOT_BUBBLE} ${tail} px-4 py-3`}>
                      <TypingDots />
                    </div>
                  </div>
                );

              case "analyzing":
                return (
                  <div key={message.id} className="sc-step-in flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                      <Avatar shown={startsRun} />
                      <div aria-hidden="true" className={`${BOT_BUBBLE} ${tail} px-4 py-3`}>
                        <TypingDots />
                      </div>
                    </div>
                    <span role="status" className="text-tpg-muted pl-[34px] text-[12.5px]">
                      {message.text}
                    </span>
                  </div>
                );

              case "results":
                /*
                 * The report breaks the bubble metaphor on purpose: it is a
                 * document, not a remark, and it needs the full width of the
                 * panel. It stays the last entry in the log rather than a
                 * screen of its own, so scrolling up from it reaches every
                 * answer that produced it.
                 */
                return (
                  <div
                    key={message.id}
                    className="sc-step-in border-tpg-border -mx-4 mt-1 border-t bg-white pt-1"
                  >
                    <ResultsPanel
                      summary={summary}
                      recommendations={recommendations}
                      emailed={emailed}
                      onRestart={onRestart}
                    />
                  </div>
                );
            }
          })}

          {/*
           * The chips, at the end of the conversation and inside its scroll.
           * They are not a message — they are a control, and they disappear
           * when answered rather than staying in the log. What stays is the
           * `answer` bubble the selection produced.
           */}
          {chips}
        </div>
      </div>

      {/*
       * Shown only when the visitor has scrolled away from the bottom. The
       * alternative — dragging them back down on every append — takes the
       * conversation away mid-sentence from someone who deliberately went to
       * re-read it.
       */}
      {!pinned && (
        <button
          type="button"
          onClick={() => scrollToLatest(true)}
          className="bg-tpg-ink absolute bottom-3 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(3,42,69,0.24)] transition-transform duration-200 ease-out hover:-translate-x-1/2 hover:scale-105"
        >
          {jumpToLatestLabel} &darr;
        </button>
      )}
    </div>
  );
}
