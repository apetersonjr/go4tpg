export type FooterLink = {
  label: string;
  href: string;
};

export const footerLinks: FooterLink[] = [
  { label: "Services", href: "#formats" },
  { label: "About", href: "#faq" },
  { label: "Results", href: "#proof" },
  { label: "Contact", href: "#commit" },
  { label: "LinkedIn", href: "#" },
];

export const footerTagline = "Blueprints, not decks. Installed systems, not advice.";

/**
 * The year is resolved when the site is built, not when a visitor loads it —
 * this is a static export, so the footer needs a rebuild each January to roll
 * over. Still beats a hardcoded literal, which needs a code change.
 */
export const footerLegal = `© ${new Date().getFullYear()} The Peterson Group. All rights reserved. · Privacy · Terms`;
