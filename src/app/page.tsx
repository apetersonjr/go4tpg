import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { OpeningQuestion } from "@/components/sections/OpeningQuestion";
import { Problem } from "@/components/sections/Problem";
import { Formats } from "@/components/sections/Formats";
import { Ste } from "@/components/sections/Ste";
import { Headcount } from "@/components/sections/Headcount";
import { Proof } from "@/components/sections/Proof";
import { Commit } from "@/components/sections/Commit";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <OpeningQuestion />
        <Problem />
        <Formats />
        <Ste />
        <Headcount />
        <Proof />
        <Commit />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
