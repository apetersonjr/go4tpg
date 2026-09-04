/**
 * Lead delivery to n8n, and the visitor's report.
 *
 * One endpoint, two events. n8n owns what happens next — the Google Sheet row,
 * the ClickUp task, the mail to Alan, and now the PDF that goes to the visitor
 * — so changing any of that is an edit in n8n and not a redeploy of this site.
 *
 * WHY THIS FILE IS NOISIER THAN IT WAS. `lead_completed` used to feed internal
 * tooling only, so a missing URL was a warning and a dropped lead was a line in
 * a log. It now carries a promise made to the visitor's face: the panel says
 * their report is emailed instantly. A silent failure is a person waiting for
 * something that is never coming. So a missing URL is a boot-level error (see
 * `assertWebhookConfigured` and `instrumentation.ts`), and a failed send is
 * reported back to the caller so the confirmation line can tell the truth.
 *
 * Server-only: the URL and the secret are read from the environment and must
 * never reach the client bundle.
 */

import type {
  ScorecardEnrichment,
  ScorecardExtraction,
  ScorecardRecommendation,
  ScorecardTurn,
} from "@/lib/scorecard";

export type ScorecardEvent = "lead_started" | "lead_completed";

export type ScorecardWebhookPayload = {
  event: ScorecardEvent;
  session_id: string;
  timestamp: string;
  contact: { first_name: string; email: string; domain: string };
  enrichment: { company_name: string; industry: string; headcount: string };
  /**
   * The audit trail: what was asked, what was typed, what was understood. n8n
   * writes this to the Sheet so a session can be reconstructed. It is the ONLY
   * place a raw answer travels, and nothing in the PDF is rendered from it.
   */
  turns: {
    intent_id: string;
    question: string;
    answer: string;
    evidence: string;
    signals: string[];
    confidence: string;
  }[];
  /** Every signal accumulated across the session, de-duplicated. */
  signals: string[];
  /**
   * The structured recommendations the PDF is built from. Kept as objects with
   * the three parts separate rather than flattened into display strings — n8n
   * lays out one workflow page per recommendation and needs the parts apart.
   */
  recommendations: {
    installation_id: string;
    name: string;
    section: string;
    problem: string;
    installs: string;
    produces: string;
  }[];
  summary: string;
  /** Which version of the installation menu the picks were drawn from. */
  menu_version: number;
  /** Which version of the intent and signal vocabulary produced the reading. */
  intents_version: number;
  source_page: string;
};

type BuildInput = {
  event: ScorecardEvent;
  sessionId: string;
  contact: { firstName: string; email: string; domain: string };
  enrichment?: ScorecardEnrichment;
  turns?: ScorecardTurn[];
  extractions?: ScorecardExtraction[];
  recommendations?: ScorecardRecommendation[];
  summary?: string;
  menuVersion: number;
  intentsVersion: number;
  sourcePage: string;
};

/**
 * Snake_case on the wire because that is the contract n8n was built against.
 * Absent sections are sent as empty rather than omitted, so every node
 * downstream can read a field without first checking it exists.
 */
export function buildWebhookPayload(input: BuildInput): ScorecardWebhookPayload {
  const signals = new Set<string>();
  for (const extraction of input.extractions ?? []) {
    for (const signal of extraction.signals) signals.add(signal);
  }

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
    turns: (input.turns ?? []).map((turn) => ({
      intent_id: turn.intentId,
      question: turn.question,
      answer: turn.rawAnswer,
      evidence: turn.extraction.evidence,
      signals: turn.extraction.signals,
      confidence: turn.extraction.confidence,
    })),
    signals: [...signals],
    recommendations: (input.recommendations ?? []).map((entry) => ({
      installation_id: entry.installationId,
      name: entry.name,
      section: entry.bucket,
      problem: entry.problem,
      installs: entry.installs,
      produces: entry.produces,
    })),
    summary: input.summary ?? "",
    menu_version: input.menuVersion,
    intents_version: input.intentsVersion,
    source_page: input.sourcePage,
  };
}

