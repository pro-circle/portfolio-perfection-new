import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, BookOpen, Github, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StreamText from "./StreamText";
import ProfilePhoto from "./ProfilePhoto";



const GlowingStars = () => {
  const stars = [
    { top: "12%", left: "8%", size: 2, delay: 0 },
    { top: "22%", right: "10%", size: 3, delay: 1.2 },
    { top: "45%", left: "4%", size: 2, delay: 2.4 },
    { top: "58%", right: "6%", size: 3, delay: 0.8 },
    { bottom: "28%", left: "12%", size: 2, delay: 1.8 },
    { bottom: "18%", right: "15%", size: 2, delay: 3.2 },
    { top: "36%", left: "18%", size: 2, delay: 2.0 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((star, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.2, 1] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
            right: star.right,
            bottom: star.bottom,
            backgroundColor: "hsl(var(--accent))",
            boxShadow: "0 0 6px 1px hsl(var(--accent) / 0.55), 0 0 14px 2px hsl(var(--accent) / 0.25)",
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-28 lg:pt-32 overflow-hidden">
      <GlowingStars />
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-12 items-start">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="relative inline-block w-max mb-6 px-6 py-4">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-3"
              >
                Vikram Udhayakumar
              </motion.h2>




              <p className="text-sm font-medium tracking-widest uppercase">
                <span className="shimmer-text">Gen AI Developer</span>
              </p>
            </div>


            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mb-10">
              Building elegant
              <br />
              <span className="text-gradient">digital solutions</span>
            </h1>

            <StreamText
              as="p"
              start
              startDelayMs={400}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
              text="I craft performant, scalable systems with clean architecture and thoughtful design. Passionate about learning and building impactful software."
            />

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Button variant="hero" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View Projects
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get in Touch
              </Button>
              <button
                onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground hover:text-accent transition-colors"
                aria-label="Jump to skills section"
              >
                <BookOpen size={16} strokeWidth={2} />
                Resume
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-border/60 max-w-md">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com/vik77-git", tooltip: "You'll be redirected to Vikram's GitHub" },
                { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vikram-udhayakumar23/", tooltip: "You'll be redirected to Vikram's LinkedIn" },
              ].map(({ icon: Icon, label, href, tooltip }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">{tooltip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </motion.div>

          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pt-24 md:pt-10 pt-4 -translate-y-1"
          >
            <ProfilePhoto className="w-[240px] h-[240px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px]" />

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 md:mt-24 lg:mt-28 flex justify-center"
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown size={14} className="animate-bounce" />
            Scroll to explore
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
