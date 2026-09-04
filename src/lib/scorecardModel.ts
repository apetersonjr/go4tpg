/**
 * The brain: the per-turn engine and the final analysis.
 *
 * Server-only. The API key is read from the environment here and never leaves
 * this process — the widget talks to our routes, never to OpenAI.
 *
 * The architecture in one paragraph. Every turn does two jobs at once: it
 * writes the next thing the visitor sees, and it extracts a structured reading
 * of what they just said. The reading is a list of tokens from a closed
 * vocabulary plus one sentence of interpretation in professional American
 * business English. The final report is generated from the accumulated
 * readings and NOTHING ELSE — the raw answers are not in scope when it is
 * written, which is what makes it impossible for a misspelling, a fragment or
 * a piece of slang to be reproduced in the output. That property comes from
 * `analysisInput()` below, which is the only function that builds the analysis
 * payload, and from the fact that it has no access to a raw answer to include.
 *
 * The intents are fixed and the wording is not. Letting the model free-form
 * its way through six questions produces a conversation that wanders and
 * arrives at the end missing signals the recommendation step needs; fixing the
 * questions produces a form. So the model is handed the intent it must satisfy
 * and asked to word it for this particular person.
 */

import OpenAI from "openai";
import {
  MENU_VERSION,
  findInstallation,
  findSection,
  installations,
} from "@/data/installation-menu";
import {
  INTENTS_VERSION,
  SIGNALS,
  findIntent,
  intentIds,
  intents,
  isSkippable,
  nextIntent,
  validSignals,
} from "@/data/scorecard-intents";
import type { ScorecardIntent } from "@/data/scorecard-intents";
import { toRecommendation } from "@/lib/scorecard";
import type {
  ExtractionConfidence,
  ScorecardContact,
  ScorecardExtraction,
  ScorecardQuestion,
  ScorecardRecommendation,
  ScorecardTurn,
} from "@/lib/scorecard";

/*
 * Two tiers, matching what each call is actually for. The turn call runs six
 * times per session with the visitor waiting on it, so it takes the fast
 * model. The analysis runs once, off the critical path behind a "reading your
 * answers" beat, and is the output people read carefully — that one gets the
 * capable model.
 */
const TURN_MODEL = "gpt-5-nano";
const ANALYSIS_MODEL = "gpt-5.4-mini";

let client: OpenAI | null = null;

/** Lazily constructed so a missing key surfaces as a handled failure, not a boot crash. */
function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  client ??= new OpenAI();
  return client;
}

/**
 * The voice, shared by both calls. A scorecard that acknowledges in one
 * register and reports in another reads as two different people.
 *
 * The American spelling rule is first because it was raised explicitly in
 * client review and because it is the one a model will drift from without
 * noticing: "organisation" and "prioritised" are what a general-purpose model
 * produces roughly half the time unless told otherwise.
 */
const VOICE = `You are writing for The Peterson Group, a firm that installs AI workflows for founder-led companies. The reader is the chief executive of a company doing between two and fifty million dollars in revenue.

Voice rules. All of them are absolute.

- AMERICAN SPELLING, ALWAYS. Write "organization", "prioritized", "customize", "summarized", "analyze", "recognize", "behavior", "canceled". Never the British forms: never "organisation", "prioritised", "customise", "analyse", "behaviour", "cancelled".
- Professional American business English. Not conversational slang, not consultant jargon, not marketing copy.
- Complete sentences with verbs. Do not write fragment-style headline copy.
- NO FLATTERY, EVER. Never write "great question", "good point", "excellent", "I love that", "smart", "interesting". Do not compliment the person or their answer in any form.
- No emoji. No exclamation marks.
- Never mention a price, a fee, a rate or a cost of any kind.
- Never invent a statistic, a timeline, a client name or a capability you were not told about.`;

/** Beyond this the person is watching a typing indicator with nothing behind it. */
const TURN_TIMEOUT_MS = 12000;
const ANALYSIS_TIMEOUT_MS = 30000;

/* -------------------------------------------------------------------------
 * The turn engine
 * ---------------------------------------------------------------------- */

