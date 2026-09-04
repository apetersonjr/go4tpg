import { NextResponse } from "next/server";
import { MENU_VERSION } from "@/data/installation-menu";
import { INTENTS_VERSION, drawOpener, findIntent, nextIntent } from "@/data/scorecard-intents";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { HONEYPOT_FIELD } from "@/lib/scorecard";
import type {
  ScorecardExtraction,
  ScorecardQuestion,
  ScorecardStartResponse,
} from "@/lib/scorecard";
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
 * then closes the tab before the first question, Alan still has a name, an
 * address and a company. That is the entire reason the form sits in front of
 * the questions rather than after the results, and it is why `lead_started` is
 * fired here and not on completion.
 *
 * The opening question comes from this route rather than from the client so
 * there is one place that decides what gets asked first — including when
 * enrichment has already answered something.
 */

/** A person starts one scorecard. A handful a minute is already generous. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };

function json(body: ScorecardStartResponse, status: number) {
  return NextResponse.json(body, { status });
}

/**
 * Turns a known headcount into the same shape a real turn would have produced.
 *
 * The evidence line is written here rather than by a model because it is a
 * statement of fact from a data provider, not a reading of anything someone
 * said. It follows the same rules as every other evidence line — a complete
 * sentence, professional American business English — so the report cannot tell
 * the difference and does not need to.
 */
function enrichmentExtraction(headcount: string): ScorecardExtraction | null {
  const band: Record<string, { signal: ScorecardExtraction["signals"][number]; text: string }> = {
    "Fewer than 10": { signal: "team_micro", text: "The organization has fewer than ten people." },
    "10 to 25": {
      signal: "team_small",
      text: "The organization has between ten and twenty-five people.",
    },
    "26 to 50": {
      signal: "team_mid",
      text: "The organization has between twenty-six and fifty people.",
    },
    "51 to 100": {
      signal: "team_mid",
      text: "The organization has between fifty-one and one hundred people.",
    },
    "More than 100": {
      signal: "team_large",
      text: "The organization has more than one hundred people.",
    },
  };

  const match = band[headcount];
  if (!match) return null;

  return {
    intentId: "q2",
    signals: [match.signal],
    evidence: match.text,
    // Medium, not high: this came from a third-party lookup rather than from
    // the person, and the report should weigh it accordingly.
    confidence: "medium",
  };
}

/**
 * The opening question. There is no history to adapt to yet, so the wording is
 * the intent's own.
 *
 * The exception is q1, which draws one of four interchangeable openers. The
 * draw happens HERE, once, at session creation, and the drawn line travels back
 * on the question — so it is fixed for the life of the session and a re-render
 * cannot swap it mid-conversation. Start over mints a new session and therefore
 * draws again, which is the intended behavior rather than a side effect.
 *
 * Only q1 varies. If enrichment satisfied q1 and the walk opens on some other
 * intent, that intent keeps its own single wording.
 */
function openingQuestion(satisfied: Set<string>): ScorecardQuestion | null {
  const intent = nextIntent(satisfied);
  if (!intent) return null;
  return {
    intentId: intent.id,
    text: intent.id === "q1" ? drawOpener() : intent.defaultText,
    format: intent.format,
    options: intent.options,
    maxSelections: intent.maxSelections,
    allowOther: intent.allowOther,
    topic: intent.topic,
    placeholder: intent.placeholder,
  };
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
   * If Apollo told us the headcount, the headcount intent is one we already
   * know the answer to. Marking it satisfied is better than asking: it
   * shortens the scorecard and it signals that we did our homework.
   *
   * Only q2 is satisfied this way. The rest are judgements about how the
   * company feels from the inside, and no data provider knows those.
   */
  const extractions: ScorecardExtraction[] = [];
  const satisfied = new Set<string>();

  const seeded = enrichment.headcount ? enrichmentExtraction(enrichment.headcount) : null;
  if (seeded && findIntent(seeded.intentId)) {
    extractions.push(seeded);
    satisfied.add(seeded.intentId);
  }

  /*
   * The lead is delivered before the response goes back, and the response does
   * not depend on it landing. `sendScorecardEvent` never throws and logs its
   * own failures, so a webhook outage costs us the log line rather than the
   * visitor's session. `lead_started` carries no promise to the visitor, so
   * unlike `lead_completed` its result is not surfaced on screen.
   */
  await sendScorecardEvent(
    buildWebhookPayload({
      event: "lead_started",
      sessionId,
      contact,
      enrichment,
      extractions,
      menuVersion: MENU_VERSION,
      intentsVersion: INTENTS_VERSION,
      sourcePage: validateSourcePage(input.sourcePage),
    }),
  );

  return json(
    {
      ok: true,
      message: "Request received.",
      question: openingQuestion(satisfied) ?? undefined,
      satisfiedIntents: [...satisfied],
      extractions,
    },
    200,
  );
}
