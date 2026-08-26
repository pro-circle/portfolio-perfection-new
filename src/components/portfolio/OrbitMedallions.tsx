import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";

/**
 * Small circular project thumbnails that travel along a wide curve around the
 * profile frame: they appear at the bottom of the photo, glide clockwise-out
 * toward the top-right, pause, then fade. The photo itself never moves and the
 * medallions never spin on their own axis.
 */

const START_ANGLE = 180; // bottom of the frame
const END_ANGLE = 40; // top-right of the frame
const DURATION = 9;

const medallions = projects.slice(0, 4);

export default function OrbitMedallions() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden={false} className="orbit-layer">
      {medallions.map((p, i) => {
        const delay = i * (DURATION / medallions.length);
        return (
          <motion.div
            key={p.slug}
            className="orbit-arm"
            initial={{ rotate: START_ANGLE }}
            animate={{ rotate: [START_ANGLE, START_ANGLE, END_ANGLE, END_ANGLE] }}
            transition={{
              duration: DURATION,
              times: [0, 0.1, 0.72, 1],
              ease: [0.33, 0, 0.2, 1],
              repeat: Infinity,
              delay,
            }}
          >
            <motion.div
              className="orbit-medallion"
              animate={{
                rotate: [-START_ANGLE, -START_ANGLE, -END_ANGLE, -END_ANGLE],
                opacity: [0, 1, 1, 0],
                scale: [0.82, 1, 1, 0.9],
              }}
              transition={{
                duration: DURATION,
                times: [0, 0.1, 0.72, 1],
                ease: [0.33, 0, 0.2, 1],
                repeat: Infinity,
                delay,
              }}
            >
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                preload="intent"
                title={p.title}
                className="orbit-medallion__link"
              >
                <img src={p.thumbnail} alt={p.title} loading="lazy" draggable={false} />
              </Link>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
