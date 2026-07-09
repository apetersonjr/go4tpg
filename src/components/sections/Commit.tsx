import { SectionContainer } from "@/components/ui/SectionContainer";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import {
  commitBody,
  commitCta,
  commitHeadline,
  commitKicker,
  commitSecond,
} from "@/content/commit";

export function Commit() {
  return (
    <SectionContainer id="commit" className="bg-commit text-center text-white">
      <Kicker color="sky">{commitKicker}</Kicker>
      <h2 className="mx-auto mb-[34px] max-w-[900px] font-serif text-[clamp(34px,4.6vw,58px)] leading-[1.12]">
        {commitHeadline}
      </h2>
      <p className="mx-auto max-w-[780px] text-[clamp(17px,1.9vw,21px)] text-white/85">
        {commitBody}
      </p>
      <p className="mx-auto mt-[22px] max-w-[780px] font-serif text-[clamp(17px,1.9vw,21px)] text-white italic">
        {commitSecond}
      </p>
      <div className="mt-12">
        <Button href={commitCta.href} size="big">
          {commitCta.label}
        </Button>
      </div>
    </SectionContainer>
  );
}
