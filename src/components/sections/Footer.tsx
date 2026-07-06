import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { footerTagline } from "@/content/footer";
import { withBasePath } from "@/lib/basePath";

export function Footer() {
  return (
    <SectionContainer
      as="div"
      className="bg-tpg-navy"
      innerClassName="flex flex-col items-center gap-4 py-11 text-center sm:flex-row sm:justify-between sm:text-left"
    >
      <Image
        src={withBasePath("/assets/tpg-logo-footer.png")}
        alt="The Peterson Group"
        width={576}
        height={82}
        className="h-[22px] w-auto opacity-90"
      />
      <p className="text-[13.5px] leading-[1.5] text-white/[0.55]">{footerTagline}</p>
    </SectionContainer>
  );
}
