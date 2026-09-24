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

/**
 * Chooser-first category page (Alan, 23 Sep 2026). The hero defines the format
 * in one paragraph and hands the reader straight to the Summit that fits the
 * moment; the offer detail lives on the three child pages.
 */
export const summitsHero = {
  kicker: "Planning Summits",
  headline: {
    lead: "Three Summits. One outcome... ",
    /* Set in the sky-blue italic accent, as on the homepage hero. */
    emphasis: "the plan your business runs on.",
  },
  definition:
    "A Planning Summit is a facilitated working session with your leadership and execution team that produces the written plan your business runs on... priorities, success metrics, accountability, and the discipline to deliver it.",
  chips: [
    { label: "Planning the year ahead → Annual", href: "/summits/annual" },
    { label: "The year has drifted → Mid-Year", href: "/summits/mid-year" },
    { label: "One quarter left → Finish Strong", href: "/summits/finish-strong" },
  ],
};

/** One card in the chooser. The `id` is the anchor the homepage deep links target. */
export type SummitChoice = {
  id: string;
  kicker: string;
  /** Inline orange badge beside the kicker, for the seasonal offer. */
  badge?: string;
  title: string;
  tagline: string;
  meta: string;
  price: string;
  credit: string;
  bookHref: string;
  detailHref: string;
};

export const chooserHeadline = "Which Summit is yours? Pick by where you are in the year.";
export const chooserSubline =
  "Same facilitated discipline in every room. The difference is the moment, the scope, and the plan you leave with.";

export const summitChoices: SummitChoice[] = [
  {
    id: "annual-planning-summit",
    kicker: "Planning the year ahead",
    title: "Annual Planning Summit",
    tagline: "Diagnose, align, and decide. The full plan for the year ahead.",
    meta: "One day · You leave with the Annual Blueprint",
    price: "$4,750",
    credit: "Credited in full toward a Sprint booked within 14 days.",
    bookHref: "/summits/annual/#commit",
    detailHref: "/summits/annual",
  },
  {
    id: "mid-year-reset-summit",
    kicker: "The year has drifted",
    title: "Mid-Year Reset Summit",
    tagline: "Recalibrate the second half before momentum sets your year.",
    meta: "One day · You leave with the Second-Half Plan",
    price: "$4,750",
    credit: "Credited in full toward a Sprint booked within 14 days.",
    bookHref: "/summits/mid-year/#commit",
    detailHref: "/summits/mid-year",
  },
  {
    id: "finish-strong-reset",
    kicker: "One quarter left",
    badge: "Now ... Sept-Dec",
    title: "Finish Strong Reset",
    tagline: "Half a day. One priority. A written 90-day plan to finish the year.",
    meta: "Half a day · You leave with the Finish Strong Plan",
    price: "$2,750",
    credit: "Credited in full toward a Sprint or a full Annual Planning Summit.",
    bookHref: "/summits/finish-strong/#commit",
    detailHref: "/summits/finish-strong",
  },
];

export type IncludeCard = {
  title: string;
  body: string;
  /** Expert Facilitation carries the orange accent: it is where the magic happens. */
  featured?: boolean;
};

export const includesHeadline = "Every Summit Includes";

export const includes: IncludeCard[] = [
  {
    title: "Expert Facilitation",
    body: "This is where the magic happens. Collaborative intelligence in the room... we extract, conceptualize, ideate, and build with your team, and the facilitation turns what your people already know into the plan they will actually run.",
    featured: true,
  },
  {
    title: "The Pre-Summit Diagnostic",
    body: "Every attendee answers it online beforehand. It shapes the agenda, and your team’s own answers open the session.",
  },
  {
    title: "Your written plan, within 24 hours",
    body: "A working operating document... priorities, metrics, accountability, a 90-day execution plan, and the scoreboard. With it, the system, rhythm, and cadence... simple tools your team actually uses, supporting the discipline the plan requires. Not notes. Not a deck.",
  },
  {
    title: "The AI Opportunity Scan, complimentary",
    body: "Plainly names the AI tools and opportunities that will raise productivity and automation across your business, matched to the TPG AI Installation Menu with what each costs. You also receive the basic workflow for each... so your team can build it in-house, or we install it for you as a separate engagement.",
  },
];

export const howItWorksHeadline = "How Our Summits Work";
/*
 * Framing per Alan, 23 Sep 2026: no claim of foreknowledge about where a client
 * is stuck. The pre-work sharpens the day; the plan is built in the room.
 */
export const howItWorksSubline =
  "Five steps. The pre-work sharpens the day. The room builds the plan.";

export const howItWorksSteps: Step[] = [
  {
    lead: "The Pre-Summit Diagnostic.",
    body: " Every attendee answers it online. It surfaces where each function is strained and where the team disagrees... good work in its own right.",
  },
  {
    lead: "We build the day around your answers.",
    body: " Your responses shape the agenda, and we arrive prepared.",
  },
  {
    lead: "The facilitated day.",
    body: " Your team’s own answers open the session, and the plan is built together... extracted, conceptualized, and locked, with accountability assigned in the room.",
  },
  {
    lead: "The AI layer, mapped.",
    body: " As each function’s work surfaces, we capture where automation would amplify it.",
  },
  {
    lead: "Within 24 hours, both documents.",
    body: " Your written plan, and your AI Opportunity Scan.",
  },
];

export const audienceKicker = "Who this is for";
export const audienceHeadline = "Built for the person who knows something must change.";

export const audienceItems: string[] = [
  "Founders who know something must change but are not sure what to fix first.",
  "Operators drowning in execution who need a sequenced plan.",
  "Teams that have the talent but lack the system.",
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
      "Two written deliverables. Your written plan — the Annual Blueprint from the Annual Planning Summit, or the Second-Half Plan from the Mid-Year Reset Summit — with priorities, metrics, accountability, the 90-day plan, the scoreboard, and a clear recommendation. The AI Opportunity Scan: the AI opportunities we surfaced, which workflows to install first, and what each costs.",
  },
  {
    question: "Does the summit install anything?",
    answer:
      "No. The summit produces your plan and shows you exactly what to install first, priced. Installation is a separate engagement, chosen a la carte from the TPG AI Installation Menu or delivered inside a Revenue Operations Sprint.",
  },
  {
    question: "What is complimentary and what is paid?",
    answer:
      "The AI Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems requires a paid Systems and Data Audit before custom work begins. That audit is scoped and priced per engagement, and you receive a written scope and a fixed price before any work starts.",
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
