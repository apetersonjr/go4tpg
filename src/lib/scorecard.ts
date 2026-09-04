/**
 * The scorecard wire contract — shared by the widget and the API routes, so
 * the payload has exactly one definition. Mirrors the approach in `berth.ts`.
 *
 * Nothing in this file may import from a server-only module: it is pulled into
 * the client bundle. Model keys, the n8n URL and Apollo live behind the routes.
 *
 * The central distinction in these types is between an ANSWER and an
 * EXTRACTION. An answer is what the visitor typed, kept for the audit trail
 * and sent to n8n as a record of the session. An extraction is the model's
 * reading of that answer in professional American business English. The report
 * is written from extractions alone — see `scorecardModel.ts` — which is what
 * makes it impossible for a misspelling, a fragment or a piece of slang to
 * reach the output.
 */

import type { Installation } from "@/data/installation-menu";
import type { IntentFormat, Signal } from "@/data/scorecard-intents";

/**
 * Honeypot field name. Named to look like a field a naive bot would fill, for
 * the same reason as the berth form's — a human never sees it, so anything
 * arriving with it filled did not come from the widget.
 */
export const HONEYPOT_FIELD = "company_url_confirm";

/*
 * Trailing slash is deliberate. `trailingSlash: true` in next.config.ts applies
 * to route handlers, so the un-slashed path answers with a 308. Posting to the
 * canonical path skips a pointless round trip on every turn.
 */
export const SCORECARD_START_ENDPOINT = "/api/scorecard/start/";
export const SCORECARD_TURN_ENDPOINT = "/api/scorecard/turn/";
export const SCORECARD_ANALYZE_ENDPOINT = "/api/scorecard/analyze/";

/** Gate form fields. Three, and no more — see the spec's §4. */
export type ScorecardContact = {
  firstName: string;
  email: string;
  /** As typed. The server normalizes it to a bare domain. */
  website: string;
};

/**
 * What Apollo (or any later enrichment) adds. Every field is optional because
 * enrichment is best-effort — a failed lookup must never block a lead.
 */
export type ScorecardEnrichment = {
  companyName?: string;
  industry?: string;
  headcount?: string;
};

/** How sure extraction is of its own reading. Low confidence never satisfies an intent. */
export type ExtractionConfidence = "high" | "medium" | "low";

/**
 * The model's reading of one answer.
 *
 * `evidence` is the load-bearing field. It is an interpretation, written in
 * complete sentences, never a quotation: "Handles inbound customer questions
 * personally and assembles weekly numbers by hand", not the fragment the
 * visitor typed. Everything the final report knows about this person arrives
 * through this field and the signal list beside it.
 */
export type ScorecardExtraction = {
  intentId: string;
  signals: Signal[];
  evidence: string;
  confidence: ExtractionConfidence;
};

/**
 * One completed turn: what was asked, what was typed, what was understood.
 *
 * `rawAnswer` never leaves the server except in the webhook's audit section.
 * It is held here so the widget can render the visitor's own bubble back to
 * them — a conversation that paraphrased what you just said would be strange —
 * and so the transcript reaching Alan is what actually happened.
 */
export type ScorecardTurn = {
  intentId: string;
  /** The question exactly as it was asked, which may be a rephrasing. */
  question: string;
  rawAnswer: string;
  extraction: ScorecardExtraction;
};

/** The next thing to put on screen. */
export type ScorecardQuestion = {
  intentId: string;
  text: string;
  format: IntentFormat;
  options: string[];
  maxSelections: number | null;
  allowOther: boolean;
  /** Short label for the progress row. Comes from the intent, not the model. */
  topic: string;
  placeholder: string;
};

