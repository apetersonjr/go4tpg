import Image from "next/image";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { footerGroups, footerLegal, footerTagline } from "@/content/footer";
import { withBasePath } from "@/lib/basePath";

export function Footer() {
  return (
    <SectionContainer
      as="footer"
      paddedY={false}
      className="bg-tpg-deep pt-[70px] pb-[46px] text-white/70"
    >
      <div className="mb-[52px] flex flex-wrap items-start justify-between gap-x-16 gap-y-12">
        <Image
          src={withBasePath("/assets/tpg-logo-white.svg")}
          alt="The Peterson Group"
          width={210}
          height={30}
          className="h-7 w-auto"
        />
        <div className="flex flex-wrap gap-x-16 gap-y-10">
          {footerGroups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="mb-4 text-[12.5px] font-bold tracking-[0.18em] text-white/45 uppercase">
                {group.heading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <p className="border-t border-white/[0.12] pt-9 font-serif text-[19px] text-white italic">
        {footerTagline}
      </p>
      <p className="mt-[18px] text-[13px] text-white/40">{footerLegal}</p>
    </SectionContainer>
  );
}
