/**
 * The TPG AI Installation Menu — the canonical source.
 *
 * Nineteen installations across eight sections, transcribed from page 3 of
 * `public/assets/brochures/tpg-ai-installation-menu-complete.pdf`. That
 * brochure is the source of truth; this file is its machine-readable form.
 *
 * This is the ONLY place these names may be defined. Every surface that names
 * an installation or a section — the /installations tiles, the scorecard
 * widget, anything added later — reads from here. Renaming an installation is
 * an edit to this file and nothing else, which is the whole point: the site
 * used to carry three different versions of this list and they disagreed.
 *
 * Two rules that are not negotiable:
 *
 *   1. `number` is a stable id, not a display index. 01-19 are the numbers the
 *      brochure prints. They are never renumbered, even if a section is
 *      reordered or an installation is retired — a retired entry is removed
 *      and its number retires with it.
 *
 *   2. No prices. Not here, not in any consumer of this file. Per-unit pricing
 *      is quoted in writing, never published.
 *
 * `description` is intentionally empty on every entry. The brochure's own
 * per-installation copy has not been transcribed yet and must not be invented
 * — an empty string is honest, a plausible-sounding paraphrase is not.
 * Consumers must treat it as optional and render nothing when it is empty.
 */

/** Roman numerals as the brochure prints them, used as the section ids. */
export type SectionId = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";

export type MenuSection = {
  /** Roman numeral. Doubles as the stable section id. */
  id: SectionId;
  /** Title case, as the site renders it — the brochure sets it in all caps. */
  name: string;
  /** 1-based position. Meaningful: most companies begin with the Foundation. */
  order: number;
};

export type Installation = {
  /** Kebab-case slug of the name. Stable; never renamed. */
  id: string;
  /** Stable catalog number, 1-19, matching the brochure. Never renumbered. */
  number: number;
  name: string;
  /** Same value as `id`. Present because callers reach for both names. */
  slug: string;
  section: SectionId;
  /** Not yet transcribed from the brochure. Never invent one. */
  description: string;
  /**
   * Workflow flow diagram for this installation. `null` until the diagrams
   * exist; the field is declared now so populating them later needs no schema
   * change and no migration.
   */
  diagram: string | null;
};

/**
 * Bumped whenever an entry or section is added, removed, or renamed. Lets a
 * stored recommendation be traced back to the menu it was drawn from.
 */
export const MENU_VERSION = 1;

export const sections: MenuSection[] = [
  { id: "I", name: "The Foundation", order: 1 },
  { id: "II", name: "Founder Time and Attention", order: 2 },
  { id: "III", name: "Meetings and Follow-Through", order: 3 },
  { id: "IV", name: "Revenue", order: 4 },
  { id: "V", name: "Customers", order: 5 },
  { id: "VI", name: "Operations and Administration", order: 6 },
  { id: "VII", name: "Money and Reporting", order: 7 },
  { id: "VIII", name: "People", order: 8 },
];

/*
 * Hyphenation is load-bearing in four of these names — "Action-Item",
 * "Customer-Service", "Voice-of-the-Customer", "Waiting-on-Reply". They are
 * transcribed exactly as the brochure prints them.
 */
