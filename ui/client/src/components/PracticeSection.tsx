import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Split-Screen Layout",
    description: "Left pane displays the interviewer's prompt, current question, and visual timer. Right pane is the candidate's workspace for coding or responding.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    title: "Code Editor Integration",
    description: "Monaco Editor with syntax highlighting for technical mocks, allowing candidates to write actual code rather than just explaining solutions in text.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Voice Integration",
    description: "Web Speech API for speech-to-text input, allowing candidates to speak their answers naturally. Dramatically increases realism of behavioral and mock interviews.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Company Persona Indicator",
    description: "Visual indicator showing which company persona the AI interviewer is adopting — Apple's terse style, Netflix's open-ended approach, or Amazon's LP-focused format.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Scoring",
    description: "Live scoring indicators that track whether the candidate asks clarifying questions, names tradeoffs, raises edge cases, and communicates clearly under pressure.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Session Timer",
    description: "Visual countdown timer matching real interview durations (45 min for mock, 45 min for system design). Includes per-question time tracking for post-session analysis.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function PracticeSection() {
  return (
    <section id="practice" className="py-20 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Right column - section header (reversed for visual variety) */}
          <div className="lg:col-span-5 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                  03 — Practice Interface
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
                  Mock & Behavioral <span className="italic">Sessions</span>
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  The current terminal interface requires users to read text and type responses.
                  A web UI can make this feel much more like a real interview with split-screen
                  layouts, code editors, and voice integration.
                </p>

                {/* Practice interface mockup */}
                <div className="mt-6 rounded-lg overflow-hidden border border-border shadow-sm">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663489379363/aoaSqExMPNHViFhDQ4c4fJ/section-practice-kxzpReRSf5wCK5ndPNRdrk.webp"
                    alt="Split-screen practice interface with interviewer chat and code editor"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Left column - feature cards */}
          <div className="lg:col-span-7 lg:order-1">
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Card className="h-full border border-border hover:border-accent/30 transition-all duration-200 hover:shadow-sm group">
                    <CardContent className="p-5">
                      <div className="w-9 h-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3 group-hover:bg-accent/15 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1.5">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
