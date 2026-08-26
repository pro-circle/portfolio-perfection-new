import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";

const skillDetails: Record<string, string> = {
  Bash: "Using interactive terminal to manage files, monitor processes, and configure system settings.",
  
  Linux: "Ubuntu for the perfect balance between the simplicity of host OS and the customizability of Linux.",
  Python: "Daily driver for scripting, data work, and ML prototypes.",
  SQL: "Complex joins, window functions and query tuning across Postgres and analytics warehouses.",
  "Node.js": "Production REST and streaming services with focus on observability and back-pressure.",
  Ollama: "For hosting and serving open source LLMs in local computer.",
  Tensorflow: "Simple and powerful stack while working with neural networks.",
  "Scikit-learn": "Used for developing and prototyping ML and DL models for years.",
  Firebase:"I use for fast, simple prototyping and deployment.",
  Docker: "Reproducible builds, multi-stage images and independent conainers.",
  "OpenAI API": "A common SDK the most LLMs are being worked.",
  "CI/CD": "GitHub Actions and pipeline-as-code workflows with automated quality gates.",
  PostgreSQL: "Schema design, indexing strategy, and replication-aware queries.",
  "Fast API": "For a fast and powerful communicaion over systems.",
  Flask: "Chosen for flexible and quick protoypes.",
  Supabase:"Backend as a service (BaaS) with advanced postgreSQL Database",
  MongoDB: "Document modelling, aggregation pipelines and operational best practices.",
  n8n: "Workflow automation for connecting APIs, services, and AI agents with visual pipelines.",
  PowerBI: "Interactive dashboards and business intelligence reports from diverse data sources.",
  "Hugging Face": "Leveraging open-source models, datasets, and inference APIs for NLP and AI tasks.",
};

const skillGroups = [
  {
    category: "Languages",
    skills: ["Python", "SQL", "Bash"],
  },
  {
    category: "Backend",
    skills: ["Fast API", "Flask", "Supabase", "Firebase"],
  },
  {
    category: "Infrastructure",
    skills: ["Docker", "CI/CD", "Linux"],
  },
  {
    category: "Data",
    skills: ["PostgreSQL", "MongoDB", "PowerBI"],
  },
  {
    category: "AI Frames",
    skills: ["Tensorflow", "Scikit-learn", "n8n"],
  },
  {
    category: "Other Skills",
    skills: ["OpenAI API", "Ollama", "Hugging Face"],
  },
];

/**
 * Official brand logos shown on hover.
 * To add a future skill logo: add the exact skill label here and set its Simple Icons slug.
 * If cdn.simpleicons.org does not serve that slug, add a jsDelivr `url` override using
 * `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/{slug}.svg`.
 */
const skillLogos: Record<string, { slug: string; dark?: boolean; url?: string }> = {
  Python: { slug: "python" },
  SQL: { slug: "mysql" },
  Bash: { slug: "gnubash", dark: true },
  "Fast API": { slug: "fastapi" },
  Flask: { slug: "flask", dark: true },
  Supabase: { slug: "supabase" },
  Firebase: { slug: "firebase" },
  Docker: { slug: "docker" },
  "CI/CD": { slug: "githubactions" },
  Linux: { slug: "linux", dark: true },
  PostgreSQL: { slug: "postgresql" },
  MongoDB: { slug: "mongodb" },
  PowerBI: {
    slug: "powerbi",
    dark: true,
    url: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/powerbi.svg",
  },
  Tensorflow: { slug: "tensorflow" },
  "Scikit-learn": { slug: "scikitlearn" },
  n8n: { slug: "n8n" },
  "OpenAI API": {
    slug: "openai",
    dark: true,
    url: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
  },
  Ollama: { slug: "ollama", dark: true },
  "Hugging Face": { slug: "huggingface" },
  "Node.js": { slug: "nodedotjs" },
};

const resumePages = [
  "/images/resume/page-1.jpg",
  "/images/resume/page-2.jpg",
  "/images/resume/page-3.jpg",
];


