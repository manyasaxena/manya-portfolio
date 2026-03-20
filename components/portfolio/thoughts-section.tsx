const placeholderThoughts = [
  "What I learned building my last app",
  "Notes on design systems and consistency",
  "How I scope projects to ship faster",
];

export function ThoughtsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold tracking-tight">Latest Thoughts</h2>
      <p className="mt-2 text-muted-foreground">
        Placeholder writing links. Replace with your real blog posts.
      </p>

      <ul className="mt-6 space-y-3">
        {placeholderThoughts.map((thought) => (
          <li
            key={thought}
            className="rounded-lg border border-border/60 bg-card/50 px-4 py-3 text-sm"
          >
            {thought}
          </li>
        ))}
      </ul>
    </section>
  );
}
