/**
 * The scorecard wire contract — shared by the widget and the API routes, so
 * the payload has exactly one definition. Mirrors the approach in `berth.ts`.
 *
 * Nothing in this file may import from a server-only module: it is pulled into
 * the client bundle. Model keys, the n8n URL and Apollo live behind the routes.
 */

import type { Installation } from "@/data/installation-menu";

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
export const SCORECARD_RESULT_ENDPOINT = "/api/scorecard/result/";

/** Gate form fields. Three, and no more — see the spec's §4. */
export type ScorecardContact = {
  firstName: string;
  email: string;
  /** As typed. The server normalises it to a bare domain. */
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

export type ScorecardAnswer = {
  /** "q1".."q6", matching the ids in `@/content/scorecard`. */
  questionId: string;
  /** The question text as it was asked, so a reworded question stays legible. */
  question: string;
  answer: string;
};

export type ScorecardRecommendation = {
  /** Always a real id from `@/data/installation-menu`. Validated server-side. */
  installationId: string;
  name: string;
  /** Section name, shown under the installation name on the results screen. */
  bucket: string;
  reason: string;
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
  /**
   * Set when enrichment answered a question for us, so the widget can skip it
   * rather than asking something we already know. Empty when nothing was
   * skipped, which is the common case.
   */
  prefilled?: ScorecardAnswer[];
};

/** One conversational turn: answers so far, expecting an acknowledgement back. */
export type ScorecardTurnRequest = {
  sessionId: string;
  contact: ScorecardContact;
  answers: ScorecardAnswer[];
};

export type ScorecardTurnResponse = {
  ok: boolean;
  /**
   * One line reacting to the answer just given. Empty string is valid and
   * means "say nothing" — the widget renders no bubble rather than a blank one.
   */
  acknowledgement: string;
};

export type ScorecardResultRequest = {
  sessionId: string;
  contact: ScorecardContact;
  answers: ScorecardAnswer[];
  sourcePage: string;
};

export type ScorecardResultResponse = {
  ok: boolean;
  message: string;
  summary: string;
  recommendations: ScorecardRecommendation[];
};

/** Shapes a catalog entry into the wire form, resolving its section name. */
export function toRecommendation(
  installation: Installation,
  bucket: string,
  reason: string,
): ScorecardRecommendation {
  return {
    installationId: installation.id,
    name: installation.name,
    bucket,
    reason,
    diagram: installation.diagram,
  };
}
