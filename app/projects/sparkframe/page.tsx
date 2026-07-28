"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useState, useEffect, useRef, Fragment } from "react";
import { BubbleScrollSection, SlideFromLeftSection, FadeInSection } from "@/components/portfolio/scroll-reveal";

function ScreenCarousel({ screens }: { screens: { label: string; src: string }[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [screens.length]);

  const goTo = (newIndex: number) => {
    setIndex((newIndex + screens.length) % screens.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % screens.length);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center gap-4">
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous screen"
          className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/70 shadow-xs text-neutral-500 hover:text-cyan-600 hover:border-cyan-300 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="relative rounded-[2.75rem] border-[10px] border-neutral-800 bg-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex-shrink-0 mx-auto"
          style={{ width: "280px", height: "600px" }}
        >
          {screens.map((screen, i) => (
            <div
              key={screen.label}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={screen.src}
                alt={`${screen.label} screen of the Sparkframe app`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next screen"
          className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/70 shadow-xs text-neutral-500 hover:text-cyan-600 hover:border-cyan-300 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {screens.map((screen, i) => (
          <button
            key={screen.label}
            onClick={() => goTo(i)}
            aria-label={`Go to ${screen.label}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-cyan-500" : "w-2 bg-neutral-300"
            }`}
          />
        ))}
      </div>

      <span className="mt-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
        {screens[index].label}
      </span>
    </div>
  );
}

const JUMP_NAV_ITEMS = [
  { id: "chapter-1", label: "Chapter 1", isChapter: true },
  { id: "haven", label: "Haven", isChapter: false },
  { id: "sparkframe", label: "Sparkframe", isChapter: false },
  { id: "chapter-2", label: "Chapter 2", isChapter: true },
];

function PageJumpNav() {
  const [activeId, setActiveId] = useState(JUMP_NAV_ITEMS[0].id);

  useEffect(() => {
    const targets = JUMP_NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
    >
      {JUMP_NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            aria-current={isActive ? "true" : undefined}
            className={`group flex items-center gap-2.5 ${item.isChapter ? "" : "pr-3"}`}
          >
            <span
              className={`whitespace-nowrap font-medium uppercase tracking-wider transition-all duration-300 ${
                item.isChapter ? "text-[11px]" : "text-[10px]"
              } ${
                isActive
                  ? item.isChapter
                    ? "opacity-100 text-blue-800"
                    : "opacity-100 text-cyan-700"
                  : "opacity-0 group-hover:opacity-60 text-neutral-500"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`shrink-0 rounded-full transition-all duration-300 ${
                isActive
                  ? item.isChapter
                    ? "h-2.5 w-2.5 bg-blue-800"
                    : "h-2 w-2 bg-cyan-600"
                  : "h-1.5 w-1.5 bg-neutral-300 group-hover:bg-neutral-400"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

type LightboxImage = { src: string; alt: string; width: number; height: number };

function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  useEffect(() => {
    if (!image) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/85 backdrop-blur-sm p-6 motion-safe:animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative max-h-[90vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-auto max-h-[90vh] w-full rounded-xl object-contain"
          sizes="90vw"
        />
      </div>
    </div>
  );
}

function ImageZoomButton({
  image,
  onOpen,
  className,
  ariaLabel,
  children,
}: {
  image: LightboxImage;
  onOpen: (image: LightboxImage, trigger: HTMLButtonElement) => void;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ref.current && onOpen(image, ref.current)}
      aria-label={ariaLabel ?? `Open larger view of ${image.alt}`}
      className={`cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function ImageCard({
  src,
  alt,
  width,
  height,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  onOpen: (image: LightboxImage, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-md shadow-md overflow-hidden">
      <ImageZoomButton
        image={{ src, alt, width, height }}
        onOpen={onOpen}
        className="block w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{ maxWidth: width }}
          className="h-auto w-full"
        />
      </ImageZoomButton>

      {label && (
        <div className="px-4 py-3 border-t border-neutral-200/60">
          <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Tech4GoodProjectPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openLightbox = (image: LightboxImage, trigger: HTMLButtonElement) => {
    lightboxTriggerRef.current = trigger;
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    lightboxTriggerRef.current?.focus();
  };

  // CRITICAL SCROLL RESET ENGINE: Deflects browser auto-scroll history caching
  useEffect(() => {
    // 1. Immediately force the window back to the absolute top coordinates
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    // 2. Clear native browser history scroll restoration parameters
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 3. Stagger the hero block animation to ensure canvas renders blank first
    const timer = setTimeout(() => setIsHeaderVisible(true), 150);
    
    return () => {
      clearTimeout(timer);
      // Restore default behavior when navigating away
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <main className="min-h-screen relative text-neutral-800 px-6 py-16 sm:px-8 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      <PageJumpNav />

      <Lightbox image={lightboxImage} onClose={closeLightbox} />

      {/* Vivid Ambient Mesh Gradients — lively bounce-and-shift drift */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-blue-400/45 blur-[130px] animate-[driftA_18s_ease-in-out_infinite]" />
        <div className="absolute top-[15%] right-[-12%] w-[42vw] h-[42vw] rounded-full bg-yellow-300/30 blur-[120px] animate-[driftB_21s_ease-in-out_infinite] [animation-delay:2s]" />
        <div className="absolute top-[34%] left-[-8%] w-[38vw] h-[38vw] rounded-full bg-sky-400/35 blur-[110px] animate-[driftC_19s_ease-in-out_infinite] [animation-delay:4s]" />
        <div className="absolute top-[52%] right-[6%] w-[30vw] h-[30vw] rounded-full bg-yellow-200/28 blur-[100px] animate-[driftD_16s_ease-in-out_infinite] [animation-delay:1s]" />
        <div className="absolute top-[66%] left-[3%] w-[34vw] h-[34vw] rounded-full bg-blue-300/38 blur-[110px] animate-[driftB_20s_ease-in-out_infinite] [animation-delay:3s]" />
        <div className="absolute top-[82%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-yellow-400/30 blur-[130px] animate-[driftA_22s_ease-in-out_infinite] [animation-delay:5s]" />
        <div className="absolute bottom-[-5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-sky-300/35 blur-[120px] animate-[driftC_17s_ease-in-out_infinite] [animation-delay:6s]" />

        {/* Softer, less vivid blobs woven into the gaps for extra depth */}
        <div className="absolute top-[3%] right-[22%] w-[26vw] h-[26vw] rounded-full bg-blue-200/18 blur-[100px] animate-[driftC_20s_ease-in-out_infinite] [animation-delay:2.5s]" />
        <div className="absolute top-[42%] left-[22%] w-[24vw] h-[24vw] rounded-full bg-yellow-100/12 blur-[90px] animate-[driftD_19s_ease-in-out_infinite] [animation-delay:3.5s]" />
        <div className="absolute top-[72%] right-[26%] w-[28vw] h-[28vw] rounded-full bg-sky-200/15 blur-[100px] animate-[driftA_21s_ease-in-out_infinite] [animation-delay:4.5s]" />
        <div className="absolute bottom-[8%] right-[28%] w-[22vw] h-[22vw] rounded-full bg-yellow-200/12 blur-[90px] animate-[driftB_23s_ease-in-out_infinite] [animation-delay:1.5s]" />

        {/* Additional soft blobs filling the empty center gaps */}
        <div className="absolute top-[8%] left-[42%] w-[22vw] h-[22vw] rounded-full bg-blue-100/14 blur-[100px] animate-[driftD_24s_ease-in-out_infinite] [animation-delay:0.5s]" />
        <div className="absolute top-[27%] right-[42%] w-[20vw] h-[20vw] rounded-full bg-yellow-100/10 blur-[90px] animate-[driftA_20s_ease-in-out_infinite] [animation-delay:2.2s]" />
        <div className="absolute top-[48%] left-[46%] w-[24vw] h-[24vw] rounded-full bg-sky-100/12 blur-[100px] animate-[driftB_22s_ease-in-out_infinite] [animation-delay:3.2s]" />
        <div className="absolute top-[60%] right-[44%] w-[18vw] h-[18vw] rounded-full bg-yellow-200/9 blur-[90px] animate-[driftC_25s_ease-in-out_infinite] [animation-delay:1.2s]" />
        <div className="absolute top-[92%] left-[45%] w-[26vw] h-[26vw] rounded-full bg-blue-200/14 blur-[110px] animate-[driftD_18s_ease-in-out_infinite] [animation-delay:4.2s]" />
      </div>

      <div className="mx-auto w-full max-w-5xl relative z-10">
        
        {/* Back Link */}
        <div className={`transition-all duration-1000 ease-out ${isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <Link
            href="/#projects"
            className="group mb-10 inline-flex items-center gap-2 text-base font-medium text-neutral-500 transition-colors hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* --- FROSTED HERO CONTAINER --- */}
        <header 
          className={`mb-16 bg-white/60 border border-white/60 p-8 sm:p-10 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-1100 cubic-bezier(0.25, 1.1, 0.4, 1) transform ${
            isHeaderVisible ? "opacity-100 translate-y-0 scale-100 animate-liquid-bubble" : "opacity-0 translate-y-24 scale-[0.93]"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-widest text-blue-800 mb-5">
            <span className="text-base sm:text-lg tracking-[0.2em]">Tech4Good Lab</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400 font-medium normal-case font-sans tracking-normal">Product Case Study</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-neutral-900 mb-8 leading-[1.12]">
            Tech4Good Lab: <span className="font-sans font-normal text-neutral-600 text-4xl sm:text-5xl md:text-6xl block mt-3">From Design Fundamentals to Leading AI Product Incubation</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-neutral-600 leading-relaxed font-serif italic max-w-3xl border-t border-neutral-200/50 pt-6">
            The story of my journey from learning fundamental design skills to building real products with impact.
          </p>
        </header>

        {/* Continuous Scroll Journey */}
        <div className="space-y-32">
          
          {/* Frosted Metadata Dashboard Block */}
          <BubbleScrollSection>
            <section className="bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Timeline</span>
                <span className="text-neutral-900 font-serif text-2xl font-medium">2 Quarters</span>
                <span className="text-sm text-neutral-500 block">2025 - 2026</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Chapter 1 Role</span>
                <span className="text-neutral-900 font-sans text-xl font-semibold leading-tight block">UI/UX Skill Building Lead</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Chapter 2 Role</span>
                <span className="text-blue-900 font-sans text-xl font-bold leading-tight block">AI Prototyping & Ideation Lead</span>
              </div>
            </section>
          </BubbleScrollSection>

               {/* --- CHAPTER 1 ACCENT BUBBLE --- */}
{/* Transparent glass design matching the all-caps, vibrant blue, letter-spaced TECH4GOOD LAB header font styling */}
<div id="chapter-1" className="flex justify-start">
  <SlideFromLeftSection>
    <div className="inline-flex items-center px-11 py-5 bg-white/50 border border-white/40 shadow-xs rounded-full text-3xl font-extrabold uppercase tracking-[0.2em] text-blue-800 backdrop-blur-xl font-sans select-none">
      <span>Chapter 1: Building the Foundation</span>
    </div>
  </SlideFromLeftSection>
</div>

          {/* Chapter 1 Narrative Blocks */}
          <div className="space-y-12">
            <BubbleScrollSection>
              <div className="bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-300 hover:bg-white/85">
                <div className="text-lg sm:text-xl leading-relaxed text-neutral-700 space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-3">
                    <span className="font-serif tracking-tight text-2xl font-bold italic text-neutral-900 underline decoration-blue-400 decoration-2 underline-offset-4">Typography.</span> 
                    <span className="inline-block border border-dashed border-neutral-400 rounded-md px-3 py-0.5 font-mono text-sm uppercase tracking-widest bg-neutral-100 text-neutral-600">Layout.</span> 
                    <span className="font-semibold bg-gradient-to-r from-blue-600 via-sky-500 to-yellow-400 bg-clip-text text-transparent text-2xl tracking-wide font-marker">Color.</span>
                  </div>
                  <p>
                    I started my journey exploring the very building blocks that make the world of design. With these tools, I realized that design has the power to shape our reality.
                  </p>
                  <p className="text-lg sm:text-xl leading-relaxed text-neutral-700 pt-4 border-t border-neutral-200/40">
                    But today, what’s even more powerful is the story—your impact, your <strong className="font-semibold text-blue-700">why</strong> behind each product built.
                  </p>
                </div>
              </div>
            </BubbleScrollSection>

            <BubbleScrollSection>
              <div className="bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-300 hover:bg-white/85">
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
                  On the UI/UX skill building team, I employed my knowledge of human cognition into practical, responsive, visual ecosystems inside Figma through speculative sandbox design scenarios.
                </p>
              </div>
            </BubbleScrollSection>
          </div>

          {/* =======================================================
              EXPERIMENTAL EXTENSIVE CONCEPTUAL SANDBOXES SYSTEM
             ======================================================= */}
          <div className="space-y-12">

            {/* Section Main Anchor Label */}
            <div className="border-b border-neutral-200 pb-5 space-y-1.5">
              <h3 className="font-serif text-5xl sm:text-6xl text-neutral-900 tracking-tight">
                Conceptual Sandboxes
              </h3>
              <p className="text-sm sm:text-base font-sans font-normal text-neutral-500 max-w-lg">
                a chance to practice translating research insight into interface decisions
              </p>
            </div>

            {/* --- SANDBOX 1: HAVEN --- */}
            <section id="haven" className="space-y-10 pt-4">

              {/* Project heading */}
              <BubbleScrollSection>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-500 block">
                    Project Case Study
                  </span>
                  <h4 className="font-serif text-3xl sm:text-4xl font-semibold text-blue-950 tracking-tight">
                    Haven: Humanizing the Adoption Experience
                  </h4>
                </div>
              </BubbleScrollSection>

              {/* Problem statement pull-quote */}
              <BubbleScrollSection delayClass="[animation-delay:100ms]">
                <div className="bg-white/70 border border-white/70 p-8 sm:p-10 rounded-3xl shadow-md backdrop-blur-2xl">
                  <p className="font-serif text-2xl sm:text-3xl md:text-4xl leading-snug text-neutral-900 tracking-tight">
                    Last year alone, 5.8 million dogs and cats entered U.S. shelters in the U.S. — and the interfaces built to match them with a home are still cold, clinical, and built around data fields instead of the animal in front of them.
                  </p>
                </div>
              </BubbleScrollSection>

              {/* UI screenshot supporting the introduction, with floating callout bubbles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
                <BubbleScrollSection delayClass="[animation-delay:150ms]">
                  <img
                    src="/projects/tech4goodContent/Tech4GoodCoverImages/badPetUI1.png"
                    alt="Screenshot of an existing pet adoption site's clinical, data-heavy UI"
                    className="w-[60%] h-auto rounded-2xl border border-neutral-200 shadow-md bg-white mx-auto md:mx-0"
                  />
                </BubbleScrollSection>

                <div className="flex flex-col justify-center gap-6 h-full">
                  <BubbleScrollSection delayClass="[animation-delay:200ms]">
                    <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                      <p className="text-base text-neutral-800 font-medium">
                        Detached, database-style language reduces feelings of warmth and turns a living animal into a data record.
                      </p>
                    </div>
                  </BubbleScrollSection>

                  <BubbleScrollSection delayClass="[animation-delay:300ms]">
                    <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                      <p className="text-base text-neutral-800 font-medium">
                        Framing animals as a quantity makes the experience feel overwhelming and impersonal
                      </p>
                    </div>
                  </BubbleScrollSection>
                </div>
              </div>

              {/* Research / stats background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                  <BubbleScrollSection delayClass="[animation-delay:100ms]">
                    <div className="bg-white/80 border border-white/80 p-8 sm:p-10 rounded-3xl shadow-md backdrop-blur-2xl text-center flex flex-col items-center justify-center gap-4 min-h-[220px]">
                      <span className="font-serif text-6xl sm:text-7xl font-bold text-blue-900 block leading-none">
                        597,000
                      </span>
                      <span className="text-sm text-neutral-500 max-w-[240px] leading-relaxed">
                        animals still euthanized nationwide, many after sitting unmatched too long
                      </span>
                    </div>
                  </BubbleScrollSection>

                  <BubbleScrollSection delayClass="[animation-delay:150ms]">
                    <img
                      src="/projects/tech4goodContent/Tech4GoodCoverImages/petsImage.jpg"
                      alt="Pets available for adoption"
                      className="w-full h-auto rounded-3xl border border-white/80 shadow-md"
                    />
                  </BubbleScrollSection>
                </div>

                <div className="space-y-6">
                  <BubbleScrollSection delayClass="[animation-delay:150ms]">
                    <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                      <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
                        While adoption rates have quietly improved over the past several years, roughly 597,000 animals were still euthanized, many after sitting unmatched for too long.
                      </p>
                    </div>
                  </BubbleScrollSection>

                  <BubbleScrollSection delayClass="[animation-delay:200ms]">
                    <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                      <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
                        The gap isn't just a numbers problem; it's an interface problem. Most shelter platforms present animals as a stack of clinical data points: breed, age, medical codes, when what actually drives a match is emotional recognition.
                      </p>
                    </div>
                  </BubbleScrollSection>

                  <BubbleScrollSection delayClass="[animation-delay:250ms]">
                    <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                      <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
                        Haven's starting bet was that reframing that same information around connection, not classification, could shorten the distance between a scared animal in a kennel and a family ready to say yes.
                      </p>
                    </div>
                  </BubbleScrollSection>
                </div>
              </div>

              {/* Introducing Haven — phone mockup sticky left, design-choice callouts staggered right */}
              <div className="space-y-6 pt-16">
                <BubbleScrollSection>
                  <div className="inline-flex items-center px-6 py-3 bg-white/80 border border-white/80 rounded-full shadow-md backdrop-blur-2xl">
                    <h5 className="font-serif text-xl sm:text-2xl font-semibold text-blue-900 tracking-tight">
                      Introducing Haven
                    </h5>
                  </div>
                </BubbleScrollSection>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                  {/* Left Column: Device Viewport Frame */}
                  <div className="lg:col-span-5 lg:sticky lg:top-10 flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 block self-center text-center">
                      INTERACTIVE VIDEO WALKTHROUGH
                    </span>

                    <FadeInSection>
                      <div
                        className="relative rounded-[2.75rem] border-[10px] border-neutral-800 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex-shrink-0 mx-auto"
                        style={{ width: "312px", height: "672px" }}
                      >
                        <video
                          src="/projects/tech4goodContent/videos/citypet-walkthrough.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </FadeInSection>
                  </div>

                  {/* Right Column: Staggered Design-Choice Callouts */}
                  <div className="lg:col-span-7 flex flex-col gap-6 w-full mt-16">
                    <BubbleScrollSection delayClass="[animation-delay:100ms]">
                      <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                        <p className="text-sm leading-relaxed text-neutral-600">
                          The warm ivory and brown palette, paired with a soft, rounded typeface, is a deliberate move away from the clinical white-and-blue of most shelter platforms, creating empathetic feelings of familial bonding.
                        </p>
                      </div>
                    </BubbleScrollSection>

                    <BubbleScrollSection delayClass="[animation-delay:200ms]">
                      <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                        <p className="text-sm leading-relaxed text-neutral-600">
                          Each animal gets a short line in their own voice instead of a spec sheet. It's the same information a shelter database already has, just written like someone who actually knows the animal.
                        </p>
                      </div>
                    </BubbleScrollSection>

                    <BubbleScrollSection delayClass="[animation-delay:300ms]">
                      <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                        <p className="text-sm leading-relaxed text-neutral-600">
                          Pet profiles lead with a name and a face, with breed, age, and size tucked into small tags underneath. Filtering is tucked behind a single icon next to the search bar, instead of a sidebar demanding attention before you've even seen an animal.
                        </p>
                      </div>
                    </BubbleScrollSection>

                    <BubbleScrollSection delayClass="[animation-delay:400ms]">
                      <div className="bg-white/80 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                        <p className="text-sm leading-relaxed text-neutral-600">
                          Every card offers one clear way to act — the heart to favorite — and the bottom navigation (Favorites, Home, Applications) frames the whole app around the adopter's actual journey, not a database to browse.
                        </p>
                      </div>
                    </BubbleScrollSection>
                  </div>

                </div>
              </div>

              {/* Closing reflection */}
              <BubbleScrollSection delayClass="[animation-delay:100ms]">
                <div className="bg-white/80 border border-white/80 p-10 rounded-3xl shadow-md backdrop-blur-2xl">
                  <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
                    Looking ahead, I'd want to test Haven directly with adopters and shelter staff to see whether the tag-based, personality-first framing actually reduces hesitation. I'd also want to move past mock data and integrate with real shelter management systems, or direct shelter partnerships, so the animals shown are actually available, not simulated.
                  </p>
                </div>
              </BubbleScrollSection>

            </section>


            {/* --- SANDBOX 2: SPARKFRAME PLATFORM (Speculative Concept Carousel) --- */}
            <section id="sparkframe" className="space-y-10 pt-10">

              {/* Title Header (mirrors Haven's title treatment) */}
              <BubbleScrollSection>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-600">
                    <span>Speculative Concept</span>
                    <span>•</span>
                    <span>Visual & Systems Exploration</span>
                  </div>
                  <h4 className="font-serif text-3xl sm:text-4xl font-semibold text-cyan-950 tracking-tight leading-tight">
                    Sparkframe — Learn. Create. Animate.
                  </h4>
                </div>
              </BubbleScrollSection>

              {/* Single Impact Bubble (mirrors Haven's stat-sentence bubble) */}
              <BubbleScrollSection delayClass="[animation-delay:75ms]">
                <div className="bg-white/60 border border-white/80 p-8 sm:p-10 rounded-3xl shadow-md backdrop-blur-2xl">
                  <p className="font-serif text-2xl sm:text-3xl leading-snug text-neutral-800">
                    Most self-taught animators piece their skills together from scattered YouTube tutorials, Discord servers, and paid course platforms — Sparkframe imagines what it could look like to bring structured learning, personal creation, and community into one connected space.
                  </p>
                </div>
              </BubbleScrollSection>

              {/* Honesty Scope Note */}
              <BubbleScrollSection delayClass="[animation-delay:150ms]">
                <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-neutral-300 bg-neutral-50/80 px-4 py-2 text-xs font-medium text-neutral-500">
                  These are speculative screen designs exploring visual direction and structure — not yet built into an interactive prototype.
                </div>
              </BubbleScrollSection>

              {/* Single Phone Carousel — slow fade reveal on scroll */}
              <FadeInSection>
                <div className="pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 block text-center mb-6">
                    SCREEN CONCEPTS
                  </span>
                  <ScreenCarousel
                    screens={[
                      { label: "Splash", src: "/projects/tech4goodContent/sparkframe/sf1.png" },
                      { label: "Onboarding", src: "/projects/tech4goodContent/sparkframe/sf2.png" },
                      { label: "Loading", src: "/projects/tech4goodContent/sparkframe/sf3.png" },
                      { label: "Home", src: "/projects/tech4goodContent/sparkframe/sf4.png" },
                      { label: "Community", src: "/projects/tech4goodContent/sparkframe/sf5.png" },
                      { label: "Learn", src: "/projects/tech4goodContent/sparkframe/sf6.png" },
                    ]}
                  />
                </div>
              </FadeInSection>

            </section>
          </div>

   {/* --- CHAPTER 2 ACCENT BUBBLE --- */}
{/* Transparent glass design hooked to the Left Transition Observer for matching entry animations */}
<div id="chapter-2" className="pt-10">
  <div className="flex justify-start">
    <SlideFromLeftSection>
      <div className="inline-flex items-center px-11 py-5 bg-white/50 border border-white/40 shadow-xs rounded-full text-3xl font-extrabold uppercase tracking-[0.2em] text-blue-800 backdrop-blur-xl font-sans select-none">
        <span>Chapter 2: AI Product Leadership</span>
      </div>
    </SlideFromLeftSection>
  </div>

  <BubbleScrollSection>
    <div className="mt-6 bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl">
      <h3 className="text-xl font-bold text-neutral-800 mb-3">My Operational Leadership Role</h3>
      <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
        Promoted to the AI Prototyping and Idea Incubation Team, I stepped up as the design and product lead. I steered a cross-functional team through the entire product lifecycle—moving from messy research insights to a nearly fully functional application.
      </p>
    </div>
  </BubbleScrollSection>
</div>

          {/* Chapter 2 Core Content */}
          <div className="space-y-16">
            {/* Project heading */}
            <BubbleScrollSection>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 block">
                  Project Case Study
                </span>
                <h4 className="font-serif text-3xl sm:text-4xl font-semibold text-blue-950 tracking-tight">
                  ByteSized.AI
                </h4>
              </div>
            </BubbleScrollSection>

            <BubbleScrollSection>
              <div className="bg-white/80 border border-white/80 p-8 sm:p-10 rounded-3xl shadow-md backdrop-blur-2xl">
                <p className="font-serif text-2xl sm:text-3xl leading-snug text-neutral-800">
                  Higher education is facing severe AI burnout.
                  <br />
                  Technology moves at a breakneck pace, and faculty simply don't have time to dissect every update, let alone figure out how it fits into a traditional, textbook-driven curriculum that's already struggling to keep up.
                </p>
              </div>
            </BubbleScrollSection>

            {/* Process Breakdown Timeline */}
            <div className="space-y-10">
              {[
                { num: "01", title: "Research & User Interviews", text: "We went straight to the source. I helped lead interviews with higher-ed faculty to understand their friction points. We discovered they didn't want long courses; they needed bite-sized, actionable insights they could digest between classrooms." },
                { num: "02", title: "Ideation & Wireframing", text: "Translating complex AI data streams into clean information architecture. We designed a dashboard focused on micro-learning paths, clear categorizations, and immediate classroom applications." },
                { num: "03", title: "Building the High-Fidelity Product", text: "The prototype outgrew Figma. I built ByteSized as a working application — live LLM integration, real news ingestion, and file upload — so testers could react to something that actually behaved like software instead of imagining what it might do." },
                { num: "04", title: "Impact", text: "I ran a second round of interviews with leads in the Tech4Good Lab, who use ByteSized to plan lessons for skill-building teams. The goal was to learn whether the tool changed how they work." }
              ].map((step, idx) => (
                <Fragment key={idx}>
                  <BubbleScrollSection>
                    <div className="bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl">
                      <div className="flex items-start gap-5">
                        <span className="font-serif text-3xl font-bold text-blue-400 leading-none">{step.num}</span>
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-neutral-900">{step.title}</h4>
                          <p className="text-base sm:text-lg leading-relaxed text-neutral-600">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  </BubbleScrollSection>

                  {idx === 0 && (
                    <BubbleScrollSection delayClass="[animation-delay:100ms]">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                          {[
                            { src: "/projects/tech4goodContent/byteSized/researchpaper1.png", label: "Background Research", width: 1654, height: 1600, delay: "[animation-delay:150ms]" },
                            { src: "/projects/tech4goodContent/byteSized/researchpaper2.png", label: "Background Research", width: 1574, height: 1666, delay: "[animation-delay:250ms]" },
                            { src: "/projects/tech4goodContent/byteSized/userInterview.png", label: "User Interview Notes", width: 2876, height: 1802, delay: "[animation-delay:350ms]" },
                          ].map((item) => (
                            <BubbleScrollSection key={item.src} delayClass={item.delay}>
                              <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-md shadow-md overflow-hidden flex items-center justify-center">
                                <ImageZoomButton
                                  image={{ src: item.src, alt: item.label, width: item.width, height: item.height }}
                                  onOpen={openLightbox}
                                  className="block w-full"
                                >
                                  <Image
                                    src={item.src}
                                    alt={item.label}
                                    width={item.width}
                                    height={item.height}
                                    className="w-full h-auto"
                                  />
                                </ImageZoomButton>
                              </div>
                            </BubbleScrollSection>
                          ))}
                        </div>

                        <BubbleScrollSection delayClass="[animation-delay:450ms]">
                          <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-md shadow-md overflow-hidden flex items-center justify-center">
                            <ImageZoomButton
                              image={{ src: "/projects/tech4goodContent/byteSized/IntroProblem.png", alt: "Intro problem statement", width: 2192, height: 1232 }}
                              onOpen={openLightbox}
                              className="block w-1/2"
                            >
                              <Image
                                src="/projects/tech4goodContent/byteSized/IntroProblem.png"
                                alt="Intro problem statement"
                                width={2192}
                                height={1232}
                                className="w-full h-auto"
                              />
                            </ImageZoomButton>
                          </div>
                        </BubbleScrollSection>
                      </div>
                    </BubbleScrollSection>
                  )}

                  {idx === 1 && (
                    <BubbleScrollSection delayClass="[animation-delay:100ms]">
                      <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block pl-1">
                          Low-Fi Explorations
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                            { src: "/projects/tech4goodContent/byteSized/wireframe1.png", label: "Dashboard Wireframe", width: 596, height: 438, delay: "[animation-delay:150ms]" },
                            { src: "/projects/tech4goodContent/byteSized/wireframe2.png", label: "Dashboard Wireframe", width: 604, height: 442, delay: "[animation-delay:250ms]" },
                          ].map((item) => (
                            <BubbleScrollSection key={item.src} delayClass={item.delay}>
                              <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur-md shadow-md overflow-hidden">
                                <ImageZoomButton
                                  image={{ src: item.src, alt: item.label, width: item.width, height: item.height }}
                                  onOpen={openLightbox}
                                  className="relative block w-full aspect-[4/3] bg-neutral-50"
                                >
                                  <Image src={item.src} alt={item.label} fill className="object-contain p-2" />
                                </ImageZoomButton>
                                <div className="px-4 py-3 border-t border-neutral-200/60">
                                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    {item.label}
                                  </span>
                                </div>
                              </div>
                            </BubbleScrollSection>
                          ))}
                        </div>
                      </div>
                    </BubbleScrollSection>
                  )}

                  {idx === 2 && (
                    <div className="space-y-10">
                      {[
                        {
                          groupLabel: "Entry Point",
                          images: [
                            {
                              src: "/projects/tech4goodContent/byteSized/product/landing.png",
                              label: undefined as string | undefined,
                              caption: undefined as string | undefined,
                              alt: "ByteSized.AI landing screen introducing the product to a new faculty user",
                              width: 2892,
                              height: 1794,
                            },
                          ],
                        },
                        {
                          groupLabel: "The Weekly Feed",
                          images: [
                            {
                              src: "/projects/tech4goodContent/byteSized/product/updatesDashboard.png",
                              label: "Updates Dashboard",
                              caption: "CS educators are presented with weekly updates via a dashboard with news headlines about advancements in AI. Each update comes with a consolidation of the article and explorable lesson ideas.",
                              alt: "Dashboard showing a weekly feed of AI updates relevant to faculty",
                              width: 2870,
                              height: 1776,
                            },
                          ],
                        },
                        {
                          groupLabel: "Article → Lesson",
                          images: [
                            {
                              src: "/projects/tech4goodContent/byteSized/product/lessonIdea.png",
                              label: "Lesson Idea View",
                              caption: "Each news update expands into a deeper lesson where educators work with AI to craft the perfect lesson idea that fits into their curriculum. The AI acts as a scoped assistant, turning complex ideas into teachable lesson plans.",
                              alt: "Interface for turning an AI news article into a classroom lesson idea",
                              width: 2882,
                              height: 1794,
                            },
                          ],
                        },
                        {
                          groupLabel: "Community Signal",
                          images: [
                            {
                              src: "/projects/tech4goodContent/byteSized/product/communityResponse.png",
                              label: "Builder Response",
                              caption: "A community response tab allows educators to understand the broader builder context around a technology update, separating what has been announced and what is currently being built and explored by the community.",
                              alt: "Community responses and reactions to a shared lesson idea",
                              width: 2850,
                              height: 1782,
                            },
                          ],
                        },
                        {
                          groupLabel: "Bring Your Own Material",
                          images: [
                            {
                              src: "/projects/tech4goodContent/byteSized/product/brainstormUpload.png",
                              label: "Brainstorm Upload",
                              caption: "An open brainstorming feature that allows educators to upload existing documents and an AI parses through and gives suggestions to improve the curriculum given crucial updates. This personalization allows for the model to layer current developments onto existing material rather than generating ideas completely from scratch.",
                              alt: "Interface for uploading your own material to brainstorm lesson ideas",
                              width: 2884,
                              height: 1792,
                            },
                          ],
                        },
                      ].map((group, groupIdx) => (
                        <BubbleScrollSection key={group.groupLabel} delayClass={`[animation-delay:${100 + groupIdx * 75}ms]`}>
                          <div className="space-y-4">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-blue-400 block pl-1">
                              {group.groupLabel}
                            </h5>
                            <div className={group.images.length > 1 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
                              {group.images.map((image) => (
                                <div key={image.src} className="space-y-4">
                                  <ImageCard
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    label={image.label}
                                    onOpen={openLightbox}
                                  />
                                  {image.caption && (
                                    <div className="bg-white/60 border border-white/80 p-6 rounded-3xl shadow-md backdrop-blur-2xl">
                                      <p className="text-sm sm:text-base leading-relaxed text-neutral-600">
                                        {image.caption}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </BubbleScrollSection>
                      ))}
                    </div>
                  )}

                  {idx === 3 && (
                    <BubbleScrollSection delayClass="[animation-delay:100ms]">
                      <div className="space-y-6">
                        <p className="text-base sm:text-lg leading-relaxed text-neutral-600">
                          Across the interviews, every lead described the same shift: the time they spent updating curriculum and pulling together lesson ideas dropped by somewhere between a quarter and nearly half.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed text-neutral-600">
                          What changed was not reading speed: leads were skipping the step where they had to work out what a development meant for a classroom. Starting from a teaching angle and editing it turned out to be a fundamentally different task than starting from an article and inventing one.
                        </p>
                      </div>
                    </BubbleScrollSection>
                  )}
                </Fragment>
              ))}
            </div>

            {/* Legacy Hand-Off */}
            <BubbleScrollSection>
              <div className="bg-white/80 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl border-t-2 border-t-blue-400/40">
                <h3 className="text-2xl font-serif text-neutral-900 mb-3">Passing the Torch</h3>
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">
                  Having successfully built a sustainable ecosystem, I handed off ByteSized.AI. When I moved on from UCSC to UC Berkeley, the product had reached a level of validation that let it live on beyond my involvement.
                </p>
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-700 mt-4">
                  The application, design system, and product roadmap were handed off to the next incoming batch of UCSC Tech4Good students, who are carrying the idea forward and building out its next steps.
                </p>
              </div>
            </BubbleScrollSection>
          </div>

        </div>

        {/* Footer Navigation */}
        <footer className="mt-24 border-t border-neutral-200/60 pt-10 text-center">
          <Link 
            href="/#projects" 
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors"
          >
            <span>Browse other portfolio projects</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </footer>

      </div>
    </main>
  );
}