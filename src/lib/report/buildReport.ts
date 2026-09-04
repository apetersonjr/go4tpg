/**
 * Assembles the personalized installation plan.
 *
 * The document is six generated pages wrapped around pages copied verbatim out
 * of assets that already exist:
 *
 *   1  cover                     generated
 *   2  your situation            generated
 *   3  what we would install     generated
 *   4+ one page per rec          copied from public/assets/workflows
 *   .  closing                   generated
 *
 * The report deliberately does NOT append the full nineteen-installation
 * brochure. It once did, behind a divider page, and that made the document a
 * catalog with a personalized preface rather than a plan for one company. A
 * visitor receives the installations they were recommended and nothing else.
 *
 * Two properties of the source assets shaped this file and are worth stating,
 * because neither is guessable from the filenames:
 *
 * First, the one-pagers carry no text layer at all. Their type was converted to
 * outlines on export — a page decodes to roughly 13,000 curve operators and
 * zero text-showing operators. So `embedPages` is not merely the convenient way
 * to include them, it is the only faithful one: there is nothing to re-flow,
 * and any attempt to re-render would be redrawing a design from scratch.
 *
 * Second, and following from the first, the copied pages cannot be searched,
 * corrected, or spell-checked from here. The audit for British spellings that
 * the brief asks for cannot be performed on these files by any amount of code;
 * it is a re-export from the design source. See `docs/report-builder.md`.
 */

import type { PDFDocument as PDFDocumentType, PDFFont, PDFPage } from "pdf-lib";
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFOperator,
  PDFOperatorNames,
  PDFString,
  popGraphicsState,
  pushGraphicsState,
  rgb,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { loadFont, loadWorkflowPdf } from "./assets";
import { drawLineAt, drawParagraph, fillRect, textWidth } from "./layout";
import type { TextStyle } from "./layout";
import type { Ink } from "./tokens";
import { LEADING, MARGIN, PAGE, TYPE, ink } from "./tokens";
import type { ReportRequest } from "@/lib/validation/report";

/** Content column width, shared by every generated page. */
const COLUMN = PAGE.width - MARGIN.x * 2;

type Fonts = {
  sans: PDFFont;
  sansBold: PDFFont;
  serif: PDFFont;
  serifBold: PDFFont;
  serifItalic: PDFFont;
};

async function embedFonts(doc: PDFDocumentType): Promise<Fonts> {
  doc.registerFontkit(fontkit);

  const [sans, sansBold, serif, serifBold, serifItalic] = await Promise.all([
    loadFont("Figtree-Regular"),
    loadFont("Figtree-SemiBold"),
    loadFont("Newsreader-Regular"),
    loadFont("Newsreader-SemiBold"),
    loadFont("Newsreader-Italic"),
  ]);

  /*
   * `subset: true` embeds only the glyphs actually used. Five full faces would
   * add roughly 400KB to every report; the subsets are a few KB. This matters
   * because the finished file is an email attachment.
   */
  const options = { subset: true } as const;
  return {
    sans: await doc.embedFont(sans, options),
    sansBold: await doc.embedFont(sansBold, options),
    serif: await doc.embedFont(serif, options),
    serifBold: await doc.embedFont(serifBold, options),
    serifItalic: await doc.embedFont(serifItalic, options),
  };
}

/* ------------------------------------------------------------------ chrome */

/**
 * The eyebrow: letterspaced small caps in navy, as the one-pagers set their
 * running head. Upper-cased here rather than trusting the caller to shout.
 */
function eyebrowStyle(fonts: Fonts): TextStyle {
  return {
    font: fonts.sansBold,
    size: TYPE.eyebrow + 1,
    color: ink.navy,
    letterSpacing: 1.5,
    leading: 1.2,
  };
}

/**
 * Footer chrome for the white interior pages, copied from the one-pagers'
 * own footer: a hairline, then "THE PETERSON GROUP · AI INSTALLATION MENU"
 * at the left in letterspaced caps and the page's marker at the right.
 *
 * Matching this exactly matters more than it looks. The footer is the one
 * element a reader sees on every page in the document, so a generated page
 * whose footer sits at a different height or reads differently is the single
 * most visible way these pages could announce themselves as inserted.
 */
