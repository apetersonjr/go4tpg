"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sections opt in by carrying this attribute; `SectionContainer` sets it. */
const TARGET_SELECTOR = "[data-reveal]";

/** Hides a section. Only ever applied to sections still below the fold. */
const PENDING_CLASS = "reveal-pending";

/** Plays the fade-and-rise. Added once, never removed. */
const REVEALED_CLASS = "is-revealed";

/**
 * Fades each section up as it scrolls into view.
 *
 * Deliberately additive rather than a hidden-by-default stylesheet. The server
 * sends every section visible and this hides them afterwards, which costs a
 * little precision but buys three things worth more: content that is already
 * on screen is never hidden and so never animates, a reader with JavaScript
 * off or broken sees the finished page rather than an empty one, and a
 * client-side navigation paints the incoming page complete instead of blank
 * while this effect waits its turn behind the commit.
 *
 * Nothing here runs for a reader who has asked for reduced motion. The guard
 * in `globals.css` covers the other direction — the setting being turned on
 * with the page already open and sections already hidden.
 */
export function SectionReveal() {
  // Layouts survive navigation, so this effect needs a reason to run again
  // and pick up the incoming page's sections.
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(REVEALED_CLASS);
          // Once only: scrolling back up leaves it alone.
          observer.unobserve(entry.target);
        }
      },
      // Waits until the section is a little way in rather than firing on its
      // first pixel, so the movement reads as deliberate.
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const section of document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)) {
      // Anything on screen — or scrolled past, after a deep link — is left
      // alone. Never hidden, so never animated.
      if (section.getBoundingClientRect().top < window.innerHeight) continue;
      section.classList.add(PENDING_CLASS);
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
