"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BOOK_REVEAL_STAGGER_MS = 350;

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  spineColor: string;
  link: string;
  productName?: string;
}

const projects: Project[] = [
  {
    id: "2",
    title: "Tech4Good",
    subtitle: "Leading AI product design for edtech",
    description: "My journey with UCSC's Tech4Good Lab — from building UI/UX fundamentals on Haven, a pet-adoption concept, to leading the cross-functional team behind byteSized, an AI prototyping tool for higher-ed faculty.",
    image: "/projects/tech4goodContent/tech4good-cover.png",
    tags: ["AI Product", "UX Research", "Team Lead"],
    spineColor: "book-spine-tech4good",
    link: "/projects/sparkframe",
  },
  {
    id: "4",
    title: "GlobalLogic",
    subtitle: "Building an AI product 0-to-1 and presenting it to company leadership",
    description: "During my internship at GlobalLogic, I designed and helped build an AI product end-to-end, then presented the finished work to company leadership.",
    image: "/projects/globallogic-cover.png",
    tags: ["AI Product", "Product Design", "0-to-1"],
    spineColor: "book-spine-globallogic",
    link: "/projects/globallogic",
    productName: "Spectra",
  },
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
    id: "3",
    title: "BSGD Club Branding",
    subtitle: "UCSC club identity",
    description: "Developing a branding identity for UCSC's Baby Slug Game Development Club.",
    image: "/projects/bsgd/bsgd-cover.png", // Changed from .jpg to .png
    tags: ["Branding", "Visual Design", "Identity"],
    spineColor: "book-spine-3",
    link: "/projects/bsgd",
  },
];

export function ProjectsSection() {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [revealedBooks, setRevealedBooks] = useState<Set<string>>(new Set());
  const shelfRef = useRef<HTMLDivElement>(null);

  // The shelf itself is always visible; the books slide in from the right, one by one,
  // only once the shelf scrolls into view. Each book's own reveal is just a delayed
  // state flip — the CSS transition on the book handles the actual sliding motion.
  useEffect(() => {
    const el = shelfRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        projects.forEach((project, index) => {
          setTimeout(() => {
            setRevealedBooks((prev) => new Set(prev).add(project.id));
          }, index * BOOK_REVEAL_STAGGER_MS);
        });
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="overflow-x-hidden pb-20 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700">
            Featured Work
          </span>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">Projects</h2>
          <p className="mt-3 text-muted-foreground">Hover over a spine to explore</p>
        </div>

        {/* Bookshelf — a real wooden niche photo. The container's aspect ratio matches the */}
        {/* source image exactly (795x314) so every offset below can be a plain percentage */}
        {/* of that box instead of a hardcoded pixel value, and stays true at any width. */}
        <div ref={shelfRef} className="relative mt-8 aspect-[795/314] w-full">
          <Image
            src="/projects/bookshelfReal2.png"
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1152px, 100vw"
          />

          {/* Interior floor of the niche. Measured from the photo itself: the inner walls sit at */}
          {/* ~4.6%/~97.8% of the image width, the inner top bevel ends ~12.1% down, and the floor's */}
          {/* front lip (where an object's base reads as "resting on the shelf") sits ~88% down. */}
          {/* A small buffer is built into each offset so nothing touches the frame's bevel edges. */}
          {/* Resting spines are sized/positioned off this box, but the hovered "explore" card below */}
          {/* uses its own fixed size and is free to extend past the shelf photo — it's never clipped. */}
          <div className="absolute" style={{ left: "5%", right: "2.5%", top: "13%", bottom: "12%" }}>
            <div className="flex h-full w-full items-end justify-center gap-[3%]">
              {projects.map((project, index) => {
                const isHovered = hoveredBook === project.id;
                const isRevealed = revealedBooks.has(project.id);

                return (
                  <div
                    key={project.id}
                    className={`
                      group relative cursor-pointer overflow-hidden shadow-lg shadow-black/30
                      transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                      ${isRevealed ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-[220%]"}
                      ${isHovered
                        ? "z-20 h-[400px] w-72 -translate-y-2 rounded-xl md:h-[440px] md:w-80"
                        : "z-10 h-[92%] w-[7%] rounded-sm"}
                    `}
                    onMouseEnter={() => setHoveredBook(project.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    {/* Spine face */}
                    <div
                      className={`
                        absolute inset-0 ${project.spineColor}
                        transition-opacity duration-300
                        ${isHovered ? "opacity-0" : "opacity-100"}
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20" />

                      {/* Spine text */}
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

                      {/* Spine decoration and number */}
                      <div className="absolute left-1/2 top-4 h-1 w-8 -translate-x-1/2 rounded-full bg-white/40" />
                      <div className="absolute bottom-4 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-white/50">
                        <span className="text-xs text-white">{index + 1}</span>
                      </div>
                    </div>

                    {/* Revealed card content, faded in once the spine has widened */}
                    <Link
                      href={project.link}
                      className={`
                        absolute inset-0 flex flex-col bg-white/95 backdrop-blur-xl
                        transition-opacity delay-100 duration-300
                        ${isHovered ? "opacity-100" : "pointer-events-none opacity-0"}
                      `}
                    >
                      {/* Project image */}
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/95 via-transparent to-transparent" />
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-2 overflow-hidden p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-serif text-xl text-neutral-800">{project.title}</h3>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-purple-600" />
                        </div>

                        {project.productName && (
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                              Product Name
                            </span>
                            <span className="text-sm font-semibold text-purple-700">{project.productName}</span>
                          </div>
                        )}

                        <p className="text-sm text-neutral-600">{project.description}</p>

                        {/* Tags */}
                        <div className="mt-auto flex flex-wrap gap-2 pt-1">
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
                  </div>
                );
              })}
            </div>
          </div>
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
