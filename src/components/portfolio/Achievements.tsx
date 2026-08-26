import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Linkedin } from "lucide-react";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import LoadingImage from "./LoadingImage";

// `postUrl` points to the LinkedIn post for each achievement.
const achievementsData = [
  {
    title: "Google Developers Achievements",
    description: "Submitted an innovative project proposal on Secure Voting System",
    details: "Co-authored a research paper titled 'Optimizing Neural Network Inference Using Adaptive Pruning Strategies' published in IEEE International Conference. The paper proposed a novel pruning algorithm that reduced model size by 40% with minimal accuracy loss.",
    image: "/images/achievement/genai_ach.png",
    date: "January 2025",
    postUrl: "https://www.linkedin.com/in/vikram-udhayakumar/recent-activity/all/",
  },
  {
    title: "Best Paper Award",
    description: "Won the best paper award for presenting research paper in a confrence among 100+ teams.",
    details: "Led a team of 4 to build an AI-powered accessibility tool in 36 hours. The solution utilized computer vision and NLP to assist visually impaired users. Competed against 500+ teams from across the country.",
    image: "/images/achievement/karpagam_paper.jpeg",
    date: "March 2025",
    postUrl: "https://www.linkedin.com/in/vikram-udhayakumar/recent-activity/all/",
  },
  {
    title: "Google GenAI Achievement",
    description: "Completed tracks on AI effectively and received the official certification.",
    details: "Contributed 50+ pull requests to a widely-used open-source developer toolkit. Implemented key features including a plugin system and CLI improvements. The project has over 1000 stars on GitHub.",
    image: "/images/achievement/Hack2skill-AIML.png",
    date: "2024",
    postUrl: "https://www.linkedin.com/in/vikram-udhayakumar/recent-activity/all/",
  },
];

const CARD_WIDTH = 660;
const GAP = 24;
const ITEM_TOTAL = CARD_WIDTH + GAP;
const SPEED = 120;
const COMPACT_HEIGHT = 260;


