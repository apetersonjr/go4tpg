import type { FaqItem } from "@/content/faq";

/**
 * One step in a "how it works" band. The lead is set in bold and carries the
 * step's claim; the body explains it. Split rather than stored as one string
 * so the Pre-Summit Diagnostic steps read as statements, not bullets.
 */
export type Step = {
  lead: string;
  /** Continues the sentence after the lead — begins with its own spacing. */
  body: string;
};

export type Deliverable = {
  title: string;
  /** Short qualifier rendered after the title, e.g. the delivery window. */
  note: string;
  /** Lead-in paragraph above the list. Empty renders nothing. */
  intro?: string;
  items: string[];
  /** Boundary or qualifier paragraph after the list. Empty renders nothing. */
  outro?: string;
};

export type Offering = {
  /**
   * Anchor id for this offer's card on its category page. Deep links from the
   * homepage format cards target it, so it must stay in sync with the hrefs in
   * `formats.ts`.
   */
  id: string;
  /** Small label above the title, e.g. the delivering brand. Empty renders nothing. */
  eyebrow?: string;
  title: string;
  tagline: string;
  body: string[];
  /**
   * Headline investment figure, per the Operating Blueprint v19 (6 Aug 2026).
   * Null for offers with no fixed price — those carry the explanation in
   * `priceNotes` instead, and no figure is rendered.
   */
  price: string | null;
  /**
   * Qualifying lines under the figure: tier label, credit terms, ranges for
   * larger engagements. Rendered muted and in order; empty renders nothing.
   */
  priceNotes: string[];
  ctaLabel: string;
  ctaHref: string;
  /**
   * Secondary link to this offer's own page, where it has one. The primary CTA
   * stays on the local booking block, so reading more and booking are two
   * different actions rather than one competing pair.
   */
  detailHref?: string;
  detailLabel?: string;
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
  ctaHref: "#commit",
};

export const deliverablesKicker = "What you leave with";
export const deliverablesHeadline = "Two written deliverables. Zero decks.";

export const deliverables: Deliverable[] = [
  {
    /*
     * V19: the old shared deliverable name is retired — it belonged to no
     * current offer and collided with "The Strategy Blueprint at Sea", a
     * different product. The two summits produce two named deliverables;
     * generically the page says "your written plan".
     */
    title: "Your written plan",
    note: "delivered within 24 hours",
    intro:
      "The Annual Planning Summit produces the Annual Blueprint. The Mid-Year Reset Summit produces the Second-Half Plan. Both carry:",
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
    outro:
      "The Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems is scoped through a paid Systems and Data Audit before we build.",
  },
];

export const howItWorksKicker = "How it works";

/*
 * Blueprint V20 (23 Sep 2026): every summit opens with the Pre-Summit
 * Diagnostic, and the previous four-step version denied any pre-work. The
 * pre-work is framed as TPG preparation, which is what it actually is.
 */
export const howItWorksHeadline = "Five steps. We arrive already knowing where you are stuck.";