function drawInteriorChrome(page: PDFPage, fonts: Fonts, footerRight: string): void {
  const caps: TextStyle = {
    font: fonts.sansBold,
    size: TYPE.eyebrow,
    color: ink.muted,
    letterSpacing: 1.2,
    leading: 1.2,
  };

  fillRect(page, {
    x: MARGIN.x,
    y: MARGIN.bottom + 20,
    width: COLUMN,
    height: 0.8,
    color: ink.rule,
  });

  const left = "THE PETERSON GROUP · AI INSTALLATION MENU";
  let cursor = MARGIN.x;
  for (const char of left) {
    page.drawText(char, {
      x: cursor,
      y: MARGIN.bottom,
      size: caps.size,
      font: fonts.sansBold,
      color: rgb(ink.muted.r, ink.muted.g, ink.muted.b),
    });
    cursor += fonts.sansBold.widthOfTextAtSize(char, caps.size) + (caps.letterSpacing ?? 0);
  }

  const marker = footerRight.toUpperCase();
  const width = textWidth(marker, caps);
  cursor = PAGE.width - MARGIN.x - width;
  for (const char of marker) {
    page.drawText(char, {
      x: cursor,
      y: MARGIN.bottom,
      size: caps.size,
      font: fonts.sansBold,
      color: rgb(ink.muted.r, ink.muted.g, ink.muted.b),
    });
    cursor += fonts.sansBold.widthOfTextAtSize(char, caps.size) + (caps.letterSpacing ?? 0);
  }
}

/**
 * Eyebrow, orange rule, serif heading — the opening the one-pagers use, with
 * the full-width orange rule under the running head that they set above their
 * content frame. Returns the y below the heading.
 */
function drawPageOpening(
  page: PDFPage,
  fonts: Fonts,
  eyebrow: string,
  heading: string,
): number {
  let y = PAGE.height - MARGIN.top;

  y = drawLineAt(page, eyebrow.toUpperCase(), {
    x: MARGIN.x,
    top: y,
    style: eyebrowStyle(fonts),
  });

  // The orange rule the one-pagers run under their head, full column width.
  y -= 12;
  fillRect(page, { x: MARGIN.x, y, width: COLUMN, height: 1.4, color: ink.accent });
  y -= 26;

  y = drawParagraph(page, heading, {
    x: MARGIN.x,
    top: y,
    maxWidth: COLUMN,
    style: {
      font: fonts.serifBold,
      size: TYPE.heading,
      color: ink.navy,
      leading: LEADING.heading,
    },
  });

  return y - 14;
}

/**
 * Fills the whole page with a smooth top-to-bottom gradient.
 *
 * PDF calls this a type 2 (axial) shading. Three objects are needed: a
 * function that maps the 0-1 axis position to a color, a shading dictionary
 * that anchors that function to two points on the page, and a pattern entry in
 * the page's resources so the content stream can name it. `pdf-lib` models all
 * of these but exposes no helper, so they are assembled by hand here.
 *
 * The `sh` operator paints the current clip region, which for a page-filling
 * gradient is the whole page — so no rectangle is needed, and the operator is
 * pushed as raw content because that too has no wrapper.
 */
function drawVerticalShading(page: PDFPage, from: Ink, to: Ink): void {
  const doc = page.doc;
  const context = doc.context;

  // Type 2 exponential interpolation between the two colors, N=1 for linear.
  const fn = context.obj({
    FunctionType: 2,
    Domain: [0, 1],
    C0: [from.r, from.g, from.b],
    C1: [to.r, to.g, to.b],
    N: 1,
  });

  // Axis runs from the top of the page to the bottom.
  const shading = context.obj({
    ShadingType: 2,
    ColorSpace: "DeviceRGB",
    Coords: [0, PAGE.height, 0, 0],
    Function: context.register(fn),
    // Paint the end colors beyond the axis, so rounding at the very edge of
    // the page cannot leave an unpainted hairline.
    Extend: [true, true],
  });

  const patternName = "TpgCoverShading";
  const resources = page.node.normalizedEntries();
  let shadingDict = page.node.Resources()?.lookup(PDFName.of("Shading"));
  if (!(shadingDict instanceof PDFDict)) {
    shadingDict = context.obj({});
    resources.Resources?.set?.(PDFName.of("Shading"), shadingDict);
    page.node.Resources()?.set(PDFName.of("Shading"), shadingDict);
  }
  (shadingDict as PDFDict).set(PDFName.of(patternName), context.register(shading));

  page.pushOperators(
    pushGraphicsState(),
    // `sh` fills the current clip; on an unclipped page that is the full page.
    PDFOperator.of(PDFOperatorNames.ShadingFill, [PDFName.of(patternName)]),
    popGraphicsState(),
  );
}

