/**
 * Server-side validation for the scorecard payloads.
 *
 * The widget validates too, but that is a courtesy to the person filling the
 * gate form, not a control. Everything here re-checks from scratch, and the
 * answer checks read the question list the widget renders from, so a reworded
 * question cannot pass one side and fail the other.
 */

import { questions } from "@/content/scorecard";
import type { ScorecardAnswer, ScorecardContact } from "@/lib/scorecard";

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
export function normaliseDomain(input: string): string {
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
  const domain = normaliseDomain(website);
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

const questionsById = new Map(questions.map((question) => [question.id, question]));

/**
 * Answers are validated as a list rather than a fixed shape because the widget
 * posts however many it has so far, and because a skipped free-text question
 * legitimately arrives as an empty string.
 *
 * Unknown question ids are dropped rather than rejected. The alternative —
 * a 400 — would lose a live lead's whole session over one stale id if the
 * question list were ever edited while someone was mid-scorecard.
 */
export function validateAnswers(input: unknown): ScorecardAnswer[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const answers: ScorecardAnswer[] = [];

  for (const entry of input) {
    const record = (entry ?? {}) as Record<string, unknown>;
    const questionId = asString(record.questionId);
    const question = questionsById.get(questionId);
    if (!question || seen.has(questionId)) continue;

    seen.add(questionId);
    answers.push({
      questionId,
      // The canonical text, not whatever the client sent: the client's copy is
      // untrusted and the two must not be able to disagree.
      question: question.text,
      answer: asString(record.answer).slice(0, MAX_ANSWER),
    });
  }

  // Catalog order, so the model and Alan always read them in the asked order.
  return answers.sort(
    (a, b) =>
      questions.findIndex((q) => q.id === a.questionId) -
      questions.findIndex((q) => q.id === b.questionId),
  );
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
