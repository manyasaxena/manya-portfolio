import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import Parser from "rss-parser";

interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  rating?: number;
}

const FEED_URL = "https://letterboxd.com/ms03flm/rss/";
const LETTERBOXD_PROFILE_URL = "https://letterboxd.com/ms03flm/";
const FALLBACK_POSTER = "https://picsum.photos/seed/picsum/400/600";

function extractPosterFromDescription(description: string): string | null {
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function extractTitle(rawTitle?: string): string {
  if (!rawTitle) return "Untitled";
  return rawTitle.replace(/^[^:]+:\s*/, "").trim() || rawTitle;
}

function extractYear(pubDate?: string): string {
  if (!pubDate) return "";
  const parsed = new Date(pubDate);
  return !isNaN(parsed.getTime()) ? String(parsed.getFullYear()) : "";
}

function extractRating(item: Record<string, any>, title?: string): number | undefined {
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

    // CHANGED: slice(0, 7) to get exactly seven movies
    return (feed.items ?? []).slice(0, 7).map((item, index) => {
      const raw = item as any;
      return {
        id: item.guid || item.link || String(index),
        title: extractTitle(item.title),
        year: extractYear(item.pubDate),
        poster: extractPosterFromDescription(item.content || item.summary || "") || FALLBACK_POSTER,
        rating: extractRating(raw, item.title),
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
        </div>

        {/* CHANGED: Grid Layout for exactly 7 items */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7 lg:gap-3">
          {recentMovies.map((movie) => (
            <article
              key={movie.id}
              className="group relative flex flex-col rounded-xl border border-white/40 bg-white/30 p-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:bg-white/50"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rating - scaled down for small grid items */}
                {movie.rating !== undefined && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i + 1 <= movie.rating! ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title Info - Tiny text to fit the narrow columns */}
              <div className="mt-2 flex flex-col px-0.5">
                <h3 className="truncate text-[10px] font-medium text-foreground/70 group-hover:text-foreground">
                  {movie.title}
                </h3>
                <div className="flex justify-between text-[9px] text-muted-foreground/50">
                  <span>{movie.year}</span>
                  <span>2026</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}