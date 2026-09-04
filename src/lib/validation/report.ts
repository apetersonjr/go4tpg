/**
 * Server-side validation for the report builder payload.
 *
 * n8n is the only intended caller and it is authenticated by shared secret,
 * but the payload is still validated from scratch. The secret proves the call
 * came from n8n; it does not prove n8n sent something sane, and n8n's own
 * inputs include model output. Everything here is text that will be typeset
 * into a PDF and emailed to a named prospect, so the checks below are what
 * stand between a malformed upstream response and a document with "undefined"
 * printed across the cover.
 *
 * Every string is length-capped. Not for storage reasons — the pages are
 * fixed-size, and text that overruns its box does not wrap into a scrollbar
 * the way a web page would. It silently collides with the footer.
 */

import { findInstallation, findSection } from "@/data/installation-menu";
import type { SectionId } from "@/data/installation-menu";
import type { ValidationResult } from "@/lib/validation/scorecard";

/** One recommendation, already resolved against the catalog. */
export type ReportRecommendation = {
  installationId: string;
  /** Catalog number, taken from the menu rather than the payload. */
  number: number;
  /** Catalog name, taken from the menu rather than the payload. */
  name: string;
  /** Section label as printed, e.g. "VII · Money and Reporting". */
  section: string;
  problem: string;
  installs: string;
  produces: string;
};

export type ReportRequest = {
  sessionId: string;
  firstName: string;
  companyName: string;
  summary: string;
  recommendations: ReportRecommendation[];
};

const LIMITS = {
  firstName: 60,
  companyName: 120,
  summary: 1600,
  clause: 600,
} as const;

/** At most this many one-pagers in one report. Nineteen is the whole catalog. */
const MAX_RECOMMENDATIONS = 19;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Collapses runs of whitespace and strips control characters.
 *
 * Newlines inside a paragraph are the specific hazard: the text measurer wraps
 * on spaces, so an embedded newline is measured as part of a word and pushes
 * the line past the margin. Line breaks that matter are decided by the layout,
 * never by the payload.
 */
function clean(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function validateReportRequest(input: unknown): ValidationResult<ReportRequest> {
  const errors: Record<string, string> = {};

  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: { body: "Expected a JSON object." } };
  }
  const raw = input as Record<string, unknown>;

  const sessionId = asString(raw.session_id);
  if (!sessionId) errors.session_id = "This one is required.";
  else if (!isUuid(sessionId)) errors.session_id = "Must be a UUID.";

  /*
   * The name is optional in effect: the cover falls back to the company, and a
   * report with a slightly impersonal cover is worth more to the prospect than
   * a 500. What is not tolerated is the string "undefined" arriving because an
   * upstream template interpolated a missing value — that is a bug upstream,
   * and printing it is how it reaches a customer.
   */
  const firstName = clean(asString(raw.first_name)).slice(0, LIMITS.firstName);
  if (/^(undefined|null|nan)$/i.test(firstName)) {
    errors.first_name = "Received the literal string \"" + firstName + "\".";
  }

  const companyName = clean(asString(raw.company_name)).slice(0, LIMITS.companyName);
  if (/^(undefined|null|nan)$/i.test(companyName)) {
    errors.company_name = "Received the literal string \"" + companyName + "\".";
  }

  const summary = clean(asString(raw.summary)).slice(0, LIMITS.summary);
  if (!summary) errors.summary = "This one is required.";

  const recommendations: ReportRecommendation[] = [];
  if (!Array.isArray(raw.recommendations)) {
    errors.recommendations = "Expected an array.";
  } else if (raw.recommendations.length === 0) {
    errors.recommendations = "At least one recommendation is required.";
  } else if (raw.recommendations.length > MAX_RECOMMENDATIONS) {
    errors.recommendations = `At most ${MAX_RECOMMENDATIONS} are allowed.`;
  } else {
    const seen = new Set<string>();

    raw.recommendations.forEach((entry, index) => {
      const at = `recommendations[${index}]`;
      if (typeof entry !== "object" || entry === null) {
        errors[at] = "Expected an object.";
        return;
      }
      const rec = entry as Record<string, unknown>;
      const installationId = asString(rec.installation_id);

      /*
       * The catalog is the authority for number, name and section — not the
       * payload. The caller sends them and they are read only to be discarded,
       * because `installation-menu.ts` is the single place those strings are
       * allowed to be defined. A payload that disagrees is a stale n8n
       * workflow, and honoring it would print a name the site no longer uses
       * next to a one-pager that shows the current one.
       */
      const catalog = findInstallation(installationId);
      if (!catalog) {
        errors[at] = `Unknown installation_id: ${installationId || "(empty)"}.`;
        return;
      }
      if (seen.has(installationId)) {
        errors[at] = `Duplicate installation_id: ${installationId}.`;
        return;
      }
      seen.add(installationId);

      const problem = clean(asString(rec.problem)).slice(0, LIMITS.clause);
      const installs = clean(asString(rec.installs)).slice(0, LIMITS.clause);
      const produces = clean(asString(rec.produces)).slice(0, LIMITS.clause);
      if (!problem || !installs || !produces) {
        errors[at] = "problem, installs and produces are all required.";
        return;
      }

      recommendations.push({
        installationId,
        number: catalog.number,
        name: catalog.name,
        section: sectionLabel(catalog.section),
        problem,
        installs,
        produces,
      });
    });
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  /*
   * Catalog order, not arrival order. The one-pagers are bound ascending by
   * number, and a plan page that lists them in a different order than the
   * pages that follow reads as a collation mistake.
   */
  recommendations.sort((a, b) => a.number - b.number);

  return {
    ok: true,
    data: { sessionId, firstName, companyName, summary, recommendations },
  };
}

/**
 * "VII · Money and Reporting", matching how the brochure prints it.
 *
 * The name is read from the catalog rather than repeated here. Section names
 * are defined in exactly one place, and a second copy in a validation module
 * is precisely how the site previously ended up carrying three disagreeing
 * versions of this list.
 */
function sectionLabel(sectionId: SectionId): string {
  const section = findSection(sectionId);
  return section ? `${sectionId} · ${section.name}` : sectionId;
}
