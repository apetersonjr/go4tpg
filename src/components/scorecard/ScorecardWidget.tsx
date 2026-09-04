"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatStage } from "@/components/scorecard/ChatStage";
import { WidgetTabs } from "@/components/scorecard/WidgetTabs";
import type { WidgetTab } from "@/components/scorecard/WidgetTabs";
import { createMessage, withoutTyping } from "@/components/scorecard/messages";
import type { ChatStageName, Message } from "@/components/scorecard/messages";
import {
  analyzingLine,
  chatTabBadge,
  chatTabLabel,
  closeLabel,
  openLabel,
  widgetLabel,
} from "@/content/scorecard";
import { cn } from "@/lib/cn";
import {
  HONEYPOT_FIELD,
  SCORECARD_ANALYZE_ENDPOINT,
  SCORECARD_START_ENDPOINT,
  SCORECARD_TURN_ENDPOINT,
} from "@/lib/scorecard";
import type {
  ScorecardAnalyzeResponse,
  ScorecardContact,
  ScorecardExtraction,
  ScorecardQuestion,
  ScorecardRecommendation,
  ScorecardStartResponse,
  ScorecardTurn,
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
 * WHAT THE CLIENT HOLDS AND WHY. The server is stateless, so the whole session
 * is here and posted back on every turn: the completed turns, the satisfied
 * intent ids, and the current question — which the SERVER wrote, not this
 * component. There is no local question list any more. The client renders what
 * it is handed and sends back what was typed; deciding what to ask is the turn
 * engine's job, and the reason the questions can adapt at all.
 *
 * TWO KINDS OF STATE, AND THE LINE BETWEEN THEM. `turns`, `satisfied` and
 * `question` are PROTOCOL state: they exist because the server is stateless and
 * needs the session posted back. `messages` is DISPLAY state: an append-only
 * log that is the sole source of truth for what is on screen. The transcript
 * reads `messages` and nothing else.
 *
 * That separation is the fix for the rendering bugs, not a tidiness exercise.
 * When the transcript was projected from protocol state it showed whatever the
 * protocol happened to hold at that instant — which mid-request is a question
 * that is no longer current and an answer that is not yet a turn, i.e. nothing.
 * Appending decouples the two: what was said stays said regardless of what the
 * protocol is doing, and the quote a question carries is copied from the same
 * response that produced that question, so it can never belong to a different
 * turn than the one it is drawn against.
 *
 * The panel is a floating card on desktop and a bottom sheet on mobile — one
 * component, one set of state, the difference is entirely in the classes.
 */

/**
 * The session's phase.
 *
 * There is no "intro" and no "gate" any more. Every phase is the same thread —
 * the gate is a card inside the conversation, and the results are its last
 * message — so this only says what the panel is DOING, never which screen is
 * mounted. `ChatStage` renders in all four.
 */
type Stage = "gate" | ChatStageName;

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
 * How long the typing indicator must remain visible once shown.
 *
 * A floor, not a delay. The dots exist to say "something is happening", and
 * something that appears and vanishes inside two frames reads as a glitch
 * rather than as a signal. 400ms is long enough to register as a beat and short
 * enough that nobody waits on it — and crucially it is only ever a floor: a
 * response slower than this waits zero extra milliseconds. Latency is never
 * faked, only smoothed.
 */
const TYPING_FLOOR_MS = 400;

/** Resolves once the indicator has had its floor, immediately if it already has. */
function holdTyping(shownAt: number): Promise<void> {
  const remaining = TYPING_FLOOR_MS - (Date.now() - shownAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, remaining));
}

/**
 * The thread's first entry: the gate card, and nothing before it.
 *
 * Its text is empty because the card carries no message of its own — the
 * labeled fields and the button are the ask. `Transcript` renders this kind as
 * the form alone.
 *
 * A lazy initializer rather than an effect. The gate is not synchronized from
 * anything external — it is simply what the log contains before anyone has said
 * anything — so seeding it in an effect would mean rendering an empty panel and
 * then immediately re-rendering it, which is the cascading render the
 * `set-state-in-effect` rule exists to catch.
 *
 * It is a function, not a constant, because `createMessage` mints a uuid and
 * stamps a send time: a module-level constant would hand every visitor the same
 * id and freeze the timestamp at the moment the bundle was evaluated, and a
 * restart would reuse both.
 */
function openingLog(): Message[] {
  return [createMessage("bot", "gate", "", 0)];
}

