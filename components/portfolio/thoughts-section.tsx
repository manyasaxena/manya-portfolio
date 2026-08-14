import { ArrowDown, ArrowUpRight, Calendar } from "lucide-react";
import Parser from "rss-parser";
import { Playfair_Display } from "next/font/google";
import { SlideUpSection } from "@/components/portfolio/scroll-reveal";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

// Fixed per-card tilt so each card reads as individually hand-placed rather than
// mechanically alternating. Indexed by post position (0, 1, 2).
const CARD_ROTATIONS = ["rotate-[-0.8deg]", "rotate-[0.6deg]", "rotate-[-0.5deg]"];

interface BlogPost {
  id: string;
  title: string;
  link: string;
  excerpt: string;
  date: string;
}

const FEED_URL = "https://medium.com/feed/@manyasaxena_32526";

function toPlainText(html: string): string {
  return html
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string): string {
  const plain = toPlainText(content);
  if (!plain) return "Read the latest post on Medium.";

  const sentenceMatch = plain.match(/^(.+?[.!?])(?:\s|$)/);
  if (sentenceMatch?.[1]) {
    return sentenceMatch[1].trim();
  }

  return plain;
}

function formatPubDate(pubDate?: string): string {
  if (!pubDate) return "";
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed);
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(FEED_URL, { cache: "no-store" });
    if (!response.ok) return [];

    const xml = await response.text();
    const parser = new Parser();
    const feed = await parser.parseString(xml);

    return (feed.items ?? []).slice(0, 3).map((item, index) => {
      const raw = item as Record<string, unknown>;
      const encoded = typeof raw["content:encoded"] === "string" ? raw["content:encoded"] : "";
      const description = typeof item.content === "string" ? item.content : item.contentSnippet || item.summary || "";
      const sourceContent = encoded || description || "";

      return {
        id: item.guid || item.link || String(index),
        title: item.title || "Untitled post",
        link: item.link || "#",
        excerpt: makeExcerpt(sourceContent),
        date: formatPubDate(item.pubDate),
      };
    });
  } catch {
    return [];
  }
}

// A small strip of tape straddling the card's top edge — a flat, semi-transparent
// lavender rectangle rather than an image, so it stays exactly 72x22px and never
// reads as a big floating graphic. `side` alternates which corner it's pinned from.
function CardTape({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 h-[22px] w-[72px] rounded-[2px] bg-[#9A8CD6] opacity-40 ${
        side === "left" ? "left-6 -rotate-6" : "right-6 rotate-6"
      }`}
      style={{ top: "-10px" }}
    />
  );
}

export async function ThoughtsSection() {
  const posts = await getPosts();

  return (
    <section
      id="thoughts"
      className={`${playfairDisplay.variable} flex min-h-screen w-full flex-col justify-center bg-white py-16`}
    >
      {/* Same wrapper as Projects (mx-auto max-w-6xl px-6) so this section's left/right */}
      {/* margins line up exactly with the rest of the site. */}
      <div className="mx-auto w-full max-w-6xl px-6">

        {/* Section header & Intro — left-aligned, full width of the wide container. */}
        {/* Sizing matches the Art section header (text-4xl/5xl title, mb-12 gap-6). */}
        <div className="mb-12 flex flex-col gap-6">
          {/* Title and Line */}
          <div className="flex items-center gap-5">
            <h2 className="whitespace-nowrap font-[family-name:var(--font-playfair)] text-4xl italic text-foreground/85 md:text-5xl">
              Latest Thoughts
            </h2>

            <a
              href="https://medium.com/@manyasaxena_32526"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-1 items-center gap-4"
              title="Read more on Medium"
            >
              {/* UNIFORM Purple Line */}
              <div className="h-px flex-1 bg-purple-200 transition-all duration-500 group-hover:bg-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]" />

              {/* The Blog Label */}
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-purple-600">
                Blog
                <ArrowUpRight className="-ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
            </a>
          </div>

          {/* Personalized Subheader */}
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/80 md:text-base">
            I write to make sense of things — psychology, design, tech, and whatever won&rsquo;t leave me alone.
          </p>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/70 md:text-base">
            <a
              href="https://substack.com/@manyasaxena?r=5i8g7g&utm_campaign=profile&utm_medium=profile-page"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent-foreground)] underline decoration-[var(--accent-foreground)]/30 underline-offset-2 transition-colors hover:decoration-[var(--accent-foreground)]/70"
            >
              Follow Me on Substack!
            </a>
          </p>
        </div>

        {/* Blog posts — a centered, hand-placed card column, narrower than the wide */}
        {/* section container the left-aligned header above sits in. */}
        <div className="mx-auto w-full max-w-[660px] space-y-6">
          {posts.map((post, index) => {
            const tapeSide = index % 2 === 0 ? "left" : "right";
            const rotation = CARD_ROTATIONS[index] ?? "";

            return (
              <SlideUpSection key={post.id} delay={index * 150} duration={800} distance={24}>
                <article
                  className={`
                    group relative rounded-xl border-[0.5px] border-[#E7DFCC] bg-[#F5EFE1]
                    px-6 py-4 shadow-[0_6px_18px_-6px_rgba(120,100,72,0.20)]
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_10px_24px_-8px_rgba(120,100,72,0.26)]
                    ${rotation}
                  `}
                >
                  {/* Small washi-tape strip, straddling the top edge */}
                  <CardTape side={tapeSide} />

                  {/* Top row: index chip + date */}
                  <div className="mb-1.5 flex items-center justify-between gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EEEDFE] font-mono text-xs font-medium text-[#534AB7]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6656]">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title — clamped to one line to keep card height predictable */}
                  <h3 className="truncate font-[family-name:var(--font-playfair)] text-xl font-medium italic leading-snug text-[#2C2822]">
                    <a href={post.link} target="_blank" rel="noreferrer">
                      {post.title}
                    </a>
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-1.5 line-clamp-2 text-sm leading-[1.55] text-[#6E6656]">
                    {post.excerpt}
                  </p>

                  {/* Medium tag */}
                  <div className="mt-2 flex justify-end">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-[#EEEDFE] px-2.5 py-1 text-xs font-medium text-[#534AB7] transition-colors hover:bg-[#e2e0fa]"
                    >
                      Medium
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              </SlideUpSection>
            );
          })}
        </div>

        {/* Clean space where the typewriter footer will drop in later */}
        <div className="mt-10 flex justify-end">
          <a
            href="#Art"
            className="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span className="tracking-wide">My artwork</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-1 group-hover:border-neutral-800 group-hover:bg-neutral-800 group-hover:text-white">
              <ArrowDown className="h-5 w-5" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}