"use client";

import { useEffect, useRef, useState } from "react";
import {
  composerLockedPlaceholder,
  composerPlaceholder,
  continueLabel,
  otherChipLabel,
  otherPlaceholder,
  sendLabel,
} from "@/content/scorecard";
import { cn } from "@/lib/cn";
import type { ScorecardQuestion } from "@/lib/scorecard";

/**
 * The answer controls, in two pieces that live in two different places.
 *
 * `ChipGroup` renders INSIDE the transcript, at the end of the message flow.
 * `TextComposer` is the pinned bar at the foot of the panel. They are in one
 * file because they are one control split by layout, and reading them apart
 * would hide why neither has an `overflow` of its own.
 *
 * WHY THE CHIPS ARE IN THE THREAD. Quick replies belong to the conversation:
 * they are the answers being offered to the question directly above them, so
 * they scroll with it. Keeping them in the pinned area needed a `max-h` and an
 * `overflow-y-auto`, which produced two nested scrollbars in a 380px panel and
 * made it a guessing game which one owned the wheel. Now the transcript is the
 * only scrollable region and a long option set is simply reachable.
 */

type ChipGroupProps = {
  question: ScorecardQuestion;
  pending: boolean;
  onAnswer: (answer: string) => void;
};

/**
 * How long a selection is left visible before it is submitted.
 *
 * Auto-advance without this reads as a misclick: the chip is tapped and the
 * view has already changed, so there is no moment where the choice is seen to
 * register. 150ms is one held beat — long enough for the fill to land and be
 * perceived, short enough that it is not a wait.
 */
const ADVANCE_DELAY_MS = 150;

/**
 * A quick reply.
 *
 * White with a blue rule and blue label — an offered action, distinct from both
 * the bot's white message bubble (no border, softer text) and the visitor's
 * filled blue one. Selecting inverts it to solid ink, so the choice is visible
 * for the beat before the view moves on.
 */
const chipClass = (active: boolean) =>
  cn(
    "cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-semibold",
    "transition-[background-color,border-color,color,transform] duration-200 ease-out",
    "active:scale-[0.97]",
    active
      ? "border-tpg-ink bg-tpg-ink text-white"
      : "border-[#bfd6e6] bg-white text-tpg-primary hover:border-tpg-primary hover:bg-tpg-tint",
    "disabled:cursor-default disabled:opacity-60",
  );

export function ChipGroup({ question, pending, onAnswer }: ChipGroupProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [showOther, setShowOther] = useState(false);
  /**
   * The 150ms hand-off window, latched so nothing can submit twice inside it.
   *
   * A single-select submission sits behind a timeout, and for that window
   * `pending` is still false — the request has not started — so every chip is
   * still live and a second tap would schedule a second submit. `advancing`
   * closes the window: from the tap until `pending` takes over, and then for
   * the rest of this group's life, because once an answer has been sent this
   * particular set of chips is spent either way.
   *
   * It never has to be un-latched, and that is a property of the call site
   * rather than of this component. `ChatStage` keys the group on the turn it
   * belongs to, so a turn that succeeds mounts a fresh group for the next
   * question and a turn that FAILS mounts a fresh group for the same one — with
   * an empty selection and a clear latch, ready to be answered again. Resetting
   * in place would mean an effect watching `pending`, which is a cascading
   * render to recover state a remount gives us for free.
   */
  const [advancing, setAdvancing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A pending timer whose component has gone would fire into nothing; clearing
  // it also covers the remount that happens when the question changes.
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const single = question.maxSelections === 1;
  /*
   * Single-select advances on tap, so it renders no button at all — pressing
   * Next after picking the only pick you get is friction with nothing behind
   * it. Multi-select keeps one, because the visitor may want a second option
   * and only they know when they are done choosing.
   */
  const needsConfirm = !single;
  const locked = pending || advancing;

  /** Chips and the free-text box combine into one answer line. */
  function composed(picks: string[]): string {
    const parts = [...picks];
    if (showOther && other.trim()) parts.push(other.trim());
    return parts.join(", ");
  }

  function toggle(option: string) {
    if (locked) return;

    if (single) {
      /*
       * Show the choice, then send it. The state update paints the fill; the
       * timeout is the beat that lets it be seen before the view moves on.
       *
       * `setAdvancing` is batched with `setSelected`, so the same commit that
       * fills the chip also disables the group — there is no frame in which the
       * selection is visible and the chips are still tappable.
       */
      setSelected([option]);
      setAdvancing(true);
      timerRef.current = setTimeout(() => onAnswer(option), ADVANCE_DELAY_MS);
      return;
    }

    setSelected((current) => {
      if (current.includes(option)) return current.filter((entry) => entry !== option);
      // A capped multi-select drops the oldest so the last tap is always honored.
      const max = question.maxSelections;
      if (max !== null && current.length >= max) return [...current.slice(1), option];
      return [...current, option];
    });
  }

  const answer = composed(selected);

  function send() {
    if (locked || !answer) return;
    setAdvancing(true);
    onAnswer(answer);
  }

  return (
    /*
     * Right-aligned and wrapping, because these are the visitor's own words
     * waiting to be said — they sit on the side their bubble will appear on, so
     * a tap looks like the chip becoming the message.
     *
     * No `overflow` and no height cap anywhere in here. That is the rule which
     * keeps the panel to one scrollbar, and it is easy to reintroduce by reflex
     * the next time a long option set looks cramped — the fix for that is that
     * the transcript scrolls, which it already does.
     */
    <div
      className="sc-step-in mt-1 flex flex-wrap justify-end gap-[7px]"
      aria-busy={pending || undefined}
    >
      {question.options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={selected.includes(option)}
          disabled={locked}
          onClick={() => toggle(option)}
          className={chipClass(selected.includes(option))}
        >
          {option}
        </button>
      ))}

      {question.allowOther && (
        <button
          type="button"
          aria-pressed={showOther}
          disabled={locked}
          onClick={() => setShowOther((current) => !current)}
          className={chipClass(showOther)}
        >
          {otherChipLabel}
        </button>
      )}

      {question.allowOther && showOther && (
        <input
          type="text"
          autoFocus
          value={other}
          disabled={locked}
          placeholder={otherPlaceholder}
          onChange={(event) => setOther(event.target.value)}
          aria-label={otherChipLabel}
          onKeyDown={(event) => {
            // On a single-select question the chips have already advanced, so
            // Enter here is the "Something else" text being sent on its own.
            if (event.key !== "Enter") return;
            event.preventDefault();
            send();
          }}
          className="border-tpg-border text-tpg-ink focus:border-tpg-primary focus:ring-tpg-primary/25 w-full rounded-full border bg-white px-4 py-2.5 text-[13.5px] outline-none focus:ring-2 disabled:opacity-60"
        />
      )}

      {needsConfirm && (
        <button
          type="button"
          onClick={send}
          // Enabled by one selection, not by the cap: "up to 2" means one is a
          // complete answer, and a button that stayed dead until a second pick
          // would be demanding a choice that was never required.
          disabled={locked || !answer}
          className={cn(
            "bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover",
            "cursor-pointer rounded-full px-5 py-2 text-[13px] font-bold text-white",
            "transition-[background-color,transform] duration-200 ease-out",
            "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
            "disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0",
          )}
        >
          {continueLabel}
        </button>
      )}
    </div>
  );
}

