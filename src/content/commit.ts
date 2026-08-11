/*
 * The directive leads the section and is the largest type in it; the benefit
 * sentence supports it. These were previously reversed — the directive
 * rendered as a small kicker over a 24-word headline, which buried the one
 * line asking for the booking. Wording is unchanged; only the roles moved.
 */
export const commitDirective = "Start with the Annual Planning Summit.";

export const commitBenefit =
  "You walk away with named priorities, a written plan, and the team alignment and accountability that make the plan actually happen.";

/*
 * V19: the old body promised AI deployment. That describes TPG's commitment
 * across all three formats; under the summit-scoped directive it read as a
 * summit deliverable, and summits do not install AI.
 */
export const commitBody =
  "Your complimentary Opportunity Scan shows exactly where AI will amplify the work, and what to install first.";

export const commitSecond =
  "We do not replace your people. We give them the system they have been asking for.";

/**
 * The section books the call in place rather than linking out, so the plain
 * Calendly event URL is all that is stored here — the embed builds the
 * scheduler from it, and there is no vendor-generated snippet to keep in sync.
 */
export const commitCalendlyUrl = "https://calendly.com/alanpeterson_tpg/20min";

export const commitEmail = {
  prompt: "Prefer email?",
  address: "apeterson@go4tpg.com",
};
