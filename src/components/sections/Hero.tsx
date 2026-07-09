import { Button } from "@/components/ui/Button";
import { heroCta, heroHeadline, heroSupportingCopy } from "@/content/hero";

export function Hero() {
  return (
    <header className="bg-hero flex min-h-[92vh] items-center py-16 text-white">
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,5vw,64px)]">
        <div className="bg-tpg-cta mb-[42px] h-[5px] w-24" />
        <h1 className="max-w-[1050px] font-serif text-[clamp(46px,7.2vw,96px)] leading-[1.12] font-normal tracking-[-0.01em]">
          {heroHeadline.lead}
          <br />
          <span className="text-tpg-sky italic">{heroHeadline.emphasis}</span> {heroHeadline.tail}
        </h1>
        <p className="mt-[34px] mb-[46px] max-w-[680px] font-sans text-[clamp(18px,2vw,23px)] leading-[1.65] text-white/[0.82]">
          {heroSupportingCopy}
        </p>
        <Button href={heroCta.href} size="big">
          {heroCta.label}
        </Button>
      </div>
    </header>
  );
}
