"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { artInventory } from "@/data/art-inventory";

export default function GalleryPage() {
  // This state tracks which image is currently clicked/enlarged
  const [selectedImage, setSelectedImage] = useState<typeof artInventory[0] | null>(null);

  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Navigation & Header */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <Link 
              href="/#Art" 
              className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="font-serif text-5xl text-neutral-800 md:text-7xl">
              Art Gallery
            </h1>
          </div>
          <p className="max-w-xs text-sm text-neutral-500">
            A collection of digital illustrations, sketches, and concepts created in Procreate.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {artInventory.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedImage(item)}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl cursor-pointer"
            >
              <div className="relative w-full overflow-hidden" style={{ minHeight: "300px" }}>
                <Image
                  src={item.src}
                  alt={item.title}
                  width={800} 
                  height={800} 
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Subtle hover info */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="translate-y-2 font-serif text-2xl text-white transition-transform duration-500 group-hover:translate-y-0">
                  {item.title}
                </p>
                <p className="mt-2 translate-y-2 text-xs uppercase tracking-widest text-white/70 transition-transform delay-75 duration-500 group-hover:translate-y-0">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- THE LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)} // Clicking the background closes it
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Enlarged Image Container */}
          <div 
            className="relative h-[75vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the actual image
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="100vw"
              priority
            />
          </div>

          {/* Title & Category underneath */}
          <div className="mt-8 text-center">
            <h3 className="font-serif text-3xl text-white">{selectedImage.title}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">
              {selectedImage.category}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}