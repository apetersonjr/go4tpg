/**
 * Static asset access for the report builder: the nineteen one-pagers, the
 * complete brochure, and the five font faces the generated pages are set in.
 *
 * Read from the filesystem, never over HTTP. These files ship inside the
 * deployed image; fetching them back from our own domain would add a network
 * hop, a TLS handshake and a whole class of failure (DNS, cold start, an
 * upstream proxy) to a request that is already reading local disk.
 *
 * Everything is cached in module scope. The files never change between
 * requests — they change when someone deploys — so re-reading roughly 4MB
 * across twenty-four files on every call is pure waste. The cache holds
 * promises rather than buffers so that concurrent requests arriving during a
 * cold start share one read instead of each starting their own.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { installations } from "@/data/installation-menu";

/**
 * Raised when an asset that must exist does not. Carried as its own type so
 * the route can answer 500 naming the file, rather than letting a bare ENOENT
 * surface as an unhelpful "assembly failed".
 */
export class MissingAssetError extends Error {
  constructor(readonly assetPath: string) {
    super(`Required asset is missing: ${assetPath}`);
    this.name = "MissingAssetError";
  }
}

/*
 * `process.cwd()` is the application root in both `next dev` and the standalone
 * production server, which is where `public/` sits in each.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public");
const WORKFLOW_DIR = path.join(PUBLIC_DIR, "assets", "workflows");

/*
 * The brochure under `public/assets/brochures/` is deliberately NOT read here.
 * The report used to append it in full; it no longer does, so the file stays
 * on disk as a download for the marketing site and this module ignores it.
 */

/** Fonts live in the source tree, not `public/` — they are not web assets. */
const FONT_DIR = path.join(process.cwd(), "src", "lib", "report", "fonts");

const cache = new Map<string, Promise<Buffer>>();

function load(filePath: string): Promise<Buffer> {
  const hit = cache.get(filePath);
  if (hit) return hit;

  const pending = readFile(filePath).catch((error: NodeJS.ErrnoException) => {
    // A failed read must not poison the cache: a file restored by a later
    // deploy should be readable without restarting the process.
    cache.delete(filePath);
    if (error.code === "ENOENT") throw new MissingAssetError(filePath);
    throw error;
  });

  cache.set(filePath, pending);
  return pending;
}

/**
 * The on-disk name for an installation's one-pager: `NN-{installation_id}.pdf`.
 *
 * This pattern is a contract, not a convenience. n8n builds the same string
 * from the same catalog to resolve download URLs, so the two must agree
 * exactly — including the zero padding, which is what keeps 02 and 20 sorting
 * correctly in a directory listing.
 */
export function workflowFilename(number: number, installationId: string): string {
  return `${String(number).padStart(2, "0")}-${installationId}.pdf`;
}

/** The one-pager for a catalog entry. Throws `MissingAssetError` if absent. */
export function loadWorkflowPdf(number: number, installationId: string): Promise<Buffer> {
  return load(path.join(WORKFLOW_DIR, workflowFilename(number, installationId)));
}

export type FontFace =
  | "Figtree-Regular"
  | "Figtree-SemiBold"
  | "Newsreader-Regular"
  | "Newsreader-SemiBold"
  | "Newsreader-Italic";

export function loadFont(face: FontFace): Promise<Buffer> {
  return load(path.join(FONT_DIR, `${face}.ttf`));
}

/**
 * Reads every asset the builder can ever need, so a broken deploy is found by
 * whoever runs this rather than by a prospect receiving a 500. Not called on
 * the request path — it exists for the boot check and for tests.
 *
 * Returns the paths that are missing rather than throwing on the first one:
 * being told all four absent files at once is worth more than being told the
 * first one four times.
 */
export async function verifyAssets(): Promise<string[]> {
  const missing: string[] = [];

  const checks: Promise<unknown>[] = [
    ...installations.map((entry) => loadWorkflowPdf(entry.number, entry.id)),
    ...(
      [
        "Figtree-Regular",
        "Figtree-SemiBold",
        "Newsreader-Regular",
        "Newsreader-SemiBold",
        "Newsreader-Italic",
      ] as FontFace[]
    ).map((face) => loadFont(face)),
  ];

  const settled = await Promise.allSettled(checks);
  for (const result of settled) {
    if (result.status === "rejected") {
      const reason: unknown = result.reason;
      missing.push(
        reason instanceof MissingAssetError ? reason.assetPath : String(reason),
      );
    }
  }

  return missing;
}
