import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import profileImage from "@/photos/profile.png";
import { projects } from "@/data/projects";

interface ProfilePhotoProps {
  className?: string;
}

type Frame = { kind: "photo" } | { kind: "project"; index: number };

const frames: Frame[] = [
  { kind: "photo" },
  ...projects.slice(0, 3).map((_, index) => ({ kind: "project" as const, index })),
];

const INTERVAL_MS = 4000;

export default function ProfilePhoto({ className }: ProfilePhotoProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % frames.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const frame = frames[step] ?? frames[0];
  const project = frame.kind === "project" ? projects[frame.index] : null;

  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="relative aspect-square w-full"
      >
        <div className="relative h-full w-full rounded-full overflow-hidden bg-secondary">
          <AnimatePresence mode="sync">
            <motion.div
              key={project ? project.slug : "photo"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={project ? project.thumbnail : profileImage}
                alt={project ? `${project.title} project screenshot` : "Vikram Udhayakumar - Gen AI Developer"}
                className={`h-full w-full object-cover object-center ${project ? "ken-burns" : ""}`}
                loading="eager"
                fetchPriority={project ? "auto" : "high"}
                decoding="async"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption chip pinned to the circle's lower edge */}
        <AnimatePresence>
          {project && (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10 max-w-[90%]"
            >
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="block truncate rounded-full border border-border/70 bg-background/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm hover:text-accent hover:border-accent/60 transition-colors"
              >
                {project.title}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated bars travelling around the photo */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-[calc(100%+1rem+0.6cm)] w-[calc(100%+1rem+0.6cm)] overflow-visible"
          style={{ inset: 'calc(-0.5rem - 0.3cm)' }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            pathLength="100"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="bar-spin-yellow profile-frame-bar-accent"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            pathLength="100"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="bar-spin-blue profile-frame-bar-contrast"
          />
        </svg>
      </motion.div>
    </div>
  );
}
