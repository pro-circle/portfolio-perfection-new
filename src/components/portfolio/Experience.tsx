import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Briefcase, ArrowRight } from "lucide-react";
import { blockSectionGenerationOnce, useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";
import { experienceData } from "@/data/experience";

const Experience = () => {
  const { ref, phase, skipAnimation } = useSectionGenerating<HTMLElement>({ sectionId: "experience" });

  return (
    <section id="experience" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <SectionLabel label="Experience" phase={phase} instant={skipAnimation} />
          </div>
          <div className="space-y-10 stream-reveal" data-ready={phase === "ready"} data-instant={skipAnimation || undefined}>
            {experienceData.map((exp, i) => (
              <div
                key={exp.slug}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors duration-300"
              >
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <Briefcase size={12} className="text-accent" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <Link
                      to="/experience/$slug"
                      params={{ slug: exp.slug }}
                      preload="intent"
                      onClick={() => blockSectionGenerationOnce("experience")}
                      className="font-display text-xl font-semibold text-foreground hover:text-accent-hover transition-colors cursor-pointer text-left group inline-flex items-center gap-2"
                    >
                      <span className="relative">
                        {exp.role}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
                      </span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent-hover group-hover:translate-x-0.5 transition-all shrink-0" />
                      <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        click
                      </span>
                    </Link>
                    <p className="text-base text-accent font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium shrink-0 mt-1 sm:mt-0">{exp.duration}</span>
                </div>
                <StreamText
                  as="p"
                  start={phase === "ready"}
                  instant={skipAnimation}
                  startDelayMs={i * 180}
                  className="text-base text-muted-foreground leading-relaxed mb-3"
                  text={exp.description}
                />

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{tech}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-10 mt-6 border-t border-border text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Career Summary
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Being as a student, led me to access, experience the best tech stacks,
                break a lot of opportunities, test my patience and push outa my comfort 
                zone. My hard times during internships and hackathons are tunnig me fine 
                with confidence and exposure to new technologies.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