export const howItWorksSteps: Step[] = [
  {
    lead: "The Pre-Summit Diagnostic.",
    body: " Before we meet, every attendee completes an online diagnostic. It surfaces where each function is strained and where the team disagrees... and it is good work in its own right: each person names what is working, what is not, and what they would fix first.",
  },
  {
    lead: "We build the session around your answers.",
    body: " Your responses shape the agenda. We arrive with the constraints already mapped.",
  },
  {
    /* The differentiator — kept at full length deliberately. */
    lead: "We facilitate, and your own answers are in the room.",
    body: " The diagnostic comes back to your team as a working view of what they collectively said. Seeing it together is usually where the real conversation starts. Priorities are locked, metrics defined, and accountability assigned before anyone leaves.",
  },
  {
    lead: "Concurrently, we map the AI layer.",
    body: " As each function’s work surfaces, we capture where automation and AI would amplify it.",
  },
  {
    lead: "Within 24 hours, both documents.",
    body: " Your written plan... the Annual Blueprint, the Second-Half Plan, or the Finish Strong Plan, depending on the summit... and your complimentary Opportunity Scan.",
  },
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
export const offeringsHeadline = "Set the year. Reset it. Or finish it.";

export const summitOfferings: Offering[] = [
  {
    id: "annual-planning-summit",
    title: "Annual Planning Summit",
    tagline:
      "A facilitated planning summit that aligns your leadership team on priorities, metrics, and ownership — and concurrently maps where AI and automation will amplify the work.",
    body: [
      "A facilitated one-day planning summit with your leadership and execution team. Together we lock the priorities that matter most, give each a measurable, time-bound definition of success, name the actions that drive it, and assign every priority, metric, and action to a person in the room. As the work of each function surfaces, we map where automation and AI execution will amplify output across your team.",
    ],
    price: "$4,750",
    priceNotes: ["Credited toward a Sprint if booked within 14 days."],
    ctaLabel: "Book a Planning Summit",
    ctaHref: "#commit",
    detailHref: "/summits/annual",
    detailLabel: "See the full Annual Planning Summit",
  },
  {
    id: "mid-year-reset-summit",
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
    price: "$4,750",
    /* V20 (23 Sep 2026): the Mid-Year Reset Summit now credits toward a Sprint. */
    priceNotes: ["Credited in full toward a Revenue Operations Sprint booked within 14 days."],
    ctaLabel: "Book a Mid-Year Reset",
    ctaHref: "#commit",
    detailHref: "/summits/mid-year",
    detailLabel: "See the full Mid-Year Reset Summit",
  },
  {
    id: "finish-strong-reset",
    title: "Finish Strong Reset",
    tagline: "Half a day. One priority. A written 90-day plan to finish the year.",
    body: [
      "A four-hour facilitated session, described as half a day, with the founder and leadership team. We assess where the year actually stands, lock the one priority that still moves the number, assign ownership in the room, and deliver a written 90-day plan through year-end. You leave with the Finish Strong Plan and your Opportunity Scan. For teams who want the full annual plan, this is the on-ramp to the Annual Planning Summit. Marketed September through December; available year-round for companies whose fiscal year ends elsewhere.",
    ],
    price: "$2,750",
    priceNotes: [
      "Credited in full toward a Revenue Operations Sprint or a full Annual Planning Summit.",
    ],
    ctaLabel: "Book a Finish Strong Reset",
    /* The CTA is the offer's own page, per V20; it carries the booking block. */
    ctaHref: "/summits/finish-strong",
  },
];

export const summitsFaq: FaqItem[] = [
  {
    /* Leads the accordion: the Diagnostic is the first thing a reader must know. */
    question: "Is there anything to prepare?",
    answer:
      "Yes, and it is work worth doing. Every attendee completes the Pre-Summit Diagnostic online before we meet. It shapes the agenda, it surfaces where your team quietly disagrees, and your team’s own collective answers open the session. The day depends on it... clients consistently tell us the pre-work changed the room before we arrived.",
  },
  {
    question: "How long is the summit?",
    /*
     * V19: dropped "The two 90-minute installation sessions follow within ten
     * days" from the middle of this answer.
     */
    answer:
      "One full working day with your leadership and execution team. The exact schedule is set with you when we scope the session, and your written plan arrives within 24 hours of the summit itself.",
  },
  {
    question: "Who should be in the room?",
    /* V19: the typical-room-size figure was never approved and is removed. */
    answer:
      "The CEO or founder, plus the leadership and execution team. We need the people who run the business day to day, not just the strategy seat.",
  },
  {
    question: "What do I receive?",
    /*
     * V19: the second deliverable was "the top 2 to 3 standard workflows,
     * installed hands-on with your team".
     */
    answer:
      "Two written deliverables. Your written plan — the Annual Blueprint from the Annual Planning Summit, or the Second-Half Plan from the Mid-Year Reset Summit — with priorities, metrics, accountability, the 90-day plan, the scoreboard, and a clear recommendation. The Opportunity Scan: the AI opportunities we surfaced, which workflows to install first, and what each costs.",
  },
  {
    question: "Does the summit install anything?",
    answer:
      "No. The summit produces your plan and shows you exactly what to install first, priced. Installation is a separate engagement, chosen a la carte from the TPG AI Installation Menu or delivered inside a Revenue Operations Sprint.",
  },
  {
    question: "What is complimentary and what is paid?",
    answer:
      "The Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems requires a paid Systems and Data Audit before custom work begins. That audit is scoped and priced per engagement, and you receive a written scope and a fixed price before any work starts.",
  },
  {
    /*
     * V19: replaced wholesale with the approved answer from `faq.ts`, which
     * carries both the Installation Menu naming and the paid Systems and Data
     * Audit as the custom-scoping trigger.
     */
    question: "What is standard and what is custom?",
    answer:
      "Standard installations come from the TPG AI Installation Menu... nineteen workflows across eight sections of the business, from the Company AI Brain through revenue, customers, operations, and reporting. They run on mainstream platforms with no custom code and are priced individually, so you can install them a la carte. They are also included by count inside the larger engagements. Custom development and integrations are always scoped independently, in writing, after a paid Systems and Data Audit.",
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
  ctaHref: "#commit",
};
