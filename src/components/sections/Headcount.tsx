import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import {
  headcountBody,
  headcountColumns,
  headcountCta,
  headcountHeadline,
  headcountKicker,
  headcountRows,
} from "@/content/headcount";

export function Headcount() {
  return (
    <SectionContainer innerClassName="grid grid-cols-1 items-center gap-[70px] lg:grid-cols-2">
      <div>
        <Kicker>{headcountKicker}</Kicker>
        <h2 className="text-tpg-ink mb-7 font-serif text-[clamp(32px,4.2vw,54px)] leading-[1.12]">
          {headcountHeadline}
        </h2>
        <p className="max-w-[520px] text-lg">{headcountBody}</p>
        <p className="mt-9">
          <Button href={headcountCta.href}>{headcountCta.label}</Button>
        </p>
      </div>

      <div className="border-tpg-border overflow-hidden rounded-lg border shadow-[0_24px_60px_rgba(3,62,99,0.10)]">
        <div className="bg-tpg-primary grid grid-cols-[1.2fr_1fr_1fr] text-[15px] font-bold text-white">
          <div className="px-5 py-[18px]" />
          <div className="px-5 py-[18px]">{headcountColumns.hire}</div>
          <div className="px-5 py-[18px]">{headcountColumns.sprint}</div>
        </div>
        {headcountRows.map((row) => (
          <div
            key={row.label}
            className="border-tpg-border grid grid-cols-[1.2fr_1fr_1fr] border-t text-[15px]"
          >
            <div className="text-tpg-muted px-5 py-4">{row.label}</div>
            <div className="px-5 py-4">{row.hire}</div>
            <div className="text-tpg-ink px-5 py-4 font-bold">{row.sprint}</div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
