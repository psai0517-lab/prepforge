import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const canvasFeatures = [
  {
    title: "Whiteboard Integration",
    description: "Embed a diagramming tool like Excalidraw or tldraw directly into the UI for freeform architecture sketching.",
  },
  {
    title: "Component Drag-and-Drop",
    description: "Pre-built architecture components (Load Balancers, Databases, Caches, Message Queues, CDNs) that users can drag onto the canvas.",
  },
  {
    title: "Visual Feedback Loop",
    description: "The UI serializes the canvas state as JSON and passes it to the LLM for real-time critique of the visual architecture.",
  },
  {
    title: "Phase-Based Scoring",
    description: "Visual rubric showing scores across Requirements, High-Level Design, Deep Dive, Scale, and Communication dimensions.",
  },
];

const rubricDimensions = [
  { dimension: "Requirements", score5: "Identified all critical constraints proactively", score1: "Jumped to solution immediately" },
  { dimension: "Breadth", score5: "Covered all major components coherently", score1: "Incomplete high-level design" },
  { dimension: "Depth", score5: "Production-grade knowledge of at least one component", score1: "Surface-level throughout" },
  { dimension: "Tradeoffs", score5: "Named specific tradeoffs with real consequences", score1: "No tradeoffs mentioned" },
  { dimension: "Scale", score5: "Quantified bottlenecks and specific mitigation", score1: "Didn't consider scale" },
];

export function SystemDesignSection() {
  return (
    <section id="system-design" className="py-20 bg-muted/30 relative">
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
            04 — System Design Canvas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3">
            Interactive <span className="italic">Whiteboard</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            System design interviews are inherently visual. Text-based system design is a
            significant limitation of the current CLI. The web UI introduces a full interactive canvas.
          </p>
        </motion.div>

        {/* System design canvas image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 rounded-lg overflow-hidden border border-border shadow-md"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663489379363/aoaSqExMPNHViFhDQ4c4fJ/section-system-design-V9TV7cgbagbBU2u8rdYtps.webp"
            alt="System design canvas with drag-and-drop components and architecture diagram"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {canvasFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
            >
              <Card className="h-full border border-border hover:border-accent/30 transition-colors duration-200">
                <CardContent className="p-5">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-mono font-bold mb-3">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scoring rubric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-primary/5 border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Scoring Rubric — System Design</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Visual rubric displayed after each session, scored 1-5 per dimension
              </p>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-foreground w-32">Dimension</th>
                      <th className="text-left px-4 py-3 font-medium text-accent">5 — Strong</th>
                      <th className="text-left px-4 py-3 font-medium text-destructive">1 — Weak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubricDimensions.map((row, i) => (
                      <tr key={row.dimension} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                        <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{row.dimension}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{row.score5}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{row.score1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
