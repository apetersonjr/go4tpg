import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import type { ScorecardTurnResponse } from "@/lib/scorecard";
import { generateAcknowledgement } from "@/lib/scorecardModel";
import { validateAnswers, validateContact, validateSessionId } from "@/lib/validation/scorecard";

export const runtime = "nodejs";

/**
 * One conversational turn: the answers so far in, one acknowledgement line out.
 *
 * Stateless, like `/api/berth` — the widget holds the session and posts the
 * full history each turn. No database in V1, and none needed: the transcript
 * is small, and the only copy that has to outlive the tab is the one n8n
 * already has.
 *
 * This route never fails the visitor. An acknowledgement is a line of
 * connective copy; if the model is slow, refuses, or is not configured at all,
 * an empty string comes back and the widget moves to the next question without
 * a bubble. Nothing here is allowed to stop someone reaching Q6.
 */

/** Six questions per session, so this is several sessions' worth of turns. */
const RATE_LIMIT = { windowMs: 60_000, max: 20 };

function json(body: ScorecardTurnResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  if (rateLimited("scorecard-turn", clientIp(request), RATE_LIMIT)) {
    return json({ ok: false, acknowledgement: "" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, acknowledgement: "" }, 400);
  }

  const input = (body ?? {}) as Record<string, unknown>;

  if (!validateSessionId(input.sessionId)) {
    return json({ ok: false, acknowledgement: "" }, 400);
  }

  const contact = validateContact(input.contact);
  if (!contact.ok) {
    return json({ ok: false, acknowledgement: "" }, 400);
  }

  const answers = validateAnswers(input.answers);
  if (answers.length === 0) {
    return json({ ok: true, acknowledgement: "" }, 200);
  }

  const acknowledgement = await generateAcknowledgement(contact.data, answers);
  return json({ ok: true, acknowledgement }, 200);
}
