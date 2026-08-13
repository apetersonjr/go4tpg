import Image from "next/image";
import { clientLogos } from "@/content/logos";
import type { ClientLogo } from "@/content/logos";
import { cn } from "@/lib/cn";
import { withBasePath } from "@/lib/basePath";

/**
 * How many times the logo set is repeated to build one half of the track.
 *
 * The loop works by translating the track -50%, so the second half has to be
 * a pixel-exact copy of the first for the wrap to be invisible. The first
 * half also has to be wider than the widest viewport, or a gap scrolls into
 * frame before the reset. Eight marks plus their gaps run ~1718px per pass at
 * the desktop row height, so three passes (~5154px) clears a 5K display.
 * Revisit this if the logo count or the row height changes.
 */
const HALF_PASSES = 3;

/**
 * Ink aspect ratio that renders at full height — roughly the median of the
 * set, so the majority of marks are left alone and only the outliers move.
 */
const REFERENCE_RATIO = 3.2;

/** Ink height at `REFERENCE_RATIO`, as a fraction of the strip's row height. */
const BASE_HEIGHT = 0.72;

/**
 * How far a mark may be scaled against the reference.
 *
 * The raw rule is constant area, which is what makes a squat mark and a long
 * wordmark read as the same weight. Taken literally it also lets a square
 * seal tower over everything else — equal area is not equal presence once a
 * shape stops being a strip of text — so the range is capped at both ends.
 */
const MIN_SCALE = 0.7;
const MAX_SCALE = 1.28;

const passes = Array.from({ length: HALF_PASSES * 2 }, (_, index) => index);

type MarkGeometry = {
  /** Width of the visible mark, as a multiple of the row height. */
  cellWidth: number;
  /** Rendered size of the whole file, as multiples of the row height. */
  imageWidth: number;
  imageHeight: number;
};

/**
 * Works out how big to draw a file so that its mark — not its canvas — carries
 * the same visual weight as every other mark in the strip.
 *
 * The file is drawn at whatever size puts its ink at the target height, which
 * usually means drawing it larger than the cell; the cell is then sized to the
 * ink alone and clips the rest. So the padding never becomes spacing, and the
 * gaps between marks stay the gaps the layout asked for.
 */
function markGeometry(logo: ClientLogo): MarkGeometry {
  const inkRatio = logo.ink.width / logo.ink.height;
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.sqrt(REFERENCE_RATIO / inkRatio)));
  const inkHeight = BASE_HEIGHT * scale;
  const imageHeight = inkHeight * (logo.height / logo.ink.height);

  return {
    cellWidth: inkHeight * inkRatio,
    imageWidth: imageHeight * (logo.width / logo.height),
    imageHeight,
  };
}

/**
 * Continuously scrolling client logo strip.
 *
 * CSS-only — no timers, no hydration, nothing for the page to boot. Marks are
 * greyscaled so they read as one texture rather than eight competing brand
 * palettes; hovering the strip pauses it and restores full colour.
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
            {clientLogos.map((logo) => {
              const { cellWidth, imageWidth, imageHeight } = markGeometry(logo);

              return (
                <div
                  key={`${pass}-${logo.src}`}
                  className={cn(
                    "marquee-cell flex shrink-0 items-center justify-center overflow-hidden",
                    /* Paints the band colour for the white knockout below. */
                    logo.whitePlate && "marquee-cell--plate",
                  )}
                  style={{ width: `calc(var(--marquee-row) * ${cellWidth.toFixed(4)})` }}
                >
                  <Image
                    src={withBasePath(`/assets/logos/${logo.src}`)}
                    /*
                     * Only the first pass is announced. Every later copy is
                     * decorative, so screen readers hear each company once
                     * instead of six times.
                     */
                    alt={pass === 0 ? logo.alt : ""}
                    aria-hidden={pass === 0 ? undefined : true}
                    width={logo.width}
                    height={logo.height}
                    className={cn(
                      "max-w-none shrink-0 object-contain opacity-60 grayscale",
                      "transition-[filter,opacity] duration-300 ease-out hover:opacity-100 hover:grayscale-0",
                      /*
                       * Knocks the file's white background out against the
                       * plate its cell paints. Applied only where it is
                       * needed: several of the transparent marks are white
                       * lettering reversed out of a coloured block, and
                       * multiplying those would erase the words.
                       */
                      logo.whitePlate && "mix-blend-multiply",
                    )}
                    style={{
                      width: `calc(var(--marquee-row) * ${imageWidth.toFixed(4)})`,
                      height: `calc(var(--marquee-row) * ${imageHeight.toFixed(4)})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
