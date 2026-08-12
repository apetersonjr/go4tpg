import type { FaqItem } from "@/content/faq";
import type { Deliverable } from "@/content/summits";

/**
 * The Mid-Year Reset Summit landing page.
 *
 * The offer is seasonal — campaign traffic is timed to early summer — but the
 * page stays published year-round rather than being taken down and rebuilt,
 * so inbound links and search placement survive the off-season.
 *
 * Note the deliberate omission: no Sprint credit is stated anywhere here. The
 * credit is canonical for the Annual Planning Summit only.
 */
export const midYearMeta = {
  title: "Mid-Year Reset Summit",
  description:
    "Half the year is gone. The plan can still change the outcome. A facilitated one-day summit that recalibrates the second half.",
};

export const midYearHero = {
  kicker: "Mid-Year Reset Summit",
  headline: "Half the year is gone. The plan can still change the outcome.",
  lede: "A facilitated one-day summit that assesses exactly where your business stands at mid-year, function by function, and sharpens priorities, metrics, and accountability for the second half.",
  ctaLabel: "Book a Planning Summit",
  ctaHref: "#commit",
};

export const midYearWhy = {
  kicker: "Why mid-year",
  headline: "Momentum is about to set your year for you.",
  body: [
    "Most companies write a plan in January and discover in September that the year drifted. By then the options are gone. Mid-year is the last point at which a correction still has enough runway to compound.",
  ],
  note: "Best run in early July. That gives the recalibrated plan a full six months to work before year-end.",
};

export const midYearDeliverablesKicker = "What you leave with";
export const midYearDeliverablesHeadline = "Two written documents. Zero decks.";

export const midYearDeliverables: Deliverable[] = [
  {
    title: "The Second-Half Plan",
    note: "delivered within 24 hours",
    items: [
      "Mid-year position assessment, function by function",
      "Second-half priorities, locked and sequenced",
      "Success metrics, measurable and time-bound",
      "Action items, with accountability assigned in the room",
      "90-day second-half execution plan",
      "KPI scoreboard, 5 to 8 metrics, with defined data feeds your team owns",
      "“Stop Doing” list and clear recommendations",
    ],
  },
  {
    title: "The Opportunity Scan",
    note: "delivered with your plan, at no cost",
    items: [
      "The AI and automation opportunities that surfaced during your summit",
      "The standard units from the TPG AI Installation Menu that would have the greatest impact, each priced individually",
      "Recommended tools and platforms for each",
      "A clear path forward: install a la carte, or step up into a Revenue Operations Sprint",
      "The remaining opportunities worth pursuing later",
    ],
  },
];

export const midYearHowItWorksKicker = "How it works";
export const midYearHowItWorksHeadline = "Four steps. No homework before day one.";

export const midYearHowItWorksSteps: string[] = [
  "We schedule your one-day summit with the right people in the room: the CEO or founder, plus the leadership and execution team.",
  "We facilitate. We start with an honest assessment of where each function actually stands against what was promised in January.",
  "Priorities are re-locked for the second half, metrics defined, and accountability assigned before anyone leaves.",
  "Within 24 hours you receive both documents: the written Second-Half Plan, and your Opportunity Scan.",
];

/**
 * The page's single pricing block. No Sprint credit here — see the file
 * comment above.
 */
export const midYearPricing = {
  price: "$4,750",
  notes: [
    "Includes the written Second-Half Plan within 24 hours and the complimentary Opportunity Scan.",
  ],
};

export const midYearFaq: FaqItem[] = [
  {
    question: "How is this different from the Annual Planning Summit?",
    answer:
      "Same facilitated structure, different starting point. The Annual Planning Summit builds the plan for the year ahead. This one assesses where you actually are at mid-year, function by function, and rebuilds the plan for the second half.",
  },
  {
    question: "What if our January plan was fine?",
    answer:
      "Then this is a short conversation and a fast confirmation. More often, the plan was fine and execution drifted, and the value is in naming that honestly while there is still time to correct it.",
  },
  {
    question: "Does the summit install anything?",
    answer:
      "No. It produces your plan and shows you exactly what to install first, priced. Installation is a separate engagement, chosen a la carte from the TPG AI Installation Menu or delivered inside a Revenue Operations Sprint.",
  },
  {
    question: "What is complimentary and what is paid?",
    answer:
      "The Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems requires a paid Systems and Data Audit before custom work begins. That audit is scoped and priced per engagement.",
  },
];

export const midYearClosing = {
  headline: "Do not spend the second half explaining the first.",
  ctaLabel: "Book a Planning Summit",
};
