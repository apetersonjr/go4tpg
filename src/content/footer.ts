export type FooterLink = {
  label: string;
  href: string;
};

export type FooterGroup = {
  heading: string;
  links: FooterLink[];
};

/*
 * Home-section links are root-absolute so the footer works identically on the
 * homepage and on the category pages.
 *
 * The category pages are mirrored here from the nav dropdown — the footer is
 * where readers who scrolled the whole page look for them.
 *
 * LinkedIn was `href="#"` — a dead link that shipped on every page. Pulled
 * rather than pointed somewhere invented; restore it with the real profile URL.
 */
export const footerGroups: FooterGroup[] = [
  {
    heading: "Services",
    links: [
      { label: "All services", href: "/services" },
      { label: "Planning Summits", href: "/summits" },
      { label: "AI System Installations", href: "/installations" },
      { label: "Retreats & Leadership Coaching", href: "/retreats-coaching" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#faq" },
      { label: "Results", href: "/#proof" },
      /* Local: every page carries its own booking block. */
      { label: "Contact", href: "#commit" },
    ],
  },
];

export const footerTagline = "Blueprints, not decks. Installed systems, not advice.";

/**
 * The year is resolved when the site is built, not when a visitor loads it —
 * this is a static export, so the footer needs a rebuild each January to roll
 * over. Still beats a hardcoded literal, which needs a code change.
 */
export const footerLegal = `© ${new Date().getFullYear()} The Peterson Group. All rights reserved. · Privacy · Terms`;