const TURN_SYSTEM = `${VOICE}

You are running a six-question diagnostic conversation. Each question exists to satisfy one fixed INTENT. The intents never change and every session must satisfy all six. What changes is the WORDING: you rewrite each question using what this particular person has already told you, so it sounds like the next thing a person would ask rather than the next field on a form.

You do two jobs on every turn.

JOB 1 — EXTRACT. Read the answer just given and record what it means.
- "signals" is a list drawn ONLY from the closed vocabulary you are given. If nothing in the vocabulary fits, return an empty list. Never invent a signal string.
- "evidence" is ONE sentence of YOUR OWN interpretation, in professional American business English, describing what is true about this business. It is not a quotation and not a paraphrase that keeps their wording. Never reproduce their spelling, their slang, their abbreviations or their sentence fragments. If they typed "we lose track of quotes n follow ups slip", you write "Quotes are not tracked to a conclusion and follow-up is inconsistent."
- "confidence" is "high" when the answer directly addresses the intent, "medium" when you are inferring, "low" when the answer was empty, evasive or unrelated.

JOB 2 — ASK. Decide what to ask next.
- Mark an intent satisfied when you now know what it requires, whether or not that intent was the one you asked. If someone says in the first question that they are a two-person consultancy, the headcount intent is satisfied and must be skipped. Skipping is a feature: fewer questions, same coverage. Asking someone to pick a headcount range immediately after they told you their headcount is the single worst thing this conversation can do.
- The test is whether you could answer the intent yourself from what they said, not whether they addressed it deliberately. If you can, it is satisfied.
- Never mark an intent satisfied on a guess. If you genuinely could not answer it from what they said, ask.
- "satisfied_intents" is the COMPLETE list after this turn, not the new additions. It always includes every intent already listed as satisfied in the input.
- Then write "next_question" for the first unsatisfied intent, rewording that intent's default question using what they have said. Keep the intent's meaning exactly. Do not merge two intents into one question and do not ask a question that is not one of the intents.
- Copy the "format" and "options" for that intent verbatim from the intent definition. Never invent, reword, add or drop an option.

WRITE NOTHING ELSE. There is no acknowledgement line and no commentary. The next question is the only thing the visitor reads, and it already carries the continuity: it is reworded from what they just said, so it demonstrates you understood without a separate line claiming that you did.

Good next_question: "For a cloud services business, how many people are in the organization today?"
Bad next_question: "Noted, your cloud services focus informs the scale considerations. How many people are in the organization?"`;

/**
 * The response schema.
 *
 * Both id fields are enums of the real intent ids and the signal list is an
 * enum of the real vocabulary, which makes an invented value a schema
 * violation rather than something to catch afterwards — though we still catch
 * it afterwards, because a constraint you do not verify is a hope.
 *
 * `next_question` is nullable rather than optional: strict mode requires every
 * property to be present, and "no next question" is a real state that has to
 * be expressible.
 */
