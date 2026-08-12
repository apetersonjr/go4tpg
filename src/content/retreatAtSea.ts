import type { FaqItem } from "@/content/faq";
import type { PricingTier } from "@/content/retreats";

/**
 * The Strategy Blueprint at Sea landing page.
 *
 * Two standing constraints on this content:
 * Cyrolia is defined at first mention on every page she appears on — the hero
 * lede carries the definition here — and no voyage date is ever published.
 * Both retreats read TBD until Alan sets the calendar.
 */
export const atSeaMeta = {
  title: "The Strategy Blueprint at Sea",
  description:
    "Seven nights aboard Cyrolia in French Polynesia. A working strategic planning retreat for founders, CEOs, and executives. Limited to five guests.",
};

/** Every "Reserve a Berth" CTA on the site lands on the one intake form. */
export const reserveHref = "/retreats-coaching/reserve";
export const reserveLabel = "Reserve a Berth";

export const atSeaHero = {
  kicker: "The Strategy Blueprint at Sea",
  headline: "Seven nights. One decision you have been carrying for months.",
  lede: "A working strategic planning retreat aboard Cyrolia, Alan Peterson’s bluewater cruising sailboat, in French Polynesia. Limited to five guests.",
  ctaLabel: reserveLabel,
  ctaHref: reserveHref,
};

export const atSeaWhatItIs = {
  kicker: "What this actually is",
  headline: "This is not a vacation. It is a working retreat that happens to be at sea.",
  body: [
    "Your vision, your year, your Annual Plan, and your top Priority are surfaced and named during the week, defined with success metrics and immediate action items, through facilitation with Alan Peterson and the collective intelligence of a small, non-competing cohort.",
    "The work is supported by TPG’s backend AI team and by facilitated Starlink sessions with your leadership team at home, so a comprehensive plan is ready to present for immediate execution the week you return.",
    "Every voyage delivers the same spine: a written Strategy Blueprint and one named Priority. The balance between business strategy and leadership development flexes to the cohort aboard.",
  ],
};

export const atSeaWhatYouBring = {
  kicker: "What you bring",
  headline: "Unresolved challenges and unnamed priorities.",
  body: [
    "You do not arrive with your Priority already named. Naming it is the work of the week.",
    "What people bring:",
  ],
  items: [
    "Product development or launch sequencing",
    "A revenue model or pricing redesign",
    "A sales and marketing system build",
    "An operational or org-structure reset",
    "An M&A or acquisition thesis",
    "A decision that has been stuck for months",
  ],
};

export const atSeaWhatYouLeaveWith = {
  headline: "What you leave with",
  items: [
    "Your vision, Annual Plan, and top Priority — surfaced, named, and sequenced, with success metrics and immediate action items",
    "A written Strategy Blueprint with quantified upside",
    "A sequenced 90-day execution plan and Execution Cadence OS foundations",
    "3 standard AI installations from the TPG AI Installation Menu, set up for your business",
    "Facilitated Starlink sessions with your leadership team at home, so the plan lands before you do",
    "A peer cohort of vetted founders you can call after",
  ],
};

export const atSeaWeek = {
  kicker: "The week",
  headline: "Mornings work. Afternoons sail.",
  items: [
    "Seven nights aboard Cyrolia in the Society Islands, French Polynesia.",
    "Limited to five guests. Non-competing, by design.",
    "Mornings are 3 to 4 hours of facilitated working sessions.",
    "Afternoons and evenings on the water and ashore.",
  ],
  whoHeading: "Who should come.",
  whoBody:
    "Founders, CEOs, and executives with a single high-stakes challenge worth a week to resolve, and the decisiveness to execute the plan on return.",
};

/**
 * Interest capture, not an apology — the calendar is deliberately unset, and
 * the block is written to read that way. Never publish a date here.
 */
export const atSeaCalendar = {
  kicker: "Sailing calendar",
  headline: "Coming soon. Dates to be announced.",
  body: [
    "Berths are limited to five per voyage and the calendar is set deliberately. If you are interested, tell us now and we will bring the dates to you first.",
  ],
};

/** The page's single pricing block. */
export const atSeaTiers: PricingTier[] = [
  {
    name: "Founder’s Cohort",
    price: "$7,250",
    detail:
      "Per person. Reserved for decisive leaders. Limited to the first 2 confirmed registrations.",
  },
  {
    name: "Core Retreat",
    price: "$8,500",
    detail:
      "Per person. Full seven-day voyage, written Strategy Blueprint, Integration Session, salon berth unless a stateroom opens.",
  },
  {
    name: "Executive Retreat",
    price: "$14,500",
    detail:
      "Per person. Full voyage plus Blueprint, 8 weeks of 1:1 coaching post-retreat, Integration Session, priority stateroom.",
  },
];

export const atSeaPricingNotes = ["A 50 percent deposit reserves your berth."];

export const atSeaCharterNote =
  "Customized private charters are also available: a founder plus their leadership team, the entire vessel, the full TPG Sprint methodology at sea. Scoped after a discovery call.";

/**
 * The sibling voyage. Linked to the category page's offer block rather than to
 * the Joy Driven Life site — no outbound link to an external site from here.
 */
export const atSeaSibling = {
  kicker: "The sibling voyage",
  headline: "The Joy-Driven Life Sailing Retreat",
  body: [
    "Cyrolia Retreats holds two voyages. This one resets the company. The Joy-Driven Life Sailing Retreat, delivered by Joy Driven Life, resets the person running it — identity, values, composure, relationships, and the life you are actually designing.",
    "Coming soon. Dates to be announced. Contact us if you are interested.",
  ],
  linkLabel: "Read the full Joy-Driven Life Sailing Retreat",
  linkHref: "/retreats-coaching#joy-driven-life-sailing-retreat",
};

export const atSeaFaq: FaqItem[] = [
  {
    question: "Is this really a working retreat?",
    answer:
      "Yes. Mornings are facilitated working sessions and you leave with a written Blueprint. The sailing is real too, but it is not why you come.",
  },
  {
    question: "Do I need to know what my priority is before I board?",
    answer: "No, and most people do not. Surfacing and naming it is the work of the week.",
  },
  {
    question: "Do I need to sail?",
    answer: "No experience required. Alan runs the boat.",
  },
  {
    question: "Can I bring my leadership team?",
    answer:
      "Not on a cohort voyage, which is limited to five individual guests from non-competing companies. For a team, look at a customized private charter, scoped after a discovery call.",
  },
  {
    question: "How do I hold a berth?",
    answer:
      "Submit a reservation request. Alan personally reviews each one, because the cohort is capped at five and fit matters to everyone aboard. A 50 percent deposit confirms your berth once fit is established.",
  },
];

export const atSeaClosing = {
  headline: "Five berths. One week. The decision you stop carrying.",
};
