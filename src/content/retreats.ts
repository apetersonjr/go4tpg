import type { Offering } from "@/content/summits";

export type RetreatTier = {
  name: string;
  /** What the tier adds over the base retreat. Empty for the base tier. */
  detail: string;
  /**
   * Per-person investment, once V19 pricing is approved. The V17 comp carried
   * figures for all three tiers; they were unverified against V19 and are not
   * shipped. Filling these in is the only change needed to show pricing.
   */
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

/**
 * Tier structure for the Strategy Blueprint at Sea. Names and inclusions are
 * V17 comp copy and unchanged; only the figures are withheld.
 */
export const retreatTiers: RetreatTier[] = [
  {
    name: "Founder’s Cohort",
    detail: "Limited to the first 2 confirmed registrations.",
    price: null,
  },
  {
    name: "Core Retreat",
    detail: "",
    price: null,
  },
  {
    name: "Executive Retreat",
    detail: "Adds 8 weeks of 1:1 coaching post-retreat and priority stateroom.",
    price: null,
  },
];

export const retreatTiersNote =
  "Customized private charters — a founder plus their leadership team, the entire vessel — are scoped after a discovery call.";

export const retreatOfferings: Offering[] = [
  {
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
    ctaLabel: "Reserve a Berth",
    ctaHref: "/#commit",
  },
  {
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
      "Monthly and quarterly facilitation retainers are customized to each client, scoped after a discovery call.",
    ],
    price: null,
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/#commit",
  },
];
