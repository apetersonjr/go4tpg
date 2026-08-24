import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonSize = "nav" | "default" | "big";
type ButtonVariant = "primary" | "secondary";

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  /**
   * Set for hrefs that are files rather than routes (the brochure PDFs). Those
   * are served straight off `public/` by the Node server, so they must be a
   * plain `<a>` — `next/link` would try to client-navigate to a non-route and
   * would also prefetch it, which for a 1.8MB PDF is a wasted download.
   */
  external?: boolean;
};

const sizeClassMap: Record<ButtonSize, string> = {
  nav: "px-[26px] py-3 text-[15px]",
  default: "px-10 py-[18px] text-[17px]",
  big: "px-[52px] py-[21px] text-[19px]",
};

/*
 * Two treatments, one button. `primary` is the orange CTA that carries every
 * booking action on the site and stays the loudest thing on any page.
 *
 * `secondary` is the same button hollowed out: the CTA orange as a hairline
 * border and as the label, on nothing, with hover filling in to the solid
 * primary. Same radius, same padding scale, same type, same 200ms transition —
 * the only difference is which side of the fill the orange sits on. It is for
 * actions that sit alongside a primary CTA and must not outrank it, which the
 * /installations brochure links are. Nothing here adds to the palette.
 */
const variantClassMap: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-tpg-cta border border-transparent font-bold text-white",
    "hover:bg-tpg-cta-hover focus-visible:bg-tpg-cta-hover",
  ),
  secondary: cn(
    "border-tpg-cta text-tpg-cta border bg-transparent font-bold",
    "hover:bg-tpg-cta hover:text-white focus-visible:bg-tpg-cta focus-visible:text-white",
  ),
};

/**
 * Site button. Every primary CTA links to a booking section or a category
 * page, so this renders a `Link` by default — the category pages point back at
 * `/#commit` on the homepage, and that is a route change, not an in-page jump.
 * Pass `external` for a static file or off-site URL to get a plain anchor.
 */
export function Button({
  href,
  children,
  size = "default",
  variant = "primary",
  className,
  external = false,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-block rounded",
    /*
     * Focus gets the same treatment as hover so a keyboard reader is
     * shown the same affordance a mouse reader is. The browser's own
     * focus ring is left alone on top of it — nothing here suppresses
     * the outline.
     */
    "transition-[background-color,border-color,color,transform] duration-200 ease-out",
    "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
    variantClassMap[variant],
    sizeClassMap[size],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
