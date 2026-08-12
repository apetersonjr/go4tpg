import { VOYAGE_AT_SEA, VOYAGE_JOY_DRIVEN, VOYAGE_UNDECIDED } from "@/content/reserve";
import type { CreateTaskInput } from "@/lib/clickup";
import type { MailMessage } from "@/lib/mailer";
import type { ValidatedBerth } from "@/lib/validation/berth";

/**
 * Turns a validated berth request into the two records Alan works from: the
 * email and the ClickUp task.
 *
 * Both are built from one field list, so the working record in ClickUp and the
 * triage copy in the inbox can never disagree about what was submitted.
 */

/** Readiness answer that escalates the task. */
const READY_NOW = "Ready to move forward";

/** Stable, greppable tags — never the raw label, which contains em dashes. */
const VOYAGE_TAGS: Record<string, string> = {
  [VOYAGE_AT_SEA]: "strategy-blueprint-at-sea",
  [VOYAGE_JOY_DRIVEN]: "joy-driven-life",
  [VOYAGE_UNDECIDED]: "voyage-undecided",
};

/**
 * Every field, in the order the form asks them, with the three triage answers
 * lifted to the top so the enquiry can be judged at a glance.
 */
function fieldRows(data: ValidatedBerth): { label: string; value: string }[] {
  return [
    { label: "Voyage", value: data.voyage },
    { label: "Tier", value: data.tier },
    { label: "Readiness", value: data.readiness },
    { label: "Name", value: `${data.firstName} ${data.lastName}` },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Company", value: data.company },
    { label: "Role", value: data.role },
    { label: "What they would bring", value: data.bringing },
    { label: "Travelling", value: data.travellingWith },
    { label: "Notify when calendar is announced", value: data.notifyCalendar ? "Yes" : "No" },
    { label: "Anything we should know", value: data.notes || "(nothing added)" },
  ];
}

/** Provenance, kept at the foot of both records rather than mixed into the answers. */
function footRows(data: ValidatedBerth): { label: string; value: string }[] {
  return [
    { label: "Submitted at", value: data.submittedAt },
    { label: "Source page", value: data.sourcePage },
  ];
}

/** Every value here is visitor-supplied, so it is escaped before entering HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBerthEmail(data: ValidatedBerth): MailMessage {
  const rows = fieldRows(data);
  const foot = footRows(data);

  const text = [
    ...rows.map((row) => `${row.label}: ${row.value}`),
    "",
    "---",
    ...foot.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");

  const rowHtml = (row: { label: string; value: string }) =>
    `<tr>` +
    `<th align="left" valign="top" style="padding:6px 14px 6px 0;color:#5a6b7c;font-weight:600;white-space:nowrap">${escapeHtml(row.label)}</th>` +
    `<td valign="top" style="padding:6px 0;color:#032a45;white-space:pre-wrap">${escapeHtml(row.value)}</td>` +
    `</tr>`;

  const html =
    `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6">` +
    `<table cellpadding="0" cellspacing="0" role="presentation">${rows.map(rowHtml).join("")}</table>` +
    `<hr style="border:0;border-top:1px solid #dfe8ef;margin:20px 0">` +
    `<table cellpadding="0" cellspacing="0" role="presentation">${foot.map(rowHtml).join("")}</table>` +
    `</div>`;

  return {
    subject: `Berth request — ${data.firstName} ${data.lastName}, ${data.company} — ${data.voyage}`,
    text,
    html,
    // So a reply from Alan's inbox goes straight to the applicant.
    replyTo: data.email,
  };
}

export function buildBerthTask(data: ValidatedBerth): CreateTaskInput {
  const section = (rows: { label: string; value: string }[]) =>
    rows.map((row) => `**${row.label}:** ${row.value}`).join("\n\n");

  return {
    name: `Berth request — ${data.firstName} ${data.lastName} — ${data.voyage}`,
    markdown_description: [section(fieldRows(data)), "---", section(footRows(data))].join("\n\n"),
    tags: ["berth-request", VOYAGE_TAGS[data.voyage] ?? "voyage-unknown"],
    priority: data.readiness === READY_NOW ? 2 : 3,
  };
}
