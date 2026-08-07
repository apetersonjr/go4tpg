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
 * Real client quotes only. Most attribution is sector-level rather than
 * named, at those clients' preference; the Weaver quote is on the record and
 * is attributed in full, which is why it sits in the centre column where the
 * eye lands first. The section renders this block just when the array is
 * non-empty, so emptying it ships the section on its verifiable credentials
 * rather than on placeholder copy.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Alan walked into a plan we thought was solid and showed us the half we had stopped looking at. We left with a sharper map and the whole team pulling the same direction.",
    attribution: "Principal, wealth-management firm",
  },
  {
    quote:
      "Alan does not hand you a plan... he pulls it out of your own team, then installs the systems to run it. We came in for a mid-year reset and walked out with an aligned team, a clear second-half plan, and AI already moving into our client onboarding. For any founder still carrying the whole operating system in their own head, this is the work.",
    attribution: "Jason Weaver, Managing Partner, Weaver Consulting Group",
  },
  {
    quote:
      "The pre-work alone changed the room. By the time we sat down, our facilitator already knew where we were stuck, and we spent the day fixing it instead of finding it.",
    attribution: "Managing Partner, financial advisory practice",
  },
];

/*
 * The trust line that used to sit here — "35 years. Startups to Fortune
 * 200." plus the written client list — is now the logo shelf under the
 * hero. Both the caption and the client names live in
 * `src/content/logos.ts`; this section keeps the quotes and the metrics.
 */

export const metrics: Metric[] = [
  { big: "35 Years", small: "of Operator Experience" },
  { big: "Enterprises to $50M+", small: "Founder-Led Businesses" },
  { big: "Our Own Team", small: "TPG AI Engineering, Not Outsourced" },
  { big: "Embedded", small: "AI Fluency, Not Bolted On" },
];
