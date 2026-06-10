import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const architectureLayers = [
  {
    title: "Frontend (React + Next.js)",
    description: "Modern React-based UI with server-side rendering, Tailwind CSS styling, and shadcn/ui components for accessible, pre-built interactions.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tech: ["React 19", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "State Management",
    description: "Zustand or React Context for managing session states during active interviews, with file-based persistence for long-term progress tracking.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    tech: ["Zustand", "React Context", "Local Storage", "File API"],
  },
  {
    title: "Backend / API Bridge",
    description: "A local Node.js or Python server extending session_manager.py to read/write local markdown and YAML files, bridging CLI data with the web UI.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
      </svg>
    ),
    tech: ["Node.js / Express", "Python FastAPI", "YAML Parser", "Markdown"],
  },
  {
    title: "LLM Integration",
    description: "Direct integration with the Anthropic API (Claude) in the backend to handle conversational aspects, replacing the need for the Claude Code CLI environment.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    tech: ["Anthropic Claude API", "Streaming Responses", "Persona Engine"],
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 relative">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left column - section header */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                  01 — Architecture
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
                  From CLI to <span className="italic">Web App</span>
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  PrepForge currently relies on local files and the Claude Code CLI. Building a UI
                  requires bridging the gap between local file management and a graphical interface.
                </p>
                <div className="mt-6 p-4 border border-border rounded-lg bg-card">
                  <p className="text-xs font-mono text-muted-foreground mb-2">Current Flow:</p>
                  <code className="text-sm text-foreground font-mono">
                    /prep mock spark-internals apple
                  </code>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Transforms into interactive web interface
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right column - architecture cards */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {architectureLayers.map((layer, index) => (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Card className="border border-border hover:border-accent/30 transition-colors duration-200 hover:shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                          {layer.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-base">{layer.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {layer.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {layer.tech.map((t) => (
                              <span
                                key={t}
                                className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Architecture diagram image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 rounded-lg overflow-hidden border border-border shadow-sm"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663489379363/aoaSqExMPNHViFhDQ4c4fJ/section-architecture-jt9ms6vpx8iK8dBYzpz4NM.webp"
                alt="Architecture diagram showing React frontend, Node.js backend, file storage, and AI/LLM integration"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