function turnSchema() {
  return {
    type: "json_schema" as const,
    name: "scorecard_turn",
    strict: true,
    schema: {
      type: "object",
      properties: {
        extraction: {
          type: "object",
          properties: {
            intent_id: { type: "string", enum: intentIds },
            signals: { type: "array", items: { type: "string", enum: [...SIGNALS] } },
            evidence: { type: "string" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["intent_id", "signals", "evidence", "confidence"],
          additionalProperties: false,
        },
        satisfied_intents: {
          type: "array",
          items: { type: "string", enum: intentIds },
        },
        next_question: {
          type: ["object", "null"],
          properties: {
            intent_id: { type: "string", enum: intentIds },
            text: { type: "string" },
            format: { type: "string", enum: ["text", "chips"] },
            options: { type: "array", items: { type: "string" } },
          },
          required: ["intent_id", "text", "format", "options"],
          additionalProperties: false,
        },
        complete: { type: "boolean" },
      },
      required: ["extraction", "satisfied_intents", "next_question", "complete"],
      additionalProperties: false,
    },
  };
}

type ModelTurn = {
  extraction?: {
    intent_id?: string;
    signals?: unknown;
    evidence?: string;
    confidence?: string;
  };
  satisfied_intents?: unknown;
  next_question?: {
    intent_id?: string;
    text?: string;
    format?: string;
    options?: unknown;
  } | null;
  complete?: boolean;
};

/** The intent definitions, rendered for the model. */
function intentsForPrompt(): string {
  return intents
    .map((intent) => {
      const options = intent.options.length
        ? `\n  options (verbatim): ${intent.options.map((option) => `"${option}"`).join(" | ")}`
        : "";
      const other = intent.allowOther
        ? `\n  a free-text "Something else" box sits under the chips`
        : "";
      const cap =
        intent.maxSelections !== null && intent.format === "chips"
          ? `\n  the visitor may pick up to ${intent.maxSelections}`
          : "";
      const never = intent.alwaysAsk
        ? `\n  NEVER skip this one and always ask it LAST. It carries the most signal.`
        : "";
      return `${intent.id} — must learn: ${intent.mustLearn}
  default wording: "${intent.defaultText}"
  format: ${intent.format}${options}${cap}${other}${never}`;
    })
    .join("\n\n");
}

/**
 * The conversation so far, as the model sees it.
 *
 * The raw answer IS included here, and only here. The turn engine has to read
 * what the person actually typed — that is its whole job. What matters is that
 * this function is never called by the analysis path; see `analysisInput`.
 */
function turnHistory(turns: ScorecardTurn[]): string {
  if (turns.length === 0) return "(nothing yet — this is the first answer)";
  return turns
    .map(
      (turn) =>
        `[${turn.intentId}] asked: ${turn.question}\n  they said: ${turn.rawAnswer || "(skipped)"}\n  you recorded: ${turn.extraction.evidence} — signals: ${turn.extraction.signals.join(", ") || "none"}`,
    )
    .join("\n\n");
}

/** Builds a question for the widget from an intent, using the model's wording or the default. */
function toQuestion(intent: ScorecardIntent, text?: string): ScorecardQuestion {
  return {
    intentId: intent.id,
    // The wording is the model's; everything structural is the intent's. A
    // model-supplied option list would let it quietly change what is being
    // asked, and the extraction downstream expects the real options.
    text: text?.trim() || intent.defaultText,
    format: intent.format,
    options: intent.options,
    maxSelections: intent.maxSelections,
    allowOther: intent.allowOther,
    topic: intent.topic,
    placeholder: intent.placeholder,
  };
}

export type TurnResult = {
  extraction: ScorecardExtraction;
  satisfiedIntents: string[];
  nextQuestion: ScorecardQuestion | null;
  complete: boolean;
};

/**
 * The deterministic fallback, used when the model cannot be reached.
 *
 * It satisfies exactly the intent that was asked and nothing more — no
 * inference without a model to do the inferring — and moves to the next one
 * with its default wording. The visitor never dead-ends: they get a plainer
 * conversation, not a broken one. The extraction is empty rather than guessed,
 * because a fabricated reading would corrupt the report far more than a
 * missing one.
 */
function fallbackTurn(intentId: string, satisfied: string[], answered: boolean): TurnResult {
  const satisfiedSet = new Set(satisfied);
  if (answered) satisfiedSet.add(intentId);

  const next = nextIntent(satisfiedSet);

  return {
    extraction: {
      intentId,
      signals: [],
      evidence: "",
      confidence: "low",
    },
    satisfiedIntents: [...satisfiedSet],
    nextQuestion: next ? toQuestion(next) : null,
    complete: !next,
  };
}

function asConfidence(value: unknown): ExtractionConfidence {
  return value === "high" || value === "medium" || value === "low" ? value : "low";
}

/**
 * Words that mean the model is talking about its own plumbing.
 *
 * The failure this guards against is the model narrating the extraction job
 * inside the text meant for the person: "Extracted: industry_b2b", "proceeding
 * to q5 to assess your reporting". The visitor does not know intents or signals
 * exist, and a line like that reads as software talking to itself in front of a
 * customer.
 *
 * This used to police the acknowledgement line. That line is gone — the next
 * question is now the only thing the visitor reads — so the check moved to the
 * question, which is where the same leak would now surface. The prompt forbids
 * all of this; this is the enforcement, because a rule the model is asked to
 * follow and a rule the server enforces are different things.
 *
 * A rejected question falls back to the intent's default wording, which is
 * always safe and always answerable.
 */
const MACHINERY = [
  /q[1-6]/i,
  /(?:industry|team|founder|leak|reporting|knowledge|crm|hiring|high_customer|low_customer)_[a-z_]+/i,
  /(?:extracted|satisfied|proceeding to|moving to|next question|next up|we'?ll ask|signals?\s*:|recorded[;:]|identified\s*:)/i,
];

/** True when a generated question is fit to put on screen. */
function isCleanQuestion(text: string): boolean {
  if (!text.trim()) return false;
  return !MACHINERY.some((pattern) => pattern.test(text));
}

/**
 * Signals that, on their own, answer an intent completely.
 *
 * This is the deterministic half of skip logic. Asking the model to notice
 * that "I run a three-person practice" has already answered the headcount
 * question works most of the time and fails the rest, and the failure is the
 * visible one: a chip list asking for a headcount range immediately after the
 * person typed their headcount. Where a signal IS the answer — the four
 * headcount bands are the clear case, since emitting one of them means the
 * band is known — the server decides rather than asking twice.
 *
 * Deliberately short. A signal only belongs here when emitting it means the
 * intent is fully answered, not merely touched on. `founder_in_reporting` says
 * something about the leader's week but does not establish where the week
 * goes, so the founder-time intent is not in this table.
 */
const INTENT_SATISFYING_SIGNALS: Record<string, readonly string[]> = {
  q2: ["team_micro", "team_small", "team_mid", "team_large"],
};

/**
 * Guards the model's satisfied set.
 *
 * Four rules, all of which exist because the model controls this list and the
 * cost of it being wrong is either a session that ends without the signals the
 * report needs, or a question asked twice:
 *
 *   1. Anything already satisfied stays satisfied. The set only grows.
 *   2. The intent just answered is satisfied if there was an answer at all —
 *      the model may not decide to re-ask a question the person just answered.
 *   3. A signal that fully answers an intent satisfies it, whether or not the
 *      model noticed. See `INTENT_SATISFYING_SIGNALS`.
 *   4. `alwaysAsk` intents may only be satisfied by having actually been
 *      asked. Nothing else may satisfy q6 by inference — not the model's
 *      claim, and not rule 3.
 */
function reconcileSatisfied(
  claimed: unknown,
  previous: string[],
  askedIntentId: string,
  answered: boolean,
  signals: readonly string[],
): string[] {
  const set = new Set(previous);
  if (answered) set.add(askedIntentId);

  if (Array.isArray(claimed)) {
    for (const entry of claimed) {
      if (typeof entry !== "string" || !findIntent(entry)) continue;
      // Rule 4: an always-ask intent is satisfied by being answered, above,
      // and by no other route.
      if (!isSkippable(entry) && entry !== askedIntentId) continue;
      set.add(entry);
    }
  }

  // Rule 3, applied after the model's claim so it can only ever add.
  for (const [intentId, satisfying] of Object.entries(INTENT_SATISFYING_SIGNALS)) {
    if (!isSkippable(intentId)) continue;
    if (signals.some((signal) => satisfying.includes(signal))) set.add(intentId);
  }

  return [...set];
}

async function requestTurn(
  contact: ScorecardContact,
  turns: ScorecardTurn[],
  intent: ScorecardIntent,
  question: string,
  answer: string,
  satisfied: string[],
): Promise<ModelTurn | null> {
  const openai = getClient();
  if (!openai) return null;

  const response = await openai.responses.create(
    {
      model: TURN_MODEL,
      instructions: TURN_SYSTEM,
      input: [
        `THE SIX INTENTS:\n\n${intentsForPrompt()}`,
        "",
        `SIGNAL VOCABULARY — the only strings you may emit as signals:\n${SIGNALS.join(", ")}`,
        "",
        `First name: ${contact.firstName}`,
        `Company domain: ${contact.website}`,
        "",
        `CONVERSATION SO FAR:\n${turnHistory(turns)}`,
        "",
        `ALREADY SATISFIED: ${satisfied.join(", ") || "none"}`,
        "",
        `YOU JUST ASKED [${intent.id}]: ${question}`,
        `THEY ANSWERED: ${answer || "(they skipped it)"}`,
        "",
        "Extract their answer, update the satisfied list, and write the next question.",
      ].join("\n"),
      /*
       * These are reasoning models, and `max_output_tokens` is the budget for
       * the reasoning AND the visible answer together. A budget sized for the
       * JSON alone gets spent entirely on thinking and the call comes back
       * `incomplete` with no text — a silent failure rather than an error. Low
       * effort plus real headroom is what this call actually wants: the
       * judgement is small, but there is a schema to fill.
       */
      reasoning: { effort: "low" },
      max_output_tokens: 3000,
      text: { format: turnSchema() },
    },
    { timeout: TURN_TIMEOUT_MS },
  );

  // A safety decline arrives as a refusal item rather than as an error.
  if (
    response.output.some(
      (item) => item.type === "message" && item.content.some((part) => part.type === "refusal"),
    )
  ) {
    return null;
  }

  try {
    return JSON.parse(response.output_text) as ModelTurn;
  } catch {
    return null;
  }
}

/**
 * One turn: the acknowledgement, the extraction and the next question.
 *
 * Retries once, then falls back to the intent's default wording. This never
 * throws and never returns null — a visitor part-way through six questions
 * must always be given something to answer next.
 */
export async function runTurn(input: {
  sessionId: string;
  contact: ScorecardContact;
  turns: ScorecardTurn[];
  satisfiedIntents: string[];
  intentId: string;
  question: string;
  answer: string;
}): Promise<TurnResult> {
  const intent = findIntent(input.intentId);
  const answered = input.answer.trim().length > 0;

  // An unknown intent id is a client that is out of step with the server. Fall
  // back to the walk rather than trusting the id.
  if (!intent) {
    console.error(
      `[scorecard] session ${input.sessionId}: unknown intent id ${input.intentId} — falling back.`,
    );
    return fallbackTurn(input.intentId, input.satisfiedIntents, false);
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await requestTurn(
        input.contact,
        input.turns,
        intent,
        input.question,
        input.answer,
        input.satisfiedIntents,
      );
      if (!result) continue;

      const extraction: ScorecardExtraction = {
        intentId: intent.id,
        signals: validSignals(result.extraction?.signals),
        evidence: (result.extraction?.evidence ?? "").trim(),
        confidence: asConfidence(result.extraction?.confidence),
      };

      // The extraction is built first because its signals feed the satisfied
      // set: a signal that fully answers a later intent skips it, whether or
      // not the model thought to say so.
      const satisfiedIntents = reconcileSatisfied(
        result.satisfied_intents,
        input.satisfiedIntents,
        intent.id,
        answered,
        extraction.signals,
      );

      /*
       * The next question is decided HERE, not by the model. The model's
       * `next_question.intent_id` is treated as advice and its text as the
       * wording; which intent actually comes next is derived from the
       * reconciled satisfied set. Otherwise a model that forgets an intent
       * ends the session early and the report is written short.
       */
      const next = nextIntent(new Set(satisfiedIntents));
      /*
       * The generated wording is used only when it is for the intent we
       * actually want next AND it carries none of the machinery. Anything else
       * falls back to the intent's default text inside `toQuestion`.
       */
      const generated =
        result.next_question && result.next_question.intent_id === next?.id
          ? result.next_question.text
          : undefined;
      const wording = generated && isCleanQuestion(generated) ? generated : undefined;

      return {
        extraction,
        satisfiedIntents,
        nextQuestion: next ? toQuestion(next, wording) : null,
        complete: !next,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(
          `[scorecard] session ${input.sessionId}: turn failed (${error.status}): ${error.message}`,
        );
      } else {
        console.error(`[scorecard] session ${input.sessionId}: turn failed:`, error);
      }
    }
  }

  console.error(
    `[scorecard] session ${input.sessionId}: turn for ${intent.id} fell back to default wording after two attempts.`,
  );
  return fallbackTurn(intent.id, input.satisfiedIntents, answered);
}

/* -------------------------------------------------------------------------
 * The final analysis
 * ---------------------------------------------------------------------- */

/**
 * The catalog, rendered for the model. Descriptions are deliberately empty in
 * `installation-menu.ts` and are only included when they are not — an invented
 * description would be the model reasoning about a workflow that does not
 * exist as described.
 */
function catalogForPrompt(): string {
  return installations
    .map((entry) => {
      const section = findSection(entry.section);
      const bucket = section ? section.name : entry.section;
      const description = entry.description ? ` — ${entry.description}` : "";
      return `${entry.id} | ${entry.name} | ${bucket}${description}`;
    })
    .join("\n");
}

const ANALYSIS_SYSTEM = `${VOICE}

A chief executive has just completed a six-question diagnostic. You are given a structured reading of what they said: a set of signal tokens, and one interpreted sentence per question. You are NOT given anything they typed, and you must not ask for it. Write the report from what you are given.

Produce two things.

1. "summary" — one paragraph, second person, addressed to them. Describe what is manual, unowned or leaking in the business today, drawn from the evidence lines. Lead with what they said they would hand off, which is the last intent and the one that matters most. Do not propose solutions here. Do not flatter. Do not restate the questions. Four sentences at most.

2. "recommendations" — between three and five installations from the catalog below, in the order they should be installed.

EVERY recommendation has three parts and all three are mandatory:
- "problem" — the specific thing that is wrong today, in their business, stated in one sentence. Drawn from the evidence, not from the installation's name.
- "installs" — what The Peterson Group installs. One sentence, concrete, naming the thing that gets built.
- "produces" — what that yields once it is running. One sentence describing the outcome, not the feature.

Stating the problem and stopping is the failure mode to avoid. A recommendation that names a pain without saying what gets built and what it produces is incomplete and will be rejected.

Example of the shape:
  problem: "Weekly reporting is assembled by hand and arrives too late to act on."
  installs: "An automated weekly report showing efficiency and leakage against your KPIs."
  produces: "Delivered every Monday without anyone chasing it."

How to choose:
- Return FEWER when the signals cluster on one theme. Three tightly relevant picks beat five padded ones. Five is for a genuinely broad set of problems. Never pad to reach a number.
- Below about ten people, leave flows and request routing are noise. Do not pick them for a very small company unless the signals show that problem directly.
- Company AI Brain is the foundation most other installations sit on, but it is not automatic. Pick it when the signals show knowledge trapped in a few heads.
- Never pick something the signals do not support.
- Never mention a price, a duration or an implementation detail you were not given.

Catalog — use these exact ids, and nothing outside this list:
id | name | section
${catalogForPrompt()}`;

function analysisSchema() {
  return {
    type: "json_schema" as const,
    name: "scorecard_report",
    strict: true,
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        recommendations: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              installation_id: {
                type: "string",
                enum: installations.map((entry) => entry.id),
              },
              problem: { type: "string" },
              installs: { type: "string" },
              produces: { type: "string" },
            },
            required: ["installation_id", "problem", "installs", "produces"],
            additionalProperties: false,
          },
        },
      },
      required: ["summary", "recommendations"],
      additionalProperties: false,
    },
  };
}