/** Focusable descendants, for the focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ScorecardWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("gate");
  const [activeTab, setActiveTab] = useState(SCORECARD_TAB);

  const [contact, setContact] = useState<ScorecardContact | null>(null);

  /**
   * WHAT IS ON SCREEN. Append-only, and the only thing the transcript reads.
   *
   * Nothing here is ever removed, mutated or reordered except the transient
   * typing indicator, which is dropped in the same update that appends the
   * message it was standing in for. Every other entry is permanent from the
   * moment it lands.
   */
  const [messages, setMessages] = useState<Message[]>(openingLog);
  /**
   * Which exchange the next append belongs to. Advances once per completed
   * turn, so a question and the answer to it carry the same index and the log
   * can be read back as discrete exchanges.
   *
   * It is also the second half of the answer control's key — see `ChatStage` —
   * so it has to be state and not a ref: a ref change does not re-render, and
   * the remount that resets the chips after a turn would never happen. The ref
   * beside it is the value the async handler reads, because a handler that
   * awaited a response is holding a stale closure over the state.
   */
  const [turnIndex, setTurnIndex] = useState(0);
  const turnIndexRef = useRef(0);

  /** Advances both halves together. The only place either one moves. */
  const advanceTurn = useCallback((next: number) => {
    turnIndexRef.current = next;
    setTurnIndex(next);
  }, []);

  /** Completed turns, oldest first. Protocol state: the audit trail we post back. */
  const [turns, setTurns] = useState<ScorecardTurn[]>([]);
  /**
   * Extractions, accumulated separately from the turns they came from.
   *
   * They could be derived — every turn carries its own — but they are held
   * apart because enrichment can seed one with no turn behind it, and because
   * this list is what gets posted to the analysis. Keeping it as its own thing
   * makes "what the report is written from" a variable you can point at.
   */
  const [extractions, setExtractions] = useState<ScorecardExtraction[]>([]);
  /** Intent ids the server has marked satisfied, however they were satisfied. */
  const [satisfied, setSatisfied] = useState<string[]>([]);

  /*
   * `replies` and `unaskedIntents` are GONE, and their absence is the fix.
   *
   * `replies` was a map of acknowledgements keyed by intent, read back during
   * render to decide which line to draw against which turn — the off-by-one.
   * That line is gone from the product entirely; what remains of the same idea,
   * the quote on a question, is copied in at append time, so there is no map to
   * consult and no way to consult the wrong entry.
   *
   * `unaskedIntents` existed to keep the projection from inventing exchanges
   * for intents enrichment had answered. An append-only log cannot invent one:
   * a question that was never asked was never appended.
   */

  /** The question on screen. Written by the server, never by this component. */
  const [question, setQuestion] = useState<ScorecardQuestion | null>(null);
  /** How many questions have actually been ASKED, for the progress row. */
  const [asked, setAsked] = useState(0);

  const [pending, setPending] = useState(false);
  const [gateErrors, setGateErrors] = useState<Record<string, string>>({});

  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState<ScorecardRecommendation[]>([]);
  /** Whether the emailed report actually went out. Decides the confirmation line. */
  const [emailed, setEmailed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  /** Stable for the whole session, and reused by the chat tab in V2. */
  const sessionIdRef = useRef<string | null>(null);
  /**
   * Whether a turn is posting right now.
   *
   * A ref and not state, because it has to be readable synchronously — see the
   * guard in `answerQuestion`. `pending` still exists alongside it to drive the
   * disabled styling, which is a render concern and can afford to lag a frame.
   */
  const inFlightRef = useRef(false);

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

  const startSession = useCallback(
    async (entered: ScorecardContact, honeypot: string) => {
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

        if (!body.ok || !body.question) {
          setGateErrors(body.errors ?? {});
          return;
        }

        setContact(entered);

        /*
         * Enrichment may have satisfied an intent for us. Those are seeded here
         * as extractions with no turn behind them, and recorded as unasked so
         * the transcript does not render an exchange that never happened.
         */
        const seeded = body.satisfiedIntents ?? [];
        setExtractions(body.extractions ?? []);
        setSatisfied(seeded);

        /*
         * The opening question is APPENDED after the gate card, never written
         * over it. Handing over an address is the first thing that happens in
         * this conversation, so it stays in the log and stays scrollable to —
         * replacing the log here would be the append-only rule broken on the
         * very first turn.
         *
         * The visitor's "message" is their email, because that is the answer
         * they actually gave to "where should Alan send the results?".
         *
         * Intents enrichment already satisfied are simply never appended — we
         * did not ask them, so they are not part of the conversation, and there
         * is no "unasked" set to maintain because a log only contains what
         * actually happened.
         */
        advanceTurn(0);
        // Captured outside the updater: the narrowing from the `!body.question`
        // guard above does not survive into the closure.
        const opening = body.question;
        setMessages((log) => [
          ...log,
          createMessage("user", "answer", entered.email, 0),
          createMessage("bot", "question", opening.text, 0),
        ]);

        setQuestion(body.question);
        setAsked(1);
        setStage("questions");
      } catch {
        // The lead may or may not have landed; what is certain is that this
        // person is looking at a form that did nothing. Say so, do not pretend.
        setGateErrors({ email: "That did not go through. Please try again." });
      } finally {
        setPending(false);
      }
    },
    [advanceTurn],
  );

  /**
   * The final call. Posts the extractions — and, separately, the turns for the
   * audit trail — and shows what comes back.
   *
   * The server never fails this outright: a degraded report is still a report,
   * so there is no failure branch here beyond the network itself. What DOES
   * vary is `emailed`, which decides whether the confirmation line may promise
   * an email or has to state what actually happened.
   */
  const requestReport = useCallback(
    async (
      finalExtractions: ScorecardExtraction[],
      finalTurns: ScorecardTurn[],
      person: ScorecardContact,
    ) => {
      setStage("analyzing");
      // The report being written is a message like any other, so scrolling up
      // from it reaches everything that was said.
      const analyzingIndex = turnIndexRef.current;
      setMessages((log) => [
        ...withoutTyping(log),
        createMessage("bot", "analyzing", analyzingLine, analyzingIndex),
      ]);

      try {
        const response = await fetch(SCORECARD_ANALYZE_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId(),
            contact: person,
            extractions: finalExtractions,
            turns: finalTurns,
            sourcePage: window.location.pathname,
          }),
        });

        const body = (await response.json()) as ScorecardAnalyzeResponse;

        setSummary(body.summary);
        setRecommendations(body.recommendations ?? []);
        setEmailed(Boolean(body.ok && body.emailed));
      } catch {
        // Nothing came back at all, so nothing was sent either. The results
        // screen renders with an empty shortlist and the honest line.
        setEmailed(false);
      } finally {
        /*
         * The results replace the analyzing indicator, which is the same
         * substitution the typing indicator gets: a placeholder standing in for
         * a message that had not arrived, removed by the append that fulfills
         * it. Every real message above it is untouched.
         */
        setMessages((log) => [
          ...log.filter((message) => message.kind !== "analyzing"),
          createMessage("bot", "results", "", analyzingIndex),
        ]);
        setStage("results");
      }
    },
    [],
  );

  const answerQuestion = useCallback(
    async (answer: string) => {
      const current = question;
      if (!current || !contact) return;
      /*
       * The double-submit guard, and it is a ref rather than the `pending`
       * state on purpose. Two clicks inside the same frame both read the old
       * value of a state variable — `pending` has not re-rendered yet — so a
       * state check lets the second through and posts the turn twice. A ref
       * mutates synchronously, so the second click sees the flag the first one
       * just set and returns. This is what makes rapid double-clicking a chip
       * submit exactly once.
       */
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      // Read from the ref, not the state: this handler awaits a response and
      // then keeps using this value, so a stale closure would file the next
      // question under the previous exchange.
      const exchange = turnIndexRef.current;
      setPending(true);

      /*
       * THE OPTIMISTIC APPEND. Their answer goes into the log before the
       * request leaves, and the question above it is not touched — it stays
       * exactly where it is, because nothing in this component can remove a
       * message that has been appended.
       *
       * Then the typing indicator, so the wait has a visible owner in the
       * bot's position rather than an empty panel.
       */
      setMessages((log) => [
        ...withoutTyping(log),
        createMessage("user", "answer", answer, exchange),
        createMessage("bot", "typing", "", exchange),
      ]);

      // Stamped before the request so the floor covers the whole round trip.
      const typingShownAt = Date.now();

      try {
        const response = await fetch(SCORECARD_TURN_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId(),
            contact,
            turns,
            satisfiedIntents: satisfied,
            intentId: current.intentId,
            question: current.text,
            answer,
          }),
        });

        const body = (await response.json()) as ScorecardTurnResponse;

        /*
         * A rejected turn leaves the protocol exactly as it was — the question
         * is still current and still answerable. The LOG is not rewound: they
         * did send that message, and deleting it to tidy up would both break
         * the append-only rule and lose what they wrote. The typing indicator
         * goes, since nothing is in flight any more.
         */
        if (!body.ok) {
          setMessages(withoutTyping);
          return;
        }

        /*
         * The indicator has a floor but no padding beyond it. A response that
         * takes 900ms waits zero extra; one that returns in 40ms is held to
         * 400ms so the dots register as a beat rather than a flicker.
         */
        await holdTyping(typingShownAt);

        const turn: ScorecardTurn = {
          intentId: current.intentId,
          question: current.text,
          rawAnswer: answer,
          extraction: body.extraction,
        };

        const nextTurns = [...turns, turn];
        const nextExtractions = [...extractions, body.extraction];

        setTurns(nextTurns);
        setExtractions(nextExtractions);
        setSatisfied(body.satisfiedIntents);

        /*
         * THE APPEND THAT USED TO BE OFF BY ONE.
         *
         * The answer and `body.nextQuestion` are combined into ONE message
         * here, both from the same response, in one update. There is no lookup
         * by intent id and no prior state consulted, so the quote structurally
         * cannot belong to a different turn than the question carrying it —
         * they are fields of the same object.
         *
         * The quote is what makes the next question read as a reply. It carries
         * a copy of what the visitor just said, so the bubble can show what it
         * is answering the way a WhatsApp reply does, instead of relying on the
         * bubble above it to supply that context.
         *
         * The whole exchange lands atomically, which is also why the typing
         * indicator is replaced by real content in a single commit rather than
         * flashing through an intermediate state.
         */
        const nextQuestion = body.complete ? null : body.nextQuestion;
        setMessages((log) => {
          const appended = withoutTyping(log);
          if (nextQuestion) {
            appended.push(createMessage("bot", "question", nextQuestion.text, exchange + 1));
          }
          return appended;
        });

        advanceTurn(exchange + 1);

        if (!nextQuestion) {
          setQuestion(null);
          await requestReport(nextExtractions, nextTurns, contact);
          return;
        }

        setQuestion(nextQuestion);
        setAsked((count) => count + 1);
      } catch {
        // The turn did not land. The question is still on screen and still
        // answerable, which is the right place to leave someone. Their message
        // stays in the log; only the indicator goes.
        setMessages(withoutTyping);
      } finally {
        inFlightRef.current = false;
        setPending(false);
      }
    },
    [advanceTurn, contact, extractions, question, requestReport, satisfied, turns],
  );

  /**
   * Start over.
   *
   * Clears everything the session accumulated and returns to the GATE, not to
   * the first question — a restart is a new session, gets a new `session_id`,
   * and the gate is where a session begins. Nothing already sent is retracted:
   * if the report was emailed, it was emailed, and this control does not
   * pretend otherwise.
   */
  const restart = useCallback(() => {
    sessionIdRef.current = null;

    setContact(null);
    /*
     * The log is emptied and re-seeded with a fresh gate card. This is the one
     * moment the append-only rule does not apply, because it is not an edit to
     * a conversation — it is the end of one and the start of another. The new
     * session mints a new id and draws its own opener.
     */
    setMessages(openingLog());
    advanceTurn(0);
    inFlightRef.current = false;
    setTurns([]);
    setExtractions([]);
    setSatisfied([]);
    setQuestion(null);
    setAsked(0);
    setPending(false);
    setGateErrors({});
    setSummary("");
    setRecommendations([]);
    setEmailed(false);

    setStage("gate");
  }, [advanceTurn]);

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
             * ONE component for every phase. The gate is a card in the thread
             * and the results are its last message, so there is no screen to
             * switch between — which is what lets the conversation stay
             * scrollable from the first message to the last at any point.
             */}
            <ChatStage
              messages={messages}
              turnIndex={turnIndex}
              question={stage === "questions" ? (question ?? undefined) : undefined}
              position={asked}
              showProgress={asked > 0}
              pending={pending}
              summary={summary}
              recommendations={recommendations}
              emailed={emailed}
              onAnswer={answerQuestion}
              onRestart={restart}
              gatePending={pending}
              gateErrors={gateErrors}
              onGateSubmit={startSession}
              // The gate is answered exactly when we have a contact.
              gateDone={contact !== null}
            />
          </div>
        </div>
      )}
    </>
  );
}
