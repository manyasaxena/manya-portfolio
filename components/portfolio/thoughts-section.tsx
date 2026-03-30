import { ArrowDown, ArrowUpRight, Calendar } from "lucide-react";
import Parser from "rss-parser";

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

export async function ThoughtsSection() {
  const posts = await getPosts();

  return (
    <section id="thoughts" className="flex min-h-screen w-full flex-col justify-center py-24 opacity-90 transition-opacity duration-500 hover:opacity-100">
      <div className="mx-auto w-full max-w-5xl px-6">
        
        {/* Section header & Intro */}
        <div className="mb-12 flex flex-col gap-6">
          {/* Title and Line */}
          <div className="flex items-center gap-5">
            <h2 className="whitespace-nowrap font-serif text-4xl md:text-5xl text-foreground/85">Latest Thoughts</h2>
            
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

          {/* Personalized Subheader - Max width removed so it stretches cleanly */}
          <p className="w-full text-sm leading-relaxed text-muted-foreground/80 md:text-base">
            Writing has always been how I make sense of the world—how I process, reflect, and connect ideas. I share these thoughts on Medium, where I explore psychology, design, technology, and everything in between :)
          </p>
        </div>

        {/* Blog posts styled like aged index cards */}
        <div className="space-y-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-white/50 md:flex-row md:items-start md:gap-6"
            >
              {/* Decorative corner fold */}
              <div className="absolute right-0 top-0 h-6 w-6 bg-gradient-to-bl from-accent/10 to-transparent" />
              
              {/* Catalog index number - Solid Purple, no wireframe */}
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-purple-100 font-mono text-sm font-medium text-purple-700 md:flex">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-serif text-lg leading-snug text-warm-foreground transition-colors group-hover:text-warm-foreground/90">
                    <a href={post.link} target="_blank" rel="noreferrer">
                      {post.title}
                    </a>
                  </h3>
                  <a href={post.link} target="_blank" rel="noreferrer">
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-warm-foreground/50 transition-colors group-hover:text-purple-500" />
                  </a>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-warm-foreground/80">
                  {post.excerpt}
                </p>
              </div>

              {/* Meta - styled like library stamps */}
              <div className="flex shrink-0 items-center gap-3 text-xs text-warm-foreground/70 md:flex-col md:items-end md:gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>
                
                {/* Purple Tags */}
                <span className="rounded-md border border-purple-200/60 bg-purple-50/50 px-2.5 py-1 text-purple-700/80 font-medium transition-colors group-hover:bg-purple-100/60 group-hover:border-purple-300/60 group-hover:text-purple-800">
                  Medium
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation to Art Section */}
        <div className="mt-12 flex justify-end">
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