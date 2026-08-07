import Image from "next/image";
import { clientLogos } from "@/content/logos";
import { withBasePath } from "@/lib/basePath";

/**
 * How many times the logo set is repeated to build one half of the track.
 *
 * The loop works by translating the track -50%, so the second half has to be
 * a pixel-exact copy of the first for the wrap to be invisible. The first
 * half also has to be wider than the widest viewport, or a gap scrolls into
 * frame before the reset. Three marks in a 150px cell plus a 64px gap is
 * ~642px per pass, so four passes (~2568px) clears a 2560px ultrawide.
 * Revisit this if the logo count or the cell width changes.
 */
const HALF_PASSES = 4;

const passes = Array.from({ length: HALF_PASSES * 2 }, (_, index) => index);

/**
 * Continuously scrolling client logo strip.
 *
 * CSS-only — no timers, no hydration, nothing for the static export to boot.
 * Marks are greyscaled so they read as one texture rather than four competing
 * brand palettes; hovering the strip pauses it and restores full colour.
 */
export function LogoMarquee() {
  return (
    <div className="marquee-mask overflow-hidden" role="group" aria-label="Organizations served">
      <div className="marquee-track flex w-max items-center">
        {passes.map((pass) => (
          <div
            key={pass}
            className="marquee-pass flex shrink-0 items-center gap-[clamp(40px,6vw,72px)] pr-[clamp(40px,6vw,72px)]"
          >
            {clientLogos.map((logo) => (
              /*
               * Fixed cell + object-contain rather than a shared height.
               * The supplied marks are padded canvases with wildly different
               * amounts of transparent margin, so matching them on height
               * alone would render each one a different visual size. Fitting
               * every mark into an identical box evens them out.
               */
              <div
                key={`${pass}-${logo.src}`}
                className="flex h-14 w-[120px] shrink-0 items-center justify-center md:h-16 md:w-[150px]"
              >
                <Image
                  src={withBasePath(`/assets/logos/${logo.src}`)}
                  /*
                   * Only the first pass is announced. Every later copy is
                   * decorative, so screen readers hear each company once
                   * instead of eight times.
                   */
                  alt={pass === 0 ? logo.alt : ""}
                  aria-hidden={pass === 0 ? undefined : true}
                  width={logo.width}
                  height={logo.height}
                  className="h-full w-full object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