type TextComposerProps = {
  /** Absent while the gate card is still unanswered, which disables the bar. */
  question?: ScorecardQuestion;
  pending: boolean;
  onAnswer: (answer: string) => void;
};

/**
 * The pinned message bar: a pill input and a round send button.
 *
 * Always present, exactly as a messenger's is — the bar is the frame the
 * conversation happens in, so it does not appear and vanish per question. It is
 * disabled rather than removed when there is nothing to type: before the gate
 * is filled, while a turn is in flight, and on a chip question whose answer is
 * a tap rather than a sentence.
 *
 * There is no Skip. All six intents have to be satisfied for the recommendation
 * engine to produce anything, so a skipped question does not shorten the
 * scorecard — it breaks the report the scorecard exists to produce.
 */
export function TextComposer({ question, pending, onAnswer }: TextComposerProps) {
  const [text, setText] = useState("");
  const value = text.trim();

  /*
   * A chip question's answer is a tap, not a sentence, so the bar is inert
   * while one is on screen — but it stays visible, because a message bar that
   * disappears every other question makes the panel jump.
   */
  const chipsOnly = question?.format === "chips";
  const disabled = pending || !question || chipsOnly;
  const canSend = !disabled && value.length > 0;

  function submit() {
    if (!canSend) return;
    onAnswer(value);
    setText("");
  }

  return (
    <div className="border-tpg-border flex flex-none items-center gap-2.5 border-t bg-white px-3 py-2.5">
      <textarea
        rows={1}
        value={text}
        disabled={disabled}
        placeholder={question ? composerPlaceholder : composerLockedPlaceholder}
        aria-label={question?.text ?? composerLockedPlaceholder}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          // Enter sends, Shift+Enter breaks the line. This reads as a message
          // box, so it should behave like one.
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        /*
         * `resize-none` and one row, with its own small scroll. A long answer
         * grows the field to at most a few lines and then scrolls inside it,
         * so the panel's geometry stays a property of the panel rather than of
         * what someone typed.
         */
        className="bg-tpg-chat-ground border-tpg-border text-tpg-ink focus:border-tpg-primary max-h-[88px] min-h-0 flex-1 resize-none rounded-[20px] border px-4 py-2.5 text-[13.5px] leading-normal outline-none placeholder:text-[#a7b5c1] disabled:opacity-70"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        aria-label={sendLabel}
        className={cn(
          "flex h-10 w-10 flex-none items-center justify-center rounded-full text-[15px]",
          "transition-[background-color,transform] duration-200 ease-out",
          canSend
            ? "bg-tpg-cta hover:bg-tpg-cta-hover cursor-pointer text-white hover:scale-105"
            : "cursor-default bg-[#edf2f6] text-[#b9c7d2]",
        )}
      >
        {/* A paper plane, drawn rather than typed: a glyph would depend on the
            visitor having a font that carries it. */}
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
          <path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10.1 15.5 12 3.4 13.9z" />
        </svg>
      </button>
    </div>
  );
}
