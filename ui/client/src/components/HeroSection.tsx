import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      
      {/* Hero background gradient */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="inline-block font-mono text-xs tracking-widest uppercase text-accent mb-4 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              Interactive UI Specification
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6"
          >
            <span className="italic">PrepForge</span>{" "}
            <span className="text-muted-foreground font-sans text-4xl sm:text-5xl lg:text-6xl font-light">
              UI Guide
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A comprehensive design specification for transforming PrepForge from a CLI-based
            interview preparation tool into a modern, interactive web application.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-all duration-150 active:scale-[0.97] shadow-md"
            >
              Explore the Blueprint
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#tech-stack"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-md font-medium text-sm hover:bg-muted transition-all duration-150 active:scale-[0.97]"
            >
              View Tech Stack
            </a>
          </motion.div>
        </div>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: "UI Sections", value: "5" },
            { label: "Interactive Modes", value: "8" },
            { label: "Companies", value: "4" },
            { label: "Design Patterns", value: "12+" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border"
            >
              <div className="font-serif text-2xl text-foreground italic">{stat.value}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
