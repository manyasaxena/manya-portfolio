"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, StarHalf } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

export interface ReelMovie {
  id: string;
  title: string;
  year: string;
  poster: string;
  rating?: number;
  review?: string;
  link: string;
}

const FRAME_WIDTH_CLASS = "w-32 sm:w-40 md:w-44";
const FRAME_PADDING_CLASS = "px-[calc(50%-4rem)] sm:px-[calc(50%-5rem)] md:px-[calc(50%-5.5rem)]";

function SprocketStrip() {
  return (
    <div
      aria-hidden="true"
      className="h-2.5 w-full shrink-0 sm:h-3"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(250,250,248,0.85) 0px, rgba(250,250,248,0.85) 7px, transparent 7px, transparent 18px)",
        backgroundPosition: "center",
      }}
    />
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const position = i + 1;
        if (rating >= position) {
          return <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />;
        }
        if (rating >= position - 0.5) {
          return <StarHalf key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />;
        }
        return <Star key={i} className="h-4 w-4 text-white/20" />;
      })}
    </div>
  );
}

export function FilmReel({ movies }: { movies: ReelMovie[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      const frame = frameRefs.current[index];
      if (!container || !frame) return;
      const target = frame.offsetLeft - (container.clientWidth - frame.offsetWidth) / 2;
      container.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  // The frame nearest the center of the scroll container is the one "in the gate."
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = frameRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    frameRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [movies.length]);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(movies.length - 1, index));
    scrollToIndex(clamped);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  // Touch devices already get native swipe from overflow-x-auto; this adds
  // click-and-drag scrolling for mouse users, who have no native equivalent.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !scrollRef.current) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
  };
  const endDrag = () => {
    isDragging.current = false;
  };

  if (movies.length === 0) return null;
  const active = movies[activeIndex];

  return (
    <div
      className="overflow-hidden rounded-3xl bg-neutral-950 shadow-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Film diary reel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SprocketStrip />

      <div className="relative py-8 sm:py-10">
        {/* The gate — a fixed lit window in the horizontal center */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg ring-2 ring-amber-300/70 shadow-[0_0_40px_10px_rgba(251,191,36,0.15)] ${FRAME_WIDTH_CLASS}`}
          style={{ aspectRatio: "2 / 3" }}
        />

        <div
          ref={scrollRef}
          className={`flex snap-x snap-mandatory gap-3 overflow-x-auto sm:gap-4 ${FRAME_PADDING_CLASS} cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          style={{ scrollBehavior: reducedMotion ? "auto" : "smooth" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {movies.map((movie, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={movie.id}
                ref={(el) => {
                  frameRefs.current[index] = el;
                }}
                className={`shrink-0 snap-center ${FRAME_WIDTH_CLASS}`}
              >
                <a
                  href={movie.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${movie.title}${movie.year ? `, ${movie.year}` : ""} on Letterboxd`}
                  tabIndex={-1}
                  className={`relative block overflow-hidden rounded-md border transition-all duration-500 ease-out ${
                    isActive
                      ? "scale-100 border-amber-300/60 opacity-100 grayscale-0"
                      : "scale-90 border-white/10 opacity-50 grayscale"
                  }`}
                  style={{ aspectRatio: "2 / 3" }}
                >
                  <Image
                    src={movie.poster}
                    alt={`${movie.title}${movie.year ? ` (${movie.year})` : ""} poster`}
                    fill
                    unoptimized
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                  />
                </a>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous film"
          className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white disabled:opacity-30 sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === movies.length - 1}
          aria-label="Next film"
          className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white disabled:opacity-30 sm:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <SprocketStrip />

      {/* Position dots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-neutral-950 px-4 pb-4 pt-3">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${movie.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full transition-all sm:h-2 sm:w-2 ${
              index === activeIndex ? "bg-amber-300" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Active film detail panel */}
      <div className="border-t border-white/10 bg-neutral-950 px-6 py-8 sm:px-10">
        <div aria-live="polite" className="sr-only">
          {active.title}
          {active.year ? `, ${active.year}` : ""}
          {active.rating !== undefined ? `, rated ${active.rating} out of 5 stars` : ""}
        </div>

        <div className="mx-auto max-w-xl text-center">
          <a
            href={active.link}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-serif text-2xl text-white transition-colors hover:text-amber-300 sm:text-3xl"
          >
            {active.title}
            {active.year && (
              <span className="ml-2 font-sans text-lg font-normal text-white/40 sm:text-xl">{active.year}</span>
            )}
          </a>

          {active.rating !== undefined && (
            <div className="mt-3 flex justify-center">
              <StarRating rating={active.rating} />
            </div>
          )}

          {active.review && (
            <div
              className="mt-5 font-serif text-lg leading-relaxed text-white/70 sm:text-xl [&_a]:underline [&_a]:decoration-white/30 [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: active.review }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
