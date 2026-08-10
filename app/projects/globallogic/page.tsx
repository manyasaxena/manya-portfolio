"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { BubbleScrollSection, FadeInSection } from "@/components/portfolio/scroll-reveal";

// Spectra's prism accent system — one color per wellness axis.
const PRISM = {
  movement: { bar: "bg-red-500", text: "text-red-600", ring: "#dc2626" },
  nutrition: { bar: "bg-orange-500", text: "text-orange-600", ring: "#ea580c" },
  restoration: { bar: "bg-blue-500", text: "text-blue-600", ring: "#2563eb" },
  mindfulness: { bar: "bg-emerald-500", text: "text-emerald-600", ring: "#059669" },
  connection: { bar: "bg-amber-400", text: "text-amber-600", ring: "#d97706" },
};

/* ---------- Local building blocks (spec block types) ---------- */

// Fixed right-edge chapter nav — dot bookmarks the user can jump to, mirrors the Tech 4 Good case study.
const CHAPTER_NAV_ITEMS = [
  { id: "chapter-01", label: "The Problem" },
  { id: "chapter-02", label: "Research & Discovery" },
  { id: "chapter-03", label: "Ideation" },
  { id: "chapter-04", label: "Building the Prototype" },
  { id: "chapter-05", label: "What's Next" },
];

