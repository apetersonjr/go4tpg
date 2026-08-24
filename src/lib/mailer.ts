/**
 * Resend transport and a generic send.
 *
 * Deliberately knows nothing about berths — this is the first outbound service
 * in the repo and it will not be the last, so the shape here is "send an
 * email", not "send a berth request".
 *
 * Plain `fetch` rather than the `resend` SDK. The SDK's client is built once at
 * module scope, which in this deployment means it is constructed during the
 * build, before Dokploy has injected the environment, and then holds an empty
 * API key for the life of the process. Reading the key per call sidesteps that
 * entirely, matches how `clickup.ts` talks to its API, and costs a dependency
 * less in the image.
 *
 * Nothing in this file may be imported from a client component: the credentials
 * come from unprefixed env vars, which exist only on the server.
 */

const RESEND_API = "https://api.resend.com/emails";

/** Every outbound call is bounded so a hanging API cannot hold a request open. */
const MAIL_TIMEOUT_MS = 10_000;

export type MailMessage = {
  subject: string;
  text: string;
  html: string;
  /** Set to the enquirer so a reply goes straight back to them. */
  replyTo?: string;
};

export class MailConfigError extends Error {}

/**
 * Carries the status and Resend's own message through to the caller so a
 * failure can be logged loudly instead of swallowed. Never includes the request
 * headers, and therefore never the API key.
 */
export class MailRequestError extends Error {
  constructor(
    readonly status: number,
    readonly detail: string,
  ) {
    super(`Resend responded ${status}: ${detail.slice(0, 500)}`);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MailConfigError(`${name} is not set`);
  return value;
}

/** Resend's error bodies are JSON; fall back to the raw text if that ever changes. */
function describeFailure(body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string; name?: string };
    if (parsed.message) return parsed.name ? `${parsed.name} — ${parsed.message}` : parsed.message;
  } catch {
    // Not JSON. The raw body is still the most useful thing we have.
  }
  return body;
}

/**
 * Sends to `MAIL_TO`. Throws on any failure — the caller decides what a failure
 * means, because for the berth form one failed channel is not a failed
 * submission.
 *
 * The key is read here rather than at module scope: a value captured at import
 * time is captured at build time, before the environment exists.
 */
export async function sendNotification(message: MailMessage): Promise<void> {
  const apiKey = requireEnv("RESEND_API_KEY");
  const from = requireEnv("MAIL_FROM");
  const to = requireEnv("MAIL_TO");

  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      // snake_case: Resend's field name, not ours. Omitted entirely by
      // JSON.stringify when undefined, which is what Resend wants.
      reply_to: message.replyTo,
    }),
    // Bounds the whole exchange: connect, send and response together.
    signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
  });

  // Read the body on both paths: an undici response left unconsumed keeps its
  // socket checked out of the pool.
  const body = await response.text().catch(() => "");
  if (!response.ok) throw new MailRequestError(response.status, describeFailure(body));
}
