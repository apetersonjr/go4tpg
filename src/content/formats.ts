export type FormatCard = {
  title: string;
  description: string;
  offers: string[];
  linkLabel: string;
  /**
   * Link destination. Currently the Services page anchors; will repoint to
   * the real category pages (/summits, /installations, /retreats-coaching)
   * in the next build — a one-line change per card.
   */
  href: string;
  /** Card top-border accent color. */
  accent: "primary" | "cta" | "accent";
};

export const formatsKicker = "Three ways in. One commitment.";

export const formatsHeadline =
  "However you start, you walk away with named priorities, a written plan, and a team accountable to deliver it.";

export const formatCards: FormatCard[] = [
  {
    title: "Planning Summits",
    description:
      "Facilitated planning summits that produce the plan your business runs on: priorities, success metrics, accountability, and the discipline to deliver. Every summit includes a complimentary Opportunity Scan showing exactly where AI will amplify the work, and what to install first.",
    offers: ["Annual Planning Summit", "Mid-Year Reset Summit"],
    linkLabel: "See the Summits →",
    href: "#summits",
    accent: "primary",
  },
  {
    title: "AI System Installations",
    description:
      "Proven AI workflows and automations from the TPG AI Installation Menu... lead follow-up, pipeline, proposals, reporting, and collections... priced individually and installed by our own AI architecture and engineering team. Custom development is scoped independently.",
    offers: ["Revenue Operations Sprint", "Fractional Chief Revenue Architect"],
    linkLabel: "See the Installations →",
    href: "#installations",
    accent: "cta",
  },
  {
    title: "Retreats & Leadership Coaching",
    description:
      "Strategy retreats at sea and ongoing coaching for the people carrying the company, not just its systems.",
    offers: ["The Strategy Blueprint at Sea", "The Lighthouse Leadership OS"],
    linkLabel: "See Retreats & Coaching →",
    href: "#retreats",
    accent: "accent",
  },
];
