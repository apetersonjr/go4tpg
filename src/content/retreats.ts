import type { Offering } from "@/content/summits";

export type PricingTier = {
  name: string;
  /** What this tier adds or how it is billed. Empty renders nothing. */
  detail: string;
  /** Investment per the Operating Blueprint v19 (6 Aug 2026). */
  price: string | null;
};

export const retreatsMeta = {
  title: "Retreats & Leadership Coaching",
  description:
    "Strategy retreats at sea and ongoing coaching for the people carrying the company, not just its systems.",
};

export const retreatsHero = {
  kicker: "Format 03 — Retreats & Leadership Coaching",
  /* Trimmed from the `#retreats` group description, which runs below as the lede. */
  headline: "For the people carrying the company, not just its systems.",
  lede: "Strategy retreats at sea and ongoing coaching for the people carrying the company, not just its systems.",
  ctaLabel: "Book a Discovery Call",
  ctaHref: "/#commit",
};

/** Tier structure and pricing for the Strategy Blueprint at Sea. */
export const retreatTiers: PricingTier[] = [
  {
    name: "Founder’s Cohort",
    detail: "Per person. Limited to the first 2 confirmed registrations.",
    price: "$7,250",
  },
  {
    name: "Core Retreat",
    detail: "Per person.",
    price: "$8,500",
  },
  {
    name: "Executive Retreat",
    detail: "Per person. Adds 8 weeks of 1:1 coaching post-retreat and priority stateroom.",
    price: "$14,500",
  },
];

export const retreatTiersNote =
  "Customized private charters — a founder plus their leadership team, the entire vessel — are scoped after a discovery call.";

export const retreatOfferings: Offering[] = [
  {
    id: "strategy-blueprint-at-sea",
    title: "The Strategy Blueprint at Sea",
    tagline:
      "A working strategic planning retreat for founders, CEOs, and executives. Aboard Cyrolia — Alan Peterson’s bluewater cruising sailboat — in French Polynesia. 7 nights, limited to 5 guests.",
    body: [
      "This is a working strategic planning retreat, not a vacation. Your vision, your year, your Annual Plan, and your top business priority are surfaced and named during the week — defined with success metrics and immediate action items — through facilitation with Alan Peterson and a small, non-competing cohort. The work is supported by TPG’s backend AI team and facilitated Starlink Zoom sessions with your leadership team at home, so a comprehensive plan is ready to present upon your return.",
      "What you leave with: a written Strategy Blueprint with quantified upside, a sequenced 90-day execution plan, 3 standard AI installations set up for your business, and a peer cohort of vetted founders you can call after.",
      /*
       * V19: the source added "A 50% deposit reserves your berth." That is a
       * payment term attached to the withheld figures, so it travels with them
       * rather than shipping on its own.
       */
      "Format: 7 nights aboard Cyrolia in the Society Islands, French Polynesia. Mornings are 3 to 4 hours of facilitated working sessions; afternoons and evenings on the water and ashore.",
    ],
    price: null,
    priceNotes: [],
    ctaLabel: "Reserve a Berth",
    ctaHref: "/#commit",
  },
  {
    id: "lighthouse-leadership-os",
    title: "The Lighthouse Leadership OS",
    tagline:
      "For entrepreneurs to Fortune 200 leadership teams. Coaching and facilitation from an operator who has built and led, not just studied.",
    body: [
      /*
       * V19: the comp named three competitors (EOS, Petra Coach, Bloom
       * Growth). Replaced with the approved five-name sentence from `faq.ts`.
       */
      "The Lighthouse Leadership OS is a direct alternative to EOS, Scaling Up, Petra Coach, Bloom Growth, and MAP. It delivers the plan, alignment, and accountability those programs sell... plus working AI systems built by our own engineering team, which none of them offer.",
      "It adds what none of them offer: coaching for the leaders themselves, not just the framework. No franchise journey. No per-seat software subscription. Clients stay because it works.",
      "Engagement modes: 1:1 founder/CEO coaching, leadership team facilitation, team-wide engagement, and board & advisory facilitation.",
      /* V19: the catalog phrasing here is now the Installation Menu. */
      "Operating rhythm, customized to your team: annual, semi-annual, quarterly, or monthly cadences, combinable as the company grows. Delivered in person, aboard Cyrolia, or by video. Every rhythm includes the plan and the discipline, at least one standard AI installation from the TPG AI Installation Menu each quarter as part of the retainer, and tooling you own outright — no platform lock-in.",
    ],
    price: null,
    priceNotes: [],
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/#commit",
  },
];

/**
 * Lighthouse Leadership OS retainer tiers.
 *
 * These replaced the line that said retainers were "customized to each client,
 * scoped after a discovery call" — v19 sets fixed monthly rates, and the two
 * statements could not both stand.
 */
export const lighthouseTiers: PricingTier[] = [
  {
    name: "Lighthouse Quarterly",
    detail: "Billed $4,500 per quarter.",
    price: "$1,500/month",
  },
  {
    name: "Lighthouse Monthly",
    detail: "",
    price: "$3,000/month",
  },
  {
    name: "Lighthouse Executive",
    detail: "",
    price: "$4,750/month",
  },
];