type ModelPick = {
  installation_id?: string;
  problem?: string;
  installs?: string;
  produces?: string;
};
type ModelReport = { summary?: string; recommendations?: ModelPick[] };

/**
 * The analysis payload. THE ONLY function that builds it.
 *
 * Exported for one reason: the route logs exactly this string before sending
 * it, which is how "raw answers are provably absent from the final analysis
 * call" is verified rather than asserted. Its parameter is a list of
 * extractions, so there is no raw answer in scope for it to include even by
 * mistake — the type system is doing the enforcing, and the log is the proof.
 */
export function analysisInput(
  contact: ScorecardContact,
  extractions: ScorecardExtraction[],
): string {
  const signals = new Set<string>();
  for (const extraction of extractions) {
    for (const signal of extraction.signals) signals.add(signal);
  }

  const evidence = extractions
    .filter((extraction) => extraction.evidence)
    .map((extraction) => {
      const intent = findIntent(extraction.intentId);
      const topic = intent ? intent.topic : extraction.intentId;
      return `[${extraction.intentId} · ${topic}] ${extraction.evidence}`;
    });

  return [
    `First name: ${contact.firstName}`,
    `Company domain: ${contact.website}`,
    "",
    `SIGNALS: ${[...signals].join(", ") || "none recorded"}`,
    "",
    "WHAT THE DIAGNOSTIC ESTABLISHED:",
    evidence.length ? evidence.join("\n") : "(no evidence was recorded)",
  ].join("\n");
}

