"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatStage } from "@/components/scorecard/ChatStage";
import { GateForm } from "@/components/scorecard/GateForm";
import { WidgetTabs } from "@/components/scorecard/WidgetTabs";
import type { WidgetTab } from "@/components/scorecard/WidgetTabs";
import { buildMessages } from "@/components/scorecard/messages";
import type { ChatStageName } from "@/components/scorecard/messages";
import {
  chatTabBadge,
  chatTabLabel,
  closeLabel,
  introBody,
  introEyebrow,
  introHeadline,
  openLabel,
  questions,
  widgetLabel,
} from "@/content/scorecard";
import { cn } from "@/lib/cn";
import {
  HONEYPOT_FIELD,
  SCORECARD_RESULT_ENDPOINT,
  SCORECARD_START_ENDPOINT,
  SCORECARD_TURN_ENDPOINT,
} from "@/lib/scorecard";
import type {
  ScorecardAnswer,
  ScorecardContact,
  ScorecardRecommendation,
  ScorecardResultResponse,
  ScorecardStartResponse,
  ScorecardTurnResponse,
} from "@/lib/scorecard";

/**
 * The floating scorecard widget.
 *
 * Session state lives in this component and nowhere else. Closing the panel
 * mid-session and reopening resumes exactly where it was, because the state
 * never unmounts; a page refresh starts over, which V1 accepts. Nothing is
 * written to storage, so there is no stale session to reconcile and no consent
 * question to answer.
 *
 * The panel is a floating card on desktop and a bottom sheet on mobile — one
 * component, one set of state, the difference is entirely in the classes.
 */

type Stage = "intro" | "gate" | ChatStageName;

/** The three stages that render as the conversation rather than as their own screen. */
function isChatStage(stage: Stage): stage is ChatStageName {
  return stage === "questions" || stage === "analysing" || stage === "results";
}

const SCORECARD_TAB = "scorecard";

const tabs: WidgetTab[] = [
  { id: SCORECARD_TAB, label: widgetLabel },
  /*
   * V2. Visible and disabled on purpose — the spec is explicit that this is
   * not to be hidden or feature-flagged out, because it signals what is coming.
   * Turning it on is dropping `disabled` and mounting the chat panel.
   */
  { id: "ask", label: chatTabLabel, badge: chatTabBadge, disabled: true },
];

/**
 * Wrapper for the two stages that are not the chat — intro and gate. They are
 * short, so they centre in the fixed panel; they scroll only if a small
 * viewport makes even that too tall.
 */
const STATIC_STAGE_CLASS = "flex min-h-0 flex-1 flex-col justify-center overflow-y-auto";