/* ------------------------------------------------------------- page one */

/**
 * The cover. Mirrors the brochure's: deep blue ground, white serif display
 * type, a letterspaced eyebrow, a thin orange rule top right, and a hairline
 * above the footer.
 *
 * The gradient is a real PDF axial shading, not a stack of banded rectangles.
 * Banding was tried first and rejected on evidence: at 120 bands the seams
 * were plainly visible as horizontal stripes when rendered, because each band
 * is a flat fill and the eye finds the step edges (Mach banding) even when the
 * per-step color delta is a single 8-bit value. A shading is interpolated by
 * the renderer instead, so there are no edges to find at any zoom level.
 *
 * It costs one pattern dictionary and one exponential-interpolation function,
 * written through the low-level API because `pdf-lib` has no shading helper.
 */
function drawCover(page: PDFPage, fonts: Fonts, data: ReportRequest): void {
  drawVerticalShading(page, ink.navy, ink.navyDeep);

  // Thin orange rule, top right.
  fillRect(page, {
    x: PAGE.width - MARGIN.x - 64,
    y: PAGE.height - MARGIN.top + 10,
    width: 64,
    height: 2,
    color: ink.accent,
  });

  let y = PAGE.height - MARGIN.top - 18;

  y = drawLineAt(page, "TPG AI INSTALLATION PLAN", {
    x: MARGIN.x,
    top: y,
    style: {
      font: fonts.sansBold,
      size: TYPE.eyebrow + 0.5,
      color: ink.white,
      letterSpacing: 2.2,
      leading: 1.2,
    },
  });

  // The title sits low on the page, as the brochure sets it.
  y = PAGE.height * 0.52;

  y = drawParagraph(page, "The AI Installations", {
    x: MARGIN.x,
    top: y,
    maxWidth: COLUMN,
    style: {
      font: fonts.serif,
      size: TYPE.coverTitle,
      color: ink.white,
      leading: LEADING.cover,
    },
  });

  y = drawParagraph(page, "Your Company Should Install First", {
    x: MARGIN.x,
    top: y - 2,
    maxWidth: COLUMN,
    style: {
      font: fonts.serifItalic,
      size: TYPE.coverTitle,
      // Lighter than the line above, per the brief. Mixed toward the ground
      // rather than a flat gray so it reads as the same ink at lower strength.
      color: { r: 0.72, g: 0.82, b: 0.89 },
      leading: LEADING.cover,
    },
  });

  drawParagraph(page, coverSubtitle(data), {
    x: MARGIN.x,
    top: y - 24,
    maxWidth: COLUMN,
    style: {
      font: fonts.sans,
      size: TYPE.coverSubtitle,
      color: { r: 0.78, g: 0.86, b: 0.92 },
      leading: 1.4,
    },
  });

  // Hairline above the footer.
  fillRect(page, {
    x: MARGIN.x,
    y: MARGIN.bottom + 20,
    width: COLUMN,
    height: 0.6,
    color: { r: 0.35, g: 0.5, b: 0.62 },
  });

  const count = data.recommendations.length;
  const footerLeft = `${count} recommended installation${count === 1 ? "" : "s"}, with build workflows`;
  const footerStyle: TextStyle = {
    font: fonts.sans,
    size: TYPE.small,
    color: { r: 0.78, g: 0.86, b: 0.92 },
    leading: 1.2,
  };

  page.drawText(footerLeft, {
    x: MARGIN.x,
    y: MARGIN.bottom,
    size: TYPE.small,
    font: fonts.sans,
    color: rgb(0.78, 0.86, 0.92),
  });

  const right = "go4tpg.com";
  page.drawText(right, {
    x: PAGE.width - MARGIN.x - textWidth(right, footerStyle),
    y: MARGIN.bottom,
    size: TYPE.small,
    font: fonts.sans,
    color: rgb(0.78, 0.86, 0.92),
  });
}

/**
 * "Prepared for Sarah at Northwind Logistics", degrading in the order the
 * brief requires: company falls back to the domain, and no slot is ever
 * printed empty or as the word "undefined".
 *
 * Validation has already rejected a literal "undefined"; this handles the
 * ordinary case of a field simply being absent.
 */
function coverSubtitle(data: ReportRequest): string {
  const { firstName, companyName } = data;
  if (firstName && companyName) return `Prepared for ${firstName} at ${companyName}`;
  if (firstName) return `Prepared for ${firstName}`;
  if (companyName) return `Prepared for ${companyName}`;
  return "Prepared from your scorecard session";
}

