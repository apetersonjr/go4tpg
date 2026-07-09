import { SectionContainer } from "@/components/ui/SectionContainer";
import { metrics, proofHeadline, testimonials, trustLine } from "@/content/proof";

export function Proof() {
  return (
    <SectionContainer id="proof" className="bg-tpg-tint">
      <h2 className="text-tpg-ink mb-14 font-serif text-[clamp(30px,3.8vw,46px)] leading-[1.12]">
        {proofHeadline}
      </h2>

      <div className="mb-16 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.attribution}
            className="border-tpg-border rounded-md border bg-white p-[34px]"
          >
            <p className="text-tpg-accent mb-5 font-serif text-[19px] italic">
              “{testimonial.quote}”
            </p>
            <p className="text-tpg-muted text-sm tracking-[0.04em]">{testimonial.attribution}</p>
          </div>
        ))}
      </div>

      <p className="text-tpg-muted mx-auto mb-16 max-w-[760px] text-center text-base">
        <b className="text-tpg-ink">{trustLine.lead}</b>
        {trustLine.rest}
      </p>

      <div className="border-tpg-border bg-tpg-border grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[2px] overflow-hidden rounded-lg border">
        {metrics.map((metric) => (
          <div key={metric.small} className="bg-white px-7 py-9 text-center">
            <span className="text-tpg-primary mb-2 block font-serif text-3xl leading-[1.25]">
              {metric.big}
            </span>
            <span className="text-tpg-muted text-[13.5px] tracking-[0.08em] uppercase">
              {metric.small}
            </span>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