const Achievements = () => {
  const [offset, setOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const totalWidth = achievementsData.length * ITEM_TOTAL;
  const { ref: sectionRef, phase } = useSectionGenerating<HTMLElement>({ sectionId: "achievements" });



  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (!isPausedRef.current) {
      setOffset((prev) => {
        const next = prev + (SPEED * delta) / 1000;
        return next >= totalWidth ? next - totalWidth : next;
      });
    }
    animRef.current = requestAnimationFrame(animate);
  }, [totalWidth]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Measure the expanded list so we can animate the container height precisely.
  useLayoutEffect(() => {
    if (!expandedRef.current) return;
    const measure = () => {
      if (expandedRef.current) setExpandedHeight(expandedRef.current.scrollHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(expandedRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const isHoveredRef = useRef(false);

  const handleEnter = () => {
    isHoveredRef.current = true;
    isPausedRef.current = true;
    setIsExpanded(true);
  };
  const handleLeave = () => {
    isHoveredRef.current = false;
    // Keep expanded; collapse only when user scrolls up while cursor is out.
  };

  // Collapse the expanded stack when the user scrolls up AND cursor is not on the stack.
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (isExpanded && y < lastY && !isHoveredRef.current) {
        isPausedRef.current = false;
        setIsExpanded(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isExpanded]);

  const renderCards = () => {
    const items: { achievement: (typeof achievementsData)[0]; origIndex: number; position: number }[] = [];
    for (let set = -1; set <= 2; set++) {
      achievementsData.forEach((a, i) => {
        items.push({
          achievement: a,
          origIndex: i,
          position: set * totalWidth + i * ITEM_TOTAL - offset,
        });
      });
    }
    return items;
  };

  return (
    <section id="achievements" ref={sectionRef} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 mb-10">
            <div>
              <SectionLabel label="Achievements" phase={phase} />
            </div>
            <div />
          </div>
        </motion.div>

        <div className="stream-reveal" data-ready={phase === "ready"}>
          <div className="mt-20 flex flex-col items-center justify-center" data-ai-anchor="marquee-stack-gap">
            <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider mb-6 text-center">
              Some are these and counting...
            </p>
            <div
              className="relative w-full max-w-6xl mx-auto"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {/* Single height-animated wrapper — no gap, no wobble */}
              <div
                className="relative w-full overflow-hidden [clip-path:inset(0_0_0_-150px)] transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  height: isExpanded
                    ? `${expandedHeight || COMPACT_HEIGHT}px`
                    : `${COMPACT_HEIGHT}px`,
                }}
              >

                {/* Compact marquee — cross-fades out */}
                <div
                  className={`absolute inset-x-0 top-0 transition-opacity duration-500 ease-out ${
                    isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="relative w-full h-[260px] rounded-xl border border-white/25 bg-card overflow-visible">
                    <div className="relative w-full h-full overflow-visible">
                      {renderCards().map(({ achievement, position }, i) => (
                        <div
                          key={`stack-marquee-${achievement.title}-${i}`}
                          className="absolute top-0 h-full flex items-center group/card hover:z-20"
                          style={{
                            transform: `translateX(${position}px)`,
                            width: `${CARD_WIDTH}px`,
                            willChange: "transform",
                          }}
                        >
                          <a
                            href={achievement.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View LinkedIn post: ${achievement.title}`}
                            className="relative mx-3 flex h-[180px] w-full rounded-lg border-l-2 border-l-accent border-y border-border border-r-2 border-r-accent bg-background overflow-visible transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:shadow-2xl"
                          >
                            <div className="relative w-[260px] h-full flex-shrink-0 rounded-l-lg overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-left group-hover/card:scale-[1.35] group-hover/card:-translate-y-[64px] group-hover/card:rounded-lg group-hover/card:shadow-2xl group-hover/card:z-10">
                              <LoadingImage src={achievement.image} alt={achievement.title} rounded="rounded-none" />
                              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/35 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white/85 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/card:opacity-100">
                                <Linkedin size={9} />
                                View Post
                              </span>
                            </div>

                            <div className="flex flex-col justify-center px-5 flex-1 min-w-0">
                              <h4 className="font-display text-lg md:text-xl font-bold text-foreground truncate leading-tight">
                                {achievement.title}
                              </h4>
                              <p className="text-[11px] font-medium uppercase tracking-wider text-accent mt-1">
                                {achievement.date}
                              </p>
                            </div>

                            <span className="pointer-events-none absolute top-2 right-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0A66C2] text-white opacity-0 scale-90 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:scale-100">
                              <Linkedin size={15} />
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Expanded cards — staggered split, with padding to avoid hover-zoom clipping */}
                <div
                  ref={expandedRef}
                  className={`absolute inset-x-0 top-0 transition-opacity duration-300 ease-out ${
                    isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-12 py-12">
                    <div className="flex flex-col gap-8">
                      {achievementsData.map((achievement, idx) => (
                        <motion.div
                          key={achievement.title}
                          initial={false}
                          animate={
                            isExpanded
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: -16 }
                          }
                          transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                            delay: isExpanded ? 0.1 + idx * 0.12 : (achievementsData.length - 1 - idx) * 0.06,
                          }}
                          className="group/card relative w-full rounded-xl border-2 border-border bg-card overflow-visible hover:bg-white/10 hover:border-white/30 hover:shadow-2xl transition-[box-shadow,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        >
                          <a
                            href={achievement.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View LinkedIn post: ${achievement.title}`}
                            className="absolute inset-0 z-30 rounded-xl"
                          />
                          <span className="pointer-events-none absolute top-3 right-3 z-40 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white opacity-0 scale-90 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:scale-100">
                            <Linkedin size={16} />
                          </span>
                          <div className="flex flex-col md:flex-row h-auto min-h-[240px] md:min-h-[182px]">
                            <div className="relative w-full h-[220px] md:w-[260px] md:h-[182px] flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-left md:origin-right group-hover/card:scale-[1.2] group-hover/card:rounded-xl group-hover/card:shadow-2xl group-hover/card:z-10">
                              <LoadingImage src={achievement.image} alt={achievement.title} rounded="rounded-none" />
                              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/35 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/85 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/card:opacity-100">
                                <Linkedin size={10} />
                                View Post
                              </span>
                            </div>




                            <div className="p-5 md:p-6 flex flex-col justify-between flex-1 min-w-0">
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Trophy size={18} className="text-accent shrink-0" />
                                    <h4 className="font-display text-lg font-bold text-foreground leading-tight">
                                      {achievement.title}
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Achievements;
