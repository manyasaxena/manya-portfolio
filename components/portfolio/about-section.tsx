import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 sm:px-8">
      
      {/* Header matching the Projects section */}
      <div className="mb-16 flex flex-col items-center text-center">
        <span className="rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700">
          Behind the Pixels
        </span>
        <h2 className="mt-6 font-serif text-5xl text-neutral-800 sm:text-6xl">
          Hey there!
        </h2>
      </div>

      {/* Image & Paragraph Container */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-20">
        
        {/* Profile Image */}
        <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-md md:h-80 md:w-80">
           <Image src="/manya-image.jpeg" alt="Manya" fill className="object-cover" />
        </div>

        {/* Text Container - Clean and simple */}
        <div className="max-w-xl space-y-6 text-left text-lg leading-relaxed text-neutral-600">
          <p>
            I’m Manya, a Cognitive Science student at UCSC driven to craft meaningful experiences rooted in intention, ethics, and human connection. I’m deeply interested in the why behind the products we build: how they shape behavior, influence thought, and impact people’s lives. With a background spanning computer science and psychology, I explore how technology can move beyond functionality to create experiences that are thoughtful, inclusive, and genuinely meaningful.
          </p>
          <p>
            Beyond academics, I’m an avid reader, artist, writer, and dancer. I’m drawn to immersive experiences that either make me feel something deeply or open up new ways of seeing the world. Creativity, for me, is a way of exploring meaning—both within myself and in the stories and perspectives of others.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-20 flex flex-wrap justify-center gap-4">
        
        {/* Up to Projects Button */}
        <a 
          href="#projects" 
          className="group flex items-center gap-2 rounded-full border-2 border-neutral-200 bg-white px-6 py-3 font-medium tracking-wide text-neutral-800 shadow-sm transition-all hover:-translate-y-1 hover:border-neutral-300 hover:bg-neutral-50"
        >
          <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
          <span>Projects</span>
        </a>

        {/* Down to What I'm Up To Button */}
        <a 
          href="#thoughts" 
          className="group flex items-center gap-2 rounded-full bg-neutral-800 px-6 py-3 font-medium tracking-wide text-white shadow-sm transition-all hover:-translate-y-1 hover:bg-neutral-700"
        >
          <span>See what I'm up to</span>
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
        </a>

      </div>
    </section>
  );
}