const Skills = () => {
  const [showResume, setShowResume] = useState(false);
  const [resumeLoaded, setResumeLoaded] = useState(false);

  useEffect(() => {
    if (!showResume) {
      setResumeLoaded(false);
      return;
    }
    const t = window.setTimeout(() => setResumeLoaded(true), 3500);
    return () => window.clearTimeout(t);
  }, [showResume]);

  useScrollLock(showResume);
  const { ref, phase } = useSectionGenerating<HTMLElement>({ sectionId: "skills" });

  return (
    <section id="skills" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <div className="mb-6">
              <SectionLabel label="Expertise" phase={phase} />
            </div>
            <div className="stream-reveal" data-ready={phase === "ready"}>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => setShowResume(true)}
                className="mt-2"
                data-ai-anchor="resume-btn"
              >
                <FileText size={16} />
                View My Resume
              </Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-10 stream-reveal" data-ready={phase === "ready"}>
            {skillGroups.map((group, gi) => (
              <div key={group.category}>
                <h3 className="font-display text-base font-semibold text-foreground mb-4 tracking-wide uppercase">
                  <StreamText
                    start={phase === "ready"}
                    startDelayMs={gi * 120}
                    text={group.category}
                  />
                </h3>
                <div className="space-y-2">
                  {group.skills.map((skill, si) => {
                    const logo = skillLogos[skill];
                    const logoSrc = logo?.url ?? (logo ? `https://cdn.simpleicons.org/${logo.slug}` : undefined);

                    return (
                    <HoverCard key={skill} openDelay={120} closeDelay={80}>
                      <HoverCardTrigger asChild>
                        <div className="relative block text-muted-foreground text-lg hover:text-accent-hover transition-colors text-left group cursor-default">
                          <span className="relative inline-block transition-opacity duration-200 group-hover:opacity-0">
                            <StreamText
                              start={phase === "ready"}
                              startDelayMs={gi * 120 + 180 + si * 90}
                              wordMs={60}
                              text={skill}
                            />
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
                          </span>
                          {logoSrc && (
                            <img
                              src={logoSrc}
                              alt={`${skill} logo`}
                              loading="lazy"
                              decoding="async"
                              className={`pointer-events-none absolute left-0 top-1/2 h-7 w-auto -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                                logo?.dark ? "dark:brightness-0 dark:invert" : ""
                              }`}
                            />
                          )}
                        </div>

                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-80 border-border shadow-xl"
                        style={{ backgroundColor: "#ebebe3", color: "#000000", backdropFilter: "none", opacity: 1 }}
                        side="right"
                        align="start"
                      >
                        <div className="space-y-2">
                          <h4 className="font-display text-xl font-semibold" style={{ color: "#000000" }}>
                            {skill}
                          </h4>
                          <p className="text-base leading-relaxed" style={{ color: "#1f2937" }}>
                            {skillDetails[skill]}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>


      {/* Resume Modal */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
            onClick={() => setShowResume(false)}
            onWheel={(e: React.WheelEvent) => e.preventDefault()}
            onTouchMove={(e: React.TouchEvent) => e.preventDefault()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card border-2 border-accent/30 rounded-2xl max-w-5xl w-full h-[88vh] overflow-hidden flex flex-col relative"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowResume(false)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/80 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
              {!resumeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-20 gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading resume...</p>
                </div>
              )}
              <div className="flex-1 w-full overflow-hidden relative bg-secondary/40">
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
                  <div className="flex w-full flex-col items-stretch">
                    {resumePages.map((src, index) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Resume page ${index + 1}`}
                        loading={index === 0 ? "eager" : "lazy"}
                        onLoad={() => {
                          if (index === 0) setResumeLoaded(true);
                        }}
                        onError={() => {
                          if (index === 0) setResumeLoaded(true);
                        }}
                        className="block w-full h-auto"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="/resume.pdf"
                download="John_Doe_Resume.pdf"
                className="absolute bottom-4 right-4 z-10"
              >
                <Button variant="hero" size="sm">
                  <Download size={14} />
                  Download
                </Button>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