/**
 * Boot-time configuration check, called from `instrumentation.ts`.
 *
 * Loud on purpose. The scorecard promises an emailed report, and a deploy
 * missing either `SCORECARD_WEBHOOK_URL` or `TPG_SCORECARD_SECRET` breaks that
 * promise for every visitor silently — the widget still works, the results
 * still render, and nothing about the running site says the mail is not going
 * out. This turns that into something visible in the container log on the first
 * line after boot.
 *
 * It throws in production rather than logging, because Dokploy restarting a
 * container that refuses to boot is a signal someone will act on, and a broken
 * customer promise is worth refusing to serve. In development it logs, so
 * nobody has to run n8n locally to work on a page.
 */
export function assertWebhookConfigured(): void {
  /*
   * Two variables, one check, because their failure modes are identical from
   * the visitor's side: the widget works, the results render, and the promised
   * email never arrives.
   *
   * `TPG_SCORECARD_SECRET` is the subtler of the two. n8n gates every inbound
   * request on it, so an unset secret here does not degrade anything visibly —
   * it means n8n silently drops every lead into its reject branch while this
   * site goes on telling each visitor their report is on its way. That is
   * precisely the class of failure this function exists to refuse to serve.
   *
   * The NAMES are reported, never the values. A secret that appears in a
   * container log is a secret that has leaked.
   */
  const missing = (["SCORECARD_WEBHOOK_URL", "TPG_SCORECARD_SECRET"] as const).filter(
    (name) => !process.env[name],
  );

  if (missing.length === 0) return;

  const message =
    `[scorecard] ${missing.join(" and ")} ${missing.length === 1 ? "is" : "are"} not set. ` +
    "The scorecard promises visitors an emailed report and cannot deliver one without " +
    "both: the URL is where the lead goes, and the secret is what n8n checks before " +
    "accepting it. Set them in the Dokploy environment tab.";

  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.error(`${message} (Continuing because this is not a production build.)`);
}

/** Beyond this the visitor is waiting on something they cannot see. */
const TIMEOUT_MS = 8000;

/**
 * Fires the webhook. Never throws.
 *
 * The return value is now load-bearing rather than advisory: the analyze route
 * reads it to decide whether the results screen may promise an email. Whatever
 * this returns has to be the truth about whether n8n accepted the payload.
 *
 * A failure is logged at error level with the session id AND the contact
 * email, so a dropped lead can be recovered by hand from the container log.
 * That is deliberate: an address in a log is a smaller problem than a
 * prospect who filled in a form and was never contacted.
 */
export async function sendScorecardEvent(payload: ScorecardWebhookPayload): Promise<boolean> {
  const url = process.env.SCORECARD_WEBHOOK_URL;
  if (!url) {
    console.error(
      `[scorecard] SCORECARD_WEBHOOK_URL is not set — ${payload.event} for session ${payload.session_id} (${payload.contact.email}) was NOT delivered. Recover this lead by hand.`,
    );
    return false;
  }

  /*
   * Signed with a shared secret. n8n's `Valid Request?` node compares this
   * header against its own `TPG_SCORECARD_SECRET` and drops anything that does
   * not match, which matters because the webhook is publicly reachable and
   * triggers Google Sheet writes and outbound mail from a Gmail account.
   *
   * Both events go through here, so both are signed — see the note above this
   * function. The two sides must carry the SAME value; rotating it is an edit
   * in two places, and doing only one of them silently drops every lead.
   *
   * The URL is still worth treating as a secret in its own right: keep it out
   * of tickets and screenshots. The signature makes the endpoint safe to be
   * found, not safe to be published.
   */
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-tpg-signature": process.env.TPG_SCORECARD_SECRET ?? "",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(
        `[scorecard] webhook rejected ${payload.event} for session ${payload.session_id} (${payload.contact.email}): ${response.status}. Recover this lead by hand.`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      `[scorecard] webhook failed for ${payload.event}, session ${payload.session_id} (${payload.contact.email}). Recover this lead by hand:`,
      error,
    );
    return false;
  }
}
