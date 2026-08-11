import type { Offering } from "@/content/summits";
import type { FaqItem } from "@/content/faq";
import { faqItems } from "@/content/faq";

export type Lane = {
  title: string;
  description: string;
  /** Lane 2 is the custom track and is tinted differently. */
  variant: "standard" | "custom";
};

export const installationsMeta = {
  title: "AI System Installations",
  description:
    "Standard AI workflows and automations, installed by our own AI architecture and engineering team: lead follow-up, pipeline, proposals, reporting, and collections.",
};

export const installationsHero = {
  kicker: "Format 02 — AI System Installations",
  /* The Services comp page hero headline, which is specifically about this format. */
  headline: "From diagnosis to installation in days... not months.",
  lede: "Standard AI workflows and automations, installed by our own AI architecture and engineering team: lead follow-up, pipeline, proposals, reporting, and collections.",
  ctaLabel: "Schedule a Sprint Conversation",
  ctaHref: "#commit",
};

export const lanesKicker = "What our engineering team installs";
export const lanesHeadline = "Two lanes govern everything we build.";

export const lanes: Lane[] = [
  {
    title: "Lane 1 — Standard AI Installations",
    /*
     * V19: inclusion-by-count alone contradicted the homepage's a la carte
     * pricing — both halves are true and both are stated.
     */
    description:
      "Proven workflows from the TPG AI Installation Menu: lead follow-up, pipeline, proposals, reporting, and collections. They run on the mainstream platforms your team already uses with no custom code, and they are priced individually, so you can install them a la carte. They are also included by count inside the larger engagements.",
    variant: "standard",
  },
  {
    title: "Lane 2 — Custom Development & Integrations",
    description:
      "Live integrated dashboards, CRM builds, custom mini apps, API integrations, and software platforms. Always scoped independently, in writing, after a paid Systems & Data Audit.",
    variant: "custom",
  },
];

/*
 * V19: the source sentence carried a trailing clause putting the scoping
 * deadline ahead of the build. Dropped — V19 puts custom scoping after a paid
 * Systems and Data Audit, and the old clause reads as a competing trigger.
 */
export const lanesNote =
  "Each engagement installs the specific standard components with the greatest quantified upside, scoped in writing.";

/**
 * The Systems and Data Audit, which gates every custom engagement.
 *
 * It is deliberately unpriced: it is scoped per engagement, and quoting a
 * figure here would contradict that. Never add one.
 */
export const auditKicker = "Before any custom work";
export const auditHeadline = "Custom work starts with an audit.";

export const auditBody: string[] = [
  "Before we quote anything custom, we examine what you actually have... your systems, your data, your integrations, and the condition of what is already connected.",
  "The Systems and Data Audit is scoped and priced per engagement. No two environments are alike, and pricing a single-system review the same as a multi-platform estate would mean overcharging one of you.",
  "You receive a written scope and a fixed price before any custom development begins. No open-ended discovery. No surprises mid-build.",
];

export const auditCta = {
  label: "Request a Systems and Data Audit",
  href: "#commit",
};

export const menuKicker = "The TPG AI Installation Menu";
export const menuHeadline = "Pick what you need. Each unit priced on its own.";

export const menuBody =
  "Standard installations are proven workflows and automations that run on the mainstream platforms your team already uses. No custom code. No integration risk. You buy the ones that matter to your business, individually.";

/**
 * The five approved menu categories. The individual unit names and prices do
 * not exist yet — never invent them. A staging-only placeholder marks where
 * the unit list will go; it must not ship to production.
 */
export const menuCategories: string[] = [
  "Lead follow-up",
  "Pipeline",
  "Proposals",
  "Reporting",
  "Collections",
];

export const installationOfferings: Offering[] = [
  {
    id: "revenue-operations-sprint",
    title: "Revenue Operations Sprint",
    tagline:
      "TPG’s single largest engagement, and the fastest path from diagnosis to a fully installed operating system — backed by a real engineering team, not facilitation alone.",
    body: [
      "Over 10 business days, Alan works with the founder and leadership team to produce the company’s vision and Annual Plan — top priorities, success metrics, and accountability action plans — while TPG’s AI architecture and engineering team installs the standard AI solutions, selected together, that most immediately impact revenue and operations.",
      "This is not a solo facilitator promising to figure it out later. It is a working engineering function standing behind TPG’s flagship engagement.",
    ],
    price: "$25,000",
    priceNotes: [
      "Flagship Sprint — recommended standard.",
      "$35,000–$50,000+ for complex organizations and multi-team installs.",
    ],
    ctaLabel: "Schedule a Sprint Conversation",
    ctaHref: "#commit",
  },
  {
    id: "fractional-chief-revenue-architect",
    title: "Fractional Chief Revenue Architect",
    tagline:
      "A named role, not a vague retainer — for clients who want continued traction after the Sprint.",
    body: [
      /* V19: the catalog phrasing here is now the Installation Menu. */
      "90 days of fractional revenue leadership inside your team, backed by ongoing TPG AI architecture and engineering support: weekly cadence, scoreboard enforcement, pipeline discipline, continued standard installations from the TPG AI Installation Menu, and operational optimization. The same team is available to architect customized AI automations, workflows, and software platforms — each scoped independently.",
      "It is the revenue-side Integrator in the original Harvard Business Review sense: aligning sales, marketing, and operations so they pull in one direction — without the cost or risk of the full-time hire.",
      "The retention model is built on empowerment, not dependency. We train your team to become the internal experts. That is why clients stay. We accept a limited number of Fractional engagements at a time.",
    ],
    /* No fixed price for this offer — the note carries it instead of a figure. */
    price: null,
    priceNotes: ["Monthly retainer, scoped after the Annual Planning Summit."],
    ctaLabel: "Inquire About Availability",
    ctaHref: "#commit",
  },
];

/**
 * The page had no FAQ. The audit question leads, followed by the homepage set
 * — every one of those four bears on installations, so they are reused rather
 * than reworded into a near-duplicate.
 */
export const installationsFaq: FaqItem[] = [
  {
    question: "What does the Systems and Data Audit cost?",
    answer:
      "It is scoped and priced per engagement, because no two environments are alike. We look at your systems, your data, and your integrations, then give you a written scope and a fixed price before any custom development begins.",
  },
  ...faqItems,
];

export const sprintOutcomesHeadline = "What you leave with";

export const sprintOutcomes: string[] = [
  "Profit Uplift Blueprint + Model — a quantified model translating improvements into dollars, in low, base, and aggressive scenarios",
  "Execution Cadence OS — a self-facilitated meeting system: daily, weekly, monthly, and quarterly agendas, scoreboard, roles, and follow-up discipline",
  "Installed System Assets + Scoreboard — templates, scripts, one-page standard operating checklists, and 5 to 8 standard installations live. The CEO’s KPI scoreboard with defined data feeds your team owns — their central nervous system",
  "AI Fluency Accelerator — role-based AI workflows and hands-on training built into daily operations. Not AI training — installed efficiency and adoption",
  "TPG AI Architecture & Engineering Team — every automation, agent, and workflow above is built and installed by TPG’s own engineering function. Custom opportunities are captured in a Custom Automation Roadmap and scoped independently",
];
