export type ProblemItem = {
  /** Bold lead-in phrase. */
  lead: string;
  /** Remainder of the sentence after the lead. */
  rest: string;
};

export const problemHeadline =
  "You don’t have an operating system. You have a collection of habits.";

export const problemItems: ProblemItem[] = [
  {
    lead: "Revenue feels inconsistent, heavy, or leaky",
    rest: "... no system governs how money moves.",
  },
  {
    lead: "Growth is creating drag",
    rest: "... sales, delivery, cash, and accountability are not keeping pace.",
  },
  {
    lead: "You are behind on AI and you know it",
    rest: "... you want real efficiency, not a training deck nobody opens.",
  },
  {
    lead: "The person who would fix all this does not exist on your team",
    rest: "... and the full-time hire is too expensive.",
  },
];
