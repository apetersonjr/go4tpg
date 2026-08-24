import type { Metadata, Viewport } from "next";
import { figtree, newsreader } from "./fonts";
import { ScorecardWidget } from "@/components/scorecard/ScorecardWidget";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const title = "The Peterson Group | Blueprints, not decks. Installed systems, not advice.";
const description =
  "We facilitate the plan your business runs on... then our own engineering team installs the AI systems that execute it.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "The Peterson Group",
    type: "website",
    images: [
      {
        url: "/assets/tpg-logo-header.png",
        width: 576,
        height: 82,
        alt: "The Peterson Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

/**
 * `interactiveWidget` is here for the scorecard widget's bottom sheet. The
 * sheet is a fixed height in `dvh`, and by default the on-screen keyboard
 * overlays the viewport without resizing it — which leaves the composer, the
 * one thing you need while typing, hidden behind the keyboard.
 * `resizes-content` shrinks the viewport instead, so the sheet re-lays out
 * above it. The rest of the values are the framework defaults, stated
 * explicitly because declaring this export replaces them.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="text-tpg-body flex min-h-full flex-col bg-white font-sans">
        {children}
        <SectionReveal />
        {/*
         * Fixed-position, so it sits outside the page flow and cannot overlap
         * the footer or any in-page CTA. Mounted here rather than per page so
         * it is present on every route, including ones added later.
         */}
        <ScorecardWidget />
      </body>
    </html>
  );
}
