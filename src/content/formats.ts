/** One named offer inside a format card, linked to its card on the category page. */
export type FormatOffer = {
  label: string;
  /** Deep link — must match the `id` on the corresponding `Offering`. */
  href: string;
};

export type FormatCard = {
  title: string;
  description: string;
  offers: FormatOffer[];
  linkLabel: string;
  /** Link destination — the category page this format belongs to. */
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
    offers: [
      { label: "Annual Planning Summit", href: "/summits#annual-planning-summit" },
      { label: "Mid-Year Reset Summit", href: "/summits#mid-year-reset-summit" },
    ],
    linkLabel: "See the Summits →",
    href: "/summits",
    accent: "primary",
  },
  {
    title: "AI System Installations",
    description:
      "Proven AI workflows and automations from the TPG AI Installation Menu... lead follow-up, pipeline, proposals, reporting, and collections... priced individually and installed by our own AI architecture and engineering team. Custom development is scoped independently.",
    offers: [
      { label: "Revenue Operations Sprint", href: "/installations#revenue-operations-sprint" },
      {
        label: "Fractional Chief Revenue Architect",
        href: "/installations#fractional-chief-revenue-architect",
      },
    ],
    linkLabel: "See the Installations →",
    href: "/installations",
    accent: "cta",
  },
  {
    title: "Retreats & Leadership Coaching",
    description:
      "Strategy retreats at sea and ongoing coaching for the people carrying the company, not just its systems.",
    offers: [
      {
        label: "The Strategy Blueprint at Sea",
        href: "/retreats-coaching#strategy-blueprint-at-sea",
      },
      {
        label: "The Lighthouse Leadership OS",
        href: "/retreats-coaching#lighthouse-leadership-os",
      },
    ],
    linkLabel: "See Retreats & Coaching →",
    href: "/retreats-coaching",
    accent: "accent",
  },
];
