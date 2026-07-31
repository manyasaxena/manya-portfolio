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

// Deeper kraft-paper tone for the strip band itself — derived from the site's
// own warm tokens (a wash of --warm-foreground over --warm), not a new color.
const FILM_STRIP_BG = "color-mix(in oklch, var(--warm-foreground) 14%, var(--warm))";
const SPROCKET_HOLE_COLOR = "var(--background)";

function SprocketStrip() {
  return (
    <div
      aria-hidden="true"
      className="h-2.5 w-full shrink-0 sm:h-3"
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${SPROCKET_HOLE_COLOR} 0px, ${SPROCKET_HOLE_COLOR} 7px, transparent 7px, transparent 18px)`,
        backgroundPosition: "center",
        backgroundColor: FILM_STRIP_BG,
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
          return <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />;
        }
        if (rating >= position - 0.5) {
          return <StarHalf key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />;
        }
        return <Star key={i} className="h-4 w-4 text-[var(--warm-foreground)]/25" />;
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

  // Single source of truth for "which film is active": activeIndex. Two paths
  // write to it — (1) goTo(), called by buttons/dots/keyboard, sets it
  // immediately so the dot/border/info panel update in lockstep with the
  // scroll animation instead of lagging behind it, and (2) this observer,
  // which keeps it in sync when the user free-scrolls or drags the strip
  // instead of using a control. The observer's root is shrunk to a hairline
  // strip at the exact horizontal center (the gate) via rootMargin, so at most
  // one non-overlapping frame can ever intersect it — unlike a whole-container
  // threshold, which several frames can satisfy at once and previously caused
  // the gate/dot/info to fall out of sync.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((e) => e.isIntersecting);
        if (!entry) return;
        const idx = frameRefs.current.findIndex((el) => el === entry.target);
        if (idx !== -1) setActiveIndex(idx);
      },
      { root: container, rootMargin: "0px -49% 0px -49%", threshold: 0 }
    );

    frameRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [movies.length]);

  const goTo = (index: number) => {
    const wrapped = ((index % movies.length) + movies.length) % movies.length;
    setActiveIndex(wrapped);
    scrollToIndex(wrapped);
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
      className="overflow-hidden rounded-3xl bg-[var(--warm)] shadow-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Film diary reel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SprocketStrip />

      <div className="relative py-8 sm:py-10" style={{ backgroundColor: FILM_STRIP_BG }}>
        {/* The gate — a fixed lit window in the horizontal center */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg ring-2 ring-[var(--accent-foreground)]/40 ${FRAME_WIDTH_CLASS}`}
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
                  className={`relative block overflow-hidden rounded-md transition-all duration-500 ease-out ${
                    isActive
                      ? "scale-100 border-2 border-[var(--accent-foreground)]/80 opacity-100"
                      : "scale-90 border border-[var(--warm-foreground)]/15 opacity-60 sepia-[.55] saturate-[.85]"
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
          aria-label="Previous film"
          className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--warm-foreground)]/30 bg-[var(--background)] text-[var(--warm-foreground)] shadow-md transition-colors hover:border-[var(--warm-foreground)]/50 hover:bg-[var(--accent)] sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next film"
          className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--warm-foreground)]/30 bg-[var(--background)] text-[var(--warm-foreground)] shadow-md transition-colors hover:border-[var(--warm-foreground)]/50 hover:bg-[var(--accent)] sm:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <SprocketStrip />

      {/* Position dots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[var(--warm)] px-4 pb-4 pt-3">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${movie.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full transition-all sm:h-2 sm:w-2 ${
              index === activeIndex
                ? "bg-[var(--accent-foreground)]"
                : "bg-[var(--warm-foreground)]/20 hover:bg-[var(--warm-foreground)]/40"
            }`}
          />
        ))}
      </div>

      {/* Active film detail panel */}
      <div className="border-t border-[var(--warm-foreground)]/10 bg-[var(--warm)] px-6 py-8 sm:px-10">
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
            className="inline-block font-serif text-2xl text-[var(--warm-foreground)] transition-colors hover:text-[var(--accent-foreground)] sm:text-3xl"
          >
            {active.title}
            {active.year && (
              <span className="ml-2 font-sans text-lg font-normal text-[var(--muted-foreground)] sm:text-xl">
                {active.year}
              </span>
            )}
          </a>

          {active.rating !== undefined && (
            <div className="mt-3 flex justify-center">
              <StarRating rating={active.rating} />
            </div>
          )}

          {active.review && (
            <div
              className="mt-5 font-serif text-lg leading-relaxed text-[var(--warm-foreground)]/80 sm:text-xl [&_a]:underline [&_a]:decoration-[var(--warm-foreground)]/30 [&_p+p]:mt-3"
              dangerouslySetInnerHTML={{ __html: active.review }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
