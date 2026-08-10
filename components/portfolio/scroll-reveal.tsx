"use client";

import { useState, useEffect, useRef } from "react";

// Liquid bubble scroll observer with custom staggered delay property
export function BubbleScrollSection({ children, delayClass = "" }: { children: React.ReactNode; delayClass?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -150px 0px"
      }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1100 ease-out transform ${delayClass} ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 animate-liquid-bubble"
          : "opacity-0 translate-y-24 scale-[0.94]"
      }`}
    >
      {children}
    </div>
  );
}

// Very slow fade reveal — phone interfaces gently fade into view on scroll (no slide, no bounce)
export function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -120px 0px"
      }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity duration-[3500ms] ease-out ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

// Gentle slide-up + fade reveal — text content rises slowly from below on scroll into view
export function SlideUpSection({
  children,
  delay = 0,
  duration = 1200,
  distance = 96,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  // The observed wrapper stays in its natural position; only the inner child is
  // transformed. (Observing a translated element can push it below the viewport
  // so the observer never fires — this keeps the trigger reliable at page edges.)
  // Distance is applied via inline style (rather than a translate-y-* class) so any
  // pixel value can be passed in without relying on Tailwind's fixed spacing scale.
  return (
    <div ref={elementRef} className={className}>
      <div
        style={{
          transitionDelay: `${delay}ms`,
          transitionDuration: `${duration}ms`,
          transform: isVisible ? "translateY(0)" : `translateY(${distance}px)`,
          opacity: isVisible ? 1 : 0,
        }}
        className="transition-all ease-[cubic-bezier(0.34,1.32,0.46,1)]"
      >
        {children}
      </div>
    </div>
  );
}

// Pure opacity fade (no slide) with a configurable delay — used to reveal text only
// after a preceding staggered animation (e.g. a row of bubbles) has fully settled.
export function FadeRevealSection({
  children,
  delay = 0,
  duration = 2600,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={className}>
      <div
        style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
        className={`transition-opacity ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

// Special Horizontal Scroll Observer for accent bubbles to slide in from the left
export function SlideFromLeftSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1100 ease-out transform ${
        isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 -translate-x-32 scale-[0.95]"
      }`}
    >
      {children}
    </div>
  );
}
