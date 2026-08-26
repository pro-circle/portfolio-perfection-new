import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github, Lightbulb } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/portfolio/ThemeToggle";
import { getProjectBySlug, type ProjectItem } from "@/data/projects";
import { blockSectionGenerationOnce } from "@/hooks/use-section-generating";
import ZoomableImage from "@/components/portfolio/ZoomableImage";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    return {
      meta: [
        { title: project ? `${project.title} — Project` : "Project" },
        { name: "description", content: project?.description ?? "Project detail" },
      ],
    };
  },
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return project;
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Project not found</h1>
        <Link to="/" className="text-accent hover:underline">Back home</Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const project = Route.useLoaderData() as ProjectItem;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [project?.slug]);

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <Link
          to="/"
          hash="projects"
          onClick={() => blockSectionGenerationOnce("projects")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10"
          aria-label="Back to projects"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <p className="text-[11px] text-accent font-semibold uppercase tracking-wider mb-2">
          {project.year}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {project.details}
        </p>

        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-accent" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
              Insights
            </h3>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {project.insights}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="hero-outline" size="lg">
              <Github size={16} />
              GitHub Repo
            </Button>
          </a>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="lg">
              <ExternalLink size={16} />
              View Demo
            </Button>
          </a>
        </div>

        <h2 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          Screenshots
        </h2>
        <div className="flex flex-col items-center gap-10">
          {project.screenshots.map((shot: { src: string; caption: string }, i: number) => (
            <figure key={i} className="w-[640px] max-w-full">
              <div className="w-full h-[420px] rounded-xl overflow-hidden border-2 border-border bg-secondary shadow-sm">
                <ZoomableImage
                  src={shot.src}
                  alt={`${project.title} screenshot ${i + 1}`}
                />
              </div>

              <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed text-center">
                <span className="text-foreground font-medium">Screenshot {i + 1}:</span> {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Link
        to="/"
        hash="projects"
        onClick={() => blockSectionGenerationOnce("projects")}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium text-xs shadow-md hover:scale-105 transition-transform"
        aria-label="Back to Project"
      >
        <ArrowLeft size={12} /> Back to Project
      </Link>
    </div>
  );
}
