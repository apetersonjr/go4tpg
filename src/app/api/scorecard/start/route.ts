import { NextResponse } from "next/server";
import { questions } from "@/content/scorecard";
import { MENU_VERSION } from "@/data/installation-menu";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { HONEYPOT_FIELD } from "@/lib/scorecard";
import type { ScorecardAnswer, ScorecardStartResponse } from "@/lib/scorecard";
import { enrichDomain } from "@/lib/scorecardEnrichment";
import { buildWebhookPayload, sendScorecardEvent } from "@/lib/scorecardWebhook";
import { validateContact, validateSessionId, validateSourcePage } from "@/lib/validation/scorecard";

// The OpenAI SDK needs Node APIs, and the whole scorecard surface stays on
// one runtime so nothing behaves differently by route.
export const runtime = "nodejs";

/**
 * The gate. This is where a visitor becomes a lead.
 *
 * Everything downstream is a bonus: if a person fills in these three fields and
 * then closes the tab before Q1, Alan still has a name, an address and a
 * company. That is the entire reason the form sits in front of the questions
 * rather than after the results, and it is why `lead_started` is fired here and
 * not on completion.
 */

/** A person starts one scorecard. A handful a minute is already generous. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };

function json(body: ScorecardStartResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  if (rateLimited("scorecard-start", clientIp(request), RATE_LIMIT)) {
    return json({ ok: false, message: "Too many requests. Please wait a moment." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "That request could not be read." }, 400);
  }

  /*
   * Honeypot. A filled hidden field means an automated submitter, so we answer
   * exactly as we would on success and do nothing at all — telling a bot it was
   * detected only teaches it to avoid detection.
   *
   * As on the berth route, this is the one place a success shape is returned
   * without anything being delivered. That does not break the "never fake
   * success" rule: the rule protects a person from a false confirmation, and
   * there is no person here.
   */
  const honeypot = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, message: "Request received." }, 200);
  }

  const result = validateContact(body);
  if (!result.ok) {
    return json({ ok: false, message: "Some answers need attention.", errors: result.errors }, 400);
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const sessionId = validateSessionId(input.sessionId);
  if (!sessionId) {
    return json({ ok: false, message: "That request could not be read." }, 400);
  }

  const contact = result.data;
  const enrichment = await enrichDomain(contact.domain);

  /*
   * The lead is delivered before the response goes back, and the response does
   * not depend on it landing. `sendScorecardEvent` never throws and logs its
   * own failures, so a webhook outage costs us the log line rather than the
   * visitor's session.
   */
  await sendScorecardEvent(
    buildWebhookPayload({
      event: "lead_started",
      sessionId,
      contact,
      enrichment,
      menuVersion: MENU_VERSION,
      sourcePage: validateSourcePage(input.sourcePage),
    }),
  );

  /*
   * If Apollo told us the headcount, Q2 is a question we already know the
   * answer to. Answering it on the visitor's behalf is better than asking:
   * it shortens the scorecard and it signals that we did our homework.
   *
   * Only Q2 is prefilled. The rest are judgements about how the company feels
   * from the inside, and no data provider knows those.
   */
  const prefilled: ScorecardAnswer[] = [];
  const teamQuestion = questions.find((question) => question.id === "q2");
  if (teamQuestion && enrichment.headcount) {
    prefilled.push({
      questionId: teamQuestion.id,
      question: teamQuestion.text,
      answer: enrichment.headcount,
    });
  }

  return json({ ok: true, message: "Request received.", prefilled }, 200);
}