/**
 * Turns the model's picks into recommendations, dropping anything that is not
 * a real catalog entry or is missing one of the three parts.
 *
 * The schema already constrains both, so this is the second of two locks on
 * the same door. It stays because the enum is enforced by a service we do not
 * control, and because "every recommendation has all three parts" is a promise
 * the results screen makes to a prospect.
 */
function pickInstallations(picks: ModelPick[], sessionId: string): ScorecardRecommendation[] {
  const seen = new Set<string>();
  const recommendations: ScorecardRecommendation[] = [];

  for (const pick of picks) {
    const installation = findInstallation(pick.installation_id ?? "");
    if (!installation) {
      console.error(
        `[scorecard] session ${sessionId}: model returned unknown installation id: ${pick.installation_id}`,
      );
      continue;
    }
    if (seen.has(installation.id)) continue;

    const problem = (pick.problem ?? "").trim();
    const installs = (pick.installs ?? "").trim();
    const produces = (pick.produces ?? "").trim();

    // The three-part shape is the whole point. An incomplete one is dropped,
    // which makes the caller's count check fail and triggers the retry.
    if (!problem || !installs || !produces) {
      console.error(
        `[scorecard] session ${sessionId}: dropped ${installation.id} — incomplete three-part shape.`,
      );
      continue;
    }

    seen.add(installation.id);
    const section = findSection(installation.section);
    recommendations.push(
      toRecommendation(installation, section?.name ?? "", { problem, installs, produces }),
    );
  }

  return recommendations.slice(0, 5);
}

