import type { FaqItem } from "@/content/faq";

export type Deliverable = {
  title: string;
  /** Short qualifier rendered after the title, e.g. the delivery window. */
  note: string;
  items: string[];
};

export type Offering = {
  title: string;
  tagline: string;
  body: string[];
  /**
   * Investment, once V19 pricing is approved. Null renders nothing — the page
   * has no pricing block and no placeholder to tidy up, so filling this in is
   * the only change needed to start showing a price.
   */
  price: string | null;
  ctaLabel: string;
  ctaHref: string;
};

export const summitsMeta = {
  title: "Planning Summits",
  description:
    "A facilitated planning summit with your leadership and execution team. You leave with named priorities, a written plan, and a team accountable to deliver it.",
};

export const summitsHero = {
  kicker: "Format 01 — Planning Summits",
  headline: "One day. The plan your business runs on.",
  /*
   * V19: the V17 comps closed this paragraph with an in-summit AI
   * installation promise. Summits are pure planning now, so it is replaced by
   * the Opportunity Scan sentence already approved on the homepage in
   * `formats.ts`.
   */
  lede: "A facilitated planning summit with your leadership and execution team. You leave with named priorities, a written plan, and a team accountable to deliver it. Every summit includes a complimentary Opportunity Scan showing exactly where AI will amplify the work, and what to install first.",
  ctaLabel: "Book a Planning Summit",
  ctaHref: "/#commit",
};

export const deliverablesKicker = "What you leave with";
export const deliverablesHeadline = "Two written deliverables. Zero decks.";

export const deliverables: Deliverable[] = [
  {
    title: "The Strategic Blueprint",
    note: "delivered within 24 hours",
    items: [
      "Top priorities for the period, locked and sequenced",
      "Success metrics for each — measurable and time-bound",
      "Action items driving each priority",
      "Accountability assigned in the room — every metric and action owned by a role and a person",
      "90-day execution plan",
      "KPI scoreboard (5 to 8 metrics) with defined data feeds your team owns",
      "“Stop Doing” list",
      "Clear recommendation: execute independently or proceed into the Sprint",
    ],
  },
  {
    /*
     * V19: this was the adoption deliverable, installed across two return
     * sessions. The summit no longer installs anything, so it is renamed to
     * the Opportunity Scan and cut back to its diagnostic contents. The two
     * bullets promising hands-on installation and adoption support are gone
     * rather than reworded.
     */
    title: "The Opportunity Scan",
    note: "complimentary with every summit",
    items: [
      "The AI and automation opportunities that surfaced during your summit",
      "Which workflows from the TPG AI Installation Menu to install first",
      "What each costs",
      "Recommended tools and platforms for each",
      "Remaining opportunities — additional standard units worth installing, and custom opportunities worth scoping independently",
    ],
  },
];

export const howItWorksKicker = "How it works";
export const howItWorksHeadline = "Four steps. No homework before day one.";

export const howItWorksSteps: string[] = [
  "We schedule your one-day summit with the right people in the room — the CEO or founder plus the leadership and execution team.",
  "We facilitate. You talk, we extract. Priorities are locked, metrics defined, accountability assigned before anyone leaves.",
  "Within 24 hours, you receive the written Strategic Blueprint — a working operating document, not notes, not a deck.",
  /*
   * V19: step four used to be two 90-minute sessions that installed the top
   * 2 to 3 standard workflows hands-on. Rewritten around delivery of the Scan.
   * No delivery window is stated because none is approved anywhere in the
   * content layer — the old ten-day window belonged to the installation
   * sessions, which no longer exist.
   */
  "You receive the complimentary Opportunity Scan — where AI will amplify the work, which workflows to install first, and what each costs.",
];

export const audienceKicker = "Who this is for";
export const audienceHeadline = "Built for the person who knows something must change.";

export const audienceItems: string[] = [
  "Founders who know something must change but are not sure what to fix first.",
  "Operators drowning in execution who need a sequenced plan.",
  "Teams that have the talent but lack the system.",
];

export const offeringsKicker = "Planning Summits";

