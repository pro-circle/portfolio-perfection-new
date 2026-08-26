import { Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";

/**
 * Small circular project thumbnails that travel along a wide curve around the
 * profile frame: they appear at the bottom of the photo, glide out toward the
 * top-right, hold, then fade and repeat. The photo itself never moves and the
 * medallions never spin on their own axis.
 */

const DURATION_S = 9;
const medallions = projects.slice(0, 4);

export default function OrbitMedallions() {
  return (
    <div className="orbit-layer" aria-label="Featured projects">
      {medallions.map((p, i) => (
        <div
          key={p.slug}
          className="orbit-arm"
          style={{ animationDelay: `${(i * DURATION_S) / medallions.length}s` }}
        >
          <div
            className="orbit-medallion"
            style={{ animationDelay: `${(i * DURATION_S) / medallions.length}s` }}
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
          </div>
        </div>
      ))}
    </div>
  );
}
