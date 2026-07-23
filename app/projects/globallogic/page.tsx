"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { BubbleScrollSection, SlideFromLeftSection } from "@/components/portfolio/scroll-reveal";

export default function GlobalLogicProjectPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const timer = setTimeout(() => setIsHeaderVisible(true), 150);

    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <main className="min-h-screen relative text-neutral-800 px-6 py-16 sm:px-8 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">

      {/* Vivid Edge Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-orange-400/40 blur-[120px]" />
        <div className="absolute top-[20%] right-[-12%] w-[50vw] h-[50vw] rounded-full bg-purple-300/35 blur-[100px]" />
        <div className="absolute top-[55%] left-[-10%] w-[48vw] h-[48vw] rounded-full bg-rose-300/30 blur-[110px]" />
        <div className="absolute bottom-[-5%] right-[2%] w-[55vw] h-[55vw] rounded-full bg-amber-300/35 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl relative z-10">

        {/* Back Link */}
        <div className={`transition-all duration-1000 ease-out ${isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <Link
            href="/#projects"
            className="group mb-10 inline-flex items-center gap-2 text-base font-medium text-neutral-500 transition-colors hover:text-purple-600"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* --- FROSTED HERO CONTAINER --- */}
        <header
          className={`mb-16 bg-white/40 border border-white/60 p-8 sm:p-10 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-1100 cubic-bezier(0.25, 1.1, 0.4, 1) transform ${
            isHeaderVisible ? "opacity-100 translate-y-0 scale-100 animate-liquid-bubble" : "opacity-0 translate-y-24 scale-[0.93]"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-widest text-orange-600 mb-5">
            <span className="text-base sm:text-lg tracking-[0.2em]">GlobalLogic</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400 font-medium normal-case font-sans tracking-normal">Product Case Study</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-neutral-900 mb-8 leading-[1.12]">
            GlobalLogic: <span className="font-sans font-normal text-neutral-600 text-4xl sm:text-5xl md:text-6xl block mt-3">Building an AI Product 0-to-1</span>
          </h1>

          <p className="text-xl sm:text-2xl text-neutral-600 leading-relaxed font-serif italic max-w-3xl border-t border-neutral-200/50 pt-6">
            [Chapter narrative goes here]
          </p>
        </header>

        {/* Continuous Scroll Journey */}
        <div className="space-y-32">

          {/* Frosted Metadata Dashboard Block */}
          <BubbleScrollSection>
            <section className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Timeline</span>
                <span className="text-neutral-900 font-serif text-2xl font-medium">[Timeline]</span>
                <span className="text-sm text-neutral-500 block">[Dates]</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Role</span>
                <span className="text-neutral-900 font-sans text-xl font-semibold leading-tight block">[Role]</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Team</span>
                <span className="text-orange-900 font-sans text-xl font-bold leading-tight block">[Team]</span>
              </div>
            </section>
          </BubbleScrollSection>

          {/* --- CHAPTER 1 ACCENT BUBBLE --- */}
          <div className="flex justify-start">
            <SlideFromLeftSection>
              <div className="inline-flex items-center px-11 py-5 bg-white/30 border border-white/40 shadow-xs rounded-full text-3xl font-extrabold uppercase tracking-[0.2em] text-orange-600 backdrop-blur-xl font-sans select-none">
                <span>Chapter 1: [Title]</span>
              </div>
            </SlideFromLeftSection>
          </div>

          {/* Chapter 1 Narrative Blocks */}
          <div className="space-y-12">
            <BubbleScrollSection>
              <div className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-300 hover:bg-white/70">
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
                  [Chapter narrative goes here]
                </p>
              </div>
            </BubbleScrollSection>
          </div>

          {/* --- CHAPTER 2 ACCENT BUBBLE --- */}
          <div className="flex justify-start pt-10">
            <SlideFromLeftSection>
              <div className="inline-flex items-center px-11 py-5 bg-white/30 border border-white/40 shadow-xs rounded-full text-3xl font-extrabold uppercase tracking-[0.2em] text-orange-600 backdrop-blur-xl font-sans select-none">
                <span>Chapter 2: [Title]</span>
              </div>
            </SlideFromLeftSection>
          </div>

          {/* Chapter 2 Narrative Blocks */}
          <div className="space-y-12">
            <BubbleScrollSection>
              <div className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-300 hover:bg-white/70">
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
                  [Chapter narrative goes here]
                </p>
              </div>
            </BubbleScrollSection>
          </div>

          {/* --- CHAPTER 3 ACCENT BUBBLE --- */}
          <div className="flex justify-start pt-10">
            <SlideFromLeftSection>
              <div className="inline-flex items-center px-11 py-5 bg-white/30 border border-white/40 shadow-xs rounded-full text-3xl font-extrabold uppercase tracking-[0.2em] text-orange-600 backdrop-blur-xl font-sans select-none">
                <span>Chapter 3: [Title]</span>
              </div>
            </SlideFromLeftSection>
          </div>

          {/* Chapter 3 Narrative Blocks */}
          <div className="space-y-12">
            <BubbleScrollSection>
              <div className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-300 hover:bg-white/70">
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
                  [Chapter narrative goes here]
                </p>
              </div>
            </BubbleScrollSection>
          </div>

        </div>

        {/* Footer Navigation */}
        <footer className="mt-24 border-t border-neutral-200/60 pt-10 text-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
          >
            <span>Browse other portfolio projects</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </footer>

      </div>
    </main>
  );
}