/* ------------------------------------------------------------- page two */

function drawSituation(page: PDFPage, fonts: Fonts, data: ReportRequest): void {
  let y = drawPageOpening(page, fonts, "Your situation", "What you told us");

  y = drawParagraph(page, data.summary, {
    x: MARGIN.x,
    top: y,
    maxWidth: COLUMN,
    style: {
      font: fonts.sans,
      size: TYPE.body,
      color: ink.body,
      leading: LEADING.body,
    },
  });

  /*
   * The callout. Height is measured from the wrapped text rather than fixed,
   * so the box always fits its contents — a fixed height is how a callout ends
   * up with its last line sitting outside the tint.
   */
  const calloutText = "This plan was built from your answers. It is not a general list.";
  const calloutStyle: TextStyle = {
    font: fonts.serifItalic,
    size: TYPE.subheading,
    color: ink.navy,
    leading: 1.35,
  };
  const padding = 18;
  const innerWidth = COLUMN - padding * 2 - 4;
  const lineCount = Math.max(
    1,
    Math.ceil(textWidth(calloutText, calloutStyle) / innerWidth),
  );
  const boxHeight = lineCount * calloutStyle.size * 1.35 + padding * 2;

  const boxTop = y - 30;
  fillRect(page, {
    x: MARGIN.x,
    y: boxTop - boxHeight,
    width: COLUMN,
    height: boxHeight,
    color: ink.tint,
  });
  // Orange left border.
  fillRect(page, {
    x: MARGIN.x,
    y: boxTop - boxHeight,
    width: 3,
    height: boxHeight,
    color: ink.accent,
  });

  drawParagraph(page, calloutText, {
    x: MARGIN.x + padding,
    top: boxTop - padding + calloutStyle.size * 0.35,
    maxWidth: innerWidth,
    style: calloutStyle,
  });

  drawInteriorChrome(page, fonts, "Your situation");
}

/* ----------------------------------------------------------- page three */

function drawPlan(page: PDFPage, fonts: Fonts, data: ReportRequest): void {
  let y = drawPageOpening(page, fonts, "The plan", "What we would install first");

  y = drawParagraph(
    page,
    "These are the installations that would recover the most time and money at your size, in the order we would put them in.",
    {
      x: MARGIN.x,
      top: y,
      maxWidth: COLUMN,
      style: { font: fonts.sans, size: TYPE.body, color: ink.body, leading: LEADING.body },
    },
  );

  y -= 16;

  /*
   * Each entry is measured before it is drawn so the list never runs into the
   * footer. With five recommendations and long clauses the column can overflow,
   * and the per-entry body is capped rather than allowed to collide. The cap is
   * generous: it only engages on payloads well past the length the analysis
   * step produces.
   */
  const numberStyle: TextStyle = {
    font: fonts.serifBold,
    size: TYPE.subheading,
    color: ink.navy,
    leading: 1.25,
  };
  const sectionStyle: TextStyle = {
    font: fonts.sansBold,
    size: TYPE.eyebrow,
    color: ink.accent,
    letterSpacing: 1.1,
    leading: 1.3,
  };
  const bodyStyle: TextStyle = {
    font: fonts.sans,
    size: TYPE.body,
    color: ink.body,
    leading: LEADING.body,
  };

  const floor = MARGIN.bottom + 56;
  const indent = 26;

  for (const rec of data.recommendations) {
    if (y < floor + 60) break;

    const label = `${String(rec.number).padStart(2, "0")}`;
    page.drawText(label, {
      x: MARGIN.x,
      y: y - numberStyle.size,
      size: numberStyle.size,
      font: fonts.serifBold,
      color: rgb(ink.accent.r, ink.accent.g, ink.accent.b),
    });

    let entryY = drawParagraph(page, rec.name, {
      x: MARGIN.x + indent,
      top: y,
      maxWidth: COLUMN - indent,
      style: numberStyle,
    });

    entryY = drawLineAt(page, rec.section.toUpperCase(), {
      x: MARGIN.x + indent,
      top: entryY - 2,
      style: sectionStyle,
    });

    /*
     * Problem, then installs, then produces — one paragraph, in that order.
     * Joined with sentence spacing rather than bullets because the brief asks
     * for a short paragraph, and because three bullets per entry across five
     * entries turns this page into a wall of fragments.
     */
    const sentence = [rec.problem, rec.installs, rec.produces]
      .map((part) => part.trim())
      .map((part) => (/[.!?]$/.test(part) ? part : `${part}.`))
      .join(" ");

    const available = Math.max(0, entryY - 8 - floor);
    const maxLines = Math.max(1, Math.floor(available / (bodyStyle.size * LEADING.body)));

    entryY = drawParagraph(page, sentence, {
      x: MARGIN.x + indent,
      top: entryY - 8,
      maxWidth: COLUMN - indent,
      style: bodyStyle,
      maxLines: Math.min(maxLines, 6),
    });

    y = entryY - 20;
  }

  // The forward-pointing line, pinned just above the chrome.
  drawParagraph(
    page,
    "A full page for each follows, including the workflow your team would build.",
    {
      x: MARGIN.x,
      top: MARGIN.bottom + 52,
      maxWidth: COLUMN,
      style: {
        font: fonts.serifItalic,
        size: TYPE.body + 0.5,
        color: ink.navy,
        leading: 1.35,
      },
    },
  );

  drawInteriorChrome(page, fonts, "The plan");
}

