import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleQuestions = [
  {
    question: "What happens when a Kafka consumer falls behind the log retention window?",
    answer: "The consumer loses messages permanently. Once data passes the retention period, it's deleted from the log. The consumer will receive an OffsetOutOfRangeException and must reset its offset to either 'earliest' (available) or 'latest'.",
    domain: "kafka",
  },
  {
    question: "Explain the difference between a narrow and wide transformation in Spark.",
    answer: "Narrow transformations (map, filter) process data within a single partition — no shuffle needed. Wide transformations (groupByKey, join) require data movement across partitions — triggering an expensive shuffle stage.",
    domain: "spark-internals",
  },
  {
    question: "What is the CAP theorem? Which two properties does Kafka prioritize?",
    answer: "CAP states a distributed system can guarantee at most 2 of: Consistency, Availability, Partition tolerance. Kafka prioritizes CP (Consistency + Partition tolerance) — during a network partition, Kafka chooses consistency over availability by not accepting writes to under-replicated partitions.",
    domain: "distributed-systems",
  },
];

const domains = [
  { name: "kafka", label: "Kafka", count: 12 },
  { name: "spark-internals", label: "Spark Internals", count: 15 },
  { name: "distributed-systems", label: "Distributed Systems", count: 10 },
  { name: "sql", label: "SQL", count: 8 },
  { name: "data-modeling", label: "Data Modeling", count: 9 },
  { name: "python-ds-algo", label: "Python DS&A", count: 14 },
];

export function DrillSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const handleReveal = () => setRevealed(true);

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    setRevealed(false);
    setCurrentQ((prev) => (prev + 1) % sampleQuestions.length);
  };

  const current = sampleQuestions[currentQ];

  return (
    <section id="drills" className="py-20 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left - description */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                  05 — Rapid-Fire Drills
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
                  Gamified <span className="italic">Flashcards</span>
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  The drill mode is currently text-based. A web UI transforms it into an engaging,
                  gamified experience with instant visual feedback, streak counters, and progress tracking.
                </p>

                {/* Domain list */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-mono text-muted-foreground mb-3">Available Domains:</p>
                  {domains.map((domain) => (
                    <div
                      key={domain.name}
                      className="flex items-center justify-between px-3 py-2 rounded-md border border-border bg-card hover:border-accent/30 transition-colors"
                    >
                      <span className="text-sm text-foreground">{domain.label}</span>
                      <span className="text-xs font-mono text-muted-foreground">{domain.count} Qs</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right - interactive demo */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">Live Demo</span>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {current.domain}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {score.correct} correct
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    {score.incorrect} missed
                  </span>
                </div>
              </div>

              {/* Flashcard */}
              <Card className="border-2 border-border overflow-hidden">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQ + (revealed ? "-revealed" : "")}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Question */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                            Q{currentQ + 1}/{sampleQuestions.length}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-foreground leading-relaxed">
                          {current.question}
                        </h3>
                      </div>

                      {/* Answer (revealed) */}
                      {revealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                            <p className="text-sm text-foreground leading-relaxed">
                              {current.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {!revealed ? (
                          <Button
                            onClick={handleReveal}
                            className="bg-primary text-primary-foreground hover:opacity-90"
                          >
                            Reveal Answer
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleAnswer(true)}
                              variant="outline"
                              className="border-accent text-accent hover:bg-accent/10"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Got it
                            </Button>
                            <Button
                              onClick={() => handleAnswer(false)}
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Missed it
                            </Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Gamification elements description */}
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Streak Counter", desc: "Track consecutive correct answers" },
                  { label: "Spaced Repetition", desc: "Missed items resurface in 48h" },
                  { label: "Progress Bars", desc: "Domain mastery visualization" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg border border-border bg-card">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
