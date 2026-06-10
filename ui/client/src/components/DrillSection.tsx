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
  easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  hard: "text-rose-500 bg-rose-50 border-rose-200",
};

const VERDICT_CONFIG = {
  correct: {
    label: "Correct",
    icon: "✓",
    classes: "border-emerald-300 bg-emerald-50",
    labelClass: "text-emerald-700 bg-emerald-100 border-emerald-300",
  },
  partial: {
    label: "Partial",
    icon: "◑",
    classes: "border-amber-300 bg-amber-50",
    labelClass: "text-amber-700 bg-amber-100 border-amber-300",
  },
  incorrect: {
    label: "Needs Work",
    icon: "✗",
    classes: "border-rose-300 bg-rose-50",
    labelClass: "text-rose-600 bg-rose-100 border-rose-300",
  },
} as const;

type Verdict = keyof typeof VERDICT_CONFIG;

interface EvalResult {
  verdict: Verdict;
  feedback: string;
}

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
  const [userAnswer, setUserAnswer] = useState("");
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, partial: 0, incorrect: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState<Record<string, ScoreHistory>>(loadHistory);
  const [sessionDone, setSessionDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const qs = shuffle(getQuestions(activeDomain, activeDifficulty));
    setQueue(qs);
    setCurrentIdx(0);
    resetCard();
    setScore({ correct: 0, partial: 0, incorrect: 0 });
    setStreak(0);
    setSessionDone(false);
  }, [activeDomain, activeDifficulty]);

  // Focus textarea when card changes
  useEffect(() => {
    if (!evalResult && !sessionDone) {
      textareaRef.current?.focus();
    }
  }, [currentIdx, evalResult, sessionDone]);

  function resetCard() {
    setUserAnswer("");
    setEvalResult(null);
    setEvalError(null);
    setEvaluating(false);
  }

  const current = queue[currentIdx];
  const total = queue.length;
  const progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

  async function handleSubmit() {
    if (!userAnswer.trim() || !current) return;
    setEvaluating(true);
    setEvalError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: current.question,
          modelAnswer: current.answer,
          userAnswer: userAnswer.trim(),
        }),
      });

      if (!res.ok) throw new Error("API error");
      const result: EvalResult = await res.json();
      setEvalResult(result);
    } catch {
      setEvalError("Couldn't reach the evaluation server. Is the API server running?");
    } finally {
      setEvaluating(false);
    }
  }

  function handleNext(verdict: Verdict) {
    const isCorrect = verdict === "correct";
    const newStreak = isCorrect ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);

    setScore((prev) => ({
      ...prev,
      [verdict]: prev[verdict] + 1,
    }));
    setStreak(newStreak);
    setBestStreak(newBest);

    const next = currentIdx + 1;
    if (next >= total) {
      const key = `${activeDomain}:${activeDifficulty}`;
      const updated = {
        ...history,
        [key]: {
          domain: activeDomain,
          correct: score.correct + (isCorrect ? 1 : 0),
          total,
          lastPlayed: new Date().toLocaleDateString(),
        },
      };
      setHistory(updated);
      saveHistory(updated);
      setSessionDone(true);
    } else {
      setCurrentIdx(next);
      resetCard();
    }
  }

  function restart() {
    setQueue(shuffle(getQuestions(activeDomain, activeDifficulty)));
    setCurrentIdx(0);
    resetCard();
    setScore({ correct: 0, partial: 0, incorrect: 0 });
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
              {total} questions loaded. Write your answer — Claude evaluates it against the ICT5 bar.
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-xs font-mono text-muted-foreground mb-3">This session</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Correct</span>
                  <span className="font-medium text-emerald-600">{score.correct}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Partial</span>
                  <span className="font-medium text-amber-600">{score.partial}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Needs Work</span>
                  <span className="font-medium text-rose-500">{score.incorrect}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-medium text-amber-600">
                    {streak >= 3 ? `🔥 ${streak}` : streak}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best streak</span>
                  <span className="font-medium">{bestStreak}</span>
                </div>
              </div>
            </div>

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
                            {h.domain === "all"
                              ? "All"
                              : DOMAIN_META[h.domain as Domain]?.label ?? h.domain}
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

          {/* Main card */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {sessionDone ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-2 border-border">
                    <CardContent className="p-10 text-center">
                      <div className="text-5xl mb-4">
                        {score.correct / total >= 0.7 ? "🎯" : score.correct / total >= 0.4 ? "📈" : "💪"}
                      </div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">Session Complete</h3>
                      <p className="text-muted-foreground mb-8">
                        {score.correct} correct · {score.partial} partial · {score.incorrect} needs work
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={restart} className="bg-primary text-primary-foreground hover:opacity-90">
                          Drill Again
                        </Button>
                        <Button variant="outline" onClick={() => setActiveDomain("all")}>
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
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                          {currentIdx + 1}/{total}
                        </span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[current.difficulty]}`}>
                          {current.difficulty}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded border border-border bg-muted">
                          {DOMAIN_META[current.domain]?.label ?? current.domain}
                        </span>
                        {streak >= 3 && (
                          <span className="text-xs font-mono text-amber-600 ml-auto">🔥 {streak} streak</span>
                        )}
                      </div>

                      {/* Question */}
                      <div className="mb-5 space-y-2">
                        {current.question.split("\n").map((line, i) =>
                          i === 0 ? (
                            <h3 key={i} className="text-lg font-medium text-foreground leading-relaxed">
                              {line}
                            </h3>
                          ) : line.trim() ? (
                            <p key={i} className="text-sm font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded">
                              {line}
                            </p>
                          ) : null
                        )}
                      </div>

                      {/* Answer input */}
                      {!evalResult && (
                        <div className="space-y-3">
                          <textarea
                            ref={textareaRef}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
                            }}
                            disabled={evaluating}
                            placeholder="Write your answer here... (⌘↵ to submit)"
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors disabled:opacity-50"
                          />
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={handleSubmit}
                              disabled={!userAnswer.trim() || evaluating}
                              className="bg-primary text-primary-foreground hover:opacity-90"
                            >
                              {evaluating ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Evaluating...
                                </span>
                              ) : (
                                "Submit Answer"
                              )}
                            </Button>
                            <button
                              onClick={() => handleNext("incorrect")}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Skip →
                            </button>
                            {evalError && (
                              <p className="text-sm text-rose-500 ml-2">{evalError}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Evaluation result */}
                      <AnimatePresence>
                        {evalResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-4"
                          >
                            {/* User's answer */}
                            <div className="px-4 py-3 rounded-lg border border-border bg-muted/40">
                              <p className="text-xs font-mono text-muted-foreground mb-1">Your answer</p>
                              <p className="text-sm text-foreground whitespace-pre-wrap">{userAnswer}</p>
                            </div>

                            {/* Verdict */}
                            <div className={`px-4 py-4 rounded-lg border-2 ${VERDICT_CONFIG[evalResult.verdict].classes}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${VERDICT_CONFIG[evalResult.verdict].labelClass}`}>
                                  {VERDICT_CONFIG[evalResult.verdict].icon} {VERDICT_CONFIG[evalResult.verdict].label}
                                </span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">{evalResult.feedback}</p>
                            </div>

                            {/* Model answer */}
                            <div className="px-4 py-4 rounded-lg border border-border bg-card">
                              <p className="text-xs font-mono text-muted-foreground mb-2">Model answer</p>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                                {current.answer}
                              </p>
                            </div>

                            {/* Next actions */}
                            <div className="flex items-center gap-3 pt-1">
                              <Button
                                onClick={() => handleNext(evalResult.verdict)}
                                className="bg-primary text-primary-foreground hover:opacity-90"
                              >
                                Next Question →
                              </Button>
                              <button
                                onClick={resetCard}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Retry this question
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
