import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonSize = "nav" | "default" | "big";

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  size?: ButtonSize;
  className?: string;
};

const sizeClassMap: Record<ButtonSize, string> = {
  nav: "px-[26px] py-3 text-[15px]",
  default: "px-10 py-[18px] text-[17px]",
  big: "px-[52px] py-[21px] text-[19px]",
};

/**
 * Orange call-to-action button. Every CTA links to a booking section or a
 * category page, so this renders a `Link` — the category pages point back at
 * `/#commit` on the homepage, and that is a route change, not an in-page jump.
 */
export function Button({ href, children, size = "default", className, ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "bg-tpg-cta inline-block rounded font-bold text-white",
        /*
         * Focus gets the same treatment as hover so a keyboard reader is
         * shown the same affordance a mouse reader is. The browser's own
         * focus ring is left alone on top of it — nothing here suppresses
         * the outline.
         */
        "hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover",
        "transition-[background-color,transform] duration-200 ease-out",
        "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
        sizeClassMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
