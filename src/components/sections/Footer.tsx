import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { footerLegal, footerLinks, footerTagline } from "@/content/footer";
import { withBasePath } from "@/lib/basePath";

export function Footer() {
  return (
    <SectionContainer
      as="footer"
      paddedY={false}
      className="bg-tpg-deep pt-[70px] pb-[46px] text-white/70"
    >
      <div className="mb-[52px] flex flex-wrap items-start justify-between gap-10">
        <Image
          src={withBasePath("/assets/tpg-logo-footer.png")}
          alt="The Peterson Group"
          width={576}
          height={82}
          className="h-8 w-auto"
        />
        <ul className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[15px] text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="border-t border-white/[0.12] pt-9 font-serif text-[19px] text-white italic">
        {footerTagline}
      </p>
      <p className="mt-[18px] text-[13px] text-white/40">{footerLegal}</p>
    </SectionContainer>
  );
}