export type ScorecardRecommendation = {
  /** Always a real id from `@/data/installation-menu`. Validated server-side. */
  installationId: string;
  name: string;
  /** Section name, shown under the installation name on the results screen. */
  bucket: string;
  /**
   * The mandatory three-part shape. Stating the pain and stopping was the
   * failure the client called out; a recommendation missing any part of this
   * is rejected server-side rather than rendered.
   */
  problem: string;
  installs: string;
  produces: string;
  /**
   * Carried through from the catalog. `null` until the diagrams exist — the
   * results screen renders one when it is not null and nothing when it is.
   */
  diagram: string | null;
};

/** Start request: the gate form plus the honeypot. */
export type ScorecardStartRequest = ScorecardContact & {
  sessionId: string;
  sourcePage: string;
  [HONEYPOT_FIELD]: string;
};

export type ScorecardStartResponse = {
  ok: boolean;
  message: string;
  /** Field-level errors, present only on a 400. */
  errors?: Record<string, string>;
  /** The opening question. Always present on a success. */
  question?: ScorecardQuestion;
  /**
   * Intents enrichment answered for us, so the walk can skip them rather than
   * asking something we already know. Empty when nothing was skipped, which is
   * the common case.
   */
  satisfiedIntents?: string[];
  /** Extractions seeded from enrichment, so the report still sees the signals. */
  extractions?: ScorecardExtraction[];
};

/**
 * One conversational turn. The widget holds the session and posts its whole
 * history each time — stateless server, as with `/api/berth`.
 */
export type ScorecardTurnRequest = {
  sessionId: string;
  contact: ScorecardContact;
  /** Every turn completed so far, oldest first. */
  turns: ScorecardTurn[];
  /** Intents already satisfied, including any seeded by enrichment. */
  satisfiedIntents: string[];
  /** The intent the visitor is answering right now. */
  intentId: string;
  /** The question as it was put to them, so the model reads the real exchange. */
  question: string;
  /** What they typed. Raw, and it stops here. */
  answer: string;
};

export type ScorecardTurnResponse = {
  ok: boolean;
  /*
   * There is no `reply` field, and the absence is deliberate.
   *
   * A turn used to return a one-line acknowledgement that was rendered above
   * the next question. It restated what the visitor had just said, immediately
   * below a quote of that same answer, so it read as padding — and it was never
   * used for anything else: the report is written from `extractions` alone, and
   * the webhook records `turns`. Continuity now comes from the next question
   * itself, which is reworded from what they said.
   */
  /** The reading of the answer just given. */
  extraction: ScorecardExtraction;
  /** The full satisfied set after this turn, not a delta. */
  satisfiedIntents: string[];
  /** Null once every intent is satisfied. */
  nextQuestion: ScorecardQuestion | null;
  complete: boolean;
};

/**
 * The analysis request. Note what is absent: there is no `answers` field and
 * no `rawAnswer` anywhere in this shape. That absence is the architecture, not
 * an oversight — the type itself is the thing that makes raw text unable to
 * reach the report.
 */
export type ScorecardAnalyzeRequest = {
  sessionId: string;
  contact: ScorecardContact;
  extractions: ScorecardExtraction[];
  sourcePage: string;
  /**
   * The audit trail, forwarded to n8n as a record of the session. It is
   * carried on this request only so the completed-lead webhook can include it;
   * the route never passes it to the model. See the route for the assertion
   * that enforces this.
   */
  turns: ScorecardTurn[];
};

export type ScorecardAnalyzeResponse = {
  ok: boolean;
  message: string;
  summary: string;
  recommendations: ScorecardRecommendation[];
  /**
   * Whether the report actually left the building. The confirmation line on
   * the results screen is chosen from this: a promise when it is true, an
   * accurate statement when it is false. Never a promise on a failed send.
   */
  emailed: boolean;
};

/** Shapes a catalog entry into the wire form, resolving its section name. */
export function toRecommendation(
  installation: Installation,
  bucket: string,
  parts: { problem: string; installs: string; produces: string },
): ScorecardRecommendation {
  return {
    installationId: installation.id,
    name: installation.name,
    bucket,
    problem: parts.problem,
    installs: parts.installs,
    produces: parts.produces,
    diagram: installation.diagram,
  };
}
