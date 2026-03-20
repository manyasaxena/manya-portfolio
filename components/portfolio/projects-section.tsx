const placeholderProjects = [
  { title: "Project One", blurb: "Brief description of your first project." },
  { title: "Project Two", blurb: "Brief description of your second project." },
  { title: "Project Three", blurb: "Brief description of your third project." },
];

export function ProjectsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
      <p className="mt-2 text-muted-foreground">
        Placeholder project cards. Swap these with your real portfolio entries.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {placeholderProjects.map((project) => (
          <article
            key={project.title}
            className="rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur"
          >
            <h3 className="font-medium">{project.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{project.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
