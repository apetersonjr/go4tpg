/**
 * The scorecard's words. Copy lives here, never in the components, matching
 * every other section of the site.
 *
 * What is NOT in this file any more: the six questions. They are now written
 * per session by the turn engine from the intents in
 * `@/data/scorecard-intents`, so there is no fixed question text to keep here.
 * What remains is the chrome — the framing, the labels, the lines that are the
 * same for everyone.
 *
 * American spelling throughout, deliberately. It was raised in client review
 * and the model is instructed to the same standard, so the hand-written copy
 * and the generated copy have to agree.
 */

export const widgetLabel = "3-Minute Scorecard";

/** The second tab. Visible and disabled in V1 — see the spec's §9. */
export const chatTabLabel = "Ask TPG";
export const chatTabBadge = "Soon";

export const introEyebrow = "Where you stand";
export const introHeadline = "Six questions. Three minutes. A shortlist of what to install first.";

/**
 * The approved opening line, agreed word by word in client review. Do not
 * paraphrase it, do not regenerate it, and do not let a model near it.
 */
export const introBody =
  "Six questions, three minutes. We'll customize a short list of AI installations your company should install first, with the build workflow for each, and email it instantly. Free.";

/**
 * Under the gate button, and the only prose on the card.
 *
 * The framing that used to sit above the fields is gone entirely: the labeled
 * fields and a button reading "Start the scorecard" already say what is being
 * asked, and a sentence restating it was a line to read on the way to a form
 * that asked the same thing. This one earns its place because it answers the
 * objection the email field raises, which nothing else on the card does.
 */
export const gatePrivacyLine = "No newsletter. Results and nothing else.";
export const gateSubmitLabel = "Start the scorecard";
export const gateSubmitPendingLabel = "Starting...";

/** Free-text box under a chip question that allows one. */
export const otherChipLabel = "Something else";
export const otherPlaceholder = "Tell us in a few words";

/**
 * The one advance control, on the two questions that still need one.
 *
 * "Continue" rather than "Next" because it is now only ever shown where the
 * visitor genuinely has more to say — a multi-select where they may want a
 * second option, or a text box they are still writing in. Single-select
 * questions advance on selection and render no button at all.
 *
 * There is no skip label any more. All six intents must be satisfied for the
 * recommendation engine to produce a report, so the control was offering an
 * exit that broke the output.
 */
export const continueLabel = "Continue";

/** The "jump to latest" affordance, shown only when the visitor has scrolled up. */
export const jumpToLatestLabel = "Jump to latest";

/** The day divider at the head of the thread. */
export const todayLabel = "Today";

/** Placeholder in the pinned composer while the gate card is still unanswered. */
export const composerLockedPlaceholder = "Fill the card above to begin";
/** Placeholder once the conversation is live. */
export const composerPlaceholder = "Type an answer";
/** Accessible name for the round send button. */
export const sendLabel = "Send";

/** Shown while the report is being written. */
export const analyzingLine = "Reading your answers...";

export const resultsHeardEyebrow = "What we heard";
export const resultsInstallEyebrow = "What we'd install";

/**
 * The three parts of a recommendation, labeled. Stating the pain and stopping
 * was the failure the client called out, so the labels make the shape visible:
 * a reader can see at a glance that there is a problem, a thing that gets
 * built, and an outcome.
 */
export const recommendationProblemLabel = "The problem";
export const recommendationInstallsLabel = "What we install";
export const recommendationProducesLabel = "What it produces";

/**
 * The confirmation line, in two versions, and which one shows is decided by
 * whether the send actually succeeded.
 *
 * This pair is the whole of §C2 on screen. The panel promises an instant
 * email, so a person who has just finished must never be told their report is
 * on its way when it is not. The failure line does not apologize and does not
 * hedge: it says what happened and what will happen instead, which is true
 * because the failure is logged with the session id and the address.
 */
export const resultsEmailed = "Your report is on its way to your inbox now.";
export const resultsNotEmailed =
  "Your results are on screen here. We could not send the emailed copy just now, and Alan has your details to follow up personally.";

/*
 * The call, not the summit. The scorecard ends on a 20-minute conversation —
 * it is the first step, and someone who has just spent three minutes answering
 * questions is being asked for a smaller commitment than a planning summit.
 * The destination is unchanged: `commitCalendlyUrl` is already the /20min event.
 */
export const bookLabel = "Book a 20-Minute Call";
export const brochureLabel = "Download the Complete Menu";

/**
 * Start over.
 *
 * Deliberately quiet copy for a deliberately quiet control. It sits under two
 * CTAs and must not compete with them — see `ResultsPanel`, where it is a text
 * button rather than a button-shaped thing.
 */
export const restartLabel = "Start over";
/**
 * Read out to a screen reader in place of the visible label, because "start
 * over" on its own does not say what is about to be discarded.
 */
export const restartAriaLabel = "Start over with a new scorecard session";

export const closeLabel = "Close";
export const openLabel = "Open the 3-Minute Scorecard";

/**
 * Spoken labels for the transcript.
 *
 * Alignment and color are the only things separating the two sides of the
 * conversation visually, and neither reaches a screen reader. These are read
 * out before each message so the speaker is never ambiguous.
 */
export const transcriptLabel = "Scorecard conversation";
export const botSpeakerLabel = "Scorecard:";
export const youSpeakerLabel = "You:";
