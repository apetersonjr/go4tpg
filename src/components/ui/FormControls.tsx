"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "border-tpg-border text-tpg-ink w-full rounded-md border bg-white px-4 py-3 text-[16.5px] " +
  "transition-colors outline-none focus:border-tpg-primary focus:ring-2 focus:ring-tpg-primary/25 " +
  "aria-invalid:border-tpg-cta aria-invalid:ring-2 aria-invalid:ring-tpg-cta/20";

/** Ties a control to whichever of its helper and error text actually exist. */
function describedBy(id: string, helper?: string, error?: string) {
  const ids = [helper && `${id}-helper`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

function RequiredMark() {
  return (
    <span className="text-tpg-cta ml-1" aria-hidden="true">
      *
    </span>
  );
}

function Helper({ id, text }: { id: string; text: string }) {
  return (
    <p id={`${id}-helper`} className="text-tpg-muted mt-1.5 text-[14.5px]">
      {text}
    </p>
  );
}

function ErrorText({ id, text }: { id: string; text: string }) {
  return (
    <p id={`${id}-error`} className="text-tpg-cta mt-2 text-[14.5px] font-bold">
      {text}
    </p>
  );
}

type BaseFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Explanatory line under the label. */
  helper?: string;
  error?: string;
  required?: boolean;
};

/**
 * Each control owns its own label, helper and error so a caller cannot pass
 * helper text to the wrapper and forget to wire it to the input — the two used
 * to be separate and the describedby drifted.
 */
export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  helper,
  error,
  required,
  type = "text",
  autoComplete,
}: BaseFieldProps & { type?: "text" | "email" | "tel"; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-tpg-ink block text-[16px] font-bold">
        {label}
        {required && <RequiredMark />}
      </label>
      {helper && <Helper id={id} text={helper} />}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(controlClass, "mt-2.5")}
      />
      {error && <ErrorText id={id} text={error} />}
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  helper,
  error,
  required,
  rows = 5,
}: BaseFieldProps & { rows?: number }) {
  return (
    <div>
      <label htmlFor={id} className="text-tpg-ink block text-[16px] font-bold">
        {label}
        {required && <RequiredMark />}
      </label>
      {helper && <Helper id={id} text={helper} />}
      <textarea
        id={id}
        name={name}
        value={value}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, helper, error)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(controlClass, "mt-2.5 resize-y")}
      />
      {error && <ErrorText id={id} text={error} />}
    </div>
  );
}

type RadioGroupProps = {
  id: string;
  name: string;
  legend: string;
  helper?: string;
  error?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

/**
 * Single-select as radios rather than a `select`.
 *
 * The tier question carries prices, and prices are shown deliberately on this
 * form — a collapsed dropdown would hide them behind an interaction, which is
 * exactly what the offer says not to do.
 */
export function RadioGroup({
  id,
  name,
  legend,
  helper,
  error,
  options,
  value,
  onChange,
  required,
}: RadioGroupProps) {
  // `radiogroup` is the role that carries validity for a set of radios: an
  // individual radio input does not support `aria-invalid`, so the state lives
  // on the group rather than being repeated on every option.
  return (
    <fieldset
      role="radiogroup"
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, helper, error)}
    >
      <legend className="text-tpg-ink text-[16px] font-bold">
        {legend}
        {required && <RequiredMark />}
      </legend>
      {helper && <Helper id={id} text={helper} />}
      <div className="mt-3 grid gap-2.5">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "border-tpg-border flex cursor-pointer items-start gap-3 rounded-md border bg-white px-4 py-3.5 text-[16px]",
              "hover:border-tpg-primary transition-colors",
              "has-[:checked]:border-tpg-primary has-[:checked]:bg-tpg-tint",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-tpg-primary mt-1 h-[17px] w-[17px] flex-none"
            />
            <span className="text-tpg-body">{option}</span>
          </label>
        ))}
      </div>
      {error && <ErrorText id={id} text={error} />}
    </fieldset>
  );
}

export function Checkbox({
  id,
  name,
  label,
  checked,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="border-tpg-border flex cursor-pointer items-start gap-3 rounded-md border bg-white px-4 py-3.5 text-[16px]"
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-tpg-primary mt-1 h-[17px] w-[17px] flex-none"
      />
      <span className="text-tpg-body">{label}</span>
    </label>
  );
}

/** Groups a run of questions under a visible heading. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-tpg-border border-t pt-10 first:border-t-0 first:pt-0">
      <h3 className="text-tpg-accent mb-7 text-[13px] font-bold tracking-[0.22em] uppercase">
        {title}
      </h3>
      <div className="grid gap-7">{children}</div>
    </section>
  );
}
