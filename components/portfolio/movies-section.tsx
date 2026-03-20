const placeholderMovies = [
  { title: "Movie Title A", note: "A short reaction or rating." },
  { title: "Movie Title B", note: "A short reaction or rating." },
  { title: "Movie Title C", note: "A short reaction or rating." },
];

export function MoviesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold tracking-tight">Recently Watched</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderMovies.map((movie) => (
          <article
            key={movie.title}
            className="rounded-lg border border-border/60 bg-card/50 p-4"
          >
            <h3 className="font-medium">{movie.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{movie.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
