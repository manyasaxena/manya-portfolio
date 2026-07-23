"use client"; // Required for useState and useEffect hooks

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const words = ["builder", "thinker", "designer", "dreamer"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadeState, setFadeState] = useState("translate-y-0 opacity-100");

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Start exit animation (slide up and fade out)
      setFadeState("-translate-y-4 opacity-0");

      setTimeout(() => {
        // 2. Swap the word while hidden
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        
        // 3. Snap down to the bottom instantly to prepare for entry
        setFadeState("translate-y-4 opacity-0");

        // 4. Slide up into its natural center position and fade back in
        setTimeout(() => {
          setFadeState("translate-y-0 opacity-100");
        }, 50); 
      }, 300); // Matches the duration-300 transition time

    }, 2500); // Changes words every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full min-h-screen overflow-hidden px-6 sm:px-8 bg-white flex items-center">
      
      {/* 1. THE GRADIENT LAYER (Fixed at the bottom) */}
      <div className="mesh-gradient-container" />

      {/* Logo & Name */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
        {/* Logo Image */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0">
          <Image
            src="/logo.png"
            alt="MS Logo"
            fill
            className="object-contain object-left"
            sizes="(max-width: 768px) 48px, 56px"
            priority
          />
        </div>
        
        {/* Vertical Divider */}
        <div className="h-6 w-px bg-neutral-300" />
        
        {/* Full Name */}
        <span className="font-serif text-xl tracking-wide text-neutral-700">
          Manya Saxena
        </span>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:items-center md:justify-center md:gap-16 z-10">
        
        {/* Left Side: Text */}
        <div className="animate-blur-in w-full max-w-md space-y-6 text-left md:max-w-none md:flex-1">
          <p className="font-marker text-8xl leading-none text-[#8b2284] -rotate-3">
            hello!
          </p>
          <p className="text-2xl font-semibold text-neutral-800 sm:text-3xl md:text-4xl">
            <span className="bg-gray-200/80 rounded-sm px-4 py-1">
              {"I'm Manya,"}
            </span>
          </p>
          
          {/* Main Description with shifting word container */}
<p className="max-w-md text-base leading-relaxed text-neutral-700 sm:text-lg">
  a
  <span className="inline-block overflow-hidden h-[1.3em] min-w-[90px] align-middle relative top-[1px] pl-3">
    <span
      className={`absolute inset-x-0 bottom-[-1px] pl-3 font-medium italic text-[#8b2284] pr-2 transform transition-all duration-300 ease-in-out ${fadeState}`}
    >
      {words[currentWordIndex]}
    </span>
  </span>
  passionate about leveraging human-computer interaction and cognitive insight
  to turn abstract ideas into user-first realities.
</p>
          <div className="animate-fade-in pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-neutral-800 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <span>Explore Projects</span>
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </a>

            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <span>About Me</span>
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </a>
          </div>
        </div>

        {/* Right Side: Circular Image (Big) */}
        <div className="flex w-full justify-center animate-fade-in md:flex-1 md:justify-end">
          <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[650px] md:w-[650px] shrink-0">
            <Image
              src="/manya-portrait.png"
              alt="Portrait of Manya"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 500px, 800px"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}