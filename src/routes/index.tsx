import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/portfolio/Header";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Education from "@/components/portfolio/Education";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Achievements from "@/components/portfolio/Achievements";
import Gallery from "@/components/portfolio/Gallery";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vikram Udhayakumar" },
      { name: "description", content: "Personal portfolio website" },
      { property: "og:title", content: "Vikram Udhayakumar" },
      { property: "og:description", content: "Personal portfolio website" },
    ],
  }),
  component: Index,
});

function Index() {
  // Restore the section the visitor came back to (e.g. /projects/$slug -> /#projects).
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "auto" });
        return;
      }
      if (tries++ < 20) requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <div className="relative min-h-screen">
      <Header />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
