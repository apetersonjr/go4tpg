"use client";

/**
 * Three dots, staggered.
 *
 * Shown only while a request is genuinely in flight. Latency is never
 * invented: these appear because there really is something to wait for, and a
 * slow turn waits exactly as long as it takes.
 *
 * The one adjustment is a FLOOR, not padding. A response that beats
 * `TYPING_FLOOR_MS` still holds the dots for that long — see the widget —
 * because an indicator that appears and vanishes inside two frames reads as a
 * rendering glitch rather than as "the other side is answering". Nothing is
 * ever held longer than the floor, so the dots never overstate how long the
 * work took.
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
