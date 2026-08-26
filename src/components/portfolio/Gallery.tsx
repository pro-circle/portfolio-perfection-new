import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import StreamText from "./StreamText";

const Gallery = () => {
  const { ref, phase } = useSectionGenerating<HTMLElement>({ sectionId: "hobbies" });

  return (
    <section id="hobbies" ref={ref} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20"
        >
          <div>
            <SectionLabel label="Blog" phase={phase} />
          </div>
          <div className="stream-reveal" data-ready={phase === "ready"}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Blogs and Certs
            </h2>
            <StreamText
              as="p"
              start={phase === "ready"}
              startDelayMs={150}
              className="text-muted-foreground leading-relaxed mb-8 max-w-lg block"
              text="Recently I did something..."
            />

            <Link to="/hobbies">
              <Button variant="hero" size="lg">
                <Images size={16} />
                Explore Blogs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
