import { NextResponse } from "next/server";
import { MENU_VERSION } from "@/data/installation-menu";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import type { ScorecardResultResponse } from "@/lib/scorecard";
import { enrichDomain } from "@/lib/scorecardEnrichment";
import { generateReading } from "@/lib/scorecardModel";
import { buildWebhookPayload, sendScorecardEvent } from "@/lib/scorecardWebhook";
import {
  validateAnswers,
  validateContact,
  validateSessionId,
  validateSourcePage,
} from "@/lib/validation/scorecard";

export const runtime = "nodejs";

/**
 * The reading, and the second half of the lead.
 *
 * Two things happen here and their failure modes are deliberately separated:
 * the model produces the reading, and n8n receives the completed lead. If the
 * model fails, Alan must still get the transcript — a person who answered six
 * questions is a lead whether or not we managed to show them a result. So the
 * webhook fires either way, carrying whatever exists.
 */

/** One reading per completed session; this allows for a retry or two. */
const RATE_LIMIT = { windowMs: 60_000, max: 4 };

function json(body: ScorecardResultResponse, status: number) {
  return NextResponse.json(body, { status });
}

const EMPTY = { summary: "", recommendations: [] };

export async function POST(request: Request) {
  if (rateLimited("scorecard-result", clientIp(request), RATE_LIMIT)) {
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

  const answers = validateAnswers(input.answers);
  const sourcePage = validateSourcePage(input.sourcePage);

  /*
   * Enrichment is repeated rather than carried from `/start` because this route
   * is stateless and the client is not trusted to hand back a company profile
   * it could have edited. It is a cached lookup on Apollo's side and returns {}
   * on any failure, so the cost of asking twice is small and the alternative is
   * an enrichment field an attacker controls.
   */
  const enrichment = await enrichDomain(contact.data.domain);

  const reading = await generateReading(contact.data, answers);

  // Fires whether or not the reading came back. See the note above.
  await sendScorecardEvent(
    buildWebhookPayload({
      event: "lead_completed",
      sessionId,
      contact: contact.data,
      enrichment,
      answers,
      recommendations: reading?.recommendations ?? [],
      summary: reading?.summary ?? "",
      menuVersion: reading?.menuVersion ?? MENU_VERSION,
      sourcePage,
    }),
  );

  if (!reading) {
    /*
     * Reported honestly. The widget shows a line saying the reading did not
     * come together and that Alan has the answers, which is true — the webhook
     * above carried them. It does not show an empty results screen dressed up
     * as a result.
     */
    return json({ ok: false, message: "The reading could not be produced.", ...EMPTY }, 200);
  }

  return json(
    {
      ok: true,
      message: "Reading ready.",
      summary: reading.summary,
      recommendations: reading.recommendations,
    },
    200,
  );
}
