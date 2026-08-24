"use client";

import { useState } from "react";
import {
  chipHintMulti,
  chipHintSingle,
  nextLabel,
  otherChipLabel,
  otherPlaceholder,
  questionCount,
  skipLabel,
} from "@/content/scorecard";
import type { ScorecardQuestion } from "@/content/scorecard";
import { cn } from "@/lib/cn";

type ComposerProps = {
  question: ScorecardQuestion;
  /** 1-based, for the "2 of 6" row. */
  position: number;
  pending: boolean;
  onAnswer: (answer: string) => void;
};

/**
 * The pinned input area: progress, then whatever control this question needs.
 *
 * This is the bottom half of what used to be `QuestionStep`. The question text
 * and the acknowledgement moved up into the transcript, where they belong as
 * messages; everything to do with *answering* stayed here and is unchanged.
 *
 * It does not animate on entry. The composer is a persistent surface now — the
 * frame the conversation happens in rather than something that arrives with
 * each question — and re-running an entrance on it every turn would reintroduce
 * exactly the restlessness this refactor removed. It is still keyed by question
 * id at the call site, so the chip and text state below still resets per
 * question; a remount with no animation class is simply invisible.
 */
export function Composer({ question, position, pending, onAnswer }: ComposerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [showOther, setShowOther] = useState(false);

  const isChips = question.kind === "chips";
  const maxSelections = isChips ? question.maxSelections : null;

  function toggle(option: string) {
    setSelected((current) => {
      if (current.includes(option)) return current.filter((entry) => entry !== option);
      // A single-select question replaces rather than accumulates; a capped
      // multi-select drops the oldest so the last tap is always honoured.
      if (maxSelections === 1) return [option];
      if (maxSelections !== null && current.length >= maxSelections) {
        return [...current.slice(1), option];
      }
      return [...current, option];
    });
  }

  /** Chips and the free-text box combine into one answer line. */
  function composed(): string {
    if (!isChips) return text.trim();
    const parts = [...selected];
    if (showOther && text.trim()) parts.push(text.trim());
    return parts.join(", ");
  }

  const answer = composed();
  const canAdvance = !pending && answer.length > 0;
  /** Free-text questions are skippable; a chip question with no pick is not. */
  const canSkip = !pending && !isChips && answer.length === 0;

  function submit() {
    if (pending) return;
    if (!canAdvance && !canSkip) return;
    onAnswer(answer);
  }

  const chipClass = (active: boolean) =>
    cn(
      "cursor-pointer rounded-full border px-3.5 py-2 text-[13px]",
      // Colour and transform together: the chip shades on hover and dips on
      // press, which is the whole feedback budget a control this small needs.
      "transition-[background-color,border-color,color,transform] duration-200 ease-out",
      "active:scale-[0.97]",
      active
        ? "border-tpg-ink bg-tpg-ink font-semibold text-white"
        : "border-tpg-border text-tpg-ink hover:border-tpg-primary hover:bg-tpg-tint",
      "disabled:cursor-default",
    );

  return (
    <div
      /*
       * `flex-none` keeps the composer out of the fight for vertical space: the
       * transcript above it takes everything left over, and this stays exactly
       * as tall as its content.
       */
      className="border-tpg-border flex flex-none flex-col gap-3 border-t bg-white px-5 pt-3.5 pb-4"
      aria-busy={pending || undefined}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-tpg-accent text-[11px] font-bold tracking-[0.16em] uppercase">
            {position} of {questionCount}
          </span>
          <span className="text-tpg-muted text-[11.5px]">{question.topic}</span>
        </div>
        {/*
         * Progress is announced as well as drawn: someone who cannot see the bar
         * still needs to know how much is left, which is the whole reason the
         * indicator exists.
         *
         * It lives in the composer rather than the transcript because it
         * describes the question being asked, not the history — in a scrolling
         * log it would scroll out of sight, which defeats the point.
         */}
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={questionCount}
          aria-valuenow={position}
          aria-label={`Question ${position} of ${questionCount}`}
          className="bg-tpg-tint h-[3px] overflow-hidden rounded-full"
        >
          <div
            className="bg-tpg-cta h-[3px] rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${(position / questionCount) * 100}%` }}
          />
        </div>
      </div>

      {isChips ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const active = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => toggle(option)}
                  className={chipClass(active)}
                >
                  {option}
                </button>
              );
            })}
            {question.allowOther && (
              <button
                type="button"
                aria-pressed={showOther}
                disabled={pending}
                onClick={() => setShowOther((current) => !current)}
                className={chipClass(showOther)}
              >
                {otherChipLabel}
              </button>
            )}
          </div>

          {question.allowOther && showOther && (
            <input
              type="text"
              autoFocus
              value={text}
              disabled={pending}
              placeholder={otherPlaceholder}
              onChange={(event) => setText(event.target.value)}
              aria-label={otherChipLabel}
              className="border-tpg-border text-tpg-ink focus:border-tpg-primary focus:ring-tpg-primary/25 w-full rounded-md border px-3.5 py-2.5 text-[13.5px] outline-none focus:ring-2"
            />
          )}
        </div>
      ) : (
        <textarea
          rows={3}
          value={text}
          disabled={pending}
          placeholder={question.placeholder}
          onChange={(event) => setText(event.target.value)}
          aria-label={question.text}
          onKeyDown={(event) => {
            // Enter sends, Shift+Enter breaks the line. This reads as a
            // message box, so it should behave like one.
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className="border-tpg-border text-tpg-ink focus:border-tpg-primary focus:ring-tpg-primary/25 w-full resize-y rounded-md border px-3.5 py-3 text-[13.5px] leading-relaxed outline-none focus:ring-2"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        {isChips ? (
          <span className="text-tpg-muted text-[12.5px]">
            {maxSelections === 1
              ? chipHintSingle
              : maxSelections !== null
                ? chipHintMulti(maxSelections)
                : chipHintSingle}
          </span>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canSkip}
            className="text-tpg-muted hover:text-tpg-ink cursor-pointer text-[12.5px] transition-colors disabled:cursor-default disabled:opacity-40"
          >
            {skipLabel}
          </button>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!canAdvance}
          className={cn(
            "bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover",
            "cursor-pointer rounded px-5 py-2.5 text-[13px] font-bold text-white",
            "transition-[background-color,transform] duration-200 ease-out",
            // The same half-step lift every CTA on the site uses, and
            // explicitly cancelled while disabled so a dead button never
            // appears to respond.
            "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
            "disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0",
          )}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
