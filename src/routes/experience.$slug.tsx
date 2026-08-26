import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useEffect } from "react";
import { experienceData, getExperienceBySlug, type ExperienceItem } from "@/data/experience";
import ThemeToggle from "@/components/portfolio/ThemeToggle";
import { blockSectionGenerationOnce } from "@/hooks/use-section-generating";
import ZoomableImage from "@/components/portfolio/ZoomableImage";

export const Route = createFileRoute("/experience/$slug")({
  head: ({ params }) => {
    const exp = getExperienceBySlug(params.slug);
    const title = exp ? `${exp.role} — ${exp.company}` : "Experience";
    return {
      meta: [
        { title },
        { name: "description", content: exp?.description ?? "Experience detail" },
      ],
    };
  },
  loader: ({ params }) => {
    const exp = getExperienceBySlug(params.slug);
    if (!exp) throw notFound();
    return exp;
  },
  component: ExperienceDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Experience not found</h1>
        <Link to="/" className="text-accent hover:underline">Back home</Link>
      </div>
    </div>
  ),
});

function ExperienceDetail() {
  const exp = Route.useLoaderData() as ExperienceItem;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [exp?.slug]);

  if (!exp) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <Link
          to="/"
          hash="experience"
          onClick={() => blockSectionGenerationOnce("experience")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10"
          aria-label="Back to experience"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={16} className="text-accent" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {exp.duration}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {exp.role}
        </h1>
        <p className="text-accent font-medium mt-1 text-lg">{exp.company}</p>

        <div className="flex flex-wrap gap-2 mt-6 mb-8">
          {exp.technologies.map((tech: string) => (
            <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {tech}
            </span>
          ))}
        </div>

        <h2 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          Detailed Journey
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          {exp.detailedJourney}
        </p>

        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {exp.images.map((src: string, i: number) => (
            <div
              key={i}
              className="w-[450px] max-w-full h-[300px] rounded-xl overflow-hidden bg-secondary border-2 border-border shadow-sm"
            >
              <ZoomableImage src={src} alt={`${exp.role} image ${i + 1}`} />
            </div>
          ))}
        </div>

      </div>

      <Link
        to="/"
        hash="experience"
        onClick={() => blockSectionGenerationOnce("experience")}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium text-xs shadow-md hover:scale-105 transition-transform"
        aria-label="Back to Experience"
      >
        <ArrowLeft size={12} /> Back to Experience
      </Link>

    </div>
  );
}

// Touch import to avoid unused warning when tree-shaking experimental
void experienceData;