/**
 * Makes a rectangle of the page clickable, opening `url`.
 *
 * PDF has no "button" — a link is an annotation, a separate object attached to
 * the page that names a rectangle and an action. Nothing about the drawn
 * button below creates the click target; this does, and the two have to be
 * given the same coordinates by hand.
 *
 * `/Border [0 0 0]` suppresses the ugly ring most viewers draw around a link
 * by default, which would sit outside the button's own edge.
 *
 * On opening in a new tab: that is a browser concept and PDF has no equivalent
 * to `target="_blank"`. A URI action opens in whatever the reader is
 * configured to use — and every mainstream viewer (Acrobat, Preview, Chrome's
 * and Firefox's built-in readers) hands an external http link to the default
 * browser in a new tab or window rather than navigating the document away. So
 * the requested behavior is what a reader will actually get; it just is not
 * something the file can command.
 */
function drawLinkArea(
  page: PDFPage,
  url: string,
  rect: { x: number; y: number; width: number; height: number },
): void {
  const context = page.doc.context;

  const annotation = context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url),
    },
  });

  // Append rather than assign: a page may already carry annotations, and
  // overwriting the array would silently drop them.
  const existing = page.node.lookup(PDFName.of("Annots"), PDFArray);
  if (existing) {
    existing.push(context.register(annotation));
  } else {
    page.node.set(PDFName.of("Annots"), context.obj([context.register(annotation)]));
  }
}

/* --------------------------------------------------------- closing page */

