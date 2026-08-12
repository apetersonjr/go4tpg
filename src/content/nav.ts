export type NavLink = {
  label: string;
  href: string;
  /**
   * Present only on parent items. The nav renders these as a dropdown, which
   * is the three-second answer to "what does TPG offer" — without it the
   * category pages are reachable only through the homepage cards.
   */
  children?: NavLink[];
};

/**
 * Services is a parent pointing at the `/services` hub; Results, About, and
 * Contact stay on their homepage anchors because those pages do not exist.
 */
export const navLinks: NavLink[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Planning Summits", href: "/summits" },
      { label: "AI System Installations", href: "/installations" },
      { label: "Retreats & Leadership Coaching", href: "/retreats-coaching" },
    ],
  },
  { label: "Results", href: "/#proof" },
  { label: "About", href: "/#faq" },
  /* Local: every page carries its own booking block. */
  { label: "Contact", href: "#commit" },
];

/*
 * Every page now carries its own booking block, so the nav CTA targets the
 * local `#commit` rather than sending a reader back to the homepage.
 */
export const navCta = {
  label: "Book a Planning Summit",
  href: "#commit",
};
