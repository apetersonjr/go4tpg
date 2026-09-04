/**
 * POST /api/report/build — assembles the personalized installation plan PDF.
 *
 * This lives in the Next app rather than in n8n because n8n cannot merge PDFs.
 * There is no native node for it, and the Code node cannot import `pdf-lib`
 * unless `NODE_FUNCTION_ALLOW_EXTERNAL` is set on the instance. Loosening the
 * n8n instance or paying a third-party PDF service are both worse trades than
 * running the assembly here, where the nineteen one-pagers, the brochure, the
 * fonts and the brand tokens already live. n8n stays the orchestrator and
 * calls one endpoint.
 *
 * The response is a PDF, not JSON. n8n takes the binary straight to its email
 * node, so there is no base64 round-trip and no temporary storage anywhere.
 *
 * UNAUTHENTICATED, by decision. Anyone who knows the path can post a payload
 * and get back an assembled PDF, so the only limits on abuse are the body-size
 * cap and the validation below — both of which run before any file is read.
 * Note what an anonymous caller can and cannot do: they choose the cover name,
 * the summary text and which one-pagers are bound in, but every installation
 * name, number and section is read from the catalog, so the output is always a
 * real TPG document rather than arbitrary attacker-authored pages. If this
 * needs locking down later, a shared header checked here is the whole change.
 */

import { MissingAssetError } from "@/lib/report/assets";
import { buildReport } from "@/lib/report/buildReport";
import { validateReportRequest } from "@/lib/validation/report";

/*
 * `pdf-lib` and the font embedding need Node APIs, and the filesystem reads
 * that fetch the static assets are not available on the edge runtime at all.
 */
export const runtime = "nodejs";

/*
 * Never cached. Every response is a different document built for a named
 * person, and a cached one would be the previous prospect's plan.
 */
export const dynamic = "force-dynamic";

/** Roughly a nineteen-installation report; well past what n8n ever sends. */
const MAX_BODY_BYTES = 256 * 1024;

function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ error, ...extra }, { status });
}

export async function POST(request: Request): Promise<Response> {
  /*
   * Body size is checked before parsing. `request.json()` on an unbounded body
   * buffers the whole thing into memory first, and this endpoint is
   * unauthenticated, so that check is the only thing standing between an
   * anonymous caller and the server's memory.
   */
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return jsonError("Request body is too large.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Body must be valid JSON.", 400);
  }

  const validated = validateReportRequest(body);
  if (!validated.ok) {
    return jsonError("The request payload is not valid.", 400, {
      fields: validated.errors,
    });
  }

  const started = Date.now();

  try {
    const pdf = await buildReport(validated.data);
    const elapsed = Date.now() - started;

    /*
     * The budget is 15 seconds against n8n's 60. Logged rather than enforced:
     * a slow report still reaches the prospect, and failing a finished document
     * because it took too long would trade a working outcome for a clean
     * metric. If this line starts appearing, the assets have grown.
     */
    if (elapsed > 15_000) {
      console.warn(
        `[report] build for session ${validated.data.sessionId} took ${elapsed}ms, over the 15s budget.`,
      );
    }

    return new Response(pdf as BodyInit, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-length": String(pdf.byteLength),
        "content-disposition": 'attachment; filename="TPG-AI-Installation-Plan.pdf"',
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    /*
     * Never a partial or placeholder PDF. A 500 naming what failed routes to a
     * human in n8n; a document with a missing one-pager silently reaches a
     * prospect who was told how many pages to expect.
     */
    if (error instanceof MissingAssetError) {
      console.error(
        `[report] missing asset for session ${validated.data.sessionId}: ${error.assetPath}`,
      );
      return jsonError("A required asset is missing.", 500, {
        missing_asset: error.assetPath,
      });
    }

    console.error(
      `[report] assembly failed for session ${validated.data.sessionId}:`,
      error,
    );
    return jsonError("Report assembly failed.", 500, {
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

