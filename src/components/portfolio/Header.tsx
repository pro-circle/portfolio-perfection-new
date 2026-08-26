import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["About", "Education", "Experience", "Projects", "Skills", "Achievements", "Contact"];

const Header = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        const docEl = document.documentElement;
        const max = docEl.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        const sections = navItems.map((item) => item.toLowerCase());
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120) current = id;
          }
        }
        setActiveSection(current);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
  }, [isDark]);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-12 h-16">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-display text-lg font-semibold tracking-tight text-foreground hover:scale-105 transition-transform duration-200">
          Portfolio
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="relative text-base font-medium transition-all duration-200 py-1 group"
            >
              <span className={`transition-all duration-200 ${
                activeSection === item.toLowerCase()
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground group-hover:translate-y-[-1px]"
              }`}>
                {item}
              </span>
              {activeSection === item.toLowerCase() && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full shadow-[0_0_8px_hsl(var(--accent)/0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary hover:rotate-180 transition-all duration-500"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="h-0.5 w-full bg-transparent overflow-hidden">
        <div
          className="h-full w-full bg-[hsl(48,96%,53%)] shadow-[0_0_8px_hsl(48,96%,53%,0.6)] origin-left"
          style={{ transform: `scaleX(${scrollProgress})`, willChange: "transform" }}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`text-sm font-medium transition-all duration-200 text-left flex items-center gap-2 hover:translate-x-1 ${
                    activeSection === item.toLowerCase()
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeSection === item.toLowerCase() && (
                    <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_hsl(var(--accent)/0.5)]" />
                  )}
                  {item}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