/** Focusable descendants, for the focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ScorecardWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [activeTab, setActiveTab] = useState(SCORECARD_TAB);

  const [contact, setContact] = useState<ScorecardContact | null>(null);
  const [answers, setAnswers] = useState<ScorecardAnswer[]>([]);
  const [index, setIndex] = useState(0);
  /**
   * Acknowledgements keyed by the question they reacted to. This used to be a
   * single string overwritten every turn, which was fine when only the newest
   * one was ever on screen — in a transcript that keeps the whole conversation,
   * every one of them has to survive.
   */
  const [acks, setAcks] = useState<Record<string, string>>({});
  /**
   * Questions answered by enrichment rather than by the person. They are held
   * so the transcript can leave them out: we never asked, so showing the
   * exchange would be inventing one.
   */
  const [prefilledIds, setPrefilledIds] = useState<Set<string>>(() => new Set());
  const [pending, setPending] = useState(false);
  const [gateErrors, setGateErrors] = useState<Record<string, string>>({});

  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState<ScorecardRecommendation[]>([]);
  const [readingFailed, setReadingFailed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  /** Stable for the whole session, and reused by the chat tab in V2. */
  const sessionIdRef = useRef<string | null>(null);

  /*
   * Minted on first use rather than during render. Generating it in the render
   * body would both break the rules-of-hooks lint and hand the server and the
   * client two different ids on the first paint, since `randomUUID` is not
   * deterministic. Nothing needs it until the gate form is submitted, and by
   * then we are in an event handler on the client.
   */
  function sessionId(): string {
    sessionIdRef.current ??= crypto.randomUUID();
    return sessionIdRef.current;
  }

  /*
   * Escape closes, and focus goes back to the bubble that opened the panel —
   * a keyboard reader must never be dropped at the top of the document.
   */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // Closing is all that happens here. Returning focus to the bubble is
        // the effect below, because the bubble does not exist yet at this point
        // — it only mounts once `open` is false.
        setOpen(false);
        return;
      }

      // Focus trap: Tab cycles within the panel while it is open.
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /**
   * Returns focus to the bubble when the panel closes.
   *
   * This has to be an effect rather than part of the close handlers. The bubble
   * is only rendered while the panel is shut, so at the moment either handler
   * runs its ref is still null and the focus call silently does nothing — which
   * left a keyboard reader stranded on `<body>` at the top of the page.
   *
   * `hasOpenedRef` keeps it from stealing focus on first mount, when the widget
   * is closed simply because nobody has opened it yet.
   */
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      return;
    }
    if (hasOpenedRef.current) bubbleRef.current?.focus();
  }, [open]);

  /**
   * Moves focus into the panel when it opens, so Tab starts inside it.
   *
   * `preventScroll` matters more than it looks. Focusing an element inside a
   * scroll container scrolls it into view, so without this the focus call and
   * the transcript's own scroll-to-bottom would fight each other on every
   * stage change. With it, the two are independent and neither needs to know
   * about the other.
   */
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
  }, [open, stage]);

  const startSession = useCallback(async (entered: ScorecardContact, honeypot: string) => {
    setPending(true);
    setGateErrors({});

    try {
      const response = await fetch(SCORECARD_START_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...entered,
          sessionId: sessionId(),
          sourcePage: window.location.pathname,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });

      const body = (await response.json()) as ScorecardStartResponse;

      if (!body.ok) {
        setGateErrors(body.errors ?? {});
        return;
      }

      setContact(entered);

      /*
       * Enrichment may have answered a question for us. Those answers are
       * seeded here and their questions skipped, so nobody is asked something
       * the lookup already told us.
       */
      const prefilled = body.prefilled ?? [];
      setAnswers(prefilled);
      const skipped = new Set(prefilled.map((answer) => answer.questionId));
      // The same set drives both the question walk below and the transcript's
      // decision to render nothing for these.
      setPrefilledIds(skipped);
      let next = 0;
      while (next < questions.length && skipped.has(questions[next].id)) next += 1;
      setIndex(next);

      setStage(next < questions.length ? "questions" : "analysing");
    } catch {
      // The lead may or may not have landed; what is certain is that this
      // person is looking at a form that did nothing. Say so, do not pretend.
      setGateErrors({ email: "That did not go through. Please try again." });
    } finally {
      setPending(false);
    }
  }, []);

  const requestReading = useCallback(
    async (finalAnswers: ScorecardAnswer[], person: ScorecardContact) => {
      setStage("analysing");

      try {
        const response = await fetch(SCORECARD_RESULT_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId(),
            contact: person,
            answers: finalAnswers,
            sourcePage: window.location.pathname,
          }),
        });

        const body = (await response.json()) as ScorecardResultResponse;

        if (body.ok) {
          setSummary(body.summary);
          setRecommendations(body.recommendations);
          setReadingFailed(false);
        } else {
          setReadingFailed(true);
        }
      } catch {
        setReadingFailed(true);
      } finally {
        setStage("results");
      }
    },
    [],
  );

  const answerQuestion = useCallback(
    async (answer: string) => {
      const question = questions[index];
      if (!question || !contact) return;

      const updated = [...answers, { questionId: question.id, question: question.text, answer }];
      setAnswers(updated);

      // Find the next question that enrichment has not already answered.
      let next = index + 1;
      const answered = new Set(updated.map((entry) => entry.questionId));
      while (next < questions.length && answered.has(questions[next].id)) next += 1;

      if (next >= questions.length) {
        await requestReading(updated, contact);
        return;
      }

      /*
       * The acknowledgement is fetched between questions, and the typing
       * indicator is only shown while it is genuinely in flight — no faked
       * latency. If it fails or comes back empty, the next question simply
       * appears without a line above it.
       */
      setPending(true);

      try {
        const response = await fetch(SCORECARD_TURN_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId(),
            contact,
            answers: updated,
          }),
        });
        const body = (await response.json()) as ScorecardTurnResponse;
        /*
         * Keyed by the question just answered, not the one coming next — the
         * line is a reaction to what they said, and in the transcript it sits
         * directly under their message.
         */
        const line = body.acknowledgement ?? "";
        if (line) setAcks((current) => ({ ...current, [question.id]: line }));
      } catch {
        // Nothing written. An absent key renders no bubble, which is the same
        // outcome as before: the next question simply arrives without a line.
      } finally {
        setPending(false);
        setIndex(next);
      }
    },
    [answers, contact, index, requestReading],
  );

  const question = questions[index];

  /*
   * Derived, not accumulated. Everything the transcript shows already lives in
   * `answers` and `acks`, so there is no second list to keep in step. Six
   * answers is nothing to recompute.
   */
  const messages = useMemo(
    () =>
      isChatStage(stage)
        ? buildMessages({ answers, acks, prefilledIds, stage, question, pending })
        : [],
    [answers, acks, prefilledIds, stage, question, pending],
  );

  return (
    <>
      {/*
       * The bubble. `z-40` keeps it under any modal the site may grow later,
       * and the safe-area inset keeps it clear of the home indicator on iOS
       * rather than sitting under it.
       */}
      {!open && (
        <button
          ref={bubbleRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={openLabel}
          className={cn(
            "bg-tpg-ink fixed right-5 bottom-5 z-40 flex cursor-pointer items-center gap-2.5",
            "rounded-full py-3.5 pr-5 pl-4 shadow-[0_8px_22px_rgba(3,42,69,0.24)]",
            "transition-transform duration-200 ease-out hover:-translate-y-0.5",
          )}
          style={{
            right: "max(1.25rem, env(safe-area-inset-right))",
            bottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
          {/*
           * The one piece of looping motion on the closed state. It is a 2.4s
           * cycle on a 10px dot, which is enough to catch the eye in
           * peripheral vision without becoming something you have to look away
           * from while reading the page behind it.
           */}
          <span
            className="bg-tpg-cta sc-pulse h-2.5 w-2.5 flex-none rounded-full"
            aria-hidden="true"
          />
          <span className="text-[13.5px] font-semibold whitespace-nowrap text-white">
            {widgetLabel}
          </span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={widgetLabel}
          className={cn(
            "border-tpg-border fixed z-40 flex flex-col border bg-white",
            "shadow-[0_14px_34px_rgba(3,42,69,0.16)]",
            /*
             * The height is fixed, not a max, and that is the whole point: the
             * panel used to shrink-wrap its content and so changed size at every
             * step — roughly 195px on the typing beat, 1000px on a five-pick
             * results screen. A chat window does not resize as you talk to it.
             *
             * 620px is the target. Header and tabs take ~93px and the composer
             * ~150px, which leaves ~375px of transcript: four or five bubbles.
             * `calc(100dvh-8rem)` is the short-viewport guard — 8rem covers the
             * `bottom-5` offset plus the same clearance at the top — so on a
             * 640px laptop screen it resolves to 512px and still fits.
             */
            // Bottom sheet on mobile: full width, pinned to the bottom edge.
            // 78dvh rather than 85 keeps the composer clear of the keyboard.
            "inset-x-0 bottom-0 h-[min(78dvh,620px)] rounded-t-2xl",
            // Floating panel from `sm` up.
            // `rounded-lg` is what the site gives its large panels — the
            // scheduler card, the headcount table. `overflow-hidden` is what
            // makes the corners actually read: the navy header and the tab bar
            // are square children that would otherwise square the corners off.
            "overflow-hidden sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[min(620px,calc(100dvh-8rem))] sm:w-[380px] sm:rounded-lg",
            /*
             * One class, two entrances. A sheet attached to the bottom edge
             * should slide up out of it; a floating panel should rise into
             * place. Which one runs is decided by a media query in
             * `globals.css` rather than by a `sm:` variant here, because these
             * are hand-written classes and Tailwind only generates variants
             * for utilities it knows about.
             */
            "sc-enter",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="bg-tpg-ink flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="text-[13px] font-semibold tracking-[0.06em] text-white uppercase">
              The Peterson Group
            </span>
            <button
              type="button"
              // Focus returns to the bubble via the effect above, once it exists.
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              /*
               * A rounded hit area rather than bare glyph. Focus lands here
               * when the panel opens, so the browser's focus ring is drawn
               * around this element more or less immediately — against a square
               * box it reads as a stray outline; around a circle it reads as a
               * button.
               */
              className="text-tpg-sky flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[17px] leading-none transition-[color,background-color,transform] duration-200 ease-out hover:scale-110 hover:bg-white/10 hover:text-white"
            >
              &times;
            </button>
          </div>

          <WidgetTabs tabs={tabs} activeId={activeTab} onSelect={setActiveTab} />

          <div
            role="tabpanel"
            id={`tpg-panel-${SCORECARD_TAB}`}
            aria-labelledby={`tpg-tab-${SCORECARD_TAB}`}
            /*
             * `min-h-0` is load-bearing and easy to lose. A flex item defaults to
             * `min-height: auto`, which lets tall content push the item past its
             * parent instead of scrolling inside it — the panel would grow again
             * and no error would be raised. Every level of this chain (panel →
             * here → ChatStage → Transcript) needs it.
             */
            className="flex min-h-0 flex-1 flex-col"
          >
            {/*
             * Intro and gate keep their own markup untouched. The wrapper is
             * what makes them fill the now-fixed panel, and `justify-center`
             * settles their short copy in the middle rather than stranding it
             * against the tab bar with empty space below.
             */}
            {stage === "intro" && (
              <div className={STATIC_STAGE_CLASS}>
                <div className="sc-step-in flex flex-col gap-3 px-5 pt-6 pb-6">
                  <span className="text-tpg-accent text-[11px] font-bold tracking-[0.16em] uppercase">
                    {introEyebrow}
                  </span>
                  <p className="text-tpg-ink font-serif text-[24px] leading-snug">
                    {introHeadline}
                  </p>
                  <p className="text-tpg-muted text-[13.5px] leading-relaxed">{introBody}</p>
                  <button
                    type="button"
                    onClick={() => setStage("gate")}
                    className="bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover mt-1 cursor-pointer px-5 py-3.5 text-[13.5px] font-bold text-white transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
                  >
                    Start
                  </button>
                </div>
              </div>
            )}

            {stage === "gate" && (
              <div className={STATIC_STAGE_CLASS}>
                <GateForm pending={pending} errors={gateErrors} onSubmit={startSession} />
              </div>
            )}

            {isChatStage(stage) && (
              <ChatStage
                messages={messages}
                question={stage === "questions" ? question : undefined}
                position={index + 1}
                pending={pending}
                stage={stage}
                summary={summary}
                recommendations={recommendations}
                readingFailed={readingFailed}
                onAnswer={answerQuestion}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
