/**
 * Boot-time configuration checks.
 *
 * `register` runs once when a server instance starts and must complete before
 * the first request is served, which makes it the right place to refuse to run
 * with a configuration that would break a promise made to a visitor.
 *
 * Only the scorecard's webhook is checked here, and only because it is the one
 * piece of configuration whose absence is invisible from the outside: the
 * widget works, the questions run, the results render, and the emailed report
 * that the panel promises simply never arrives. Everything else on this site
 * fails where you can see it — a missing Resend key produces a visible error on
 * the berth form, a missing Apollo key degrades a feature that never claimed to
 * be there. Those do not belong here.
 *
 * The report builder's assets are audited here for the same reason, and warn
 * rather than refuse. A missing one-pager is invisible until the moment a
 * prospect's report is being assembled — at which point the request fails and
 * a lead sits in an n8n error branch waiting for a human. Checking at boot
 * moves that discovery to the deploy, where it is cheap.
 *
 * It warns instead of throwing because a missing workflow PDF breaks one
 * endpoint, not the site: refusing to boot would take the whole marketing site
 * down over an asset most visitors never reach.
 */

import { assertWebhookConfigured } from "@/lib/scorecardWebhook";

export function register() {
  // Only the Node.js server runtime has the environment; the edge runtime
  // instance is registered separately and has nothing to check.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  assertWebhookConfigured();

  /*
   * Imported dynamically, inside the runtime guard, rather than at the top of
   * the file. This module is compiled for the edge runtime as well as the Node
   * one, and a static import is hoisted above the `NEXT_RUNTIME` check — which
   * pulls `node:fs` into the edge bundle and fails the build outright. The
   * guard only works if the import happens after it.
   *
   * Deliberately not awaited either: `register` blocks the first request, and
   * reading twenty-four files is not worth delaying the homepage for. The
   * result is logged whenever it arrives.
   */
  void import("@/lib/report/assets")
    .then(({ verifyAssets }) => verifyAssets())
    .then((missing) => {
      if (missing.length === 0) return;
      console.error(
        `[report] ${missing.length} report asset(s) are missing. /api/report/build will return 500 for any plan that needs one:\n  ${missing.join("\n  ")}`,
      );
    })
    .catch((error: unknown) => {
      console.error("[report] could not audit report assets at boot:", error);
    });

  if (!process.env.TPG_CALENDLY_URL) {
    console.warn(
      "[report] TPG_CALENDLY_URL is not set — the closing page of every report will omit the booking link.",
    );
  }
}
