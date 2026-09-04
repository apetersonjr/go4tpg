/**
 * The six things every scorecard session must learn, and the closed vocabulary
 * used to record what it learned.
 *
 * This file is the contract between the three moving parts: the turn engine
 * that asks the questions, the analysis call that writes the report, and the
 * widget that renders the controls. All three read it, and none of them may
 * invent an intent or a signal that is not defined here.
 *
 * Why intents rather than questions: the wording of each question is written
 * fresh every session from what the visitor has already said, so there is no
 * fixed question text to key anything off. What is fixed is what each turn has
 * to LEARN. An intent is that requirement, plus a default wording to fall back
 * on when the model cannot be reached.
 *
 * Versioned because a completed session's signals are only interpretable
 * against the vocabulary they were extracted with. Bump on any change to the
 * intent list or the signal list.
 */

export const INTENTS_VERSION = 1;

/**
 * The signal vocabulary. Extraction may only emit strings from this list.
 *
 * A closed list rather than free-form tags because the analysis step reasons
 * over accumulated signals, and two sessions that both described manual
 * reporting have to produce the same token or the analysis cannot cluster
 * them. Free-form strings drift within a handful of sessions — "manual
 * reporting", "reports by hand", "no automation in reporting" — and every one
 * of them is a different key to anything downstream.
 *
 * When nothing fits, extraction emits nothing. An absent signal is a fact; an
 * invented one is a fabrication the report then reasons from.
 */
export const SIGNALS = [
  // What the business is and who it sells to.
  "industry_b2b",
  "industry_b2c",
  "high_customer_contact",
  "low_customer_contact",

  // Headcount band.
  "team_micro",
  "team_small",
  "team_mid",
  "team_large",

  // Where the leader's week actually goes.
  "founder_selling",
  "founder_in_support",
  "founder_in_meetings",
  "founder_in_admin",
  "founder_in_reporting",
  "founder_in_hiring",
  "founder_firefighting",
  "founder_in_vendor_finance",

  // Known leakage.
  "leak_revenue",
  "leak_cost",
  "leak_operational",
  "leak_followthrough",
  "leak_knowledge",
  "leak_receivables",

  // How the business is measured.
  "reporting_automated",
  "reporting_manual",
  "reporting_absent",

  // Standing conditions that cut across the above.
  "knowledge_undocumented",
  "crm_stale",
  "hiring_active",
] as const;

export type Signal = (typeof SIGNALS)[number];

const SIGNAL_SET: ReadonlySet<string> = new Set(SIGNALS);

/** Drops anything the model emitted that is not in the vocabulary. */
export function validSignals(input: unknown): Signal[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<Signal>();
  for (const entry of input) {
    if (typeof entry === "string" && SIGNAL_SET.has(entry)) seen.add(entry as Signal);
  }
  return [...seen];
}

/** How the widget renders the answer control for an intent. */
export type IntentFormat = "text" | "chips";

export type ScorecardIntent = {
  /** "q1".."q6". Stable; the analysis and the webhook both key off these. */
  id: string;
  /**
   * What this turn has to learn, written for the model rather than the
   * visitor. Never shown on screen.
   */
  mustLearn: string;
  /**
   * The wording used when the model is not available. Also the starting point
   * the model rephrases — a floor on quality, not a suggestion to ignore.
   */
  defaultText: string;
  format: IntentFormat;
  /** Chip labels. Empty for a text intent. */
  options: string[];
  /** Cap on chip selections. `null` means no cap; ignored for text intents. */
  maxSelections: number | null;
  /** Whether a free-text box sits under the chips. */
  allowOther: boolean;
  /** Short label for the progress row, naming what is being asked about. */
  topic: string;
  /** Placeholder for a text intent. Empty for chips. */
  placeholder: string;
  /**
   * True for the one intent that is never skipped and never reordered. Q6
   * carries the most sales signal and its answer leads the results, so it
   * cannot be satisfied by inference from an earlier answer.
   */
  alwaysAsk: boolean;
};

/*
 * Order is load-bearing in two places and free everywhere else. Q1 is first
 * because someone who has just handed over an email address needs a question
 * they can answer without thinking. Q6 is last because it is the one that earns
 * the three minutes and it is the line Alan reads first.
 */
