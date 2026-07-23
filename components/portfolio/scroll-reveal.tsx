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
