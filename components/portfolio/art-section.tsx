import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Image as ImageIcon } from "lucide-react";
import { artInventory } from "@/data/art-inventory";

export default function ArtSection() {
  // Take the first 3 pieces to show as a preview on the homepage
  const artPreview = artInventory.slice(0, 3);

  return (
    <section 
      id="Art" 
      // Added a negative scroll margin here! Tweak the -80px to get the perfect fit.
      className="flex min-h-screen w-full flex-col justify-center py-24 opacity-90 transition-opacity duration-500 hover:opacity-100 scroll-mt-[-80px]"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        
        {/* Section header & Intro */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <h2 className="whitespace-nowrap font-serif text-4xl text-foreground/85 md:text-5xl">Art</h2>
            <div className="h-px flex-1 bg-purple-200" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
              Art
            </span>
          </div>

          <p className="w-full text-sm leading-relaxed text-muted-foreground/80 md:text-base">
            Drawing is how I step into my imagination and actually see what’s been living in my head. It lets me bring quiet, half-formed ideas to life—whether that’s scenes from books I love, characters I feel deeply connected to, or entirely new worlds. It’s less about appearances and more about translating internal feelings, values, and meaning into something visual.
          </p>
        </div>

        {/* Interactive Flex Accordion Gallery */}
        <div className="flex h-[400px] w-full flex-col gap-4 md:h-[500px] md:flex-row">
          
          {artPreview.map((item) => (
            <div
              key={item.id}
              className="group relative flex-1 cursor-pointer overflow-hidden rounded-2xl border border-white/50 bg-white/40 shadow-xl backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[6] focus:flex-[6]"
            >
              <Image 
                src={item.src} 
                alt={item.title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                sizes="(max-width: 768px) 100vw, 50vw"
              /> 

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="translate-y-4 font-serif text-2xl text-white transition-transform duration-500 group-hover:translate-y-0">
                  {item.title}
                </p>
                <p className="mt-2 translate-y-4 text-xs uppercase tracking-[0.2em] text-white/80 transition-transform delay-75 duration-500 group-hover:translate-y-0">
                  {item.category}
                </p>
              </div>
            </div>
          ))}

          {/* View Full Gallery */}
          <Link
            href="/gallery"
            className="group relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-purple-100 bg-purple-50/50 shadow-inner backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[2] hover:bg-purple-100/50 focus:flex-[2]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-500 group-hover:scale-110">
              <ImageIcon className="h-5 w-5 text-purple-600" />
            </div>
            <span className="whitespace-nowrap font-serif text-lg text-purple-900 transition-all duration-300">
              View full gallery
            </span>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 -translate-x-4 opacity-0 text-purple-600 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>

        </div>

        {/* Navigation to Film Diary */}
        <div className="mt-12 flex justify-end">
          {/* CHANGED: <Link href="#movies"> to <a href="#movies"> 
            This forces the browser to execute a standard anchor jump, bypassing Next.js routing quirks for same-page navigation.
          */}
          <a 
            href="#movies" 
            className="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span className="tracking-wide">My film diary</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-1 group-hover:border-neutral-800 group-hover:bg-neutral-800 group-hover:text-white">
              <ArrowDown className="h-5 w-5" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}