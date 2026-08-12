"use client";

import { useRef, useState } from "react";
import {
  Checkbox,
  FormSection,
  RadioGroup,
  TextAreaField,
  TextField,
} from "@/components/ui/FormControls";
import { BERTH_ENDPOINT, HONEYPOT_FIELD } from "@/lib/berth";
import type { BerthPayload, BerthResponse } from "@/lib/berth";
import {
  bringingQuestion,
  confirmation,
  cohortHelper,
  failure,
  notifyCalendarLabel,
  readinessOptions,
  submitLabel,
  submitPendingLabel,
  tierOptions,
  travellingWithHelper,
  travellingWithOptions,
  validationSummary,
  voyageOptions,
} from "@/content/reserve";

type Status = "idle" | "submitting" | "success" | "error";

/** Everything the form collects, before the client-stamped metadata is added. */
const emptyFields = {
  voyage: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  bringing: "",
  travellingWith: "",
  tier: "",
  readiness: "",
  notes: "",
};

type Fields = typeof emptyFields;

/** Every field here must be answered before the request can be sent. */
const requiredFields: (keyof Fields)[] = [
  "voyage",
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "role",
  "bringing",
  "travellingWith",
  "tier",
  "readiness",
];

const requiredMessage = "This one is required.";

function validate(fields: Fields): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of requiredFields) {
    if (!fields[key].trim()) errors[key] = requiredMessage;
  }
  // Deliberately permissive: the address is proven by sending to it, and an
  // over-strict pattern rejects real addresses.
  if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "That does not look like an email address.";
  }
  return errors;
}

/**
 * The berth request form.
 *
 * One form, both voyages. Question 1 routes the wording of question 8 and the
 * whole of question 10 — switching voyage clears any tier already chosen,
 * because the tier lists differ and a stale answer would submit a tier that
 * does not exist on the selected voyage.
 *
 * There is no payment field anywhere in here by design: a deposit is taken
 * only after Alan confirms fit.
 */
