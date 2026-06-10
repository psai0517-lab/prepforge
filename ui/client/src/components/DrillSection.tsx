import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type Difficulty,
  type Domain,
  type Question,
  DOMAIN_META,
  getQuestions,
  shuffle,
} from "@/data/questions";

const DOMAINS: { value: Domain | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sql", label: "SQL" },
  { value: "spark", label: "Spark" },
  { value: "kafka", label: "Kafka" },
  { value: "dsa", label: "DSA" },
  { value: "data-modeling", label: "Data Modeling" },
];

const DIFFICULTIES: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "text-emerald-500 bg-emerald-50 border-emerald-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  hard: "text-rose-500 bg-rose-50 border-rose-200",
};

const STORAGE_KEY = "prepforge_drill_scores";

interface ScoreHistory {
  domain: string;
  correct: number;
  total: number;
  lastPlayed: string;
}

function loadHistory(): Record<string, ScoreHistory> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveHistory(history: Record<string, ScoreHistory>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function DrillSection() {
  const [activeDomain, setActiveDomain] = useState<Domain | "all">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "all">("all");
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState<Record<string, ScoreHistory>>(loadHistory);
  const [sessionDone, setSessionDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Rebuild queue whenever domain/difficulty changes
  useEffect(() => {
    const qs = shuffle(getQuestions(activeDomain, activeDifficulty));
    setQueue(qs);
    setCurrentIdx(0);
    setRevealed(false);
    setScore({ correct: 0, incorrect: 0 });
    setStreak(0);
    setSessionDone(false);
  }, [activeDomain, activeDifficulty]);

  const current = queue[currentIdx];
  const total = queue.length;
  const progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

  function handleReveal() {
    setRevealed(true);
  }

  function handleAnswer(correct: boolean) {
    const newCorrect = score.correct + (correct ? 1 : 0);
    const newIncorrect = score.incorrect + (correct ? 0 : 1);
    const newStreak = correct ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);

    setScore({ correct: newCorrect, incorrect: newIncorrect });
    setStreak(newStreak);
    setBestStreak(newBest);
    setRevealed(false);

    const next = currentIdx + 1;
    if (next >= total) {
      // Session complete — persist
      const key = `${activeDomain}:${activeDifficulty}`;
      const updated = {
        ...history,
        [key]: {
          domain: activeDomain,
          correct: newCorrect,
          total,
          lastPlayed: new Date().toLocaleDateString(),
        },
      };
      setHistory(updated);
      saveHistory(updated);
      setSessionDone(true);
    } else {
      setCurrentIdx(next);
    }
  }

  function restart() {
    const qs = shuffle(getQuestions(activeDomain, activeDifficulty));
    setQueue(qs);
    setCurrentIdx(0);
    setRevealed(false);
    setScore({ correct: 0, incorrect: 0 });
    setStreak(0);
    setSessionDone(false);
  }

  return (
    <section id="drills" className="py-20 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-xs tracking-widest uppercase text-accent">
              05 — Rapid-Fire Drills
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
              Practice <span className="italic">Questions</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              {total} questions loaded. Reveal the answer, grade yourself, and track your streak.
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Domain tabs */}
          <div className="flex flex-wrap gap-1.5">
            {DOMAINS.map((d) => (
              <button
                key={d.value}
                onClick={() => setActiveDomain(d.value as Domain | "all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 border ${
                  activeDomain === d.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px bg-border self-stretch" />

          {/* Difficulty tabs */}
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setActiveDifficulty(d.value as Difficulty | "all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 border ${
                  activeDifficulty === d.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left — stats sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Current session */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs font-mono text-muted-foreground mb-3">This session</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Correct</span>
                  <span className="font-medium text-emerald-600">{score.correct}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Missed</span>
                  <span className="font-medium text-rose-500">{score.incorrect}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-medium text-amber-600">
                    {streak > 0 ? `🔥 ${streak}` : streak}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best streak</span>
                  <span className="font-medium">{bestStreak}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{currentIdx}/{total}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Past sessions */}
            {Object.keys(history).length > 0 && (
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs font-mono text-muted-foreground mb-3">Past sessions</p>
                <div className="space-y-2">
                  {Object.entries(history)
                    .slice(-4)
                    .reverse()
                    .map(([key, h]) => (
                      <div key={key} className="text-xs">
                        <div className="flex justify-between">
                          <span className="text-foreground font-medium">
                            {h.domain === "all" ? "All" : DOMAIN_META[h.domain as Domain]?.label ?? h.domain}
                          </span>
                          <span className="text-muted-foreground">
                            {h.correct}/{h.total}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{h.lastPlayed}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — flashcard */}
          <div className="lg:col-span-9" ref={cardRef}>
            <AnimatePresence mode="wait">
              {sessionDone ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-border">
                    <CardContent className="p-10 text-center">
                      <div className="text-5xl mb-4">
                        {score.correct / total >= 0.8 ? "🎯" : score.correct / total >= 0.5 ? "📈" : "💪"}
                      </div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">
                        Session Complete
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {score.correct} correct out of {total} — {Math.round((score.correct / total) * 100)}%
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center text-sm mb-8">
                        <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span className="text-emerald-700 font-medium">{score.correct} correct</span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-rose-50 border border-rose-200">
                          <span className="text-rose-600 font-medium">{score.incorrect} missed</span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                          <span className="text-amber-700 font-medium">Best streak: {bestStreak}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={restart} className="bg-primary text-primary-foreground hover:opacity-90">
                          Drill Again
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveDomain("all")}
                        >
                          Switch Domain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : !current ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64"
                >
                  <p className="text-muted-foreground">No questions match this filter.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-2 border-border overflow-hidden">
                    <CardContent className="p-8">
                      {/* Meta row */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                          {currentIdx + 1}/{total}
                        </span>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[current.difficulty]}`}
                        >
                          {current.difficulty}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded border border-border bg-muted">
                          {DOMAIN_META[current.domain]?.label ?? current.domain}
                        </span>
                        {streak >= 3 && (
                          <span className="text-xs font-mono text-amber-600 ml-auto">
                            🔥 {streak} streak
                          </span>
                        )}
                      </div>

                      {/* Question */}
                      <h3 className="text-lg font-medium text-foreground leading-relaxed mb-6">
                        {current.question}
                      </h3>

                      {/* Answer */}
                      <AnimatePresence>
                        {revealed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mb-6 overflow-hidden"
                          >
                            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line font-mono">
                                {current.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

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
                              className="border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Got it
                            </Button>
                            <Button
                              onClick={() => handleAnswer(false)}
                              variant="outline"
                              className="border-rose-400 text-rose-600 hover:bg-rose-50"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Missed it
                            </Button>
                            <Button
                              variant="ghost"
                              className="ml-auto text-muted-foreground text-sm"
                              onClick={() => handleAnswer(false)}
                            >
                              Skip →
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
