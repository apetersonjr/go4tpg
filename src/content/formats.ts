export type FormatCard = {
  title: string;
  description: string;
  offers: string[];
  linkLabel: string;
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
      "Facilitated planning summits that produce the plan your business runs on: priorities, success metrics, accountability, and the discipline to deliver. Your first AI workflows are installed within days.",
    offers: ["Strategic Reset Planning Summit", "Mid-Year Reset Summit"],
    linkLabel: "See the Summits →",
    accent: "primary",
  },
  {
    title: "AI System Installations",
    description:
      "Proven AI workflows and automations from TPG’s standard catalog... lead follow-up, pipeline, proposals, reporting, and collections... installed by our own AI architecture and engineering team. Custom development is scoped independently.",
    offers: ["Revenue Operations Sprint", "Fractional Chief Revenue Architect"],
    linkLabel: "See the Installations →",
    accent: "cta",
  },
  {
    title: "Retreats & Leadership Coaching",
    description:
      "Strategy retreats at sea and ongoing coaching for the people carrying the company, not just its systems.",
    offers: ["The Strategy Blueprint at Sea", "The Lighthouse Leadership OS"],
    linkLabel: "See Retreats & Coaching →",
    accent: "accent",
  },
];
