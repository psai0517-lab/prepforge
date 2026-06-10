import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const stackCategories = [
  {
    category: "Frontend Framework",
    items: [
      { name: "Next.js", role: "App Router, SSR, layouts", priority: "Primary" },
      { name: "React 19", role: "Component architecture", priority: "Primary" },
      { name: "TypeScript", role: "Type safety across codebase", priority: "Primary" },
    ],
  },
  {
    category: "Styling & UI",
    items: [
      { name: "Tailwind CSS", role: "Utility-first styling", priority: "Primary" },
      { name: "shadcn/ui", role: "Accessible pre-built components", priority: "Primary" },
      { name: "Framer Motion", role: "Animations and transitions", priority: "Secondary" },
    ],
  },
  {
    category: "Data Visualization",
    items: [
      { name: "Recharts", role: "Radar charts, line graphs, progress", priority: "Primary" },
      { name: "D3.js", role: "Custom visualizations if needed", priority: "Optional" },
    ],
  },
  {
    category: "Interactive Features",
    items: [
      { name: "Monaco Editor", role: "Code editor for technical mocks", priority: "Primary" },
      { name: "Excalidraw / tldraw", role: "System design whiteboard", priority: "Primary" },
      { name: "Web Speech API", role: "Voice input for behavioral practice", priority: "Secondary" },
    ],
  },
  {
    category: "Backend & Integration",
    items: [
      { name: "Node.js / Express", role: "API bridge to local files", priority: "Primary" },
      { name: "Anthropic Claude API", role: "LLM for interview simulation", priority: "Primary" },
      { name: "Zustand", role: "Client state management", priority: "Primary" },
    ],
  },
  {
    category: "Data Persistence",
    items: [
      { name: "Local YAML/MD files", role: "Profile, tracker, story-bank", priority: "Primary" },
      { name: "IndexedDB", role: "Browser-side session cache", priority: "Secondary" },
      { name: "SQLite (optional)", role: "Structured query for history", priority: "Optional" },
    ],
  },
];

const priorityColors: Record<string, string> = {
  Primary: "bg-accent/10 text-accent border-accent/20",
  Secondary: "bg-primary/10 text-primary border-primary/20",
  Optional: "bg-muted text-muted-foreground border-border",
};

export function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 bg-muted/30 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-accent">
            06 — Tech Stack
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3">
            Recommended <span className="italic">Technologies</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            A modern React-based stack supporting rich interactivity and rapid development,
            chosen to complement PrepForge's existing Python/Markdown data architecture.
          </p>
        </motion.div>

        {/* Priority legend */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {["Primary", "Secondary", "Optional"].map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded border ${priorityColors[p]}`}>
                {p}
              </span>
            </div>
          ))}
        </div>

        {/* Stack grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stackCategories.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <Card className="h-full border border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {cat.category}
                  </h3>
                  <div className="space-y-2.5">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.role}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${priorityColors[item.priority]}`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Implementation notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="border-2 border-accent/20 bg-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground text-base mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Implementation Note
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The key architectural decision is maintaining PrepForge's existing file-based data model
                (<code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">data/profile.yml</code>,{" "}
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">data/tracker.md</code>) while
                wrapping it in a modern web interface. This means the backend API bridge reads and writes
                the same files that the CLI version uses — ensuring both interfaces stay in sync and
                users can switch between them freely.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
