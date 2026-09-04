import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import type { ScorecardTurnResponse } from "@/lib/scorecard";
import { runTurn } from "@/lib/scorecardModel";
import {
  validateAnswer,
  validateContact,
  validateQuestion,
  validateSatisfiedIntents,
  validateSessionId,
  validateTurns,
} from "@/lib/validation/scorecard";

export const runtime = "nodejs";

/**
 * One conversational turn: an answer in, and the reading of that answer plus
 * the next question out.
 *
 * Stateless, like `/api/berth` — the widget holds the session and posts the
 * full history each turn. No database in V1, and none needed: the session is
 * small, and the only copy that has to outlive the tab is the one n8n already
 * has.
 *
 * This route never dead-ends the visitor. `runTurn` retries once and then
 * falls back to the intent's default wording, so a slow or unconfigured model
 * costs the adaptive phrasing and nothing else. The only 400s here are for
 * requests that are not recognizably a session.
 */

/** Six turns per session, so this is several sessions' worth. */
const RATE_LIMIT = { windowMs: 60_000, max: 20 };

function json(body: ScorecardTurnResponse, status: number) {
  return NextResponse.json(body, { status });
}

/** What a rejected request looks like. The widget shows no bubble and stays put. */
const REJECTED: ScorecardTurnResponse = {
  ok: false,
  extraction: { intentId: "", signals: [], evidence: "", confidence: "low" },
  satisfiedIntents: [],
  nextQuestion: null,
  complete: false,
};

export async function POST(request: Request) {
  if (rateLimited("scorecard-turn", clientIp(request), RATE_LIMIT)) {
    return json(REJECTED, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(REJECTED, 400);
  }

  const input = (body ?? {}) as Record<string, unknown>;

  const sessionId = validateSessionId(input.sessionId);
  if (!sessionId) return json(REJECTED, 400);

  const contact = validateContact(input.contact);
  if (!contact.ok) return json(REJECTED, 400);

  const result = await runTurn({
    sessionId,
    contact: contact.data,
    /*
     * The history is re-validated rather than trusted. It arrives from the
     * client, and its extractions are what the report will eventually be
     * written from — see the note at the top of `validation/scorecard.ts`.
     */
    turns: validateTurns(input.turns),
    satisfiedIntents: validateSatisfiedIntents(input.satisfiedIntents),
    intentId: String(input.intentId ?? ""),
    question: validateQuestion(input.question),
    answer: validateAnswer(input.answer),
  });

  return json(
    {
      ok: true,
      extraction: result.extraction,
      satisfiedIntents: result.satisfiedIntents,
      nextQuestion: result.nextQuestion,
      complete: result.complete,
    },
    200,
  );
}
