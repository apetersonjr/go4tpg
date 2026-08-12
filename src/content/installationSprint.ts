import type { FaqItem } from "@/content/faq";
import type { NumberedDetail } from "@/components/sections/NumberedDetails";

/**
 * The Revenue Operations Sprint landing page — TPG's flagship engagement.
 */
export const sprintMeta = {
  title: "Revenue Operations Sprint",
  description: "Ten business days. The operating system, installed. TPG's flagship engagement.",
};

export const sprintHero = {
  kicker: "Revenue Operations Sprint",
  headline: "Ten business days. The operating system, installed.",
  lede: "A fully facilitated planning and installation engagement. You get the Annual Plan and the working AI systems that execute it, built by our own engineering team.",
  ctaLabel: "Schedule a Sprint Conversation",
  ctaHref: "#commit",
};

export const sprintHire = {
  kicker: "What role are you trying to hire?",
  headline: "Your next hire costs more than this Sprint.",
  body: [
    "Every CEO we meet is trying to fill a seat. VP of Operations, sales manager, integrator, CTO. The conversation always surfaces a role they cannot fill or cannot afford.",
    "What if we installed the system that role would build, in 10 days, for less than two months of that salary?",
    /*
     * The brief's copy opened this paragraph "A $25,000 Sprint costs less
     * than...". The figure is dropped, not the argument: pricing appears
     * exactly once per page and never in narrative copy, and $25,000 is
     * already stated in this page's pricing block. The comparison survives
     * intact — the headline above it makes the same point.
     */
    "The Sprint costs less than one quarter of a mid-level hire. It delivers faster, it requires no onboarding, and the system outlasts any individual employee. It is not an expense. It is a reallocation of payroll you were already planning to spend.",
  ],
};

/**
 * The Integrator sub-block.
 *
 * The Harvard Business Review 1967 attribution is required and must never be
 * dropped: the term predates every franchise that now sells it, and the whole
 * point of the passage is that Integrator is not an EOS-branded role.
 */
export const sprintIntegrator = {
  heading: "On the Integrator specifically.",
  body: [
    "The term is older than any franchise. It appeared in the Harvard Business Review in 1967, in the work of Paul Lawrence and Jay Lorsch, describing the person who aligns specialized departments that naturally pull in different directions.",
    "A true Integrator runs the company. They own the P&L, break ties, and lead the leadership team. That is a rare and expensive hire, and it is the wrong first move.",
    "Install the operating system first, and much of what an Integrator would spend their days forcing — alignment, cadence, follow-through, reporting — is carried by the system and its AI workflows. Then, if you still need integration capacity, you hire from clarity instead of frustration.",
  ],
};

export const sprintCadence = {
  kicker: "The cadence",
  headline: "Focused. Fast. Installed.",
  body: [
    "Ten business days, structured so your team keeps running the business while we build the system around them.",
  ],
  items: [
    "3 to 4 half-day working blocks — Day 1, Day 5, Day 8/9, and an optional Day 10.",
    "Short daily consultations, 15 to 20 minutes, Monday through Friday, to keep execution moving between the blocks.",
  ],
};

export const sprintInstalledKicker = "What gets installed";
export const sprintInstalledHeadline = "Five deliverables. All of them working when we leave.";

export const sprintInstalled: NumberedDetail[] = [
  {
    title: "Profit Uplift Blueprint and Model",
    body: "A quantified model translating improvements into dollars, in low, base, and aggressive scenarios. What would it mean if revenue rose 10 to 50 percent? If net income rose 5 to 10 percent? If productivity rose 10 to 50 percent?",
  },
  {
    title: "Execution Cadence OS",
    body: "A self-facilitated meeting system aligned to your vision and annual goals: daily, weekly, monthly, and quarterly agendas, a scoreboard, roles and rules, and follow-up discipline. Your team runs it without us.",
  },
  {
    title: "Installed System Assets and Live Scoreboard",
    body: "Templates, scripts, one-page standard operating checklists for every workflow we install, and 5 to 8 standard installations from the TPG AI Installation Menu, live: follow-up, proposals, reporting, tasking. Plus the CEO’s KPI scoreboard, with defined data feeds your team owns. Your central nervous system.",
  },
  {
    title: "AI Fluency Accelerator",
    body: "Role-based AI workflows from the standard menu, plus hands-on training, built into daily operations. This is not AI training. It is installed efficiency and adoption. Your team becomes self-sufficient.",
  },
  {
    title: "The TPG AI Architecture and Engineering Team",
    body: "Every automation, agent, and workflow above is built and installed by our own engineering team, not facilitation alone. This covers the standard installations scoped in writing at kickoff. Custom opportunities that surface during the Sprint are captured in a Custom Automation Roadmap and scoped independently.",
  },
];

export const sprintAudienceKicker = "Who this is for";
export const sprintAudienceHeadline = "This is the flagship. It is not for everyone.";

export const sprintAudienceItems: string[] = [
  "Founder-led businesses generating $5M to $50M+ in annual revenue, with capital to invest.",
  "Companies with no dedicated operating-system architect on the team.",
  "Leaders trying to fill a role they cannot find at the right price.",
];

/** The page's single pricing block. */
export const sprintPricing = {
  price: "$25,000",
  notes: [
    "The flagship Sprint. The recommended standard engagement, 10 business days.",
    "$35,000 to $50,000+ for complex organizations or multi-team installs.",
    "Your Annual Planning Summit investment is credited in full toward a Sprint booked within 14 days.",
  ],
};

export const sprintFaq: FaqItem[] = [
  {
    question: "Is this AI training?",
    answer:
      "No. It is installed efficiency and adoption. We build AI workflows into the actual work your team does daily, not a workshop they forget by Friday.",
  },
  {
    question: "How disruptive are ten days?",
    answer:
      "Minimal. The cadence is 3 to 4 half-day working blocks plus short daily consults. Your team keeps running the business while we install the system around them.",
  },
  {
    question: "Who actually builds it?",
    answer:
      "TPG’s own AI architecture and engineering team. Not outsourced, not subcontracted, and not a solo facilitator promising to figure it out later. That is the reason this is the flagship.",
  },
  {
    question: "What is standard and what is custom?",
    answer:
      "Standard installations come from the TPG AI Installation Menu and run on mainstream platforms with no custom code. The Sprint includes 5 to 8 of them, scoped in writing at kickoff. Custom development and integrations are captured in a Custom Automation Roadmap and scoped independently, after a paid Systems and Data Audit that is scoped and priced per engagement.",
  },
  {
    question: "What happens after the ten days?",
    answer:
      "You own everything: templates, automations, scoreboard, and a team trained to run it. If you want continued traction, the Fractional Chief Revenue Architect engagement sustains and scales it.",
  },
];

export const sprintClosing = {
  headline: "Stop building it in your head.",
  ctaLabel: "Schedule a Sprint Conversation",
};
