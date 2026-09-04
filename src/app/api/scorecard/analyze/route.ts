import { NextResponse } from "next/server";
import { MENU_VERSION } from "@/data/installation-menu";
import { INTENTS_VERSION } from "@/data/scorecard-intents";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import type { ScorecardAnalyzeResponse } from "@/lib/scorecard";
import { enrichDomain } from "@/lib/scorecardEnrichment";
import { analysisInput, generateReport } from "@/lib/scorecardModel";
import { buildWebhookPayload, sendScorecardEvent } from "@/lib/scorecardWebhook";
import {
  validateContact,
  validateExtractions,
  validateSessionId,
  validateSourcePage,
  validateTurns,
} from "@/lib/validation/scorecard";

export const runtime = "nodejs";

/**
 * The report, and the second half of the lead.
 *
 * Three things happen here, and their failure modes are deliberately kept
 * apart: the model writes the report, n8n receives the completed lead and
 * builds the PDF, and the visitor is told what actually happened. If the model
 * degrades, Alan still gets the session. If n8n fails, the visitor still sees
 * their results — but the confirmation line stops promising an email.
 *
 * THE GUARANTEE THIS ROUTE ENFORCES. The report is written from extractions
 * only. The raw answers arrive on this request, because n8n wants them for the
 * audit trail, and they are passed to `buildWebhookPayload` and to nothing
 * else. `analysisInput` takes extractions as its parameter and has no access
 * to a raw answer, so there is no path by which one reaches the model. The
 * payload is logged verbatim below, which is how that is verified rather than
 * asserted — see the DEFINITION OF DONE in the build spec.
 */

/** One report per completed session; this allows for a retry or two. */
const RATE_LIMIT = { windowMs: 60_000, max: 4 };

function json(body: ScorecardAnalyzeResponse, status: number) {
  return NextResponse.json(body, { status });
}

const EMPTY = { summary: "", recommendations: [], emailed: false };

/**
 * Whether to log the exact analysis payload.
 *
 * On in development always, and switchable in production with
 * `SCORECARD_LOG_ANALYSIS_PAYLOAD`. The payload contains no raw answers by
 * construction — that is the point of logging it — but it does contain the
 * contact's name and domain alongside a business assessment, so it is not
 * something to leave running into a production log by default.
 */
function shouldLogPayload(): boolean {
  return (
    process.env.NODE_ENV !== "production" || process.env.SCORECARD_LOG_ANALYSIS_PAYLOAD === "1"
  );
}

export async function POST(request: Request) {
  if (rateLimited("scorecard-analyze", clientIp(request), RATE_LIMIT)) {
    return json({ ok: false, message: "Too many requests.", ...EMPTY }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "That request could not be read.", ...EMPTY }, 400);
  }

  const input = (body ?? {}) as Record<string, unknown>;

  const sessionId = validateSessionId(input.sessionId);
  const contact = validateContact(input.contact);
  if (!sessionId || !contact.ok) {
    return json({ ok: false, message: "That request could not be read.", ...EMPTY }, 400);
  }

  const sourcePage = validateSourcePage(input.sourcePage);

  /*
   * Two separate reads of the same session, and the split is the architecture.
   * `turns` carries the raw answers and goes to n8n. `extractions` carries the
   * readings and goes to the model. They are never combined.
   */
  const turns = validateTurns(input.turns);
  const extractions = validateExtractions(input.extractions);

  /*
   * Enrichment is repeated rather than carried from `/start` because this route
   * is stateless and the client is not trusted to hand back a company profile
   * it could have edited. It is a cached lookup on Apollo's side and returns {}
   * on any failure, so the cost of asking twice is small and the alternative is
   * an enrichment field an attacker controls.
   */
  const enrichment = await enrichDomain(contact.data.domain);

  /*
   * Built once, logged, then sent. The same string in both places on purpose:
   * a log that reconstructed the payload rather than showing the one that was
   * sent would prove nothing.
   */
  const payload = analysisInput(contact.data, extractions);
  if (shouldLogPayload()) {
    console.info(
      `[scorecard] session ${sessionId}: analysis payload (raw answers must not appear below)\n${payload}`,
    );
  }

  const { report, degraded } = await generateReport(payload, extractions, sessionId);
  if (degraded) {
    console.error(
      `[scorecard] session ${sessionId}: served a degraded report to ${contact.data.email}.`,
    );
  }

  /*
   * The send is what the on-screen promise is made of, so its result is
   * carried all the way back to the visitor rather than logged and dropped.
   */
  const emailed = await sendScorecardEvent(
    buildWebhookPayload({
      event: "lead_completed",
      sessionId,
      contact: contact.data,
      enrichment,
      turns,
      extractions,
      recommendations: report.recommendations,
      summary: report.summary,
      menuVersion: report.menuVersion ?? MENU_VERSION,
      intentsVersion: report.intentsVersion ?? INTENTS_VERSION,
      sourcePage,
    }),
  );

  if (!emailed) {
    /*
     * Already logged at error level with the session id and the email inside
     * `sendScorecardEvent`, which is what makes the lead recoverable by hand.
     * This line is the one that names the consequence: a person has been shown
     * results and is expecting a report that did not go out.
     */
    console.error(
      `[scorecard] session ${sessionId}: results were shown to ${contact.data.email} but the report was NOT sent. The confirmation line has been downgraded accordingly.`,
    );
  }

  return json(
    {
      ok: true,
      message: "Report ready.",
      summary: report.summary,
      recommendations: report.recommendations,
      emailed,
    },
    200,
  );
}
