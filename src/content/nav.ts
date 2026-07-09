export type NavLink = {
  label: string;
  href: string;
};

/**
 * Nav links per the v8 reference design:
 *   Services -> #formats, Results -> #proof, About -> #faq,
 *   Contact -> #commit (also the CTA target).
 */
export const navLinks: NavLink[] = [
  { label: "Services", href: "#formats" },
  { label: "Results", href: "#proof" },
  { label: "About", href: "#faq" },
  { label: "Contact", href: "#commit" },
];

export const navCta = {
  label: "Book a Planning Summit",
  href: "#commit",
};
