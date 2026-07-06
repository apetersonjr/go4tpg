export type HeroHeadline = {
  /** Plain text before the italic emphasis span. */
  lead: string;
  /** Text rendered in the accent-blue italic serif span. */
  emphasis: string;
};

/**
 * The five rotating hero headlines, in display order. Copied verbatim from
 * the approved reference design.
 */
export const heroHeadlines: HeroHeadline[] = [
  {
    lead: "Blueprints, not decks.",
    emphasis: "Installed systems, not advice.",
  },
  {
    lead: "You don't have an operating system.",
    emphasis: "You have a collection of habits.",
  },
  {
    lead: "We install what your next hire would spend six months trying to build:",
    emphasis: "the systems, the AI, or the leadership discipline to run without you.",
  },
  {
    lead: "One session or a standing relationship.",
    emphasis: "However long it takes to install what's actually missing.",
  },
  {
    lead: "TPG delivers the focus, alignment, accountability, and execution any operating system promises,",
    emphasis: "and then installs what those systems never do.",
  },
];

export const heroEyebrow = "THE PETERSON GROUP · EST. 1991";

export const heroSupportingCopy =
  "TPG facilitates, installs, and sustains the systems, AI architecture, and leadership operating rhythms growing companies are missing, whether that takes a single session, a ten-day sprint, an embedded fractional role, an offshore week, or an ongoing coaching relationship.";

export const heroInstallList: string[] = [
  "A quantified plan with dollar targets",
  "A meeting cadence your team runs without you",
  "Live dashboards, CRM builds, and custom mini apps",
  "Workflow automations replacing manual busywork",
  "A team that is AI-fluent and self-sufficient",
];

export const heroInstallPanelTitle = "What TPG's engineering team can install";
export const heroInstallPanelEyebrow = "SCOPED INTO ANY RESET INTENSIVE OR SYSTEM PROGRAM";

/** Seconds each headline is displayed before crossfading to the next. */
export const heroRotationSeconds = 5.4;
