import type { FaqItem } from "@/content/faq";
import type { Deliverable, Step } from "@/content/summits";

/**
 * The Mid-Year Reset Summit landing page.
 *
 * The offer is seasonal — campaign traffic is timed to early summer — but the
 * page stays published year-round rather than being taken down and rebuilt,
 * so inbound links and search placement survive the off-season.
 *
 * V20 (23 Sep 2026): the Mid-Year Reset Summit now credits in full toward a
 * Revenue Operations Sprint booked within 14 days, stated in the pricing block.
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
    title: "The AI Opportunity Scan",
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

/*
 * Blueprint V20, 23 Sep 2026: every summit includes a Pre-Summit
 * Diagnostic, so the previous four-step version — which claimed no pre-work —
 * was false. Copy per MidYearSummitPageCopy_080626.md Section 4.
 */
export const midYearHowItWorksHeadline =
  "Five steps. The pre-work sharpens the day. The room builds the plan.";

export const midYearHowItWorksSteps: Step[] = [
  {
    lead: "The Pre-Summit Diagnostic.",
    body: " Before we meet, everyone attending completes an online diagnostic. It surfaces where each function actually stands against what was promised in January, and where your team quietly disagrees about why... and it is good work in its own right: each person names what they would fix first, before the room can talk them out of it.",
  },
  {
    lead: "We build the session around your answers.",
    body: " Your responses shape the agenda, and we arrive prepared.",
  },
  {
    /* The differentiator — kept at full length deliberately. */
    lead: "We facilitate, and your own answers are in the room.",
    body: " The diagnostic comes back to your team as a working view of what they collectively said. Seeing it together is usually where the real conversation starts.",
  },
  {
    lead: "Priorities are re-locked for the second half,",
    body: " metrics defined, and accountability assigned before anyone leaves.",
  },
  {
    lead: "Within 24 hours, both documents.",
    body: " The written Second-Half Plan, and your AI Opportunity Scan.",
  },
];

/** The page's single pricing block. No figure appears anywhere else. */
export const midYearPricing = {
  price: "$4,750",
  notes: [
    "Credited in full toward a Revenue Operations Sprint booked within 14 days.",
    "Includes the written Second-Half Plan within 24 hours and the complimentary AI Opportunity Scan.",
  ],
};

export const midYearFaq: FaqItem[] = [
  {
    /* Leads the accordion: the Diagnostic is the first thing a reader must know. */
    question: "Is there anything to prepare?",
    answer:
      "Yes, and it is work worth doing. Every attendee completes the Pre-Summit Diagnostic online before we meet. It shapes the agenda, it surfaces where your team quietly disagrees about why the year drifted, and your team’s own collective answers open the session. The day depends on it... clients consistently tell us the pre-work changed the room before we arrived.",
  },
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
      "The AI Opportunity Scan is complimentary and bounded to a single standard workflow that surfaced in the room. Anything spanning multiple systems requires a paid Systems and Data Audit before custom work begins. That audit is scoped and priced per engagement.",
  },
];

export const midYearClosing = {
  headline: "Do not spend the second half explaining the first.",
  ctaLabel: "Book a Planning Summit",
};
