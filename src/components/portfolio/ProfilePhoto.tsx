import { motion } from "framer-motion";
import profileImage from "@/photos/profile.png";

interface ProfilePhotoProps {
  className?: string;
}

export default function ProfilePhoto({ className }: ProfilePhotoProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="relative aspect-square w-full"
      >
        <div className="relative h-full w-full rounded-full overflow-hidden">
          <img
            src={profileImage}
            alt="Vikram Udhayakumar - Gen AI Developer"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>

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
