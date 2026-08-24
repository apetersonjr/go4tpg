/**
 * Best-effort company enrichment from the domain the visitor typed.
 *
 * Two jobs, in order of importance:
 *   1. Alan opens a lead notification already knowing who the company is.
 *   2. A known headcount lets the widget skip Q2 instead of asking something
 *      we can already answer — one fewer question is a real drop-off saving.
 *
 * Entirely optional. No key, a slow reply, a company Apollo has never heard of
 * — every one of those returns an empty object and the scorecard proceeds as
 * though enrichment did not exist. Nothing here may ever block a lead.
 */

import type { ScorecardEnrichment } from "@/lib/scorecard";

/** Short on purpose: this sits between the gate form and the first question. */
const TIMEOUT_MS = 4000;

const ENDPOINT = "https://api.apollo.io/api/v1/organizations/enrich";

/** Only the fields we use. Apollo returns a great deal more. */
type ApolloOrganization = {
  name?: unknown;
  industry?: unknown;
  estimated_num_employees?: unknown;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Apollo reports a headcount as a number; the scorecard thinks in the bands Q2
 * offers. Mapping here rather than at the call site keeps the band definition
 * in one place, next to the question it stands in for.
 */
function toBand(employees: unknown): string {
  if (typeof employees !== "number" || !Number.isFinite(employees) || employees < 1) return "";
  if (employees === 1) return "Just me";
  if (employees <= 10) return "2-10";
  if (employees <= 50) return "11-50";
  return "50+";
}

export async function enrichDomain(domain: string): Promise<ScorecardEnrichment> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey || !domain) return {};

  try {
    const url = new URL(ENDPOINT);
    url.searchParams.set("domain", domain);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "x-api-key": apiKey,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      // Logged, not thrown. A 402 on a spent plan is an ops problem, not a
      // reason this visitor's scorecard should behave differently.
      console.error(`[scorecard] enrichment for ${domain} returned ${response.status}`);
      return {};
    }

    const body = (await response.json()) as { organization?: ApolloOrganization };
    const organization = body.organization;
    if (!organization) return {};

    return {
      companyName: asText(organization.name),
      industry: asText(organization.industry),
      headcount: toBand(organization.estimated_num_employees),
    };
  } catch (error) {
    console.error(`[scorecard] enrichment failed for ${domain}:`, error);
    return {};
  }
}
