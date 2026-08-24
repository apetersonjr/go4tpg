/**
 * The model layer: acknowledgement lines and the recommendation engine.
 *
 * Server-only. The API key is read from the environment here and never leaves
 * this process — the widget talks to our routes, never to OpenAI.
 *
 * Why a model and not a scoring table: a rule-based mapping from six answers to
 * a shortlist reads as generic within about a week, because every visitor who
 * ticks "admin and paperwork" gets the identical five picks. The model reads
 * what someone actually wrote, which is the entire value of asking in prose.
 * What it is NOT trusted with is the catalog — see `pickInstallations`.
 */

import OpenAI from "openai";
import {
  MENU_VERSION,
  findInstallation,
  findSection,
  installations,
} from "@/data/installation-menu";
import { toRecommendation } from "@/lib/scorecard";
import type { ScorecardAnswer, ScorecardContact, ScorecardRecommendation } from "@/lib/scorecard";

/*
 * Two tiers, matching what each call is actually for. The acknowledgement is
 * fifteen words reacting to one sentence and it sits in the visitor's path, so
 * it takes the cheap, fast model. The reading is the judgement the whole widget
 * exists to make and happens once per completed session, off the critical path
 * behind a "reading your answers" beat — that one gets the capable model.
 *
 * These two ids are what the project's key is actually entitled to: a 403 on
 * anything else is a project-access error, not a typo. If the account is later
 * granted a stronger model, `RESULT_MODEL` is the one worth moving — the
 * reading is where the extra capability would show.
 */
const ACK_MODEL = "gpt-5-nano";
const RESULT_MODEL = "gpt-5.4-mini";

let client: OpenAI | null = null;

/** Lazily constructed so a missing key surfaces as a handled failure, not a boot crash. */
function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  client ??= new OpenAI();
  return client;
}

/**
 * Alan's voice, as the site writes it. This is the same instruction for both
 * calls because a scorecard that acknowledges in one register and reports in
 * another reads as two different people.
 */
const VOICE = `You are writing as The Peterson Group, a firm that installs AI workflows for founder-led companies.

Voice rules, all of them absolute:
- Short, plain, declarative sentences. No hype, no adjectives doing sales work.
- Never praise the person or their answer. Never "great", "love that", "excellent", "smart".
- No emoji. No exclamation marks.
- British-neutral business English. Contractions are fine.
- Never mention prices, and never invent a statistic, a timeline or a client name.`;

/** Beyond this the person is watching a typing indicator with nothing behind it. */
const ACK_TIMEOUT_MS = 9000;
const RESULT_TIMEOUT_MS = 25000;

const ACK_SYSTEM = `${VOICE}

Someone is part-way through a six-question diagnostic. You write the single line that sits between their answer and the next question.

Rules for that line:
- Maximum 15 words. One sentence.
- It must reference something specific they actually said. Reuse their own noun.
- It is an acknowledgement, not a question and not advice. Never ask anything.
- Never name a product, a workflow or an installation.
- If their answer is empty, evasive or nonsense, reply with an empty string.

Good: "That one shows up in almost every business we scan."
Bad: "Great insight! Many businesses struggle with exactly this challenge."

Reply with the line itself and nothing else.`;

/** Renders the answers so far as a plain transcript for either model call. */
function transcriptOf(answers: ScorecardAnswer[]): string {
  return answers
    .map((answer) => `Q: ${answer.question}\nA: ${answer.answer || "(skipped)"}`)
    .join("\n\n");
}

/**
 * One line reacting to the answer just given.
 *
 * Returns "" on any failure. An empty acknowledgement is a valid outcome the
 * widget renders as no bubble at all — losing a line of connective copy is
 * invisible, whereas blocking the next question on a model call is not.
 */
export async function generateAcknowledgement(
  contact: ScorecardContact,
  answers: ScorecardAnswer[],
): Promise<string> {
  const openai = getClient();
  const latest = answers.at(-1);
  if (!openai || !latest || !latest.answer.trim()) return "";

  try {
    const response = await openai.responses.create(
      {
        model: ACK_MODEL,
        instructions: ACK_SYSTEM,
        input: [
          `First name: ${contact.firstName}`,
          transcriptOf(answers),
          "Write the line that follows their last answer.",
        ].join("\n\n"),
        /*
         * These are reasoning models, and `max_output_tokens` is the budget for
         * the reasoning AND the visible answer together. A budget sized for a
         * fifteen-word line gets spent entirely on thinking, and the call comes
         * back `incomplete` with no text at all — a silent empty acknowledgement
         * rather than an error. Minimal effort plus real headroom is what a
         * one-line reaction actually wants.
         */
        reasoning: { effort: "minimal" },
        max_output_tokens: 1200,
      },
      { timeout: ACK_TIMEOUT_MS },
    );

    // A safety decline arrives as a refusal item rather than as an error.
    if (
      response.output.some(
        (item) => item.type === "message" && item.content.some((part) => part.type === "refusal"),
      )
    ) {
      return "";
    }

    const text = response.output_text.trim();

    // A model that ignores the word limit is more likely to have written a
    // paragraph than a good long line, so drop it rather than render it.
    return text.split(/\s+/).length > 25 ? "" : text;
  } catch (error) {
    console.error("[scorecard] acknowledgement failed:", error);
    return "";
  }
}

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

type ModelPick = { installation_id: string; reason: string };
type ModelResult = { summary: string; recommendations: ModelPick[] };

/**
 * The response schema. `installation_id` is additionally an enum of the real
 * catalog ids, which makes a hallucinated id a schema violation rather than
 * something we have to catch afterwards — though we still catch it afterwards,
 * because a constraint you do not verify is a hope.
 */
