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
        "bg-tpg-cta hover:bg-tpg-cta-hover inline-block rounded font-bold text-white",
        "transition-[background-color,transform] duration-200 hover:-translate-y-0.5",
        sizeClassMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
