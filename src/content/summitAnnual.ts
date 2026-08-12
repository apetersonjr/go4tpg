import type { FaqItem } from "@/content/faq";
import type { Deliverable } from "@/content/summits";

/**
 * The dedicated sales landing page for the flagship summit. Paid traffic and
 * outreach point here, so the page argues the offer end to end rather than
 * summarising it the way the `/summits` category page does.
 *
 * Section headlines that the brief left open are reused verbatim from the
 * approved category page rather than newly written, so the two pages speak in
 * one voice and nothing unapproved enters the content layer.
 */
export const annualMeta = {
  title: "Annual Planning Summit",
  description:
    "One day. The plan your business runs on. A facilitated planning summit with your leadership and execution team.",
};

export const annualHero = {
  kicker: "Annual Planning Summit",
  headline: "One day. The plan your business runs on.",
  lede: "A facilitated planning summit with your leadership and execution team. You leave with named priorities, a written plan, and a team accountable to deliver it.",
  ctaLabel: "Book a Planning Summit",
  ctaHref: "#commit",
};

export const annualDeliverablesKicker = "What you leave with";
/* Mirrors the category page's "Two written deliverables. Zero decks." */
export const annualDeliverablesHeadline = "Two written documents. Zero decks.";

export const annualDeliverables: Deliverable[] = [
  {
    title: "The Annual Blueprint",
    note: "delivered within 24 hours",
    items: [
      "Top priorities for the year ahead, locked and sequenced",
      "Success metrics for each, measurable and time-bound",
      "Action items driving each priority",
      "Accountability assigned in the room — every metric and action owned by a role and a person",
      "90-day execution plan",
      "KPI scoreboard, 5 to 8 metrics, with defined data feeds your team owns",
      "“Stop Doing” list",
      "A clear recommendation: execute independently, or proceed into the Sprint",
    ],
  },
  {
    title: "The Opportunity Scan",
    note: "delivered with your Blueprint, at no cost",
    items: [
      "The AI and automation opportunities that surfaced during your summit",
      "The standard units from the TPG AI Installation Menu that would have the greatest impact, each priced individually",
      "Recommended tools and platforms for each",
      "A clear path forward: install a la carte, or step up into a Revenue Operations Sprint",
      "The remaining opportunities worth pursuing later, including anything custom worth scoping through a Systems and Data Audit",
    ],
  },
];

export const annualHowItWorksKicker = "How it works";
export const annualHowItWorksHeadline = "Four steps. No homework before day one.";

export const annualHowItWorksSteps: string[] = [
  "We schedule your one-day summit with the right people in the room: the CEO or founder, plus the leadership and execution team.",
  "We facilitate. You talk, we extract. Priorities are locked, metrics defined, and accountability assigned before anyone leaves.",
  "Concurrently, as each function’s work surfaces, we capture where automation and AI would amplify it.",
  "Within 24 hours you receive both documents: the written Annual Blueprint, and your Opportunity Scan.",
];

export const annualAudienceKicker = "Who this is for";
export const annualAudienceHeadline = "Built for the person who knows something must change.";

export const annualAudienceItems: string[] = [
  "Founders who know something must change but are not sure what to fix first.",
  "Operators drowning in execution who need a sequenced plan.",
  "Teams that have the talent but lack the system.",
];

/** The page's single pricing block. No figure appears anywhere else. */
export const annualPricing = {
  price: "$4,750",
  notes: [
    "Credited in full toward a Revenue Operations Sprint booked within 14 days. The Blueprint becomes the foundation; the Sprint installs what it maps.",
  ],
};

export const annualFaq: FaqItem[] = [
  {
    question: "How long is the summit?",
    answer:
      "One full working day with your leadership and execution team. The exact schedule is set with you when we scope the session. Your Annual Blueprint and Opportunity Scan arrive within 24 hours.",
  },
  {
    question: "Who should be in the room?",
    answer:
      "The CEO or founder, plus the leadership and execution team. We need the people who run the business day to day, not just the strategy seat.",
  },
  {
    question: "What do I receive?",
    answer:
      "Two written documents. The Annual Blueprint: priorities, metrics, accountability, the 90-day plan, the scoreboard, and a clear recommendation. The Opportunity Scan: where AI and automation will amplify the work, matched to specific menu units and priced.",
  },
  {
    question: "Does the summit install anything?",
    answer:
      "No. The summit produces your plan and shows you exactly what to install first, priced. Installation is a separate engagement, chosen a la carte from the menu or delivered inside a Revenue Operations Sprint.",
  },
  {
    question: "What is complimentary and what is paid?",
    answer:
      "The Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems requires a paid Systems and Data Audit before custom work begins. That audit is scoped and priced per engagement, and you receive a written scope and a fixed price before any work starts.",
  },
  {
    question: "What if we want to move to a Sprint?",
    answer: "Your summit investment is credited in full toward a Sprint booked within 14 days.",
  },
];

export const annualClosing = {
  headline: "Walk in with a business full of open questions. Walk out with the plan.",
  ctaLabel: "Book a Planning Summit",
};