export type ScorecardReport = {
  summary: string;
  recommendations: ScorecardRecommendation[];
  menuVersion: number;
  intentsVersion: number;
};

async function requestReport(payload: string, sessionId: string): Promise<ModelReport | null> {
  const openai = getClient();
  if (!openai) {
    console.error(
      `[scorecard] session ${sessionId}: OPENAI_API_KEY is not set — cannot produce a report.`,
    );
    return null;
  }

  const response = await openai.responses.create(
    {
      model: ANALYSIS_MODEL,
      instructions: ANALYSIS_SYSTEM,
      input: payload,
      // Room for the reasoning as well as the JSON — see the note on the turn
      // call. This one is worth real thinking, so the effort is left at the
      // model's default rather than lowered.
      max_output_tokens: 8000,
      text: { format: analysisSchema() },
    },
    { timeout: ANALYSIS_TIMEOUT_MS },
  );

  const refused = response.output.some(
    (item) => item.type === "message" && item.content.some((part) => part.type === "refusal"),
  );
  if (refused) {
    console.error(`[scorecard] session ${sessionId}: report refused.`);
    return null;
  }

  try {
    return JSON.parse(response.output_text) as ModelReport;
  } catch (error) {
    console.error(`[scorecard] session ${sessionId}: report was not valid JSON:`, error);
    return null;
  }
}

