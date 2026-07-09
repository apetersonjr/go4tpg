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
 * Placeholder testimonials — real client quotes to be collected following
 * current engagements, per the reference design.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Testimonial placeholder... real client quote to be collected following current engagements.",
    attribution: "CEO, $XXM B2B SERVICES",
  },
  {
    quote:
      "Testimonial placeholder... real client quote to be collected following current engagements.",
    attribution: "FOUNDER, $XXM PROFESSIONAL SERVICES",
  },
  {
    quote:
      "Testimonial placeholder... real client quote to be collected following current engagements.",
    attribution: "COO, $XXM DISTRIBUTION",
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
