"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { navCta, navLinks } from "@/content/nav";
import type { NavLink } from "@/content/nav";
import { withBasePath } from "@/lib/basePath";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-tpg-deep/[0.94] sticky top-0 z-50 border-b border-white/10 backdrop-blur-lg">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-8 px-[clamp(24px,5vw,64px)]">
        {/* Root-absolute so the logo returns home from the category pages too. */}
        <Link href="/#top" className="flex-none" aria-label="The Peterson Group home">
          <Image
            src={withBasePath("/assets/tpg-logo-white.svg")}
            alt="The Peterson Group"
            width={210}
            height={30}
            priority
            className="h-[33.6px] w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) =>
            link.children ? (
              <DesktopDropdown key={link.href} link={link} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] tracking-[0.02em] text-white/85 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
          <Button href={navCta.href} size="nav">
            {navCta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="flex flex-none items-center justify-center rounded p-2 text-white md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="bg-tpg-deep border-t border-white/10 px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-2 py-3 text-base text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
                {/*
                  No hover on touch, so the children are always visible here
                  rather than hidden behind a disclosure the thumb has to find.
                */}
                {link.children && (
                  <ul className="mb-1 ml-3 flex flex-col gap-1 border-l border-white/15 pl-3">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded px-2 py-2.5 text-[15px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Button
            href={navCta.href}
            size="nav"
            onClick={() => setMobileOpen(false)}
            className="mt-4 w-full text-center"
          >
            {navCta.label}
          </Button>
        </nav>
      )}
    </header>
  );
}

/**
 * Parent nav item with its category dropdown.
 *
 * The panel opens on pointer hover and on keyboard focus via CSS alone, so it
 * works with JavaScript still loading. The caret button adds an explicit
 * toggle for touch and for keyboard users who would rather not tab through
 * the panel to dismiss it — tapping the label itself goes to the hub page.
 */
function DesktopDropdown({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative" onMouseLeave={() => setOpen(false)}>
      <span className="flex items-center gap-1.5">
        <Link
          href={link.href}
          className="text-[15px] tracking-[0.02em] text-white/85 transition-colors hover:text-white"
        >
          {link.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${link.label} menu`}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="flex items-center rounded p-0.5 text-white/70 transition-colors hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2.5 4.5L6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </span>

      <ul
        className={[
          "border-tpg-border absolute top-full left-0 z-50 min-w-[260px] rounded-md border bg-white py-2 shadow-[0_18px_44px_rgba(3,42,69,0.22)]",
          /*
           * `visibility` is in the transition list on purpose: it is what
           * takes the panel out of the tab order when closed, and without it
           * the panel would blink out at the start of the close instead of
           * holding while it fades.
           */
          "origin-top transition-[opacity,transform,visibility] duration-200 ease-out",
          "group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100",
          /*
           * Open and closed are written as two complete states rather than as
           * a set of overrides, so which one wins never depends on the order
           * Tailwind happens to emit conflicting utilities in.
           */
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        {link.children?.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={() => setOpen(false)}
              className="text-tpg-body hover:bg-tpg-tint hover:text-tpg-ink block px-5 py-3 text-[15px] transition-colors"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
