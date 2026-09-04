"use client";

import { ChipGroup, TextComposer } from "@/components/scorecard/Composer";
import { Transcript } from "@/components/scorecard/Transcript";
import type { Message } from "@/components/scorecard/messages";
import { intentCount } from "@/data/scorecard-intents";
import type { ScorecardContact, ScorecardQuestion, ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The thread: a conversation that grows, over a message bar that does not move.
 *
 * The layout contract is one line and it is strict. The transcript is
 * `flex-1 min-h-0` and everything below it is `flex-none`, so all the slack in a
 * fixed-height panel goes to the conversation — AND the transcript is the only
 * thing in the panel that scrolls. Nothing down here may take an `overflow` or a
 * height cap of its own, because a second scrollbar in a 380px panel makes it
 * ambiguous which region owns the wheel.
 *
 * That is why the chips are handed to `Transcript` as a slot instead of being
 * rendered here: they are quick replies to the message above them, so they
 * scroll with it. What stays pinned is only what must never scroll away — the
 * message bar, and the progress row that describes the question being asked
 * rather than the history.
 *
 * Every stage from the gate onward is this one component, because the thread
 * spans all of them. The gate is a card in the conversation and the results are
 * the last message in it — neither is a screen that replaces what came before,
 * which is what lets someone scroll up from their report and see the whole
 * exchange that produced it.
 */

type ChatStageProps = {
  messages: Message[];
  /**
   * How many turns have completed. Used only as part of the control key — see
   * `answerKey` below.
   */
  turnIndex: number;
  /** Absent before the gate is answered, and once the report is being written. */
  question?: ScorecardQuestion;
  /** 1-based position for the progress row. 0 before the first question. */
  position: number;
  pending: boolean;
  /** Whether the progress row has anything to describe yet. */
  showProgress: boolean;
  summary: string;
  recommendations: ScorecardRecommendation[];
  emailed: boolean;
  onAnswer: (answer: string) => void;
  onRestart: () => void;
  gatePending: boolean;
  gateErrors: Record<string, string>;
  onGateSubmit: (contact: ScorecardContact, honeypot: string) => void;
  gateDone: boolean;
};

export function ChatStage({
  messages,
  turnIndex,
  question,
  position,
  pending,
  showProgress,
  summary,
  recommendations,
  emailed,
  onAnswer,
  onRestart,
  gatePending,
  gateErrors,
  onGateSubmit,
  gateDone,
}: ChatStageProps) {
  const isChips = question?.format === "chips";

  /*
   * The identity of the control currently on screen: this question, on this
   * attempt.
   *
   * Keying on the intent alone was not enough. It resets the chips and the text
   * box when the question CHANGES, which covers the happy path — but a turn
   * that fails leaves the same question up, so the key would not change and the
   * control would keep the state it had when it submitted: a spent latch and a
   * selection already sent. Folding in the turn index makes a failed attempt a
   * new mount too, so the retry starts from a clean control either way.
   */
  const answerKey = question ? `${question.intentId}:${turnIndex}` : "none";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Transcript
        messages={messages}
        summary={summary}
        recommendations={recommendations}
        emailed={emailed}
        onRestart={onRestart}
        gatePending={gatePending}
        gateErrors={gateErrors}
        onGateSubmit={onGateSubmit}
        gateDone={gateDone}
        chips={
          isChips && question ? (
            <ChipGroup
              // Fresh chip state per question AND per attempt — see `answerKey`.
              key={answerKey}
              question={question}
              pending={pending}
              onAnswer={onAnswer}
            />
          ) : undefined
        }
      />

      {/*
       * The message bar is always mounted, exactly as a messenger's is. It is
       * disabled rather than removed when there is nothing to type — before the
       * gate is filled, mid-turn, or on a chip question — because a bar that
       * came and went every other question would make the panel jump.
       */}
      <TextComposer key={answerKey} question={question} pending={pending} onAnswer={onAnswer} />

      {/*
       * The progress row, below the bar and pinned. It describes the question
       * being asked rather than the history, so in a scrolling log it would
       * scroll out of sight — which defeats the point of having it.
       *
       * Absent until the first question exists, because "0 of 6" against an
       * empty bar is noise on the one screen where the visitor has not started.
       */}
      {showProgress && (
        <div className="flex flex-none items-center gap-3 border-t border-[#eef2f6] bg-white px-4 pt-2 pb-2.5">
          <span className="text-tpg-primary flex-none text-[10.5px] font-bold tracking-[0.14em] uppercase">
            {position} of {intentCount}
          </span>
          {/*
           * `position` counts questions ASKED, not intents satisfied, so an
           * intent enrichment answered for us shortens the scorecard without
           * the bar ever going backward or overshooting its maximum.
           */}
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={intentCount}
            aria-valuenow={position}
            aria-label={`Question ${position} of ${intentCount}`}
            className="h-[3px] flex-1 rounded-full bg-[#eef2f6]"
          >
            <div
              className="bg-tpg-cta h-[3px] rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(position / intentCount, 1) * 100}%` }}
            />
          </div>
          {question && (
            <span className="text-tpg-muted flex-none text-[11px]">{question.topic}</span>
          )}
        </div>
      )}
    </div>
  );
}