function outputSchema() {
  return {
    type: "json_schema" as const,
    name: "scorecard_reading",
    /*
     * Strict mode is what turns the enum below into an actual constraint rather
     * than a suggestion. It requires every property to appear in `required` and
     * `additionalProperties: false` at each level, which this schema already
     * satisfied.
     */
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
              reason: { type: "string" },
            },
            required: ["installation_id", "reason"],
            additionalProperties: false,
          },
        },
      },
      required: ["summary", "recommendations"],
      additionalProperties: false,
    },
  };
}

const RESULT_SYSTEM = `${VOICE}

Someone has just finished a six-question diagnostic. Read their answers and produce two things.

1. "summary" — one paragraph, second person, addressed to them. Reflect their own words back so they recognise themselves in it. Quote or closely echo their answer to the final question, which is the one that matters most. Describe what is manual today. Do not propose anything here, and do not flatter them. Three or four sentences.

2. "recommendations" — between three and five installations from the catalog below, in the order they should be installed. Each needs a one-line reason, written in the second person, tied to something they actually said. Not a description of the installation: a reason it is on THEIR list.

How to choose:
- Return FEWER when their answers cluster on one theme. Three tightly relevant picks beat five padded ones. Five is for a genuinely broad set of problems.
- Below about ten people, leave flows and request routing are noise. Do not pick them for a one-person or very small company unless they raised that problem themselves.
- Company AI Brain is the foundation most other installations sit on, but it is not automatic. Pick it when their answers show knowledge trapped in a few heads.
- Never pick something their answers do not support, just to reach a number.
- Never mention a price, a duration or an implementation detail you were not told.

Catalog — use these exact ids, and nothing outside this list:
id | name | section
${catalogForPrompt()}`;

/**
 * Turns the model's picks into recommendations, dropping anything that is not
 * a real catalog entry.
 *
 * The schema already constrains the id to an enum, so this is the second of
 * two locks on the same door. It stays because the enum is enforced by a
 * service we do not control, and the promise that results only ever name real
 * installations is one the site makes to a prospect.
 */
function pickInstallations(picks: ModelPick[]): ScorecardRecommendation[] {
  const seen = new Set<string>();
  const recommendations: ScorecardRecommendation[] = [];

  for (const pick of picks) {
    const installation = findInstallation(pick.installation_id);
    if (!installation) {
      console.error(`[scorecard] model returned unknown installation id: ${pick.installation_id}`);
      continue;
    }
    if (seen.has(installation.id)) continue;

    seen.add(installation.id);
    const section = findSection(installation.section);
    recommendations.push(toRecommendation(installation, section?.name ?? "", pick.reason.trim()));
  }

  return recommendations.slice(0, 5);
}

export type ScorecardReading = {
  summary: string;
  recommendations: ScorecardRecommendation[];
  menuVersion: number;
};

async function requestReading(
  contact: ScorecardContact,
  answers: ScorecardAnswer[],
): Promise<ModelResult | null> {
  const openai = getClient();
  if (!openai) {
    console.error("[scorecard] OPENAI_API_KEY is not set — cannot produce a reading.");
    return null;
  }

  const response = await openai.responses.create(
    {
      model: RESULT_MODEL,
      instructions: RESULT_SYSTEM,
      input: [
        `First name: ${contact.firstName}`,
        `Company domain: ${contact.website}`,
        "",
        transcriptOf(answers),
      ].join("\n"),
      /*
       * Room for the reasoning as well as the JSON — see the note on the
       * acknowledgement call. This one is worth real thinking, so the effort is
       * left at the model's default rather than minimised.
       */
      max_output_tokens: 8000,
      /*
       * `responses.parse()` would hand back a typed object, but it only accepts
       * a Zod schema and this one is built from the catalog at runtime. Passing
       * the raw schema and parsing the text ourselves keeps the enum generated
       * from `installations` rather than duplicated as a Zod union.
       */
      text: { format: outputSchema() },
    },
    { timeout: RESULT_TIMEOUT_MS },
  );

  const refusal = response.output.find(
    (item) => item.type === "message" && item.content.some((part) => part.type === "refusal"),
  );
  if (refusal) {
    console.error("[scorecard] reading refused.");
    return null;
  }

  /*
   * Strict mode makes malformed JSON very unlikely, but "very unlikely" is not
   * a reason to let a parse error take down a route that has already captured
   * the lead. A null here just means the caller retries.
   */
  try {
    return JSON.parse(response.output_text) as ModelResult;
  } catch (error) {
    console.error("[scorecard] reading was not valid JSON:", error);
    return null;
  }
}

/**
 * Produces the reading, retrying once.
 *
 * The retry is what the spec asks for on an invalid id, but it is worth having
 * for any empty result: this call happens once per completed session, after
 * someone has spent three minutes answering, so one more attempt is cheap
 * against the cost of showing them nothing.
 */
export async function generateReading(
  contact: ScorecardContact,
  answers: ScorecardAnswer[],
): Promise<ScorecardReading | null> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await requestReading(contact, answers);
      if (!result) continue;

      const recommendations = pickInstallations(result.recommendations ?? []);
      const summary = (result.summary ?? "").trim();

      // Fewer than three surviving picks means ids were dropped as unknown.
      // Retry rather than show a thin list built from a bad response.
      if (!summary || recommendations.length < 3) continue;

      return { summary, recommendations, menuVersion: MENU_VERSION };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(`[scorecard] reading failed (${error.status}):`, error.message);
      } else {
        console.error("[scorecard] reading failed:", error);
      }
    }
  }

  return null;
}
