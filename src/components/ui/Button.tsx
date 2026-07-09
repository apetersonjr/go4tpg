import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonSize = "nav" | "default" | "big";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
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
 * Orange call-to-action button. Every CTA in this design links to a
 * booking flow or an on-page anchor, so this always renders an `<a>`.
 */
export function Button({ children, size = "default", className, ...rest }: ButtonProps) {
  return (
    <a
      className={cn(
        "bg-tpg-cta hover:bg-tpg-cta-hover inline-block rounded font-bold text-white",
        "transition-[background-color,transform] duration-200 hover:-translate-y-0.5",
        sizeClassMap[size],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
