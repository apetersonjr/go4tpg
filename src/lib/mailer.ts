import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * SMTP transport and a generic send.
 *
 * Deliberately knows nothing about berths — this is the first outbound service
 * in the repo and it will not be the last, so the shape here is "send an
 * email", not "send a berth request".
 *
 * Nothing in this file may be imported from a client component: the credentials
 * come from unprefixed env vars, which exist only on the server.
 */

/** Every outbound call is bounded so a hanging SMTP server cannot hold a request open. */
const SMTP_TIMEOUT_MS = 10_000;

export type MailMessage = {
  subject: string;
  text: string;
  html: string;
  /** Set to the enquirer so a reply goes straight back to them. */
  replyTo?: string;
};

export class MailConfigError extends Error {}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MailConfigError(`${name} is not set`);
  return value;
}

/**
 * Built per call rather than cached at module scope: a cached transport would
 * be created during the build, before Dokploy has injected the environment,
 * and would then hold stale or empty credentials for the life of the process.
 */
function createTransport(): Transporter {
  const port = Number(requireEnv("SMTP_PORT"));
  if (!Number.isFinite(port)) throw new MailConfigError("SMTP_PORT is not a number");

  return nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS. Explicit env wins.
    secure: (process.env.SMTP_SECURE ?? "").toLowerCase() === "true" || port === 465,
    auth: { user: requireEnv("SMTP_USER"), pass: requireEnv("SMTP_PASS") },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
}

/**
 * Sends to `MAIL_TO`. Throws on any failure — the caller decides what a failure
 * means, because for the berth form one failed channel is not a failed
 * submission.
 */
export async function sendNotification(message: MailMessage): Promise<void> {
  const from = requireEnv("MAIL_FROM");
  const to = requireEnv("MAIL_TO");
  const transport = createTransport();

  try {
    await transport.sendMail({
      from,
      to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  } finally {
    // Without this the pooled socket keeps the Node process's event loop busy.
    transport.close();
  }
}
