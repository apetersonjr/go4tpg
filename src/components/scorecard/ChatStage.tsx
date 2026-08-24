"use client";

import { Composer } from "@/components/scorecard/Composer";
import { Transcript } from "@/components/scorecard/Transcript";
import type { ChatStageName, ScorecardMessage } from "@/components/scorecard/messages";
import type { ScorecardQuestion } from "@/content/scorecard";
import type { ScorecardRecommendation } from "@/lib/scorecard";

/**
 * The chat: a transcript that grows, over a composer that does not move.
 *
 * This file exists for one line of layout. The transcript is `flex-1 min-h-0`
 * and the composer is `flex-none`, so all the slack in a fixed-height panel
 * goes to the conversation and the controls stay put at the bottom. That
 * contract is the difference between a chat window and the panel this used to
 * be, and it is worth somewhere obvious to state it.
 *
 * The three late stages — asking, reading, results — are one component rather
 * than three branches, because the transcript spans all of them. The results
 * are the last message in the log, not a screen that replaces it, which is what
 * lets someone scroll up from their reading and see everything they answered.
 */

type ChatStageProps = {
  messages: ScorecardMessage[];
  /** Absent once the questions are done and the reading is being produced. */
  question?: ScorecardQuestion;
  position: number;
  pending: boolean;
  stage: ChatStageName;
  summary: string;
  recommendations: ScorecardRecommendation[];
  readingFailed: boolean;
  onAnswer: (answer: string) => void;
};

export function ChatStage({
  messages,
  question,
  position,
  pending,
  stage,
  summary,
  recommendations,
  readingFailed,
  onAnswer,
}: ChatStageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Transcript
        messages={messages}
        summary={summary}
        recommendations={recommendations}
        readingFailed={readingFailed}
      />
      {/*
       * The composer is only present while there is something to answer. Once
       * the reading is being produced there is nothing to type, so it goes and
       * the transcript takes the space back — the panel itself does not resize,
       * because its height is fixed.
       */}
      {stage === "questions" && question && (
        <Composer
          // Keyed so each question gets fresh state rather than inheriting the
          // previous one's chips and text.
          key={question.id}
          question={question}
          position={position}
          pending={pending}
          onAnswer={onAnswer}
        />
      )}
    </div>
  );
}
