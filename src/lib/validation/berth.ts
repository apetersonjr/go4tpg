import {
  readinessOptions,
  tierOptions,
  travellingWithOptions,
  voyageOptions,
} from "@/content/reserve";

/**
 * Server-side validation for the berth payload.
 *
 * The client validates too, but that is a courtesy to the person filling the
 * form — it is not a control. Everything here re-checks from scratch against
 * the same option constants the form renders from, so a reworded label cannot
 * pass the form and fail here (or vice versa).
 */

export type ValidatedBerth = {
  voyage: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  bringing: string;
  travellingWith: string;
  tier: string;
  readiness: string;
  notifyCalendar: boolean;
  notes: string;
  submittedAt: string;
  sourcePage: string;
};

export type ValidationResult =
  { ok: true; data: ValidatedBerth } | { ok: false; errors: Record<string, string> };

/** Keys match the form's field ids so the client can mark the right inputs. */
type TextRule = { key: keyof ValidatedBerth; max: number; required: boolean };

const TEXT_RULES: TextRule[] = [
  { key: "firstName", max: 100, required: true },
  { key: "lastName", max: 100, required: true },
  { key: "email", max: 254, required: true },
  { key: "phone", max: 40, required: true },
  { key: "company", max: 200, required: true },
  { key: "role", max: 120, required: true },
  { key: "bringing", max: 5000, required: true },
  { key: "notes", max: 5000, required: false },
];

const REQUIRED_MESSAGE = "This one is required.";
const CHOICE_MESSAGE = "Choose one of the listed options.";

/** Anything that is not a string becomes "", so a hostile type cannot slip past. */
function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateBerth(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const input = (body ?? {}) as Record<string, unknown>;

  const text: Record<string, string> = {};
  for (const { key, max, required } of TEXT_RULES) {
    const value = asString(input[key]);
    if (required && !value) {
      errors[key] = REQUIRED_MESSAGE;
    } else if (value.length > max) {
      errors[key] = `Please keep this under ${max} characters.`;
    }
    text[key] = value;
  }

  if (!errors.email && text.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) {
    errors.email = "That does not look like an email address.";
  }

  // Question 1 is the router: an invalid voyage makes the tier list unknowable,
  // so the tier is reported as a choice error rather than guessed at.
  const voyage = asString(input.voyage);
  const voyageValid = (voyageOptions as readonly string[]).includes(voyage);
  if (!voyage) errors.voyage = REQUIRED_MESSAGE;
  else if (!voyageValid) errors.voyage = CHOICE_MESSAGE;

  const tier = asString(input.tier);
  if (!tier) {
    errors.tier = REQUIRED_MESSAGE;
  } else if (!voyageValid || !(tierOptions[voyage] ?? []).includes(tier)) {
    errors.tier = CHOICE_MESSAGE;
  }

  const travellingWith = asString(input.travellingWith);
  if (!travellingWith) errors.travellingWith = REQUIRED_MESSAGE;
  else if (!travellingWithOptions.includes(travellingWith)) errors.travellingWith = CHOICE_MESSAGE;

  const readiness = asString(input.readiness);
  if (!readiness) errors.readiness = REQUIRED_MESSAGE;
  else if (!readinessOptions.includes(readiness)) errors.readiness = CHOICE_MESSAGE;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // The client stamps submittedAt; an unparseable or absent value falls back to
  // server time so the record always carries one.
  const submitted = asString(input.submittedAt);
  const submittedAt = Number.isNaN(Date.parse(submitted))
    ? new Date().toISOString()
    : new Date(submitted).toISOString();

  return {
    ok: true,
    data: {
      voyage,
      firstName: text.firstName,
      lastName: text.lastName,
      email: text.email,
      phone: text.phone,
      company: text.company,
      role: text.role,
      bringing: text.bringing,
      travellingWith,
      tier,
      readiness,
      notifyCalendar: input.notifyCalendar === true,
      notes: text.notes,
      submittedAt,
      sourcePage: asString(input.sourcePage).slice(0, 200) || "(not recorded)",
    },
  };
}
