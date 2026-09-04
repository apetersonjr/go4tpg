/**
 * Typesetting primitives for the generated pages.
 *
 * `pdf-lib` draws text; it does not lay it out. There is no line breaking, no
 * measured column, and `drawText` will happily run a paragraph straight off the
 * right edge of the page and out of the document. Everything that makes a
 * paragraph fit inside a margin is here.
 *
 * The measurement is real, not estimated: `widthOfTextAtSize` asks the embedded
 * font for the advance widths of the actual glyphs. Estimating from a character
 * count would drift badly on the copy these pages carry, where an installation
 * name like "AI Financial Close and Bookkeeping Assistant" is nearly twice the
 * width its character count suggests in a serif face.
 */

import type { PDFFont, PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";
import type { Ink } from "./tokens";

export type TextStyle = {
  font: PDFFont;
  size: number;
  color: Ink;
  /** Multiplier on `size`. Falls back to a sensible 1.4 when unset. */
  leading?: number;
  /** Extra space between glyphs, in points. Used for small-caps eyebrows. */
  letterSpacing?: number;
};

/**
 * Breaks `text` into lines that each fit within `maxWidth`.
 *
 * Greedy first-fit, which is what every word processor does and is right here:
 * the alternative (Knuth-Plass total-fit) buys even color in justified text,
 * and every column in this document is ragged-right.
 *
 * A single word longer than the column is broken mid-word rather than allowed
 * to overhang. That case is not hypothetical — a URL in the summary would do
 * it, and an overhanging line runs into the page edge.
 */
export function wrapText(
  text: string,
  { font, size, letterSpacing = 0 }: Pick<TextStyle, "font" | "size" | "letterSpacing">,
  maxWidth: number,
): string[] {
  const measure = (value: string) =>
    font.widthOfTextAtSize(value, size) + letterSpacing * Math.max(0, value.length - 1);

  const lines: string[] = [];
  let current = "";

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;

    if (measure(candidate) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = "";
    }

    if (measure(word) <= maxWidth) {
      current = word;
      continue;
    }

    // Word alone overflows: break it at the last character that still fits.
    let chunk = "";
    for (const char of word) {
      if (measure(chunk + char) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk += char;
      }
    }
    current = chunk;
  }

  if (current) lines.push(current);
  return lines;
}

/** Height a wrapped block will occupy, without drawing it. */
export function measureBlock(lineCount: number, style: TextStyle): number {
  return lineCount * style.size * (style.leading ?? 1.4);
}

/**
 * Draws one line, honoring letter spacing.
 *
 * `pdf-lib` has no letter-spacing option, so a spaced line is drawn one glyph
 * at a time. Only eyebrows use it, and they are a handful of characters, so the
 * cost is irrelevant — but it is why this is not simply `page.drawText`.
 */
function drawLine(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  style: TextStyle,
): void {
  const color = rgb(style.color.r, style.color.g, style.color.b);

  if (!style.letterSpacing) {
    page.drawText(text, { x, y, size: style.size, font: style.font, color });
    return;
  }

  let cursor = x;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size: style.size, font: style.font, color });
    cursor += style.font.widthOfTextAtSize(char, style.size) + style.letterSpacing;
  }
}

/**
 * Draws a wrapped paragraph starting with its first baseline below `top`.
 *
 * Returns the y coordinate below the block, so callers stack content by
 * threading one number down the page rather than tracking absolute positions.
 * PDF's origin is bottom-left, so "down the page" means decreasing y — the
 * single most common source of upside-down layouts in this API.
 */
export function drawParagraph(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    top: number;
    maxWidth: number;
    style: TextStyle;
    /** Optional cap; lines beyond it are dropped and the last one ellipsized. */
    maxLines?: number;
  },
): number {
  const { x, top, maxWidth, style, maxLines } = options;
  const lineHeight = style.size * (style.leading ?? 1.4);

  let lines = wrapText(text, style, maxWidth);
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = `${last.replace(/[\s.,;:]+$/, "")}…`;
  }

  let y = top;
  for (const line of lines) {
    y -= lineHeight;
    drawLine(page, line, x, y + style.size * 0.25, style);
  }
  return y;
}

/** Draws a single unwrapped line. Returns the y below it. */
export function drawLineAt(
  page: PDFPage,
  text: string,
  options: { x: number; top: number; style: TextStyle },
): number {
  const { x, top, style } = options;
  const lineHeight = style.size * (style.leading ?? 1.4);
  const y = top - lineHeight;
  drawLine(page, text, x, y + style.size * 0.25, style);
  return y;
}

/** A filled rectangle — rules, callout grounds, and the cover's bands. */
export function fillRect(
  page: PDFPage,
  options: { x: number; y: number; width: number; height: number; color: Ink },
): void {
  const { x, y, width, height, color } = options;
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(color.r, color.g, color.b),
  });
}

/**
 * Width of a string as it will actually be drawn, letter spacing included.
 * Used for right-aligning footers, where being a few points out is visible
 * against the margin the static pages already establish.
 */
export function textWidth(text: string, style: Pick<TextStyle, "font" | "size" | "letterSpacing">): number {
  return (
    style.font.widthOfTextAtSize(text, style.size) +
    (style.letterSpacing ?? 0) * Math.max(0, text.length - 1)
  );
}
