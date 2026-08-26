import { motion } from "framer-motion";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";




const About = () => {
  const { ref, phase } = useSectionGenerating<HTMLElement>({ sectionId: "about" });
  return (
    <section id="about" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <SectionLabel label="Brief biography" phase={phase} />
          </div>
          <div className="space-y-6 stream-reveal" data-ready={phase === "ready"}>
            <StreamText
              as="p"
              start={phase === "ready"}
              className="text-xl md:text-2xl font-display leading-relaxed text-foreground"
              text="I'm a fourth year computer science student with strong foundation in AI. I love working with agent syatems and making it think and work. I use my skills to build a meaningful and an impactful solution."
            />
            <span data-ai-anchor="about-end" aria-hidden="true" />
            <StreamText
              as="p"
              start={phase === "ready"}
              startDelayMs={250}
              className="text-muted-foreground leading-relaxed"
              text="I learn from open source knowledge and apply practically to a problem and solve it. This gives me the confidence on my work and evaluate myself."
            />
            <StreamText
              as="p"
              start={phase === "ready"}
              startDelayMs={500}
              className="text-muted-foreground leading-relaxed"
              text="When I'm not coding, you'll find me contributing to open-source projects, or exploring new tech stack."
            />
{/*
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-border">
              {[
                { label: "Years Experience", value: "6+" },
                { label: "Projects Shipped", value: "40+" },
                { label: "Open Source Contributions", value: "120+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div> 
            */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default About;