"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { navCta, navLinks } from "@/content/nav";
import { withBasePath } from "@/lib/basePath";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-tpg-deep/[0.94] sticky top-0 z-50 border-b border-white/10 backdrop-blur-lg">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-8 px-[clamp(24px,5vw,64px)]">
        <a href="#top" className="flex-none" aria-label="The Peterson Group home">
          <Image
            src={withBasePath("/assets/tpg-logo-header.png")}
            alt="The Peterson Group"
            width={576}
            height={82}
            priority
            className="h-[34px] w-auto"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] tracking-[0.02em] text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
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
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-2 py-3 text-base text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
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
