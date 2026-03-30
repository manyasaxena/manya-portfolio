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
  if (Number.isNaN(parsed.getTime())) return "";
  return String(parsed.getFullYear());
}

function extractRating(item: Record<string, unknown>, title?: string): number | undefined {
  const memberRating = item["letterboxd:memberRating"];
  if (typeof memberRating === "string") {
    const parsed = Number(memberRating);
    if (!Number.isNaN(parsed)) return parsed;
  }

  if (title) {
    const stars = (title.match(/★/g) || []).length;
    const hasHalf = title.includes("½");
    if (stars > 0 || hasHalf) return stars + (hasHalf ? 0.5 : 0);
  }

  return undefined;
}

async function getRecentMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(FEED_URL, { cache: "no-store" });
    if (!response.ok) return [];

    const xml = await response.text();
    const parser = new Parser();
    const feed = await parser.parseString(xml);

    return (feed.items ?? []).slice(0, 4).map((item, index) => {
      const raw = item as Record<string, unknown>;
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

  // Added id="movies" here to link up with the navigation button!
  return (
    <section id="movies" className="py-14 md:py-20 opacity-65 hover:opacity-100 transition-opacity duration-500">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section header & Intro */}
        <div className="mb-12 flex flex-col gap-6">
          {/* Title and Line */}
          <div className="flex items-center gap-5">
            <h2 className="whitespace-nowrap font-serif text-4xl md:text-5xl text-foreground/85">My film diary</h2>
            
            <a 
              href={LETTERBOXD_PROFILE_URL} 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-1 items-center gap-4"
              title="View my Letterboxd profile"
            >
              {/* UNIFORM Purple Line */}
              <div className="h-px flex-1 bg-purple-200 transition-all duration-500 group-hover:bg-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
              
              {/* The Letterboxd Label */}
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-purple-600">
                Letterboxd
                <ArrowUpRight className="-ml-0.5 h-3 w-3 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
            </a>
          </div>

          {/* Personalized Subheader */}
          <p className="w-full text-sm leading-relaxed text-muted-foreground/80 md:text-base">
          Whether it’s a blockbuster, speculative sci-fi, animation, or an A24 film, I’m drawn to movies with compelling characters that either make me feel something deeply or let my imagination run free; leaving me with new perspectives, possibilities, and something to carry with me.
          </p>
        </div>

        {/* Movie posters - styled like vintage film reels on a shelf */}
        <div className="relative">
          {/* Shelf shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/10 to-transparent" />
          
          <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
            {recentMovies.map((movie) => (
              <article
                key={movie.id}
                className="group relative flex-shrink-0 w-28 md:w-32 rounded-2xl border border-white/50 bg-white/40 p-2 shadow-xl backdrop-blur-md"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl group-hover:-translate-y-1 transition-all duration-300">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Film grain overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
                  
                  {/* Vintage edge effect */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" />
                  
                  {/* Hover overlay - Updated to a dark black gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  {/* Rating on hover - Updated with standard Tailwind yellow colors */}
                  {movie.rating !== undefined && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const full = i + 1 <= Math.floor(movie.rating as number);
                        const half = !full && i + 0.5 === movie.rating;
                        return (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 text-yellow-400 ${
                              full 
                                ? "fill-yellow-400" 
                                : half 
                                  ? "fill-yellow-400/50" 
                                  : "fill-transparent opacity-40 text-yellow-400/50"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Title with typewriter feel */}
                <div className="mt-3 px-0.5">
                  <h3 className="text-xs text-foreground/60 group-hover:text-foreground/90 transition-colors truncate font-medium">
                    {movie.title}
                  </h3>
                  <span className="text-xs text-muted-foreground/40">
                    {movie.year}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}