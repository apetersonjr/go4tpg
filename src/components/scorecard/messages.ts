/**
 * The transcript's data model: an append-only log.
 *
 * THIS USED TO BE DERIVED, and that was the bug. Messages were rebuilt every
 * render from `turns`, `replies` and the single `question` currently on screen,
 * which meant the displayed conversation was a projection of per-turn state
 * rather than a record of what had happened. Three symptoms fell out of that
 * one cause:
 *
 *   - The question vanished the instant it was answered, because the answer
 *     was not committed until the server replied, so for the duration of the
 *     request neither the question (no longer current) nor the answer (not yet
 *     a turn) was in the projection.
 *   - The acknowledgement rendered against a turn was the PREVIOUS turn's,
 *     because `replies` was keyed by intent and read one render out of step
 *     with the turn it belonged to.
 *   - With nothing committed and no current question, the projection collapsed
 *     to a lone typing indicator in an empty panel.
 *
 * The fix is not to patch the projection. It is to stop projecting. This log is
 * now the SOLE source of truth for what is displayed. Messages are appended and
 * never touched again — no removal, no mutation, no reordering — with exactly
 * one exception, the transient typing indicator, which is removed when the
 * message it was standing in for arrives.
 *
 * `turns` and `question` still exist on the widget, because the stateless
 * server needs the session posted back on every request. They are PROTOCOL
 * state. Nothing in this file reads them and nothing rendered comes from them.
 * `replies` is gone outright: there is no acknowledgement to file against a
 * turn any more, so there is no map to key into, no prior state to reach for,
 * and structurally nothing to be off by one.
 *
 * Pure: no JSX, no hooks, no imports that touch the network.
 */

export type MessageRole = "bot" | "user";

export type MessageKind =
  /** A question as it was actually put to the visitor. */
  | "question"
  /** What the visitor sent — typed, or the label of a chip they chose. */
  | "answer"
  /** The framing line, then the gate form, both inside the thread. */
  | "gate"
  /** The transient one. The only message that is ever removed. */
  | "typing"
  /** The report being written, and then the report itself. */
  | "analyzing"
  | "results";

export type Message = {
  /** Stable uuid, generated once at creation and never recomputed. */
  id: string;
  role: MessageRole;
  kind: MessageKind;
  text: string;
  /** Which exchange this belongs to. 0 is the opener. */
  turnIndex: number;
  /**
   * When this message was created, as epoch milliseconds.
   *
   * Stamped once at append time and never recomputed, for the same reason the
   * id is: a timestamp derived at render would tick, and a message would
   * silently change its stated send time every time React re-rendered the log.
   *
   * Stored as a number rather than a formatted string so the formatting stays a
   * rendering decision — the same message reads "9:24 AM" or "09:24" depending
   * on the viewer's locale, and neither is baked into state.
   */
  sentAt: number;
};

/** Stages that render as the chat. Intro and gate have their own layouts. */
export type ChatStageName = "questions" | "analyzing" | "results";

/**
 * Mints a message.
 *
 * The id is a uuid rather than anything derived from content or position. A
 * derived id collides the moment two turns produce the same text — two "Yes"
 * answers, or the same acknowledgement twice — and React then reuses one
 * bubble for both, which is precisely the class of bug this rewrite exists to
 * remove. `crypto.randomUUID` is called once, here, at append time; the value
 * is then carried in state and never regenerated on re-render.
 */
export function createMessage(
  role: MessageRole,
  kind: MessageKind,
  text: string,
  turnIndex: number,
): Message {
  return { id: crypto.randomUUID(), role, kind, text, turnIndex, sentAt: Date.now() };
}

/**
 * The send time, as the viewer's own clock would write it.
 *
 * Locale-aware rather than a hand-rolled `h:mm`, so a 24-hour locale gets
 * "09:24" and a 12-hour one "9:24 AM" without this having to know which is
 * which. Formatting happens at render because the stored value is a timestamp;
 * see `sentAt`.
 */
export function formatSentAt(sentAt: number): string {
  return new Date(sentAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** The id every typing indicator is appended and removed by kind, not by id. */
export function withoutTyping(messages: Message[]): Message[] {
  return messages.filter((message) => message.kind !== "typing");
}

/** True when a typing indicator is currently in the log. */
export function hasTyping(messages: Message[]): boolean {
  return messages.some((message) => message.kind === "typing");
}

/**
 * Whether two adjacent messages come from the same speaker.
 *
 * Drives the tighter spacing within a run from one speaker than across a
 * change of speaker — see `Transcript`. Kept here because it is a fact about
 * the log, not about how the log is drawn.
 */
export function isFromVisitor(message: Message): boolean {
  return message.role === "user";
}
