import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ChevronRight, Trophy } from "lucide-react";
import type { ReactNode } from "react";
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

// The title bubble — title, hackathon name, date, location, and any awards won.
function ProjectHeader({
  title,
  subtitle,
  date,
  location,
  awards,
}: {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  awards?: string[];
}) {
  return (
    <Bubble>
      <h3 className="font-serif text-3xl text-neutral-900 tracking-tight sm:text-4xl">{title}</h3>
      <p className="mt-2 text-sm font-medium text-emerald-800 sm:text-base">{subtitle}</p>
      <div className="mt-3 space-y-0.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        <p>Date: {date}</p>
        <p>Location: {location}</p>
      </div>
      {awards && awards.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {awards.map((award) => (
            <span
              key={award}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
            >
              <Trophy className="h-3.5 w-3.5" />
              {award}
            </span>
          ))}
        </div>
      )}
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

// A responsive Google Slides embed — 16:9 per Google's own "Publish to web" embed snippet.
function GoogleSlidesEmbed({ src, title }: { src: string; title: string }) {
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

// [PROJECT] — the layout every hackathon project follows: title/media on the left
// (sticky on desktop), flowing prose on the right, vertically centered against each
// other. The slideshow, if any, runs full-width below that row so it reads at a much
// larger size than it could inside the narrow media column.
function ProjectSection({
  num,
  title,
  subtitle,
  date,
  location,
  awards,
  media,
  slideshow,
  children,
}: {
  num: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  awards?: string[];
  media: ReactNode;
  slideshow?: ReactNode;
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
          <ProjectHeader title={title} subtitle={subtitle} date={date} location={location} awards={awards} />
          {media}
        </div>

        <div className="lg:col-span-8">
          <Bubble>
            <div className="space-y-4 sm:space-y-5">{children}</div>
          </Bubble>
        </div>
      </div>

      {slideshow && (
        <FadeInSection>
          <div className="space-y-3">
            <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
              Slideshow presentation
            </span>
            {slideshow}
          </div>
        </FadeInSection>
      )}
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
              <FadeInSection>
                <ProjectImage
                  src="/projects/hackathons/tavusHackImage.jpeg"
                  alt="The CareerQuest team at the PALmaker × Lovable Hackathon"
                  width={800}
                  height={1073}
                />
              </FadeInSection>
            }
            slideshow={
              <CanvaEmbed
                src="https://www.canva.com/design/DAHNzkNWV20/N1oeeeXQi1Bcp6VMLc9OeA/view?embed"
                title="CareerQuest slide deck"
              />
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

          <ProjectSection
            num="02"
            title="Waywise"
            subtitle="Product Consulting Hackathon at Method"
            date="January 2026"
            location="Online"
            awards={["2nd Place", "Best Storytelling"]}
            media={
              <FadeInSection>
                <ProjectImage
                  src="/projects/hackathons/WinHackathon.jpeg"
                  alt="Waywise's 2nd Place and Best Storytelling award at the Product Consulting Hackathon hosted by Method"
                  width={1280}
                  height={805}
                />
              </FadeInSection>
            }
            slideshow={
              <GoogleSlidesEmbed
                src="https://docs.google.com/presentation/d/1VGat7KLaW4MPJ9XEfqIwFbh3kt6fejstDTWPHSQOlnc/embed?start=false&loop=false&delayms=3000"
                title="Waywise slide deck"
              />
            }
          >
            <Paragraph>Campus transit is the backbone of daily student life.</Paragraph>

            <Paragraph>
              However, university fleets still managed with fragmented data, reactive repairs, and guesswork. This
              leaves students stranded when buses unexpectedly break down.
            </Paragraph>

            <Paragraph>
              WayWise transforms campus mobility by centralizing fleet operations into an intelligent, real-time
              dashboard. Instead of scrambling after a breakdown occurs, transit operators gain live visibility into
              vehicle health metrics, predictive maintenance schedules, and route efficiency. That proactive
              visibility turns unpredictable transit delays into dependable, sustainable campus infrastructure.
            </Paragraph>

            <Paragraph>
              We built intuitive predictive tracking and sustainability insights directly into the platform:
              empowering universities to optimize routes, cut emissions, and keep fleets running smoothly before
              problems ever arise.
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
