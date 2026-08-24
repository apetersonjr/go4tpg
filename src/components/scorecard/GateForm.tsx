"use client";

import { useState } from "react";
import { gateFraming, gateSubmitLabel, gateSubmitPendingLabel } from "@/content/scorecard";
import { cn } from "@/lib/cn";
import { HONEYPOT_FIELD } from "@/lib/scorecard";
import type { ScorecardContact } from "@/lib/scorecard";

const fieldClass =
  "border-tpg-border text-tpg-ink w-full rounded-md border bg-white px-3.5 py-3 text-[14px] " +
  "transition-colors outline-none focus:border-tpg-primary focus:ring-2 focus:ring-tpg-primary/25 " +
  "aria-invalid:border-tpg-cta aria-invalid:ring-2 aria-invalid:ring-tpg-cta/20";

const labelClass = "text-tpg-muted block text-[11px] font-semibold tracking-[0.1em] uppercase";

type GateFormProps = {
  pending: boolean;
  errors: Record<string, string>;
  onSubmit: (contact: ScorecardContact, honeypot: string) => void;
};

const empty = { firstName: "", email: "", website: "" };

/**
 * Three fields and nothing else. No phone, no company size, no job title —
 * every additional field is a reason to close the panel, and the two things
 * that matter (who they are, where to reply) are here.
 *
 * The framing line sits above the fields rather than reading as a form header,
 * because this is a conversation that happens to need an address, not a form.
 */
export function GateForm({ pending, errors, onSubmit }: GateFormProps) {
  const [fields, setFields] = useState(empty);
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState<Record<string, string>>({});

  function set(key: keyof typeof empty, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;

    // Client-side check is a courtesy so nobody waits on a round trip to learn
    // they left a field blank. The server re-checks everything regardless.
    const local: Record<string, string> = {};
    if (!fields.firstName.trim()) local.firstName = "This one is required.";
    if (!fields.email.trim()) local.email = "This one is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      local.email = "That does not look like an email address.";
    }
    if (!fields.website.trim()) local.website = "This one is required.";

    setTouched(local);
    if (Object.keys(local).length > 0) return;

    onSubmit(
      {
        firstName: fields.firstName.trim(),
        email: fields.email.trim(),
        website: fields.website.trim(),
      },
      honeypot,
    );
  }

  // Server errors win: they are the later and more authoritative answer.
  const shown = { ...touched, ...errors };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="sc-step-in flex flex-col gap-3.5 px-5 pt-5 pb-6"
    >
      <p className="text-tpg-muted text-[13px] leading-relaxed">{gateFraming}</p>

      <div className="flex flex-col gap-2.5">
        <div>
          <label htmlFor="tpg-sc-first-name" className={labelClass}>
            First name
          </label>
          <input
            id="tpg-sc-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={fields.firstName}
            onChange={(event) => set("firstName", event.target.value)}
            aria-invalid={shown.firstName ? true : undefined}
            aria-describedby={shown.firstName ? "tpg-sc-first-name-error" : undefined}
            className={cn(fieldClass, "mt-1.5")}
          />
          {shown.firstName && (
            <p id="tpg-sc-first-name-error" className="text-tpg-cta mt-1.5 text-[12.5px] font-bold">
              {shown.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tpg-sc-email" className={labelClass}>
            Work email
          </label>
          <input
            id="tpg-sc-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={fields.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={shown.email ? true : undefined}
            aria-describedby={shown.email ? "tpg-sc-email-error" : undefined}
            className={cn(fieldClass, "mt-1.5")}
          />
          {shown.email && (
            <p id="tpg-sc-email-error" className="text-tpg-cta mt-1.5 text-[12.5px] font-bold">
              {shown.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tpg-sc-website" className={labelClass}>
            Company website
          </label>
          <input
            id="tpg-sc-website"
            name="website"
            type="text"
            autoComplete="url"
            placeholder="company.com"
            value={fields.website}
            onChange={(event) => set("website", event.target.value)}
            aria-invalid={shown.website ? true : undefined}
            aria-describedby={shown.website ? "tpg-sc-website-error" : undefined}
            className={cn(fieldClass, "mt-1.5")}
          />
          {shown.website && (
            <p id="tpg-sc-website-error" className="text-tpg-cta mt-1.5 text-[12.5px] font-bold">
              {shown.website}
            </p>
          )}
        </div>
      </div>

      {/*
       * Honeypot. Visually hidden and out of the tab order, so a person never
       * meets it and anything arriving with it filled did not come from here.
       * `aria-hidden` keeps it away from screen readers too — it is not a field
       * anyone is meant to answer.
       */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="tpg-sc-honeypot">Do not fill this in</label>
        <input
          id="tpg-sc-honeypot"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "bg-tpg-cta hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover w-full rounded px-5 py-3.5",
          "text-[13.5px] font-bold text-white",
          "transition-[background-color,transform] duration-200 ease-out",
          "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
          // Cancelled while submitting, so the button stops responding the
          // moment it stops being actionable.
          "disabled:opacity-70 disabled:hover:translate-y-0",
        )}
      >
        {pending ? gateSubmitPendingLabel : gateSubmitLabel}
      </button>
    </form>
  );
}
