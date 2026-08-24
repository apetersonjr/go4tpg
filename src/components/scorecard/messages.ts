/**
 * The transcript's data model.
 *
 * The message list is *derived* from the answers rather than accumulated
 * alongside them. `answers` already grows one entry per question and each entry
 * carries the question text, not just its id, so the bot's side of the
 * conversation can be rebuilt from it exactly. Keeping a second `messages`
 * array in state would mean two sources of truth that have to be kept in step
 * through every path, including the ones that fail.
 *
 * The one thing the answers cannot reconstruct is the acknowledgement, because
 * it is written by the model rather than typed by the person. That is why the
 * widget holds an `acks` map — see `ScorecardWidget`.
 *
 * Pure: no JSX, no hooks, no imports from anything that touches the network.
 */

import type { ScorecardQuestion } from "@/content/scorecard";
import type { ScorecardAnswer } from "@/lib/scorecard";

export type ScorecardMessage =
  | { kind: "bot-question"; id: string; text: string }
  | { kind: "user-answer"; id: string; text: string }
  | { kind: "bot-ack"; id: string; text: string }
  | { kind: "bot-typing"; id: string }
  | { kind: "bot-analysing"; id: string }
  | { kind: "results"; id: string };

/** Stages that render as the chat. Intro and gate have their own layouts. */
export type ChatStageName = "questions" | "analysing" | "results";

type BuildInput = {
  answers: ScorecardAnswer[];
  /** Acknowledgement text keyed by the question id it reacted to. */
  acks: Record<string, string>;
  /** Questions answered by enrichment rather than by the person. */
  prefilledIds: Set<string>;
  stage: ChatStageName;
  /** The question currently being asked, absent once the questions run out. */
  question?: ScorecardQuestion;
  pending: boolean;
};

/*
 * Ids are stable across renders and derived from the question id, never from
 * the array position. The question bubble in particular has to keep the same
 * id before and after it is answered — it moves from "the current question" to
 * "a question in the history" and must not remount, or it would replay its
 * entrance animation at the exact moment the person answers it.
 */
const questionId = (id: string) => `q:${id}`;
const answerId = (id: string) => `a:${id}`;
const ackId = (id: string) => `k:${id}`;

export function buildMessages({
  answers,
  acks,
  prefilledIds,
  stage,
  question,
  pending,
}: BuildInput): ScorecardMessage[] {
  const messages: ScorecardMessage[] = [];

  for (const answer of answers) {
    /*
     * Enrichment answers are invisible. Apollo told us the headcount, so the
     * question was never put to the person — rendering it as though we had
     * asked, and them as though they had replied, would be a fabricated
     * exchange. They are still sent to n8n; they just are not shown as chat.
     */
    if (prefilledIds.has(answer.questionId)) continue;

    messages.push({
      kind: "bot-question",
      id: questionId(answer.questionId),
      text: answer.question,
    });

    // A skipped free-text question is a real answer of "". There is nothing to
    // show as a sent message, so the bubble is omitted rather than left blank.
    if (answer.answer) {
      messages.push({
        kind: "user-answer",
        id: answerId(answer.questionId),
        text: answer.answer,
      });
    }

    const ack = acks[answer.questionId];
    if (ack) {
      messages.push({ kind: "bot-ack", id: ackId(answer.questionId), text: ack });
    }
  }

  if (stage === "questions") {
    /*
     * While a turn is in flight the next question does not exist yet, so the
     * tail of the transcript is the typing bubble. Once it resolves, the
     * question takes its place. Both are the last message, so the scroll
     * position does not jump between the two.
     */
    if (pending) {
      messages.push({ kind: "bot-typing", id: "typing" });
    } else if (question) {
      messages.push({
        kind: "bot-question",
        id: questionId(question.id),
        text: question.text,
      });
    }
  }

  if (stage === "analysing") messages.push({ kind: "bot-analysing", id: "analysing" });
  if (stage === "results") messages.push({ kind: "results", id: "results" });

  return messages;
}
