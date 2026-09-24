import type { FaqItem } from "@/content/faq";
import type { Deliverable, Step } from "@/content/summits";

/**
 * The Finish Strong Reset landing page. Copy is verbatim from
 * TPG_OperatingBlueprintMASTER_V20.docx (23 Sep 2026) and is final.
 *
 * Positioning rule: this is never a discounted summit. The difference from the
 * Annual Planning Summit is scope — half a day and one priority, against a
 * full day and every priority — and the page says so wherever the two meet.
 *
 * Seasonal: marketed September through December, but published year-round.
 * Companies whose fiscal year ends elsewhere run it in their own final quarter.
 */
export const finishStrongMeta = {
  title: "Finish Strong Reset",
  description: "Half a day. One priority. A written plan to finish the year strong.",
};

export const finishStrongHero = {
  kicker: "Finish Strong Reset",
  headline: "Half a day. One priority. A written plan to finish the year.",
  lede: "A facilitated session with the founder and leadership team. We assess where the year actually stands, lock the one priority that still moves the number, and deliver a written 90-day plan through year-end.",
  ctaLabel: "Book a Finish Strong Reset",
  ctaHref: "#commit",
};

export const finishStrongWhy = {
  kicker: "Why now",
  headline: "The year is not over. It is undecided.",
  body: [
    "Most companies spend the fourth quarter explaining the year instead of finishing it. With a quarter still on the clock, there is exactly enough runway for one priority, pursued by the whole team, to change the number the year ends on. Not five priorities. One.",
  ],
  note: "Marketed September through December, when most companies are closing a calendar year. Available year-round for companies whose fiscal year ends elsewhere... a June 30 year-end runs it in the spring.",
};

export const finishStrongDeliverablesKicker = "What you leave with";
export const finishStrongDeliverablesHeadline = "Two written documents. Zero decks.";

export const finishStrongDeliverables: Deliverable[] = [
  {
    title: "The Finish Strong Plan",
    note: "delivered within 24 hours",
    items: [
      "Where the year stands, function by function",
      "The one priority that finishes the year, with measurable, time-bound success metrics",
      "Action items, with ownership assigned in the room",
      "A 90-day execution plan through year-end",
      "“Stop Doing” list and clear recommendations",
    ],
  },
  {
    title: "The AI Opportunity Scan",
    note: "delivered with your plan, at no cost",
    items: [
      "The AI and automation opportunities that surfaced during your session",
      "The standard units from the TPG AI Installation Menu that would have the greatest impact, each priced individually",
      "A clear path forward: install a la carte, or step up into a Revenue Operations Sprint",
    ],
  },
];

export const finishStrongHowItWorksKicker = "How it works";
export const finishStrongHowItWorksHeadline =
  "Five steps. The pre-work sharpens the day. The room builds the plan.";

export const finishStrongHowItWorksSteps: Step[] = [
  {
    lead: "The Pre-Summit Diagnostic.",
    body: " Before we meet, every attendee completes an online diagnostic. It surfaces where each function is strained and where the team disagrees... and it is good work in its own right: each person names what is working, what is not, and what they would fix first.",
  },
  {
    lead: "We build the session around your answers.",
    body: " Your responses shape the agenda, and we arrive prepared.",
  },
  {
    /* The differentiator — kept at full length deliberately. */
    lead: "We facilitate, and your own answers are in the room.",
    body: " The diagnostic comes back to your team as a working view of what they collectively said. Seeing it together is usually where the real conversation starts. The one priority is locked, metrics defined, and ownership assigned before anyone leaves.",
  },
  {
    lead: "Concurrently, we map the AI layer.",
    body: " As each function’s work surfaces, we capture where automation and AI would amplify it.",
  },
  {
    lead: "Within 24 hours, both documents.",
    body: " The written Finish Strong Plan, and your AI Opportunity Scan.",
  },
];

export const finishStrongOnRamp = {
  kicker: "The on-ramp",
  headline: "Finish this year strong. Then plan the next one properly.",
  body: [
    "The Finish Strong Reset closes the year. The Annual Planning Summit opens the next one... the full plan, every priority, the complete Annual Blueprint. For teams who want the full annual plan, this session is the on-ramp: your investment is credited in full toward a full Annual Planning Summit, or toward a Revenue Operations Sprint.",
  ],
  linkLabel: "See the Annual Planning Summit →",
  linkHref: "/summits/annual",
};

/** The page's single pricing block. No figure appears anywhere else. */
export const finishStrongPricing = {
  price: "$2,750",
  notes: ["Credited in full toward a Revenue Operations Sprint or a full Annual Planning Summit."],
};

export const finishStrongFaq: FaqItem[] = [
  {
    question: "How long is the session?",
    answer:
      "Half a day... approximately four hours... with the founder and your leadership and execution team. The exact schedule is set with you when we scope the session. Your Finish Strong Plan and AI Opportunity Scan arrive within 24 hours.",
  },
  {
    question: "Is there anything to prepare?",
    answer:
      "Yes, and it is work worth doing. Every attendee completes the Pre-Summit Diagnostic online before we meet. It shapes the agenda, it surfaces where your team quietly disagrees, and your team’s own collective answers open the session. The day depends on it... clients consistently tell us the pre-work changed the room before we arrived.",
  },
  {
    question: "How is this different from the Annual Planning Summit?",
    answer:
      "Scope. The Annual Planning Summit is a full day that produces the complete Annual Blueprint... every priority for the year ahead. The Finish Strong Reset is half a day that locks the one priority that still moves this year’s number, with a 90-day plan through year-end. One closes the year; the other opens the next. Your Finish Strong investment is credited in full toward the full summit.",
  },
  {
    question: "What if our fiscal year does not end in December?",
    answer:
      "Then your finish-strong window is different, and so is your timing. The session is available year-round... a company with a June 30 year-end runs it in the spring.",
  },
  {
    question: "Does the session install anything?",
    answer:
      "No. It produces your plan and your AI Opportunity Scan, which shows exactly what to install first, priced. Installation is a separate engagement, chosen a la carte from the TPG AI Installation Menu or delivered inside a Revenue Operations Sprint.",
  },
];

export const finishStrongClosing = {
  headline: "Do not spend the fourth quarter explaining the year. Finish it.",
  ctaLabel: "Book a Finish Strong Reset",
};