export function BerthForm() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [notifyCalendar, setNotifyCalendar] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const chooseVoyage = (voyage: string) => {
    // The tier list is voyage-specific, so the old answer cannot carry over.
    setFields((current) => ({ ...current, voyage, tier: "" }));
    setErrors((current) => {
      const next = { ...current };
      delete next.voyage;
      delete next.tier;
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move the reader to the summary rather than leaving them at the button.
      summaryRef.current?.focus();
      return;
    }

    setStatus("submitting");
    const payload: BerthPayload = {
      ...fields,
      notifyCalendar,
      submittedAt: new Date().toISOString(),
      sourcePage: window.location.pathname,
      [HONEYPOT_FIELD]: honeypot,
    };

    try {
      const response = await fetch(BERTH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // A missing or misconfigured endpoint answers with HTML, not JSON.
      const data: BerthResponse | null = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setStatus("success");
        return;
      }
      if (data?.errors) setErrors(data.errors);
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-tpg-border border-t-tpg-primary rounded-md border border-t-[6px] bg-white px-[clamp(24px,4vw,48px)] py-[clamp(32px,4vw,52px)]"
      >
        <h2 className="text-tpg-ink font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.15]">
          {confirmation.headline}
        </h2>
        {confirmation.body.map((paragraph) => (
          <p key={paragraph} className="text-tpg-body mt-5 max-w-[720px] text-[17px]">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  const bringing = fields.voyage ? bringingQuestion[fields.voyage] : undefined;
  const tiers = fields.voyage ? (tierOptions[fields.voyage] ?? []) : [];
  const pending = status === "submitting";
  const hasFieldErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10">
      {/*
        Focusable so validation can move the reader here; `tabIndex={-1}` keeps
        it out of the tab order otherwise.
      */}
      <div ref={summaryRef} tabIndex={-1} className="grid gap-4 outline-none empty:hidden">
        {hasFieldErrors && (
          <p
            role="alert"
            className="border-tpg-cta text-tpg-cta rounded-md border-l-[5px] bg-white px-6 py-4 text-[16px] font-bold"
          >
            {validationSummary}
          </p>
        )}
        {status === "error" && (
          <div role="alert" className="border-tpg-cta rounded-md border-l-[5px] bg-white px-6 py-5">
            <p className="text-tpg-ink font-serif text-[22px]">{failure.headline}</p>
            <p className="text-tpg-body mt-2 text-[16px]">
              {failure.body}{" "}
              <a
                href={`mailto:${failure.email}`}
                className="text-tpg-primary font-bold underline underline-offset-4"
              >
                {failure.email}
              </a>
            </p>
          </div>
        )}
      </div>

      {/*
        The sections are wrapped so `FormSection`'s `first:` rules land on the
        first section rather than on the summary above — the summary is always
        in the DOM (it holds the focus target) and hiding it does not stop it
        counting as the first child.
      */}
      <div className="grid gap-10">
        <FormSection title="Which voyage">
          <RadioGroup
            id="voyage"
            name="voyage"
            legend="Which voyage are you considering?"
            options={[...voyageOptions]}
            value={fields.voyage}
            onChange={chooseVoyage}
            error={errors.voyage}
            required
          />
        </FormSection>

        <FormSection title="Who you are">
          <div className="grid gap-7 sm:grid-cols-2">
            <TextField
              id="firstName"
              name="firstName"
              label="First name"
              autoComplete="given-name"
              value={fields.firstName}
              onChange={(value) => set("firstName", value)}
              error={errors.firstName}
              required
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              value={fields.lastName}
              onChange={(value) => set("lastName", value)}
              error={errors.lastName}
              required
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={(value) => set("email", value)}
              error={errors.email}
              required
            />
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={(value) => set("phone", value)}
              error={errors.phone}
              required
            />
          </div>

          <TextField
            id="company"
            name="company"
            label="Company"
            autoComplete="organization"
            helper={cohortHelper}
            value={fields.company}
            onChange={(value) => set("company", value)}
            error={errors.company}
            required
          />
          <TextField
            id="role"
            name="role"
            label="Your role"
            autoComplete="organization-title"
            helper={cohortHelper}
            value={fields.role}
            onChange={(value) => set("role", value)}
            error={errors.role}
            required
          />
        </FormSection>

        <FormSection title="What you would bring">
          {bringing ? (
            <TextAreaField
              id="bringing"
              name="bringing"
              label={bringing.label}
              helper={bringing.helper}
              value={fields.bringing}
              onChange={(value) => set("bringing", value)}
              error={errors.bringing}
              required
            />
          ) : (
            <p className="text-tpg-muted text-[16px]">
              Choose a voyage above and this question will tailor itself to it.
            </p>
          )}
        </FormSection>

        <FormSection title="The practicals">
          <RadioGroup
            id="travellingWith"
            name="travellingWith"
            legend="Are you travelling solo, or with someone?"
            helper={travellingWithHelper}
            options={travellingWithOptions}
            value={fields.travellingWith}
            onChange={(value) => set("travellingWith", value)}
            error={errors.travellingWith}
            required
          />

          {tiers.length > 0 ? (
            <RadioGroup
              id="tier"
              name="tier"
              legend="Which tier are you considering?"
              options={tiers}
              value={fields.tier}
              onChange={(value) => set("tier", value)}
              error={errors.tier}
              required
            />
          ) : (
            <p className="text-tpg-muted text-[16px]">Choose a voyage above to see its tiers.</p>
          )}

          <RadioGroup
            id="readiness"
            name="readiness"
            legend="How ready are you to sail if invited?"
            options={readinessOptions}
            value={fields.readiness}
            onChange={(value) => set("readiness", value)}
            error={errors.readiness}
            required
          />

          <Checkbox
            id="notifyCalendar"
            name="notifyCalendar"
            label={notifyCalendarLabel}
            checked={notifyCalendar}
            onChange={setNotifyCalendar}
          />

          <TextAreaField
            id="notes"
            name="notes"
            label="Anything we should know?"
            rows={4}
            value={fields.notes}
            onChange={(value) => set("notes", value)}
          />
        </FormSection>
      </div>

      {/*
        Honeypot. Hidden from sight, from assistive tech, and from the tab
        order — only an automated submitter will ever put anything in it.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-tpg-cta hover:bg-tpg-cta-hover inline-block rounded px-[52px] py-[21px] text-[19px] font-bold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? submitPendingLabel : status === "error" ? failure.retryLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
