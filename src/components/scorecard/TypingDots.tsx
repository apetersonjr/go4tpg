"use client";

/**
 * Three dots, staggered.
 *
 * Shown only while a request is genuinely in flight — the spec is explicit
 * that latency is not to be faked, so this appears when there is really
 * something to wait for and vanishes the moment there is not. If a turn
 * returns quickly, the dots flash briefly and that is the honest signal.
 *
 * `aria-hidden` because the dots are decoration: the thing a screen reader
 * needs is the status text next to them, not a description of an animation.
 */
export function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="bg-tpg-muted sc-dot h-1.5 w-1.5 rounded-full"
          // Staggered by a fifth of the cycle so the three read as a wave
          // rather than as one blinking block.
          style={{ animationDelay: `${index * 0.16}s` }}
        />
      ))}
    </span>
  );
}