export const intents: ScorecardIntent[] = [
  {
    id: "q1",
    mustLearn:
      "What industry the company operates in, whether it sells to businesses or to consumers, and how much direct contact the company has with its customers.",
    defaultText: "To start, what does your company do?",
    format: "text",
    options: [],
    maxSelections: null,
    allowOther: false,
    topic: "The business",
    placeholder: "A sentence is enough",
    alwaysAsk: false,
  },
  {
    id: "q2",
    mustLearn: "Roughly how many people work in the organization.",
    defaultText: "How many people are in the organization today?",
    format: "chips",
    options: ["Fewer than 10", "10 to 25", "26 to 50", "51 to 100", "More than 100"],
    maxSelections: 1,
    allowOther: false,
    topic: "Headcount",
    placeholder: "",
    alwaysAsk: false,
  },
  {
    id: "q3",
    mustLearn:
      "Where the leader's own working week actually goes — which activities consume the most of their personal time.",
    defaultText: "Which of these consumes most of your weekly time?",
    format: "chips",
    options: [
      "Selling and closing deals personally",
      "Being pulled into customer or client issues",
      "Meetings, and the follow-up work they generate",
      "Approvals, paperwork and administrative decisions",
      "Assembling numbers to understand where the business stands",
      "Hiring, developing and retaining people",
      "Resolving operational problems as they arise",
      "Managing vendors, contracts and finances",
    ],
    maxSelections: 2,
    allowOther: true,
    topic: "Founder time",
    placeholder: "",
    alwaysAsk: false,
  },
  {
    id: "q4",
    mustLearn:
      "Leakage and inefficiency the leader already knows about — lost revenue, wasted cost, or operational drag.",
    defaultText:
      "Where are the leaks or inefficiencies you already know are costing you, whether in lost revenue, wasted cost, or operational drag?",
    format: "text",
    options: [],
    maxSelections: null,
    allowOther: false,
    topic: "Leakage",
    placeholder: "A sentence is enough",
    alwaysAsk: false,
  },
  {
    id: "q5",
    mustLearn:
      "Whether the reporting that tells them how the business is doing is automated, assembled manually, or effectively absent.",
    defaultText: "How do you currently manage and measure what matters most in the business?",
    format: "chips",
    options: [
      "A management report someone prepares on a set rhythm",
      "Dashboards I review myself",
      "I ask my leadership team directly",
      "We track it, but not on a consistent rhythm",
      "Honestly, not as rigorously as I would like",
    ],
    maxSelections: 1,
    allowOther: true,
    topic: "Reporting",
    placeholder: "",
    alwaysAsk: false,
  },
  {
    id: "q6",
    mustLearn:
      "The single recurring, important task they would hand to a resource that would handle it more consistently than they do today.",
    defaultText:
      "If you could hand one recurring, important task to a resource that would handle it more consistently and reliably than you do today, what would it be?",
    format: "text",
    options: [],
    maxSelections: null,
    allowOther: false,
    topic: "The one thing",
    placeholder: "A sentence is enough",
    alwaysAsk: true,
  },
];

export const intentCount = intents.length;

export const intentIds = intents.map((intent) => intent.id);

const intentsById = new Map(intents.map((intent) => [intent.id, intent]));

export function findIntent(id: string): ScorecardIntent | undefined {
  return intentsById.get(id);
}

/**
 * The first intent not yet satisfied, in catalog order.
 *
 * `alwaysAsk` intents are held back until every other intent is satisfied, so
 * q6 lands last even when the walk would otherwise reach it early. Returns
 * undefined when the session is complete.
 */
export function nextIntent(satisfied: ReadonlySet<string>): ScorecardIntent | undefined {
  const outstanding = intents.filter((intent) => !satisfied.has(intent.id));
  return outstanding.find((intent) => !intent.alwaysAsk) ?? outstanding[0];
}

/** Intents that may be marked satisfied by inference from an earlier answer. */
export function isSkippable(id: string): boolean {
  return findIntent(id)?.alwaysAsk === false;
}

/**
 * Openers for q1, one drawn per session.
 *
 * Same intent, same extraction, four wordings. A returning visitor — and
 * anyone watching the widget demoed twice in a row — should not be greeted by
 * a string they can recite. Every line asks for exactly what `q1.mustLearn`
 * needs, so which one is drawn changes nothing downstream.
 *
 * The draw happens once, server-side, when the session starts, and the chosen
 * text travels on the question itself. A re-render cannot reroll it because
 * nothing on the client ever calls this.
 */
export const q1Openers = [
  "To start, what does your company do?",
  "First things first - what business are you in?",
  "Let's start with the basics. What does your company do?",
  "Before anything else: what line of work are you in?",
] as const;

export function drawOpener(): string {
  return q1Openers[Math.floor(Math.random() * q1Openers.length)];
}
