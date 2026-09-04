/**
 * Server-side validation for the scorecard payloads.
 *
 * The widget validates too, but that is a courtesy to the person filling the
 * gate form, not a control. Everything here re-checks from scratch.
 *
 * The session is held client-side and posted back on every turn, which means
 * everything in it is attacker-controlled — including the extractions, which
 * are the ONLY thing the final report is written from. So the extraction
 * checks below are not shape-checking for its own sake: they are what stops
 * someone hand-crafting a request that puts arbitrary text into the report and
 * into the PDF that gets emailed. Signals are filtered against the closed
 * vocabulary, evidence is length-capped, and intent ids must be real.
 */

import { findIntent, validSignals } from "@/data/scorecard-intents";
import type {
  ExtractionConfidence,
  ScorecardContact,
  ScorecardExtraction,
  ScorecardTurn,
} from "@/lib/scorecard";

export type ValidationResult<T> =
  { ok: true; data: T } | { ok: false; errors: Record<string, string> };

const REQUIRED_MESSAGE = "This one is required.";

/** Anything that is not a string becomes "", so a hostile type cannot slip past. */
function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Strips a URL down to its bare host: "https://Www.Acme.co.uk/pricing?x=1"
 * becomes "acme.co.uk". Someone typing a company website types it a dozen
 * different ways and every one of them means the same company.
 *
 * `www.` is dropped because it is never the distinguishing part of a domain,
 * and the result is lowercased so two spellings cannot become two leads.
 */
export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  if (!value) return "";

  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  // Everything from the first slash, question mark or hash onward is a path.
  value = value.split(/[/?#]/)[0];
  // Credentials and ports are not part of the identity of the company.
  value = value.split("@").pop() ?? value;
  value = value.split(":")[0];
  value = value.replace(/^www\./, "");

  return value;
}

/** A bare domain: at least one dot, no spaces, plausible TLD. */
function looksLikeDomain(domain: string): boolean {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) && /\.[a-z]{2,}$/.test(domain);
}

export type ValidatedContact = ScorecardContact & {
  /** Bare domain derived from `website`. What the webhook and Apollo receive. */
  domain: string;
};

const MAX = { firstName: 100, email: 254, website: 253 };

export function validateContact(input: unknown): ValidationResult<ValidatedContact> {
  const errors: Record<string, string> = {};
  const body = (input ?? {}) as Record<string, unknown>;

  const firstName = asString(body.firstName);
  if (!firstName) errors.firstName = REQUIRED_MESSAGE;
  else if (firstName.length > MAX.firstName) {
    errors.firstName = `Please keep this under ${MAX.firstName} characters.`;
  }

  const email = asString(body.email);
  if (!email) {
    errors.email = REQUIRED_MESSAGE;
  } else if (email.length > MAX.email) {
    errors.email = `Please keep this under ${MAX.email} characters.`;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Deliberately permissive, as on the berth form: an address is proven by
    // sending to it, and an over-strict pattern rejects real addresses. Free
    // providers are allowed through on purpose — the spec is explicit.
    errors.email = "That does not look like an email address.";
  }

  const website = asString(body.website);
  const domain = normalizeDomain(website);
  if (!website) errors.website = REQUIRED_MESSAGE;
  else if (website.length > MAX.website) {
    errors.website = `Please keep this under ${MAX.website} characters.`;
  } else if (!looksLikeDomain(domain)) {
    errors.website = "That does not look like a website address.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { firstName, email, website, domain } };
}

/** Longest answer we will carry. Generous for a sentence, bounded for a payload. */
const MAX_ANSWER = 2000;
/** Evidence is one sentence written by the model. This is several times that. */
const MAX_EVIDENCE = 600;
/** A rephrased question. Longer than any of the defaults, bounded all the same. */
const MAX_QUESTION = 500;

function asConfidence(value: unknown): ExtractionConfidence {
  return value === "high" || value === "medium" || value === "low" ? value : "low";
}

/**
 * One extraction, re-checked.
 *
 * Returns null on an unknown intent id rather than coercing it to something
 * real: an extraction attributed to the wrong intent is worse than a missing
 * one, because the report reads the intent to know what the evidence is about.
 */
export function validateExtraction(input: unknown): ScorecardExtraction | null {
  const record = (input ?? {}) as Record<string, unknown>;

  const intentId = asString(record.intentId);
  if (!findIntent(intentId)) return null;

  return {
    intentId,
    // The closed vocabulary is enforced here as well as at the model boundary.
    // This is the copy that matters: it is the one running on data the client
    // sent back.
    signals: validSignals(record.signals),
    evidence: asString(record.evidence).slice(0, MAX_EVIDENCE),
    confidence: asConfidence(record.confidence),
  };
}

/**
 * The session's completed turns.
 *
 * Unknown intent ids are dropped rather than rejected. The alternative — a 400
 * — would lose a live session over one stale id if the intent list were edited
 * while someone was mid-scorecard.
 */
export function validateTurns(input: unknown): ScorecardTurn[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const turns: ScorecardTurn[] = [];

  for (const entry of input) {
    const record = (entry ?? {}) as Record<string, unknown>;
    const extraction = validateExtraction(record.extraction);
    if (!extraction || seen.has(extraction.intentId)) continue;

    const intentId = asString(record.intentId);
    // An entry whose two ids disagree is malformed, not merely stale.
    if (intentId !== extraction.intentId) continue;

    seen.add(intentId);
    turns.push({
      intentId,
      question: asString(record.question).slice(0, MAX_QUESTION),
      rawAnswer: asString(record.answer || record.rawAnswer).slice(0, MAX_ANSWER),
      extraction,
    });
  }

  return turns;
}

/** Extractions posted to the analyze route, filtered to real intents. */
export function validateExtractions(input: unknown): ScorecardExtraction[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const extractions: ScorecardExtraction[] = [];

  for (const entry of input) {
    const extraction = validateExtraction(entry);
    if (!extraction || seen.has(extraction.intentId)) continue;
    seen.add(extraction.intentId);
    extractions.push(extraction);
  }

  return extractions;
}

/** Intent ids the client claims are satisfied. Unknown ones are dropped. */
export function validateSatisfiedIntents(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const entry of input) {
    const id = asString(entry);
    if (findIntent(id)) seen.add(id);
  }
  return [...seen];
}

/** The answer to the turn being submitted. */
export function validateAnswer(input: unknown): string {
  return asString(input).slice(0, MAX_ANSWER);
}

/** The question as the client says it was asked. Bounded, never trusted for content. */
export function validateQuestion(input: unknown): string {
  return asString(input).slice(0, MAX_QUESTION);
}

/** Session ids are generated client-side, so the server checks the shape. */
export function validateSessionId(input: unknown): string {
  const value = asString(input);
  return /^[a-f0-9-]{8,64}$/i.test(value) ? value : "";
}

/** Where the session started, kept so a second entry point stays attributable. */
export function validateSourcePage(input: unknown): string {
  return asString(input).slice(0, 200);
}