export const installations: Installation[] = [
  {
    id: "company-ai-brain",
    number: 1,
    name: "Company AI Brain",
    slug: "company-ai-brain",
    section: "I",
    description: "",
    diagram: null,
  },
  {
    id: "ai-inbox-manager",
    number: 2,
    name: "AI Inbox Manager",
    slug: "ai-inbox-manager",
    section: "II",
    description: "",
    diagram: null,
  },
  {
    id: "ai-executive-daily-brief",
    number: 3,
    name: "AI Executive Daily Brief",
    slug: "ai-executive-daily-brief",
    section: "II",
    description: "",
    diagram: null,
  },
  {
    id: "ai-calendar-conflict-and-load-guard",
    number: 4,
    name: "AI Calendar Conflict and Load Guard",
    slug: "ai-calendar-conflict-and-load-guard",
    section: "II",
    description: "",
    diagram: null,
  },
  {
    id: "ai-founder-research-and-decision-agent",
    number: 5,
    name: "AI Founder Research and Decision Agent",
    slug: "ai-founder-research-and-decision-agent",
    section: "II",
    description: "",
    diagram: null,
  },
  {
    id: "ai-meeting-intelligence",
    number: 6,
    name: "AI Meeting Intelligence",
    slug: "ai-meeting-intelligence",
    section: "III",
    description: "",
    diagram: null,
  },
  {
    id: "ai-action-item-and-accountability-engine",
    number: 7,
    name: "AI Action-Item and Accountability Engine",
    slug: "ai-action-item-and-accountability-engine",
    section: "III",
    description: "",
    diagram: null,
  },
  {
    id: "stale-task-detector",
    number: 8,
    name: "Stale Task Detector",
    slug: "stale-task-detector",
    section: "III",
    description: "",
    diagram: null,
  },
  {
    id: "waiting-on-reply-tracker",
    number: 9,
    name: "Waiting-on-Reply Tracker",
    slug: "waiting-on-reply-tracker",
    section: "III",
    description: "",
    diagram: null,
  },
  {
    id: "ai-crm-autopilot",
    number: 10,
    name: "AI CRM Autopilot",
    slug: "ai-crm-autopilot",
    section: "IV",
    description: "",
    diagram: null,
  },
  {
    id: "ai-marketing-content-engine",
    number: 11,
    name: "AI Marketing Content Engine",
    slug: "ai-marketing-content-engine",
    section: "IV",
    description: "",
    diagram: null,
  },
  {
    id: "ai-customer-service-front-line",
    number: 12,
    name: "AI Customer-Service Front Line",
    slug: "ai-customer-service-front-line",
    section: "V",
    description: "",
    diagram: null,
  },
  {
    id: "ai-voice-of-the-customer-engine",
    number: 13,
    name: "AI Voice-of-the-Customer Engine",
    slug: "ai-voice-of-the-customer-engine",
    section: "V",
    description: "",
    diagram: null,
  },
  {
    id: "ai-intake-and-request-router",
    number: 14,
    name: "AI Intake and Request Router",
    slug: "ai-intake-and-request-router",
    section: "VI",
    description: "",
    diagram: null,
  },
  {
    id: "ai-leave-and-approval-flow",
    number: 15,
    name: "AI Leave and Approval Flow",
    slug: "ai-leave-and-approval-flow",
    section: "VI",
    description: "",
    diagram: null,
  },
  {
    id: "ai-renewal-and-contract-watchdog",
    number: 16,
    name: "AI Renewal and Contract Watchdog",
    slug: "ai-renewal-and-contract-watchdog",
    section: "VI",
    description: "",
    diagram: null,
  },
  {
    id: "ai-financial-close-and-bookkeeping-assistant",
    number: 17,
    name: "AI Financial Close and Bookkeeping Assistant",
    slug: "ai-financial-close-and-bookkeeping-assistant",
    section: "VII",
    description: "",
    diagram: null,
  },
  {
    id: "ai-weekly-report-generator",
    number: 18,
    name: "AI Weekly Report Generator",
    slug: "ai-weekly-report-generator",
    section: "VII",
    description: "",
    diagram: null,
  },
  {
    id: "ai-recruiting-and-onboarding-assistant",
    number: 19,
    name: "AI Recruiting and Onboarding Assistant",
    slug: "ai-recruiting-and-onboarding-assistant",
    section: "VIII",
    description: "",
    diagram: null,
  },
];

/** How many installations the menu holds. Derived, so prose can never drift. */
export const installationCount = installations.length;

/** How many sections of the business the menu covers. Also derived. */
export const sectionCount = sections.length;

const installationsById = new Map(installations.map((entry) => [entry.id, entry]));
const sectionsById = new Map(sections.map((section) => [section.id, section]));

export function findInstallation(id: string): Installation | undefined {
  return installationsById.get(id);
}

export function isValidInstallationId(id: string): boolean {
  return installationsById.has(id);
}

export function findSection(id: SectionId): MenuSection | undefined {
  return sectionsById.get(id);
}

/** Sections in display order, each with its installations in catalog order. */
export function installationsBySection(): { section: MenuSection; entries: Installation[] }[] {
  return [...sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      section,
      entries: installations
        .filter((entry) => entry.section === section.id)
        .sort((a, b) => a.number - b.number),
    }));
}
