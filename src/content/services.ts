/** One of the three category cards on the hub. */
export type ServiceCard = {
  title: string;
  /** The one-line promise, set in italic under the title. */
  whatYouBuy: string;
  description: string;
  /** Named offers, joined with a middot when rendered. */
  offers: string[];
  linkLabel: string;
  href: string;
  /** Card top-border accent, matching the homepage format cards. */
  accent: "primary" | "cta" | "accent";
};

/** One row of the six-offer comparison table. */
export type ComparisonRow = {
  offer: string;
  category: string;
  duration: string;
  investment: string;
  outcome: string;
};

export const servicesMeta = {
  title: "Services",
  description:
    "Three ways in. One commitment. However you start, you walk away with named priorities, a written plan, and a team accountable to deliver it.",
};

export const servicesHero = {
  headline: "Three ways in. One commitment.",
  subline:
    "However you start, you walk away with named priorities, a written plan, and a team accountable to deliver it.",
};

export const serviceCards: ServiceCard[] = [
  {
    title: "Planning Summits",
    whatYouBuy: "What you buy: a written plan.",
    description:
      "Facilitated one-day summits that produce the plan your business runs on: priorities, success metrics, accountability, and the discipline to deliver. Every summit includes a complimentary Opportunity Scan showing where AI will amplify the work.",
    offers: ["Annual Planning Summit", "Mid-Year Reset Summit"],
    linkLabel: "See the Summits →",
    href: "/summits",
    accent: "primary",
  },
  {
    title: "AI System Installations",
    whatYouBuy: "What you buy: installed systems.",
    description:
      "Proven AI workflows and automations from the TPG AI Installation Menu, priced individually and installed by our own AI architecture and engineering team. Custom development is scoped independently.",
    offers: ["Revenue Operations Sprint", "Fractional Chief Revenue Architect"],
    linkLabel: "See the Installations →",
    href: "/installations",
    accent: "cta",
  },
  {
    title: "Retreats & Leadership Coaching",
    whatYouBuy: "What you buy: a relationship, and your own growth as a leader.",
    description:
      "Strategy retreats at sea aboard Cyrolia, Alan Peterson’s bluewater cruising sailboat, and ongoing coaching and facilitation for the people carrying the company.",
    offers: ["The Strategy Blueprint at Sea", "The Lighthouse Leadership OS"],
    linkLabel: "See Retreats & Coaching →",
    href: "/retreats-coaching",
    accent: "accent",
  },
];

export const comparisonHeadline = "All six, side by side.";

export const comparisonColumns = ["Offer", "Category", "Duration", "Investment", "You leave with"];

/**
 * The only pricing on this page, deliberately — the category pages carry the
 * tier detail. Figures mirror the Operating Blueprint v19; do not restate them
 * anywhere else on the hub.
 */
export const comparisonRows: ComparisonRow[] = [
  {
    offer: "Annual Planning Summit",
    category: "Planning Summits",
    duration: "One day",
    investment: "$4,750",
    outcome: "The Annual Blueprint and your Opportunity Scan",
  },
  {
    offer: "Mid-Year Reset Summit",
    category: "Planning Summits",
    duration: "One day",
    investment: "$4,750",
    outcome: "The Second-Half Plan and your Opportunity Scan",
  },
  {
    offer: "Revenue Operations Sprint",
    category: "AI System Installations",
    duration: "10 business days",
    investment: "$25,000 ($35,000 to $50,000+ for complex organizations)",
    outcome: "Annual Plan, Execution Cadence OS, 5 to 8 standard installations, KPI scoreboard",
  },
  {
    offer: "Fractional Chief Revenue Architect",
    category: "AI System Installations",
    duration: "90 days",
    investment: "Monthly retainer, scoped after the Annual Planning Summit",
    outcome: "Continued traction, discipline, and standard installations",
  },
  {
    offer: "The Strategy Blueprint at Sea",
    category: "Retreats & Coaching",
    duration: "7 nights",
    investment: "$7,250 to $14,500 per person",
    outcome: "A written Strategy Blueprint, one named Priority, 3 standard installations",
  },
  {
    offer: "The Lighthouse Leadership OS",
    category: "Retreats & Coaching",
    duration: "Standing rhythm",
    investment: "$1,500 to $4,750 per month",
    outcome: "The plan, the discipline, and at least one standard installation each quarter",
  },
];

export const comparisonNote =
  "Your Annual Planning Summit investment is credited in full toward a Revenue Operations Sprint booked within 14 days. Standard menu units are also available a la carte, priced individually.";

export const headcountReframe = {
  headline: "What role are you trying to hire? We install the system that role would build.",
  body: "Every CEO we meet is trying to fill a seat they cannot fill or cannot afford. A $25,000 Sprint costs less than one quarter of a mid-level hire, it delivers faster, it needs no onboarding, and the system outlasts any individual employee.",
  ctaLabel: "See the Sprint →",
  ctaHref: "/installations",
};

/** Closing directive, verbatim from the Operating Blueprint. */
export const startHere = {
  directive: "Start with the Annual Planning Summit.",
  body: "If there is clear upside and urgency, proceed directly into the Revenue Operations Sprint.",
};