/**
 * Signals to installations, deterministically.
 *
 * The last line of defence. When the model cannot produce a report at all, the
 * visitor still sees a result and the lead still fires — a person who spent
 * three minutes answering questions does not get an error screen because an
 * API was down.
 *
 * The copy here is fixed and honest: it describes what each installation is
 * for in general terms rather than pretending to a reading of this particular
 * business. That is the trade — a generic result rather than no result, and it
 * never claims to be more than it is.
 */
const FALLBACK_MAP: {
  signals: string[];
  id: string;
  problem: string;
  installs: string;
  produces: string;
}[] = [
  {
    signals: ["reporting_manual", "reporting_absent", "founder_in_reporting"],
    id: "ai-weekly-report-generator",
    problem: "The numbers that tell you how the business is doing are assembled by hand.",
    installs: "An automated weekly report built from your existing systems.",
    produces: "A consistent read on the business every week without anyone chasing it.",
  },
  {
    signals: ["founder_in_support", "high_customer_contact"],
    id: "ai-customer-service-front-line",
    problem: "Routine customer questions reach you personally before anyone else answers them.",
    installs: "A front line that handles common inbound questions and escalates the rest.",
    produces: "Faster answers for customers and fewer interruptions in your day.",
  },
  {
    signals: ["founder_in_meetings", "leak_followthrough"],
    id: "ai-action-item-and-accountability-engine",
    problem: "Commitments made in meetings are not tracked to completion.",
    installs: "An engine that captures every action item and follows it to a close.",
    produces: "Decisions that turn into finished work rather than into another meeting.",
  },
  {
    signals: ["leak_revenue", "crm_stale", "founder_selling"],
    id: "ai-crm-autopilot",
    problem: "Opportunities are not consistently recorded or followed up.",
    installs: "A CRM that maintains itself from the conversations already happening.",
    produces: "A pipeline that reflects reality without manual data entry.",
  },
  {
    signals: ["knowledge_undocumented", "leak_knowledge"],
    id: "company-ai-brain",
    problem: "What the company knows lives in a small number of heads.",
    installs: "A central knowledge layer every other workflow can draw on.",
    produces: "Answers that no longer depend on one person being available.",
  },
  {
    signals: ["founder_in_admin", "founder_firefighting", "leak_operational"],
    id: "ai-intake-and-request-router",
    problem: "Incoming requests arrive without structure and get triaged by whoever sees them.",
    installs: "A single intake point that routes each request to the right owner.",
    produces: "Work that reaches the right person without passing through you first.",
  },
  {
    signals: ["founder_in_hiring", "hiring_active"],
    id: "ai-recruiting-and-onboarding-assistant",
    problem: "Hiring and onboarding consume leadership time that belongs elsewhere.",
    installs: "A structured pipeline covering sourcing through to a new hire's first week.",
    produces: "A repeatable process that runs without your day-to-day involvement.",
  },
];

