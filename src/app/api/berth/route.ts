import { NextResponse } from "next/server";
import { buildBerthEmail, buildBerthTask } from "@/lib/berthNotification";
import { HONEYPOT_FIELD } from "@/lib/berth";
import type { BerthResponse } from "@/lib/berth";
import { createTask } from "@/lib/clickup";
import { sendNotification } from "@/lib/mailer";
import { validateBerth } from "@/lib/validation/berth";

// nodemailer needs Node APIs, so this cannot run on the edge runtime.
export const runtime = "nodejs";

/**
 * Berth reservation intake.
 *
 * The design point is the resilience contract: the email and the ClickUp task
 * are attempted independently and must not share a failure. If either lands the
 * submission is captured, so the visitor is told it worked and the other
 * failure is logged loudly for us to chase. Only if both fail does the visitor
 * see an error — because a berth enquiry is worth $7,250 to $14,500 and must
 * never be silently dropped.
 *
 * Kept thin on purpose: rate limit, honeypot, validate, then hand off.
 */

/** A handful per minute is generous when there are five berths in total. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };

/**
 * In-memory and therefore per-container: it resets on deploy and is not shared
 * if the app is ever scaled to more than one instance. That is an accepted
 * trade for this volume — it exists to stop a trivial flood, not a determined
 * attacker, and needs no external store to do that job.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

/** Traefik sits in front of the container, so the socket address is always the proxy. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function json(body: BerthResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return json(
      {
        ok: false,
        delivered: { email: false, clickup: false },
        message: "Too many requests. Please wait a moment and try again.",
      },
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      {
        ok: false,
        delivered: { email: false, clickup: false },
        message: "That request could not be read.",
      },
      400,
    );
  }

  /*
   * Honeypot. A filled hidden field means an automated submitter, so we answer
   * exactly as we would on success and do nothing at all — telling a bot it was
   * detected only teaches it to avoid detection.
   *
   * This is the one place a success shape is returned without a delivery. It is
   * deliberate and it is not a hole in the "never fake success" rule: that rule
   * protects a person from a false confirmation, and there is no person here.
   */
  const honeypot = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json(
      {
        ok: true,
        delivered: { email: false, clickup: false },
        message: "Request received.",
      },
      200,
    );
  }

  const result = validateBerth(body);
  if (!result.ok) {
    return json(
      {
        ok: false,
        delivered: { email: false, clickup: false },
        message: "Some answers need attention.",
        errors: result.errors,
      },
      400,
    );
  }

  const data = result.data;
  const label = `${data.firstName} ${data.lastName} <${data.email}>`;

  // allSettled, not all: one rejection must not cancel the other channel.
  const [emailOutcome, clickupOutcome] = await Promise.allSettled([
    sendNotification(buildBerthEmail(data)),
    createTask(buildBerthTask(data)),
  ]);

  const email = emailOutcome.status === "fulfilled";
  const clickup = clickupOutcome.status === "fulfilled";

  // Loud, and without echoing the payload — the record itself is in the channels
  // that succeeded, and a log is the wrong place for an enquirer's details.
  if (!email) {
    console.error(`[berth] SMTP delivery FAILED for ${label}:`, emailOutcome.reason);
  }
  if (!clickup) {
    console.error(`[berth] ClickUp task creation FAILED for ${label}:`, clickupOutcome.reason);
  }
  if (!email && !clickup) {
    console.error(`[berth] BOTH CHANNELS FAILED — enquiry not captured: ${label}`);
  }

  if (!email && !clickup) {
    return json(
      {
        ok: false,
        delivered: { email, clickup },
        message: "We could not record your request.",
      },
      502,
    );
  }

  return json({ ok: true, delivered: { email, clickup }, message: "Request received." }, 200);
}
