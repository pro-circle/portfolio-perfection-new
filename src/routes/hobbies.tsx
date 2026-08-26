import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LoadingImage from "@/components/portfolio/LoadingImage";
import ThemeToggle from "@/components/portfolio/ThemeToggle";
import { blockSectionGenerationOnce } from "@/hooks/use-section-generating";

export const Route = createFileRoute("/hobbies")({
  head: () => ({
    meta: [
      { title: "Blogs & Certificates" },
      { name: "description", content: "A look at my blogs and the certificates I've earned." },
    ],
  }),
  component: HobbiesPage,
});

type Item = { title: string; description: string; image: string; year: string };

const items: Item[] = [
  {
    title: "Learning Track",
    description:
      "Contributing to developer tools and writing small code blocks. It keeps me sharp and connected with the wider engineering community.",
    image: "/images/blog/hack-blog.png",
    year: "2026",
  },
  {
    title: "Live Workshop",
    description:
      "Long-form tools, suitability, specification and needs. A lot, but with clear identification and the usage flows",
    image: "/images/blog/blog-uptor.png",
    year: "2025",
  },
  {
    title: "AI Workshop",
    description:
      "A workshop focused on how to use AI to earn and increase earnings. Earning not only means money, but also fame, time and interest",
    image: "/images/blog/gateway-blog.png",
    year: "2025",
  },
  {
    title: "Personalization in Data Science",
    description:
      "Hands-on certification covering modern tech stacks, SDKs, REST APIs, and production-grade deployment workflows.",
    image: "/images/blog/ksr-blog.png",
    year: "2025",
  },
];

function HobbiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      <div className="max-w-6xl mx-auto section-padding">
        <Link
          to="/"
          hash="hobbies"
          onClick={() => blockSectionGenerationOnce("hobbies")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          Blogs and Certs
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mb-16">
          Recently I did something...
        </p>

        <div className="space-y-20 md:space-y-28">
          {items.map((item, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="group/img relative rounded-2xl overflow-hidden bg-secondary aspect-[4/3] border border-border">
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground font-display text-sm font-semibold border border-border">
                    {item.year}
                  </span>
                  <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.18]">
                    <LoadingImage src={item.image} alt={item.title} rounded="rounded-2xl" />
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Link
        to="/"
        hash="hobbies"
        onClick={() => blockSectionGenerationOnce("hobbies")}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium text-xs shadow-md hover:scale-105 transition-transform"
        aria-label="Back to Blogs"
      >
        <ArrowLeft size={12} /> Back to Blogs
      </Link>
    </div>
  );
}