/** The picks everyone gets when nothing else matched. */
const FALLBACK_DEFAULT_IDS = [
  "company-ai-brain",
  "ai-executive-daily-brief",
  "ai-weekly-report-generator",
];

function fallbackReport(extractions: ScorecardExtraction[], sessionId: string): ScorecardReport {
  const signals = new Set<string>();
  for (const extraction of extractions) {
    for (const signal of extraction.signals) signals.add(signal);
  }

  const picked: ScorecardRecommendation[] = [];
  const seen = new Set<string>();

  function add(entry: (typeof FALLBACK_MAP)[number]) {
    const installation = findInstallation(entry.id);
    if (!installation || seen.has(entry.id)) return;
    seen.add(entry.id);
    const section = findSection(installation.section);
    picked.push(
      toRecommendation(installation, section?.name ?? "", {
        problem: entry.problem,
        installs: entry.installs,
        produces: entry.produces,
      }),
    );
  }

  for (const entry of FALLBACK_MAP) {
    if (entry.signals.some((signal) => signals.has(signal))) add(entry);
  }

  // Top up to three so the shape of the results screen is the same either way.
  for (const id of FALLBACK_DEFAULT_IDS) {
    if (picked.length >= 3) break;
    const entry = FALLBACK_MAP.find((candidate) => candidate.id === id);
    if (entry) add(entry);
  }

  console.error(
    `[scorecard] session ${sessionId}: report fell back to deterministic mapping (${picked.length} picks).`,
  );

  return {
    summary:
      "Your answers point to work that runs on your personal attention rather than on a system. The shortlist below starts with the installations that remove the most of that dependency first.",
    recommendations: picked.slice(0, 5),
    menuVersion: MENU_VERSION,
    intentsVersion: INTENTS_VERSION,
  };
}

/**
 * Produces the report, retrying once, then falling back deterministically.
 *
 * Never returns null. The visitor has been promised a report by email and is
 * looking at a results screen — both of those have to be satisfied by
 * something real, and a generic-but-honest reading beats an error.
 *
 * `payload` is passed in rather than built here so the caller can log the
 * exact bytes that went to the model. That log is the proof that raw answers
 * are absent, and it has to be the same string that was sent, not a
 * reconstruction of it.
 */
export async function generateReport(
  payload: string,
  extractions: ScorecardExtraction[],
  sessionId: string,
): Promise<{ report: ScorecardReport; degraded: boolean }> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await requestReport(payload, sessionId);
      if (!result) continue;

      const recommendations = pickInstallations(result.recommendations ?? [], sessionId);
      const summary = (result.summary ?? "").trim();

      /*
       * Fewer than three surviving picks means ids were dropped as unknown or
       * as incomplete. Retry rather than show a thin list built from a bad
       * response — this is the "retry once, then drop" rule from the spec,
       * applied at the response level because a single dropped pick is what
       * makes the count fall short.
       */
      if (!summary || recommendations.length < 3) continue;

      return {
        report: {
          summary,
          recommendations,
          menuVersion: MENU_VERSION,
          intentsVersion: INTENTS_VERSION,
        },
        degraded: false,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(
          `[scorecard] session ${sessionId}: report failed (${error.status}): ${error.message}`,
        );
      } else {
        console.error(`[scorecard] session ${sessionId}: report failed:`, error);
      }
    }
  }

  return { report: fallbackReport(extractions, sessionId), degraded: true };
}
