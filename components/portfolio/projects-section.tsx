"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  spineColor: string;
  link: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Frame",
    subtitle: "An ethical take on social media",
    description: "A redesigned social platform optimizing for choice driven algorithmic feeds, real world social connection, and mindful media consumption.",
    image: "/projects/frame-cover.jpg", // Assuming this one is actually a .jpg based on your folder!
    tags: ["UX Research", "Mobile App", "Ethics"],
    spineColor: "book-spine-1",
    link: "/projects/frame",
  },
  {
    id: "2",
    title: "Sparkframe",
    subtitle: "Animation & art learning hub",
    description: "A creative hub of exploration, creation, and learning for animators and artists.",
    image: "/projects/sparkframe/sparkframe-cover.png", // Changed from .jpg to .png
    tags: ["UX/UI", "Web App", "Creative"],
    spineColor: "book-spine-2",
    link: "/projects/sparkframe",
  },
  {
    id: "3",
    title: "BSGD Club Branding",
    subtitle: "UCSC club identity",
    description: "Developing a branding identity for UCSC's Baby Slug Game Development Club.",
    image: "/projects/bsgd/bsgd-cover.png", // Changed from .jpg to .png
    tags: ["Branding", "Visual Design", "Identity"],
    spineColor: "book-spine-3",
    link: "/projects/bsgd",
  },
  {
    // The 4th book is just a decorative prop on the shelf!
    id: "4",
    title: "", 
    subtitle: "",
    description: "",
    image: "",
    tags: [],
    spineColor: "book-spine-4",
    link: "#",
  },
];
export function ProjectsSection() {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const shelfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (shelfRef.current) {
        const rect = shelfRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        setMouseX(x);
      }
    };

    const shelf = shelfRef.current;
    if (shelf) {
      shelf.addEventListener("mousemove", handleMouseMove);
      return () => shelf.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section id="projects" className="pb-20 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Section header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700">
            Featured Work
          </span>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">Projects</h2>
          <p className="mt-3 text-muted-foreground">Hover over the spines to explore</p>
        </div>

        {/* Bookshelf */}
        <div ref={shelfRef} className="relative mt-8">
          
          {/* Light brown backing wall / back panel */}
          <div className="absolute inset-x-0 bottom-0 top-12 rounded-t-lg border border-[#e8dcc4] bg-[#f4ece1]/60 backdrop-blur-sm" />

          {/* Top shelf bar */}
          <div className="absolute inset-x-0 top-12 h-3 rounded-t-sm border-b border-[#c4a98a] bg-[#d4bca1] shadow-[0_2px_10px_rgba(0,0,0,0.05)]" />

          {/* Bottom Shelf background with wood color */}
          <div className="absolute inset-x-0 bottom-0 h-5 rounded-b-lg border-t border-[#e8dcc4] bg-gradient-to-r from-[#d4bca1] via-[#c4a98a] to-[#d4bca1] shadow-md" />
          <div className="absolute inset-x-0 bottom-5 h-2 bg-gradient-to-b from-transparent to-black/10" />
          
          {/* Books container */}
          <div className="relative flex min-h-[380px] items-end justify-center gap-3 pb-6 md:min-h-[480px] md:gap-4">
            {projects.map((project, index) => {
              const isHovered = hoveredBook === project.id;
              const tiltAngle = (mouseX - (index + 0.5) / projects.length) * 8;
              const hasContent = project.title !== ""; // Used to check if it's a real book
              
              return (
                <div
                  key={project.id}
                  className={`group relative ${hasContent ? 'cursor-pointer' : 'cursor-default'}`}
                  onMouseEnter={() => hasContent && setHoveredBook(project.id)}
                  onMouseLeave={() => hasContent && setHoveredBook(null)}
                  style={{
                    zIndex: isHovered ? 50 : projects.length - index,
                    transform: `
                      rotateY(${isHovered ? 0 : tiltAngle}deg)
                      translateZ(${isHovered ? 30 : 0}px)
                      scale(${isHovered ? 1.05 : 1})
                    `,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Book spine */}
                  <div 
                    className={`
                      relative h-64 w-16 overflow-hidden rounded-sm md:h-80 md:w-20
                      ${project.spineColor}
                      shadow-lg shadow-black/30
                      transition-all duration-500
                      ${isHovered ? "scale-95 opacity-0" : "opacity-100"}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20" />
                    
                    {/* Spine text (Will dynamically hide on the blank 4th book) */}
                    {hasContent && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span 
                          className="whitespace-nowrap font-serif text-sm font-medium tracking-wide text-white md:text-base"
                          style={{ 
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {project.title}
                        </span>
                      </div>
                    )}

                    {/* Book spine decoration and number */}
                    {hasContent && (
                      <>
                        <div className="absolute left-1/2 top-4 h-1 w-8 -translate-x-1/2 rounded-full bg-white/40" />
                        <div className="absolute bottom-4 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-white/50">
                          <span className="text-xs text-white">{index + 1}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Expanded card (Hover state) - Only generates if the book has content! */}
                  {hasContent && (
                    <Link 
                      href={project.link}
                      className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2
                        w-72 overflow-hidden rounded-xl border border-white/60 bg-white/95 backdrop-blur-xl md:w-80
                        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]
                        origin-bottom transition-all duration-500
                        ${isHovered ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}
                      `}
                      style={{
                        transform: isHovered 
                          ? "translateX(-50%) translateY(0)" 
                          : "translateX(-50%) translateY(20px)",
                      }}
                    >
                      {/* Project image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/95 via-transparent to-transparent" />
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                          priority={index === 0}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="font-serif text-xl text-neutral-800">{project.title}</h3>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-purple-600" />
                        </div>
                        <p className="mb-4 text-sm text-neutral-600">{project.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700 border border-purple-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shelf front edge */}
          <div className="absolute inset-x-0 bottom-0 h-6 rounded-b-lg border-t border-amber-700/20 bg-gradient-to-b from-[#b89b7b] to-[#96795b]" />
        </div>

        {/* Navigation to About Section */}
        <div className="mt-12 flex justify-end">
          <a 
            href="#about" 
            className="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span className="tracking-wide">About Me</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-1 group-hover:border-neutral-800 group-hover:bg-neutral-800 group-hover:text-white">
              <ArrowDown className="h-5 w-5" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}