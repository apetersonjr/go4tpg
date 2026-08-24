/**
 * Shared IP rate limiter.
 *
 * Lifted out of the berth route so the scorecard's three routes do not each
 * grow their own copy. Behaviour is unchanged from the original: in-memory and
 * therefore per-container, resetting on deploy and unshared if the app is ever
 * scaled past one instance. That is an accepted trade — it exists to stop a
 * trivial flood, not a determined attacker, and needs no external store to do
 * that job.
 *
 * Each caller passes its own `bucket`, so a burst of scorecard turns cannot
 * consume a visitor's berth submission allowance.
 */

type Limit = { windowMs: number; max: number };

const hits = new Map<string, number[]>();

export function rateLimited(bucket: string, ip: string, limit: Limit): boolean {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < limit.windowMs);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 1000) {
    for (const [entry, times] of hits) {
      if (times.every((at) => now - at >= limit.windowMs)) hits.delete(entry);
    }
  }
  return recent.length > limit.max;
}

/** Traefik sits in front of the container, so the socket address is always the proxy. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
