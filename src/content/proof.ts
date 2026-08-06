export type Testimonial = {
  quote: string;
  attribution: string;
};

export type Metric = {
  big: string;
  small: string;
};

export const proofHeadline = "What clients say.";

/**
 * Real client quotes only. Attribution is deliberately sector-level rather
 * than named, at the clients' preference. The section renders this block just
 * when the array is non-empty, so emptying it ships the section on its
 * verifiable credentials rather than on placeholder copy.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Alan walked into a plan we thought was solid and showed us the half we had stopped looking at. We left with a sharper map and the whole team pulling the same direction.",
    attribution: "Principal, wealth-management firm",
  },
  {
    quote:
      "The pre-work alone changed the room. By the time we sat down, our facilitator already knew where we were stuck, and we spent the day fixing it instead of finding it.",
    attribution: "Managing Partner, financial advisory practice",
  },
  {
    quote:
      "He does not hand you a binder and leave. He resets the plan with you, names the owners and the dates, and the momentum is still there weeks later.",
    attribution: "Founder, professional services firm",
  },
];

export const trustLine = {
  lead: "35 years. Startups to Fortune 500.",
  rest: " Waste Management, Xerox Corporate, Southern California Edison, the County of Los Angeles.",
};

export const metrics: Metric[] = [
  { big: "35 Years", small: "of Operator Experience" },
  { big: "Enterprises to $50M+", small: "Founder-Led Businesses" },
  { big: "Our Own Team", small: "TPG AI Engineering, Not Outsourced" },
  { big: "Embedded", small: "AI Fluency, Not Bolted On" },
];
