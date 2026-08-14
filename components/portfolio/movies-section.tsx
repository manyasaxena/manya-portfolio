import { ArrowUpRight } from "lucide-react";
import Parser from "rss-parser";
import sanitizeHtml from "sanitize-html";
import { FilmReel } from "@/components/portfolio/film-reel";

interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  rating?: number;
  review?: string;
  link: string;
}

type RawFeedItem = Parser.Item & { "letterboxd:memberRating"?: string };

const FEED_URL = "https://letterboxd.com/ms03flm/rss/";
const LETTERBOXD_PROFILE_URL = "https://letterboxd.com/ms03flm/";
const FALLBACK_POSTER = "https://picsum.photos/seed/picsum/400/600";

function extractPosterFromDescription(description: string): string | null {
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

// Letterboxd's <description> is the poster <img>, sometimes wrapped in a <p>,
// followed by either the review body or a "Watched on <date>." boilerplate line
// when there's no review. Strip the poster and the boilerplate, sanitize what's
// left, and treat an empty result as "no review" rather than an empty bubble.
function extractReview(description: string): string | undefined {
  if (!description) return undefined;

  const withoutPoster = description
    .replace(/<p>\s*<img[^>]*>\s*<\/p>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<p>\s*Watched on [^<]*<\/p>/gi, "")
    .trim();

  if (!withoutPoster) return undefined;

  const sanitized = sanitizeHtml(withoutPoster, {
    allowedTags: ["p", "br", "em", "i", "strong", "b", "blockquote", "span", "a"],
    allowedAttributes: { a: ["href"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  }).trim();

  const textOnly = sanitized.replace(/<[^>]+>/g, "").trim();
  return textOnly.length > 0 ? sanitized : undefined;
}

// Letterboxd's <title> is "{Film Title}, {Year} - {star rating}", e.g.
// "Black Mirror: Eulogy, 2025 - ★★★★". Strip the trailing ", year - stars"
// suffix rather than anything before a colon — the film title itself may
// contain one (as above), and a leading-prefix strip would eat it.
function extractTitle(rawTitle?: string): string {
  if (!rawTitle) return "Untitled";
  const match = rawTitle.match(/^(.*),\s*\d{4}\s*-\s*[★½]*\s*$/);
  return (match?.[1] ?? rawTitle).trim();
}

function extractYear(pubDate?: string): string {
  if (!pubDate) return "";
  const parsed = new Date(pubDate);
  return !isNaN(parsed.getTime()) ? String(parsed.getFullYear()) : "";
}

function extractRating(item: RawFeedItem, title?: string): number | undefined {
  const memberRating = item["letterboxd:memberRating"];
  if (memberRating) return Number(memberRating);
  
  if (title) {
    const stars = (title.match(/★/g) || []).length;
    const hasHalf = title.includes("½");
    if (stars > 0 || hasHalf) return stars + (hasHalf ? 0.5 : 0);
  }
  return undefined;
}

async function getRecentMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) return [];

    const xml = await response.text();
    const parser = new Parser();
    const feed = await parser.parseString(xml);

    return (feed.items ?? []).slice(0, 20).map((item, index) => {
      const raw = item as RawFeedItem;
      const description = item.content || item.summary || "";
      return {
        id: item.guid || item.link || String(index),
        title: extractTitle(item.title),
        year: extractYear(item.pubDate),
        poster: extractPosterFromDescription(description) || FALLBACK_POSTER,
        rating: extractRating(raw, item.title),
        review: extractReview(description),
        link: item.link || LETTERBOXD_PROFILE_URL,
      };
    });
  } catch {
    return [];
  }
}

export async function MoviesSection() {
  const recentMovies = await getRecentMovies();

  return (
    <section id="movies" className="py-14 md:py-20 opacity-90 hover:opacity-100 transition-opacity duration-500">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <h2 className="whitespace-nowrap font-serif text-4xl md:text-5xl text-foreground/85">My film diary</h2>
            <a 
              href={LETTERBOXD_PROFILE_URL} 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-1 items-center gap-4"
            >
              <div className="h-px flex-1 bg-purple-200/50 transition-all duration-500 group-hover:bg-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors duration-300 group-hover:text-purple-600">
                Letterboxd
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
              </span>
            </a>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground/80 md:text-base">
            Whether it’s a blockbuster, speculative sci-fi, animation, or an A24 film, I’m drawn to movies with compelling characters that either make me feel something deeply or let my imagination run free...
          </p>

          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground/70 md:text-base">
            <a
              href={LETTERBOXD_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent-foreground)] underline decoration-[var(--accent-foreground)]/30 underline-offset-2 transition-colors hover:decoration-[var(--accent-foreground)]/70"
            >
              Follow me on Letterboxd
            </a>
          </p>
        </div>

        <FilmReel movies={recentMovies} />
      </div>
    </section>
  );
}