/*
 * The `#summits` group description, minus its closing sentence — an in-summit
 * AI installation promise that V19 retracts.
 */
export const offeringsHeadline =
  "Facilitated one-day sessions that produce the plan your business runs on: priorities, success metrics, accountability, and the discipline to deliver it.";

export const summitOfferings: Offering[] = [
  {
    title: "Annual Planning Summit",
    tagline:
      "A facilitated planning summit that aligns your leadership team on priorities, metrics, and ownership — and concurrently maps where AI and automation will amplify the work.",
    body: [
      "A facilitated one-day planning summit with your leadership and execution team. Together we lock the priorities that matter most, give each a measurable, time-bound definition of success, name the actions that drive it, and assign every priority, metric, and action to a person in the room. As the work of each function surfaces, we map where automation and AI execution will amplify output across your team.",
    ],
    price: null,
    ctaLabel: "Book a Planning Summit",
    ctaHref: "/#commit",
  },
  {
    title: "Mid-Year Reset Summit",
    tagline:
      "Recalibrate the second half before momentum sets your year — the seasonal entry point into the Reset Series.",
    body: [
      /*
       * V19: the source paragraph ended "One 90-minute installation session
       * within one week installs the top 2 to 3 standard AI workflows that
       * surfaced." Removed outright; the Opportunity Scan sentence below is
       * the approved homepage replacement.
       */
      "A facilitated one-day session that assesses exactly where the business stands at mid-year, function by function, and sharpens priorities, metrics, and ownership for the second half. The Second-Half Plan is delivered in writing within 24 hours — position assessment, second-half priorities locked and sequenced, success metrics, action items with ownership assigned in the room, a 90-day second-half execution plan and KPI scoreboard, and a “Stop Doing” list.",
      "Every summit includes a complimentary Opportunity Scan showing exactly where AI will amplify the work, and what to install first.",
      "Best run in early July — giving the recalibrated plan a full six months to compound before year-end.",
    ],
    price: null,
    ctaLabel: "Book a Mid-Year Reset",
    ctaHref: "/#commit",
  },
];

export const summitsFaq: FaqItem[] = [
  {
    question: "How long is the summit?",
    /*
     * V19: dropped "The two 90-minute installation sessions follow within ten
     * days" from the middle of this answer.
     */
    answer:
      "One full working day with your leadership and execution team. The exact schedule is set with you when we scope the session, and the written Strategic Blueprint arrives within 24 hours of the summit itself.",
  },
  {
    question: "Who should be in the room?",
    answer:
      "The CEO or founder, plus the leadership and execution team — typically 3 to 6 people. We need the people who run the business day-to-day, not just the strategy seat.",
  },
  {
    question: "What do I receive?",
    /*
     * V19: the second deliverable was "the top 2 to 3 standard workflows,
     * installed hands-on with your team".
     */
    answer:
      "Two written deliverables. The Strategic Blueprint: priorities, metrics, accountability, the 90-day plan, the scoreboard, and a clear recommendation. The Opportunity Scan: the AI opportunities we surfaced, which workflows to install first, and what each costs.",
  },
  {
    /*
     * V19: replaced wholesale with the approved answer from `faq.ts`, which
     * carries both the Installation Menu naming and the paid Systems and Data
     * Audit as the custom-scoping trigger.
     */
    question: "What is standard and what is custom?",
    answer:
      "Standard installations come from the TPG AI Installation Menu... lead follow-up, pipeline, proposals, reporting, collections. They run on mainstream platforms with no custom code and are priced individually, so you can install them a la carte. They are also included by count inside the larger engagements. Custom development and integrations are always scoped independently, in writing, after a paid Systems and Data Audit.",
  },
  {
    question: "What if we want to move to a Sprint?",
    /*
     * V19: dropped "Most clients decide within the two installation
     * sessions... by then the upside is quantified."
     */
    answer: "Your summit investment is credited in full toward a Sprint booked within 14 days.",
  },
];

export const summitsClosing = {
  headline: "Walk in with a business full of open questions. Walk out with the plan.",
  ctaLabel: "Book a Planning Summit",
  ctaHref: "/#commit",
};
