/**
 * Typed ClickUp task creation.
 *
 * Like the mailer, this knows nothing about berths — it creates a task in a
 * list. The list id and assignee are always read from the environment; neither
 * is ever hardcoded, because they differ per workspace and a wrong literal
 * would file high-value enquiries somewhere nobody looks.
 */

const CLICKUP_API = "https://api.clickup.com/api/v2";

/**
 * Always ClickUp in production.
 *
 * `CLICKUP_API_BASE` exists so the resilience contract can actually be tested:
 * the route promises that a ClickUp failure still captures the enquiry by
 * email, and proving that needs a ClickUp that fails on demand. The override is
 * ignored when NODE_ENV is production, so it cannot redirect real enquiries to
 * a third party even if the variable is set on the server by mistake.
 */
function apiBase(): string {
  if (process.env.NODE_ENV !== "production" && process.env.CLICKUP_API_BASE) {
    return process.env.CLICKUP_API_BASE;
  }
  return CLICKUP_API;
}

/** Bounded so a slow ClickUp cannot hold the request open. */
const CLICKUP_TIMEOUT_MS = 10_000;

export type ClickUpPriority = 1 | 2 | 3 | 4;

export type CreateTaskInput = {
  name: string;
  markdown_description: string;
  tags: string[];
  /** 1 urgent, 2 high, 3 normal, 4 low. */
  priority: ClickUpPriority;
};

export class ClickUpConfigError extends Error {}

/**
 * Carries the status and body through to the caller so a failure can be logged
 * loudly instead of swallowed.
 */
export class ClickUpRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`ClickUp responded ${status}: ${body.slice(0, 500)}`);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ClickUpConfigError(`${name} is not set`);
  return value;
}

export async function createTask(input: CreateTaskInput): Promise<{ id: string; url?: string }> {
  const token = requireEnv("CLICKUP_API_TOKEN");
  const listId = requireEnv("CLICKUP_LIST_ID");
  const assignee = Number(requireEnv("CLICKUP_ASSIGNEE_ID"));
  if (!Number.isFinite(assignee)) {
    throw new ClickUpConfigError("CLICKUP_ASSIGNEE_ID is not a numeric user id");
  }

  const response = await fetch(`${apiBase()}/list/${encodeURIComponent(listId)}/task`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      markdown_description: input.markdown_description,
      // Always Alan: the cohort is capped at five and he reviews every request.
      assignees: [assignee],
      tags: input.tags,
      priority: input.priority,
      // No `status` — the list's default applies until Alan specifies one.
    }),
    signal: AbortSignal.timeout(CLICKUP_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new ClickUpRequestError(response.status, await response.text().catch(() => ""));
  }

  const task = (await response.json().catch(() => ({}))) as { id?: string; url?: string };
  return { id: task.id ?? "(unknown)", url: task.url };
}