export const lighthouseAddOn =
  "Add-on, functional-team facilitation: $1,000 per team per month, or $750 per one-off session.";

/**
 * V19: Lighthouse entry point, rendered above the retainer rungs. The bold
 * span is the summit name with its price.
 */
export const lighthouseEntry = {
  pre: "Entry is the ",
  emphasis: "$4,750 Annual Planning Summit",
  post: ". Lighthouse begins when you continue on a standing rhythm.",
};

/** The Cyrolia Retreats collection intro, ahead of the two voyage blocks. */
export const collection = {
  kicker: "The collection",
  headline: "Two voyages. One boat. Two very different weeks.",
  intro:
    "Cyrolia is Alan Peterson’s bluewater cruising sailboat, a 53-foot offshore cruiser in French Polynesia. Twice a year she becomes a working retreat, and which voyage you join depends on what you came to change.",
  voyages: [
    {
      name: "The Strategy Blueprint at Sea",
      text: " resets the company. Your priorities, your Annual Plan, and the one Priority you have been carrying for months.",
    },
    {
      name: "The Joy-Driven Life Sailing Retreat",
      text: " resets the person running it. Identity, values, composure, relationships, and the life you are actually designing.",
    },
  ],
  outro: [
    "Same vessel. Same seven nights. Same five guests. Entirely different work.",
    "Many founders do both. Most start with whichever one they have been avoiding.",
  ],
};

/** Voyage dates block, inside the At Sea offer after Format. */
export const sailingCalendar = {
  kicker: "Sailing calendar",
  headline: "Coming soon. Dates to be announced.",
  body: "Berths are limited to five per voyage and the calendar is set deliberately. If you are interested, tell us now and we will bring the dates to you first.",
};

export const whatYouBring = {
  headline: "What you bring: unresolved challenges and unnamed priorities.",
  body: [
    "Product development or launch sequencing. A revenue model or pricing redesign. A sales and marketing system build. An operational or org-structure reset. An M&A or acquisition thesis. Or a decision that has been stuck for months.",
    "You do not arrive with your Priority already named. Naming it is the work.",
  ],
};

/**
 * The Joy-Driven Life Sailing Retreat — a Joy Driven Life product mirrored on
 * the TPG site with the same visual weight as The Strategy Blueprint at Sea.
 * Copy is verbatim from the approved V19 correction set. Dates deliberately
 * read TBD: the JDL site still advertises May 2026, which has passed.
 */
export const jdlOffering: Offering = {
  id: "joy-driven-life-sailing-retreat",
  eyebrow: "A Joy Driven Life voyage",
  title: "You have built a life that works. It no longer fits.",
  tagline:
    "A transformational offshore retreat for entrepreneurs, founders, leaders, and couples. Seven nights aboard Cyrolia in French Polynesia. Limited to five guests.",
  /* The labeled sub-blocks carry the copy; see `jdlSections`. */
  body: [],
  price: null,
  priceNotes: [],
  /* Deliberately different from the TPG retreat's "Reserve a Berth" so the two offers do not blur. */
  ctaLabel: "Request an Invite",
  ctaHref: "/#commit",
};

export const jdlSections = {
  problem: {
    heading: "The problem it solves",
    paragraphs: [
      "Nothing is collapsing. But something essential is under-expressed.",
      "Your calendar fills and your soul thins. Your responsibilities grow and your freedom shrinks. Your income rises and your energy declines. Your leadership expands and your inner clarity fades.",
      "You may not be stuck. You may simply be living at seventy percent of who you are capable of becoming. And the cost of that gap compounds quietly.",
      "This retreat is where you reclaim the rest.",
    ],
  },
  workOn: {
    heading: "What you work on",
    intro: "Daily facilitated sessions aboard, on:",
    items: [
      "Identity architecture and life design",
      "Values hierarchy and non-negotiables",
      "Emotional composure under pressure",
      "Relationship leadership, for couples and for families",
      "Decision-making from conviction",
      "High performance without burnout",
      "Faith as foundation, present, never imposed",
      "Joy as a disciplined practice",
    ],
  },
  blueprint: {
    heading: "What you leave with: your Joy-Driven Blueprint",
    intro: "A personalized, written architecture of who you are becoming. Not generic coaching.",
    items: [
      "Your core identity and decision architecture",
      "Your values hierarchy and non-negotiables",
      "Your emotional composure profile",
      "Your relationship and leadership alignment map",
      "Your expansion vision, codified into a single coherent direction",
      "Your 90-day activation plan",
    ],
    closing:
      "Plus an integration session two weeks after you return, solo or as a couple, where we refine the Blueprint together so the shifts hold.",
  },
  whoComes: {
    heading: "Who comes",
    paragraphs: [
      "Entrepreneurs, founders, and business owners. CEOs, executives, and senior leaders. Couples seeking intentional expansion. People ready to live beyond their current ceiling.",
    ],
  },
  week: {
    heading: "The week",
    paragraphs: [
      "Seven nights aboard Cyrolia through multiple Society Islands, weather permitting. Two private staterooms with priority to couples, two salon berths for adaptable solo guests. All meals, excursions, and beverages included, with high-speed Starlink aboard.",
      "Mornings are facilitated work. Afternoons and evenings are lagoon sailing, snorkeling, island exploration, and quiet anchorages.",
    ],
  },
  dates: {
    heading: "Dates",
    status: "TBD. Coming soon.",
    body: "Only five guests are accepted. Once the manifest closes, a waitlist opens for the next voyage.",
  },
  investmentHeading: "Investment",
};

