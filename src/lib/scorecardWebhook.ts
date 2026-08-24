/**
 * Lead delivery to n8n.
 *
 * One endpoint, two events. n8n owns what happens next — the Google Sheet row,
 * the ClickUp task, the mail to Alan — so changing any of that is an edit in
 * n8n and not a redeploy of this site.
 *
 * Server-only: the URL is read from the environment and must never reach the
 * client bundle.
 */

import type {
  ScorecardAnswer,
  ScorecardEnrichment,
  ScorecardRecommendation,
} from "@/lib/scorecard";

export type ScorecardEvent = "lead_started" | "lead_completed";

export type ScorecardWebhookPayload = {
  event: ScorecardEvent;
  session_id: string;
  timestamp: string;
  contact: { first_name: string; email: string; domain: string };
  enrichment: { company_name: string; industry: string; headcount: string };
  answers: { question_id: string; question: string; answer: string }[];
  /**
   * The recommendation objects exactly as the model returned them, not
   * flattened into display strings. V2's per-prospect PDF renders from this,
   * so it has to survive the trip intact.
   */
  recommendations: { installation_id: string; name: string; reason: string }[];
  summary: string;
  /** Which version of the installation menu the picks were drawn from. */
  menu_version: number;
  source_page: string;
};

type BuildInput = {
  event: ScorecardEvent;
  sessionId: string;
  contact: { firstName: string; email: string; domain: string };
  enrichment?: ScorecardEnrichment;
  answers?: ScorecardAnswer[];
  recommendations?: ScorecardRecommendation[];
  summary?: string;
  menuVersion: number;
  sourcePage: string;
};

/**
 * Snake_case on the wire because that is the contract n8n was built against.
 * Absent sections are sent as empty rather than omitted, so every node
 * downstream can read a field without first checking it exists.
 */
export function buildWebhookPayload(input: BuildInput): ScorecardWebhookPayload {
  return {
    event: input.event,
    session_id: input.sessionId,
    timestamp: new Date().toISOString(),
    contact: {
      first_name: input.contact.firstName,
      email: input.contact.email,
      domain: input.contact.domain,
    },
    enrichment: {
      company_name: input.enrichment?.companyName ?? "",
      industry: input.enrichment?.industry ?? "",
      headcount: input.enrichment?.headcount ?? "",
    },
    answers: (input.answers ?? []).map((answer) => ({
      question_id: answer.questionId,
      question: answer.question,
      answer: answer.answer,
    })),
    recommendations: (input.recommendations ?? []).map((entry) => ({
      installation_id: entry.installationId,
      name: entry.name,
      reason: entry.reason,
    })),
    summary: input.summary ?? "",
    menu_version: input.menuVersion,
    source_page: input.sourcePage,
  };
}

/** Beyond this the visitor is waiting on something they cannot see. */
const TIMEOUT_MS = 8000;

/**
 * Fires the webhook. Never throws.
 *
 * The visitor's experience does not depend on n8n being up: the widget must
 * keep moving whether or not the lead landed. A failure is logged loudly
 * instead, with the session id, so a dropped lead can be reconstructed from
 * the logs rather than being lost silently.
 */
export async function sendScorecardEvent(payload: ScorecardWebhookPayload): Promise<boolean> {
  const url = process.env.SCORECARD_WEBHOOK_URL;
  if (!url) {
    console.error(
      `[scorecard] SCORECARD_WEBHOOK_URL is not set — ${payload.event} for session ${payload.session_id} was not delivered.`,
    );
    return false;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(
        `[scorecard] webhook rejected ${payload.event} for session ${payload.session_id}: ${response.status}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      `[scorecard] webhook failed for ${payload.event}, session ${payload.session_id}:`,
      error,
    );
    return false;
  }
}
