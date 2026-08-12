/**
 * Copy and option sets for the berth reservation form.
 *
 * One form serves both Cyrolia voyages: they share the same boat and the same
 * five berths, so they share one intake. Question 1 is the router — it decides
 * the wording of the open question and the whole tier list — which is why it
 * can never be dropped, even if the conditional logic were simplified.
 *
 * The option arrays are the single source of truth for what the server will
 * accept. The API route validates against these same constants, so a label
 * cannot be reworded here and silently start failing validation there.
 */
export const reserveMeta = {
  title: "Reserve a Berth",
  description: "Five berths. One cohort. Request a berth aboard Cyrolia.",
};

export const reserveHero = {
  kicker: "Reserve a Berth",
  headline: "Let’s see if this voyage is a fit.",
  lede: "Five berths. One cohort. We keep it small, non-competing, and deliberately chosen.",
  intro:
    "Alan reviews every request personally, because one poor fit changes the week for four other people.",
};

/* Question 1 — the router. Values travel on the wire as written. */
export const VOYAGE_AT_SEA = "The Strategy Blueprint at Sea — reset the company";
export const VOYAGE_JOY_DRIVEN =
  "The Joy-Driven Life Sailing Retreat — reset the person running it";
export const VOYAGE_UNDECIDED = "Both, or I am not sure yet";

export const voyageOptions = [VOYAGE_AT_SEA, VOYAGE_JOY_DRIVEN, VOYAGE_UNDECIDED] as const;

/**
 * Question 8, conditional on question 1.
 *
 * The business version deliberately does not ask for a Priority. Naming the
 * Priority is the work of the week; asking for it up front contradicts the
 * product. Do not reword it into "what is your top priority".
 */
export const bringingQuestion: Record<string, { label: string; helper?: string }> = {
  [VOYAGE_AT_SEA]: {
    label: "What is the challenge you would bring aboard?",
    helper:
      "You do not need to have named your Priority. Naming it is the work of the week. Unresolved challenges are exactly right.",
  },
  [VOYAGE_JOY_DRIVEN]: {
    label: "What is calling you to this voyage right now?",
  },
  [VOYAGE_UNDECIDED]: {
    label: "What would you most want to work on aboard?",
    helper: "Business, personal, or both. Tell us honestly and we will help you choose.",
  },
};

/** Sits under both Company and Your role — the reason we ask for either. */
export const cohortHelper = "We ask because each voyage is composed as a non-competing cohort.";

export const travellingWithOptions = [
  "Solo",
  "With my spouse or partner",
  "With a colleague or co-founder",
];

export const travellingWithHelper =
  "Cyrolia has two private staterooms and two salon berths. Staterooms go to couples first.";

/**
 * Question 10, conditional on question 1. Prices are shown deliberately and
 * must not be hidden behind a follow-up step.
 */
export const tierOptions: Record<string, string[]> = {
  [VOYAGE_AT_SEA]: [
    "Founder’s Cohort — $7,250 per person, limited to the first 2 registrations",
    "Core Retreat — $8,500 per person",
    "Executive Retreat — $14,500 per person",
    "A private charter for me and my leadership team",
    "Not sure yet",
  ],
  [VOYAGE_JOY_DRIVEN]: [
    "Founder’s Cohort — $7,250 per person, limited to 2 seats",
    "Core Retreat — $8,500 per person",
    "Couples Retreat — $13,600 total",
    "Lighthouse Executive Retreat — $14,500 per person",
    "Not sure yet",
  ],
  [VOYAGE_UNDECIDED]: [
    "Around $7,250 to $8,500",
    "$13,600 to $14,500",
    "A private charter for my leadership team",
    "Not sure yet",
  ],
};

export const readinessOptions = [
  "Just exploring",
  "Serious, need details",
  "Ready to move forward",
];

/** Stands in for a date selector — there is no sailing calendar to choose from yet. */
export const notifyCalendarLabel = "Notify me first when the sailing calendar is announced.";

export const submitLabel = "Request a Berth";
export const submitPendingLabel = "Sending…";

export const confirmation = {
  headline: "Request received.",
  body: [
    "Alan reviews each request personally, usually within two business days. The cohort is capped at five guests, and we will come back to you either way.",
    "A 50 percent deposit confirms your berth once fit is established. We do not take a deposit before that conversation.",
  ],
};

/**
 * Shown when the submission did not reach us. It says so plainly and hands
 * over a working alternative — a success message must never appear for a
 * failed submission.
 */
export const failure = {
  headline: "That did not send.",
  body: "Something went wrong on our end and your request was not submitted. Nothing has been recorded. Please email Alan directly and we will pick it up from there.",
  email: "apeterson@go4tpg.com",
  retryLabel: "Try again",
};

export const charterNote = {
  headline: "Chartering the whole vessel",
  body: "Chartering the whole vessel for you and your leadership team is a different conversation. Tell us in the form and we will route you to a discovery call instead.",
};

export const validationSummary = "Some answers still need attention. The fields are marked below.";
