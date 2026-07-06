"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { navCta, navLinks } from "@/content/nav";
import { withBasePath } from "@/lib/basePath";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-tpg-border sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4 sm:px-8 md:px-14">
        <a href="#top" className="flex-none" aria-label="The Peterson Group home">
          <Image
            src={withBasePath("/assets/tpg-logo-header.png")}
            alt="The Peterson Group"
            width={576}
            height={82}
            priority
            className="h-[26px] w-auto"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-tpg-muted hover:text-tpg-navy text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={navCta.href} variant="cta" className="px-5 py-[11px] text-[13.5px]">
            {navCta.label}
          </Button>
        </div>

        <button
          type="button"
          className="text-tpg-navy flex flex-none items-center justify-center rounded p-2 md:hidden"
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
          className="border-tpg-border border-t bg-white px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-tpg-muted hover:bg-tpg-bg-tint hover:text-tpg-navy block rounded px-2 py-3 text-base transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            href={navCta.href}
            variant="cta"
            onClick={() => setMobileOpen(false)}
            className="mt-4 w-full"
          >
            {navCta.label}
          </Button>
        </nav>
      )}
    </header>
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
