import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, School } from "lucide-react";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";



const educationData = [
  {
    icon: GraduationCap,
    level: "College",
    institution: "College",
    degree: "M.Tech in Computer Science & Engineering",
    duration: "2021 – 2025",
    description: "Relevant coursework: Data Structures, Algorithms, Artificial Intelligence, Database Management.",
    gpa: "8.5 / 10 [upto 5th sem]",
  },
  {
    icon: School,
    level: "School",
    institution: "School",
    degree: "Higher Secondary (XII)",
    duration: "2020 – 2022",
    description: "Focused on Science Stream and communication.",
    gpa: "85%",
  },
];

const Education = () => {
  const [clickCount, setClickCount] = useState(0);
  const lastClickRef = useRef(Date.now());
  const { ref, phase } = useSectionGenerating<HTMLElement>({ sectionId: "education" });

  const handleHeadingClick = () => {
    const now = Date.now();
    // Reset if more than 2 seconds between clicks
    if (now - lastClickRef.current > 2000) {
      setClickCount(1);
    } else {
      setClickCount((prev) => prev + 1);
    }
    lastClickRef.current = now;

    if (clickCount + 1 >= 7) {
      setClickCount(0);
      window.dispatchEvent(new CustomEvent("adminToggle"));
    }
  };

  return (
    <section id="education" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <SectionLabel label="Education" phase={phase} onClick={handleHeadingClick} anchorId="education-title" />
          </div>
          <div className="space-y-10 stream-reveal" data-ready={phase === "ready"}>
            {educationData.map((edu, i) => (

              <div
                key={edu.level}
                className="relative pl-8 border-l-2 border-border hover:border-accent transition-colors duration-300"
              >
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <edu.icon size={12} className="text-accent" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{edu.institution}</h3>
                    <p className="text-base text-accent font-medium">{edu.degree}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium shrink-0 mt-1 sm:mt-0">{edu.duration}</span>
                </div>
                <StreamText
                  as="p"
                  start={phase === "ready"}
                  startDelayMs={i * 150}
                  className="text-base text-muted-foreground leading-relaxed mb-2"
                  text={edu.description}
                />

                <p className="text-sm font-medium text-foreground">
                  Score: <span className="text-accent">{edu.gpa}</span>
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
