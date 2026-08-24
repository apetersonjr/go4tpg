/**
 * The scorecard's words. Copy lives here, never in the components, matching
 * every other section of the site.
 *
 * The six questions are transcribed from the approved build spec and are not
 * to be reworded without Alan. Each one is deliberately inconclusive on its
 * own: no question maps to a single installation, because a question that maps
 * one-to-one turns the scorecard into a checklist and reads as a sales script.
 */

export const widgetLabel = "3-Minute Scorecard";

/** The second tab. Visible and disabled in V1 — see the spec's §9. */
export const chatTabLabel = "Ask TPG";
export const chatTabBadge = "Soon";

export const introEyebrow = "Where you stand";
export const introHeadline = "Six questions. Three minutes. A shortlist of what to install first.";
export const introBody =
  "No score out of a hundred. A plain read on which workflows would pay first in a company your size.";

/** Sits above the gate fields, not as a form header. */
export const gateFraming = "So Alan can send your results. Ten seconds, then we start.";
export const gateSubmitLabel = "Start";
export const gateSubmitPendingLabel = "Starting...";

export type ChipQuestion = {
  id: string;
  text: string;
  kind: "chips";
  options: string[];
  /** Cap on selections. `null` means no cap. */
  maxSelections: number | null;
  /** Whether a free-text "something else" box sits under the chips. */
  allowOther: boolean;
  /** Short label for the progress row, naming what is being asked about. */
  topic: string;
};

export type TextQuestion = {
  id: string;
  text: string;
  kind: "text";
  placeholder: string;
  topic: string;
};

export type ScorecardQuestion = ChipQuestion | TextQuestion;

/*
 * Question order is load-bearing. Q1 is deliberately the easiest thing in the
 * world to answer — someone who has just handed over an email address needs a
 * question they can answer without thinking, or they leave. Q6 is last because
 * it is the one that earns the three minutes, and it is the line Alan reads
 * first in the notification.
 */
export const questions: ScorecardQuestion[] = [
  {
    id: "q1",
    text: "First up, what does your company actually do?",
    kind: "text",
    placeholder: "A sentence is enough",
    topic: "The business",
  },
  {
    id: "q2",
    text: "How big is the team these days?",
    kind: "chips",
    options: ["Just me", "2-10", "11-50", "50+"],
    maxSelections: 1,
    allowOther: false,
    topic: "Team size",
  },
  {
    id: "q3",
    text: "What eats the most of your week?",
    kind: "chips",
    options: [
      "Chasing leads",
      "Answering the same customer questions",
      "Meetings and follow-ups",
      "Admin and paperwork",
      "Chasing numbers",
      "Hiring and people stuff",
    ],
    maxSelections: 2,
    allowOther: true,
    topic: "Founder time",
  },
  {
    id: "q4",
    text: "When something falls through the cracks, where does it usually happen?",
    kind: "text",
    placeholder: "A sentence is enough",
    topic: "Follow-through",
  },
  {
    id: "q5",
    text: "How do you find out how the week went?",
    kind: "chips",
    options: [
      "Someone builds a report",
      "I ask around",
      "I check a few dashboards",
      "Honestly, I don't",
    ],
    maxSelections: 1,
    allowOther: false,
    topic: "Reporting",
  },
  {
    id: "q6",
    text: "Last one. If you could hand off one recurring task tomorrow and never think about it again, what would it be?",
    kind: "text",
    placeholder: "A sentence is enough",
    topic: "The one thing",
  },
];

export const questionCount = questions.length;

/** Free-text box under a chip question that allows one. */
export const otherChipLabel = "Something else";
export const otherPlaceholder = "Tell us in a few words";

export const chipHintSingle = "Pick one";
export const chipHintMulti = (max: number) => `Pick up to ${max}`;
export const nextLabel = "Next";
export const skipLabel = "Skip";

/** Shown while the recommendation call is in flight. */
export const analysingLine = "Reading your answers...";

export const resultsHeardEyebrow = "What we heard";
export const resultsInstallEyebrow = "What we'd install";

/**
 * The plain line under the two CTAs. Deliberately not a button: it is a
 * statement about what already happened, and the contact page sets the same
 * expectation that a real person answers.
 */
export const resultsFollowUp =
  "Your results have also gone to Alan, who will follow up personally.";

/*
 * The call, not the summit. The scorecard ends on a 20-minute conversation —
 * it is the first step, and someone who has just spent three minutes answering
 * questions is being asked for a smaller commitment than a planning summit.
 * The destination is unchanged: `commitCalendlyUrl` is already the /20min event.
 */
export const bookLabel = "Book a 20-Minute Call";
export const brochureLabel = "Download the Complete Menu";

/**
 * Shown when the recommendation call fails. It does not pretend to have
 * results: the answers are already captured as a lead, so the honest thing is
 * to say the reading did not come back and point at the person.
 */
export const resultsFailure =
  "We could not put your reading together just now. Your answers reached Alan, who will come back to you personally.";

export const closeLabel = "Close";
export const openLabel = "Open the 3-Minute Scorecard";

/**
 * Spoken labels for the transcript.
 *
 * Alignment and colour are the only things separating the two sides of the
 * conversation visually, and neither reaches a screen reader. These are read
 * out before each message so the speaker is never ambiguous.
 */
export const transcriptLabel = "Scorecard conversation";
export const botSpeakerLabel = "Scorecard:";
export const youSpeakerLabel = "You:";