/** JDL pricing — identical to the At Sea voyage by design; do not adjust. */
export const jdlTiers: PricingTier[] = [
  {
    name: "Founder’s Cohort",
    detail:
      "Per person. Limited to 2 seats. Full retreat, Blueprint, integration session, salon berth unless a stateroom opens, founding cohort recognition.",
    price: "$7,250",
  },
  {
    name: "Core Retreat",
    detail:
      "Per person. Full retreat, Blueprint, integration session, salon berth unless a stateroom opens.",
    price: "$8,500",
  },
  {
    name: "Couples Retreat",
    detail: "Total. Priority stateroom, couples Blueprint, couples integration session.",
    price: "$13,600",
  },
  {
    /* "Lighthouse Executive Retreat" is the correct tier name per the JDL site. Do not shorten. */
    name: "Lighthouse Executive Retreat",
    detail:
      "Per person. Full retreat, Blueprint, integration session, 8 weeks of 1:1 coaching post-retreat, priority stateroom after couples.",
    price: "$14,500",
  },
];

/** The "Which voyage?" comparison, between the voyage blocks and Lighthouse. */
export const voyageComparison = {
  headline: "Same boat. Same week. Same investment.",
  subhead: "The only variable is what you came to change.",
  columns: ["The Strategy Blueprint at Sea", "The Joy-Driven Life Sailing Retreat"],
  rows: [
    { label: "What gets reset", a: "Your company", b: "You" },
    {
      label: "The question",
      a: "What is the one Priority I keep carrying?",
      b: "Who am I becoming, and does my life reflect it?",
    },
    {
      label: "The work",
      a: "Vision, Annual Plan, priorities, success metrics, quantified upside",
      b: "Identity, values, emotional composure, relationships, purpose",
    },
    {
      label: "You leave with",
      a: "A written Strategy Blueprint, one named Priority, a 90-day execution plan, and 3 standard AI installations set up for your business",
      b: "A written Joy-Driven Blueprint, a codified expansion vision, and a 90-day activation plan",
    },
    {
      label: "Who comes",
      a: "Founders, CEOs, and executives, individually",
      b: "Founders, CEOs, and leaders, individually or as couples",
    },
    { label: "Delivered by", a: "The Peterson Group", b: "Joy Driven Life" },
    {
      label: "Aboard",
      a: "Cyrolia. 7 nights, French Polynesia, 5 guests",
      b: "Cyrolia. 7 nights, French Polynesia, 5 guests",
    },
  ],
  /* Identical pricing across both voyages is deliberate. */
  closing: "Many founders do both. Most start with whichever one they have been avoiding.",
};

/** Coach and Installer positioning section, ahead of the closing CTA. */
export const coachInstaller = {
  headline: "Most people in this business pick one lane. We did not.",
  paragraphs: [
    "The coach facilitates and listens but has rarely built, scaled, or sold a company. The systems-only implementer installs a framework but does not carry the leadership and personal development depth to make it stick with the humans running it.",
    "TPG occupies the harder middle: thirty-five years of enterprise and founder operating experience, from startups to Fortune 200 companies, paired with real coaching depth in leadership, soft skills, and personal development, and the AI installation capability that turns a good conversation into a working system by Monday morning.",
    "That is not three claims. It is one practice. Install the system, and install the judgment in the people who have to run it.",
  ],
  economics: {
    subhead: "The economics",
    paragraphs: [
      /* The "directional, from third-party sources" caveat is required. */
      "Publicly reported figures, directional, from third-party sources, not official rate cards: EOS Implementers typically charge $4,500 to $6,600 per session day, with a standard two-year journey totaling roughly $58,000 to $86,000 in facilitation alone. No systems built, no software included. Coaching retainers in the Bloom Growth network commonly run $2,500 to $4,000 per month, plus a separate platform subscription.",
      "TPG’s facilitated day is $4,750 and includes what none of those models deliver: working AI systems, built and installed by our own engineering team, that you own outright.",
    ],
  },
  lifeguard: {
    subhead: "Lifeguard and the Lighthouse",
    paragraphs: [
      "A lifeguard rescues. They jump in, take over, and create dependency on the rescuer. A lighthouse stands steady and lets the ship navigate by its light. That distinction is the subject of Alan’s forthcoming book, and it is how TPG facilitation and coaching is built across every offer.",
    ],
  },
};
