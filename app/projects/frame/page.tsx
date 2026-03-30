"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// Dynamically generate the 10 slide paths based on your EXACT file names in the public folder
const SLIDES = Array.from({ length: 10 }).map((_, i) => 
  `/projects/frame/Re-Designing Social Patforms for End User Value (1)_page-${String(i + 1).padStart(4, '0')}.jpg`
);

export default function FrameProjectPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  // Keyboard Navigation for left/right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        
        {/* Navigation */}
        <Link 
          href="/#projects" 
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        {/* Header & Description & Metadata */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          
          {/* Main Content (Title + Description) */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <span className="w-fit rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700">
              UX Research & Mobile App
            </span>
            <h1 className="font-serif text-5xl text-neutral-800 md:text-7xl">
              Frame
            </h1>
            <p className="text-xl text-neutral-500">
              An ethical take on social media
            </p>

            {/* The Updated Description */}
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-neutral-600">
              <p>
                <strong>Attention.</strong> It is our most invaluable resource. The sum total of our lives is defined by what we pay attention to each day: the people we connect with, the problems we solve.
              </p>
              <p>
                Today's social platforms, however, are built entirely on extracting it.
              </p>
              <p>
                But what if it didn’t have to be this way? <strong>Frame</strong> is a social platform I’m developing that adopts Value Sensitive Design, aligning the platform's goals with your well-being so that your time online actually enriches your life offline.
              </p>
            </div>
          </div>

          {/* Project Details Card */}
          <div className="flex flex-col md:justify-end">
            <div className="h-fit space-y-6 rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm">
              <div>
                <h4 className="font-serif text-lg text-neutral-800">Timeline</h4>
                <p className="text-sm text-neutral-500">April 2026 - Present, Ongoing</p>
              </div>
              <div>
                <h4 className="font-serif text-lg text-neutral-800">Tools</h4>
                <p className="text-sm text-neutral-500">Figma, Protopie, Notion</p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Slideshow */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-[#f3f4f6] shadow-xl group">
          {/* Main Slide Container */}
          <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide}
                  alt={`Frame presentation slide ${idx + 1}`}
                  fill
                  className="object-contain"
                  priority={idx === 0}
                />
              </div>
            ))}
            
            {/* Left/Right Clickable Zones */}
            <div 
              className="absolute left-0 top-0 bottom-12 w-1/4 z-20 cursor-w-resize" 
              onClick={prevSlide}
            />
            <div 
              className="absolute right-0 top-0 bottom-12 w-1/4 z-20 cursor-e-resize" 
              onClick={nextSlide}
            />

            {/* Visual Control Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-neutral-200/50 bg-white/70 p-3 text-neutral-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-110 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-neutral-200/50 bg-white/70 p-3 text-neutral-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-110 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between bg-white/90 px-6 py-4 backdrop-blur-md border-t border-neutral-200/50">
              <span className="font-serif text-sm font-medium text-neutral-600">
                Frame Case Study
              </span>
              
              {/* Slide Counter */}
              <div className="flex items-center gap-2 font-mono text-sm font-medium text-neutral-500">
                <span className="text-neutral-900">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-neutral-400">/</span>
                <span>{String(SLIDES.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-40 h-1 bg-neutral-200/50">
              <div 
                className="h-full bg-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}