import { motion } from "framer-motion";

const sections = [
  {
    title: "Sections",
    links: [
      { label: "Architecture", href: "#architecture" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Practice Interface", href: "#practice" },
      { label: "System Design", href: "#system-design" },
      { label: "Drills", href: "#drills" },
      { label: "Tech Stack", href: "#tech-stack" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub Repository", href: "https://github.com/psai0517-lab/prepforge" },
      { label: "Claude Code Docs", href: "https://docs.anthropic.com" },
      { label: "shadcn/ui", href: "https://ui.shadcn.com" },
      { label: "Excalidraw", href: "https://excalidraw.com" },
    ],
  },
  {
    title: "PrepForge Modes",
    links: [
      { label: "/prep plan", href: "#architecture" },
      { label: "/prep mock", href: "#practice" },
      { label: "/prep system-design", href: "#system-design" },
      { label: "/prep drill", href: "#drills" },
      { label: "/prep behavioral", href: "#practice" },
      { label: "/prep debrief", href: "#dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card relative">
      <div className="absolute inset-0 blueprint-grid opacity-10" />

      <div className="container relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-mono text-sm font-bold">PF</span>
              </div>
              <span className="font-serif text-xl text-foreground italic">PrepForge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered interview preparation. From CLI to interactive web application — this guide
              documents the complete UI specification.
            </p>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-150"
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            PrepForge UI Guide — A design specification for the PrepForge team
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Built with React + Tailwind + Recharts
          </p>
        </div>
      </div>
    </footer>
  );
}
