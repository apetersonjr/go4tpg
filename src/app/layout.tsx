import type { Metadata } from "next";
import { figtree, newsreader } from "./fonts";
import "./globals.css";

const siteUrl = "https://www.thepetersongroup.com";
const title = "The Peterson Group | Blueprints, not decks. Installed systems, not advice.";
const description =
  "We facilitate the plan your business runs on... then our own engineering team installs the AI systems that execute it.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="text-tpg-body flex min-h-full flex-col bg-white font-sans">{children}</body>
    </html>
  );
}
