import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ChevronRight, Image as ImageIcon, Presentation } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { BubbleScrollSection, FadeInSection } from "@/components/portfolio/scroll-reveal";

/* ---------- Local building blocks ---------- */

// [BUBBLE] — rounded soft-shadow card, scroll-animated the same way as the rest of the
// site (liquid-bubble reveal via BubbleScrollSection).
function Bubble({ children }: { children: ReactNode }) {
  return (
    <BubbleScrollSection>
      <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-md backdrop-blur-2xl sm:p-7">
        {children}
      </div>
    </BubbleScrollSection>
  );
}

// A single flowing paragraph, spaced from its neighbors — sits inside the body bubble.
function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">{children}</p>;
}

// The title bubble — title, hackathon name, date, location.
function ProjectHeader({
  title,
  subtitle,
  date,
  location,
}: {
  title: string;
  subtitle: string;
  date: string;
  location: string;
}) {
  return (
    <Bubble>
      <h3 className="font-serif text-3xl text-neutral-900 tracking-tight sm:text-4xl">{title}</h3>
      <p className="mt-2 text-sm font-medium text-emerald-800 sm:text-base">{subtitle}</p>
      <div className="mt-3 space-y-0.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        <p>Date: {date}</p>
        <p>Location: {location}</p>
      </div>
    </Bubble>
  );
}

// A real project photo — rendered at its natural aspect ratio (never cropped via object-cover).
function ProjectImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-md backdrop-blur-md">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
    </div>
  );
}

// A responsive Canva embed — 16:9 per Canva's own embed snippet.
function CanvaEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-md backdrop-blur-md"
      style={{ paddingTop: "56.25%" }}
    >
      <iframe
        loading="lazy"
        src={src}
        title={title}
        allow="fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

// A dashed placeholder rectangle — used until a project has real media to show.
function MediaPlaceholder({ label, icon: Icon }: { label: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/80">
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 p-6 text-center">
        <Icon className="h-7 w-7 text-neutral-300" />
        <span className="max-w-[80%] text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</span>
      </div>
    </div>
  );
}

// [PROJECT] — the two-column layout every hackathon project follows: title/media on the
// left (sticky on desktop), flowing prose on the right. The two columns are vertically
// centered against each other, so a short write-up never leaves a gap under itself.
function ProjectSection({
  num,
  title,
  subtitle,
  date,
  location,
  media,
  children,
}: {
  num: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  media: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-10">
      <BubbleScrollSection>
        <div className="border-b border-neutral-200/70 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Project {num}</span>
        </div>
      </BubbleScrollSection>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="space-y-6 lg:sticky lg:top-12 lg:col-span-4">
          <ProjectHeader title={title} subtitle={subtitle} date={date} location={location} />
          {media}
        </div>

        <div className="lg:col-span-8">
          <Bubble>
            <div className="space-y-4 sm:space-y-5">{children}</div>
          </Bubble>
        </div>
      </div>
    </div>
  );
}

export default function HackathonsProjectPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white px-6 py-16 font-sans text-neutral-800 selection:bg-emerald-200 selection:text-emerald-900 sm:px-8">

      {/* Ambient mesh — soft, muted greens, matching the shelf spine's color */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-8%] left-[-8%] h-[45vw] w-[45vw] rounded-full bg-emerald-600/9 blur-[140px] animate-[driftA_20s_ease-in-out_infinite]" />
        <div className="absolute top-[18%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-green-700/8 blur-[130px] animate-[driftB_22s_ease-in-out_infinite] [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[8%] h-[42vw] w-[42vw] rounded-full bg-teal-700/7 blur-[130px] animate-[driftC_19s_ease-in-out_infinite] [animation-delay:4s]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        <Link
          href="/#projects"
          className="group mb-10 inline-flex items-center gap-2 text-base font-medium text-neutral-500 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        <header className="mb-16 space-y-4">
          <span className="inline-block w-fit rounded-full bg-emerald-900/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-900">
            Hackathons
          </span>
          <div className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-xs backdrop-blur-2xl sm:p-10">
            <h1 className="font-serif text-5xl tracking-tight text-neutral-900 sm:text-6xl md:text-7xl">Hackathons</h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-neutral-500">
              A collection of some of my favorite hackathon projects I&rsquo;ve created: from pitch to product.
            </p>
          </div>
        </header>

        <div className="space-y-24">

          <ProjectSection
            num="01"
            title="CareerQuest"
            subtitle="PALmaker × Lovable Hackathon at Tavus Labs"
            date="06/27/2026"
            location="SF"
            media={
              <>
                <FadeInSection>
                  <ProjectImage
                    src="/projects/hackathons/tavusHackImage.jpeg"
                    alt="The CareerQuest team at the PALmaker × Lovable Hackathon"
                    width={800}
                    height={1073}
                  />
                </FadeInSection>
                <FadeInSection className="[transition-delay:150ms]">
                  <CanvaEmbed
                    src="https://www.canva.com/design/DAHNzkNWV20/N1oeeeXQi1Bcp6VMLc9OeA/view?embed"
                    title="CareerQuest slide deck"
                  />
                </FadeInSection>
              </>
            }
          >
            <Paragraph>Childhood has always been about exploration.</Paragraph>

            <Paragraph>
              So why do we seat kids in classrooms for 7 hours a day, for 12 years straight, and expect them to
              suddenly know exactly what they want to do for the rest of their lives?
            </Paragraph>

            <Paragraph>
              Inspired by the high-stakes worlds of Jumanji and Temple Run, CareerQuest transforms career exploration
              into an active adventure. Instead of reading about a job, students are dropped into simulated industry
              crises where they have to think critically and solve real problems. That active problem-solving builds
              a sense of purpose that a textbook or slide deck simply cannot replicate.
            </Paragraph>

            <Paragraph>
              To bridge the gap between simulation and reality, we integrated Tavus&rsquo;s PAL (Conversational Video
              AI) into the build. Based on their performance, students can actually have a live conversation to more
              deeply understand where their strengths and passions lie.
            </Paragraph>

            <div className="pt-2">
              <a
                href="https://community.tavus.io/showcase/careerquest-rwi59"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
              >
                Read more about CareerQuest
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </ProjectSection>

          {/* TODO: fill in Waywise's real hackathon name, date, location, media, and write-up. */}
          <ProjectSection
            num="02"
            title="Waywise"
            subtitle="Hackathon Name"
            date="Date"
            location="Location"
            media={
              <>
                <FadeInSection>
                  <MediaPlaceholder label="Project images" icon={ImageIcon} />
                </FadeInSection>
                <FadeInSection className="[transition-delay:150ms]">
                  <MediaPlaceholder label="Slideshow presentation" icon={Presentation} />
                </FadeInSection>
              </>
            }
          >
            <Paragraph>
              Case study coming soon — check back for the full write-up on what Waywise does, the problem it solves,
              and my role in building it.
            </Paragraph>
          </ProjectSection>

        </div>

        <footer className="mt-24 border-t border-neutral-200/60 pt-10 text-center">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
          >
            <span>Browse other portfolio projects</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </footer>

      </div>
    </main>
  );
}
