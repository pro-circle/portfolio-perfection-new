import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { blockSectionGenerationOnce, useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";
import { projects } from "@/data/projects";
import LoadingImage from "./LoadingImage";

const openSourceProjects = [
  {
    title: "Python Package:",
    description: "Deployed a python package 'llmrouter' for unifying llm routing",
    url: "https://vikram-u.web.app",
  },
];

const Projects = () => {
  const { ref, phase, skipAnimation } = useSectionGenerating<HTMLElement>({ sectionId: "projects" });
  const [openSourceOpen, setOpenSourceOpen] = useState(false);

  return (
    <section id="projects" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <SectionLabel label="Work Samples" phase={phase} anchorId="projects-title" instant={skipAnimation} />
          </div>
        </motion.div>

        <div className="space-y-0 stream-reveal" data-ready={phase === "ready"} data-instant={skipAnimation || undefined}>
          {projects.map((project, i) => (
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              key={project.slug}
              preload="intent"
              onClick={() => blockSectionGenerationOnce("projects")}
              className="group block border-t border-border py-10 md:py-12"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent-hover transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-accent-hover group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      click
                    </span>
                  </div>
                  <StreamText
                    as="p"
                    start={phase === "ready"}
                    instant={skipAnimation}
                    startDelayMs={i * 140}
                    className="text-muted-foreground max-w-xl leading-relaxed text-base md:text-lg"
                    text={project.description}
                  />

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <p className="text-sm text-muted-foreground font-mono">{project.year}</p>
                  <div className="relative w-[180px] h-[120px] rounded-lg overflow-hidden border border-border bg-secondary group-hover:border-accent transition-colors">
                    <LoadingImage
                      src={project.thumbnail}
                      alt={`${project.title} thumbnail`}
                      rounded="rounded-lg"
                    />
                    <span className="water-ripple" aria-hidden="true" />
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

          <div className="mt-10 flex flex-col items-center gap-6">
          <div className="w-full max-w-4xl">
            <button
              onClick={() => setOpenSourceOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 rounded-xl border border-white/30 bg-card hover:border-white/50 hover:bg-white/5 transition-colors text-left group"
            >
              <div>
                <h4 className={`font-display text-xl font-semibold transition-colors ${openSourceOpen ? 'text-accent' : 'text-foreground group-hover:text-accent-hover'}`}>
                  Open Source Contributions
                </h4>
                <p className="text-base text-muted-foreground mt-0.5">Explore published packages and libraries</p>
              </div>
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary group-hover:bg-accent/10 transition-colors">
                {openSourceOpen ? (
                  <ChevronUp size={18} className="text-accent" />
                ) : (
                  <ChevronDown size={18} className="text-accent" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openSourceOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {openSourceProjects.map((pkg, idx) => (
                      <motion.div
                        key={pkg.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-lg border border-border bg-card/60"
                      >
                        <div>
                          <h5 className="font-display text-lg font-semibold text-foreground">{pkg.title}</h5>
                          <p className="text-base text-muted-foreground mt-1">{pkg.description}</p>
                        </div>
                        <a
                          href={pkg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 text-base font-medium text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
                        >
                          view docs
                          <ArrowUpRight size={14} />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="https://github.com/vik77-git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/30 bg-accent/20 hover:bg-accent/30 text-accent-foreground font-medium text-sm transition-colors dark:border-transparent dark:bg-accent/10 dark:hover:bg-accent/20 dark:text-white"
          >
            View more projects on GitHub
            <ArrowUpRight size={16} className="text-accent-foreground dark:text-white" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;