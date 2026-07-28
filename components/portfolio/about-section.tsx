import Image from "next/image";
import { Ancizar_Serif, Playfair_Display } from "next/font/google";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SlideUpSection, FadeRevealSection } from "@/components/portfolio/scroll-reveal";

const ancizarSerif = Ancizar_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-ancizar",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const roleBlocks = [
  {
    label: "..builder",
    body: "..who turns creative instinct into products and experiences with human impact.",
    indent: false,
  },
  {
    label: "..explorer",
    body: "..of literature, art, science, dance, film, and writing — because the best ideas come from being present in the quiet moments of life.",
    indent: true,
  },
  {
    label: "..student",
    body: "..at Berkeley, endlessly curious about the intersection of human cognition, society, and computation.",
    indent: false,
  },
];

const BUBBLE_STAGGER = 400;
const BUBBLE_DURATION = 2200;
const DESCRIPTION_BUFFER = 200;
const DESCRIPTION_DURATION = 2000;
// Each description starts fading in shortly after its own bubble has settled,
// rather than waiting for every bubble in the row to finish.
const descriptionDelay = (i: number) => i * BUBBLE_STAGGER + BUBBLE_DURATION + DESCRIPTION_BUFFER;

// Original washi tape image, angled across the photo's top-left corner.
// `className` positions/sizes it (absolute, offsets, width); rotation is baked in here.
function WashiTape({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`origin-center -rotate-[32deg] ${className}`}>
      <Image
        src="/aboutMaterials/Me/tape.png"
        alt=""
        width={976}
        height={240}
        className="h-auto w-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className={`${ancizarSerif.variable} ${playfairDisplay.variable} flex min-h-screen w-full flex-col items-center justify-center px-6 py-8 sm:px-8`}
    >

      {/* Heading */}
      <h2 className="mb-5 max-w-3xl text-center font-[family-name:var(--font-ancizar)] text-4xl italic leading-tight text-neutral-800 sm:text-5xl md:mb-6 md:text-6xl">
        Hey there! I&rsquo;m{" "}
        <span className="font-[family-name:var(--font-playfair)] font-bold italic text-[#8b2284]">
          Manya
        </span>
        , a
      </h2>

      {/* ===== Desktop / large tablet: open-book spread ===== */}
      <div className="relative mx-auto hidden w-full max-w-6xl lg:block">
        {/* Width is capped by viewport height so the buttons below always stay on screen */}
        <div className="relative mx-auto aspect-[1004/707] w-[min(100%,calc(70vh*1004/707))]">
          <Image
            src="/aboutMaterials/Me/book.png"
            alt=""
            fill
            priority
            className="object-contain"
            sizes="(min-width: 1024px) 1024px, 0px"
          />

          {/* Photo — left page, centered on the left leaf */}
          <div className="absolute left-[14.5%] top-[14%] w-[31%] -rotate-3">
            <div className="relative aspect-[295/387] w-full overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/aboutMaterials/Me/mePic.png"
                alt="Photo of Manya smiling outdoors"
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            {/* Washi tape sitting across the photo's top-left corner */}
            <WashiTape className="absolute -left-[13%] top-[3%] z-10 w-[54%]" />
          </div>

          {/* Flowers resting just outside the book, with a small gap from its edges */}
          <div className="absolute -left-[25%] -bottom-[3%] w-[42%]">
            <Image
              src="/aboutMaterials/Me/leftFlower.png"
              alt=""
              width={349}
              height={435}
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -right-[17%] -top-[5%] w-[34%]">
            <Image
              src="/aboutMaterials/Me/rightFlower.png"
              alt=""
              width={274}
              height={389}
              className="h-auto w-full"
            />
          </div>

          {/* Role blocks — right page */}
          <div className="absolute left-[54%] top-[13%] w-[35%] space-y-9">
            {roleBlocks.map((role, i) => (
              <div key={role.label}>
                {/* Cream bubble PNG behind the role label — slides in slowly, staggered */}
                <SlideUpSection delay={i * BUBBLE_STAGGER} duration={BUBBLE_DURATION}>
                  <div className="relative w-[78%]">
                    <Image
                      src="/aboutMaterials/Me/bubble.png"
                      alt=""
                      width={269}
                      height={45}
                      className="h-auto w-full"
                    />
                    <h3 className="absolute inset-0 flex items-center pl-[9%] font-[family-name:var(--font-playfair)] text-2xl italic text-neutral-800 xl:text-3xl">
                      {role.label}
                    </h3>
                  </div>
                </SlideUpSection>
                {/* Description — fades in shortly after its own bubble has settled */}
                <FadeRevealSection delay={descriptionDelay(i)} duration={DESCRIPTION_DURATION} className="mt-2">
                  <p className="font-[family-name:var(--font-ancizar)] text-[15px] leading-relaxed text-neutral-700 xl:text-base">
                    {role.body}
                  </p>
                </FadeRevealSection>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Mobile / tablet fallback: single-column stack ===== */}
      <div className="flex w-full max-w-md flex-col items-center gap-10 lg:hidden">
        <div className="relative w-56 -rotate-2 sm:w-64">
          <div className="relative aspect-[295/387] w-full overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/aboutMaterials/Me/mePic.png"
              alt="Photo of Manya smiling outdoors"
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>
          {/* Washi tape sitting across the photo's top-left corner */}
          <WashiTape className="absolute -left-[16%] top-[1%] z-10 w-[56%]" />
        </div>

        <div className="w-full space-y-6 px-2 text-center sm:text-left">
          {roleBlocks.map((role, i) => (
            <div key={role.label}>
              {/* Bubble — slides in slowly, staggered */}
              <SlideUpSection delay={i * BUBBLE_STAGGER} duration={BUBBLE_DURATION}>
                <div className="relative inline-block w-52 max-w-full">
                  <Image
                    src="/aboutMaterials/Me/bubble.png"
                    alt=""
                    width={269}
                    height={45}
                    className="h-auto w-full"
                  />
                  <h3 className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-playfair)] text-2xl italic text-neutral-800 sm:justify-start sm:pl-[9%]">
                    {role.label}
                  </h3>
                </div>
              </SlideUpSection>
              {/* Description — fades in shortly after its own bubble has settled */}
              <FadeRevealSection delay={descriptionDelay(i)} duration={DESCRIPTION_DURATION} className="mt-2">
                <p className="font-[family-name:var(--font-ancizar)] text-[15px] leading-relaxed text-neutral-700 sm:text-base">
                  {role.body}
                </p>
              </FadeRevealSection>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons — slide in gracefully after the section settles */}
      <SlideUpSection delay={620} className="mt-8">
        <div className="flex flex-wrap justify-center gap-4">

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
      </SlideUpSection>
    </section>
  );
}
