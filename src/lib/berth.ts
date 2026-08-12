/**
 * The berth reservation payload — the contract between the form and the API
 * route. Both sides import this file, so the wire format has exactly one
 * definition.
 */

/**
 * Honeypot field name. It has to look like something a naive bot would fill
 * in, which is why it is not called "honeypot": the input is visually hidden
 * and removed from the tab order, so a human never sees it and anything that
 * arrives with it filled did not come from the form.
 */
export const HONEYPOT_FIELD = "website";

export const BERTH_ENDPOINT = "/api/berth";

export type BerthPayload = {
  voyage: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  /** The open question — its wording depends on the voyage chosen. */
  bringing: string;
  travellingWith: string;
  tier: string;
  readiness: string;
  notifyCalendar: boolean;
  notes: string;
  /** ISO 8601, stamped by the client at submit. */
  submittedAt: string;
  /** Path the request came from, so a second entry point stays attributable. */
  sourcePage: string;
  [HONEYPOT_FIELD]: string;
};

/** What the API route returns. Never `ok: true` unless something was delivered. */
export type BerthResponse = {
  ok: boolean;
  delivered: { email: boolean; clickup: boolean };
  message: string;
  /** Field-level errors, present only on a 400. */
  errors?: Record<string, string>;
};