function drawClosing(page: PDFPage, fonts: Fonts): void {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE.width,
    height: PAGE.height,
    color: rgb(ink.navy.r, ink.navy.g, ink.navy.b),
  });

  fillRect(page, {
    x: MARGIN.x,
    y: PAGE.height - MARGIN.top + 10,
    width: 64,
    height: 2,
    color: ink.accent,
  });

  let y = PAGE.height * 0.68;

  y = drawParagraph(page, "Your team can build these.", {
    x: MARGIN.x,
    top: y,
    maxWidth: COLUMN,
    style: {
      font: fonts.serif,
      size: TYPE.heading + 4,
      color: ink.white,
      leading: LEADING.cover,
    },
  });

  y = drawParagraph(page, "Or we can install them for you.", {
    x: MARGIN.x,
    top: y - 2,
    maxWidth: COLUMN,
    style: {
      font: fonts.serifItalic,
      size: TYPE.heading + 4,
      color: { r: 0.72, g: 0.82, b: 0.89 },
      leading: LEADING.cover,
    },
  });

  y = drawParagraph(
    page,
    "Every workflow in this plan is documented well enough for a capable AI engineering team to build. If you would rather have them running than schedule them, that is what we do. Standard installations go in within one to ten days.",
    {
      x: MARGIN.x,
      top: y - 26,
      maxWidth: COLUMN - 40,
      style: {
        font: fonts.sans,
        size: TYPE.body + 0.5,
        color: { r: 0.82, g: 0.88, b: 0.93 },
        leading: LEADING.body,
      },
    },
  );

  /*
   * The call to action, drawn as a filled button and made clickable.
   *
   * The button is the one orange element on this page, which is the point: the
   * closing page has exactly one action on it, and against the navy ground the
   * accent reads as the only thing to press. The raw URL is no longer printed
   * beside it — a button whose label says what it does needs no address next to
   * it, and the URL is carried by the link annotation instead.
   *
   * When TPG_CALENDLY_URL is unset the button is not drawn at all. A dead
   * button is worse than no button: it looks pressable, does nothing, and the
   * reader concludes the document is broken. The email address below is always
   * present, so the page never ends without a way to reply.
   */
  const calendly = (process.env.TPG_CALENDLY_URL ?? "").trim();

  y -= 40;

  if (calendly) {
    const label = "Book a 20-minute call";
    const labelStyle = { font: fonts.sansBold, size: TYPE.body + 1 };
    const paddingX = 22;
    const paddingY = 13;
    const labelWidth = textWidth(label, labelStyle);
    const buttonWidth = labelWidth + paddingX * 2;
    const buttonHeight = labelStyle.size + paddingY * 2;
    const buttonY = y - paddingY;

    fillRect(page, {
      x: MARGIN.x,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      color: ink.accent,
    });

    page.drawText(label, {
      x: MARGIN.x + paddingX,
      // Optically centered: the +2 lifts the label off the true midpoint to
      // compensate for the descender space the cap-height text does not use.
      y: buttonY + paddingY + 2,
      size: labelStyle.size,
      font: fonts.sansBold,
      color: rgb(ink.white.r, ink.white.g, ink.white.b),
    });

    // The click target matches the painted rectangle exactly.
    drawLinkArea(page, calendly, {
      x: MARGIN.x,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
    });

    y = buttonY - 26;
  } else {
    y -= 4;
  }

  page.drawText("apeterson@go4tpg.com", {
    x: MARGIN.x,
    y,
    size: TYPE.body + 0.5,
    font: fonts.sans,
    color: rgb(0.82, 0.88, 0.93),
  });

  fillRect(page, {
    x: MARGIN.x,
    y: MARGIN.bottom + 20,
    width: COLUMN,
    height: 0.6,
    color: { r: 0.35, g: 0.5, b: 0.62 },
  });

  const footer = "THE PETERSON GROUP · go4tpg.com";
  let cursor = MARGIN.x;
  for (const char of footer) {
    page.drawText(char, {
      x: cursor,
      y: MARGIN.bottom,
      size: TYPE.small,
      font: fonts.sansBold,
      color: rgb(0.72, 0.82, 0.89),
    });
    cursor += fonts.sansBold.widthOfTextAtSize(char, TYPE.small) + 1.2;
  }
}

/* ------------------------------------------------------------- assembly */

/**
 * Builds the finished PDF and returns its bytes.
 *
 * Throws on any missing asset rather than skipping it. A report that quietly
 * contains four one-pagers when the visitor was told they would receive five
 * is worse than no report: the omission is invisible to us and obvious to them.
 */
export async function buildReport(data: ReportRequest): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonts = await embedFonts(doc);

  doc.setTitle("TPG AI Installation Plan");
  doc.setAuthor("The Peterson Group");
  doc.setSubject("Personalized AI installation plan");
  doc.setProducer("go4tpg.com");
  doc.setCreationDate(new Date());

  const blank = () => doc.addPage([PAGE.width, PAGE.height]);

  drawCover(blank(), fonts, data);
  drawSituation(blank(), fonts, data);
  drawPlan(blank(), fonts, data);

  /*
   * The one-pagers, in catalog order. `recommendations` was already sorted by
   * number during validation.
   *
   * Loaded in parallel and embedded in sequence: the reads are independent, but
   * `embedPage` mutates the document, so ordering the embeds is what guarantees
   * the pages are bound in the order intended rather than in whichever order
   * the filesystem happened to answer.
   */
  const workflowBuffers = await Promise.all(
    data.recommendations.map((rec) => loadWorkflowPdf(rec.number, rec.installationId)),
  );

  for (const buffer of workflowBuffers) {
    const source = await PDFDocument.load(buffer);
    const embedded = await doc.embedPages(source.getPages());
    for (const page of embedded) {
      const target = blank();
      target.drawPage(page, { x: 0, y: 0, width: PAGE.width, height: PAGE.height });
    }
  }

  /*
   * The full nineteen-installation brochure used to be appended here, behind a
   * divider page. Both were removed deliberately: this report is the plan for
   * one company, and binding the entire catalog behind it turned a personal
   * document into a brochure with a personalized preface. What the visitor
   * asked for is what they now receive, and nothing else.
   */
  drawClosing(blank(), fonts);

  return doc.save();
}