function PageJumpNav() {
  const [activeId, setActiveId] = useState(CHAPTER_NAV_ITEMS[0].id);

  useEffect(() => {
    const targets = CHAPTER_NAV_ITEMS
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
      aria-label="Case study chapters"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
    >
      {CHAPTER_NAV_ITEMS.map((item, i) => {
        const isActive = activeId === item.id;
        const center = (CHAPTER_NAV_ITEMS.length - 1) / 2;
        const t = (i - center) / center;
        const bow = -16 * (1 - t * t);
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            aria-current={isActive ? "true" : undefined}
            style={{ transform: `translateX(${bow}px)` }}
            className="group flex items-center gap-2.5 pr-3 transition-transform duration-300"
          >
            <span
              className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-wider transition-all duration-300 ${
                isActive ? "opacity-100 text-orange-600" : "opacity-0 group-hover:opacity-60 text-neutral-500"
              }`}
            >
              {String(i + 1).padStart(2, "0")} · {item.label}
            </span>
            <span
              className={`shrink-0 rounded-full transition-all duration-300 ${
                isActive ? "h-2.5 w-2.5 bg-orange-500" : "h-1.5 w-1.5 bg-neutral-300 group-hover:bg-neutral-400"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <BubbleScrollSection>
      <div className="space-y-3 border-b border-neutral-200/70 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block">{eyebrow}</span>
        <h3 className="font-serif text-4xl sm:text-5xl text-neutral-900 tracking-tight">{title}</h3>
      </div>
    </BubbleScrollSection>
  );
}

// [BUBBLE] — one idea, rounded soft-shadow card, lots of air.
function Bubble({
  children,
  delayClass,
  className = "",
  maxWidthClass = "max-w-2xl",
}: {
  children: ReactNode;
  delayClass?: string;
  className?: string;
  maxWidthClass?: string;
}) {
  return (
    <BubbleScrollSection delayClass={delayClass}>
      <div className={`mx-auto ${maxWidthClass} bg-white/80 border border-white/80 p-7 sm:p-8 rounded-3xl shadow-md backdrop-blur-2xl ${className}`}>
        <p className="text-lg sm:text-xl leading-relaxed text-neutral-700">{children}</p>
      </div>
    </BubbleScrollSection>
  );
}

// [PULL-QUOTE] — large, centered, the thesis in one breath.
function PullQuote({ children, highlight = false }: { children: ReactNode; highlight?: boolean }) {
  return (
    <BubbleScrollSection>
      <div
        className={`mx-auto max-w-3xl rounded-[2.5rem] border p-10 text-center backdrop-blur-2xl sm:p-12 ${
          highlight
            ? "border-amber-300/70 bg-amber-50/60 shadow-lg shadow-amber-200/40"
            : "border-white/70 bg-white/70 shadow-md"
        }`}
      >
        <p className="font-serif text-2xl leading-snug tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          {children}
        </p>
      </div>
    </BubbleScrollSection>
  );
}

// [SPLIT] — media one side, text stack the other; stacks on mobile.
function Split({ media, children, reverse = false }: { media: ReactNode; children: ReactNode; reverse?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <FadeInSection className={reverse ? "md:order-2" : ""}>{media}</FadeInSection>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

// [IMAGE] placeholder — labeled box at the right aspect ratio, slide name as alt + visible caption.
// A real pitch-slide image, framed the same way as the hero slide.
function SlideImage({
  src,
  alt,
  className = "",
  width = 960,
  height = 540,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-md backdrop-blur-md ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
    </div>
  );
}

// Phone-shaped video walkthrough — real captured footage, portrait aspect.
// Autoplays (muted, looped) once scrolled into view; no visible controls.
function PhoneVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-md backdrop-blur-md ${className}`}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        className="pointer-events-none aspect-[640/1368] h-auto w-full bg-black"
      />
    </div>
  );
}

// Larger, non-bubble heading used above bubble copy inside a [SPLIT] text column.
function SplitTitle({ children }: { children: ReactNode }) {
  return <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">{children}</h4>;
}

// Compact bubble used for subtitle/body copy inside a [SPLIT] text column.
function SplitBubble({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-md">
      <p className="text-base sm:text-lg leading-relaxed text-neutral-700">{children}</p>
    </div>
  );
}

// Colored-bar frosted card used inside every [CARD-ROW].
function AccentCard({
  barClass,
  titleClass = "text-neutral-900",
  eyebrow,
  eyebrowClass = "text-neutral-400",
  title,
  badge,
  children,
}: {
  barClass: string;
  titleClass?: string;
  eyebrow?: string;
  eyebrowClass?: string;
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 pl-7 shadow-md backdrop-blur-2xl">
      <div className={`absolute left-0 top-0 h-full w-1.5 ${barClass}`} />
      {eyebrow && (
        <span className={`block text-xs font-bold uppercase tracking-widest mb-1 ${eyebrowClass}`}>{eyebrow}</span>
      )}
      <h5 className={`font-serif text-xl font-semibold ${titleClass}`}>{title}</h5>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-neutral-600">{children}</div>
      {badge && (
        <span className="mt-4 inline-block rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          {badge}
        </span>
      )}
    </div>
  );
}

// [CARD-ROW] — responsive grid wrapper with staggered reveal.
function CardRow({ children, cols = 3 }: { children: ReactNode[]; cols?: 3 | 5 }) {
  const gridCols = cols === 5 ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      {children.map((child, i) => (
        <BubbleScrollSection key={i} delayClass={`[animation-delay:${i * 100}ms]`}>
          {child}
        </BubbleScrollSection>
      ))}
    </div>
  );
}

// [STAT-VIZ] — count-up number with a ring that fills (or a decorative dashed ring) on scroll into view.
function StatViz({
  value,
  decimals = 0,
  suffix = "",
  label,
  colorHex,
  colorClass,
  ringPercent,
  variant = "fill",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: ReactNode;
  colorHex: string;
  colorClass: string;
  ringPercent?: number;
  variant?: "fill" | "dashed";
}) {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1600;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted]);

  const displayValue = (value * progress).toFixed(decimals);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = variant === "fill" ? (ringPercent ?? value) * progress : 0;
  const dashOffset = circumference * (1 - fillPercent / 100);

  return (
    <div ref={ref} className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-36 w-36 sm:h-40 sm:w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-200/70"
            strokeDasharray={variant === "dashed" ? "6 8" : undefined}
          />
          {variant === "fill" && (
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={colorHex}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-serif text-3xl font-bold sm:text-4xl ${colorClass}`}>
            {displayValue}
            {suffix}
          </span>
        </div>
      </div>
      <div className="max-w-[220px] text-sm leading-relaxed text-neutral-600">{label}</div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function GlobalLogicProjectPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const timer = setTimeout(() => setIsHeaderVisible(true), 150);

    return () => {
      clearTimeout(timer);
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  return (
    <main className="min-h-screen relative text-neutral-800 px-6 py-16 sm:px-8 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">

      <PageJumpNav />

      {/* Ambient Prism Mesh — Movement red, Nutrition orange, Restoration blue, Mindfulness green,
          Connection yellow, drifting over a soft lavender/ivory wash */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-6%] left-[-8%] w-[50vw] h-[50vw] rounded-full bg-red-400/25 blur-[130px] animate-[driftA_19s_ease-in-out_infinite]" />
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-300/30 blur-[120px] animate-[driftB_21s_ease-in-out_infinite] [animation-delay:2s]" />
        <div className="absolute top-[-3%] left-[2%] w-[26vw] h-[26vw] rounded-full bg-orange-200/22 blur-[100px] animate-[driftC_20s_ease-in-out_infinite] [animation-delay:0.5s]" />
        <div className="absolute top-[38%] left-[-6%] w-[40vw] h-[40vw] rounded-full bg-blue-400/25 blur-[110px] animate-[driftC_20s_ease-in-out_infinite] [animation-delay:4s]" />
        <div className="absolute top-[27%] right-[6%] w-[24vw] h-[24vw] rounded-full bg-orange-300/16 blur-[110px] animate-[driftD_24s_ease-in-out_infinite] [animation-delay:3.5s]" />
        <div className="absolute top-[58%] right-[4%] w-[32vw] h-[32vw] rounded-full bg-emerald-300/22 blur-[100px] animate-[driftD_18s_ease-in-out_infinite] [animation-delay:1s]" />
        <div className="absolute top-[50%] left-[-4%] w-[28vw] h-[28vw] rounded-full bg-orange-300/18 blur-[110px] animate-[driftA_23s_ease-in-out_infinite] [animation-delay:6s]" />
        <div className="absolute top-[78%] left-[8%] w-[34vw] h-[34vw] rounded-full bg-amber-300/28 blur-[110px] animate-[driftA_22s_ease-in-out_infinite] [animation-delay:5s]" />
        <div className="absolute top-[68%] right-[-6%] w-[30vw] h-[30vw] rounded-full bg-orange-200/18 blur-[120px] animate-[driftB_21s_ease-in-out_infinite] [animation-delay:1.5s]" />
        <div className="absolute top-[88%] left-[-2%] w-[26vw] h-[26vw] rounded-full bg-orange-300/16 blur-[110px] animate-[driftC_19s_ease-in-out_infinite] [animation-delay:4.5s]" />
        <div className="absolute bottom-[-6%] right-[-6%] w-[46vw] h-[46vw] rounded-full bg-violet-300/25 blur-[130px] animate-[driftB_20s_ease-in-out_infinite] [animation-delay:3s]" />
        <div className="absolute top-[20%] left-[35%] w-[26vw] h-[26vw] rounded-full bg-purple-100/25 blur-[100px] animate-[driftC_23s_ease-in-out_infinite] [animation-delay:2.5s]" />
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
          className={`mb-10 bg-white/40 border border-white/60 p-8 sm:p-10 rounded-3xl shadow-xs backdrop-blur-2xl transition-all duration-1100 cubic-bezier(0.25, 1.1, 0.4, 1) transform ${
            isHeaderVisible ? "opacity-100 translate-y-0 scale-100 animate-liquid-bubble" : "opacity-0 translate-y-24 scale-[0.93]"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-widest text-orange-600 mb-5">
            <span className="text-base sm:text-lg tracking-[0.2em]">GlobalLogic</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400 font-medium normal-case font-sans tracking-normal">Product Case Study</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-neutral-900 mb-8 leading-[1.12]">
            Spectra: <span className="font-sans font-normal text-neutral-600 text-4xl sm:text-5xl md:text-6xl block mt-3">Building an AI Wellness Product 0-to-1</span>
          </h1>

          <p className="text-xl sm:text-2xl text-neutral-600 leading-relaxed font-serif italic max-w-3xl border-t border-neutral-200/50 pt-6">
            Taking a wellness social platform from ideation to a working, data-fed prototype, whilst learning to build iteratively with agentic AI.
          </p>
        </header>

        {/* Hero slide */}
        <div className="mb-16">
          <FadeInSection>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-md backdrop-blur-md">
              <Image
                src="/projects/GLContent/Spectra - Final.png"
                alt="Spectra prism-heart title slide: Harmonizing your wellness. Illuminating a shared, community space of growth."
                width={960}
                height={540}
                className="h-auto w-full"
              />
            </div>
          </FadeInSection>
        </div>

        {/* Continuous Scroll Journey */}
        <div className="space-y-32">

          {/* Frosted Metadata Dashboard Block */}
          <BubbleScrollSection>
            <section className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-xs backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Timeline</span>
                <span className="text-neutral-900 font-serif text-2xl font-medium">5 Weeks</span>
                <span className="text-sm text-neutral-500 block">Summer 2026</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Role</span>
                <span className="text-neutral-900 font-sans text-xl font-semibold leading-tight block">AI Product Intern</span>
                <span className="text-sm text-neutral-500 block">Design, Prototyping & Agentic Backend</span>
              </div>
              <div className="space-y-1.5 md:border-l md:border-neutral-200/40 md:pl-8">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Company</span>
                <span className="text-orange-900 font-sans text-xl font-bold leading-tight block">GlobalLogic</span>
                <span className="text-sm text-neutral-500 block">a Hitachi company</span>
              </div>
            </section>
          </BubbleScrollSection>

          {/* ===================== SECTION 1 — THE PROBLEM ===================== */}
          <div id="chapter-01" className="space-y-14">
            <SectionHeader eyebrow="Chapter 01" title="The Problem" />

            <FadeInSection>
              <SlideImage
                src="/projects/GLContent/spectraSlides/howRuSlide.png"
                alt="Slide: &ldquo;How are you?&rdquo; next to four wellness app icons stacked with unread notification badges, answered with &ldquo;..Good.&rdquo;"
                className="mx-auto max-w-xl"
              />
            </FadeInSection>

            <Bubble maxWidthClass="max-w-none">
              Ask someone how they&rsquo;re doing and you get one word — <em>&ldquo;good&rdquo;</em> — while their phone stacks up
              notifications from apps that lack personalized context, fragment the user&rsquo;s attention through gamified
              loops, and keep people isolated from one another.
            </Bubble>

            <PullQuote>
              We&rsquo;re drowning in metrics and starving for insight — and doing it alone.
            </PullQuote>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              <StatViz
                value={45}
                suffix="%"
                variant="fill"
                ringPercent={45}
                colorHex={PRISM.movement.ring}
                colorClass={PRISM.movement.text}
                label={<>admit they feel <strong className="font-semibold text-neutral-800">burnt out</strong> from manually feeding dashboards</>}
              />
              <StatViz
                value={6}
                suffix=" apps"
                variant="dashed"
                colorHex={PRISM.nutrition.ring}
                colorClass={PRISM.nutrition.text}
                label={<>the average person juggles to track basic wellness</>}
              />
              <StatViz
                value={4.1}
                decimals={1}
                suffix=" days"
                variant="fill"
                ringPercent={41}
                colorHex={PRISM.restoration.ring}
                colorClass={PRISM.restoration.text}
                label={<>mean engagement before users quietly quit <span className="italic text-neutral-400">(Stanford)</span></>}
              />
            </div>

            <Bubble delayClass="[animation-delay:100ms]">
              The tools excel at data, but <strong className="font-semibold text-neutral-900">fail at providing meaning, context, and a supportive community that motivates people to move towards their goals.</strong>
            </Bubble>

            <CardRow>
              {[
                <AccentCard key="apple" barClass="bg-violet-300" title="Apple Health">
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Strength</span>trusted passive aggregation.</p>
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Pitfall</span><strong className="font-semibold text-neutral-900">hoards numbers with no context</strong>, only speaks up when something drops into a danger zone.</p>
                </AccentCard>,
                <AccentCard key="strava" barClass="bg-violet-300" title="Strava">
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Strength</span>unmatched workout tracking.</p>
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Pitfall</span>a <strong className="font-semibold text-neutral-900">high-pressure athletic feed</strong> that ignores sleep, nutrition, and mindfulness.</p>
                </AccentCard>,
                <AccentCard key="whoop" barClass="bg-violet-300" title="Whoop / Oura">
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Strength</span>deep biometrics.</p>
                  <p><span className="mr-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Pitfall</span>seals you in a <strong className="font-semibold text-neutral-900">private data silo</strong>, cut off from the people you live alongside.</p>
                </AccentCard>,
              ]}
            </CardRow>

            <PullQuote>
              Humans are social creatures. <strong className="font-bold text-neutral-900">Why are we doing wellness alone?</strong>
            </PullQuote>

            <Bubble delayClass="[animation-delay:100ms]">
              Spectra&rsquo;s bet: the missing layer isn&rsquo;t more tracking — it&rsquo;s{" "}
              <strong className="font-semibold text-neutral-900">AI that makes the data personal, and community that makes it stick.</strong>
            </Bubble>

            <BubbleScrollSection delayClass="[animation-delay:150ms]">
              <p className="mx-auto max-w-4xl pl-2 text-left text-lg sm:text-xl text-neutral-500 sm:pl-4">
                Two questions drove everything:
              </p>
            </BubbleScrollSection>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              <FadeInSection>
                <SlideImage
                  src="/projects/GLContent/spectraSlides/Spectra - Final (1).png"
                  alt="How might we transform isolated wellness silos into shared, community spaces of growth?"
                />
              </FadeInSection>
              <FadeInSection className="[transition-delay:250ms]">
                <SlideImage
                  src="/projects/GLContent/spectraSlides/Spectra - Final (2).png"
                  alt="And.. move from tracking data to uncovering insight?"
                />
              </FadeInSection>
            </div>
          </div>

          {/* ===================== SECTION 2 — RESEARCH & DISCOVERY ===================== */}
          <div id="chapter-02" className="space-y-14">
            <SectionHeader eyebrow="Chapter 02" title="Research & Discovery" />

            <Split
              media={
                <SlideImage
                  src="/projects/GLContent/spectraSlides/persona.png"
                  alt="Meet Sam persona slide: 37-year-old project manager and mother of two, with her goals and frustrations"
                />
              }
            >
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Persona</span>
                <h4 className="font-serif text-3xl font-semibold text-neutral-900 tracking-tight">Meet Sam</h4>
                <p className="text-sm text-neutral-500 mt-1">37, project manager & mother of two, SF. Hectic, fast-paced.</p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-md">
                <p className="font-serif text-lg italic leading-relaxed text-neutral-800">
                  &ldquo;My apps give me plenty of numbers, but they leave me completely out of the loop.&rdquo;
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Goals</span>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    balance fitness, nutrition & connection <strong className="font-semibold text-neutral-900">without burnout</strong>; stay bonded to family and peers.
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Frustrations</span>
                  <p className="text-sm leading-relaxed text-neutral-600">fragmented, sterile data; a creeping sense of disconnection.</p>
                </div>
              </div>
            </Split>

            <Bubble>
              Mapping the landscape against Sam frames wellness as{" "}
              <strong className="font-semibold text-neutral-900">a chore that must be maintained daily</strong> rather than a
              sustainable lifestyle. Current systems lack a layer that{" "}
              <strong className="font-semibold text-neutral-900">sees through data points while also bringing peer connection into the mix.</strong>
            </Bubble>
          </div>

          {/* ===================== SECTION 3 — IDEATION ===================== */}
          <div id="chapter-03" className="space-y-14">
            <SectionHeader eyebrow="Chapter 03" title="Ideation: The Five-Axis Model" />

            <Bubble>
              Spectra transforms wellness from <strong className="font-semibold text-neutral-900">scores to be maxed</strong>{" "}
              into <strong className="font-semibold text-neutral-900">five spheres to be understood.</strong> On each, the AI says{" "}
              <strong className="font-semibold text-neutral-900">how you&rsquo;re doing in plain language,</strong> then acts as your{" "}
              <strong className="font-semibold text-neutral-900">personalized coach</strong> that sees across the entire spectrum
              of your wellness and provides you with <strong className="font-semibold text-neutral-900">actionable goals.</strong>
            </Bubble>

            <FadeInSection>
              <SlideImage
                src="/projects/GLContent/spectraSlides/newValueCapture.png"
                alt="Introducing Spectra slide: a prism heart with five colored rays labeled Movement, Nutrition, Restoration, Mindfulness, and Connection"
                className="mx-auto max-w-3xl"
              />
            </FadeInSection>
          </div>

          {/* ===================== SECTION 4 — BUILDING THE PROTOTYPE ===================== */}
          <div id="chapter-04" className="space-y-14">
            <SectionHeader eyebrow="Chapter 04" title="Building the Prototype" />

            <BubbleScrollSection>
              <p className="mx-auto max-w-3xl text-center text-lg sm:text-xl text-neutral-500">
                I started out with the following wireframes to scope out the application experience.
              </p>
            </BubbleScrollSection>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              <FadeInSection>
                <SlideImage
                  src="/projects/GLContent/wireframe1Spectra.jpeg"
                  alt="Spectra wireframe, screen 1"
                  width={1384}
                  height={681}
                />
              </FadeInSection>
              <FadeInSection className="[transition-delay:150ms]">
                <SlideImage
                  src="/projects/GLContent/wireframe2Spectra.jpeg"
                  alt="Spectra wireframe, screen 2"
                  width={1683}
                  height={758}
                />
              </FadeInSection>
            </div>

            <Bubble>
              Using agentic AI, I was then able to build out the technical layers that ingest wearable and phone signals, score
              them into weighted wellness indices through fixed deterministic formulas, and layer a single grounded AI call on
              top that reasons over those computed numbers.
            </Bubble>

            <FadeInSection>
              <SlideImage
                src="/projects/GLContent/spectraSlides/archetecture.png"
                alt="The Architecture slide: a five-step pipeline — Data Ingestion, Deterministic FE, AI Synthesis Layer, Conversational Layer, and Social Layer — governed by the Integrity Principle that the model never invents a number, it only reasons over data already computed"
                className="mx-auto max-w-2xl"
              />
            </FadeInSection>

            <Bubble>
              The real lesson was operational: <strong className="font-semibold text-neutral-900">how to build like a team of
              several when you&rsquo;re a team of one.</strong> The prototype outgrew static mockups — so I built it.
            </Bubble>

            <div className="min-h-screen flex items-center">
              <Split media={<PhoneVideo src="/projects/GLContent/demo1.mov" className="max-w-[280px] mx-auto" />}>
                <SplitTitle>Onboarding</SplitTitle>
                <SplitBubble>
                  The user enters their info and sets their preferences, assigning how much priority each sphere of wellness
                  gets, so the experience is shaped around what matters to them rather than standardized goals.
                </SplitBubble>
              </Split>
            </div>

            <div className="min-h-screen flex items-center">
              <Split
                reverse
                media={<PhoneVideo src="/projects/GLContent/demo2.mov" className="max-w-[280px] mx-auto" />}
              >
                <SplitTitle>Diving into Wellness</SplitTitle>
                <SplitBubble>
                  Spectra translates the day&rsquo;s data into a plain-language status for each wellness sphere, surfaces
                  &ldquo;Today&rsquo;s Lenses&rdquo; insights (an aggregate of the day&rsquo;s data at a glance), and points to
                  the single action worth focusing on in each sphere, so the user always knows where they stand without
                  decoding a wall of metrics.
                </SplitBubble>
                <SplitBubble>
                  The user can also dive deeper with a personalized AI agent that sees across their entire spectrum, offering
                  tailored advice and goals.
                </SplitBubble>
              </Split>
            </div>

            <div className="min-h-screen flex items-center">
              <Split media={<PhoneVideo src="/projects/GLContent/demo3.mov" className="max-w-[280px] mx-auto" />}>
                <SplitTitle>The Social Layer</SplitTitle>
                <SplitBubble>
                  Wellness stops being solitary. The Home tab becomes a &ldquo;Carousel of Light&rdquo; — a rotating ring of
                  the user&rsquo;s circle. Tap a friend and the whole dashboard flips from your numbers to a no-numbers
                  glimpse of how they&rsquo;re doing, inciting connection without comparison.
                </SplitBubble>
                <SplitBubble>
                  Interacting with friends and family about their achievements creates a validation loop, drawing people
                  toward each other as well as their goals.
                </SplitBubble>
                <SplitBubble>
                  A social feed surfaces ideas, routines, and recipes from others, plus real-world community events happening
                  nearby.
                </SplitBubble>
              </Split>
            </div>

          </div>

          {/* ===================== SECTION 5 — WHERE IT LANDED & WHAT'S NEXT ===================== */}
          <div id="chapter-05" className="space-y-14">
            <SectionHeader eyebrow="Chapter 05" title="Where It Landed & What's Next" />

            <Bubble>
              This internship changed how I build. I learned to orchestrate agentic tools — a generated frontend, a
              scaffolded backend, a persona-driven test harness — into a single working application built around real LLM
              integration.
            </Bubble>

            <Bubble>
              Presenting it to company leadership and mentors confirmed the vision and gave me the feedback to grow it
              further. With these experiences, I now have the tools to expand this vision further.
            </Bubble>

            <FadeInSection>
              <SlideImage
                src="/projects/GLContent/spectraSlides/nextSteps.png"
                alt="Next Horizon roadmap slide: real data integration, from placeholder to real, and monetization without ads"
                className="mx-auto max-w-2xl"
              />
            </FadeInSection>
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
